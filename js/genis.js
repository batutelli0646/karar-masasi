/* ---------- Genişleme 1: komuta kademesi, diplomasi, istihbarat, kurum kur, örgüt başkanlığı ---------- */
const fxo=o=>{const r={...o};delete r.rel;return r;},mrg=(F,o,m=1)=>{for(const k in o)if(k!=='rel')F[k]=(F[k]||0)+o[k]*m;return F;};
const rel=(c,v)=>{if(S.ul&&S.ul[c]!==undefined)S.ul[c]=clamp(S.ul[c]+v,0,100);},relB=(c,v)=>{if(S.ub)S.ub[c]=clamp((S.ub[c]||0)+v,-25,25);};
/* Komuta kademesi: [ad, açıklama, etki (hz/tc doğrudan güce, diğerleri aylık)] */
const KK=[['kara','Kara Kuvvetleri'],['hava','Hava Kuvvetleri'],['deniz','Deniz Kuvvetleri']];
const KO={kara:[['Orgeneral Burak Aslan','Piyade ve zırh uzmanı: hazırlık +4, tecrübe +2.',{hz:4,tc:2}],['Orgeneral Elif Güler','Sınır harekâtı tecrübeli: tecrübe +6, ordu memnuniyeti artar.',{tc:6,ord:.02}],['Orgeneral Kaan Soylu','Lojistik ve modernizasyoncu: hazırlık +6, cari açığa katkı.',{hz:6,cari:-.01}]],
 hava:[['Orgeneral Zeynep Koç','Hava savunma uzmanı: hazırlık +5, Batı itibarı.',{hz:5,bat:.01}],['Orgeneral Murat Er','Yerli SİHA savunucusu: tecrübe +4, sanayiye katkı.',{tc:4,cari:-.015}],['Orgeneral Cem Arıkan','Genç ve reformcu: tecrübe +5, hazırlık +2.',{tc:5,hz:2}]],
 deniz:[['Oramiral Selim Baltacı','Mavi Vatan doktrini: hazırlık +4, bölge itibarı.',{hz:4,bol:.01}],['Oramiral Aylin Demir','Deniz ticareti ve güvenlik: cari açığa katkı.',{tc:3,cari:-.02}],['Oramiral Ozan Kılıç','Denizaltı ve teknoloji: tecrübe +6.',{tc:6,ord:.01}]]};
const kkf=()=>{const r={hz:0,tc:0};if(!S.kk)return r;KK.forEach(([b])=>{const i=S.kk[b],c=i>=0&&KO[b][i];if(c){r.hz+=c[2].hz||0;r.tc+=c[2].tc||0;}});return r;};
/* Diplomasi: diplomat kolordusu, ülke özel kuralları, istihbarat */
const DM=[['Kapalı',{}],['Ekonomik',{rel:1}],['Askeri dâhil',{rel:1.5,ord:.008}]];
const TR=[['Kapalı',{rel:-.5}],['Normal',{}],['Öncelikli',{rel:.4,cari:-.03,buy:.01}]],TF=[['Düşük',{rel:.45,cari:.04,acik:.01,buy:.01}],['Normal',{}],['Yüksek',{rel:-.6,cari:-.04,acik:-.01}]],GA=[['Yok',{}],['Var',{rel:.4,huz:-.012,acik:-.01}]];
const dpMax=()=>clamp(3+Math.floor(S.month/12)+(S.M.dis&&S.M.dis.sk>=8?1:0),3,8),dpN=()=>Object.values(S.dp.m).filter(v=>v>0).length;
const IO=[['Siber dinleme','Huzursuzluk kaynaklarını izle: huzur +0,15, ordu +0,05.',{huz:.15,ord:.05},0],['Karşı casusluk','Yabancı ajanları temizle: Batı +0,05, huzur +0,1.',{bat:.05,huz:.1},0],['Dış operasyon','Riskli: başarı şansı istihbarat gücüne bağlı; başarıda ordu +0,3.',{ord:.3,dog:.1},1]];
const ig=()=>S.dp.ig;
/* Kurum kur */
const KT=[['Emtia Kartelı','Üyeler rezerv ve gelir toplar.',{rez:.15,cari:-.04,bat:-.01}],['Ekonomik Birlik','Ortak pazar: büyüme ve cari açık.',{buy:.05,cari:-.05,acik:.02}],['Askeri Pakt','Savunma paktı; ordu memnuniyeti.',{ord:.05,bat:-.02,bol:.01}],['Siyasi Blok','Bölgesel itibar ve destek.',{bol:.04,des:.03,bat:-.01}]];
const BKO=['bm','g20','iit'];
const KUN=['Anadolu','Karadeniz','Akdeniz','Boğaz','Orta Koridor','Hazar'];
function genisEnsure(){if(!S.kk)S.kk={kara:-1,hava:-1,deniz:-1};if(!S.dp)S.dp={m:{},ok:{},ig:{on:0,g:0}};if(!S.dp.ok)S.dp.ok={};if(!S.dp.ig)S.dp.ig={on:0,g:0};if(!S.ku)S.ku=[];if(S.dpc===undefined)S.dpc='usa';
  if(S.og)ORG.forEach(o=>{const g=S.og[o[0]];if(!g.h)g.h=[];if(g.bk===undefined)g.bk=0;});}
