/**
 * Weather System
 * Affects combat conditions with dynamic weather that modifies stats and elements
 */

/**
 * Weather types
 */
export const WEATHER_TYPES = {
  CLEAR: 'clear',
  RAIN: 'rain',
  STORM: 'storm',
  SNOW: 'snow',
  BLIZZARD: 'blizzard',
  SANDSTORM: 'sandstorm',
  FOG: 'fog',
  HEATWAVE: 'heatwave',
  AURORA: 'aurora',
  VOID_RIFT: 'void-rift',
};

/**
 * Weather data definitions
 */
export const WEATHER_DATA = {
  [WEATHER_TYPES.CLEAR]: {
    name: 'Clear Skies',
    icon: '\u2600\uFE0F', // ☀️
    description: 'The sky is clear with no weather effects.',
    effects: {},
    elementBonus: null,
    elementPenalty: null,
    statusImmunity: null,
    visibility: 1.0,
  },
  [WEATHER_TYPES.RAIN]: {
    name: 'Rain',
    icon: '\uD83C\uDF27\uFE0F', // 🌧️
    description: 'Rain falls steadily, boosting water attacks.',
    effects: {
      accuracyMod: -0.05, // -5% accuracy
    },
    elementBonus: 'ice',
    elementBonusAmount: 0.2,
    elementPenalty: 'fire',
    elementPenaltyAmount: 0.2,
    statusImmunity: null,
    visibility: 0.9,
  },
  [WEATHER_TYPES.STORM]: {
    name: 'Thunderstorm',
    icon: '\u26C8\uFE0F', // ⛈️
    description: 'Thunder roars as lightning crackles. Electric attacks surge.',
    effects: {
      accuracyMod: -0.1, // -10% accuracy
      lightningChance: 0.1, // 10% chance of random lightning strike
    },
    elementBonus: 'lightning',
    elementBonusAmount: 0.3,
    elementPenalty: 'fire',
    elementPenaltyAmount: 0.3,
    statusImmunity: null,
    visibility: 0.7,
  },
  [WEATHER_TYPES.SNOW]: {
    name: 'Snow',
    icon: '\uD83C\uDF28\uFE0F', // 🌨️
    description: 'Gentle snow falls, chilling the battlefield.',
    effects: {
      speedMod: -0.1, // -10% speed
    },
    elementBonus: 'ice',
    elementBonusAmount: 0.25,
    elementPenalty: 'nature',
    elementPenaltyAmount: 0.15,
    statusImmunity: 'burn',
    visibility: 0.85,
  },
  [WEATHER_TYPES.BLIZZARD]: {
    name: 'Blizzard',
    icon: '\u2744\uFE0F', // ❄️
    description: 'A fierce blizzard rages, hampering all movement.',
    effects: {
      speedMod: -0.25, // -25% speed
      accuracyMod: -0.15, // -15% accuracy
      damagePerTurn: 5,
    },
    elementBonus: 'ice',
    elementBonusAmount: 0.4,
    elementPenalty: 'fire',
    elementPenaltyAmount: 0.4,
    statusImmunity: 'burn',
    visibility: 0.5,
  },
  [WEATHER_TYPES.SANDSTORM]: {
    name: 'Sandstorm',
    icon: '\uD83C\uDF2A\uFE0F', // 🌪️
    description: 'Swirling sand obscures vision and damages exposed combatants.',
    effects: {
      accuracyMod: -0.2, // -20% accuracy
      damagePerTurn: 8,
    },
    elementBonus: null,
    elementPenalty: null,
    statusImmunity: null,
    visibility: 0.4,
    immuneTypes: ['rock', 'ground', 'steel'], // Some enemy types immune
  },
  [WEATHER_TYPES.FOG]: {
    name: 'Dense Fog',
    icon: '\uD83C\uDF2B\uFE0F', // 🌫️
    description: 'Thick fog blankets the area, reducing visibility drastically.',
    effects: {
      accuracyMod: -0.25, // -25% accuracy
      evasionMod: 0.15, // +15% evasion
    },
    elementBonus: null,
    elementPenalty: null,
    statusImmunity: null,
    visibility: 0.3,
  },
  [WEATHER_TYPES.HEATWAVE]: {
    name: 'Heatwave',
    icon: '\uD83D\uDD25', // 🔥
    description: 'Scorching heat intensifies fire and saps stamina.',
    effects: {
      staminaDrain: 5, // Drain 5 stamina per turn
    },
    elementBonus: 'fire',
    elementBonusAmount: 0.3,
    elementPenalty: 'ice',
    elementPenaltyAmount: 0.3,
    statusImmunity: 'freeze',
    visibility: 0.95,
  },
  [WEATHER_TYPES.AURORA]: {
    name: 'Aurora',
    icon: '\u2728', // ✨
    description: 'Mystical lights dance in the sky, empowering magical attacks.',
    effects: {
      magicMod: 0.2, // +20% magic damage
      mpRegenMod: 0.1, // +10% MP regen
    },
    elementBonus: 'holy',
    elementBonusAmount: 0.2,
    elementPenalty: null,
    statusImmunity: null,
    visibility: 1.0,
  },
  [WEATHER_TYPES.VOID_RIFT]: {
    name: 'Void Rift',
    icon: '\uD83C\uDF11', // 🌑
    description: 'Reality tears open, empowering shadow magic but draining life.',
    effects: {
      damagePerTurn: 3,
      shadowMod: 0.3, // +30% shadow damage
    },
    elementBonus: 'shadow',
    elementBonusAmount: 0.35,
    elementPenalty: 'holy',
    elementPenaltyAmount: 0.25,
    statusImmunity: null,
    visibility: 0.6,
  },
};

