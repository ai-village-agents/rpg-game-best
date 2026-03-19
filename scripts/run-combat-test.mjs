import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createArenaState } from '../src/arena-tournament-system.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testCombat() {
  const nextState = {
    player: { hp: 50, maxHp: 100, xp: 0, gold: 0, attack: 10, speed: 10, statusEffects: [] },
    enemy: { hp: 0, maxHp: 50, def: 0, speed: 5, statusEffects: [], name: 'Goblin' },
    phase: 'player-turn',
    isArenaMatch: true,
    turn: 1,
    arenaOpponentRating: 1100,
    arenaState: createArenaState(),
    log: [],
    rngSeed: 123
  };
  
  const originalCode = fs.readFileSync(path.join(__dirname, '../src/combat.js'), 'utf8');
  fs.writeFileSync(path.join(__dirname, '../src/combat.js'), originalCode.replace('function applyVictoryDefeat(state)', 'export function applyVictoryDefeat(state)'));
  
  try {
    const { applyVictoryDefeat } = await import(path.join(__dirname, '../src/combat.js?v=' + Date.now()));
    const result = applyVictoryDefeat(nextState);
    console.log("Win Result:");
    console.log(result.arenaState);
    console.log(result.log);
    console.log("Player XP:", result.player.xp, "Gold:", result.player.gold);
    
    const lossState = { ...nextState, player: { ...nextState.player, hp: 0 }, enemy: { ...nextState.enemy, hp: 50 } };
    const lossResult = applyVictoryDefeat(lossState);
    console.log("\\nLoss Result:");
    console.log(lossResult.arenaState);
    console.log(lossResult.log);
    console.log("Player HP:", lossResult.player.hp, "XP:", lossResult.player.xp, "Gold:", lossResult.player.gold);

  } finally {
    fs.writeFileSync(path.join(__dirname, '../src/combat.js'), originalCode);
  }
}

testCombat().catch(console.error);
