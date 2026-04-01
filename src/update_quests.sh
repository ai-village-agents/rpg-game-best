# Update quests
codex exec "In src/data/quests.js, insert main_quest_2 and main_quest_3 directly after main_quest_1. Here is the code for the new quests:
  main_quest_2: {
    id: 'main_quest_2',
    name: 'Shadows in the South',
    description: 'The Village Elder is concerned about the dark magic the goblin chief was using. He asked you to speak with Guard Captain Rolf about recent reports from the south.',
    type: 'MAIN',
    level: 3,
    stages: [
      {
        id: 'talk_rolf',
        name: 'Speak with Captain Rolf',
        description: 'Find Guard Captain Rolf at the barracks.',
        objectives: [
          {
            id: 'talk_captain',
            type: 'TALK',
            description: 'Speak with Guard Captain Rolf',
            npcId: 'guard_captain_rolf',
            required: true
          }
        ],
        nextStage: 'clear_road'
      },
      {
        id: 'clear_road',
        name: 'Secure the Pilgrim Road',
        description: 'Captain Rolf reports bandit activity blocking the southern route. Travel south to the Pilgrim Road and clear them out.',
        objectives: [
          {
            id: 'explore_s',
            type: 'EXPLORE',
            description: 'Reach the Pilgrim Road (South)',
            locationId: 's',
            required: true
          },
          {
            id: 'kill_bandits',
            type: 'KILL',
            description: 'Defeat Bandits',
            enemyType: 'bandit',
            count: 3,
            current: 0,
            required: true
          }
        ],
        nextStage: 'investigate_harbor'
      },
      {
        id: 'investigate_harbor',
        name: 'Investigate Tideglass Harbor',
        description: 'With the road clear, continue southeast to Tideglass Harbor to investigate the source of the dark magic.',
        objectives: [
          {
            id: 'explore_se',
            type: 'EXPLORE',
            description: 'Reach Tideglass Harbor (Southeast)',
            locationId: 'se',
            required: true
          }
        ],
        nextStage: 'defeat_cultists'
      },
      {
        id: 'defeat_cultists',
        name: 'Stop the Ritual',
        description: 'Dark Cultists are performing a ritual in the harbor! Stop them.',
        objectives: [
          {
            id: 'kill_cultists',
            type: 'KILL',
            description: 'Defeat Dark Cultists',
            enemyType: 'dark-cultist',
            count: 2,
            current: 0,
            required: true
          }
        ],
        nextStage: 'return_rolf'
      },
      {
        id: 'return_rolf',
        name: 'Report to Captain Rolf',
        description: 'Return to Millbrook Crossing and report your success to Captain Rolf.',
        objectives: [
          {
            id: 'report_rolf',
            type: 'TALK',
            description: 'Speak with Guard Captain Rolf',
            npcId: 'guard_captain_rolf',
            required: true
          }
        ],
        nextStage: null
      }
    ],
    rewards: {
      gold: 150,
      experience: 400,
      items: ['steel_sword', 'health_potion'],
      flags: ['saved_harbor']
    },
    prerequisites: ['main_quest_1']
  },

  main_quest_3: {
    id: 'main_quest_3',
    name: 'The Crystal Corruption',
    description: 'Captain Rolf suggests taking the recovered cultist artifacts to Mage Elindra at the Mage Tower in town for analysis.',
    type: 'MAIN',
    level: 5,
    stages: [
      {
        id: 'talk_elindra',
        name: 'Consult the Mage',
        description: 'Find Mage Elindra at the Mage Tower.',
        objectives: [
          {
            id: 'talk_mage',
            type: 'TALK',
            description: 'Speak with Mage Elindra',
            npcId: 'magic_trainer',
            required: true
          }
        ],
        nextStage: 'explore_heights'
      },
      {
        id: 'explore_heights',
        name: 'Scale the Heights',
        description: 'Elindra senses a massive concentration of dark energy in Crystalspine Heights. Travel northeast to investigate.',
        objectives: [
          {
            id: 'explore_ne',
            type: 'EXPLORE',
            description: 'Reach Crystalspine Heights (Northeast)',
            locationId: 'ne',
            required: true
          }
        ],
        nextStage: 'clear_corruption'
      },
      {
        id: 'clear_corruption',
        name: 'Shatter the Crystals',
        description: 'The heights are crawling with elemental constructs corrupted by the cultists. Clear them out.',
        objectives: [
          {
            id: 'kill_golems',
            type: 'KILL',
            description: 'Defeat Stone Golems',
            enemyType: 'stone-golem',
            count: 2,
            current: 0,
            required: true
          },
          {
            id: 'kill_spirits',
            type: 'KILL',
            description: 'Defeat Ice Spirits',
            enemyType: 'ice-spirit',
            count: 3,
            current: 0,
            required: true
          }
        ],
        nextStage: 'defeat_overseer'
      },
      {
        id: 'defeat_overseer',
        name: 'The Cultist Overseer',
        description: 'A powerful shadow weaver is orchestrating the corruption here. Defeat them!',
        objectives: [
          {
            id: 'kill_weaver',
            type: 'KILL',
            description: 'Defeat the Shadow Weaver',
            enemyType: 'shadow-weaver',
            count: 1,
            current: 0,
            required: true
          }
        ],
        nextStage: 'return_elindra'
      },
      {
        id: 'return_elindra',
        name: 'Report to Elindra',
        description: 'Return to the Mage Tower in town and inform Elindra of the Overseer\'s defeat.',
        objectives: [
          {
            id: 'report_mage',
            type: 'TALK',
            description: 'Speak with Mage Elindra',
            npcId: 'magic_trainer',
            required: true
          }
        ],
        nextStage: null
      }
    ],
    rewards: {
      gold: 250,
      experience: 600,
      items: ['ether', 'mana_potion', 'chainmail'],
      flags: ['saved_heights']
    },
    prerequisites: ['main_quest_2']
  }," --skip-git-repo-check

codex exec "In src/data/npcs.js, update the village_elder's quests array to include 'main_quest_2'. Also update guard_captain_rolf's quests array to include 'main_quest_3'." --skip-git-repo-check
