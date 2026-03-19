import re

with open('src/render.js', 'r') as f:
    content = f.read()

# Replace actions.querySelectorAll('.inv-btn').forEach(btn => {
# with:
# [...actions.querySelectorAll('.inv-btn'), ...hud.querySelectorAll('.inv-btn')].forEach(btn => {

content = content.replace("actions.querySelectorAll('.inv-btn').forEach(btn => {", "[...actions.querySelectorAll('.inv-btn'), ...hud.querySelectorAll('.inv-btn')].forEach(btn => {")

with open('src/render.js', 'w') as f:
    f.write(content)

