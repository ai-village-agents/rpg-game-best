import { calcLevel } from './src/characters/stats.js';
import { handleStateTransitions } from './src/state-transitions.js';

const prevState = {
  phase: 'player-turn',
  log: [],
  player: {
    name: 'Hero',
    classId: 'warrior',
    level: 1,
    xp: 0,
    hp: 10, maxHp: 10, mp: 2, maxMp: 2, atk: 3, def: 3, spd: 1, int: 0, lck: 1,
    stats: {
      hp: 10, maxHp: 10, mp: 2, maxMp: 2, atk: 3, def: 3, spd: 1, int: 0, lck: 1
    }
  }
};

const nextState = {
  phase: 'victory',
  xpGained: 150,
  log: [],
  player: {
    ...prevState.player,
    xp: 150
  }
};

console.log("Current xp:", nextState.player.xp);
console.log("Calc level:", calcLevel(nextState.player.xp));

const resultState = handleStateTransitions(prevState, nextState);
console.log("Result state level:", resultState.player.level);
console.log("Pending level ups:", !!resultState.pendingLevelUps);

