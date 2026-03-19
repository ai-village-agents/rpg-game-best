const fs = require('fs');

function fix() {
  const content = fs.readFileSync('src/render.js', 'utf8');

  const oldLogic = `  // Check Narrative Intro
  const modal = document.getElementById('narrative-modal');
  if (state.screen === 'EXPLORE' && state.narrativeIntroSeen === false && modal) {
      modal.style.display = 'flex'; // Use flex to center
      
      // Hook up the close button to dispatch if it hasn't been already
      const closeBtn = document.getElementById('close-narrative-btn');
      if (closeBtn && !closeBtn.dataset.hasListener) {
          closeBtn.addEventListener('click', () => {
              modal.style.display = 'none';
              dispatch({ type: 'DISMISS_NARRATIVE' });
          });
          closeBtn.dataset.hasListener = 'true';
      }
  } else if (modal) {
      modal.style.display = 'none';
  }`;
  
  const newLogic = `  // Check Narrative Intro
  const modal = document.getElementById('narrative-modal');
  if (state.phase === 'explore' && state.narrativeIntroSeen === false && modal) {
      modal.style.display = 'flex'; // Use flex to center
      
      // Hook up the close button to dispatch if it hasn't been already
      const closeBtn = document.getElementById('close-narrative-btn');
      if (closeBtn && !closeBtn.dataset.hasListener) {
          closeBtn.addEventListener('click', () => {
              modal.style.display = 'none';
              dispatch({ type: 'DISMISS_NARRATIVE' });
          });
          closeBtn.dataset.hasListener = 'true';
      }
  } else if (modal) {
      modal.style.display = 'none';
  }`;

  let newContent = content.replace(oldLogic, newLogic);
  fs.writeFileSync('src/render.js', newContent);
  console.log("Patched render.js to check phase instead of screen");
}

fix();
