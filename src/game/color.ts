/**
 * Color math for procedural puzzles.
 *
 * We work in OKLab / OKLCH (Björn Ottosson, 2020) because distance in OKLab tracks
 * perceived difference far better than RGB or HSL. A fixed ΔE therefore feels about
 * equally hard on reds, greens and blues.
 */

/** sRGB with channels in [0, 1]. */
export type Rgb = readonly [r: number, g: number, b: number];
/** OKLab: L in [0, 1], a/b roughly in [-0.4, 0.4]. */
export type Oklab = readonly [L: number, a: number, b: number];
/** OKLCH: L in [0, 1], C >= 0, h in degrees [0, 360). */
export type Oklch = readonly [L: number, C: number, h: number];

const GAMUT_EPSILON = 1e-4;

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

export function rgbToOklab([r, g, b]: Rgb): Oklab {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

/** Returns unclamped sRGB; values outside [0, 1] mean the color is out of gamut. */
export function oklabToRgb([L, a, b]: Oklab): Rgb {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

export function oklchToOklab([L, C, h]: Oklch): Oklab {
  const rad = (h * Math.PI) / 180;
  return [L, C * Math.cos(rad), C * Math.sin(rad)];
}

export function isInGamut(rgb: Rgb): boolean {
  return rgb.every((v) => v >= -GAMUT_EPSILON && v <= 1 + GAMUT_EPSILON);
}

/** Lowers chroma (keeping lightness and hue) until the color fits in sRGB. */
export function clampToGamut([L, C, h]: Oklch): Oklch {
  if (isInGamut(oklabToRgb(oklchToOklab([L, C, h])))) return [L, C, h];
  let lo = 0;
  let hi = C;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (isInGamut(oklabToRgb(oklchToOklab([L, mid, h])))) lo = mid;
    else hi = mid;
  }
  return [L, lo, h];
}

export function rgbToHex(rgb: Rgb): string {
  return (
    '#' +
    rgb
      .map((v) =>
        Math.round(Math.min(1, Math.max(0, v)) * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
      .toUpperCase()
  );
}

export function hexToRgb(hex: string): Rgb {
  const clean = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) throw new Error(`Invalid hex color: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16) / 255) as unknown as Rgb;
}

export function oklchToHex(lch: Oklch): string {
  return rgbToHex(oklabToRgb(oklchToOklab(clampToGamut(lch))));
}

/** Perceptual distance between two hex colors (Euclidean distance in OKLab). */
export function deltaE(hexA: string, hexB: string): number {
  const [L1, a1, b1] = rgbToOklab(hexToRgb(hexA));
  const [L2, a2, b2] = rgbToOklab(hexToRgb(hexB));
  return Math.hypot(L1 - L2, a1 - a2, b1 - b2);
}
