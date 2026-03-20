// Shield/Break Combat System - AI Village RPG
// Created Day 343.

export const BREAK_DURATION = 2;
export const BREAK_DAMAGE_MULTIPLIER = 1.5;

export const ELEMENT_ICONS = {
  physical: "⚔️",
  fire: "🔥",
  ice: "❄️",
  lightning: "⚡",
  earth: "🌿",
  nature: "🌿",
  light: "✨",
  holy: "✨",
  dark: "🌑",
  shadow: "🌑",
  arcane: "🔮",
};

export const ENEMY_SHIELD_DATABASE = {
  slime: { shieldCount: 2, weaknesses: ["lightning", "fire"] },
  goblin: { shieldCount: 2, weaknesses: ["fire", "light"] },
  goblin_chief: { shieldCount: 5, weaknesses: ["fire", "light"] },
  cave_bat: { shieldCount: 1, weaknesses: ["fire", "lightning", "light"] },
  giant_spider: { shieldCount: 3, weaknesses: ["fire", "lightning"] },
  // Alias: some content uses a dashed id.
  "giant-spider": { shieldCount: 3, weaknesses: ["fire", "lightning"] },
  training_dummy: {
    shieldCount: 2,
    weaknesses: ["physical", "fire", "ice", "lightning", "earth", "light", "dark"],
    breakImmune: true,
  },
  wolf: { shieldCount: 2, weaknesses: ["fire", "ice"] },
  skeleton: { shieldCount: 3, weaknesses: ["light", "fire"], immunities: ["dark"] },
  orc: { shieldCount: 4, weaknesses: ["fire", "light"] },
  "fire-spirit": {
    shieldCount: 3,
    weaknesses: ["earth", "light"],
    immunities: ["fire"],
    absorbs: ["fire"],
  },
  "ice-spirit": {
    shieldCount: 3,
    weaknesses: ["fire", "light"],
    immunities: ["ice"],
    absorbs: ["ice"],
  },
  "dark-cultist": {
    shieldCount: 3,
    weaknesses: ["light", "lightning"],
    immunities: ["dark"],
  },
  bandit: { shieldCount: 2, weaknesses: ["fire", "light"] },
  wraith: {
    shieldCount: 4,
    weaknesses: ["light", "fire"],
    immunities: ["physical", "dark"],
    absorbs: ["dark"],
  },
  "stone-golem": {
    shieldCount: 5,
    weaknesses: ["lightning", "ice"],
    immunities: [],
  },
  "thunder-hawk": { shieldCount: 2, weaknesses: ["fire", "light"] },
  dragon: { shieldCount: 8, weaknesses: ["earth", "light"], immunities: ["fire"] },
  abyss_overlord: {
    shieldCount: 10,
    weaknesses: ["light", "lightning"],
    immunities: ["dark", "fire"],
    absorbs: ["dark"],
  },
  "frost-revenant": {
    shieldCount: 4,
    weaknesses: ["fire", "light"],
    immunities: ["ice"],
    absorbs: ["ice"],
  },
  "blood-fiend": {
    shieldCount: 3,
    weaknesses: ["light", "fire"],
    immunities: ["dark"],
  },
  "shadow-weaver": {
    shieldCount: 3,
    weaknesses: ["light", "lightning"],
    immunities: ["dark"],
    absorbs: ["dark"],
  },
  "storm-elemental": {
    shieldCount: 5,
    weaknesses: ["ice", "earth"],
    immunities: ["lightning"],
    absorbs: ["lightning"],
  },
  "plague-bearer": {
    shieldCount: 5,
    weaknesses: ["lightning", "light"],
    immunities: ["earth"],
  },
  "infernal-knight": {
    shieldCount: 6,
    weaknesses: ["earth", "light"],
    immunities: ["fire"],
  },
  "glacial-wyrm": {
    shieldCount: 7,
    weaknesses: ["fire", "light"],
    immunities: ["ice"],
    absorbs: ["ice"],
  },
  "void-stalker": {
    shieldCount: 4,
    weaknesses: ["light", "lightning"],
    immunities: ["dark", "physical"],
  },
  // F11: Twilight Sanctum
  "crystal-sentinel": {
    shieldCount: 5,
    weaknesses: ["lightning", "earth"],
    immunities: ["physical"],
  },
  "ember-drake": {
    shieldCount: 5,
    weaknesses: ["earth", "light"],
    immunities: ["fire"],
    absorbs: ["fire"],
  },
  "phantom-assassin": {
    shieldCount: 4,
    weaknesses: ["light", "lightning"],
    immunities: ["dark", "physical"],
  },
  // F12: Arcane Labyrinth
  "arcane-guardian": {
    shieldCount: 6,
    weaknesses: ["dark", "lightning"],
    immunities: ["light"],
  },
  "crimson-berserker": {
    shieldCount: 5,
    weaknesses: ["ice", "light"],
    immunities: ["physical"],
  },
  "frost-archon": {
    shieldCount: 6,
    weaknesses: ["fire", "light"],
    immunities: ["ice"],
    absorbs: ["ice"],
  },
  // F13: Void Threshold
  "void-knight": {
    shieldCount: 7,
    weaknesses: ["light", "fire"],
    immunities: ["dark", "physical"],
    absorbs: ["dark"],
  },
  "thunder-titan": {
    shieldCount: 6,
    weaknesses: ["ice", "earth"],
    immunities: ["lightning"],
    absorbs: ["lightning"],
  },
  "infernal-sorcerer": {
    shieldCount: 6,
    weaknesses: ["earth", "light"],
    immunities: ["fire"],
  },
  // F14: Celestial Ruins
  "abyssal-warden": {
    shieldCount: 8,
    weaknesses: ["light", "lightning"],
    immunities: ["dark", "fire"],
    absorbs: ["dark"],
  },
  "celestial-wyrm": {
    shieldCount: 7,
    weaknesses: ["dark", "ice"],
    immunities: ["light", "lightning"],
    absorbs: ["light"],
  },
  "chaos-spawn": {
    shieldCount: 6,
    weaknesses: ["light", "ice"],
    immunities: ["dark"],
  },
  // F15: Oblivion Throne
  "oblivion-lord": {
    shieldCount: 12,
    weaknesses: ["light", "lightning"],
    immunities: ["dark", "fire", "ice"],
    absorbs: ["dark"],
    breakImmune: false,
  },
  "eternal-guardian": {
    shieldCount: 9,
    weaknesses: ["lightning", "earth"],
    immunities: ["physical", "fire"],
  },
  "primordial-phoenix": {
    shieldCount: 8,
    weaknesses: ["earth", "dark"],
    immunities: ["fire"],
    absorbs: ["fire"],
  },
  "lich-king": {
    shieldCount: 10,
    weaknesses: ["light", "fire"],
    immunities: ["dark", "ice"],
    absorbs: ["dark"],
  }
};

