/* Yeni politikalar (sağlık, göç, sanayi) ve gerçekte yürürlükte olan yasalar */
PL.push(
['sehirh','Sağlık','Şehir hastaneleri ve yatak kapasitesi','Yatak sayısı artar, kamu-özel ortaklığı ödemeleri bütçeye yük olur.',{des:.06,acik:.14,huz:.02},{emekli:3,kamu:1}],
['yerlil','Sağlık','Yerli ilaç ve tıbbi cihaz üretimi','Yerli üretim ilaç alımı; ithalat azalır.',{cari:-.06,acik:.1,buy:.03,bat:.01},{sanayi:3,emekli:1}],
['ruhsag','Sağlık','Ruh sağlığı ve bağımlılıkla mücadele','Okullarda psikolog, tedavi merkezleri.',{huz:.04,des:.03,acik:.07},{genc:4,muhaf:2}],
['randevu','Sağlık','Randevu ve bekleme süresi programı','Ameliyat ve MR bekleme süreleri kısalır.',{des:.06,acik:.09,huz:.02},{emekli:3,ucret:2}],
['tamsig','Sağlık','Cepten ödemeyi sınırlama','Ek ücret ve ilaç katkı payı sınırı getirilir.',{des:.05,acik:.12,enf:-.01},{emekli:4,ucret:2}],
['abmult','Göç','AB mülteci finansmanı anlaşması','AB, geri kabul karşılığı finansman verir.',{bat:.05,acik:-.1,huz:-.01},{milli:-2,kentli:2}],
['vatand','Göç','Oturum ve vatandaşlık şartlarını sıkılaştır','Süre ve dil şartı yükselir.',{huz:.02,bat:-.03,des:.03},{milli:4,kentli:-2}],
['gonulld','Göç','Gönüllü geri dönüş ve güvenli bölge','Komşu ülkede konut ve altyapıyla geri dönüş.',{huz:.03,acik:.08,des:.04},{milli:4,dogu:-1}],
['kayitdis','Göç','Kayıt dışı yabancı işçi denetimi','Sigortasız çalıştırmaya ağır ceza.',{isz:-.03,acik:-.05,huz:.02},{ucret:3,esnaf:-2}],
['kamp','Göç','Kamplar ve insani yardım programı','Barınma, gıda ve sağlık; uluslararası itibar kazandırır.',{bat:.04,acik:.12,des:-.03},{kentli:2,milli:-3}],
['osb','Sanayi','OSB altyapı ve enerji desteği','Organize sanayide ucuz elektrik ve arsa.',{buy:.05,acik:.1,isz:-.02},{sanayi:5,esnaf:2}],
['arge','Sanayi','Ar-Ge ve tasarım vergi indirimi','Ar-Ge harcamalarına yüksek vergi indirimi.',{buy:.04,acik:.07,bat:.02},{sanayi:4,genc:3}],
['cip','Sanayi','Çip ve savunma elektroniği yatırımı','Kritik teknolojide yerli üretim.',{cari:-.05,acik:.12,ord:.02,buy:.03},{milli:3,genc:3,sanayi:2}],
['kobid','Sanayi','KOBİ dijital dönüşüm hibesi','Küçük işletmelere yazılım ve e-ticaret hibesi.',{buy:.04,acik:.06,isz:-.02},{esnaf:5,genc:2}]
);
/* Gerçek Türkiye'de zaten yürürlükte olan düzenlemeler yeni oyunda başlangıçta yasalaşmış sayılır (etkileri başlangıç değerlerine işlenmiştir). */
const REALL=['kadin','ihale','medya','hayvan','kripto','siber','iklim','maden','gelirdv','tuketici','dogum','mesleki','tapu','enerji','nukl','sosyalg','sigara','spor','gida','iltica','savunma','harc','sendika','grev','ozel2','deprem','cevre','kultur','calisma','yerli','yardim','konut','kamuist','israf','turizm'];
window.kmRealLaws=()=>{S.laws=S.laws||{};REALL.forEach(id=>{if(LAWS.some(l=>l[0]===id)&&!S.laws[id])S.laws[id]=.001;});};
{const _s=startGame;startGame=function(k){const r=_s.apply(this,arguments);try{kmRealLaws();save();}catch(e){}return r;};}
