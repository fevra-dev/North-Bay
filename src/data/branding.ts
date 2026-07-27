import logoUrl from '../assets/north-bay-logo.png';

/**
 * The City's horizontal wordmark, white on transparent, which is why the header switches to
 * navy whenever a logo is present — the mark is unreadable on a light background.
 *
 * Set this to an empty string to fall back to the typographic wordmark: the header, its icon
 * cluster, and every control inside it flip back to the light treatment automatically. That
 * fallback is kept working on purpose, so the layout never depends on having the asset.
 */
export const NORTH_BAY_LOGO_URL: string = logoUrl;

/**
 * This is an independent redesign concept, not the City's site and not affiliated with it.
 * Stated in the footer of the page itself and at the top of the README, so the distinction
 * survives the page being screenshotted, linked, or shared without surrounding context.
 */
export const CONCEPT_AUTHOR = 'Mac Calarco';
