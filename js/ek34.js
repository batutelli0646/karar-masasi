/* ek34: diplomat kolordusu (aylık diplomasi hakkı), ayda tek polemik hakkı, huzur krizi zinciri, ordu bütçe talebi */
const dpE=()=>{S.dk=S.dk||{n:5,u:0,pl:0,msg:'',lh:0,lg:-99};return S.dk;};
const dpCap=()=>dpE().n;
const DPO={h:1,d:1};/* uact: h ve d diplomat hakkı kullanır, s polemik hakkı kullanır */
function dpBlock(pol){const d=dpE();if(pol){if(d.pl>=1)return 'Bu ay polemik hakkın kullanıldı.';return '';}if(d.u>=dpCap())return 'Diplomat hakkı bitti ('+d.u+'/'+dpCap()+').';return '';}
{const _u=uact;uact=function(a,id,k){const pol=a==='s',w=dpBlock(pol);if(w){dpE().msg=w;return render();}
  const n=S.log.length;_u.apply(this,arguments);if(S.log.length>n){const d=dpE();if(pol)d.pl++;else d.u++;d.msg='';}};}
{const _a=act29;act29=function(k,id){const a=UVA29.find(x=>x[0]===id);if(!a||uvOk29(k,a))return;const pol=id==='sa'||id==='bc',w=dpBlock(pol);if(w){dpE().msg=w;return render();}
  _a.apply(this,arguments);if(S.uxc&&S.uxc[k+id]===S.month){const d=dpE();if(pol)d.pl++;else d.u++;d.msg='';}};}
{const _v=uvOk29;uvOk29=function(k,a){const w=_v.apply(this,arguments);if(w)return w;return dpBlock(a[0]==='sa'||a[0]==='bc');};}
function dpHire(x){const d=dpE();if(x>0){if(d.n>=12)return;d.n++;S.acik+=.03;logA('Dışişleri','Diplomat kolordusu','Yeni diplomat atandı: toplam '+d.n+'.');}else{if(d.n<=3)return;d.n--;logA('Dışişleri','Diplomat kolordusu','Bir diplomat görevden alındı: toplam '+d.n+'.');}hap(20,520);save();render();}
function dpCard(){const d=dpE();return `<div class="panel"><b>Diplomat kolordusu</b> <span class="muted dl">bu ay ${d.u}/${d.n} diplomasi hakkı · polemik ${d.pl}/1</span>
<div class="note" style="margin:4px 0">Ülkelerle ilişki geliştirme, ikili anlaşma ve temas eylemleri diplomat başına ayda bir hak kullanır. Sert açıklama ve boykot ayda tek polemik hakkıdır. Her fazladan diplomat Dışişleri bütçesine küçük bir yük bindirir.${d.msg?' <b>'+d.msg+'</b>':''}</div>
<div class="step fw"><button class="dxa" data-dpn="1" ${d.n>=12?'disabled':''}><span>Diplomat ata</span><b>+0,004 açık/ay</b><i>›</i></button><button class="dxa" data-dpn="-1" ${d.n<=3?'disabled':''}><span>Diplomat azalt</span><b>en az 3</b><i>›</i></button></div></div>`;}
{const _k=V.ulke;V.ulke=()=>dpCard()+_k();}
document.addEventListener('click',ev=>{const t=ev.target.closest&&ev.target.closest('[data-dpn]');if(!t||t.disabled)return;ev.stopImmediatePropagation();ev.preventDefault();dpHire(+t.dataset.dpn);},true);
/* huzur krizi: huzur iki ay üst üste 2,2 altında kalırsa genel grev veya OHAL; ordunun yıllık bütçe talebi */
function ek34Up(){const h=[],d=dpE();d.u=0;d.pl=0;d.msg='';if(d.n>5)S.acik+=.004*(d.n-5);
  d.lh=S.huz<2.2?d.lh+1:0;
  if(d.lh>=2&&S.month-d.lg>=10){d.lg=S.month;d.lh=0;
    if(S.ord>=6){applyFx({des:-1.2,huz:1.4,bol:-.3,dog:-.3,buy:-.15});h.push('Sokaktaki gerilim OHAL ilanıyla bastırıldı: huzur geri geldi, ancak iç ve dış itibar zedelendi.');logA('Toplumsal huzur','OHAL','Huzur çöküşü üzerine olağanüstü hal ilan edildi.');}
    else{applyFx({des:-2.2,buy:-.35,ord:-.2,huz:.9});h.push('Genel grev ve kitlesel gösteriler ülkeyi felç etti; destek ve büyüme darbe aldı.');logA('Toplumsal huzur','Genel grev','Huzur çöküşü genel greve dönüştü.');}}
  if(S.ord>7)S.ord-=(S.ord-7)*.06;
  if(S.month>0&&S.month%12===0&&S.bud&&MB&&MB.sav){const r=S.bud.sav/MB.sav;
    if(r<.98){applyFx({ord:-.8,par:-.1});h.push('Genelkurmay savunma bütçesi talebinin karşılanmadığını kamuoyuna duyurdu; ordudaki memnuniyetsizlik arttı.');}
    else if(r>1.1){applyFx({ord:.3});h.push('Artan savunma bütçesi ordunun memnuniyetini yükseltti.');}}
  return h;}
{const _d=dunyaUp;dunyaUp=function(){const h=_d.apply(this,arguments);try{h.push(...ek34Up());}catch(e){}return h;};}
