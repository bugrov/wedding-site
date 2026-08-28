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
  /** Schedule section background — rustic table setting, gold cutlery, olive
   * sprig (picked over a "rings on olive branch" alternative after comparing
   * both live). */
  scheduleBackground: "https://images.pexels.com/photos/4618516/pexels-photo-4618516.jpeg",
} as const;
