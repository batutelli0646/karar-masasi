/* ---------- Seçenekli eylemler: bekleme süresi yok, tekrar eden eylemde etki azalır (doygunluk) ---------- */
const su=k=>(typeof XM==='number'?XM:1)/Math.pow(1+((S.su||{})[k]||0),2),suU=k=>{S.su=S.su||{};S.su[k]=(S.su[k]||0)+1;};
const sfx2=(f,m)=>Object.fromEntries(Object.entries(f).map(([k,v])=>[k,v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([a,b])=>[a,b*m])):v*m]));
const suDecay=()=>{for(const k in (S.su||{})){S.su[k]*=.75;if(S.su[k]<.05)delete S.su[k];}};
const sat=m0=>{const m=m0/(typeof XM==='number'?XM:1);return m<.98?` Etki %${Math.round(m*100)} (tekrar ettikçe azalır).`:'';};
const obs=(a,id,L)=>L.map((o,i)=>sbtn(`data-${a}="${id}:${i}"`,o[0])).join('');
/* [ad, açıklama, tutum/ilişki puanı, ek etki] */
const GM=[['Toplantı','Temsilcilerle toplantı yaparsın.',4,{}],['Destek paketi','Kesime yönelik bütçe desteği açıklarsın.',10,{acik:.08}],['Özel söz','Kesime özel bir politika sözü verirsin; parti içinde tepki olur.',16,{acik:.15,par:-.05}]];
const PR=[['Kısa tur','Birkaç yatırımcı görüşmesi.',2,{}],['Geniş tur','Büyük fon yöneticileriyle toplantılar.',4,{acik:.03}],['Yatırımcı forumu','Uluslararası forum düzenlersin.',6,{acik:.08,bat:.05}]];
const PV=[['Enerji şirketi payı','Kamu çalışanları çok tepkili.',{rez:3,acik:-.3},8],['Telekom payı','Orta düzey tepki.',{rez:2,acik:-.2},5],['Liman ve havalimanı işletmesi','Hafif tepki.',{rez:1.5,acik:-.15},4]];
const SY=[['Yerli üretim hattı','Kapasite +3.',3,{acik:.05}],['Ar-Ge merkezi','Kapasite +6.',6,{acik:.12}],['Büyük tesis yatırımı','Kapasite +10.',10,{acik:.25}]];
const TS=[['Hızlı',1,-8,'1 ay sonra oylama, destek −8'],['Standart',3,0,'3 ay sonra oylama'],['Ortaklı',5,8,'5 ay sonra oylama, ön görüşmeyle destek +8']];
