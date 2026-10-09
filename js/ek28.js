/* ek28: Harita modu — harita ana ekran, HUD, haber kutusu, alt menü paneli, Dünya görünümü. Ayarlar'dan Klasik'e dönülür (km-hm=0). */
let hp28=false,hw28=true,hn28=false,hv28={x:0,y:0,k:1,i:0},hg28=0,hT28=0,lt28=null,sc28=0;
const on28=()=>{const v=ls('km-hm');return v===null||v===''?!navigator.webdriver:v==='1';};
const BI28=[['kar','masa','◉','Kararlar'],['eko','eko','₺','Ekonomi'],['top','top','☺','Toplum'],['sia','sia','⚖','Siyaset'],['dev','dev','♛','Devlet'],['dun','','🌐','Dünya']];
const act28=b=>hp28&&b[1]&&grp()[0]===b[1];
const sp28=(k,c)=>{const a=((S.hist||{})[k]||[]).slice(-24);if(a.length<2)return '';const mn=Math.min(...a),mx=Math.max(...a),r=mx-mn||1;return `<svg viewBox="0 0 40 12" width="40" height="12"><polyline points="${a.map((v,i)=>(i/(a.length-1)*40).toFixed(1)+','+(11-(v-mn)/r*10).toFixed(1)).join(' ')}" fill="none" stroke="${c}" stroke-width="1.5"/></svg>`;};
const cl28=(k,v)=>{const s=STATS.find(x=>x.k===k);return 'var(--'+(s?s.st(v):'warn')+')';};
const sb28=(l,v,k,c)=>`<button class="hs" data-hmt="masa"><i>${l}</i><b style="color:${c}">${v}</b>${k?sp28(k,c):'<em>büyüme %'+nf(S.buy,1)+'</em>'}</button>`;
const st28=()=>{const ot=(S.par*.5+S.kol*.25+S.ord*.25)*10;return sb28('GSYH',nf(S.gdp,0)+' mlr $','','var(--ink)')+sb28('Halk desteği','%'+nf(S.des,0),'des',cl28('des',S.des))+sb28('İstikrar',nf(S.huz*10,0)+'/100','huz',cl28('huz',S.huz))+sb28('Başkan otoritesi',nf(ot,0)+'/100','par',cl28('par',ot/10));};
const nw28=()=>{const L=(S.log||[]).slice(-4).reverse(),n=hn28?140:58,it=x=>{const g=gcat24(x.t),m=String(x.msg||'');return `<div class="hni"><b style="color:${g[1]}">${g[0]}</b> ${x.c}${m?' — '+m.slice(0,n)+(m.length>n?'…':''):''}</div>`;};
  return `<button class="hnw${hn28?' on':''}" data-hmn="1"><div class="hnh">GÜNDEM${L.length>1?' · '+L.length+' haber':''}<span>${hn28?'▴':'▾'}</span></div>${L.length?(hn28?L.map(it).join(''):it(L[0])):'<div class="hni">Yeni ay başladı. Kararlar bekliyor.</div>'}</button>`;};
function map28(){const I=IND.find(x=>x[0]===(S.mi||'des')),nat=NAT(I[0]),v=MAP.n.map((n,i)=>rv(i,I[0])),sp=Math.max(...v.map(x=>Math.abs(x-nat)),.01),ord=MAP.n.map((n,i)=>i).sort((a,b)=>(a===S.rgs)-(b===S.rgs));
  return `<svg viewBox="0 0 ${MAP.w} ${MAP.h}" class="hmsv">${ord.map(i=>{const t=(v[i]-nat)/sp*(I[3]?1:-1);return `<path data-il="${i}" d="${MAP.p[i]}" style="fill:${t>=0?'var(--good)':'var(--bad)'};opacity:${(.3+.65*Math.abs(t)).toFixed(2)};stroke:${S.rgs===i?'var(--ink)':'var(--bg)'};stroke-width:${S.rgs===i?.8:.25}"/>`;}).join('')}<path d="${MAP.b}" style="fill:none;stroke:var(--bg);stroke-width:.9;pointer-events:none"/>${REG.map((r,j)=>`<text x="${MAP.l[j][0]}" y="${MAP.l[j][1]}" text-anchor="middle" style="font-size:6px;font-weight:600;fill:var(--ink);pointer-events:none">${r[0]}</text>`).join('')}</svg>`;}
