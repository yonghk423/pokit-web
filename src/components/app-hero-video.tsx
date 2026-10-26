"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./app-intro.module.css";

type Props = { label: string; playLabel: string; pauseLabel: string };

export function AppHeroVideo({ label, playLabel, pauseLabel }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!preference.matches) void video.play().catch(() => {});
    const onPreferenceChange = () => { if (preference.matches) video.pause(); };
    preference.addEventListener("change", onPreferenceChange);
    return () => preference.removeEventListener("change", onPreferenceChange);
  }, []);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => {});
    else video.pause();
  }

  return <div className={styles.heroVideo}>
    <video ref={videoRef} src="/your-day-page-zoom-us.mp4" poster="/your-day-page-zoom-us.webp"
      width={1920} height={824} muted loop playsInline preload="metadata" aria-label={label}
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
    <button type="button" className={styles.videoToggle} onClick={toggle}>
      <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>{playing ? pauseLabel : playLabel}
    </button>
  </div>;
}
