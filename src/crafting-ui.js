/**
 * Crafting UI Module
 * Renders the crafting panel, recipe list, ingredient details, and craft button.
 */

import { getAvailableRecipes, getRecipeById, lookupItem, getRecipesByCategory } from './crafting.js';
import { recipes as allRecipes } from './data/recipes.js';

/**
 * Get CSS styles for the crafting panel.
 * @returns {string}
 */
export function getCraftingStyles() {
  return `
    .crafting-panel {
      background: var(--panel);
      border: 2px solid var(--accent);
      border-radius: 8px;
      padding: 16px;
      max-width: 600px;
      margin: 0 auto;
      color: var(--text);
      font-family: monospace;
    }
    .crafting-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border);
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .crafting-header h2 {
      margin: 0;
      color: var(--accent);
      font-size: 1.3em;
    }
    .crafting-close-btn {
      background: var(--border);
      color: var(--accent);
      border: 1px solid var(--accent);
      border-radius: 4px;
      padding: 4px 12px;
      cursor: pointer;
      font-family: monospace;
    }
    .crafting-close-btn:hover {
      background: var(--accent);
      color: var(--tab-active-text, #fff);
    }
    .crafting-tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 12px;
    }
    .crafting-tab {
      background: var(--card);
      border: 1px solid var(--border-light);
      border-radius: 4px 4px 0 0;
      padding: 6px 14px;
      cursor: pointer;
      color: var(--count-text);
      font-family: monospace;
      font-size: 0.9em;
    }
    .crafting-tab.active {
      background: color-mix(in srgb, var(--card) 70%, var(--accent) 30%);
      color: var(--accent);
      border-color: var(--accent);
      border-bottom: none;
    }
    .crafting-recipe-list {
      max-height: 250px;
      overflow-y: auto;
      border: 1px solid var(--border);
      border-radius: 4px;
      margin-bottom: 12px;
    }
    .crafting-recipe-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      border-bottom: 1px solid var(--border);
      cursor: pointer;
      transition: background 0.15s;
    }
    .crafting-recipe-item:hover {
      background: var(--card);
    }
    .crafting-recipe-item.selected {
      background: color-mix(in srgb, var(--card) 70%, var(--accent) 30%);
      border-left: 3px solid var(--accent);
    }
    .crafting-recipe-item.cannot-craft {
      opacity: 0.6;
    }
    .crafting-recipe-name {
      font-weight: bold;
      color: var(--text);
    }
    .crafting-recipe-level {
      color: var(--dim-text);
      font-size: 0.85em;
    }
    .crafting-detail {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 12px;
      margin-bottom: 12px;
    }
    .crafting-detail h3 {
      margin: 0 0 6px 0;
      color: var(--accent);
    }
    .crafting-detail-desc {
      color: var(--count-text);
      margin-bottom: 8px;
      font-style: italic;
    }
    .crafting-ingredients {
      list-style: none;
      padding: 0;
      margin: 0 0 8px 0;
    }
    .crafting-ingredients li {
      padding: 3px 0;
      font-size: 0.95em;
    }
    .crafting-ingredients li.have {
      color: var(--good);
    }
    .crafting-ingredients li.missing {
      color: var(--bad);
    }
    .crafting-result {
      color: var(--stat-text);
      margin-bottom: 8px;
    }
    .crafting-craft-btn {
      background: var(--accent);
      color: var(--tab-active-text, #fff);
      border: none;
      border-radius: 4px;
      padding: 8px 24px;
      cursor: pointer;
      font-family: monospace;
      font-size: 1em;
      font-weight: bold;
    }
    .crafting-craft-btn:disabled {
      background: var(--border-light);
      color: var(--dim-text);
      cursor: not-allowed;
    }
    .crafting-craft-btn:not(:disabled):hover {
      background: color-mix(in srgb, var(--accent) 80%, var(--panel) 20%);
    }
    .crafting-empty {
      text-align: center;
      color: var(--dim-text);
      padding: 24px;
    }
    .crafting-message {
      text-align: center;
      padding: 6px;
      margin-top: 8px;
      border-radius: 4px;
      font-weight: bold;
    }
    .crafting-message.success {
      background: var(--success-bg);
      color: var(--good);
    }
    .crafting-message.error {
      background: color-mix(in srgb, var(--panel) 70%, var(--bad) 30%);
      color: var(--bad);
    }
  `;
}

const CATEGORY_LABELS = {
  all: 'All',
  consumable: 'Consumables',
  weapon: 'Weapons',
  armor: 'Armor',
  accessory: 'Accessories',
};

const CATEGORY_ORDER = ['all', 'consumable', 'weapon', 'armor', 'accessory'];

/**
 * Render the crafting panel HTML.
 * @param {object} state - Game state
 * @param {object} [uiState] - UI-specific state for crafting panel
 * @returns {string} HTML string
 */
