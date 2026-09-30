/* ---------- Yardımcılar ---------- */
const KEY='karar-masasi-v1';
const MONTHS=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const nf=(v,d=1)=>Number(v).toLocaleString('tr-TR',{minimumFractionDigits:d,maximumFractionDigits:d});
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const rnd=(a,b)=>a+Math.random()*(b-a);
const dateLabel=m=>{const t=9+m;return MONTHS[t%12]+' '+(2026+Math.floor(t/12));};
const T=x=>typeof x==='function'?x():x;

const STATS=[
 {k:'enf',l:'Enflasyon',u:'%',d:1,st:v=>v<20?'good':v<45?'warn':'bad',low:1,lb:['Düşük','Yüksek','Kritik']},
 {k:'buy',l:'Büyüme',u:'%',d:1,st:v=>v>=4?'good':v>=2?'warn':'bad',lb:['Güçlü','Zayıf','Daralma']},
 {k:'isz',l:'İşsizlik',u:'%',d:1,st:v=>v<7?'good':v<11?'warn':'bad',low:1,lb:['Düşük','Yüksek','Kritik']},
 {k:'acik',l:'Bütçe açığı / GSYH',u:'%',d:1,st:v=>v<3?'good':v<5.5?'warn':'bad',low:1,lb:['Dengeli','Sıkışık','Tehlike']},
 {k:'borc',l:'Dış borç / GSYH',u:'%',d:1,st:v=>v<40?'good':v<60?'warn':'bad',low:1,lb:['Rahat','Yüksek','Tehlike']},
 {k:'cari',l:'Cari açık',u:'mlr $',d:1,st:v=>v<20?'good':v<40?'warn':'bad',low:1,lb:['Rahat','Yüksek','Tehlike']},
 {k:'rez',l:'Net rezerv',u:'mlr $',d:1,st:v=>v>=40?'good':v>=15?'warn':'bad',lb:['Güçlü','İnce','Alarm']},
 {k:'kur',l:'Dolar / TL',u:'₺',d:2,st:()=>'warn',low:1,lb:['','Değer kaybı','']},
 {k:'des',l:'Halk desteği',u:'%',d:1,st:v=>v>=45?'good':v>=32?'warn':'bad',lb:['Güçlü','Kırılgan','Kritik']},
 {k:'par',l:'Parti içi birlik',u:'/10',d:1,st:v=>v>=7?'good':v>=4?'warn':'bad',lb:['Sağlam','Gergin','Yarılma']},
 {k:'kol',l:'Koalisyon uyumu',u:'/10',d:1,st:v=>v>=7?'good':v>=4?'warn':'bad',lb:['Sağlam','Gergin','Kopuyor']},
 {k:'ord',l:'Ordu memnuniyeti',u:'/10',d:1,st:v=>v>=7?'good':v>=4?'warn':'bad',lb:['Yüksek','Orta','Tehlike']},
 {k:'huz',l:'Toplumsal huzur',u:'/10',d:1,st:v=>v>=7?'good':v>=4?'warn':'bad',lb:['Sakin','Gergin','Patlama']},
 {k:'bat',l:'İtibar: Batı',u:'/10',d:1,st:v=>v>=7?'good':v>=4?'warn':'bad',lb:['İyi','Soğuk','Kopuk']},
 {k:'dog',l:'İtibar: Doğu',u:'/10',d:1,st:v=>v>=7?'good':v>=4?'warn':'bad',lb:['İyi','Soğuk','Kopuk']},
 {k:'bol',l:'İtibar: Bölge',u:'/10',d:1,st:v=>v>=7?'good':v>=4?'warn':'bad',lb:['İyi','Soğuk','Kopuk']}
];
const RANGE={enf:[2,300],buy:[-12,12],isz:[3,40],acik:[-2,20],borc:[10,150],cari:[2,90],rez:[-5,120],kur:[10,500],des:[0,100],par:[0,10],kol:[0,10],ord:[0,10],huz:[0,10],bat:[0,10],dog:[0,10],bol:[0,10],kamp:[-10,12]};
const LVR={faiz:[-10,500,5]};
const TERM=60,BAR=7;
/* Bakanlık: [anahtar, ad, taban bütçe (GSYH %), 100% artışın aylık etkisi] */
const MIN=[['egit','Milli Eğitim',3.2,{buy:.5,des:.3,huz:.3}],['saglik','Sağlık',2.4,{des:.5,huz:.3}],['calisma','Çalışma ve Sosyal Güvenlik',5,{des:.6,huz:.4,enf:.1}],['aile','Aile ve Sosyal Hizmetler',.9,{des:.4,huz:.5}],['sav','Milli Savunma',2.1,{ord:.14,cari:.03}],['ic','İçişleri',1.8,{huz:.6,des:.1}],['adalet','Adalet',.6,{bat:.5,des:.2,huz:.2}],['dis','Dışişleri',.2,{bat:.5,dog:.5,bol:.6}],['maliye','Hazine ve Maliye',2.5,{acik:-.4}],['tarim','Tarım ve Orman',.9,{enf:-.08,des:.2,cari:-.06}],['ulas','Ulaştırma ve Altyapı',1.8,{buy:.4,des:.2}],['enerji','Enerji ve Tabii Kaynaklar',.8,{cari:-.12,enf:-.08}],['sanayi','Sanayi ve Teknoloji',.7,{buy:.5,cari:-.1}],['ticaret','Ticaret',.2,{cari:-.1,enf:-.08}],['cevre','Çevre, Şehircilik ve İklim',1,{huz:.3,des:.3,buy:.2}],['genc','Gençlik ve Spor',.3,{des:.4,huz:.3}],['kultur','Kültür ve Turizm',.3,{cari:-.08,bat:.2}],['diyanet','Diyanet İşleri Başkanlığı',.3,{des:.1,huz:.1},1],['mit','Millî İstihbarat Teşkilatı',.1,{huz:.3,ord:.05},1],['afad','AFAD',.2,{huz:.3,des:.2},1],['ssb','Savunma Sanayii Başkanlığı',.4,{buy:.2,ord:.1,cari:-.05},1],['tubitak','TÜBİTAK',.1,{buy:.3,cari:-.05},1]];
const MB=Object.fromEntries(MIN.map(m=>[m[0],m[2]]));
/* Vergi: [anahtar, ad, tür (2 = mevcut vergi, 1 = yeni/ek vergi), toplam gelir (GSYH %, referans oranda), 10 puanlık %10 değişimin aylık etkisi, referans oran %] */
const TAX=[['kdv','KDV',2,5.5,{enf:0.2,des:-0.12,buy:-0.04},20],['otvyakit','ÖTV (akaryakıt)',2,1.5,{enf:0.15,des:-0.08,cari:-0.03},50],['otvoto','ÖTV (otomobil)',2,0.6,{des:-0.03,buy:-0.02},60],['otvtutun','ÖTV (tütün, alkol)',2,1,{des:-0.04,enf:0.05},60],['gelir','Gelir vergisi',2,4,{des:-0.15,buy:-0.04},27],['kurum','Kurumlar vergisi',2,2.5,{buy:-0.1,des:-0.04},25],['stopaj','Stopaj (menkul sermaye)',2,0.8,{buy:-0.03,rez:-0.03},10],['damga','Damga vergisi',2,0.5,{des:-0.03},0.9],['harc','Harçlar',2,0.5,{des:-0.03},5],['gumruk','Gümrük vergisi',2,0.7,{enf:0.05,cari:-0.05,bat:-0.02},5],['mtv','Motorlu Taşıtlar Vergisi',2,0.3,{des:-0.03},10],['emlak','Emlak vergisi',2,0.3,{des:-0.03,huz:-0.01},0.2],['veraset','Veraset ve intikal vergisi',2,0.1,{des:-0.01},5],['bsmv','BSMV (banka ve sigorta işlemleri)',2,0.3,{buy:-0.02},5],['iletisim','Özel iletişim vergisi',2,0.2,{des:-0.02},7.5],['lux','Lüks tüketim vergisi',1,0.25,{des:0.05,cari:-0.05},10],['banka','Bankalar ek vergisi',1,0.3,{des:0.08,buy:-0.04,bat:-0.02},5],['servet','Servet vergisi',1,0.35,{des:0.06,rez:-0.1,par:-0.03},1],['karbon','Karbon vergisi',1,0.25,{bat:0.04,buy:-0.06,des:-0.06},10],['tutun','Tütün, şeker, alkol ek vergisi',1,0.2,{des:-0.06},10],['dijital','Dijital hizmet vergisi',1,0.15,{bat:-0.05,des:-0.02},5],['kripto','Kripto işlem vergisi',1,0.1,{},1],['fazlakar','Fazla kâr vergisi',1,0.3,{des:0.05,buy:-0.05,bat:-0.02},10],['seker','Şeker ve tatlandırıcı vergisi',1,0.05,{des:-0.02},10],['ambalaj','Plastik ambalaj çevre vergisi',1,0.05,{bat:0.02,des:-0.01},10]];
const PK=['AKP','CHP','MHP','IYI','DEM','YRP'];
/* Gerçek partiler; liderler kurgusaldır. x: ideolojik eksen (−1 sol, +1 sağ), w: taban oy ağırlığı, want: istediği bakanlıklar */
const PART={AKP:{n:'AK Parti',x:.6,w:35,lead:'Kerem Aslanoğlu',want:['maliye','ic','dis','sav','ulas']},CHP:{n:'CHP',x:-.4,w:25,lead:'Deniz Yaltırık',want:['adalet','egit','saglik','calisma','cevre']},MHP:{n:'MHP',x:.8,w:10,lead:'Hakan Bozkurt',want:['ic','sav','dis','adalet','tarim']},IYI:{n:'İYİ Parti',x:.5,w:9,lead:'Nermin Karaca',want:['dis','sav','egit','sanayi','ic']},DEM:{n:'DEM Parti',x:-.7,w:9,lead:'Cemal Erdem',want:['kultur','egit','aile','cevre','calisma']},YRP:{n:'Yeniden Refah',x:.7,w:4,lead:'Osman Tekin',want:['calisma','aile','saglik','ticaret','enerji']}};
/* Yasa: [anahtar, ad, SS, gereken oy, muhalefetin destek eğilimi, açıklama, etki] */
const LAWS=[['vergiref','Vergi Reformu Yasası',3,301,.3,'Vergi sistemi sadeleşir, kayıt dışı azalır.',{acik:-.6,bat:.5,des:-.8}],['emekli','Emeklilik Yaşı Yasası',3,301,.2,'Emeklilik yaşı yükselir, sosyal güvenlik yükü hafifler.',{acik:-.4,des:-1.2,huz:-.3}],['yardim','Sosyal Yardım Yasası',3,301,.7,'Dar gelirlilere düzenli nakit destek.',{des:1.5,huz:.5,acik:.4}],['kira','Kira Düzenleme Yasası',3,301,.6,'Kira artışına tavan getirir.',{des:1.5,huz:.5,buy:-.2}],['calisma','Esnek Çalışma Yasası',3,301,.2,'İşverene esneklik, sendikalara tepki.',{buy:.3,isz:-.4,des:-1,huz:-.5}],['yerli','Yerli Üretim Teşvik Yasası',3,301,.5,'İthal girdi yerine yerli üretim teşviki.',{buy:.4,cari:-1,acik:.3,bat:-.2}],['medya','Medya Düzenleme Yasası',3,301,.1,'Yayın ve internet düzenlemesi.',{des:.3,bat:-1,huz:-.4}],['af','Af Yasası',3,301,.3,'Bazı suçlar için af çıkarır.',{des:-1,huz:-.3,kol:.3}],['askerlik','Askerlik Yasası',3,301,.6,'Askerlik süresi kısalır.',{des:1,ord:-.5}],['kadin','Kadın ve Çocuk Koruma Yasası',3,301,.8,'Şiddete karşı koruma güçlenir.',{des:1.2,bat:.6,huz:.4}],['ihale','Kamu İhale Yasası',3,301,.6,'Şeffaf ihale sistemi kurar.',{bat:.6,des:.5,par:-.3}],['yargi','Yargı Bağımsızlığı Yasası',3,301,.5,'Yargıda bağımsızlık güvencesi getirir.',{bat:1.2,des:.3,par:-.5}],['baraj','Seçim Barajı Düzenlemesi',3,301,.4,'Baraj %7\'den %5\'e iner.',{par:.3,kol:.5}],['kripto','Kripto Varlık Düzenlemesi',3,301,.4,'Kripto işlemlerine lisans ve vergi getirir.',{acik:-.2,bat:.3,par:.1,des:-.2}],['anayasa','Yeni Anayasa',5,360,.2,'Yönetim sistemini yeniden düzenler. 360 oy gerekir.',{des:-1,par:.5,bat:-.5}]];
/* Vaat: [anahtar, metin, sağlandı mı?] */
const VAAT=[['enf','Enflasyonu %25\'in altına indireceğim',()=>S.enf<25],['isz','İşsizliği %7\'nin altına çekeceğim',()=>S.isz<7],['buy','Ekonomiyi %4 büyüteceğim',()=>S.buy>=4],['acik','Bütçe açığını %3\'ün altına indireceğim',()=>S.acik<3],['kur','Doları 60 TL\'nin altında tutacağım',()=>S.kur<60],['rez','Rezervleri 50 milyar dolara çıkaracağım',()=>S.rez>=50],['huz','Toplumsal huzuru 7/10\'a çıkaracağım',()=>S.huz>=7],['vergi','Vergi yükünü azaltacağım',()=>eco().rev<0],['egit','Eğitim bütçesini %25 artıracağım',()=>S.bud.egit>=MB.egit*1.25],['saglik','Sağlık bütçesini %25 artıracağım',()=>S.bud.saglik>=MB.saglik*1.25],['sav','Savunmayı GSYH\'nin %3\'üne çıkaracağım',()=>S.bud.sav>=3],['anayasa','Yeni anayasayı çıkaracağım',()=>!!S.laws.anayasa],['kira','Kira düzenlemesini yasalaştıracağım',()=>!!S.laws.kira]];

