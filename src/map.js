const TILE_SIZE = 32;
const WORLD_GRID_WIDTH = 32;
const WORLD_GRID_HEIGHT = 32;
const ROOM_WIDTH = 8;
const ROOM_HEIGHT = 6;

const DIRECTIONS = {
  north: { dx: 0, dy: -1, roomRow: -1, roomCol: 0 },
  south: { dx: 0, dy: 1, roomRow: 1, roomCol: 0 },
  west: { dx: -1, dy: 0, roomRow: 0, roomCol: -1 },
  east: { dx: 1, dy: 0, roomRow: 0, roomCol: 1 },
};

function createGrid(width, height, fill = 0) {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => fill));
}

function addObstacle(grid, x, y, w, h) {
  for (let row = y; row < y + h && row < grid.length; row += 1) {
    for (let col = x; col < x + w && col < grid[0].length; col += 1) {
      grid[row][col] = 1;
    }
  }
}

function openEdge(grid, edge) {
  const midX = Math.floor(ROOM_WIDTH / 2);
  const midY = Math.floor(ROOM_HEIGHT / 2);
  const setOpen = (row, col) => {
    if (
      row >= 0
      && row < ROOM_HEIGHT
      && col >= 0
      && col < ROOM_WIDTH
    ) {
      grid[row][col] = 0;
    }
  };

  if (edge === 'north') {
    for (let col = midX - 1; col <= midX + 1; col += 1) {
      setOpen(0, col);
      setOpen(1, col);
    }
  } else if (edge === 'south') {
    for (let col = midX - 1; col <= midX + 1; col += 1) {
      setOpen(ROOM_HEIGHT - 1, col);
      setOpen(ROOM_HEIGHT - 2, col);
    }
  } else if (edge === 'west') {
    for (let row = midY - 1; row <= midY + 1; row += 1) {
      setOpen(row, 0);
      setOpen(row, 1);
    }
  } else if (edge === 'east') {
    for (let row = midY - 1; row <= midY + 1; row += 1) {
      setOpen(row, ROOM_WIDTH - 1);
      setOpen(row, ROOM_WIDTH - 2);
    }
  }
}

function buildRoom(id, name, obstacles = []) {
  const collision = createGrid(ROOM_WIDTH, ROOM_HEIGHT, 0);

  // Perimeter walls.
  for (let x = 0; x < ROOM_WIDTH; x += 1) {
    collision[0][x] = 1;
    collision[ROOM_HEIGHT - 1][x] = 1;
  }
  for (let y = 0; y < ROOM_HEIGHT; y += 1) {
    collision[y][0] = 1;
    collision[y][ROOM_WIDTH - 1] = 1;
  }

  // Openings for room transitions.
  openEdge(collision, 'north');
  openEdge(collision, 'south');
  openEdge(collision, 'west');
  openEdge(collision, 'east');

  obstacles.forEach(({ x, y, w, h }) => addObstacle(collision, x, y, w, h));

  return { id, name, collision };
}

// Basic 3x3 world layout with light obstruction variety.
const defaultRooms = [
  [
    buildRoom('nw', 'The Whispering Glade', [
      { x: 2, y: 1, w: 1, h: 1 },
      { x: 4, y: 2, w: 1, h: 1 },
    ]),
    buildRoom('n', 'The Shimmer Trail', [
      { x: 3, y: 1, w: 1, h: 3 },
    ]),
    buildRoom('ne', 'Crystalspine Heights', [
      { x: 1, y: 3, w: 1, h: 1 },
      { x: 5, y: 1, w: 1, h: 1 },
    ]),
  ],
  [
    buildRoom('w', 'Traders Rift', [
      { x: 3, y: 2, w: 1, h: 1 },
      { x: 6, y: 4, w: 1, h: 1 },
    ]),
    buildRoom('center', 'Millbrook Crossing', [
      { x: 2, y: 2, w: 1, h: 1 },
      { x: 5, y: 2, w: 1, h: 1 },
      { x: 2, y: 4, w: 1, h: 1 },
    ]),
    buildRoom('e', 'Lumingrass Meadows', [
      { x: 5, y: 1, w: 1, h: 2 },
      { x: 1, y: 4, w: 1, h: 1 },
    ]),
  ],
  [
    buildRoom('sw', 'The Miregloom', [
      { x: 2, y: 3, w: 1, h: 1 },
    ]),
    buildRoom('s', 'Pilgrim Road', [
      { x: 2, y: 3, w: 2, h: 1 },
      { x: 5, y: 2, w: 1, h: 2 },
    ]),
    buildRoom('se', 'Tideglass Harbor', [
      { x: 2, y: 1, w: 1, h: 1 },
      { x: 4, y: 3, w: 1, h: 1 },
    ]),
  ],
];

