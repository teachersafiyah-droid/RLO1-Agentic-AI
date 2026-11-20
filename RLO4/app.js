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

const wonder=[
['أنفذ المطلوب حتى لو تضررت جودة التعلم.','قد تحافظ هذه الاستجابة على الوقت لكنها تعرّض جودة التعلم للخطر.'],
['أرفض الطلب دون توضيح أو بدائل.','يحمي الرفض الجودة ظاهريًا لكنه يصعّب التعاون وإدارة الوقت.'],
['أوضح أثر الطلب على التعلم وأقترح بديلًا واقعيًا.','استجابة متوازنة: توضح المشكلة والبديل والمفاضلات.'],
['أنتظر تعليمات إضافية دون تواصل.','قد يُهدر الانتظار وقتًا ويزيد الارتباك لدى الفريق.']];
function renderWonder(){const el=$('#wonder');el.innerHTML='';wonder.forEach((a,i)=>{const b=option(a[0],()=>{state.wonder=i;save();renderWonder();note('wonderFeed',a[1]+' ستظهر إجابتك في المرآة.');done(2);});b.className='wonder-choice'+(state.wonder===i?' active':'');const info=document.createElement('span');info.textContent='اضغطي لمعرفة أثر الاستجابة';b.append(info);el.append(b);});}renderWonder();
const understand=['أقبل حكم المحاكاة دون سؤال.','أقارن افتراضاتها بأدلة الحالة وأثر القرار على الجودة والوقت والعلاقة.','أختار الحل الأسرع فقط.'];
understand.forEach((a,i)=>$('#understandQuiz').append(option(a,()=>{state.understand=i;save();$('#understandQuiz button').forEach((b,j)=>b.classList.toggle('selected',i===j));note('understandFeed',i===1?'صحيح: المحاكاة تثير التفكير، لكنها لا تملك جميع تفاصيل العمل الحقيقي.':'يجب مراجعة المعطيات وأثر كل قرار على الجودة والوقت والعلاقة.');if(i===1)done(3);})));
const classData=[
['نبي الشرح كله في صورة واحدة','ظاهر','وصف للحل المطلوب وليس لحاجة المتعلمات.'],
['المتعلمات يواجهن صعوبة في تذكر خطوات النشاط','حقيقي','يوضح مشكلة تعليمية يمكن التحقق منها.'],
['احذفوا نشاط المراجعة لتوفير الوقت','ظاهر','حل مقترح يحتاج فحص أثره على التعلم.'],
['طول الإرشادات يؤخر إنجاز المهمة','حقيقي','يوضح احتياجًا يتعلق بوضوح التعليمات.'],
['نبي التصميم بألوان جديدة','ظاهر','طلب تصميمي لا يشرح مشكلة تعلم.'],
['المتعلمات لا يعرفن كيف يصححن الخطأ','حقيقي','احتياج للتغذية الراجعة والدعم.']];
function renderClass(){const root=$('#classify');root.innerHTML='';classData.forEach((d,i)=>{const card=document.createElement('div');card.className='class-card';card.dataset.card=i;const label=document.createElement('div');label.className='situation';label.textContent=d[0];const select=document.createElement('select');select.setAttribute('aria-label','تصنيف العبارة '+(i+1));[['','اختاري التصنيف'],['ظاهر','الطلب الظاهر'],['حقيقي','الاحتياج الحقيقي']].forEach(([v,t])=>{const op=document.createElement('option');op.value=v;op.textContent=t;select.append(op)});select.value=state.classify[i]||'';select.onchange=()=>{state.classify[i]=select.value;save()};card.append(label,select);root.append(card);});}
$('#checkClassify').onclick=()=>{if(classData.some((_,i)=>!state.classify[i])){note('classifyFeed','صنفي العبارات الست أولًا.');return;}let score=0;classData.forEach((d,i)=>{const card=$('[data-card="'+i+'"]');const ok=state.classify[i]===d[1];if(ok)score++;card.classList.toggle('correct',ok);card.classList.toggle('incorrect',!ok);let old=$('.explain',card);if(old)old.remove();const msg=document.createElement('small');msg.className='explain';msg.textContent=(ok?'✓ ':'✗ الصحيح: '+(d[1]==='ظاهر'?'الطلب الظاهر':'الاحتياج الحقيقي')+' — ')+d[2];card.append(msg);});note('classifyFeed','نتيجتك '+score+' من 6. '+(score===6?'نجحتِ في التمييز بين الطلب والاحتياج.':'راجعي التفسير تحت كل بطاقة، ويمكنك تعديل تصنيفها.'));if(score===6)done(4);};
$('#resetClassify').onclick=()=>{state.classify={};state.done=state.done.filter(n=>n!==4);save();renderClass();updateNav();note('classifyFeed','يمكنك المحاولة مرة أخرى.');};renderClass();

/* INSERT_ACTIVITIES */
const m=location.hash.match(/^#screen-(\d+)$/);go(m?+m[1]:1,false);
})();