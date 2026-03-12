/**
 * Keybinding customization helpers.
 * Functions are kept pure where possible so they can be reused and tested easily.
 */

export const DEFAULT_BINDINGS = {
  moveNorth: ['w', 'W', 'ArrowUp'],
  moveSouth: ['s', 'S', 'ArrowDown'],
  moveWest: ['a', 'A', 'ArrowLeft'],
  moveEast: ['d', 'D', 'ArrowRight'],
  openHelp: ['h', 'H', '?'],
  openBestiary: ['b', 'B'],
  openInventory: ['i', 'I'],
  openSettings: ['Escape'],
  confirmAction: ['Enter', ' '],
  cancelAction: ['Escape'],
};

export const STORAGE_KEY = 'aiVillageRpgKeybindings';

const SPECIAL_KEYS = new Set([
  'Enter',
  'Escape',
  'Space',
  'Tab',
  'Shift',
  'Control',
  'Alt',
  'Meta',
  'Backspace',
  'Delete',
  'Home',
  'End',
  'PageUp',
  'PageDown',
]);

/**
 * @returns {Record<string, string[]>} Copy of the default bindings
 */
export function getDefaultBindings() {
  return cloneBindings(DEFAULT_BINDINGS);
}

/**
 * Load keybindings from localStorage and merge with defaults.
 * @returns {Record<string, string[]>}
 */
export function loadKeybindings() {
  const defaults = getDefaultBindings();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;

    const parsed = JSON.parse(raw);
    return mergeBindings(defaults, parsed);
  } catch {
    return defaults;
  }
}

/**
 * Save keybindings to localStorage.
 * @param {Record<string, string[]>} bindings
 */
export function saveKeybindings(bindings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bindings));
  } catch (e) {
    console.error('Failed to save keybindings:', e);
  }
}

/**
 * Find the first action mapped to the provided key.
 * @param {unknown} key
 * @param {Record<string, string[]>} bindings
 * @returns {string|null}
 */
export function getActionForKey(key, bindings) {
  if (typeof key !== 'string' || !bindings) return null;

  for (const [action, keys] of Object.entries(bindings)) {
    if (Array.isArray(keys) && keys.includes(key)) {
      return action;
    }
  }

  return null;
}

/**
 * Get all keys bound to a given action.
 * @param {string} action
 * @param {Record<string, string[]>} bindings
 * @returns {string[]}
 */
export function getKeysForAction(action, bindings) {
  if (!bindings || !Array.isArray(bindings[action])) return [];
  return [...bindings[action]];
}

/**
 * Return a new bindings object with the action remapped to new keys.
 * @param {Record<string, string[]>} bindings
 * @param {string} action
 * @param {string[]} newKeys
 * @returns {Record<string, string[]>}
 */
export function updateBinding(bindings, action, newKeys) {
  const result = cloneBindings(bindings || {});
  const sanitizedKeys = Array.isArray(newKeys)
    ? newKeys.filter((key) => typeof key === 'string' && validateBinding(key))
    : [];

  result[action] = [...sanitizedKeys];
  return result;
}

/**
 * Reset bindings to defaults and persist them.
 * @returns {Record<string, string[]>}
 */
export function resetBindings() {
  const defaults = getDefaultBindings();
  saveKeybindings(defaults);
  return defaults;
}

/**
 * Check whether the provided key is bindable.
 * Allows letters, numbers, punctuation, arrows, and common special keys.
 * @param {unknown} key
 * @returns {boolean}
 */
export function validateBinding(key) {
  if (typeof key !== 'string' || key.length === 0) return false;

  // Single printable ASCII character (covers letters, numbers, punctuation, and space)
  if (key.length === 1 && key >= ' ' && key <= '~') return true;
  if (/^Arrow(Up|Down|Left|Right)$/.test(key)) return true;
  if (SPECIAL_KEYS.has(key)) return true;

  return false;
}

/**
 * Find actions (other than the provided action) that already use the given key.
 * @param {Record<string, string[]>} bindings
 * @param {string} action
 * @param {string} newKey
 * @returns {string[]}
 */
export function getConflicts(bindings, action, newKey) {
  if (!bindings || typeof newKey !== 'string') return [];

  const conflicts = [];

  for (const [name, keys] of Object.entries(bindings)) {
    if (name === action || !Array.isArray(keys)) continue;
    if (keys.includes(newKey)) conflicts.push(name);
  }

  return conflicts;
}

/**
 * Create a deep copy of the bindings object with cloned arrays.
 * @param {Record<string, string[]>} bindings
 * @returns {Record<string, string[]>}
 */
function cloneBindings(bindings) {
  const result = {};

  for (const [action, keys] of Object.entries(bindings || {})) {
    result[action] = Array.isArray(keys) ? [...keys] : [];
  }

  return result;
}

/**
 * Merge user-defined bindings with defaults, ensuring arrays are cloned and valid keys retained.
 * @param {Record<string, string[]>} defaults
 * @param {Record<string, string[]>} overrides
 * @returns {Record<string, string[]>}
 */
function mergeBindings(defaults, overrides) {
  const result = {};
  const actions = new Set([
    ...Object.keys(defaults || {}),
    ...Object.keys(overrides || {}),
  ]);

  for (const action of actions) {
    const fallback = Array.isArray(defaults?.[action]) ? defaults[action] : [];
    const overrideKeys = overrides?.[action];

    if (Array.isArray(overrideKeys)) {
      const filtered = overrideKeys.filter(
        (key) => typeof key === 'string' && validateBinding(key),
      );
      result[action] = filtered.length > 0 ? [...filtered] : [...fallback];
    } else {
      result[action] = [...fallback];
    }
  }

  return result;
}
