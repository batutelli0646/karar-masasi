/* ek14: parti ilişkileri, ittifak zorluğu, bakan değişim cezası, hizip/reform panelleri kaldırıldı, ayrıntılı paylaşım kartı */
function prlE(){if(!S||!S.me||!S.seats)return {};if(!S.rl||S.rlMe!==S.me){S.rl={};S.rlMe=S.me;S.rlm={};PK.forEach(k=>{if(k!==S.me)S.rl[k]=Math.round(cmp(S.me,k)*8+6);});}
  (S.coal||[]).forEach(k=>{if(S.rl[k]===undefined||S.rl[k]<55&&!S.rlI)S.rl[k]=Math.max(S.rl[k]||0,65);});S.rlI=1;return S.rl;}
function prl(k){const r=prlE();return r[k]===undefined?50:r[k];}
function prlAdd(k,d){const r=prlE();if(r[k]===undefined)return;r[k]=clamp(r[k]+d,0,100);}
function prlAsk(p){return 1.4+(55-prl(p))/18;}
function prlDrift(){try{const r=prlE();PK.forEach(k=>{if(k===S.me||r[k]===undefined)return;const base=cmp(S.me,k)*8+6,inC=S.coal.includes(k);
    r[k]=clamp(r[k]+(inC?(S.kol-5)*.25:(base-r[k])*.04),0,100);});
  S.coal.slice().forEach(k=>{if(prl(k)<12){dropP(k);logA('İttifak',PART[k].n+' ittifaktan çekildi','İlişkiler dibe vurdu.');}});}catch(e){}}
{const _y=yeniUp;yeniUp=function(){prlDrift();return _y.apply(this,arguments);};}
{const _a=appoint;appoint=function(i){const k=S.cand&&S.cand.k,h=k&&S.own[k],n0=k&&S.M[k]&&S.M[k].name;const r=_a.apply(this,arguments);
  if(h&&S.M[k]&&S.M[k].name!==n0){prlAdd(h,-14);S.kol=clamp(S.kol-.8,0,10);logA('İttifak',PART[h].n+' tepkili',minName(k)+' Bakanlığındaki ismi değiştirdin; ilişkiler '+nf(prl(h),0)+'/100.');save();render();}return r;};}
function prlP(){const r=prlE(),a=avail();return `<h2>Parti İlişkileri</h2><div class="panel">${PK.filter(k=>k!==S.me).map(k=>{const v=r[k],on=S.coal.includes(k),c=v>=60?'good':v>=35?'warn':'bad',done=S.rlm&&S.rlm[k]===S.month;
  return `<div class="lever"><span class="n">${PART[k].n} · ${nf(v,0)}/100${on?' · ortak':''}</span><span class="h">${S.seats[k]} sandalye · ideolojik uyum ${nf(cmp(S.me,k),1)}/10</span>${gbar(v,c)}<div class="step">${sbtn(`data-rlg="${k}"`,done?'Bu ay görüşüldü':'Görüş (1 puan)',done||a<1||!S.seats[k])}</div></div>`;}).join('')}<div class="note">İttifak teklifi için ilişki en az 30 olmalı; ilişki yükseldikçe ortak daha az bakanlık ister. Ortağın bakanını değiştirmek ilişkiyi düşürür; düzenli görüşme yükseltir.</div></div>`;}
partiP=()=>prlP();
buroX=()=>'';
{const _o=offer;offer=function(){const n=S.neg;if(n&&prl(n.p)<30){n.msg=PART[n.p].n+' ile ilişkilerin yetersiz (en az 30 gerekli). Önce görüşme yap.';return render();}return _o.apply(this,arguments);};}
if(document.addEventListener)document.addEventListener('click',ev=>{const t=ev.target.closest&&ev.target.closest('[data-rlg]');if(!t)return;ev.stopPropagation();ev.preventDefault();
  const k=t.dataset.rlg;if(avail()<1||(S.rlm&&S.rlm[k]===S.month))return;S.cur.spent+=1;S.rlm=S.rlm||{};S.rlm[k]=S.month;prlAdd(k,7);logA('Parti ilişkileri',PART[k].n+' ile görüşme','İlişki '+nf(prl(k),0)+'/100.');hap(20,520);save();render();},true);
