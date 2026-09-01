"use client";

import { cn } from "@/lib/utils";
import { useInView } from "@/lib/hooks/use-in-view";

type SectionProps = {
  /** "full" bleeds edge-to-edge; "contained" caps width with side padding. */
  bleed?: "full" | "contained";
  as?: "section" | "div" | "header" | "footer";
  id?: string;
  className?: string;
  children: React.ReactNode;
};

// The building block behind the editorial vertical rhythm from the plan:
// alternating full-bleed and contained sections down the page, instead of a
// uniform column of cards.
//
// Also where every template's scroll-reveal lives (see feedback: "плавная
// анимация появления блоков, текста при скролле для всех шаблонов") — every
// block in every template already renders its content through this one
// component, so animating it here is what makes the effect apply everywhere
// at once rather than needing a per-template/per-block implementation. Cover
// components don't use Section, so the hero never gets this treatment — it's
// already visible on load, animating it in would just be a flash.
export function Section({
  bleed = "contained",
  as: Tag = "section",
  id,
  className,
  children,
}: SectionProps) {
  const { ref, inView } = useInView();

  return (
    <Tag
      // `Tag` is a runtime-chosen intrinsic element, so TS can't narrow the
      // ref prop's specific HTMLDivElement/HTMLElement type — every option
      // Tag can be is a plain HTMLElement with no extra required members.
      ref={ref as never}
      id={id}
      className={cn(
        "py-16 transition-[opacity,transform] duration-700 ease-out md:py-24",
        inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        // A reduced-motion visitor gets the resting state immediately,
        // regardless of `inView` — no transform, no transition, no delay.
        "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
        bleed === "contained" ? "mx-auto w-full max-w-5xl px-6" : "w-full",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
