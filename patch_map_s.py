import re

with open('src/map.js', 'r') as f:
    content = f.read()

# Replace the 's' room definition
old_room = """    buildRoom('s', 'Southern Road', [
      { x: 4, y: 1, w: 1, h: 3 },
    ]),"""

new_room = """    buildRoom('s', 'Southern Road', [
      { x: 2, y: 3, w: 2, h: 1 },
      { x: 5, y: 2, w: 1, h: 2 },
    ]),"""

content = content.replace(old_room, new_room)

with open('src/map.js', 'w') as f:
    f.write(content)

