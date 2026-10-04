/* ek17: Dış İlişkiler — ülke eylem menüsü (alt pencereler), anlaşma paketleri, ikili kredi, silah satışı, askerî destek, siyasi polemik, gelen anlaşma önerileri */
const PKT=[['sav','Savunma Paktı','Saldırıya uğrarsan savaşa katılırsın; ordu ve güvenlik güçlenir.',70,45,.35,{ord:.01}],['sinir','Serbest Sınır Anlaşması','Vizesiz geçiş: turizm ve ilişki artar, güvenlik denetimi zayıflar.',60,35,.3,{des:.01,huz:-.004}],['tic','Serbest Ticaret Anlaşması','Gümrük duvarları kalkar: ihracat artar, yerli üretici baskı görür.',55,35,.2,{cari:-.01,buy:.004}],['dos','Dostluk Anlaşması','Siyasi yakınlık; ilişki her ay biraz daha artar.',45,25,.25,{des:.004}],['yat','Yatırım Hakkı Anlaşması','Karşılıklı yatırım hakkı: döviz girişi ve fabrika yatırımı.',50,35,.2,{rez:.05,buy:.003}],['ask','Askerî Birlik Anlaşması','Ortak komuta ve üs kullanımı: ordu güçlenir, Batı itibarı düşebilir.',80,55,.55,{ord:.03,bat:-.01}]];
const DXA=[['tem','🤝','Heyet ve temaslar'],['yat','🏭','Yatırım ve ticaret'],['pk','📜','Anlaşma paketleri'],['kr','💳','Kredi anlaşması'],['ok','⚙️','Özel kurallar'],['ul','⚠️','Ültimatom']];
Object.defineProperty(LOAN,'ikili',{value:['İkili devlet kredisi',9,5,{},'',0],enumerable:false});
const pk=id=>{S.pk=S.pk||{};return S.pk[id]||(S.pk[id]={});};
const pkN=id=>Object.keys((S.pk||{})[id]||{}).filter(k=>PKT.some(p=>p[0]===k)).length;
function pkSign(id,k){const p=PKT.find(x=>x[0]===k),c=CT.find(x=>x[0]===id);if(!p||!c||pk(id)[k])return;if(!pkOk(id,k)||S.ul[id]<p[3]||avail()<1)return;S.cur.spent+=1;pk(id)[k]=S.month+1;if(k==='tic')S.dl[id]=1;S.ul[id]=clamp(S.ul[id]+3,0,100);logA('Dış ilişkiler',c[1],p[1]+' imzalandı.');hap(20,520);}
function pkBreak(id,k){const p=PKT.find(x=>x[0]===k);if(!pk(id)[k])return;delete pk(id)[k];S.ul[id]=clamp(S.ul[id]-6,0,100);logA('Dış ilişkiler',dxN(id),p[1]+' feshedildi.');}
function dxMonth(){try{S.pr=S.pr||[];Object.keys(S.pk||{}).forEach(id=>{Object.keys(S.pk[id]).forEach(k=>{const p=PKT.find(x=>x[0]===k);const kk=clamp((CG[id]??45)/60,.35,1.4);S.ul[id]=clamp(S.ul[id]+p[5],0,100);applyFx(Object.fromEntries(Object.entries(p[6]).map(([a,b])=>[a,b*kk])));if(S.ul[id]<p[4]){delete S.pk[id][k];logA('Dış ilişkiler',dxN(id),p[1]+' ilişkiler bozulduğu için sona erdi.');}});});
  S.pr.forEach(x=>x.left--);S.pr=S.pr.filter(x=>x.left>0);
  if(S.month%2===0&&S.pr.length<4){const c=CT.filter(c=>PKT.some(p=>pkOk(c[0],p[0])&&S.ul[c[0]]>=p[3]-5&&!pk(c[0])[p[0]])&&!S.pr.some(x=>x.c===c[0]));if(c.length){const k=c[Math.floor(Math.random()*c.length)],ps=PKT.filter(p=>pkOk(k[0],p[0])&&S.ul[k[0]]>=p[3]-5&&!pk(k[0])[p[0]]),p=ps[Math.floor(Math.random()*ps.length)];S.pr.push({c:k[0],k:p[0],left:5});}}}catch(e){}}
{const _y=yeniUp;yeniUp=function(){dxMonth();return _y.apply(this,arguments);};}
const dxKp=(id,a,r)=>clamp(.25+S.ul[id]/130-a/60+(r-8)/25,.03,.97);
function dxCard(c,full){const id=c[0],v=S.ul[id],[lb,k]=rl(v),op=full||S.usel===id,dm=S.dp.m[id]||0,fav=(S.fav||{})[id];
  const rows=op?`<div style="grid-column:1/-1;margin-top:4px"><div class="dl">${c[5]}${tvol(c[4])?' · '+tvol(c[4]):''}</div>${DXA.map(([a,ic,n])=>`<button class="dxa" data-dxa="${id}:${a}"><span>${ic}</span><b>${n}${a==='pk'&&pkN(id)?' · '+pkN(id)+' imzalı':''}</b><i>›</i></button>`).join('')}</div>`:'';
  return `<div class="lever"><span class="n"><button class="btn sm sec" style="min-width:0;padding:0 7px" data-dxf="${id}">${fav?'★':'☆'}</button> ${c[1]} <span class="st ${k}">${lb}</span> <span class="dl muted">· ${nf(v,0)}${dm?' · diplomat':''}${pkN(id)?' · '+pkN(id)+' anlaşma':''}</span></span>${op?'':`<span class="h">${c[5]}</span>`}<div class="step">${full?'':sbtn(`data-dxo="${id}"`,op?'Kapat':'Aç')}</div>${gbar(v,k)}${rows}</div>`;}
{const _p=dxP;dxP=function(){let h=_p();const n=(S.ta||[]).length+(S.pr||[]).length;
  if(S.dxt==='talep')h=h.replace('</div>','</div>'+(S.pr||[]).map((x,i)=>{const p=PKT.find(q=>q[0]===x.k);return `<div class="panel"><div class="dl"><b>${dxN(x.c)}</b>, ${p[1]} öneriyor. <span class="muted">${x.left} ay kaldı</span></div><div class="note">${p[2]}</div><div class="step">${sbtn(`data-dxr="${i}:1"`,'Kabul et',S.ul[x.c]<p[3]-10)}${sbtn(`data-dxr="${i}:0"`,'Reddet')}</div></div>`;}).join(''));
  if(n)h=h.replace(/(data-dxt="talep">Talepler)( \(\d+\))?/,`$1 (${n})`);return h+dxSheet();};}
