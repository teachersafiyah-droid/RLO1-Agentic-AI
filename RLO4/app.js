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


const kinds=['تضحي بالجودة','تضحي بالوقت','تضحي بالعلاقة','متوازنة'];
const balanceData=[
['نشر محتوى دون اختبار ومراجعة',0,'إلغاء المراجعة يضعف الجودة.'],
['إعادة بناء الدرس كاملًا لتعديل جزئي صغير',1,'قد يستهلك الوقت دون حاجة.'],
['رفض النقاش مع العميل بلهجة هجومية',2,'يضعف العلاقة المهنية.'],
['مناقشة حد آمن للجودة مع بدائل مناسبة للموعد',3,'يحافظ على الجودة والتعاون والوقت.'],
['تنفيذ تغيير دون إبلاغ بقية الفريق',2,'يضعف التواصل والتعاون.']];
function renderBalance(){const root=$('#balance');root.innerHTML='';balanceData.forEach((d,i)=>{const c=document.createElement('div');c.className='balance-card';c.dataset.balance=i;const h=document.createElement('h3');h.textContent=(i+1)+'. '+d[0];const s=document.createElement('select');s.setAttribute('aria-label','تصنيف استجابة '+(i+1));[['','اختاري وصف الاستجابة'],...kinds.map((x,j)=>[String(j),x])].forEach(([v,t])=>{const o=document.createElement('option');o.value=v;o.textContent=t;s.append(o)});s.value=state.balance[i]??'';s.onchange=()=>{state.balance[i]=s.value;save()};c.append(h,s);root.append(c)})}
$('#checkBalance').onclick=()=>{if(balanceData.some((_,i)=>state.balance[i]===undefined||state.balance[i]==='')){note('balanceFeed','صنفي الاستجابات الخمس أولًا.');return}let score=0;balanceData.forEach((d,i)=>{const el=$('[data-balance="'+i+'"]');let ok=Number(state.balance[i])===d[1];if(ok)score++;el.classList.toggle('correct',ok);el.classList.toggle('incorrect',!ok);let old=$('.balance-detail',el);if(old)old.remove();const s=document.createElement('small');s.className='balance-detail';s.textContent=(ok?'✓ ':'✗ الأصح: '+kinds[d[1]]+'. ')+d[2];el.append(s)});note('balanceFeed','النتيجة '+score+' من 5. '+(score===5?'أحسنتِ!':'راجعي تعليقات التصنيف ثم حاولي مجددًا.'));if(score===5)done(5)};
$('#resetBalance').onclick=()=>{state.balance={};state.done=state.done.filter(n=>n!==5);save();renderBalance();updateNav();note('balanceFeed','تمت إعادة النشاط.')};renderBalance();


const cases=[
{title:'عميل يطلب صورًا غير مرخصة',question:'أبغى ننشر الصور الليلة، حتى لو ما عندنا تصريح.',options:[
['أنشرها كما هي.',[24,92,48],'قد تكون هناك مشكلة حقوق نشر.'],
['أشرح المخاطر وأعرض صورًا مرخصة بديلة.',[94,76,91],'ممتاز، نراجع البديل المرخص قبل الإطلاق.'],
['أرفض التعاون دون اقتراح.',[80,17,24],'نحتاج إلى خطة بديلة.']]},
{title:'تأخر تسليم نشاط تفاعلي',question:'النشاط ما خلص والموعد بكرة، وش نسوي؟',options:[
['نحدد الأولويات ونسلم نسخة آمنة بعد اختبار الحد الأدنى ونتواصل.',[89,80,92],'الخطة واضحة ويمكن تنفيذها.'],
['نلغي فحص الجودة.',[28,96,47],'مخاطرة بأخطاء في المنتج.'],
['نلوم الفريق أمام العميل.',[43,43,13],'تضررت الثقة وما زال التأخير قائمًا.']]},
{title:'اختبار لا يتسق مع نواتج التعلم',question:'أبي اختبارًا من عشرين سؤالًا حتى لو الهدف مهاري.',options:[
['أضيف الأسئلة دون مراجعة.',[31,94,47],'زيادة العدد ليست دليلًا على جودة التقويم.'],
['أرفض الطلب بحدة.',[66,40,21],'نحتاج إلى حوار وبديل مهني.'],
['أعرض مصفوفة مواءمة وأقترح بنودًا تقيس الأداء.',[96,75,90],'نراجع البديل على أساس الهدف والدليل.']]}
];
let chosenCase=null;
function simRender(){
 const root=$('#simActivity');root.innerHTML='<h2>اختاري أحد المواقف الثلاثة</h2>';
 const menu=document.createElement('div');menu.className='choices';
 cases.forEach((item,i)=>menu.append(option(item.title,()=>{chosenCase=i;simRender();$('#simBars').innerHTML='';note('simFeed','اختاري استجابة بعد قراءة طلب الطرف الآخر.')})));
 root.append(menu);
 if(chosenCase===null)return;
 const c=cases[chosenCase],a=document.createElement('div');a.className='alert';a.textContent='رسالة الطرف الآخر: '+c.question;root.append(a);
 const area=document.createElement('div');area.className='choices';
 c.options.forEach(item=>{
  area.append(option(item[0],()=>{
   const names=['الجودة','الوقت','العلاقة'];
   $('#simBars').innerHTML='<div class="sim-outcome">مؤشرات افتراضية لتوضيح المفاضلات، وليست تنبؤات أو نسب أداء حقيقية.</div>'+item[1].map((v,i)=>'<div class="sim-meter"><span>'+names[i]+'</span><div class="meter"><span style="width:'+v+'%"></span></div><strong>'+v+'</strong></div>').join('');
   note('simFeed','رد الطرف الآخر: '+item[2]);
   if(!state.simHistory.includes(chosenCase))state.simHistory.push(chosenCase);
   save();if(state.simHistory.length===3)done(6);
  }));
 });
 root.append(area);
}
$('#simReset').onclick=()=>{state.simHistory=[];state.done=state.done.filter(x=>x!==6);chosenCase=null;save();simRender();$('#simBars').innerHTML='';note('simFeed','ابدئي المحاكاة من جديد.');updateNav()};
simRender();


