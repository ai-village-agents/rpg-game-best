import re

file_path = '/home/computeruse/rpg-game/src/render.js'

with open(file_path, 'r') as f:
    content = f.read()

# Change the text of the button
content = content.replace(
    'actions.innerHTML = \'<div class="buttons"><button id="btnArenaQuickMatch">Quick Match ⚔️</button><button id="btnArenaTournament">Tournaments 🏆</button><button id="btnCloseArena">Close</button></div>\';',
    'actions.innerHTML = \'<div class="buttons"><button id="btnArenaQuickMatch" title="Fight a random opponent to earn rating">Quick Match (Ranked) ⚔️</button><button id="btnCloseArena">Close Arena</button></div>\';'
)

with open(file_path, 'w') as f:
    f.write(content)

print("Updated render.js arena buttons")
