/* ek36: hedefler ve zafer yolu, "son ay neden değişti" dökümü, küresel güç sıralaması, seçim takvimi bildirimleri, yasa arşivi */
const E36S=[29.7,68,29.7,85,36,18],E36T=[15,30,20,30,15,8];
function goals36(){const sc=S.sc||0,e0=E36S[sc],et=E36T[sc],g=(sc===1||sc===3)?[2,10]:[3,9],p=S.prev||{};
  return [{t:`Enflasyonu %${et} altına indir`,n:`şimdi %${nf(S.enf,1)}`,p:clamp((e0-S.enf)/(e0-et),0,1),ok:S.enf<=et},
  {t:`Büyüme %${g[0]} üstü, işsizlik %${g[1]} altı`,n:`büyüme %${nf(S.buy,1)} · işsizlik %${nf(S.isz,1)}`,p:Math.min(clamp((S.buy+1)/(g[0]+1),0,1),clamp((16-S.isz)/(16-g[1]),0,1)),ok:S.buy>=g[0]&&S.isz<=g[1]},
  {t:'Genel seçimi kazan ve destek %50 üstünde kal',n:`${S.term}. dönem · destek %${nf(S.des,0)}`,p:S.term>1?clamp(S.des/50,0,1):Math.min(.9,S.des/50*.6),ok:S.term>1&&S.des>=50}];}
const nextLoc36=()=>S.month<29?29:29+Math.ceil((S.month-29)/TERM)*TERM;
function calP36(){const g=S.month<(S.nel??EO)?(S.nel??EO):null,l=nextLoc36();return `<div class="note" style="margin:6px 0 0">Seçim takvimi: ${g!=null?`genel seçim ${dateLabel(g)} (${g-S.month} ay)`:'genel seçim bu dönem yapıldı'} · yerel seçim ${dateLabel(l)} (${l-S.month} ay).</div>`;}
function hedefP36(){const G=goals36(),all=Math.round(G.reduce((a,x)=>a+x.p,0)/G.length*100);
  return `<div class="panel"><b>Hedefler</b> <span class="muted dl">genel ilerleme %${all}</span>${G.map(x=>`<div class="dl" style="margin-top:6px">${x.ok?'✓ ':''}${x.t} <span class="muted">· ${x.n}</span></div>${gbar(x.p*100,x.ok?'ok':'')}`).join('')}${calP36()}${S.zf&&!S.zfD?`<div class="report" style="margin-top:8px"><b>Hedeflerin üçü de tamamlandı.</b> İstersen zaferi ilan edip oyunu bitirebilir ya da oynamaya devam edebilirsin.<div class="step" style="margin-top:6px"><button class="btn sm" data-zf="1">Zaferi ilan et</button><button class="btn sm sec" data-zf="0">Devam et</button></div></div>`:''}</div>`;}
