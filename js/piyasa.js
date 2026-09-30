/* ---------- Piyasa (borsa, tahvil, kredi notu, yabancı akımı) ve savunma sanayii ---------- */
const lin=(v,a,b)=>clamp((v-a)/(b-a),0,1)*100;
const kv=(a,b)=>`<div class="dl" style="display:flex;justify-content:space-between;gap:10px"><span>${a}</span><span style="text-align:right">${b}</span></div>`;
const NOT=[[80,'A'],[68,'BBB'],[56,'BB+'],[46,'BB'],[36,'BB-'],[28,'B+'],[20,'B'],[0,'CCC']],notL=k=>NOT.find(n=>k>=n[0])[1];
const yzI=()=>S.bu?S.bu.yz:45;
/* risk primi: bütçe, borç, rezerv, cari açık, siyasi istikrar ve yolsuzluk algısından */
const rsk=()=>clamp(2+(S.acik-3)*.5+(S.borc-45)*.06+(35-S.rez)*.04+(S.cari-30)*.03+(S.par<4?1:0)+(S.huz<4?1:0)+(yzI()-45)*.03,1,14);
const tvf=()=>clamp(S.lv.faiz*.45+S.enf*.4+rsk()*1.2,5,150);
function piyasaEnsure(){if(!S.pz)S.pz={b:100,kn:42,fa:0,r:0,h:[100],cd:{},oz:0,ks:0};if(!S.sy)S.sy={kap:30,ihr:0,ks:[],amb:0,cd:{}};if(!S.pz.sd)S.pz.sd=[];}
/* sürekli etkiler (saf fonksiyon: tahmin paneli de kullanır) */
function psfx(){const F={};if(!S.pz||!S.sy)return F;const p=S.pz,y=S.sy,tv=tvf(),ad=(k,v)=>{F[k]=(F[k]||0)+v;};
  ad('rez',p.fa*.25+(p.ks?.3:0));ad('buy',p.fa*.003-(tv-40)*.001+y.ihr*.0005-(p.ks?.03:0));ad('acik',(tv-40)*.003);ad('des',clamp(p.r-S.enf/12,-8,8)*.01);
  ad('cari',-y.ihr*.003);ad('ord',(y.kap-30)*.002);return F;}
const dnP=()=>PROJ.filter(x=>S.done[x[0]]).length;
function piyasaUp(){const h=[];piyasaEnsure();const p=S.pz,y=S.sy,rk=rsk(),k0=p.kn;
  const tg=clamp(52-rk*2.6+(S.bat-5)*1.2+(S.buy-2.8)*.8-(S.enf-40)*.06-(p.ks?8:0),5,95);p.kn=clamp(p.kn+(tg-p.kn)*.04+rnd(-.3,.3),0,100);
  if(notL(p.kn)!==notL(k0)){const up=p.kn>k0;h.push(`Kredi derecelendirme kuruluşu notu ${notL(k0)} → ${notL(p.kn)} ${up?'yükseltti':'düşürdü'}.`);applyFx({bat:up?.2:-.2,des:up?.4:-.6,rez:up?1:-1.5});}
  p.fa=(p.kn-42)*.12-(rk-4)*.8+rnd(-1.5,1.5);if(p.ks&&p.fa<0)p.fa*=.3;
  p.r=clamp(S.enf/12*.8+(S.buy-2.8)*.6-(S.lv.faiz-45)*.06+(p.kn-42)*.03+(S.huz-5)*.4+(S.des-41)*.02+rnd(-5,5),-25,25);
  p.b*=1+p.r/100;p.h.push(p.b);if(p.h.length>13)p.h.shift();
  if(p.r-S.enf/12<-10)h.push(`Borsa sert düştü: aylık %${nf(p.r,1)}.`);
  if(p.fa<-4)h.push('Yabancı yatırımcı çıkışı hızlandı, rezerv baskı altında.');
  /* savunma sanayii */
  const tk=clamp(20+rb('sav')*50+(S.sec.san-50)*.4+dnP()*6-(y.amb>0?15:0),5,95);y.kap=clamp(y.kap+(tk-y.kap)*.03,0,100);
  y.ks=y.ks.filter(c=>{c.left--;S.ul[c.id]=clamp(S.ul[c.id]+.3,0,100);return c.left>0;});
  y.ihr=y.kap/100*(2.5+y.ks.length*3.5)*(y.amb>0?.6:1);S.sec.san=clamp(S.sec.san+(y.kap-30)*.002,0,100);
  if(y.amb>0){y.amb--;if(!y.amb)h.push('Savunma sanayii ambargosu sona erdi.');}
  else if((S.bat<4.5||natoAskida())&&Math.random()<.07){y.amb=12;h.push('Batılı ülkeler savunma sanayii ambargosu uyguladı: üretim ve ihracat zorlaştı.');applyFx({bat:-.2,ord:-.2});}
  return h;}
