import fs from 'fs';

// Check if narrativeIntroSeen is correctly initialized
const statePath = 'src/state.js';
let stateCode = fs.readFileSync(statePath, 'utf8');

if (stateCode.includes('gameStats: createGameStats(),')) {
    stateCode = stateCode.replace('gameStats: createGameStats(),\n  narrativeIntroSeen: false,', 'gameStats: createGameStats(),');
    
    // We need it in the root of the initial state, not just questState
    if (stateCode.includes('export const initialState = {') && !stateCode.includes('narrativeIntroSeen: false, // flag for the modal')) {
        stateCode = stateCode.replace('export const initialState = {', 'export const initialState = {\n  narrativeIntroSeen: false, // flag for the modal');
        fs.writeFileSync(statePath, stateCode);
        console.log("Fixed state.js initialization");
    }
}

// Ensure the button isn't null in ui-handler
const uiHandlerPath = 'src/handlers/ui-handler.js';
let uiCode = fs.readFileSync(uiHandlerPath, 'utf8');

// I will make sure the event listener is correctly attached when the game loads
if (!uiCode.includes('document.getElementById(\'close-narrative-btn\')?.addEventListener')) {
    // Remove the old buggy listener if present
    uiCode = uiCode.replace(`  const closeNarrativeBtn = document.getElementById('close-narrative-btn');
  if (closeNarrativeBtn) {
    closeNarrativeBtn.addEventListener('click', () => {
       const modal = document.getElementById('narrative-modal');
       if (modal) modal.style.display = 'none';
       dispatch({ type: 'ACKNOWLEDGE_NARRATIVE' });
    });
  }`, '');

    const correctListener = `
  document.getElementById('close-narrative-btn')?.addEventListener('click', () => {
    dispatch({ type: 'ACKNOWLEDGE_NARRATIVE' });
  });`;

    uiCode = uiCode.replace('export function setupUI(dispatch, getState) {', `export function setupUI(dispatch, getState) {\n${correctListener}`);
    fs.writeFileSync(uiHandlerPath, uiCode);
    console.log("Fixed listener in ui-handler.js");
}

