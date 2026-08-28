import { useCallback, useRef, useSyncExternalStore } from "react";

export type CountdownRemaining = { days: number; hours: number; minutes: number; seconds: number };

function getRemaining(target: Date): CountdownRemaining {
  const diffMs = Math.max(0, target.getTime() - Date.now());
  const totalSeconds = Math.floor(diffMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function sameRemaining(a: CountdownRemaining, b: CountdownRemaining) {
  return (
    a.days === b.days && a.hours === b.hours && a.minutes === b.minutes && a.seconds === b.seconds
  );
}

// Shared by every template's Timer block. The wall clock is genuinely
// external state, so this reads via useSyncExternalStore rather than
// setState-in-an-effect — it's what React recommends for exactly this
// "ticking clock" case, and it sidesteps the hydration mismatch a plain
// useState+useEffect clock would hit (server and client would otherwise
// compute Date.now() at two different instants).
export function useCountdown(target: Date): CountdownRemaining | null {
  const cacheRef = useRef<CountdownRemaining | null>(null);

  const subscribe = useCallback((onStoreChange: () => void) => {
    const id = setInterval(onStoreChange, 1000);
    return () => clearInterval(id);
  }, []);

  const getSnapshot = useCallback(() => {
    const next = getRemaining(target);
    if (cacheRef.current && sameRemaining(cacheRef.current, next)) {
      return cacheRef.current;
    }
    cacheRef.current = next;
    return next;
  }, [target]);

  // Server (and the client's very first render, pre-hydration) has no
  // meaningful "now" to compute against — null renders a stable placeholder.
  const getServerSnapshot = useCallback(() => null, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
