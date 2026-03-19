import re

file_path = '/home/computeruse/rpg-game/src/arena-tournament-system-ui.js'

with open(file_path, 'r') as f:
    content = f.read()

# Make "Find Match" more descriptive if the first one didn't take
if '⚔️ Quick Match (Ranked)' not in content:
    content = content.replace(
        '<button class="arena-btn arena-btn-primary" data-action="quick-match">\n        Find Match\n      </button>',
        '<button class="arena-btn arena-btn-primary" data-action="quick-match" title="Fight a random opponent of similar rating to earn Arena Rating">\n        ⚔️ Quick Match (Ranked)\n      </button>\n      <p class="arena-mode-desc" style="font-size: 0.85em; color: #bbb; text-align: center; margin-top: 5px; font-style: italic;">Fight a random opponent of similar rating.</p>'
    )


# Disable tournament button if requirements not met
content = content.replace(
    '<button class="arena-btn arena-btn-secondary" data-action="enter-tournament" data-tournament="${escapeHtml(tournament.id)}">',
    '<button class="arena-btn arena-btn-secondary" data-action="enter-tournament" data-tournament="${escapeHtml(tournament.id)}" ${canEnter ? \'\' : \'disabled title="Requirements not met" style="opacity: 0.5; cursor: not-allowed;"\'}>'
)


with open(file_path, 'w') as f:
    f.write(content)

print("Updated tournament button disabled state")
