/* ---------- Toplum: gruplar, hizmetler, nüfus ve göç, politikalar, süren krizler ---------- */
/* Gerçek başlangıç verileri: TÜİK ADNKS 2025 (nüfus 86,09 mn; 0-14 %20,4; 65+ %11,1), TÜİK GYKA 2024 (Gini 0,413),
   Göç İdaresi (yabancı nüfus ≈4,2 mn Kasım 2024; dönüşlerle azaldığı varsayımıyla 3,6 mn başlangıç). Grup payları ve formüller yaklaşıktır. */
const gini=()=>clamp(.413+clS().d*.004-(rb('calisma')+rb('aile'))*.02,.3,.6);
const gbar=(v,c)=>`<div class="bar ${c||''}" style="grid-column:1/-1;margin:2px 0"><i style="width:${clamp(v,0,100)}%"></i></div>`;
const ap=()=>S.minw/28075/((S.cpi||100)/100)*100;
const kid=()=>20.4-.033*S.month,old=()=>11.1+.04*S.month;
/* Toplumsal gruplar: [id, ad, nüfus payı %, ideolojik eksen, göç duyarlılığı, hoşnutluk hedefi (50 = nötr)] */
const GRP=[
['emekli','Emekliler',()=>S.pens/S.nuf*100,.3,.2,()=>50-.5*(S.enf-E0)+30*rb('calisma')+.25*(ap()-100)],
['ucret','Ücretliler ve işçiler',24,-.2,.5,()=>50-.6*(S.enf-E0)+.35*(ap()-100)-1.5*(S.isz-9.2)+15*rb('calisma')],
['esnaf','Esnaf ve küçük işletme',9,.3,.4,()=>50-.4*(S.enf-E0)-.25*(S.lv.faiz-F0)-.6*(S.tax.kdv-20)+.8*(S.buy-2.8)],
['ciftci','Çiftçi ve kırsal kesim',8,.5,0,()=>50+.6*(S.sec.tar-50)+40*rb('tarim')-.3*(S.enf-E0)],
['sanayi','Sanayici ve işverenler',3,.2,-.6,()=>50-.3*(S.lv.faiz-F0)+4*(S.buy-2.8)+.4*(S.sec.san-50)-1.2*(S.tax.kurum-25)],
['kamu','Kamu çalışanları',5,-.1,.3,()=>50-.5*(S.enf-E0)+20*rb('calisma')+.2*(S.des-41)],
['genc','Gençler ve öğrenciler',15,-.5,.1,()=>50-2*(S.isz-9.2)+18*rb('egit')+12*rb('genc')+2*(S.huz-5)+1.5*(S.bat-5)],
['kentli','Kentli seküler ve liberal',14,-.6,-.3,()=>50+4*(S.bat-5)+20*rb('adalet')-.2*(S.enf-E0)+1.5*(S.huz-5)],
['muhaf','Muhafazakâr aileler',28,.7,.5,()=>50+18*rb('aile')+10*rb('diyanet')+2*(S.huz-5)-.25*(S.enf-E0)],
['milli','Milliyetçi kesim',12,.85,1.2,()=>50+4*(S.ord-6)+12*rb('sav')+1.5*(S.huz-5)],
['dogu','Doğu ve Güneydoğu seçmeni',19,-.1,0,()=>50-1.2*(S.isz-9.2)+15*rb('egit')+15*rb('ulas')+2*(S.huz-5)+2*(S.bol-6)],
['ordu','Ordu mensupları ve gaziler',2,.6,.2,()=>50+6*(S.ord-6)+25*rb('sav')+.15*((S.mil?S.mil.hz:70)-70)]];
const gpay=g=>T(g[2]),gbias=g=>10*(.55-Math.abs(PART[S.me].x-g[3]));
/* Politika kataloğu: [id, kategori, ad, açıklama, aylık etki, grup tepkisi] */
const PL=[
['tasarruf','Ekonomi','Kamu tasarruf tedbirleri','Kamu araç, ödenek ve israf kesintileri.',{acik:-.3,des:-.05,buy:-.04},{kamu:-6,ucret:-2,sanayi:3}],
['kobi','Ekonomi','KOBİ kredi desteği','Düşük faizli esnaf ve KOBİ kredisi.',{buy:.12,acik:.15,enf:.03},{esnaf:8,sanayi:2}],
['yatirim','Ekonomi','Yatırım teşvik paketi','Vergi indirimi ve arsa tahsisi.',{buy:.15,acik:.2,cari:-.04},{sanayi:8,ucret:2}],
['kkm','Ekonomi','Kur korumalı mevduat','TL mevduatına kur farkı garantisi.',{enf:-.05,rez:-.3,acik:.12},{esnaf:2,sanayi:3}],
['kira','Sosyal','Kira yardımı','Dar gelirli kiracıya aylık destek.',{des:.1,huz:.05,acik:.25,enf:.03},{ucret:5,genc:4,emekli:2}],
['ikramiye','Sosyal','Emekli bayram ikramiyesi','Her bayramda ek ödeme.',{des:.1,acik:.2},{emekli:8,kamu:1}],
['evbakim','Sosyal','Evde bakım ve aile desteği','Bakım verenlere düzenli maaş.',{des:.08,huz:.05,acik:.12},{muhaf:5,ucret:2}],
['gida','Sosyal','Gıda ve hane yardımı','Dar gelirli hanelere gıda kartı.',{huz:.08,enf:-.02,acik:.1,des:.05},{ucret:3,dogu:4,emekli:3}],
['kamera','Güvenlik','Şehir kameraları ve yüz tanıma','Kamera ağı ve hızlı müdahale.',{huz:.12,bat:-.04,acik:.06},{kentli:-6,milli:3,muhaf:2}],
['sinir','Güvenlik','Sınır güvenlik hattı','Duvar, kule ve termal kamera.',{huz:.06,ord:.03,acik:.08},{milli:6,dogu:-2}],
['donus','Güvenlik','Gönüllü geri dönüş programı','Göçmenlere dönüş desteği ve konut.',{huz:.02,bat:-.01,acik:.06},{milli:4,muhaf:2,kentli:-2,sanayi:-2}],
['meslek','Eğitim','Mesleki eğitim seferberliği','Sanayi ile ortak çıraklık ve staj.',{isz:-.06,buy:.05,acik:.1},{genc:6,sanayi:4}],
['yemek','Eğitim','Ücretsiz öğrenci yemeği','Okul ve üniversitelerde öğle yemeği.',{des:.06,huz:.04,acik:.1},{genc:7,ucret:2}],
['mazot','Tarım','Mazot ve gübre desteği','Çiftçinin girdi maliyetini düşürür.',{enf:-.04,des:.06,acik:.12,buy:.02},{ciftci:9}],
['tasarrufe','Enerji','Enerji verimliliği kampanyası','Bina yalıtımı ve verimli cihaz desteği.',{cari:-.08,acik:.05,des:-.02},{kentli:3,sanayi:-1}],
['dizi','Kültür','Yerli dizi ve film ihracatı','Kültür ihracatı ve yumuşak güç.',{bol:.05,bat:.02,acik:.04},{kentli:1,muhaf:1}]];
/* Hizmet: [id, ad, bütçe kalemleri, taban karşılama %, göç yükü duyarlılığı, açıklama] */
const SV=[['saglik','Sağlık',['saglik'],84,1,'Hastane, doktor ve ilaç erişimi.'],['egit','Eğitim',['egit'],78,.8,'Okul, öğretmen ve derslik.'],['guv','Güvenlik',['ic'],72,.6,'Emniyet ve jandarma kapsaması.'],['konut','Konut',['cevre'],64,1.2,'Konut arzı ve kentsel dönüşüm.'],['ulas','Ulaşım ve altyapı',['ulas'],70,.3,'Yol, raylı sistem ve köprü.'],['sosyal','Sosyal koruma',['calisma','aile'],70,.5,'Yardım, bakım ve sosyal güvenlik.']];
const GK=[['Mühürlü','Sınır kapalı, geri gönderme hızlı.'],['Kapalı','Çok seçici giriş, dönüş teşvik edilir.'],['Seçici','Şartlı giriş; bugünkü karma uygulama.'],['Açık','Çalışma ve ikamet izni kolaylaşır.'],['Serbest','Giriş ve çalışma neredeyse serbest.']];
const GD=[-.06,-.03,-.012,.02,.07],GFX=[{huz:.03,bat:-.05,acik:.02,buy:-.02},{huz:.015,bat:-.02,acik:.01,buy:-.01},{},{huz:-.03,bat:.015,buy:.01,acik:.01},{huz:-.07,bat:.04,buy:.02,acik:.03}];
/* Süren krizler: [id, ad, açıklama, süre aralığı, aylık etki, aylık olasılık, olasılık çarpanı, şiddet] */
const KR=[
['kurak','Kuraklık','Barajlar ve yağış normalin altında; tarım ve gıda fiyatları baskı altında.',[4,7],{enf:.12,cari:.06,des:-.05},.02,()=>1,()=>1],
['yangin','Orman yangınları','Yaz sıcakları ve rüzgâr yangınları büyütüyor.',[2,3],{des:-.06,huz:-.04,cari:.03},.2,()=>[5,6,7,8].includes((9+S.month)%12)?1:0,()=>1-prep()*.4],
['gocd','Göç dalgası','Sınırda yeni bir geliş dalgası var; barınma ve hizmetler zorlanıyor.',[3,5],{huz:-.05,acik:.06},.02,()=>S.goc>=2?1:.3,()=>1],
['deprem','Deprem sonrası yeniden inşa','Büyük bir depremin ardından yıkım ve barınma yükü sürüyor.',[8,12],{buy:-.4,acik:1.5,des:-.15,huz:-.12},.006,()=>1,()=>1-prep()*.4],
['salgin','Salgın hastalığı','Bulaşıcı bir hastalık yayılıyor; hastaneler yoğun.',[3,6],{buy:-.5,des:-.08,huz:-.06,isz:.15},.005,()=>1,()=>clamp(1.25-cov(SV[0])/100,.5,1.3)]];
const cov=v=>{const r=1+v[2].reduce((a,k)=>a+rb(k),0)/v[2].length,y=1+v[4]*(S.ref-3.6)/S.nuf*3+(v[0]==='saglik'?.02*(old()-11.1):v[0]==='egit'?.02*(kid()-20.4):0);let c=v[3]*Math.pow(Math.max(r,.2),.75)/y;if(v[0]==='konut'&&S.prg&&S.prg.some(p=>p.id==='kon'))c+=6;return clamp(c,15,100);};
const hDev=()=>SV.reduce((a,v)=>a+cov(v)-v[3],0)/SV.length;
const gT=g=>{const id=g[0];let t=g[5]()+gbias(g)+(S.gb[id]||0)+((S.gk||{})[id]||0)-g[4]*4*(S.goc-2)-g[4]*3*(S.ref-3.6);PL.forEach(p=>{if(S.pol[p[0]])t+=(p[5][id]||0)*plg(p[0]);});if(id==='ciftci'&&S.krz.some(k=>k.id==='kurak'))t-=14;return clamp(t,5,95);};
const gDev=()=>{if(!S.gr)return 0;let a=0,b=0;GRP.forEach(g=>{const w=gpay(g);a+=w*(S.gr[g[0]]-50-gbias(g));b+=w;});return a/b;};
const uns=()=>clamp((10-S.huz)*6-gDev()*.8-hDev()*.3+(S.isz-9.2)*1.5,0,100);
function toplumEnsure(force){S.nuf=S.nuf||86.1;if(S.ref===undefined)S.ref=3.6;if(S.goc===undefined)S.goc=2;S.pol=S.pol||{};S.krz=S.krz||[];S.gb=S.gb||{};S.unr=S.unr||0;
  if(force||!S.gr||S.gme!==S.me){S.gr={};GRP.forEach(g=>S.gr[g[0]]=gT(g));S.gme=S.me;S.gp={...S.gr};}}