const okc=c=>{const o=S.dp.ok;if(!o[c])o[c]={tr:1,tf:1,ga:0};return o[c];};
function gfxA(){const F={};if(!S.kk||!S.dp)return F;
  KK.forEach(([b])=>{const i=S.kk[b];if(i>=0)mrg(F,KO[b][i][2],1);});delete F.hz;delete F.tc;
  Object.entries(S.dp.m).forEach(([c,v])=>{if(v>0){mrg(F,DM[v][1]);F.acik=(F.acik||0)+.004*v;}});
  Object.entries(S.dp.ok).forEach(([c,o])=>{const k=.3;mrg(F,TR[o.tr][1],k);mrg(F,TF[o.tf][1],k);mrg(F,GA[o.ga][1],k);});
  S.ku.forEach(u=>mrg(F,KT[u.t][2],u.m.length/6));
  ORG.forEach(o=>{const g=S.og[o[0]];if(g&&g.bk>0)mrg(F,{des:.04,bat:.015,ord:.01});});
  if(S.dp.ig.on){F.acik=(F.acik||0)+.01;F.huz=(F.huz||0)+S.dp.ig.g*.0004;}
  return F;}
function genisUp(){const h=[];genisEnsure();
  Object.entries(S.dp.m).forEach(([c,v])=>{if(v>0)relB(c,DM[v][1].rel);});
  Object.entries(S.dp.ok).forEach(([c,o])=>{relB(c,(TR[o.tr][1].rel||0)+(TF[o.tf][1].rel||0)+(GA[o.ga][1].rel||0));});
  S.ku.forEach(u=>{u.m.forEach(c=>rel(c,.1));if(Math.random()<.02&&u.m.length>3){const c=u.m.pop();h.push(`${u.n}: ${CT.find(x=>x[0]===c)[1]} üyelikten ayrıldı.`);}});
  S.ku=S.ku.filter(u=>u.m.length>=3||(h.push(`${u.n} dağıldı: yeterli üye kalmadı.`),false));
  const I=S.dp.ig;if(I.on)I.g=clamp(I.g+1.5,0,100);
  ORG.forEach(o=>{const g=S.og[o[0]];if(g.bk>0){g.bk--;if(!g.bk)h.push(`${o[1]} dönem başkanlığı sona erdi.`);}});
  return h;}
