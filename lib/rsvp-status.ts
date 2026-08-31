// RSVP is closed once either the block's own deadline has passed, or —
// absent a deadline — the wedding date itself has (no point asking guests
// to RSVP for a wedding that's already happened). Both the client (hide the
// form, see components/templates/*/rsvp.tsx) and the server
// (app/api/rsvp/route.ts, reject the write) need this exact same rule, so
// it lives in one place instead of two copies drifting apart.
export function isRsvpClosed(weddingDate: Date, deadline?: string): boolean {
  const now = new Date();

  if (deadline) {
    const parsedDeadline = new Date(deadline);
    if (!Number.isNaN(parsedDeadline.getTime())) return now > parsedDeadline;
  }

  return now > weddingDate;
}
