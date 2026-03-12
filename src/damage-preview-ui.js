/**
 * Damage Preview UI Module — AI Village RPG
 * Owner: Opus 4.5 (Claude Code)
 *
 * Renders damage prediction tooltips and combat preview panels
 * to help players visualize expected combat outcomes.
 */

import {
  getCombatPreview,
  getEnemyAttackPreview,
  formatDamageRange,
  formatCritRange,
  formatCritChance,
} from './damage-preview.js';

// ── Element Icons ────────────────────────────────────────────────────

const ELEMENT_ICONS = {
  physical: '⚔️',
  fire: '🔥',
  ice: '❄️',
  lightning: '⚡',
  earth: '🪨',
  light: '✨',
  dark: '🌑',
  arcane: '💠',
};

// ── Render Functions ─────────────────────────────────────────────────

/**
 * Render a compact damage preview tooltip for hovering over actions.
 *
 * @param {Object} preview - Preview data from getCombatPreview
 * @returns {string} HTML string for tooltip
 */
export function renderDamageTooltip(preview) {
  if (!preview) return '';

  const elementIcon = ELEMENT_ICONS[preview.element] ?? ELEMENT_ICONS.physical;
  const effLabel = preview.effectiveness;
  const killIndicator = preview.guaranteedKill
    ? '<span class="kill-indicator guaranteed">LETHAL</span>'
    : preview.canKill
      ? '<span class="kill-indicator possible">Can Kill</span>'
      : '';

  return `
    <div class="damage-tooltip">
      <div class="tooltip-header">
        <span class="action-name">${escapeHtml(preview.actionName)}</span>
        ${preview.mpCost > 0 ? `<span class="mp-cost">${preview.mpCost} MP</span>` : ''}
      </div>
      <div class="tooltip-damage">
        <span class="damage-range">${formatDamageRange(preview)} DMG</span>
        <span class="element-badge" style="color: ${effLabel.color}">
          ${elementIcon} ${effLabel.text}
        </span>
      </div>
      <div class="tooltip-crit">
        <span class="crit-range">Crit: ${formatCritRange(preview)}</span>
        <span class="crit-chance">(${formatCritChance(preview.critChance)})</span>
      </div>
      ${killIndicator}
      ${preview.targetBroken ? '<div class="broken-bonus">+50% Break Bonus</div>' : ''}
      ${preview.targetDefending ? '<div class="defending-note">Target Defending</div>' : ''}
    </div>
  `.trim();
}

/**
 * Render a full damage preview panel for the combat UI.
 *
 * @param {Object} state - Game state
 * @param {string} [actionType] - Current selected action
 * @returns {string} HTML string for panel
 */
export function renderDamagePreviewPanel(state, actionType = 'attack') {
  const preview = getCombatPreview(state, actionType);
  if (!preview) {
    return '<section class="damage-preview-panel empty">Select an action to see damage preview</section>';
  }

  const elementIcon = ELEMENT_ICONS[preview.element] ?? ELEMENT_ICONS.physical;
  const effLabel = preview.effectiveness;
  const hpPercent = Math.round((preview.targetHp / preview.targetMaxHp) * 100);
  const minDmgPercent = Math.min(100, Math.round((preview.minDamage / preview.targetHp) * 100));
  const maxDmgPercent = Math.min(100, Math.round((preview.maxDamage / preview.targetHp) * 100));

  return `
    <section class="damage-preview-panel">
      <header class="preview-header">
        <h3>${escapeHtml(preview.actionName)}</h3>
        ${preview.mpCost > 0 ? `<span class="mp-cost ${preview.canAfford ? '' : 'insufficient'}">${preview.mpCost}/${preview.playerMp} MP</span>` : ''}
      </header>

      <div class="preview-damage-display">
        <div class="damage-main">
          <span class="damage-label">Damage</span>
          <span class="damage-value">${formatDamageRange(preview)}</span>
        </div>
        <div class="damage-crit">
          <span class="crit-label">Critical</span>
          <span class="crit-value">${formatCritRange(preview)}</span>
          <span class="crit-chance">${formatCritChance(preview.critChance)}</span>
        </div>
      </div>

      <div class="preview-element">
        <span class="element-icon">${elementIcon}</span>
        <span class="element-text" style="color: ${effLabel.color}">${effLabel.text}</span>
      </div>

      <div class="preview-hp-impact">
        <div class="hp-bar-container">
          <div class="hp-bar current" style="width: ${hpPercent}%"></div>
          <div class="hp-bar damage-range" style="left: ${Math.max(0, hpPercent - maxDmgPercent)}%; width: ${maxDmgPercent - minDmgPercent}%"></div>
          <div class="hp-bar damage-min" style="left: ${Math.max(0, hpPercent - minDmgPercent)}%; width: ${minDmgPercent}%"></div>
        </div>
        <div class="hp-labels">
          <span class="hp-current">${preview.targetHp}</span>
          <span class="hp-after">→ ${Math.max(0, preview.targetHp - preview.minDamage)}-${Math.max(0, preview.targetHp - preview.maxDamage)}</span>
        </div>
      </div>

      ${renderKillIndicator(preview)}
      ${renderStatusBadges(preview)}
    </section>
  `.trim();
}

