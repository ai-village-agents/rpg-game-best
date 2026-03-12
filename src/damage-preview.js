/**
 * Damage Preview Module — AI Village RPG
 * Owner: Opus 4.5 (Claude Code)
 *
 * Provides damage prediction and combat preview calculations
 * to help players make tactical decisions.
 */

import { calculateDamage, getElementMultiplier, ELEMENTS } from './combat/damage-calc.js';
import { getDamageMultiplier } from './world-events.js';
import { getEffectiveCombatStats } from './combat/equipment-bonuses.js';
import { getAbility } from './combat/abilities.js';
import { BREAK_DAMAGE_MULTIPLIER } from './shield-break.js';

// ── Constants ────────────────────────────────────────────────────────

const BASE_CRIT_CHANCE = 0.1; // 10% base critical hit chance
const CRIT_MULTIPLIER = 1.5;
const MIN_VARIANCE = 0.9;
const MAX_VARIANCE = 1.1;

// ── Effectiveness Labels ─────────────────────────────────────────────

const EFFECTIVENESS_LABELS = {
  0.0: { text: 'Immune', color: '#808080' },
  0.5: { text: 'Resist', color: '#ff9900' },
  1.0: { text: 'Normal', color: '#ffffff' },
  1.5: { text: 'Strong', color: '#66ccff' },
  2.0: { text: 'Super', color: '#00ff00' },
};

export function getEffectivenessLabel(multiplier) {
  return EFFECTIVENESS_LABELS[multiplier] ?? EFFECTIVENESS_LABELS[1.0];
}

// ── Damage Range Calculation ─────────────────────────────────────────

/**
 * Calculate the expected damage range for an attack.
 * Returns min/max damage (non-crit), min/max crit damage, and effectiveness info.
 *
 * @param {Object} params
 * @param {number} params.attackerAtk - Attacker's effective ATK
 * @param {number} params.targetDef - Target's effective DEF
 * @param {boolean} [params.targetDefending] - Is target defending?
 * @param {boolean} [params.targetBroken] - Is target in break state?
 * @param {string} [params.element] - Attack element
 * @param {string} [params.targetElement] - Target's element affinity
 * @param {number} [params.abilityPower] - Ability power multiplier
 * @param {Object} [params.worldEvent] - Current world event
 * @returns {Object} Damage preview data
 */
export function calculateDamageRange({
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
  const elementMult = getElementMultiplier(element, targetElement);
  const breakMult = targetBroken ? BREAK_DAMAGE_MULTIPLIER : 1.0;
  const dmgMult = getDamageMultiplier(worldEvent);

  // Handle immunity
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

  // Base damage calculation
  const rawDamage = (attackerAtk * powerMod) - (targetDef * defMod);
  const baseDamage = rawDamage * elementMult * breakMult * dmgMult;

  // Calculate ranges with variance
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
    canKill: false, // Will be set by preview function
    targetDefending,
    targetBroken,
  };
}

// ── Combat Preview ───────────────────────────────────────────────────

/**
 * Generate a full combat preview for a player action against an enemy.
 *
 * @param {Object} state - Game state
 * @param {string} [actionType] - 'attack' or ability ID
 * @returns {Object|null} Preview data or null if not in combat
 */
export function getCombatPreview(state, actionType = 'attack') {
  if (!state.enemy || !state.player) {
    return null;
  }

  const player = state.player;
  const enemy = state.enemy;
  const playerStats = getEffectiveCombatStats(player);
  const enemyDef = enemy.def ?? enemy.stats?.def ?? 5;
  const enemyElement = enemy.element ?? null;
  const enemyHp = enemy.hp ?? 0;
  const isDefending = enemy.defending ?? false;
  const isBroken = enemy.broken ?? false;

  let element = 'physical';
  let abilityPower = 1.0;
  let abilityName = 'Attack';
  let mpCost = 0;

  // Handle abilities
  if (actionType !== 'attack') {
    const ability = getAbility(actionType);
    if (ability) {
      element = ability.element ?? 'physical';
      abilityPower = ability.power ?? 1.0;
      abilityName = ability.name ?? actionType;
      mpCost = ability.mpCost ?? 0;
    }
  }

  const preview = calculateDamageRange({
    attackerAtk: playerStats.atk,
    targetDef: enemyDef,
    targetDefending: isDefending,
    targetBroken: isBroken,
    element,
    targetElement: enemyElement,
    abilityPower,
    worldEvent: state.worldEvent,
  });

  // Add kill potential info
  preview.canKill = preview.maxCritDamage >= enemyHp;
  preview.guaranteedKill = preview.minDamage >= enemyHp;
  preview.targetHp = enemyHp;
  preview.targetMaxHp = enemy.maxHp ?? enemyHp;
  preview.actionName = abilityName;
  preview.mpCost = mpCost;
  preview.playerMp = player.mp ?? 0;
  preview.canAfford = mpCost <= (player.mp ?? 0);

  return preview;
}

