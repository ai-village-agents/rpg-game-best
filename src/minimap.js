/**
 * Exploration Minimap UI
 *
 * Renders a 3x3 grid showing player position, visited rooms, and danger zones.
 * Dynamically generated based on the current room ID 'r_row_col'.
 */

import { DEFAULT_WORLD_DATA } from './map.js';

export const DANGER_LABELS = {
  0: 'Safe',
  1: 'Low risk',
  2: 'Dangerous',
  3: 'Very dangerous',
};

export const DANGER_ICONS = {
  0: '🏡',
  1: '⚠️',
  2: '💀',
  3: '☠️',
};

export function getRoomDangerLevel(roomId) {
  if (!roomId) return 0;
  // Based on name or ID, simple heuristic
  if (roomId === 'r_5_5') return 0; // Millbrook Crossing center
  const idHash = Array.from(roomId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (idHash % 3) + 1; // 1 to 3
}

export function getCurrentRoomId(worldState) {
  if (!worldState) return null;
  const { roomRow, roomCol } = worldState;
  if (roomRow == null || roomCol == null) return null;
  return `r_${roomRow}_${roomCol}`;
}

export function initVisitedRooms(startRow = 5, startCol = 5) {
  return [`r_${startRow}_${startCol}`];
}

export function markRoomVisited(visitedRooms, row, col) {
  const roomId = `r_${row}_${col}`;
  const visited = Array.isArray(visitedRooms) ? visitedRooms : [];
  if (visited.includes(roomId)) return visited;
  return [...visited, roomId];
}

export function isRoomVisited(visitedRooms, roomId) {
  if (!Array.isArray(visitedRooms)) return false;
  return visitedRooms.includes(roomId);
}

export function getMinimapCellType(roomId, currentRoomId, visitedRooms) {
  if (!roomId) return 'unvisited'; // No room here
  if (roomId === currentRoomId) return 'current';
  if (isRoomVisited(visitedRooms, roomId)) return 'visited';
  return 'unvisited';
}

export function buildMinimapData(worldState, visitedRooms) {
  const currentRoomId = getCurrentRoomId(worldState);
  const cells = [];
  
  let centerRow = worldState?.roomRow ?? 5;
  let centerCol = worldState?.roomCol ?? 5;

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const row = centerRow - 1 + r;
      const col = centerCol - 1 + c;
      const roomId = `r_${row}_${col}`;
      const roomObj = DEFAULT_WORLD_DATA.rooms[row]?.[col];
      const roomName = roomObj ? roomObj.name : 'Out of Bounds';
      
      let cellType = 'unvisited-void';
      let danger = 0;
      
      if (roomObj) {
         cellType = getMinimapCellType(roomId, currentRoomId, visitedRooms);
         danger = getRoomDangerLevel(roomId);
      }

      cells.push({
        row,
        col,
        roomId,
        roomName,
        cellType,
        danger,
        dangerLabel: DANGER_LABELS[danger] ?? 'Unknown',
        dangerIcon: DANGER_ICONS[danger] ?? '?',
        isCurrent: cellType === 'current',
        isVisited: cellType === 'visited' || cellType === 'current',
        isValid: !!roomObj
      });
    }
  }

  return cells;
}

