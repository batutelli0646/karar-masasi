/* ---------- Parti içi siyaset: hizipler, kurultay, Cumhurbaşkanlığı dönem sınırı, erken seçim ---------- */
/* Hizipler: [anahtar, ad, ne ister] */
const HZF=[['R','Reformcular','Liyakat, hukuk devleti, Batı ile iyi ilişki ve mali disiplin ister.'],['G','Gelenekçiler','Muhafazakâr değerler, aile ve din politikaları, millî çizgi ister.'],['S','Sadakatçiler','Lidere bağlıdır; kadro, kaynak ve seçim zaferi ister.']];
/* Hizip eylemleri: [ad, açıklama] — etkileri hzAct içinde */
const HZA=[['Yönetimde temsil','MKYK ve il başkanlıklarında yer ver: memnuniyet ve ağırlık artar, diğerleri kıskanır.'],['Taleplerini karşıla',''],['Disipline et','Disiplin kuruluna sevk ve tasfiye: ağırlığı azalır ama küskünlük ve bölünme riski artar.']];
const HZT={R:'Liyakat ve hukuk sözü ver (Sadakatçiler rahatsız olur).',G:'Değerler paketi açıkla (Batı itibarı azalır, Reformcular rahatsız olur).',S:'Kadro ve kaynak dağıt (yolsuzluk algısı ve bütçe yükü artar).'};
const mTip=s=>Object.values(S.M).filter(m=>String(m.note||'').startsWith(s)).length;
function hzT(f){const b=S.bu||{ly:0,yz:45},G=S.gr||{};
  if(f==='R')return 50+(S.bat-5)*5+(b.ly||0)*6-((b.yz||45)-45)*.4-(S.enf-E0)*.25-(S.acik-3.6)*2+(mTip('Teknokrat')+mTip('Reformcu'))*2-(S.laws&&S.laws.medya?8:0);
  if(f==='G')return 50+((G.muhaf||50)-50)*.5+(rb('diyanet')+rb('aile'))*15+(S.pol&&S.pol.evbakim?4:0)-(S.bat-5)*1.5+mTip('Popülist');
  return 50+(S.des-41)*.7-(b.ly||0)*5+mTip('Sadık')*3+clamp(S.kamp||0,-6,3)*2+((S.mun||12)-12)*.8;}
const kurSup=()=>{const f=S.fac,t=f.R+f.G+f.S,m=S.fm;return clamp((f.S*(.55+m.S/220)+f.R*m.R/100+f.G*m.G/100)/t*100+(S.par-5)*2.5,0,100);};
function partiEnsure(){if(!S.fm)S.fm={R:50,G:50,S:60};if(!S.fb)S.fb={R:0,G:0,S:0};if(S.kurM===undefined)S.kurM=26;if(S.cbT===undefined)S.cbT=1;if(S.hzL===undefined)S.hzL=-99;
  if(S.nel===undefined)S.nel=S.month<=20?20:20+Math.ceil((S.month-20)/TERM)*TERM;}
const hzN=()=>{const f=S.fac,t=f.R+f.G+f.S;for(const k in f)f[k]=Math.max(5,f[k]/t*100);const t2=f.R+f.G+f.S;for(const k in f)f[k]=f[k]/t2*100;};
function partiUp(){const h=[];partiEnsure();const f=S.fac,m=S.fm;
  HZF.forEach(([k])=>{m[k]=clamp(m[k]+(clamp(hzT(k)+S.fb[k],0,100)-m[k])*.25,0,100);S.fb[k]*=.9;});
  const av=(m.R+m.G+m.S)/3,t=f.R+f.G+f.S;
  HZF.forEach(([k])=>{f[k]+=(m[k]-av)*.02;});hzN();
  S.par=clamp(S.par+HZF.reduce((a,[k])=>a+f[k]/100*(m[k]-50)*.003,0),0,10);
  HZF.forEach(([k,n])=>{if(m[k]<30&&S.month%6===0)h.push(`${n} hizbi rahatsız: parti içinde muhalefet sesleri yükseliyor.`);});
  /* bölünme: küskün ve büyük bir hizip partiden ayrılabilir (Sadakatçiler ayrılmaz) */
  HZF.forEach(([k,n])=>{if(k==='S'||m[k]>=22||f[k]<25||S.month-S.hzL<24||Math.random()>=.04)return;
    const x=PART[S.me].x+(k==='R'?-.4:.3),to=PK.filter(p=>p!==S.me).sort((a,b)=>Math.abs(PART[a].x-x)-Math.abs(PART[b].x-x))[0],mv=Math.max(1,Math.round(S.seats[S.me]*f[k]/100*.35));
    S.seats[S.me]-=mv;S.seats[to]+=mv;f[k]*=.4;hzN();S.fm[k]=45;S.hzL=S.month;applyFx({des:-1.5,par:1});
    h.unshift(`${n} hizbi partiden ayrıldı: ${mv} milletvekili istifa edip ${PART[to].n} saflarına geçti.`);logA('Parti',`${n} ayrıldı`,`${mv} milletvekili istifa etti.`);});
  /* olağan kurultay */
  if(S.month===S.kurM){const s=kurSup();S.kurM=S.month+36;
    if(s<42){S.over={t:'Kurultayda Genel Başkanlık Kaybedildi',x:`Olağan kurultayda delegelerin yalnızca %${nf(s,0)}'i seni destekledi. Rakip aday genel başkan seçildi ve partinin yeni lideri Cumhurbaşkanlığı adaylığını da devraldı.`,win:false};}
    else if(s<50){applyFx({par:-1});const w=HZF.reduce((a,[k])=>m[k]<m[a]?k:a,'R');f[w]+=3;hzN();h.unshift(`Olağan kurultayda zor kazandın (delege desteği %${nf(s,0)}). Rakip aday güçlü çıktı, parti içinde çatlak derinleşti.`);}
    else{applyFx({par:.5});h.unshift(`Olağan kurultayda yeniden genel başkan seçildin (delege desteği %${nf(s,0)}).`);}
    logA('Kurultay','Olağan kurultay','Delege desteği %'+nf(s,0)+'.');}
  return h;}
