/* ---------- ek8.js (ui.js'ten sonra yüklenir): katlanır bölümler, onay, uyarılar, etki özeti, rehber ---------- */
/* ---------- Rehber ---------- */
TUT.push(['Kaydırıcılar ve miktarlar','Birçok kararda kaydırıcı vardır: ne kadar, yüzde kaç ya da kaç adet olacağını sen seçersin. Satırın altındaki yazı o değerin tahmini sonucunu gösterir; uyguladıktan sonra "Son sonuç" olarak kalır. Aynı kararı tekrarlamak etkisini azaltır.'],['Rezerv, savunma ve yasalar','Rezerv 0\'ın altına inerse bir kez IMF acil kredisi gelir; ikinci kez inerse ekonomi çöker. Savunma ithalatı rezervden ödenir. Yasalar Meclis oylamasıyla çıkar ve yürürlükten kaldırılabilir. Uzun bölümlere dokunarak aç ya da kapatabilirsin.']);
/* ---------- Uyarılar ve etki özeti (Masa) ---------- */
const warnP=()=>{const w=[];if(S.rez<20)w.push(`Rezerv ${nf(S.rez,0)} mlr $: ${S.imfK?'IMF can simidi kullanıldı, 0 altı çöküş getirir':'0 altına inerse IMF acil kredisi devreye girer'}.`);if(S.acik>9)w.push(`Bütçe açığı GSYH'nin %${nf(S.acik,1)}'i: borç ve enflasyon baskısı artıyor.`);if(S.enf>60)w.push(`Enflasyon %${nf(S.enf,0)}: halk desteği hızla eriyor.`);if(S.des<25)w.push(`Halk desteği ${nf(S.des,0)}: erken seçim riski yüksek.`);if(S.ord<=2.5)w.push('Ordu memnuniyeti kritik düzeyde.');if(S.par<=2.5)w.push('Parti içi destek kritik düzeyde.');
  return w.length?`<div class="panel" style="border-color:var(--bad)"><b style="color:var(--bad)">Uyarılar</b>${w.map(x=>`<div class="note" style="margin:3px 0">${x}</div>`).join('')}</div>`:'';};
const SHK=[['enf','Enflasyon','%',1,-1],['des','Halk desteği','',0,1],['acik','Bütçe açığı','%',1,-1],['rez','Rezerv',' mlr $',0,1],['isz','İşsizlik','%',1,-1],['kur','Dolar kuru',' ₺',1,-1],['huz','Huzur','/10',1,1]];
/* ---------- Son kararı geri al (ayda bir kez) ---------- */
let UPRE=null,UND=null;
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('button');UPRE=null;if(!t||!S||S.over||S.pick)return;const d=t.dataset;if(d.undo||d.cf==='1'||d.tab||d.new||d.wz!==undefined)return;try{UPRE={s:JSON.stringify(S),n:S.log.length,m:S.month,i:document.querySelector?(document.scrollingElement||{}).scrollTop:0};}catch(x){}},true);
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('button');if(t&&t.dataset.undo){const u=UND;if(!u||u.m!==S.month||S.undoM===S.month)return;const o=JSON.parse(u.s);for(const k of Object.keys(S))delete S[k];Object.assign(S,o);S.undoM=S.month;UND=null;save();render();return;}
  if(UPRE&&S&&S.log.length>UPRE.n&&S.month===UPRE.m){const l=S.log[S.log.length-1];UND={s:UPRE.s,m:UPRE.m,t:(l.t||'')+': '+(l.c||'')};}UPRE=null;});
