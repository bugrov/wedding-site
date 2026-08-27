// Template-level decorative stock photography for Tuscany — approved via the
// plan's asset process (3-5 candidates presented, user picked these). Shared
// across every client site using this template, unlike client-uploaded
// content photos (Cover/Story/Gallery), which always come from the project.
//
// Named constants, not inline strings in the block markup — when
// Theme.decorOverride gets wired up (admin theme editor, step 6), each of
// these becomes a `theme.decorOverride?.<key> ?? DEFAULT` fallback instead of
// a rewrite.
export const TUSCANY_DECOR = {
  /** Timer section background — wedding table with olive branches + candles. */
  timerBackground:
    "https://images.pexels.com/photos/37066399/pexels-photo-37066399/free-photo-of-elegant-wedding-table-setting-in-tuscany.jpeg",
  /** Dress-code section accent — bridal bouquet, eucalyptus + white florals. */
  dressCodeAccent: "https://images.unsplash.com/photo-1595467959554-9ffcbf37f10f",
} as const;
