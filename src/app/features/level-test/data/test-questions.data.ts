import {
  VocabQuestion,
  GrammarQuestion,
  ListeningQuestion,
  PronunciationQuestion,
} from '../models/level-test.model';

export const TEST_VOCABULARY: VocabQuestion[] = [
  // A1 — concrete nouns, basic verbs (top 300)
  { es: 'casa', answer: 'house', level: 'a1' },
  { es: 'comer', answer: 'eat', level: 'a1' },
  { es: 'agua', answer: 'water', level: 'a1' },
  { es: 'trabajar', answer: 'work', level: 'a1' },
  { es: 'gato', answer: 'cat', level: 'a1' },
  { es: 'libro', answer: 'book', level: 'a1' },
  { es: 'dormir', answer: 'sleep', level: 'a1' },
  { es: 'grande', answer: 'big', alts: ['large'], level: 'a1' },

  // A2 — everyday situations (300-800)
  { es: 'cita / reunion', answer: 'appointment', alts: ['meeting'], level: 'a2' },
  { es: 'comodo', answer: 'comfortable', level: 'a2' },
  { es: 'disponible', answer: 'available', level: 'a2' },
  { es: 'intentar', answer: 'try', alts: ['attempt'], level: 'a2' },
  { es: 'peligroso', answer: 'dangerous', level: 'a2' },
  { es: 'vecino', answer: 'neighbour', alts: ['neighbor'], level: 'a2' },
  { es: 'barato', answer: 'cheap', alts: ['inexpensive'], level: 'a2' },
  { es: 'compartir', answer: 'share', level: 'a2' },

  // B1 — opinions, abstract-but-common (800-1500)
  { es: 'lograr / conseguir', answer: 'achieve', alts: ['accomplish', 'reach'], level: 'b1' },
  { es: 'fiable / de confianza', answer: 'reliable', alts: ['trustworthy'], level: 'b1' },
  { es: 'mejorar', answer: 'improve', alts: ['enhance'], level: 'b1' },
  { es: 'consejo', answer: 'advice', alts: ['tip'], level: 'b1' },
  { es: 'oportunidad', answer: 'opportunity', alts: ['chance'], level: 'b1' },
  { es: 'comportamiento', answer: 'behaviour', alts: ['behavior'], level: 'b1' },
  { es: 'exigir / demandar', answer: 'demand', alts: ['require'], level: 'b1' },
  { es: 'beneficio', answer: 'benefit', alts: ['advantage'], level: 'b1' },

  // B2 — academic-adjacent, collocations (1500-2500)
  { es: 'a fondo / completamente', answer: 'thoroughly', alts: ['completely'], level: 'b2' },
  { es: 'abrumador', answer: 'overwhelming', level: 'b2' },
  { es: 'despreciar / menospreciar', answer: 'despise', alts: ['scorn', 'disdain'], level: 'b2' },
  { es: 'resiliencia', answer: 'resilience', level: 'b2' },
  { es: 'sutil', answer: 'subtle', level: 'b2' },
  { es: 'reacio', answer: 'reluctant', alts: ['unwilling'], level: 'b2' },
  { es: 'reconocer / admitir', answer: 'acknowledge', alts: ['admit', 'recognize'], level: 'b2' },
  { es: 'inevitable', answer: 'inevitable', alts: ['unavoidable'], level: 'b2' },

  // C1 — academic word list, nuanced synonyms (2500-3000+)
  { es: 'perspicaz / astuto', answer: 'shrewd', alts: ['insightful', 'perceptive'], level: 'c1' },
  { es: 'ambiguo', answer: 'ambiguous', level: 'c1' },
  { es: 'efimero / pasajero', answer: 'ephemeral', alts: ['fleeting', 'transient'], level: 'c1' },
  { es: 'menoscabar / socavar', answer: 'undermine', alts: ['undercut'], level: 'c1' },
  { es: 'pragmatico', answer: 'pragmatic', alts: ['practical'], level: 'c1' },
  { es: 'meticuloso', answer: 'meticulous', alts: ['thorough'], level: 'c1' },
  { es: 'sin precedentes', answer: 'unprecedented', level: 'c1' },
  { es: 'elocuente', answer: 'eloquent', alts: ['articulate'], level: 'c1' },

  // C2 — low-frequency, literary, domain-specific
  { es: 'ubicuo / omnipresente', answer: 'ubiquitous', alts: ['omnipresent'], level: 'c2' },
  { es: 'exacerbar / agravar', answer: 'exacerbate', alts: ['aggravate', 'worsen'], level: 'c2' },
  { es: 'yuxtaponer', answer: 'juxtapose', level: 'c2' },
  {
    es: 'obsequioso / servil',
    answer: 'obsequious',
    alts: ['sycophantic', 'servile'],
    level: 'c2',
  },
  { es: 'enrevesado / intrincado', answer: 'convoluted', alts: ['intricate'], level: 'c2' },
  {
    es: 'efervescente (personalidad)',
    answer: 'effervescent',
    alts: ['vivacious', 'ebullient'],
    level: 'c2',
  },
  {
    es: 'perspicacia / sagacidad',
    answer: 'acumen',
    alts: ['sagacity', 'shrewdness'],
    level: 'c2',
  },
  {
    es: 'aquiescencia / conformidad',
    answer: 'acquiescence',
    alts: ['compliance', 'assent'],
    level: 'c2',
  },
];

