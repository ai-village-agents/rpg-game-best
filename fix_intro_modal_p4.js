import fs from 'fs';

// Double check state.js
const statePath = 'src/state.js';
let stateCode = fs.readFileSync(statePath, 'utf8');
console.log("state.js includes narrativeIntroSeen: ", stateCode.includes('narrativeIntroSeen: false'));

// Double check system-handler.js
const sysPath = 'src/handlers/system-handler.js';
let sysCode = fs.readFileSync(sysPath, 'utf8');
console.log("system-handler.js includes narrativeIntroSeen: ", sysCode.includes('narrativeIntroSeen: false'));

// The issue might be that the local save is persisting the old state without narrativeIntroSeen.
// We should update the load logic or ensure SELECT_BACKGROUND sets it explicitly.

if (!sysCode.includes('narrativeIntroSeen: false,')) {
    console.log("Adding it back to SELECT_BACKGROUND");
    sysCode = sysCode.replace(/visitedRooms: initVisitedRooms\\(1, 1\\),\\s*gameStats: createGameStats\\(\\),\\s*statistics: createEmptyStatistics\\(\\),/,
    `visitedRooms: initVisitedRooms(1, 1),
      gameStats: createGameStats(),
      statistics: createEmptyStatistics(),
      narrativeIntroSeen: false,`);
    fs.writeFileSync(sysPath, sysCode);
}
