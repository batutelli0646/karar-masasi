/* ek37: yatırım programı (kalıcı seviyeler, inşaat süresi, teknoloji kalemleri) ve güvenlik tehditleri paneli */
const YP=[['hast','Şehir hastaneleri',4,12,5,{des:.03,huz:.015},'Sağlık hizmeti kapasitesini kalıcı artırır.'],['okul','Okul ve anaokulu inşaatı',3,9,5,{buy:.025,des:.02},'Eğitim altyapısı, orta vadede büyümeyi destekler.'],['konut','Sosyal konut',5,12,5,{huz:.03,des:.025},'Barınma sorununu hafifletir, kentsel huzuru artırır.'],['yol','Otoyol, demiryolu ve liman',5,12,5,{buy:.03,cari:-.02},'Lojistik maliyetini düşürür, ihracatı destekler.'],['enerji','Enerji santralleri (güneş, rüzgâr, nükleer)',6,18,5,{cari:-.05,enf:-.02},'Enerji ithalat faturasını kalıcı küçültür.'],['hat','Boru hatları ve enerji merkezi',5,24,3,{cari:-.08,bat:.02,dog:.02},'Transit geliri ve bölgesel ağırlık sağlar.'],['kalk','Kalkınma Yolu (Irak–Türkiye koridoru)',8,48,3,{cari:-.1,buy:.03,dog:.03},'Körfez–Avrupa ticaretinden transit pay getirir; çok uzun sürer.'],['sav2','Yerli savunma sanayii',4,18,5,{ord:.02,cari:-.04},'Dışa bağımlılığı azaltır, orduyu memnun eder.'],['ar','Ar-Ge ve teknoloji merkezleri',3,24,5,{buy:.03,cari:-.03},'Katma değerli üretimi artırır.'],['cip','Yerli çip ve elektronik',6,30,3,{cari:-.06,buy:.02},'Yarı iletken ithalatını azaltır.'],['uzay','Uzay programı',8,36,3,{bat:.02,des:.02},'Prestij ve teknoloji kazanımı sağlar.']];
const yE=()=>{S.yat=S.yat||{lv:{},q:[]};return S.yat;};
const yCost=(p,l)=>Math.round(p[2]*(1+.35*l)*10)/10;
function yOrder(id){const y=yE(),p=YP.find(x=>x[0]===id);if(!p||y.q.some(q=>q.id===id)||(y.lv[id]||0)>=p[4])return;y.q.push({id,left:p[3]});logA('Yatırım programı',p[1],'İnşaat başladı: '+yCost(p,y.lv[id]||0)+' milyar $ yatırım, '+p[3]+' ay sürecek.');hap(20,520);save();render();}
function yatP(){const y=yE();return `<div class="panel"><b>Yatırım programı</b> <span class="muted dl">kalıcı seviyeler</span><div class="note" style="margin:4px 0">Her seviye inşaat süresince bütçe açığını artırır, tamamlanınca kalıcı etki bırakır ve küçük bir bakım yükü getirir. Sonraki seviyeler daha pahalıdır.</div>${YP.map(p=>{const l=y.lv[p[0]]||0,q=y.q.find(x=>x.id===p[0]);return `<div class="lever"><span class="n">${p[1]} <span class="muted dl">${'★'.repeat(l)}${'☆'.repeat(p[4]-l)}</span></span><span class="h">${p[6]}</span><div class="step"><button class="dxa" data-yat="${p[0]}" ${q||l>=p[4]?'disabled':''}><span>${q?'İnşaat sürüyor':l>=p[4]?'Azami seviye':(l+1)+'. seviyeyi başlat'}</span><b>${q?q.left+' ay kaldı':l>=p[4]?'':yCost(p,l)+' mlr $ · '+p[3]+' ay'}</b><i>›</i></button></div></div>`;}).join('')}</div>`;}
/* güvenlik tehditleri */
const TH37=[['ter','Terör tehdidi'],['org','Organize suç'],['cyb','Siber saldırı']];
const br=k=>S.bud&&S.bud[k]&&MB[k]?S.bud[k]/MB[k]:1,yl=id=>(S.yat&&S.yat.lv[id])||0;
function thTarget(k){return k==='ter'?clamp(28+(5-S.huz)*5+(S.ord<4?10:0)-(br('ic')-1)*25-(br('sav')-1)*10,0,100):k==='org'?clamp(40+(S.isz-9)*2+(5-S.huz)*2-(br('adalet')-1)*25-(br('ic')-1)*10,0,100):clamp(30+S.month*.15-(br('sav')-1)*10-yl('ar')*3-yl('cip')*2,0,100);}
const thE=()=>{S.thr=S.thr||{ter:25,org:35,cyb:30};return S.thr;};
function thP(){const t=thE();return `<div class="panel"><b>Güvenlik tehditleri</b>${TH37.map(x=>`<div class="dl" style="margin-top:6px">${x[1]} · ${nf(t[x[0]],0)}/100 <span class="muted">(hedef ${nf(thTarget(x[0]),0)})</span></div>${gbar(t[x[0]],t[x[0]]>60?'bad':'')}`).join('')}<div class="note" style="margin:4px 0 0">Seviyeyi huzur, işsizlik, İçişleri, Adalet ve Savunma bütçeleri ile teknoloji yatırımları belirler. Yüksek seviyede kriz olayı riski artar.</div></div>`;}
{const _s=sfx;sfx=function(){const F=_s.apply(this,arguments),y=yE(),t=thE(),add=(o,m=1)=>{for(const k in o)F[k]=(F[k]||0)+o[k]*m;};
  YP.forEach(p=>{const l=y.lv[p[0]]||0;if(l){add(p[5],l);F.acik=(F.acik||0)+.01*l;}});
  y.q.forEach(q=>{const p=YP.find(x=>x[0]===q.id);F.acik=(F.acik||0)+yCost(p,y.lv[q.id]||0)/Math.max(1,S.gdp)*100;});
  if(t.ter>50)add({huz:-(t.ter-50)*.003,cari:(t.ter-50)*.001});if(t.org>50)add({des:-(t.org-50)*.003,acik:(t.org-50)*.002});if(t.cyb>50)add({buy:-(t.cyb-50)*.002});return F;};}
