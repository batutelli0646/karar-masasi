/* ek22: erişilebilirlik ve dokunma alanı — kaydırıcı etiketleri, diyalog rolleri, Esc ile kapatma, sekme rolleri */
{const lbl=el=>{const h=el.closest('.lever,.dl,.panel,div');const n=h&&h.querySelector('b,.n');return n?n.textContent.trim().slice(0,60):'Değer ayarı';};
 const enh=()=>{try{document.querySelectorAll('input[type=range]').forEach(r=>{const a=r.getAttribute('aria-label')||'';if(!a||/^[a-z0-9_]+$/i.test(a))r.setAttribute('aria-label',lbl(r));});
  document.querySelectorAll('.dxs,.sheet').forEach(d=>{d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');if(!d.getAttribute('aria-label'))d.setAttribute('aria-label',(d.querySelector('b,h1,h2')||{}).textContent||'Pencere');});
  document.querySelectorAll('.subtabs').forEach(t=>{t.setAttribute('role','tablist');t.querySelectorAll('button').forEach(b=>b.setAttribute('role','tab'));});}catch(e){}};
 const _r=render;render=function(){const x=_r.apply(this,arguments);enh();return x;};
 document.addEventListener('keydown',ev=>{if(ev.key!=='Escape')return;const b=document.querySelector('.dxs button[data-dxx],.sheet [data-arax]');if(b){ev.preventDefault();b.click();}});
 const st=document.createElement('style');st.textContent='@media (pointer:coarse){.btn.sm,.dg .btn.sm{min-height:36px!important;height:auto!important;padding-top:6px!important;padding-bottom:6px!important}.step .btn{min-height:36px;height:auto!important}.step button:not(.btn){min-width:38px;height:36px!important}.bn2,.bn{min-height:40px}.dxa{min-height:40px}input.rng{min-height:28px}}';document.head.appendChild(st);}
