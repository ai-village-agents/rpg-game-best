import { COORD_TO_ROOM } from './location-atmosphere.js';
import { DEFAULT_WORLD_DATA, getRoomExits, getCurrentRoom, getExitPreviews } from './map.js';
import { getNPCsInRoom } from './npc-dialog.js';

const ROOM_LABELS = {
  nw: 'The Whispering Glade',
  n: 'The Shimmer Trail',
  ne: 'Crystalspine Heights',
  w: 'Traders Rift',
  center: 'Millbrook Crossing',
  e: 'Lumingrass Meadows',
  sw: 'The Miregloom',
  s: 'Pilgrim Road',
  se: 'Tideglass Harbor',
};

const ALL_DIRECTIONS = ['north', 'south', 'west', 'east'];

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}


const NPC_EMOJI = {
  elder: '👴',
  healer: '⚕️',
  captain: '🫡',
  blacksmith: '⚒️',
  merchant: '🧔',
  alchemist: '🧪',
  innkeeper: '🍺',
  guard: '💂',
  farmer_male: '🌾',
  farmer_female: '🌾',
  child_male: '👦',
  warrior_female: '⚔️',
  mage_female: '🧙♀️',
  warrior_male: '🗡️',
  goblin_chief: '👹',
  void_merchant: '🌀',
};

function getNpcEmoji(npc) {
  return NPC_EMOJI[npc.sprite] || '🧑';
}

function getPlayerPositionStyles(state) {
  const roomWidth = state?.worldData?.roomWidth ?? DEFAULT_WORLD_DATA.roomWidth;
  const roomHeight = state?.worldData?.roomHeight ?? DEFAULT_WORLD_DATA.roomHeight;
  const x = state?.world?.x ?? Math.floor(roomWidth / 2);
  const y = state?.world?.y ?? Math.floor(roomHeight / 2);
  const left = clamp(((x + 0.5) / roomWidth) * 100, 8, 92);
  const bottom = clamp(((roomHeight - y) / roomHeight) * 60, 6, 72);
  return `left: ${left}%; bottom: ${bottom}%;`;
}

function renderNpcIcons(roomId) {
  const npcs = roomId ? getNPCsInRoom(roomId) : [];
  if (!npcs.length) return '';
  const baseLeft = 12;
  const gap = 12;
  return npcs
    .map((npc, index) => {
      const left = clamp(baseLeft + index * gap, 8, 90);
      return (
        `<div class="area-scene-npc" style="left: ${left}%; bottom: 10px;" title="${esc(npc.name)}">${getNpcEmoji(npc)}</div>`
      );
    })
    .join('');
}

function renderExitLocks(exits) {
  const blocked = ALL_DIRECTIONS.filter((direction) => !exits.includes(direction));
  if (!blocked.length) return '';
  return blocked
    .map((direction) => `<div class="area-scene-exit-lock lock-${direction}">🔒</div>`)
    .join('');
}

function renderExitCues(exitPreviews) {
  const arrows = {
    north: '↑',
    south: '↓',
    west: '←',
    east: '→',
  };

  return ALL_DIRECTIONS
    .map((direction) => exitPreviews[direction])
    .filter((preview) => preview?.available && preview?.roomName)
    .map((preview) => {
      const classes = [
        'area-scene-exit-cue',
        'move-btn',
        `cue-${preview.direction}`,
      ];
      if (preview.aligned) classes.push('cue-aligned');
      if (preview.ready) classes.push('cue-ready');
      const travelLabel = `Travel ${preview.direction} to ${preview.roomName}`;
      return `<button type="button" class="${classes.join(' ')}" data-dir="${esc(preview.direction)}" title="${esc(travelLabel)}" aria-label="${esc(travelLabel)}">${arrows[preview.direction]} ${esc(preview.roomName)}</button>`;
    })
    .join('');
}

