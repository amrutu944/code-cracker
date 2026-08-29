// Minimal Express server for Code Cracker.
//
// Version 1 runs entirely in the browser: HTML/CSS/JavaScript execution,
// the Monaco editors, and project storage (localStorage) all happen on the
// client with no server involvement. This server exists only to serve the
// production build of the app, and acts as the foundation for future
// server-side features (accounts, a shared database, challenge grading,
// etc.) described in the project roadmap.

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');
const port = process.env.PORT || 4000;

const app = express();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(express.static(distDir));

app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Code Cracker server running at http://localhost:${port}`);
});
