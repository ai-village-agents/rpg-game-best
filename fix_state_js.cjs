const fs = require('fs');
let stateJs = fs.readFileSync('src/state.js', 'utf8');

if (!stateJs.includes('narrativeIntroSeen')) {
    stateJs = stateJs.replace('const createInitialState = () => ({', 'const createInitialState = () => ({\n  narrativeIntroSeen: false,');
    fs.writeFileSync('src/state.js', stateJs);
}

