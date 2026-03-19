const fs = require('fs');

const mainPath = '/home/computeruse/rpg-game/src/main.js';
let mainData = fs.readFileSync(mainPath, 'utf8');

const modalHtml = `
<div id="narrative-modal" class="modal">
  <div class="modal-content">
    <h2>The Coming Oblivion</h2>
    <p>The Elder Scrolls foretold of a time when the Oblivion Lord would awaken... and that time is now.</p>
    <p>Darkness seeps across the land. The realms are fracturing.</p>
    <p>As a humble adventurer, you have been chosen by the Fates to descend into the perilous dungeons, slay the Oblivion Lord, and restore peace to the realm.</p>
    <p>Your journey begins here. Steel your resolve.</p>
    <button id="close-narrative" class="primary">Begin Adventure</button>
  </div>
</div>
`;

// I need to add this to index.html actually.

