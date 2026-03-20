/**
 * Location Atmosphere System
 * 
 * Provides rich flavor text, ambient descriptions, and visual theming
 * for each map location to enhance the exploration experience.
 * Each location has time-of-day variations and random ambient events.
 */

/**
 * Location atmosphere data keyed by room ID.
 * Each entry has descriptions, ambient events, and CSS theme colors.
 */
const LOCATION_DATA = {
  nw: {
    name: 'The Whispering Glade',
    icon: '🌲',
    description: 'Ancient trees twist skyward, bark etched with faintly glowing Aether-runes. The canopy filters light into shimmering patterns, and whispered voices drift from deep within the grove — echoes of spirits caught between dimensions.',
    ambientEvents: [
      'A spectral voice murmurs something just beyond understanding.',
      'Aether-motes drift between the ferns like tiny trapped stars.',
      'The scent of pine mingles with the metallic tang of raw Aether.',
      'The trees sway though no wind blows, as if listening.',
      'Spirit-mushrooms pulse with soft violet light along a fallen trunk.',
      'A translucent fox watches you from between the roots, then vanishes.',
    ],
    themeColor: 'rgba(34, 139, 34, 0.08)',
    borderAccent: 'rgba(34, 139, 34, 0.25)',
  },
  n: {
    name: 'The Shimmer Trail',
    icon: '🛤️',
    description: 'The trail ahead shimmers with residual Aether-light, the cobblestones faintly luminous underfoot. Weathered stone pillars line the path, their carved wards still flickering with protective energy from a forgotten age.',
    ambientEvents: [
      'The trail pulses briefly underfoot — a ripple from the Convergence.',
      'Ward-stones hum as you pass, sensing something in you.',
      'Aether-light pools in your footprints for a moment before fading.',
      'A hawk with faintly luminous feathers circles overhead.',
      'Runes on the pillars flare briefly — reacting to your presence.',
      'A chill gust carries whispers of the Shardlands beyond.',
    ],
    themeColor: 'rgba(128, 128, 160, 0.08)',
    borderAccent: 'rgba(128, 128, 160, 0.25)',
  },
  ne: {
    name: 'Crystalspine Heights',
    icon: '⛰️',
    description: 'Jagged formations of crystallized Aether erupt from the ridge like frozen lightning. Each crystal hums at a different pitch, and on clear days you can see the shimmering boundary where the Material fades into the Aetheric.',
    ambientEvents: [
      'An eagle banks through streamers of visible Aether-current.',
      'Crystal shards chime underfoot like broken glass bells.',
      'The crystals resonate with a deep harmonic — almost musical.',
      'Light refracts through the crystal field, casting rainbow shards across the stone.',
      'A crystalline growth pulses in rhythm with your heartbeat.',
      'You glimpse a frozen memory inside a large crystal — a face, mid-sentence, from centuries ago.',
    ],
    themeColor: 'rgba(160, 140, 120, 0.08)',
    borderAccent: 'rgba(160, 140, 120, 0.25)',
  },
  w: {
    name: 'Traders Rift',
    icon: '🌉',
    description: 'A sturdy bridge spans a rift in the earth where Aether-mist rises in lazy spirals. Merchant caravans still brave this crossing, their wagons fitted with ward-lanterns to navigate the fog that blurs the line between here and elsewhere.',
    ambientEvents: [
      'Aether-mist swirls up from the rift in ghostly tendrils.',
      'A ward-lantern flickers on an approaching merchant cart.',
      'Iridescent insects dance through the mist, their wings trailing light.',
      'The bridge stones are warm despite the cool mist below.',
      'Something glimmers deep in the rift — then disappears.',
      'Aether-touched wildflowers bloom in impossible colors along the rift\'s edge.',
    ],
    themeColor: 'rgba(70, 130, 180, 0.08)',
    borderAccent: 'rgba(70, 130, 180, 0.25)',
  },
  center: {
    name: 'Millbrook Crossing',
    icon: '🏘️',
    description: 'The heart of Millbrook Crossing sits directly atop the Convergence. The stone fountain at its center occasionally ripples with Aether-light, and the air carries a faint electric charge. Despite the strangeness, life goes on — merchants hawk wares, children play, and the Elder keeps watch.',
    ambientEvents: [
      'A blacksmith tempers a blade in Aether-infused water, the steel singing.',
      'Children dare each other to touch the fountain when it glows.',
      'The aroma of spiced bread and Shimmer-tea drifts from the inn.',
      'A bard plays a haunting melody about the world before the Convergence.',
      'A vendor hawks Aether-crystal charms: \'Keep the veil-sickness away!\'.',
      'The fountain flickers — for a moment, you see a second village overlaid on the first.',
    ],
    themeColor: 'rgba(218, 165, 32, 0.08)',
    borderAccent: 'rgba(218, 165, 32, 0.25)',
  },
  e: {
    name: 'Lumingrass Meadows',
    icon: '🌾',
    description: 'Fields of lumingrass sway in the breeze, their silver-green blades absorbing Aether and glowing softly at dusk. The farmers here have adapted to the Convergence — their crops thrive on the bleed-through energy, growing twice as fast but sometimes in unusual shapes.',
    ambientEvents: [
      'Lumingrass chimes softly, each blade resonating at a slightly different pitch.',
      'A scarecrow\'s crystal-studded frame refracts the late light.',
      'Aether-moths with luminous wings drift through the twilight meadow.',
      'A farmer harvests lumingrass, wearing thick gloves to handle the charged stalks.',
      'The soil here has a faint ozone smell — Aether seepage from below.',
      'The meadow dims and brightens in slow waves, like breathing.',
    ],
    themeColor: 'rgba(210, 180, 60, 0.08)',
    borderAccent: 'rgba(210, 180, 60, 0.25)',
  },
  sw: {
    name: 'The Miregloom',
    icon: '🌿',
    description: 'Here the Convergence pools and stagnates. Toxic Aether-light glows beneath the black water, and the trees grow in spirals, warped by centuries of dimensional bleed. The creatures here are the most changed — half-material, half-something else entirely.',
    ambientEvents: [
      'Something croaks beneath the luminous water — it doesn\'t sound like a frog.',
      'Bubbles of raw Aether rise and pop, releasing tiny flashes of light.',
      'A will-o\'-wisp of concentrated Aether drifts past, leaving a burning afterimage.',
      'The ground squelches, and your footprints glow sickly green.',
      'For a heartbeat, the veil thins completely — you glimpse the Aetheric Miregloom, beautiful and terrifying.',
      'Twisted roots form archways that seem to lead somewhere that isn\'t quite here.',
    ],
    themeColor: 'rgba(60, 100, 60, 0.08)',
    borderAccent: 'rgba(60, 100, 60, 0.25)',
  },
  s: {
    name: 'Pilgrim Road',
    icon: '🏜️',
    description: 'The ancient road descends toward the Shardlands frontier. Pilgrims once traveled this path seeking the Convergence\'s power — their abandoned shrines still dot the roadside, some still flickering with residual Aether-blessings.',
    ambientEvents: [
      'Heat shimmers mingle with Aether-distortions along the sunbaked stones.',
      'A lizard with faintly glowing markings darts across the path.',
      'A dust devil sparks with Aether-static as it spirals past.',
      'A pilgrim\'s prayer bell chimes from an abandoned roadside shrine.',
      'Crystallized pilgrim offerings glitter in a crumbling altar niche.',
      'A roadside shrine hums with residual faith-energy — someone prayed here recently.',
    ],
    themeColor: 'rgba(180, 140, 80, 0.08)',
    borderAccent: 'rgba(180, 140, 80, 0.25)',
  },
  se: {
    name: 'Tideglass Harbor',
    icon: '⚓',
    description: 'Where the Convergence meets the sea, the water turns crystalline — so clear it looks like glass. The docks of Tideglass Harbor are built from Aether-hardened timber that never rots, and fishermen haul catches of strange, luminous fish from the deep.',
    ambientEvents: [
      'Gulls with opalescent feathers wheel above the glass-clear water.',
      'Waves of impossibly clear water lap against the Aether-hardened pilings.',
      'A fisherman mends nets woven with Aether-silk — stronger than steel.',
      'Salt air mingles with the ozone-sweet scent of sea-Aether.',
      'A deep-water bell chimes — warning of something stirring below the glass surface.',
      'Translucent crabs skitter between the planks, their shells like living crystal.',
    ],
    themeColor: 'rgba(70, 130, 180, 0.08)',
    borderAccent: 'rgba(70, 130, 180, 0.25)',
  },
};

