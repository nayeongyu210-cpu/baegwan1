const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function callNow(){location.href='tel:05078781196'}
function chatNow(){window.open('https://open.kakao.com/o/sn91CIXi','_blank','noopener,noreferrer')}
function toggleNav(button){const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));$('#nav').classList.toggle('open',open)}
$$('#nav a').forEach(a=>a.addEventListener('click',()=>{$('#nav').classList.remove('open');$('.hamb').setAttribute('aria-expanded','false')}));
function flipService(button){const flip=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(flip));button.classList.toggle('flipped',flip)}
function slideRail(id,dir){const rail=document.getElementById(id);if(id==='casesRail'&&caseMotion){const width=rail.querySelector('.case').getBoundingClientRect().width+18;caseMotion.currentTime=((Number(caseMotion.currentTime)||0)+dir*width/caseSpeed*1000+caseDuration)%caseDuration;return}const item=rail.querySelector('.case');if(item)rail.scrollBy({left:dir*(item.getBoundingClientRect().width+18),behavior:reduced?'instant':'smooth'})}
const province=$('#province'),city=$('#city'),dong=$('#dong'),regionMessage=$('#regionMessage');
function fill(el,label,items){el.replaceChildren(new Option(label,''),...items.map(v=>new Option(v,v)))}
fill(province,'시·도',Object.keys(areas));
function updateRegionDial(){const ready=province.value&&city.value&&dong.value;$('#regionDial').hidden=!ready;if(ready)$('#regionDial').textContent=dong.value+' 방문 일정 상담'}
province.addEventListener('change',()=>{fill(city,'시·군·구',Object.keys(areas[province.value]||{}));fill(dong,'읍·면·동',[]);regionMessage.textContent='시·군·구를 선택해 주세요';updateRegionDial();syncPins()});
city.addEventListener('change',()=>{fill(dong,'읍·면·동',areas[province.value]?.[city.value]||[]);regionMessage.textContent='읍·면·동을 선택해 주세요';updateRegionDial()});
dong.addEventListener('change',()=>{regionMessage.textContent=[province.value,city.value,dong.value].filter(Boolean).join(' ')+' · 선택 완료';updateRegionDial()});
function regionCall(){if(province.value&&city.value&&dong.value)callNow()}
const groups={'서울특별시':'서울특별시','인천광역시':'서울특별시','경기도':'서울특별시','강원특별자치도':'강원특별자치도','충청남도':'충청남도','충청북도':'충청남도','대전광역시':'충청남도','세종특별자치시':'충청남도','전북특별자치도':'전북특별자치도','전남광주통합특별시':'전북특별자치도','광주광역시':'전북특별자치도','전라남도':'전북특별자치도','경상북도':'경상북도','대구광역시':'경상북도','경상남도':'경상남도','부산광역시':'경상남도','울산광역시':'경상남도'};
function syncPins(){$$('[data-map-province]').forEach(pin=>pin.setAttribute('aria-pressed',String(pin.dataset.mapProvince===groups[province.value])))}
$$('[data-map-province]').forEach(pin=>{const select=()=>{province.value=pin.dataset.mapProvince;province.dispatchEvent(new Event('change'))};pin.addEventListener('click',select);pin.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select()}})});
// Date-based display schedule; no external intake-data integration.
let counterDay='',counterEvents=[],lastCounter='';
function counterTarget(){const now=new Date(Date.now()+32400000),day=now.toISOString().slice(0,10);if(day!==counterDay){let seed=2166136261;for(const ch of day)seed=Math.imul(seed^ch.charCodeAt(0),16777619)>>>0;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};let target=551+Math.floor(rnd()*49);while(target%10===0)target=551+Math.floor(rnd()*49);let total=0,pos=0;const steps=[];while(total<target){const amount=Math.min(1+Math.floor(rnd()*3),target-total);pos+=12+Math.floor(rnd()*20);steps.push({pos,amount});total+=amount}const duration=pos+12+Math.floor(rnd()*15);counterEvents=steps.map(s=>({minute:Math.max(1,Math.min(1439,Math.round(s.pos/duration*1440))),amount:s.amount}));counterDay=day}const minute=now.getUTCHours()*60+now.getUTCMinutes();return counterEvents.reduce((sum,e)=>sum+(e.minute<=minute?e.amount:0),0)}
function paintCounter(value){const digits=String(value).padStart(3,'0');if(digits===lastCounter)return;const root=$('#dailyReceptionCount');root.setAttribute('aria-label','금일 작업건수 '+value+'건');root.replaceChildren();for(let i=0;i<digits.length;i++){const tile=document.createElement('span');tile.className='digit'+(digits[i]!==lastCounter[i]?' flip':'');tile.textContent=digits[i];root.append(tile)}const unit=document.createElement('small');unit.textContent='건';root.append(unit);lastCounter=digits}
const start=performance.now(),target=counterTarget();function countIn(time){const progress=Math.min(1,(time-start)/1300);paintCounter(Math.round(target*(1-Math.pow(1-progress,3))));if(progress<1)requestAnimationFrame(countIn)}if(reduced)paintCounter(target);else requestAnimationFrame(countIn);setInterval(()=>paintCounter(counterTarget()),30000);
const samples=[['서울시 강남구 역삼동','변기 막힘','접수완료'],['충남 천안시 서북구 불당1동','싱크대 역류','상담중'],['경기도 용인시 수지구 풍덕천동','동파 해빙','접수완료'],['부산시 해운대구 우동','고압세척','배정중'],['경기도 수원시 영통구 영통동','누수 탐지','접수완료'],['서울시 은평구 역촌동','수전 교체','상담중'],['경기도 성남시 분당구 정자동','변기 이물질 제거','접수완료'],['대전시 유성구 봉명동','하수구 역류','배정중'],['충북 청주시 흥덕구 복대동','배관 청소','접수완료'],['경남 김해시 장유2동','세면대 교체','상담중'],['서울시 송파구 잠실동','배관 내시경','접수완료'],['경남 양산시 물금읍','싱크대 막힘','접수완료']];
let intakeIndex=0,intakeBusy=false;
function receiptRow(rec,index){const row=document.createElement('div');row.className='intake-row';const state=rec[2]==='접수완료'?'done':rec[2]==='상담중'?'talk':'assigned';row.innerHTML='<span class="receipt-region"></span><span class="receipt-job"></span><span class="receipt-status '+state+'"><i aria-hidden="true"></i><span></span></span><span class="receipt-time"></span>';row.children[0].textContent=rec[0];row.children[1].textContent=rec[1];row.querySelector('.receipt-status span').textContent=rec[2];row.children[3].textContent=index===0?'방금 전':index+'분 전';return row}
function renderIntake(){const rows=$('#intakeRows');rows.replaceChildren();for(let i=0;i<6;i++)rows.append(receiptRow(samples[(intakeIndex+i)%samples.length],i))}
renderIntake();setInterval(()=>{if(document.hidden||intakeBusy)return;intakeBusy=true;const rows=$('#intakeRows'),height=rows.firstElementChild.getBoundingClientRect().height;const movement=rows.animate([{transform:'translateY(0)'},{transform:'translateY(-'+height+'px)'}],{duration:reduced?1:160,easing:'steps(3,end)',fill:'forwards'});movement.finished.then(()=>{intakeIndex=(intakeIndex+1)%samples.length;renderIntake();movement.cancel();intakeBusy=false})},5500);
function reviewCard([work,name,text]){const card=document.createElement('article');card.className='review surface';const label=document.createElement('small');label.textContent='작업 내용';const title=document.createElement('h3');title.textContent=work;const body=document.createElement('p');body.textContent=text;const author=document.createElement('span');author.className='review-author';author.textContent=name+' 고객님';card.append(label,title,body,author);return card}
for(let i=0;i<2;i++){const set=document.createElement('div');set.className='review-set';if(i){set.setAttribute('aria-hidden','true');set.inert=true}reviews.forEach(r=>set.append(reviewCard(r)));$('#reviewTrack').append(set)}
function stepReview(dir){const track=$('#reviewTrack'),animation=track.getAnimations()[0];if(animation){const duration=Number(animation.effect.getTiming().duration);animation.currentTime=((Number(animation.currentTime)+dir*duration/reviews.length)%duration+duration)%duration}else $('#reviewMarquee').scrollBy({left:dir*260,behavior:'smooth'})}

