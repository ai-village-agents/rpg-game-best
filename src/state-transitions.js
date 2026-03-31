import { calcLevel } from './characters/stats.js';
import { checkLevelUps, createLevelUpState } from './level-up.js';
import { createBattleSummary } from './battle-summary.js';
import { pushLog } from './state.js';
import { logLevelUp } from './journal.js';
import { addSkillPoints, createTalentState } from './talents.js';

const SKILL_POINTS_PER_LEVEL = 1;

/**
 * Helper to process a level up if one is detected.
 * Returns updated next state if leveled up, otherwise returns next.
 */
function processLevelUp(next) {
  const player = next.player;
  if (!player || !player.classId) return next;

  const oldLevel = player.level ?? 1;
  const newLevel = calcLevel(player.xp ?? 0);

  if (newLevel > oldLevel) {
    // We assume checkLevelUps needs xp before the gain.
    // In many non-combat cases, xp is just updated in place, so we simulate an xp gain.
    const xpGained = Math.max(1, next.xpGained || 1); 
    const mockOldChar = { ...player, level: oldLevel, xp: (player.xp ?? 0) - xpGained };

    const levelUps = checkLevelUps(
      [mockOldChar],
      xpGained
    );

    if (levelUps.length > 0) {
      const lu = levelUps[0];
      const levelsGained = lu.newLevel - oldLevel;
      const pointsToAdd = levelsGained * SKILL_POINTS_PER_LEVEL;
      const currentTalentState = next.talentState || createTalentState();
      const newTalentState = addSkillPoints(currentTalentState, pointsToAdd);

      let updatedNext = {
        ...next,
        player: {
          ...player,
          level: lu.newLevel,
          maxHp: lu.newStats.maxHp,
          hp: player.hp + (lu.newStats.maxHp - lu.oldStats.maxHp), // Heal by HP growth
          maxMp: lu.newStats.maxMp,
          mp: (player.mp ?? 0) + (lu.newStats.maxMp - (lu.oldStats.maxMp ?? 0)),
          atk: lu.newStats.atk,
          def: lu.newStats.def,
          spd: lu.newStats.spd,
          int: lu.newStats.int,
          stats: { ...lu.newStats },
        },
        talentState: newTalentState,
      };

      updatedNext = pushLog(updatedNext, `${player.name} reached level ${lu.newLevel}!`);
      updatedNext = pushLog(updatedNext, `Gained ${pointsToAdd} skill point(s)!`);
      updatedNext = logLevelUp(updatedNext, lu.newLevel);
      
      // We must inject pendingLevelUps so the UI knows to show the modal!
      updatedNext.pendingLevelUps = levelUps;
      
      // If we are currently in 'exploration', 'dungeon', 'town', 'post-victory'
      // We should force the phase to 'level-up' directly so the user gets the modal immediately!
      // But we must preserve the phase they will return to.
      if (updatedNext.phase !== 'victory' && updatedNext.phase !== 'battle-summary' && updatedNext.phase !== 'level-up') {
         const luState = createLevelUpState(levelUps, updatedNext.phase); // Set returnPhase to their current phase
         updatedNext.phase = 'level-up';
         updatedNext.levelUpState = { ...luState, pendingChoice: true };
      }

      return updatedNext;
    }
  }
  return next;
}

/**
 * Handles automatic state updates based on phase transitions.
 * e.g. Level-up detection, Battle Summary creation.
 * @param {Object} prevState - The previous state
 * @param {Object} nextState - The proposed next state
 * @returns {Object} The final next state (possibly modified)
 */
export function handleStateTransitions(prevState, nextState) {
  let next = nextState;
  
  // 1. GLOBAL LEVEL-UP DETECTION (Decoupled from 'victory' phase)
  // Check if player xp corresponds to a higher level than their current player.level
  if (next.player && next.player.classId && next.phase !== 'level-up') {
    const currentLevel = next.player.level || 1;
    const calculatedLevel = calcLevel(next.player.xp || 0);
    
    // If the calculated level is greater than their actual level, trigger a level up processing
    if (calculatedLevel > currentLevel) {
       next = processLevelUp(next);
    }
  }

  // 2. COMBAT PHASE TRANSITIONS
  // After level-up detection, transition victory → battle-summary
  if (next.phase === 'victory' && prevState.phase !== 'battle-summary' && prevState.phase !== 'level-up') {
    next = { ...next, phase: 'battle-summary', battleSummary: createBattleSummary(next) };
  }
  
  return next;
}
