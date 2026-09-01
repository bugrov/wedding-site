"use client";

import { useEffect, useRef, useState } from "react";

// Reveal-on-scroll for `components/primitives/section.tsx` — shared by every
// template's block sections, so this one hook is what makes "плавная
// анимация появления блоков при скролле" apply everywhere at once instead of
// needing a per-template implementation. Doesn't handle `prefers-reduced-motion`
// itself — Section does that in CSS via Tailwind's `motion-reduce:` variant,
// so a reduced-motion visitor still gets `inView` flipping normally, it just
// never sees the transition/transform that would have animated on top of it.
export function useInView(options?: { rootMargin?: string; threshold?: number }) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const rootMargin = options?.rootMargin ?? "0px 0px -10% 0px";
  const threshold = options?.threshold ?? 0.15;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect(); // reveal once — never re-hide on scroll back up
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return { ref, inView };
}