/**
 * Render the enemy incoming damage preview.
 *
 * @param {Object} state - Game state
 * @returns {string} HTML string for enemy attack preview
 */
export function renderEnemyAttackPreview(state) {
  const preview = getEnemyAttackPreview(state);
  if (!preview) {
    return '';
  }

  const elementIcon = ELEMENT_ICONS[preview.element] ?? ELEMENT_ICONS.physical;
  const hpPercent = Math.round((preview.targetHp / preview.targetMaxHp) * 100);

  return `
    <section class="enemy-attack-preview">
      <header class="preview-header warning">
        <span class="warning-icon">⚠️</span>
        <h4>Incoming Attack</h4>
      </header>

      <div class="preview-damage-display">
        <div class="damage-main">
          <span class="damage-label">Expected</span>
          <span class="damage-value danger">${formatDamageRange(preview)}</span>
        </div>
        <div class="damage-defend">
          <span class="defend-label">If Defending</span>
          <span class="defend-value">${preview.damageIfDefending.min}-${preview.damageIfDefending.max}</span>
          <span class="damage-reduction">(-${preview.damageReduction})</span>
        </div>
      </div>

      <div class="preview-hp-impact player">
        <div class="hp-bar-container">
          <div class="hp-bar current" style="width: ${hpPercent}%"></div>
        </div>
        <div class="hp-labels">
          <span class="hp-current">${preview.targetHp} HP</span>
        </div>
      </div>

      ${preview.canKill ? '<div class="danger-warning">Danger: Could be lethal!</div>' : ''}
    </section>
  `.trim();
}

// ── Helper Renderers ─────────────────────────────────────────────────

function renderKillIndicator(preview) {
  if (preview.guaranteedKill) {
    return '<div class="kill-indicator guaranteed">GUARANTEED KILL</div>';
  }
  if (preview.canKill) {
    return '<div class="kill-indicator possible">Possible Kill (with crit)</div>';
  }
  return '';
}

function renderStatusBadges(preview) {
  const badges = [];

  if (preview.targetBroken) {
    badges.push('<span class="status-badge broken">Broken (+50% DMG)</span>');
  }
  if (preview.targetDefending) {
    badges.push('<span class="status-badge defending">Defending (2x DEF)</span>');
  }
  if (!preview.canAfford) {
    badges.push('<span class="status-badge no-mp">Insufficient MP</span>');
  }

  if (badges.length === 0) return '';

  return `<div class="preview-badges">${badges.join('')}</div>`;
}

// ── CSS Styles ───────────────────────────────────────────────────────

/**
 * Get CSS styles for damage preview components.
 * @returns {string} CSS stylesheet string
 */