/* sürekli etkiler: her ay simulate() içinde uygulanır, tahmin paneline de yansır */
function sfx(){const F={},add=(o,m=1)=>{for(const k in o)F[k]=(F[k]||0)+o[k]*m;};
  if(!S.gr)return F;
  PL.forEach(p=>{if(S.pol[p[0]])add(p[4],plm(p[0]));});add(GFX[S.goc]);S.krz.forEach(k=>add(KR.find(x=>x[0]===k.id)[4],k.sev));
  const g=gDev(),h=hDev();add({des:g*.008+h*.004,huz:g*.004+h*.003});if(typeof dsfx==='function')add(dsfx());add(psfx());add(isfx());add(gfxAll());if(typeof levFx==='function')add(levFx());return F;}
function toplumUp(){const h=[];toplumEnsure();
  const dr=GD[S.goc]-(S.pol.donus?.03:0)+(S.krz.some(k=>k.id==='gocd')?.12*(S.goc>=2?1:.3):0),r0=S.ref;S.ref=Math.max(1,S.ref+dr);
  if(S.tfr===undefined)S.tfr=1.48;S.tfr=clamp(S.tfr-.0015+(S.pol.evbakim?.0012:0)+(rb('aile')>0?rb('aile')*.002:0)+(S.buy-2.8)*.0002,1,2.4);
  const cbr=.0109*(S.tfr/1.48)*(kid()/20.4),cdr=.0056*(old()/11.1)+(S.krz.some(k=>k.id==='salgin')?.0008:0);S.nuf+=S.nuf*(cbr-cdr)/12+(S.ref-r0);S.pens=17.2+.9*(S.nuf*old()/100-86.1*11.1/100); /* TÜİK 2024: kaba doğum hızı ‰10,9, ölüm ‰5,6, TFR 1,48 */
  let bi=null,bd=0;GRP.forEach(g=>{const id=g[0],o=S.gr[id];S.gp[id]=o;S.gr[id]=o+(gT(g)-o)*.3;S.gb[id]=(S.gb[id]||0)*.85;if(S.gk&&S.gk[id])S.gk[id]*=.985;const d=S.gr[id]-o;if(Math.abs(d)>Math.abs(bd)){bd=d;bi=g;}});
  if(bi&&Math.abs(bd)>3)h.push(bd<0?`${bi[1]} kesiminde hoşnutsuzluk artıyor.`:`${bi[1]} kesiminde memnuniyet yükseliyor.`);
  S.krz=S.krz.filter(k=>{const d=KR.find(x=>x[0]===k.id);if(k.id==='kurak')S.sec.tar=clamp(S.sec.tar-1.2,0,100);k.left--;if(k.left>0)return true;h.push(d[1]+' sona erdi.');return false;});
  if(S.krz.length<2)for(const d of KR.slice().sort(()=>Math.random()-.5)){if(S.krz.some(k=>k.id===d[0]))continue;if(Math.random()<d[5]*d[6]()){S.krz.push({id:d[0],left:Math.round(rnd(d[3][0],d[3][1])),sev:d[7](),aid:0});if(d[0]==='deprem')S.nuf-=rnd(.02,.06);h.unshift(d[1]+' başladı: '+d[2]);break;}}
  S.unr=uns()>=70?S.unr+1:0;if(S.unr>=2){S.unr=0;applyFx({des:-.5,huz:-.4,bat:-.1});h.unshift('Hoşnutsuzluk sokağa taştı: kentlerde büyük protestolar yaşandı.');}
  return h;}