const WH28=['ger','fra','nld','pol','hun','bgr','gre','ita','aze','geo','arm','isr','jor','kwt','qat','uae','syr','kktc','uk','swe','ukr','irq','irn','tkm','uzb','pak','egy','lby','nga','som','mys','kor'];
function wsv28(){const sel=S.wsel;return `<svg viewBox="0 0 360 150" class="hmsv"><path d="${WMB}" fill="#2b2a24" stroke="#14130f" stroke-width=".25"/>${CT.map(x=>WMP[x[0]]?`<path data-wsel="${x[0]}" d="${WMP[x[0]]}" fill="${rlC(S.ul[x[0]])}" stroke="${x[0]===sel?'#fff':'#14130f'}" stroke-width="${x[0]===sel?.8:.25}"/>`:'').join('')}<path data-hmtr="1" d="${WMP.tur}" fill="#F2C14E" stroke="#fff" stroke-width=".5"/><g text-anchor="middle" fill="#fff" stroke="#000" stroke-width=".3" paint-order="stroke" style="pointer-events:none;font-weight:600;font-size:2.3px">${[['tur','Türkiye'],...CT.map(x=>[x[0],x[1]])].filter(x=>WML[x[0]]).map(x=>`<text class="${WH28.includes(x[0])?'wl s':'wl'}" x="${WML[x[0]][0]}" y="${WML[x[0]][1]}">${x[1]}</text>`).join('')}</g></svg>`;}
function side28(){if(hp28)return '';if(hw28){const c=S.wsel&&CT.find(x=>x[0]===S.wsel);return c?`<aside class="hrp"><button class="hpx" data-hmr="w">✕</button><div class="panel">${dxCard(c,1)}</div></aside>`:'';}
  return S.rgs!=null?`<aside class="hrp"><button class="hpx" data-hmr="r">✕</button>${bolgeP(S.rgs)}</aside>`:'';}
function hud28(){const left=(S.cur.events||[]).filter(e=>e.ch===null).length,w=hw28;
  return `<div class="hmst${w?' hmw':''}"><div class="hmz" style="transform:translate(${hv28.x}px,${hv28.y}px) scale(${hv28.k})">${w?wsv28():map28()}</div></div>
  <div class="hid"><span class="hfl">☪</span><div><b>Türkiye</b><small>${dateLabel(S.month)} · Tur ${Math.max(1,S.month-(S.h0||0)+1)}</small></div></div>${nw28()}<div class="hss">${st28()}</div>
  <div class="htr"><button data-ara="1" aria-label="Ara">⌕</button><button data-hm="home">☰<span> Menü</span></button><button data-hmo="1" aria-label="Ayarlar">⚙</button></div>
  <div class="hly">${w?[['Müttefik',80],['Dost',65],['Normal',50],['Gergin',30],['Düşman',10]].map(([n,v])=>`<span><i style="background:${rlC(v)}"></i>${n}</span>`).join('')+'<span class="hh">Türkiye\'ye dokun: iller</span>':'<button data-hmb="dun">◂ Dünya</button>'+IND.map(x=>`<button class="${x[0]===(S.mi||'des')?'on':''}" data-mi="${x[0]}">${x[1]}</button>`).join('')}</div><button class="hrc" data-hmc="1" aria-label="Haritayı sığdır">⌖</button>${side28()}
  <nav class="hbn">${BI28.map(b=>`<button class="${act28(b)||(b[0]==='dun'&&hw28)?'on':''}" data-hmb="${b[0]}"><span>${b[2]}</span>${b[3]}${b[0]==='kar'&&left?`<em>${left}</em>`:''}</button>`).join('')}<button class="hed${left?'':' rdy'}" data-hme="1">Turu bitir ▸</button></nav>${typeof dxSheet==='function'?dxSheet():''}`;}
