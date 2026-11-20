const assert=require('node:assert/strict');const fs=require('node:fs');const crypto=require('node:crypto');const m=require('./lib/region-pages.cjs');const handler=require('./api/region.js');
const paths=m.sitemapPaths();assert.equal(paths.length,new Set(paths).size);assert(!paths.some(p=>p.includes('jeju')));
for(const r of m.data.regions){for(const service of ['',...Object.keys(m.services)]){const parsed=m.parseRoute(m.urlPath(r,service).slice('/regions/'.length));assert(parsed&&parsed.region.key===r.key&&parsed.service===service);}}
const samples=m.data.regions.filter((r,i)=>r.kind==='province'||r.name==='불당동'||r.name==='봉명동'||r.name==='탕정읍'||i%157===0);
for(const r of samples)for(const service of ['',...Object.keys(m.services)]){const html=m.render(r,service);assert(html.match(/<title>(.*?)<\/title>/)[1].includes(r.name));assert.equal((html.match(/<h1>/g)||[]).length,1);assert(html.includes('<link rel="canonical" href="'+m.origin+m.urlPath(r)+'">'));assert(html.includes(r.name+' 근처에서 방문받으려면'));assert(html.includes('/design-v3.css?v=12'));assert(!html.includes('undefined'));assert.equal((html.match(/<details>/g)||[]).length,7);}
function request(query){let body;const res={statusCode:200,headers:{},setHeader(k,v){this.headers[k]=v},end(value){body=value}};handler({query},res);return {...res,body};}
assert.equal(request({path:'not-a-region/toilet'}).statusCode,404);assert.equal(request({path:'not-a-region'}).headers['X-Robots-Tag'],'noindex');
assert.equal(request({kind:'resolve',province:'충청남도',city:'천안시 서북구',dong:'불당1동'}).statusCode,200);
const xml=request({kind:'sitemap'}).body;
assert(xml.includes('<sitemapindex'));
const indexedUrls=[];
for(let i=0;i<Math.ceil(paths.length/8000);i++){
  const sitemap=request({kind:'sitemap',page:String(i)});
  assert.equal(sitemap.statusCode,200);
  assert(sitemap.body.includes('<urlset'));
  const urls=[...sitemap.body.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>match[1]);
  assert(urls.length<=8000);
  indexedUrls.push(...urls);
}
assert.deepEqual(indexedUrls,paths.map(p=>m.origin+p));
assert.equal(paths.length,m.regions.size+m.guides.size+2);
const directory=request({}).body;
let areaNames=0;
for(const guide of m.guides.values()){
  const url=m.urlPath(guide);
  assert(directory.includes('href="'+url+'"'));
  const response=request({path:url.slice('/regions/'.length)});
  assert.equal(response.statusCode,200);
  assert(response.body.includes('<link rel="canonical" href="'+m.origin+url+'">'));
  assert(response.body.includes('<h1>'+guide.name+'</h1>'));
  if(guide.area){
    for(const group of guide.area.areas){
      for(const name of group.split(', ')){
        assert(response.body.includes(name));
        areaNames++;
      }
    }
    for(const key of guide.area.provinces){
      assert(m.render(m.regions.get(key)).includes('href="'+url+'"'));
    }
  }
}
const buildings=require('./lib/building-types.cjs');
const buildingHtml=request({path:'building-types'}).body;
for(const {types} of buildings) assert(buildingHtml.includes(types));
assert.equal(request({path:'living-areas/unknown'}).statusCode,404);
assert.equal(request({path:'living-areas/seoul/leak'}).statusCode,404);
assert.equal(request({kind:'sitemap',page:'999'}).statusCode,404);assert(request({}).body.includes('방문 상담받으실 지역을 선택'));
const source=fs.readFileSync(__dirname+'/index.html','utf8'),regional=m.render(m.regions.get('chungnam/천안시-서북구/불당동'),'toilet');for(const cls of ['hero-actions','company-grid','symptoms','sticky-consult-inner']){const re=new RegExp('class="'+cls+'"');assert(source.match(re)&&regional.match(re));}
console.log(JSON.stringify({regions:m.regions.size,townPages:m.data.regions.filter(r=>r.kind==='town').length,canonicalUrls:paths.length,guidePages:m.guides.size,areaNames,buildingTypes:buildings.flatMap(({types})=>types.split(', ')).length,sitemaps:Math.ceil(paths.length/8000),renderedSamples:samples.length*8,pathChecks:m.regions.size*(1+Object.keys(m.services).length),cssSha256:crypto.createHash('sha256').update(fs.readFileSync(__dirname+'/design-v3.css')).digest('hex'),status:'passed'},null,2));