/* eylemler */
function gmeet(id,i){const g=GRP.find(x=>x[0]===id),x=(GMO[id]||GM)[i];if(!g||!x)return;const m=su('g_'+id);S.gb[id]=(S.gb[id]||0)+x[2]*m;S.gr[id]=clamp(S.gr[id]+x[2]*.4*m,5,95);const pol=GMO[id]&&i<GMO[id].length-1;S.gk=S.gk||{};if(pol)S.gk[id]=clamp((S.gk[id]||0)+x[2]*.5*m,-25,25);for(const k in (x[4]||{}))if(S.gr[k]!==undefined){S.gb[k]=(S.gb[k]||0)+x[4][k]*m;if(pol)S.gk[k]=clamp((S.gk[k]||0)+x[4][k]*.5*m,-25,25);S.gr[k]=clamp(S.gr[k]+x[4][k]*.3*m,5,95);} /* politika niteliğindeki adımlar kalıcı iz bırakır (yavaş söner), görüşmeler kısa sürer */applyFx(sfx2(x[3],m));suU('g_'+id);logA('Toplum',g[1],x[0]+': memnuniyet hedefi +'+nf(x[2]*m,1)+'.');hap(20,520);save();render();}
function gocSet(i){if(i===S.goc)return;S.goc=i;logA('Göç politikası',GK[i][0],GK[i][1]);hap(20,520);save();render();}
function krAid(id){const k=S.krz.find(x=>x.id===id);if(!k||k.aid)return;k.aid=1;k.sev*=.7;k.left=Math.max(1,Math.ceil(k.left*.75));applyFx({des:-.8,bat:-.2,acik:-.1});logA('Kriz',KR.find(x=>x[0]===id)[1],'Dış yardım kabul edildi.');save();render();}
function toplumClick(t){const d=t.dataset;
  if(d.gm){const p=d.gm.split(':');gmeet(p[0],+p[1]);return true;}if(d.goc!==undefined){gocSet(+d.goc);return true;}if(d.kaid){krAid(d.kaid);return true;}return false;}