const DEFAULT_ENEMY_SHIELDS = {
  shieldCount: 2,
  weaknesses: [],
  immunities: [],
  absorbs: [],
  breakImmune: false,
};

function normalizeElement(value) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

// Map legacy element names to canonical names
const ELEMENT_ALIASES = {
  holy: 'light',
  shadow: 'dark',
  nature: 'earth',
};

function canonicalElement(value) {
  const norm = normalizeElement(value);
  return ELEMENT_ALIASES[norm] || norm;
}

export function checkWeakness(element, weaknesses) {
  if (!element || !Array.isArray(weaknesses) || weaknesses.length === 0) return false;
  const canonical = canonicalElement(element);
  if (!canonical) return false;
  return weaknesses.some((entry) => canonicalElement(entry) === canonical);
}

export function applyShieldDamage(enemy, amount) {
  if (!enemy) return { shieldsRemaining: 0, triggeredBreak: false };
  const damage = Number.isInteger(amount) ? amount : 0;
  if (damage <= 0 || enemy.isBroken) {
    return {
      shieldsRemaining: Math.max(0, Number(enemy.currentShields) || 0),
      triggeredBreak: false,
    };
  }

  const current = Math.max(0, Number(enemy.currentShields) || 0);
  const shieldsRemaining = Math.max(0, current - damage);
  const triggeredBreak = shieldsRemaining === 0 && !enemy.isBroken;
  return { shieldsRemaining, triggeredBreak };
}

export function processBreakState(enemy) {
  if (!enemy || !enemy.isBroken) {
    return { stillBroken: false, recoveredThisTurn: false };
  }

  const turnsRemaining = Number(enemy.breakTurnsRemaining) || 0;
  if (turnsRemaining > 1) {
    return {
      stillBroken: true,
      turnsRemaining: turnsRemaining - 1,
      recoveredThisTurn: false,
    };
  }

  return {
    stillBroken: false,
    recoveredThisTurn: true,
    restoredShields: Number(enemy.maxShields) || 0,
  };
}

export function getWeaknessIcons(weaknesses) {
  if (!Array.isArray(weaknesses) || weaknesses.length === 0) return "";
  return weaknesses
    .map((entry) => ELEMENT_ICONS[canonicalElement(entry)])
    .filter(Boolean)
    .join("");
}

export function getEnemyShieldData(enemyId) {
  if (enemyId && Object.prototype.hasOwnProperty.call(ENEMY_SHIELD_DATABASE, enemyId)) {
    const data = ENEMY_SHIELD_DATABASE[enemyId];
    return {
      shieldCount: data.shieldCount ?? DEFAULT_ENEMY_SHIELDS.shieldCount,
      weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : [],
      immunities: Array.isArray(data.immunities) ? data.immunities : [],
      absorbs: Array.isArray(data.absorbs) ? data.absorbs : [],
      breakImmune: Boolean(data.breakImmune),
    };
  }

  return { ...DEFAULT_ENEMY_SHIELDS };
}

export function initializeEnemyShields(enemyId, tier) {
  const data = getEnemyShieldData(enemyId);
  let shieldCount = data.shieldCount;
  if (tier === 4) {
    shieldCount = Math.max(shieldCount, 8);
  }

  return {
    shieldCount,
    maxShields: shieldCount,
    weaknesses: [...data.weaknesses],
    immunities: [...data.immunities],
    absorbs: [...data.absorbs],
    isBroken: false,
    breakTurnsRemaining: 0,
    breakImmune: data.breakImmune,
  };
}