export const DEFAULT_WORLD_DATA = {
  tileSize: TILE_SIZE,
  worldWidth: WORLD_GRID_WIDTH,
  worldHeight: WORLD_GRID_HEIGHT,
  roomWidth: ROOM_WIDTH,
  roomHeight: ROOM_HEIGHT,
  rooms: defaultRooms,
  startRoom: { row: 1, col: 1 }, // Center room
  startPosition: {
    x: Math.floor(ROOM_WIDTH / 2),
    y: Math.floor(ROOM_HEIGHT / 2),
  },
};

export class WorldMap {
  constructor(worldData = DEFAULT_WORLD_DATA, persistedState = null) {
    this.tileSize = worldData.tileSize ?? TILE_SIZE;
    this.worldWidth = worldData.worldWidth ?? WORLD_GRID_WIDTH;
    this.worldHeight = worldData.worldHeight ?? WORLD_GRID_HEIGHT;
    this.roomWidth = worldData.roomWidth ?? ROOM_WIDTH;
    this.roomHeight = worldData.roomHeight ?? ROOM_HEIGHT;
    this.rooms = worldData.rooms;
    this.grid = createGrid(this.worldWidth, this.worldHeight, 0);

    const baseState = {
      roomRow: worldData.startRoom?.row ?? 0,
      roomCol: worldData.startRoom?.col ?? 0,
      x: worldData.startPosition?.x ?? 0,
      y: worldData.startPosition?.y ?? 0,
    };

    const merged = { ...baseState, ...(persistedState ?? {}) };
    this.state = this._validateState(merged);
  }

  _validateState(nextState) {
    const room = this.rooms[nextState.roomRow]?.[nextState.roomCol];
    const x = Math.max(0, Math.min(this.roomWidth - 1, nextState.x));
    const y = Math.max(0, Math.min(this.roomHeight - 1, nextState.y));
    if (!room || this._isBlocked(room, x, y)) {
      // Fallback to default start position
      const fallbackRow = DEFAULT_WORLD_DATA.startRoom.row;
      const fallbackCol = DEFAULT_WORLD_DATA.startRoom.col;
      const fallbackRoom = this.rooms[fallbackRow]?.[fallbackCol];
      let fx = DEFAULT_WORLD_DATA.startPosition.x;
      let fy = DEFAULT_WORLD_DATA.startPosition.y;
      // If default start is also blocked, search for an open tile nearby
      if (fallbackRoom && this._isBlocked(fallbackRoom, fx, fy)) {
        let found = false;
        for (let radius = 1; radius < Math.max(this.roomWidth, this.roomHeight) && !found; radius++) {
          for (let dy = -radius; dy <= radius && !found; dy++) {
            for (let dx = -radius; dx <= radius && !found; dx++) {
              const cx = fx + dx;
              const cy = fy + dy;
              if (cx >= 0 && cx < this.roomWidth && cy >= 0 && cy < this.roomHeight && !this._isBlocked(fallbackRoom, cx, cy)) {
                fx = cx;
                fy = cy;
                found = true;
              }
            }
          }
        }
      }
      return { roomRow: fallbackRow, roomCol: fallbackCol, x: fx, y: fy };
    }
    return { ...nextState, x, y };
  }

