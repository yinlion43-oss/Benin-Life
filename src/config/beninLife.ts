/**
 * Benin Life game-design data.
 * These values are intentionally data-driven so gameplay systems can consume them
 * without hard-coding city-specific content into UI components.
 */

export const BENIN_LIFE_DISTRICTS = [
  'Aduwawa',
  'Ikpoba Hill',
  'New Benin',
  'Upper Mission',
  'Ring Road/City Centre',
  'GRA',
  'Ogida/Okhoro',
  'Sakponba',
  'Ugbowo',
  'Uselu',
  'Ekenwan',
  'Sapele Road',
  'Siluko Road',
  'Airport Road',
  'Ekae/Sapele Extension',
] as const

export const TRAITS = [
  ['💼', 'Hustler', 'Hustle grows faster; bosses notice.'],
  ['🍲', 'Foodie', 'Cooking grows faster and food is more enjoyable.'],
  ['🎉', 'Owambe Spirit', 'Party, spraying and dancing come naturally.'],
  ['💪', 'Gym Rat', 'Fitness grows faster and workouts feel better.'],
  ['😏', 'Smooth Talker', 'Charisma grows faster and social success improves.'],
  ['😴', 'Lazy Bone', 'Energy lasts longer, but work performance suffers somewhat.'],
  ['🧼', 'Clean Pikin', 'Hygiene drops more slowly.'],
  ['🌙', 'Night Crawler', 'Nightlife activities are especially enjoyable.'],
  ['💻', 'Tech Bro or Sis', 'Coding grows faster.'],
  ['🎶', 'Musical', 'Music skill grows faster.'],
] as const

export const BIG_DREAMS = [
  'Benin Big Boy/girl',
  'Benin Landlord/Landlady',
  'Benin music Star',
  "Everybody's Padi",
  'Benin Tech Pioneer',
  'Benin football Star',
] as const

export const LIFE_STATUS = ['Ajabutter', 'Ajapaco', 'Paco'] as const

export const SKILL_STARTS = {
  Cooking: 10,
  Charisma: 4,
  Fitness: 5,
  Coding: 10,
  Music: 2,
  Hustle: 7,
  Dance: 3,
  Comedy: 0,
  Photography: 0,
} as const

export const PERKS = [
  ['🍛', 'Iron Belle', 'Belle drops 25% slower.'],
  ['🚽', 'Steel Bladder', 'Bladder drops 30% slower.'],
  ['🌅', 'Early Bird', 'Energy drops 25% slower.'],
  ['🎉', 'Never Dull', 'Enjoyment drops 25% slower.'],
  ['🍯', 'Sweet Mouth', '+15% social success.'],
  ['🧃', 'Hustle Juice', '+25% work-performance gain.'],
  ['📇', 'Connected', '10% discount on Buy Mode purchases.'],
  ['🧠', 'Fast Learner', 'All skills grow 20% faster.'],
  ['🧼', 'Clean Freak', 'Hygiene drops 25% slower.'],
  ['🦋', 'Social Butterfly', 'Social drops 25% slower.'],
  ['💤', 'Power Napper', 'Sleep restores energy 30% faster.'],
  ['⚖️', 'Good Lawyer', 'Jail sentences are 25% shorter.'],
  ['💘', 'Charmer', '+15% success at flirting and romance.'],
  ['✨', 'Good Vibes', 'Good moods last 50% longer.'],
] as const

export const FEELINGS = [
  ['👑', 'Owner of the Night', 55],
  ['👑', 'Odogwu Mode', 40],
  ['🍾', 'Dorime!', 35],
  ['🔑', 'New Whip!', 30],
  ['💘', 'In Love', 25],
  ['🍾', 'Hit the VIP Section', 20],
  ['🍛', 'Party Jollof', 20],
  ['🏡', 'Fine House', 18],
  ['👑', 'Slept Like an Oba', 15],
  ['😎', 'Big Boy Ride', 15],
  ['🤤', 'Belle Full', 15],
  ['🧑🏾‍✈️', 'Chauffeur-Driven', 12],
  ['✨', 'Fresh & Clean', 10],
  ['🥂', 'Soft Life', 10],
  ['🛡️', 'Well Guarded', 6],
  ['💻', 'Yahoo Boy', 50],
] as const

export const BENIN_LIFE = {
  city: 'Benin City',
  country: 'Nigeria',
  state: 'Edo',
  timezone: 'Africa/Lagos',
  currency: 'NGN',
  tagline: 'Your Life Creates Your Story.',
  districts: BENIN_LIFE_DISTRICTS,
} as const