/* eylemler */
function genisClick(t){const d=t.dataset;
  if(d.kk){const [b,i]=d.kk.split(':');if(!KO[b])return true;S.kk[b]=+i;logA('Komuta kademesi',KK.find(x=>x[0]===b)[1],+i<0?'Komutan görevden alındı.':KO[b][+i][0]+' atandı.');hap(20,520);save();render();return true;}
  if(d.kka){KK.forEach(([b])=>{if(S.kk[b]<0)S.kk[b]=Math.floor(Math.random()*3);});logA('Komuta kademesi','Boşlar dolduruldu','Boş komutanlıklara atama yapıldı.');save();render();return true;}
  if(d.dpc){S.dpc=d.dpc;render();return true;}
  if(d.dpm){const [c,v]=d.dpm.split(':');if(+v>0&&!S.dp.m[c]&&dpN()>=dpMax())return true;S.dp.m[c]=+v;save();render();return true;}
  if(d.dok){const [c,k,v]=d.dok.split(':');okc(c)[k]=+v;save();render();return true;}
  if(d.ult){const c=d.ult,u=CT.find(x=>x[0]===c);if(!u)return true;const m=su('ult'),p=clamp(.1+(gucu()-(CG[c]??45))/100,.05,.7)*(.6+.4*m);suU('ult');
    if(Math.random()<p){rel(c,-8);applyFx({ord:.3*m,bat:-.1,dog:-.05});logA('Ultimatom',u[1],'Karşı taraf geri adım attı: ordu memnuniyeti arttı, ilişki −8.');}
    else{rel(c,-20);applyFx({ord:-.2,[u[2]]:-.3,des:-.3});logA('Ultimatom',u[1],'Karşı taraf reddetti: ilişki −20, itibar kaybı.');}
    hap(20,520);save();render();return true;}
  if(d.igo){S.dp.ig.on=1;applyFx({acik:.15});logA('İstihbarat','Merkez','İstihbarat merkezi açıldı.');save();render();return true;}
  if(d.iop!==undefined){const x=IO[+d.iop];if(!x||!S.dp.ig.on)return true;const m=su('io');suU('io');
    if(x[3]){if(Math.random()<clamp(S.dp.ig.g/110,.1,.85)){applyFx(sfx2(x[2],m));logA('İstihbarat',x[0],'Operasyon başarılı.');}else{rel(['usa','rus','ger'][Math.floor(Math.random()*3)],-8);applyFx({bat:-.2,ord:-.1});logA('İstihbarat',x[0],'Operasyon ifşa oldu: ilişkiler zarar gördü.');}}
    else{applyFx(sfx2(x[2],m));logA('İstihbarat',x[0],'Uygulandı.'+sat(m));}
    hap(20,520);save();render();return true;}
  if(d.kt!==undefined){const ti=+d.kt;if(!KT[ti]||S.ku.length>=2)return true;const c=CT.filter(x=>S.ul[x[0]]>=50).sort((a,b)=>S.ul[b[0]]-S.ul[a[0]]).slice(0,7).filter(x=>Math.random()<S.ul[x[0]]/100+.1).map(x=>x[0]);
    if(c.length<3){logA('Kurum kur',KT[ti][0],'Yeterli üye bulunamadı: en az 3 ülkenin ilişkisi 50 üstü olmalı.');}else{const n=KT[ti][0].split(' ')[0]+' '+KUN[Math.floor(Math.random()*KUN.length)]+' Grubu';S.ku.push({t:ti,n,m:c});c.forEach(x=>rel(x,3));logA('Kurum kur',n,c.length+' üye ülkeyle kuruldu.');}
    hap(20,520);save();render();return true;}
  if(d.kf!==undefined){S.ku.splice(+d.kf,1);save();render();return true;}
  if(d.bk){const o=ORG.find(x=>x[0]===d.bk);if(!o||!BKO.includes(o[0])||S.og[o[0]].bk>0)return true;const m=su('bk'),p=clamp((oSup(o)-30)/60,.1,.9)*(.6+.4*m);suU('bk');
    if(Math.random()<p){S.og[o[0]].bk=12;logA('Başkanlık',o[1],'Dönem başkanlığı kazanıldı: 12 ay boyunca destek ve itibar artar.');}else{applyFx({des:-.2,bat:-.05});logA('Başkanlık',o[1],'Kampanya başarısız oldu.');}
    hap(20,520);save();render();return true;}
  return false;}
/* görünümler */
const dpBtn=(a,v,l,on)=>`<button class="btn sm ${on?'':'sec'}" ${a}="${v}">${l}</button>`;
function komP(){const k=kkf();
  return `<div class="panel"><b>Komuta kademesi</b> <span class="muted dl">· hazırlık +${k.hz}, tecrübe +${k.tc}</span>${KK.map(([b,n])=>{const i=S.kk[b];return `<div class="lever"><span class="n">${n}</span><span class="h">${i<0?'Atanmadı: komutan atayarak etki kazan.':KO[b][i][0]+' · '+KO[b][i][1]}</span><div class="step">${KO[b].map((c,j)=>dpBtn('data-kk',b+':'+j,c[0].split(' ').slice(-1)[0],i===j)).join('')}${i>=0?dpBtn('data-kk',b+':-1','Boşalt',0):''}</div></div>`;}).join('')}<div class="step" style="margin-top:8px">${sbtn('data-kka="1"','Boşları doldur')}</div><div class="note">Komutanlar savaş gücü endeksine ve aylık göstergelere katkı verir. Değişiklik beklemeden uygulanır.</div></div>`;}