  snapshot() {
    return { ...this.state };
  }

  getCurrentRoom() {
    return this.rooms[this.state.roomRow]?.[this.state.roomCol] ?? null;
  }

  _isInsideRoom(x, y) {
    return x >= 0 && x < this.roomWidth && y >= 0 && y < this.roomHeight;
  }

  _isBlocked(room, x, y) {
    const row = room?.collision?.[y];
    if (!row) return true;
    return row[x] === 1;
  }

  _tryWallSlide(directionKey, room, position = this.state) {
    const direction = DIRECTIONS[directionKey];
    if (!direction) return null;

    const midX = Math.floor(this.roomWidth / 2);
    const midY = Math.floor(this.roomHeight / 2);
    let slideX = position.x;
    let slideY = position.y;

    if (direction.dy !== 0) {
      if (Math.abs(position.x - midX) > 2) return null;
      if (position.x < midX) slideX += 1;
      else if (position.x > midX) slideX -= 1;
      else return null;
    } else if (direction.dx !== 0) {
      if (Math.abs(position.y - midY) > 2) return null;
      if (position.y < midY) slideY += 1;
      else if (position.y > midY) slideY -= 1;
      else return null;
    } else {
      return null;
    }

    if (!this._isInsideRoom(slideX, slideY) || this._isBlocked(room, slideX, slideY)) {
      return null;
    }

    return { x: slideX, y: slideY };
  }

  move(directionKey) {
    const direction = DIRECTIONS[directionKey];
    if (!direction) {
      return { moved: false, blocked: 'invalid-direction', transitioned: false, state: this.snapshot() };
    }

    const room = this.getCurrentRoom();
    const targetX = this.state.x + direction.dx;
    const targetY = this.state.y + direction.dy;

    if (this._isInsideRoom(targetX, targetY)) {
      if (this._isBlocked(room, targetX, targetY)) {
        const slide = this._tryWallSlide(directionKey, room, this.state);
        if (slide) {
          this.state = { ...this.state, ...slide };
          return { moved: true, blocked: null, transitioned: false, state: this.snapshot() };
        }
        return { moved: false, blocked: 'collision', transitioned: false, state: this.snapshot() };
      }
      this.state = { ...this.state, x: targetX, y: targetY };
      return { moved: true, blocked: null, transitioned: false, state: this.snapshot() };
    }

    return this._attemptTransition(directionKey);
  }

  _attemptTransition(directionKey) {
    const direction = DIRECTIONS[directionKey];
    const nextRoomRow = this.state.roomRow + direction.roomRow;
    const nextRoomCol = this.state.roomCol + direction.roomCol;
    const targetRoom = this.rooms[nextRoomRow]?.[nextRoomCol];

    if (!targetRoom) {
      return { moved: false, blocked: 'edge', transitioned: false, state: this.snapshot() };
    }

    // Move to one tile inside the opposite edge of the next room.
    let nextX = this.state.x;
    let nextY = this.state.y;
    if (directionKey === 'north') nextY = this.roomHeight - 2;
    if (directionKey === 'south') nextY = 1;
    if (directionKey === 'west') nextX = this.roomWidth - 2;
    if (directionKey === 'east') nextX = 1;

    if (directionKey === 'north' || directionKey === 'south') {
      const minX = Math.floor(this.roomWidth / 2) - 1;
      const maxX = Math.floor(this.roomWidth / 2) + 1;
      nextX = Math.max(minX, Math.min(maxX, nextX));
    }

    if (directionKey === 'west' || directionKey === 'east') {
      const minY = Math.floor(this.roomHeight / 2) - 1;
      const maxY = Math.floor(this.roomHeight / 2) + 1;
      nextY = Math.max(minY, Math.min(maxY, nextY));
    }

    // Clamp against obstacles on the edge tile; if blocked, stop at boundary.
    if (this._isBlocked(targetRoom, nextX, nextY)) {
      const slide = this._tryWallSlide(directionKey, this.getCurrentRoom(), this.state);
      if (slide) {
        this.state = { ...this.state, ...slide };
        return { moved: true, blocked: null, transitioned: false, state: this.snapshot() };
      }
      return { moved: false, blocked: 'collision', transitioned: false, state: this.snapshot() };
    }

    this.state = {
      roomRow: nextRoomRow,
      roomCol: nextRoomCol,
      x: nextX,
      y: nextY,
    };

    return { moved: true, blocked: null, transitioned: true, state: this.snapshot() };
  }

