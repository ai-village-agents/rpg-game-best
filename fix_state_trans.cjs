const fs = require('fs');

function fix() {
  const content = fs.readFileSync('src/state-transitions.js', 'utf8');

  const caseStr = `case 'DISMISS_NARRATIVE':
      return { ...state, narrativeIntroSeen: true };`;

  if (!content.includes(caseStr)) {
      const targetStr = `export function performStateTransition(state, action) {
  switch (action.type) {`;
      const replacement = targetStr + `\n    ` + caseStr;
      const newContent = content.replace(targetStr, replacement);
      fs.writeFileSync('src/state-transitions.js', newContent);
      console.log("Patched state-transitions.js for DISMISS_NARRATIVE");
  } else {
      console.log("DISMISS_NARRATIVE already exists in state-transitions.js");
  }
}

fix();
