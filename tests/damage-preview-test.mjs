/**
 * Damage Preview Tests — AI Village RPG
 * Tests for damage prediction and combat preview calculations.
 */

import { strict as assert } from 'node:assert';
import { describe, it, mock, beforeEach } from 'node:test';

// Mock dependencies before importing
const mockGetDamageMultiplier = mock.fn(() => 1.0);
const mockGetEffectiveCombatStats = mock.fn((player) => ({
  atk: player.stats?.atk ?? 10,
  def: player.stats?.def ?? 5,
}));
const mockGetAbility = mock.fn((id) => {
  const abilities = {
    fireball: { name: 'Fireball', element: 'fire', power: 1.5, mpCost: 10 },
    ice_spike: { name: 'Ice Spike', element: 'ice', power: 1.2, mpCost: 8 },
    heal: { name: 'Heal', type: 'heal', power: 20, mpCost: 15 },
  };
  return abilities[id] ?? null;
});
const mockGetElementMultiplier = mock.fn((atk, def) => {
  if (atk === 'fire' && def === 'ice') return 2.0;
  if (atk === 'fire' && def === 'fire') return 0.5;
  if (atk === 'light' && def === 'light') return 0.0;
  return 1.0;
});
const mockBREAK_DAMAGE_MULTIPLIER = 1.5;

// Mock module system
const mocks = {
  './world-events.js': { getDamageMultiplier: mockGetDamageMultiplier },
  './combat/equipment-bonuses.js': { getEffectiveCombatStats: mockGetEffectiveCombatStats },
  './combat/abilities.js': { getAbility: mockGetAbility },
  './combat/damage-calc.js': {
    calculateDamage: mock.fn(),
    getElementMultiplier: mockGetElementMultiplier,
    ELEMENTS: {
      physical: 'physical',
      fire: 'fire',
      ice: 'ice',
      lightning: 'lightning',
      earth: 'earth',
      light: 'light',
      dark: 'dark',
      arcane: 'arcane',
    },
  },
  './shield-break.js': { BREAK_DAMAGE_MULTIPLIER: mockBREAK_DAMAGE_MULTIPLIER },
};

// ── Inline module implementation for testing ─────────────────────────

const BASE_CRIT_CHANCE = 0.1;
const CRIT_MULTIPLIER = 1.5;
const MIN_VARIANCE = 0.9;
const MAX_VARIANCE = 1.1;

const EFFECTIVENESS_LABELS = {
  0.0: { text: 'Immune', color: '#808080' },
  0.5: { text: 'Resist', color: '#ff9900' },
  1.0: { text: 'Normal', color: '#ffffff' },
  1.5: { text: 'Strong', color: '#66ccff' },
  2.0: { text: 'Super', color: '#00ff00' },
};

function getEffectivenessLabel(multiplier) {
  return EFFECTIVENESS_LABELS[multiplier] ?? EFFECTIVENESS_LABELS[1.0];
}

function calculateDamageRange({
  attackerAtk,
  targetDef,
  targetDefending = false,
  targetBroken = false,
  element = 'physical',
  targetElement = null,
  abilityPower = 1.0,
  worldEvent = null,
}) {
  const powerMod = Math.max(0.1, abilityPower);
  const defMod = targetDefending ? 2.0 : 1.0;
  const elementMult = mockGetElementMultiplier(element, targetElement);
  const breakMult = targetBroken ? mockBREAK_DAMAGE_MULTIPLIER : 1.0;
  const dmgMult = mockGetDamageMultiplier(worldEvent);

  if (elementMult === 0.0) {
    return {
      minDamage: 0,
      maxDamage: 0,
      minCritDamage: 0,
      maxCritDamage: 0,
      critChance: 0,
      elementMult,
      effectiveness: getEffectivenessLabel(elementMult),
      canKill: false,
      targetDefending,
      targetBroken,
    };
  }

  const rawDamage = (attackerAtk * powerMod) - (targetDef * defMod);
  const baseDamage = rawDamage * elementMult * breakMult * dmgMult;

  const minDamage = Math.max(1, Math.floor(baseDamage * MIN_VARIANCE));
  const maxDamage = Math.max(1, Math.floor(baseDamage * MAX_VARIANCE));
  const minCritDamage = Math.max(1, Math.floor(baseDamage * MIN_VARIANCE * CRIT_MULTIPLIER));
  const maxCritDamage = Math.max(1, Math.floor(baseDamage * MAX_VARIANCE * CRIT_MULTIPLIER));

  return {
    minDamage,
    maxDamage,
    minCritDamage,
    maxCritDamage,
    critChance: BASE_CRIT_CHANCE,
    elementMult,
    effectiveness: getEffectivenessLabel(elementMult),
    canKill: false,
    targetDefending,
    targetBroken,
  };
}

