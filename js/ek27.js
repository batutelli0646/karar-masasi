/* ek27: Tekrarlayan gösterge/karar temizliği + menü düzeni (her şey tek yerde) */
const P27=(h,f)=>{const t=document.createElement('template');t.innerHTML=h;try{f(t.content);}catch(e){}return t.innerHTML;};
const pn27=(r,ttl)=>[...r.querySelectorAll('.panel')].filter(p=>{const b=p.querySelector(':scope>b,:scope>h2');return b&&b.textContent.trim().toLowerCase().startsWith(ttl.toLowerCase());});
const rm27=(r,...t)=>t.forEach(x=>pn27(r,x).forEach(p=>p.remove()));
const row27=(r,...L)=>r.querySelectorAll('.dl').forEach(d=>{const s=d.querySelector('span');if(s&&L.some(l=>s.textContent.trim().startsWith(l)))d.remove();});
const wr27=(k,f)=>{const o=V[k];if(o)V[k]=function(){return P27(o.apply(this,arguments),f);};};
/* Karar: tahmin ve politika kolları yalnız burada */
{const o=V.karar;V.karar=function(){return o.apply(this,arguments)+tahminP();};}
wr27('kurum',r=>rm27(r,'Gelecek ay tahmini','Politika Kolları'));
wr27('butce',r=>rm27(r,'Gelecek ay tahmini','Refah göstergeleri'));
wr27('vergi',r=>rm27(r,'Gelecek ay tahmini'));
/* Refah göstergeleri Nüfus ve sınıflar sekmesine taşındı */
{const o=V.nufus;V.nufus=function(){return o.apply(this,arguments)+P27(refahP(),r=>row27(r,'Nüfus'));};}
/* Masa: komuta masası, uyarılar (danışmanda var) ve trendler (İstatistik'te) kalktı */
wr27('masa',r=>rm27(r,'Komuta masası','Uyarılar','Trendler'));
/* Alt göstergeler: başka sekmelerde olan satırlar kalktı */
wr27('gost',r=>row27(r,'Gini','Yolsuzluk','Mülteci','Risk primi','10 yıllık tahvil'));
/* Meclis: koltuk çubukları grafikte; İttifak yalnız Meclis'te */
wr27('meclis',r=>{const p=r.querySelector('.panel>.fac');if(p)p.remove();});
{const o=V.kabine;V.kabine=function(){return P27(o.apply(this,arguments),r=>{[...r.children].forEach(e=>{if(/^(İttifak Ortakları|Parti .lişkileri)/i.test((e.textContent||'').trim())&&(e.tagName==='H2'||e.querySelector(':scope>b,:scope>h2,:scope>h3'))){const n=e.tagName==='H2'?e.nextElementSibling:null;n&&n.remove();e.remove();}});});};}
/* Menü düzeni */
GR[1][2]=['butce','vergi','piyasa','kurum','sektor','ticaret'];SUBN.kurum='MB ve Hazine';
GR[4][2]=['dis','orgut','askeri'];GR[5][1]='Veriler';GR[5][2]=['istat','gost'];SUBN.istat='İstatistik';
