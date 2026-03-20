import { getCurrentRoomId } from './minimap.js';

/**
 * Town activities are only available while exploring the Millbrook Crossing.
 * @param {object} state
 * @returns {boolean}
 */
export function canAccessVillageSquareActivity(state) {
  if (!state || state.phase !== 'exploration') return false;
  return getCurrentRoomId(state.world) === 'center';
}

/**
 * Tavern shares the Millbrook Crossing activity access rule.
 * @param {object} state
 * @returns {boolean}
 */
export function canAccessTavern(state) {
  return canAccessVillageSquareActivity(state);
}
