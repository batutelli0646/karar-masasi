/* ek25: zorluk dengesi. Yüksek reel faizin bedeli, destek doygunluğu, enflasyon direnci, açık baskısı ve dış şoklar.
   Şiddet: Kolay 0 (eski denge), Normal yarım, Zor tam. */
const zk25=()=>[0,.5,1][S.dif===undefined?1:S.dif]||0;
{const _s=simulate;simulate=function(){const d=_s.apply(this,arguments);try{const z=zk25();if(!z)return d;const s=S,rr=s.lv.faiz-s.enf,ex=Math.max(0,Math.min(rr,30)-8),ak=Math.max(0,s.acik-5);
  if(ex>0){s.buy-=z*.03*ex;s.isz+=z*.01*ex;S.acikP=(S.acikP||0)+z*.006*ex;s.des-=z*.006*ex;s.rez-=z*.04*Math.max(0,rr-3);} /* reel faiz çok yüksekse büyüme, istihdam, bütçe ve destek bedel öder */
  s.enf+=z*.018*Math.max(0,Math.min(s.enf,80)-12); /* enflasyon yapışkan: düşmesi için sıkı politika gerekir */
  s.kur*=1+z*.0012*ak;s.rez-=z*.15*ak; /* bütçe açığı kur ve rezerv üzerinde baskı yapar */
  if(s.des>55)s.des-=z*.1*(s.des-55); /* destek zirvede doygunlaşır */
  for(const k in RANGE)s[k]=clamp(s[k],RANGE[k][0],RANGE[k][1]);}catch(e){}return d;};}
const dsk25=[['Petrol fiyatları fırladı','Enerji ithalatı pahalandı.',{enf:2.2,cari:-1.6,buy:-.2}],['Küresel risk iştahı düştü','Yabancı fonlar gelişen piyasalardan çıkıyor.',{kur:5,rez:-4}],['Dış talep daraldı','İhracat siparişleri azaldı.',{buy:-.8,isz:.5,cari:-1}],['Kuraklık','Hasat beklentilerin altında kaldı.',{enf:1.4,cari:-1,des:-1}],['Küresel faiz artışı','Dış borç maliyeti yükseldi.',{rez:-3,acik:.35,kur:2}]];
{const _e=endTurn;endTurn=function(){let k=null;try{const z=zk25();if(z&&!S.over&&Math.random()<z*.05){k=dsk25[Math.floor(Math.random()*dsk25.length)];applyFx(k[2]);logA('Dış şok',k[0],k[1]);}}catch(e){k=null;}
  const r=_e.apply(this,arguments);try{if(k&&S.report&&Array.isArray(S.report.h)&&!S.over){S.report.h.unshift('Dış şok: '+k[0]+'. '+k[1]);save();render();}}catch(e){}return r;};}
