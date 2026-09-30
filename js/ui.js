/* ---------- Görünüm ---------- */
function spark(a){
  const v=a.slice(-25);if(v.length<2)return '<svg class="sp" viewBox="0 0 100 20"></svg>';
  const mn=Math.min(...v),mx=Math.max(...v),r=(mx-mn)||1;
  const pts=v.map((y,i)=>[i/(v.length-1)*100,18-((y-mn)/r)*16]);
  const l=pts[pts.length-1];
  return `<svg class="sp" viewBox="0 0 100 20" preserveAspectRatio="none"><polyline points="${pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')}"/></svg>`;
}
function tile(s){
  const v=S[s.k],p=S.prev?S.prev[s.k]:v,dd=v-p;
  const st=s.st(v);const idx=st==='good'?0:st==='warn'?1:2;
  const dtxt=Math.abs(dd)<0.05?'':`<span class="dl ${dd>0?'up':'dn'}">${dd>0?'▲':'▼'} ${nf(Math.abs(dd),s.d)}</span>`;
  const lab=s.lb[idx];
  return `<div class="tile"><div class="lb"><span>${s.l}</span></div><div class="val">${nf(v,s.d)}<small>${s.u}</small></div><div class="row">${dtxt||'<span></span>'}${lab?`<span class="st ${st}">${lab}</span>`:''}</div>${spark(S.hist[s.k])}</div>`;
}
function fmtLev(k,v){
  if(k==='faiz')return '%'+nf(v,1);
  if(k==='sav')return '%'+nf(v,2);
  const n=['−2','−1','0','+1','+2'][v+2];return n;
}
const LEVERS=[['faiz','Politika faizi','Yüksek faiz enflasyonu ve kuru bastırır, büyümeyi yavaşlatır.']];
function levers(c){
  return `<div class="panel">${c?'':'<h2>Politika Kolları</h2>'}${LEVERS.map(([k,n,h])=>{
    const chg=S.lv[k]!==S.lv0[k];
    return `<div class="lever"><span class="n">${n}${chg?' <span class="muted">· 1 SS</span>':''}</span>${c?'':`<span class="h">${h}</span>`}<div class="step"><button data-lv="${k}" data-d="-1" aria-label="${n} azalt">−</button><output class="${chg?'chg':''}">${fmtLev(k,S.lv[k])}</output><button data-lv="${k}" data-d="1" aria-label="${n} artır">+</button></div>${c?'':`<input class="rng" type="range" min="${LVR[k][0]}" max="${LVR[k][1]}" step="0.5" value="${S.lv[k]}" data-faizr="1" aria-label="${n} ayarla">`}</div>`;}).join('')}
  ${c?'':`<div class="note">Faiz %−10 ile %500 arasında ayarlanabilir. Faiz değişikliği bu ay 1 Siyasi Sermaye harcar. Eski değere dönersen iade edilir. Bütçe ve vergiler için alttaki sekmelere bak.</div>`}</div>`;
}
function eventCard(e,i){
  const d=EVB[e.id];const a=avail();const mn=Math.min(...d.c.map(x=>x.ss));
  const done=e.ch!==null;
  let body;
  if(!done){
    body=`<div class="choices">${d.c.map((c,ci)=>`<button class="choice" data-ev="${i}" data-c="${ci}" ${c.ss>a&&c.ss>mn?'disabled':''}><b>${c.l}</b><span class="d">${c.d}</span><span class="cost ${c.ss?'':'free'}">${c.ss?'SS −'+c.ss:'Bedelsiz'}</span></button>`).join('')}</div>`;
  }else{
    const c=d.c[e.ch];
    body=`<div class="outcome"><div class="you">Kararın: ${c.l}</div><div>${e.msg}</div><div class="chips">${(e.fxs||[]).map(f=>`<span class="chip">${f[0]} ${f[1]>0?'+':'−'}${nf(Math.abs(f[1]),f[2])}${f[3]==='%'?' %':''}</span>`).join('')}</div></div>`;
  }
  return `<article class="card ${done?'done':''}"><div class="tag">${d.tag}${d.g==='later'?' · önceki kararının sonucu':''}</div><h3>${d.t}</h3><p>${T(d.x)}</p>${body}</article>`;
}
const SH={enf:'Enflasyon',buy:'Büyüme',isz:'İşsizlik',acik:'Açık/GSYH',borc:'Dış borç',cari:'Cari açık',rez:'Rezerv',kur:'Dolar',des:'Destek',par:'Parti',kol:'Koalisyon',ord:'Ordu',huz:'Huzur',bat:'Batı',dog:'Doğu',bol:'Bölge'};
const tile2=s=>{const v=S[s.k],p=S.prev?S.prev[s.k]:v,dd=v-p;return `<button class="sqt st4 ${s.st(v)}" data-st="${s.k}"><span class="l">${SH[s.k]}</span><span class="v">${nf(v,s.d)}<small>${s.u==='mlr $'?'$':s.u}</small></span><span class="d dl ${dd>0?'up':'dn'}">${Math.abs(dd)<0.05?'&nbsp;':(dd>0?'▲ ':'▼ ')+nf(Math.abs(dd),s.d)}</span></button>`;};
const chartSheet=k=>{
  const s=STATS.find(x=>x.k===k),H=S.hist[k]||[],n=S.hr===undefined?10:S.hr,a=n?H.slice(-(n+1)):H,off=H.length-a.length,v=S[k],st=s.st(v),ix=st==='good'?0:st==='warn'?1:2,dm=m=>dateLabel(m).replace(/^(.{3})\S*/,'$1');
  let g='<div class="note">Grafik için en az bir ay geçmesi gerekir.</div>',sm='';
  if(a.length>1){
    const mn=Math.min(...a),mx=Math.max(...a),pd=(mx-mn||1)*.12,lo=mn-pd,hi=mx+pd,X=i=>36+i/(a.length-1)*270,Y=y=>10+(1-(y-lo)/(hi-lo))*120,L=a.length-1;
    g='<svg class="ch" viewBox="0 0 320 160">'+[mx,(mx+mn)/2,mn].map(y=>'<line x1="36" x2="310" y1="'+Y(y).toFixed(1)+'" y2="'+Y(y).toFixed(1)+'"/><text x="32" y="'+(Y(y)+3).toFixed(1)+'" text-anchor="end">'+nf(y,s.d)+'</text>').join('')+'<polyline points="'+a.map((y,i)=>X(i).toFixed(1)+','+Y(y).toFixed(1)).join(' ')+'"/>'+a.map((y,i)=>'<circle cx="'+X(i).toFixed(1)+'" cy="'+Y(y).toFixed(1)+'" r="'+(i===L?4:2.2)+'"/>').join('')+[0,Math.round(L/2),L].map((i,j)=>'<text x="'+X(i).toFixed(1)+'" y="152" text-anchor="'+(j===0?'start':j===2?'end':'middle')+'">'+dm((S.h0||0)+off+i)+'</text>').join('')+'</svg>';
    sm='<div class="chips"><span class="chip">Şimdi '+nf(v,s.d)+'</span><span class="chip">En düşük '+nf(mn,s.d)+'</span><span class="chip">En yüksek '+nf(mx,s.d)+'</span><span class="chip">Ortalama '+nf(a.reduce((p,c)=>p+c,0)/a.length,s.d)+'</span><span class="chip">Son ay '+(v-a[L-1]>=0?'+':'−')+nf(Math.abs(v-a[L-1]),s.d)+'</span></div>';}
  return '<div class="card"><div class="tag">'+(a.length>1?a.length-1+' aylık geçmiş':'Geçmiş')+'</div><h3>'+s.l+'</h3><p style="margin:0 0 8px"><b style="font-size:22px">'+nf(v,s.d)+'</b> '+s.u+(s.lb[ix]?' · <span class="st '+st+'">'+s.lb[ix]+'</span>':'')+'</p>'+g+sm+'<div class="chips" style="margin-top:10px">'+[[10,'10 ay'],[24,'24 ay'],[0,'Tümü']].map(([q,t])=>'<button class="btn sm '+(n===q?'':'sec')+'" data-hr="'+q+'">'+t+'</button>').join('')+'</div></div>';
};
const sheet=()=>{const o=S.evo;if(o===null||o===undefined)return '';let b;
  if(typeof o==='string'&&o[0]==='s')b=chartSheet(o.slice(2));
  else if(o==='r'){const r=S.report;if(!r)return '';b=`<div class="report"><h3>Ay Sonu Raporu · ${dateLabel(r.m)}</h3><ul>${r.h.map(x=>`<li>${x}</li>`).join('')}</ul>${r.carry?`<div class="note">Kullanmadığın ${r.carry} Siyasi Sermaye devredildi.</div>`:''}</div>`;}
  else if(S.cur.events[o])b=eventCard(S.cur.events[o],o);else return '';
  return `<div class="sheet"><div class="sheet-in">${b}<button class="btn sec" data-evx="1" style="width:100%">Kapat</button></div></div>`;};
