const fs = require('fs');
const file = 'src/combat.js';
let content = fs.readFileSync(file, 'utf8');

const oldDefeat = `  } else if (state.player.hp <= 0) {
    state = { ...state, phase: 'defeat' };
  }
  return state;`;

const newDefeat = `  } else if (state.player.hp <= 0) {
    if (state.isArenaMatch) {
      return {
        ...state,
        phase: 'arena',
        isArenaMatch: false,
        player: { ...state.player, hp: 1 } // prevent actual death
      };
    }
    state = { ...state, phase: 'defeat' };
  }
  return state;`;

content = content.replace(oldDefeat, newDefeat);

fs.writeFileSync(file, content);
