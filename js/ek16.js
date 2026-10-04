/* ek16: Dış İlişkiler sekmesi — harita, dünya durumu, anlaşmalarım, diplomat kolordusu, istihbarat, talepler, ülke kartları */
const DXB=[['all','Tümü'],['bat','Batı'],['dog','Doğu'],['bol','Bölge']],DXS=[['ilis','İlişki'],['isim','İsim'],['guc','Güç']];
const dxN=id=>(CT.find(c=>c[0]===id)||[0,id])[1];
const dxSec=(t,sub,body,open)=>`<details class="panel" ${open?'open':''}><summary style="cursor:pointer"><b>${t}</b>${sub?` <span class="muted dl">· ${sub}</span>`:''}</summary><div style="margin-top:6px">${body}</div></details>`;
function dxWorld(){const n={Müttefik:0,Dost:0,Normal:0,Gergin:0,Düşman:0};CT.forEach(c=>n[rl(S.ul[c[0]])[0]]++);
  const so=CT.slice().sort((a,b)=>S.ul[b[0]]-S.ul[a[0]]),bar=r=>`<div class="dl" style="display:flex;justify-content:space-between"><span>${RN[r]} itibarı</span><span>${nf(S[r],1)}/10</span></div>${gbar(S[r]*10,S[r]>=6?'good':S[r]>=4?'warn':'bad')}`;
  return dxSec('Dünya durumu','blok itibarı ve ilişki dağılımı',['bat','dog','bol'].map(bar).join('')+`<div class="chips" style="margin:6px 0">${Object.entries(n).map(([k,v])=>`<span class="st ${k==='Müttefik'||k==='Dost'?'good':k==='Normal'?'warn':'bad'}">${k} ${v}</span>`).join('')}</div><div class="dl"><b>En yakın:</b> ${so.slice(0,3).map(c=>c[1]+' '+nf(S.ul[c[0]],0)).join(', ')}</div><div class="dl"><b>En gergin:</b> ${so.slice(-3).reverse().map(c=>c[1]+' '+nf(S.ul[c[0]],0)).join(', ')}</div>`,1);}
function dxDeals(){const dn=DEALS.filter(isDone),bl=CT.filter(c=>S.dl[c[0]]);
  return dxSec('Anlaşmalarım',`${dn.length+bl.length} anlaşma`,(dn.length?dn.map(e=>`<div class="dl">✓ ${e[1]}</div>`).join(''):'<div class="dl muted">Yürürlükte çok taraflı anlaşma yok.</div>')+(bl.length?`<div class="dl" style="margin-top:6px"><b>İkili anlaşma:</b> ${bl.map(c=>c[1]).join(', ')}</div>`:''));}
function dxDip(){const n=dpN(),m=dpMax(),on=CT.filter(c=>(S.dp.m[c[0]]||0)>0);
  return `<div class="panel"><b>Diplomat kolordusu</b> <span class="muted dl">· ${n}/${m} diplomat</span><div class="note" style="margin:4px 0">Diplomatlar atandıkları ülkeyle ilişkiyi ay ay iyileştirir. Diplomat atamasını ülkenin Özel kurallar penceresinden yap; her diplomat bütçeye küçük yük bindirir.</div>${gbar(n/m*100,n>=m?'warn':'good')}${on.length?on.map(c=>`<div class="dl">${c[1]} · ${DM[S.dp.m[c[0]]][0]}</div>`).join(''):'<div class="dl muted">Atanmış diplomat yok.</div>'}</div>`;}
const DXC=[['tem','Temas'],['anl','Anlaşma'],['dip','Diplomasi'],['tar','Tarife']];
const dxCh=(a,arr,cur)=>`<div class="chips" style="margin:3px 0">${arr.map(([k,n])=>`<button class="btn sm ${cur===k?'':'sec'}" ${a}="${k}">${n}</button>`).join('')}</div>`;
function dxCard(c,full){const id=c[0],v=S.ul[id],[lb,k]=rl(v),op=full||S.usel===id,dm=S.dp.m[id]||0,o=okc(id),fav=(S.fav||{})[id],t=S.dxc||'tem';
  let b='';if(op){const mine=DEALS.filter(e=>DQ[e[0]]&&DQ[e[0]].includes(id));let w='';
    if(t==='tem')w=uRows(c,false)+`<div class="step" style="margin-top:6px">${sbtn(`data-us="${id}"`,'Sert açıklama')}</div>`;
    else if(t==='anl')w=uRows(c,true)+mine.map(dRow).join('')+(S.dl[id]||v<60?'':`<div class="step" style="margin-top:6px">${sbtn(`data-ud="${id}"`,'İkili anlaşma',avail()<2)}</div>`);
    else if(t==='dip')w=opRow2('Diplomat','Ekonomik mod ilişkiyi, askerî mod ordu ilişkisini de artırır.',DM.map((m,i)=>dpBtn('data-dpm',id+':'+i,m[0],dm===i)).join(''))+opRow2('Transit rotası','Kapalı rota ilişkiyi bozar; öncelikli rota ticareti artırır.',TR.map((m,i)=>dpBtn('data-dok',id+':tr:'+i,m[0],o.tr===i)).join(''))+opRow2('Göçmen anlaşması','İlişki +, huzur −, bütçe +.',GA.map((m,i)=>dpBtn('data-dok',id+':ga:'+i,m[0],o.ga===i)).join(''))+opRow2('Büyükelçilik','Ağırlıklı büyükelçi ilişkiyi güçlendirir.',DBE.map((x,i)=>`<button class="btn sm ${(o.be===undefined?1:o.be)===i?'':'sec'}" data-dbe="${id}:be:${i}">${x[0]}</button>`).join(''))+opRow2('Vize rejimi','Vizesiz geçiş turizmi ve ilişkiyi artırır.',DVZ.map((x,i)=>`<button class="btn sm ${(o.vz===undefined?1:o.vz)===i?'':'sec'}" data-dbe="${id}:vz:${i}">${x[0]}</button>`).join(''));
    else w=xrow('dtf')+xrow('dul');
    b=`<div style="grid-column:1/-1;margin-top:4px"><div class="dl">${c[5]}${tvol(c[4])?' · '+tvol(c[4]):''}</div>${dxCh('data-dxc',DXC,t)}${w}</div>`;}
  return `<div class="lever"><span class="n"><button class="btn sm sec" style="min-width:0;padding:0 7px" data-dxf="${id}">${fav?'★':'☆'}</button> ${c[1]} <span class="st ${k}">${lb}</span> <span class="dl muted">· ${nf(v,0)}${dm?' · diplomat':''}${S.dl[id]?' · ikili':''}</span></span>${op?'':`<span class="h">${c[5]}</span>`}<div class="step">${full?'':sbtn(`data-dxo="${id}"`,op?'Kapat':'Aç')}</div>${gbar(v,k)}${b}</div>`;}