function dipP(){const c=S.dpc,u=CT.find(x=>x[0]===c)||CT[0],o=okc(u[0]),dm=S.dp.m[u[0]]||0,I=S.dp.ig;
  return `<h2>Diplomasi</h2><div class="panel"><b>Diplomat kolordusu</b> <span class="muted dl">· ${dpN()}/${dpMax()} diplomat</span><div class="chips">${CT.map(x=>dpBtn('data-dpc',x[0],x[1]+((S.dp.m[x[0]]||0)>0?' ✓':''),x[0]===u[0])).join('')}</div>
  <div class="lever"><span class="n">${u[1]} · ilişki ${nf(S.ul[u[0]],0)}</span><span class="h">Diplomat modu: ilişki ve ikili ticarete etki. Her diplomat bütçeye küçük yük bindirir.</span><div class="step">${DM.map((m,i)=>dpBtn('data-dpm',u[0]+':'+i,m[0],dm===i)).join('')}</div></div>
  <div class="lever"><span class="n">Transit rotası</span><span class="h">Kapalı rota ilişkiyi bozar; öncelikli rota ticareti ve ilişkiyi artırır.</span><div class="step">${TR.map((m,i)=>dpBtn('data-dok',u[0]+':tr:'+i,m[0],o.tr===i)).join('')}</div></div>
  <div class="lever"><span class="n">Gümrük tarifesi</span><span class="h">Düşük tarife ilişkiyi artırır ama cari açığı büyütür; yüksek tarife tersi.</span><div class="step">${TF.map((m,i)=>dpBtn('data-dok',u[0]+':tf:'+i,m[0],o.tf===i)).join('')}</div></div>
  <div class="lever"><span class="n">Göçmen anlaşması</span><span class="h">Geri kabul ve sınır işbirliği: ilişki +, huzur −, bütçe +.</span><div class="step">${GA.map((m,i)=>dpBtn('data-dok',u[0]+':ga:'+i,m[0],o.ga===i)).join('')}</div></div>
  <div class="lever"><span class="n">Ultimatom</span><span class="h">Başarı şansı savaş gücüne ve ilişkiye bağlı. Başarısızlık ilişkiyi ve itibarı yaralar.${sat(su('ult'))}</span><div class="step">${sbtn(`data-ult="${u[0]}"`,'Ver')}</div></div></div>
  <div class="panel"><b>İstihbarat merkezi</b> <span class="muted dl">· ${I.on?'güç '+nf(I.g,0)+'/100':'kapalı'}</span>${I.on?gbar(I.g,I.g>=60?'good':'warn')+IO.map((x,i)=>`<div class="lever"><span class="n">${x[0]}</span><span class="h">${x[1]}</span><div class="step">${sbtn(`data-iop="${i}"`,'Yürüt')}</div></div>`).join('')+`<div class="note">Merkez her ay güç kazanır; operasyonlar tekrarlandıkça etkisi azalır.${sat(su('io'))}</div>`:`<div class="note">Ajanlar gölgede çalışır. Açılışta bütçe yükü oluşur, merkez zamanla güçlenir.</div><div class="step" style="margin-top:6px">${sbtn('data-igo="1"','Merkezi aç')}</div>`}</div>`;}
function orgX(){const H=[];ORG.forEach(o=>(S.og[o[0]].h||[]).forEach(x=>H.push([x[0],o[1],x[1],x[2]])));H.sort((a,b)=>b[0]-a[0]);
  return `<h2>Kurum kur</h2><div class="panel"><b>Kendi örgütün</b> <span class="muted dl">· ${S.ku.length}/2</span>${S.ku.map((u,i)=>`<div class="lever"><span class="n">${u.n}</span><span class="h">${KT[u.t][0]} · ${u.m.length} üye: ${u.m.map(c=>CT.find(x=>x[0]===c)[1]).join(', ')}. ${KT[u.t][1]}</span><div class="step">${sbtn(`data-kf="${i}"`,'Feshet')}</div></div>`).join('')}
  ${S.ku.length<2?KT.map((k,i)=>`<div class="lever"><span class="n">${k[0]}</span><span class="h">${k[1]} Etki (6 üyede): ${fxText(k[2])}.</span><div class="step">${sbtn(`data-kt="${i}"`,'Kur')}</div></div>`).join('')+'<div class="note">Üyeler, ilişkisi 50 üstü ülkelerden gelir; her biri ilişkisine göre katılmayı kabul eder.</div>':''}</div>
  <div class="panel"><b>Dönem başkanlığı</b>${ORG.filter(o=>BKO.includes(o[0])).map(o=>{const g=S.og[o[0]];return `<div class="lever"><span class="n">${o[1]}</span><span class="h">${g.bk>0?'Başkansın: '+g.bk+' ay kaldı. Destek ve itibar artıyor.':'Destek %'+nf(oSup(o),0)+' · kazanma şansı destek ve ilişkiye bağlı.'}</span><div class="step">${sbtn(`data-bk="${o[0]}"`,g.bk>0?'Başkan':'Aday ol',g.bk>0)}</div></div>`;}).join('')}<div class="note">NATO'da dönem başkanlığı yoktur, AB'de aday ve ŞİÖ'de diyalog ortağı olarak başkanlık hakkı bulunmaz. Başkanlık 12 ay sürer; kampanyalar tekrarlandıkça azalan etki verir.${sat(su('bk'))}</div></div>
  <div class="panel"><b>Geçmiş kararlar</b>${H.slice(0,8).map(x=>`<div class="dl" style="display:flex;justify-content:space-between;gap:8px;border-top:1px solid var(--line);padding:4px 0"><span>${x[1]} · ${x[2]}</span><span class="st ${x[3]?'good':'bad'}">${x[3]?'Geçti':'Reddedildi'}</span></div>`).join('')||'<div class="dl muted">Henüz oylama yok.</div>'}</div>`;}
