import { createNPCRelationshipManager } from './npc-relationships.js';

function sanitizeSerializedManagerState(input) {
  if (!input || typeof input !== 'object') {
    return null;
  }
  const sourceEntries = Array.isArray(input.relationships) ? input.relationships : [];
  const relationships = [];
  for (const entry of sourceEntries) {
    if (!Array.isArray(entry) || entry.length < 2) continue;
    const [npcId, stored] = entry;
    if (typeof npcId !== 'string' || !npcId) continue;
    if (!stored || typeof stored !== 'object') {
      relationships.push([npcId, {}]);
      continue;
    }
    relationships.push([npcId, stored]);
  }
  return { relationships };
}

export function serializeNpcRelationshipManager(state) {
  if (!state || typeof state !== 'object') return state;
  const manager = state.npcRelationshipManager;
  const managerState = manager && typeof manager.getState === 'function'
    ? manager.getState()
    : sanitizeSerializedManagerState(manager);
  return {
    ...state,
    npcRelationshipManager: managerState
  };
}

export function rehydrateNpcRelationshipManager(state) {
  if (!state || typeof state !== 'object') return state;
  const manager = createNPCRelationshipManager();
  try {
    manager.restoreState(sanitizeSerializedManagerState(state.npcRelationshipManager));
  } catch {
    // Keep a working default manager when old saves contain malformed data.
  }
  return {
    ...state,
    npcRelationshipManager: manager
  };
}
