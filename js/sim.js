/* ---------- Aylık simülasyon ---------- */
/* bütçe açığı hedefi: simülasyon ve bütçe ekranı aynı formülü kullanır */
const sfz=x=>x>20?20+(x-20)*.1:x<-20?-20+(x+20)*.1:x,taF=(X,F)=>3.6+X.dev-X.rev+(X.E.acik||0)+(F.acik||0)+(S.acikP||0)+(S.idb||0)*S.lv.faiz/100*.5+(S.borc-38)*.03+0.06*sfz(S.lv.faiz-F0)-0.15*(S.buy-2.8)+loanC();
function simulate(){
  const L=S.lv,s=S,mk=M,X=eco(),F=sfx(),e=k=>(X.E[k]||0)+(F[k]||0);
  const p0={des:s.des,par:s.par,ord:s.ord,huz:s.huz},g0=s.gdp,real=L.faiz-s.enf,sf=x=>x>20?20+(x-20)*.1:x<-20?-20+(x+20)*.1:x,rl=sf(real);
  let depr=1.6+0.05*(s.enf-E0)-0.03*clamp(s.rez-22,-30,40)-0.10*(rl-3)+rnd(-0.8,0.8)-(mk.maliye.sk-5)*0.1+(s.des<30?0.5:0)+(s.huz<4?0.4:0);
  depr+=0.3*Math.max(0,s.acik-7);depr+=(50-s.gv)*.012;if(typeof levD==='function')depr+=levD();depr=clamp(depr,-0.2,9);
  s.kur*=1+depr/100;s.gdp*=1+clamp(.25*(Math.min(s.enf,60)*.9/1200-depr/100)-Math.max(0,depr-3)*.004,-.03,.008); /* reel kur: GSYH'nın dolar değeri, kur artışı fiyat artışından hızlıysa küçülür, yavaşsa büyür */
  s.rez+=-0.3*Math.max(0,s.acik-7)-0.5+0.10*(rl-3)+(depr>4?-2:0)+(s.bat-5)*0.1+rnd(-0.6,0.6)-0.08*Math.max(0,s.rez-50)+e('rez');
  s.enf+=(rl-3>0?-0.09*(rl-3)*s.enf/(s.enf+12):-0.09*(rl-3))+(depr>1.6?0.5:0.25)*(depr-1.6)+0.06*Math.max(0,12-s.enf)+0.15*(s.acik-3.6)+rnd(-0.4,0.4)-(mk.mb.sk-5)*0.06+e('enf');
  const tg=2.8-0.06*clamp(real-3,-25,35)-.004*Math.max(0,real-10)**2+e('buy')-0.03*(s.enf-E0);
  s.buy+=(tg-s.buy)*0.25+rnd(-0.1,0.1);
  s.isz+=0.04*(3.0-s.buy)+0.02*(9.2-s.isz)+rnd(-0.05,0.05)+e('isz');
  const ta=taF(X,F);
  s.acik+=(ta-s.acik)*0.3;S.acikP=(S.acikP||0)*.96;S.tl=S.tl||{};TAX.forEach(t=>{const l=taxL(t[0]);S.tl[t[0]]=(S.tl[t[0]]??0)+(l-(S.tl[t[0]]??0))/6;});S.idb=(S.idb||0)*.995;
  S.debt=Math.max(0,(S.debt??s.borc*g0/100)+(0.10*(s.acik-2.5)+e('borc'))*g0/100);
  s.cari+=0.25*(s.buy-2.8)-0.1*(depr-1.6)+(34-s.cari)*0.012+rnd(-0.4,0.4)+e('cari');
  s.des+=-0.06*Math.max(s.enf-E0,-25)+0.35*(s.buy-2.5)-0.25*(s.isz-9.2)+0.1*(s.huz-5)-0.15+(41-s.des)*0.02+e('des');
  s.par+=(6-s.par)*0.05+(s.des-40)*0.01+e('par');
  s.kol+=(6-s.kol)*0.04;
  s.ord+=e('ord')+(mk.sav.sk-5)*0.008+(6-s.ord)*0.03;
  s.huz+=(mk.ic.sk-5)*0.03+(6-s.huz)*0.05-(s.enf-E0)*0.01+e('huz');
  ['bat','dog','bol'].forEach(k=>s[k]+=(({bat:5,dog:5,bol:6})[k]-s[k])*0.03+(mk.dis.sk-5)*0.004+e(k));
  s.pens+=.02;s.rez-=S.loans.reduce((a,l)=>a+l.amt*l.rate/1200,0);S.loans=S.loans.filter(l=>{if(l.end>s.month+1)return true;s.rez-=l.amt;S.debt=Math.max(0,S.debt-l.amt);return false;});
  s.gdp*=1+s.buy/1200;s.borc=S.debt/s.gdp*100;MIN.forEach(m=>{if(S.own[m[0]])s.kol+=(S.bud[m[0]]-m[2])/m[2]*.3;});
  for(const k in p0){const d=s[k]-p0[k],hi=k==='des'?45:6.5,top=k==='des'?78:9.5;if(d>0&&p0[k]>hi)s[k]=p0[k]+d*clamp((top-p0[k])/(top-hi),.08,1);} /* yüksek düzeylerde kazanım zorlaşır: destek en fazla ≈ %70 civarına yaklaşır */
  for(const k in RANGE)s[k]=clamp(s[k],RANGE[k][0],RANGE[k][1]);
  return depr;
}
function headlines(a,b,depr){
  const h=[];
  const d=k=>b[k]-a[k];
  if(d('enf')>0.8)h.push(`Enflasyon beklentilerin üzerinde: yıllık %${nf(b.enf,1)}.`);
  if(d('enf')<-0.8)h.push(`Enflasyonda gerileme: yıllık %${nf(b.enf,1)}.`);
  if(depr>4)h.push(`Dolar hızla yükseldi: ${nf(b.kur,2)} ₺.`);
  if(b.rez<10)h.push('Merkez Bankası rezervleri alarm veriyor.');
  if(d('des')<-1.5)h.push('Anketlerde iktidarın oyu düşüyor.');
  if(d('des')>1.5)h.push('Son anketlerde iktidara destek yükseldi.');
  if(b.ord<4)h.push('Kışlada huzursuzluk iddiaları gündemde.');
  if(b.huz<4)h.push('Sokaklarda gerilim artıyor.');
  if(b.kol<4)h.push('İttifak ortağından "erken seçim" sinyali.');
  if(b.par<4)h.push('Parti içi muhalifler kurultay istiyor.');
  if(b.buy>4)h.push('Ekonomi beklentilerin üzerinde büyüyor.');
  if(b.isz>12)h.push('İşsizlik endişe verici seviyede.');
  if(!h.length)h.push('Piyasalar sakin, siyasi gündem yoğun.');
  return h.slice(0,4);
}
const aPt=()=>{const c=S.coal||[];return (S.ally||c.length)&&c[0]&&PART[c[0]]?c[0]:null;},aW=pt=>{const wm=PART[S.me].w*1.6,wp=PART[pt].w*(1+(S.kol-6)*.04);return wm/(wm+wp);};
const pvt=el=>{const pt=aPt();return clamp(pt?vote(el)*aW(pt):vote(el)*(.45+.55*PART[S.me].w/35),1,55);}; /* ittifak varsa iktidar oyu (destek) ortaklar arasında taban gücüne göre bölünür */
function vote(el){return clamp(S.des*0.92+(S.huz-5)*0.6+(S.par-5)*0.5+clamp(S.kamp||0,-6,3)+priV()+gDev()*.05+(el?promRes().reduce((a,r)=>a+(r[1]?1.5:-3),0):0),8,52);}
function checkEnd(){
  if(S.des<12)return {t:'Erken Seçim ve İktidar Kaybı',x:'Halk desteği çöktü. Meclis 360 oyla seçimlerin yenilenmesine karar verdi ve erken seçimi kaybettin.'};
  if(S.par<=1)return {t:'Parti Seni Devirdi',x:'Parti içi isyan sonuç verdi. Olağanüstü kurultayda liderlikten alındın.'};
  if(S.ord<=1)return {t:'Askeri Müdahale',x:'Ordu içinde biriken huzursuzluk patladı. Hükümet görevden uzaklaştırıldı.'};
  if(S.rez<=-5)return {t:'Ekonomik Çöküş',x:'Rezervler tükendi, dış borç ödemeleri aksadı. Ülke ödeme dengesi krizine girdi.'};
  return null;
}
function endTurn(){
  if(S.cur.events.some(e=>e.ch===null))return;
  const a=snap();
  const depr=simulate();secUp();poll();tradeUp();mbUp();
  S.month++;
  if(isLocM()){
    if(S.des>=40){S.par+=1;S.des+=1;}else{S.par-=1.5;S.kol-=1;}
    S.mun=clamp(Math.round(.73*30*(pvt()-8)/50),0,30);if(typeof belSecim==='function'){belSecim();S.mun=belN(S.me);}S.flags.yerel=(S.des>=40?'Yerel seçimlerde iktidar kendi belediyelerini korudu.':'Yerel seçimlerde iktidar önemli kayıplar verdi.')+' Büyükşehir belediyesi: '+S.mun+'/30.';
  }
  if(S.des>62)S.des=62+(S.des-62)*.85;['ord','huz','par'].forEach(k=>{if(S[k]>8)S[k]=8+(S[k]-8)*.8;}); /* doygunluk: tam destek ve tam huzur gerçekçi değil */
  for(const k in RANGE)S[k]=clamp(S[k],RANGE[k][0],RANGE[k][1]);
  const b=snap();
  STATS.forEach(x=>S.hist[x.k].push(S[x.k]));
  const hl=headlines(a,b,depr);hl.push(...yeniUp(),...toplumUp(),...dunyaUp(),...piyasaUp(),...ileriUp(),...genisUp(),...genis2Up(),...partiUp(),...e2Up(),...d2Up(),...arayuzUp());hl.push('PPK toplantısı: Merkez Bankası %'+mbRec()+' faiz öneriyor.');
  if(isLocM())hl.unshift(S.flags.yerel);
  if(S.coal.length&&S.kol<=0){clearCoal();S.kol=4;S.par=clamp(S.par-.5,0,10);hl.unshift('İttifak ortağı ittifaktan çekildi. Yasa çıkarmak için Meclis\'te yeni destek gerekecek.');S.log.push({m:S.month,t:'İttifak çöktü',c:'Ortak çekildi',msg:'Uyum sıfıra indi. Meclis\'te ortaksız devam ediyorsun.'});}
  const over=checkEnd();
  if(over){S.over={...over,win:false};save();render();return;}
  if(isElM()){runElection();save();render();window.scrollTo({top:0});return;}
  const carry=0;
  S.prev=a;S.lv0={...S.lv};S.confirm=null;S.evo=null;
  genEvents();
  S.report={m:S.month,h:hl,carry,d:gzD(a,b)};
  save();render();window.scrollTo({top:0});
}

