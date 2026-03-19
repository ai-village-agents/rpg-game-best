import re

file_path = "src/state-transitions.js"
with open(file_path, "r") as f:
    content = f.read()

# We need to make sure we don't accidentally overwrite the whole file or break it. Let's be precise.
# Let's read the function.
import sys

old_func = """export function transitionToExploration(state) {
  return {
    ...state,
    phase: STATE_PHASES.EXPLORATION,
    combatState: null,
    messages: [],
  };
}"""

new_func = """export function transitionToExploration(state) {
  let newMessages = [];
  let isNewGame = state.party && state.party[0] && state.party[0].level === 1 && state.map && state.map.currentLocationId === 'village-square' && !state.flags.introPlayed;
  
  if (isNewGame) {
    newMessages.push("A dense, unnatural fog surrounds the isolated AI Village, cutting it off from the rest of the realm. Whispers speak of a primordial threat stirring deep within the ancient dungeons below.");
    newMessages.push("You step into the Village Square, sensing the weight of the villagers' desperate hopes resting upon your shoulders. It's time to uncover the source of the creeping darkness.");
    state.flags.introPlayed = true;
  }
  
  return {
    ...state,
    phase: STATE_PHASES.EXPLORATION,
    combatState: null,
    messages: newMessages,
  };
}"""

if old_func in content:
    content = content.replace(old_func, new_func)
    with open(file_path, "w") as f:
        f.write(content)
    print("Replaced transitionToExploration successfully.")
else:
    print("Could not find the exact function to replace.")
    # let's try a regex fallback
    match = re.search(r"export function transitionToExploration\(state\) \{[\s\S]*?return \{[\s\S]*?phase: STATE_PHASES\.EXPLORATION,[\s\S]*?combatState: null,[\s\S]*?messages: \[\],?\s*\}\s*;", content)
    if match:
         content = content.replace(match.group(0), new_func)
         with open(file_path, "w") as f:
             f.write(content)
         print("Replaced via regex fallback.")
    else:
         print("Regex fallback failed too.")
