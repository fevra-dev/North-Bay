/**
 * Gradient placeholder for any event without a photo yet, generated as a data URI.
 *
 * No network request, no third-party photo service to break or license, and no layout shift
 * while it loads. The hue is derived from the index so the cards in a list differ from each
 * other without anyone picking colors by hand.
 *
 * This is a fallback, not a design element: swap in a real photograph (and real alt text) the
 * moment one exists. Everything around it — lazy loading, data-saver gating, the alt-text
 * branch in DashboardGrid — is already built for that swap.
 */
export const eventPlaceholderImage = (seed = 0): string => {
  // Narrow band around the brand navy, low saturation. The earlier range reached 245°,
  // which rendered a vivid purple beside two photographs of a lake — the placeholder read as a
  // deliberate design element rather than as a missing image, which is exactly backwards.
  const hue = 205 + ((seed * 13) % 16);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="hsl(${hue},28%,26%)" /><stop offset="100%" stop-color="hsl(${hue + 12},22%,38%)" /></linearGradient></defs><rect width="400" height="225" fill="url(#g)" /></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};