export const TEST_GRAMMAR: GrammarQuestion[] = [
  // A1 — present simple, articles, basic plurals
  {
    sentence: 'She ___ to school every day.',
    options: ['go', 'goes', 'going', 'gone'],
    answer: 1,
    level: 'a1',
  },
  {
    sentence: 'I ___ a movie yesterday.',
    options: ['watch', 'watching', 'watched', 'watches'],
    answer: 2,
    level: 'a1',
  },
  {
    sentence: 'I saw ___ elephant at the zoo.',
    options: ['a', 'an', 'the', '-'],
    answer: 1,
    level: 'a1',
  },
  {
    sentence: 'They ___ three children.',
    options: ['has', 'have', 'having', 'haves'],
    answer: 1,
    level: 'a1',
  },
  {
    sentence: 'My sister ___ in London.',
    options: ['live', 'lives', 'living', 'is live'],
    answer: 1,
    level: 'a1',
  },
  {
    sentence: 'I ___ coffee every morning.',
    options: ['drinks', 'drink', 'drinking', 'drinked'],
    answer: 1,
    level: 'a1',
  },
  {
    sentence: 'There ___ two cats on the sofa.',
    options: ['is', 'are', 'be', 'was'],
    answer: 1,
    level: 'a1',
  },
  { sentence: '___ you like pizza?', options: ['Are', 'Do', 'Is', 'Does'], answer: 1, level: 'a1' },

  // A2 — past simple, comparatives, going to, prepositions
  {
    sentence: 'London is ___ than Madrid.',
    options: ['big', 'bigger', 'biggest', 'more big'],
    answer: 1,
    level: 'a2',
  },
  {
    sentence: 'They ___ lunch right now.',
    options: ['have', 'has', 'are having', 'having'],
    answer: 2,
    level: 'a2',
  },
  {
    sentence: 'I have ___ finished my homework.',
    options: ['yet', 'already', 'just', 'since'],
    answer: 1,
    level: 'a2',
  },
  {
    sentence: 'She arrived ___ Monday morning.',
    options: ['in', 'at', 'on', 'to'],
    answer: 2,
    level: 'a2',
  },
  {
    sentence: 'We ___ going to visit Paris next summer.',
    options: ['is', 'am', 'are', 'be'],
    answer: 2,
    level: 'a2',
  },
  {
    sentence: 'This is the ___ film I have ever seen.',
    options: ['good', 'better', 'best', 'most good'],
    answer: 2,
    level: 'a2',
  },
  {
    sentence: 'I ___ play tennis when I was young.',
    options: ['use to', 'used to', 'use', 'was used'],
    answer: 1,
    level: 'a2',
  },
  {
    sentence: 'How ___ rice do we need?',
    options: ['many', 'much', 'lot', 'few'],
    answer: 1,
    level: 'a2',
  },

  // B1 — present perfect, conditionals, relative clauses, modals
  {
    sentence: 'I ___ to London three times.',
    options: ['have been', 'was', 'have gone', 'went'],
    answer: 0,
    level: 'b1',
  },
  {
    sentence: 'If I ___ rich, I would travel the world.',
    options: ['am', 'was', 'were', 'be'],
    answer: 2,
    level: 'b1',
  },
  {
    sentence: 'The book ___ by millions of people.',
    options: ['has read', 'has been read', 'have read', 'is reading'],
    answer: 1,
    level: 'b1',
  },
  {
    sentence: 'That is the woman ___ lives next door.',
    options: ['which', 'who', 'whom', 'whose'],
    answer: 1,
    level: 'b1',
  },
  {
    sentence: 'He ___ be at home. His car is there.',
    options: ['can', 'must', 'should', 'would'],
    answer: 1,
    level: 'b1',
  },
  {
    sentence: 'I enjoy ___ in the mountains.',
    options: ['hike', 'to hike', 'hiking', 'hiked'],
    answer: 2,
    level: 'b1',
  },
  {
    sentence: 'She asked me ___ I could help.',
    options: ['that', 'if', 'what', 'which'],
    answer: 1,
    level: 'b1',
  },
  {
    sentence: 'I wish I ___ speak French fluently.',
    options: ['can', 'could', 'would', 'will'],
    answer: 1,
    level: 'b1',
  },

  // B2 — passive, third conditional, reported speech, inversions
  {
    sentence: 'If she ___ harder, she would have passed.',
    options: ['studied', 'had studied', 'has studied', 'studies'],
    answer: 1,
    level: 'b2',
  },
  {
    sentence: 'He said he ___ the answer.',
    options: ['knows', 'knew', 'has known', 'is knowing'],
    answer: 1,
    level: 'b2',
  },
  {
    sentence: '___ the work, she went home.',
    options: ['Finished', 'Having finished', 'To finish', 'She finished'],
    answer: 1,
    level: 'b2',
  },
  {
    sentence: 'The letter ___ by the time I arrived.',
    options: ['has been sent', 'had been sent', 'was sending', 'is sent'],
    answer: 1,
    level: 'b2',
  },
  {
    sentence: 'I wish I ___ accepted that job offer.',
    options: ['have', 'had', 'would', 'could'],
    answer: 1,
    level: 'b2',
  },
  {
    sentence: 'She denied ___ the window.',
    options: ['to break', 'breaking', 'broke', 'break'],
    answer: 1,
    level: 'b2',
  },
  {
    sentence: 'Not until I read it again ___ I understand the meaning.',
    options: ['do', 'did', 'was', 'had'],
    answer: 1,
    level: 'b2',
  },
  {
    sentence: 'He had his car ___ last week.',
    options: ['repair', 'repaired', 'repairing', 'to repair'],
    answer: 1,
    level: 'b2',
  },

  // C1 — mixed conditionals, subjunctive, participle clauses, cleft
  {
    sentence: '___ had I arrived than the meeting started.',
    options: ['No sooner', 'Hardly', 'Barely', 'Scarcely'],
    answer: 0,
    level: 'c1',
  },
  {
    sentence: 'I suggest that he ___ the report before Friday.',
    options: ['submits', 'submit', 'submitted', 'will submit'],
    answer: 1,
    level: 'c1',
  },
  {
    sentence: 'The ___ of the new policy caused widespread debate.',
    options: ['implement', 'implementing', 'implementation', 'implemented'],
    answer: 2,
    level: 'c1',
  },
  {
    sentence: 'If I had studied medicine, I ___ a doctor now.',
    options: ['would be', 'will be', 'am', 'had been'],
    answer: 0,
    level: 'c1',
  },
  {
    sentence: 'What ___ me most was the complexity of the situation.',
    options: ['struck', 'strikes', 'has struck', 'was striking'],
    answer: 0,
    level: 'c1',
  },
  {
    sentence: 'It is essential that every student ___ the deadline.',
    options: ['meets', 'meet', 'will meet', 'meeting'],
    answer: 1,
    level: 'c1',
  },
  {
    sentence: 'Rarely ___ such a compelling argument been made.',
    options: ['does', 'has', 'is', 'was'],
    answer: 1,
    level: 'c1',
  },
  {
    sentence: '___ as it may seem, the evidence is irrefutable.',
    options: ['Strange', 'Strangely', 'Stranger', 'Strangest'],
    answer: 0,
    level: 'c1',
  },

  // C2 — register, pragmatics, ellipsis, nuance
  {
    sentence: 'She is, ___, the most qualified candidate for the position.',
    options: ['by all accounts', 'in all events', 'by all means', 'at all costs'],
    answer: 0,
    level: 'c2',
  },
  {
    sentence: 'The proposal was accepted, albeit ___.',
    options: ['reluctant', 'reluctance', 'reluctantly', 'being reluctant'],
    answer: 2,
    level: 'c2',
  },
  {
    sentence: '___ to popular belief, the study found no significant correlation.',
    options: ['Contrary', 'Against', 'Despite', 'Opposing'],
    answer: 0,
    level: 'c2',
  },
  {
    sentence: 'The findings, ___ tentative, merit further investigation.',
    options: ['however', 'albeit', 'though', 'while'],
    answer: 2,
    level: 'c2',
  },
  {
    sentence: 'Were the committee to ___ the amendment, the consequences would be far-reaching.',
    options: ['adopt', 'have adopted', 'adopting', 'adopted'],
    answer: 0,
    level: 'c2',
  },
  {
    sentence: 'Her prose style is characterised by a ___ of wit and erudition.',
    options: ['blend', 'blending', 'blended', 'to blend'],
    answer: 0,
    level: 'c2',
  },
  {
    sentence: 'He spoke as though he ___ privy to information that the rest of us lacked.',
    options: ['is', 'was', 'were', 'had been'],
    answer: 2,
    level: 'c2',
  },
  {
    sentence: 'The more ___ the argument, the less convincing it appeared.',
    options: ['elaborate', 'elaborated', 'elaborating', 'elaborately'],
    answer: 0,
    level: 'c2',
  },
];