const chats=[
{message:'يا أستاذة، العميل يطلب نشر صور لم نتحقق من حقوق استخدامها، كيف نرد عليه؟',answers:[
['انشري الصور فورًا.','هذا يعرّض المؤسسة لمخاطر.'],
['اشرحي المخاطر واقترحي بديلًا مرخصًا مع موعد محدد.','هذا حل عملي، شكرًا!'],
['قولي له كلامًا قاسيًا عن جودة طلبه.','يمكن نخسر التعاون حتى لو كانت ملاحظتنا صحيحة.']]},
{message:'الفريق متأخر بالتسليم، وش نسوي عشان ما نخسر الموعد؟',answers:[
['نحدد الأجزاء الحرجة، ونختبر الأساسيات، ونوضح خطة التسليم.','ممتاز، صار عندنا تصور واضح.'],
['نوقف مراجعة الجودة كلها.','يمكن نسلم بسرعة لكن بأخطاء كثيرة.'],
['نترك كل شخص يتصرف لحاله.','هذا يزيد التشتت.']]},
{message:'المديرة تبي اختبار طويل وهو ما يقيس الهدف، كيف أناقشها؟',answers:[
['أوافق دون مراجعة.','الكمية لا تكفي للحكم على الجودة.'],
['أعرض مواءمة البنود مع الهدف وأقترح بديلًا مع دليل.','أبدعتِ، كذا أوضح موقفي باحترام.'],
['أهاجم رأيها أمام الفريق.','الخلاف المهني يحتاج احترامًا وتبريرًا.']]}
];
function chatRender(){
 const root=$('#chatActivity');root.innerHTML='';
 state.chat.forEach((choiceIndex,i)=>{
  const c=chats[i];
  const first=document.createElement('div');first.className='bubble other';first.textContent=c.message;root.append(first);
  const mine=document.createElement('div');mine.className='bubble mine';mine.textContent=c.answers[choiceIndex][0];root.append(mine);
  const response=document.createElement('div');response.className='bubble other';response.textContent=c.answers[choiceIndex][1];root.append(response);
 });
 if(state.chat.length===3){const msg=document.createElement('div');msg.className='bubble other';msg.textContent='الحين عرفت إن القرار يحتاج موازنة بين الجودة والوقت والعلاقة، ويحتاج تبريرًا.';root.append(msg);done(7);return}
 const idx=state.chat.length,c=chats[idx],q=document.createElement('div');q.className='bubble other';q.textContent=c.message;root.append(q);
 const options=document.createElement('div');options.className='chat-options';
 c.answers.forEach((x,i)=>options.append(option(x[0],()=>{state.chat.push(i);save();chatRender();note('chatFeed',x[1])})));
 root.append(options);
}
$('#chatReset').onclick=()=>{state.chat=[];state.done=state.done.filter(x=>x!==7);save();chatRender();updateNav();note('chatFeed','بدأت محادثة جديدة.')};chatRender();
const enrich=[
['ما جوهر المشكلة؟','افصلي بين الطلب الظاهر والاحتياج التعليمي الذي تؤيده الأدلة.'],
['من يتأثر بالقرار؟','انظري إلى المتعلمين والعميل وفريق التطوير ودرجة تأثير الاستجابة عليهم.'],
['ما أثر القرار على الجودة والوقت والعلاقة؟','قد يحسن الخيار أحد الأبعاد ويؤثر في بُعد آخر. قارني البدائل.'],
['من يملك القرار النهائي؟','يمكن للوكيل اقتراح بدائل، لكن الموافقة والتنفيذ مسؤولية أصحاب الصلاحية.']
];
enrich.forEach(([title,info])=>{
 const btn=document.createElement('button');btn.type='button';btn.className='flip-card';btn.setAttribute('aria-label','اكشفي البطاقة: '+title);
 btn.innerHTML='<strong>'+title+'</strong><span>اضغطي للكشف</span>';
 btn.onclick=()=>{const on=btn.classList.toggle('flipped');btn.innerHTML='<strong>'+title+'</strong><span>'+(on?info:'اضغطي للكشف')+'</span>'};
 $('#enrich').append(btn);
});


