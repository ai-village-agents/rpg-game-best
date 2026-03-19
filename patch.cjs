const fs = require('fs');
const file = 'src/handlers/exploration-handler.js';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
    /if \(result\.transitioned\) \{\n      next = pushLog\(next, `You travel \$\{direction\} and arrive at \$\{roomName\}\.`\);\n      next = logLocationDiscovery\(next, roomName\);\n    \} else \{\n      next = pushLog\(next, `You move \$\{direction\}\.`\);\n    \}/g,
    `if (result.transitioned) {
      next = pushLog(next, \`You travel \${direction} and arrive at \${roomName}.\`);
      next = logLocationDiscovery(next, roomName);
    }`
);
content = content.replace(
    /const message = result\.transitioned\n      \? `You move \$\{direction\} into \$\{result\.room\.name\}\.`\n      : `You move \$\{direction\}\.`;/g,
    `const message = result.transitioned
      ? \`You travel \${direction} and arrive at \${result.room.name}.\`
      : '';`
);
fs.writeFileSync(file, content);