  travelToAdjacent(directionKey) {
    const direction = DIRECTIONS[directionKey];
    if (!direction) {
      return { moved: false, blocked: 'invalid-direction', transitioned: false, state: this.snapshot() };
    }

    const nextRoomRow = this.state.roomRow + direction.roomRow;
    const nextRoomCol = this.state.roomCol + direction.roomCol;
    const targetRoom = this.rooms[nextRoomRow]?.[nextRoomCol];
    if (!targetRoom) {
      return { moved: false, blocked: 'edge', transitioned: false, state: this.snapshot() };
    }

    // Mirror normal room-transition placement: enter one tile inside opposite edge
    // and keep doorway-lane alignment deterministic from current position.
    let nextX = this.state.x;
    let nextY = this.state.y;
    if (directionKey === 'north') nextY = this.roomHeight - 2;
    if (directionKey === 'south') nextY = 1;
    if (directionKey === 'west') nextX = this.roomWidth - 2;
    if (directionKey === 'east') nextX = 1;

    if (directionKey === 'north' || directionKey === 'south') {
      const minX = Math.floor(this.roomWidth / 2) - 1;
      const maxX = Math.floor(this.roomWidth / 2) + 1;
      nextX = Math.max(minX, Math.min(maxX, nextX));
    }

    if (directionKey === 'west' || directionKey === 'east') {
      const minY = Math.floor(this.roomHeight / 2) - 1;
      const maxY = Math.floor(this.roomHeight / 2) + 1;
      nextY = Math.max(minY, Math.min(maxY, nextY));
    }

    if (this._isBlocked(targetRoom, nextX, nextY)) {
      return { moved: false, blocked: 'collision', transitioned: false, state: this.snapshot() };
    }

    this.state = {
      roomRow: nextRoomRow,
      roomCol: nextRoomCol,
      x: nextX,
      y: nextY,
    };

    return { moved: true, blocked: null, transitioned: true, state: this.snapshot() };
  }
}

export function createWorld(worldData = DEFAULT_WORLD_DATA) {
  return new WorldMap(worldData);
}

export function createWorldState(persistedState = null, worldData = DEFAULT_WORLD_DATA) {
  const world = new WorldMap(worldData, persistedState);
  return world.snapshot();
}

export function movePlayer(worldState, directionKey, worldData = DEFAULT_WORLD_DATA) {
  const world = new WorldMap(worldData, worldState);
  const result = world.move(directionKey);
  return { ...result, worldState: world.snapshot(), room: world.getCurrentRoom() };
}

export function travelToAdjacentRoom(worldState, directionKey, worldData = DEFAULT_WORLD_DATA) {
  const world = new WorldMap(worldData, worldState);
  const result = world.travelToAdjacent(directionKey);
  return { ...result, worldState: world.snapshot(), room: world.getCurrentRoom() };
}

/**
 * Create a map wrapper object with world data and state.
 * @param {object} worldData
 * @param {object|null} persistedState
 * @returns {{worldData: object, worldState: object}}
 */
export function createMap(worldData = DEFAULT_WORLD_DATA, persistedState = null) {
  return {
    worldData,
    worldState: createWorldState(persistedState, worldData),
  };
}

/**
 * Get the current room from a map wrapper or world state.
 * @param {object} mapState
 * @param {object} worldData
 * @returns {object|null}
 */
export function getCurrentRoom(mapState, worldData = DEFAULT_WORLD_DATA) {
  const resolvedWorldData = mapState?.worldData ?? worldData;
  const resolvedWorldState = mapState?.worldState ?? mapState;
  const world = new WorldMap(resolvedWorldData, resolvedWorldState);
  return world.getCurrentRoom();
}

