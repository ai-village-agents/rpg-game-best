import { getConflicts, validateBinding } from './keybindings.js';

export const ACTION_LABELS = {
  moveNorth: 'Move North',
  moveSouth: 'Move South',
  moveWest: 'Move West',
  moveEast: 'Move East',
  openHelp: 'Open Help',
  openBestiary: 'Open Bestiary',
  openInventory: 'Open Inventory',
  openSettings: 'Open Settings',
  confirmAction: 'Confirm Action',
  cancelAction: 'Cancel/Back',
};

export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const KEY_NAME_MAP = {
  ' ': 'Space',
  Space: 'Space',
  ArrowUp: 'Up Arrow',
  ArrowDown: 'Down Arrow',
  ArrowLeft: 'Left Arrow',
  ArrowRight: 'Right Arrow',
  Escape: 'Esc',
  Enter: 'Enter',
  Tab: 'Tab',
  Shift: 'Shift',
  Control: 'Ctrl',
  Alt: 'Alt',
  Meta: 'Meta',
  Backspace: 'Backspace',
  Delete: 'Delete',
  Home: 'Home',
  End: 'End',
  PageUp: 'Page Up',
  PageDown: 'Page Down',
};

export function formatKey(key) {
  if (key == null) return '';
  if (Object.prototype.hasOwnProperty.call(KEY_NAME_MAP, key)) {
    return KEY_NAME_MAP[key];
  }
  if (typeof key === 'string' && key.length === 1) {
    return key.toUpperCase();
  }
  return String(key);
}

export function renderKeybindingRow(action, keys, isListening) {
  const label = ACTION_LABELS[action] || action;
  const keyList = Array.isArray(keys) ? keys.filter((k) => validateBinding(k)) : [];
  const badges =
    keyList.length > 0
      ? keyList.map((key) => `<span class="key-badge">${esc(formatKey(key))}</span>`).join('')
      : '<span class="key-badge muted">Unbound</span>';

  const changeButton = isListening
    ? '<span class="keybinding-listening">Press a key...</span>'
    : `<button class="keybinding-change" data-action="${esc(action)}">Change</button>`;

  return `
    <div class="keybinding-row${isListening ? ' listening' : ''}" data-action="${esc(action)}">
      <div class="keybinding-main">
        <div class="keybinding-label">${esc(label)}</div>
        <div class="keybinding-keys">${badges}</div>
        <div class="keybinding-action">${changeButton}</div>
      </div>
      <div class="keybinding-conflict" id="keybinding-conflict-${esc(action)}"></div>
    </div>
  `;
}

export function renderKeybindingsPanel(bindings, listeningAction) {
  const rows = Object.keys(ACTION_LABELS)
    .map((action) =>
      renderKeybindingRow(
        action,
        Array.isArray(bindings?.[action]) ? bindings[action] : [],
        listeningAction === action,
      ),
    )
    .join('');

  return `
    <div class="keybindings-panel card">
      <div class="keybindings-header">
        <h2 class="keybindings-title">⌨️ Keybindings</h2>
        <div class="keybindings-hint">Click change, then press a key</div>
      </div>
      <div class="keybindings-list">
        ${rows}
      </div>
      <div class="keybindings-conflict-note" id="keybindingsConflictNote"></div>
      <div class="keybindings-footer">
        <button id="btnKeybindingsReset" class="secondary">Reset to Defaults</button>
      </div>
    </div>
  `;
}

