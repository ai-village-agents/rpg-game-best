/**
 * Weather System UI Components
 * Renders weather indicators and effects
 */

import {
  WEATHER_TYPES,
  WEATHER_DATA,
  getWeatherData,
  getWeatherSummary,
  getVisibilityModifier,
} from './weather-system.js';

/**
 * Get CSS styles for weather system
 * @returns {string} CSS styles
 */
export function getWeatherStyles() {
  return `
.weather-container {
  position: relative;
  padding: 8px 12px;
  border-radius: 8px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 1px solid #0f3460;
  margin-bottom: 10px;
}

.weather-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.weather-icon {
  font-size: 24px;
  line-height: 1;
}

.weather-name {
  font-size: 14px;
  font-weight: bold;
  color: #e8e8e8;
}

.weather-duration {
  font-size: 11px;
  color: #888;
  margin-left: auto;
}

.weather-description {
  font-size: 11px;
  color: #aaa;
  font-style: italic;
  margin-bottom: 6px;
}

.weather-effects {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.weather-effect {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255,255,255,0.1);
}

.weather-effect.bonus {
  background: rgba(100,200,100,0.2);
  color: #8f8;
}

.weather-effect.penalty {
  background: rgba(200,100,100,0.2);
  color: #f88;
}

.weather-effect.neutral {
  background: rgba(150,150,200,0.2);
  color: #aaf;
}

/* Weather-specific themes */
.weather-container.rain {
  background: linear-gradient(135deg, #1a2a3e 0%, #0f1f2e 100%);
  border-color: #2a4a6a;
}

.weather-container.storm {
  background: linear-gradient(135deg, #1a1a3e 0%, #0f0f2e 100%);
  border-color: #4a4a8a;
  animation: storm-flash 3s infinite;
}

@keyframes storm-flash {
  0%, 90%, 100% { opacity: 1; }
  92% { opacity: 0.8; }
  94% { opacity: 1; }
  96% { opacity: 0.7; }
}

.weather-container.snow, .weather-container.blizzard {
  background: linear-gradient(135deg, #2a3a4a 0%, #1a2a3a 100%);
  border-color: #6a8aaa;
}

.weather-container.sandstorm {
  background: linear-gradient(135deg, #3a2a1a 0%, #2a1a0a 100%);
  border-color: #8a6a4a;
}

.weather-container.fog {
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border-color: #5a5a5a;
}

.weather-container.heatwave {
  background: linear-gradient(135deg, #3a1a0a 0%, #2a0a0a 100%);
  border-color: #aa4a2a;
}

.weather-container.aurora {
  background: linear-gradient(135deg, #1a2a3a 0%, #2a1a3a 100%);
  border-color: #6a8aaa;
  animation: aurora-glow 4s infinite;
}

@keyframes aurora-glow {
  0%, 100% { border-color: #6a8aaa; }
  33% { border-color: #8aaa6a; }
  66% { border-color: #aa6a8a; }
}

.weather-container.void-rift {
  background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 100%);
  border-color: #4a2a6a;
  animation: void-pulse 2s infinite;
}

@keyframes void-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}

/* Weather transition animation */
.weather-transition {
  animation: weather-change 0.5s ease-out;
}

@keyframes weather-change {
  0% { transform: scale(0.95); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}

/* Visibility overlay */
.visibility-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  border-radius: 8px;
}

.visibility-overlay.low {
  background: rgba(0,0,0,0.3);
}

.visibility-overlay.very-low {
  background: rgba(0,0,0,0.5);
}

/* Weather change notification */
.weather-change-notice {
  padding: 8px 12px;
  background: linear-gradient(135deg, #2a2a4a 0%, #1a1a3a 100%);
  border: 1px solid #4a4a8a;
  border-radius: 6px;
  text-align: center;
  animation: notice-fade 3s ease-out forwards;
}

@keyframes notice-fade {
  0% { opacity: 1; transform: translateY(0); }
  70% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-10px); }
}

.weather-change-notice .change-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.weather-change-notice .change-text {
  font-size: 12px;
  color: #ccc;
}
`;
}

/**
 * Render weather indicator
 * @param {Object} state - Weather state
 * @returns {string} HTML string
 */
export function renderWeatherIndicator(state) {
  if (!state) {
    return '<div class="weather-container clear"><span class="weather-icon">\u2600\uFE0F</span> Clear</div>';
  }

  const summary = getWeatherSummary(state);
  const weatherClass = state.current.replace('-', '');

  return `
    <div class="weather-container ${weatherClass}">
      <div class="weather-header">
        <span class="weather-icon">${escapeHtml(summary.icon)}</span>
        <span class="weather-name">${escapeHtml(summary.name)}</span>
        <span class="weather-duration">${summary.turnsRemaining} turns</span>
      </div>
    </div>
  `.trim();
}

/**
 * Render detailed weather display
 * @param {Object} state - Weather state
 * @returns {string} HTML string
 */
