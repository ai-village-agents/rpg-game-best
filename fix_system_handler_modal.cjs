const fs = require('fs');

function fix() {
  const content = fs.readFileSync('src/handlers/system-handler.js', 'utf8');

  const toFind = `export function handleSystemAction(state, action) {
  const type = action.type;`;
  
  const replacement = `export function handleSystemAction(state, action) {
  const type = action.type;
  
  if (type === 'DISMISS_NARRATIVE') {
      return { ...state, narrativeIntroSeen: true };
  }
`;

  if (content.includes('DISMISS_NARRATIVE')) return;
  
  const newContent = content.replace(toFind, replacement);
  fs.writeFileSync('src/handlers/system-handler.js', newContent);
  console.log("Patched system-handler.js for DISMISS_NARRATIVE");
}

fix();
