/* ---------- Arayüz: ajanda, rozetler, trendler, arama, görünüm ayarları, karar etki okları ---------- */
const norm=s=>String(s).toLocaleLowerCase('tr').replace(/ı/g,'i').normalize('NFD').replace(/[̀-ͯ]/g,'');
function arayuzEnsure(){if(!S.th)S.th={};['b','kn','uns','gd','yz','kr'].forEach(k=>{if(!S.th[k])S.th[k]=[];});S.ara=null;}
/* sekme rozetleri: bekleyen iş sayısı */
function RZ(){const r={},add=(k,n)=>{if(n>0)r[k]=(r[k]||0)+n;};if(!S.pz||!S.lb||!S.og)return r;
  add('karar',S.cur.events.filter(e=>e.ch===null).length);add('ulke',(S.ta||[]).length);add('orgut',ORG.filter(o=>S.og[o[0]].dec&&S.og[o[0]].dec.left<=1).length);
  add('lobi',LB.filter(l=>S.lb[l[0]].ey>0).length);add('piyasa',(S.pz.fa<-3?1:0)+(S.pz.kn<30?1:0));add('ssan',S.sy&&S.sy.amb>0?1:0);
  add('kabine',Object.keys(S.M).filter(k=>S.M[k].gv<35).length);add('toplum',(uns()>60?1:0)+(S.krz&&S.krz.length?1:0));add('askeri',natoAskida()?1:0);return r;}
const rz=(ks,r)=>{const n=[].concat(ks).reduce((a,k)=>a+((r||RZ())[k]||0),0);return n?` <i class="bdg">${n}</i>`:'';};
/* masa: "bu ay dikkat" listesi */
function ajanda(){const L=[],a=(t,k,c)=>L.push([t,k,c]);if(!S.pz||!S.lb||!S.og)return '';
  const w=S.cur.events.filter(e=>e.ch===null).length;if(w)a(`${w} karar bekliyor`,'karar','warn');
  if(S.ta&&S.ta.length)a(`${S.ta.length} ülke talebi bekliyor`,'ulke','warn');
  ORG.forEach(o=>{const g=S.og[o[0]];if(g.dec&&g.dec.left<=1)a(`${o[1]} oylaması bu ay`,'orgut','warn');});
  LB.forEach(l=>{const o=S.lb[l[0]];if(o.ey>0)a(`${l[1]} eylemde`,'lobi','bad');else if(o.t<-20)a(`${l[1]} mesafeli`,'lobi','warn');});
  if(S.pz.fa<-3)a('Yabancı sermaye çıkıyor','piyasa','bad');if(S.pz.kn<30)a('Kredi notu çok düşük','piyasa','bad');if(S.sy.amb>0)a('Savunma sanayii ambargoda','ssan','bad');
  if(natoAskida())a('NATO ayrıcalıkları askıda','askeri','bad');const u=uns();if(u>60)a('Toplumsal huzursuzluk yüksek','toplum','bad');else if(u>40)a('Toplumsal huzursuzluk artıyor','toplum','warn');
  Object.keys(S.M).forEach(k=>{if(S.M[k].gv<35)a(`${S.M[k].name} güven kaybediyor`,'kabine','warn');});
  const l=TERM-S.month%TERM;if(l<=6)a(`Seçime ${l} ay kaldı`,'kampanya','warn');
  return `<div class="panel"><b>Bu ay dikkat</b>${L.length?L.slice(0,8).map(([t,k,c])=>`<button class="ag ${c}" data-go="${k}"><i></i><span>${t}</span><small>${SUBN[k]}</small></button>`).join(''):'<div class="dl" style="margin-top:4px">Şimdilik acil bir şey yok.</div>'}</div>`;}
/* trendler: her ay kaydedilir */
function arayuzUp(){arayuzEnsure0();const t=S.th,p=(k,v)=>{t[k].push(Math.round(v*100)/100);if(t[k].length>60)t[k].shift();};
  p('b',S.pz.b);p('kn',S.pz.kn);p('uns',uns());p('gd',gDev());p('yz',S.bu.yz);p('kr',krSc());return [];}
const arayuzEnsure0=()=>{if(!S.th)S.th={};['b','kn','uns','gd','yz','kr'].forEach(k=>{if(!S.th[k])S.th[k]=[];});};
function trendP(){if(!S.th||!S.pz||!S.bu)return '';const T=S.th,R=[['Borsa endeksi','b',S.pz.b,0],['Kredi notu','kn',S.pz.kn,0],['Huzursuzluk','uns',uns(),0],['Grup memnuniyeti','gd',gDev(),1],['Yolsuzluk algısı','yz',S.bu.yz,0],['Dönem karnesi','kr',krSc(),0]];
  return `<div class="panel"><b>Trendler</b>${R.map(([n,k,v,s])=>`<div class="trow"><span class="dl">${n}</span><b class="dl">${s&&v>0?'+':''}${nf(v,0)}</b>${spark(T[k]||[])}</div>`).join('')}<div class="note">Son 5 yılın aylık seyri. Gösterge kutularına dokunarak ana göstergelerin grafiğini açabilirsin.</div></div>`;}
