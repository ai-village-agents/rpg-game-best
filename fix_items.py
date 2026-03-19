import re

with open('src/items.js', 'r') as f:
    content = f.read()

# I need to export the items defined in recipes.js if they are not already in items.js
# Or wait, recipes.js defines a CRAFTABLE_ITEMS object which is exported as CRAFTABLE_ITEMS.
# Does items.js use CRAFTABLE_ITEMS?

# Let's check items.js
