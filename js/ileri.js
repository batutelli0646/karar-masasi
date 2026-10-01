/* ---------- Lobiler (sendika, iş dünyası, odalar, STK, vakıflar), bürokrasi ve dönem karnesi ---------- */
/* [id, ad, tutum hedefi, eylem etkisi (aylık, 2 ay), eylem metni, destek etkisi (tutum +100'de)] */
const LB=[['sen','Sendikalar',()=>(S.gr.ucret-50)*1.3+(S.gr.kamu-50)*.4-(S.isz-9.2)*2+(S.minw/28075/(S.cpi/100)-1)*60,{buy:-.25,huz:-.3,des:-.4},'genel grev uyarısı yaptı',{huz:.2}],
 ['isv','İş dünyası örgütleri',()=>(S.gr.sanayi-50)*1.2+(S.gr.esnaf-50)*.4+(S.buy-2.8)*4-(S.lv.faiz-F0)*.4+(S.pz.kn-42)*.5,{buy:-.3,isz:.15,des:-.2},'yatırım kararlarını erteledi',{buy:.05}],
 ['oda','Meslek odaları ve barolar',()=>(S.gr.kentli-50)+(S.bat-5)*3-yzI()*.6+27,{des:-.3,bat:-.1},'ortak açıklamayla hükümeti eleştirdi',{bat:.05}],
 ['stk','Sivil toplum kuruluşları',()=>(S.gr.genc-50)*.8+(S.gr.kentli-50)*.5+(S.huz-5)*2,{bat:-.15,huz:-.15,des:-.1},'kampanya başlattı',{bat:.04}],
 ['vak','Vakıf ve cemaatler',()=>(S.gr.muhaf-50)*1.2+(S.gr.milli-50)*.3+(S.des-41)*.3,{huz:-.2,des:-.15},'desteğini çekme sinyali verdi',{huz:.1}]];
const LBP={sen:60,isv:70,oda:40,stk:35,vak:50};
function ileriEnsure(){if(!S.lb){S.lb={};LB.forEach(l=>S.lb[l[0]]={t:0,pw:LBP[l[0]],cd:{},ey:0});}
  LB.forEach(l=>{const o=S.lb[l[0]];if(!o.lg)o.lg=[];if(!o.sj)o.sj=[0,0,0,0];});
  if(!S.bu)S.bu={kap:55,yz:45,ly:0,cd:{}};if(!S.kr)S.kr={n:0,s:0,ark:[],bn:0};
  for(const k in S.M){const m=S.M[k];if(m.yz===undefined)m.yz=clamp(rnd(15,50)-(m.sk-5)*3,0,100);}}
function isfx(){const F={};if(!S.lb||!S.bu||!S.gr||!S.pz)return F;const add=(o,m)=>{for(const k in o)F[k]=(F[k]||0)+o[k]*m;},b=S.bu;
  LB.forEach(l=>{const o=S.lb[l[0]],f=o.t/100*o.pw/100*(o.t<0?1.5:1);add({des:.25},f);add(l[5],f*2);if(o.ey>0)add(eyFx(l,o),o.pw/60);});
  add({des:(b.kap-50)*.002-(b.yz-45)*.004,bat:-(b.yz-45)*.0015,buy:(b.kap-50)*.002},1);return F;}
const krn=()=>{const pr=promRes().concat(S.pri.map(k=>['',PRI[k]&&PRI[k][2]()])),ul=v=>(v.reduce((a,b)=>a+b,0)/v.length);
  return [['Ekonomi',ul([lin(S.enf,80,15),lin(S.buy,-2,5),lin(S.isz,14,5),lin(S.acik,8,2)])],['Toplum',ul([lin(S.huz,2,8),lin(gDev(),-20,15),lin(uns(),70,10)])],['Dış ilişkiler',ul([lin((S.bat+S.dog+S.bol)/3,3,8),lin(S.pz.kn,25,70)])],['Güvenlik',ul([lin(S.ord,3,8),lin(gucu(),40,75)])],['Yönetim',ul([lin(S.bu.yz,80,20),lin(S.bu.kap,30,80),lin(S.par,3,8)])],['Sözler',pr.length?pr.filter(x=>x[1]).length/pr.length*100:50]];};
