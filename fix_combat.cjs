const fs = require('fs');
const file = 'src/combat.js';
let content = fs.readFileSync(file, 'utf8');

const oldVictory = `function applyVictoryDefeat(state) {
  if (state.enemy.hp <= 0) {
    const difficulty = state.difficulty ?? DEFAULT_DIFFICULTY;
    const xpGained = applyDifficultyToXpReward(state.enemy.xpReward ?? 0, difficulty);
    const baseGold = applyDifficultyToGoldReward(state.enemy.goldReward ?? 0, difficulty);
    const goldGained = Math.floor(baseGold * getGoldMultiplier(state.worldEvent));
    state = {
      ...state,
      phase: 'victory',
      xpGained,
      goldGained,
      player: {
        ...state.player,
        xp: (state.player.xp ?? 0) + xpGained,
        gold: (state.player.gold ?? 0) + goldGained,
      },
    };`;

const newVictory = `function applyVictoryDefeat(state) {
  if (state.enemy.hp <= 0) {
    if (state.isArenaMatch) {
      return {
        ...state,
        phase: 'arena',
        isArenaMatch: false
      };
    }
    const difficulty = state.difficulty ?? DEFAULT_DIFFICULTY;
    const xpGained = applyDifficultyToXpReward(state.enemy.xpReward ?? 0, difficulty);
    const baseGold = applyDifficultyToGoldReward(state.enemy.goldReward ?? 0, difficulty);
    const goldGained = Math.floor(baseGold * getGoldMultiplier(state.worldEvent));
    state = {
      ...state,
      phase: 'victory',
      xpGained,
      goldGained,
      player: {
        ...state.player,
        xp: (state.player.xp ?? 0) + xpGained,
        gold: (state.player.gold ?? 0) + goldGained,
      },
    };`;

content = content.replace(oldVictory, newVictory);

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
