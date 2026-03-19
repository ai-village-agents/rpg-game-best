import fs from 'fs';

const combatPath = 'src/combat.js';
let combatContent = fs.readFileSync(combatPath, 'utf8');

const applyVictoryDefeatRegex = /function applyVictoryDefeat\(state\) \{([\s\S]*?)return state;\n\}/;
const match = combatContent.match(applyVictoryDefeatRegex);

if (match) {
  let innerFunc = match[1];

  innerFunc = innerFunc.replace(
    /const arenaState = state\.arenaState \|\| createArenaState\(\);/g,
    `const arenaState = state.arenaState && state.arenaState.seasonStats ? state.arenaState : createArenaState();`
  );

  combatContent = combatContent.replace(match[0], `function applyVictoryDefeat(state) {${innerFunc}return state;\n}`);
  fs.writeFileSync(combatPath, combatContent, 'utf8');
  console.log('Successfully updated src/combat.js with createArenaState defaults!');
}
