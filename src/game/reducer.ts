import { generatePuzzle, type Puzzle } from './puzzle';

/**
 * 'playing'  – waiting for a tap
 * 'wrong'    – last tap missed; the same puzzle stays up (MVP rule: retry)
 * Lives/timer/game-over can extend this union later without reshaping the state.
 */
export type GameStatus = 'playing' | 'wrong';

export type GameState = {
  status: GameStatus;
  /** 0-based level; shown to players as level + 1. */
  level: number;
  score: number;
  puzzle: Puzzle;
  /** Index of the last wrong tap, so the UI can shake that tile. */
  wrongIndex: number | null;
  /** Bumps on each wrong tap so repeated misses on the same tile re-trigger feedback. */
  wrongCount: number;
};

export type GameAction =
  | { type: 'SELECT_TILE'; index: number; nextSeed: number }
  | { type: 'RESTART'; seed: number };

export function createInitialState(seed: number): GameState {
  return {
    status: 'playing',
    level: 0,
    score: 0,
    puzzle: generatePuzzle(0, seed),
    wrongIndex: null,
    wrongCount: 0,
  };
}

/** Pure reducer: never mutates, randomness comes in through the action's seed. */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_TILE': {
      if (action.index === state.puzzle.oddIndex) {
        const level = state.level + 1;
        return {
          ...state,
          status: 'playing',
          level,
          score: state.score + 1,
          puzzle: generatePuzzle(level, action.nextSeed),
          wrongIndex: null,
        };
      }
      return {
        ...state,
        status: 'wrong',
        wrongIndex: action.index,
        wrongCount: state.wrongCount + 1,
      };
    }
    case 'RESTART':
      return createInitialState(action.seed);
  }
}
