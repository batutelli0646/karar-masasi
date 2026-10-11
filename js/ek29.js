/* ek29: Stratejik masa dünya haritası — 237 ülke/bölge, bayrak dolgulu sınırlar, ülke verileri (uv1), genel diplomasi eylemleri */
const C29={usa:'USA',ger:'DEU',uk:'GBR',gre:'GRC',rus:'RUS',chn:'CHN',aze:'AZE',irn:'IRN',irq:'IRQ',sau:'SAU',egy:'EGY',qat:'QAT',fra:'FRA',ita:'ITA',uae:'ARE',isr:'ISR',syr:'SYR',jpn:'JPN',kor:'KOR',ind:'IND',pak:'PAK',ukr:'UKR',geo:'GEO',arm:'ARM',kaz:'KAZ',uzb:'UZB',tkm:'TKM',lby:'LBY',som:'SOM',can:'CAN',bra:'BRA',esp:'ESP',nld:'NLD',pol:'POL',swe:'SWE',bgr:'BGR',hun:'HUN',jor:'JOR',kwt:'KWT',idn:'IDN',mys:'MYS',nga:'NGA',kktc:'KKTC'};
const bs29=k=>k.length>4?k.slice(0,3):k;
const R29={};for(const k in C29)R29[C29[k]]=k;
const FM29=[['r','İlişki','yeşil: yakın · kırmızı: gergin'],['g','Gelir','kahve: düşük · mavi: yüksek kişi başı gelir'],['e','Enflasyon','yeşil: düşük · kırmızı: yüksek']];
const UVA29=[['zi','🤝','Resmî ziyaret',3],['tc','📦','Ticaret heyeti',4],['yd','🎁','Kalkınma yardımı',6],['sa','📢','Sert açıklama',3],['bc','✉️','Büyükelçiyi çağır',6]];
const rel29=k=>{const i=R29[k];if(i)return S.ul[i];if(k==='TUR')return 100;const u=UV[k];return (S.ux||{})[k]??(u?u[16]:50);};
const mix29=(a,b,t)=>{const h=x=>[1,3,5].map(i=>parseInt(x.substr(i,2),16)),A=h(a),B=h(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');};
const ramp29=(t,cs)=>{t=Math.max(0,Math.min(1,t))*(cs.length-1);const i=Math.min(cs.length-2,Math.floor(t));return mix29(cs[i],cs[i+1],t-i);};
const NO29='#7a7264';
const col29=(k,m)=>{k=bs29(k);const u=UV[k];if(m==='r')return ramp29(rel29(k)/100,['#a8403a','#d08a4a','#d6c58f','#8db36b','#3f9a63']);if(!u)return NO29;
  if(m==='g')return u[4]==null?NO29:ramp29((Math.log10(u[4])-2.7)/2.3,['#8a5a32','#cfae6a','#9cc08a','#3f8aa8']);
  return u[6]==null?NO29:ramp29(Math.log(Math.max(1,u[6]+1))/Math.log(60),['#4c9a6a','#d6c58f','#d08a4a','#a8403a']);};
const flg29=()=>'';
const L29=Object.keys(WG.c).filter(k=>k.length<5||k==='KKTC').sort((a,b)=>WG.c[b][5]-WG.c[a][5]);
let raf29=0,st29=null,P29={},cc29={},ck29='',dp29=1;
const md29=()=>S.wfm&&S.wfm!=='f'?S.wfm:'r';
function wsv29(){return '<canvas class="hmcv"></canvas>';}
function tf29(cv){const st=st29,W=st.offsetWidth,H=st.offsetHeight,k=hv28.k,sc=Math.min(W/WG.w,H/WG.h);return [dp29*k*sc,dp29*(hv28.x+k*(W-WG.w*sc)/2),dp29*(hv28.y+k*(H-WG.h*sc)/2),k*sc];}
function paint29(){raf29=0;const st=st29;if(!st||!st.isConnected||!hw28)return;const cv=st.querySelector('canvas');if(!cv)return;const W=st.offsetWidth,H=st.offsetHeight;dp29=Math.min(2,window.devicePixelRatio||1);
  if(cv.width!==Math.round(W*dp29)||cv.height!==Math.round(H*dp29)){cv.width=Math.round(W*dp29);cv.height=Math.round(H*dp29);}
  const m=md29(),key=m+(m==='r'?JSON.stringify(S.ul)+JSON.stringify(S.ux||{}):'');if(key!==ck29){ck29=key;cc29={};for(const k in WG.c)cc29[k]=col29(k,m);}
  const x=cv.getContext('2d'),T=tf29(cv),sc=Math.min(W/WG.w,H/WG.h),k=hv28.k,s=T[3],sel=C29[S.wsel]||S.wsel;x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,cv.width,cv.height);
  x.setTransform(T[0],0,0,T[0],T[1],T[2]);x.lineJoin='round';x.lineWidth=Math.max(.1,.7/s);x.strokeStyle='#2a2016';
  const vis=g=>{const h=g[3]/2*s+8,px=T[1]/dp29+g[1]*s,py=T[2]/dp29+g[2]*s;return px>-h&&px<W+h&&py>-h&&py<H+h;};
  const ks=Object.keys(WG.c);let so=[];
  for(const q of ks){const g=WG.c[q];if(g[3]<WG.w&&!vis(g))continue;const P=P29[q]||(P29[q]=new Path2D(g[0]));x.fillStyle=cc29[q];x.fill(P);x.stroke(P);if(g[3]<1.6){x.beginPath();x.arc(g[1],g[2],Math.max(.9,2.5/s),0,6.3);x.fill();x.stroke();}if(bs29(q)===sel)so.push(q);}
  x.lineWidth=Math.max(.2,1.6/s);x.strokeStyle='#F2C14E';x.stroke(P29.TUR);x.strokeStyle='#fff';for(const q of so){x.stroke(P29[q]);if(WG.c[q][3]<1.6){x.beginPath();x.arc(WG.c[q][1],WG.c[q][2],1.1,0,6.3);x.stroke();}}
  x.setTransform(dp29,0,0,dp29,0,0);x.font='600 11px Barlow,sans-serif';x.textAlign='center';x.textBaseline='middle';x.lineWidth=3;x.lineJoin='round';x.strokeStyle='rgba(20,14,8,.85)';x.fillStyle='#f6eed9';const R=[];
  for(const q of L29){const g=WG.c[q],u=q==='TUR'?['Türkiye']:UV[q];if(!u)continue;const px=T[1]/dp29+g[1]*s,py=T[2]/dp29+g[2]*s+(g[3]<1.6?9:0);if(px<-40||px>W+40||py<-10||py>H+10)continue;
    const tw=x.measureText(u[0]).width;if(!(g[5]*s>=tw*.85||(g[3]<6&&s>=8&&g[5]*s>=0)))continue;if(g[3]>=6&&g[5]*s<tw*.85)continue;
    const r=[px-tw/2-2,py-7,px+tw/2+2,py+7];if(R.some(o=>r[0]<o[2]&&r[2]>o[0]&&r[1]<o[3]&&r[3]>o[1]))continue;R.push(r);x.strokeText(u[0],px,py);x.fillText(u[0],px,py);}}
function draw29(st){st29=st;if(!raf29)raf29=requestAnimationFrame(paint29);}
function hit29(ev){const cv=ev.target,x=cv.getContext('2d'),T=tf29(cv),s=T[3];x.setTransform(T[0],0,0,T[0],T[1],T[2]);const px=ev.offsetX*dp29,py=ev.offsetY*dp29;let best=null,bd=1e9;
  for(const q of L29){const g=WG.c[q];if(g[3]>=4)continue;const d=Math.hypot(T[1]/dp29+g[1]*s-ev.offsetX,T[2]/dp29+g[2]*s-ev.offsetY);if(d<Math.max(13,g[5]*s/2)&&d<bd){bd=d;best=q;}}
  if(best)return best;const ks=Object.keys(WG.c);
  for(let i=ks.length-1;i>=0;i--){const q=ks[i],P=P29[q]||(P29[q]=new Path2D(WG.c[q][0]));if(x.isPointInPath(P,px,py))return q;}return null;}
document.addEventListener('click',ev=>{if(!ev.target.classList||!ev.target.classList.contains('hmcv'))return;ev.stopImmediatePropagation();ev.preventDefault();const q=hit29(ev);if(!q)return;const b=bs29(q);
  if(b==='TUR'){hw28=false;hp28=false;hv28={x:0,y:0,k:1,i:1};return render();}const id=R29[b]||b;S.wsel=S.wsel===id?null:id;render();},true);
window.addEventListener('resize',()=>{if(st29&&hw28)draw29(st29);});
const leg29=()=>{const m=md29();return FM29.map(x=>`<button class="${m===x[0]?'on':''}" data-wfm="${x[0]}">${x[1]}</button>`).join('')+`<span class="hh">${FM29.find(x=>x[0]===m)[2]} · Türkiye'ye dokun: iller</span>`;};
const fv29=(v,u,d)=>v==null?'—':nf(v,d)+u;
function uvData29(k){const u=UV[k];if(!u)return '';const R=(l,v)=>`<div><i>${l}</i><b>${v}</b></div>`,o=u[15],
  O=[['N','NATO'],['E','AB'],['G','G20'],['7','G7'],['B','BRICS'],['S','ŞİÖ'],['T','Türk Devletleri Teşkilatı'],['t','TDT gözlemcisi'],['U','BM Güvenlik Konseyi daimi üyesi'],['P','OPEC'],['I','İslam İşbirliği Teşkilatı']].filter(x=>o.includes(x[0])).map(x=>x[1]);
  return `<div class="dl" style="margin-top:6px">Ekonomik ve toplumsal veriler</div><div class="uvg">${R('Nüfus',fv29(u[2],' mn',1))}${R('GSYH',u[3]==null?'—':nf(u[3],u[3]<10?1:0)+' mlr $')}${R('Kişi başı',fv29(u[4],' $',0))}${R('Büyüme',fv29(u[5],'%',1))}${R('Enflasyon',fv29(u[6],'%',1))}${R('İşsizlik',fv29(u[7],'%',1))}${R('Borç / GSYH',fv29(u[8],'%',0))}${R('Askerî harcama',fv29(u[12],'% GSYH',1))}${R('Yaşam süresi',fv29(u[9],' yıl',1))}${R('Kentleşme',fv29(u[10],'%',0))}${R('İnternet',fv29(u[13],'%',0))}${R('Okuryazarlık',fv29(u[14],'%',0))}${R('Gini',fv29(u[11],'',1))}</div><div class="note" style="margin:4px 0 0">${UVR[u[1]]?UVR[u[1]]+'. ':''}${O.length?'Üyelikler: '+O.join(', ')+'. ':'Büyük blok üyeliği yok. '}Kaynak: Dünya Bankası, her gösterge için son mevcut yıl${u[17]?' (en yeni '+u[17]+')':''}.</div>`;}
function uvOk29(k,a){const u=UV[k],v=rel29(k),l=(S.uxc||{})[k+a[0]];
  if(l!=null&&S.month-l<a[3])return (a[3]-(S.month-l))+' ay bekle';
  if(a[0]==='yd'){if(S.rez<2)return 'rezerv yetersiz';if(u[4]!=null&&u[4]>15000)return 'gerek yok';}
  if(a[0]==='bc'&&v>=40)return 'ilişki yüksek';if(a[0]==='tc'&&v<35)return 'ilişki 35 altı';return '';}
function uvCard29(k){const u=UV[k],v=rel29(k),[lb,cl]=rl(v);
  return `<div class="lever"><span class="n">${flg29(k)} ${u[0]} <span class="st ${cl}">${lb}</span> <span class="dl muted">· ${nf(v,0)}</span></span><span class="h">${UVR[u[1]]||'Bağımsız olmayan bölge / özel statü'}</span>${gbar(v,cl)}<div style="grid-column:1/-1;margin-top:4px"><div class="dl">Bu ülkeyle yapılabilecekler</div>${UVA29.map(a=>{const w=uvOk29(k,a);return `<button class="dxa" data-uxa="${k}:${a[0]}" ${w?'disabled':''}><span>${a[1]}</span><b>${a[2]}${w?' · '+w:''}</b><i>›</i></button>`;}).join('')}</div></div>`;}
function side29(){const s0=S.wsel,s=R29[s0]||s0,k=C29[s]||s;if(!k||!WG.c[k]||k==='TUR')return '';const c=CT.find(x=>x[0]===s);
  return `<aside class="hrp"><button class="hpx" data-hmr="w">✕</button><div class="panel">${c?dxCard(c,1):uvCard29(k)}${uvData29(k)}</div></aside>`;}
function act29(k,id){const a=UVA29.find(x=>x[0]===id),u=UV[k];if(!a||!u||uvOk29(k,a))return;S.ux=S.ux||{};S.uxc=S.uxc||{};
  const m=su('uv'+k+id),g=Math.max(.35,Math.min(1.3,Math.log10((u[3]||1)+1)/2.2)),v=rel29(k);
  const E={zi:[5,{des:.04}],tc:[3,{cari:-.12*g,buy:.02*g}],yd:[8,{rez:-.5,des:-.03}],sa:[-8,{des:.12}],bc:[-15,{des:.2}]}[id],d=E[0]*m,f={};for(const q in E[1])f[q]=E[1][q]*(id==='yd'&&q==='rez'?1:m);
  S.ux[k]=clamp(v+d,0,100);S.uxc[k+id]=S.month;suU('uv'+k+id);applyFx(f);
  logA('Dış ilişkiler',u[0],`${a[2]}: ilişki ${d>0?'+':'−'}${nf(Math.abs(d),1)}.${fxText(f)?' '+fxText(f):''}`);hap(20,520);save();render();}
document.addEventListener('click',ev=>{const t=ev.target.closest&&ev.target.closest('[data-uxa],[data-wfm]');if(!t||t.disabled)return;ev.stopImmediatePropagation();ev.preventDefault();const d=t.dataset;
  if(d.wfm){S.wfm=d.wfm;return render();}const p=d.uxa.split(':');act29(p[0],p[1]);},true);
{const _y=yeniUp;yeniUp=function(){try{const x=S.ux;if(x)for(const k in x){const b=UV[k]?UV[k][16]:50;x[k]=clamp(x[k]+(b-x[k])*.05,0,100);}}catch(e){}return _y.apply(this,arguments);};}
/* yatay (döndürülmüş) modda dokunmatik kaydırma: ekran ekseni yerel eksene çevrilir */
{let sc=null,t=null,v=0,lt=0;const R=document.documentElement,sca=e=>{for(let n=e;n;n=n.parentElement){const o=getComputedStyle(n).overflowY;if((o==='auto'||o==='scroll')&&n.scrollHeight>n.clientHeight+2)return n;}return null;};
  document.addEventListener('touchstart',e=>{sc=null;if(!R.hasAttribute('data-rot')||e.touches.length!==1||e.target.closest('.hmst'))return;sc=sca(e.target);if(!sc)return;t=[e.touches[0].clientX,e.touches[0].clientY];v=0;lt=Date.now();},{passive:true});
  document.addEventListener('touchmove',e=>{if(!sc||!t)return;const p=e.touches[0],d=R.hasAttribute('data-flip')?p.clientX-t[0]:t[0]-p.clientX;t=[p.clientX,p.clientY];sc.scrollTop-=d;const n=Date.now();v=d/Math.max(1,n-lt)*.6+v*.4;lt=n;e.preventDefault();},{passive:false});
  document.addEventListener('touchend',()=>{const s=sc;sc=null;if(!s||Math.abs(v)<.15||Date.now()-lt>80)return;let w=v*16;const f=()=>{s.scrollTop-=w;w*=.94;if(Math.abs(w)>.5)requestAnimationFrame(f);};f();},{passive:true});}