function renderSceneElements(roomId) {
  switch (roomId) {
    case 'nw':
      return [
        '<div class="area-scene-element tree" style="left: 10%; bottom: 48px;"></div>',
        '<div class="area-scene-element tree" style="left: 28%; bottom: 44px;"></div>',
        '<div class="area-scene-element tree" style="left: 46%; bottom: 52px;"></div>',
        '<div class="area-scene-element tree" style="left: 68%; bottom: 46px;"></div>',
        '<div class="area-scene-element tree" style="left: 82%; bottom: 50px;"></div>',
        '<div class="area-scene-element mist" style="left: 0; bottom: 22px; width: 100%;"></div>',
      ].join('');
    case 'n':
      return [
        '<div class="area-scene-element mountain" style="left: 6%; bottom: 50px;"></div>',
        '<div class="area-scene-element mountain" style="left: 32%; bottom: 46px;"></div>',
        '<div class="area-scene-element mountain" style="left: 60%; bottom: 52px;"></div>',
        '<div class="area-scene-element ridge" style="left: 0; bottom: 26px; width: 100%;"></div>',
      ].join('');
    case 'ne':
      return [
        '<div class="area-scene-element rock" style="left: 16%; bottom: 44px;"></div>',
        '<div class="area-scene-element rock" style="left: 38%; bottom: 50px;"></div>',
        '<div class="area-scene-element rock" style="left: 62%; bottom: 46px;"></div>',
        '<div class="area-scene-element rock" style="left: 78%; bottom: 54px;"></div>',
        '<div class="area-scene-element cliff" style="left: 0; bottom: 28px; width: 100%;"></div>',
      ].join('');
    case 'w':
      return [
        '<div class="area-scene-element signpost" style="left: 22%; bottom: 48px;"></div>',
        '<div class="area-scene-element trail" style="left: 0; bottom: 18px; width: 100%;"></div>',
        '<div class="area-scene-element trail" style="left: 0; bottom: 34px; width: 100%; opacity: 0.6;"></div>',
      ].join('');
    case 'center':
      return [
        // Background buildings
        '<div class="area-scene-element v-building" style="left: 5%; bottom: 65px; transform: scale(0.85); filter: brightness(0.8);"></div>',
        '<div class="area-scene-element v-building" style="left: 75%; bottom: 62px; transform: scale(0.8); filter: brightness(0.75);"></div>',
        // Main buildings (Inn, Shops)
        '<div class="area-scene-element v-building inn" style="left: 15%; bottom: 45px;"></div>',
        '<div class="area-scene-element v-building shop" style="left: 65%; bottom: 48px;"></div>',
        // Village Elder House (center-back)
        '<div class="area-scene-element v-building elder" style="left: 40%; bottom: 55px; transform: scale(1.1);"></div>',
        // Fountain in center
        '<div class="area-scene-element v-fountain" style="left: 44%; bottom: 22px;"></div>',
        // Decor
        '<div class="area-scene-element v-barrel" style="left: 28%; bottom: 40px;"></div>',
        '<div class="area-scene-element v-barrel" style="left: 31%; bottom: 38px;"></div>',
        '<div class="area-scene-element v-crate" style="left: 70%; bottom: 42px;"></div>',
      ].join('');
    case 'e':
      return [
        '<div class="area-scene-element wheat" style="left: 10%; bottom: 38px;"></div>',
        '<div class="area-scene-element wheat" style="left: 26%; bottom: 40px;"></div>',
        '<div class="area-scene-element wheat" style="left: 44%; bottom: 36px;"></div>',
        '<div class="area-scene-element wheat" style="left: 62%; bottom: 42px;"></div>',
        '<div class="area-scene-element wheat" style="left: 78%; bottom: 38px;"></div>',
        '<div class="area-scene-element field" style="left: 0; bottom: 18px; width: 100%;"></div>',
      ].join('');
    case 'sw':
      return [
        '<div class="area-scene-element cattail" style="left: 12%; bottom: 38px;"></div>',
        '<div class="area-scene-element cattail" style="left: 30%; bottom: 42px;"></div>',
        '<div class="area-scene-element cattail" style="left: 54%; bottom: 36px;"></div>',
        '<div class="area-scene-element cattail" style="left: 72%; bottom: 40px;"></div>',
        '<div class="area-scene-element swamp-water" style="left: 0; bottom: 16px; width: 100%;"></div>',
      ].join('');
    case 's':
      return [
        '<div class="area-scene-element road" style="left: 0; bottom: 20px; width: 100%;"></div>',
        '<div class="area-scene-element road-line" style="left: 8%; bottom: 46px; width: 84%;"></div>',
        '<div class="area-scene-element road-line" style="left: 12%; bottom: 30px; width: 76%; opacity: 0.7;"></div>',
      ].join('');
    case 'se':
      return [
        '<div class="area-scene-element dock" style="left: 10%; bottom: 28px; width: 80%;"></div>',
        '<div class="area-scene-element wave" style="left: 0; bottom: 12px; width: 100%;"></div>',
        '<div class="area-scene-element wave" style="left: 0; bottom: 32px; width: 100%; opacity: 0.6;"></div>',
      ].join('');
    default:
      return '';
  }
}


