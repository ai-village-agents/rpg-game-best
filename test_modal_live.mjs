import { render } from './src/render.js';
import { handleAction } from './src/state-transitions.js';
import { setupUI } from './src/handlers/ui-handler.js';
import { initialState } from './src/state.js';
import { setupSystem } from './src/handlers/system-handler.js';
import { setupCombat } from './src/handlers/combat-handler.js';

console.log("Looking good so far. Let's start the server to test.");
