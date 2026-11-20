// Regional links use the existing region controls and typography.
(()=>{
 const p=document.getElementById('province'),c=document.getElementById('city'),d=document.getElementById('dong'),message=document.getElementById('regionMessage');
 if(!p||!c||!d||!message)return;
 let requestId=0;
 const update=async()=>{const id=++requestId;if(!p.value||!c.value||!d.value)return;
  try{const params=new URLSearchParams({kind:'resolve',province:p.value,city:c.value,dong:d.value});const response=await fetch('/api/region?'+params);if(!response.ok)return;const value=await response.json();if(id!==requestId||!value.url?.startsWith('/regions/'))return;
   const a=document.createElement('a');a.href=value.url;a.textContent=d.value+' 서비스 안내 보기';message.replaceChildren(a);
  }catch{/* Telephone consultation remains available without regional navigation. */}
 };
 d.addEventListener('change',update);
 const context=document.getElementById('regional-context');
 if(context){try{const r=JSON.parse(context.textContent);if([...p.options].some(o=>o.value===r.province)){p.value=r.province;p.dispatchEvent(new Event('change'));if([...c.options].some(o=>o.value===r.city)){c.value=r.city;c.dispatchEvent(new Event('change'));if(r.dong){if(![...d.options].some(o=>o.value===r.dong))d.add(new Option(r.dong,r.dong));d.value=r.dong;d.dispatchEvent(new Event('change'));}}}}catch{}}
})();
