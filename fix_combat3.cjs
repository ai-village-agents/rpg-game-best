const fs = require('fs');
const file = 'src/combat.js';
let content = fs.readFileSync(file, 'utf8');

const oldDefeatBlock = `  if (state.player.hp <= 0) {
    state = { ...state, phase: 'defeat' };
    logDefeat();
    state = pushLog(state, \`Defeat... You collapse.\`);
    // Companion defeat penalty: all companions lose loyalty
    state = processCompanionDefeatPenalty(state);
  }
  return state;
}`;

const newDefeatBlock = `  if (state.player.hp <= 0) {
    if (state.isArenaMatch) {
      return {
        ...state,
        phase: 'arena',
        isArenaMatch: false,
        player: { ...state.player, hp: 1 } // prevent actual death
      };
    }
    state = { ...state, phase: 'defeat' };
    logDefeat();
    state = pushLog(state, \`Defeat... You collapse.\`);
    // Companion defeat penalty: all companions lose loyalty
    state = processCompanionDefeatPenalty(state);
  }
  return state;
}`;

content = content.replace(oldDefeatBlock, newDefeatBlock);
fs.writeFileSync(file, content);
