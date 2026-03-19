import sys

filename = '/home/computeruse/rpg-game/src/map.js'

with open(filename, 'r') as f:
    content = f.read()

# Replace the specific obstacle block for Northeast Ridge to widen the path.
# Changing from:
#     buildRoom('ne', 'Northeast Ridge', [
#       { x: 1, y: 3, w: 2, h: 1 },
#       { x: 5, y: 1, w: 1, h: 1 },
#     ]),
# To:
#     buildRoom('ne', 'Northeast Ridge', [
#       { x: 1, y: 3, w: 1, h: 1 },
#       { x: 5, y: 1, w: 1, h: 1 },
#     ]),
# This opens up the path at x=2, y=3

old_block = """    buildRoom('ne', 'Northeast Ridge', [
      { x: 1, y: 3, w: 2, h: 1 },
      { x: 5, y: 1, w: 1, h: 1 },
    ]),"""

new_block = """    buildRoom('ne', 'Northeast Ridge', [
      { x: 1, y: 3, w: 1, h: 1 },
      { x: 5, y: 1, w: 1, h: 1 },
    ]),"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open(filename, 'w') as f:
        f.write(content)
    print("Successfully updated Northeast Ridge map obstacles.")
else:
    print("Could not find the target block in map.js.")

