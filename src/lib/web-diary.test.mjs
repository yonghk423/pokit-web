import assert from 'node:assert/strict';
import test from 'node:test';
import {parseDiaryStore,saveDiary} from './web-diary.ts';
const diary={id:'one',title:'A quiet day',date:'2026-10-29',updatedAt:'v1',scenes:[{id:'scene',art:0,note:'Coffee by the window.'}]};
test('first visit is empty; saved scenes survive a JSON round trip',()=>{
 assert.deepEqual(parseDiaryStore(null),{version:1,diaries:[]});
 const store=saveDiary(parseDiaryStore(null),diary);
 assert.deepEqual(parseDiaryStore(JSON.stringify(store)).diaries[0],diary);
});
test('corrupt data and unsupported versions are rejected rather than erased',()=>{
 for(const raw of ['bad json',JSON.stringify({version:2,diaries:[]}),JSON.stringify({version:1,diaries:[{...diary,scenes:[{id:'bad',art:999,note:'bad'}]}]})]) assert.throws(()=>parseDiaryStore(raw));
});
test('saving one diary preserves other entries and does not mutate the previous store',()=>{
 const store={version:1,diaries:[diary,{...diary,id:'two'}]};
 const saved=saveDiary(store,{...diary,title:'Updated',updatedAt:'v2'},'v1');
 assert.equal(saved.diaries.length,2);assert.equal(saved.diaries[0].title,'Updated');assert.equal(store.diaries[0].title,'A quiet day');
});
test('a stale tab cannot overwrite a more recent diary',()=>{
 assert.throws(()=>saveDiary({version:1,diaries:[{...diary,updatedAt:'newer'}]},diary,'v1'),/conflict/);
});

test('all four web locales have complete copy and valid app-link locales', async()=>{
 const {webLocales,webDiaryCopy,webAppLocale,isWebLocale}=await import('../content/web-diary-copy.ts');
 assert.deepEqual(webLocales,['ko','en','ja','zh-TW']);
 for(const locale of webLocales){
  assert.equal(isWebLocale(locale),true);
  assert.deepEqual(Object.keys(webDiaryCopy[locale]).sort(),Object.keys(webDiaryCopy.ko).sort());
  assert(Object.values(webDiaryCopy[locale]).every(value=>typeof value==='string'&&value.length>0));
  assert(['ko','en','ja'].includes(webAppLocale(locale)));
 }
 assert.equal(isWebLocale('zh-CN'),false);
});

 test('deleted diary cannot be resurrected by stale tab',()=>{assert.throws(()=>saveDiary({version:1,diaries:[]},diary,'v1'),/conflict/);});
 test('native scene fields and all 160 art indexes round trip',()=>{const expanded={...diary,characterName:'Me',scenes:[{id:'native',art:159,note:'Ink',title:'Work',time:'09:30',paper:'#F8E7B4',pen:'#243044',todos:[{id:'t',text:'Read',completed:true}]}]};assert.deepEqual(parseDiaryStore(JSON.stringify({version:1,diaries:[expanded]})).diaries[0],expanded);});
 test('invalid dates, times and duplicate IDs are rejected',()=>{for(const d of [{...diary,date:'2026-02-30'},{...diary,scenes:[{...diary.scenes[0],time:'25:00'}]},{...diary,scenes:[diary.scenes[0],diary.scenes[0]]}])assert.throws(()=>parseDiaryStore(JSON.stringify({version:1,diaries:[d]})));});
 test('scene reorder, deletion conflict and import copies preserve existing data',async()=>{const {moveScene,deleteDiary,importDiaries}=await import('./web-diary.ts');const d={...diary,scenes:[diary.scenes[0],{...diary.scenes[0],id:'b'}]};assert.equal(moveScene(d,'b',-1).scenes[0].id,'b');assert.equal(d.scenes[0].id,'scene');assert.throws(()=>deleteDiary({version:1,diaries:[d]},d.id,'stale'));assert.equal(deleteDiary({version:1,diaries:[d]},d.id,'v1').diaries.length,0);const next=importDiaries({version:1,diaries:[d]},{version:1,diaries:[d]},()=> 'copy','now');assert.equal(next.diaries.length,2);assert.equal(next.diaries[0].id,'copy');assert.deepEqual(next.diaries[1],d);});
 test('calendar includes leap day and proper weekday offset',async()=>{const {calendarDays}=await import('./web-diary.ts');const days=calendarDays('2024-02');assert.equal(days[0],null);assert.equal(days[4],'2024-02-01');assert(days.includes('2024-02-29'));assert(!calendarDays('2025-02').includes('2025-02-29'));});
 test('today cards reject corruption and stale-tab writes',async()=>{const {parseCardStore,changeCards}=await import('./web-today-cards.ts');const store=parseCardStore(null);const cards=[{id:'c',date:'2026-10-29',kind:'fasting',title:'Pause',note:'',value:'',unit:'',completed:false,startedAt:100}];const saved=changeCards(store,'',cards,'v1');assert.deepEqual(parseCardStore(JSON.stringify(saved)),saved);assert.throws(()=>changeCards(saved,'',[],'v2'),/conflict/);assert.throws(()=>parseCardStore('broken'));});
 test('four-locale tools copy has identical complete keys',async()=>{const {diaryTools}=await import('../content/web-diary-tools-copy.ts');for(const copy of Object.values(diaryTools)){assert.deepEqual(Object.keys(copy),Object.keys(diaryTools.ko));assert(Object.values(copy).every(Boolean));}});