function piyasaClick(t){const d=t.dataset,p=S.pz,y=S.sy;if(!d.pz&&!d.sy)return false;const [a,b]=(d.pz||d.sy).split(':'),i=+b;
  if(d.pz&&a==='rs'){const x=PR[i];if(!x)return true;const m=su('rs');p.kn=clamp(p.kn+x[2]*m,0,100);applyFx(sfx2(x[3],m));suU('rs');logA('Yatırımcı turu',x[0],'Not görünümü +'+nf(x[2]*m,1)+'.');}
  else if(d.pz&&a==='oz'){const x=PV[i];if(!x||p.sd.includes(i))return true;p.sd.push(i);p.oz=p.sd.length;p.b*=1.03;S.gr.kamu=clamp(S.gr.kamu-x[3],0,100);applyFx({...x[2],des:-.4});logA('Özelleştirme',x[0],'Satıldı: rezerv ve bütçe rahatladı, kamu çalışanları tepkili.');}
  else if(d.pz==='ks'){p.ks=p.ks?0:1;logA('Sermaye kontrolleri','Piyasa',p.ks?'Devreye alındı: çıkışlar yavaşlar, güven azalır.':'Kaldırıldı.');}
  else if(d.sy&&a==='yat'){const x=SY[i];if(!x)return true;const m=su('yat');y.kap=clamp(y.kap+x[2]*m,0,100);applyFx(sfx2(x[3],m));suU('yat');logA('Savunma sanayii',x[0],'Kapasite +'+nf(x[2]*m,1)+'.');}
  else if(d.sy&&a==='k'){const id=b;if(y.ks.length>=3||y.ks.some(c=>c.id===id)||S.ul[id]<55)return true;y.ks.push({id,left:18});S.ul[id]=clamp(S.ul[id]+4,0,100);logA('Savunma ihracatı',CT.find(c=>c[0]===id)[1],'18 aylık ihracat anlaşması imzalandı.');}
  else return true;
  hap(20,520);save();render();return true;}
