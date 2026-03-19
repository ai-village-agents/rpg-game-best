import { renderCraftingPanel } from './src/crafting-ui.js';

let state = {
  phase: 'crafting',
  player: { level: 1, inventory: {} },
  crafting: {
    discoveredRecipes: ['recipe_herbalRemedy'],
    craftCount: {}
  },
  craftingUI: { selectedCategory: 'all', selectedRecipeId: null, lastMessage: null }
};

const html = renderCraftingPanel(state, state.craftingUI);
console.log(html);