function renderCollisionOverlay(state) {
  const roomWidth = state?.worldData?.roomWidth ?? DEFAULT_WORLD_DATA.roomWidth;
  const roomHeight = state?.worldData?.roomHeight ?? DEFAULT_WORLD_DATA.roomHeight;
  const room = getCurrentRoom(state.world, state.worldData);
  if (!room || !room.collision) return '';

  let html = '';
  for (let y = 0; y < roomHeight; y++) {
    for (let x = 0; x < roomWidth; x++) {
      if (room.collision[y][x] === 1) {
        const cellLeft = (x / roomWidth) * 100;
        const cellBottom = ((roomHeight - y - 1) / roomHeight) * 60;
        const cellWidth = 100 / roomWidth;
        const cellHeight = 60 / roomHeight;
        
        // Exits are 0, walls are 1. The perimeter will be visibly blocked.
        html += `<div class="area-scene-collision-cell" style="left: ${cellLeft}%; bottom: ${cellBottom}%; width: ${cellWidth}%; height: ${cellHeight}%;"></div>`;
      }
    }
  }
  return html;
}

export function renderAreaScene(state) {
  if (state?.phase !== 'exploration') return '';

  const roomRow = state?.world?.roomRow;
  const roomCol = state?.world?.roomCol;
  const roomId = COORD_TO_ROOM[`${roomRow},${roomCol}`];
  if (!roomId) return '';

  const exits = getRoomExits(state.world, state.worldData);
  const exitPreviews = getExitPreviews(state.world, state.worldData);
  const label = ROOM_LABELS[roomId] ?? 'Unknown';
  const sceneElements = renderSceneElements(roomId);
  const npcs = renderNpcIcons(roomId);
  const cues = renderExitCues(exitPreviews);
  const locks = renderExitLocks(exits);
  const collisionOverlay = renderCollisionOverlay(state);
  const playerStyle = getPlayerPositionStyles(state);

  return `
    <div class="area-scene" data-room="${roomId}">
      ${sceneElements}
      ${collisionOverlay}
      ${cues}
      ${locks}
      ${npcs}
      <div class="area-player-marker" style="${playerStyle}">🧍</div>
      <div class="area-scene-label">${esc(label)}</div>
    </div>
  `;
}

