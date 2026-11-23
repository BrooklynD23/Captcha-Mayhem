import { useCallback, useReducer } from 'react';

import { createInitialState, gameReducer } from '@/game/reducer';
import { randomSeed } from '@/game/rng';

/**
 * Owns the game state (L5: state lives in the parent, children get callbacks).
 * Components read `state` and call `selectTile` / `restart`; they never mutate anything.
 */
export function useOddColorGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () =>
    createInitialState(randomSeed()),
  );

  const selectTile = useCallback(
    (index: number) => dispatch({ type: 'SELECT_TILE', index, nextSeed: randomSeed() }),
    [],
  );

  const restart = useCallback(() => dispatch({ type: 'RESTART', seed: randomSeed() }), []);

  return { state, selectTile, restart };
}
