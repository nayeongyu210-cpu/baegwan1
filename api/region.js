const {data,regions,parseRoute,render,renderGuide,directory,sitemapPaths,urlPath,origin}=require('../lib/region-pages.cjs');
const xml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
module.exports=(req,res)=>{
 res.setHeader('X-Content-Type-Options','nosniff');
 const q=req.query||{};const kind=String(q.kind||'');
 if(kind==='resolve'){
  const key=data.lookup[[q.province,q.city,q.dong].map(v=>String(v||'')).join('|')];res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','public, s-maxage=3600');res.statusCode=key?200:404;return res.end(JSON.stringify({url:key?urlPath(regions.get(key)):null}));
 }
 if(kind==='sitemap'){
  const paths=sitemapPaths(),size=8000,count=Math.ceil(paths.length/size),page=q.page;
  res.setHeader('Content-Type','application/xml; charset=utf-8');res.setHeader('Cache-Control','public, max-age=0, s-maxage=86400');
  if(page===undefined){return res.end('<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+Array.from({length:count},(_,i)=>`<sitemap><loc>${origin}/sitemaps/regions-${i}.xml</loc></sitemap>`).join('')+'</sitemapindex>');}
  if(!/^\d+$/.test(String(page))||Number(page)>=count){res.statusCode=404;return res.end('Not found');}
  return res.end('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.slice(Number(page)*size,(Number(page)+1)*size).map(p=>`<url><loc>${xml(origin+p)}</loc></url>`).join('')+'</urlset>');
 }
 const raw=Array.isArray(q.path)?q.path.join('/'):String(q.path||'');
 res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Cache-Control','public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
 if(!raw)return res.end(directory());
 const match=parseRoute(raw);
 if(!match){res.statusCode=404;res.setHeader('X-Robots-Tag','noindex');return res.end('<!doctype html><html lang="ko"><meta charset="utf-8"><title>지역 안내를 찾을 수 없습니다 | 배관1번가</title><p>지역 안내를 찾을 수 없습니다.</p><a href="/">배관1번가 홈으로</a></html>');}
 return res.end(match.guide?renderGuide(match.guide):render(match.region,match.service));
};