export function renderWeatherDisplay(state) {
  if (!state) {
    return renderWeatherIndicator(null);
  }

  const summary = getWeatherSummary(state);
  const weatherClass = state.current.replace('-', '');
  const effects = formatWeatherEffects(summary);
  const visibility = getVisibilityModifier(state.current);
  const visibilityClass = visibility < 0.5 ? 'very-low' : visibility < 0.8 ? 'low' : '';

  return `
    <div class="weather-container ${weatherClass}">
      ${visibilityClass ? `<div class="visibility-overlay ${visibilityClass}"></div>` : ''}
      <div class="weather-header">
        <span class="weather-icon">${escapeHtml(summary.icon)}</span>
        <span class="weather-name">${escapeHtml(summary.name)}</span>
        <span class="weather-duration">${summary.turnsRemaining} turns</span>
      </div>
      <div class="weather-description">${escapeHtml(summary.description)}</div>
      ${effects.length > 0 ? `
        <div class="weather-effects">
          ${effects.join('')}
        </div>
      ` : ''}
    </div>
  `.trim();
}

/**
 * Format weather effects for display
 * @param {Object} summary - Weather summary
 * @returns {Array} Array of effect HTML strings
 */
function formatWeatherEffects(summary) {
  const effects = [];

  // Element bonus
  if (summary.elementBonus) {
    effects.push(`<span class="weather-effect bonus">${capitalize(summary.elementBonus)} +</span>`);
  }

  // Element penalty
  if (summary.elementPenalty) {
    effects.push(`<span class="weather-effect penalty">${capitalize(summary.elementPenalty)} -</span>`);
  }

  // Stat effects
  const statEffects = summary.effects || {};

  if (statEffects.accuracyMod) {
    const mod = Math.round(statEffects.accuracyMod * 100);
    const cls = mod > 0 ? 'bonus' : 'penalty';
    effects.push(`<span class="weather-effect ${cls}">Accuracy ${mod > 0 ? '+' : ''}${mod}%</span>`);
  }

  if (statEffects.speedMod) {
    const mod = Math.round(statEffects.speedMod * 100);
    const cls = mod > 0 ? 'bonus' : 'penalty';
    effects.push(`<span class="weather-effect ${cls}">Speed ${mod > 0 ? '+' : ''}${mod}%</span>`);
  }

  if (statEffects.evasionMod) {
    const mod = Math.round(statEffects.evasionMod * 100);
    const cls = mod > 0 ? 'bonus' : 'penalty';
    effects.push(`<span class="weather-effect ${cls}">Evasion ${mod > 0 ? '+' : ''}${mod}%</span>`);
  }

  if (statEffects.magicMod) {
    const mod = Math.round(statEffects.magicMod * 100);
    effects.push(`<span class="weather-effect bonus">Magic +${mod}%</span>`);
  }

  if (statEffects.damagePerTurn) {
    effects.push(`<span class="weather-effect penalty">${statEffects.damagePerTurn} dmg/turn</span>`);
  }

  if (statEffects.lightningChance) {
    effects.push(`<span class="weather-effect neutral">Lightning strikes!</span>`);
  }

  return effects;
}

/**
 * Render weather change notification
 * @param {string} oldWeather - Previous weather type
 * @param {string} newWeather - New weather type
 * @returns {string} HTML string
 */
export function renderWeatherChangeNotice(oldWeather, newWeather) {
  const oldData = getWeatherData(oldWeather);
  const newData = getWeatherData(newWeather);

  return `
    <div class="weather-change-notice">
      <div class="change-icon">${escapeHtml(oldData.icon)} \u2192 ${escapeHtml(newData.icon)}</div>
      <div class="change-text">The weather changed to ${escapeHtml(newData.name)}!</div>
    </div>
  `.trim();
}

/**
 * Render weather event notification
 * @param {Object} event - Weather event
 * @returns {string} HTML string
 */
export function renderWeatherEventNotice(event) {
  if (!event) return '';

  const icons = {
    lightning_strike: '\u26A1',
  };

  return `
    <div class="weather-change-notice">
      <div class="change-icon">${icons[event.type] || '\u26A0\uFE0F'}</div>
      <div class="change-text">${escapeHtml(event.message)}</div>
    </div>
  `.trim();
}

/**
 * Render weather catalog (all weather types)
 * @returns {string} HTML string
 */
export function renderWeatherCatalog() {
  const types = Object.values(WEATHER_TYPES);

  const items = types.map(type => {
    const data = WEATHER_DATA[type];
    return `
      <div class="weather-catalog-item">
        <span class="weather-icon">${escapeHtml(data.icon)}</span>
        <span class="weather-name">${escapeHtml(data.name)}</span>
        <span class="weather-desc">${escapeHtml(data.description)}</span>
      </div>
    `;
  });

  return `
    <div class="weather-catalog">
      ${items.join('')}
    </div>
  `.trim();
}

/**
 * Get weather background effect class
 * @param {string} weatherType - Current weather
 * @returns {string} CSS class name
 */
export function getWeatherBackgroundClass(weatherType) {
  const classMap = {
    [WEATHER_TYPES.RAIN]: 'bg-rain',
    [WEATHER_TYPES.STORM]: 'bg-storm',
    [WEATHER_TYPES.SNOW]: 'bg-snow',
    [WEATHER_TYPES.BLIZZARD]: 'bg-blizzard',
    [WEATHER_TYPES.SANDSTORM]: 'bg-sandstorm',
    [WEATHER_TYPES.FOG]: 'bg-fog',
    [WEATHER_TYPES.HEATWAVE]: 'bg-heatwave',
    [WEATHER_TYPES.AURORA]: 'bg-aurora',
    [WEATHER_TYPES.VOID_RIFT]: 'bg-void',
  };

  return classMap[weatherType] || 'bg-clear';
}

/**
 * Escape HTML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalize(str) {
  if (typeof str !== 'string' || str.length === 0) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
