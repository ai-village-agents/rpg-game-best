import test from 'node:test';
import assert from 'node:assert/strict';

import { canAccessTavern, canAccessVillageSquareActivity } from '../src/tavern-access.js';
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

test('canAccessVillageSquareActivity is true in Millbrook Crossing exploration and false otherwise', () => {
  assert.equal(canAccessVillageSquareActivity(createState()), true);
  assert.equal(canAccessVillageSquareActivity(createState({ world: { roomRow: 0, roomCol: 0 } })), false);
  assert.equal(canAccessVillageSquareActivity(createState({ phase: 'player-turn' })), false);
});

test('handleUIAction VIEW_TAVERN, VIEW_BOUNTY_BOARD, and OPEN_ARENA open in Millbrook Crossing', () => {
  const state = createState();
  const tavern = handleUIAction(state, { type: 'VIEW_TAVERN' });
  const bounty = handleUIAction(state, { type: 'VIEW_BOUNTY_BOARD' });
  const arena = handleUIAction(state, { type: 'OPEN_ARENA' });

  assert.ok(tavern);
  assert.equal(tavern.phase, 'tavern-dice');
  assert.equal(tavern.previousPhase, 'exploration');

  assert.ok(bounty);
  assert.equal(bounty.phase, 'bounty-board');
  assert.equal(bounty.previousPhase, 'exploration');

  assert.ok(arena);
  assert.equal(arena.phase, 'arena');
});

test('handleUIAction VIEW_TAVERN, VIEW_BOUNTY_BOARD, and OPEN_ARENA return null outside Millbrook Crossing', () => {
  const state = createState({ world: { roomRow: 0, roomCol: 0 } });
  assert.equal(handleUIAction(state, { type: 'VIEW_TAVERN' }), null);
  assert.equal(handleUIAction(state, { type: 'VIEW_BOUNTY_BOARD' }), null);
  assert.equal(handleUIAction(state, { type: 'OPEN_ARENA' }), null);
});