/* ---------- Bütçe, vergi, kurumlar, meclis, seçim ---------- */
const ALLY={AKP:'MHP',MHP:'AKP',CHP:'IYI',IYI:'CHP',DEM:'CHP',YRP:'AKP'};
const MV={maliye:5,ic:5,dis:4,sav:4,adalet:4,egit:3,saglik:3,calisma:3,ulas:3,enerji:3,sanayi:2,tarim:2,cevre:2,ticaret:2,aile:2,genc:1,kultur:1};
const cmp=(a,b)=>clamp(9-6*Math.abs(PART[a].x-PART[b].x),0,10);
const tl=p=>{const v=Math.abs(p)/100*S.gdp*S.kur;return (p<0?'−':'')+(v>=1000?nf(v/1000,2)+' trilyon ₺':nf(v,0)+' milyar ₺');};
const minName=k=>(MIN.find(m=>m[0]===k)||[])[1]||k;
const newM=()=>({name:NAMES1[Math.floor(Math.random()*16)]+' '+NAMES2[Math.floor(Math.random()*16)],sk:Math.round(rnd(3,9)),note:'Atanan isim'});
const govSeats=()=>S.seats[S.me]+S.coal.reduce((a,k)=>a+S.seats[k],0);
const best=()=>PK.filter(k=>k!==S.me).sort((a,b)=>cmp(S.me,b)-cmp(S.me,a))[0];
const MVAL=(p,k)=>MV[k]*(PART[p].want.includes(k)?1.5:1),ask=p=>3+S.seats[p]/22+(10-cmp(S.me,p))*.35;
const loanC=()=>S.loans.reduce((a,l)=>a+l.amt*l.rate/100,0)/S.gdp*100;
const logA=(t,c,msg)=>S.log.push({m:S.month,t,c,msg});
function clearCoal(){Object.keys(S.own).forEach(k=>{S.M[k]=newM();});S.own={};S.coal=[];}
const taxL=k=>{const t=TAX.find(x=>x[0]===k),r=S.tax[k],ref=t[5];return clamp(t[2]===1?r/ref:(r-ref)/(ref*.1),-8,8);}; /* vergi değişikliği fiyat düzeyini bir kez yükseltir: enflasyon etkisi gecikmeli düzeyle farka bağlı */
function eco(){const E={},K=1.5;let dev=0,rev=0;
  MIN.forEach(([k,,b,e])=>{const d=(S.bud[k]-b)/Math.max(b,1.5);dev+=S.bud[k]-b;for(const x in e)E[x]=(E[x]||0)+e[x]*d*K;});
  TAX.forEach(([k,,ty,R,e,ref])=>{const r=S.tax[k],base=ty===1?0:ref,l=taxL(k),lL=(S.tl||{})[k]??0;const xr=r/ref;rev+=R*(xr**.85*Math.exp(-.35*Math.max(0,xr-1.4)**2)-(base/ref)**.85);if(xr>1.5){E.buy=(E.buy||0)-.05*(xr-1.5)**2;E.des=(E.des||0)-.1*(xr-1.5)**2;}for(const x in e)E[x]=(E[x]||0)+e[x]*(x==='enf'?l-lL:l);});
  return {E,dev,rev};
}
function seatsFor(p,o,pt,nz=1){
  const oth=PK.filter(k=>k!==S.me&&k!==pt),w={},r=100-p-o;let ws=0;
  oth.forEach(k=>{w[k]=PART[k].w*(1+rnd(-.12,.12)*nz);ws+=w[k];});
  const sh={[S.me]:p,[pt]:o};oth.forEach(k=>sh[k]=r*w[k]/ws);if(oth.includes('DEM')&&sh.DEM<7.5){const dx=7.5-sh.DEM,rs=oth.filter(k=>k!=='DEM').reduce((a,k)=>a+sh[k],0);oth.forEach(k=>{if(k!=='DEM')sh[k]-=dx*sh[k]/rs;});sh.DEM=7.5;} /* DEM'in bölgesel tabanı barajın üstünde kalır */
  const th=(S.barajM!==undefined&&S.month-S.barajM>=12)?5:BAR,el=PK.filter(k=>k===S.me||sh[k]>=th||(k===pt&&S.ally)),tot=el.reduce((a,k)=>a+sh[k],0),se={};
  const pw=k=>Math.pow(sh[k],1.15),tw=el.reduce((a,k)=>a+pw(k),0);PK.forEach(k=>se[k]=el.includes(k)?Math.round(600*pw(k)/tw):0);se[S.me]+=600-PK.reduce((a,k)=>a+se[k],0);
  return {sh,se};
}
function initGov(){
  clearCoal();const pt=ALLY[S.me]||best();S.seats={AKP:268,CHP:169,MHP:50,IYI:43,DEM:65,YRP:5};S.coal=[pt];S.ally=true;S.kol=clamp(cmp(S.me,pt),5,8); /* 2023 genel seçim sonuçları (TİP DEM bloğuna eklendi); Cumhurbaşkanlığı sisteminde ittifak ortağı bakanlık almaz */
}
function bud(k,d){const b=MB[k],st=Math.max(.05,Math.round(b*10)/100),v=Math.round((S.bud[k]+d*st)*100)/100;if(v<b*.4-1e-9||v>b*2+1e-9)return;S.bud[k]=v;save();render();}
function propose(id,lobi){
  const l=LAWS.find(x=>x[0]===id)||S.cl.find(x=>x[0]===id),c=l[2]+(lobi?2:0);
  if(c>avail()||S.laws[id])return;
  const rows=PK.map(k=>{const s=S.seats[k];let f;
    if(k===S.me)f=clamp(.97+rnd(-.03,.02),.9,1);
    else if(S.coal.includes(k))f=clamp(.7+S.kol/30+rnd(-.08,.08)+(l[4]-.5)*.2,.5,1);
    else f=clamp(l[4]*.4+(lobi?.1:0)+cmp(S.me,k)/50-.08+rnd(-.1,.1),0,.95);
    const y=Math.round(s*f);return [k,y,s-y];});
  const yes=rows.reduce((a,r)=>a+r[1],0),ref=id==='anayasa'&&yes>=360&&yes<400,ok=id==='anayasa'?(yes>=400||(ref&&S.des+rnd(-6,6)>=47)):yes>=l[3];
  S.cur.spent+=c;S.lawT[id]=S.month+3;
  if(ok){const ms=S.cl.includes(l)?su('dr'+id.slice(0,3)):1;if(S.cl.includes(l))suU('dr'+id.slice(0,3));applyFx(sfx2(l[6],ms));S.laws[id]=Math.max(S.month,.01);if(id==='baraj')S.barajM=S.month;const ex=l[7];if(ex&&ex.base)S.laws[ex.base]=Math.max(S.month,.01);if(ex&&ex.tax){S.tax[ex.tax]=ex.v;S.tref=S.tref||{};S.tref[ex.tax]=ex.v;delete (S.tp||{})[ex.tax];if(ex.nw)S.laws['vt_'+ex.tax]=Math.max(S.month,.01);}if(ex&&ex.repeal){delete S.laws[ex.repeal];}if(ex&&ex.erken){S.nel=S.month+2;S.erkM=1;}S.cur.spent=Math.max(0,S.cur.spent-1);}else applyFx({des:-.3,par:-.3});
  hap(ok?[20,30,20]:60,ok?660:220);S.vote={n:l[1],d:l[5],rows,yes,need:l[3],ok};
  logA(l[1],ok?'Kabul edildi':'Reddedildi',`Oylama: ${yes} kabul, ${600-yes} ret (gerekli ${l[3]}).${ref?' Halkoylamasına gidildi: '+(ok?'evet çıktı.':'hayır çıktı.'):''}`);save();render();
}
function dropP(k){Object.keys(S.own).filter(m=>S.own[m]===k).forEach(m=>{S.M[m]=newM();delete S.own[m];});S.coal=S.coal.filter(x=>x!==k);S.kol=clamp(S.kol-1,0,10);logA('İttifak',PART[k].n+' hükümetten ayrıldı','Bakanlıkları geri aldın.');save();render();}
function offer(){
  const n=S.neg,p=n.p,y=n.off.reduce((a,k)=>a+MVAL(p,k),0),x=ask(p);
  if(cmp(S.me,p)<2.5){n.msg=`${PART[p].n} seninle ideolojik olarak ortaklık kurmayı reddediyor.`;return render();}
  if(y<x){const m=PART[p].want.find(k=>!n.off.includes(k)&&!S.own[k]);n.msg=`Teklif yetersiz. ${PART[p].n} en az ${nf(x,1)} puanlık bakanlık istiyor, sen ${nf(y,1)} puan sundun.${m?' Özellikle '+minName(m)+' Bakanlığına bakıyorlar.':''}`;return render();}
  
  S.coal.push(p);n.off.forEach(k=>{S.own[k]=p;S.M[k]={...newM(),sk:Math.round(rnd(4,8)),note:PART[p].n+' kontenjanı'};});
  S.kol=S.coal.length>1?(S.kol+cmp(S.me,p))/2:cmp(S.me,p);S.par=clamp(S.par-.35*n.off.length,0,10);
  logA('İttifak',PART[p].n+' hükümete katıldı',`${n.off.length} bakanlık verildi: ${n.off.map(minName).join(', ')}.`);S.neg=null;save();render();
}
function doAlly(){if(S.ally||avail()<3)return;S.ally=true;S.cur.spent+=3;S.kol=clamp(S.kol+1,0,10);logA('Seçim ittifakı','İttifak kuruldu','Ortak listeler ve baraj avantajı sağlandı.');save();render();}
function makeProm(id){const v=VAAT.find(x=>x[0]===id);if(S.prom.includes(id)||S.prom.length>=4||v[2]()||avail()<1)return;S.prom.push(id);S.cur.spent+=1;S.des=clamp(S.des+.8,0,100);logA('Vaat verdin',v[1],'Seçimde tutmazsan oy kaybedersin.');save();render();}
const promRes=()=>S.prom.map(id=>{const v=VAAT.find(x=>x[0]===id);return [v[1],v[2]()];});
function runElection(){
  S.cbH=cbLim();const hf=S.cbH?rnd(-5,2):0;S.nel=S.month+TERM;S.erkM=0;
  const pt=S.coal[0]||best(),ha=!!aPt(),p=pvt(1),o=ha?vote(1)-p:clamp(PART[pt].w*.8,1,40),{sh,se}=seatsFor(p,o,pt),pr=promRes();
  const bl=p+(ha?o:0)+hf,oth=PK.filter(k=>k!==S.me&&k!==pt),R=oth.reduce((a,k)=>sh[k]>sh[a]?k:a,oth[0]),Ra=ALLY[R]&&oth.includes(ALLY[R])?ALLY[R]:null,r2=bl>=50?bl:bl+oth.filter(k=>k!==R&&k!==Ra).reduce((a,k)=>a+sh[k]*(cmp(S.me,k)+.5)/(cmp(S.me,k)+cmp(R,k)+1),0)+rnd(-1.5,1.5); /* ikinci tur: rakip ittifak dışındaki seçmen ideolojik yakınlığa göre bölünür */S.cb={r1:bl,r2};
  if(r2<50){S.over={t:'Cumhurbaşkanlığı Seçimi Kaybedildi',x:`${S.cbH?'Dönem sınırı nedeniyle partinin halef adayı yarıştı. ':''}İlk turda ittifakın %${nf(bl,1)} oy aldı. ${bl>=50?'':'İkinci turda %'+nf(r2,1)+' ile kaybettin.'} Meclis'te ${se[S.me]} sandalye kazandın ama yürütme rakibe geçti.`,win:false,p};return;}
  if(PK.some(k=>k!==S.me&&se[k]>se[S.me])&&false){const top=PK.reduce((a,k)=>se[k]>se[a]?k:a);S.over={t:'İktidar Kaybı',x:`Seçimde %${nf(p,1)} oy aldın ve ${se[S.me]} sandalye kazandın. ${PART[top].n} ${se[top]} sandalyeyle önde bitirdi ve iktidara geliyor.`,win:false,p};return;}
  clearCoal();if(se[pt]>0)S.coal=[pt];S.seats=se;S.el={p,sh,se,pr}; /* seçim ittifakı seçimden sonra da sürer; ortağa bakanlık verilmez */
}
function finishEl(){
  const e=S.el;karneKaydet();if(S.cbH){S.cbT=1;logA('Cumhurbaşkanlığı','Halef aday kazandı','Partinin yeni adayı Cumhurbaşkanı seçildi; hükümet politikaların sürüyor.');}else S.cbT++;S.cbH=0;
  logA(`${S.term}. dönem seçimi`,`%${nf(e.p,1)} oy`,`${e.se[S.me]} sandalye. Hükümet: ${govSeats()} sandalye (${govSeats()>=301?'çoğunluk':'azınlık'}).`);
  S.ally=S.coal.length>0;S.prom=[];S.kamp=0;S.term++;S.des=clamp(S.des+2,0,100);const D=DON[Math.min(S.term,3)];if(D){applyFx(D.fx);S.sched.push({due:S.month,id:D.ev});}
  applyFx({des:karneBonus()*1.5});S.prev=snap();S.lv0={...S.lv};S.el=null;genEvents();
  S.report={m:S.month,h:[(D?D.t+'. '+D.x+' ':'')+`${S.term}. dönem başladı. Hükümetin Meclis'te ${govSeats()>=301?'çoğunluğu var':'çoğunluğu yok, yasalar için muhalefetle pazarlık gerekecek'}.`],carry:0};
  save();render();window.scrollTo({top:0});
}
const row=(n,h,v,a,chg)=>`<div class="lever"><span class="n">${n}</span><span class="h">${h}</span><div class="step"><button ${a} data-d="-1" aria-label="${n} azalt">−</button><output class="${chg?'chg':''}">${v}</output><button ${a} data-d="1" aria-label="${n} artır">+</button></div></div>`;
const sbtn=(attr,txt,dis)=>`<button class="btn sm" style="width:auto;min-width:88px" ${attr} ${dis?'disabled':''}>${txt}</button>`;
function butce(){
  const X=eco(),ta=taF(X,sfx()),tot=MIN.reduce((a,m)=>a+S.bud[m[0]],0);
  return `${tahminP()}${refahP()}<h2>Bakanlık Bütçeleri</h2><div class="panel"><div class="dl">GSYH ≈ ${nf(S.gdp*S.kur/1000,1)} trilyon ₺ (${nf(S.gdp,0)} mlr $)</div><div class="dl">Toplam harcama GSYH %${nf(tot,1)} ≈ ${tl(tot)}</div><div class="dl">Bütçe açığı hedefi GSYH %${nf(ta,1)} ≈ ${tl(ta)}</div><div class="note">17 bakanlığın bütçesini sen belirlersin. Artış hizmeti güçlendirir ve açığı büyütür. Değişiklikler ay sonunda işler.</div></div><div class="panel">${MIN.filter(m=>!m[4]).map(([k,n,b])=>row(n,`≈ ${tl(S.bud[k])} · taban %${nf(b,2)}`,'%'+nf(S.bud[k],2),`data-bud="${k}"`,Math.abs(S.bud[k]-b)>.001)).join('')}</div><h2>Kurum Bütçeleri</h2><div class="panel">${MIN.filter(m=>m[4]).map(([k,n,b])=>row(n,`≈ ${tl(S.bud[k])} · taban %${nf(b,2)}`,'%'+nf(S.bud[k],2),`data-bud="${k}"`,Math.abs(S.bud[k]-b)>.001)).join('')}</div>`;
}
const fxText=fx=>Object.entries(fx).map(([k,v])=>{const s=STATS.find(x=>x.k===k);return s?`${s.l} ${v>0?'+':'−'}${nf(Math.abs(v),Math.abs(v)<.0095?3:Math.abs(v)<.095?2:1)}`:'';}).filter(Boolean).join(', ');
const LOAN={eurobond:['Eurobond (piyasa)',9,5,{bat:.05},'Piyasa faizi yüksek, şartsız.',30],imf:['IMF / Dünya Bankası',4,10,{des:-1.5,bat:.4,par:-.3},'Düşük faiz, uzun vade. Program şartları halk desteğini zorlar.',15],golf:['Körfez ikili kredisi',6,3,{dog:.4,bol:.2},'Kısa vade, siyasi bağ getirir.',20],cin:['Çin kalkınma kredisi',5.5,7,{dog:.5,bat:-.4},'Uzun vade. Doğu ile bağ güçlenir, Batı soğur.',20]};
const ui=(k,d)=>S.ui&&S.ui[k]!==undefined?S.ui[k]:d;
const sld=(id,mn,mx,st,v)=>`<input class="rng" type="range" min="${mn}" max="${mx}" step="${st}" value="${v}" data-ui="${id}" aria-label="${id}">`;
/* Vergi yetkisi (Anayasa m.73): vergi kanunla konur; Cumhurbaşkanı yalnız kanunun verdiği sınırlar içinde oran değiştirir.
   Gelir ve kurumlar vergisi oranı kanunla belirlenir; yeni vergiler kanunla getirilir. */
