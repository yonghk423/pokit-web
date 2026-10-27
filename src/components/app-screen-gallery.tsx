"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, useState } from "react";
import styles from "./app-intro.module.css";

type Props = {
  phone: readonly StaticImageData[];
  tablet: readonly StaticImageData[];
  labels: string[];
  copy: { device: string; previous: string; next: string; open: string };
};

export function AppScreenGallery({ phone, tablet, labels, copy }: Props) {
  const [device, setDevice] = useState<"iPhone" | "iPad">("iPhone");
  const track = useRef<HTMLDivElement>(null);
  const images = device === "iPhone" ? phone : tablet;
  function move(direction: number) {
    const element = track.current;
    if (!element) return;
    element.scrollBy({ left: direction * element.clientWidth * 0.8, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  return (
    <div>
      <div className={styles.galleryControls}>
        <div className={styles.devicePicker} role="group" aria-label={copy.device}>
          {(["iPhone", "iPad"] as const).map((name) => <button key={name} type="button" aria-pressed={device === name} onClick={() => { setDevice(name); track.current?.scrollTo({ left: 0, behavior: "instant" }); }}>{name}</button>)}
        </div>
        <div className={styles.galleryArrows}>
          <button type="button" aria-label={copy.previous} onClick={() => move(-1)}>←</button>
          <button type="button" aria-label={copy.next} onClick={() => move(1)}>→</button>
        </div>
      </div>
      <div ref={track} className={`${styles.galleryTrack} ${device === "iPad" ? styles.tabletTrack : ""}`} role="region" aria-label={`${device} ${copy.open}`} tabIndex={0}>
        {images.map((image, index) => <a key={`${device}-${index}`} href={image.src} target="_blank" rel="noopener noreferrer" aria-label={`${copy.open}: ${labels[index]} (${device})`} className={styles.galleryCard}>
          <Image placeholder="blur" src={image} alt={`${device} — ${labels[index]}`} sizes={device === "iPad" ? "(max-width: 436px) 78vw, 340px" : "(max-width: 361px) 72vw, 260px"} />
          <span className={styles.galleryCaption}>{String(index + 1).padStart(2, "0")} <span>{copy.open} ↗</span></span>
        </a>)}
      </div>
    </div>
  );
}