const undoB=()=>UND&&UND.m===S.month?`<div class="chips" style="margin:8px 0 0">${sbtn('data-undo="1"','Son kararı geri al',S.undoM===S.month)}</div><div class="note">${S.undoM===S.month?'Bu ay geri alma hakkını kullandın.':'Son karar: '+UND.t+'. Ayda bir kez geri alabilirsin.'}</div>`:'';
const sumP=()=>{const h=S.sh||[],a=h[h.length-1],b=h[Math.max(0,h.length-4)],lg=(S.log||[]).filter(x=>x.m===S.month).slice(-6);
  if(h.length<2&&!lg.length)return UND&&UND.m===S.month?`<div class="panel"><b>Etki özeti</b>${undoB()}</div>`:'';return `<div class="panel"><b>Etki özeti</b>${a&&b&&a!==b?`<div class="note" style="margin:2px 0 6px">${dateLabel(b.m)} ile ${dateLabel(a.m)} arasındaki değişim:</div>${SHK.map(([k,n,u,d,g])=>{const v=a[k]-b[k],c=Math.abs(v)<.05?'':(v*g>0?'good':'bad');return `<div class="dl" style="display:flex;justify-content:space-between;padding:2px 0"><span>${n}</span><span class="st ${c}">${v>=0?'+':'−'}${nf(Math.abs(v),d)}${u}</span></div>`;}).join('')}`:'<div class="note">Birkaç ay oynayınca kararlarının etkileri burada özetlenir.</div>'}${lg.length?`<div class="dl" style="margin-top:8px"><b>Bu ay verdiğin kararlar</b></div>${lg.map(x=>`<div class="note" style="margin:2px 0">${x.t}: ${x.c}${x.msg?' — '+x.msg:''}</div>`).join('')}`:''}${undoB()}</div>`;};
{const _m=masa;masa=function(){return warnP()+sumP()+_m();};}
{const _u=arayuzUp;arayuzUp=function(){const r=_u.apply(this,arguments);S.sh=S.sh||[];S.sh.push({m:S.month,enf:S.enf,des:S.des,acik:S.acik,rez:S.rez,isz:S.isz,kur:S.kur,huz:S.huz});if(S.sh.length>13)S.sh.shift();return r;};}
/* ---------- Büyük kararlarda onay ---------- */
const CFM=/^(ozs|dfb|lawr|oxs|dsg)$/,CFX=['kkm','vf','k1','k8','k10','kapa','dvt'];
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('button');if(!t)return;const d=t.dataset,k=Object.keys(d).find(x=>CFM.test(x)),big=k||(d.xa&&CFX.includes(d.xa));if(!big||t.disabled)return;
  if(t.dataset.cf==='1')return;e.stopImmediatePropagation();e.preventDefault();t.dataset.cf='1';const o=t.textContent;t.textContent='Emin misin? Tekrar bas';setTimeout(()=>{if(t.isConnected){t.dataset.cf='';t.textContent=o;}},4000);},true);
/* ---------- Katlanır bölümler ---------- */
const COLT=['askeri','kurum','hizmet','ulke','lobi','meclis','ticaret','kabine','nufus','beled','sektor','piyasa','orgut','dis','buro','donem'];
function ek8Post(){if(!document.querySelector)return;const m=document.querySelector('main');if(!m)return;S.col=S.col||{};
  m.querySelectorAll('.panel').forEach(p=>{let t=p.firstElementChild,key,own=true;if(t&&t.tagName==='B'){key=t.textContent;}else{const pv=p.previousElementSibling;if(pv&&pv.tagName==='H2'){t=pv;key=pv.textContent;own=false;}else return;}
    const k=S.tab+'|'+key,v=S.col[k],tall=p.scrollHeight>600&&COLT.includes(S.tab);if(!tall&&v===undefined)return;const col=v===undefined?true:v===1;
    t.classList.add('cxt');t.dataset.ck=k;if(col){p.classList.add('cx');if(!own)p.classList.add('cxo');}t.dataset.cs=col?'1':'0';});}
{const _r=render;render=function(){_r();try{ek8Post();}catch(e){}};}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('.cxt');if(!t)return;S.col=S.col||{};const k=t.dataset.ck;S.col[k]=t.dataset.cs==='1'?0:1;save();render();});
render();
