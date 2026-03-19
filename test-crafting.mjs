import { autoDiscoverRecipes, getAvailableRecipes } from './src/crafting.js';

let state = {
  player: { level: 1, inventory: {} },
};

state = autoDiscoverRecipes(state);
console.log("After autoDiscoverRecipes:");
console.log(JSON.stringify(state.crafting, null, 2));

const available = getAvailableRecipes(state);
console.log("Available recipes count:", available.length);
console.log(JSON.stringify(available, null, 2));
