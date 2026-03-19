import { predictEnemyTelegraph, getBossPhaseWarning, URGENCY_LEVELS } from './boss-telegraph.js';

function esc(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function getBossTelegraphStyles() {
  return `
    .boss-telegraph-panel {
      background: var(--card);
      border: 2px solid var(--accent);
      border-radius: 8px;
      padding: 12px;
      margin-top: 8px;
      font-family: monospace;
      position: relative;
    }
    .telegraph-urgency-low { border-color: var(--good); }
    .telegraph-urgency-medium { border-color: var(--gold-text); }
    .telegraph-urgency-high { border-color: var(--gold-text); }
    .telegraph-urgency-extreme {
      border-color: var(--bad);
      animation: telegraph-pulse 1.4s ease-in-out infinite;
    }
    @keyframes telegraph-pulse {
      0%, 100% { box-shadow: none; }
      50% { box-shadow: 0 0 8px var(--bad); }
    }
    @media (prefers-reduced-motion: reduce) {
      .telegraph-urgency-extreme { animation: none; }
    }
    .telegraph-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .telegraph-icon { font-size: 1.8em; }
    .telegraph-label { font-weight: bold; font-size: 1.0em; color: var(--text); }
    .telegraph-description { font-size: 0.85em; color: var(--muted); margin-top: 4px; }
    .telegraph-phase-warning {
      background: rgba(255,200,0,0.15);
      border: 1px solid var(--gold-text);
      border-radius: 4px;
      padding: 6px;
      margin-top: 8px;
      font-size: 0.85em;
      color: var(--gold-text);
    }
    .boss-phase-bar-container { margin-top: 8px; }
    .boss-phase-bar-bg {
      height: 8px;
      background: var(--card);
      border-radius: 4px;
      overflow: hidden;
      position: relative;
    }
    .boss-phase-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--bad), var(--gold-text));
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    .boss-phase-marker {
      position: absolute;
      top: 0;
      width: 2px;
      height: 100%;
      background: var(--gold-text);
      opacity: 0.8;
    }
    .telegraph-urgency-badge {
      display: inline-block;
      font-size: 0.75em;
      padding: 2px 8px;
      border-radius: 10px;
      margin-left: 8px;
      font-weight: bold;
    }
  `;
}

function getUrgencyBadge(urgency) {
  const palette = {
    [URGENCY_LEVELS.LOW]: { bg: 'rgba(87, 211, 140, 0.2)', color: 'var(--good)' },
    [URGENCY_LEVELS.MEDIUM]: { bg: 'rgba(255, 193, 7, 0.2)', color: 'var(--gold-text)' },
    [URGENCY_LEVELS.HIGH]: { bg: 'rgba(255, 193, 7, 0.2)', color: 'var(--gold-text)' },
    [URGENCY_LEVELS.EXTREME]: { bg: 'rgba(255, 68, 68, 0.2)', color: 'var(--bad)' },
  };
  const styles = palette[urgency] ?? palette[URGENCY_LEVELS.MEDIUM];
  return `<span class="telegraph-urgency-badge" style="background:${styles.bg};color:${styles.color};">${esc(String(urgency).toUpperCase())}</span>`;
}

function renderBossPhaseInfo(enemy) {
  if (!enemy?.isBoss) return '';
  const phases = Array.isArray(enemy.phases) ? enemy.phases : [];
  if (!phases.length) return '';
  const currentPhase = enemy.currentPhase ?? 1;
  const currentPhaseInfo = phases.find((phase) => phase.phase === currentPhase) ?? phases[0];
  const phaseName = currentPhaseInfo?.name ?? 'Unknown';
  const totalPhases = phases.length;

  const hpValue = enemy.hp ?? enemy.currentHp ?? 0;
  const maxHp = enemy.maxHp ?? 1;
  const hpPercent = maxHp > 0 ? (hpValue / maxHp) * 100 : 0;
  const markers = phases
    .map((phase) => `<div class="boss-phase-marker" style="left:${Math.round(phase.hpThreshold * 100)}%"></div>`)
    .join('');

  const phaseWarning = getBossPhaseWarning(enemy);

  return `
    <div class="boss-phase-info">Phase ${esc(String(currentPhase))} of ${esc(String(totalPhases))}: ${esc(phaseName)}</div>
    <div class="boss-phase-bar-container">
      <div style="font-size:0.75em;color:var(--muted);margin-bottom:4px;">Boss HP</div>
      <div class="boss-phase-bar-bg">
        <div class="boss-phase-bar-fill" style="width:${Math.max(0, Math.min(100, hpPercent)).toFixed(1)}%"></div>
        ${markers}
      </div>
    </div>
    ${phaseWarning ? `<div class="telegraph-phase-warning">⚠️ ${esc(phaseWarning.message)}</div>` : ''}
  `;
}

export function renderBossTelegraphPanel(state) {
  if (state?.phase !== 'player-turn') return '';
  if (!state.enemy || state.enemy.hp <= 0) return '';

  const telegraph = predictEnemyTelegraph(state.enemy, state.rngSeed ?? 1);
  if (!telegraph) return '';

  const urgencyClass = `telegraph-urgency-${telegraph.urgency}`;
  const urgencyBadge = getUrgencyBadge(telegraph.urgency);

  return `
    <div class="boss-telegraph-panel ${urgencyClass}">
      <div class="telegraph-header">
        <div class="telegraph-icon">🔮</div>
        <div class="telegraph-label">Enemy Intent</div>
        ${urgencyBadge}
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <div class="telegraph-icon">${esc(telegraph.icon)}</div>
        <div class="telegraph-label">${esc(telegraph.label)}</div>
      </div>
      <div class="telegraph-description">${esc(telegraph.description)}</div>
      ${renderBossPhaseInfo(state.enemy)}
    </div>
  `;
}