/**
 * Default weather configuration
 */
export const DEFAULT_CONFIG = {
  defaultWeather: WEATHER_TYPES.CLEAR,
  minDuration: 3,
  maxDuration: 8,
  transitionChance: 0.15, // 15% chance to change weather per turn
};

/**
 * Create weather state for a battle
 * @param {Object} options - Configuration options
 * @returns {Object} Weather state
 */
export function createWeatherState(options = {}) {
  const {
    initialWeather = DEFAULT_CONFIG.defaultWeather,
    duration = null,
    locked = false,
  } = options;

  const weatherDuration = duration ||
    Math.floor(Math.random() * (DEFAULT_CONFIG.maxDuration - DEFAULT_CONFIG.minDuration + 1)) +
    DEFAULT_CONFIG.minDuration;

  return {
    current: initialWeather,
    turnsRemaining: weatherDuration,
    totalTurns: 0,
    locked, // If true, weather won't change
    history: [initialWeather],
  };
}

/**
 * Get weather data for a weather type
 * @param {string} weatherType - Weather type
 * @returns {Object} Weather data
 */
export function getWeatherData(weatherType) {
  return WEATHER_DATA[weatherType] || WEATHER_DATA[WEATHER_TYPES.CLEAR];
}

/**
 * Calculate element damage modifier based on weather
 * @param {string} element - Attack element
 * @param {string} weatherType - Current weather
 * @returns {number} Damage multiplier (1.0 = no change)
 */
export function getElementWeatherModifier(element, weatherType) {
  if (!element || !weatherType) return 1.0;

  const weather = WEATHER_DATA[weatherType];
  if (!weather) return 1.0;

  const normalizedElement = element.toLowerCase();

  // Check for bonus
  if (weather.elementBonus && normalizedElement === weather.elementBonus.toLowerCase()) {
    return 1.0 + (weather.elementBonusAmount || 0);
  }

  // Check for penalty
  if (weather.elementPenalty && normalizedElement === weather.elementPenalty.toLowerCase()) {
    return 1.0 - (weather.elementPenaltyAmount || 0);
  }

  return 1.0;
}

/**
 * Apply weather effects to stats
 * @param {Object} baseStats - Base stats { accuracy, speed, evasion, magic }
 * @param {string} weatherType - Current weather
 * @returns {Object} Modified stats
 */
