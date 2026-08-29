import express from 'express';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(
  fileURLToPath(import.meta.url)
);

const distDir = path.join(
  __dirname,
  '..',
  'dist'
);

const port = process.env.PORT || 4000;

const app = express();

/*
 * --------------------------------------------------
 * CORS
 * --------------------------------------------------
 */

app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin',
    'http://localhost:5173'
  );

  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );

  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS'
  );

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

/*
 * --------------------------------------------------
 * JSON body parser
 * --------------------------------------------------
 */

app.use(
  express.json({
    limit: '256kb',
  })
);

/*
 * --------------------------------------------------
 * Supported languages
 * --------------------------------------------------
 */

const SUPPORTED_LANGUAGES = [
  'python3.10',
  'python3.8-ml',
  'python3.9',
  'c',
  'cpp',
  'java',
];

/*
 * --------------------------------------------------
 * Health
 * --------------------------------------------------
 */

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'code-cracker-server',
  });
});

/*
 * --------------------------------------------------
 * Python runner
 * --------------------------------------------------
 */

function runPython(code, input) {
  return new Promise((resolve) => {
    const filename =
      `code-cracker-${randomUUID()}.py`;

    const filePath = path.join(
      os.tmpdir(),
      filename
    );

    let stdout = '';
    let stderr = '';
    let finished = false;

    function finish(result) {
      if (finished) {
        return;
      }

      finished = true;

      fs.unlink(filePath).catch(() => {});

      resolve(result);
    }

    fs.writeFile(
      filePath,
      code,
      'utf8'
    )
      .then(() => {
        const python = spawn(
          'python',
          [filePath],
          {
            windowsHide: true,
            stdio: [
              'pipe',
              'pipe',
              'pipe',
            ],
          }
        );

        const timeout = setTimeout(() => {
          python.kill();

          finish({
            success: false,
            output: stdout,
            error:
              'Execution timed out after 5 seconds.',
          });
        }, 5000);

        python.stdout.on(
          'data',
          (data) => {
            stdout += data.toString();

            if (stdout.length > 100000) {
              clearTimeout(timeout);

              python.kill();

              finish({
                success: false,
                output: stdout.slice(
                  0,
                  100000
                ),
                error:
                  'Program produced too much output.',
              });
            }
          }
        );

        python.stderr.on(
          'data',
          (data) => {
            stderr += data.toString();

            if (stderr.length > 100000) {
              clearTimeout(timeout);

              python.kill();

              finish({
                success: false,
                output: stdout,
                error:
                  'Program produced too much error output.',
              });
            }
          }
        );

        python.on(
          'error',
          (error) => {
            clearTimeout(timeout);

            finish({
              success: false,
              output: '',
              error:
                error.message ||
                'Unable to start Python.',
            });
          }
        );

        python.on(
          'close',
          (exitCode) => {
            clearTimeout(timeout);

            if (finished) {
              return;
            }

            if (exitCode === 0) {
              finish({
                success: true,
                output: stdout,
                error: '',
              });

              return;
            }

            finish({
              success: false,
              output: stdout,
              error:
                stderr ||
                `Python exited with code ${exitCode}.`,
            });
          }
        );

        if (typeof input === 'string') {
          python.stdin.write(input);
        }

        python.stdin.end();
      })
      .catch((error) => {
        finish({
          success: false,
          output: '',
          error:
            error.message ||
            'Unable to create temporary Python file.',
        });
      });
  });
}

/*
 * --------------------------------------------------
 * Execute API
 * --------------------------------------------------
 */

app.post(
  '/api/execute',
  async (req, res) => {
    try {
      console.log(
        'EXECUTE BODY:',
        req.body
      );

      const body = req.body || {};

      const language =
        typeof body.language === 'string'
          ? body.language.trim()
          : '';

      const code =
        typeof body.code === 'string'
          ? body.code
          : '';

      const input =
        typeof body.input === 'string'
          ? body.input
          : '';

      console.log(
        'EXECUTE LANGUAGE:',
        JSON.stringify(language)
      );

      /*
       * Validate language.
       */

      if (
        !SUPPORTED_LANGUAGES.includes(language)
      ) {
        return res.status(400).json({
          success: false,
          error:
            'Unsupported programming language.',
          receivedLanguage: language,
          supportedLanguages:
            SUPPORTED_LANGUAGES,
        });
      }

      /*
       * Validate code.
       */

      if (!code.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Code cannot be empty.',
        });
      }

      if (code.length > 100000) {
        return res.status(400).json({
          success: false,
          error: 'Code is too large.',
        });
      }

      /*
       * Validate input.
       */

      if (input.length > 50000) {
        return res.status(400).json({
          success: false,
          error: 'Input is too large.',
        });
      }

      /*
       * Python.
       */

      if (
        language === 'python3.10' ||
        language === 'python3.8-ml' ||
        language === 'python3.9'
      ) {
        const result =
          await runPython(
            code,
            input
          );

        return res.json({
          success: result.success,
          output: result.output,
          error: result.error,
          language,
        });
      }

      /*
       * Other languages later.
       */

      return res.status(501).json({
        success: false,
        output: '',
        error:
          `Execution for ${language} is not configured yet.`,
        language,
      });
    } catch (error) {
      console.error(
        'Execution API error:',
        error
      );

      return res.status(500).json({
        success: false,
        output: '',
        error:
          'Internal server error.',
      });
    }
  }
);

/*
 * --------------------------------------------------
 * Frontend
 * --------------------------------------------------
 */

app.use(
  express.static(distDir)
);

/*
 * --------------------------------------------------
 * React fallback
 * --------------------------------------------------
 */

app.get('*', (req, res) => {
  res.sendFile(
    path.join(
      distDir,
      'index.html'
    )
  );
});

/*
 * --------------------------------------------------
 * Start server
 * --------------------------------------------------
 */

app.listen(
  port,
  () => {
    console.log(
      `Code Cracker server running at http://localhost:${port}`
    );
  }
);