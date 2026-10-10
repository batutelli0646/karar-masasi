/* ek29: Stratejik masa dünya haritası — 237 ülke/bölge, bayrak dolgulu sınırlar, ülke verileri (uv1), genel diplomasi eylemleri */
const C29={usa:'USA',ger:'DEU',uk:'GBR',gre:'GRC',rus:'RUS',chn:'CHN',aze:'AZE',irn:'IRN',irq:'IRQ',sau:'SAU',egy:'EGY',qat:'QAT',fra:'FRA',ita:'ITA',uae:'ARE',isr:'ISR',syr:'SYR',jpn:'JPN',kor:'KOR',ind:'IND',pak:'PAK',ukr:'UKR',geo:'GEO',arm:'ARM',kaz:'KAZ',uzb:'UZB',tkm:'TKM',lby:'LBY',som:'SOM',can:'CAN',bra:'BRA',esp:'ESP',nld:'NLD',pol:'POL',swe:'SWE',bgr:'BGR',hun:'HUN',jor:'JOR',kwt:'KWT',idn:'IDN',mys:'MYS',nga:'NGA',kktc:'KKTC'};
const bs29=k=>k.length>4?k.slice(0,3):k;
const R29={};for(const k in C29)R29[C29[k]]=k;
let wc29='',wk29='';
const FM29=[['f','Bayrak','Her ülke kendi bayrağıyla'],['r','İlişki','yeşil: yakın · kırmızı: gergin'],['g','Gelir','kahve: düşük · mavi: yüksek kişi başı gelir'],['e','Enflasyon','yeşil: düşük · kırmızı: yüksek']];
const UVA29=[['zi','🤝','Resmî ziyaret',3],['tc','📦','Ticaret heyeti',4],['yd','🎁','Kalkınma yardımı',6],['sa','📢','Sert açıklama',3],['bc','✉️','Büyükelçiyi çağır',6]];
const rel29=k=>{const i=R29[k];if(i)return S.ul[i];if(k==='TUR')return 100;const u=UV[k];return (S.ux||{})[k]??(u?u[16]:50);};
const mix29=(a,b,t)=>{const h=x=>[1,3,5].map(i=>parseInt(x.substr(i,2),16)),A=h(a),B=h(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');};
const ramp29=(t,cs)=>{t=Math.max(0,Math.min(1,t))*(cs.length-1);const i=Math.min(cs.length-2,Math.floor(t));return mix29(cs[i],cs[i+1],t-i);};
const col29=(k,m)=>{k=bs29(k);const u=UV[k];if(m==='r')return rlC(rel29(k));if(!u)return '#6b6254';
  if(m==='g')return u[4]==null?'#6b6254':ramp29((Math.log10(u[4])-2.7)/2.3,['#a8672f','#d9b86a','#7fb08a','#3f7fa3']);
  return u[6]==null?'#6b6254':ramp29(Math.log(Math.max(1,u[6]+1))/Math.log(60),['#3FA35B','#d9c25a','#c96a36','#9a2a24']);};
function defs29(){if(document.getElementById('wdf29'))return;const d=document.createElement('div');d.id='wdf29';d.setAttribute('aria-hidden','true');d.style.cssText='position:absolute;width:0;height:0;overflow:hidden';
  let s='<svg width="0" height="0">';for(const cc in WFL)s+=`<symbol id="fl-${cc}" viewBox="${WFL[cc][0]}" preserveAspectRatio="none">${WFL[cc][1]}</symbol>`;
  for(const k in WG.c){const g=WG.c[k];if(!WFL[g[4]])continue;const v=WFL[g[4]][0].split(' '),ar=v[2]/v[3],f=x=>x.toFixed(2),st=g[4]==='ru'&&g[5]>100;
    let fw=st?g[5]*1.02:Math.max(g[5],g[6]*ar,g[3]<1.6?2.4:0)*1.02;fw+=.2;const fh=st?g[6]*1.02+.1:fw/ar;
    s+=`<pattern id="pf-${k}" patternUnits="userSpaceOnUse" x="${f(g[1]-fw/2)}" y="${f(g[2]-fh/2)}" width="${f(fw)}" height="${f(fh)}"><use href="#fl-${g[4]}" width="${f(fw)}" height="${f(fh)}"/><rect width="${f(fw)}" height="${f(fh)}" fill="#2b2316" fill-opacity=".3"/></pattern>`;}
  d.innerHTML=s+'</svg>';document.body.appendChild(d);}
const flg29=k=>{const g=WG.c[k];return g&&WFL[g[4]]?`<svg class="flg" width="22" height="15" viewBox="0 0 22 15"><use href="#fl-${g[4]}" width="22" height="15"/></svg>`:'';};
function wsv29(){defs29();const m=S.wfm||'f',key=m+(m==='r'?JSON.stringify(S.ul)+JSON.stringify(S.ux||{}):'');
  if(key!==wk29){wk29=key;let p='',q='';for(const k in WG.c){if(k==='TUR')continue;const g=WG.c[k],b=bs29(k),id=R29[b]||b,f=m==='f'&&WFL[g[4]]?`url(#pf-${k})`:col29(k,m);
      p+=`<path data-wsel="${id}" d="${g[0]}" fill="${f}"/>`;if(g[3]<1.6)q+=`<circle data-wsel="${id}" cx="${g[1]}" cy="${g[2]}" r=".9" fill="${f}"/>`;}
    p+=`<path data-hmtr="1" class="tr" d="${WG.c.TUR[0]}" fill="${m==='f'?'url(#pf-TUR)':col29('TUR',m)}"/>`;wc29=`<g class="lnd">${p}</g><g class="dts">${q}</g>`;}
  const s=S.wsel,k=C29[s]||s,so=k?Object.keys(WG.c).filter(x=>bs29(x)===k&&WG.c[x]):[];
  return `<svg viewBox="0 0 ${WG.w} ${WG.h}" class="hmsv">${wc29}${so.map(x=>{const g=WG.c[x];return `<path class="selo" d="${g[0]}"/>${g[3]<1.6?`<circle class="selo" cx="${g[1]}" cy="${g[2]}" r="1.1"/>`:''}`;}).join('')}</svg>`;}
const leg29=()=>{const m=S.wfm||'f';return FM29.map(x=>`<button class="${m===x[0]?'on':''}" data-wfm="${x[0]}">${x[1]}</button>`).join('')+`<span class="hh">${FM29.find(x=>x[0]===m)[2]} · Türkiye'ye dokun: iller</span>`;};
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
  logA('Dış ilişkiler',u[0],`${a[2]}: ilişki ${d>0?'+':'−'}${nf(Math.abs(d),1)}.${fxText(f)?' '+fxText(f):''}`);hap(20,520);wk29='';save();render();}
document.addEventListener('click',ev=>{const t=ev.target.closest&&ev.target.closest('[data-uxa],[data-wfm]');if(!t||t.disabled)return;ev.stopImmediatePropagation();ev.preventDefault();const d=t.dataset;
  if(d.wfm){S.wfm=d.wfm;wk29='';return render();}const p=d.uxa.split(':');act29(p[0],p[1]);},true);
{const _y=yeniUp;yeniUp=function(){try{const x=S.ux;if(x)for(const k in x){const b=UV[k]?UV[k][16]:50;x[k]=clamp(x[k]+(b-x[k])*.05,0,100);}}catch(e){}return _y.apply(this,arguments);};}
