export const deckIconNames = [
  'book-open', // General knowledge, textbooks
  'brain', // Psychology, cognitive science, neuroscience
  'code', // Programming, software development
  'flask', // Chemistry, laboratory sciences
  'dna', // Biology, genetics, life sciences
  'atom', // Physics, quantum mechanics
  'calculator', // Mathematics, statistics
  'globe', // Geography, world studies
  'landmark', // History, historical events
  'scale', // Law, justice, legal studies
  'briefcase', // Business, management, economics
  'palette', // Art, design, creativity
  'music', // Music theory, composition
  'language', // Linguistics, language learning
  'heart', // Medicine, healthcare, anatomy
  'cpu', // Computer science, hardware
  'database', // Data science, databases
  'chart', // Statistics, analytics, data visualization
  'rocket', // Space, astronomy, aerospace
  'leaf', // Environmental science, ecology
  'microscope', // Research, scientific method
  'book', // Literature, reading
  'theater', // Drama, performing arts
  'gamepad', // Game design, interactive media
  'clock', // User for pending
] as const;

export type DeckIconName = (typeof deckIconNames)[number];
