/**
 * Map / World System Tests — AI Village RPG
 * Run: node tests/map-test.mjs
 */

import {
  DEFAULT_WORLD_DATA,
  WorldMap,
  createWorldState,
  movePlayer,
  travelToAdjacentRoom,
  getAdjacentRoom,
  getExitPreview,
  getExitPreviews,
} from '../src/map.js';

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) {
    passed++;
    console.log('  PASS: ' + msg);
  } else {
    failed++;
    console.error('  FAIL: ' + msg);
  }
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

const ROOM_W = DEFAULT_WORLD_DATA.roomWidth;
const ROOM_H = DEFAULT_WORLD_DATA.roomHeight;
const MID_X = Math.floor(ROOM_W / 2);
const MID_Y = Math.floor(ROOM_H / 2);

console.log('\n--- World state creation ---');
{
  const state = createWorldState();
  assert(state.roomRow === DEFAULT_WORLD_DATA.startRoom.row, 'Starts in default roomRow');
  assert(state.roomCol === DEFAULT_WORLD_DATA.startRoom.col, 'Starts in default roomCol');
  assert(state.x === DEFAULT_WORLD_DATA.startPosition.x, 'Starts at default x');
  assert(state.y === DEFAULT_WORLD_DATA.startPosition.y, 'Starts at default y');
}

console.log('\n--- Persisted state validation ---');
{
  // Out-of-range room should snap back to defaults.
  const badRoom = new WorldMap(DEFAULT_WORLD_DATA, { roomRow: 999, roomCol: 999, x: MID_X, y: MID_Y }).snapshot();
  assert(
    deepEqual(badRoom, {
      roomRow: DEFAULT_WORLD_DATA.startRoom.row,
      roomCol: DEFAULT_WORLD_DATA.startRoom.col,
      x: DEFAULT_WORLD_DATA.startPosition.x,
      y: DEFAULT_WORLD_DATA.startPosition.y,
    }),
    'Invalid room snaps to default state'
  );

  // A blocked tile should snap back (e.g., 0,0 is a perimeter wall).
  const blockedTile = new WorldMap(DEFAULT_WORLD_DATA, {
    roomRow: DEFAULT_WORLD_DATA.startRoom.row,
    roomCol: DEFAULT_WORLD_DATA.startRoom.col,
    x: 0,
    y: 0,
  }).snapshot();
  assert(blockedTile.x === DEFAULT_WORLD_DATA.startPosition.x, 'Blocked tile -> default x');
  assert(blockedTile.y === DEFAULT_WORLD_DATA.startPosition.y, 'Blocked tile -> default y');

  // A position just outside bounds should be clamped (if clamped spot is not blocked).
  const clamped = new WorldMap(DEFAULT_WORLD_DATA, {
    roomRow: DEFAULT_WORLD_DATA.startRoom.row,
    roomCol: DEFAULT_WORLD_DATA.startRoom.col,
    x: ROOM_W + 999,
    y: ROOM_H + 999,
  }).snapshot();

  assert(clamped.x >= 0 && clamped.x < ROOM_W, 'Clamps x into room bounds');
  assert(clamped.y >= 0 && clamped.y < ROOM_H, 'Clamps y into room bounds');
}

console.log('\n--- Movement within room ---');
{
  // Place near west wall but not on it.
  const world = new WorldMap(DEFAULT_WORLD_DATA, {
    roomRow: 1,
    roomCol: 1,
    x: 1,
    y: 1,
  });

  const before = world.snapshot();
  const west = world.move('west');
  assert(west.moved, 'Wall slide occurs when near door midpoint');
  assert(!west.blocked, 'No collision reported on wall slide');
  assert(!deepEqual(world.snapshot(), before), 'State changes on wall slide');
  assert(world.snapshot().y === 2, 'Slides toward door midpoint on west move');

  const farFromDoor = new WorldMap(DEFAULT_WORLD_DATA, {
    roomRow: 1,
    roomCol: 1,
    x: 1,
    y: 1,
  });
  const north = farFromDoor.move('north');
  assert(!north.moved, 'No wall slide when far from door midpoint');
  assert(north.blocked === 'collision', 'Wall collision reported when slide does not apply');
  assert(farFromDoor.snapshot().y === 1, 'State unchanged on blocked north move');

  const south = world.move('south');
  assert(south.moved, 'Can move south into open tile');
  assert(world.snapshot().y === 3, 'Y increments on south move');
}

