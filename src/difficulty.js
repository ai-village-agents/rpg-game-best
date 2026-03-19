/**
 * Difficulty Settings Module
 * Manages game-wide difficulty levels that affect enemy stats, XP, and gold rewards.
 * Created by Claude Opus 4.5 (Day 345)
 */

/**
 * Available difficulty levels
 */
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  NORMAL: 'normal',
  HARD: 'hard',
  NIGHTMARE: 'nightmare',
};

/**
 * Difficulty level display names
 */
export const DIFFICULTY_NAMES = {
  [DIFFICULTY_LEVELS.EASY]: 'Easy',
  [DIFFICULTY_LEVELS.NORMAL]: 'Normal',
  [DIFFICULTY_LEVELS.HARD]: 'Hard',
  [DIFFICULTY_LEVELS.NIGHTMARE]: 'Nightmare',
};

/**
 * Difficulty level descriptions
 */
export const DIFFICULTY_DESCRIPTIONS = {
  [DIFFICULTY_LEVELS.EASY]: 'Enemies deal 15% less damage and have 15% less HP. A forgiving experience.',
  [DIFFICULTY_LEVELS.NORMAL]: 'The standard experience. A fair but noticeable challenge.',
  [DIFFICULTY_LEVELS.HARD]: 'Enemies deal 35% more damage and have 40% more HP. XP and gold rewards increased by 25%.',
  [DIFFICULTY_LEVELS.NIGHTMARE]: 'Enemies deal 75% more damage and have 80% more HP. XP and gold rewards increased by 60%. Pure suffering!',
};

/**
 * Difficulty multipliers for various game aspects
 * @type {Object.<string, {enemyDamage: number, enemyHp: number, xpReward: number, goldReward: number}>}
 */
export const DIFFICULTY_MULTIPLIERS = {
  [DIFFICULTY_LEVELS.EASY]: {
    enemyDamage: 0.85,
    enemyHp: 0.85,
    xpReward: 1.0,
    goldReward: 1.0,
  },
  [DIFFICULTY_LEVELS.NORMAL]: {
    enemyDamage: 1.0,
    enemyHp: 1.0,
    xpReward: 1.0,
    goldReward: 1.0,
  },
  [DIFFICULTY_LEVELS.HARD]: {
    enemyDamage: 1.35,
    enemyHp: 1.40,
    xpReward: 1.25,
    goldReward: 1.25,
  },
  [DIFFICULTY_LEVELS.NIGHTMARE]: {
    enemyDamage: 1.75,
    enemyHp: 1.80,
    xpReward: 1.60,
    goldReward: 1.60,
  },
};

/**
 * Default difficulty level
 */
export const DEFAULT_DIFFICULTY = DIFFICULTY_LEVELS.NORMAL;

/**
 * Get the display name for a difficulty level
 * @param {string} difficulty - Difficulty level key
 * @returns {string} Display name
 */
export function getDifficultyName(difficulty) {
  return DIFFICULTY_NAMES[difficulty] || DIFFICULTY_NAMES[DEFAULT_DIFFICULTY];
}

/**
 * Get the description for a difficulty level
 * @param {string} difficulty - Difficulty level key
 * @returns {string} Description
 */
export function getDifficultyDescription(difficulty) {
  return DIFFICULTY_DESCRIPTIONS[difficulty] || DIFFICULTY_DESCRIPTIONS[DEFAULT_DIFFICULTY];
}

/**
 * Get multipliers for a difficulty level
 * @param {string} difficulty - Difficulty level key
 * @returns {Object} Multipliers object
 */
export function getDifficultyMultipliers(difficulty) {
  return DIFFICULTY_MULTIPLIERS[difficulty] || DIFFICULTY_MULTIPLIERS[DEFAULT_DIFFICULTY];
}

/**
 * Apply difficulty multiplier to enemy HP
 * @param {number} baseHp - Base enemy HP
 * @param {string} difficulty - Current difficulty level
 * @returns {number} Adjusted HP (rounded)
 */
export function applyDifficultyToEnemyHp(baseHp, difficulty) {
  const multipliers = getDifficultyMultipliers(difficulty);
  return Math.round(baseHp * multipliers.enemyHp);
}

/**
 * Apply difficulty multiplier to enemy damage
 * @param {number} baseDamage - Base damage amount
 * @param {string} difficulty - Current difficulty level
 * @returns {number} Adjusted damage (rounded)
 */
export function applyDifficultyToEnemyDamage(baseDamage, difficulty) {
  const multipliers = getDifficultyMultipliers(difficulty);
  return Math.round(baseDamage * multipliers.enemyDamage);
}

/**
 * Apply difficulty multiplier to XP reward
 * @param {number} baseXp - Base XP reward
 * @param {string} difficulty - Current difficulty level
 * @returns {number} Adjusted XP (rounded)
 */
export function applyDifficultyToXpReward(baseXp, difficulty) {
  const multipliers = getDifficultyMultipliers(difficulty);
  return Math.round(baseXp * multipliers.xpReward);
}

/**
 * Apply difficulty multiplier to gold reward
 * @param {number} baseGold - Base gold reward
 * @param {string} difficulty - Current difficulty level
 * @returns {number} Adjusted gold (rounded)
 */
export function applyDifficultyToGoldReward(baseGold, difficulty) {
  const multipliers = getDifficultyMultipliers(difficulty);
  return Math.round(baseGold * multipliers.goldReward);
}

/**
 * Validate if a difficulty level is valid
 * @param {string} difficulty - Difficulty level to validate
 * @returns {boolean} True if valid
 */
export function isValidDifficulty(difficulty) {
  return Object.values(DIFFICULTY_LEVELS).includes(difficulty);
}

/**
 * Get all available difficulty levels as an array
 * @returns {Array<{id: string, name: string, description: string, multipliers: Object}>}
 */
export function getAllDifficultyLevels() {
  return Object.values(DIFFICULTY_LEVELS).map(level => ({
    id: level,
    name: getDifficultyName(level),
    description: getDifficultyDescription(level),
    multipliers: getDifficultyMultipliers(level),
  }));
}

/**
 * Get difficulty icon/emoji for display
 * @param {string} difficulty - Difficulty level
 * @returns {string} Emoji icon
 */
export function getDifficultyIcon(difficulty) {
  switch (difficulty) {
    case DIFFICULTY_LEVELS.EASY:
      return '🌱';
    case DIFFICULTY_LEVELS.NORMAL:
      return '⚔️';
    case DIFFICULTY_LEVELS.HARD:
      return '🔥';
    case DIFFICULTY_LEVELS.NIGHTMARE:
      return '💀';
    default:
      return '⚔️';
  }
}

/**
 * Get a color for difficulty level (for UI)
 * @param {string} difficulty - Difficulty level
 * @returns {string} CSS color
 */
export function getDifficultyColor(difficulty) {
  switch (difficulty) {
    case DIFFICULTY_LEVELS.EASY:
      return '#4ade80'; // Green
    case DIFFICULTY_LEVELS.NORMAL:
      return '#60a5fa'; // Blue
    case DIFFICULTY_LEVELS.HARD:
      return '#f97316'; // Orange
    case DIFFICULTY_LEVELS.NIGHTMARE:
      return '#ef4444'; // Red
    default:
      return '#60a5fa';
  }
}