export function applyWeatherToStats(baseStats, weatherType) {
  if (!baseStats) return baseStats;

  const weather = WEATHER_DATA[weatherType];
  if (!weather || !weather.effects) return baseStats;

  const { effects } = weather;
  const modifiedStats = { ...baseStats };

  if (effects.accuracyMod && typeof modifiedStats.accuracy === 'number') {
    modifiedStats.accuracy = modifiedStats.accuracy * (1 + effects.accuracyMod);
  }

  if (effects.speedMod && typeof modifiedStats.speed === 'number') {
    modifiedStats.speed = Math.floor(modifiedStats.speed * (1 + effects.speedMod));
  }

  if (effects.evasionMod && typeof modifiedStats.evasion === 'number') {
    modifiedStats.evasion = modifiedStats.evasion + effects.evasionMod;
  }

  if (effects.magicMod && typeof modifiedStats.magic === 'number') {
    modifiedStats.magic = Math.floor(modifiedStats.magic * (1 + effects.magicMod));
  }

  return modifiedStats;
}

/**
 * Get weather damage per turn
 * @param {string} weatherType - Current weather
 * @param {Object} entity - Entity with potential immunities
 * @returns {number} Damage to apply
 */
export function getWeatherDamage(weatherType, entity = {}) {
  const weather = WEATHER_DATA[weatherType];
  if (!weather || !weather.effects || !weather.effects.damagePerTurn) {
    return 0;
  }

  // Check immunity
  const immuneTypes = weather.immuneTypes || [];
  const entityType = entity.type || '';
  if (immuneTypes.includes(entityType.toLowerCase())) {
    return 0;
  }

  return weather.effects.damagePerTurn;
}

/**
 * Check if status effect is blocked by weather
 * @param {string} statusType - Status effect type
 * @param {string} weatherType - Current weather
 * @returns {boolean} Whether status is immune
 */
export function isStatusBlockedByWeather(statusType, weatherType) {
  const weather = WEATHER_DATA[weatherType];
  if (!weather || !weather.statusImmunity) return false;

  return statusType.toLowerCase() === weather.statusImmunity.toLowerCase();
}

/**
 * Get a random weather type (weighted by context)
 * @param {Object} context - Context for weather selection
 * @returns {string} Weather type
 */
export function getRandomWeather(context = {}) {
  const { biome = 'standard', excludeCurrent = null } = context;

  // Define weather pools by biome
  const biomePools = {
    standard: [
      WEATHER_TYPES.CLEAR,
      WEATHER_TYPES.RAIN,
      WEATHER_TYPES.FOG,
    ],
    mountain: [
      WEATHER_TYPES.CLEAR,
      WEATHER_TYPES.SNOW,
      WEATHER_TYPES.BLIZZARD,
      WEATHER_TYPES.FOG,
    ],
    desert: [
      WEATHER_TYPES.CLEAR,
      WEATHER_TYPES.SANDSTORM,
      WEATHER_TYPES.HEATWAVE,
    ],
    coast: [
      WEATHER_TYPES.CLEAR,
      WEATHER_TYPES.RAIN,
      WEATHER_TYPES.STORM,
      WEATHER_TYPES.FOG,
    ],
    magical: [
      WEATHER_TYPES.CLEAR,
      WEATHER_TYPES.AURORA,
      WEATHER_TYPES.VOID_RIFT,
      WEATHER_TYPES.FOG,
    ],
    void: [
      WEATHER_TYPES.VOID_RIFT,
      WEATHER_TYPES.FOG,
    ],
  };

  const pool = biomePools[biome] || biomePools.standard;
  const filtered = excludeCurrent
    ? pool.filter(w => w !== excludeCurrent)
    : pool;

  if (filtered.length === 0) return WEATHER_TYPES.CLEAR;

  return filtered[Math.floor(Math.random() * filtered.length)];
}

/**
 * Process weather turn (potentially change weather)
 * @param {Object} state - Weather state
 * @param {Object} options - Processing options
 * @returns {Object} Updated state and change info
 */
