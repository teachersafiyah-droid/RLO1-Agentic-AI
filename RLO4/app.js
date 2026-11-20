(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const key='ai-rlo4-progress-v1',titles=['البداية','الفيديو التمهيدي وأتساءل','أفهم','أحدد','أوازن','أحاكي مع الوكيل','أقرر','إثراء','التقويم الختامي','المرآة والخلاصة','المراجع والختام'];
let state={done:[],visited:[],wonder:null,understand:null,classify:{},balance:{},simHistory:[],chat:[],finalOne:null,finalMany:[],reflection:''};
try{const s=JSON.parse(localStorage.getItem(key)||'null');if(s&&typeof s==='object')state={...state,...s}}catch(e){}
for(const x of ['done','visited','simHistory','chat','finalMany'])if(!Array.isArray(state[x]))state[x]=[];
for(const x of ['classify','balance'])if(!state[x]||typeof state[x]!=='object')state[x]={};
const save=()=>{try{localStorage.setItem(key,JSON.stringify(state))}catch(e){}};
const note=(id,s)=>{const x=$('#'+id);if(x)x.textContent=s;$('#live').textContent=s;};
const option=(name,fn)=>{let b=document.createElement('button');b.type='button';b.className='option';b.textContent=name;b.onclick=fn;return b;};
let current=1;
function updateNav(){const pct=Math.round(state.done.length/11*100);$('#pct').textContent=pct+'٪';$('#bar').style.width=pct+'%';$('#progressText').textContent=state.done.length+' من 11 أقسام مكتملة';$$('#nav a').forEach((a,i)=>{const n=i+1;a.classList.toggle('active',n===current);a.setAttribute('aria-current',n===current?'page':'false');a.querySelector('.nav-check').textContent=state.done.includes(n)?'✓':state.visited.includes(n)?'•':'○'});$('#position').textContent='القسم '+current+' من 11';$('#prev').disabled=current===1;$('#next').disabled=current===11;}
function done(n){if(!state.done.includes(n)){state.done.push(n);save();updateNav();}}
function closeSide(){$('#side').classList.remove('open');$('#shade').hidden=true;$('#openNav').setAttribute('aria-expanded','false');}
function go(n,hash=true){current=Math.min(11,Math.max(1,Number(n)||1));$$('.screen').forEach((x,i)=>{x.hidden=i+1!==current;x.classList.toggle('active',i+1===current)});if(!state.visited.includes(current)){state.visited.push(current);save();}updateNav();if(hash)history.replaceState(null,'','#screen-'+current);scrollTo(0,0);closeSide();if(current===10)mirrorUI();}
$('#nav').innerHTML=titles.map((t,i)=>'<a href="#screen-'+(i+1)+'"><span class="nav-no">'+String(i+1).padStart(2,'0')+'</span><span>'+t+'</span><span class="nav-check">○</span></a>').join('');
$$('#nav a').forEach((a,i)=>a.onclick=e=>{e.preventDefault();go(i+1)});
$('#next').onclick=()=>go(current+1);$('#prev').onclick=()=>go(current-1);
$('#openNav').onclick=()=>{$('#side').classList.add('open');$('#shade').hidden=false;$('#openNav').setAttribute('aria-expanded','true');};
$('#shade').onclick=closeSide;
window.addEventListener('hashchange',()=>{const m=location.hash.match(/^#screen-(\d+)$/);if(m)go(+m[1],false)});
$('#reset').onclick=()=>{if(confirm('إعادة ضبط تقدم الوحدة الرابعة وأنشطتها فقط؟')){localStorage.removeItem(key);location.reload()}};
$$('[data-done]').forEach(b=>{const n=Number(b.dataset.done);if(state.done.includes(n)){b.textContent='✓ تم تسجيل الاطلاع';b.disabled=true;}b.onclick=()=>{done(n);b.textContent='✓ تم تسجيل الاطلاع';b.disabled=true;}});
/* INSERT_ACTIVITIES */
const m=location.hash.match(/^#screen-(\d+)$/);go(m?+m[1]:1,false);
})();