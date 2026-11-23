import { describe, expect, it } from '@jest/globals';

import { GRID_STEPS, MIN_DELTA_E, ROUNDS_PER_STEP, START_DELTA_E } from '@/constants/game';

import { deltaE, hexToRgb, oklabToRgb, rgbToHex, rgbToOklab } from '../color';
import { deltaEForLevel, getLevelConfig } from '../difficulty';
import { generatePuzzle } from '../puzzle';
import { createInitialState, gameReducer } from '../reducer';
import { createRng } from '../rng';

describe('color', () => {
  it('round-trips hex through OKLab', () => {
    for (const hex of ['#FF6961', '#000000', '#FFFFFF', '#3C87F7', '#7A1712']) {
      expect(rgbToHex(oklabToRgb(rgbToOklab(hexToRgb(hex))))).toBe(hex);
    }
  });

  it('gives zero distance for identical colors and positive otherwise', () => {
    expect(deltaE('#FF6961', '#FF6961')).toBe(0);
    expect(deltaE('#FF6961', '#FF6E66')).toBeGreaterThan(0);
  });

  it('rejects malformed hex', () => {
    expect(() => hexToRgb('#GGGGGG')).toThrow();
  });
});

describe('rng', () => {
  it('is deterministic per seed', () => {
    const a = createRng(42);
    const b = createRng(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
});

describe('difficulty', () => {
  it('starts at 2x2 and grows one step every ROUNDS_PER_STEP levels', () => {
    GRID_STEPS.forEach(([rows, cols], step) => {
      expect(getLevelConfig(step * ROUNDS_PER_STEP)).toMatchObject({ rows, cols });
    });
  });

  it('caps the grid at the largest step', () => {
    const [rows, cols] = GRID_STEPS[GRID_STEPS.length - 1];
    expect(getLevelConfig(999)).toMatchObject({ rows, cols });
  });

  it('shrinks ΔE monotonically down to the floor', () => {
    expect(deltaEForLevel(0)).toBeCloseTo(START_DELTA_E);
    for (let l = 1; l < 60; l++) {
      expect(deltaEForLevel(l)).toBeLessThanOrEqual(deltaEForLevel(l - 1));
    }
    expect(deltaEForLevel(100)).toBe(MIN_DELTA_E);
  });
});

describe('generatePuzzle', () => {
  it('is reproducible for the same level and seed', () => {
    expect(generatePuzzle(5, 1234)).toEqual(generatePuzzle(5, 1234));
  });

  it('always produces a distinguishable odd tile inside the grid', () => {
    for (let level = 0; level <= 40; level += 2) {
      for (let seed = 1; seed <= 150; seed++) {
        const p = generatePuzzle(level, seed);
        expect(p.oddHex).not.toBe(p.baseHex);
        expect(p.actualDeltaE).toBeGreaterThanOrEqual(MIN_DELTA_E * 0.8);
        expect(p.oddIndex).toBeGreaterThanOrEqual(0);
        expect(p.oddIndex).toBeLessThan(p.rows * p.cols);
        expect(p.baseHex).toMatch(/^#[0-9A-F]{6}$/);
      }
    }
  });

  it('lands close to the target ΔE', () => {
    let total = 0;
    let n = 0;
    for (let seed = 1; seed <= 200; seed++) {
      const p = generatePuzzle(4, seed);
      total += Math.abs(p.actualDeltaE - p.targetDeltaE) / p.targetDeltaE;
      n++;
    }
    // Hex rounding and gamut clamping add noise; on average stay within 25% of target.
    expect(total / n).toBeLessThan(0.25);
  });

  it('makes colors harder (closer) at high levels than at level 0', () => {
    const avg = (level: number) => {
      let sum = 0;
      for (let seed = 1; seed <= 100; seed++) sum += generatePuzzle(level, seed).actualDeltaE;
      return sum / 100;
    };
    expect(avg(25)).toBeLessThan(avg(0) / 3);
  });
});

describe('gameReducer', () => {
  it('advances level and score on a correct tap', () => {
    const s0 = createInitialState(7);
    const s1 = gameReducer(s0, { type: 'SELECT_TILE', index: s0.puzzle.oddIndex, nextSeed: 8 });
    expect(s1.level).toBe(1);
    expect(s1.score).toBe(1);
    expect(s1.status).toBe('playing');
    expect(s1.puzzle.seed).toBe(8);
  });

  it('keeps the same puzzle on a wrong tap and does not mutate state', () => {
    const s0 = createInitialState(7);
    const wrong = (s0.puzzle.oddIndex + 1) % (s0.puzzle.rows * s0.puzzle.cols);
    const frozen = JSON.stringify(s0);
    const s1 = gameReducer(s0, { type: 'SELECT_TILE', index: wrong, nextSeed: 8 });
    expect(JSON.stringify(s0)).toBe(frozen);
    expect(s1.level).toBe(0);
    expect(s1.puzzle).toBe(s0.puzzle);
    expect(s1.status).toBe('wrong');
    expect(s1.wrongIndex).toBe(wrong);
    expect(s1.wrongCount).toBe(1);
  });

  it('restarts to level 0', () => {
    let s = createInitialState(1);
    s = gameReducer(s, { type: 'SELECT_TILE', index: s.puzzle.oddIndex, nextSeed: 2 });
    s = gameReducer(s, { type: 'RESTART', seed: 3 });
    expect(s).toMatchObject({ level: 0, score: 0, status: 'playing' });
  });
});