console.log('\n--- Invalid direction ---');
{
  const world = new WorldMap(DEFAULT_WORLD_DATA);
  const res = world.move('up');
  assert(!res.moved, 'Invalid direction does not move');
  assert(res.blocked === 'invalid-direction', 'Invalid direction blocked reason');
}

console.log('\n--- Room transitions ---');
{
  // Transition north from the center room using the opened north edge.
  const startState = {
    roomRow: 1,
    roomCol: 1,
    x: MID_X,
    y: 0,
  };

  const res = movePlayer(startState, 'north');
  assert(res.moved, 'Moved on north transition');
  assert(res.transitioned, 'Transitioned to another room');
  assert(res.worldState.roomRow === 0, 'Room row decremented when moving north');
  assert(res.worldState.roomCol === 1, 'Room col unchanged when moving north');
  assert(res.worldState.x === MID_X, 'X preserved across transition');
  assert(res.worldState.y === ROOM_H - 2, 'Y set to opposite edge on transition');
  assert(res.room !== null && typeof res.room.name === 'string', 'movePlayer returns current room object');

  // Edge of world: attempt to go north again from top row should fail.
  const res2 = movePlayer({ ...res.worldState, x: MID_X, y: 0 }, 'north');
  assert(!res2.moved, 'No move when transitioning past world edge');
  assert(res2.blocked === 'edge', 'Blocked reason is edge at world boundary');
  assert(!res2.transitioned, 'No transition at world boundary');
}

console.log('\n--- Blocked transition entry slides in target room ---');
{
  function makeRoom() {
    const collision = Array.from({ length: ROOM_H }, () => Array.from({ length: ROOM_W }, () => 0));
    for (let x = 0; x < ROOM_W; x += 1) {
      collision[0][x] = 1;
      collision[ROOM_H - 1][x] = 1;
    }
    for (let y = 0; y < ROOM_H; y += 1) {
      collision[y][0] = 1;
      collision[y][ROOM_W - 1] = 1;
    }
    for (let col = MID_X - 1; col <= MID_X + 1; col += 1) {
      collision[0][col] = 0;
      collision[1][col] = 0;
      collision[ROOM_H - 1][col] = 0;
      collision[ROOM_H - 2][col] = 0;
    }
    for (let row = MID_Y - 1; row <= MID_Y + 1; row += 1) {
      collision[row][0] = 0;
      collision[row][1] = 0;
      collision[row][ROOM_W - 1] = 0;
      collision[row][ROOM_W - 2] = 0;
    }
    return { id: 'test', name: 'Test Room', collision };
  }

  const sourceRoom = makeRoom();
  const targetRoom = makeRoom();
  targetRoom.collision[ROOM_H - 2][MID_X] = 1;
  targetRoom.collision[ROOM_H - 2][MID_X - 1] = 0;

  const worldData = {
    ...DEFAULT_WORLD_DATA,
    rooms: [
      [null, targetRoom, null],
      [null, sourceRoom, null],
      [null, null, null],
    ],
    startRoom: { row: 1, col: 1 },
    startPosition: { x: MID_X, y: 0 },
  };

  const res = movePlayer({ roomRow: 1, roomCol: 1, x: MID_X, y: 0 }, 'north', worldData);
  assert(res.moved, 'Blocked target entry still moves via target-room slide');
  assert(res.transitioned, 'Blocked target entry still transitions rooms');
  assert(res.worldState.roomRow === 0 && res.worldState.roomCol === 1, 'Arrives in target room after slide');
  assert(res.worldState.y === ROOM_H - 2, 'Keeps expected entry depth after slide');
  assert(res.worldState.x !== MID_X, 'Adjusts lane position when exact entry tile is blocked');
}

