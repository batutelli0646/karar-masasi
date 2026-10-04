/* ek19: Dış İlişkiler gerçekçilik kuralları — hangi ülkeyle hangi anlaşma, temas ve talep mümkün */
const ENR=['rus','aze','irn','irq','qat','sau','uae','kaz','tkm','lby','nga','geo','uzb','kwt','bgr'],KOM=['gre','bgr','geo','aze','irn','irq','syr','arm','kktc'],
  AB_=['ger','fra','ita','esp','nld','pol','swe','bgr','hun','gre'],TRN=['rus','irn','irq','aze','geo','bgr','gre','syr','kaz','uzb','tkm','chn','arm','ukr'],
  GCM=['syr','irq','irn','pak','lby','som','nga','egy','jor','gre','bgr','ukr','ind'],
  PKG={sav:['usa','uk','ita','fra','ger','esp','nld','pol','swe','can','bgr','hun','aze','pak','qat','som','kktc','lby','kwt','jor','kor','ukr','geo','uzb','kaz','sau','uae'],
  sinir:KOM,ask:['qat','som','aze','kktc','lby','syr','pak','kwt'],enj:ENR};
const pkOk=(id,k)=>k==='tic'?!AB_.includes(id):k==='ist'?!['isr','gre','arm','irn','chn'].includes(id):PKG[k]?PKG[k].includes(id):true;
/* ültimatom: 0 ticaret, 1 deniz/yetki alanı, 2 vatandaşlar, 3 yaptırım, 4 özür */
const ULG={1:['gre','egy','lby'],2:['usa','ger','uk','fra','ita','rus','chn','irn','irq','egy','sau','uae','isr','syr','gre','esp','nld','pol','swe','can','bgr','hun'],
  3:['usa','ger','uk','fra','ita','esp','nld','pol','swe','can','bgr','hun','gre'],4:['usa','ger','uk','fra','ita','esp','nld','pol','swe','can','bgr','hun','gre','rus','chn','irn','isr','egy','syr','ind','arm']};
const ulOk=(id,i)=>ULG[i]?ULG[i].includes(id):true;
const ulKs=id=>{const k=ui('ulK',0);if(ulOk(id,k))return k;for(let i=0;i<ULK.length;i++)if(ulOk(id,i))return i;return 0;};
/* temas türleri */
const uSet=(n,f)=>{const u=UHO.find(x=>x[0]===n);if(u)u[4]=c=>f(c[0]);};
['Savunma sanayii görüşmesi','Savunma sanayii ortaklığı görüşmesi'].forEach(n=>uSet(n,i=>!['gre','isr','irn','arm','syr','kktc'].includes(i)));
uSet('Enerji anlaşması görüşmesi',i=>ENR.includes(i));
uSet('Enerji işbirliği görüşmesi',i=>ENR.includes(i)||['egy','chn','ind','jpn','kor','usa'].includes(i));
uSet('Su ve enerji ortak projesi',i=>['irq','syr','geo','aze','bgr','irn'].includes(i));
uSet('Havayolu seferleri ve sınır kapısı',i=>KOM.includes(i));
uSet('Arabulucu ve insani yardım',i=>['syr','irq','egy','isr','ukr','rus','irn','lby','som'].includes(i));
/* yinelenen yasalar ve gerçeğe uymayan anlaşma/temas kayıtları */
['veri','kadin2','ihale2'].forEach(id=>{const i=LAWS.findIndex(l=>l[0]===id);if(i>=0)LAWS.splice(i,1);});
{const i=DEALS.findIndex(d=>d[0]==='gb_ab');if(i>=0){DEALS.splice(i,1);delete DQ.gb_ab;AL.length=0;AL.push(...DEALS,...PROJ,...PRIV);}}
DQ.nukleer2=['jpn','kor'];DQ.ots=['aze','kaz','uzb','tkm'];DQ.golf=['sau','qat','uae','kwt'];DQ.korfez_yat=['qat','sau','uae','kwt'];
{const d=DEALS.find(x=>x[0]==='kor_sav');if(d)d[4]='Altay tankı için motor ve zırh teknolojisi, ortak savunma projeleri.';}
['Ticari yaptırım uygula','Ticarette kısıtlama'].forEach(n=>uSet(n,i=>!['kktc','aze','som','pak','qat'].includes(i)));
['Büyükelçiyi istişareye çağır','Büyükelçiyi istişare için geri çağır','Protesto notası'].forEach(n=>uSet(n,i=>i!=='kktc'));
