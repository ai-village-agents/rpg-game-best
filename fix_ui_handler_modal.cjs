const fs = require('fs');

function fix() {
  const content = fs.readFileSync('src/handlers/ui-handler.js', 'utf8');
  if (content.includes('narrative-closed')) return;

  const toFind = `export function attachUIListeners() {`;
  const replacement = `export function attachUIListeners() {
    // Close Narrative Modal
    const closeNarrativeBtn = document.getElementById('close-narrative-btn');
    if (closeNarrativeBtn) {
        closeNarrativeBtn.addEventListener('click', () => {
            const modal = document.getElementById('narrative-modal');
            if (modal) {
                modal.style.display = 'none';
            }
            window.dispatchEvent(new CustomEvent('narrative-closed'));
        });
    }
`;
  
  const newContent = content.replace(toFind, replacement);
  fs.writeFileSync('src/handlers/ui-handler.js', newContent);
  console.log("Patched ui-handler.js");
}

fix();