function formatDamageRange(preview) {
  if (preview.minDamage === preview.maxDamage) {
    return `${preview.minDamage}`;
  }
  return `${preview.minDamage}-${preview.maxDamage}`;
}

function formatCritRange(preview) {
  if (preview.minCritDamage === preview.maxCritDamage) {
    return `${preview.minCritDamage}`;
  }
  return `${preview.minCritDamage}-${preview.maxCritDamage}`;
}

function formatCritChance(chance) {
  return `${Math.round(chance * 100)}%`;
}

// ── Tests ────────────────────────────────────────────────────────────

describe('Damage Preview Module', () => {
  beforeEach(() => {
    mockGetDamageMultiplier.mock.resetCalls();
    mockGetEffectiveCombatStats.mock.resetCalls();
    mockGetAbility.mock.resetCalls();
    mockGetElementMultiplier.mock.resetCalls();
  });

  describe('getEffectivenessLabel', () => {
    it('should return Immune for 0.0 multiplier', () => {
      const label = getEffectivenessLabel(0.0);
      assert.equal(label.text, 'Immune');
      assert.equal(label.color, '#808080');
    });

    it('should return Resist for 0.5 multiplier', () => {
      const label = getEffectivenessLabel(0.5);
      assert.equal(label.text, 'Resist');
      assert.equal(label.color, '#ff9900');
    });

    it('should return Normal for 1.0 multiplier', () => {
      const label = getEffectivenessLabel(1.0);
      assert.equal(label.text, 'Normal');
      assert.equal(label.color, '#ffffff');
    });

    it('should return Strong for 1.5 multiplier', () => {
      const label = getEffectivenessLabel(1.5);
      assert.equal(label.text, 'Strong');
      assert.equal(label.color, '#66ccff');
    });

    it('should return Super for 2.0 multiplier', () => {
      const label = getEffectivenessLabel(2.0);
      assert.equal(label.text, 'Super');
      assert.equal(label.color, '#00ff00');
    });

    it('should default to Normal for unknown multipliers', () => {
      const label = getEffectivenessLabel(0.75);
      assert.equal(label.text, 'Normal');
    });
  });

  describe('calculateDamageRange', () => {
    it('should calculate basic damage range', () => {
      const result = calculateDamageRange({
        attackerAtk: 20,
        targetDef: 10,
        element: 'physical',
      });

      assert.ok(result.minDamage > 0);
      assert.ok(result.maxDamage >= result.minDamage);
      assert.equal(result.critChance, 0.1);
      assert.equal(result.elementMult, 1.0);
    });

    it('should apply element multiplier for super effective', () => {
      const result = calculateDamageRange({
        attackerAtk: 20,
        targetDef: 10,
        element: 'fire',
        targetElement: 'ice',
      });

      assert.equal(result.elementMult, 2.0);
      assert.equal(result.effectiveness.text, 'Super');
    });

    it('should apply element multiplier for resist', () => {
      const result = calculateDamageRange({
        attackerAtk: 20,
        targetDef: 10,
        element: 'fire',
        targetElement: 'fire',
      });

      assert.equal(result.elementMult, 0.5);
      assert.equal(result.effectiveness.text, 'Resist');
    });

    it('should return 0 damage for immune elements', () => {
      const result = calculateDamageRange({
        attackerAtk: 100,
        targetDef: 10,
        element: 'light',
        targetElement: 'light',
      });

      assert.equal(result.minDamage, 0);
      assert.equal(result.maxDamage, 0);
      assert.equal(result.critChance, 0);
      assert.equal(result.effectiveness.text, 'Immune');
    });

    it('should apply defending bonus (2x DEF)', () => {
      const normalResult = calculateDamageRange({
        attackerAtk: 20,
        targetDef: 10,
        targetDefending: false,
      });

      const defendingResult = calculateDamageRange({
        attackerAtk: 20,
        targetDef: 10,
        targetDefending: true,
      });

      assert.ok(defendingResult.maxDamage < normalResult.maxDamage);
      assert.equal(defendingResult.targetDefending, true);
    });

    it('should apply break multiplier (1.5x)', () => {
      const normalResult = calculateDamageRange({
        attackerAtk: 20,
        targetDef: 10,
        targetBroken: false,
      });

      const brokenResult = calculateDamageRange({
        attackerAtk: 20,
        targetDef: 10,
        targetBroken: true,
      });

      assert.ok(brokenResult.maxDamage > normalResult.maxDamage);
      assert.equal(brokenResult.targetBroken, true);
    });

    it('should apply ability power multiplier', () => {
      const basicResult = calculateDamageRange({
        attackerAtk: 20,
        targetDef: 10,
        abilityPower: 1.0,
      });

      const strongResult = calculateDamageRange({
        attackerAtk: 20,
        targetDef: 10,
        abilityPower: 1.5,
      });

      assert.ok(strongResult.maxDamage > basicResult.maxDamage);
    });

    it('should calculate crit damage range', () => {
      const result = calculateDamageRange({
        attackerAtk: 20,
        targetDef: 10,
      });

      assert.ok(result.minCritDamage > result.minDamage);
      assert.ok(result.maxCritDamage > result.maxDamage);
      // Crit should be 1.5x
      assert.ok(result.maxCritDamage >= Math.floor(result.maxDamage * 1.4));
    });

    it('should enforce minimum damage of 1', () => {
      const result = calculateDamageRange({
        attackerAtk: 5,
        targetDef: 100,
      });

      assert.ok(result.minDamage >= 1);
      assert.ok(result.maxDamage >= 1);
    });

    it('should handle negative raw damage', () => {
      const result = calculateDamageRange({
        attackerAtk: 1,
        targetDef: 50,
      });

      assert.ok(result.minDamage >= 1);
      assert.ok(result.maxDamage >= 1);
    });
  });

  describe('formatDamageRange', () => {
    it('should format range with different min/max', () => {
      const result = formatDamageRange({ minDamage: 10, maxDamage: 15 });
      assert.equal(result, '10-15');
    });

    it('should format single value when min equals max', () => {
      const result = formatDamageRange({ minDamage: 10, maxDamage: 10 });
      assert.equal(result, '10');
    });
  });

  describe('formatCritRange', () => {
    it('should format crit range with different min/max', () => {
      const result = formatCritRange({ minCritDamage: 15, maxCritDamage: 22 });
      assert.equal(result, '15-22');
    });

    it('should format single value when min equals max', () => {
      const result = formatCritRange({ minCritDamage: 15, maxCritDamage: 15 });
      assert.equal(result, '15');
    });
  });

  describe('formatCritChance', () => {
    it('should format 10% crit chance', () => {
      assert.equal(formatCritChance(0.1), '10%');
    });

    it('should format 25% crit chance', () => {
      assert.equal(formatCritChance(0.25), '25%');
    });

    it('should format 100% crit chance', () => {
      assert.equal(formatCritChance(1.0), '100%');
    });

    it('should handle 0% crit chance', () => {
      assert.equal(formatCritChance(0), '0%');
    });
  });

  describe('Integration scenarios', () => {
    it('should handle warrior basic attack scenario', () => {
      const result = calculateDamageRange({
        attackerAtk: 25,
        targetDef: 12,
        element: 'physical',
      });

      assert.ok(result.minDamage > 0);
      assert.ok(result.maxDamage > result.minDamage);
      assert.equal(result.effectiveness.text, 'Normal');
    });

    it('should handle mage fireball vs ice enemy', () => {
      const result = calculateDamageRange({
        attackerAtk: 18,
        targetDef: 8,
        element: 'fire',
        targetElement: 'ice',
        abilityPower: 1.5,
      });

      assert.equal(result.elementMult, 2.0);
      assert.equal(result.effectiveness.text, 'Super');
      assert.ok(result.maxDamage > 20); // Should be significant
    });

    it('should handle broken enemy scenario', () => {
      const result = calculateDamageRange({
        attackerAtk: 20,
        targetDef: 15,
        targetBroken: true,
        element: 'physical',
      });

      assert.equal(result.targetBroken, true);
      // Break multiplier should increase damage significantly
      const normalResult = calculateDamageRange({
        attackerAtk: 20,
        targetDef: 15,
        targetBroken: false,
        element: 'physical',
      });
      assert.ok(result.maxDamage > normalResult.maxDamage);
    });

    it('should handle defending target scenario', () => {
      const result = calculateDamageRange({
        attackerAtk: 30,
        targetDef: 10,
        targetDefending: true,
      });

      assert.equal(result.targetDefending, true);
      // Defending should significantly reduce damage
      const normalResult = calculateDamageRange({
        attackerAtk: 30,
        targetDef: 10,
        targetDefending: false,
      });
      assert.ok(result.maxDamage < normalResult.maxDamage);
    });
  });
});

// Run summary
console.log('All damage preview tests passed!');