function esc(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function getMinimapStyles() {
  return `
.minimap-card {
  min-width: 160px;
}
.minimap-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
  margin: 6px 0;
}
.minimap-cell {
  width: 44px;
  height: 44px;
  border: 2px solid var(--border);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  text-align: center;
  cursor: default;
  transition: border-color 0.2s;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}
.minimap-cell.current {
  border-color: var(--accent);
  background: var(--accent);
}
.minimap-cell.current .minimap-player {
  display: block;
}
.minimap-cell.visited {
  border-color: var(--dim-text);
  background: var(--card);
}
.minimap-cell.unvisited {
  border-color: var(--border);
  background: var(--bg);
  color: var(--border);
}
.minimap-cell.unvisited-void {
  border-color: transparent;
  background: transparent;
  color: transparent;
}
.minimap-cell-abbr {
  font-size: 9px;
  font-weight: bold;
  line-height: 1.1;
  color: inherit;
}
.minimap-cell.unvisited .minimap-cell-abbr {
  color: var(--border);
}
.minimap-cell.visited .minimap-cell-abbr {
  color: var(--muted);
}
.minimap-cell.current .minimap-cell-abbr {
  color: var(--accent);
}
.minimap-cell.unvisited-void .minimap-cell-abbr {
  display: none;
}
.minimap-danger-icon {
  font-size: 11px;
  line-height: 1;
}
.minimap-cell.unvisited .minimap-danger-icon {
  opacity: 0;
}
.minimap-cell.unvisited-void .minimap-danger-icon {
  display: none;
}
.minimap-player {
  display: none;
  font-size: 12px;
  position: absolute;
  top: 2px;
  right: 2px;
}
.minimap-legend {
  font-size: 10px;
  color: var(--dim-text);
  margin-top: 4px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.minimap-legend-item {
  display: flex;
  align-items: center;
  gap: 2px;
}
.minimap-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  display: inline-block;
}
.minimap-legend-dot.current { background: var(--accent); border: 1px solid var(--accent); }
.minimap-legend-dot.visited { background: var(--card); border: 1px solid var(--dim-text); }
.minimap-legend-dot.unvisited { background: var(--bg); border: 1px solid var(--border); }
.minimap-room-info {
  font-size: 11px;
  color: var(--muted);
  margin-top: 4px;
}
.minimap-room-info .danger-badge {
  display: inline-block;
  margin-left: 4px;
  font-size: 11px;
}
`;
}

export function renderMinimap(worldState, visitedRooms) {
  if (!worldState) return '';

  const cells = buildMinimapData(worldState, visitedRooms);
  const currentRoomId = getCurrentRoomId(worldState);
  const currentRoom = cells.find(c => c.isCurrent);
  const visitedCount = Array.isArray(visitedRooms) ? visitedRooms.length : 0;
  const totalRooms = 100; // 10x10 map

  let gridHtml = '';
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cell = cells[row * 3 + col];
      
      if (!cell.isValid) {
        gridHtml += `<div class="minimap-cell unvisited-void"></div>`;
        continue;
      }

      const abbr = cell.roomName.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase();
      const tooltip = cell.cellType === 'unvisited'
        ? 'Unexplored'
        : `${esc(cell.roomName)} — ${esc(cell.dangerLabel)}`;
      
      gridHtml += `
        <div class="minimap-cell ${esc(cell.cellType)}"
             title="${tooltip}"
             data-roomid="${esc(cell.roomId)}"
             data-row="${cell.row}"
             data-col="${cell.col}">
          <span class="minimap-player">${state.player?.sprite || '🧍'}</span>
          <span class="minimap-danger-icon" aria-label="${esc(cell.dangerLabel)}">${cell.cellType !== 'unvisited' ? esc(cell.dangerIcon) : '?'}</span>
          <span class="minimap-cell-abbr">${cell.cellType !== 'unvisited' ? esc(abbr) : '?'}</span>
        </div>
      `;
    }
  }

  const currentRoomInfo = currentRoom
    ? `<b>${esc(currentRoom.roomName)}</b><span class="danger-badge" title="${esc(currentRoom.dangerLabel)}">${esc(currentRoom.dangerIcon)}</span>`
    : 'Unknown location';

  const legendHtml = `
    <div class="minimap-legend">
      <span class="minimap-legend-item"><span class="minimap-legend-dot current"></span>&nbsp;Here</span>
      <span class="minimap-legend-item"><span class="minimap-legend-dot visited"></span>&nbsp;Visited</span>
      <span class="minimap-legend-item"><span class="minimap-legend-dot unvisited"></span>&nbsp;Unknown</span>
    </div>
  `;

  return `
    <div class="card minimap-card">
      <h2>Minimap <small style="font-size:11px;color:var(--dim-text);">(${visitedCount}/${totalRooms})</small></h2>
      <div class="minimap-grid">${gridHtml}</div>
      <div class="minimap-room-info">${currentRoomInfo}</div>
      ${legendHtml}
    </div>
  `;
}