function neden36(){const p=S.prev;if(!p||p.des==null)return '';const L=(t,rows,d)=>{const r=d-rows.reduce((a,x)=>a+x[1],0);return `<div class="dl" style="margin-top:6px"><b>${t}</b> ${d>=0?'+':'−'}${nf(Math.abs(d),2)}</div>`+[...rows,['Kararlar, olaylar ve rastgelelik',r]].filter(x=>Math.abs(x[1])>=.02).map(x=>`<div class="dl muted">${x[1]>=0?'+':'−'}${nf(Math.abs(x[1]),2)} · ${x[0]}</div>`).join('');};
  const dd=S.des-p.des,de=S.enf-p.enf,rr=S.rr==null?S.lv.faiz-p.enf:S.rr,dep=p.kur?(S.kur/p.kur-1)*100:0;
  return `<div class="panel"><b>Son ayda ne değişti?</b>${L('Halk desteği',[['Enflasyon',-.06*Math.max(S.enf-E0,-25)],['Büyüme',.35*(S.buy-2.5)],['İşsizlik',-.25*(S.isz-9.2)],['Toplumsal huzur',.1*(S.huz-5)],['Doğal geri dönüş',-.15+(41-p.des)*.02]],dd)}${L('Enflasyon',[['Reel faiz',rr-3>0?-.09*(rr-3)*p.enf/(p.enf+12):-.09*(rr-3)],['Kur artışı',(dep>1.6?.5:.25)*(dep-1.6)],['Bütçe açığı',.15*(S.acik-3.6)]],de)}<div class="note" style="margin:4px 0 0">Dökümdeki kalemler model formüllerinden tahmin edilir; kalan kısım kararlarından ve olaylardan gelir.</div></div>`;}
{const _m=V.masa;V.masa=()=>hedefP36()+neden36()+_m();}
/* küresel güç sıralaması */
const RK36=[['Ekonomik','GSYH (mlr $)',u=>u[3]],['Askerî','Askerî harcama (mlr $)',u=>u[3]!=null&&u[12]!=null?u[3]*u[12]/100:null],['Refah','Kişi başı gelir ($)',u=>u[4]]];
function rank36(){const t=S.rk36||0,R=RK36[t],me=UV.TUR,f=R[2],live=t===0?S.gdp:t===1?f(me)*((S.bud&&MB&&MB.sav)?S.bud.sav/MB.sav:1):S.gdp*1000/me[2];
  const rows=Object.keys(UV).filter(k=>k!=='TUR').map(k=>[UV[k][0],f(UV[k])]).filter(x=>x[1]!=null&&x[1]>0);rows.push(['SEN · Türkiye',live]);rows.sort((a,b)=>b[1]-a[1]);
  const i=rows.findIndex(x=>x[0].startsWith('SEN')),top=rows.slice(0,12);if(i>=12)top.push(rows[i]);const mx=rows[0][1];
  return `<div class="panel"><b>Küresel güç sıralaması</b> <span class="muted dl">${rows.length} ülke · sen ${i+1}. sıradasın</span><div class="chips" style="margin:6px 0">${RK36.map((r,n)=>`<button class="btn sm ${n===t?'':'sec'}" data-rk="${n}">${r[0]}</button>`).join('')}</div><div class="dl muted">${R[1]}</div>${top.map(x=>`<div class="dl" style="margin-top:4px;${x[0].startsWith('SEN')?'font-weight:700':''}">${rows.indexOf(x)+1}. ${x[0]} · ${nf(x[1],x[1]<100?1:0)}</div>${gbar(x[1]/mx*100,x[0].startsWith('SEN')?'ok':'')}`).join('')}</div>`;}
{const _i=V.istat;V.istat=()=>rank36()+_i();}
/* yasa arşivi */
function arsiv36(){const L=LAWS.filter(l=>S.laws[l[0]]&&S.laws[l[0]]>.01).sort((a,b)=>S.laws[b[0]]-S.laws[a[0]]);
  return `<div class="panel"><b>Yasa arşivi</b> <span class="muted dl">${L.length} yasa kabul edildi</span>${L.length?L.map(l=>`<div class="dl" style="margin-top:6px"><b>${l[1]}</b> <span class="muted">· ${dateLabel(S.laws[l[0]])}</span></div><div class="dl muted">${l[5]}</div>`).join(''):'<div class="note">Henüz Meclis\'ten geçen bir yasa yok.</div>'}</div>`;}
{const _d=V.donem;V.donem=()=>_d()+arsiv36();}
document.addEventListener('click',ev=>{const t=ev.target.closest&&ev.target.closest('[data-zf],[data-rk]');if(!t||t.disabled)return;ev.stopImmediatePropagation();ev.preventDefault();const d=t.dataset;
  if(d.rk!==undefined){S.rk36=+d.rk;return render();}
  if(d.zf==='1'){S.over={t:'Zafer: Hedefler Tamamlandı',x:`${S.term}. dönemde enflasyonu hedefe indirdin, ekonomiyi büyüttün ve seçmenin güvenini korudun. ${dateLabel(S.month)} itibarıyla görevi zaferle tamamladın.`,win:true};}else S.zfD=1;save();render();},true);
function ek36Up(){const h=[],G=goals36();if(!S.zf&&!S.zfD&&G.every(x=>x.ok)){S.zf=S.month||1;h.push('Üç hedefin de tamamlandı: zaferi ilan edebilirsin (Masa sekmesi).');}
  const g=(S.nel??EO)-S.month,l=nextLoc36()-S.month;
  if(g>0&&[12,6,3,1].includes(g))h.push(`Genel seçime ${g} ay kaldı: destek %${nf(S.des,0)}, tahmini oy %${nf(vote(false),1)}.`);
  if(l>0&&[6,3,1].includes(l))h.push(`Yerel seçime ${l} ay kaldı: destek %${nf(S.des,0)}, büyükşehir belediyesi ${S.mun}/30.`);return h;}
{const _d=dunyaUp;dunyaUp=function(){const h=_d.apply(this,arguments);try{h.push(...ek36Up());}catch(e){}return h;};}
