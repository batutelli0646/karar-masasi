/* ek10: ay atla, muhalefet/medya tepkisi, dönem notu ve paylaşım kartı, koalisyon yardımcıları */
/* ---------- Ay atla: yalnızca düşük etkili olaylarda, en az etkili seçenekle ---------- */
const skipBest=ev=>{const d=EVB[ev.id];if(!d||d.g==='kriz'||d.g==='kamp')return null;let bi=-1,bm=9;d.c.forEach((c,i)=>{if(c.fn)return;let t=0;for(const k in c.fx||{})if(RANGE[k])t+=Math.abs(c.fx[k])/(RANGE[k][1]-RANGE[k][0]);if(t<bm){bm=t;bi=i;}});return bi>=0&&bm<=.045?bi:null;};
const canSkip=()=>{try{return !S.over&&!S.scr&&!S.neg&&!S.pick&&!S.tut&&S.cur.events.some(e=>e.ch===null&&skipBest(e)!==null);}catch(e){return false;}};
const skipP=()=>canSkip()?`<div class="panel"><b>Sakin ay</b><div class="dl">${S.cur.events.filter(e=>e.ch===null&&skipBest(e)!==null).length} olay düşük etkili. Bunları en az etkili seçenekle hemen çözebilirsin; kalanlar sende.</div><div class="step" style="margin-top:8px"><button class="btn sm" data-skip="1">Düşük etkilileri geç</button></div></div>`:'';
for(const k of ['masa','karar']){const _m=V[k];V[k]=function(){return skipP()+_m();};}
/* ---------- Muhalefet ve medya tepkisi ---------- */
const TPK={enf:[3,'{L}: "Hayat pahalılığı hükümetin kararlarının sonucu."','Ekonomi basını "Enflasyonda gevşeme sinyali" manşetiyle çıktı.'],isz:[.6,'{L}: "İşsizlik artıyor, gençler geleceğinden endişeli."','Haber kanalları "İstihdamda toparlanma" başlığını kullandı.'],buy:[.8,'{L}: "Büyüme yavaşladı, hükümetin planı yok."','Medya: "Ekonomi beklentilerin üzerinde büyüdü."'],acik:[.7,'{L}: "Bütçe açığı kontrolden çıkıyor."','Analistler bütçe disiplinini olumlu karşıladı.'],borc:[2.5,'{L}: "Dış borç yükü gelecek nesillere miras kalıyor."','Piyasa yorumcuları borç göstergesindeki iyileşmeyi öne çıkardı.'],cari:[4,'{L}: "Cari açık tehlike çanları çalıyor."','Dış ticarette olumlu veri: cari açık daraldı.'],rez:[4,'{L}: "Rezervler eriyor, bu gidişat nereye?"','Merkez Bankası rezervlerinin artması piyasada olumlu karşılandı.']};
function tepkiM(){try{const H=S.hist,o={};let bk=null,bs=0;for(const k in TPK){const h=H[k];if(!h||h.length<2)continue;const d=h[h.length-1]-h[h.length-2],s=Math.abs(d)/TPK[k][0];if(s>=1&&s>bs){bs=s;bk=k;o.d=d;}}
  if(!bk||Math.random()>.55)return;const st=STATS.find(x=>x.k===bk),good=(o.d<0)===!!st.low;
  const op=PK.filter(k=>k!==S.me&&!S.coal.includes(k)).sort((a,b)=>S.seats[b]-S.seats[a])[0],ld=op?PART[op].lead:'Muhalefet lideri';
  applyFx({des:good?.3:-.3});logA(good?'Medya yorumu':'Muhalefet tepkisi',good?'Basın':'Muhalefet',TPK[bk][good?2:1].replace('{L}',ld));}catch(e){}}
{const _e=endTurn;endTurn=function(){const m0=S.month;_e();try{if(S.month!==m0&&!S.over){tepkiM();save();}}catch(e){}};}
/* ---------- Dönem notu ve paylaşım kartı ---------- */
const KRN=['enf','isz','buy','acik','borc','cari','des'];
function kdata(){const H=S.hist,L=STATS.filter(s=>H[s.k]&&H[s.k].length>1&&RANGE[s.k]),p=KRN.reduce((a,k)=>{const s=STATS.find(x=>x.k===k),c=s&&s.st?s.st(S[k]):'warn';return a+(c==='good'?2:c==='warn'?1:0);},0),f=p/(KRN.length*2);
  let g=f>=.8?'A':f>=.65?'B':f>=.5?'C':f>=.35?'D':'F';if(S.over&&S.over.win===false&&'ABC'.includes(g))g=String.fromCharCode(g.charCodeAt(0)+1);
  const sc=L.map(s=>{const h=H[s.k],c=(h[h.length-1]-h[0])/(RANGE[s.k][1]-RANGE[s.k][0]);return {s,v:(c<0)===!!s.low?Math.abs(c):-Math.abs(c)};}).sort((a,b)=>b.v-a.v);
  const rows=['enf','isz','buy','borc'].map(k=>{const s=STATS.find(x=>x.k===k);return `${s.l}: ${nf(S.hist[k][0],s.d)} → ${nf(S[k],s.d)} ${s.u}`;});
  return {g,rows,best:sc[0]&&sc[0].v>0?sc[0].s.l:null,worst:sc.length&&sc[sc.length-1].v<0?sc[sc.length-1].s.l:null,head:`${PART[S.me].n} · ${S.month-(S.h0||0)} ay (${nf((S.month-(S.h0||0))/12,1)} yıl) · ${S.term}. dönem`+(S.over?' · '+S.over.t:'')};}