function ek37Up(){const h=[],y=yE(),t=thE();
  y.q=y.q.filter(q=>{q.left--;if(q.left>0)return true;const p=YP.find(x=>x[0]===q.id);y.lv[q.id]=(y.lv[q.id]||0)+1;h.push(`${p[1]}: ${y.lv[q.id]}. seviye tamamlandı.`);logA('Yatırım programı',p[1],y.lv[q.id]+'. seviye tamamlandı.');return false;});
  TH37.forEach(x=>{const k=x[0];t[k]+=(thTarget(k)-t[k])*.12;t[k]=clamp(t[k],0,100);if(t[k]>50&&Math.random()<(t[k]-50)/250){
    if(k==='ter'){applyFx({huz:-.7,des:-.8,cari:.12});h.push('Terör saldırısı: kamuoyunda güvenlik tartışması büyüdü, turizm geliri etkilendi.');}
    else if(k==='org'){applyFx({des:-.7,bat:-.1,huz:-.3});h.push('Büyük bir organize suç operasyonu ve yolsuzluk iddiaları gündemi doldurdu.');}
    else{applyFx({buy:-.15,des:-.4,cari:.08});h.push('Büyük çaplı siber saldırı kamu ve finans sistemlerini aksattı.');}}});
  return h;}
{const _d=dunyaUp;dunyaUp=function(){const h=_d.apply(this,arguments);try{h.push(...ek37Up());}catch(e){}return h;};}
{const _k=V.kurum;V.kurum=()=>_k()+yatP();}
{const _a=V.askeri;V.askeri=()=>thP()+_a();}
document.addEventListener('click',ev=>{const t=ev.target.closest&&ev.target.closest('[data-yat]');if(!t||t.disabled)return;ev.stopImmediatePropagation();ev.preventDefault();yOrder(t.dataset.yat);},true);
