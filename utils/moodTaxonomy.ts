// utils/moodTaxonomy.ts

export interface MoodCategory {
  name: string;
  aliases: string[];
  family: string;
  intensityLevels: {
    subtle: string;
    moderate: string;
    intense: string;
  };
}

export const MOOD_TAXONOMY: Record<string, MoodCategory> = {
  HAPPY: {
    name: 'HAPPY',
    aliases: ['Joyful', 'Uplifted', 'Cheerful', 'Elated', 'Content', 'Bright'],
    family: 'POSITIVE_ENERGY',
    intensityLevels: {
      subtle: 'peaceful joy',
      moderate: 'confident happiness',
      intense: 'euphoria'
    }
  },
  SAD: {
    name: 'SAD',
    aliases: ['Melancholic', 'Sorrowful', 'Gloomy', 'Reflective', 'Bittersweet'],
    family: 'INTROSPECTION',
    intensityLevels: {
      subtle: 'thoughtful',
      moderate: 'wistful',
      intense: 'devastated'
    }
  },
  ENERGETIC: {
    name: 'ENERGETIC',
    aliases: ['Upbeat', 'Invigorating', 'Dynamic', 'Motivational', 'Pumped'],
    family: 'POSITIVE_ENERGY',
    intensityLevels: {
      subtle: 'playful',
      moderate: 'driving',
      intense: 'explosive'
    }
  },
  CALM: {
    name: 'CALM',
    aliases: ['Peaceful', 'Serene', 'Relaxed', 'Tranquil', 'Soothing'],
    family: 'INTROSPECTION',
    intensityLevels: {
      subtle: 'focused',
      moderate: 'relaxed',
      intense: 'meditative'
    }
  },
  ROMANTIC: {
    name: 'ROMANTIC',
    aliases: ['Sensual', 'Intimate', 'Tender', 'Passionate', 'Affectionate'],
    family: 'EMOTIONAL_DEPTH',
    intensityLevels: {
      subtle: 'flirty',
      moderate: 'loving',
      intense: 'passionate'
    }
  },
  AGGRESSIVE: {
    name: 'AGGRESSIVE',
    aliases: ['Intense', 'Powerful', 'Raw', 'Edgy', 'Provocative'],
    family: 'POSITIVE_ENERGY',
    intensityLevels: {
      subtle: 'assertive',
      moderate: 'commanding',
      intense: 'overwhelming'
    }
  },
  MELANCHOLIC: {
    name: 'MELANCHOLIC',
    aliases: ['Wistful', 'Nostalgia', 'Yearning', 'Longing', 'Contemplative'],
    family: 'INTROSPECTION',
    intensityLevels: {
      subtle: 'dreamy',
      moderate: 'nostalgic',
      intense: 'mournful'
    }
  },
  MYSTERIOUS: {
    name: 'MYSTERIOUS',
    aliases: ['Enigmatic', 'Dreamy', 'Haunting', 'Cryptic', 'Hypnotic'],
    family: 'EMOTIONAL_DEPTH',
    intensityLevels: {
      subtle: 'intriguing',
      moderate: 'unsettling',
      intense: 'cryptic'
    }
  }
};

export const MOOD_FAMILIES = {
  POSITIVE_ENERGY: ['HAPPY', 'ENERGETIC', 'AGGRESSIVE'],
  INTROSPECTION: ['SAD', 'CALM', 'MELANCHOLIC'],
  EMOTIONAL_DEPTH: ['ROMANTIC', 'MYSTERIOUS']
};
