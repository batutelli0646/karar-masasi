/* ek11: alt göstergeler (gıda, kira, enerji, rekolte, suç, mülteci, eğitim, sağlık, turizm) ve bunlara bağlı 6 politika */
PL.push(
['gstok','Tarım','Gıda tampon stoku','Hububat ve sebze-meyve stoku; gıda fiyat dalgalanmasını yumuşatır.',{acik:.12,des:.03},{ciftci:3,ucret:2,kentli:1}],
['tarsig','Tarım','Tarım sigortası ve girdi desteği','Kuraklık ve don zararına karşı sigorta; rekolte kaybı yarıya iner.',{acik:.1,des:.03},{ciftci:6,dogu:2}],
['kiratavan','Sosyal','Kira artış sınırı','Yıllık kira artışına tavan; kaldırılınca bastırılmış baskı geri döner.',{des:.08,acik:.05,buy:-.05,enf:.02},{genc:5,ucret:3,esnaf:-3}],
['enstok','Enerji','Stratejik enerji stoku','Petrol ve gaz alım stoku; fiyat şoklarının etkisi azalır.',{acik:.12,rez:-.05},{sanayi:3,kentli:1}],
['asayis','Güvenlik','Mahalle asayiş timleri','Kentlerde suç önleme ve görünür polislik.',{acik:.1,huz:.05},{kentli:3,genc:-2}],
['mulgeri','Sosyal','Gönüllü geri dönüş programı','Güvenli bölgelere gönüllü geri dönüş ve uyum desteği.',{acik:.1,bat:-.03,huz:.02},{dogu:-2,kentli:2}]);
const pa=id=>S.pol&&S.pol[id]?plm(id):0;
const enDep=()=>clamp(74-.2*S.sec.ene-4*pa('yeka')-3*pa('nukleer'),40,80);
function dxEnsure(){if(!S.dx)S.dx={g:100,k:100,e:100,rk:100,sc:48,mu:3,ed:cov(SV[1]),bb:11.5-cov(SV[0])*.035,kb:0,k0:S.kur,hg:[100],hk:[100],p:null,cd:0};return S.dx;}
const yy=(v,a)=>a.length<4?null:(Math.pow(v/a[0],12/(a.length-1))-1)*100;
function dxUp(){const h=[];try{const d=dxEnsure(),r=S.enf/12,dk=(S.kur/d.k0-1)*100,A=Math.random;d.k0=S.kur;d.cd=Math.max(0,d.cd-1);
  d.p={g:yy(d.g,d.hg),k:yy(d.k,d.hk),e:d.e,rk:d.rk,sc:d.sc,mu:d.mu,ed:d.ed,bb:d.bb};
  /* enerji fiyatı: ortalamaya dönen rastgele yürüyüş ve ara sıra şok */
  const sh=A()<.04?(A()<.65?1:-1)*(6+A()*8):0;let de=((100-d.e)*.03+A()*4.4-2.2+sh)*(1-.35*pa('enstok'));d.e=clamp(d.e*(1+de/100),55,200);
  const dp=enDep()/74;applyFx({cari:.35*de*dp*d.e/100,enf:.02*de*dp});
  if(Math.abs(sh)>0&&d.cd<=0){d.cd=3;h.push(sh>0?'Enerji fiyatları sert yükseldi; ithalat faturası ve cari açık baskı altında.':'Enerji fiyatları belirgin düştü; ithalat faturası hafifledi.');}
  /* rekolte: yılda bir, hava koşulu ve tarım sektörüne bağlı */
  if(S.month%12===8){const n=A()<.22?-(8+A()*14):A()*16-4;d.rk=clamp(100+(n<0?n*(1-.5*pa('tarsig')):n)+(S.sec.tar-50)*.1,70,115);h.push(d.rk<92?'Rekolte beklentinin altında kaldı; gıda fiyatlarında baskı artabilir.':d.rk>104?'Bu yılın rekoltesi iyi; gıda fiyatlarına olumlu yansıyor.':'Rekolte normal seviyede.');}
  /* gıda fiyatı */
  const gm=Math.max(-.5,r+.25*dk+(100-d.rk)*.012-.4*pa('gstok'));d.g*=1+gm/100;applyFx({enf:.15*(gm-r)});d.hg.push(d.g);if(d.hg.length>13)d.hg.shift();
  const ga=yy(d.g,d.hg);if(ga!==null){const ex=ga-S.enf;if(ex>6)applyFx({des:-Math.min(.25,(ex-6)*.02),huz:-.03});else if(ex<-6)applyFx({des:.05});if(ex>10&&d.cd<=0){d.cd=4;h.push('Gıda fiyatları yıllık %'+nf(ga,0)+' arttı; mutfak enflasyonu genel enflasyonun üzerinde.');}}
  /* kira */
  let km=r*.95+.15+(68-cov(SV[3]))*.008+Math.max(0,d.mu-3)*.05;
  if(pa('kiratavan')){const c=Math.min(km,r*.6*(1-.3*(pa('kiratavan')-1)));d.kb+=km-c;km=c;}else if(d.kb>0){const rl=d.kb*.12;d.kb-=rl;km+=rl;}
  d.k*=1+km/100;d.hk.push(d.k);if(d.hk.length>13)d.hk.shift();
  const ka=yy(d.k,d.hk);if(ka!==null){const ek=ka-S.enf;if(ek>8)applyFx({des:-Math.min(.2,(ek-8)*.015)});if(ek>12&&d.cd<=0){d.cd=4;h.push('Kiralar yıllık %'+nf(ka,0)+' yükseldi; kiracılar tepkili.');}}
  /* suç endeksi */
  d.sc=clamp(d.sc+((45+(S.isz-9)*1.1+(gini()-.41)*60-(cov(SV[2])-72)*.5+(S.huz<4?6:0)-6*pa('asayis'))-d.sc)*.08+A()*1.6-.8,10,100);
  if(d.sc>55)applyFx({huz:-(d.sc-55)*.004});else if(d.sc<45)applyFx({huz:(45-d.sc)*.002});if(d.sc>65)applyFx({des:-(d.sc-65)*.01});
  /* mülteci sayısı */
  d.mu=clamp(S.ref===undefined?d.mu:S.ref,.3,8);
  if(d.mu>3.5)applyFx({des:-(d.mu-3.5)*.04,huz:-(d.mu-3.5)*.01});
  /* eğitim kalitesi ve bebek ölümü: bütçeye yavaş tepki verir */
  d.ed+=(cov(SV[1])-d.ed)*.04;d.bb+=((11.5-cov(SV[0])*.035)-d.bb)*.04;applyFx({buy:(d.ed-78)*.0015,des:(9-d.bb)*.01});
  d.ed=clamp(d.ed,20,100);d.bb=clamp(d.bb,3,20);
}catch(e){}return h;}
const dxTr=()=>(40+.42*S.sec.tur)*(1+(S.huz-5)*.015);
const ar=(c,p,lowGood)=>p==null||Math.abs(c-p)<.005?'':`<span style="color:var(--${(c<p)===!!lowGood?'good':'bad'});margin-left:4px">${c>p?'▲':'▼'}</span>`;
function gostP(){const d=dxEnsure(),P=d.p||{},ga=yy(d.g,d.hg),ka=yy(d.k,d.hk),R=(a,b,c)=>kv(a,b+(c||''));
  return `<h2>Alt göstergeler</h2><div class="panel"><b>Fiyatlar</b>${R('Gıda fiyatları (yıllık)',ga===null?'veri toplanıyor':'%'+nf(ga,1),ga===null?'':ar(ga,P.g,1))}${R('Kira (yıllık)',ka===null?'veri toplanıyor':'%'+nf(ka,1),ka===null?'':ar(ka,P.k,1))}${R('Enerji fiyat endeksi',nf(d.e,0),ar(d.e,P.e,1))}${R('Enerji ithalat bağımlılığı','%'+nf(enDep(),0))}${R('Enerji faturası (yıllık)',nf(70*enDep()/74*d.e/100,0)+' milyar $')}${R('Rekolte endeksi',nf(d.rk,0),ar(d.rk,P.rk))}<div class="note">Endeksler oyun başında 100. Gıda ve kira enflasyonun, kurun ve rekoltenin ardından gelir; yıllık oran ilk 3 ay hesaplanmaz.</div></div>
  <div class="panel"><b>Toplum ve hizmet sonuçları</b>${R('Suç endeksi (50 = ortalama)',nf(d.sc,0),ar(d.sc,P.sc,1))}${R('Mülteci sayısı',nf(d.mu,2)+' milyon',ar(d.mu,P.mu,1))}${R('Eğitim kalite endeksi',nf(d.ed,0),ar(d.ed,P.ed))}${R('Bebek ölümü',nf(d.bb,1)+' ‰',ar(d.bb,P.bb,1))}${R('Gini katsayısı',nf(gini(),3))}${R('Yolsuzluk algısı',nf(yzI(),0)+' / 100 (yüksek kötü)')}<div class="note">Eğitim ve sağlık göstergeleri bütçeye yavaş tepki verir; etkileri aylar sonra görülür.</div></div>
  <div class="panel"><b>Dış gelir ve finans</b>${R('Turizm geliri (yıllık)',nf(dxTr(),0)+' milyar $')}${R('Risk primi',nf(rsk(),1)+' puan')}${R('10 yıllık tahvil faizi','%'+nf(tvf(),1))}<div class="note">Turizm geliri Turizm sektörünün seviyesine ve huzura bağlıdır, cari açığa sektör üzerinden zaten yansır. Kararların etkisi: Politikalar ekranında gıda stoku, tarım sigortası, kira sınırı, enerji stoku, asayiş timleri ve geri dönüş programı yer alır.</div></div>`;}
GR[1][2].push('gost');SUBN.gost='Alt göstergeler';V.gost=gostP;
