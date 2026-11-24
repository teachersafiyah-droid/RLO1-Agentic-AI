/* قائمة مسار التعلم العامة: منفصلة عن تنقل شاشات الوحدات */
(()=>{'use strict';
if(window.self!==window.top || document.getElementById('course-global-menu'))return;
const root=location.pathname.replace(/(?:(?:course|survey|RLO[1-5])\/)?(?:index\.html)?$/,'');
const current=/\/survey\//.test(location.pathname)?'survey':/\/RLO([1-5])\//.test(location.pathname)?'unit'+location.pathname.match(/\/RLO([1-5])\//)[1]:/\/course\//.test(location.pathname)?'unit'+(new URLSearchParams(location.search).get('unit')||'1'):'intro';
const links=[['intro','المقدمة العامة',root],...Array.from({length:5},(_,i)=>['unit'+(i+1),'الوحدة '+['الأولى','الثانية','الثالثة','الرابعة','الخامسة'][i],root+'course/?unit='+(i+1)]),['survey','استبانة تقييم المسار',root+'survey/']];
const style=document.createElement('style');style.id='course-global-menu-style';style.textContent=`
#course-global-menu{position:fixed;z-index:2147483000;top:14px;left:14px;direction:rtl;font-family:'IBM Plex Sans Arabic',Tahoma,Arial,sans-serif;font-size:14px}
#course-global-menu button{background:#073e59;color:#fff;border:2px solid #78d9df;border-radius:13px;padding:10px 15px;box-shadow:0 5px 17px #051f3540;cursor:pointer;font:inherit;font-weight:700}
#course-global-menu .course-global-panel{position:absolute;top:calc(100% + 8px);left:0;width:min(320px,calc(100vw - 28px));max-height:min(75vh,570px);overflow:auto;background:#fff;border:1px solid #b9dce2;border-radius:15px;padding:8px;box-shadow:0 12px 35px #041d3650}
#course-global-menu .course-global-panel[hidden]{display:none}
#course-global-menu .course-global-panel a{display:block;color:#103f54;text-decoration:none;padding:11px 12px;border-radius:9px;font-size:14px;line-height:1.7}
#course-global-menu .course-global-panel a:hover,#course-global-menu .course-global-panel a:focus{background:#e5f6f8}
#course-global-menu .course-global-panel a[aria-current=page]{background:#d7f1f2;font-weight:700;border-right:4px solid #087f89}
#course-global-menu .course-global-panel strong{display:block;padding:7px 12px;color:#0a4962}
`;document.head.appendChild(style);
const nav=document.createElement('nav');nav.id='course-global-menu';nav.setAttribute('aria-label','مسار التعلم – الانتقال بين الوحدات');
const button=document.createElement('button');button.type='button';button.textContent='☰ مسار التعلم';button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls','course-global-links');
const panel=document.createElement('div');panel.id='course-global-links';panel.className='course-global-panel';panel.hidden=true;
const title=document.createElement('strong');title.textContent='الانتقال بين الوحدات';panel.appendChild(title);
links.forEach(([id,label,href])=>{const a=document.createElement('a');a.href=href;a.textContent=label;if(id===current)a.setAttribute('aria-current','page');panel.appendChild(a)});
button.addEventListener('click',()=>{panel.hidden=!panel.hidden;button.setAttribute('aria-expanded',String(!panel.hidden))});
document.addEventListener('click',e=>{if(!nav.contains(e.target)){panel.hidden=true;button.setAttribute('aria-expanded','false')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){panel.hidden=true;button.setAttribute('aria-expanded','false');button.focus()}});
nav.append(button,panel);document.body.appendChild(nav);
})();
