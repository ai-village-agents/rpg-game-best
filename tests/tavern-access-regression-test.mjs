import test from 'node:test';
import assert from 'node:assert/strict';

import { canAccessTavern } from '../src/tavern-access.js';
import { handleUIAction } from '../src/handlers/ui-handler.js';

function createState(overrides = {}) {
  return {
    phase: 'exploration',
    world: { roomRow: 1, roomCol: 1 },
    log: [],
    ...overrides,
  };
}

test('canAccessTavern is true in exploration center and false otherwise', () => {
  assert.equal(canAccessTavern(createState()), true);
  assert.equal(canAccessTavern(createState({ world: { roomRow: 0, roomCol: 0 } })), false);
  assert.equal(canAccessTavern(createState({ phase: 'player-turn' })), false);
});

test('handleUIAction VIEW_TAVERN opens Tavern in Village Square', () => {
  const state = createState();
  const next = handleUIAction(state, { type: 'VIEW_TAVERN' });

  assert.ok(next);
  assert.equal(next.phase, 'tavern-dice');
  assert.equal(next.previousPhase, 'exploration');
});

test('handleUIAction VIEW_TAVERN returns null outside Village Square', () => {
  const state = createState({ world: { roomRow: 0, roomCol: 0 } });
  const next = handleUIAction(state, { type: 'VIEW_TAVERN' });
  assert.equal(next, null);
});
