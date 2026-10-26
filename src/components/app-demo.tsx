"use client";

import { appName } from "@/config/site";

import Image from "next/image";
import { useState } from "react";
import coffee from "@/assets/app-demo/coffee.webp";
import walk from "@/assets/app-demo/walk.webp";
import books from "@/assets/app-demo/books.webp";
import { AppStoreBadge } from "@/components/app-store-badge";
import type { Locale } from "@/i18n/config";
import styles from "./app-demo.module.css";

type Copy = { title: string; intro: string; scenes: string[]; choose: string; note: string; placeholder: string; task: string; taskPlaceholder: string; add: string; remove: string; reset: string; empty: string; complete: string; cta: string; notice: string; download: string };
type Task = { id: number; text: string; done: boolean };
const art = [coffee, walk, books];
export function AppDemo({ locale, copy }: { locale: Locale; copy: Copy }) {
  const [scene, setScene] = useState(0);
  const [note, setNote] = useState("");
  const [draft, setDraft] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [nextId, setNextId] = useState(0);
  const complete = note.trim().length > 0 && tasks.some(task => task.done);
  function reset() { setScene(0); setNote(""); setDraft(""); setTasks([]); }
  return <section id="try-pokit" className={styles.section} aria-labelledby="demo-title">
    <header data-reveal="text" className={styles.heading}><p>{appName(locale)} / DEMO</p><h2 id="demo-title">{copy.title}</h2><p>{copy.intro}</p></header>
    <div data-reveal="text" className={styles.workspace}>
      <div className={styles.controls}>
        <fieldset><legend>01 / {copy.choose}</legend><div className={styles.scenes}>{art.map((image, index) => <button key={index} type="button" aria-pressed={scene === index} onClick={() => setScene(index)}><Image src={image} alt="" sizes="100px" /><span>{copy.scenes[index]}</span></button>)}</div></fieldset>
        <label className={styles.label} htmlFor="demo-note">02 / {copy.note}</label>
        <textarea id="demo-note" maxLength={300} rows={3} placeholder={copy.placeholder} value={note} onChange={event => setNote(event.target.value)} />
        <form onSubmit={event => { event.preventDefault(); if (!draft.trim() || tasks.length >= 5) return; setTasks([...tasks, { id: nextId, text: draft.trim(), done: false }]); setNextId(nextId + 1); setDraft(""); }}>
          <label className={styles.label} htmlFor="demo-task">03 / {copy.task} <small>({tasks.length}/5)</small></label>
          <div className={styles.add}><input id="demo-task" maxLength={80} placeholder={copy.taskPlaceholder} value={draft} onChange={event => setDraft(event.target.value)} disabled={tasks.length >= 5} /><button disabled={!draft.trim() || tasks.length >= 5}>{copy.add}</button></div>
        </form>
        <button type="button" className={styles.reset} onClick={reset}>{copy.reset} ↺</button>
      </div>
      <div className={styles.card}>
        <div className={styles.picture}><Image src={art[scene]} alt={copy.scenes[scene]} sizes="(max-width: 760px) 90vw, 420px" /></div>
        <div className={styles.cardBody}><p className={styles.sceneName}>{copy.scenes[scene]}</p><p className={styles.memo}>{note.trim() || copy.empty}</p>
          <ul className={styles.tasks}>{tasks.map(task => <li key={task.id}><label><input type="checkbox" checked={task.done} onChange={() => setTasks(tasks.map(item => item.id === task.id ? { ...item, done: !item.done } : item))} /><span className={task.done ? styles.done : undefined}>{task.text}</span></label><button type="button" aria-label={`${copy.remove}: ${task.text}`} onClick={() => setTasks(tasks.filter(item => item.id !== task.id))}>×</button></li>)}</ul>
        </div>
      </div>
    </div>
    <footer className={styles.footer}><p aria-live="polite">{complete ? copy.complete : copy.cta}</p><AppStoreBadge locale={locale} label={copy.download} /><small>{copy.notice}</small></footer>
  </section>;
}
