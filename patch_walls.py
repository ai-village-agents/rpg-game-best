import os

file_path = 'src/area-scene-renderer.js'
with open(file_path, 'r') as f:
    content = f.read()

# Add import
content = content.replace(
    "import { DEFAULT_WORLD_DATA, getRoomExits } from './map.js';",
    "import { DEFAULT_WORLD_DATA, getRoomExits, getCurrentRoom } from './map.js';"
)

# Add renderCollisionOverlay function before renderAreaScene
overlay_func = """
function renderCollisionOverlay(state) {
  const roomWidth = state?.worldData?.roomWidth ?? DEFAULT_WORLD_DATA.roomWidth;
  const roomHeight = state?.worldData?.roomHeight ?? DEFAULT_WORLD_DATA.roomHeight;
  const room = getCurrentRoom(state.world, state.worldData);
  if (!room || !room.collision) return '';

  let html = '';
  for (let y = 0; y < roomHeight; y++) {
    for (let x = 0; x < roomWidth; x++) {
      if (room.collision[y][x] === 1) {
        const cellLeft = (x / roomWidth) * 100;
        const cellBottom = ((roomHeight - y - 1) / roomHeight) * 60;
        const cellWidth = 100 / roomWidth;
        const cellHeight = 60 / roomHeight;
        
        // Exits are 0, walls are 1. The perimeter will be visibly blocked.
        html += `<div class="area-scene-collision-cell" style="left: ${cellLeft}%; bottom: ${cellBottom}%; width: ${cellWidth}%; height: ${cellHeight}%;"></div>`;
      }
    }
  }
  return html;
}
"""

if "function renderCollisionOverlay" not in content:
    content = content.replace(
        "export function renderAreaScene(state) {",
        overlay_func + "\nexport function renderAreaScene(state) {"
    )

# Insert overlay call in renderAreaScene
if "${collisionOverlay}" not in content:
    content = content.replace(
        "const locks = renderExitLocks(exits);",
        "const locks = renderExitLocks(exits);\n  const collisionOverlay = renderCollisionOverlay(state);"
    )
    content = content.replace(
        "${sceneElements}",
        "${sceneElements}\n      ${collisionOverlay}"
    )

# Add CSS for collision cell
css_insert = """
    .area-scene-collision-cell {
      position: absolute;
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(0, 0, 0, 0.4);
      box-sizing: border-box;
      pointer-events: none;
      z-index: 4;
      border-radius: 2px;
    }
"""
if ".area-scene-collision-cell" not in content:
    content = content.replace(
        "export function getAreaSceneStyles() {\n  return `",
        "export function getAreaSceneStyles() {\n  return `" + css_insert
    )

with open(file_path, 'w') as f:
    f.write(content)
print("Patched area-scene-renderer.js")