/* seçim takvimi ve dönem sınırı (Anayasa m.101, m.116) */
const cbLim=()=>S.cbT>=3||(S.cbT>=2&&!S.erkM);
function partiClick(t){const d=t.dataset;
  if(d.hz){const [k,i]=d.hz.split(':'),j=+i,mm=su('hz'+k+j);if(!S.fac[k])return true;suU('hz'+k+j);const oth=HZF.map(x=>x[0]).filter(x=>x!==k);
    if(j===0){S.fb[k]+=10*mm;S.fac[k]+=2*mm;oth.forEach(o=>S.fb[o]-=3*mm);}
    else if(j===1){S.fb[k]+=8*mm;if(k==='R')S.fb.S-=3*mm;if(k==='G'){S.fb.R-=3*mm;applyFx({bat:-.05*mm});}if(k==='S'){S.fb.R-=4*mm;if(S.bu)S.bu.yz=clamp(S.bu.yz+2*mm,0,100);applyFx({acik:.05*mm});}}
    else{S.fac[k]-=4*mm;S.fb[k]-=12;S.par=clamp(S.par-.3,0,10);oth.forEach(o=>S.fb[o]+=2*mm);}
    hzN();logA('Parti',HZF.find(x=>x[0]===k)[1],HZA[j][0]+'.'+sat(mm));hap(20,520);save();render();return true;}
  if(d.erk){if(d.erk==='cb'){if(S.cbc!==1){S.cbc=1;render();return true;}S.cbc=0;S.nel=S.month+2;S.erkM=0;logA('Erken seçim','Cumhurbaşkanı kararı','Seçimler yenilenecek: '+dateLabel(S.nel)+'.'+(S.cbT>=2?' Görevdeki Cumhurbaşkanı yeniden aday olamaz, parti halef aday gösterecek.':''));save();render();return true;}
    const l=['erken_'+S.month,'Seçimlerin Yenilenmesi Kararı',1,360,.35,'Meclis üye tamsayısının beşte üçüyle seçimlerin yenilenmesine karar verir. Görevdeki Cumhurbaşkanı ikinci dönemindeyse bir kez daha aday olabilir.',{},{erken:1}];S.cl=S.cl.slice(-19).concat([l]);propose(l[0],false);return true;}
  return false;}
function partiP(){partiEnsure();const f=S.fac,m=S.fm,ks=kurSup(),kl=S.kurM-S.month;
  return `<h2>Parti İçi Hizipler</h2><div class="panel"><div class="dl">Olağan kurultay: ${dateLabel(S.kurM)} (${kl} ay) · tahmini delege desteği <b class="st ${ks>=50?'good':ks>=42?'warn':'bad'}">%${nf(ks,0)}</b></div><div class="note" style="margin-top:2px">Delege desteği %42'nin altına düşerse kurultayda genel başkanlığı kaybedersin. Küskün ve büyük bir hizip partiden ayrılıp milletvekillerini başka partiye götürebilir.</div>
  ${HZF.map(([k,n,w])=>`<div class="lever"><span class="n">${n} · %${nf(f[k],0)}</span><span class="h">${w} Memnuniyet ${nf(m[k],0)}/100.${k!=='S'&&m[k]<22&&f[k]>=25?' <b style="color:var(--bad)">Bölünme riski</b>':''}</span>${gbar(m[k],m[k]>=50?'good':m[k]>=30?'warn':'bad')}<div class="step">${HZA.map((a,j)=>`<button class="btn sm sec" data-hz="${k}:${j}" title="${j===1?HZT[k]:a[1]}">${a[0]}</button>`).join('')}</div></div>`).join('')}
  <div class="note">Taleplerini karşıla: ${HZF.map(([k,n])=>n+': '+HZT[k]).join(' ')} Aynı hamleyi tekrarlamak etkisini azaltır.</div></div>`;}
function cbP(){partiEnsure();const l=S.nel-S.month,lim=cbLim();
  return `<h2>Cumhurbaşkanlığı</h2><div class="panel"><div class="dl">Görevdeki Cumhurbaşkanı: ${S.cbT}. dönem · sonraki seçim ${dateLabel(S.nel)} (${l} ay)</div><div class="dl">${lim?'<b style="color:var(--warn)">Dönem sınırı:</b> yeniden aday olamazsın, parti halef aday gösterecek (adayın etkisi belirsiz).':S.cbT>=2?'İkinci dönemdesin; Meclis seçimleri yenilediği için bir kez daha aday olabilirsin.':'Yeniden aday olabilirsin.'}</div>
  <div class="note">Anayasa m.101: bir kişi en fazla iki kez Cumhurbaşkanı seçilebilir; ikinci döneminde Meclis 360 oyla seçimleri yenilerse bir kez daha aday olabilir. Cumhurbaşkanı da seçimleri yenileyebilir, ancak o zaman ikinci dönemindeyse aday olamaz. İki durumda da Meclis ve Cumhurbaşkanlığı seçimi birlikte yapılır.</div>
  <div class="step" style="margin-top:8px">${sbtn('data-erk="m"','Meclis kararı (360 oy)',l<=3)}${sbtn('data-erk="cb"',S.cbc===1?'Emin misin? Tekrar bas':'Cumhurbaşkanı kararı',l<=3)}</div></div>`;}
