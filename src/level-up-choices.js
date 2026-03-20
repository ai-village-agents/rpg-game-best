import { STAT_GROWTH } from './characters/stats.js';

export const LEVEL_UP_CHOICES = {
  warrior: [
    {
      id: 'offensive',
      name: 'Path of the Berserker',
      description: 'Focus on raw power and aggression.',
      icon: '⚔️',
      statBoosts: { atk: 2, spd: 1 },
      grantAbilityAtLevels: { 5: 'cleave' },
    },
    {
      id: 'defensive',
      name: 'Path of the Guardian',
      description: 'Become an immovable wall of steel.',
      icon: '🛡️',
      statBoosts: { maxHp: 5, def: 2 },
      grantAbilityAtLevels: { 5: 'taunt' },
    },
    {
      id: 'utility',
      name: 'Path of the Warlord',
      description: 'Lead with cunning and inspire allies.',
      icon: '👑',
      statBoosts: { maxMp: 3, lck: 1, spd: 1 },
      grantAbilityAtLevels: { 5: 'rally' },
    },
  ],
  mage: [
    {
      id: 'offensive',
      name: 'Path of Destruction',
      description: 'Unleash devastating elemental fury.',
      icon: '🔥',
      statBoosts: { int: 2, maxMp: 3 },
      grantAbilityAtLevels: { 5: 'meteor' },
    },
    {
      id: 'defensive',
      name: 'Path of the Warden',
      description: 'Weave protective barriers and wards.',
      icon: '🔮',
      statBoosts: { maxHp: 4, def: 1, maxMp: 2 },
      grantAbilityAtLevels: { 5: 'mana-barrier' },
    },
    {
      id: 'utility',
      name: 'Path of the Sage',
      description: 'Master arcane secrets and mana efficiency.',
      icon: '📖',
      statBoosts: { maxMp: 5, lck: 1 },
      grantAbilityAtLevels: { 5: 'mana-drain' },
    },
  ],
  rogue: [
    {
      id: 'offensive',
      name: 'Path of the Assassin',
      description: 'Strike hard from the shadows.',
      icon: '🗡️',
      statBoosts: { atk: 2, spd: 1 },
      grantAbilityAtLevels: { 5: 'execute' },
    },
    {
      id: 'defensive',
      name: 'Path of the Shadow',
      description: 'Become untouchable and elusive.',
      icon: '🌑',
      statBoosts: { spd: 2, def: 1, maxHp: 2 },
      grantAbilityAtLevels: { 5: 'evasion' },
    },
    {
      id: 'utility',
      name: 'Path of the Trickster',
      description: 'Outsmart foes with cunning and luck.',
      icon: '🃏',
      statBoosts: { lck: 3, maxMp: 2 },
      grantAbilityAtLevels: { 5: 'steal' },
    },
  ],
  cleric: [
    {
      id: 'offensive',
      name: 'Path of the Templar',
      description: 'Channel divine wrath against evil.',
      icon: '⚡',
      statBoosts: { atk: 2, int: 1 },
      grantAbilityAtLevels: { 5: 'holy-fire' },
    },
    {
      id: 'defensive',
      name: 'Path of the Saint',
      description: 'Become a beacon of healing light.',
      icon: '✨',
      statBoosts: { maxHp: 4, maxMp: 3 },
      grantAbilityAtLevels: { 5: 'divine-shield' },
    },
    {
      id: 'utility',
      name: 'Path of the Oracle',
      description: 'See the threads of fate and guide allies.',
      icon: '🔮',
      statBoosts: { int: 1, lck: 2, spd: 1 },
      grantAbilityAtLevels: { 5: 'prophecy' },
    },
  ],
};

function getChoicesForClass(classId) {
  if (!STAT_GROWTH[classId]) return [];
  return LEVEL_UP_CHOICES[classId] || [];
}

export function generateLevelUpChoices(classId, newLevel) {
  const choices = getChoicesForClass(classId);
  return choices.map((choice) => ({
    ...choice,
    statBoosts: { ...choice.statBoosts },
    grantAbilityAtLevels: { ...choice.grantAbilityAtLevels },
    bonusAbility: choice.grantAbilityAtLevels?.[newLevel] ?? null,
  }));
}

export function applyLevelUpChoice(character, choiceId) {
  if (!character || !character.classId) {
    throw new Error('Invalid character for level-up choice.');
  }

  const choices = getChoicesForClass(character.classId);
  const choice = choices.find((entry) => entry.id === choiceId);
  if (!choice) {
    throw new Error(`Unknown level-up choice: ${choiceId}`);
  }

  const statBoosts = choice.statBoosts || {};
  const bonusAbility = choice.grantAbilityAtLevels?.[character.level] ?? null;

  const nextAbilities = Array.isArray(character.abilities)
    ? [...character.abilities]
    : [];

  if (bonusAbility && !nextAbilities.includes(bonusAbility)) {
    nextAbilities.push(bonusAbility);
  }

  return {
    ...character,
    stats: {
      ...character.stats,
      maxHp: (character.stats?.maxHp ?? 0) + (statBoosts.maxHp ?? 0),
      maxMp: (character.stats?.maxMp ?? 0) + (statBoosts.maxMp ?? 0),
      atk: (character.stats?.atk ?? 0) + (statBoosts.atk ?? 0),
      def: (character.stats?.def ?? 0) + (statBoosts.def ?? 0),
      spd: (character.stats?.spd ?? 0) + (statBoosts.spd ?? 0),
      int: (character.stats?.int ?? 0) + (statBoosts.int ?? 0),
      lck: (character.stats?.lck ?? 0) + (statBoosts.lck ?? 0),
    },
    abilities: nextAbilities,
  };
}
