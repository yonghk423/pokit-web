"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { diaryArt } from "@/content/web-diary-art";
import { sceneCategories } from "@/content/web-diary-categories";
import type { WebLocale } from "@/content/web-diary-copy";
import styles from "./web-diary.module.css";

const copy = {
 ko:{title:'장면 이어보기',search:'어떤 장면을 찾나요?',all:'전체',start:'시작하기',close:'닫기',count:'개의 장면',views:['작은 격자','두 열','한 열'],categories:['기상·준비','식사·요리','카페','일·공부','운동','야외','집안일','이동·여행','쇼핑','취미','휴식'],more:'더 보기'},
 en:{title:'Build your day',search:'Find a scene',all:'All',start:'Start',close:'Close',count:' scenes',views:['Small grid','Two columns','One column'],categories:['Getting ready','Food','Café','Work & study','Exercise','Outdoors','Home','Travel','Shopping','Hobbies','Rest'],more:'Show more'},
 ja:{title:'シーンをつなぐ',search:'どんなシーンを探しますか？',all:'すべて',start:'始める',close:'閉じる',count:'シーン',views:['小さいグリッド','2列','1列'],categories:['身支度','食事・料理','カフェ','仕事・勉強','運動','屋外','家事','移動・旅行','買い物','趣味','休憩'],more:'もっと見る'},
 'zh-TW':{title:'串起一天的場景',search:'尋找什麼場景？',all:'全部',start:'開始',close:'關閉',count:'個場景',views:['小格','兩欄','單欄'],categories:['起床準備','飲食烹飪','咖啡廳','工作學習','運動','戶外','居家','交通旅行','購物','興趣','休息'],more:'顯示更多'},
};
const categoryKeys=Object.keys(sceneCategories) as (keyof typeof sceneCategories)[];
export function WebSceneSelector({locale,onClose,onStart}:{locale:WebLocale;onClose:()=>void;onStart:(arts:number[])=>void}) {
 const sequenceCopy={ko:{title:'이어지는 나의 하루',remove:'장면 제거',before:'앞으로 이동',after:'뒤로 이동'},en:{title:'Your day, in order',remove:'Remove scene',before:'Move earlier',after:'Move later'},ja:{title:'つながる私の一日',remove:'シーンを削除',before:'前へ移動',after:'後ろへ移動'},'zh-TW':{title:'串起我的一天',remove:'移除場景',before:'往前移',after:'往後移'}}[locale];
 const move=(from:number,to:number)=>setSelected(prev=>{if(to<0||to>=prev.length)return prev;const next=[...prev];[next[from],next[to]]=[next[to],next[from]];return next;});
 const c=copy[locale],ref=useRef<HTMLDialogElement>(null),scrollRef=useRef<HTMLDivElement>(null),sentinelRef=useRef<HTMLDivElement>(null);
 const [query,setQuery]=useState(''),[category,setCategory]=useState('all'),[columns,setColumns]=useState(4),[selected,setSelected]=useState<number[]>([]),[limit,setLimit]=useState(24);
 useEffect(()=>{ref.current?.showModal();},[]);
 const all=diaryArt.map((art,index)=>({...art,index})).filter(a=>a.index>=3);
 const matches=(id:string,key:string)=>key==='all'||(sceneCategories[key as keyof typeof sceneCategories] as readonly string[]).includes(id);
 const filtered=all.filter(a=>matches(a.id,category)&&(`${a.labels[locale]} ${a.labels.en}`).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
 useEffect(()=>{scrollRef.current?.scrollTo({top:0});},[query,category]);
 useEffect(()=>{
  const root=scrollRef.current,target=sentinelRef.current;
  if(!root||!target||limit>=filtered.length)return;
  const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting))setLimit(n=>Math.min(n+24,filtered.length));},{root,rootMargin:'240px 0px'});
  observer.observe(target);return()=>observer.disconnect();
 },[limit,filtered.length,query,category]);
 return <dialog ref={ref} className={`${styles.dialog} ${styles.selectionDialog}`} onCancel={e=>{e.preventDefault();onClose();}} aria-label={c.title}>
 <header className={styles.dialogHeader}><h2>{c.title}</h2><button onClick={onClose} aria-label={c.close}>×</button></header>
 <div className={styles.selectionControls}><input aria-label={c.search} placeholder={c.search} value={query} onChange={e=>{setQuery(e.target.value);setLimit(24);}}/>
 <div className={styles.filterChips} role="group" aria-label={c.all}>{['all',...categoryKeys].map((key,i)=><button key={key} aria-pressed={category===key} onClick={()=>{setCategory(key);setLimit(24);}}>{i===0?c.all:c.categories[i-1]} <small>{all.filter(a=>matches(a.id,key)).length}</small></button>)}</div>
 <div className={styles.selectorViews}>{[4,2,1].map((n,i)=><button key={n} aria-label={c.views[i]} title={c.views[i]} aria-pressed={columns===n} onClick={()=>setColumns(n)}><svg viewBox="0 0 30 24" width="28" height="24" fill="none" stroke="currentColor">{Array.from({length:n},(_,col)=><rect key={col} x={2+col*26/n} y="3" width={26/n-2} height="18"/>)}</svg></button>)}</div></div>
 <div ref={scrollRef} className={styles.selectionScroll}><div className={styles.selectionGrid} data-columns={columns} style={{gridTemplateColumns:`repeat(${columns},minmax(0,1fr))`}}>{filtered.slice(0,limit).map(a=><button key={a.id} aria-label={a.labels[locale]} aria-pressed={selected.includes(a.index)} onClick={()=>setSelected(prev=>prev.includes(a.index)?prev.filter(i=>i!==a.index):[...prev,a.index])}><div className={styles.selectionImage}><Image src={a.image} alt="" fill placeholder="blur" sizes={columns===1?'(max-width:650px) 85vw, 500px':'(max-width:650px) 40vw, 280px'}/>{selected.includes(a.index)&&<b>{selected.indexOf(a.index)+1}</b>}</div><span>{a.labels[locale]}</span></button>)}</div>{limit<filtered.length&&<div ref={sentinelRef} className={styles.loadSentinel} aria-hidden="true"/>}</div>
 <footer className={styles.sequenceFooter}><div className={styles.sequenceHeading}><strong>{sequenceCopy.title}</strong><span>{selected.length}{c.count}</span><button className={styles.primary} disabled={!selected.length} onClick={()=>onStart(selected)}>{c.start} →</button></div>{<ol className={styles.sequenceRail}>{selected.map((art,index)=><li key={art}><div className={styles.sequenceCard}><div className={styles.sequencePhoto}><Image src={diaryArt[art].image} alt="" fill placeholder="blur" sizes="120px"/><b>{String(index+1).padStart(2,'0')}</b><button aria-label={`${sequenceCopy.remove}: ${diaryArt[art].labels[locale]}`} onClick={()=>setSelected(prev=>prev.filter(i=>i!==art))}>×</button></div><span>{diaryArt[art].labels[locale]}</span><div className={styles.sequenceMoves}><button aria-label={`${sequenceCopy.before}: ${diaryArt[art].labels[locale]}`} disabled={index===0} onClick={()=>move(index,index-1)}>←</button><button aria-label={`${sequenceCopy.after}: ${diaryArt[art].labels[locale]}`} disabled={index===selected.length-1} onClick={()=>move(index,index+1)}>→</button></div></div>{index<selected.length-1&&<span className={styles.sequenceArrow} aria-hidden="true">↝</span>}</li>)}</ol>}</footer>
 </dialog>;
}