V.dis=dxP;
if(document.addEventListener)document.addEventListener('click',ev=>{const t=ev.target.closest&&ev.target.closest('[data-dxa],[data-dxx],[data-dxp],[data-dxk],[data-dxg],[data-dxr]');if(!t)return;const d=t.dataset;
  if(d.dxx&&t.classList.contains('dxs')&&ev.target!==t)return;ev.stopPropagation();ev.preventDefault();
  if(d.dxa)S.dxm=d.dxa;else if(d.dxx)S.dxm=null;
  else if(d.dxp){const [id,k,on]=d.dxp.split(':');on==='1'?pkSign(id,k):pkBreak(id,k);}
  else if(d.dxk)dxKredi(d.dxk);
  else if(d.dxr){const [i,ok]=d.dxr.split(':'),x=S.pr[+i];if(x){S.pr.splice(+i,1);if(ok==='1'){const p=PKT.find(q=>q[0]===x.k);pk(x.c)[x.k]=S.month+1;if(x.k==='tic')S.dl[x.c]=1;S.ul[x.c]=clamp(S.ul[x.c]+3,0,100);logA('Gelen öneri',dxN(x.c),p[1]+' kabul edildi.');}else S.ul[x.c]=clamp(S.ul[x.c]-1,0,100);}}
  save();render();},true);
