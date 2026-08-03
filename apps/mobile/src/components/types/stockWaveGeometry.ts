/**
 * Single source of truth for the StockWave mark, lifted verbatim from
 * assets/icons/StockWave. Anything that animates the logo imports from here so
 * the splash, the loader and the static icon can never drift apart.
 */

export const VIEW_BOX = 40;

export const FRAME_PATH = 'M0 40V0h40v40H0ZM4.762 4.762h30.476v30.476H4.762V4.762Z';
export const FRAME_STROKE = 4.762;

/** Fractions of the rendered size — the frame's inner square. */
export const INNER_INSET = FRAME_STROKE / VIEW_BOX; // 0.119
export const INNER_SIZE = (VIEW_BOX - FRAME_STROKE * 2) / VIEW_BOX; // 0.762

/**
 * The three bars sit at exactly 45deg, so translating one by (+n, -n) moves it
 * along its own axis — lengthwise, the way a rain streak or a ticker moves.
 *
 * `travel` is the per-axis distance (viewBox units) that parks a bar fully
 * outside the inner square, in either direction. Derived from each bar's
 * furthest vertex, not guessed — change a path and you must recompute it.
 */
export const BARS = [
  { id: 'upper', d: 'M19.303 11.684l-8.096 8.095-3.367-3.367 8.095-8.096 3.368 3.367Z', travel: 16 },
  { id: 'long', d: 'm11.207 32.16 20.476-20.476-3.367-3.368L7.84 28.793l3.367 3.367Z', travel: 25 },
  { id: 'lower', d: 'M23.588 32.16l8.095-8.095-3.367-3.368-8.095 8.096 3.367 3.367Z', travel: 16 },
] as const;