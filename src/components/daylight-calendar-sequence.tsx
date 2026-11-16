"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import basketball from "@/assets/daylight/screens/story/calendar-basketball.png";
import boxing from "@/assets/daylight/screens/story/calendar-boxing.png";
import badminton from "@/assets/daylight/screens/story/calendar-badminton.png";
import cycling from "@/assets/daylight/screens/story/calendar-cycling.png";
import concert from "@/assets/daylight/screens/story/calendar-concert.png";
import autumn from "@/assets/daylight/screens/story/calendar-autumn.png";
import rain from "@/assets/daylight/screens/story/calendar-rain.png";
import englishGym from "@/assets/daylight/intro-en/calendar-gym.webp";
import englishBasketball from "@/assets/daylight/intro-en/calendar-basketball.webp";
import englishCycling from "@/assets/daylight/intro-en/calendar-cycling.webp";
import englishYoga from "@/assets/daylight/intro-en/calendar-yoga.webp";
import englishConcert from "@/assets/daylight/intro-en/calendar-concert.webp";
import screenStyles from "@/components/app-intro.module.css";
import styles from "@/components/daylight-calendar-sequence.module.css";

const frames = [basketball, boxing, badminton, cycling, concert, autumn, rain] as const;
const englishFrames = [englishGym, englishBasketball, englishCycling, englishYoga, englishConcert] as const;

export function DaylightCalendarSequence({ alt, locale }: { alt: string; locale: string }) {
  const activeFrames = locale === "en" ? englishFrames : frames;
  const [activeFrame, setActiveFrame] = useState(0);
  const [motionAllowed, setMotionAllowed] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setMotionAllowed(!preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!motionAllowed) return;
    const timer = window.setInterval(() => {
      setActiveFrame((current) => (current + 1) % activeFrames.length);
    }, 1050);
    return () => window.clearInterval(timer);
  }, [motionAllowed, activeFrames.length]);

  return (
    <figure className={`${screenStyles.screen} ${styles.calendarSequence}`} data-reveal="screen-left">
      <div className={screenStyles.screenFrame}>
        <div className={styles.sequence} role="img" aria-label={alt}>
          {activeFrames.map((frame, index) => (
            <Image
              key={frame.src}
              src={frame}
              alt=""
              fill
              sizes="(max-width: 760px) 230px, 360px"
              quality={70}
              placeholder="blur"
              className={`${styles.frame} ${index === activeFrame ? styles.active : ""}`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </figure>
  );
}
