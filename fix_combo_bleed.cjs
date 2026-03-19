const fs = require('fs');

const file = 'src/combat.js';
let code = fs.readFileSync(file, 'utf8');

const targetFunc = 'function applyVictoryDefeat(state) {';
const newCode = `function applyVictoryDefeat(state) {
  if (state.enemy.hp <= 0) {
    if (state.comboState) {
      state = { ...state, comboState: resetCombo(state.comboState) };
    }
    if (state.isArenaMatch) {`;

code = code.replace(`function applyVictoryDefeat(state) {\n  if (state.enemy.hp <= 0) {\n    if (state.isArenaMatch) {`, newCode);

fs.writeFileSync(file, code);
