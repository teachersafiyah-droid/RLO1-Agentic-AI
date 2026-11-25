'use strict';
(()=>{
const names=['cover','intro','description','outcomes','guidelines'];
const key='ai-career-introduction-v1';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const digits=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[Number(d)]);
let data={viewed:[],completed:[],coverStarted:false,videoEnded:false,stations:[],outcomes:[],rules:[],ready:false};
try{const parsed=JSON.parse(localStorage.getItem(key)||'null');if(parsed&&typeof parsed==='object')data={...data,...parsed}}catch(e){console.warn('تعذر استعادة التقدم المخزن.');}
const save=()=>{try{localStorage.setItem(key,JSON.stringify(data))}catch(e){console.warn('تعذر حفظ التقدم في هذا المتصفح.')}};
const add=(field,value)=>{if(!data[field].includes(value))data[field].push(value);save()};
const has=(field,value)=>data[field].includes(value);
const valid=s=>names.includes(s)?s:'cover';
function progress(){
  data.completed=[];
  if(data.coverStarted)data.completed.push('cover');
  if(data.videoEnded)data.completed.push('intro');
  if(data.stations.length===5)data.completed.push('description');
  if(data.outcomes.length===5)data.completed.push('outcomes');
  if(data.rules.length===8&&data.ready)data.completed.push('guidelines');
  const pct=Math.round(data.completed.length/5*100);
  $('#percent').textContent=digits(pct)+'٪';$('#progressFill').style.width=pct+'%';
  $('#progressBar').setAttribute('aria-valuenow',String(pct));
  names.forEach(n=>{const el=document.querySelector('[data-check="'+n+'"]');el.textContent=data.completed.includes(n)?'✓':has('viewed',n)?'•':'○';el.setAttribute('aria-label',data.completed.includes(n)?'مكتمل':has('viewed',n)?'تمت الزيارة':'لم يُزر')});
  save();
}
function route(){const current=valid(location.hash.replace('#',''));names.forEach(n=>{$('#'+n).hidden=n!==current;const a=$('[data-nav="'+n+'"]');a.classList.toggle('active',n===current);if(n===current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});add('viewed',current);progress();closeMenu();window.scrollTo({top:0,behavior:'instant'});}
function openMenu(){$('#side').classList.add('open');$('#overlay').hidden=false;$('#menuBtn').setAttribute('aria-expanded','true');$('#closeMenu').focus()}
function closeMenu(){$('#side').classList.remove('open');$('#overlay').hidden=true;$('#menuBtn').setAttribute('aria-expanded','false')}
$('#menuBtn').addEventListener('click',openMenu);$('#closeMenu').addEventListener('click',()=>{closeMenu();$('#menuBtn').focus()});$('#overlay').addEventListener('click',closeMenu);
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#side').classList.contains('open')){closeMenu();$('#menuBtn').focus()}});
window.addEventListener('hashchange',route);$$('[data-next]').forEach(b=>b.addEventListener('click',()=>location.hash=b.dataset.next));$$('[data-prev]').forEach(b=>b.addEventListener('click',()=>location.hash=b.dataset.prev));
const stations=[
 ['RLO 01','وكلاء الذكاء الاصطناعي: المفهوم وآلية العمل والتطبيقات','تستكشف المتعلمة مفهوم الوكيل الذكي وخصائصه، وتتابع كيفية تنفيذ المهام وتطبيقاته المهنية.'],
 ['RLO 02','وكيل المواءمة الوظيفية وتحليل فجوة المهارات','تحلل المتعلمة مدى توافق مهاراتها مع متطلبات وظيفة مستهدفة، وتحدد فجوات المهارات بمساعدة وكيل.'],
 ['RLO 03','وكيل التدريب على المقابلات المهنية','تتدرب المتعلمة على الاستجابة لأسئلة المقابلات، وتستخدم التغذية الراجعة لتطوير استعدادها المهني.'],
 ['RLO 04','وكيل محاكاة مواقف العمل','تحلل المتعلمة موقفًا مهنيًا في تصميم التعليم، وتختار القرار الأنسب مع تبريره.'],
 ['RLO 05','بناء وكيل الإرشاد والتوظيف المهني باستخدام Claude Code','تبني المتعلمة وكيلًا ذكيًا لتلقي الملف المهني والبحث عن الوظائف وتحليل الفرص ومراجعة النتائج.']
];
function setStation(i,track){i=Number(i);const t=stations[i];if(!t)return;$('#stationId').textContent=t[0];$('#stationTitle').textContent=t[1];$('#stationText').textContent=t[2];$$('[data-station]').forEach(b=>{const yes=+b.dataset.station===i;b.classList.toggle('active',yes);b.setAttribute('aria-pressed',String(yes))});if(track){add('stations',i);progress()}}
$$('[data-station]').forEach(b=>b.addEventListener('click',()=>setStation(b.dataset.station,true)));
const outcomes=[
 ['الوحدة الأولى / RLO1','المهارة المستهدفة: الفهم والتمييز','تحدد المتعلمة خصائص نظام وكيلي في مثال مهني، وتشرح ما يميزه عن أداة تقدم إجابة فقط.'],
 ['الوحدة الثانية / RLO2','المهارة المستهدفة: التحليل','تقارن المتعلمة مهاراتها بمتطلبات وظيفة مستهدفة باستخدام وكيل، وتحدد فجوات المهارات.'],
 ['الوحدة الثالثة / RLO3','المهارة المستهدفة: التطبيق','تجري المتعلمة مقابلة تدريبية باستخدام وكيل، وتطبق استراتيجيات لتحسين إجاباتها.'],
 ['الوحدة الرابعة / RLO4','المهارة المستهدفة: التقويم واتخاذ القرار','تختار المتعلمة القرار الأنسب لموقف مهني افتراضي في تصميم التعليم، وتوضح سبب اختيارها.'],
 ['الوحدة الخامسة / RLO5','المهارة المستهدفة: البناء والتطبيق','تبني المتعلمة وكيل إرشاد وتوظيف مهني باستخدام Claude Code، وتختبر مدخلاته ومخرجاته.']
];
function setOutcome(i,track){i=Number(i);const t=outcomes[i];if(!t)return;$('#outcomeUnit').textContent=t[0];$('#outcomeSkill').textContent=t[1];$('#outcomeExample').textContent=t[2];$$('[data-outcome]').forEach(b=>{const yes=+b.dataset.outcome===i;b.classList.toggle('active',yes);b.setAttribute('aria-pressed',String(yes))});if(track){add('outcomes',i);progress()}}
$$('[data-outcome]').forEach(b=>b.addEventListener('click',()=>setOutcome(b.dataset.outcome,true)));
const rules=$$('#rules details');rules.forEach((detail,i)=>detail.addEventListener('toggle',()=>{if(detail.open){add('rules',i);progress();updateReady()}}));
function updateReady(){const checkbox=$('#readyCheckbox');checkbox.checked=!!data.ready;const completeRules=data.rules.length===8;checkbox.disabled=!completeRules;const active=completeRules&&data.ready;$('#launchLink').classList.toggle('disabled',!active);$('#launchLink').setAttribute('aria-disabled',String(!active));$('#launchLink').tabIndex=active?0:-1;$('#readyHint').textContent=completeRules?'يمكنك تأكيد الاستعداد ثم بدء الوحدة الأولى.':`استكشفي الإرشادات الثمانية أولًا (${digits(data.rules.length)} من ٨).`}
$('#readyCheckbox').addEventListener('change',e=>{data.ready=!!e.target.checked;save();updateReady();progress()});
$('#launchLink').addEventListener('click',e=>{if($('#launchLink').getAttribute('aria-disabled')==='true')e.preventDefault()});
$('#coverStart').addEventListener('click',()=>{data.coverStarted=true;save();progress();location.hash='intro';});
const video=$('#introVideo'),placeholder=$('#videoPlaceholder');
function videoState(){placeholder.hidden=false;video.hidden=true;}
video.addEventListener('loadedmetadata',()=>{if(video.videoWidth>0){placeholder.hidden=true;video.hidden=false}});
video.addEventListener('error',videoState);video.addEventListener('ended',()=>{data.videoEnded=true;save();progress()});
video.load();
$('#resetBtn').addEventListener('click',()=>{if(!confirm('هل تريدين إعادة ضبط تقدم المقدمة فقط؟ لن يتأثر تقدم الوحدة الأولى.'))return;data={viewed:[],completed:[],videoEnded:false,stations:[],outcomes:[],rules:[],ready:false};rules.forEach(d=>d.open=false);setStation(0,false);setOutcome(0,false);save();updateReady();location.hash='cover';route()});
// تقدم الفيديو مرتبط بحدث ended، وليس بفتح الشاشة أو مدة تقديرية.
setStation(0,false);setOutcome(0,false);updateReady();route();
})();
