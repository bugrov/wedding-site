"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Floating background-music toggle — a cross-cutting feature (not a
 * positional block, see plan), shared by every template. Not part of the
 * standard block pack: only rendered when the project's `features.music`
 * flag is on.
 *
 * Browsers block autoplay-with-sound outright, so "on by default" is
 * implemented as: start muted+autoplay (always allowed), then unmute on the
 * visitor's first interaction anywhere on the page. That reads as "already
 * playing" to the guest without fighting the browser's autoplay policy.
 */
export function MusicToggle({ src, className }: { src: string; className?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = true;
    audio.play().catch(() => {});

    // touchend, not touchstart — touchstart fires the instant a finger
    // touches the screen, which is also how every scroll gesture begins.
    // Unmuting there means a plain scroll-to-read flips the icon to "on"
    // before the browser knows the touch will become a scroll, not a tap —
    // some mobile browsers then don't honor it as a real gesture, so
    // playback silently never starts even though the UI says it did (see
    // feedback: "иконка переходит в состояние вкл, но музыки нет").
    // touchend is the completed-tap signal instead.
    const events = ["click", "touchend", "keydown"] as const;
    const unmuteOnFirstInteraction = () => {
      audio.muted = false;
      audio.play().catch(() => {});
      setMuted(false);
      events.forEach((event) => document.removeEventListener(event, unmuteOnFirstInteraction));
    };

    events.forEach((event) =>
      document.addEventListener(event, unmuteOnFirstInteraction, { once: true }),
    );

    return () => {
      events.forEach((event) => document.removeEventListener(event, unmuteOnFirstInteraction));
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    audio.muted = next;
    if (!next) audio.play().catch(() => {});
    setMuted(next);
  };

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={muted ? "Включить музыку" : "Выключить музыку"}
        className={cn(
          "fixed right-5 bottom-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-(--color-primary) text-(--color-background) shadow-lg transition hover:opacity-90",
          className,
        )}
      >
        {muted ? (
          <VolumeX className="h-5 w-5" aria-hidden />
        ) : (
          <Volume2 className="h-5 w-5" aria-hidden />
        )}
      </button>
    </>
  );
}
