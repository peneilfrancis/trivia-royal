import { Game, Card, Session } from '../types';

const GAMES_KEY = 'TRIVIA_ROYALE_GAMES';
const DRAFT_KEY = 'TRIVIA_ROYALE_DRAFT';
const SESSION_KEY = 'TRIVIA_ROYALE_SESSION';

export function listGames(): Game[] {
  try {
    const raw = localStorage.getItem(GAMES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to list games from localStorage', err);
    return [];
  }
}

export function getGame(id: string): Game | undefined {
  const games = listGames();
  return games.find((g) => g.id === id);
}

export function saveGame(game: Game): { success: boolean; error?: string } {
  try {
    const games = listGames();
    const existingIndex = games.findIndex((g) => g.id === game.id);
    if (existingIndex >= 0) {
      games[existingIndex] = { ...game, updatedAt: Date.now() };
    } else {
      games.push({ ...game, updatedAt: Date.now() });
    }
    localStorage.setItem(GAMES_KEY, JSON.stringify(games));
    return { success: true };
  } catch (err: unknown) {
    console.error('Failed to save game', err);
    return {
      success: false,
      error: (err as Error)?.name === 'QuotaExceededError'
        ? 'Storage is full! Please compress images or delete older games.'
        : 'Failed to save game.',
    };
  }
}

export function deleteGame(id: string): boolean {
  try {
    const games = listGames().filter((g) => g.id !== id);
    localStorage.setItem(GAMES_KEY, JSON.stringify(games));
    return true;
  } catch (err) {
    console.error('Failed to delete game', err);
    return false;
  }
}

export function loadDraft(): Partial<Game> | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load draft', err);
    return null;
  }
}

export function saveDraft(draft: Partial<Game>): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (err) {
    console.error('Failed to save draft', err);
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (err) {
    console.error('Failed to clear draft', err);
  }
}

export function loadSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession(session: Session): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save session', err);
  }
}

export function clearSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (err) {
    console.error('Failed to clear session', err);
  }
}

// Pre-seeded demo game: Campus Quiz Night with 20 filled cards
export function seedGames(): void {
  const existing = listGames();
  if (existing.length > 0) return;

  const categories: [string, string, string, string] = [
    'Science & Nature',
    'World History',
    'Pop Culture',
    'Campus Life',
  ];

  // 4 columns x 5 rows = 20 cards
  // row 0: 100, row 1: 200, row 2: 300, row 3: 400, row 4: 500
  // index = row * 4 + col
  const sampleCards: Card[] = [
    // 100 Points
    { question: 'What is the chemical symbol for Gold?', answer: 'Au' },
    { question: 'In what year did the Titanic sink?', answer: '1912' },
    { question: 'Who is known as the King of Pop?', answer: 'Michael Jackson' },
    { question: 'What place on campus is best known for quiet study and borrowing books?', answer: 'The University Library' },

    // 200 Points
    { question: 'What is the closest planet to the Sun?', answer: 'Mercury' },
    { question: 'Who was the first President of the United States?', answer: 'George Washington' },
    { question: 'Which fictional city is protected by the superhero Batman?', answer: 'Gotham City' },
    { question: 'What is the highest academic degree normally awarded by universities?', answer: 'Doctorate (Ph.D.)' },

    // 300 Points
    { question: 'What gas do plants absorb from the atmosphere for photosynthesis?', answer: 'Carbon Dioxide (CO2)' },
    { question: 'The ancient city of Rome was built along which river?', answer: 'Tiber River' },
    { question: 'What 1994 animated Disney movie features the song "Circle of Life"?', answer: 'The Lion King' },
    { question: 'What Latin honors term denotes graduating with "highest praise"?', answer: 'Summa Cum Laude' },

    // 400 Points
    { question: 'How many bones are in the adult human body?', answer: '206' },
    { question: 'Which empire was ruled by Genghis Khan?', answer: 'The Mongol Empire' },
    { question: 'Which British band released the iconic 1969 album "Abbey Road"?', answer: 'The Beatles' },
    { question: 'What document lists all course requirements and dates given at the start of a semester?', answer: 'Syllabus' },

    // 500 Points
    { question: 'What is the rarest blood type in the human population?', answer: 'AB Negative' },
    { question: 'The Rosetta Stone was key to deciphering which ancient script?', answer: 'Egyptian Hieroglyphics' },
    { question: 'Who directed the 2010 sci-fi blockbuster "Inception"?', answer: 'Christopher Nolan' },
    { question: 'Which campus office typically handles financial aid and scholarships?', answer: 'Office of Financial Aid / Registrar' },
  ];

  const demoGame: Game = {
    id: 'demo-campus-quiz-night',
    name: 'Campus Quiz Night',
    theme: 'General Knowledge & Pop Culture',
    categories,
    cards: sampleCards,
    updatedAt: Date.now(),
  };

  saveGame(demoGame);
}