/* görünümler */
const gL=v=>v>=60?['Destekliyor','good']:v>=40?['Kararsız','warn']:['Karşı','bad'];
const gfx=o=>Object.entries(o).map(([k,v])=>GRP.find(g=>g[0]===k)[1]+' '+(v>0?'+':'−')+Math.abs(v)).join(', ');
function toplum(){toplumEnsure();const u=uns(),ul=u<40?'Sakin':u<60?'Gergin':u<70?'Kaynıyor':'İsyan riski',uc=u<40?'good':u<60?'warn':'bad';
  return `<h2>Toplumsal Gruplar</h2><div class="panel"><div class="dl" style="display:flex;justify-content:space-between"><span>Toplumsal huzursuzluk</span><span><b>${nf(u,0)}</b>/100 · <span class="st ${uc}">${ul}</span></span></div>${gbar(u,uc)}<div class="note">Düşük huzur, işsizlik, hizmet açığı ve grup tepkileri bunu yükseltir. 70 üstünde iki ay kalırsa sokak hareketleri başlar.</div></div>
  <div class="panel">${GRP.map(g=>{const id=g[0],v=S.gr[id],d=v-S.gp[id],[lb,c]=gL(v),cd=(S.cool['g_'+id]||0)-S.month,near=PK.slice().sort((a,b)=>Math.abs(PART[a].x-g[3])-Math.abs(PART[b].x-g[3])).slice(0,2).map(k=>PART[k].n).join(' · ');
    return `<div class="lever"><span class="n">${g[1]} <span class="muted dl">· %${nf(gpay(g),0)}</span></span><span class="h"><span class="st ${c}">${lb}</span> · ${nf(v,0)}${Math.abs(d)<.5?'':d>0?' ▲':' ▼'} · yakın: ${near}</span><div class="step">${sbtn(`data-gsel="${id}"`,S.gsel===id?'Kapat':'Seçenekler')}</div>${gbar(v,c)}${S.gsel===id?gmList(id):''}</div>`;}).join('')}<div class="note">Paylar yaklaşıktır, kesimler iç içedir. Hoşnutluk; enflasyon, bütçe, vergi, faiz, göç politikası ve seçtiğin politikalardan doğar. Ortalama sapma desteği ve oy oranını etkiler. Her kesimin kendine özgü talepleri var: bir kesimi memnun eden adım bazen başka bir kesimi kızdırır, çoğu bütçeye yük olur. Bekleme süresi yoktur ama aynı kesimle arka arkaya yapılan görüşmelerin etkisi azalır, her ay %25 toparlanır.</div></div>`;}
