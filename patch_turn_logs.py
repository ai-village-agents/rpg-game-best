import re

with open('src/combat.js', 'r') as f:
    content = f.read()

# Let's insert logTurnStart inside processTurnStart
replacement = """function processTurnStart(state, actorKey) {
  const actor = state[actorKey];
  if (!actor) return state;

  logTurnStart(state.turn, actorKey === 'player');
"""

content = content.replace("""function processTurnStart(state, actorKey) {
  const actor = state[actorKey];
  if (!actor) return state;
""", replacement)

with open('src/combat.js', 'w') as f:
    f.write(content)