// ── Enemy Attack Preview ─────────────────────────────────────────────

/**
 * Generate a preview of incoming enemy damage.
 *
 * @param {Object} state - Game state
 * @returns {Object|null} Enemy attack preview or null
 */
export function getEnemyAttackPreview(state) {
  if (!state.enemy || !state.player) {
    return null;
  }

  const player = state.player;
  const enemy = state.enemy;
  const playerStats = getEffectiveCombatStats(player);
  const enemyAtk = enemy.atk ?? enemy.stats?.atk ?? 5;
  const enemyElement = enemy.element ?? 'physical';
  const playerHp = player.hp ?? 0;
  const isDefending = player.defending ?? false;

  const preview = calculateDamageRange({
    attackerAtk: enemyAtk,
    targetDef: playerStats.def,
    targetDefending: isDefending,
    targetBroken: false,
    element: enemyElement,
    targetElement: null,
    abilityPower: 1.0,
    worldEvent: state.worldEvent,
  });

  preview.canKill = preview.maxCritDamage >= playerHp;
  preview.guaranteedKill = preview.minDamage >= playerHp;
  preview.targetHp = playerHp;
  preview.targetMaxHp = player.maxHp ?? playerHp;
  preview.actionName = `${enemy.displayName ?? enemy.name} Attack`;
  preview.defendingReducesDamage = true;

  // Calculate defend benefit
  const defendPreview = calculateDamageRange({
    attackerAtk: enemyAtk,
    targetDef: playerStats.def,
    targetDefending: true,
    targetBroken: false,
    element: enemyElement,
    targetElement: null,
    abilityPower: 1.0,
    worldEvent: state.worldEvent,
  });

  preview.damageIfDefending = {
    min: defendPreview.minDamage,
    max: defendPreview.maxDamage,
  };
  preview.damageReduction = preview.maxDamage - defendPreview.maxDamage;

  return preview;
}

// ── Ability Comparison ───────────────────────────────────────────────

/**
 * Compare multiple abilities to help player choose the best action.
 *
 * @param {Object} state - Game state
 * @param {string[]} abilityIds - Array of ability IDs to compare
 * @returns {Object[]} Array of previews sorted by max damage
 */
export function compareAbilities(state, abilityIds) {
  const previews = [];

  // Always include basic attack
  const attackPreview = getCombatPreview(state, 'attack');
  if (attackPreview) {
    attackPreview.id = 'attack';
    previews.push(attackPreview);
  }

  // Add ability previews
  for (const abilityId of abilityIds) {
    const preview = getCombatPreview(state, abilityId);
    if (preview) {
      preview.id = abilityId;
      previews.push(preview);
    }
  }

  // Sort by max damage (descending)
  return previews.sort((a, b) => b.maxDamage - a.maxDamage);
}

// ── Format Helpers ───────────────────────────────────────────────────

/**
 * Format damage range as a string.
 * @param {Object} preview - Preview data from calculateDamageRange
 * @returns {string} Formatted damage range
 */
export function formatDamageRange(preview) {
  if (preview.minDamage === preview.maxDamage) {
    return `${preview.minDamage}`;
  }
  return `${preview.minDamage}-${preview.maxDamage}`;
}

/**
 * Format critical damage range as a string.
 * @param {Object} preview - Preview data
 * @returns {string} Formatted crit damage range
 */
export function formatCritRange(preview) {
  if (preview.minCritDamage === preview.maxCritDamage) {
    return `${preview.minCritDamage}`;
  }
  return `${preview.minCritDamage}-${preview.maxCritDamage}`;
}

/**
 * Format crit chance as percentage string.
 * @param {number} chance - Crit chance 0-1
 * @returns {string} Formatted percentage
 */
export function formatCritChance(chance) {
  return `${Math.round(chance * 100)}%`;
}
