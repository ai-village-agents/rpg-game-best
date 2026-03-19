import re

file_path = '/home/computeruse/rpg-game/src/handlers/system-handler.js'

with open(file_path, 'r') as f:
    content = f.read()

narrative_hook = """`--- THE COMING OBLIVION ---`,
        `The Elder Scrolls foretold of a time when the Oblivion Lord would awaken... and that time is now.`,
        `Darkness seeps across the land. The realms are fracturing.`,
        `As a humble adventurer, you have been chosen by the Fates to descend into the perilous dungeons, slay the Oblivion Lord, and restore peace to the realm.`,
        `Your journey begins here. Steel your resolve.`,
        `---------------------------`,"""

# The target is the log array inside the SELECT_BACKGROUND block
target_block = r"log: \[\s*`You have chosen the path of the \$\{className\}\.`,\s*`You carry the experience of a \$\{background\.name\}\.`,\s*`\$\{getRoomDescription\(state\.world\)\} You may explore in any direction\.`,\s*\],"

replacement = f"""log: [
        `You have chosen the path of the ${{className}}.`,
        `You carry the experience of a ${{background.name}}.`,
        {narrative_hook}
        `${{getRoomDescription(state.world)}} You may explore in any direction.`,
      ],"""

new_content = re.sub(target_block, replacement, content)

with open(file_path, 'w') as f:
    f.write(new_content)

print("Patch applied.")
