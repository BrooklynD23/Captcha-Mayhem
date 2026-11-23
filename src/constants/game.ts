/**
 * Tunable values for the Odd-Color Out game.
 * Keep every gameplay "magic number" here so balancing never means hunting through components.
 */

/** Grid sizes as [rows, cols], easiest first. The last entry is the cap. */
export const GRID_STEPS: readonly (readonly [rows: number, cols: number])[] = [
  [2, 2],
  [2, 3],
  [3, 3],
  [3, 4],
  [4, 4],
  [4, 5],
  [5, 5],
  [5, 6],
  [6, 6],
];

/** Correct answers needed before the grid grows one step. */
export const ROUNDS_PER_STEP = 2;

/**
 * Difficulty curve, in OKLab distance (ΔE) between the base and odd colors:
 * deltaE(level) = max(MIN_DELTA_E, START_DELTA_E * DELTA_E_DECAY ^ level)
 */
export const START_DELTA_E = 0.12;
export const DELTA_E_DECAY = 0.9;
export const MIN_DELTA_E = 0.012;

/** Ranges the random base color is drawn from (OKLCH). */
export const BASE_LIGHTNESS = { min: 0.45, max: 0.8 } as const;
export const BASE_CHROMA = { min: 0.08, max: 0.18 } as const;

/** Tile layout. */
export const TILE_GAP = 8;
export const TILE_RADIUS = 12;
/** Minimum comfortable touch target (iOS HIG 44pt). */
export const MIN_TILE_SIZE = 44;
