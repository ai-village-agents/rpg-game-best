const fs = require('fs');
const file = 'src/handlers/ui-handler.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("import { processMatchResult, createTournament, recordTournamentMatchResult, getTournamentRewards, resetSeason, generateOpponent } from '../arena-tournament-system.js';", "import { processMatchResult, createTournament, recordTournamentMatchResult, getTournamentRewards, resetSeason, generateOpponent } from '../arena-tournament-system.js';\nimport { createMomentumState } from '../combat.js';\nimport { initIntentState } from '../enemy-intent.js';");

const oldArena = `  if (type === 'START_ARENA_MATCH') {
    if (isPreAdventure || !state.arenaState) return null;
    const playerLevel = state.player.level || 1;
    const opponent = generateOpponent(playerLevel);
    const levelDelta = playerLevel - opponent.level;
    const winChance = Math.min(0.85, Math.max(0.15, 0.5 + (levelDelta * 0.05)));
    const result = Math.random() < winChance ? 'win' : 'loss';
    const opponentRating = Math.max(0, (state.arenaState.rating || 1000) + ((opponent.level - playerLevel) * 25));
    const matchData = {
      opponentRating,
      result,
      duration: 60 + Math.floor(Math.random() * 120),
      damageDealt: Math.floor(opponent.stats.hp * (result === 'win' ? 1 : 0.6)),
      damageTaken: Math.floor(opponent.stats.hp * (result === 'win' ? 0.4 : 1))
    };
    const { state: arenaState } = processMatchResult(state.arenaState, matchData);
    const next = { ...state, arenaState, phase: 'exploration' };
    return pushLog(next, result === 'win'
      ? \`Arena victory against \${opponent.name}! Rating: \${arenaState.rating}\`
      : \`Arena defeat against \${opponent.name}. Rating: \${arenaState.rating}\`);
  }`;

const newArena = `  if (type === 'START_ARENA_MATCH') {
    if (isPreAdventure || !state.arenaState) return null;
    const playerLevel = state.player.level || 1;
    const opponent = generateOpponent(playerLevel);
    
    // Convert generated opponent to enemy format for combat
    const arenaEnemy = {
      ...opponent,
      displayName: opponent.name,
      xpReward: opponent.rewards.xp,
      goldReward: opponent.rewards.gold
    };

    let next = {
      ...state,
      enemy: arenaEnemy,
      phase: 'player-turn',
      turn: 1,
      combatStats: null,
      combatStatsSummary: null,
      player: { ...state.player, defending: false, statusEffects: [] },
      momentumState: state.momentumState ? createMomentumState() : undefined,
      intentState: initIntentState(),
      isArenaMatch: true, // Flag for combat logic routing
      arenaOpponentRating: Math.max(0, (state.arenaState.rating || 1000) + ((opponent.level - playerLevel) * 25))
    };

    next = pushLog(next, 'Welcome to the Arena!');
    next = pushLog(next, 'You are facing ' + opponent.name + ' (Level ' + opponent.level + ')!');
    return pushLog(next, 'Your turn.');
  }`;

content = content.replace(oldArena, newArena);

fs.writeFileSync(file, content);
