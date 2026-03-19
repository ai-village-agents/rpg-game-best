const fs = require('fs');
const path = require('path');

const itemsPath = path.join(__dirname, 'src', 'data', 'items.js');
let itemsCode = fs.readFileSync(itemsPath, 'utf8');

if (!itemsCode.includes('import { craftingMaterials, craftedItems } from')) {
    const importStatement = "import { craftingMaterials, craftedItems } from './recipes.js';\n\n";
    itemsCode = importStatement + itemsCode;
    
    // Now we need to merge them into the items export.
    // It currently says `export const items = { ... }`
    // We can change it to:
    // const baseItems = { ... }
    // export const items = { ...baseItems, ...craftingMaterials, ...craftedItems };
    
    itemsCode = itemsCode.replace('export const items = {', 'const baseItems = {');
    
    // Now we need to find the end of the baseItems object and add the export.
    // We know the end is right before `export const lootTables = {`
    
    const parts = itemsCode.split('export const lootTables = {');
    if (parts.length !== 2) {
        console.error("Could not find lootTables export");
        process.exit(1);
    }
    
    const newExport = "\nexport const items = { ...baseItems, ...craftingMaterials, ...craftedItems };\n\nexport const lootTables = {";
    
    itemsCode = parts[0] + newExport + parts[1];
    
    fs.writeFileSync(itemsPath, itemsCode);
    console.log("Successfully patched src/data/items.js to include crafted items and materials.");
} else {
    console.log("src/data/items.js already includes recipes.js imports.");
}
