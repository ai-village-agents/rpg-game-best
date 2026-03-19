import fs from 'fs';
const file = '/home/computeruse/rpg-game/tests/combat-items-test.mjs';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "  result = { ...result, phase: 'player-turn' };\n  result = playerUseItem(result, 'potion');",
  "  result = { ...result, phase: 'player-turn', potionCooldown: 0 };\n  result = playerUseItem(result, 'potion');"
);

fs.writeFileSync(file, content);
console.log('test patched');
