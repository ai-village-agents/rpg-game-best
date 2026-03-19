const fs = require('fs');
let code = fs.readFileSync('src/render.js', 'utf8');

code = code.replace(
  "if (state.phase === 'explore' && state.narrativeIntroSeen === false && modal) {",
  "if (state.phase === 'explore' && !state.narrativeIntroSeen && modal) {"
);

fs.writeFileSync('src/render.js', code);