export const TEST_LISTENING: ListeningQuestion[] = [
  // A1 — simple sentences, slow speed
  { text: 'I would like a glass of water, please.', level: 'a1', speed: 0.8 },
  { text: 'Can you help me find the station?', level: 'a1', speed: 0.8 },
  { text: 'My name is Anna and I am from Spain.', level: 'a1', speed: 0.8 },
  { text: 'The cat is sleeping on the sofa.', level: 'a1', speed: 0.8 },
  { text: 'I have two brothers and one sister.', level: 'a1', speed: 0.8 },
  { text: 'She goes to school every morning.', level: 'a1', speed: 0.8 },

  // A2 — everyday, past/future
  { text: 'What time does the train leave tomorrow morning?', level: 'a2', speed: 0.9 },
  { text: "I've been waiting here for about twenty minutes.", level: 'a2', speed: 0.9 },
  { text: 'I used to play football when I was younger.', level: 'a2', speed: 0.9 },
  { text: 'They are going to visit their grandparents next weekend.', level: 'a2', speed: 0.9 },
  { text: 'Could you tell me where the nearest bank is?', level: 'a2', speed: 0.9 },
  { text: 'I need to finish this report by Friday.', level: 'a2', speed: 0.9 },

  // B1 — varied tenses, contractions, informal
  { text: "I'm gonna go to the store. Do you wanna come?", level: 'b1', speed: 1.0 },
  { text: 'She should have told him about it earlier.', level: 'b1', speed: 1.0 },
  { text: 'If I had more time, I would learn to play the piano.', level: 'b1', speed: 1.0 },
  { text: 'The meeting has been postponed until next Thursday.', level: 'b1', speed: 1.0 },
  { text: 'Despite the rain, they decided to go for a walk.', level: 'b1', speed: 1.0 },
  { text: 'By the time we arrived, the concert had already started.', level: 'b1', speed: 1.0 },

  // B2 — complex clauses, idioms, connected speech
  {
    text: "I wouldn't have bothered if I'd known it was gonna be cancelled.",
    level: 'b2',
    speed: 1.1,
  },
  {
    text: "The thing is, he's not exactly what you'd call reliable, is he?",
    level: 'b2',
    speed: 1.1,
  },
  {
    text: 'Had I been informed earlier, I could have made alternative arrangements.',
    level: 'b2',
    speed: 1.1,
  },
  {
    text: "It's not so much that I disagree, but rather that I see it differently.",
    level: 'b2',
    speed: 1.1,
  },
  {
    text: 'The proposal was met with considerable scepticism by the board members.',
    level: 'b2',
    speed: 1.1,
  },
  {
    text: 'What struck me most was the sheer complexity of the whole situation.',
    level: 'b2',
    speed: 1.1,
  },

  // C1 — academic language, subordinate clauses
  {
    text: "Had I known about the redundancies, I wouldn't have taken the position.",
    level: 'c1',
    speed: 1.2,
  },
  {
    text: "She reckons they'll have sorted it out by the time we get there, but I wouldn't count on it.",
    level: 'c1',
    speed: 1.2,
  },
  {
    text: 'Not only did they fail to deliver on time, but they also had the audacity to charge extra.',
    level: 'c1',
    speed: 1.2,
  },
  {
    text: 'The underlying assumption, which has yet to be empirically validated, is that correlation implies causation.',
    level: 'c1',
    speed: 1.15,
  },
  {
    text: 'Notwithstanding the obvious limitations of the study, the findings are broadly consistent with previous research.',
    level: 'c1',
    speed: 1.15,
  },
  {
    text: 'The ramifications of this policy shift are likely to be felt across multiple sectors for years to come.',
    level: 'c1',
    speed: 1.15,
  },

  // C2 — dense native speech, fast
  {
    text: "I mean, it's not as though anyone could've foreseen the extent to which things would unravel.",
    level: 'c2',
    speed: 1.25,
  },
  {
    text: "The juxtaposition of her pragmatism and his idealism made for a rather volatile working relationship, wouldn't you say?",
    level: 'c2',
    speed: 1.25,
  },
  {
    text: "In retrospect, the committee's decision to acquiesce was predicated on a fundamentally flawed premise.",
    level: 'c2',
    speed: 1.2,
  },
  {
    text: "What's particularly galling is the sheer brazenness with which they've attempted to obfuscate the findings.",
    level: 'c2',
    speed: 1.25,
  },
  {
    text: 'The epistemological implications of this paradigm shift cannot be overstated, notwithstanding the methodological caveats.',
    level: 'c2',
    speed: 1.2,
  },
  {
    text: "She's got this uncanny knack for cutting through the waffle and getting straight to the crux of the matter.",
    level: 'c2',
    speed: 1.25,
  },
];

