"use client";

import { appName } from "@/config/site";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import coffee from "@/assets/app-demo/coffee.webp";
import walk from "@/assets/app-demo/walk.webp";
import books from "@/assets/app-demo/books.webp";
import { AppStoreBadge } from "@/components/app-store-badge";
import type { Locale } from "@/i18n/config";
import styles from "./app-demo.module.css";

type Copy = {
  title: string; intro: string; scenes: string[]; choose: string; note: string;
  placeholder: string; task: string; taskPlaceholder: string; add: string;
  remove: string; reset: string; empty: string; complete: string; cta: string;
  notice: string; download: string; dayPage: string; step: string; saveScene: string;
  addScene: string; sceneCount: string; optional: string; today: string;
};
type Task = { id: number; text: string; done: boolean };
type Entry = { id: number; scene: number; note: string; tasks: Task[] };
const art = [coffee, walk, books];

export function AppDemo({ locale, copy }: { locale: Locale; copy: Copy }) {
  const [scene, setScene] = useState(0);
  const [note, setNote] = useState("");
  const [draft, setDraft] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [nextId, setNextId] = useState(0);
  const [nextTaskId, setNextTaskId] = useState(0);
  const entryCanBeSaved = note.trim().length > 0 || tasks.length > 0;

  function reset() {
    setScene(0); setNote(""); setDraft(""); setTasks([]); setEntries([]);
    setNextId(0); setNextTaskId(0);
  }
  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim() || tasks.length >= 5) return;
    setTasks([...tasks, { id: nextTaskId, text: draft.trim(), done: false }]);
    setNextTaskId(nextTaskId + 1); setDraft("");
  }
  function saveScene() {
    if (!entryCanBeSaved || entries.length >= 5) return;
    setEntries([...entries, { id: nextId, scene, note: note.trim(), tasks }]);
    setNextId(nextId + 1); setScene((scene + 1) % art.length); setNote(""); setDraft(""); setTasks([]);
  }
  function toggleTask(entryId: number, taskId: number) {
    setEntries(entries.map(entry => entry.id === entryId ? {
      ...entry, tasks: entry.tasks.map(task => task.id === taskId ? { ...task, done: !task.done } : task),
    } : entry));
  }
  const hasEntries = entries.length > 0;

  return <section id="try-pokit" className={styles.section} aria-labelledby="demo-title">
    <header data-reveal="text" className={styles.heading}>
      <p>{appName(locale)} / DEMO</p><h2 id="demo-title">{copy.title}</h2><p>{copy.intro}</p>
    </header>
    <div data-reveal="text" className={styles.workspace}>
      <div className={styles.controls}>
        <p className={styles.progress}>{copy.step} 01 <span aria-hidden="true">·</span> {copy.choose}</p>
        <fieldset><legend>{copy.choose}</legend><div className={styles.scenes}>{art.map((image, index) => <button key={index} type="button" aria-pressed={scene === index} onClick={() => setScene(index)}><Image placeholder="blur" src={image} alt="" sizes="100px" /><span>{copy.scenes[index]}</span></button>)}</div></fieldset>
        <label className={styles.label} htmlFor="demo-note">{copy.step} 02 <span aria-hidden="true">·</span> {copy.note}</label>
        <textarea id="demo-note" maxLength={300} rows={3} placeholder={copy.placeholder} value={note} onChange={event => setNote(event.target.value)} />
        <form onSubmit={addTask}>
          <label className={styles.label} htmlFor="demo-task">{copy.step} 03 <span aria-hidden="true">·</span> {copy.task} <small>{copy.optional}</small></label>
          <div className={styles.add}><input id="demo-task" maxLength={80} placeholder={copy.taskPlaceholder} value={draft} onChange={event => setDraft(event.target.value)} disabled={tasks.length >= 5} /><button disabled={!draft.trim() || tasks.length >= 5}>{copy.add}</button></div>
        </form>
        <div className={styles.actions}>
          <button type="button" className={styles.save} onClick={saveScene} disabled={!entryCanBeSaved || entries.length >= 5}>{hasEntries ? copy.addScene : copy.saveScene}</button>
          <button type="button" className={styles.reset} onClick={reset}>{copy.reset} ↺</button>
        </div>
        {hasEntries && <p className={styles.savedHint} aria-live="polite">{copy.sceneCount.replace("{count}", String(entries.length))}</p>}
      </div>
      <div className={styles.diary}>
        <div className={styles.diaryHeader}><p>{copy.today}</p><h3>{copy.dayPage}</h3></div>
        {hasEntries ? <div className={styles.entries}>{entries.map((entry, index) => <article className={styles.entry} key={entry.id}>
          <div className={styles.entryPicture}><Image placeholder="blur" src={art[entry.scene]} alt={copy.scenes[entry.scene]} sizes="(max-width: 760px) 80vw, 360px" /></div>
          <div className={styles.entryBody}><p className={styles.sceneName}><span>0{index + 1}</span>{copy.scenes[entry.scene]}</p>
            {entry.note && <p className={styles.memo}>{entry.note}</p>}
            {entry.tasks.length > 0 && <ul className={styles.tasks}>{entry.tasks.map(task => <li key={task.id}><label><input type="checkbox" checked={task.done} onChange={() => toggleTask(entry.id, task.id)} /><span className={task.done ? styles.done : undefined}>{task.text}</span></label></li>)}</ul>}
          </div>
        </article>)}</div> : <article className={`${styles.entry} ${styles.preview}`}>
          <div className={styles.entryPicture}><Image placeholder="blur" src={art[scene]} alt={copy.scenes[scene]} sizes="(max-width: 760px) 80vw, 360px" /></div>
          <div className={styles.entryBody}><p className={styles.sceneName}><span>01</span>{copy.scenes[scene]}</p><p className={styles.memo}>{note.trim() || copy.empty}</p>
            {tasks.length > 0 && <ul className={styles.tasks}>{tasks.map(task => <li key={task.id}><label><input type="checkbox" checked={task.done} onChange={() => setTasks(tasks.map(item => item.id === task.id ? { ...item, done: !item.done } : item))} /><span className={task.done ? styles.done : undefined}>{task.text}</span></label><button type="button" aria-label={`${copy.remove}: ${task.text}`} onClick={() => setTasks(tasks.filter(item => item.id !== task.id))}>×</button></li>)}</ul>}
          </div>
        </article>}
      </div>
    </div>
    <footer className={styles.footer}><p aria-live="polite">{hasEntries ? copy.complete : copy.cta}</p><AppStoreBadge locale={locale} label={copy.download} /><small>{copy.notice}</small></footer>
  </section>;
}
