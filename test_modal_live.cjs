const fs = require('fs');

// We need to check if there's any state override that might skip narrativeIntroSeen
let stateJs = fs.readFileSync('src/state.js', 'utf8');
if (!stateJs.includes('narrativeIntroSeen: false')) {
    stateJs = stateJs.replace('return {\n    version: 1,', 'return {\n    version: 1,\n    narrativeIntroSeen: false,');
    fs.writeFileSync('src/state.js', stateJs);
    console.log("Added narrativeIntroSeen to base state");
} else {
    console.log("narrativeIntroSeen already in base state");
}

