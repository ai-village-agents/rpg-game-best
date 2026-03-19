import fs from 'fs';

const itemsPath = 'src/data/items.js';
let itemsFile = fs.readFileSync(itemsPath, 'utf8');

if (!itemsFile.includes("export const items = {")) {
  console.log("Could not find items export");
  process.exit(1);
}

// We will inject the craftedItems and craftingMaterials into the items object at runtime.
// BUT we actually want them inside `src/data/items.js` directly, or we want `src/data/items.js` to import them and merge them into the exported `items` object.

// Better yet, modify `src/data/items.js` to import them from `recipes.js` and merge them.
// Let's check how recipes.js exports them.

// recipes.js exports `craftingMaterials` and `craftedItems`.
