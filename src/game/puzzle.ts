import { BASE_CHROMA, BASE_LIGHTNESS, MIN_DELTA_E } from '@/constants/game';

import { clampToGamut, deltaE, oklchToHex, type Oklch } from './color';
import { getLevelConfig } from './difficulty';
import { createRng, randomBetween, randomInt } from './rng';

/** Which OKLCH channel the odd tile differs in (value / saturation / hue puzzles). */
export type ColorChannel = 'lightness' | 'chroma' | 'hue';
export const COLOR_CHANNELS: readonly ColorChannel[] = ['lightness', 'chroma', 'hue'];

export type Puzzle = {
  rows: number;
  cols: number;
  baseHex: string;
  oddHex: string;
  oddIndex: number;
  channel: ColorChannel;
  /** Target ΔE for this level. */
  targetDeltaE: number;
  /** ΔE measured between the final, hex-rounded colors. */
  actualDeltaE: number;
  seed: number;
};

const MAX_ATTEMPTS = 6;
/** Rounding to hex can shave a little off the distance; accept 80% of the floor. */
const MIN_ACCEPTED_DELTA_E = MIN_DELTA_E * 0.8;

/** Moves a color by `amount` (OKLab distance) along one channel. */
export function shiftColor(
  [L, C, h]: Oklch,
  channel: ColorChannel,
  amount: number,
  direction: 1 | -1,
): Oklch {
  switch (channel) {
    case 'lightness':
      return [Math.min(0.95, Math.max(0.1, L + direction * amount)), C, h];
    case 'chroma':
      return [L, Math.max(0, C + direction * amount), h];
    case 'hue': {
      // Chord length on the hue circle: ΔE = 2C·sin(Δh/2)  →  Δh = 2·asin(ΔE / 2C)
      const ratio = Math.min(1, amount / (2 * Math.max(C, 1e-3)));
      const dh = (2 * Math.asin(ratio) * 180) / Math.PI;
      return [L, C, (h + direction * dh + 360) % 360];
    }
  }
}

/**
 * Builds one Odd-Color Out puzzle for a 0-based level.
 * Pure and deterministic: the same (level, seed) always gives the same puzzle.
 */
export function generatePuzzle(level: number, seed: number): Puzzle {
  const rng = createRng(seed);
  const { rows, cols, deltaE: targetDeltaE } = getLevelConfig(level);

  const base = clampToGamut([
    randomBetween(rng, BASE_LIGHTNESS.min, BASE_LIGHTNESS.max),
    randomBetween(rng, BASE_CHROMA.min, BASE_CHROMA.max),
    randomBetween(rng, 0, 360),
  ]);
  const baseHex = oklchToHex(base);

  let channel = COLOR_CHANNELS[randomInt(rng, COLOR_CHANNELS.length)];
  let direction: 1 | -1 = rng() < 0.5 ? -1 : 1;
  let oddHex = baseHex;
  let actualDeltaE = 0;

  // Safety net: gamut clamping or hex rounding can collapse the difference.
  // Flip direction, then try the next channel, until the odd tile is distinguishable.
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    oddHex = oklchToHex(shiftColor(base, channel, targetDeltaE, direction));
    actualDeltaE = deltaE(baseHex, oddHex);
    if (oddHex !== baseHex && actualDeltaE >= MIN_ACCEPTED_DELTA_E) break;
    direction = direction === 1 ? -1 : 1;
    if (attempt % 2 === 1) {
      channel = COLOR_CHANNELS[(COLOR_CHANNELS.indexOf(channel) + 1) % COLOR_CHANNELS.length];
    }
  }

  return {
    rows,
    cols,
    baseHex,
    oddHex,
    oddIndex: randomInt(rng, rows * cols),
    channel,
    targetDeltaE,
    actualDeltaE,
    seed,
  };
}
