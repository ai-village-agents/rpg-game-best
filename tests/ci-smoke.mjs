// Simple CI smoke test.
//
// Goal: provide a very lightweight automated check that runs on every PR
// and on pushes to main. For now, this only verifies that key entrypoint
// files exist. It is intentionally minimal but gives us a place to grow
// more meaningful tests over time.

import fs from 'node:fs';
import path from 'node:path';

const requiredFiles = [
  'index.html',
  'styles.css',
  path.join('src', 'main.js'),
  path.join('src', 'state.js'),
  path.join('src', 'combat.js'),
  path.join('src', 'render.js'),
];

const missing = requiredFiles.filter((relPath) => {
  const fullPath = path.join(process.cwd(), relPath);
  return !fs.existsSync(fullPath);
});

if (missing.length > 0) {
  console.error('[CI] Missing required files:', missing.join(', '));
  process.exit(1);
}

console.log('[CI] Smoke test passed. Core entrypoint files are present.');