const answers1=['أنشر الصور حتى لا يفوت الموعد.','أرفض دون طرح خيارات.','أوضح خطر الحقوق وأقترح صورة مرخصة وأطلب اعتماد البديل.'];
const answers2=['أوازن بين الجودة والوقت والعلاقة.','أقبل كل اقتراح من المحاكاة دون مراجعة.','أقيّم أثر الاستجابة على الأطراف المتأثرة.','أبرر القرار بناءً على أدلة الحالة.','أدخل بيانات العملاء الشخصية في المحاكاة دون موافقة.'];
function finalRender(){
 const root=$('#finalQuiz');root.innerHTML='';
 const one=document.createElement('div');one.className='final-question';one.innerHTML='<h3>1. يريد العميل استخدام صور غير مؤكدة الترخيص. ما الاستجابة المهنية الأفضل؟</h3>';
 answers1.forEach((t,i)=>{const label=document.createElement('label');const input=document.createElement('input');input.type='radio';input.name='finalOne';input.value=i;input.checked=state.finalOne===i;input.onchange=()=>{state.finalOne=i;save()};label.append(input,document.createTextNode(t));one.append(label)});root.append(one);
 const two=document.createElement('div');two.className='final-question';two.innerHTML='<h3>2. ما الممارسات المناسبة عند استخدام وكيل محاكاة مواقف العمل؟ اختاري كل الصحيح.</h3>';
 answers2.forEach((t,i)=>{const label=document.createElement('label');const input=document.createElement('input');input.type='checkbox';input.value=i;input.checked=state.finalMany.includes(i);input.onchange=()=>{state.finalMany=input.checked?[...new Set([...state.finalMany,i])]:state.finalMany.filter(x=>x!==i);save()};label.append(input,document.createTextNode(t));two.append(label)});root.append(two);
}
$('#checkFinal').onclick=()=>{
 if(state.finalOne===null||!state.finalMany.length){note('finalFeed','أجيبي عن السؤالين أولًا.');return}
 const first=state.finalOne===2,second=state.finalMany.length===3&&[0,2,3].every(x=>state.finalMany.includes(x));
 const explanation1=first?'السؤال الأول صحيح: استجابة تحترم حقوق الصور وتقدم بديلًا عمليًا.':'السؤال الأول: ينبغي تجنب انتهاك الحقوق، مع اقتراح بديل قابل للتنفيذ.';
 const explanation2=second?'السؤال الثاني صحيح: الموازنة، وتحليل الأطراف، وتبرير القرار بالأدلة.':'السؤال الثاني: الصحيح هو الموازنة، وتقييم أثر القرار، وتبريره بالأدلة؛ لا نقبل حكم المحاكاة دون تحقق ولا نشارك بيانات خاصة.';
 note('finalFeed',explanation1+' '+explanation2+(first&&second?' ✓ اجتزتِ التقويم الختامي.':' يمكنك المحاولة مجددًا.'));
 if(first&&second)done(9);
};
$('#resetFinal').onclick=()=>{state.finalOne=null;state.finalMany=[];state.done=state.done.filter(x=>x!==9);save();finalRender();updateNav();note('finalFeed','تمت إعادة التقويم.')};finalRender();
function mirrorUI(){
 $('#oldWonder').textContent=state.wonder===null?'لم تختاري قرارًا في بداية الوحدة بعد. يمكنك العودة إلى «أتساءل».':wonder[state.wonder][0];
 $('#reflection').value=state.reflection||'';
}
$('#saveReflection').onclick=()=>{
 const t=$('#reflection').value.trim();
 if(t.length<25){note('mirrorFeed','اكتبي تأملًا واضحًا من 25 حرفًا على الأقل، مع تبرير قرارك.');return;}
 state.reflection=t;save();done(10);
 note('mirrorFeed','✓ حُفظ تأملك محليًا. خلاصة الوحدة: أحدد، ثم أوازن، ثم أحاكي، ثم أقرر وأبرر.');
};

const m=location.hash.match(/^#screen-(\d+)$/);go(m?+m[1]:1,false);
})();