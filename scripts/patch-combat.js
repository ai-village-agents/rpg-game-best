const fs = require('fs');
const file = '/home/computeruse/rpg-game/src/combat.js';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { modifyReputation }')) {
  content = content.replace(
    "import { initIntentState, updateIntentState } from './enemy-intent.js';",
    "import { initIntentState, updateIntentState } from './enemy-intent.js';\nimport { modifyReputation } from './faction-reputation-system.js';\nimport { updateBountyProgress } from './bounty-board.js';"
  );
}

const victoryHook = "if (state.bestiary && state.currentEnemyId) { state = { ...state, bestiary: recordDefeat(state.bestiary, state.currentEnemyId) }; }";

const customLogic = `
    if (state.bestiary && state.currentEnemyId) { state = { ...state, bestiary: recordDefeat(state.bestiary, state.currentEnemyId) }; }
    
    // Update bounty progress
    if (state.currentEnemyId && state.enemy.name) {
      state = updateBountyProgress(state, 'ENEMY_DEFEATED', state.enemy.name, 1);
    }
    
    // Faction reputation gains
    if (state.currentEnemyId && state.factionReputation) {
      const eId = state.currentEnemyId;
      let repFaction = null;
      let repAmount = 0;
      
      if (['skeleton', 'wraith', 'lich-king', 'blood-fiend', 'undead_legion', 'plague-bearer'].includes(eId)) {
        repFaction = 'silver_order';
        repAmount = eId === 'lich-king' ? 500 : 20;
      } else if (['bandit', 'orc', 'dark-cultist', 'chaos-spawn', 'infernal-knight', 'void-stalker'].includes(eId)) {
        repFaction = 'kingdom_valor';
        repAmount = 25;
      } else if (['wolf', 'giant-spider', 'goblin', 'slime', 'goblin_chief'].includes(eId)) {
        repFaction = 'forest_guardians';
        repAmount = 15;
      } else if (['dragon', 'glacial-wyrm', 'ember-drake', 'celestial-wyrm'].includes(eId)) {
        repFaction = 'dragon_alliance';
        repAmount = -50; // Killing dragons hurts dragon alliance
        // Also boost kingdom_valor for killing big dragons
        const kvResult = modifyReputation(state.factionReputation, 'kingdom_valor', 100, 'Slew a dragon');
        if (!kvResult.error) state.factionReputation = kvResult.state;
      }
      
      if (repFaction) {
        const repResult = modifyReputation(state.factionReputation, repFaction, repAmount, 'Slew an enemy');
        if (!repResult.error) {
          state.factionReputation = repResult.state;
          const sign = repAmount > 0 ? '+' : '';
          state = pushLog(state, \`Faction Standing: \${sign}\${repAmount} with \${repFaction}\`);
        }
      }
    }
`;

content = content.replace(victoryHook, customLogic);

fs.writeFileSync(file, content);
console.log('patched');
