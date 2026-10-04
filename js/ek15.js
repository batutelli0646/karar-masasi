/* ek15: Anlaşma sekmesi = ülke anlaşmaları + diplomasi; Ülkeler sekmesi yalnız harita, talepler ve temaslar */
const AGN=/anlaşma|ortaklığ|ortak üretim|işbirliği|vize|ticaret heyeti|yatırım forumu|enerji|savunma sanayii|havayolu|thy|sınır kapısı|su ve enerji|gümrük/i;
const KZT=['dışişleri bakanı ziyareti','cumhurbaşkanı resmî ziyareti'];
const uRows=(c,want)=>{const L=UHO.map((x,i)=>[x,i]).filter(([x])=>x[4](c)&&(want?AGN.test(x[0]):!AGN.test(x[0]))),m=su('u'+c[0]);
  return L.map(([x,i])=>{const f=Object.fromEntries(Object.entries(x[3]).filter(([k])=>k!=='reg')),ft=fxText(f);return opRow(x[0],`${x[1]} İlişki ${x[2]>0?'+':''}${x[2]}${ft?' · '+ft:''}${x[3].reg?' · '+RN[c[2]]+' itibarı +'+nf(x[3].reg,2):''}.`,sbtn(`data-uh="${c[0]}:${i}"`,want?'Yürüt':'Uygula'));}).join('')+`<div class="note">${sat(m)||'Aynı ülkeyle arka arkaya temasın etkisi azalır.'}</div>`;};
function ulList(c){return `<div style="grid-column:1/-1;margin-top:4px">${uRows(c,false)}</div>`;}
const dRow=e=>{const dn=isDone(e),q=DQ[e[0]],l=(S.xr||{})['dl_'+e[0]],ft=fxText(e[3]);
  return `<div style="padding:7px 0;border-top:1px solid var(--line)"><div class="dl"><b>${e[1]}</b> ${dn?'<span class="st good">Yürürlükte</span>':''}<div class="note" style="margin:2px 0 4px">${e[4]}${q?' Şart: '+q.map(c=>(CT.find(x=>x[0]===c)||[0,c])[1]+' ilişkisi '+nf(S.ul[c],0)+'/50').join(', ')+'.':''}${dn?'':' Etki: '+(ft||'doğrudan etki yok')+'.'}</div></div>${dn?'':`<div class="chips" style="margin:0">${sbtn(`data-dsg="${e[0]}"`,'İmzala',e[2]>avail())}</div>`}${l?`<div class="note">Son sonuç (${dateLabel(l.m)}): ${l.t}</div>`:''}</div>`;};
function disYeni(){const c=CT.find(x=>x[0]===S.dpc)||CT[0],mine=DEALS.filter(e=>DQ[e[0]]&&DQ[e[0]].includes(c[0])),gen=DEALS.filter(e=>!DQ[e[0]]);
  const dp=dipP().replace('<h2>Diplomasi</h2>','<h2>Anlaşma ve diplomasi</h2>'),i=dp.indexOf('<div class="panel"><b>İstihbarat merkezi'),a=i<0?dp:dp.slice(0,i),b=i<0?'':dp.slice(i);
  return a+`<div class="panel"><b>${c[1]} · anlaşmalar ve ortaklıklar</b>${uRows(c,true)}${mine.map(dRow).join('')}</div>`+dipX()+(gen.length?`<details class="panel"><summary><b>Genel anlaşmalar (${gen.length})</b></summary>${gen.map(dRow).join('')}</details>`:'')+b;}
V.dis=disYeni;V.ulke=()=>wmP()+ulke();
/* Devlet grubunda yalnız Kurum ve Ordu kaldı; eski kayıtlarda gizlenen sekmede kalanları ana sekmeye al */
{const _r=render;render=function(){try{if(S&&S.tab&&!GR.some(g=>g[2].includes(S.tab))){S.tab={sinif:'nufus',politika:'hizmet'}[S.tab]||'masa';}}catch(e){}return _r.apply(this,arguments);};}