export const TEST_PRONUNCIATION: PronunciationQuestion[] = [
  // A1 — basic sound discrimination
  { word: 'think', options: ['think', 'tink', 'sink'], answer: 0, level: 'a1' },
  { word: 'very', options: ['very', 'berry', 'ferry'], answer: 0, level: 'a1' },
  { word: 'house', options: ['/haʊs/', '/hɒs/', '/huːs/'], answer: 0, level: 'a1' },
  { word: 'ship', options: ['/ʃɪp/', '/ʃiːp/', '/tʃɪp/'], answer: 0, level: 'a1' },
  { word: 'cat', options: ['/kæt/', '/kʌt/', '/kɑːt/'], answer: 0, level: 'a1' },
  { word: 'three', options: ['/θriː/', '/triː/', '/friː/'], answer: 0, level: 'a1' },

  // A2 — vowel distinctions, word stress
  { word: 'ship', options: ['ship', 'sheep', 'chip'], answer: 0, level: 'a2' },
  { word: 'cat', options: ['cat', 'cut', 'cart'], answer: 0, level: 'a2' },
  {
    word: 'desert',
    options: ['1st syllable', '2nd syllable', 'Equal'],
    answer: 0,
    level: 'a2',
    special: 'stress',
  },
  {
    word: 'photograph',
    options: ['1st syllable', '2nd syllable', '3rd syllable'],
    answer: 0,
    level: 'a2',
    special: 'stress',
  },
  {
    word: 'full / fool',
    options: ['Same vowel', 'Short vs long', 'Different consonant'],
    answer: 1,
    level: 'a2',
  },
  {
    word: 'van / ban',
    options: ['Same sound', '/v/ vs /b/', 'Regional variant'],
    answer: 1,
    level: 'a2',
  },

  // B1 — syllable count, connected speech
  {
    word: 'comfortable',
    options: ['3 syllables', '4 syllables', '2 syllables'],
    answer: 0,
    level: 'b1',
    special: 'syllables',
  },
  {
    word: "I'm gonna go",
    options: ['3 words', '4 words', '5 words'],
    answer: 0,
    level: 'b1',
    special: 'words',
  },
  {
    word: 'vegetable',
    options: ['3 syllables', '4 syllables', '2 syllables'],
    answer: 0,
    level: 'b1',
    special: 'syllables',
  },
  {
    word: 'chocolate',
    options: ['2 syllables', '3 syllables', '4 syllables'],
    answer: 0,
    level: 'b1',
    special: 'syllables',
  },
  {
    word: "would've been",
    options: ['3 words', '2 words', '4 words'],
    answer: 0,
    level: 'b1',
    special: 'words',
  },
  {
    word: 'turn it off',
    options: ['3 words', '2 words', '4 words'],
    answer: 0,
    level: 'b1',
    special: 'words',
  },

  // B2 — sentence stress, intonation
  {
    word: 'I SAID Tuesday, not Thursday',
    options: ['I', 'SAID', 'Tuesday'],
    answer: 2,
    level: 'b2',
    special: 'stress',
  },
  {
    word: 'turn it off',
    options: ['3 words', '2 words', '4 words'],
    answer: 0,
    level: 'b2',
    special: 'words',
  },
  {
    word: "SHE didn't break it",
    options: ['SHE', "didn't", 'break'],
    answer: 0,
    level: 'b2',
    special: 'stress',
  },
  {
    word: "I didn't say HE stole it",
    options: ['I', 'say', 'HE'],
    answer: 2,
    level: 'b2',
    special: 'stress',
  },
  {
    word: 'record (noun vs verb)',
    options: ['Same stress', 'Noun=1st, Verb=2nd', 'Noun=2nd, Verb=1st'],
    answer: 1,
    level: 'b2',
    special: 'stress',
  },
  {
    word: 'present (noun vs verb)',
    options: ['Noun=1st, Verb=2nd', 'Same stress', 'Noun=2nd, Verb=1st'],
    answer: 0,
    level: 'b2',
    special: 'stress',
  },

  // C1 — subtle prosody, pragmatic intonation
  {
    word: '"Nice job." (sincere vs sarcastic)',
    options: ['Rising intonation', 'Falling intonation', 'Flat + lengthened vowel'],
    answer: 2,
    level: 'c1',
    special: 'stress',
  },
  {
    word: '"Really?" (surprise vs disbelief)',
    options: ['High rise = surprise', 'Fall-rise = disbelief', 'Both are the same'],
    answer: 0,
    level: 'c1',
    special: 'stress',
  },
  {
    word: 'anemone',
    options: ['4 syllables', '3 syllables', '5 syllables'],
    answer: 0,
    level: 'c1',
    special: 'syllables',
  },
  {
    word: 'epitome',
    options: ['3 syllables', '4 syllables', '2 syllables'],
    answer: 1,
    level: 'c1',
    special: 'syllables',
  },
  {
    word: '"You could TRY being on time."',
    options: ['TRY', 'being', 'time'],
    answer: 0,
    level: 'c1',
    special: 'stress',
  },
  { word: 'subtle', options: ['/ˈsʌtəl/', '/ˈsʌbtəl/', '/ˈsjuːtəl/'], answer: 0, level: 'c1' },

  // C2 — pragmatic meaning, accent neutralization
  {
    word: '"Well, THAT went well." (ironic)',
    options: ['Stress on "well"', 'Stress on "THAT"', 'Even stress'],
    answer: 1,
    level: 'c2',
    special: 'stress',
  },
  { word: 'quinoa', options: ['/ˈkiːnwɑː/', '/kwɪˈnoʊə/', '/ˈkɪnoʊə/'], answer: 0, level: 'c2' },
  {
    word: '"I suppose you COULD say that."',
    options: ['Agreement', 'Reluctant concession', 'Enthusiastic support'],
    answer: 1,
    level: 'c2',
    special: 'stress',
  },
  {
    word: 'hyperbole',
    options: ['3 syllables', '4 syllables', '5 syllables'],
    answer: 1,
    level: 'c2',
    special: 'syllables',
  },
  {
    word: '"Oh, how LOVELY." (sarcastic)',
    options: ['Rising pitch on lovely', 'Falling pitch on lovely', 'Exaggerated rise-fall'],
    answer: 2,
    level: 'c2',
    special: 'stress',
  },
  { word: 'assuage', options: ['/əˈsweɪdʒ/', '/æˈsjuːdʒ/', '/əˈsɑːʒ/'], answer: 0, level: 'c2' },
];