/* arama */
const IDX=[['masa','enflasyon büyüme işsizlik rezerv kur destek gösterge özet trend'],['karar','olay karar faiz'],['harita','il bölge miting'],['butce','bakanlık harcama bütçe açık'],['vergi','kdv gelir kurumlar vergi ötv'],['piyasa','borsa tahvil kredi notu yabancı sermaye kontrolü özelleştirme'],['sektor','turizm tarım sanayi enerji sektör'],['ticaret','ihracat ithalat ticaret ortak'],['toplum','emekli işçi esnaf çiftçi genç grup memnuniyet huzursuzluk sokak'],['hizmet','sağlık eğitim afet hizmet'],['nufus','nüfus göç mülteci sınır yaş'],['politika','politika kira yardım ikramiye katalog'],['lobi','sendika grev iş dünyası baro oda stk vakıf cemaat lobi'],['meclis','yasa oylama koalisyon muhalefet'],['kabine','bakan atama görevden merkez bankası hizip'],['buro','yolsuzluk liyakat kadrolaşma soruşturma kapasite bürokrasi'],['donem','karne not vaat arşiv'],['kampanya','seçim kampanya vaat anket'],['kurum','kurum merkez bankası'],['dis','anlaşma proje ittifak savunma siha'],['ulke','ülke ilişki heyet talep abd rusya çin almanya azerbaycan'],['orgut','nato ab bm g20 örgüt önerge'],['askeri','ordu asker talim komutan hazırlık'],['ssan','savunma sanayii ihracat ambargo silah'],['diger','ayar tema yazı boyutu kayıt ses günlük başarım yeni oyun']];
const araRes=q=>{const w=norm(q).split(/\s+/).filter(Boolean),r=IDX.filter(([k,kw])=>!w.length||w.every(x=>norm(SUBN[k]+' '+kw).includes(x))).slice(0,w.length?12:8);
  return r.length?r.map(([k])=>`<button class="ag" data-go="${k}"><i></i><span>${SUBN[k]}</span><small>${grp2(k)}</small></button>`).join(''):'<div class="dl">Sonuç yok.</div>';};
const grp2=k=>(GR.find(g=>g[2].includes(k))||[0,''])[1];
const araSheet=()=>S.ara?`<div class="sheet"><div class="sheet-in"><input id="araq" class="aq" placeholder="Ara: lobi, ambargo, göç, karne…" autocomplete="off"><div id="arasonuc">${araRes('')}</div><button class="btn sec" data-arax="1" style="width:100%;margin-top:8px">Kapat</button></div></div>`:'';
document.addEventListener('input',ev=>{if(ev.target.id==='araq')document.getElementById('arasonuc').innerHTML=araRes(ev.target.value);});
/* görünüm ayarları: yazı boyutu, yazı tipi, etki okları */
function arayuzApply(){try{const d=document.documentElement,a=(k,v)=>v&&v!=='1'&&v!=='tm'?d.setAttribute(k,v):d.removeAttribute(k);a('data-fs',ls('km-fs'));a('data-font',ls('km-ff'));}catch(e){}}
const ayar2=()=>{const C=(k,def,l)=>`<div class="chips" style="margin:6px 0 10px">${l.map(([v,n])=>`<button class="btn sm ${(ls(k)||def)===v?'':'sec'}" data-set="${k}:${v}">${n}</button>`).join('')}</div>`;
  return `<div class="panel"><div class="dl">Yazı boyutu</div>${C('km-fs','1',[['0.92','Küçük'],['1','Normal'],['1.12','Büyük'],['1.25','Çok büyük']])}<div class="dl">Yazı tipi</div>${C('km-ff','tm',[['tm','Tomorrow'],['sys','Sistem']])}<div class="dl">Karar etki okları</div>${C('km-ar','1',[['1','Açık'],['0','Kapalı']])}</div>`;};
const fxArr=c=>{const ar=ls('km-ar')!=='0'&&c.fx,a=ar?Object.keys(c.fx).map(k=>[k,c.fx[k],STATS.find(s=>s.k===k)]).filter(x=>x[2]&&x[1]).sort((x,y)=>Math.abs(y[1])/(RANGE[y[0]][1]-RANGE[y[0]][0])-Math.abs(x[1])/(RANGE[x[0]][1]-RANGE[x[0]][0])).slice(0,6):[];
  if(!ar)return '';return a.length||c.fn?`<span class="ars">${a.map(([k,v,s])=>`<i class="ar ${(v<0)===!!s.low?'good':'bad'}">${SH[k]} ${v>0?'▲':'▼'}</i>`).join('')}${c.fn?'<i class="ar">sonuç şansa bağlı</i>':''}</span>`:'';};
function arayuzClick(t){const d=t.dataset;
  if(d.go){S.tab=d.go;S.ara=null;S.evo=null;save();render();window.scrollTo(0,0);return true;}
  if(d.ara){S.ara=1;render();setTimeout(()=>{const i=document.getElementById('araq');i&&i.focus&&i.focus();},60);return true;}
  if(d.arax){S.ara=null;render();return true;}
  if(d.set){const [k,v]=d.set.split(':');ls(k,v);arayuzApply();render();return true;}
  return false;}
arayuzApply();
