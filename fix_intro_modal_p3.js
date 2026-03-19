import fs from 'fs';

// Check if render code works
const renderPath = 'src/render.js';
let renderCode = fs.readFileSync(renderPath, 'utf8');

const modalRenderLogic = `
  const narrativeModal = document.getElementById('narrative-modal');
  if (narrativeModal) {
    if (state.phase === 'exploration' && !state.narrativeIntroSeen && !state.newGamePlus) {
        narrativeModal.style.display = 'flex';
    } else {
        narrativeModal.style.display = 'none';
    }
  }
`;

if (!renderCode.includes(modalRenderLogic)) {
    renderCode = renderCode.replace('function render(state, containerId) {', `function render(state, containerId) {${modalRenderLogic}`);
    fs.writeFileSync(renderPath, renderCode);
    console.log("Replaced render.js");
}

const sysCode = fs.readFileSync('src/handlers/system-handler.js', 'utf8');
if (!sysCode.includes('narrativeIntroSeen: false')) {
  let newSys = sysCode.replace(`      visitedRooms: initVisitedRooms(1, 1),
      gameStats: createGameStats(),
      statistics: createEmptyStatistics(),
    };`, `      visitedRooms: initVisitedRooms(1, 1),
      gameStats: createGameStats(),
      statistics: createEmptyStatistics(),
      narrativeIntroSeen: false,
    };`);
  fs.writeFileSync('src/handlers/system-handler.js', newSys);
  console.log("Set narrativeIntroSeen to false on SELECT_BACKGROUND");
}
