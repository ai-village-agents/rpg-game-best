import re

file_path = '/home/computeruse/rpg-game/src/arena-tournament-system-ui.js'

with open(file_path, 'r') as f:
    content = f.read()

# Make "Find Match" more descriptive
content = content.replace(
    '<button class="arena-btn arena-btn-primary" data-action="quick-match">\n        Find Match\n      </button>',
    '<button class="arena-btn arena-btn-primary" data-action="quick-match" title="Fight a random opponent of similar rating to earn Arena Rating">\n        ⚔️ Quick Match (Ranked)\n      </button>\n      <p class="arena-mode-desc" style="font-size: 0.8em; color: #aaa; text-align: center; margin-top: 5px; font-style: italic;">Fight a random opponent of similar rating.</p>'
)

# Explain rating
content = content.replace(
    '<span class="rating-label">Rating</span>',
    '<span class="rating-label">Rating <span title="Earn rating by winning Quick Matches. Higher rating unlocks Tournaments!" style="cursor:help">ℹ️</span></span>'
)


with open(file_path, 'w') as f:
    f.write(content)

print("Updated arena UI text")
