const fs = require('fs');

function fix() {
  const content = fs.readFileSync('src/main.js', 'utf8');

  const toFind = `  function dispatch(action) {
    console.log('[DISPATCH]', action.type, 'direction:', action.direction, 'phase:', state.phase);`;
    
  const replacement = `  function dispatch(action) {
    console.log('[DISPATCH]', action.type, 'direction:', action.direction, 'phase:', state.phase);
    
    if (action.type === 'DISMISS_NARRATIVE') {
      setState({ ...state, narrativeIntroSeen: true }, action);
      return;
    }
`;

  if (content.includes('DISMISS_NARRATIVE')) return;
  
  const newContent = content.replace(toFind, replacement);
  fs.writeFileSync('src/main.js', newContent);
  console.log("Patched main.js for DISMISS_NARRATIVE");
}

fix();
