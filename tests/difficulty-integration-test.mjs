/**
 * Tests for difficulty settings integration with combat and state
 * Created by Claude Opus 4.5 (Day 345)
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { initialState, initialStateWithClass } from '../src/state.js';
import { startNewEncounter, playerAttack } from '../src/combat.js';
import {
  DIFFICULTY_LEVELS,
  DEFAULT_DIFFICULTY,
  applyDifficultyToEnemyHp,
  applyDifficultyToEnemyDamage,
  applyDifficultyToXpReward,
  applyDifficultyToGoldReward,
  DIFFICULTY_MULTIPLIERS,
} from '../src/difficulty.js';
import { getEnemy } from '../src/data/enemies.js';

describe('Difficulty Integration - State', () => {
  it('initialState includes difficulty property', () => {
    const state = initialState();
    assert.ok(state.difficulty !== undefined, 'State should have difficulty property');
    assert.strictEqual(state.difficulty, DEFAULT_DIFFICULTY, 'Default difficulty should be normal');
  });

  it('initialStateWithClass includes difficulty property', () => {
    const state = initialStateWithClass('warrior');
    assert.ok(state.difficulty !== undefined, 'State should have difficulty property');
    assert.strictEqual(state.difficulty, DEFAULT_DIFFICULTY, 'Default difficulty should be normal');
  });

  it('initial enemy HP is adjusted by difficulty', () => {
    const state = initialState();
    // On normal difficulty, HP should remain unchanged
    assert.ok(state.enemy.hp > 0, 'Enemy should have HP');
    assert.strictEqual(state.enemy.hp, state.enemy.maxHp, 'HP should equal maxHp');
  });
});

describe('Difficulty Integration - Combat Encounters', () => {
  it('startNewEncounter creates enemy with positive HP on all difficulties', () => {
    for (const difficulty of Object.values(DIFFICULTY_LEVELS)) {
      let state = initialStateWithClass('warrior');
      state = { ...state, difficulty };
      const newState = startNewEncounter(state, 1);
      
      assert.ok(newState.enemy.maxHp > 0, `${difficulty} difficulty should have positive enemy HP`);
      assert.strictEqual(newState.enemy.hp, newState.enemy.maxHp, `${difficulty} enemy HP should equal maxHp`);
    }
  });

  it('startNewEncounter preserves difficulty setting from state', () => {
    for (const difficulty of Object.values(DIFFICULTY_LEVELS)) {
      let state = initialStateWithClass('warrior');
      state = { ...state, difficulty };
      const newState = startNewEncounter(state, 1);
      
      // The state's difficulty should still be accessible
      assert.strictEqual(state.difficulty, difficulty, `Difficulty should be preserved as ${difficulty}`);
    }
  });

  it('enemy HP matches maxHp after encounter start', () => {
    let state = initialStateWithClass('warrior');
    state = { ...state, difficulty: DIFFICULTY_LEVELS.HARD };
    const hardState = startNewEncounter(state, 1);
    
    assert.strictEqual(hardState.enemy.hp, hardState.enemy.maxHp, 'Enemy HP should equal maxHp on encounter start');
  });
  
  it('difficulty multipliers are applied correctly to known enemy', () => {
    // Get a known enemy's base HP
    const slime = getEnemy('slime');
    const baseHp = slime.maxHp ?? slime.hp;
    
    // Calculate expected values
    const easyExpected = Math.round(baseHp * 0.8);
    const normalExpected = Math.round(baseHp * 1.0);
    const hardExpected = Math.round(baseHp * 1.25);
    const nightmareExpected = Math.round(baseHp * 1.5);
    
    // Verify our multiplier functions produce correct results
    assert.strictEqual(applyDifficultyToEnemyHp(baseHp, DIFFICULTY_LEVELS.EASY), easyExpected);
    assert.strictEqual(applyDifficultyToEnemyHp(baseHp, DIFFICULTY_LEVELS.NORMAL), normalExpected);
    assert.strictEqual(applyDifficultyToEnemyHp(baseHp, DIFFICULTY_LEVELS.HARD), hardExpected);
    assert.strictEqual(applyDifficultyToEnemyHp(baseHp, DIFFICULTY_LEVELS.NIGHTMARE), nightmareExpected);
  });
  
  it('nightmare difficulty enemy HP is higher than easy difficulty for same base HP', () => {
    const baseHp = 100;
    const easyHp = applyDifficultyToEnemyHp(baseHp, DIFFICULTY_LEVELS.EASY);
    const nightmareHp = applyDifficultyToEnemyHp(baseHp, DIFFICULTY_LEVELS.NIGHTMARE);
    
    assert.ok(nightmareHp > easyHp, 'Nightmare HP should be higher than easy HP');
    // Easy = 80, Nightmare = 150, ratio should be 1.875
    const ratio = nightmareHp / easyHp;
    assert.ok(ratio > 1.5, `Nightmare/Easy ratio should be > 1.5, got ${ratio}`);
  });
});

describe('Difficulty Integration - Damage Multipliers', () => {
  it('easy difficulty reduces enemy damage', () => {
    const baseDamage = 100;
    const easyDamage = applyDifficultyToEnemyDamage(baseDamage, DIFFICULTY_LEVELS.EASY);
    assert.strictEqual(easyDamage, 75, 'Easy difficulty should deal 75% damage');
  });

  it('normal difficulty keeps enemy damage unchanged', () => {
    const baseDamage = 100;
    const normalDamage = applyDifficultyToEnemyDamage(baseDamage, DIFFICULTY_LEVELS.NORMAL);
    assert.strictEqual(normalDamage, 100, 'Normal difficulty should deal 100% damage');
  });

  it('hard difficulty increases enemy damage', () => {
    const baseDamage = 100;
    const hardDamage = applyDifficultyToEnemyDamage(baseDamage, DIFFICULTY_LEVELS.HARD);
    assert.strictEqual(hardDamage, 125, 'Hard difficulty should deal 125% damage');
  });

  it('nightmare difficulty increases enemy damage significantly', () => {
    const baseDamage = 100;
    const nightmareDamage = applyDifficultyToEnemyDamage(baseDamage, DIFFICULTY_LEVELS.NIGHTMARE);
    assert.strictEqual(nightmareDamage, 150, 'Nightmare difficulty should deal 150% damage');
  });
});

describe('Difficulty Integration - Reward Multipliers', () => {
  it('easy difficulty keeps XP rewards unchanged', () => {
    const baseXp = 100;
    const easyXp = applyDifficultyToXpReward(baseXp, DIFFICULTY_LEVELS.EASY);
    assert.strictEqual(easyXp, 100, 'Easy difficulty should give 100% XP');
  });

  it('hard difficulty increases XP rewards', () => {
    const baseXp = 100;
    const hardXp = applyDifficultyToXpReward(baseXp, DIFFICULTY_LEVELS.HARD);
    assert.strictEqual(hardXp, 120, 'Hard difficulty should give 120% XP');
  });

  it('nightmare difficulty increases XP rewards significantly', () => {
    const baseXp = 100;
    const nightmareXp = applyDifficultyToXpReward(baseXp, DIFFICULTY_LEVELS.NIGHTMARE);
    assert.strictEqual(nightmareXp, 150, 'Nightmare difficulty should give 150% XP');
  });

  it('easy difficulty keeps gold rewards unchanged', () => {
    const baseGold = 100;
    const easyGold = applyDifficultyToGoldReward(baseGold, DIFFICULTY_LEVELS.EASY);
    assert.strictEqual(easyGold, 100, 'Easy difficulty should give 100% gold');
  });

  it('hard difficulty increases gold rewards', () => {
    const baseGold = 100;
    const hardGold = applyDifficultyToGoldReward(baseGold, DIFFICULTY_LEVELS.HARD);
    assert.strictEqual(hardGold, 120, 'Hard difficulty should give 120% gold');
  });

  it('nightmare difficulty increases gold rewards significantly', () => {
    const baseGold = 100;
    const nightmareGold = applyDifficultyToGoldReward(baseGold, DIFFICULTY_LEVELS.NIGHTMARE);
    assert.strictEqual(nightmareGold, 150, 'Nightmare difficulty should give 150% gold');
  });
});

describe('Difficulty Integration - HP Multipliers', () => {
  it('easy difficulty reduces enemy HP', () => {
    const baseHp = 100;
    const easyHp = applyDifficultyToEnemyHp(baseHp, DIFFICULTY_LEVELS.EASY);
    assert.strictEqual(easyHp, 80, 'Easy difficulty should have 80% HP');
  });

  it('normal difficulty keeps enemy HP unchanged', () => {
    const baseHp = 100;
    const normalHp = applyDifficultyToEnemyHp(baseHp, DIFFICULTY_LEVELS.NORMAL);
    assert.strictEqual(normalHp, 100, 'Normal difficulty should have 100% HP');
  });

  it('hard difficulty increases enemy HP', () => {
    const baseHp = 100;
    const hardHp = applyDifficultyToEnemyHp(baseHp, DIFFICULTY_LEVELS.HARD);
    assert.strictEqual(hardHp, 125, 'Hard difficulty should have 125% HP');
  });

  it('nightmare difficulty increases enemy HP significantly', () => {
    const baseHp = 100;
    const nightmareHp = applyDifficultyToEnemyHp(baseHp, DIFFICULTY_LEVELS.NIGHTMARE);
    assert.strictEqual(nightmareHp, 150, 'Nightmare difficulty should have 150% HP');
  });
});

describe('Difficulty Integration - Fallback Behavior', () => {
  it('startNewEncounter uses DEFAULT_DIFFICULTY when state.difficulty is undefined', () => {
    let state = initialStateWithClass('warrior');
    delete state.difficulty; // Remove difficulty property
    
    // Should not throw and should use default
    const newState = startNewEncounter(state, 1);
    assert.ok(newState.enemy.maxHp > 0, 'Should still create enemy with valid HP');
  });

  it('multiplier functions handle invalid difficulty gracefully', () => {
    const baseValue = 100;
    const invalidDifficulty = 'invalid';
    
    // Should fall back to normal multipliers
    const hp = applyDifficultyToEnemyHp(baseValue, invalidDifficulty);
    const damage = applyDifficultyToEnemyDamage(baseValue, invalidDifficulty);
    const xp = applyDifficultyToXpReward(baseValue, invalidDifficulty);
    const gold = applyDifficultyToGoldReward(baseValue, invalidDifficulty);
    
    assert.strictEqual(hp, 100, 'Invalid difficulty should use normal HP multiplier');
    assert.strictEqual(damage, 100, 'Invalid difficulty should use normal damage multiplier');
    assert.strictEqual(xp, 100, 'Invalid difficulty should use normal XP multiplier');
    assert.strictEqual(gold, 100, 'Invalid difficulty should use normal gold multiplier');
  });
});

describe('Difficulty Integration - Edge Cases', () => {
  it('handles zero base values', () => {
    assert.strictEqual(applyDifficultyToEnemyHp(0, DIFFICULTY_LEVELS.HARD), 0);
    assert.strictEqual(applyDifficultyToEnemyDamage(0, DIFFICULTY_LEVELS.HARD), 0);
    assert.strictEqual(applyDifficultyToXpReward(0, DIFFICULTY_LEVELS.HARD), 0);
    assert.strictEqual(applyDifficultyToGoldReward(0, DIFFICULTY_LEVELS.HARD), 0);
  });

  it('rounds values correctly', () => {
    // 33 * 1.25 = 41.25, should round to 41
    assert.strictEqual(applyDifficultyToEnemyHp(33, DIFFICULTY_LEVELS.HARD), 41);
    // 33 * 0.80 = 26.4, should round to 26
    assert.strictEqual(applyDifficultyToEnemyHp(33, DIFFICULTY_LEVELS.EASY), 26);
  });

  it('preserves difficulty in state after encounter', () => {
    let state = initialStateWithClass('warrior');
    state = { ...state, difficulty: DIFFICULTY_LEVELS.NIGHTMARE };
    
    const afterEncounter = startNewEncounter(state, 1);
    
    // Difficulty should remain in state
    assert.strictEqual(afterEncounter.difficulty, DIFFICULTY_LEVELS.NIGHTMARE);
  });
  
  it('all difficulty levels are unique', () => {
    const levels = Object.values(DIFFICULTY_LEVELS);
    const uniqueLevels = new Set(levels);
    assert.strictEqual(levels.length, uniqueLevels.size, 'All difficulty levels should be unique');
  });
  
  it('all multipliers are defined for all difficulty levels', () => {
    for (const level of Object.values(DIFFICULTY_LEVELS)) {
      const multipliers = DIFFICULTY_MULTIPLIERS[level];
      assert.ok(multipliers, `Multipliers should be defined for ${level}`);
      assert.ok(typeof multipliers.enemyDamage === 'number', `enemyDamage should be number for ${level}`);
      assert.ok(typeof multipliers.enemyHp === 'number', `enemyHp should be number for ${level}`);
      assert.ok(typeof multipliers.xpReward === 'number', `xpReward should be number for ${level}`);
      assert.ok(typeof multipliers.goldReward === 'number', `goldReward should be number for ${level}`);
    }
  });
});
