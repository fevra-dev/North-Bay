/**
 * FIRE DANGER GAUGE GEOMETRY.
 *
 * Pure SVG coordinate math — no Tailwind class, no arbitrary bracket value, nothing that
 * depends on a utility being generated correctly. Plain numbers in, path string out.
 *
 * The gauge is a semicircle divided into four equal 45° bands, sweeping from 180° (left, low)
 * to 0° (right, extreme). One shared set of math drives both the colored bands and the needle,
 * so the two can never disagree the way independently hand-placed elements could.
 */

export interface Point {
  x: number;
  y: number;
}

/**
 * Convert a polar coordinate to SVG cartesian space.
 *
 * Note the inverted Y: SVG's Y axis grows downward, so a positive angle (counterclockwise in
 * standard math convention) must subtract from `cy` to sweep upward on screen.
 */
export const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number): Point => {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
};

/** Build the filled-arc path for one band of the gauge, between two radii and two angles. */
export const gaugeArcPath = (
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startAngle: number,
  endAngle: number,
): string => {
  const startOuter = polarToCartesian(cx, cy, rOuter, startAngle);
  const endOuter = polarToCartesian(cx, cy, rOuter, endAngle);
  const endInner = polarToCartesian(cx, cy, rInner, endAngle);
  const startInner = polarToCartesian(cx, cy, rInner, startAngle);
  return `M ${startOuter.x} ${startOuter.y} A ${rOuter} ${rOuter} 0 0 1 ${endOuter.x} ${endOuter.y} L ${endInner.x} ${endInner.y} A ${rInner} ${rInner} 0 0 0 ${startInner.x} ${startInner.y} Z`;
};

/**
 * Band boundaries, in degrees, for the four danger levels. Five entries bounding four bands:
 * low occupies 180°–135°, medium 135°–90°, high 90°–45°, extreme 45°–0°.
 */
export const FIRE_ZONE_ANGLES = [180, 135, 90, 45, 0] as const;

/**
 * The needle angle for a given danger level: the midpoint of that level's band.
 *
 * `levelIndex` is clamped to the valid band range before use. Without the clamp, an unknown
 * level string reaching this function yields index -1, and `FIRE_ZONE_ANGLES[-1]` is
 * `undefined` — `(undefined + 180) / 2` is `NaN`, which SVG renders as a needle that silently
 * disappears rather than an error anyone would notice. A gauge that loses its needle while
 * still displaying a plausible colored dial is worse than one that fails loudly, so the input
 * is constrained here rather than trusted.
 */
export const fireNeedleAngle = (levelIndex: number): number => {
  const maxIndex = FIRE_ZONE_ANGLES.length - 2; // last valid *band* start
  const i = Math.min(Math.max(levelIndex, 0), maxIndex);
  return (FIRE_ZONE_ANGLES[i] + FIRE_ZONE_ANGLES[i + 1]) / 2;
};