/** Map from (row, col) coordinates to room ID */
export const COORD_TO_ROOM = {
  '0,0': 'nw', '0,1': 'n', '0,2': 'ne',
  '1,0': 'w',  '1,1': 'center', '1,2': 'e',
  '2,0': 'sw', '2,1': 's', '2,2': 'se',
};

/**
 * Get location data for a given room.
 * @param {object} opts
 * @param {string} [opts.roomId] - Direct room ID
 * @param {number} [opts.roomRow] - Room row coordinate
 * @param {number} [opts.roomCol] - Room column coordinate
 * @returns {object|null} Location data or null if not found
 */
export function getLocationData({ roomId, roomRow, roomCol } = {}) {
  const id = roomId || COORD_TO_ROOM[`${roomRow},${roomCol}`];
  return id ? (LOCATION_DATA[id] || null) : null;
}

/**
 * Get a random ambient event for a location.
 * @param {string} roomId - The room ID
 * @returns {string|null} A random ambient description or null
 */
export function getAmbientEvent(roomId) {
  const data = LOCATION_DATA[roomId];
  if (!data || !data.ambientEvents?.length) return null;
  return data.ambientEvents[Math.floor(Math.random() * data.ambientEvents.length)];
}

/**
 * Get ambient event by room coordinates.
 * @param {number} roomRow
 * @param {number} roomCol
 * @returns {string|null}
 */
