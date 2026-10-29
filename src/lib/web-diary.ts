export const WEB_DIARY_KEY = "your-day-web-diaries-v1";
export const ART_COUNT = 160;
export const PAPER_COLORS = ['#FFFFFF','#C8EBDD','#F8DEDF','#F8E7B4','#D5E3F6','#E6DDF3','#F6D4BF','#DEE8CB','#D8EFF0','#E7E5DF'];
export const PEN_COLORS = ['#202020','#60605E','#66564F','#243044','#3A4634','#693B48','#47436A','#275D5C','#743D2D','#65445F'];
export type DiaryTodo = {id:string;text:string;completed:boolean};
export type DiaryScene = { id: string; art: number; note: string; title?:string; time?:string; todos?:DiaryTodo[]; paper?:string; pen?:string };
export type WebDiary = { id: string; title: string; date: string; characterName?:string; scenes: DiaryScene[]; updatedAt: string };
export type DiaryStore = { version: 1; diaries: WebDiary[] };
const optionalString = (value:unknown) => value === undefined || typeof value === 'string';
export function validDate(value:string) { const d=new Date(`${value}T12:00:00Z`); return /^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===value; }
const unique = (items:{id:string}[]) => new Set(items.map(i=>i.id)).size===items.length;
/** Validate before writing; optional fields retain the original three-scene prototype data. */
export function parseDiaryStore(raw: string | null): DiaryStore {
  if (raw === null) return { version: 1, diaries: [] };
  const data = JSON.parse(raw) as DiaryStore;
  if (data?.version !== 1 || !Array.isArray(data.diaries) || !data.diaries.every(d =>
    d && typeof d.id === 'string' && typeof d.title === 'string' && typeof d.date === 'string' && validDate(d.date) && optionalString(d.characterName) && typeof d.updatedAt === 'string' && Array.isArray(d.scenes) &&
    d.scenes.every(s => s && typeof s.id === 'string' && Number.isInteger(s.art) && s.art >= 0 && s.art < ART_COUNT && typeof s.note === 'string' && optionalString(s.title) &&
      (s.time===undefined || s.time==='' || /^([01]\d|2[0-3]):[0-5]\d$/.test(s.time)) &&
      (s.paper===undefined || PAPER_COLORS.includes(s.paper)) && (s.pen===undefined || PEN_COLORS.includes(s.pen)) &&
      (s.todos===undefined || (Array.isArray(s.todos)&&s.todos.every(t=>t&&typeof t.id==='string'&&typeof t.text==='string'&&typeof t.completed==='boolean')&&unique(s.todos)))) && unique(d.scenes)
  ) || !unique(data.diaries)) throw new Error('Unrecognized diary data');
  return data;
}
export function saveDiary(store: DiaryStore, diary: WebDiary, expectedUpdatedAt?: string): DiaryStore {
  const previous = store.diaries.find(d => d.id === diary.id);
  if ((previous && previous.updatedAt !== expectedUpdatedAt) || (!previous && expectedUpdatedAt!==undefined)) throw new Error('conflict');
  const next:DiaryStore={ version: 1, diaries: [diary, ...store.diaries.filter(d => d.id !== diary.id)] };
  return parseDiaryStore(JSON.stringify(next));
}
export function deleteDiary(store:DiaryStore,id:string,expectedUpdatedAt?:string):DiaryStore {
 const previous=store.diaries.find(d=>d.id===id);
 if(!previous || previous.updatedAt!==expectedUpdatedAt) throw new Error('conflict');
 return {...store,diaries:store.diaries.filter(d=>d.id!==id)};
}
export function moveScene(diary:WebDiary,id:string,direction:-1|1):WebDiary {
 const scenes=[...diary.scenes],from=scenes.findIndex(s=>s.id===id),to=from+direction;
 if(from<0||to<0||to>=scenes.length)return diary;
 [scenes[from],scenes[to]]=[scenes[to],scenes[from]];return {...diary,scenes};
}
/** Import as new copies, so a backup can never overwrite more recent browser records. */
export function importDiaries(store:DiaryStore, incoming:DiaryStore, id:()=>string, now:string):DiaryStore {
 return parseDiaryStore(JSON.stringify({version:1,diaries:[...incoming.diaries.map(d=>({...d,id:id(),updatedAt:now})),...store.diaries]}));
}
export function calendarDays(month:string):(string|null)[] {
 const [y,m]=month.split('-').map(Number),first=new Date(y,m-1,1,12).getDay(),last=new Date(y,m,0,12).getDate();
 return Array.from({length:Math.ceil((first+last)/7)*7},(_,i)=>i<first||i>=first+last?null:`${month}-${String(i-first+1).padStart(2,'0')}`);
}
