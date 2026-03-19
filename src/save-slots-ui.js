/**
 * Save Slots Manager UI - AI Village RPG
 * Pure rendering functions for multi-slot save/load system.
 * Wires into engine.js saveToSlot/loadFromSlot/getSaveSlots/deleteSaveSlot.
 */

export const MAX_SAVE_SLOTS = 5;

/**
 * Format an ISO date string into a human-readable format.
 * @param {string} isoString
 * @returns {string}
 */
export function formatSaveDate(isoString) {
  if (!isoString || isoString === 'Unknown') return 'Unknown';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Invalid date';
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  } catch {
    return 'Invalid date';
  }
}

/**
 * Render a single save slot card.
 * @param {{ index: number, exists: boolean, savedAt?: string, playerName?: string, turn?: number }} slot
 * @param {'save'|'load'} mode
 * @returns {string} HTML string
 */
export function renderSlotCard(slot, mode) {
  const idx = slot.index;
  if (slot.exists) {
    const name = escHtml(slot.playerName || 'Unknown');
    const turn = slot.turn ?? 0;
    const date = formatSaveDate(slot.savedAt);
    const actionBtn = mode === 'save'
      ? `<button class="btn-save-slot" data-slot-index="${idx}">&#x1F4BE; Overwrite</button>`
      : `<button class="btn-load-slot" data-slot-index="${idx}">&#x1F4C2; Load</button>`;
    return `<div class="save-slot-card" data-slot-index="${idx}">
      <div class="slot-header">Slot ${idx + 1}</div>
      <div class="slot-info">
        <div class="slot-name">${name} <span class="slot-meta text-count" style="font-size:0.85em; font-weight:normal;">(Lv ${slot.level || 1} ${escHtml(slot.class || 'Adventurer')})</span></div>
        <div class="slot-detail">${escHtml(slot.location || 'Unknown Location')}</div>
        <div class="slot-detail">Turn ${turn} &bull; ${escHtml(date)}</div>
      </div>
      <div class="slot-actions">
        ${actionBtn}
        <button class="btn-delete-slot" data-slot-index="${idx}">&#x1F5D1;&#xFE0F; Delete</button>
      </div>
    </div>`;
  } else {
    const actionBtn = mode === 'save'
      ? `<button class="btn-save-slot" data-slot-index="${idx}">&#x1F4BE; Save Here</button>`
      : `<button class="btn-load-slot" data-slot-index="${idx}" disabled>Empty</button>`;
    return `<div class="save-slot-card empty-slot" data-slot-index="${idx}">
      <div class="slot-header">Slot ${idx + 1}</div>
      <div class="slot-info">
        <div class="slot-name">&mdash; Empty &mdash;</div>
      </div>
      <div class="slot-actions">
        ${actionBtn}
      </div>
    </div>`;
  }
}

/**
 * Render the full save slots manager panel.
 * @param {Array} slots - from getSaveSlots()
 * @param {'save'|'load'} mode
 * @returns {string} HTML string
 */
export function renderSaveSlotsList(slots, mode) {
  const title = mode === 'save' ? 'Save Game' : 'Load Game';
  const saveBtnClass = mode === 'save' ? 'active-tab' : '';
  const loadBtnClass = mode === 'load' ? 'active-tab' : '';
  const cards = slots.map(s => renderSlotCard(s, mode)).join('\n');
  return `<div class="save-slots-overlay">
    <div class="save-slots-panel">
      <div class="save-slots-header">
        <h2>${title}</h2>
        <div class="save-slots-tabs">
          <button class="tab-btn ${saveBtnClass}" id="btnModeSave">&#x1F4BE; Save</button>
          <button class="tab-btn ${loadBtnClass}" id="btnModeLoad">&#x1F4C2; Load</button>
        </div>
      </div>
      <div class="save-slots-list">
        ${cards}
      </div>
      <div class="save-slots-footer">
        <button id="btnCloseSaveSlots">Close</button>
      </div>
    </div>
  </div>`;
}

/**
 * Get CSS styles for the save slots UI.
 * @returns {string}
 */
export function getSaveSlotsStyles() {
  return `
    .save-slots-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--overlay-bg);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .save-slots-panel {
      background: var(--panel);
      border: 2px solid var(--accent);
      border-radius: 8px;
      padding: 16px;
      max-height: 80vh;
      overflow-y: auto;
      width: 90%;
      max-width: 500px;
    }
    .save-slots-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .save-slots-header h2 {
      margin: 0;
      color: var(--accent);
      font-size: 1.3em;
    }
    .save-slots-tabs {
      display: flex;
      gap: 4px;
    }
    .tab-btn {
      padding: 4px 12px;
      border: 1px solid var(--border-light);
      background: var(--card);
      color: var(--tab-text);
      cursor: pointer;
      border-radius: 4px;
      font-size: 0.85em;
    }
    .tab-btn.active-tab {
      background: var(--accent);
      color: var(--tab-active-text);
      border-color: var(--accent);
    }
    .save-slots-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .save-slot-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .save-slot-card.empty-slot {
      opacity: 0.6;
    }
    .slot-header {
      font-weight: bold;
      color: var(--accent);
      min-width: 50px;
    }
    .slot-info {
      flex: 1;
    }
    .slot-name {
      font-weight: bold;
      color: var(--text);
    }
    .slot-detail {
      font-size: 0.85em;
      color: var(--desc-text);
    }
    .slot-actions {
      display: flex;
      gap: 4px;
    }
    .slot-actions button {
      padding: 4px 10px;
      border: 1px solid var(--border-light);
      background: var(--card);
      color: var(--tab-text);
      cursor: pointer;
      border-radius: 4px;
      font-size: 0.8em;
    }
    .slot-actions button:hover:not(:disabled) {
      background: var(--accent);
      color: var(--tab-active-text);
    }
    .slot-actions button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .btn-delete-slot {
      background: color-mix(in srgb, var(--panel) 80%, var(--bad) 20%) !important;
      border-color: var(--bad) !important;
    }
    .btn-delete-slot:hover {
      background: var(--bad) !important;
    }
    .save-slots-footer {
      margin-top: 12px;
      text-align: center;
    }
    .save-slots-footer button {
      padding: 6px 20px;
      background: var(--card);
      color: var(--tab-text);
      border: 1px solid var(--border-light);
      border-radius: 4px;
      cursor: pointer;
    }
    .save-slots-footer button:hover {
      background: var(--accent);
      color: var(--tab-active-text);
    }
  `;
}

/** Escape HTML special characters */
function escHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