export function getKeybindingsStyles() {
  return `
    .keybindings-panel {
      max-width: 640px;
      margin: 0 auto;
      padding: 16px;
    }
    .keybindings-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      gap: 12px;
    }
    .keybindings-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      font-size: 1.1em;
    }
    .keybindings-hint {
      color: var(--muted);
      font-size: 0.9em;
    }
    .keybindings-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .keybinding-row {
      padding: 10px 12px;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      background: rgba(255,255,255,0.03);
    }
    .keybinding-row.listening {
      border-color: rgba(122,162,255,0.6);
      box-shadow: 0 0 0 2px rgba(122,162,255,0.15);
    }
    .keybinding-main {
      display: grid;
      grid-template-columns: 1.1fr 1fr auto;
      gap: 10px;
      align-items: center;
    }
    .keybinding-label {
      font-weight: 700;
      color: var(--text);
    }
    .keybinding-keys {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .key-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 8px;
      background: rgba(122,162,255,0.12);
      border: 1px solid rgba(122,162,255,0.3);
      border-radius: 6px;
      font-size: 0.9em;
      color: var(--text);
    }
    .key-badge.muted {
      background: rgba(255,255,255,0.04);
      border-style: dashed;
      color: var(--muted);
    }
    .keybinding-action {
      display: flex;
      justify-content: flex-end;
    }
    .keybinding-action button {
      min-width: 110px;
    }
    .keybinding-listening {
      color: var(--accent);
      font-weight: 700;
    }
    .keybinding-conflict {
      margin-top: 6px;
      color: var(--bad);
      font-size: 0.85em;
      min-height: 1em;
    }
    .keybindings-conflict-note {
      margin: 8px 0 0;
      font-size: 0.9em;
      color: var(--muted);
      min-height: 1.1em;
    }
    .keybindings-conflict-note.visible {
      color: var(--bad);
    }
    .keybindings-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 14px;
    }
    @media (max-width: 620px) {
      .keybinding-main {
        grid-template-columns: 1fr;
        gap: 8px;
      }
      .keybinding-action {
        justify-content: flex-start;
      }
      .keybinding-action button {
        width: 100%;
      }
    }
  `;
}

export function attachKeybindingsHandlers(bindings, callbacks = {}) {
  const { onStartListening, onKeyPressed, onReset } = callbacks;
  const panel = document.querySelector('.keybindings-panel');
  if (!panel) return;

  const resetConflictNote = () => {
    const note = document.getElementById('keybindingsConflictNote');
    if (note) {
      note.textContent = '';
      note.classList.remove('visible');
    }
    for (const el of panel.querySelectorAll('.keybinding-conflict')) {
      el.textContent = '';
    }
  };

  panel.querySelectorAll('.keybinding-change').forEach((btn) => {
    btn.onclick = () => {
      const action = btn.dataset.action;
      resetConflictNote();
      if (action && typeof onStartListening === 'function') {
        onStartListening(action);
      }
    };
  });

  const resetBtn = document.getElementById('btnKeybindingsReset');
  if (resetBtn) {
    resetBtn.onclick = () => {
      resetConflictNote();
      if (typeof onReset === 'function') {
        onReset();
      }
    };
  }

  const noteEl = document.getElementById('keybindingsConflictNote');
  const keydownHandler = (event) => {
    const listeningRow = panel.querySelector('.keybinding-row.listening');
    if (!listeningRow) return;

    const action = listeningRow.dataset.action;
    if (!action) return;

    const key = event.key;
    if (!validateBinding(key)) return;

    event.preventDefault();
    const conflicts = getConflicts(bindings, action, key);
    const conflictLabel = document.getElementById(`keybinding-conflict-${action}`);
    if (conflictLabel) {
      conflictLabel.textContent = conflicts.length
        ? `Conflicts with: ${conflicts.map((c) => ACTION_LABELS[c] || c).join(', ')}`
        : '';
    }
    if (noteEl) {
      if (conflicts.length > 0) {
        noteEl.textContent = `Heads up: ${formatKey(key)} is also used by ${conflicts
          .map((c) => ACTION_LABELS[c] || c)
          .join(', ')}.`;
        noteEl.classList.add('visible');
      } else {
        noteEl.textContent = `Assigning ${formatKey(key)} to ${ACTION_LABELS[action] || action}.`;
        noteEl.classList.remove('visible');
      }
    }

    if (typeof onKeyPressed === 'function') {
      onKeyPressed(action, key);
    }
  };

  if (window._keybindingsKeydownHandler) {
    window.removeEventListener('keydown', window._keybindingsKeydownHandler);
  }
  window._keybindingsKeydownHandler = keydownHandler;
  window.addEventListener('keydown', keydownHandler);
}
