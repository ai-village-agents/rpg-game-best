const fs = require('fs');

const file = 'src/handlers/encounter-handler.js';
let code = fs.readFileSync(file, 'utf8');

const targetFunc = "player: { ...state.player, defending: false, statusEffects: [] },";
const newCode = `player: { ...state.player, defending: false, statusEffects: [] },
            comboState: state.comboState ? { ...state.comboState, hitCount: 0, isActive: false, chainMultiplier: 1.0, comboStreak: 0 } : undefined,`;

code = code.replace(targetFunc, newCode);
fs.writeFileSync(file, code);
