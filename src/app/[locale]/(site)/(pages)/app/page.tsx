import Image from "next/image";
import {notFound} from "next/navigation";
import {AppScrollMotion} from "@/components/app-scroll-motion";
import copy from "@/content/daylight.json";
import {isLocale,locales} from "@/i18n/config";
import {localeAlternates} from "@/lib/locale-path";
import styles from "./daylight.module.css";

const bannerText = {
  ko: "Daylight · 쓰는 재미, 담는 즐거움. 사진과 글로 꾸미는 나만의 포토 다이어리",
  en: "Daylight · Fun to write. A joy to make your own. Your photos, your words. Your photo diary to decorate.",
  ja: "Daylight · 書く楽しさ、残すよろこび。写真と言葉で自由に飾る、自分だけのフォトダイアリー。",
  "zh-TW": "Daylight · 寫字的樂趣，收藏的喜悅。用照片和文字自由佈置，打造專屬你的照片手帳。",
};

type Props={params:Promise<{locale:string}>};
export function generateStaticParams(){return locales.map(locale=>({locale}));}
export async function generateMetadata({params}:Props){
  const {locale}=await params;if(!isLocale(locale)) return {};
  const lang=locale==="ko"?"ko":"en";
  const description=copy[lang][0][1];
  return {title:{absolute:"Daylight"},description,alternates:localeAlternates(locale,"/app"),openGraph:{title:"Daylight",description,images:[`/daylight/${lang}-1.webp`]},twitter:{card:"summary" as const,title:"Daylight",description}};
}
export default async function Page({params}:Props){
  const {locale}=await params;if(!isLocale(locale)) notFound();
  const lang=locale==="ko"?"ko":"en", ko=lang==="ko";
  const groups=[[0],[1,2,3],[4,5],[6,7,8]];
  const labels=ko?["다이어리","달력","사진과 글","나만의 스타일"]:["Diary","Calendar","Photos & words","Personal touches"];
  return <AppScrollMotion lang={lang} className={styles.page}>
    <Image
      lang={locale}
      src={`/daylight/header-${locale}.webp`}
      alt={bannerText[locale]}
      width={3840}
      height={1646}
      sizes="100vw"
      className="block h-auto w-full"
      preload
    />
    <nav aria-label="Daylight"><strong>Daylight</strong>{labels.map((label,i)=><a key={label} href={`#chapter-${i}`}>{label}</a>)}</nav>
    {groups.map((indices,i)=><section key={i} id={`chapter-${i}`}><header data-reveal="text"><small>DAYLIGHT　 /　0{i+1}</small>{i===0?<h1>{copy[lang][0][0]}</h1>:<h2>{copy[lang][indices[0]][0]}</h2>}<p>{copy[lang][indices[0]][1]}</p></header>
    <div className={styles.screens}>{indices.map((n,j)=><figure key={n} data-reveal={j%2?"screen-right":"screen-left"} data-reveal-delay={j*90}>{n === 4 ? (
      <div className={styles.filmPreview} role="img" aria-label={ko ? "같은 인물 사진에 여섯 가지 필름을 적용한 모습" : "Six film looks applied to the same portrait"} />
    ) : <Image src={`/daylight/${lang}-${n+1}.webp`} alt={copy[lang][n][0].replace("\n"," ")} width={600} height={1286} sizes="(max-width:700px) 70vw, 280px"/>}{indices.length > 1 && <figcaption><b>{copy[lang][n][0].replace("\n"," ")}</b><p>{copy[lang][n][1]}</p></figcaption>}</figure>)}</div></section>)}</AppScrollMotion>
}
