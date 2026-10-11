/* ek41: koalisyon ortağı talepleri (özellikle küçük parti olarak oynarken) ve dış ilişkilerin tek özette birleşmesi */
const adE=()=>S.ad||null;
EV.push({id:'p_talep',g:'ic',tag:'İç · Koalisyon',t:'Ortağın Bakanlık Talebi',cond:()=>false,x:()=>{const a=adE();return a?`${PART[a.p].n} lideri ${PART[a.p].lead}, ${MIN.find(m=>m[0]===a.m)[1]} Bakanlığı üzerindeki payın artırılmasını istiyor: "Ortaklık eşit sorumluluk demektir; ${S.seats[a.p]} sandalyeyle bu hükümetin çoğunluğunu biz sağlıyoruz."`:'İttifak ortağı yeni bir talep iletti.';},c:[
 ch('Talebi kabul et: bakanlıkta ortak yönetim',2,'Ortak memnun olur, parti içi tepki doğar.',{kol:1.6,par:-.5,des:-.1},'Ortak memnun kaldı; kendi partinde bazı isimler tepki gösterdi.'),
 ch('Uzlaşma: ortak politika komisyonu kur',1,'Kısmi çözüm, küçük bir maliyetle.',{kol:.4,acik:.08},'Komisyon kuruldu; ortak şimdilik tatmin oldu.'),
 ch('Reddet',0,'Kendi çizgini koru, ortakla ilişki zayıflar.',{kol:-1.6,par:.3,des:.1},'Talep reddedildi; ortak kamuoyu önünde sitem etti.')]});
EVB.p_talep=EV.find(e=>e.id==='p_talep');
function ek41Up(){const h=[];if(!S.coal||!S.coal.length||adE())return h;const small=S.seats&&S.seats[S.me]<150,per=small?4:6;
  if(S.month>=3&&S.month%per===0&&Math.random()<.7){const p=S.coal[Math.floor(Math.random()*S.coal.length)],w=PART[p].want||[],m=w[Math.floor(Math.random()*w.length)];if(m){S.ad={p,m};S.sched.push({due:S.month+1,id:'p_talep'});h.push(`${PART[p].n}, ${MIN.find(x=>x[0]===m)[1]} Bakanlığı için pazarlık istiyor.`);}}return h;}
/* S.ad etkinlik gerçekleştikten sonra temizlenir (bir sonraki aylık hook'ta) */
function ad41Clr(){if(S.ad&&!S.sched.some(x=>x.id==='p_talep')&&!(S.cur&&S.cur.events.some(e=>e.id==='p_talep')))S.ad=null;}
/* ülke ilişkileri itibara bağlanır: 193 ek ülkenin ilişkileri de bölge itibarını etkiler */
const UVG=['bat','dog','bol','bol','bat','dog','bol'];
{const _s=sfx;sfx=function(){const F=_s.apply(this,arguments);if(S.ux&&typeof UV!=='undefined'){const s={bat:0,dog:0,bol:0};for(const k in S.ux){const u=UV[k];if(!u)continue;s[UVG[u[1]]||'bol']+=(S.ux[k]-(u[16]??50))*.0004;}for(const r in s)F[r]=(F[r]||0)+clamp(s[r],-.03,.03);}return F;};}
function ozet41(){const rows=[];CT.forEach(c=>rows.push([c[1],S.ul[c[0]]]));if(S.ux)for(const k in S.ux)if(UV[k]&&Math.abs(S.ux[k]-(UV[k][16]??50))>=3)rows.push([UV[k][0],S.ux[k]]);rows.sort((a,b)=>b[1]-a[1]);
  const it=r=>`<div class="dl">${RN[r]} itibarı ${nf(S[r],1)}/10</div>${gbar(S[r]*10,S[r]>=5?'ok':'')}`;
  return `<div class="panel"><b>Dış ilişkiler özeti</b>${['bat','dog','bol'].map(it).join('')}<div class="dl" style="margin-top:6px"><b>En yakın ilişkiler</b> ${rows.slice(0,3).map(r=>r[0]+' ('+nf(r[1],0)+')').join(' · ')}</div><div class="dl"><b>En gergin ilişkiler</b> ${rows.slice(-3).reverse().map(r=>r[0]+' ('+nf(r[1],0)+')').join(' · ')}</div><div class="note" style="margin:4px 0 0">Bölge itibarı; 44 ana ülkenin ve eylem yaptığın diğer ülkelerin ilişkilerinden beslenir. Tek bir ülkeyle ilişki küçük, bir bölgeyle toplu ilişki büyük fark yaratır.</div></div>`;}
{const _d=dunyaUp;dunyaUp=function(){ad41Clr();const h=_d.apply(this,arguments);try{h.push(...ek41Up());}catch(e){}return h;};}
{const _u=V.ulke;V.ulke=()=>ozet41()+_u();}
