import re

with open('src/handlers/provisions-handler.js', 'r') as f:
    content = f.read()

# Original implementation assumes inventory is an array:
# const inventory = state.player.inventory || [];
# for (const ingredient of recipe.ingredients) {
#   const item = inventory.find((i) => i.id === ingredient.itemId);
# ...
# let newInventory = inventory.map((i) => ({ ...i }));

import textwrap

replacement = """
    const inventory = state.player.inventory || {};
    for (const ingredient of recipe.ingredients) {
      const currentQty = inventory[ingredient.itemId] || 0;
      if (currentQty < ingredient.quantity) {
        return {
          ...state,
          provisionsUI: {
            ...state.provisionsUI,
            message: `Missing ingredient: ${ingredient.itemId} (need ${ingredient.quantity}).`,
          },
        };
      }
    }

    let newInventory = { ...inventory };
    for (const ingredient of recipe.ingredients) {
      newInventory[ingredient.itemId] -= ingredient.quantity;
      if (newInventory[ingredient.itemId] <= 0) {
        delete newInventory[ingredient.itemId];
      }
    }

    const currentResultQty = newInventory[recipe.result.itemId] || 0;
    newInventory[recipe.result.itemId] = currentResultQty + recipe.result.quantity;

    const msg = `Cooked ${recipe.name}! Received ${recipe.result.quantity}x ${recipe.result.itemId}.`;
    let next = {
      ...state,
      player: { ...state.player, inventory: newInventory },
      provisionsUI: { ...state.provisionsUI, message: msg },
    };
"""

content = re.sub(r'const inventory = state\.player\.inventory \|\| \[\];.*provisionsUI: \{ \.\.\.state\.provisionsUI, message: msg \},\n    \};\n', replacement, content, flags=re.DOTALL)

with open('src/handlers/provisions-handler.js', 'w') as f:
    f.write(content)