export function processWeatherTurn(state, options = {}) {
  if (!state) return { state: createWeatherState(), changed: false };

  const { biome = 'standard', forceChange = false, rngValue = Math.random() } = options;

  let newState = {
    ...state,
    turnsRemaining: Math.max(0, state.turnsRemaining - 1),
    totalTurns: state.totalTurns + 1,
  };

  let changed = false;
  let newWeather = null;

  // Check for weather change
  if (!state.locked) {
    const shouldChange = forceChange ||
      (newState.turnsRemaining === 0) ||
      (rngValue < DEFAULT_CONFIG.transitionChance);

    if (shouldChange) {
      newWeather = getRandomWeather({ biome, excludeCurrent: state.current });
      const newDuration = Math.floor(Math.random() * (DEFAULT_CONFIG.maxDuration - DEFAULT_CONFIG.minDuration + 1)) +
        DEFAULT_CONFIG.minDuration;

      newState = {
        ...newState,
        current: newWeather,
        turnsRemaining: newDuration,
        history: [...newState.history, newWeather],
      };
      changed = true;
    }
  }

  return {
    state: newState,
    changed,
    previousWeather: changed ? state.current : null,
    newWeather: changed ? newWeather : null,
  };
}

/**
 * Force set weather
 * @param {Object} state - Weather state
 * @param {string} weatherType - Weather to set
 * @param {number} duration - Duration in turns
 * @returns {Object} Updated state
 */
export function setWeather(state, weatherType, duration = null) {
  if (!state || !WEATHER_DATA[weatherType]) {
    return state || createWeatherState();
  }

  const weatherDuration = duration ||
    Math.floor(Math.random() * (DEFAULT_CONFIG.maxDuration - DEFAULT_CONFIG.minDuration + 1)) +
    DEFAULT_CONFIG.minDuration;

  return {
    ...state,
    current: weatherType,
    turnsRemaining: weatherDuration,
    history: [...state.history, weatherType],
  };
}

/**
 * Get weather summary for display
 * @param {Object} state - Weather state
 * @returns {Object} Summary info
 */
export function getWeatherSummary(state) {
  if (!state) {
    return {
      name: 'Clear Skies',
      icon: '\u2600\uFE0F',
      turnsRemaining: 0,
      effects: {},
    };
  }

  const weatherData = getWeatherData(state.current);
  return {
    type: state.current,
    name: weatherData.name,
    icon: weatherData.icon,
    description: weatherData.description,
    turnsRemaining: state.turnsRemaining,
    effects: weatherData.effects,
    visibility: weatherData.visibility,
    elementBonus: weatherData.elementBonus,
    elementPenalty: weatherData.elementPenalty,
  };
}

/**
 * Get all weather types
 * @returns {Array} Array of weather type strings
 */
export function getAllWeatherTypes() {
  return Object.values(WEATHER_TYPES);
}

/**
 * Check if weather blocks a specific action
 * @param {string} actionType - Type of action
 * @param {string} weatherType - Current weather
 * @returns {boolean} Whether action is blocked
 */
export function isActionBlockedByWeather(actionType, weatherType) {
  // Flying actions blocked in blizzard/sandstorm
  if (actionType === 'fly') {
    return [WEATHER_TYPES.BLIZZARD, WEATHER_TYPES.SANDSTORM, WEATHER_TYPES.STORM].includes(weatherType);
  }

  return false;
}

/**
 * Get visibility modifier for weather
 * @param {string} weatherType - Current weather
 * @returns {number} Visibility multiplier (0-1)
 */
export function getVisibilityModifier(weatherType) {
  const weather = WEATHER_DATA[weatherType];
  return weather ? weather.visibility : 1.0;
}

/**
 * Calculate chance of random weather event
 * @param {string} weatherType - Current weather
 * @param {number} rngValue - Random value 0-1
 * @returns {Object|null} Random event or null
 */
export function checkRandomWeatherEvent(weatherType, rngValue = Math.random()) {
  const weather = WEATHER_DATA[weatherType];
  if (!weather || !weather.effects) return null;

  // Lightning strike during storm
  if (weather.effects.lightningChance && rngValue < weather.effects.lightningChance) {
    return {
      type: 'lightning_strike',
      damage: 25,
      element: 'lightning',
      message: 'Lightning strikes from the storm!',
    };
  }

  return null;
}
