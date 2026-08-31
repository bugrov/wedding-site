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
    // touchend is the completed-gesture signal instead, but a touchend that
    // ends a scroll-drag (finger moved significantly, not a discrete tap)
    // still isn't always honored by mobile browsers as "real" user
    // activation for audio — play() then silently rejects. The bug this
    // caused (see feedback: "иконка переходит в состояние вкл, но музыки
    // нет") was setMuted(false) firing unconditionally regardless of
    // whether play() actually succeeded. Fixed below: only flip the visible
    // state once play()'s promise resolves, and only then stop listening —
    // a failed attempt (scroll-drag touchend, e.g.) leaves the listeners in
    // place so the next genuine tap/click/key retries instead of the icon
    // just silently lying about playback.
    const events = ["click", "touchend", "keydown"] as const;
    const tryUnmute = () => {
      audio.muted = false;
      audio.play().then(
        () => {
          setMuted(false);
          events.forEach((event) => document.removeEventListener(event, tryUnmute));
        },
        () => {
          audio.muted = true;
        },
      );
    };

    events.forEach((event) => document.addEventListener(event, tryUnmute));

    return () => {
      events.forEach((event) => document.removeEventListener(event, tryUnmute));
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (muted) {
      audio.muted = false;
      audio.play().then(
        () => setMuted(false),
        () => {
          audio.muted = true;
        },
      );
    } else {
      audio.muted = true;
      setMuted(true);
    }
  };

  return (
    <>
      {/* preload="auto", not "none" — the track only renders when the
          operator has actually turned this feature on for a project, so
          fetching it eagerly (in the background, from page load) is a
          deliberate trade — instant sound on the visitor's first gesture
          instead of a multi-second fetch delay starting only after they've
          already interacted. */}
      <audio ref={audioRef} src={src} loop preload="auto" />
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
