/* ---------- Aylık simülasyon ---------- */
function simulate(){
  const L=S.lv,s=S,mk=M,X=eco(),F=sfx(),e=k=>(X.E[k]||0)+(F[k]||0);
  const real=L.faiz-s.enf,sf=x=>x>20?20+(x-20)*.1:x<-20?-20+(x+20)*.1:x,rl=sf(real);
  let depr=1.6+0.05*(s.enf-40)-0.05*(s.rez-22)-0.10*(rl+3)+rnd(-0.8,0.8)-(mk.maliye.sk-5)*0.1+(s.des<30?0.5:0)+(s.huz<4?0.4:0);
  depr+=0.3*Math.max(0,s.acik-7);depr+=(50-s.gv)*.012;depr=clamp(depr,-0.5,9);
  s.kur*=1+depr/100;
  s.rez+=-0.3*Math.max(0,s.acik-7)-0.5+0.10*(rl+3)+(depr>4?-2:0)+(s.bat-5)*0.1+rnd(-0.6,0.6)+e('rez');
  s.enf+=-0.09*(rl+3)+0.5*(depr-1.6)+0.15*(s.acik-4.6)+rnd(-0.4,0.4)-(mk.mb.sk-5)*0.06+e('enf');
  const tg=2.8-0.05*(L.faiz-45)+e('buy')-0.03*(s.enf-48);
  s.buy+=(tg-s.buy)*0.25+rnd(-0.1,0.1);
  s.isz+=0.04*(3.0-s.buy)+0.02*(9.2-s.isz)+rnd(-0.05,0.05)+e('isz');
  const ta=4.6+X.dev-X.rev+e('acik')+0.06*sf(L.faiz-45)-0.15*(s.buy-2.8)+loanC();
  s.acik+=(ta-s.acik)*0.3;
  s.borc+=0.10*(s.acik-2.5)+0.06*depr-0.1+e('borc');
  s.cari+=0.25*(s.buy-2.8)-0.1*(depr-1.6)+(34-s.cari)*0.03+rnd(-0.4,0.4)+e('cari');
  s.des+=-0.06*(s.enf-45)+0.35*(s.buy-2.5)-0.25*(s.isz-9.2)+0.1*(s.huz-5)-0.15+(41-s.des)*0.02+e('des');
  s.par+=(6-s.par)*0.05+(s.des-40)*0.01+e('par');
  s.kol+=(6-s.kol)*0.04;
  s.ord+=e('ord')+(mk.sav.sk-5)*0.03+(6-s.ord)*0.03;
  s.huz+=(mk.ic.sk-5)*0.03+(6-s.huz)*0.05-(s.enf-45)*0.01+e('huz');
  ['bat','dog','bol'].forEach(k=>s[k]+=(6-s[k])*0.03+(mk.dis.sk-5)*0.02+e(k));
  s.pens+=.02;s.rez-=S.loans.reduce((a,l)=>a+l.amt*l.rate/1200,0);S.loans=S.loans.filter(l=>{if(l.end>s.month+1)return true;s.rez-=l.amt;s.borc-=l.amt/s.gdp*100;return false;});
  s.gdp*=1+s.buy/1200;MIN.forEach(m=>{if(S.own[m[0]])s.kol+=(S.bud[m[0]]-m[2])/m[2]*.3;});
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
  if(b.kol<4)h.push('Koalisyon ortağından "erken seçim" sinyali.');
  if(b.par<4)h.push('Parti içi muhalifler kurultay istiyor.');
  if(b.buy>4)h.push('Ekonomi beklentilerin üzerinde büyüyor.');
  if(b.isz>12)h.push('İşsizlik endişe verici seviyede.');
  if(!h.length)h.push('Piyasalar sakin, siyasi gündem yoğun.');
  return h.slice(0,4);
}
function vote(){return clamp(S.des*0.92+(S.huz-5)*0.6+(S.par-5)*0.5+(S.kamp||0)+priV()+gDev()*.05+promRes().reduce((a,r)=>a+(r[1]?1.5:-3),0),8,62);}
function checkEnd(){
  if(S.des<12)return {t:'Hükümet Düştü',x:'Halk desteği çöktü. Güvensizlik önergesi kabul edildi ve hükümet istifa etti.'};
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
  if(S.month%TERM===30){
    if(S.des>=40){S.par+=1;S.des+=1;}else{S.par-=1.5;S.kol-=1;}
    S.mun=clamp(Math.round(30*(vote()-8)/50),0,30);S.flags.yerel=(S.des>=40?'Yerel seçimlerde iktidar kendi belediyelerini korudu.':'Yerel seçimlerde iktidar önemli kayıplar verdi.')+' Büyükşehir belediyesi: '+S.mun+'/30.';
  }
  for(const k in RANGE)S[k]=clamp(S[k],RANGE[k][0],RANGE[k][1]);
  const b=snap();
  STATS.forEach(x=>S.hist[x.k].push(S[x.k]));
  const hl=headlines(a,b,depr);hl.push(...checkAch(),...yeniUp(),...toplumUp(),...dunyaUp(),...piyasaUp(),...ileriUp(),...genisUp(),...genis2Up(),...arayuzUp());hl.push('PPK toplantısı: Merkez Bankası %'+mbRec()+' faiz öneriyor.');
  if(S.month%TERM===30)hl.unshift(S.flags.yerel);
  if(S.coal.length&&S.kol<=0){clearCoal();S.kol=4;S.par=clamp(S.par-.5,0,10);hl.unshift('Koalisyon ortağı hükümetten çekildi. Meclis çoğunluğu tehlikede.');S.log.push({m:S.month,t:'Koalisyon çöktü',c:'Ortak çekildi',msg:'Uyum sıfıra indi. Meclis\'te ortaksız devam ediyorsun.'});}
  const over=checkEnd();
  if(over){S.over={...over,win:false};save();render();return;}
  if(S.month%TERM===0){runElection();save();render();window.scrollTo({top:0});return;}
  const carry=0;
  S.prev=a;S.lv0={...S.lv};S.confirm=null;S.evo=null;
  genEvents();
  S.report={m:S.month,h:hl,carry,d:gzD(a,b)};
  save();render();window.scrollTo({top:0});
}

