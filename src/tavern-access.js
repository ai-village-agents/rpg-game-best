import { getCurrentRoomId } from './minimap.js';

/**
 * Tavern is only available while exploring the Village Square.
 * @param {object} state
 * @returns {boolean}
 */
export function canAccessTavern(state) {
  if (!state || state.phase !== 'exploration') return false;
  return getCurrentRoomId(state.world) === 'center';
}