const krSc=()=>{const a=krn();return a.reduce((s,x)=>s+x[1],0)/a.length;};
const gr=v=>v>=85?'A':v>=70?'B':v>=55?'C':v>=40?'D':'F',grc=v=>v>=70?'good':v>=55?'warn':'bad';
function karneKaydet(){const k=S.kr;if(!k.n)return;const a=k.s/k.n;k.ark.push({t:S.term,avg:a,end:krSc()});k.bn=a>=85?2:a>=70?1:0;k.s=0;k.n=0;}
const karneBonus=()=>{const b=S.kr.bn;S.kr.bn=0;return b;};
function ileriUp(){const h=[];ileriEnsure();const b=S.bu;
  LB.forEach(l=>{const o=S.lb[l[0]];o.t=clamp(o.t+(clamp(l[2]()+lbD(l[0]),-100,100)-o.t)*.12+rnd(-3,3),-100,100);o.sj=o.sj.map(v=>clamp(v*.9+rnd(-3,3),-25,25));o.pw=clamp(o.pw+(o.t<-40?.3:(55-o.pw)*.015),10,90);
    if(o.ey>0)o.ey--;else if(o.t<-30&&Math.random()<.15){const e=eyPick(l[0],o);o.ey=e[2];o.ea=e[4];lbLg(o,'Eylem: '+e[0]);h.push(`${l[1]} ${e[1]}.`);}});
  const ks=Object.keys(S.M),av=ks.reduce((a,k)=>a+S.M[k].yz,0)/ks.length,sk=ks.reduce((a,k)=>a+S.M[k].sk,0)/ks.length;
  ks.forEach(k=>{const m=S.M[k];m.yz=clamp(m.yz+rnd(-1,2)*(m.gv<40?1.5:1)+(b.yz-45)*.01-b.ly*.3,0,100);
    if(m.yz>75&&Math.random()<.25){const o=S.own[k];h.push(o?`${m.name} hakkında yolsuzluk iddiaları gündemde; ${PART[o].n} ismi değiştirdi.`:`${m.name} hakkında yolsuzluk iddiaları gündemde, bakan görevden alındı.`);applyFx({des:-1.2,par:-.3,bat:-.15});S.M[k]=o?{...newM(),sk:Math.round(rnd(4,8)),note:PART[o].n+' kontenjanı',yz:30}:{...cd(),gv:50,yz:30};}});
  b.yz=clamp(b.yz+(av+(b.yb||0)-b.yz)*.1,0,100);b.kap=clamp(b.kap+(40+sk*3+rb('egit')*10+b.ly*4+(b.kb||0)-b.kap)*.04,0,100);b.kb=(b.kb||0)*.985;b.yb=(b.yb||0)*.985;
  S.kr.s+=krSc();S.kr.n++;return h.concat(lobiUp());}
function ileriClick(t){const d=t.dataset,b=S.bu;if(!d.lb&&!d.bz&&!d.bi&&!d.lbs)return false;ileriEnsure();if(d.lb)return lobiX(d.lb);if(d.lbs){S.lbs=d.lbs;render();return true;}
  const use=()=>true;
  if(false){}
  else if(d.bz==='ly'&&b.ly<3&&use(b,'ly',2,6)){b.ly++;S.gr.kamu=clamp(S.gr.kamu-4,0,100);logA('Bürokrasi','Liyakat düzenlemesi','Atamalar sınav ve kurallara bağlandı.');}
  else if(d.bz==='kd'&&b.ly>-2&&use(b,'kd',1,3)){b.ly--;b.yz=clamp(b.yz+3,0,100);S.gr.kamu=clamp(S.gr.kamu+3,0,100);applyFx({par:.4});logA('Bürokrasi','Kadrolaşma','Yakın isimler üst kademelere atandı.');}
  else if(d.bi){const k=d.bi,m=S.M[k];if(!m||S.own[k])return true;m.rv=S.month;const sm=su('bi'+k);suU('bi'+k);
    if(m.yz>60){b.yz=clamp(b.yz-5,0,100);applyFx({des:-.5,par:-.1});logA('Soruşturma',m.name,'Usulsüzlük bulundu, bakan görevden alındı.');S.M[k]={...cd(),gv:50,yz:30,rv:S.month};}
    else{m.yz=clamp(m.yz-6*sm,0,100);applyFx({par:-.15});logA('Soruşturma',m.name,'Bir usulsüzlük bulunmadı, denetim caydırıcı oldu.');}}
  else return true;
  hap(20,520);save();render();return true;}