export function getAmbientEventByCoords(roomRow, roomCol) {
  const roomId = COORD_TO_ROOM[`${roomRow},${roomCol}`];
  return roomId ? getAmbientEvent(roomId) : null;
}

/**
 * Render a location atmosphere panel for the exploration view.
 * @param {object} state - Game state
 * @returns {string} HTML string for the atmosphere panel
 */
export function renderAtmospherePanel(state) {
  const roomRow = state?.world?.roomRow ?? 1;
  const roomCol = state?.world?.roomCol ?? 1;
  const roomId = COORD_TO_ROOM[`${roomRow},${roomCol}`];
  const data = LOCATION_DATA[roomId];

  if (!data) {
    return '<div class="atmosphere-panel"><em>An unremarkable area.</em></div>';
  }

  const ambient = getAmbientEvent(roomId);

  return (
    `<div class="atmosphere-panel" style="` +
      `background:${data.themeColor};` +
      `border-left:3px solid ${data.borderAccent};` +
      `padding:10px 14px;margin:6px 0;border-radius:6px;">` +
      `<div style="font-size:1.1em;margin-bottom:4px;">` +
        `<span style="margin-right:6px;">${data.icon}</span>` +
        `<strong>${escapeHtml(data.name)}</strong>` +
      `</div>` +
      `<div style="color:var(--muted);font-size:0.9em;font-style:italic;margin-bottom:6px;">` +
        `${escapeHtml(data.description)}` +
      `</div>` +
      (ambient
        ? `<div style="color:var(--text);font-size:0.85em;opacity:0.7;">` +
          `${escapeHtml(ambient)}</div>`
        : '') +
    `</div>`
  );
}

/**
 * Get the CSS inline styles for a location-themed card border.
 * @param {number} roomRow
 * @param {number} roomCol
 * @returns {string} CSS inline style string
 */
export function getLocationBorderStyle(roomRow, roomCol) {
  const roomId = COORD_TO_ROOM[`${roomRow},${roomCol}`];
  const data = LOCATION_DATA[roomId];
  if (!data) return '';
  return `border-top:2px solid ${data.borderAccent};`;
}

/**
 * Get all location names and icons for map display.
 * @returns {Array<{id: string, name: string, icon: string, row: number, col: number}>}
 */
export function getAllLocations() {
  return Object.entries(COORD_TO_ROOM).map(([coords, roomId]) => {
    const [row, col] = coords.split(',').map(Number);
    const data = LOCATION_DATA[roomId];
    return {
      id: roomId,
      name: data?.name ?? roomId,
      icon: data?.icon ?? '❓',
      row,
      col,
    };
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