// A slow, seamless leftward case strip; user controls also work with reduced motion.
let caseMotion=null,caseDuration=0;const caseSpeed=14;
const caseRail=document.getElementById('casesRail');
if(!reduced&&caseRail){
 const track=document.createElement('div');track.className='cases-track';
 const set=document.createElement('div');set.className='case-set';set.append(...caseRail.children);
 const clone=set.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.inert=true;
 track.append(set,clone);caseRail.append(track);caseRail.classList.add('is-animated');
 const fitCaseMotion=()=>{const distance=set.getBoundingClientRect().width+18;if(!distance)return;const prior=caseMotion&&caseDuration?(Number(caseMotion.currentTime)||0)/caseDuration:0;caseMotion?.cancel();caseDuration=distance/caseSpeed*1000;caseMotion=track.animate([{transform:'translateX(0)'},{transform:'translateX(-'+distance+'px)'}],{duration:caseDuration,iterations:Infinity,easing:'linear'});caseMotion.currentTime=prior*caseDuration;};
 fitCaseMotion();new ResizeObserver(fitCaseMotion).observe(caseRail);
 const visible=new IntersectionObserver(entries=>{entries.forEach(e=>{if(caseMotion){if(e.isIntersecting&&!document.hidden)caseMotion.play();else caseMotion.pause();}})});visible.observe(caseRail);
 document.addEventListener('visibilitychange',()=>{if(!caseMotion)return;if(document.hidden)caseMotion.pause();else caseMotion.play();});
}
