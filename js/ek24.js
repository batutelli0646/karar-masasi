/* ek24: Etki önizleme (karar onayı), Bakan görüş balonları, Başkanlık masası, Gündem akışı, Seçim gecesi */
const PVX24={p:null};
const pvF24=(s,v)=>nf(v,s.d)+(s.u==='mlr $'?'$':s.u);
const pvRows24=c=>{const f=c.fx||{};return Object.keys(f).map(k=>{const s=STATS.find(x=>x.k===k),v=f[k];if(!s||!v||S[k]===undefined||!RANGE[k])return null;const b=S[k],a=k==='kur'?b*(1+v/100):clamp(b+v,RANGE[k][0],RANGE[k][1]);if(nf(a,s.d)===nf(b,s.d))return null;return {s,b,a,w:Math.abs(a-b)/(RANGE[k][1]-RANGE[k][0])};}).filter(Boolean).sort((x,y)=>y.w-x.w).slice(0,6);};
const pvCard24=(e,i,c,ci)=>{const d=EVB[e.id],rows=pvRows24(c),blk=c.ss>avail()&&c.ss>Math.min(...d.c.map(x=>x.ss));
  return `<article class="card pv"><div class="tag">Etki önizleme</div><h3>${c.l}</h3><p>${c.d}</p>${rows.length?`<div class="pvr">${rows.map(r=>`<div class="pvl"><span>${r.s.l}</span><span>${pvF24(r.s,r.b)} <b class="${((r.a-r.b)<0)===!!r.s.low?'g':'b'}">→ ${pvF24(r.s,r.a)}</b></span></div>`).join('')}</div>`:''}<div class="note">${c.fn?'Sonuç şansa bağlı; gösterilenler kesin değildir. ':'Tahmini etki; olaylar ve ay sonu hesabı değiştirebilir. '}${blk?'Yeterli puanın yok.':c.ss?c.ss+' puan harcar.':'Puan harcamaz.'}</div><div class="chips pvb"><button class="btn" data-ev="${i}" data-c="${ci}" data-pvk="1" ${blk?'disabled':''}>Onayla</button><button class="btn sec" data-pvx="1">Geri</button></div></article>`;};