function hizmet(){const r=[...SV.map(v=>[v[1],cov(v),v[3],v[5]]),['Afet hazırlığı',prep()*100,40,'İçişleri ve Çevre bütçeleri; deprem ve yangında şiddeti azaltır.']],y=(S.ref-3.6)/S.nuf*100;
  return `<h2>Kamu Hizmetleri</h2><div class="panel">${r.map(([n,c,c0,h])=>{const k=c>=75?'good':c>=50?'warn':'bad';return `<div class="lever"><span class="n">${n}</span><span class="h">${h}</span><div class="step"><b class="st ${k}">%${nf(c,0)}</b></div>${gbar(c,k)}</div>`;}).join('')}<div class="note">Karşılama = bütçe ÷ taban bütçe ve nüfus yüküne göre. Taban: ${SV.map(v=>v[1]+' %'+v[3]).join(', ')}. Göçmen nüfusun başlangıca göre farkı (${y>=0?'+':'−'}%${nf(Math.abs(y),1)} nüfus) sağlık, konut ve eğitim yükünü değiştirir. Taban altında kalan hizmet desteği ve huzuru aşındırır.</div></div>`;}
function nufus(){const k=kid(),o=old(),w=100-k-o,gi=gini(),R=(a,b)=>`<div class="dl" style="display:flex;justify-content:space-between;padding:2px 0"><span>${a}</span><span>${b}</span></div>`,cd=(S.cool.goc||0)-S.month;
  return `<h2>Nüfus ve Göç</h2><div class="panel">${R('Toplam nüfus',nf(S.nuf,2)+' milyon')}${R('Çalışma çağı (15-64)','%'+nf(w,1))}${R('Çocuk (0-14)','%'+nf(k,1))}${R('65 yaş üstü','%'+nf(o,1))}${R('Bağımlılık oranı','%'+nf((k+o)/w*100,0))}${R('Emekli aylığı alan',nf(S.pens,1)+' milyon')}${R('Yabancı / göçmen nüfus',nf(S.ref,2)+' milyon')}${R('Gelir eşitsizliği (Gini)',nf(gi,3))}<div class="note">Başlangıç: TÜİK 2025 nüfus yapısı, TÜİK 2024 Gini (0,413). Yaşlanma her ay sürer, göçmen sayısı başlangıçta yaklaşık 3,6 milyon kabul edilir.</div></div>
  <h2>Sınır politikası</h2><div class="panel"><div class="chips" style="margin:0 0 10px">${GK.map((g,i)=>`<button class="btn sm ${i===S.goc?'':'sec'}" data-goc="${i}" ${i!==S.goc&&(cd>0||avail()<1)?'disabled':''}>${g[0]}</button>`).join('')}</div><div class="dl"><b>${GK[S.goc][0]}:</b> ${GK[S.goc][1]}</div><div class="dl" style="margin-top:4px">Aylık göçmen değişimi: ${GD[S.goc]>=0?'+':'−'}${nf(Math.abs(GD[S.goc])*1000,0)} bin${Object.keys(GFX[S.goc]).length?' · Etki: '+fxText(GFX[S.goc]):''}</div><div class="note">Kademeyi istediğin zaman değiştirebilirsin. Açık politika itibarı ve ekonomiyi destekler, hizmet yükünü ve milliyetçi kesimin tepkisini artırır; kapalı politika bunun tersini yapar.</div></div>`;}
const krizP=()=>S.krz&&S.krz.length?`<div class="panel"><b>Süren krizler</b>${S.krz.map(k=>{const d=KR.find(x=>x[0]===k.id);return `<div class="lever"><span class="n">${d[1]}</span><span class="h">${d[2]} Aylık etki: ${fxText(d[4])} · ${k.left} ay kaldı${k.aid?' · dış yardım alındı':''}</span><div class="step">${k.aid?'':sbtn(`data-kaid="${k.id}"`,'Dış yardım',0)}</div></div>`;}).join('')}<div class="note">Dış yardım kabul edersen etki %30 azalır, süre %25 kısalır; ancak iç politikada tartışma yaratır.</div></div>`:'';
