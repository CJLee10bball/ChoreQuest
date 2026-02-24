// Pre-loaded medieval-themed chores
// tier: 'daily' = red (must do today), 'weekly' = yellow (sometime this week), 'bonus' = blue (extra credit)

export const PRELOADED_CHORES = [
  // ── DAILY (Red) ──────────────────────────────────────────
  {
    id: 'pre_1',
    name: 'Set the Bedchamber',
    description: 'Make thy bed and tidy thy sleeping quarters',
    icon: '🛏️',
    tier: 'daily',
    coins: 5,
    xp: 10,
  },
  {
    id: 'pre_2',
    name: 'Vanquish the Mess',
    description: 'Pick up and put away all items left astray',
    icon: '⚔️',
    tier: 'daily',
    coins: 5,
    xp: 10,
  },
  {
    id: 'pre_3',
    name: 'Lay the Feast Table',
    description: 'Set the table for the evening banquet',
    icon: '🍽️',
    tier: 'daily',
    coins: 4,
    xp: 8,
  },
  {
    id: 'pre_4',
    name: 'Clear the Feast Table',
    description: 'Clear and wipe the table after the royal meal',
    icon: '🧹',
    tier: 'daily',
    coins: 4,
    xp: 8,
  },
  {
    id: 'pre_5',
    name: 'Feed the Beasts',
    description: 'Provide sustenance to the household creatures',
    icon: '🐾',
    tier: 'daily',
    coins: 5,
    xp: 10,
  },
  {
    id: 'pre_6',
    name: 'Fetch Water for the Realm',
    description: 'Fill water bowls and vessels throughout the keep',
    icon: '💧',
    tier: 'daily',
    coins: 3,
    xp: 6,
  },

  // ── WEEKLY (Yellow) ───────────────────────────────────────
  {
    id: 'pre_7',
    name: 'Organize the Rubble',
    description: 'Sort and tidy the toys and belongings in thy chamber',
    icon: '🗃️',
    tier: 'weekly',
    coins: 10,
    xp: 20,
  },
  {
    id: 'pre_8',
    name: 'Purge the Refuse',
    description: 'Empty the rubbish bins and carry them to the gates',
    icon: '🗑️',
    tier: 'weekly',
    coins: 8,
    xp: 15,
  },
  {
    id: 'pre_9',
    name: 'Cleanse the Royal Vestments',
    description: 'Gather and sort the laundry for washing',
    icon: '👕',
    tier: 'weekly',
    coins: 8,
    xp: 15,
  },
  {
    id: 'pre_10',
    name: 'Fold and Store the Vestments',
    description: 'Fold the clean laundry and put it away',
    icon: '🧺',
    tier: 'weekly',
    coins: 8,
    xp: 15,
  },
  {
    id: 'pre_11',
    name: 'Scrub the Great Hall',
    description: 'Vacuum or sweep the floors of the keep',
    icon: '🧽',
    tier: 'weekly',
    coins: 10,
    xp: 20,
  },
  {
    id: 'pre_12',
    name: 'Tend the Royal Grounds',
    description: 'Water the plants and tend the garden',
    icon: '🌿',
    tier: 'weekly',
    coins: 8,
    xp: 15,
  },

  // ── BONUS (Blue) ──────────────────────────────────────────
  {
    id: 'pre_13',
    name: 'Polish the Royal Carriage',
    description: 'Help wash the family carriage (car)',
    icon: '🚗',
    tier: 'bonus',
    coins: 20,
    xp: 40,
  },
  {
    id: 'pre_14',
    name: 'Conquer the Dragon\'s Den',
    description: 'Deep clean and organize the garage or storage room',
    icon: '🐉',
    tier: 'bonus',
    coins: 25,
    xp: 50,
  },
  {
    id: 'pre_15',
    name: 'Scribe the Scrolls',
    description: 'Write thank-you notes or letters to kinfolk',
    icon: '📜',
    tier: 'bonus',
    coins: 15,
    xp: 30,
  },
  {
    id: 'pre_16',
    name: 'Aid a Fellow Knight',
    description: 'Help a sibling with their quests without being asked',
    icon: '🛡️',
    tier: 'bonus',
    coins: 15,
    xp: 30,
  },
];

export const TIER_CONFIG = {
  daily: {
    label: 'Daily Decree',
    sublabel: 'Must be done today',
    color: 'chore-red',
    badge: 'bg-red-800 text-red-200',
    badgeText: '🔴 Daily',
    borderColor: '#cc3333',
  },
  weekly: {
    label: 'Weekly Quest',
    sublabel: 'Sometime this week',
    color: 'chore-yellow',
    badge: 'bg-yellow-800 text-yellow-200',
    badgeText: '🟡 Weekly',
    borderColor: '#c9a84c',
  },
  bonus: {
    label: 'Bonus Bounty',
    sublabel: 'Extra glory awaits',
    color: 'chore-blue',
    badge: 'bg-blue-900 text-blue-200',
    badgeText: '🔵 Bonus',
    borderColor: '#4a7acc',
  },
};

export function getLevelInfo(totalXp) {
  let current = LEVEL_THRESHOLDS[0];
  let next = LEVEL_THRESHOLDS[1];
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_THRESHOLDS[i].xpRequired) {
      current = LEVEL_THRESHOLDS[i];
      next = LEVEL_THRESHOLDS[i + 1] || null;
      break;
    }
  }
  const xpIntoLevel = totalXp - current.xpRequired;
  const xpForNext   = next ? next.xpRequired - current.xpRequired : 1;
  const progress    = next ? Math.min((xpIntoLevel / xpForNext) * 100, 100) : 100;
  return { current, next, xpIntoLevel, xpForNext, progress };
}

export const LEVEL_THRESHOLDS = [
  { level: 1,  title: 'Stable Squire',      xpRequired: 0,    icon: '🌱' },
  { level: 2,  title: 'Page of the Keep',   xpRequired: 100,  icon: '📜' },
  { level: 3,  title: 'Apprentice Knight',  xpRequired: 250,  icon: '🗡️' },
  { level: 4,  title: 'Knight Errant',      xpRequired: 500,  icon: '⚔️' },
  { level: 5,  title: 'Sworn Knight',       xpRequired: 900,  icon: '🛡️' },
  { level: 6,  title: 'Knight Commander',   xpRequired: 1400, icon: '🏰' },
  { level: 7,  title: 'Champion of Realm',  xpRequired: 2000, icon: '👑' },
  { level: 8,  title: 'Dragon Slayer',      xpRequired: 2700, icon: '🐉' },
  { level: 9,  title: 'Royal Guardian',     xpRequired: 3600, icon: '⚡' },
  { level: 10, title: 'Legendary Hero',     xpRequired: 5000, icon: '🌟' },
];

export const AVATARS = [
  { id: 'knight',   label: 'Knight',   emoji: '⚔️',  description: 'A brave warrior' },
  { id: 'princess', label: 'Princess', emoji: '👸',  description: 'A noble ruler' },
  { id: 'wizard',   label: 'Wizard',   emoji: '🧙',  description: 'A wise sorcerer' },
  { id: 'archer',   label: 'Archer',   emoji: '🏹',  description: 'A swift ranger' },
];