const TLO=['gelir','kurum'],tBand=k=>{const t=TAX.find(x=>x[0]===k),b=(S.tref||{})[k]??t[5];if(TLO.includes(k))return [S.tax[k],S.tax[k]];if(t[2]===1)return S.laws['vt_'+k]?[0,Math.min(100,b*2.5)]:[0,0];return [Math.round(b*.5*10)/10,Math.min(100,b*2)];};
function taxs(k,d){const t=TAX.find(x=>x[0]===k),st=Math.max(.1,Math.round(t[5])/10),[lo,hi]=tBand(k),cur=(S.tp||{})[k]??S.tax[k],nv=clamp(Math.round((cur+d*st)*10)/10,0,Math.min(100,t[5]*3));
  if(nv>=lo&&nv<=hi&&(S.tp||{})[k]===undefined){S.tax[k]=nv;}else{S.tp=S.tp||{};if(nv===S.tax[k])delete S.tp[k];else S.tp[k]=nv;}save();render();}
function taxLaw(k){const t=TAX.find(x=>x[0]===k),v=(S.tp||{})[k];if(v===undefined)return;const nw=t[2]===1&&!S.laws['vt_'+k],up=v>S.tax[k];
  const l=['vk_'+k+'_'+S.month,nw?t[1]+' Kanunu':`${t[1]} oranı: %${nf(S.tax[k],1)} → %${nf(v,1)}`,1,301,up?.15:.6,nw?`${t[1]} kanunla getirilir; oran %${nf(v,1)} olur, sonrasında Cumhurbaşkanı kanunun verdiği sınır içinde değiştirebilir.`:`Oran kanunla değiştirilir. ${up?'Vergi artışı muhalefetin desteğini zorlaştırır.':'İndirim muhalefetten de destek alabilir.'}`,{},{tax:k,v,nw}];
  S.cl=S.cl.slice(-19).concat([l]);propose(l[0],false);}
