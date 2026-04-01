/**
 * Quest Data - Sample quests for the RPG
 * Part of Story/Dialog Module
 */

export const QUESTS = {
  // Main Quest Line
  main_quest_1: {
    id: 'main_quest_1',
    startLocation: 'r_5_5',
    name: 'The Goblin Menace',
    description: 'Craglorn Scrappers have been raiding the lumingrass farms near Millbrook Crossing. The Village Elder has asked you to deal with them.',
    type: 'MAIN',
    level: 1,
    stages: [
      {
        id: 'investigate',
        name: 'Investigate the Raids',
        description: 'Speak to the farmers about the goblin attacks.',
        objectives: [
          {
            id: 'talk_farmer1',
            type: 'TALK',
            description: 'Speak with Farmer Grenn',
            npcId: 'farmer_grenn',
            required: true
          },
          {
            id: 'talk_farmer2',
            type: 'TALK',
            description: 'Speak with Farmer Milda',
            npcId: 'farmer_milda',
            required: true
          }
        ],
        nextStage: 'find_camp'
      },
      {
        id: 'find_camp',
        name: 'Find the Goblin Camp',
        description: 'The farmers mentioned seeing goblins heading east. Find their camp.',
        objectives: [
          {
            id: 'explore_east',
            type: 'EXPLORE',
            description: 'Search the eastern woods',
            locationId: 'e',
            required: true
          },
          {
            id: 'find_tracks',
            type: 'INTERACT',
            description: 'Examine goblin tracks',
            interactId: 'goblin_tracks',
            required: false
          }
        ],
        nextStage: 'defeat_goblins'
      },
      {
        id: 'defeat_goblins',
        name: 'Clear the Goblin Camp',
        description: 'Defeat the goblins and their leader to stop the raids.',
        objectives: [
          {
            id: 'kill_goblins',
            type: 'KILL',
            description: 'Defeat goblins',
            enemyType: 'goblin',
            count: 5,
            current: 0,
            required: true
          },
          {
            id: 'kill_chief',
            type: 'KILL',
            description: 'Defeat the Goblin Chief',
            enemyType: 'goblin_chief',
            count: 1,
            current: 0,
            required: true
          }
        ],
        nextStage: 'return'
      },
      {
        id: 'return',
        name: 'Report to the Elder',
        description: 'Return to the Village Elder with news of your victory.',
        objectives: [
          {
            id: 'talk_elder',
            type: 'TALK',
            description: 'Speak with the Village Elder',
            npcId: 'village_elder',
            required: true
          }
        ],
        nextStage: null
      }
    ],
    rewards: {
      gold: 100,
      experience: 250,
      items: ['iron_sword'],
      flags: ['saved_village']
    },
    prerequisites: []
  },

  main_quest_2: {
    id: 'main_quest_2',
    startLocation: 'r_5_5',
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
    startLocation: 'r_5_5',
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
  },

  // Side Quest - Item Collection
  side_herb_gathering: {
    id: 'side_herb_gathering',
    startLocation: 'r_5_5',
    name: 'Herbal Remedies',
    description: 'The village healer needs rare herbs to create healing potions.',
    type: 'SIDE',
    level: 1,
    stages: [
      {
        id: 'gather',
        name: 'Gather Herbs',
        description: 'Collect medicinal herbs from around the village.',
        objectives: [
          {
            id: 'collect_moonpetal',
            type: 'COLLECT',
            description: 'Collect Moonpetal flowers',
            itemId: 'moonpetal',
            count: 3,
            current: 0,
            required: true
          },
          {
            id: 'collect_silverleaf',
            type: 'COLLECT',
            description: 'Collect Silverleaf',
            itemId: 'silverleaf',
            count: 2,
            current: 0,
            required: true
          }
        ],
        nextStage: 'deliver'
      },
      {
        id: 'deliver',
        name: 'Deliver the Herbs',
        description: 'Bring the herbs to the healer.',
        objectives: [
          {
            id: 'give_herbs',
            type: 'DELIVER',
            description: 'Give herbs to Healer Sera',
            npcId: 'healer_sera',
            itemIds: ['moonpetal', 'silverleaf'],
            required: true
          }
        ],
        nextStage: null
      }
    ],
    rewards: {
      gold: 30,
      experience: 75,
      items: ['health_potion', 'health_potion', 'health_potion']
    },
    prerequisites: []
  },

  // Side Quest - Combat Focused
  side_cave_clearing: {
    id: 'side_cave_clearing',
    startLocation: 'r_5_5',
    name: 'The Darkened Cave',
    description: 'Strange creatures have been seen near the old cave. Clear them out.',
    type: 'SIDE',
    level: 3,
    stages: [
      {
        id: 'enter_cave',
        name: 'Enter the Cave',
        description: 'Find and enter the cave north of the village.',
        objectives: [
          {
            id: 'reach_cave',
            type: 'EXPLORE',
            description: 'Reach the cave entrance',
            locationId: 'dark_cave_entrance',
            required: true
          }
        ],
        nextStage: 'clear_cave'
      },
      {
        id: 'clear_cave',
        name: 'Clear the Cave',
        description: 'Defeat all enemies inside the cave.',
        objectives: [
          {
            id: 'kill_bats',
            type: 'KILL',
            description: 'Defeat cave bats',
            enemyType: 'cave_bat',
            count: 8,
            current: 0,
            required: true
          },
          {
            id: 'kill_spider',
            type: 'KILL',
            description: 'Defeat the Giant Spider',
            enemyType: 'giant_spider',
            count: 1,
            current: 0,
            required: true
          }
        ],
        nextStage: 'loot'
      },
      {
        id: 'loot',
        name: 'Claim Your Reward',
        description: 'Search the cave for treasure.',
        objectives: [
          {
            id: 'find_chest',
            type: 'INTERACT',
            description: 'Open the hidden chest',
            interactId: 'cave_treasure_chest',
            required: true
          }
        ],
        nextStage: null
      }
    ],
    rewards: {
      gold: 75,
      experience: 150,
      items: ['steel_dagger']
    },
    prerequisites: ['main_quest_1']
  },

  // Escort Quest
  side_escort_merchant: {
    id: 'side_escort_merchant',
    startLocation: 'r_5_5',
    name: 'Safe Passage',
    description: 'A traveling merchant needs protection on the road to the next town.',
    type: 'SIDE',
    level: 2,
    stages: [
      {
        id: 'meet_merchant',
        name: 'Meet the Merchant',
        description: 'Find the merchant at the Rusty Anchor inn.',
        objectives: [
          {
            id: 'talk_merchant',
            type: 'TALK',
            description: 'Speak with Merchant Varro',
            npcId: 'merchant_varro',
            required: true
          }
        ],
        nextStage: 'escort'
      },
      {
        id: 'escort',
        name: 'Escort to Riverdale',
        description: 'Protect the merchant on the journey.',
        objectives: [
          {
            id: 'escort_varro',
            type: 'ESCORT',
            description: 'Escort Merchant Varro to Riverdale',
            npcId: 'merchant_varro',
            destinationId: 'riverdale_entrance',
            required: true
          }
        ],
        nextStage: 'complete'
      },
      {
        id: 'complete',
        name: 'Claim Your Payment',
        description: 'Speak with Varro to receive payment.',
        objectives: [
          {
            id: 'get_paid',
            type: 'TALK',
            description: 'Collect payment from Varro',
            npcId: 'merchant_varro',
            required: true
          }
        ],
        nextStage: null
      }
    ],
    rewards: {
      gold: 50,
      experience: 100,
      items: ['traveler_cloak']
    },
    prerequisites: []
  },

  // The Missing Merchant
  side_missing_merchant: {
    id: 'side_missing_merchant',
    startLocation: 'r_5_5',
    name: 'The Missing Merchant',
    description: 'A merchant went missing on the north road. The innkeeper is worried and asks you to investigate.',
    type: 'SIDE',
    level: 2,
    stages: [
      {
        id: 'talk_innkeeper',
        name: 'Ask the Innkeeper',
        description: 'Speak with the innkeeper about the missing merchant.',
        objectives: [
          {
            id: 'talk_to_innkeeper',
            type: 'TALK',
            description: 'Speak with Innkeeper Marta',
            npcId: 'innkeeper_mira',
            required: true
          }
        ],
        nextStage: 'search_road'
      },
      {
        id: 'search_road',
        name: 'Search the The Shimmer Trail',
        description: 'Explore the The Shimmer Trail where the merchant was last seen.',
        objectives: [
          {
            id: 'explore_north_road',
            type: 'EXPLORE',
            description: 'Search the The Shimmer Trail',
            locationId: 'n',
            required: true
          }
        ],
        nextStage: 'defeat_wolves'
      },
      {
        id: 'defeat_wolves',
        name: 'Defeat the Wolves',
        description: 'Wolves have been prowling the path. Defeat them to find the merchant.',
        objectives: [
          {
            id: 'kill_wolves',
            type: 'KILL',
            description: 'Defeat wolves along the The Shimmer Trail',
            enemyType: 'wolf',
            count: 2,
            current: 0,
            required: true
          }
        ],
        nextStage: 'return_to_innkeeper'
      },
      {
        id: 'return_to_innkeeper',
        name: 'Return to the Innkeeper',
        description: 'Report back to Innkeeper Marta with news of the merchant.',
        objectives: [
          {
            id: 'report_to_innkeeper',
            type: 'TALK',
            description: 'Tell Innkeeper Marta what you found',
            npcId: 'innkeeper_mira',
            required: true
          }
        ],
        nextStage: null
      }
    ],
    rewards: {
      gold: 50,
      experience: 75,
      items: []
    },
    prerequisites: []
  },

  // The Lost Cartographer
  side_lost_cartographer: {
    id: 'side_lost_cartographer',
    startLocation: 'r_5_5',
    name: 'The Lost Cartographer',
    description: 'A mapmaker has lost his journal while exploring the wilds. Help him recover it by searching key locations.',
    type: 'SIDE',
    level: 1,
    stages: [
      {
        id: 'meet_cartographer',
        name: 'Meet the Cartographer',
        description: 'Speak with the mapmaker at the village square.',
        objectives: [
          {
            id: 'talk_cartographer',
            type: 'TALK',
            description: 'Speak with Cartographer Olen',
            npcId: 'village_elder',
            required: true
          }
        ],
        nextStage: 'search_zones'
      },
      {
        id: 'search_zones',
        name: 'Search the Wilds',
        description: 'Explore different regions to find the lost journal.',
        objectives: [
          {
            id: 'explore_west',
            type: 'EXPLORE',
            description: 'Search the western region',
            locationId: 'w',
            required: true
          },
          {
            id: 'explore_south',
            type: 'EXPLORE',
            description: 'Search the southern region',
            locationId: 's',
            required: true
          },
          {
            id: 'explore_east',
            type: 'EXPLORE',
            description: 'Search the eastern region',
            locationId: 'e',
            required: true
          }
        ],
        nextStage: 'return_journal'
      },
      {
        id: 'return_journal',
        name: 'Return the Journal',
        description: 'Bring the recovered journal back to Olen.',
        objectives: [
          {
            id: 'return_to_olen',
            type: 'TALK',
            description: 'Return the journal to Cartographer Olen',
            npcId: 'village_elder',
            required: true
          }
        ],
        nextStage: null
      }
    ],
    rewards: {
      gold: 30,
      experience: 50,
      items: ['ether']
    },
    prerequisites: []
  },

  // The Ancient Tome
  side_ancient_tome: {
    id: 'side_ancient_tome',
    startLocation: 'r_5_5',
    name: 'The Ancient Tome',
    description: 'The hermit sage has heard of an ancient tome hidden in the ruins. He asks you to retrieve it from the dark cultist guarding it.',
    type: 'SIDE',
    level: 3,
    stages: [
      {
        id: 'speak_with_sage',
        name: 'Speak with the Sage',
        description: 'Visit the hermit sage and learn about the ancient tome.',
        objectives: [
          {
            id: 'talk_hermit_sage',
            type: 'TALK',
            description: 'Speak with the Hermit Sage',
            npcId: 'alchemist_pim',
            required: true
          }
        ],
        nextStage: 'find_ruins'
      },
      {
        id: 'find_ruins',
        name: 'Find the Ruins',
        description: 'Search for the ancient ruins where the tome is hidden.',
        objectives: [
          {
            id: 'explore_ruins',
            type: 'EXPLORE',
            description: 'Explore the ancient ruins',
            locationId: 'ancient_ruins',
            required: true
          }
        ],
        nextStage: 'defeat_cultist'
      },
      {
        id: 'defeat_cultist',
        name: 'Defeat the Cultist',
        description: 'A dark cultist guards the tome. Defeat it to claim the tome.',
        objectives: [
          {
            id: 'kill_dark_cultist',
            type: 'KILL',
            description: 'Defeat the dark cultist guarding the tome',
            enemyType: 'dark-cultist',
            count: 1,
            current: 0,
            required: true
          }
        ],
        nextStage: 'return_tome'
      },
      {
        id: 'return_tome',
        name: 'Return the Tome',
        description: 'Bring the ancient tome back to the hermit sage.',
        objectives: [
          {
            id: 'return_to_sage',
            type: 'TALK',
            description: 'Return the ancient tome to the Hermit Sage',
            npcId: 'alchemist_pim',
            required: true
          }
        ],
        nextStage: null
      }
    ],
    rewards: {
      gold: 100,
      experience: 150,
      items: ['hiPotion', 'ether']
    },
    prerequisites: ['main_quest_1']
  },

  // Repeatable Daily Quest
  daily_training: {
    id: 'daily_training',
    startLocation: 'r_5_5',
    name: 'Combat Training',
    description: 'Train with the village guard to improve your skills.',
    type: 'DAILY',
    level: 1,
    repeatable: true,
    stages: [
      {
        id: 'train',
        name: 'Training Session',
        description: 'Complete a training session.',
        objectives: [
          {
            id: 'spar',
            type: 'KILL',
            description: 'Win training sparring matches',
            enemyType: 'training_dummy',
            count: 3,
            current: 0,
            required: true
          }
        ],
        nextStage: 'report'
      },
      {
        id: 'report',
        name: 'Report Completion',
        description: 'Tell the guard captain you finished training.',
        objectives: [
          {
            id: 'talk_captain',
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
      gold: 10,
      experience: 25,
      items: []
    },
    prerequisites: []
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QUESTS };
}
