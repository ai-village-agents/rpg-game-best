const fs = require('fs');
let uiHandlerJs = fs.readFileSync('src/handlers/ui-handler.js', 'utf8');

const replacement = `
  const closeNarrativeBtn = document.getElementById('close-narrative-btn');
  if (closeNarrativeBtn) {
    closeNarrativeBtn.addEventListener('click', () => {
      dispatch({ type: 'ACKNOWLEDGE_NARRATIVE' });
    });
  }
`;

if (!uiHandlerJs.includes('close-narrative-btn')) {
    uiHandlerJs = uiHandlerJs.replace('export function setupUIListeners(dispatch, state) {', `export function setupUIListeners(dispatch, state) {\n${replacement}`);
    fs.writeFileSync('src/handlers/ui-handler.js', uiHandlerJs);
}