function setFaiz(v){const old=S.lv.faiz,r=LVR.faiz;v=clamp(Math.round(v*2)/2,r[0],r[1]);S.lv.faiz=v;const after=levCost();S.lv.faiz=old;if(after>levCost()&&avail()<1){render();return;}S.lv.faiz=v;save();render();}
function act(w){
  const gt=S.gdp*S.kur,cl=k=>false,rz=ui('rez',5),ss=0;let fx,msg;
  if(w==='rez'){if(!rz||S.rez+rz<1)return;const m=su('rez');suU('rez');fx={rez:rz>0?rz*m:rz,kur:rz*.3,enf:rz*.03,acik:rz>0?rz*m/S.gdp*100*S.lv.faiz/100*.5:0};msg=`Merkez Bankası ${Math.abs(rz)} mlr $ rezerv ${rz<0?'sattı':'topladı'}.`;}
  else if(w==='borrow'){const L=LOAN[ui('src','eurobond')],amt=Math.min(ui('amt',8),L[5]),rt=Math.round((L[1]+Math.max(0,rsk()-4)*.6)*10)/10;if(S.loans.reduce((a,l)=>a+l.amt,0)+amt>60)return;fx={rez:Math.min(amt,120-S.rez),...L[3]};S.debt+=amt;S.borc=S.debt/S.gdp*100;S.loans.push({s:ui('src','eurobond'),amt,rate:rt,end:S.month+L[2]*12});msg=`${L[0]}: ${amt} mlr $ borç alındı (%${rt} faiz, ${L[2]} yıl vade).`;}
  else if(w==='repay'){const amt=ui('rep',6);if(S.rez-amt<1)return;fx={rez:-amt};S.debt=Math.max(0,S.debt-amt);S.borc=S.debt/S.gdp*100;let rem=amt;S.loans.sort((a,b)=>b.rate-a.rate).forEach(l=>{const d=Math.min(l.amt,rem);l.amt-=d;rem-=d;});S.loans=S.loans.filter(l=>l.amt>.01);msg=`${amt} mlr $ dış borç ödendi.`;}
  else if(w==='ice'){const amt=ui('ice',300),X=amt/gt*100;fx={enf:.05*X,buy:-.06*X,rez:.02*X};S.idb=(S.idb||0)+X;msg=`${nf(amt,0)} milyar ₺ iç borçlanma ihalesi yapıldı. Faiz yükü bütçeye eklenir.`;}
  else if(w==='kre'){const x0=ui('kre',0);if(!x0)return;const m=su('kre');suU('kre');const x=clamp(x0,-3,3)*m;fx={buy:.12*x,enf:.15*x,cari:.2*x,rez:-.1*x,des:.05*x,isz:-.1*x};S.gdp*=1+.0015*x;msg=`Kredi hacmi GSYH'nin %${nf(Math.abs(x),1)}'i kadar ${x>0?'genişletildi':'daraltıldı'}.`;}
  else if(w==='af'){const p=ui('af',20),c=p/100*2.5,m=su('af');suU('af');fx={acik:c,des:p*.02*m,huz:p*.005*m};msg=`Prim affı %${p} oranında çıkarıldı. Devlete maliyeti ≈ ${tl(c)}.`;}
  else if(w==='ikr'){const v=ui('ikr',3000),c=v*S.pens/1000/gt*100,m=su('ikr');suU('ikr');fx={acik:c,des:Math.min(3,v/3000)*m,huz:.2*m};msg=`Emekliye ${nf(v,0)} ₺ bayram ikramiyesi verildi. Maliyet ≈ ${tl(c)}.`;}
  else return;
  applyFx(fx);S.imsg=msg;logA('Devlet kurumları',msg,'İşlem uygulandı.');save();render();
}
function wageScreen(){
  const w=S.wage,n=Math.round(S.minw*(1+w.G/100));
  return `<div class="wrap"><div class="end"><div class="muted" style="font-family:var(--mono);font-size:12px">Asgari Ücret Tespit Komisyonu · ${dateLabel(S.month)}</div><h1>Asgari Ücret</h1><p>Komisyon üç tarafla toplanır: hükümet, işveren (TİSK) ve işçi (Türk-İş) temsilcileri. Net asgari ücret şu an ${nf(S.minw,0)} ₺. Yıllık enflasyon %${nf(S.enf,1)}.</p><div class="dl">İşçi tarafı: %${w.W} zam istiyor</div><div class="dl">İşveren tarafı: %${w.E} zam öneriyor</div><div class="dl" style="margin-top:10px">Hükümetin teklifi: %${w.G} zam · yeni asgari ücret ≈ ${nf(n,0)} ₺</div><input class="rng" type="range" min="0" max="150" step="1" value="${w.G}" data-wage="1" aria-label="Hükümetin zam teklifi"><div class="note">Teklifin iki tarafı da tatmin ederse uzlaşma olur. Yalnızca bir taraf kabul ederse hükümet o tarafla oy çokluğuyla karar verir, diğer taraf tepki gösterir. İkisi de kabul etmezse hükümet önerisini yakın kanadın sınırına çeker ve o kanatla oy çokluğu sağlar.</div><button class="btn" data-wgo="1" style="margin-top:12px">Komisyona sun</button></div></div>`;
}
function wageGo(){
  const w=S.wage;let G=w.G;const eo=G<=w.E*1.6,wo=G>=w.W*.65;let t,fx;
  if(eo&&wo){t='Taraflar uzlaştı.';fx={des:1,huz:.5};}
  else if(eo){t='İşveren ve hükümet oy çokluğuyla karar verdi, işçi temsilcileri salondan ayrıldı.';fx={des:-1.5,huz:-.8};if(Math.random()<.5)S.sched.push({due:S.month+1,id:'l_greve'});}
  else if(wo){t='İşçi ve hükümet oy çokluğuyla karar verdi, işveren temsilcileri itiraz etti.';fx={des:1.5,huz:.4,buy:-.2,isz:.2};}
  else{const gE=Math.floor(w.E*1.6),gW=Math.ceil(w.W*.65),nE=Math.abs(G-gE)<=Math.abs(G-gW);w.G=nE?gE:gW;t=`Hükümet önerisi iki kanattan da destek bulamadı; öneri %${w.G}'e revize edildi ve ${nE?'işveren':'işçi'} kanadıyla oy çokluğu sağlandı.`;fx=nE?{des:-1.5,huz:-.8}:{des:1,huz:.3,buy:-.2,isz:.2};}
  G=w.G;applyFx({...fx,enf:.04*G,acik:.015*G});applyFx({des:clamp((G-S.enf)*.05,-2,2)});S.minw=Math.round(S.minw*(1+G/100));
  logA('Asgari ücret',`%${G} zam`,`${t} Yeni net asgari ücret ${nf(S.minw,0)} ₺.`);
  if(S.report)S.report.h.unshift(`Asgari ücret %${G} zamla ${nf(S.minw,0)} ₺ oldu. ${t}`);
  S.wage=null;save();render();
}
function vergi(){
  const X=eco();
  const tRv=(R,x)=>R*x**.85*Math.exp(-.35*Math.max(0,x-1.4)**2),trow=t=>{const [k,n,ty,R,,ref]=t,r=(S.tp||{})[k]??S.tax[k],base=ty===1?0:ref,cur=tRv(R,r/ref),dl=cur-tRv(R,base/ref);
    const [lo,hi]=tBand(k),tp=(S.tp||{})[k],law=TLO.includes(k)||(ty===1&&!S.laws['vt_'+k]),yk=law?(TLO.includes(k)?'Oran kanunla belirlenir':'Kanunla getirilmeli'):`CB yetkisi %${nf(lo,1)}–%${nf(hi,1)}`;
    return `<div class="lever"><span class="n">${n}</span><span class="h">Hazineye yıllık katkı: <b>${cur>0?tl(cur):'yok'}</b>${cur>0?' (GSYH %'+nf(cur,2)+')':''}${ty===1?' · yeni vergi':' · yasal oran %'+nf(ref,1)}${Math.abs(dl)>.0005?` · oran değişikliğinin etkisi <b style="color:var(--${dl>=0?'good':'bad'})">${dl>=0?'+':''}${tl(dl)}</b>`:''} · ${yk}${tp!==undefined?` · <b>Kanun teklifi: %${nf(tp,1)}</b>`:''}</span><div class="step"><button data-taxs="${k}" data-d="-1" aria-label="${n} azalt">−</button><output class="${r!==base||tp!==undefined?'chg':''}">%${nf(tp??r,1)}</output><button data-taxs="${k}" data-d="1" aria-label="${n} artır">+</button>${tp!==undefined?sbtn(`data-taxl="${k}"`,'Meclis\'e sun')+sbtn(`data-taxc="${k}"`,'Vazgeç').replace('class="btn sm"','class="btn sm sec"'):''}</div>${!law&&hi>lo?`<input class="rng" type="range" min="${lo}" max="${hi}" step="0.1" value="${r}" data-taxr="${k}" aria-label="${n} oranı">`:''}</div>`;};
  return `${tahminP()}<h2>Vergiler</h2><div class="panel"><div class="dl">Değişikliklerin yıllık gelir etkisi: ${X.rev>=0?'+':''}${tl(X.rev)} (GSYH %${nf(X.rev,2)})</div><div class="note">Anayasa gereği vergi kanunla konur. Cumhurbaşkanı mevcut vergilerin oranını kanunun verdiği sınırlar içinde (yasal oranın yarısı ile iki katı arası) değiştirebilir; daha fazlası, gelir ve kurumlar vergisi oranı ve yeni vergiler Meclis kararı ister. Oran çok yükselirse kayıt dışılık artar ve gelir düşmeye başlar.</div></div><div class="panel">${TAX.filter(t=>t[2]===2).map(trow).join('')}</div><h2>Yeni ve Ek Vergiler</h2><div class="panel">${TAX.filter(t=>t[2]===1).map(trow).join('')}<div class="note">Yeni vergiler %0'da kapalıdır. Oranı artırıp Meclis'e sunduğunda kanun kabul edilirse yürürlüğe girer.</div></div>`;
}
function kurum(){
  const a=avail(),fr=true,gt=S.gdp*S.kur,cl=k=>0,src=ui('src','eurobond'),L=LOAN[src],amt=Math.min(ui('amt',8),L[5]),rz=ui('rez',5),rep=ui('rep',6),ice=ui('ice',300),kre=ui('kre',0),af=ui('af',20),ikr=ui('ikr',3000);
  const P=(t,b)=>`<div class="panel"><b>${t}</b>${b}</div>`,Q=(id,mn,mx,st,v,lab)=>`<div class="dl" style="margin-top:10px">${lab}</div>${sld(id,mn,mx,st,v)}`,B=(w,txt,dis)=>`<div class="chips" style="margin-top:8px"><button class="btn sm" data-act="${w}" ${dis||(a<1&&!fr)?'disabled':''}>${txt}</button></div>`;
  return `${tahminP()}<h2>Devlet Kurumları</h2>${S.imsg?`<div class="report">${S.imsg}</div>`:''}
  ${P('Genel görünüm',`<div class="dl">GSYH ≈ ${nf(gt/1000,2)} trilyon ₺ (${nf(S.gdp,0)} mlr $)</div><div class="dl">Net rezerv ${nf(S.rez,1)} mlr $ · Dolar ${nf(S.kur,2)} ₺</div><div class="dl">Dış borç stoku ≈ ${nf(S.borc*S.gdp/100,0)} mlr $ (GSYH %${nf(S.borc,1)})</div><div class="note">Bu sekmedeki işlemler bakanlık bütçelerinden bağımsızdır. İşlemler anında uygulanır.</div>`)}
  ${mbP()}${pgP()}
  ${levers()}
  ${P('Merkez Bankası · rezerv',Q('rez',-30,30,1,rz,`Rezerv işlemi: ${rz>=0?'topla':'sat'} ${Math.abs(rz)} mlr $ ≈ ${nf(Math.abs(rz)*S.kur,0)} milyar ₺`)+B('rez',`Uygula`,!rz||S.rez+rz<1))}
  ${P('Hazine · dış borç alımı',`<div class="chips" style="margin-top:8px">${Object.entries(LOAN).map(([k,l])=>`<button class="btn sm ${k===src?'':'sec'}" data-uisrc="${k}">${l[0]}</button>`).join('')}</div><div class="note">${L[4]} Faiz %${L[1]}, vade ${L[2]} yıl.</div>`+Q('amt',1,L[5],1,amt,`Tutar ${amt} mlr $ · yıllık faiz ≈ ${nf(amt*L[1]/100,2)} mlr $ · GSYH ≈ +${nf(.5*amt,1)} mlr $`)+B('borrow','Borçlan'))}
  ${P('Hazine · dış borç ödemesi',Q('rep',1,30,1,rep,`Ödeme ${rep} mlr $ · GSYH ≈ −${nf(.3*rep,1)} mlr $ · borç GSYH'nin %${nf(rep/S.gdp*100,2)}'i kadar azalır`)+B('repay','Öde',S.rez-rep<1)+(S.loans.length?`<div class="note">Aktif krediler: ${S.loans.map(l=>`${LOAN[l.s][0]} ${nf(l.amt,1)} mlr $ (%${l.rate}, ${Math.max(0,l.end-S.month)} ay)`).join(' · ')}</div>`:''))}
  ${P('Hazine · iç borçlanma ihalesi',Q('ice',50,1500,50,ice,`İhale ${nf(ice,0)} milyar ₺ (GSYH %${nf(ice/gt*100,2)}) · GSYH ≈ +${nf(.3*ice/S.kur,1)} mlr $`)+B('ice','İhaleye çık'))}
  ${P('BDDK · kredi hacmi',Q('kre',-10,10,.5,kre,`Kredi hacmi ${kre>=0?'+':''}${nf(kre,1)}% GSYH ≈ ${tl(Math.abs(kre))} ${kre>=0?'büyüme':'küçülme'}`)+B('kre','Uygula',!kre))}
  ${P('SGK · prim affı ve emekliler',`<div class="dl">Asgari ücret (net) ${nf(S.minw,0)} ₺ · Emekli sayısı ≈ ${nf(S.pens,1)} milyon</div>`+Q('af',0,100,5,af,`Prim affı: borcun %${af}'ı silinir · devlete maliyeti ≈ ${tl(af/100*2.5)}`)+B('af',cl('af')?`${cl('af')} ay sonra`:'Affı çıkar',cl('af')||(a<2&&!fr)||!af)+Q('ikr',0,20000,250,ikr,`Bayram ikramiyesi: ${nf(ikr,0)} ₺ × ${nf(S.pens,1)} milyon emekli = ${nf(ikr*S.pens/1000,1)} milyar ₺ (GSYH %${nf(ikr*S.pens/1000/gt*100,2)})`)+B('ikr',cl('ikr')?`${cl('ikr')} ay sonra`:'İkramiye öde',cl('ikr')||!ikr))}`;
}
const pRow=(k,a)=>{const on=S.coal.includes(k);return `<div class="lever"><span class="n">${PART[k].n}</span><span class="h">${S.seats[k]} sandalye · uyum ${nf(cmp(S.me,k),1)}/10${on?' · ortak, '+Object.keys(S.own).filter(m=>S.own[m]===k).length+' bakanlık':''}</span><div class="step">${sbtn(on?`data-dropp="${k}"`:`data-neg="${k}"`,on?'Çıkar':'Görüş'+(S.el?'':''),!on&&(S.seats[k]===0||(!S.el&&a<2)))}</div></div>`;};
function meclis(){
  const g=govSeats(),a=avail(),camp=toEl()<=6,inG=k=>k===S.me||S.coal.includes(k);
  const bar=k=>`<div class="f"><span>${PART[k].n}${inG(k)?' ✓':''}</span><div class="bar"><i style="width:${S.seats[k]/6}%;${inG(k)?'':'background:var(--muted)'}"></i></div><span class="dl">${S.seats[k]}</span></div>`;
  return `<h2>Meclis</h2><div class="panel"><div class="fac">${PK.map(bar).join('')}</div><div class="dl">İktidar bloğu ${g} / 600 · ${g>=301?'Çoğunluk var':'Meclis çoğunluğu yok: yasalar için 301 oy gerekir'}</div><div class="note">Sonraki genel seçim: ${dateLabel(S.month+toEl())} · Tahmini parti oyu: %${nf(pvt(),1)}${aPt()?' · ittifak %'+nf(vote(),1):''}${S.ally?' · Seçim ittifakı kuruldu':''}</div>${camp&&!S.ally?sbtn('data-ally="1"','Seçim ittifakı kur',a<3):''}</div>
  ${meclisSVG()}${anket()}<h2>İttifak</h2><div class="panel">${PK.filter(k=>k!==S.me).map(k=>pRow(k,a)).join('')}<div class="note">Ortak olmak isteyen partiyle bakanlık pazarlığı yaparsın. Uyum ${nf(S.kol,1)}/10. Uyum sıfıra inerse ortak hükümetten çekilir.</div></div>
  <h2>Vaatler (${S.prom.length}/4)</h2><div class="panel"><div class="note" style="margin:0 0 6px">Söz verdiğin vaadi seçimde tutamazsan oy kaybedersin (−3 puan). Tutarsan +1,5 puan alırsın.</div>${VAAT.map(([id,t,fn])=>{const on=S.prom.includes(id),ok=fn();return `<div class="lever"><span class="n">${t}</span><span class="h">${on?(ok?'Söz verildi · şu an sağlanıyor':'Söz verildi · henüz sağlanmadı'):(ok?'Zaten sağlanıyor':'Henüz sağlanmıyor')}</span><div class="step">${on?'<span class="st good">Verildi</span>':sbtn(`data-prom="${id}"`,'Söz ver',ok||S.prom.length>=4||a<1)}</div></div>`;}).join('')}</div>
  ${draftP()}<h2>Yasalar</h2><div class="panel">${LAWS.map(([id,n,c,need,,d,fx])=>{const done=S.laws[id],wait=false;return `<div class="lever"><span class="n">${n}</span><span class="h">${d} <b>(Geçerse: ${fxText(fx)}.)</b> ${need} oy gerekir.</span><div class="step">${done?'<span class="st good">Yasalaştı</span>':sbtn(`data-law="${id}"`,`Teklif`,wait||a<c)+sbtn(`data-lawu="${id}"`,'Uzlaşmalı teklif')+sbtn(`data-law="${id}" data-lobi="1"`,`Lobiyle teklif`,wait||a<c+2)}</div></div>`;}).join('')}<div class="note">Uzlaşmalı teklif muhalefetin itirazlarını metne işler: geçme şansı artar, etkisi %60'a iner. Lobi, muhalefet vekillerini ikna eder ve oy şansını artırır. Teklif verdiğinde Genel Kurul oylaması açılır.</div></div>`;
}
const pickScreen=()=>`<div class="wrap"><div class="end"><h1>Hangi Partiyi Yöneteceksin?</h1><p>Türkiye'deki gerçek siyasi partilerden birini seç. Parti liderleri ve bakanlar kurgusaldır. Oy oranları ve sandalyeler oyunun başlangıç değerleridir.</p><div class="dl" style="margin:10px 0 4px">Zorluk</div><div class="chips">${['Kolay','Normal','Zor'].map((n,i)=>`<button class="btn sm ${S.dif===i?'':'sec'}" data-dif="${i}">${n}</button>`).join('')}</div><div class="dl" style="margin:10px 0 4px">Senaryo</div><div class="chips" style="margin-bottom:12px">${['Standart','Kriz ortasında','Seçim öncesi'].map((n,i)=>`<button class="btn sm ${S.sc===i?'':'sec'}" data-sc="${i}">${n}</button>`).join('')}</div><div class="panel">${PK.map(k=>`<div class="lever"><span class="n">${PART[k].n}</span><span class="h">${PART[k].x>.3?'Sağ':'Sol'} çizgi · rakip lider: ${PART[k].lead}</span><div class="step">${sbtn(`data-pick="${k}"`,'Seç')}</div></div>`).join('')}</div></div></div>`;
function voteScreen(){
  const v=S.vote;
  return `<div class="wrap"><div class="end"><div class="muted" style="font-family:var(--mono);font-size:12px">TBMM Genel Kurulu · oylama</div><h1>${v.n}</h1><p>${v.d}</p><div class="fac" style="margin:14px 0">${v.rows.map(([k,y,n])=>`<div class="f"><span>${PART[k].n}</span><div class="bar"><i style="width:${y/((y+n)||1)*100}%"></i></div><span class="dl">${y} / ${n}</span></div>`).join('')}</div><div class="big">${v.yes} kabul · ${600-v.yes} ret</div><div class="note">Gerekli oy: ${v.need}</div><h2 style="margin-top:14px;color:var(--${v.ok?'good':'bad'})">${v.ok?'Yasalaştı':'Teklif reddedildi'}</h2><button class="btn" data-votok="1">Tamam</button></div></div>`;
}
function negScreen(){
  const n=S.neg,p=n.p,y=n.off.reduce((a,k)=>a+MVAL(p,k),0),x=ask(p);
  return `<div class="wrap"><div class="end"><div class="muted" style="font-family:var(--mono);font-size:12px">Koalisyon görüşmesi</div><h1>${PART[p].n}</h1><p>Lider ${PART[p].lead} masada. ${S.seats[p]} sandalyesi var, uyum ${nf(cmp(S.me,p),1)}/10. Ortaklık için bakanlık istiyor. Vereceğin bakanlıkları seç.</p><div class="dl">Talep ${nf(x,1)} puan · Sunduğun ${nf(y,1)} puan · ${y>=x?'Kabul eder':'Reddeder'}</div>${n.msg?`<div class="report" style="margin:10px 0">${n.msg}</div>`:''}<div class="panel" style="margin-top:12px">${MIN.filter(m=>!m[4]).map(m=>{const k=m[0],h=S.own[k],on=n.off.includes(k);return `<div class="lever"><span class="n">${m[1]}</span><span class="h">${nf(MVAL(p,k),1)} puan${PART[p].want.includes(k)?' · özellikle istiyor':''}${h?' · '+PART[h].n+' elinde':''}</span><div class="step">${sbtn(`data-nego="${k}"`,on?'Geri al':'Ver',!!h).replace('class="btn sm"',`class="btn sm ${on?'':'sec'}"`)}</div></div>`;}).join('')}</div><div class="chips"><button class="btn" data-offer="1">Teklifi sun</button><button class="btn sec" data-negx="1">Vazgeç</button></div></div></div>`;
}
function elScreen(){
  const e=S.el,se=e.se,g=govSeats();
  return `<div class="wrap"><div class="end"><div class="muted" style="font-family:var(--mono);font-size:12px">${dateLabel(S.month)} · ${S.term}. dönem genel seçimi</div><h1>Seçim Sonucu</h1><div class="big">%${nf(e.p,1)}</div>${S.cb?`<div class="dl">Cumhurbaşkanlığı: ilk turda ittifak %${nf(S.cb.r1,1)}${S.cb.r1<50?' · ikinci turda %'+nf(S.cb.r2,1)+' ile kazandın':' · ilk turda kazandın'}</div>`:''}<div class="note">Kampanya etkisi ${S.kamp>=0?'+':''}${nf(S.kamp,1)} puan${e.pr.length?' · Vaatler: '+e.pr.map(r=>r[1]?'+1,5':'−3').join(' '):''}</div>
  ${ozet(e)}${krnEl()}<div class="fac" style="margin-top:14px">${PK.map(k=>`<div class="f"><span>${PART[k].n}${k===S.me?' ✓':''}</span><div class="bar"><i style="width:${se[k]/6}%"></i></div><span class="dl">%${nf(e.sh[k]||0,1)} · ${se[k]}</span></div>`).join('')}</div>
  ${e.pr.length?`<ul>${e.pr.map(r=>`<li>${r[0]}: ${r[1]?'tuttun':'tutmadın, oy kaybettin'}</li>`).join('')}</ul>`:''}
  <h2>Meclis Çoğunluğu</h2><p class="muted">Cumhurbaşkanı seçildin; kabineyi sen atarsın. Yasa çıkarmak için Meclis'te 301 sandalye gerekir. İstersen partilerle bakanlık karşılığı ittifak kur.</p><div class="panel">${PK.filter(k=>k!==S.me&&se[k]>0).map(k=>pRow(k,99)).join('')}</div>
  <div class="big" style="font-size:30px;margin-bottom:12px">${g} sandalye</div><button class="btn" data-elfin="1">${g>=301?'Çoğunlukla devam et':'Meclis çoğunluğu olmadan devam et'}</button></div></div>`;
}
function kabine(){
  const a=avail(),tot=S.fac.R+S.fac.G+S.fac.S,list=[['mb','Merkez Bankası Başkanı'],...MIN.filter(m=>!m[4]).map(m=>[m[0],m[1]+' Bakanı'])];
  return `${S.cand?candP():''}<h2>Kabine</h2><div class="panel"><div class="note" style="margin:0 0 6px">${PART[S.me].n} hükümetini yönetiyorsun. 17 bakanlık ve Merkez Bankası. İttifak ortağına verdiğin bakanlıkları değiştiremezsin.</div>${list.map(([k,n])=>{const m=S.M[k],h=S.own[k];return `<div class="lever"><span class="n">${n}</span><span class="h">${m.name} · yetkinlik ${m.sk}/10 · güven ${nf(m.gv===undefined?40+m.sk*5:m.gv,0)}${(m.gv===undefined?99:m.gv)<35?' · <b style="color:var(--bad)">Riskli</b>':''}${h?' · '+PART[h].n+' kontenjanı':''}</span><div class="step">${sbtn(`data-fire="${k}"`,S.confirm===k?'Onayla':'Değiştir',a<2||h).replace('class="btn sm"','class="btn sm sec"')}</div></div>`;}).join('')}</div>
  <h2>İttifak Ortakları</h2><div class="panel">${S.coal.length?S.coal.map(k=>`<div class="lever"><span class="n">${PART[k].n}</span><span class="h">Lider ${PART[k].lead} · ${S.seats[k]} sandalye</span></div>`).join('')+`<div class="note">İttifak uyumu ${nf(S.kol,1)}/10</div>`:'<span class="muted">Ortak yok. Meclis sekmesinden ortak arayabilirsin.</span>'}</div>
  ${partiP()}`;
}