function wire28(o){const st=o.querySelector('.hmst'),z=o.querySelector('.hmz');if(!st||!z)return;const ps=new Map(),rot=document.documentElement.hasAttribute('data-rot'),fl=document.documentElement.hasAttribute('data-flip');let d0=0;
  const ap=()=>{const W=st.offsetWidth,H=st.offsetHeight,k=hv28.k;hv28.x=Math.max(W*(1-k)-W*.25,Math.min(W*.25,hv28.x));hv28.y=Math.max(H*(1-k)-H*.25,Math.min(H*.25,hv28.y));z.style.transform=`translate(${hv28.x}px,${hv28.y}px) scale(${k})`;st.parentNode.dataset.z=k>=4?'2':'1';};ap();
  if(!hv28.i){hv28.i=1;if(hw28){const W=st.offsetWidth,H=st.offsetHeight,sc=Math.min(W/360,H/150),k=W<H?3.2:2,px=(W-360*sc)/2+204.5*sc,py=(H-150*sc)/2+46*sc;hv28.k=k;hv28.x=W/2-px*k;hv28.y=H/2-py*k;ap();}}
  const zm=(f,cx,cy)=>{const k=Math.max(1,Math.min(6,hv28.k*f)),r=k/hv28.k;hv28.x=cx-(cx-hv28.x)*r;hv28.y=cy-(cy-hv28.y)*r;hv28.k=k;if(k===1){hv28.x=0;hv28.y=0;}ap();};
  const ct=e=>rot?[st.offsetWidth/2,st.offsetHeight/2]:(r=>[e.clientX-r.left,e.clientY-r.top])(st.getBoundingClientRect());
  const cv=(dx,dy)=>rot?(fl?[-dy,dx]:[dy,-dx]):[dx,dy];
  st.addEventListener('pointerdown',e=>{ps.set(e.pointerId,[e.clientX,e.clientY]);hg28=0;if(ps.size===2){const [a,b]=[...ps.values()];d0=Math.hypot(a[0]-b[0],a[1]-b[1]);}});
  st.addEventListener('pointermove',e=>{const p=ps.get(e.pointerId);if(!p)return;const dx=e.clientX-p[0],dy=e.clientY-p[1];ps.set(e.pointerId,[e.clientX,e.clientY]);
    if(ps.size===1){hg28+=Math.abs(dx)+Math.abs(dy);if(hg28>8){const q=cv(dx,dy);hv28.x+=q[0];hv28.y+=q[1];ap();}}
    else if(ps.size===2){const [a,b]=[...ps.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(d0)zm(d/d0,...ct(e));d0=d;hg28+=20;}});
  const up=e=>{ps.delete(e.pointerId);d0=0;if(hg28>8)hT28=Date.now();};st.addEventListener('pointerup',up);st.addEventListener('pointercancel',up);
  st.addEventListener('wheel',e=>{e.preventDefault();zm(e.deltaY<0?1.2:1/1.2,...ct(e));},{passive:false});}
function post28(){const R=document.documentElement;let o=document.getElementById('hmx');
  if(!(on28()&&!window.kmHome.on()&&document.querySelector('header.top')&&document.querySelector('main'))){if(o)o.remove();R.removeAttribute('data-hm');R.removeAttribute('data-hp');return;}
  R.setAttribute('data-hm','1');hp28?R.setAttribute('data-hp','1'):R.removeAttribute('data-hp');
  if(!o){o=document.createElement('div');o.id='hmx';document.body.appendChild(o);}
  o.innerHTML=hud28();wire28(o);const w=document.querySelector('.wrap');
  if(w){if(hp28)w.insertAdjacentHTML('afterbegin','<button class="hpc" data-hmx="1" aria-label="Kapat">✕</button>');w.scrollTop=lt28===S.tab?sc28:0;}lt28=S.tab;}
{const _r=render;render=function(){try{const w=document.querySelector('.wrap');sc28=w?w.scrollTop:0;}catch(e){}const x=_r.apply(this,arguments);try{post28();}catch(e){}return x;};}
document.addEventListener('click',ev=>{if(Date.now()-hT28<400&&ev.target.closest&&ev.target.closest('.hmst')){ev.stopImmediatePropagation();ev.preventDefault();return;}
  if(ev.target.closest&&ev.target.closest('[data-hmtr]')){ev.stopImmediatePropagation();hw28=false;hp28=false;hv28={x:0,y:0,k:1,i:1};return render();}
  const t=ev.target.closest&&ev.target.closest('button');if(!t)return;
  const d=t.dataset,K=()=>{ev.stopImmediatePropagation();},opn=tb=>{hp28=true;if(tb)S.tab=tb;S.evo=null;};
  if(d.hmb!==undefined){K();const b=BI28.find(x=>x[0]===d.hmb);if(b[0]==='dun'){hw28=true;hp28=false;hv28={x:0,y:0,k:1,i:0};}else if(act28(b))hp28=false;else{const g=GR.find(x=>x[0]===b[1]);opn(b[0]==='kar'?'karar':g[2].includes(S.tab)?S.tab:g[2][0]);}return render();}
  if(d.hmx!==undefined){K();hp28=false;return render();}
  if(d.hmt!==undefined){K();opn(d.hmt);return render();}
  if(d.hmn!==undefined){K();hn28=!hn28;return render();}
  if(d.hmc!==undefined){K();hv28={x:0,y:0,k:1,i:hw28?0:1};return render();}
  if(d.hmr!==undefined){K();if(d.hmr==='w')S.wsel=null;else S.rgs=null;return render();}
  if(d.hmd!==undefined){K();S.dpc=d.hmd;opn('dis');return render();}
  if(d.hmo!==undefined){K();window.kmHome.set(true);render();const b=document.querySelector('[data-hm="ayar"]');if(b)b.click();return;}
  if(d.hms!==undefined){K();ls('km-hm',d.hms);hp28=false;return render();}
  if(d.hme!==undefined){K();const l=(S.cur.events||[]).filter(e=>e.ch===null).length;if(l){opn('karar');return render();}hp28=false;hap([30,50,30],392);return endTurn();}},true);
const ayarH28=()=>{const m=on28();return `<div class="panel"><div class="dl">Ana ekran</div><div class="chips" style="margin:6px 0 4px"><button class="btn sm ${m?'':'sec'}" data-hms="1">Harita modu</button><button class="btn sm ${m?'sec':''}" data-hms="0">Klasik</button></div><div class="note">Harita modu: Türkiye haritası ana ekrandır; menüler alttan panel olarak açılır.</div></div>`;};