const NAMES1=['Emre','Ayşe','Murat','Zeynep','Burak','Deniz','Gökhan','Selin','Tarık','Aylin','Onur','Nazlı','Barış','Melis','Yiğit','Sevgi'];
const NAMES2=['Karaca','Demirtaş','Erol','Yıldırım','Akbulut','Sezer','Tuna','Kaplan','Bayram','Özkan','Çelik','Aydemir','Türker','Gündoğdu','Polat','Somer'];
const ROLES={maliye:['Maliye Bakanı','Kur baskısı'],ic:['İçişleri Bakanı','Toplumsal huzur'],dis:['Dışişleri Bakanı','İtibar'],sav:['Milli Savunma Bakanı','Ordu memnuniyeti'],mb:['Merkez Bankası Başkanı','Enflasyon']};

/* ---------- Durum ---------- */
let S=null;
function newGame(){
  S={month:0,pool:12,tab:'masa',me:'AKP',pick:true,
   enf:48,buy:2.8,isz:9.2,acik:4.6,borc:48,cari:34,rez:22,kur:46,des:41,par:6,kol:6,ord:6,huz:5,bat:5,dog:5,bol:6,
   lv:{faiz:45},lv0:{faiz:45},
   fac:{R:35,G:40,S:25},
   M:{maliye:{name:'Selim Arda',sk:7,note:'Teknokrat, disiplinli, popülist harcamaya karşı'},ic:{name:'Kemal Yüce',sk:7,note:'Sert, güvenlik odaklı, emniyette güçlü'},dis:{name:'Leyla Aksoy',sk:7,note:'Deneyimli diplomat, dengeci'},sav:{name:'Cevdet Tamer',sk:8,note:'Orgeneral (E), yerli üretim savunucusu'},mb:{name:'Prof. Nihat Erdem',sk:7,note:'Bağımsızlıktan yana, faiz indirimine temkinli'}},
   used:[],sched:[],hist:{},log:[],cur:{events:[],spent:0},prev:null,report:null,over:null,confirm:null,flags:{},kamp:0};
  ensure();STATS.forEach(s=>S.hist[s.k]=[S[s.k]]);
  S.prev=snap();
  genEvents(['e_rez','i_sendika','d_multeci']);
  save();
}
const snap=()=>{const o={};STATS.forEach(s=>o[s.k]=S[s.k]);return o;};
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
function load(){try{const r=localStorage.getItem(KEY);if(r){S=JSON.parse(r);ensure();return true;}}catch(e){}return false;}
function ensure(){
  S.kamp=S.kamp||0;S.bud=S.bud||{};S.tax=S.tax||{};S.laws=S.laws||{};S.lawT=S.lawT||{};S.prom=S.prom||[];S.term=S.term||1;S.own=S.own||{};S.gdp=S.gdp||1350;
  MIN.forEach(m=>{if(S.bud[m[0]]===undefined)S.bud[m[0]]=m[2];if(!m[4]&&!S.M[m[0]])S.M[m[0]]=newM();});
  S.dif=S.dif===undefined?1:S.dif;S.sc=S.sc||0;S.ach=S.ach||{};S.done=S.done||{};S.sec=S.sec||{tur:50,tar:50,san:50,ene:50};if(S.mun===undefined)S.mun=10;S.h0=S.h0||0;S.cl=S.cl||[];S.dr=S.dr||{};if(S.gv===undefined)S.gv=50;if(S.hd===undefined)S.hd=Math.round(S.enf*.6);S.tr=S.tr||{};S.tr.x=S.tr.x||22.8;S.tr.m=S.tr.m||30.4;S.tr.pe=S.tr.pe||70;S.tar=S.tar||0;S.yl=S.yl||0;S.fta=S.fta||{};S.rg=S.rg||{};S.ri=S.ri||{};S.pri=S.pri||[];S.prg=S.prg||[];S.cpi=S.cpi||100;S.nd=S.nd||0;S.nk=S.nk||0;if(!S.pl){S.pl=[];poll();}
  S.ui=S.ui||{};S.cool=S.cool||{};S.loans=S.loans||[];S.pens=S.pens||17.2;S.minw=S.minw||28075;if(S.wage===undefined)S.wage=null;
  if(!S.taxv){const o=S.tax;S.tax={};TAX.forEach(t=>{const v=o[t[0]]||0;S.tax[t[0]]=t[2]===1?(v>0?t[5]:0):t[5]*(1+.1*v);});S.taxv=1;}
  TAX.forEach(t=>{if(S.tax[t[0]]===undefined)S.tax[t[0]]=t[2]===1?0:t[5];});
  S.lv={faiz:S.lv.faiz};S.lv0={faiz:S.lv0.faiz};
  if(!S.me||(S.seats&&S.seats.A!==undefined)){S.me='AKP';S.seats=null;S.coal=[];S.own={};}
  if(!S.seats)initGov();
  dunyaEnsure();toplumEnsure();piyasaEnsure();ileriEnsure();arayuzEnsure();
}
const levCost=()=>Object.keys(S.lv).filter(k=>S.lv[k]!==S.lv0[k]).length;
const avail=()=>99; /* Siyasi Sermaye kaldırıldı: eylemlerde bekleme süresi yok; tekrar edince etki azalır (secenek.js) */
const M=new Proxy({},{get:(_,k)=>S.M[k]});

