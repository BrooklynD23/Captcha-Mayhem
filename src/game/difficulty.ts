import {
  DELTA_E_DECAY,
  GRID_STEPS,
  MIN_DELTA_E,
  ROUNDS_PER_STEP,
  START_DELTA_E,
} from '@/constants/game';

export type LevelConfig = {
  rows: number;
  cols: number;
  /** Target OKLab distance between base and odd color. Smaller = harder. */
  deltaE: number;
};

/** Index into GRID_STEPS for a level (0-based), capped at the largest grid. */
export function gridStepForLevel(level: number): number {
  return Math.min(Math.floor(Math.max(0, level) / ROUNDS_PER_STEP), GRID_STEPS.length - 1);
}

export function deltaEForLevel(level: number): number {
  return Math.max(MIN_DELTA_E, START_DELTA_E * Math.pow(DELTA_E_DECAY, Math.max(0, level)));
}

/** Maps a 0-based level to grid size and color difficulty. */
export function getLevelConfig(level: number): LevelConfig {
  const [rows, cols] = GRID_STEPS[gridStepForLevel(level)];
  return { rows, cols, deltaE: deltaEForLevel(level) };
}