const spk=a=>{const mn=Math.min(...a),mx=Math.max(...a);return a.map(v=>'▁▂▃▄▅▆▇█'[Math.round((v-mn)/((mx-mn)||1)*7)]).join('');};
function piyasa(){const p=S.pz,k=p.kn,c=k>=56?'good':k>=36?'warn':'bad',rk=rsk(),ch=p.h.length>1?p.b/p.h[p.h.length-2]-1:0,a=avail();
  return `<h2>Piyasa</h2><div class="panel">${kv('Kredi notu (kurgusal kuruluş)',`<b>${notL(k)}</b> <span class="st ${c}">${nf(k,0)}/100</span>`)}${gbar(k,c)}${kv('10 yıllık tahvil faizi','%'+nf(tvf(),1))}${kv('Risk primi',nf(rk,1)+' puan')}${kv('Borsa endeksi',nf(p.b,0)+' <small style="color:var(--'+(ch>=0?'good':'bad')+')">('+(ch>=0?'+':'−')+'%'+nf(Math.abs(ch)*100,1)+')</small>')}<div class="dl" style="font-family:var(--mono);letter-spacing:2px;text-align:right">${spk(p.h)}</div>${kv('Yabancı portföy akımı',(p.fa>=0?'+':'−')+nf(Math.abs(p.fa),1)+' mlr $/ay')}
  <div class="note">Not; bütçe açığı, borç, rezerv, cari açık, yolsuzluk algısı ve istikrardan oluşur. Düşük not yabancı çıkışı ve yüksek faiz demektir. Borsa ve akım rezervi, büyümeyi ve desteği etkiler. Tahvil faizi bütçe yükünü artırır.</div></div>
  <div class="panel"><b>Eylemler</b><div class="lever"><span class="n">Yatırımcı turu</span><span class="h">${PR.map(x=>x[0]+': not +'+x[2]).join(' · ')}.${sat(su('rs'))}</span><div class="step">${PR.map((x,i)=>sbtn(`data-pz="rs:${i}"`,x[0])).join('')}</div></div>
  <div class="lever"><span class="n">Kamu varlığı sat (${p.sd.length}/${PV.length})</span><span class="h">${PV.map((x,i)=>x[0]+(p.sd.includes(i)?' (satıldı)':': rezerv +'+x[2].rez)).join(' · ')}. Kamu çalışanları tepkili.</span><div class="step">${PV.map((x,i)=>sbtn(`data-pz="oz:${i}"`,x[0].split(' ')[0],p.sd.includes(i))).join('')}</div></div>
  <div class="lever"><span class="n">Sermaye kontrolü ${p.ks?'(açık)':''}</span><span class="h">Çıkış akımları %70 azalır, rezerv hafif rahatlar. Not hedefi −8 ve büyüme baskılanır.</span><div class="step">${sbtn('data-pz="ks"',p.ks?'Kaldır':'Uygula')}</div></div></div>`;}
function ssan(){const y=S.sy,c=y.kap>=55?'good':y.kap>=30?'warn':'bad',a=avail(),el=CT.filter(x=>S.ul[x[0]]>=55&&!y.ks.some(k=>k.id===x[0]));
  return `<h2>Savunma sanayii</h2><div class="panel">${kv('Üretim kapasitesi',nf(y.kap,0)+'/100')}${gbar(y.kap,c)}${kv('Yıllık ihracat',nf(y.ihr,1)+' mlr $')}${kv('Tamamlanan projeler',dnP()+'/'+PROJ.length)}${y.amb>0?`<div class="dl"><span class="st bad">Ambargo</span> ${y.amb} ay daha sürecek: kapasite hedefi −15, ihracat %40 düşük</div>`:''}
  <div class="note">Kapasite; savunma bütçesi, sanayi sektörü ve tamamlanan projelerle yükselir. İhracat cari açığı azaltır. Batı itibarı 4,5'in altına düşerse veya NATO ayrıcalıkları askıdayken ambargo riski doğar.</div>
  <div class="lever"><span class="n">Üretim yatırımı</span><span class="h">${SY.map(x=>x[0]+': '+x[1]).join(' ')}${sat(su('yat'))}</span><div class="step">${SY.map((x,i)=>sbtn(`data-sy="yat:${i}"`,x[0].split(' ')[0]+' '+x[0].split(' ')[1])).join('')}</div></div></div>
  <div class="panel"><b>İhracat anlaşmaları (${y.ks.length}/3)</b>${y.ks.map(k=>`<div class="dl">${CT.find(c=>c[0]===k.id)[1]}: ${k.left} ay kaldı</div>`).join('')||'<div class="dl muted">Yok</div>'}${el.map(x=>`<div class="lever"><span class="n">${x[1]}</span><span class="h">İlişki ${nf(S.ul[x[0]],0)} · 18 ay · ihracat +3,5 mlr $ · ilişki +4</span><div class="step">${sbtn(`data-sy="k:${x[0]}"`,'İmzala',y.ks.length>=3)}</div></div>`).join('')}<div class="note">Anlaşma için ilişki puanı 55 ve üstü olmalı. Ülkelerle ilişkiyi Ülkeler sekmesinden yönet.</div></div>`;}
