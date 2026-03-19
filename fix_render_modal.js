import fs from 'fs';

const renderPath = 'src/render.js';
let renderCode = fs.readFileSync(renderPath, 'utf8');

const renderModalLogic = `
  const narrativeModal = document.getElementById('narrative-modal');
  if (narrativeModal) {
    if (state.phase === 'exploration' && !state.narrativeIntroSeen && !state.newGamePlus) {
        narrativeModal.style.display = 'flex';
    } else {
        narrativeModal.style.display = 'none';
    }
  }
`;

if (!renderCode.includes("const narrativeModal = document.getElementById('narrative-modal');")) {
   renderCode = renderCode.replace('export function render(state, containerId) {', `export function render(state, containerId) {${renderModalLogic}`);
   fs.writeFileSync(renderPath, renderCode);
   console.log("Added modal rendering logic to export function render(state, containerId)");
} else {
    console.log("Modal rendering logic already exists.");
}

