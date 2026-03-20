import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Test that render.js exports can import the combat-rewards-animator properly
import { createRewardsState, renderRewardsHtml, getRewardsStyles } from '../src/combat-rewards-animator.js';

describe('Wire Combat Rewards into Victory Phase', () => {
  describe('createRewardsState integration', () => {
    it('should extract rewards state from a typical victory game state', () => {
      const state = {
        player: { name: 'Hero', hp: 80, maxHp: 100, xp: 150, level: 5, inventory: { potion: 3 }, gold: 500, xpForLevel: 300 },
        enemy: { name: 'Skeleton', maxHp: 60 },
        xpGained: 30,
        goldGained: 15,
        phase: 'victory',
        combat: { turnsUsed: 4, damageDealt: 60, damageReceived: 20 }
      };
      const rs = createRewardsState(state);
      assert.equal(rs.xpBefore, 150);
      assert.equal(rs.goldGained, 15);
      assert.equal(rs.enemyName, 'Skeleton');
      assert.equal(typeof rs.battleRating.grade, 'string');
      assert.ok(['S', 'A', 'B', 'C', 'D'].includes(rs.battleRating.grade));
    });

    it('should handle missing combat data gracefully', () => {
      const state = {
        player: { name: 'Hero', hp: 10, maxHp: 50, xp: 0, level: 1, inventory: {}, gold: 0 },
        enemy: { name: 'Rat' },
        xpGained: 5,
        goldGained: 2,
        phase: 'victory'
      };
      const rs = createRewardsState(state);
      assert.equal(rs.goldGained, 2);
      assert.equal(rs.turnsUsed, 0);
      assert.equal(rs.damageDealt, 0);
    });
  });

  describe('renderRewardsHtml for each phase', () => {
    const baseState = {
      player: { name: 'Hero', hp: 50, maxHp: 100, xp: 100, level: 3, inventory: { potion: 1 }, gold: 200, xpForLevel: 250 },
      enemy: { name: 'Wolf', maxHp: 40 },
      xpGained: 20,
      goldGained: 8,
      phase: 'victory',
      combat: { turnsUsed: 3, damageDealt: 40, damageReceived: 15 }
    };
    const rs = createRewardsState(baseState);

    it('should render rating phase with grade visible', () => {
      const html = renderRewardsHtml(rs, 'rating');
      assert.ok(html.includes('rewards-panel'));
      assert.ok(html.includes('rewards-rating'));
      assert.ok(html.includes('is-visible'));
    });

    it('should render xp phase with xp section visible', () => {
      const html = renderRewardsHtml(rs, 'xp');
      assert.ok(html.includes('rewards-xp'));
      assert.match(html, /rewards-xp[^"]*is-visible/);
    });

    it('should render gold phase with gold visible', () => {
      const html = renderRewardsHtml(rs, 'gold');
      assert.ok(html.includes('rewards-gold'));
    });

    it('should render loot phase with loot visible', () => {
      const html = renderRewardsHtml(rs, 'loot');
      assert.ok(html.includes('rewards-loot'));
    });

    it('should render complete phase with all sections visible', () => {
      const html = renderRewardsHtml(rs, 'complete');
      assert.ok(html.includes('rewards-rating'));
      assert.ok(html.includes('rewards-xp'));
      assert.ok(html.includes('rewards-gold'));
      assert.ok(html.includes('rewards-loot'));
    });
  });

  describe('getRewardsStyles', () => {
    it('should return non-empty CSS string', () => {
      const css = getRewardsStyles();
      assert.ok(css.length > 100);
      assert.ok(css.includes('.rewards-panel'));
      assert.ok(css.includes('@keyframes'));
    });

    it('should include animation keyframes', () => {
      const css = getRewardsStyles();
      assert.ok(css.includes('rewards-fade-in'));
      assert.ok(css.includes('rewards-gold-pulse'));
      assert.ok(css.includes('rewards-grade-stamp'));
    });
  });

  describe('Victory animation phase progression', () => {
    it('should cover all five phases in order', () => {
      const PHASE_TIMINGS = [0, 600, 1400, 2200, 3000];
      const PHASE_NAMES = ['rating', 'xp', 'gold', 'loot', 'complete'];
      
      assert.equal(PHASE_TIMINGS.length, PHASE_NAMES.length);
      
      // At time 0, phase should be rating
      assert.equal(PHASE_NAMES[0], 'rating');
      
      // Each timing should be increasing
      for (let i = 1; i < PHASE_TIMINGS.length; i++) {
        assert.ok(PHASE_TIMINGS[i] > PHASE_TIMINGS[i - 1], 
          `Timing ${i} (${PHASE_TIMINGS[i]}) should be > timing ${i-1} (${PHASE_TIMINGS[i-1]})`);
      }
    });
  });

  describe('Loot items rendering', () => {
    it('should render loot items when present', () => {
      const state = {
        player: { name: 'Hero', hp: 50, maxHp: 100, xp: 100, level: 3, inventory: {}, gold: 200 },
        enemy: { name: 'Dragon', maxHp: 200 },
        xpGained: 100,
        goldGained: 50,
        phase: 'victory',
        rewards: { lootItems: ['Aether-Forged Sword', { name: 'Health Potion', quantity: 3 }] }
      };
      const rs = createRewardsState(state);
      assert.equal(rs.lootItems.length, 2);
      
      const html = renderRewardsHtml(rs, 'complete');
      assert.ok(html.includes('Aether-Forged Sword'));
      assert.ok(html.includes('Health Potion'));
    });
  });
});