function dxList(){const s=S.dxs||'ilis',bk=S.dxb||'all',fv=S.fav||{},n=S.dxn||10;
  let L=CT.filter(c=>bk==='all'||c[2]===bk);L.sort((a,b)=>(fv[b[0]]?1:0)-(fv[a[0]]?1:0)||(s==='isim'?a[1].localeCompare(b[1],'tr'):s==='guc'?(CG[b[0]]??30)-(CG[a[0]]??30):S.ul[b[0]]-S.ul[a[0]]));
  return `<div class="panel"><div style="display:flex;gap:10px;flex-wrap:wrap">${dxCh('data-dxs',DXS,s)}${dxCh('data-dxb',DXB,bk)}</div>${L.slice(0,n).map(c=>dxCard(c)).join('')}${L.length>n?`<div class="step" style="margin-top:8px">${sbtn('data-dxm="1"','Daha fazla göster ('+(L.length-n)+')')}</div>`:''}<div class="note">★ favori ülkeyi üste alır. Ülke kartında temas, anlaşma, diplomasi ve tarife ayrı sekmelerdedir.</div></div>`;}
const DXT=[['ozet','Harita'],['ulke','Ülkeler'],['dip','Diplomasi'],['anl','Anlaşmalar'],['talep','Talepler']];
function dxP(){if(S.usel)S.dpc=S.usel;const t=S.dxt||'ozet',nt=(S.ta||[]).length,sel=S.usel&&CT.find(c=>c[0]===S.usel);let h;
  if(t==='ulke')h=dxList();
  else if(t==='dip'){const dp=dipP(),i=dp.indexOf('<div class="panel"><b>İstihbarat merkezi'),dx=dipX().split('<div class="panel"><b>Küresel');h=dxDip()+(i<0?'':dp.slice(i))+(dx[1]?'<div class="panel"><b>Küresel'+dx[1]:'');}
  else if(t==='anl'){const gen=DEALS.filter(e=>!DQ[e[0]]);h=dxDeals()+(gen.length?dxSec('Genel anlaşmalar',gen.length+' anlaşma',gen.map(dRow).join('')):'');}
  else if(t==='talep')h=ulke().split('<h2>Ülke ilişkileri</h2>')[0];
  else{const u0=S.usel;S.usel=null;const mp=wmP();S.usel=u0;h=mp+(sel?dxCard(sel,1).replace('<div class="lever">','<div class="panel"><div class="lever">')+'</div>':'')+dxWorld();}
  return `<div class="subtabs" style="margin:6px 0">${DXT.map(([k,n])=>`<button class="bn2" aria-selected="${k===t}" data-dxt="${k}">${n}${k==='talep'&&nt?' ('+nt+')':''}</button>`).join('')}</div>${h}`;}
V.dis=dxP;SUBN.dis='Dış ilişkiler';
{const g=GR.find(x=>x[0]==='dev');if(g&&!g[2].includes('dis'))g[2].splice(1,0,'dis');if(g&&!g[2].includes('orgut'))g[2].splice(2,0,'orgut');}
if(document.addEventListener)document.addEventListener('click',ev=>{const t=ev.target.closest&&ev.target.closest('[data-dxs],[data-dxb],[data-dxo],[data-dxf],[data-dxt],[data-dxc],[data-dxm]');if(!t)return;ev.stopPropagation();const d=t.dataset;
  if(d.dxs)S.dxs=d.dxs;if(d.dxb){S.dxb=d.dxb;S.dxn=10;}if(d.dxt)S.dxt=d.dxt;if(d.dxc)S.dxc=d.dxc;if(d.dxm)S.dxn=(S.dxn||10)+15;if(d.dxo){S.usel=S.usel===d.dxo?null:d.dxo;if(S.usel){S.dpc=S.usel;S.wsel=S.usel;}}if(d.dxf){S.fav=S.fav||{};S.fav[d.dxf]=S.fav[d.dxf]?0:1;}save();render();},true);
/* aynı adlı temasları tekilleştir */
{const sn={};for(let i=0;i<UHO.length;i++){const k=UHO[i][0].toLocaleLowerCase('tr');if(sn[k]){UHO.splice(i,1);i--;}else sn[k]=1;}}
