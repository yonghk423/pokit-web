"use client";

import { useEffect } from "react";

import { isPokitAppContext } from "@/lib/pokit-bridge";

/**
 * Keeps `html[data-pokit-app]` in sync after hydration
 * (covers ReactNativeWebView / injected flags that the boot script may miss).
 */
export function PokitAppDocumentFlag() {
  useEffect(() => {
    if (!isPokitAppContext()) return;
    document.documentElement.dataset.pokitApp = "1";
    return () => {
      delete document.documentElement.dataset.pokitApp;
    };
  }, []);

  return null;
}
