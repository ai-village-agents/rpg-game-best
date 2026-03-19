const fs = require('fs');

// 1. Update src/state.js
let stateJs = fs.readFileSync('src/state.js', 'utf8');
if (!stateJs.includes('narrativeIntroSeen')) {
    stateJs = stateJs.replace('const createInitialState = () => ({', 'const createInitialState = () => ({\n  narrativeIntroSeen: false,');
    fs.writeFileSync('src/state.js', stateJs);
    console.log('Updated src/state.js');
}

// 2. Update src/state-transitions.js
let transitionsJs = fs.readFileSync('src/state-transitions.js', 'utf8');
if (!transitionsJs.includes('ACKNOWLEDGE_NARRATIVE')) {
    const caseToAdd = `
    case 'ACKNOWLEDGE_NARRATIVE':
      return { ...state, narrativeIntroSeen: true };
`;
    transitionsJs = transitionsJs.replace('default:', `${caseToAdd}\n    default:`);
    fs.writeFileSync('src/state-transitions.js', transitionsJs);
    console.log('Updated src/state-transitions.js');
}

// 3. Update src/handlers/ui-handler.js
let uiHandlerJs = fs.readFileSync('src/handlers/ui-handler.js', 'utf8');
if (!uiHandlerJs.includes('close-narrative-btn')) {
    const listenerToAdd = `
  const closeNarrativeBtn = document.getElementById('close-narrative-btn');
  if (closeNarrativeBtn) {
    closeNarrativeBtn.addEventListener('click', () => {
      dispatch({ type: 'ACKNOWLEDGE_NARRATIVE' });
    });
  }
`;
    uiHandlerJs = uiHandlerJs.replace('export function setupUIListeners(dispatch, state) {', `export function setupUIListeners(dispatch, state) {\n${listenerToAdd}`);
    fs.writeFileSync('src/handlers/ui-handler.js', uiHandlerJs);
    console.log('Updated src/handlers/ui-handler.js');
}

// 4. Update src/render.js
let renderJs = fs.readFileSync('src/render.js', 'utf8');
if (!renderJs.includes('narrative-modal')) {
    const renderAdd = `
  const narrativeModal = document.getElementById('narrative-modal');
  if (narrativeModal) {
    if (state.view === 'EXPLORE' && state.narrativeIntroSeen === false) {
      narrativeModal.style.display = 'flex';
    } else {
      narrativeModal.style.display = 'none';
    }
  }
`;
    // Find end of render function, or insert near the top
    renderJs = renderJs.replace('export function render(state) {', `export function render(state) {\n${renderAdd}`);
    fs.writeFileSync('src/render.js', renderJs);
    console.log('Updated src/render.js');
}
