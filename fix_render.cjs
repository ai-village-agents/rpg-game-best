const fs = require('fs');
const file = 'src/render.js';
let code = fs.readFileSync(file, 'utf8');

const oldCode = `          let objectivesHtml = '';
          if (q.objectives && q.objectives.length > 0) {
            objectivesHtml = '<ul style="margin: 5px 0 0 20px; padding: 0; font-size: 0.9em; list-style-type: circle;">';
            q.objectives.forEach(obj => {
              const isDone = q.objectiveProgress && q.objectiveProgress[obj.id] === true;
              const style = isDone ? 'text-decoration: line-through; color: #888;' : '';
              objectivesHtml += \`<li style="\${style}">\${esc(obj.description)}</li>\`;
            });
            objectivesHtml += '</ul>';
          }`;

const newCode = `          let objectivesHtml = '';
          if (q.objectives && q.objectives.length > 0) {
            objectivesHtml = '<ul style="margin: 5px 0 0 20px; padding: 0; font-size: 0.9em; list-style-type: circle;">';
            q.objectives.forEach(obj => {
              const currentProgress = (q.objectiveProgress && q.objectiveProgress[obj.id]) || 0;
              const target = obj.count || 1;
              
              // Handle boolean vs numeric progress
              let isDone = false;
              let progressText = '';
              
              if (typeof currentProgress === 'boolean') {
                isDone = currentProgress;
              } else {
                isDone = currentProgress >= target;
                if (target > 1) {
                  progressText = \` (\${currentProgress}/\${target})\`;
                }
              }
              
              const style = isDone ? 'text-decoration: line-through; color: var(--text-muted, #888);' : 'color: var(--text-dim, #ccc);';
              objectivesHtml += \`<li style="\${style}">\${esc(obj.description || obj.id)}\${progressText}</li>\`;
            });
            objectivesHtml += '</ul>';
          }`;

if (code.includes(oldCode)) {
  fs.writeFileSync(file, code.replace(oldCode, newCode));
  console.log("Updated render.js to handle objective counts correctly");
} else {
  console.log("Could not find the target code in render.js. Outputting current code around it:");
  console.log(code.substring(code.indexOf("let objectivesHtml = '';"), code.indexOf("let objectivesHtml = '';") + 400));
}
