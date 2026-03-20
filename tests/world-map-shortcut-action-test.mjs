import test from 'node:test';
import assert from 'node:assert/strict';

import { createWorldState } from '../src/map.js';
import { createWeatherState } from '../src/weather.js';
import { handleExplorationAction } from '../src/handlers/exploration-handler.js';

test('EXPLORE_ADJACENT transitions immediately and keeps exploration transition side effects', () => {
  const state = {
    phase: 'exploration',
    world: { ...createWorldState(), x: 1, y: 1 },
    visitedRooms: ['center'],
    weatherState: createWeatherState(),
    rngSeed: 123456,
    log: [],
    player: { name: 'Tester', inventory: {} },
  };

  const next = handleExplorationAction(state, { type: 'EXPLORE_ADJACENT', direction: 'north' });

  assert.equal(next.phase, 'exploration');
  assert.equal(next.world.roomRow, 0);
  assert.equal(next.world.roomCol, 1);
  assert.ok(next.visitedRooms.includes('n'), 'adjacent room should be marked visited');
  assert.equal(next.weatherState.totalMoves, 1, 'weather should tick on adjacent travel');
  assert.ok(next.log.some((line) => line.includes('You travel north and arrive at The Shimmer Trail.')));
  assert.ok(next.log.some((line) => line.startsWith('Exits: ')));
  assert.equal(next.journal?.entries?.[0]?.title, 'Discovered The Shimmer Trail');
});

test('EXPLORE_ADJACENT with no adjacent room logs and does not move', () => {
  const state = {
    phase: 'exploration',
    world: { ...createWorldState(), roomRow: 0, roomCol: 1 },
    visitedRooms: ['n'],
    weatherState: createWeatherState(),
    rngSeed: 123456,
    log: [],
    player: { name: 'Tester', inventory: {} },
  };

  const next = handleExplorationAction(state, { type: 'EXPLORE_ADJACENT', direction: 'north' });

  assert.equal(next.world.roomRow, state.world.roomRow);
  assert.equal(next.world.roomCol, state.world.roomCol);
  assert.deepEqual(next.visitedRooms, state.visitedRooms);
  assert.equal(next.weatherState.totalMoves, 0, 'weather should not tick when travel fails');
  assert.ok(next.log.at(-1)?.includes('No adjacent area lies to the north.'));
});
