import { handleUIAction } from './src/handlers/ui-handler.js';

let state = {
  phase: 'exploration',
  player: { level: 1, inventory: {} },
};

console.log("Initial state:", JSON.stringify(state));
const newState = handleUIAction(state, { type: 'VIEW_CRAFTING' });
console.log("State after VIEW_CRAFTING:");
console.log(JSON.stringify(newState.crafting, null, 2));

