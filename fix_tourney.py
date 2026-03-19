import re

file_path = '/home/computeruse/rpg-game/src/arena-tournament-system-ui.js'

with open(file_path, 'r') as f:
    content = f.read()

content = content.replace(
    '<h3>Tournaments</h3>',
    '<h3>🏆 Tournaments</h3>\n      <p class="tournament-desc" style="font-size: 0.85em; color: #bbb; margin-bottom: 15px; font-style: italic;">Enter high-stakes tournaments for massive rewards! Requires specific levels and entry fees.</p>'
)

with open(file_path, 'w') as f:
    f.write(content)

print("Updated tournament desc")