/* ---------- Ayrıntılı paylaşım kartı ---------- */
function kdraw(){const d=kdata(),c=document.createElement('canvas');c.width=1080;c.height=1700;const x=c.getContext('2d'),F='system-ui,Segoe UI,Arial,sans-serif',gr=x.createLinearGradient(0,0,0,430);
  gr.addColorStop(0,'#16345A');gr.addColorStop(1,'#0D1419');x.fillStyle='#0D1419';x.fillRect(0,0,1080,1700);x.fillStyle=gr;x.fillRect(0,0,1080,430);
  const T=(t,px,py,f,col,al)=>{x.font=f;x.fillStyle=col;x.textAlign=al||'left';while(x.measureText(t).width>(al==='right'?500:940)&&t.length>6)t=t.slice(0,-2);x.fillText(t,px,py);x.textAlign='left';};
  T('KARAR MASASI',60,90,'600 34px '+F,'#F2A65A');T('DÖNEM NOTU',60,300,'500 30px '+F,'#8C9EA6');T(d.g,60,260,'700 230px '+F,'#E5ECEE');
  T(d.head,360,150,'500 30px '+F,'#E5ECEE');T('Halk desteği %'+nf(S.des,0)+' · Huzur '+nf(S.huz,1)+'/10',360,200,'500 30px '+F,'#B8C4D6');T('Meclis bloğu '+govSeats()+'/600'+(S.coal.length?' · '+S.coal.map(k=>PART[k].n).join(', '):''),360,250,'500 28px '+F,'#B8C4D6');
  const ks=['enf','isz','buy','acik','borc','cari','des','kur'].map(k=>STATS.find(s=>s.k===k)).filter(s=>s&&S.hist[s.k]&&S.hist[s.k].length);
  T('GÖSTERGELER',60,490,'600 28px '+F,'#F2A65A');
  ks.forEach((s,i)=>{const cx=60+(i%2)*500,cy=520+Math.floor(i/2)*128,h=S.hist[s.k],a=h[0],b=S[s.k],col=s.st?(s.st(b)==='good'?'#4CC38A':s.st(b)==='warn'?'#E8B84A':'#EA6660'):'#E5ECEE';
    x.fillStyle='#16222B';x.fillRect(cx,cy,480,112);T(s.l,cx+18,cy+34,'500 26px '+F,'#8C9EA6');T(nf(b,s.d)+' '+s.u,cx+18,cy+84,'700 44px '+F,col);T('başlangıç '+nf(a,s.d),cx+462,cy+34,'500 22px '+F,'#8C9EA6','right');
    if(h.length>2){const mn=Math.min(...h),mx=Math.max(...h)||1,r=(mx-mn)||1;x.strokeStyle=col;x.lineWidth=3;x.beginPath();h.slice(-48).forEach((v,j,L)=>{const px=cx+250+j*(210/Math.max(L.length-1,1)),py=cy+100-(v-mn)/r*40;j?x.lineTo(px,py):x.moveTo(px,py);});x.stroke();}});
  let y=520+Math.ceil(ks.length/2)*128+30;
  const nl=Object.keys(S.laws||{}).filter(k=>S.laws[k]>.01).length,pk=(S.pri||[]).filter(k=>PRI[k]&&PRI[k][2]()).length,pn=(S.pri||[]).length;
  T('SİYASİ BİLANÇO',60,y,'600 28px '+F,'#F2A65A');y+=50;
  [['Çıkarılan yasa',nl],['Tutulan söz',pn?pk+'/'+pn:'—'],['Ortak sayısı',S.coal.length],['Dönem',S.term+'.'],['Kazanılan puan',Math.round(S.sc||0)]].forEach((r,i)=>{const px=60+i*196;x.fillStyle='#16222B';x.fillRect(px,y,184,110);T(String(r[1]),px+92,y+56,'700 44px '+F,'#E5ECEE','center');T(r[0],px+92,y+92,'500 20px '+F,'#8C9EA6','center');});
  y+=150;if(S.coal.length){T('PARTİ İLİŞKİLERİ',60,y,'600 28px '+F,'#F2A65A');y+=40;PK.filter(k=>k!==S.me&&S.seats[k]).slice(0,5).forEach(k=>{const v=prl(k);T(PART[k].n,60,y+22,'500 26px '+F,'#B8C4D6');x.fillStyle='#16222B';x.fillRect(360,y,560,22);x.fillStyle=v>=60?'#4CC38A':v>=35?'#E8B84A':'#EA6660';x.fillRect(360,y,5.6*v,22);T(nf(v,0),960,y+22,'500 24px '+F,'#E5ECEE');y+=42;});y+=14;}
  if(d.best)T('▲ En çok iyileşen: '+d.best,60,y+10,'600 32px '+F,'#4CC38A');if(d.worst)T('▼ En çok kötüleşen: '+d.worst,60,y+62,'600 32px '+F,'#EA6660');
  T('Karar Masası · Türkiye siyaset ve ekonomi simülasyonu',60,1660,'500 22px '+F,'#586A74');return c;}
