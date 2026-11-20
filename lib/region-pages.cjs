const fs=require('node:fs');
const path=require('node:path');
const data=require('./region-data.cjs');
const livingAreas=require('./living-areas.cjs');
const buildingTypes=require('./building-types.cjs');
const origin='https://www.baegwan1.co.kr';
const services={
 toilet:{name:'변기막힘',short:'변기 막힘',headline:'변기가 막혔나요?',terms:'변기 뚫는 곳·변기 역류·이물질 제거',description:'변기 물이 안 내려가거나 넘칠 때, 물티슈로 막히거나 칫솔·장난감 등 물건이 들어갔을 때 제거 방법을 안내합니다. 변기 부속 교체와 물통 수리도 함께 상담하실 수 있습니다.',symptom:'변기에 물건이 빠졌을 때도 가능한가요?',answer:'변기 칫솔 빠짐, 장난감과 물티슈 등 이물질은 종류와 위치에 따라 제거 방법이 다릅니다. 물을 반복해 내리지 말고 들어간 물건과 현재 물 높이를 알려주세요. 관통이나 회수, 변기 탈거가 필요한지 확인한 뒤 작업 범위와 비용을 안내합니다.',cost:'단순 막힘 작업은 5만원부터 안내합니다. 변기 뚫는 비용은 막힌 위치, 이물질 회수나 변기 탈거, 장비 사용 여부에 따라 달라집니다. 작업 시작 전 현장 견적을 설명합니다.'},
 sink:{name:'싱크대막힘',short:'싱크대 막힘',headline:'싱크대 물이 안 빠지나요?',terms:'싱크대 역류·세면대 막힘·배수구 교체',description:'싱크대 물이 안 빠지거나 물이 올라오는 증상, 기름때·음식물로 인한 배수 불량을 확인합니다. 세면대 물 안 빠짐과 세면대 배수구·트랩 교체도 상담해 드립니다.',symptom:'싱크대가 자꾸 역류하는 이유는 무엇인가요?',answer:'싱크대 기름때나 음식물, 트랩과 연결관의 상태 등 여러 원인이 있을 수 있습니다. 언제 물이 올라오는지와 다른 배수구의 상태를 알려주시면 점검에 도움이 됩니다. 필요한 경우 배관 내시경으로 확인한 뒤 관통·세척 또는 부품 교체 방법을 안내합니다.',cost:'단순 막힘 작업은 5만원부터 안내합니다. 싱크대 막힘 비용은 배관 길이와 오염 상태, 관통 또는 세척 범위에 따라 달라집니다. 세면대 트랩과 배수구 교체는 제품·부품과 설치 조건을 확인해 별도 견적을 안내합니다.'},
 drain:{name:'하수구막힘',short:'하수구 막힘',headline:'하수구 물이 올라오나요?',terms:'하수구 뚫는 곳·하수구 역류·배수구 악취',description:'욕실 배수구 막힘, 화장실 바닥 물 고임, 베란다 우수관 막힘과 세탁실 배수구 역류를 점검합니다. 식당 하수구 막힘과 상가 하수구 역류, 오수관·맨홀·빌라 공동배관 문제도 작업 범위를 확인해 안내합니다.',symptom:'하수구 악취나 벌레도 상담할 수 있나요?',answer:'하수구 악취나 화장실 찌린내는 막힘 외에 트랩, 봉수와 연결부의 문제일 수 있습니다. 머리카락 등 이물질과 물 흐름을 확인하고, 하수구 트랩 설치나 벌레 차단 부품이 필요한지 살펴봅니다. 정화조 역류나 건물 공용관 문제는 현장 진단 후 작업 가능 범위부터 안내합니다.',cost:'단순 막힘 작업은 5만원부터 안내합니다. 하수구 뚫는 가격은 막힌 위치와 깊이, 오수관·우수관·맨홀 등 작업 구간, 사용 장비에 따라 달라집니다. 고압세척이나 공동배관 작업은 현장 확인 후 별도 견적입니다.'},
 jetting:{name:'고압세척',short:'배관 고압세척',headline:'배관 세척이 필요한가요?',terms:'하수구 고압세척·배관 내시경·관로 탐지',description:'배관 고압세척과 하수구 고압세척으로 쌓인 기름때·퇴적물의 세척 범위를 확인합니다. 식당 주방 그리스트랩 청소, 맨홀 고압세척, 빌라 공동배관과 아파트 횡주관 세척은 현장 구조와 관리 주체를 확인해 안내합니다.',symptom:'내시경 촬영이나 관로 탐지는 언제 필요한가요?',answer:'막힘이 반복되거나 배관 내부와 문제 구간의 확인이 필요할 때 배관 내시경 촬영과 하수구 관로 탐지를 검토합니다. 검사로 확인 가능한 범위와 장비 접근 조건을 설명한 뒤 진행하며, 모든 현장에 같은 장비나 세척 방법을 적용하지는 않습니다.',cost:'고압세척 비용은 배관 길이와 굵기, 오염·퇴적 정도, 장비 설치 공간과 세척 범위에 따라 결정됩니다. 그리스트랩과 공용 횡주관·맨홀 청소는 배출물 처리 등 필요한 조건까지 확인하고 작업 전 견적을 안내합니다.'},
 leak:{name:'누수탐지',short:'누수 탐지·수리',headline:'물이 새고 있나요?',terms:'수도 누수·천장 누수·난방배관 누수',description:'윗집 물샘이나 아랫집에서 물이 샌다는 연락, 천장 물방울과 화장실 누수 증상을 상담합니다. 수도계량기가 계속 돌아가거나 수도요금이 갑자기 늘어난 경우, 온수·직수·난방배관과 분배기의 누수 의심 구간을 확인합니다.',symptom:'아랫집에서 물이 샌다고 하는데 어디를 확인하나요?',answer:'천장에 물이 보인다고 해서 바로 윗집 특정 배관이 원인이라고 단정할 수는 없습니다. 물이 보이는 위치와 발생 시점, 물 사용과의 관계를 확인한 뒤 탐지 범위를 안내합니다. 보일러 배관 누수와 난방배관 누수, 분배기 누수도 현장 조건에 맞춰 점검합니다.',cost:'누수탐지 비용은 탐지 범위, 배관 종류와 현장 접근 조건에 따라 달라집니다. 원인을 확인한 뒤 수리·굴착·마감 복구가 필요한 경우 해당 범위의 비용도 먼저 설명합니다. 사진만으로 정확한 최종 금액을 확정하기 어려운 이유입니다.'},
 thaw:{name:'동파해빙',short:'동파 해빙',headline:'수도관이 얼었나요?',terms:'수도 동파·계량기 동파·언 수도 녹임',description:'수도 동파, 계량기 동파와 보일러 동파 의심 증상을 확인합니다. 언 수도 녹임, 언 하수구 녹임과 배관 해빙 작업은 얼어 있는 구간과 배관 재질, 파손 여부에 맞춰 안내합니다.',symptom:'얼어 있는 배관은 어떻게 작업하나요?',answer:'급수가 멈춘 구간과 노출된 배관·계량기 상태를 먼저 확인합니다. 배관 재질과 전기·장비 접근 조건에 맞는 방법을 설명하고 해빙을 진행합니다. 물이 다시 나온 뒤에도 파손과 누수 여부를 점검하며, 계량기 자체 교체 등 관리 기관이 처리할 범위는 구분해 안내합니다.',cost:'배관 해빙 비용은 얼어 있는 구간과 길이, 장비 사용과 배관 파손 여부에 따라 달라집니다. 부품 교체나 추가 수리가 필요하면 사유와 비용을 먼저 설명하고 동의 후 진행합니다.'},
 repair:{name:'수전교체',short:'배관·자재 교체',headline:'수전·부속을 바꾸고 싶나요?',terms:'세면대 트랩·변기 부속·수도꼭지 누수',description:'싱크대 수전 교체, 화장실·샤워기 수전 교체와 수도꼭지 누수를 상담합니다. 변기 부속 교체와 물통 수리, 세면대 배수구·트랩 교체, 변기·세면대 교체는 제품과 연결 상태를 확인해 안내합니다.',symptom:'변기에서 물 새는 소리가 나거나 부속이 고장 났어요',answer:'변기 물통 안의 급수·배수 부속, 연결부와 수전의 상태를 살펴봅니다. 물 새는 소리와 누수 위치, 제품 사진을 알려주시면 부품 확인에 도움이 됩니다. 설치 가능한 부속이나 교체 제품, 철거와 연결 작업의 범위를 먼저 설명합니다.',cost:'변기 교체 비용과 수전·세면대 교체 가격은 제품, 부품, 철거와 설치 조건에 따라 달라집니다. 고객님이 준비한 제품의 설치를 원하시는 경우에도 규격과 연결 상태를 확인한 뒤 작업 견적을 안내합니다.'}
};
const regions=new Map(data.regions.map(r=>[r.key,r]));
const areaGuides=new Map(Object.entries(livingAreas).map(([key,area])=>[
  'living-areas/'+key,{key:'living-areas/'+key,name:area.name+' 생활권',area}
]));
const buildingGuide={key:'building-types',name:'건물 유형별 배관 상담'};
const guides=new Map([...areaGuides,[buildingGuide.key,buildingGuide]]);
const guideByProvince=new Map([...areaGuides.values()].flatMap(guide=>
  guide.area.provinces.map(province=>[province,guide])
));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const urlPath=(r,service='')=>'/regions/'+r.key.split('/').map(encodeURIComponent).join('/')+(service?'/'+service:'');
function parseRoute(raw){let value;try{value=decodeURIComponent(String(raw||''));}catch{return null;}const parts=value.replace(/^\/+|\/+$/g,'').split('/').filter(Boolean);const guide=guides.get(parts.join('/'));if(guide)return {guide};let service='';if(Object.hasOwn(services,parts.at(-1)))service=parts.pop();const region=regions.get(parts.join('/'));return region?{region,service}:null;}
const link=(r,text,service='')=>`<a href="${urlPath(r,service)}">${esc(text)}</a>`;
function guideLinks(region){
  const guide=guideByProvince.get(region.key.split('/')[0]);
  return [guide&&link(guide,guide.name+' 안내'),link(buildingGuide,buildingGuide.name)].filter(Boolean).join(' · ');
}
function nearby(r){return data.regions.filter(v=>v.key!==r.key&&(r.kind==='province'?v.province===r.province&&v.kind==='city':!r.city?v.province===r.province:v.province===r.province&&(v.city===r.city||v.city.startsWith(r.city+' '))&&v.kind==='town'));}
function faqs(r,service){const s=services[service],loc=r.name;const full=[r.shortProvince,r.city,r.kind==='town'||r.kind==='life'?r.name:''].filter(Boolean).join(' ');const cityAlias=r.city.split(' ')[0].replace(/시$/,'');const aliases=r.aliases.filter(a=>a!==r.name&&a!==r.city).slice(0,6);const children=nearby(r);const links=children.slice(0,36).map(v=>link(v,v.name,service)).join(' · ');const ownServices=Object.entries(services).map(([k,v])=>link(r,loc+' '+v.short,k)).join(' · ');
return [
 [`${loc}에서는 어떤 배관 작업을 상담할 수 있나요?`,s?`${esc(loc)} ${esc(s.short)} 작업 안내입니다. ${esc(s.description)}`:`${esc(loc)}에서 변기·싱크대·하수구 막힘, 역류와 악취, 누수 탐지, 배관 고압세척, 동파 해빙, 수전·배관 부품 교체를 상담할 수 있습니다.`,ownServices],
 [`${loc} 근처에서 방문받으려면 어떻게 하나요?`,`${esc(full)}에서 방문받으실 주소와 현재 증상을 전화나 카카오톡으로 알려주세요.`,`담당자의 방문 가능 일정과 작업 범위를 먼저 확인해 안내합니다.${aliases.length?' '+esc(aliases.join('·'))+'처럼 사용하시는 지역 이름도 함께 알려주셔도 됩니다.':''}`],
 [s?s.symptom:'변기 물이 안 내려가거나 싱크대 물이 올라오면 어떻게 하나요?',s?esc(s.answer):'변기 물 넘침, 싱크대 역류, 하수구 물 올라옴과 화장실 바닥 물 고임은 막힘 위치와 원인에 따라 작업이 다릅니다. 변기에 물건이 빠졌을 때나 물티슈로 막힌 경우에는 물을 반복해 내리지 말고 증상과 사진을 보내주세요.','세면대 물 안 빠짐, 베란다·세탁실 배수구 역류, 식당·상가 하수구 문제도 현재 상태를 말씀해 주시면 필요한 점검을 안내합니다.'],
 [`${loc} ${s?s.short:'배관 작업'} 비용은 언제 확인하나요?`,s?esc(s.cost):'변기·싱크대·하수구의 단순 막힘은 5만원부터 안내합니다. 누수탐지 비용, 고압세척 비용, 부품·제품 교체 가격은 작업 범위와 현장 조건을 확인한 뒤 별도 견적으로 안내합니다.','작업 전 방법과 금액을 먼저 설명하고 동의하신 범위에서 진행합니다. 추가 작업이 필요하면 사유와 추가 견적도 먼저 설명합니다.'],
 [`${loc}에서도 24시간·일요일·야간 방문이 가능한가요?`,'평일·주말·공휴일 모두 24시간 상담합니다. 야간이나 당일 방문이 필요하시면 주소와 증상을 알려주세요.','실제 방문 시간은 해당 지역의 접수 상황과 이동 일정을 확인해 안내합니다.'],
 ['왜 전화만으로 정확한 최종 견적이 어려운가요?','가까운 트랩과 깊은 공동배관은 작업 범위가 다르고, 배관의 길이·파손·퇴적 상태와 장비 접근 조건도 현장에서 확인해야 합니다. 배관 내시경 검사, 관로 탐지, 고압세척과 부품 교체 필요 여부에 따라 견적이 달라집니다.','정밀 탐지나 공용관·맨홀·그리스트랩 작업이 필요한 경우 해당 범위와 조건을 먼저 설명합니다.'],
 [`${loc} 외에 같은 지역도 확인할 수 있나요?`,links||`${esc(r.shortProvince)} ${esc(r.city)}의 상세 주소를 알려주시면 방문 가능 여부와 일정을 안내합니다.`,`${r.city&&regions.has(r.key.split('/').slice(0,2).join('/'))?link(regions.get(r.key.split('/').slice(0,2).join('/')),r.city+' 지역 안내')+' · ':''}<a href="/regions">전국 지역 안내</a> · ${guideLinks(r)}`]
].map(([q,a,b])=>detail(q,a,b)).join('');}
let template;
function getTemplate(){if(!template)template=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');return template;}
const faqSection=/(<div class="faq-list">)[\s\S]*?(<\/div><\/div><\/section>)/;

function detail(title,lead,content='',open=false){
  return `<details${open?' open':''}><summary>${esc(title)}</summary><p class="faq-answer-lead">${lead}</p>${content?'<p>'+content+'</p>':''}</details>`;
}

function renderPage({title,description,canonical,pageUrl=canonical,heading,subtitle,sections,context,service}){
  const schema={'@context':'https://schema.org','@type':'WebPage',name:title,description,url:pageUrl,inLanguage:'ko-KR'};
  if(service) schema.about=service;
  return getTemplate()
    .replace(/<title>[\s\S]*?<\/title>/,`<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${esc(description)}">`)
    .replace(/<link rel="canonical" href="[^"]*">/,`<link rel="canonical" href="${canonical}">`)
    .replace(/<h1>[\s\S]*?<\/h1>/,`<h1>${heading}</h1>`)
    .replace(/<p class="hero-sub">[\s\S]*?<\/p>/,`<p class="hero-sub">${esc(subtitle)}</p>`)
    .replace(faqSection,(_,a,b)=>a+sections+b)
    .replace('현장에서 확인하는 전문성','배관1번가 작업 안내')
    .replace(/<meta property="og:title" content="[^"]*">/,`<meta property="og:title" content="${esc(title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/,`<meta property="og:description" content="${esc(description)}">`)
    .replace(/<meta property="og:url" content="[^"]*">/,`<meta property="og:url" content="${pageUrl}">`)
    .replace('</head>',`<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>${context?`<script id="regional-context" type="application/json">${JSON.stringify(context).replace(/</g,'\\u003c')}</script>`:''}</head>`);
}

function render(region,service=''){
  const s=services[service];
  const loc=region.name;
  const searchLocation=[region.shortProvince,region.city,region.kind==='town'||region.kind==='life'?loc:'']
    .filter((v,i,a)=>v&&a.indexOf(v)===i).join(' ')||loc;
  const title=s?`${searchLocation} ${s.name}·${s.terms.split('·')[0]} | 배관1번가`:`${searchLocation} 변기·싱크대·하수구막힘, 누수탐지 | 배관1번가`;
  return renderPage({
    title,
    description:`${searchLocation} ${s?s.description:'변기·싱크대·하수구 막힘, 역류, 누수 탐지, 고압세척, 동파 해빙과 수전 교체를 상담합니다.'} 24시간 상담 및 방문 일정 안내. 050-7878-1196`,
    canonical:origin+urlPath(region),
    pageUrl:origin+urlPath(region,service),
    heading:`${esc(loc)} ${s?esc(s.short):'배관 문제'},<br><em>${s?esc(s.headline):'더 이상 고민하지 마세요'}</em>`,
    subtitle:`${s?s.terms:'막힘 · 누수 · 역류 · 동파'}, 원인부터 꼼꼼하게.`,
    sections:faqs(region,service),
    context:{province:region.province,city:region.city,dong:region.kind==='town'?loc:'',key:region.key},
    service:{
      '@type':'Service',name:s?s.short:'배관 서비스',
      areaServed:{'@type':'Place',name:[region.province,region.city,loc].filter((v,i,a)=>v&&a.indexOf(v)===i).join(' ')},
      provider:{'@type':'Organization',name:'배관1번가',url:origin,telephone:'050-7878-1196'},
    },
  });
}

const areaCategories=[
  ['신도시·택지지구','신도시나 택지지구에서 접수할 때는 실제 입주 주소와 단지 또는 건물명을 함께 알려주세요.'],
  ['주요 아파트 단지','단지 이름과 동·호수, 물이 새거나 역류한 위치를 알려주세요. 여러 세대에서 같은 문제가 생기면 관리사무소에 먼저 공유해 주세요.'],
  ['역·번화가·대학·시장·IC','역이나 상권 이름을 먼저 알려주시고, 실제 작업할 건물의 주소와 층을 함께 말씀해 주세요.'],
  ['공단·산업단지','산업단지와 사업장 이름, 작업 구간의 동 번호나 출입구, 장비 차량 진입 가능 여부를 알려주세요.'],
];

function renderGuide(guide){
  const area=guide.area;
  const description=area
    ? area.name+' 신도시·택지지구, 아파트 단지, 역·상권과 산업단지에서 배관 상담을 접수할 때 참고할 주소 안내입니다.'
    : '아파트·주택, 식당·상가, 공장·창고, 병원 등 건물 유형에 따라 막힘·역류·누수 상담 전에 확인할 사항을 안내합니다.';
  const regionalDirectory='<a href="/regions">전국 지역 안내</a>';
  let sections;
  if(area){
    const provinceLinks=area.provinces.map(key=>link(regions.get(key),regions.get(key).name+' 지역 안내'));
    sections=detail(area.name+'에서 방문 상담을 받으려면',
      '전화나 카카오톡으로 실제 주소와 증상을 알려주세요. 아래에 있는 생활권이나 단지 이름을 함께 말씀해 주시면 방문 위치를 확인하기 쉽습니다.',
      [...provinceLinks,link(buildingGuide,buildingGuide.name),regionalDirectory].join(' · '),true)
      +areaCategories.map(([title,advice],index)=>detail(title,esc(advice),esc(area.areas[index]))).join('');
  }else{
    sections=detail('배관 상담 전에 무엇을 알려주면 되나요?',
      '방문받을 주소, 건물 유형, 문제가 시작된 위치와 시점을 알려주세요. 같은 문제가 다른 세대나 배수구에도 있는지 말씀해 주시면 점검 범위를 안내하는 데 도움이 됩니다.',
      regionalDirectory,true)
      +buildingTypes.map(({title,types,advice})=>detail(title,esc(advice),esc(types))).join('');
  }
  return renderPage({
    title:guide.name+' 안내 | 배관1번가',
    description,
    canonical:origin+urlPath(guide),
    heading:esc(guide.name),
    subtitle:description,
    sections,
  });
}

function sitemapPaths(){
  return ['/', '/regions', ...[...guides.values()].map(guide=>urlPath(guide)), ...data.regions.map(region=>urlPath(region))];
}

function directory(){
  const provinceLinks=data.regions.filter(region=>region.kind==='province').map(region=>link(region,region.name));
  const livingAreaLinks=[...areaGuides.values()].map(guide=>link(guide,guide.name));
  return renderPage({
    title:'전국 배관 방문 상담 지역 안내 | 배관1번가',
    description:'배관1번가의 전국 지역 안내입니다. 방문받으실 시·군·구와 읍·면·동, 생활권 및 건물 유형별 상담 정보를 확인하세요.',
    canonical:origin+'/regions',
    heading:'전국 배관 방문 상담',
    subtitle:'방문받으실 지역과 건물 유형을 확인하세요.',
    sections:detail('방문 상담받으실 지역을 선택해 주세요',provinceLinks.join(' · '),
      '지역 선택에서 시·군·구와 읍·면·동을 고르면 해당 지역 안내를 확인하실 수 있습니다.',true)
      +detail('생활권·아파트 단지 안내',livingAreaLinks.join(' · '),'신도시와 아파트 단지, 역 주변 상권과 산업단지를 확인하실 수 있습니다.',true)
      +detail('건물 유형별 상담',link(buildingGuide,buildingGuide.name),'집, 가게, 사업장에서 접수 전에 확인할 사항을 안내합니다.',true),
  });
}

module.exports={data,regions,services,guides,parseRoute,render,renderGuide,directory,sitemapPaths,urlPath,origin};
