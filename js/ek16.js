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
  return `<div class="panel"><b>Diplomat kolordusu</b> <span class="muted dl">· ${n}/${m} diplomat</span><div class="note" style="margin:4px 0">Diplomatlar atandıkları ülkeyle ilişkiyi ay ay iyileştirir. Mod ve atama, ülke kartından yapılır; her diplomat bütçeye küçük yük bindirir.</div>${gbar(n/m*100,n>=m?'warn':'good')}${on.length?on.map(c=>`<div class="dl">${c[1]} · ${DM[S.dp.m[c[0]]][0]}</div>`).join(''):'<div class="dl muted">Atanmış diplomat yok.</div>'}</div>`;}
function dxCard(c){const id=c[0],v=S.ul[id],[lb,k]=rl(v),op=S.usel===id,dm=S.dp.m[id]||0,o=okc(id),fav=(S.fav||{})[id];
  let b='';if(op){const mine=DEALS.filter(e=>DQ[e[0]]&&DQ[e[0]].includes(id));
    b=`<div style="grid-column:1/-1;margin-top:4px"><div class="dl">${c[5]}${tvol(c[4])?' · '+tvol(c[4]):''}</div>
    ${opRow2('Diplomat','Ekonomik mod ilişkiyi, askerî mod ordu ilişkisini de artırır.',DM.map((m,i)=>dpBtn('data-dpm',id+':'+i,m[0],dm===i)).join(''))}
    ${opRow2('Transit rotası','Kapalı rota ilişkiyi bozar; öncelikli rota ticareti artırır.',TR.map((m,i)=>dpBtn('data-dok',id+':tr:'+i,m[0],o.tr===i)).join(''))}
    ${opRow2('Göçmen anlaşması','Geri kabul ve sınır işbirliği: ilişki +, huzur −, bütçe +.',GA.map((m,i)=>dpBtn('data-dok',id+':ga:'+i,m[0],o.ga===i)).join(''))}
    ${opRow2('Büyükelçilik düzeyi','Ağırlıklı büyükelçi ilişkiyi her ay güçlendirir; maslahatgüzar soğukluk mesajıdır.',DBE.map((x,i)=>`<button class="btn sm ${(o.be===undefined?1:o.be)===i?'':'sec'}" data-dbe="${id}:be:${i}">${x[0]}</button>`).join(''))}
    ${opRow2('Vize rejimi','Vizesiz geçiş turizmi ve ilişkiyi artırır, güvenlik denetimini zorlaştırır.',DVZ.map((x,i)=>`<button class="btn sm ${(o.vz===undefined?1:o.vz)===i?'':'sec'}" data-dbe="${id}:vz:${i}">${x[0]}</button>`).join(''))}
    <div class="dl" style="margin-top:8px"><b>Temaslar</b></div>${uRows(c,false)}
    <div class="dl" style="margin-top:8px"><b>Anlaşmalar ve ortaklıklar</b></div>${uRows(c,true)}${mine.map(dRow).join('')}
    <div class="dl" style="margin-top:8px"><b>Tarife ve ültimatom</b></div>${xrow('dtf')}${xrow('dul')}
    <div class="step" style="margin-top:8px">${sbtn(`data-us="${id}"`,'Sert açıklama')}${S.dl[id]||v<60?'':sbtn(`data-ud="${id}"`,'İkili anlaşma',avail()<2)}</div></div>`;}
  return `<div class="lever"><span class="n"><button class="btn sm sec" style="min-width:0;padding:0 7px" data-dxf="${id}">${fav?'★':'☆'}</button> ${c[1]} <span class="st ${k}">${lb}</span> <span class="dl muted">· ${nf(v,0)} · ${RN[c[2]]}${dm?' · diplomat':''}${S.dl[id]?' · ikili anlaşma':''}</span></span><span class="h">${op?'':c[5]}</span><div class="step">${sbtn(`data-dxo="${id}"`,op?'Kapat':'Aç')}</div>${gbar(v,k)}${b}</div>`;}
function dxP(){if(S.usel)S.dpc=S.usel;const s=S.dxs||'ilis',bk=S.dxb||'all',fv=S.fav||{};
  let L=CT.filter(c=>bk==='all'||c[2]===bk);L.sort((a,b)=>(fv[b[0]]?1:0)-(fv[a[0]]?1:0)||(s==='isim'?a[1].localeCompare(b[1],'tr'):s==='guc'?(CG[b[0]]??30)-(CG[a[0]]??30):S.ul[b[0]]-S.ul[a[0]]));
  const dp=dipP(),i=dp.indexOf('<div class="panel"><b>İstihbarat merkezi'),ul=ulke().split('<h2>Ülke ilişkileri</h2>')[0],dx=dipX().split('<div class="panel"><b>Küresel'),gen=DEALS.filter(e=>!DQ[e[0]]);
  const ch=(a,arr,cur)=>`<div class="chips" style="margin:2px 0">${arr.map(([k,n])=>`<button class="btn sm ${cur===k?'':'sec'}" ${a}="${k}">${n}</button>`).join('')}</div>`;
  return `${wmP()}${dxWorld()}${dxDeals()}${dxDip()}${i<0?'':dp.slice(i)}${ul}<h2>Ülke ilişkileri</h2><div class="panel"><div class="dl">Sırala</div>${ch('data-dxs',DXS,s)}<div class="dl">Bölge</div>${ch('data-dxb',DXB,bk)}<div class="note">★ ile favori ülkeler üstte durur. Ülkenin kartını açınca diplomat, temas, anlaşma, vize ve tarife seçenekleri çıkar.</div>${L.map(dxCard).join('')}</div>${dx[1]?'<div class="panel"><b>Küresel'+dx[1]:''}${gen.length?dxSec('Genel anlaşmalar',gen.length+' anlaşma',gen.map(dRow).join('')):''}`;}
V.dis=dxP;SUBN.dis='Dış ilişkiler';
{const g=GR.find(x=>x[0]==='dev');if(g&&!g[2].includes('dis'))g[2].splice(1,0,'dis');}
if(document.addEventListener)document.addEventListener('click',ev=>{const t=ev.target.closest&&ev.target.closest('[data-dxs],[data-dxb],[data-dxo],[data-dxf]');if(!t)return;ev.stopPropagation();const d=t.dataset;
  if(d.dxs)S.dxs=d.dxs;if(d.dxb)S.dxb=d.dxb;if(d.dxo){S.usel=S.usel===d.dxo?null:d.dxo;if(S.usel){S.dpc=S.usel;S.wsel=S.usel;}}if(d.dxf){S.fav=S.fav||{};S.fav[d.dxf]=S.fav[d.dxf]?0:1;}save();render();},true);
/* aynı adlı temasları tekilleştir */
{const sn={};for(let i=0;i<UHO.length;i++){const k=UHO[i][0].toLocaleLowerCase('tr');if(sn[k]){UHO.splice(i,1);i--;}else sn[k]=1;}}
