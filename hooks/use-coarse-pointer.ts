"use client";

import { useEffect, useState } from "react";

/**
 * `true` on coarse-pointer devices (phones / tablets), where the OS-native
 * control — date picker, `<select>` wheel, tel keypad — is what users expect.
 * `false` on fine-pointer devices (mouse/trackpad). `null` until mounted, so
 * server and first client render agree (treat `null` like desktop, or render
 * the SSR-safe native control and let it swap for one frame).
 */
export function useCoarsePointer(): boolean | null {
  const [coarse, setCoarse] = useState<boolean | null>(null);
  useEffect(() => {
    const mql = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarse(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return coarse;
}