/* ---------- Bütçe, vergi, kurumlar, meclis, seçim ---------- */
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
function eco(){const E={},K=1.5;let dev=0,rev=0;
  MIN.forEach(([k,,b,e])=>{const d=(S.bud[k]-b)/b;dev+=S.bud[k]-b;for(const x in e)E[x]=(E[x]||0)+e[x]*d*K;});
  TAX.forEach(([k,,ty,R,e,ref])=>{const r=S.tax[k],base=ty===1?0:ref,l=clamp(ty===1?r/ref:(r-base)/(ref*.1),-8,8);rev+=R*((r/ref)**.85-(base/ref)**.85);for(const x in e)E[x]=(E[x]||0)+e[x]*l;});
  return {E,dev,rev};
}
function seatsFor(p,o,pt,nz=1){
  const oth=PK.filter(k=>k!==S.me&&k!==pt),w={},r=100-p-o;let ws=0;
  oth.forEach(k=>{w[k]=PART[k].w*(1+rnd(-.12,.12)*nz);ws+=w[k];});
  const sh={[S.me]:p,[pt]:o};oth.forEach(k=>sh[k]=r*w[k]/ws);
  const el=PK.filter(k=>k===S.me||sh[k]>=(S.baraj||BAR)||(k===pt&&S.ally)),tot=el.reduce((a,k)=>a+sh[k],0),se={};
  PK.forEach(k=>se[k]=el.includes(k)?Math.round(600*sh[k]/tot):0);se[S.me]+=600-PK.reduce((a,k)=>a+se[k],0);
  return {sh,se};
}
function initGov(){
  clearCoal();const pt=best();S.seats=seatsFor(38,14,pt,0).se;S.coal=[pt];S.kol=clamp(cmp(S.me,pt),4,7);
  PART[pt].want.slice(0,2).forEach(k=>{S.own[k]=pt;S.M[k]={...newM(),sk:Math.round(rnd(4,8)),note:PART[pt].n+' kontenjanı'};});
}
function bud(k,d){const b=MB[k],st=Math.max(.05,Math.round(b*10)/100),v=Math.round((S.bud[k]+d*st)*100)/100;if(v<b*.4-1e-9||v>b*2+1e-9)return;S.bud[k]=v;save();render();}
function propose(id,lobi){
  const l=LAWS.find(x=>x[0]===id)||S.cl.find(x=>x[0]===id),c=l[2]+(lobi?2:0);
  if(c>avail()||S.laws[id])return;
  const rows=PK.map(k=>{const s=S.seats[k];let f;
    if(k===S.me)f=clamp(.9+rnd(-.08,.05),.75,1);
    else if(S.coal.includes(k))f=clamp(.45+S.kol/22+rnd(-.1,.1)+(l[4]-.5)*.3,.3,1);
    else f=clamp(l[4]*.4+(lobi?.2:0)+cmp(S.me,k)/50-.08+rnd(-.1,.1),0,.95);
    const y=Math.round(s*f);return [k,y,s-y];});
  const yes=rows.reduce((a,r)=>a+r[1],0),ok=yes>=l[3];
  S.cur.spent+=c;S.lawT[id]=S.month+3;
  if(ok){applyFx(l[6]);S.laws[id]=S.month;if(id==='baraj')S.baraj=5;S.cur.spent=Math.max(0,S.cur.spent-1);}else applyFx({des:-.3,par:-.3});
  hap(ok?[20,30,20]:60,ok?660:220);S.vote={n:l[1],d:l[5],rows,yes,need:l[3],ok};
  logA(l[1],ok?'Kabul edildi':'Reddedildi',`Oylama: ${yes} kabul, ${600-yes} ret (gerekli ${l[3]}).`);save();render();
}
function dropP(k){Object.keys(S.own).filter(m=>S.own[m]===k).forEach(m=>{S.M[m]=newM();delete S.own[m];});S.coal=S.coal.filter(x=>x!==k);S.kol=clamp(S.kol-1,0,10);logA('Koalisyon',PART[k].n+' hükümetten ayrıldı','Bakanlıkları geri aldın.');save();render();}
function offer(){
  const n=S.neg,p=n.p,y=n.off.reduce((a,k)=>a+MVAL(p,k),0),x=ask(p);
  if(cmp(S.me,p)<2.5){n.msg=`${PART[p].n} seninle ideolojik olarak ortaklık kurmayı reddediyor.`;return render();}
  if(y<x){const m=PART[p].want.find(k=>!n.off.includes(k)&&!S.own[k]);n.msg=`Teklif yetersiz. ${PART[p].n} en az ${nf(x,1)} puanlık bakanlık istiyor, sen ${nf(y,1)} puan sundun.${m?' Özellikle '+minName(m)+' Bakanlığına bakıyorlar.':''}`;return render();}
  
  S.coal.push(p);n.off.forEach(k=>{S.own[k]=p;S.M[k]={...newM(),sk:Math.round(rnd(4,8)),note:PART[p].n+' kontenjanı'};});
  S.kol=S.coal.length>1?(S.kol+cmp(S.me,p))/2:cmp(S.me,p);S.par=clamp(S.par-.35*n.off.length,0,10);
  logA('Koalisyon',PART[p].n+' hükümete katıldı',`${n.off.length} bakanlık verildi: ${n.off.map(minName).join(', ')}.`);S.neg=null;save();render();
}
function doAlly(){if(S.ally||avail()<3)return;S.ally=true;S.cur.spent+=3;S.kol=clamp(S.kol+1,0,10);logA('Seçim ittifakı','İttifak kuruldu','Ortak listeler ve baraj avantajı sağlandı.');save();render();}
function makeProm(id){const v=VAAT.find(x=>x[0]===id);if(S.prom.includes(id)||S.prom.length>=4||v[2]()||avail()<1)return;S.prom.push(id);S.cur.spent+=1;S.des=clamp(S.des+.8,0,100);logA('Vaat verdin',v[1],'Seçimde tutmazsan oy kaybedersin.');save();render();}
const promRes=()=>S.prom.map(id=>{const v=VAAT.find(x=>x[0]===id);return [v[1],v[2]()];});
function runElection(){
  const pt=S.coal[0]||best(),p=vote(),o=clamp(8+S.kol+(S.ally?2:0),4,20),{sh,se}=seatsFor(p,o,pt),pr=promRes();
  if(PK.some(k=>k!==S.me&&se[k]>se[S.me])){const top=PK.reduce((a,k)=>se[k]>se[a]?k:a);S.over={t:'İktidar Kaybı',x:`Seçimde %${nf(p,1)} oy aldın ve ${se[S.me]} sandalye kazandın. ${PART[top].n} ${se[top]} sandalyeyle önde bitirdi ve iktidara geliyor.`,win:false,p};return;}
  clearCoal();S.seats=se;S.el={p,sh,se,pr};
}
function finishEl(){
  const e=S.el;karneKaydet();
  logA(`${S.term}. dönem seçimi`,`%${nf(e.p,1)} oy`,`${e.se[S.me]} sandalye. Hükümet: ${govSeats()} sandalye (${govSeats()>=301?'çoğunluk':'azınlık'}).`);
  S.ally=false;S.prom=[];S.kamp=0;S.term++;S.des=clamp(S.des+2,0,100);const D=DON[Math.min(S.term,3)];if(D){applyFx(D.fx);S.sched.push({due:S.month,id:D.ev});}
  applyFx({des:karneBonus()*1.5});S.prev=snap();S.lv0={...S.lv};S.el=null;genEvents();
  S.report={m:S.month,h:[(D?D.t+'. '+D.x+' ':'')+`${S.term}. dönem başladı. Hükümetin Meclis'te ${govSeats()>=301?'çoğunluğu var':'çoğunluğu yok, yasalar için muhalefetle pazarlık gerekecek'}.`],carry:0};
  save();render();window.scrollTo({top:0});
}
const row=(n,h,v,a,chg)=>`<div class="lever"><span class="n">${n}</span><span class="h">${h}</span><div class="step"><button ${a} data-d="-1" aria-label="${n} azalt">−</button><output class="${chg?'chg':''}">${v}</output><button ${a} data-d="1" aria-label="${n} artır">+</button></div></div>`;
const sbtn=(attr,txt,dis)=>`<button class="btn sm" style="width:auto;min-width:88px" ${attr} ${dis?'disabled':''}>${txt}</button>`;
function butce(){
  const X=eco(),ta=4.6+X.dev-X.rev+(X.E.acik||0)+.06*(S.lv.faiz>65?65+(S.lv.faiz-65)*.1:S.lv.faiz-45)-.15*(S.buy-2.8)+loanC(),tot=MIN.reduce((a,m)=>a+S.bud[m[0]],0);
  return `${tahminP()}${refahP()}<h2>Bakanlık Bütçeleri</h2><div class="panel"><div class="dl">GSYH ≈ ${nf(S.gdp*S.kur/1000,1)} trilyon ₺ (${nf(S.gdp,0)} mlr $)</div><div class="dl">Toplam harcama GSYH %${nf(tot,1)} ≈ ${tl(tot)}</div><div class="dl">Bütçe açığı hedefi GSYH %${nf(ta,1)} ≈ ${tl(ta)}</div><div class="note">17 bakanlığın bütçesini sen belirlersin. Artış hizmeti güçlendirir ve açığı büyütür. Değişiklikler ay sonunda işler. Kurum bütçeleri Kurumlar sekmesinde.</div></div><div class="panel">${MIN.filter(m=>!m[4]).map(([k,n,b])=>row(n,`≈ ${tl(S.bud[k])} · taban %${nf(b,2)}`,'%'+nf(S.bud[k],2),`data-bud="${k}"`,Math.abs(S.bud[k]-b)>.001)).join('')}</div>`;
}
const fxText=fx=>Object.entries(fx).map(([k,v])=>{const s=STATS.find(x=>x.k===k);return s?`${s.l} ${v>0?'+':'−'}${nf(Math.abs(v),1)}`:'';}).filter(Boolean).join(', ');
const LOAN={eurobond:['Eurobond (piyasa)',9,5,{bat:.05},'Piyasa faizi yüksek, şartsız.',30],imf:['IMF / Dünya Bankası',4,10,{des:-1.5,bat:.4,par:-.3},'Düşük faiz, uzun vade. Program şartları halk desteğini zorlar.',15],golf:['Körfez ikili kredisi',6,3,{dog:.4,bol:.2},'Kısa vade, siyasi bağ getirir.',20],cin:['Çin kalkınma kredisi',5.5,7,{dog:.5,bat:-.4},'Uzun vade. Doğu ile bağ güçlenir, Batı soğur.',20]};
const ui=(k,d)=>S.ui&&S.ui[k]!==undefined?S.ui[k]:d;
const sld=(id,mn,mx,st,v)=>`<input class="rng" type="range" min="${mn}" max="${mx}" step="${st}" value="${v}" data-ui="${id}" aria-label="${id}">`;
function taxs(k,d){const t=TAX.find(x=>x[0]===k),st=Math.max(.1,Math.round(t[5])/10);S.tax[k]=clamp(Math.round((S.tax[k]+d*st)*10)/10,0,100);save();render();}
function setFaiz(v){const old=S.lv.faiz,r=LVR.faiz;v=clamp(Math.round(v*2)/2,r[0],r[1]);S.lv.faiz=v;const after=levCost();S.lv.faiz=old;if(after>levCost()&&avail()<1){render();return;}S.lv.faiz=v;save();render();}
function act(w){
  const gt=S.gdp*S.kur,cl=k=>false,rz=ui('rez',5),ss=0;let fx,msg;
  if(w==='rez'){if(!rz||S.rez+rz<1)return;fx={rez:rz,kur:rz*.3,enf:rz*.03};msg=`Merkez Bankası ${Math.abs(rz)} mlr $ rezerv ${rz<0?'sattı':'topladı'}.`;}
  else if(w==='borrow'){const L=LOAN[ui('src','eurobond')],amt=Math.min(ui('amt',8),L[5]);fx={rez:amt,borc:amt/S.gdp*100,...L[3]};S.gdp+=.5*amt;S.loans.push({s:ui('src','eurobond'),amt,rate:L[1],end:S.month+L[2]*12});msg=`${L[0]}: ${amt} mlr $ borç alındı (%${L[1]} faiz, ${L[2]} yıl vade).`;}
  else if(w==='repay'){const amt=ui('rep',6);if(S.rez-amt<1)return;fx={rez:-amt,borc:-amt/S.gdp*100};S.gdp-=.3*amt;let rem=amt;S.loans.sort((a,b)=>b.rate-a.rate).forEach(l=>{const d=Math.min(l.amt,rem);l.amt-=d;rem-=d;});S.loans=S.loans.filter(l=>l.amt>.01);msg=`${amt} mlr $ dış borç ödendi.`;}
  else if(w==='ice'){const amt=ui('ice',300),X=amt/gt*100;fx={acik:-.4*X,enf:.15*X,buy:-.06*X};S.gdp+=.3*amt/S.kur;msg=`${nf(amt,0)} milyar ₺ iç borçlanma ihalesi yapıldı.`;}
  else if(w==='kre'){const x=ui('kre',0);if(!x)return;fx={buy:.12*x,enf:.15*x,cari:.2*x,rez:-.1*x,des:.05*x};S.gdp*=1+.004*x;msg=`Kredi hacmi GSYH'nin %${nf(Math.abs(x),1)}'i kadar ${x>0?'genişletildi':'daraltıldı'}.`;}
  else if(w==='af'){const p=ui('af',20),c=p/100*2.5,m=su('af');suU('af');fx={acik:c,des:p*.02*m,huz:p*.005*m};msg=`Prim affı %${p} oranında çıkarıldı. Devlete maliyeti ≈ ${tl(c)}.`;}
  else if(w==='ikr'){const v=ui('ikr',3000),c=v*S.pens/1000/gt*100,m=su('ikr');suU('ikr');fx={acik:c,des:Math.min(3,v/3000)*m,huz:.2*m};msg=`Emekliye ${nf(v,0)} ₺ bayram ikramiyesi verildi. Maliyet ≈ ${tl(c)}.`;}
  else return;
  applyFx(fx);S.imsg=msg;logA('Devlet kurumları',msg,'İşlem uygulandı.');save();render();
}
function wageScreen(){
  const w=S.wage,n=Math.round(S.minw*(1+w.G/100));
  return `<div class="wrap"><div class="end"><div class="muted" style="font-family:var(--mono);font-size:12px">Asgari Ücret Tespit Komisyonu · ${dateLabel(S.month)}</div><h1>Asgari Ücret</h1><p>Komisyon üç tarafla toplanır: hükümet, işveren (TİSK) ve işçi (Türk-İş) temsilcileri. Net asgari ücret şu an ${nf(S.minw,0)} ₺. Yıllık enflasyon %${nf(S.enf,1)}.</p><div class="dl">İşçi tarafı: %${w.W} zam istiyor</div><div class="dl">İşveren tarafı: %${w.E} zam öneriyor</div><div class="dl" style="margin-top:10px">Hükümetin teklifi: %${w.G} zam · yeni asgari ücret ≈ ${nf(n,0)} ₺</div><input class="rng" type="range" min="0" max="150" step="1" value="${w.G}" data-wage="1" aria-label="Hükümetin zam teklifi"><div class="note">Teklifin iki tarafı da tatmin ederse uzlaşma olur. Yalnızca bir taraf kabul ederse hükümet o tarafla oy çokluğuyla karar verir, diğer taraf tepki gösterir. İkisi de kabul etmezse hükümet kararnameyle belirler.</div><button class="btn" data-wgo="1" style="margin-top:12px">Komisyona sun</button></div></div>`;
}
function wageGo(){
  const w=S.wage,G=w.G,eo=G<=w.E*1.6,wo=G>=w.W*.65;let t,fx;
  if(eo&&wo){t='Taraflar uzlaştı.';fx={des:1,huz:.5};}
  else if(eo){t='İşveren ve hükümet oy çokluğuyla karar verdi, işçi temsilcileri salondan ayrıldı.';fx={des:-1.5,huz:-.8};if(Math.random()<.5)S.sched.push({due:S.month+1,id:'l_greve'});}
  else if(wo){t='İşçi ve hükümet oy çokluğuyla karar verdi, işveren temsilcileri itiraz etti.';fx={des:1.5,huz:.4,buy:-.2,isz:.2};}
  else{t='Uzlaşma olmadı, hükümet kararnameyle belirledi.';fx={des:-1,huz:-.6};}
  applyFx({...fx,enf:.04*G,acik:.015*G});applyFx({des:clamp((G-S.enf)*.05,-2,2)});S.minw=Math.round(S.minw*(1+G/100));
  logA('Asgari ücret',`%${G} zam`,`${t} Yeni net asgari ücret ${nf(S.minw,0)} ₺.`);
  if(S.report)S.report.h.unshift(`Asgari ücret %${G} zamla ${nf(S.minw,0)} ₺ oldu. ${t}`);
  S.wage=null;save();render();
}
function vergi(){
  const X=eco();
  const trow=t=>{const [k,n,ty,R,,ref]=t,r=S.tax[k],base=ty===1?0:ref,dl=R*((r/ref)**.85-(base/ref)**.85);
    return `<div class="lever"><span class="n">${n}</span><span class="h">Gelir ≈ ${tl(R*(r/ref)**.85)}${ty===1?' · yeni vergi':' · mevcut oran %'+nf(ref,1)} · değişim ${dl>=0?'+':''}${tl(dl)}</span><div class="step"><button data-taxs="${k}" data-d="-1" aria-label="${n} azalt">−</button><output class="${r!==base?'chg':''}">%${nf(r,1)}</output><button data-taxs="${k}" data-d="1" aria-label="${n} artır">+</button></div><input class="rng" type="range" min="0" max="100" step="0.1" value="${r}" data-taxr="${k}" aria-label="${n} oranı"></div>`;};
  return `${tahminP()}<h2>Vergiler</h2><div class="panel"><div class="dl">Değişikliklerin yıllık gelir etkisi: ${X.rev>=0?'+':''}${tl(X.rev)} (GSYH %${nf(X.rev,2)})</div><div class="note">Her verginin oranını %0 ile %100 arasında belirlersin. Oran artınca gelir artar ama azalan verimle. Halk desteği, enflasyon ve büyüme de etkilenir.</div></div><div class="panel">${TAX.filter(t=>t[2]===2).map(trow).join('')}</div><h2>Yeni ve Ek Vergiler</h2><div class="panel">${TAX.filter(t=>t[2]===1).map(trow).join('')}<div class="note">Yeni vergiler %0'da kapalıdır. Oranı artırdıkça devreye girer.</div></div>`;
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
  ${P('SGK · prim affı ve emekliler',`<div class="dl">Asgari ücret (net) ${nf(S.minw,0)} ₺ · Emekli sayısı ≈ ${nf(S.pens,1)} milyon</div>`+Q('af',0,100,5,af,`Prim affı: borcun %${af}'ı silinir · devlete maliyeti ≈ ${tl(af/100*2.5)}`)+B('af',cl('af')?`${cl('af')} ay sonra`:'Affı çıkar',cl('af')||(a<2&&!fr)||!af)+Q('ikr',0,20000,250,ikr,`Bayram ikramiyesi: ${nf(ikr,0)} ₺ × ${nf(S.pens,1)} milyon emekli = ${nf(ikr*S.pens/1000,1)} milyar ₺ (GSYH %${nf(ikr*S.pens/1000/gt*100,2)})`)+B('ikr',cl('ikr')?`${cl('ikr')} ay sonra`:'İkramiye öde',cl('ikr')||!ikr))}
  <h2>Kurum Bütçeleri</h2><div class="panel">${MIN.filter(m=>m[4]).map(([k,n,b])=>row(n,`≈ ${tl(S.bud[k])} · taban %${nf(b,2)}`,'%'+nf(S.bud[k],2),`data-bud="${k}"`,Math.abs(S.bud[k]-b)>.001)).join('')}</div>`;
}
const pRow=(k,a)=>{const on=S.coal.includes(k);return `<div class="lever"><span class="n">${PART[k].n}</span><span class="h">${S.seats[k]} sandalye · uyum ${nf(cmp(S.me,k),1)}/10${on?' · ortak, '+Object.keys(S.own).filter(m=>S.own[m]===k).length+' bakanlık':''}</span><div class="step">${sbtn(on?`data-dropp="${k}"`:`data-neg="${k}"`,on?'Çıkar':'Görüş'+(S.el?'':''),!on&&(S.seats[k]===0||(!S.el&&a<2)))}</div></div>`;};
function meclis(){
  const g=govSeats(),a=avail(),camp=S.month%TERM>=TERM-6,inG=k=>k===S.me||S.coal.includes(k);
  const bar=k=>`<div class="f"><span>${PART[k].n}${inG(k)?' ✓':''}</span><div class="bar"><i style="width:${S.seats[k]/6}%;${inG(k)?'':'background:var(--muted)'}"></i></div><span class="dl">${S.seats[k]}</span></div>`;
  return `<h2>Meclis</h2><div class="panel"><div class="fac">${PK.map(bar).join('')}</div><div class="dl">Hükümet ${g} / 600 · ${g>=301?'Çoğunluk var':'Azınlık hükümeti (301 gerekir)'}</div><div class="note">Sonraki genel seçim: ${dateLabel((Math.floor(S.month/TERM)+1)*TERM)} · Tahmini oy: %${nf(vote(),1)}${S.ally?' · Seçim ittifakı kuruldu':''}</div>${camp&&!S.ally?sbtn('data-ally="1"','Seçim ittifakı kur',a<3):''}</div>
  ${anket()}${belediye()}<h2>Koalisyon</h2><div class="panel">${PK.filter(k=>k!==S.me).map(k=>pRow(k,a)).join('')}<div class="note">Ortak olmak isteyen partiyle bakanlık pazarlığı yaparsın. Uyum ${nf(S.kol,1)}/10. Uyum sıfıra inerse ortak hükümetten çekilir.</div></div>
  <h2>Vaatler (${S.prom.length}/4)</h2><div class="panel"><div class="note" style="margin:0 0 6px">Söz verdiğin vaadi seçimde tutamazsan oy kaybedersin (−3 puan). Tutarsan +1,5 puan alırsın.</div>${VAAT.map(([id,t,fn])=>{const on=S.prom.includes(id),ok=fn();return `<div class="lever"><span class="n">${t}</span><span class="h">${on?(ok?'Söz verildi · şu an sağlanıyor':'Söz verildi · henüz sağlanmadı'):(ok?'Zaten sağlanıyor':'Henüz sağlanmıyor')}</span><div class="step">${on?'<span class="st good">Verildi</span>':sbtn(`data-prom="${id}"`,'Söz ver',ok||S.prom.length>=4||a<1)}</div></div>`;}).join('')}</div>
  ${draftP()}<h2>Yasalar</h2><div class="panel">${LAWS.map(([id,n,c,need,,d,fx])=>{const done=S.laws[id],wait=false;return `<div class="lever"><span class="n">${n}</span><span class="h">${d} <b>(Geçerse: ${fxText(fx)}.)</b> ${need} oy gerekir.</span><div class="step">${done?'<span class="st good">Yasalaştı</span>':sbtn(`data-law="${id}"`,`Teklif`,wait||a<c)+sbtn(`data-law="${id}" data-lobi="1"`,`Lobi · ${c+2}`,wait||a<c+2)}</div></div>`;}).join('')}<div class="note">Lobi, muhalefet vekillerini ikna eder ve oy şansını artırır. Teklif verdiğinde Genel Kurul oylaması açılır.</div></div>`;
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
  return `<div class="wrap"><div class="end"><div class="muted" style="font-family:var(--mono);font-size:12px">${dateLabel(S.month)} · ${S.term}. dönem genel seçimi</div><h1>Seçim Sonucu</h1><div class="big">%${nf(e.p,1)}</div><div class="note">Kampanya etkisi ${S.kamp>=0?'+':''}${nf(S.kamp,1)} puan${e.pr.length?' · Vaatler: '+e.pr.map(r=>r[1]?'+1,5':'−3').join(' '):''}</div>
  ${ozet(e)}${krnEl()}<div class="fac" style="margin-top:14px">${PK.map(k=>`<div class="f"><span>${PART[k].n}${k===S.me?' ✓':''}</span><div class="bar"><i style="width:${se[k]/6}%"></i></div><span class="dl">%${nf(e.sh[k]||0,1)} · ${se[k]}</span></div>`).join('')}</div>
  ${e.pr.length?`<ul>${e.pr.map(r=>`<li>${r[0]}: ${r[1]?'tuttun':'tutmadın, oy kaybettin'}</li>`).join('')}</ul>`:''}
  <h2>Hükümeti Kur</h2><p class="muted">Çoğunluk için 301 sandalye gerekir. Ortaklarla bakanlık pazarlığı yap.</p><div class="panel">${PK.filter(k=>k!==S.me&&se[k]>0).map(k=>pRow(k,99)).join('')}</div>
  <div class="big" style="font-size:30px;margin-bottom:12px">${g} sandalye</div><button class="btn" data-elfin="1">${g>=301?'Hükümeti kur ve devam et':'Azınlık hükümeti kur'}</button></div></div>`;
}
function kabine(){
  const a=avail(),tot=S.fac.R+S.fac.G+S.fac.S,list=[['mb','Merkez Bankası Başkanı'],...MIN.filter(m=>!m[4]).map(m=>[m[0],m[1]+' Bakanı'])];
  return `${S.cand?candP():''}<h2>Kabine</h2><div class="panel"><div class="note" style="margin:0 0 6px">${PART[S.me].n} hükümetini yönetiyorsun. 17 bakanlık ve Merkez Bankası. Koalisyon ortağına verdiğin bakanlıkları değiştiremezsin.</div>${list.map(([k,n])=>{const m=S.M[k],h=S.own[k];return `<div class="lever"><span class="n">${n}</span><span class="h">${m.name} · yetkinlik ${m.sk}/10 · güven ${nf(m.gv===undefined?40+m.sk*5:m.gv,0)}${(m.gv===undefined?99:m.gv)<35?' · <b style="color:var(--bad)">Riskli</b>':''}${h?' · '+PART[h].n+' kontenjanı':''}</span><div class="step">${sbtn(`data-fire="${k}"`,S.confirm===k?'Onayla':'Değiştir',a<2||h).replace('class="btn sm"','class="btn sm sec"')}</div></div>`;}).join('')}</div>
  <h2>Koalisyon Ortakları</h2><div class="panel">${S.coal.length?S.coal.map(k=>`<div class="lever"><span class="n">${PART[k].n}</span><span class="h">Lider ${PART[k].lead} · ${S.seats[k]} sandalye</span></div>`).join('')+`<div class="note">Koalisyon uyumu ${nf(S.kol,1)}/10</div>`:'<span class="muted">Ortak yok. Meclis sekmesinden ortak arayabilirsin.</span>'}</div>
  <h2>Parti İçi Hizipler</h2><div class="fac">${[['R','Reformcular'],['G','Gelenekçiler'],['S','Sadakatçiler']].map(([k,n])=>`<div class="f"><span>${n}</span><div class="bar"><i style="width:${S.fac[k]/tot*100}%"></i></div><span class="dl">%${nf(S.fac[k],0)}</span></div>`).join('')}</div>`;
}

