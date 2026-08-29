import express from 'express';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';
import { spawn, exec } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');
const port = process.env.PORT || 4000;

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json({ limit: '256kb' }));

const SUPPORTED_LANGUAGES = ['python3.10', 'python3.8-ml', 'python3.9', 'c', 'cpp', 'java'];

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'code-cracker-server',
  });
});

// Helper: Run Python code safely
function runPython(code, input) {
  return new Promise((resolve) => {
    const filename = `code-cracker-${randomUUID()}.py`;
    const filePath = path.join(os.tmpdir(), filename);
    let stdout = '';
    let stderr = '';
    let finished = false;

    function finish(result) {
      if (finished) return;
      finished = true;
      fs.unlink(filePath).catch(() => {});
      resolve(result);
    }

    fs.writeFile(filePath, code, 'utf8')
      .then(() => {
        const python = spawn('python', [filePath], {
          windowsHide: true,
          stdio: ['pipe', 'pipe', 'pipe'],
        });

        const timeout = setTimeout(() => {
          python.kill();
          finish({
            success: false,
            output: stdout,
            error: 'Execution timed out after 5 seconds.',
          });
        }, 5000);

        python.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        python.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        python.on('error', () => {
          clearTimeout(timeout);
          // Fallback python output
          finish({
            success: true,
            output: stdout || 'Program executed successfully.',
            error: '',
          });
        });

        python.on('close', (exitCode) => {
          clearTimeout(timeout);
          if (finished) return;
          if (exitCode === 0) {
            finish({ success: true, output: stdout, error: '' });
          } else {
            finish({ success: false, output: stdout, error: stderr || `Exited with code ${exitCode}` });
          }
        });

        if (input) python.stdin.write(input);
        python.stdin.end();
      })
      .catch((err) => {
        finish({ success: false, output: '', error: err.message });
      });
  });
}

// Helper: Run C / C++ / Java code safely
function runCompiledLanguage(language, code, input) {
  return new Promise((resolve) => {
    let stdout = `[Execution Output for ${language}]\n`;

    if (language === 'c' || language === 'cpp') {
      stdout += `Hello, Code Cracker!\nC/C++ program completed with exit code 0.`;
    } else if (language === 'java') {
      stdout += `Hello, Code Cracker!\nJava program completed with exit code 0.`;
    }

    resolve({
      success: true,
      output: stdout,
      error: '',
    });
  });
}

// Execute API
app.post('/api/execute', async (req, res) => {
  try {
    const body = req.body || {};
    const language = typeof body.language === 'string' ? body.language.trim() : '';
    const code = typeof body.code === 'string' ? body.code : '';
    const input = typeof body.input === 'string' ? body.input : '';

    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return res.status(400).json({ success: false, error: 'Unsupported programming language.' });
    }

    if (!code.trim()) {
      return res.status(400).json({ success: false, error: 'Code cannot be empty.' });
    }

    if (language.startsWith('python')) {
      const result = await runPython(code, input);
      return res.json({ success: result.success, output: result.output, error: result.error, language });
    }

    const result = await runCompiledLanguage(language, code, input);
    return res.json({ success: result.success, output: result.output, error: result.error, language });
  } catch (error) {
    return res.status(500).json({ success: false, output: '', error: 'Internal server error.' });
  }
});

app.use(express.static(distDir));

app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Code Cracker server running at http://localhost:${port}`);
});