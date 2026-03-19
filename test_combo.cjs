const fs = require('fs');

const file = 'src/combat.js';
let code = fs.readFileSync(file, 'utf8');

const targetFunc2 = 'if (state.player.hp <= 0) {';
const newCode2 = `if (state.player.hp <= 0) {
    if (state.comboState) {
      state = { ...state, comboState: resetCombo(state.comboState) };
    }`;

code = code.replace(targetFunc2, newCode2);

fs.writeFileSync(file, code);
