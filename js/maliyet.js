/* Hamle maliyeti: ayda ücretsiz hamle bütçesi vardır; fazlası ekonomiyi (GSYH ve büyüme) zayıflatır. Siyasi sermaye gibi çalışır. */
(function(){
const free=()=>[10,8,6][S.dif===undefined?1:S.dif]||8;
const used=()=>Math.round((S.cur&&S.cur.spent)||0);
const exc=()=>Math.max(0,used()-free());
const lossG=x=>Math.min(.04,.005*x),lossB=x=>Math.min(1,.1*x);
window.kmHamle={free,used,exc};
if(typeof endTurn==='function'){const _e=endTurn;endTurn=function(){
  const m=S.month,x=exc(),ok=S.cur.events.every(e=>e.ch!==null);
  const r=_e.apply(this,arguments);
  if(ok&&x>0&&S.month>m&&!S.over){const g=lossG(x),b=lossB(x);S.gdp=Math.max(1,S.gdp*(1-g));S.buy=S.buy-b;
    logA('Hamle maliyeti','Fazla hamle ekonomiyi yordu',`Bütçeyi ${x} puan aştın: GSYH %${(g*100).toFixed(1).replace('.',',')} küçüldü, büyüme −${b.toFixed(1).replace('.',',')} puan.`);}
  return r;};}
if(!document.createElement||!document.head)return;
const st=document.createElement('style');st.textContent='.hmc{color:var(--accent);font-weight:700}.hmc.bad{color:var(--bad)}';document.head.appendChild(st);
function chip(){try{const s=document.querySelector('.brand small');if(!s||s.querySelector('.hmc'))return;const x=exc(),e=document.createElement('span');e.className='hmc'+(x>0?' bad':'');
  e.textContent=' · HAMLE '+used()+'/'+free()+(x>0?' (+'+x+' fazla: ekonomi zayıflar)':'');s.appendChild(e);}catch(e){}}
const _r=render;render=function(){const v=_r.apply(this,arguments);chip();return v;};chip();
})();
