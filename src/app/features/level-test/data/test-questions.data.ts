import { VocabQuestion, GrammarQuestion, ListeningQuestion, PronunciationQuestion } from '../models/level-test.model';

export const TEST_VOCABULARY: VocabQuestion[] = [
  { es: 'casa', answer: 'house', level: 'a1' },
  { es: 'comer', answer: 'eat', level: 'a1' },
  { es: 'agua', answer: 'water', level: 'a1' },
  { es: 'trabajar', answer: 'work', level: 'a1' },
  { es: 'cita / reunion', answer: 'appointment', alts: ['meeting'], level: 'a2' },
  { es: 'comodo', answer: 'comfortable', level: 'a2' },
  { es: 'disponible', answer: 'available', level: 'a2' },
  { es: 'intentar', answer: 'try', alts: ['attempt'], level: 'a2' },
  { es: 'lograr / conseguir', answer: 'achieve', alts: ['accomplish', 'reach'], level: 'b1' },
  { es: 'fiable / de confianza', answer: 'reliable', alts: ['trustworthy'], level: 'b1' },
  { es: 'mejorar', answer: 'improve', alts: ['enhance'], level: 'b1' },
  { es: 'consejo', answer: 'advice', alts: ['tip'], level: 'b1' },
  { es: 'a fondo / completamente', answer: 'thoroughly', alts: ['completely'], level: 'b2' },
  { es: 'abrumador', answer: 'overwhelming', level: 'b2' },
  { es: 'despreciar / menospreciar', answer: 'despise', alts: ['scorn', 'disdain'], level: 'b2' },
  { es: 'resiliencia', answer: 'resilience', level: 'b2' },
  { es: 'perspicaz / astuto', answer: 'shrewd', alts: ['insightful', 'perceptive'], level: 'c1' },
  { es: 'ambiguo', answer: 'ambiguous', level: 'c1' },
  { es: 'efimero / pasajero', answer: 'ephemeral', alts: ['fleeting', 'transient'], level: 'c1' },
  { es: 'menoscabar / socavar', answer: 'undermine', alts: ['undercut'], level: 'c1' },
];

export const TEST_GRAMMAR: GrammarQuestion[] = [
  { sentence: 'She ___ to school every day.', options: ['go', 'goes', 'going', 'gone'], answer: 1, level: 'a1' },
  { sentence: 'I ___ a movie yesterday.', options: ['watch', 'watching', 'watched', 'watches'], answer: 2, level: 'a1' },
  { sentence: 'I saw ___ elephant at the zoo.', options: ['a', 'an', 'the', '-'], answer: 1, level: 'a1' },
  { sentence: 'London is ___ than Madrid.', options: ['big', 'bigger', 'biggest', 'more big'], answer: 1, level: 'a2' },
  { sentence: 'They ___ lunch right now.', options: ['have', 'has', 'are having', 'having'], answer: 2, level: 'a2' },
  { sentence: 'I have ___ finished my homework.', options: ['yet', 'already', 'just', 'since'], answer: 2, level: 'a2' },
  { sentence: 'I ___ to London three times.', options: ['have been', 'was', 'have gone', 'went'], answer: 0, level: 'b1' },
  { sentence: 'If I ___ rich, I would travel the world.', options: ['am', 'was', 'were', 'be'], answer: 2, level: 'b1' },
  { sentence: 'The book ___ by millions of people.', options: ['has read', 'has been read', 'have read', 'is reading'], answer: 1, level: 'b1' },
  { sentence: 'If she ___ harder, she would have passed.', options: ['studied', 'had studied', 'has studied', 'studies'], answer: 1, level: 'b2' },
  { sentence: 'He said he ___ the answer.', options: ['knows', 'knew', 'has known', 'is knowing'], answer: 1, level: 'b2' },
  { sentence: '___ the work, she went home.', options: ['Finished', 'Having finished', 'To finish', 'She finished'], answer: 1, level: 'b2' },
  { sentence: '___ had I arrived than the meeting started.', options: ['No sooner', 'Hardly', 'Barely', 'Scarcely'], answer: 0, level: 'c1' },
  { sentence: 'I suggest that he ___ the report before Friday.', options: ['submits', 'submit', 'submitted', 'will submit'], answer: 1, level: 'c1' },
  { sentence: 'The ___ of the new policy caused widespread debate.', options: ['implement', 'implementing', 'implementation', 'implemented'], answer: 2, level: 'c1' },
];

export const TEST_LISTENING: ListeningQuestion[] = [
  { text: 'I would like a glass of water, please.', level: 'a1', speed: 0.8 },
  { text: 'Can you help me find the station?', level: 'a1', speed: 0.8 },
  { text: 'What time does the train leave tomorrow morning?', level: 'a2', speed: 0.9 },
  { text: "I've been waiting here for about twenty minutes.", level: 'a2', speed: 0.9 },
  { text: "I'm gonna go to the store. Do you wanna come?", level: 'b1', speed: 1.0 },
  { text: 'She should have told him about it earlier.', level: 'b1', speed: 1.0 },
  { text: "I wouldn't have bothered if I'd known it was gonna be cancelled.", level: 'b2', speed: 1.1 },
  { text: "The thing is, he's not exactly what you'd call reliable, is he?", level: 'b2', speed: 1.1 },
  { text: "Had I known about the redundancies, I wouldn't have taken the position in the first place.", level: 'c1', speed: 1.2 },
  { text: "She reckons they'll have sorted it out by the time we get there, but I wouldn't count on it.", level: 'c1', speed: 1.2 },
];

export const TEST_PRONUNCIATION: PronunciationQuestion[] = [
  { word: 'think', options: ['think', 'tink', 'sink'], answer: 0, level: 'a1' },
  { word: 'very', options: ['very', 'berry', 'ferry'], answer: 0, level: 'a1' },
  { word: 'ship', options: ['ship', 'sheep', 'chip'], answer: 0, level: 'a2' },
  { word: 'cat', options: ['cat', 'cut', 'cart'], answer: 0, level: 'a2' },
  { word: 'comfortable', options: ['3 silabas', '4 silabas', '2 silabas'], answer: 0, level: 'b1', special: 'syllables' },
  { word: "I'm gonna go", options: ['3 palabras', '4 palabras', '5 palabras'], answer: 0, level: 'b1', special: 'words' },
  { word: 'I SAID Tuesday, not Thursday', options: ['I', 'SAID', 'Tuesday'], answer: 2, level: 'b2', special: 'stress' },
  { word: 'turn it off', options: ['3 palabras', '2 palabras', '4 palabras'], answer: 0, level: 'b2', special: 'words' },
];
