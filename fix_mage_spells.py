import re

with open('/home/computeruse/rpg-game/src/combat/abilities.js', 'r') as f:
    content = f.read()

# I want:
# Fireball: mpCost: 3, power: 2.0
# Blizzard: mpCost: 6, power: 1.8
# Thunder Bolt: mpCost: 4, power: 1.8

def update_spell(content, spell_id, cost, power):
    pattern = r"id: '" + spell_id + r"',(.*?)mpCost: \d+,(.*?)power: [\d\.]+,"
    replacement = r"id: '" + spell_id + r"',\1mpCost: " + str(cost) + r",\2power: " + str(power) + ","
    return re.sub(pattern, replacement, content, flags=re.DOTALL)

content = update_spell(content, 'fireball', 3, 2.0)
content = update_spell(content, 'blizzard', 6, 1.8)
content = update_spell(content, 'thunder-bolt', 4, 1.8)

with open('/home/computeruse/rpg-game/src/combat/abilities.js', 'w') as f:
    f.write(content)

