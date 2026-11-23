/** A random number generator returning floats in [0, 1). */
export type Rng = () => number;

/**
 * mulberry32: tiny, fast, seeded PRNG.
 * Same seed → same sequence, so puzzles are reproducible and testable.
 */
export function createRng(seed: number): Rng {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Float in [min, max). */
export function randomBetween(rng: Rng, min: number, max: number): number {
  return min + rng() * (max - min);
}

/** Integer in [0, n). */
export function randomInt(rng: Rng, n: number): number {
  return Math.floor(rng() * n);
}

/** A fresh 31-bit seed for a new puzzle. */
export function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}
