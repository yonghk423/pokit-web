"use client";

import Image from "next/image";
import filmWarm from "@/assets/daylight/screens/film-warm.png";
import film059 from "@/assets/daylight/screens/film-059.png";
import filmCool from "@/assets/daylight/screens/film-cool.png";
import screenStyles from "@/components/app-intro.module.css";
import styles from "@/components/daylight-film-sequence.module.css";

const samples = [
  { image: filmWarm, index: 0 },
  { image: film059, index: 1 },
  { image: filmCool, index: 2 },
] as const;

export function DaylightFilmSequence({ alt, labels }: { alt: string; labels: readonly string[] }) {
  return (
    <figure className={`${screenStyles.screen} ${screenStyles.filmShowcase}`} data-reveal="screen-left">
      <div className={styles.samples} role="list" aria-label={alt}>
        {samples.map(({ image, index }) => (
          <div className={styles.sample} role="listitem" key={image.src}>
            <div className={screenStyles.screenFrame}>
              <div className={styles.sampleImage}>
                <Image src={image} alt="" sizes="(max-width: 760px) 25vw, 190px" quality={72} />
              </div>
            </div>
            <p className={styles.label}>{labels[index]}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