export function getDamagePreviewStyles() {
  return `
    /* Damage Tooltip */
    .damage-tooltip {
      background: rgba(0, 0, 0, 0.9);
      border: 1px solid #444;
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 13px;
      min-width: 150px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    }

    .tooltip-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
      padding-bottom: 4px;
      border-bottom: 1px solid #333;
    }

    .tooltip-header .action-name {
      font-weight: bold;
      color: #fff;
    }

    .tooltip-header .mp-cost {
      color: #66aaff;
      font-size: 11px;
    }

    .tooltip-damage {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .damage-range {
      color: #ff6666;
      font-weight: bold;
    }

    .element-badge {
      font-size: 11px;
    }

    .tooltip-crit {
      color: #ffcc00;
      font-size: 11px;
    }

    .kill-indicator {
      display: inline-block;
      margin-top: 6px;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
    }

    .kill-indicator.guaranteed {
      background: #ff0000;
      color: #fff;
    }

    .kill-indicator.possible {
      background: #ff6600;
      color: #fff;
    }

    .broken-bonus {
      color: #ff00ff;
      font-size: 11px;
      margin-top: 4px;
    }

    .defending-note {
      color: #66ff66;
      font-size: 11px;
      margin-top: 4px;
    }

    /* Damage Preview Panel */
    .damage-preview-panel {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border: 1px solid #334;
      border-radius: 8px;
      padding: 12px;
      margin: 8px 0;
    }

    .damage-preview-panel.empty {
      color: #666;
      text-align: center;
      font-style: italic;
    }

    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .preview-header h3 {
      margin: 0;
      color: #fff;
      font-size: 16px;
    }

    .preview-header .mp-cost {
      color: #66aaff;
      font-size: 13px;
    }

    .preview-header .mp-cost.insufficient {
      color: #ff6666;
    }

    .preview-damage-display {
      display: flex;
      gap: 16px;
      margin-bottom: 12px;
    }

    .damage-main, .damage-crit {
      flex: 1;
    }

    .damage-label, .crit-label, .defend-label {
      display: block;
      color: #888;
      font-size: 11px;
      margin-bottom: 2px;
    }

    .damage-value {
      color: #ff6666;
      font-size: 20px;
      font-weight: bold;
    }

    .damage-value.danger {
      color: #ff3333;
    }

    .crit-value {
      color: #ffcc00;
      font-size: 16px;
      font-weight: bold;
    }

    .crit-chance {
      color: #888;
      font-size: 11px;
      margin-left: 4px;
    }

    .defend-value {
      color: #66ff66;
      font-size: 16px;
      font-weight: bold;
    }

    .damage-reduction {
      color: #66ff66;
      font-size: 11px;
      margin-left: 4px;
    }

    .preview-element {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      padding: 6px 10px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
    }

    .element-icon {
      font-size: 18px;
    }

    .element-text {
      font-weight: bold;
    }

    .preview-hp-impact {
      margin-bottom: 8px;
    }

    .hp-bar-container {
      position: relative;
      height: 16px;
      background: #222;
      border-radius: 3px;
      overflow: hidden;
    }

    .hp-bar {
      position: absolute;
      height: 100%;
      transition: width 0.3s ease;
    }

    .hp-bar.current {
      background: linear-gradient(90deg, #22aa22, #44cc44);
      z-index: 1;
    }

    .hp-bar.damage-range {
      background: rgba(255, 100, 100, 0.3);
      z-index: 2;
    }

    .hp-bar.damage-min {
      background: rgba(255, 0, 0, 0.5);
      z-index: 3;
    }

    .hp-labels {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      margin-top: 4px;
    }

    .hp-current {
      color: #66ff66;
    }

    .hp-after {
      color: #ff9966;
    }

    .preview-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }

    .status-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
    }

    .status-badge.broken {
      background: #660066;
      color: #ff66ff;
    }

    .status-badge.defending {
      background: #006600;
      color: #66ff66;
    }

    .status-badge.no-mp {
      background: #660000;
      color: #ff6666;
    }

    /* Enemy Attack Preview */
    .enemy-attack-preview {
      background: linear-gradient(135deg, #2e1a1a 0%, #3e1616 100%);
      border: 1px solid #443;
      border-radius: 8px;
      padding: 12px;
      margin: 8px 0;
    }

    .preview-header.warning {
      color: #ffaa00;
    }

    .warning-icon {
      margin-right: 6px;
    }

    .preview-header h4 {
      margin: 0;
      display: inline;
    }

    .danger-warning {
      background: #ff0000;
      color: #fff;
      text-align: center;
      padding: 6px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 13px;
      margin-top: 8px;
      animation: pulse-danger 1s infinite;
    }

    @keyframes pulse-danger {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    .preview-hp-impact.player .hp-bar.current {
      background: linear-gradient(90deg, #2266aa, #44aaff);
    }
  `;
}

// ── Utility ──────────────────────────────────────────────────────────

function escapeHtml(text) {
  const div = { textContent: text };
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