export function renderCraftingPanel(state, uiState = {}) {
  const selectedCategory = uiState.selectedCategory || 'all';
  const selectedRecipeId = uiState.selectedRecipeId || null;
  const lastMessage = uiState.lastMessage || null;

  const discovered = getAvailableRecipes(state);
  const filtered = selectedCategory === 'all'
    ? discovered
    : discovered.filter(r => r.category === selectedCategory);

  const playerLevel = state?.player?.level ?? 1;

  // Tabs
  const tabsHtml = CATEGORY_ORDER.map(cat => {
    const active = cat === selectedCategory ? ' active' : '';
    return `<button class="crafting-tab${active}" data-action="CRAFTING_SET_CATEGORY" data-category="${cat}">${CATEGORY_LABELS[cat]}</button>`;
  }).join('');

  // Recipe list
  let listHtml;
  if (filtered.length === 0) {
    listHtml = '<div class="crafting-empty">No recipes discovered in this category.</div>';
  } else {
    listHtml = filtered.map(recipe => {
      const selected = recipe.id === selectedRecipeId ? ' selected' : '';
      const craftClass = recipe.canCraft ? '' : ' cannot-craft';
      return `<div class="crafting-recipe-item${selected}${craftClass}" data-action="CRAFTING_SELECT_RECIPE" data-recipe-id="${recipe.id}">
        <span class="crafting-recipe-name">${recipe.name}</span>
        <span class="crafting-recipe-level">Lv.${recipe.requiredLevel || 1}</span>
      </div>`;
    }).join('');
  }

  // Detail panel
  let detailHtml = '';
  if (selectedRecipeId) {
    const recipe = filtered.find(r => r.id === selectedRecipeId) || getRecipeById(selectedRecipeId);
    if (recipe) {
      const inventory = state?.player?.inventory || {};
      const ingredientsHtml = (recipe.ingredients || []).map(ing => {
        const item = lookupItem(ing.itemId);
        const name = item?.name || ing.itemId;
        const required = ing.quantity || 1;
        const have = _getItemCountFromInventory(inventory, ing.itemId);
        const cls = have >= required ? 'have' : 'missing';
        return `<li class="${cls}">${name}: ${have}/${required}</li>`;
      }).join('');

      const resultItem = lookupItem(recipe.result?.itemId);
      const resultName = resultItem?.name || recipe.result?.itemId || '???';
      const resultQty = recipe.result?.quantity || 1;

      const levelOk = playerLevel >= (recipe.requiredLevel || 1);
      const canCraft = recipe.canCraft !== undefined ? recipe.canCraft : levelOk;
      const disabledAttr = canCraft ? '' : ' disabled';

      detailHtml = `<div class="crafting-detail">
        <h3>${recipe.name}</h3>
        <div class="crafting-detail-desc">${recipe.description || ''}</div>
        <div><strong>Ingredients:</strong></div>
        <ul class="crafting-ingredients">${ingredientsHtml}</ul>
        <div class="crafting-result">Produces: ${resultName} x${resultQty}</div>
        ${!levelOk ? `<div style="color:var(--bad);">Requires level ${recipe.requiredLevel}</div>` : ''}
        <button class="crafting-craft-btn"${disabledAttr} data-action="CRAFT_ITEM" data-recipe-id="${recipe.id}">Craft</button>
      </div>`;
    }
  }

  // Message
  let messageHtml = '';
  if (lastMessage) {
    const cls = lastMessage.success ? 'success' : 'error';
    messageHtml = `<div class="crafting-message ${cls}">${lastMessage.text}</div>`;
  }

  return `<div class="crafting-panel">
    <div class="crafting-header">
      <h2>Crafting</h2>
      <button class="crafting-close-btn" data-action="CLOSE_CRAFTING">Close</button>
    </div>
    <div class="crafting-tabs">${tabsHtml}</div>
    <div class="crafting-recipe-list">${listHtml}</div>
    ${detailHtml}
    ${messageHtml}
  </div>`;
}

/**
 * Attach event handlers for crafting panel buttons.
 * @param {HTMLElement} container - The container element
 * @param {function} dispatch - The game's dispatch function
 */
export function attachCraftingHandlers(container, dispatch) {
  // Delegate on the inner .crafting-panel (replaced on re-render) to prevent
  // event listener stacking on the persistent container element.
  const panel = container.querySelector('.crafting-panel') || container;
  panel.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.getAttribute('data-action');

    switch (action) {
      case 'CLOSE_CRAFTING':
        dispatch({ type: 'CLOSE_CRAFTING' });
        break;
      case 'CRAFTING_SET_CATEGORY':
        dispatch({
          type: 'CRAFTING_SET_CATEGORY',
          category: btn.getAttribute('data-category'),
        });
        break;
      case 'CRAFTING_SELECT_RECIPE':
        dispatch({
          type: 'CRAFTING_SELECT_RECIPE',
          recipeId: btn.getAttribute('data-recipe-id'),
        });
        break;
      case 'CRAFT_ITEM':
        dispatch({
          type: 'CRAFT_ITEM',
          recipeId: btn.getAttribute('data-recipe-id'),
        });
        break;
      default:
        break;
    }
  });
}

/**
 * Count items in inventory (handles both flat and nested formats).
 * @private
 */
function _getItemCountFromInventory(inventory, itemId) {
  if (!inventory) return 0;
  if (typeof inventory === 'object' && !Array.isArray(inventory)) {
    // Object format: { itemId: quantity }
    if (typeof inventory[itemId] === 'number') return inventory[itemId];
    // Could be nested: { items: { itemId: qty } }
    if (inventory.items && typeof inventory.items[itemId] === 'number') {
      return inventory.items[itemId];
    }
  }
  return 0;
}
