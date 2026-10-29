export const TODAY_CARDS_KEY='your-day-web-cards-v1';
export type TodayCard={id:string;date:string;kind:'reading'|'health'|'fasting'|'custom';title:string;note:string;value:string;unit:string;completed:boolean;startedAt?:number;finishedAt?:number};
export type CardStore={version:1;revision:string;cards:TodayCard[]};
export function parseCardStore(raw:string|null):CardStore {
 if(raw===null)return {version:1,revision:'',cards:[]};
 const data=JSON.parse(raw) as CardStore;
 if(data?.version!==1||typeof data.revision!=='string'||!Array.isArray(data.cards)||!data.cards.every(c=>c&&['reading','health','fasting','custom'].includes(c.kind)&&['id','date','title','note','value','unit'].every(k=>typeof c[k as keyof TodayCard]==='string')&&/^\d{4}-\d{2}-\d{2}$/.test(c.date)&&typeof c.completed==='boolean'&&(c.startedAt===undefined||Number.isFinite(c.startedAt))&&(c.finishedAt===undefined||Number.isFinite(c.finishedAt)))||new Set(data.cards.map(c=>c.id)).size!==data.cards.length)throw new Error('invalid');
 return data;
}
export function changeCards(latest:CardStore,expected:string,cards:TodayCard[],revision:string):CardStore {
 if(latest.revision!==expected)throw new Error('conflict');
 return parseCardStore(JSON.stringify({version:1,revision,cards}));
}
