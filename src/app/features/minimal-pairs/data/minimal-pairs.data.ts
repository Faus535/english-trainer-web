export interface MinimalPair {
  sound1: string;
  sound2: string;
  word1: string;
  word2: string;
  category: 'Vowels' | 'Consonants';
}

export const MINIMAL_PAIRS: MinimalPair[] = [
  // /ɪ/ vs /iː/ - ship/sheep problem
  { sound1: '/ɪ/', sound2: '/iː/', word1: 'ship', word2: 'sheep', category: 'Vowels' },
  { sound1: '/ɪ/', sound2: '/iː/', word1: 'sit', word2: 'seat', category: 'Vowels' },
  { sound1: '/ɪ/', sound2: '/iː/', word1: 'bit', word2: 'beat', category: 'Vowels' },
  { sound1: '/ɪ/', sound2: '/iː/', word1: 'hit', word2: 'heat', category: 'Vowels' },
  { sound1: '/ɪ/', sound2: '/iː/', word1: 'fill', word2: 'feel', category: 'Vowels' },
  // /v/ vs /b/
  { sound1: '/v/', sound2: '/b/', word1: 'van', word2: 'ban', category: 'Consonants' },
  { sound1: '/v/', sound2: '/b/', word1: 'vest', word2: 'best', category: 'Consonants' },
  { sound1: '/v/', sound2: '/b/', word1: 'vine', word2: 'bine', category: 'Consonants' },
  { sound1: '/v/', sound2: '/b/', word1: 'vote', word2: 'boat', category: 'Consonants' },
  { sound1: '/v/', sound2: '/b/', word1: 'very', word2: 'berry', category: 'Consonants' },
  // /θ/ vs /t/
  { sound1: '/θ/', sound2: '/t/', word1: 'think', word2: 'tink', category: 'Consonants' },
  { sound1: '/θ/', sound2: '/t/', word1: 'three', word2: 'tree', category: 'Consonants' },
  { sound1: '/θ/', sound2: '/t/', word1: 'thin', word2: 'tin', category: 'Consonants' },
  { sound1: '/θ/', sound2: '/t/', word1: 'thought', word2: 'taught', category: 'Consonants' },
  { sound1: '/θ/', sound2: '/t/', word1: 'thank', word2: 'tank', category: 'Consonants' },
  // /ð/ vs /d/
  { sound1: '/ð/', sound2: '/d/', word1: 'they', word2: 'day', category: 'Consonants' },
  { sound1: '/ð/', sound2: '/d/', word1: 'then', word2: 'den', category: 'Consonants' },
  { sound1: '/ð/', sound2: '/d/', word1: 'those', word2: 'dose', category: 'Consonants' },
  // /æ/ vs /ʌ/
  { sound1: '/æ/', sound2: '/ʌ/', word1: 'cat', word2: 'cut', category: 'Vowels' },
  { sound1: '/æ/', sound2: '/ʌ/', word1: 'bat', word2: 'but', category: 'Vowels' },
  { sound1: '/æ/', sound2: '/ʌ/', word1: 'cap', word2: 'cup', category: 'Vowels' },
  { sound1: '/æ/', sound2: '/ʌ/', word1: 'ran', word2: 'run', category: 'Vowels' },
  { sound1: '/æ/', sound2: '/ʌ/', word1: 'bag', word2: 'bug', category: 'Vowels' },
  // /ʃ/ vs /tʃ/
  { sound1: '/ʃ/', sound2: '/tʃ/', word1: 'shop', word2: 'chop', category: 'Consonants' },
  { sound1: '/ʃ/', sound2: '/tʃ/', word1: 'share', word2: 'chair', category: 'Consonants' },
  { sound1: '/ʃ/', sound2: '/tʃ/', word1: 'ship', word2: 'chip', category: 'Consonants' },
  { sound1: '/ʃ/', sound2: '/tʃ/', word1: 'sheet', word2: 'cheat', category: 'Consonants' },
  { sound1: '/ʃ/', sound2: '/tʃ/', word1: 'shore', word2: 'chore', category: 'Consonants' },
];
