/**
 * Standard seatpost diameters supported by Selle Jallot.
 * Anything outside this set is flagged as not covered.
 */
export const SUPPORTED_DIAMETERS = [27.2, 30.9, 31.6, 34.0] as const;

export function isDiameterSupported(d: number): boolean {
  return (SUPPORTED_DIAMETERS as readonly number[]).includes(d);
}

/**
 * The "shim possible" rule: certain non-standard diameters can be matched
 * with a Selle Jallot post + reduction shim. Those that cannot are dead-end.
 */
export function diameterFallback(d: number): {
  recommended: number | null;
  needsShim: boolean;
} {
  // 25.4 → 27.2 with shim, 28.6 → none, 29.8/31.2/31.4 → none
  if (d === 25.4) return { recommended: 27.2, needsShim: true };
  if (isDiameterSupported(d)) return { recommended: d, needsShim: false };
  return { recommended: null, needsShim: false };
}