/**
 * Get the available exits from the current room.
 * @param {object} mapState
 * @param {object} worldData
 * @returns {string[]}
 */
export function getRoomExits(mapState, worldData = DEFAULT_WORLD_DATA) {
  const resolvedWorldData = mapState?.worldData ?? worldData;
  const resolvedWorldState = mapState?.worldState ?? mapState;
  const roomRow = resolvedWorldState?.roomRow ?? 0;
  const roomCol = resolvedWorldState?.roomCol ?? 0;
  const rooms = resolvedWorldData.rooms ?? [];

  return Object.entries(DIRECTIONS)
    .filter(([, dir]) => Boolean(rooms[roomRow + dir.roomRow]?.[roomCol + dir.roomCol]))
    .map(([key]) => key);
}

/**
 * Get the adjacent room object in a direction, if any.
 * @param {object} mapState
 * @param {string} direction
 * @param {object} worldData
 * @returns {object|null}
 */
export function getAdjacentRoom(mapState, direction, worldData = DEFAULT_WORLD_DATA) {
  const dir = DIRECTIONS[direction];
  if (!dir) return null;

  const resolvedWorldData = mapState?.worldData ?? worldData;
  const resolvedWorldState = mapState?.worldState ?? mapState;
  const roomRow = resolvedWorldState?.roomRow ?? 0;
  const roomCol = resolvedWorldState?.roomCol ?? 0;
  const rooms = resolvedWorldData.rooms ?? [];

  return rooms[roomRow + dir.roomRow]?.[roomCol + dir.roomCol] ?? null;
}

/**
 * Get readable metadata for one exit direction.
 * @param {object} mapState
 * @param {string} direction
 * @param {object} worldData
 * @returns {{direction: string, available: boolean, roomName: string|null, aligned: boolean, ready: boolean}}
 */
export function getExitPreview(mapState, direction, worldData = DEFAULT_WORLD_DATA) {
  const resolvedWorldData = mapState?.worldData ?? worldData;
  const resolvedWorldState = mapState?.worldState ?? mapState;
  const roomWidth = resolvedWorldData.roomWidth ?? ROOM_WIDTH;
  const roomHeight = resolvedWorldData.roomHeight ?? ROOM_HEIGHT;
  const midX = Math.floor(roomWidth / 2);
  const midY = Math.floor(roomHeight / 2);
  const x = resolvedWorldState?.x ?? midX;
  const y = resolvedWorldState?.y ?? midY;
  const adjacentRoom = getAdjacentRoom(resolvedWorldState, direction, resolvedWorldData);
  const available = Boolean(adjacentRoom);

  let aligned = false;
  if (direction === 'north' || direction === 'south') {
    aligned = x >= midX - 1 && x <= midX + 1;
  } else if (direction === 'west' || direction === 'east') {
    aligned = y >= midY - 1 && y <= midY + 1;
  }

  let ready = false;
  if (aligned && direction === 'north') ready = y <= 1;
  if (aligned && direction === 'south') ready = y >= roomHeight - 2;
  if (aligned && direction === 'west') ready = x <= 1;
  if (aligned && direction === 'east') ready = x >= roomWidth - 2;

  return {
    direction,
    available,
    roomName: available ? (adjacentRoom?.name ?? null) : null,
    aligned,
    ready,
  };
}

/**
 * Get readable metadata for all four exits.
 * @param {object} mapState
 * @param {object} worldData
 * @returns {{north: object, south: object, west: object, east: object}}
 */
export function getExitPreviews(mapState, worldData = DEFAULT_WORLD_DATA) {
  return {
    north: getExitPreview(mapState, 'north', worldData),
    south: getExitPreview(mapState, 'south', worldData),
    west: getExitPreview(mapState, 'west', worldData),
    east: getExitPreview(mapState, 'east', worldData),
  };
}
