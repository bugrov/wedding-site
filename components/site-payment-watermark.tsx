// Shown on a published guest site while the project hasn't been marked paid
// yet — the operator can publish for real (real subdomain, full
// functionality) as soon as the lead is ready to show the couple, without
// waiting for payment first, per feedback: publish early, gate on payment
// with a watermark instead of a separate preview link/timed auto-unpublish.
// Fixed + pointer-events-none: stays in view over the whole page as the
// guest scrolls, but never blocks scrolling or clicking anything beneath it.
// Plain mid-gray at low opacity, not a blend-mode trick (mix-blend-difference
// looked right in isolation but nearly vanished against Tuscany's cream
// background — the difference between white and a near-white color is itself
// tiny, however the two combine). A mid-gray reads reliably against both a
// light template background today and a dark one whenever one exists.
// Brand name, not an explicit "не оплачено" error message — same idea as
// Tilda/Canva's free-tier watermark.
const LABEL = "Предпросмотр · Wedding Press";

export function SitePaymentWatermark() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-[-50%] flex rotate-[-28deg] flex-wrap content-around justify-around gap-x-20 gap-y-24">
        {Array.from({ length: 60 }, (_, i) => (
          <span
            key={i}
            className="text-lg font-semibold tracking-wide whitespace-nowrap text-neutral-500/40 select-none"
          >
            {LABEL}
          </span>
        ))}
      </div>
    </div>
  );
}