function karar(){
  const r=S.report,E=S.cur.events;
  const evT=E.map((e,i)=>{const d=EVB[e.id],dn=e.ch!==null;return `<button class="sqt ev ${dn?'done':''}" data-evo="${i}"><span class="l">${d.tag.split(' · ')[0]}${dn?' ✓':''}</span><span class="t">${d.t}</span><span class="d dl">${dn?'Verildi':'Bekliyor'}</span></button>`;}).join('');
  const rp=r?`<button class="sqt ev" data-evo="r"><span class="l">Rapor</span><span class="t">Ay sonu raporu</span><span class="d dl">${dateLabel(r.m)}</span></button>`:'';
  return `<div class="msq"><div class="sq two">${evT}${rp}</div>${levers(1)}</div>${sheet()}`;
}
function masa(){
  return `<div class="msq"><div class="sq big">${STATS.map(tile2).join('')}</div></div>${sheet()}`;
}
function gunluk(){
  if(!S.log.length)return '<h2>Günlük</h2><p class="muted">Henüz karar yok.</p>';
  return `<h2>Günlük</h2><div class="log">${S.log.slice().reverse().map(e=>`<div class="e"><small>${dateLabel(e.m)}</small><div><b>${e.t}</b> · ${e.c}</div><div class="muted">${e.msg}</div></div>`).join('')}</div>`;
}
function makeCode(){try{return btoa(unescape(encodeURIComponent(JSON.stringify(S))));}catch(e){return '';}}
function kayit(){
  return `<h2>Kayıt</h2><p style="max-width:62ch">Oyun bu tarayıcıda otomatik kaydedilir. Başka bir bilgisayara ya da telefona geçmek için aşağıdaki kodu kopyala, orada bu sayfayı aç, Kayıt sekmesine yapıştırıp yükle.</p>
  <div class="panel"><b>Kayıt kodun</b> <span class="muted">(${dateLabel(S.month)})</span><textarea id="code" readonly rows="5" style="width:100%;margin:8px 0;font-family:var(--mono);font-size:11px;background:var(--bg);color:var(--ink);border:1px solid var(--line);padding:8px">${makeCode()}</textarea><button class="btn sm" data-copy="1">Kodu kopyala</button></div>
  <div class="panel"><b>Kayıt yükle</b><textarea id="imp" rows="5" placeholder="Kodu buraya yapıştır" style="width:100%;margin:8px 0;font-family:var(--mono);font-size:11px;background:var(--bg);color:var(--ink);border:1px solid var(--line);padding:8px"></textarea><button class="btn sm" data-import="1">Yükle</button> <span id="kmsg" class="muted">${S.kmsg||''}</span></div>`;
}
function endScreen(){
  const o=S.over;
  return `<div class="end"><div class="muted" style="font-family:var(--mono);font-size:12px">${dateLabel(S.month)} · ${S.term}. dönem</div><h1>${o.t}</h1><p>${o.x}</p>${o.p?`<div class="big">%${nf(o.p,1)}</div><div class="note">Kampanya etkisi: ${S.kamp>=0?'+':''}${nf(S.kamp||0,1)} puan</div>`:''}<div class="stats" style="margin-top:18px">${['enf','buy','isz','rez','des','huz'].map(k=>tile(STATS.find(s=>s.k===k))).join('')}</div>${karne()}<button class="btn" data-new="1" style="margin-top:14px">Yeni oyun başlat</button></div>`;
}
function diger(){return ayar()+ist()+basarim()+slots()+gunluk()+'<div class="panel" style="margin-top:14px"><button class="btn sec sm" data-new="1">'+(S.confirmNew?'Emin misin? Tekrar bas':'Yeni oyun')+'</button></div>'+kayit();}
const V={masa,karar,harita,kampanya,ticaret,butce,vergi,sektor,kurum,dis,meclis,kabine,diger};
const GR=[['masa','Masa',['masa','karar','harita']],['eko','Ekonomi',['butce','vergi','sektor','ticaret']],['sia','Siyaset',['meclis','kabine','kampanya']],['dev','Devlet',['kurum','dis']],['diger','Diğer',['diger']]],SUBN={masa:'Göstergeler',karar:'Kararlar',harita:'Harita',butce:'Bütçe',vergi:'Vergi',kurum:'Kurum',sektor:'Sektörler',ticaret:'Dış ticaret',dis:'Dış ilişkiler',meclis:'Meclis',kabine:'Kabine',kampanya:'Kampanya',diger:'Diğer'};
const grp=()=>GR.find(g=>g[2].includes(V[S.tab]?S.tab:'masa'));
const subbar=()=>{const g=grp();return g[2].length<2?'':'<div class="subtabs">'+g[2].map(k=>'<button class="bn2" aria-selected="'+(k===S.tab)+'" data-tab="'+k+'">'+SUBN[k]+'</button>').join('')+'</div>';};
function render(){
  const app=document.getElementById('app');
  if(S.over){app.innerHTML=`<div class="wrap">${endScreen()}</div>`;return;}
  if(S.pick){app.innerHTML=pickScreen();return;}
  if(S.tut){app.innerHTML=tutScreen();return;}
  if(S.vote){app.innerHTML=voteScreen();return;}
  if(S.neg){app.innerHTML=negScreen();return;}
  if(S.el){app.innerHTML=elScreen();return;}
  if(S.wage){app.innerHTML=wageScreen();return;}
  const a=avail();
  const all=S.cur.events.every(e=>e.ch!==null);
  const pips=Array.from({length:Math.max(S.pool,10)},(_,i)=>`<i class="pip ${i<a?'':'off'}"></i>`).join('');
  const left=S.cur.events.filter(e=>e.ch===null).length;
  app.innerHTML=`<header class="top"><div class="top-in"><div class="brand">Karar Masası<small>${dateLabel(S.month)} · ${S.term}. DÖNEM · SEÇİME ${TERM-S.month%TERM} AY</small></div>
  <div class="ss"><b>${a}</b><span>Siyasi Sermaye</span><div class="pips">${pips}</div></div></div></header>
  <div class="wrap"><main>${subbar()}${(V[S.tab]||masa)()}</main></div>
  ${S.tab==='masa'||S.tab==='karar'||!V[S.tab]?`<div class="endbar"><div class="endbar-in"><span class="msg">${all?'Tüm kararlar verildi.':`${left} karar bekliyor.`}</span><button class="btn" data-end="1" ${all?'':'disabled'}>Ayı Bitir · ${dateLabel(S.month+1)}</button></div></div>`:''}
  <nav class="bnav" role="tablist">${GR.map(([id,n,ks])=>`<button class="bn" role="tab" aria-selected="${grp()[0]===id}" data-tab="${ks.includes(S.tab)?S.tab:ks[0]}">${n}</button>`).join('')}</nav>`;
}
document.addEventListener('click',ev=>{
  const rp=ev.target.closest&&ev.target.closest('[data-il]');if(rp){S.rgs=+rp.dataset.il;save();return render();}
  if(ev.target.classList&&ev.target.classList.contains('sheet')){S.evo=null;return render();}
  const t=ev.target.closest('button');if(!t)return;
  if(t.dataset.st){S.evo='s:'+t.dataset.st;return render();}
  if(t.dataset.hr!==undefined){S.hr=+t.dataset.hr;save();return render();}
  if(t.dataset.evo!==undefined){S.evo=t.dataset.evo==='r'?'r':+t.dataset.evo;return render();}
  if(t.dataset.evx!==undefined){S.evo=null;return render();}
  if(t.dataset.ev!==undefined){hap(20,520);return decide(+t.dataset.ev,+t.dataset.c);}
  if(t.dataset.lv)return lever(t.dataset.lv,+t.dataset.d);
  if(t.dataset.bud)return bud(t.dataset.bud,+t.dataset.d);
  if(t.dataset.taxs)return taxs(t.dataset.taxs,+t.dataset.d);
  if(t.dataset.act)return act(t.dataset.act);
  if(t.dataset.uisrc){S.ui.src=t.dataset.uisrc;S.ui.amt=Math.min(ui('amt',8),LOAN[S.ui.src][5]);save();return render();}
  if(t.dataset.wgo)return wageGo();
  if(t.dataset.law)return propose(t.dataset.law,!!t.dataset.lobi);
  if(t.dataset.pick)return startGame(t.dataset.pick);
  if(t.dataset.dif!==undefined){S.dif=+t.dataset.dif;save();return render();}
  if(t.dataset.sc!==undefined){S.sc=+t.dataset.sc;save();return render();}
  if(t.dataset.deal)return dealAct(t.dataset.deal);
  if(t.dataset.tut){S.tut=1;return render();}
  if(t.dataset.tutn!==undefined){S.tut=+t.dataset.tutn&&S.tut<TUT.length?S.tut+1:0;if(!S.tut)ls('km-tut','1');save();return render();}
  if(t.dataset.slot){const c=t.dataset.slot[0],i=t.dataset.slot.slice(1);if(c==='s'){ls('km-s'+i,makeCode());ls('km-sm'+i,dateLabel(S.month)+' · '+PART[S.me].n);render();}else loadCode(ls('km-s'+i));return;}
  if(t.dataset.neg){S.neg={p:t.dataset.neg,off:[],msg:''};return render();}
  if(t.dataset.nego){const o=S.neg.off,k=t.dataset.nego,i=o.indexOf(k);if(i<0)o.push(k);else o.splice(i,1);S.neg.msg='';return render();}
  if(t.dataset.offer)return offer();
  if(t.dataset.negx){S.neg=null;return render();}
  if(t.dataset.votok){S.vote=null;save();return render();}
  if(t.dataset.dropp)return dropP(t.dataset.dropp);
  if(t.dataset.prom)return makeProm(t.dataset.prom);
  if(t.dataset.ally)return doAlly();
  if(t.dataset.elfin)return finishEl();
  if(t.dataset.ap!==undefined)return appoint(+t.dataset.ap);
  if(t.dataset.apx){S.cand=null;return render();}
  if(t.dataset.drb!==undefined){S.dr.b=+t.dataset.drb;save();return render();}
  if(t.dataset.drl!==undefined){S.dr.l=+t.dataset.drl;save();return render();}
  if(t.dataset.dsub)return submitDraft();
  if(t.dataset.mi){S.mi=t.dataset.mi;return render();}
  if(t.dataset.ihr)return ihr();
  if(t.dataset.tar)return tact('tar',t.dataset.tar);
  if(t.dataset.yl)return tact('yl');
  if(t.dataset.fta)return tact('fta',t.dataset.fta);
  if(t.dataset.ka)return kact(t.dataset.ka);
  if(t.dataset.rgi)return rgAct(+t.dataset.rgi,0);
  if(t.dataset.rgm)return rgAct(+t.dataset.rgm,1);
  if(t.dataset.th){th(t.dataset.th==='auto'?'':t.dataset.th);return render();}
  if(t.dataset.fx){ls('km-fx',fxs()?'0':'1');hap(30,500);return render();}
  if(t.dataset.tab){S.tab=t.dataset.tab;S.confirm=null;save();return render();}
  if(t.dataset.fire)return fire(t.dataset.fire);
  if(t.dataset.end){hap([30,50,30],392);return endTurn();}
  if(t.dataset.copy){
    const ta=document.getElementById('code');
    const done=()=>{t.textContent='Kopyalandı';};
    const fb=()=>{ta.focus();ta.select();t.textContent='Kodu seçtim, kopyala';};
    try{navigator.clipboard.writeText(ta.value).then(done,fb);}catch(e){fb();}
    return;
  }
  if(t.dataset.import){
    const v=(document.getElementById('imp').value||'').trim();
    if(!loadCode(v)){S.kmsg='Kod okunamadı. Tamamını kopyaladığından emin ol.';document.getElementById('kmsg').textContent=S.kmsg;}
    return;
  }
  if(t.dataset.new){
    if(S.over||S.confirmNew){S.confirmNew=false;newGame();return render();}
    S.confirmNew=true;render();setTimeout(()=>{if(S){S.confirmNew=false;render();}},4000);return;
  }
});
document.addEventListener('input',ev=>{
  const t=ev.target;if(!t.classList||!t.classList.contains('rng'))return;const v=+t.value;
  if(t.dataset.faizr){t.closest('.lever').querySelector('output').textContent='%'+nf(v,1);return;}
  if(t.dataset.ui)S.ui[t.dataset.ui]=v;else if(t.dataset.taxr)S.tax[t.dataset.taxr]=v;else if(t.dataset.wage)S.wage.G=v;else return;
  const root=t.closest('main,.wrap'),d=document.createElement('div');d.innerHTML=S.wage?wageScreen():(V[S.tab]||masa)();
  if(S.wage){const o=root.querySelectorAll('.dl'),w=d.querySelectorAll('.dl');o.forEach((e,j)=>{if(w[j])e.innerHTML=w[j].innerHTML;});return;}
  const i=[...root.querySelectorAll('.rng')].indexOf(t),n=d.querySelectorAll('.rng')[i];if(!n)return;
  const Lv=t.closest('.lever');
  if(Lv){const N=n.closest('.lever');Lv.querySelector('.h').innerHTML=N.querySelector('.h').innerHTML;Lv.querySelector('output').replaceWith(N.querySelector('output'));}
  else t.previousElementSibling.innerHTML=n.previousElementSibling.innerHTML;
});
document.addEventListener('change',ev=>{
  const t=ev.target;if(!t.classList||!t.classList.contains('rng'))return;const v=+t.value;
  if(t.dataset.faizr)return setFaiz(v);
  if(t.dataset.ui)S.ui[t.dataset.ui]=v;else if(t.dataset.taxr)S.tax[t.dataset.taxr]=clamp(Math.round(v*10)/10,0,100);else if(t.dataset.wage)S.wage.G=v;else return;
  save();render();
});
if(!load())newGame();
th();render();