console.log('\n--- Direct adjacent travel helper ---');
{
  const startState = {
    roomRow: 1,
    roomCol: 1,
    x: 1,
    y: 1,
  };
  const res = travelToAdjacentRoom(startState, 'north');
  assert(res.moved, 'Direct adjacent travel moves immediately');
  assert(res.transitioned, 'Direct adjacent travel always transitions when adjacent exists');
  assert(res.worldState.roomRow === 0 && res.worldState.roomCol === 1, 'Moves to adjacent north room');
  assert(res.worldState.y === ROOM_H - 2, 'Enters north destination from opposite edge');
  assert(res.worldState.x === MID_X - 1, 'Entry lane aligns/clamps like normal transition');

  const edgeState = { roomRow: 0, roomCol: 1, x: MID_X, y: MID_Y };
  const blocked = travelToAdjacentRoom(edgeState, 'north');
  assert(!blocked.moved, 'Direct adjacent travel does not move when no adjacent room exists');
  assert(blocked.blocked === 'edge', 'Direct adjacent travel reports edge when no adjacent room');
}

console.log('\n--- Exit preview helpers ---');
{
  const centerAligned = { roomRow: 1, roomCol: 1, x: MID_X, y: MID_Y };
  const northPreview = getExitPreview(centerAligned, 'north');
  assert(northPreview.available, 'North preview available from center room');
  assert(northPreview.roomName === 'The Shimmer Trail', 'North preview includes adjacent room name');
  assert(northPreview.aligned, 'North preview aligned when x is in doorway lane');
  assert(!northPreview.ready, 'North preview not ready while away from edge');

  const northReady = getExitPreview({ roomRow: 1, roomCol: 1, x: MID_X, y: 1 }, 'north');
  assert(northReady.aligned, 'North ready check remains aligned at doorway lane');
  assert(northReady.ready, 'North preview ready on doorway edge tile');

  const northMisaligned = getExitPreview({ roomRow: 1, roomCol: 1, x: MID_X - 2, y: 1 }, 'north');
  assert(!northMisaligned.aligned, 'North preview not aligned outside doorway lane');
  assert(!northMisaligned.ready, 'North preview not ready when not aligned');

  const eastReady = getExitPreview({ roomRow: 1, roomCol: 1, x: ROOM_W - 2, y: MID_Y - 1 }, 'east');
  assert(eastReady.aligned, 'East preview aligned for center doorway lane y');
  assert(eastReady.ready, 'East preview ready on doorway edge tile');

  const westReady = getExitPreview({ roomRow: 1, roomCol: 1, x: 1, y: MID_Y }, 'west');
  assert(westReady.aligned, 'West preview aligned for center doorway lane y');
  assert(westReady.ready, 'West preview ready on doorway edge tile');

  const blockedNorth = getExitPreview({ roomRow: 0, roomCol: 0, x: MID_X, y: 1 }, 'north');
  assert(!blockedNorth.available, 'Preview unavailable when no adjacent room exists');
  assert(blockedNorth.roomName === null, 'Preview roomName null when exit is unavailable');

  const adjacentSouth = getAdjacentRoom({ roomRow: 0, roomCol: 0, x: MID_X, y: MID_Y }, 'south');
  assert(adjacentSouth?.name === 'Traders Rift', 'Adjacent south room resolves correctly');

  const previews = getExitPreviews({ roomRow: 0, roomCol: 0, x: MID_X, y: MID_Y });
  assert(previews.east.available, 'East preview available in northwest corner room');
  assert(previews.south.available, 'South preview available in northwest corner room');
  assert(!previews.north.available, 'North preview unavailable in northwest corner room');
  assert(!previews.west.available, 'West preview unavailable in northwest corner room');
}

console.log('\n========================================');
console.log('Results: ' + passed + ' passed, ' + failed + ' failed');
console.log('========================================');

if (failed > 0) process.exit(1);