const kartP=()=>{try{const d=kdata();return `<div class="panel"><b>Dönem notu: ${d.g}</b><div class="dl">${d.head}</div>${d.rows.map(r=>`<div class="dl">${r}</div>`).join('')}${d.best?`<div class="dl">En çok iyileşen: ${d.best}</div>`:''}${d.worst?`<div class="dl">En çok kötüleşen: ${d.worst}</div>`:''}<div class="step" style="margin-top:8px"><button class="btn sm" data-kshare="1">Paylaşım kartı oluştur</button></div><div id="kimg" style="margin-top:10px"></div></div>`;}catch(e){return '';}};
{const _d=V.donem;if(_d)V.donem=function(){return _d()+kartP();};}
function kshare(){try{const c=kdraw(),box=document.getElementById('kimg');if(box)box.innerHTML='<img src="'+c.toDataURL('image/png')+'" alt="Dönem notu kartı" style="max-width:100%;border-radius:12px"><div class="dl" style="margin-top:6px">Görsele basılı tutup kaydedebilirsin.</div>';
  c.toBlob(b=>{try{const f=new File([b],'karar-masasi-not.png',{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title:'Karar Masası dönem notu'}).catch(()=>{});}catch(e){}},'image/png');}catch(e){}}
/* ---------- Koalisyon: otomatik teklif ---------- */
function negAuto(){const n=S.neg,p=n.p,x=ask(p),l=MIN.filter(m=>!m[4]&&!S.own[m[0]]).map(m=>m[0]).sort((a,b)=>MVAL(p,b)-MVAL(p,a));let o=[],y=0;for(const k of l){if(y>=x)break;o.push(k);y+=MVAL(p,k);}
  o.slice().sort((a,b)=>MVAL(p,a)-MVAL(p,b)).forEach(k=>{if(y-MVAL(p,k)>=x){o=o.filter(z=>z!==k);y-=MVAL(p,k);}});n.off=o;n.msg=y>=x?'':'Tüm bakanlıkları versen de talebi karşılamıyor.';}
function ek10Click(t){const d=t.dataset;
  if(d.skip){const ev=S.cur.events;ev.forEach((e,i)=>{if(e.ch===null){const b=skipBest(e);if(b!==null)decide(i,b);}});if(S.cur.events.every(e=>e.ch!==null)){hap([30,50,30],392);endTurn();}else render();return true;}
  if(d.kshare){kshare();return true;}
  if(d.negauto){negAuto();render();return true;}
  if(d.negm){S.neg.more=!S.neg.more;render();return true;}
  return false;}
{const _a=arayuzClick;arayuzClick=function(t){return ek10Click(t)||_a(t);};}
render();
