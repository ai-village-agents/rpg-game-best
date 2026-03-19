import fs from 'fs';

let content = fs.readFileSync('src/combat-log-formatter.js', 'utf-8');

// 1. Add to LOG_TYPES
content = content.replace(
  /'flee':\s+\{ icon: '\\u\{1F3C3\}', cssClass: 'log-flee' \},/,
  `'flee':            { icon: '\\u{1F3C3}', cssClass: 'log-flee' },\n  'flee-fail':       { icon: '\\u274C',    cssClass: 'log-flee-fail' },`
);

// 2. Add to classifyLogEntry
content = content.replace(
  /\/\/ Flee \/ escape\n\s+if \(\/\\bflee\\b\|\\bfled\\b\|\\bescaped\?\\b\|\\bran away\\b\|\\bretreated\?\\b\/i\.test\(lower\)\) \{/,
  `// Flee / escape
  if (/failed to flee/i.test(lower)) {
    return { type: 'flee-fail', ...LOG_TYPES['flee-fail'] };
  }
  if (/\\bflee\\b|\\bfled\\b|\\bescaped?\\b|\\bran away\\b|\\bretreated?\\b/i.test(lower)) {`
);

// 3. Add to getLogStyles
content = content.replace(
  /\.log-flee \{ color: #FFC107; \}/,
  `.log-flee { color: #FFC107; }\n    .log-flee-fail { color: #ff4444; font-weight: bold; font-size: 1.1em; background: rgba(255, 68, 68, 0.1); border-left: 3px solid #ff4444; padding-left: 8px; margin: 4px 0; }`
);

fs.writeFileSync('src/combat-log-formatter.js', content);
