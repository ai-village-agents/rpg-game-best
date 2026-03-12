/**
 * Weather System Tests
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  WEATHER_TYPES,
  WEATHER_DATA,
  DEFAULT_CONFIG,
  createWeatherState,
  getWeatherData,
  getElementWeatherModifier,
  applyWeatherToStats,
  getWeatherDamage,
  isStatusBlockedByWeather,
  getRandomWeather,
  processWeatherTurn,
  setWeather,
  getWeatherSummary,
  getAllWeatherTypes,
  isActionBlockedByWeather,
  getVisibilityModifier,
  checkRandomWeatherEvent,
} from '../src/weather-system.js';

import {
  getWeatherStyles,
  renderWeatherIndicator,
  renderWeatherDisplay,
  renderWeatherChangeNotice,
  renderWeatherEventNotice,
  renderWeatherCatalog,
  getWeatherBackgroundClass,
} from '../src/weather-system-ui.js';

// ============================================================================
// Constants Tests
// ============================================================================

describe('WEATHER_TYPES', () => {
  it('should define all weather types', () => {
    assert.strictEqual(WEATHER_TYPES.CLEAR, 'clear');
    assert.strictEqual(WEATHER_TYPES.RAIN, 'rain');
    assert.strictEqual(WEATHER_TYPES.STORM, 'storm');
    assert.strictEqual(WEATHER_TYPES.SNOW, 'snow');
    assert.strictEqual(WEATHER_TYPES.BLIZZARD, 'blizzard');
    assert.strictEqual(WEATHER_TYPES.SANDSTORM, 'sandstorm');
    assert.strictEqual(WEATHER_TYPES.FOG, 'fog');
    assert.strictEqual(WEATHER_TYPES.HEATWAVE, 'heatwave');
    assert.strictEqual(WEATHER_TYPES.AURORA, 'aurora');
    assert.strictEqual(WEATHER_TYPES.VOID_RIFT, 'void-rift');
  });

  it('should have 10 unique weather types', () => {
    const types = Object.values(WEATHER_TYPES);
    assert.strictEqual(types.length, 10);
    assert.strictEqual(new Set(types).size, 10);
  });
});

describe('WEATHER_DATA', () => {
  it('should have data for all weather types', () => {
    for (const type of Object.values(WEATHER_TYPES)) {
      assert.ok(WEATHER_DATA[type], `Missing data for ${type}`);
    }
  });

  it('should have required properties for each weather', () => {
    for (const [type, data] of Object.entries(WEATHER_DATA)) {
      assert.ok(data.name, `${type} missing name`);
      assert.ok(data.icon, `${type} missing icon`);
      assert.ok(data.description, `${type} missing description`);
      assert.ok(typeof data.visibility === 'number', `${type} missing visibility`);
    }
  });

  it('should define rain with correct element bonuses', () => {
    const rain = WEATHER_DATA[WEATHER_TYPES.RAIN];
    assert.strictEqual(rain.elementBonus, 'ice');
    assert.strictEqual(rain.elementPenalty, 'fire');
    assert.strictEqual(rain.elementBonusAmount, 0.2);
  });

  it('should define blizzard with damage per turn', () => {
    const blizzard = WEATHER_DATA[WEATHER_TYPES.BLIZZARD];
    assert.strictEqual(blizzard.effects.damagePerTurn, 5);
    assert.strictEqual(blizzard.statusImmunity, 'burn');
  });
});

describe('DEFAULT_CONFIG', () => {
  it('should define default configuration', () => {
    assert.strictEqual(DEFAULT_CONFIG.defaultWeather, WEATHER_TYPES.CLEAR);
    assert.strictEqual(DEFAULT_CONFIG.minDuration, 3);
    assert.strictEqual(DEFAULT_CONFIG.maxDuration, 8);
    assert.strictEqual(DEFAULT_CONFIG.transitionChance, 0.15);
  });
});

// ============================================================================
// createWeatherState Tests
// ============================================================================

describe('createWeatherState', () => {
  it('should create state with defaults', () => {
    const state = createWeatherState();
    assert.strictEqual(state.current, WEATHER_TYPES.CLEAR);
    assert.ok(state.turnsRemaining >= DEFAULT_CONFIG.minDuration);
    assert.ok(state.turnsRemaining <= DEFAULT_CONFIG.maxDuration);
    assert.strictEqual(state.totalTurns, 0);
    assert.strictEqual(state.locked, false);
    assert.deepStrictEqual(state.history, [WEATHER_TYPES.CLEAR]);
  });

  it('should accept initial weather', () => {
    const state = createWeatherState({ initialWeather: WEATHER_TYPES.STORM });
    assert.strictEqual(state.current, WEATHER_TYPES.STORM);
    assert.deepStrictEqual(state.history, [WEATHER_TYPES.STORM]);
  });

  it('should accept custom duration', () => {
    const state = createWeatherState({ duration: 10 });
    assert.strictEqual(state.turnsRemaining, 10);
  });

  it('should accept locked flag', () => {
    const state = createWeatherState({ locked: true });
    assert.strictEqual(state.locked, true);
  });
});

// ============================================================================
// getWeatherData Tests
// ============================================================================

describe('getWeatherData', () => {
  it('should return data for valid weather type', () => {
    const data = getWeatherData(WEATHER_TYPES.RAIN);
    assert.strictEqual(data.name, 'Rain');
    assert.ok(data.icon);
  });

  it('should return clear weather for invalid type', () => {
    const data = getWeatherData('invalid');
    assert.strictEqual(data.name, 'Clear Skies');
  });
});

// ============================================================================
// getElementWeatherModifier Tests
// ============================================================================

describe('getElementWeatherModifier', () => {
  it('should return bonus for matching element', () => {
    const mod = getElementWeatherModifier('ice', WEATHER_TYPES.RAIN);
    assert.strictEqual(mod, 1.2); // +20%
  });

  it('should return penalty for opposing element', () => {
    const mod = getElementWeatherModifier('fire', WEATHER_TYPES.RAIN);
    assert.strictEqual(mod, 0.8); // -20%
  });

  it('should return 1.0 for neutral element', () => {
    const mod = getElementWeatherModifier('shadow', WEATHER_TYPES.RAIN);
    assert.strictEqual(mod, 1.0);
  });

  it('should return 1.0 for clear weather', () => {
    const mod = getElementWeatherModifier('fire', WEATHER_TYPES.CLEAR);
    assert.strictEqual(mod, 1.0);
  });

  it('should handle case insensitivity', () => {
    const mod = getElementWeatherModifier('ICE', WEATHER_TYPES.RAIN);
    assert.strictEqual(mod, 1.2);
  });

  it('should return 1.0 for null element', () => {
    const mod = getElementWeatherModifier(null, WEATHER_TYPES.RAIN);
    assert.strictEqual(mod, 1.0);
  });

  it('should return 1.0 for null weather', () => {
    const mod = getElementWeatherModifier('fire', null);
    assert.strictEqual(mod, 1.0);
  });
});

// ============================================================================
// applyWeatherToStats Tests
// ============================================================================

describe('applyWeatherToStats', () => {
  it('should apply accuracy penalty', () => {
    const stats = { accuracy: 1.0, speed: 100 };
    const modified = applyWeatherToStats(stats, WEATHER_TYPES.FOG);
    assert.strictEqual(modified.accuracy, 0.75); // -25%
  });

  it('should apply speed modifier', () => {
    const stats = { accuracy: 1.0, speed: 100 };
    const modified = applyWeatherToStats(stats, WEATHER_TYPES.SNOW);
    assert.strictEqual(modified.speed, 90); // -10%
  });

  it('should apply evasion modifier', () => {
    const stats = { accuracy: 1.0, evasion: 0.1 };
    const modified = applyWeatherToStats(stats, WEATHER_TYPES.FOG);
    assert.strictEqual(modified.evasion, 0.25); // +15%
  });

  it('should apply magic modifier', () => {
    const stats = { magic: 100 };
    const modified = applyWeatherToStats(stats, WEATHER_TYPES.AURORA);
    assert.strictEqual(modified.magic, 120); // +20%
  });

  it('should return unchanged stats for clear weather', () => {
    const stats = { accuracy: 1.0, speed: 100 };
    const modified = applyWeatherToStats(stats, WEATHER_TYPES.CLEAR);
    assert.deepStrictEqual(modified, stats);
  });

  it('should return original for null stats', () => {
    const modified = applyWeatherToStats(null, WEATHER_TYPES.RAIN);
    assert.strictEqual(modified, null);
  });
});

// ============================================================================
// getWeatherDamage Tests
// ============================================================================

describe('getWeatherDamage', () => {
  it('should return damage for damaging weather', () => {
    const damage = getWeatherDamage(WEATHER_TYPES.BLIZZARD);
    assert.strictEqual(damage, 5);
  });

  it('should return 0 for non-damaging weather', () => {
    const damage = getWeatherDamage(WEATHER_TYPES.CLEAR);
    assert.strictEqual(damage, 0);
  });

  it('should return 0 for immune entity type', () => {
    const damage = getWeatherDamage(WEATHER_TYPES.SANDSTORM, { type: 'rock' });
    assert.strictEqual(damage, 0);
  });

  it('should return damage for non-immune entity', () => {
    const damage = getWeatherDamage(WEATHER_TYPES.SANDSTORM, { type: 'human' });
    assert.strictEqual(damage, 8);
  });
});

// ============================================================================
// isStatusBlockedByWeather Tests
// ============================================================================

describe('isStatusBlockedByWeather', () => {
  it('should block burn in blizzard', () => {
    assert.strictEqual(isStatusBlockedByWeather('burn', WEATHER_TYPES.BLIZZARD), true);
  });

  it('should block freeze in heatwave', () => {
    assert.strictEqual(isStatusBlockedByWeather('freeze', WEATHER_TYPES.HEATWAVE), true);
  });

  it('should not block poison in rain', () => {
    assert.strictEqual(isStatusBlockedByWeather('poison', WEATHER_TYPES.RAIN), false);
  });

  it('should handle case insensitivity', () => {
    assert.strictEqual(isStatusBlockedByWeather('BURN', WEATHER_TYPES.SNOW), true);
  });
});

// ============================================================================
// getRandomWeather Tests
// ============================================================================

describe('getRandomWeather', () => {
  it('should return a valid weather type', () => {
    const weather = getRandomWeather();
    assert.ok(Object.values(WEATHER_TYPES).includes(weather));
  });

  it('should exclude specified weather', () => {
    for (let i = 0; i < 20; i++) {
      const weather = getRandomWeather({ excludeCurrent: WEATHER_TYPES.CLEAR });
      assert.notStrictEqual(weather, WEATHER_TYPES.CLEAR);
    }
  });

  it('should respect desert biome pool', () => {
    const validDesert = [WEATHER_TYPES.CLEAR, WEATHER_TYPES.SANDSTORM, WEATHER_TYPES.HEATWAVE];
    for (let i = 0; i < 20; i++) {
      const weather = getRandomWeather({ biome: 'desert' });
      assert.ok(validDesert.includes(weather), `${weather} not in desert pool`);
    }
  });

  it('should respect void biome pool', () => {
    const validVoid = [WEATHER_TYPES.VOID_RIFT, WEATHER_TYPES.FOG];
    for (let i = 0; i < 20; i++) {
      const weather = getRandomWeather({ biome: 'void' });
      assert.ok(validVoid.includes(weather), `${weather} not in void pool`);
    }
  });
});

// ============================================================================
// processWeatherTurn Tests
// ============================================================================

describe('processWeatherTurn', () => {
  it('should decrement turns remaining', () => {
    const state = createWeatherState({ duration: 5 });
    const { state: newState } = processWeatherTurn(state, { rngValue: 0.99 });
    assert.strictEqual(newState.turnsRemaining, 4);
    assert.strictEqual(newState.totalTurns, 1);
  });

  it('should change weather when turns expire', () => {
    const state = createWeatherState({ duration: 1, initialWeather: WEATHER_TYPES.RAIN });
    const { state: newState, changed } = processWeatherTurn(state);
    assert.strictEqual(changed, true);
    assert.ok(newState.turnsRemaining > 0);
  });

  it('should not change locked weather', () => {
    const state = createWeatherState({ duration: 1, locked: true, initialWeather: WEATHER_TYPES.STORM });
    const { state: newState, changed } = processWeatherTurn(state, { rngValue: 0 });
    assert.strictEqual(changed, false);
    assert.strictEqual(newState.current, WEATHER_TYPES.STORM);
  });

  it('should change weather on low RNG roll', () => {
    const state = createWeatherState({ duration: 10 });
    const { changed } = processWeatherTurn(state, { rngValue: 0.01 }); // Below 0.15
    assert.strictEqual(changed, true);
  });

  it('should force change when requested', () => {
    const state = createWeatherState({ duration: 10, initialWeather: WEATHER_TYPES.CLEAR });
    const { changed, newWeather } = processWeatherTurn(state, { forceChange: true });
    assert.strictEqual(changed, true);
    assert.ok(newWeather);
  });

  it('should create new state for null input', () => {
    const { state } = processWeatherTurn(null);
    assert.ok(state);
    assert.ok(state.current);
  });

  it('should add to history on change', () => {
    const state = createWeatherState({ duration: 1 });
    const { state: newState } = processWeatherTurn(state);
    assert.ok(newState.history.length >= 1);
  });
});

// ============================================================================
// setWeather Tests
// ============================================================================

describe('setWeather', () => {
  it('should set new weather type', () => {
    const state = createWeatherState();
    const newState = setWeather(state, WEATHER_TYPES.STORM);
    assert.strictEqual(newState.current, WEATHER_TYPES.STORM);
  });

  it('should set custom duration', () => {
    const state = createWeatherState();
    const newState = setWeather(state, WEATHER_TYPES.RAIN, 15);
    assert.strictEqual(newState.turnsRemaining, 15);
  });

  it('should add to history', () => {
    const state = createWeatherState();
    const newState = setWeather(state, WEATHER_TYPES.FOG);
    assert.ok(newState.history.includes(WEATHER_TYPES.FOG));
  });

  it('should return original for invalid weather', () => {
    const state = createWeatherState();
    const newState = setWeather(state, 'invalid');
    assert.strictEqual(newState, state);
  });
});

// ============================================================================
// getWeatherSummary Tests
// ============================================================================

describe('getWeatherSummary', () => {
  it('should return summary for valid state', () => {
    const state = createWeatherState({ initialWeather: WEATHER_TYPES.RAIN, duration: 5 });
    const summary = getWeatherSummary(state);

    assert.strictEqual(summary.type, WEATHER_TYPES.RAIN);
    assert.strictEqual(summary.name, 'Rain');
    assert.strictEqual(summary.turnsRemaining, 5);
    assert.ok(summary.icon);
    assert.ok(summary.description);
  });

  it('should return default for null state', () => {
    const summary = getWeatherSummary(null);
    assert.strictEqual(summary.name, 'Clear Skies');
  });
});

// ============================================================================
// getAllWeatherTypes Tests
// ============================================================================

describe('getAllWeatherTypes', () => {
  it('should return all 10 weather types', () => {
    const types = getAllWeatherTypes();
    assert.strictEqual(types.length, 10);
  });

  it('should include clear and storm', () => {
    const types = getAllWeatherTypes();
    assert.ok(types.includes(WEATHER_TYPES.CLEAR));
    assert.ok(types.includes(WEATHER_TYPES.STORM));
  });
});

// ============================================================================
// isActionBlockedByWeather Tests
// ============================================================================

describe('isActionBlockedByWeather', () => {
  it('should block flying in blizzard', () => {
    assert.strictEqual(isActionBlockedByWeather('fly', WEATHER_TYPES.BLIZZARD), true);
  });

  it('should block flying in sandstorm', () => {
    assert.strictEqual(isActionBlockedByWeather('fly', WEATHER_TYPES.SANDSTORM), true);
  });

  it('should not block flying in clear weather', () => {
    assert.strictEqual(isActionBlockedByWeather('fly', WEATHER_TYPES.CLEAR), false);
  });

  it('should not block other actions', () => {
    assert.strictEqual(isActionBlockedByWeather('attack', WEATHER_TYPES.BLIZZARD), false);
  });
});

// ============================================================================
// getVisibilityModifier Tests
// ============================================================================

describe('getVisibilityModifier', () => {
  it('should return 1.0 for clear weather', () => {
    assert.strictEqual(getVisibilityModifier(WEATHER_TYPES.CLEAR), 1.0);
  });

  it('should return reduced visibility for fog', () => {
    assert.strictEqual(getVisibilityModifier(WEATHER_TYPES.FOG), 0.3);
  });

  it('should return reduced visibility for sandstorm', () => {
    assert.strictEqual(getVisibilityModifier(WEATHER_TYPES.SANDSTORM), 0.4);
  });

  it('should return 1.0 for invalid weather', () => {
    assert.strictEqual(getVisibilityModifier('invalid'), 1.0);
  });
});

// ============================================================================
// checkRandomWeatherEvent Tests
// ============================================================================

describe('checkRandomWeatherEvent', () => {
  it('should return lightning event during storm with low RNG', () => {
    const event = checkRandomWeatherEvent(WEATHER_TYPES.STORM, 0.05);
    assert.ok(event);
    assert.strictEqual(event.type, 'lightning_strike');
    assert.strictEqual(event.element, 'lightning');
    assert.ok(event.damage > 0);
  });

  it('should return null during storm with high RNG', () => {
    const event = checkRandomWeatherEvent(WEATHER_TYPES.STORM, 0.99);
    assert.strictEqual(event, null);
  });

  it('should return null for clear weather', () => {
    const event = checkRandomWeatherEvent(WEATHER_TYPES.CLEAR, 0.01);
    assert.strictEqual(event, null);
  });
});

// ============================================================================
// UI Component Tests
// ============================================================================

describe('getWeatherStyles', () => {
  it('should return CSS string', () => {
    const css = getWeatherStyles();
    assert.ok(typeof css === 'string');
    assert.ok(css.includes('.weather-container'));
    assert.ok(css.includes('.weather-icon'));
  });

  it('should include weather-specific themes', () => {
    const css = getWeatherStyles();
    assert.ok(css.includes('.weather-container.rain'));
    assert.ok(css.includes('.weather-container.storm'));
    assert.ok(css.includes('.weather-container.fog'));
  });

  it('should include animations', () => {
    const css = getWeatherStyles();
    assert.ok(css.includes('@keyframes storm-flash'));
    assert.ok(css.includes('@keyframes aurora-glow'));
  });
});

describe('renderWeatherIndicator', () => {
  it('should render indicator for weather state', () => {
    const state = createWeatherState({ initialWeather: WEATHER_TYPES.RAIN });
    const html = renderWeatherIndicator(state);

    assert.ok(html.includes('weather-container'));
    assert.ok(html.includes('Rain'));
  });

  it('should render default for null state', () => {
    const html = renderWeatherIndicator(null);
    assert.ok(html.includes('Clear'));
  });

  it('should include duration', () => {
    const state = createWeatherState({ duration: 5 });
    const html = renderWeatherIndicator(state);
    assert.ok(html.includes('5 turns'));
  });
});

describe('renderWeatherDisplay', () => {
  it('should render detailed display', () => {
    const state = createWeatherState({ initialWeather: WEATHER_TYPES.STORM });
    const html = renderWeatherDisplay(state);

    assert.ok(html.includes('weather-description'));
    assert.ok(html.includes('Thunderstorm'));
  });

  it('should render effects', () => {
    const state = createWeatherState({ initialWeather: WEATHER_TYPES.FOG });
    const html = renderWeatherDisplay(state);

    assert.ok(html.includes('weather-effects'));
    assert.ok(html.includes('Accuracy'));
  });

  it('should include visibility overlay for low visibility', () => {
    const state = createWeatherState({ initialWeather: WEATHER_TYPES.FOG });
    const html = renderWeatherDisplay(state);

    assert.ok(html.includes('visibility-overlay'));
  });
});

describe('renderWeatherChangeNotice', () => {
  it('should render change notification', () => {
    const html = renderWeatherChangeNotice(WEATHER_TYPES.CLEAR, WEATHER_TYPES.RAIN);

    assert.ok(html.includes('weather-change-notice'));
    assert.ok(html.includes('Rain'));
    assert.ok(html.includes('\u2192')); // Arrow
  });
});

describe('renderWeatherEventNotice', () => {
  it('should render event notification', () => {
    const event = {
      type: 'lightning_strike',
      message: 'Lightning strikes!',
      damage: 25,
    };
    const html = renderWeatherEventNotice(event);

    assert.ok(html.includes('Lightning strikes!'));
    assert.ok(html.includes('\u26A1'));
  });

  it('should return empty for null event', () => {
    const html = renderWeatherEventNotice(null);
    assert.strictEqual(html, '');
  });
});

describe('renderWeatherCatalog', () => {
  it('should render all weather types', () => {
    const html = renderWeatherCatalog();

    assert.ok(html.includes('Clear Skies'));
    assert.ok(html.includes('Rain'));
    assert.ok(html.includes('Thunderstorm'));
    assert.ok(html.includes('Blizzard'));
    assert.ok(html.includes('weather-catalog'));
  });
});

describe('getWeatherBackgroundClass', () => {
  it('should return class for rain', () => {
    assert.strictEqual(getWeatherBackgroundClass(WEATHER_TYPES.RAIN), 'bg-rain');
  });

  it('should return class for storm', () => {
    assert.strictEqual(getWeatherBackgroundClass(WEATHER_TYPES.STORM), 'bg-storm');
  });

  it('should return default for clear', () => {
    assert.strictEqual(getWeatherBackgroundClass(WEATHER_TYPES.CLEAR), 'bg-clear');
  });

  it('should return default for invalid', () => {
    assert.strictEqual(getWeatherBackgroundClass('invalid'), 'bg-clear');
  });
});

// ============================================================================
// Security Tests
// ============================================================================

describe('Security: No Banned Words', () => {
  const bannedWords = ['egg', 'easter', 'yolk', 'bunny', 'rabbit', 'phoenix'];

  it('should not contain banned words in weather names', () => {
    for (const data of Object.values(WEATHER_DATA)) {
      const nameLower = data.name.toLowerCase();
      for (const word of bannedWords) {
        assert.ok(
          !nameLower.includes(word),
          `Weather name "${data.name}" contains banned word "${word}"`
        );
      }
    }
  });

  it('should not contain banned words in descriptions', () => {
    for (const data of Object.values(WEATHER_DATA)) {
      const descLower = data.description.toLowerCase();
      for (const word of bannedWords) {
        assert.ok(
          !descLower.includes(word),
          `Description contains banned word "${word}": ${data.description}`
        );
      }
    }
  });
});