const cdl=()=>null;
function buro(){const b=S.bu,a=avail(),ks=Object.keys(S.M).filter(k=>!S.own[k]).map(k=>[k,S.M[k]]).sort((x,y)=>y[1].yz-x[1].yz).slice(0,5);
  return `<h2>Bürokrasi</h2><div class="panel">${kv('Devlet kapasitesi',nf(b.kap,0)+'/100')}${gbar(b.kap,b.kap>=55?'good':b.kap>=40?'warn':'bad')}${kv('Yolsuzluk algısı',nf(b.yz,0)+'/100')}${gbar(b.yz,b.yz<40?'good':b.yz<60?'warn':'bad')}${kv('Liyakat düzeyi',(b.ly>0?'+':'')+b.ly)}
  <div class="note">Kapasite; bakan yetkinliği, eğitim bütçesi ve liyakatle artar, büyümeyi ve desteği yukarı çeker. Yolsuzluk algısı desteği, itibarı, riski ve kredi notunu bozar. Gizli yolsuzluk puanı yüksek bakanlar skandala yol açabilir.</div>
  <div class="lever"><span class="n">Liyakat düzenlemesi</span><span class="h">Kapasite hedefi +4, yolsuzluk baskısı azalır; kamu çalışanları tepkili. En fazla +3.</span><div class="step">${sbtn('data-bz="ly"','Uygula',a<2||cdl(b,'ly')||b.ly>=3)}</div></div>
  <div class="lever"><span class="n">Kadrolaşma</span><span class="h">Parti içi birlik +0,4; yolsuzluk algısı +3, kapasite düşer.</span><div class="step">${sbtn('data-bz="kd"','Ata',a<1||cdl(b,'kd')||b.ly<=-2)}</div></div></div>
  <div class="panel"><b>Bakan denetimi</b>${ks.map(([k,m])=>{const r=m.rv!==undefined&&S.month-m.rv<12;return `<div class="lever"><span class="n">${m.name}</span><span class="h">${ROLES[k]?ROLES[k][0]:(MIN.find(x=>x[0]===k)||[0,k])[1]+' Bakanı'} · ${r?'son denetimde risk '+nf(m.yz,0):'denetlenmedi'}</span><div class="step">${sbtn(`data-bi="${k}"`,'Soruştur',false)}</div></div>`;}).join('')}<div class="note">Liste gizli riskin en yüksek olduğu beş ismi gösterir. Soruşturma riski bulur (60 üstü: görevden alma), temizse riski 6 azaltır ve parti içinde hafif huzursuzluk yaratır.</div></div>`;}
function donem(){const it=krn(),sc=krSc(),k=S.kr,av=k.n?k.s/k.n:sc,best=k.ark.reduce((m,x)=>Math.max(m,x.avg),0);
  return `<h2>Dönem karnesi</h2><div class="panel"><div class="big" style="font-size:40px">${gr(sc)} <small class="dl">${nf(sc,0)}/100</small></div>${it.map(x=>kv(x[0],`<span class="st ${grc(x[1])}">${gr(x[1])}</span> ${nf(x[1],0)}`)+gbar(x[1],grc(x[1]))).join('')}${kv(S.term+'. dönem ortalaması',nf(av,0)+' ('+gr(av)+')')}${k.bn?kv('Sonraki dönem ödülü','Destek +'+k.bn*1.5):''}
  <div class="note">Karne; ekonomi, toplum, dış ilişkiler, güvenlik, yönetim ve verdiğin sözlerden hesaplanır. Dönem ortalaması 70'i geçerse sonraki dönemin başında halk desteği +1,5, 85'i geçerse +3 puan artar.</div></div>
  ${priP()}${anket()}${k.ark.length?`<div class="panel"><b>Arşiv</b>${k.ark.map(x=>kv(x.t+'. dönem',nf(x.avg,0)+' ('+gr(x.avg)+')')).join('')}${kv('En iyi dosya',nf(best,0))}</div>`:''}`;}
const krnEl=()=>{const it=krn(),sc=krSc();return `<div class="panel" style="text-align:left"><b>Dönem karnesi: ${gr(sc)}</b> <span class="dl muted">${nf(sc,0)}/100</span>${it.map(x=>kv(x[0],`<span class="st ${grc(x[1])}">${gr(x[1])}</span>`)).join('')}<div class="note">Dönem ortalaması 70 üstüyse sonraki dönemin başında halk desteği +1,5, 85 üstüyse +3 puan artar.</div></div>`;};
