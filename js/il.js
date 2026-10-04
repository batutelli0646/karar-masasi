/* İl yatırımları: 8 yatırım türü; her biri o ilin farklı göstergelerini 24 ayda azalan şekilde etkiler */
const ILT=[
['sanayi','Sanayi bölgesi',{sanayi:9,isz:-.5,gel:4},{buy:.05,acik:.12},'Sanayi bölgesi kuruldu'],
['hastane','Hastane',{saglik:10,des:1},{des:.05,acik:.1},'Hastane yapıldı'],
['okul','Okul ve kampüs',{egit:9,des:.8},{des:.04,acik:.1,buy:.01},'Okul ve kampüs yapıldı'],
['yol','Yol ve demiryolu',{sanayi:5,gel:3,buy:.2},{buy:.03,acik:.12},'Ulaşım yatırımı yapıldı'],
['tarim','Sulama ve tarım',{gel:5,yok:-1.5,enf:-.5},{enf:-.02,acik:.08},'Sulama ve tarım desteği verildi'],
['turizm','Turizm altyapısı',{gel:6,isz:-.4},{cari:-.03,acik:.08},'Turizm altyapısı yapıldı'],
['konut','Konut ve dönüşüm',{des:1.2,yok:-1,suc:-2},{des:.05,acik:.14},'Konut ve kentsel dönüşüm yapıldı'],
['guv','Emniyet ve karakol',{suc:-8,huz:.3},{huz:.02,acik:.07},'Emniyet yatırımı yapıldı']];
function iloc(i,k){const r=S.ril&&S.ril[i];if(!r)return 0;let t=0;for(const id in r){const d=ILT.find(x=>x[0]===id);if(!d||d[2][k]===undefined)continue;t+=d[2][k]*r[id][0]*Math.max(0,1-(S.month-r[id][1])/24);}return t;}
function ilBtns(i,a){const r=(S.ril&&S.ril[i])||{};return ILT.map(d=>{const n=r[d[0]]?Math.round(r[d[0]][0]):0;return sbtn(`data-ilt="${i}:${d[0]}"`,d[1]+(n?' ×'+n:''),a<1);}).join('');}
document.addEventListener('click',ev=>{const t=ev.target.closest&&ev.target.closest('[data-ilt]');if(!t)return;ev.stopPropagation();ev.preventDefault();
 const [i,id]=t.dataset.ilt.split(':'),d=ILT.find(x=>x[0]===id);if(!d||t.disabled)return;
 S.ril=S.ril||{};const r=S.ril[i]=S.ril[i]||{},old=r[id]?r[id][0]*Math.max(0,1-(S.month-r[id][1])/24):0;r[id]=[Math.min(3,old+1),S.month];
 S.cur.spent+=1;applyFx(d[3]);logA('İl yatırımı',MAP.n[i],d[4]+'.');hap(20,520);save();render();},true);
