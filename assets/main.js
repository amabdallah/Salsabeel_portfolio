(function(){
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
// nav
const burger=$('.burger'),nav=$('nav');
if(burger)burger.addEventListener('click',()=>{const o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.rv').forEach(el=>io.observe(el));
// counters
$$('[data-count]').forEach(el=>{const to=+el.dataset.count,suf=el.dataset.suf||'';let done=false;
 new IntersectionObserver((es,o)=>{if(es[0].isIntersecting&&!done){done=true;const t0=performance.now();
 (function step(t){const p=Math.min((t-t0)/1100,1);el.textContent=Math.round(to*(1-Math.pow(1-p,3)))+suf;if(p<1)requestAnimationFrame(step)})(t0);o.disconnect()}}).observe(el)});
// timeline
const tl=$$('.tl-item');
tl.forEach(i=>{i.tabIndex=0;const t=()=>i.classList.toggle('open');i.addEventListener('click',t);i.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();t()}})});
// generic filter chips for timeline / pubs
function wire(group,items,attr){
 $$('.chip',group).forEach(c=>c.addEventListener('click',()=>{
  $$('.chip',group).forEach(x=>x.setAttribute('aria-pressed',x===c));
  items.forEach(i=>i.style.display=(c.dataset.f==='all'||i.dataset[attr]===c.dataset.f)?'':'none')}))}
const tg=$('#tl-filter');if(tg)wire(tg,tl,'t');
// pubs search + filter
const pubs=$$('.pub');
if(pubs.length){let kind='all';const q=$('#pub-q'),cnt=$('#pub-count');
 const apply=()=>{const s=(q.value||'').toLowerCase();let n=0;
  pubs.forEach(p=>{const ok=(kind==='all'||p.dataset.k===kind)&&p.textContent.toLowerCase().includes(s);p.style.display=ok?'':'none';if(ok)n++});
  cnt.textContent=n+' of '+pubs.length+' items shown'};
 $$('#pub-filter .chip').forEach(c=>c.addEventListener('click',()=>{kind=c.dataset.f;$$('#pub-filter .chip').forEach(x=>x.setAttribute('aria-pressed',x===c));apply()}));
 q.addEventListener('input',apply);apply()}
// tabs
$$('.tabs').forEach(tb=>{const tabs=$$('.tab',tb),root=tb.parentElement;
 tabs.forEach(t=>t.addEventListener('click',()=>{tabs.forEach(x=>x.setAttribute('aria-selected',x===t));
  $$('.tabpanel',root).forEach(p=>p.classList.toggle('on',p.id===t.dataset.p))}))});
// courses
const cd=$('#course-detail');
if(cd){const info={
 'Medical-Surgical Nursing':'Care of adults with acute and complex conditions, drawing on ICU, neurosurgical and surgical-nursing experience so students connect pathophysiology to the bedside.',
 'Pathophysiology':'Disease processes explained through the patient stories and clinical cues students will meet on placement.',
 'Gerontology':'Age-related change, safety and dignity in older adults, including pressure-injury prevention, a focus of published research.',
 'Nursing Fundamentals':'Foundational skills taught in the lab: assessment, hygiene, safety and communication, with practical exams and targeted remediation.',
 'Health Assessment':'Systematic head-to-toe assessment and clinical reasoning, practiced in skills labs and simulation.',
 'Medical Terminology':'The language of healthcare, built up so students can read, document and communicate accurately.'};
 const wrap=$('#course-chips');
 Object.keys(info).forEach((k,i)=>{const b=document.createElement('button');b.className='chip';b.textContent=k;b.setAttribute('aria-pressed',i===0);
  b.onclick=()=>{$$('.chip',wrap).forEach(x=>x.setAttribute('aria-pressed',x===b));cd.innerHTML='<h3>'+k+'</h3><p style="margin-top:8px">'+info[k]+'</p>'};wrap.appendChild(b);if(i===0)b.click()})}
// quiz
const qz=$('#quiz');
if(qz){const Q=[
 {q:'Mr. Hale, 78, is on post-op day 2 after hip surgery. He has limited mobility, poor intake and a Braden score of 12. What is your first priority?',
  o:['Place a donut-style ring cushion under his sacrum','Start a repositioning schedule, offload heels and sacrum, and request a pressure-redistributing surface','Massage the reddened skin over his sacrum','Document the score and reassess next shift'],a:1,
  f:'A Braden of 12 signals high risk. Evidence supports scheduled repositioning, offloading heels and a pressure-redistributing surface. Ring cushions concentrate pressure, and massaging reddened skin can cause tissue damage.'},
 {q:'You find a patch of intact skin over the sacrum that is red and does not blanch when pressed. How do you classify it?',
  o:['Normal reactive hyperemia','Stage 1 pressure injury','Stage 3 pressure injury','Moisture-associated dermatitis only'],a:1,
  f:'Intact skin with non-blanchable erythema is a Stage 1 pressure injury. Blanching redness is usually reactive hyperemia, which resolves.'},
 {q:'Which nutrition-related action best supports skin integrity for this patient?',
  o:['Restrict fluids to reduce moisture','Refer for a nutrition assessment and encourage adequate protein and hydration','Wait until the wound appears','Give only clear liquids'],a:1,
  f:'Adequate protein, calories and hydration support tissue repair and resilience, and an early dietitian referral is part of a prevention bundle.'}];
 let i=0,sc=0;const box=$('#quiz-body'),bar=$('#quiz-bar i');
 const show=()=>{if(i>=Q.length){bar.style.width='100%';box.innerHTML='<h3>Scenario complete</h3><p style="margin:10px 0">You scored <b>'+sc+' / '+Q.length+'</b>. In class, each answer opens a debrief: why this, why not that, and what the evidence says.</p><button class="btn" id="again">Try again</button>';$('#again').onclick=()=>{i=0;sc=0;show()};return}
  bar.style.width=(i/Q.length*100)+'%';const c=Q[i];
  box.innerHTML='<p class="count">Question '+(i+1)+' of '+Q.length+'</p><h3 style="margin:6px 0 12px">'+c.q+'</h3>'+c.o.map((t,k)=>'<button class="opt" data-k="'+k+'">'+t+'</button>').join('')+'<div class="fb" id="fb"></div>';
  $$('.opt',box).forEach(b=>b.onclick=()=>{const k=+b.dataset.k;$$('.opt',box).forEach(x=>x.disabled=true);
   $$('.opt',box)[c.a].classList.add('good');if(k!==c.a)b.classList.add('bad');else sc++;
   const fb=$('#fb');fb.style.display='block';fb.innerHTML='<b>'+(k===c.a?'Correct. ':'Not quite. ')+'</b>'+c.f+'<br><br><button class="btn" id="nx">'+(i===Q.length-1?'See result':'Next')+'</button>';
   $('#nx').onclick=()=>{i++;show()}})};show()}
// contact composer
const cf=$('#composer');
if(cf){const build=()=>{const d=Object.fromEntries(new FormData(cf));
  return {s:(d.topic||'Hello')+' - message from '+(d.name||'a visitor'),b:'Hello Salsabeel,\n\n'+(d.msg||'')+'\n\nBest regards,\n'+(d.name||'')+(d.org?'\n'+d.org:'')+(d.email?'\n'+d.email:'')}};
 cf.addEventListener('submit',e=>{e.preventDefault();const m=build();location.href='mailto:'+cf.dataset.to+'?subject='+encodeURIComponent(m.s)+'&body='+encodeURIComponent(m.b)});
 $('#copy').addEventListener('click',()=>{const m=build();navigator.clipboard&&navigator.clipboard.writeText(m.b).then(()=>{const t=$('.toast');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)})})}
})();