export function getAreaSceneStyles() {
  return `
    /* New Millbrook Crossing Styles */
    .area-scene[data-room="center"] {
      background: linear-gradient(180deg, #8cb5d6 0%, #b8cddb 45%, #d4caa8 45%, #e6dfc3 100%);
    }
    
    .area-scene-element.v-building {
      width: 54px;
      height: 42px;
      background: #e8dcc3;
      border: 2px solid #5a4b3c;
      border-radius: 2px;
      box-shadow: inset 0 -5px 0 rgba(0, 0, 0, 0.1), 3px 3px 0 rgba(0, 0, 0, 0.15);
    }
    .area-scene-element.v-building::before {
      content: '';
      position: absolute;
      left: -6px;
      top: -24px;
      width: 0;
      height: 0;
      border-left: 31px solid transparent;
      border-right: 31px solid transparent;
      border-bottom: 24px solid #a34839;
      filter: drop-shadow(0 2px 0 #7a3124);
    }
    .area-scene-element.v-building::after {
      content: '';
      position: absolute;
      left: 20px;
      bottom: 0;
      width: 14px;
      height: 20px;
      background: #61442f;
      border-radius: 2px 2px 0 0;
    }
    
    .area-scene-element.v-building.inn {
      background: #dfd1b8;
    }
    .area-scene-element.v-building.inn::before {
      border-bottom-color: #4a5d82;
      filter: drop-shadow(0 2px 0 #2c3a57);
    }
    
    .area-scene-element.v-building.shop {
      background: #d4c8b2;
    }
    .area-scene-element.v-building.shop::before {
      border-bottom-color: #587a52;
      filter: drop-shadow(0 2px 0 #3a5435);
    }
    
    .area-scene-element.v-building.elder {
      background: #ebdaca;
    }
    
    .area-scene-element.v-fountain {
      width: 46px;
      height: 18px;
      background: #8b9bb4;
      border-radius: 50%;
      border: 2px solid #5c6c82;
      box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0,0,0,0.1);
    }
    .area-scene-element.v-fountain::before {
      content: '';
      position: absolute;
      left: 18px;
      bottom: 12px;
      width: 10px;
      height: 24px;
      background: #a4b4cc;
      border-radius: 4px 4px 0 0;
      border: 2px solid #5c6c82;
    }
    .area-scene-element.v-fountain::after {
      content: '';
      position: absolute;
      left: 8px;
      top: -8px;
      width: 30px;
      height: 16px;
      background: rgba(186, 222, 255, 0.85);
      border-radius: 50%;
      animation: ripple 2s infinite linear;
    }
    
    .area-scene-element.v-barrel {
      width: 12px;
      height: 16px;
      background: #875c36;
      border: 1px solid #4a301a;
      border-radius: 2px;
    }
    .area-scene-element.v-barrel::before {
      content: '';
      position: absolute;
      top: 3px;
      left: 0;
      width: 100%;
      height: 2px;
      background: #333;
    }
    .area-scene-element.v-barrel::after {
      content: '';
      position: absolute;
      bottom: 3px;
      left: 0;
      width: 100%;
      height: 2px;
      background: #333;
    }
    
    .area-scene-element.v-crate {
      width: 18px;
      height: 18px;
      background: #c29b69;
      border: 1px solid #735531;
    }
    .area-scene-element.v-crate::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent 45%, #735531 45%, #735531 55%, transparent 55%);
    }
    
    @keyframes ripple {
      0% { transform: scale(0.9); opacity: 0.8; }
      50% { transform: scale(1.05); opacity: 0.5; }
      100% { transform: scale(0.9); opacity: 0.8; }
    }
    .area-scene-collision-cell {
      position: absolute;
      background: linear-gradient(135deg, rgba(80, 60, 40, 0.65) 0%, rgba(50, 35, 20, 0.75) 100%);
      border: 1px solid rgba(90, 70, 45, 0.6);
      box-sizing: border-box;
      pointer-events: none;
      z-index: 4;
      border-radius: 2px;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.2);
    }

    .area-scene {
      position: relative;
      width: 100%;
      height: 180px;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 12px;
      border: 2px solid #555;
    }

    .area-scene-element {
      position: absolute;
      pointer-events: none;
    }

    .area-scene-label {
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      padding: 2px 10px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 10;
    }

    .area-scene-npc {
      position: absolute;
      font-size: 20px;
      z-index: 6;
      filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.5));
    }

    .area-player-marker {
      transition: left 0.3s ease-in-out, bottom 0.3s ease-in-out;
      position: absolute;
      font-size: 24px;
      z-index: 5;
      animation: pulse 1.5s ease-in-out infinite;
      filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.45));
    }

    .area-scene-exit-lock {
      position: absolute;
      font-size: 18px;
      color: #f0d36a;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
      z-index: 7;
    }

    .area-scene-exit-cue {
      position: absolute;
      font-size: 11px;
      font-weight: 600;
      font-family: inherit;
      color: #f6f6f6;
      background: rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      padding: 2px 6px;
      text-shadow: 0 1px 1px rgba(0, 0, 0, 0.6);
      z-index: 7;
      cursor: pointer;
    }

    .area-scene-exit-cue.cue-aligned {
      background: rgba(38, 70, 38, 0.62);
      border-color: rgba(156, 225, 156, 0.7);
    }

    .area-scene-exit-cue.cue-ready {
      background: rgba(201, 132, 26, 0.78);
      border-color: rgba(255, 227, 133, 0.95);
      box-shadow: 0 0 6px rgba(255, 216, 130, 0.75);
    }

    .area-scene-exit-cue.cue-north {
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
    }

    .area-scene-exit-cue.cue-south {
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
    }

    .area-scene-exit-cue.cue-west {
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
    }

    .area-scene-exit-cue.cue-east {
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }

    .area-scene-exit-lock.lock-north {
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
    }

    .area-scene-exit-lock.lock-south {
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
    }

    .area-scene-exit-lock.lock-west {
      left: 8px;
      top: 50%;
      transform: translateY(-50%);
    }

    .area-scene-exit-lock.lock-east {
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.15);
      }
      100% {
        transform: scale(1);
      }
    }

    .area-scene[data-room="nw"] {
      background: linear-gradient(180deg, #2f6b2f 0%, #4f8f44 55%, #6aa356 100%);
    }

    .area-scene[data-room="n"] {
      background: linear-gradient(180deg, #6e7a8a 0%, #93a2b3 55%, #c1c6cf 100%);
    }

    .area-scene[data-room="ne"] {
      background: linear-gradient(180deg, #b6733c 0%, #c98b58 55%, #d8ad7a 100%);
    }

    .area-scene[data-room="w"] {
      background: linear-gradient(180deg, #c9a447 0%, #d6ba63 55%, #e0c97d 100%);
    }

    .area-scene[data-room="center"] {
      background: linear-gradient(180deg, #cba97b 0%, #d8bb8a 55%, #e4cfa7 100%);
    }

    .area-scene[data-room="e"] {
      background: linear-gradient(180deg, #8bbf5c 0%, #a4cf74 55%, #b9da8a 100%);
    }

    .area-scene[data-room="sw"] {
      background: linear-gradient(180deg, #2e4f3f 0%, #3d5f53 55%, #5f4a67 100%);
    }

    .area-scene[data-room="s"] {
      background: linear-gradient(180deg, #7a5b3b 0%, #8c6a4a 55%, #9c7c5d 100%);
    }

    .area-scene[data-room="se"] {
      background: linear-gradient(180deg, #2a6aa7 0%, #3f82bf 55%, #6fb1e6 100%);
    }

    .area-scene-element.tree {
      width: 14px;
      height: 28px;
      background: #6f4b2a;
      border-radius: 4px;
      box-shadow: inset 0 -4px 0 rgba(0, 0, 0, 0.2);
    }

    .area-scene-element.tree::before {
      content: '';
      position: absolute;
      left: -10px;
      top: -24px;
      border-left: 17px solid transparent;
      border-right: 17px solid transparent;
      border-bottom: 26px solid #2f6b2f;
    }

    .area-scene-element.mist {
      height: 30px;
      background: rgba(220, 255, 220, 0.25);
      filter: blur(1px);
    }

    .area-scene-element.mountain {
      width: 70px;
      height: 50px;
    }

    .area-scene-element.mountain::before,
    .area-scene-element.mountain::after {
      content: '';
      position: absolute;
      bottom: 0;
      border-left: 30px solid transparent;
      border-right: 30px solid transparent;
      border-bottom: 50px solid #586777;
    }

    .area-scene-element.mountain::after {
      left: 26px;
      border-left-width: 24px;
      border-right-width: 24px;
      border-bottom-color: #6f8296;
    }

    .area-scene-element.ridge {
      height: 20px;
      background: rgba(64, 74, 88, 0.5);
    }

    .area-scene-element.rock {
      width: 36px;
      height: 20px;
      background: #7a604a;
      border-radius: 40% 40% 30% 30%;
      box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.2);
    }

    .area-scene-element.cliff {
      height: 26px;
      background: rgba(90, 70, 55, 0.55);
    }

    .area-scene-element.signpost {
      width: 10px;
      height: 40px;
      background: #7a4d2b;
      border-radius: 3px;
    }

    .area-scene-element.signpost::before {
      content: '';
      position: absolute;
      left: -16px;
      top: 6px;
      width: 36px;
      height: 12px;
      background: #c7b27a;
      border-radius: 3px;
      box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.2);
    }

    .area-scene-element.trail {
      height: 10px;
      background: rgba(120, 92, 50, 0.5);
    }

    .area-scene-element.building {
      width: 46px;
      height: 32px;
      background: #d2b38b;
      border-radius: 2px;
      box-shadow: inset 0 -4px 0 rgba(0, 0, 0, 0.12);
    }

    .area-scene-element.building::before {
      content: '';
      position: absolute;
      left: -4px;
      top: -18px;
      width: 0;
      height: 0;
      border-left: 27px solid transparent;
      border-right: 27px solid transparent;
      border-bottom: 18px solid #a86f4c;
    }

    .area-scene-element.fountain {
      width: 40px;
      height: 16px;
      background: #8fa2b6;
      border-radius: 50%;
      box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.15);
    }

    .area-scene-element.fountain::before {
      content: '';
      position: absolute;
      left: 10px;
      top: -10px;
      width: 20px;
      height: 12px;
      background: rgba(140, 200, 240, 0.8);
      border-radius: 50%;
    }

    .area-scene-element.wheat {
      width: 12px;
      height: 34px;
      background: #b7862b;
      border-radius: 6px 6px 2px 2px;
    }

    .area-scene-element.wheat::before {
      content: '';
      position: absolute;
      left: -6px;
      top: -8px;
      width: 24px;
      height: 10px;
      background: #e2c267;
      border-radius: 10px;
    }

    .area-scene-element.field {
      height: 18px;
      background: rgba(160, 200, 110, 0.5);
    }

    .area-scene-element.cattail {
      width: 8px;
      height: 38px;
      background: #3b5b3b;
      border-radius: 4px;
    }

    .area-scene-element.cattail::before {
      content: '';
      position: absolute;
      left: -2px;
      top: -10px;
      width: 12px;
      height: 10px;
      background: #6b3b2b;
      border-radius: 6px;
    }

    .area-scene-element.swamp-water {
      height: 22px;
      background: rgba(30, 60, 55, 0.6);
      box-shadow: inset 0 4px 6px rgba(0, 0, 0, 0.25);
    }

    .area-scene-element.road {
      height: 18px;
      background: rgba(90, 70, 50, 0.65);
    }

    .area-scene-element.road-line {
      height: 4px;
      background: rgba(230, 210, 160, 0.7);
    }

    .area-scene-element.dock {
      height: 18px;
      background: repeating-linear-gradient(
        90deg,
        #c29859 0px,
        #c29859 18px,
        #b08146 18px,
        #b08146 26px
      );
      box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.2);
    }

    .area-scene-element.wave {
      height: 10px;
      background: linear-gradient(90deg, rgba(200, 240, 255, 0.6) 0%, rgba(200, 240, 255, 0) 60%);
      border-radius: 12px;
      box-shadow: 0 0 6px rgba(190, 235, 255, 0.6);
    }
  `;
}