const bw24={mb:{enf:1,rez:.5,buy:.4,kur:.4}};
const balP24=(e)=>{try{const d=EVB[e.id],cs=d.c.filter(c=>c.fx);if(cs.length<2||!S.M)return '';
  const L=[['mb','Merkez Bankası',bw24.mb],...MIN.filter(m=>!m[4]).map(m=>[m[0],m[1],m[3]])],out=[];
  L.forEach(([k,n,w])=>{const m=S.M[k];if(!m)return;let rel=0;const sc=cs.map(c=>{let t=0,pos=null,neg=null;for(const q in w){const v=c.fx[q],s=STATS.find(x=>x.k===q);if(!v||!s||!RANGE[q])continue;const g=(s.low?-v:v)/(q==='kur'?100:RANGE[q][1]-RANGE[q][0]),im=Math.abs(w[q]);t+=g*im;rel+=Math.abs(g)*im;if(g>0&&(!pos||g*im>pos[1]))pos=[s.l,g*im];if(g<0&&(!neg||-g*im>neg[1]))neg=[s.l,-g*im];}return {c,t,pos,neg};});
    const b=sc.reduce((x,y)=>y.t>x.t?y:x,sc[0]);if(rel>0&&b.t>0&&b.pos)out.push({rel,k,n,m,b});});
  out.sort((x,y)=>y.rel-x.rel);if(!out.length)return '';
  return `<div class="bal"><div class="dl">Bakanların görüşü</div>${out.slice(0,3).map(o=>{const g=o.m.gv===undefined?40+o.m.sk*5:o.m.gv,col=g>=60?'var(--good)':g<35?'var(--bad)':'var(--warn)',ini=String(o.m.name).split(' ').slice(0,2).map(x=>x[0]).join('');
    return `<div class="bl"><i class="av" style="--c:${col}">${ini}</i><div class="bt"><b>${o.n}</b> · ${o.m.name}<br>“${o.b.c.l}” derim. ${o.b.pos[0]} lehimize döner${o.b.neg?', ama '+o.b.neg[0]+' zarar görür':''}.</div></div>`;}).join('')}</div>`;}catch(x){return '';}};
{const _e=eventCard;eventCard=function(e,i){try{const p=PVX24.p;if(p&&p.i===i&&e.ch===null){const d=EVB[e.id];if(d&&d.c[p.c])return pvCard24(e,i,d.c[p.c],p.c);}const h=_e.apply(this,arguments);return e.ch===null?h.replace('<div class="choices">',balP24(e)+'<div class="choices">'):h;}catch(x){}return _e.apply(this,arguments);};}
/* Başkanlık masası */
const deskP24=()=>{const E=S.cur.events||[],kr=E.map((e,i)=>[e,i]).filter(([e])=>e.ch===null&&EVB[e.id]&&EVB[e.id].g==='kriz'),bk=E.filter(e=>e.ch===null).length,
  T=(c,t,s,a,on)=>`<button class="dk ${c}${on?' on':''}" ${a}><b>${t}</b><span>${s}</span></button>`;
  return `<div class="desk"><div class="dkh">Başkanlık masası</div><div class="dkg">${T('d1','Kırmızı telefon',kr.length?kr.length+' kriz bekliyor':'Hat sessiz',kr.length?`data-evo="${kr[0][1]}"`:'data-tab="karar"',kr.length)+T('d2','Gündem dosyası',bk?bk+' karar bekliyor':'Hepsi tamam','data-tab="karar"')+T('d3','Harita','Bölge desteği','data-tab="harita"')+T('d4','Kabine zili',MIN.filter(m=>!m[4]).length+' bakan','data-tab="kabine"')+T('d5','Takvim','Seçime '+toEl()+' ay','data-tab="donem"')+T('d6','Kasa defteri','Rezerv '+nf(S.rez,0)+' mlr $','data-tab="butce"')}</div></div>`;};
{const _m=V.masa;V.masa=function(){return deskP24()+_m.apply(this,arguments);};}
/* Gündem akışı */
const gc24={eko:['EKONOMİ','#3B7DDD'],dis:['DIŞ','#2FA46E'],ic:['İÇ','#D9534F'],kriz:['KRİZ','#E89A2C'],kamp:['KAMPANYA','#8A63D2'],later:['SONUÇ','#8C9EA6']};let gm24=null;
const gcat24=t=>{if(!gm24){gm24={};for(const id in EVB)gm24[EVB[id].t]=EVB[id].g;}return gc24[gm24[t]]||['GÜNDEM','#8C9EA6'];};
function newsP(){const L=(S.log||[]).slice(-8).reverse();if(!L.length)return '';return `<div class="panel"><b>Gündem akışı</b><div class="feed">${L.map(x=>{const g=gcat24(x.t),m=String(x.msg||'');return `<div class="fd" style="--c:${g[1]}"><div class="fh"><b>${g[0]}</b><span>${dateLabel(x.m)}</span></div><div class="ft"><b>${x.c}</b>${m?' — '+m.slice(0,110)+(m.length>110?'…':''):''}</div></div>`;}).join('')}</div></div>`;}
/* Seçim gecesi */
let gd24='';const gk24=()=>S.term+':'+S.month;
function geceP24(){const e=S.el;let rows;
  if(e){const ks=PK.filter(k=>e.sh[k]>0).sort((a,b)=>e.sh[b]-e.sh[a]),rs=ks.slice(4).reduce((a,k)=>a+e.sh[k],0);rows=ks.slice(0,4).map(k=>[PART[k].n+(k===S.me?' ✓':''),e.sh[k],PCOL[PK.indexOf(k)%6]]);if(rs>.05)rows.push(['Diğer',rs,'#56666E']);}
  else rows=[['İttifakın',S.cb.r1,PCOL[0]],['Rakip',Math.max(0,100-S.cb.r1),PCOL[1]]];
  return `<div class="end gece" id="gece"><div class="muted" style="font-family:var(--mono);font-size:12px">${dateLabel(S.month)} · ${S.term}. dönem genel seçimi</div><div class="live"><i></i>CANLI · SEÇİM GECESİ</div><h1 id="gcn" style="font-size:22px">Sandıkların %0'ı açıldı</h1><div class="gb">${rows.map(r=>`<div class="gr"><b>${r[0]}</b><span class="gbar"><i data-v="${r[1]}" style="width:0;background:${r[2]}"></i></span><b class="gv" data-v="${r[1]}">%0</b></div>`).join('')}</div><div class="note">${e?'Meclis sandalyeleri ve Cumhurbaşkanlığı sonucu sayımın ardından açıklanacak.':'Cumhurbaşkanlığı ilk tur sonuçları geliyor.'}</div><button class="btn" data-gece="1" style="margin-top:12px">Sonucu göster ▸</button></div>`;}
function gTick24(){const g=document.getElementById('gece');if(!g||g.dataset.run)return;g.dataset.run='1';let p=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches?100:0,t;
  const up=()=>{const n=document.getElementById('gcn');if(!n||!document.body.contains(g)){clearInterval(t);return;}n.textContent="Sandıkların %"+Math.round(p)+"'ı açıldı";g.querySelectorAll('i[data-v]').forEach(i=>{i.style.width=Math.min(100,i.dataset.v*2*p/100)+'%';});g.querySelectorAll('.gv').forEach(b=>{b.textContent='%'+(b.dataset.v*p/100).toFixed(1).replace('.',',');});if(p>=100)clearInterval(t);};
  t=setInterval(()=>{p=Math.min(100,p+(p<60?4:p<90?2.5:1.5));up();},120);up();}
{const _s=elScreen;elScreen=function(){return gd24===gk24()?_s.apply(this,arguments):'<div class="wrap">'+geceP24()+'</div>';};}
{const _n=endScreen;endScreen=function(){const o=S.over;return o&&o.p!==undefined&&S.cb&&/Seçimi Kaybedildi/.test(o.t)&&gd24!==gk24()?geceP24():_n.apply(this,arguments);};}
{const _r=render;render=function(){const x=_r.apply(this,arguments);try{gTick24();}catch(e){}return x;};}
document.addEventListener('click',ev=>{if(ev.target.classList&&ev.target.classList.contains('sheet'))PVX24.p=null;const t=ev.target.closest&&ev.target.closest('button');if(!t)return;const d=t.dataset;
  if(d.gece!==undefined){ev.stopImmediatePropagation();gd24=gk24();render();window.scrollTo(0,0);return;}
  if(d.pvx!==undefined){ev.stopImmediatePropagation();PVX24.p=null;render();return;}
  if(d.ev!==undefined){if(d.pvk!==undefined){PVX24.p=null;return;}ev.stopImmediatePropagation();PVX24.p={i:+d.ev,c:+d.c};render();return;}
  if(d.evx!==undefined||d.evo!==undefined)PVX24.p=null;},true);
