/* Ana menü: uygulama açılışında gelen ekran. Eski Diğer sekmesindeki oyun, kayıt, ayar ve istatistik bağlantıları burada. */
(function(){
let hm=1,hs=null;
const has=()=>!!(S&&!S.pick&&S.hist&&S.me);
const css=document.createElement?document.createElement('style'):{};
css.textContent='.hm{max-width:460px;margin:0 auto;padding:calc(26px + env(safe-area-inset-top,0px)) 0 40px;display:flex;flex-direction:column;gap:12px}'
+'.hm .lg{align-self:center;width:76px;height:76px;border-radius:20px;border:1px solid var(--line);box-shadow:0 0 28px var(--glow2);display:block}'
+'.hm .ti{text-align:center;font-family:var(--display);font-weight:700;font-size:40px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);line-height:1;margin-top:6px}'
+'.hm .su{text-align:center;font-family:var(--display);font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--muted);margin:2px 0 14px}'
+'.hm .co{display:flex;align-items:center;gap:12px;text-align:left;width:100%;padding:12px 14px;border:1px solid var(--accent);border-radius:12px;background:var(--pn);color:var(--ink);cursor:pointer;font:inherit}'
+'.hm .co .bd{flex:none;width:52px;height:52px;border-radius:12px;border:1px solid var(--line);background:var(--surface2);display:grid;place-items:center;font-family:var(--display);font-weight:700;font-size:18px;letter-spacing:.06em;color:var(--accent)}'
+'.hm .co .tx{flex:1;min-width:0}.hm .co small{display:block;font-family:var(--display);font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--accent)}'
+'.hm .co b{display:block;font-family:var(--display);font-size:20px;line-height:1.15}.hm .co span{color:var(--muted);font-size:12px}'
+'.hm .co .pl{flex:none;width:42px;height:42px;border-radius:50%;border:1px solid var(--accent);color:var(--accent);display:grid;place-items:center;font-size:16px}'
+'.hm .nw{width:100%;min-height:56px;font-size:19px;letter-spacing:.14em;border-radius:12px}'
+'.hm .ol{width:100%;min-height:50px;display:flex;align-items:center;justify-content:center;gap:10px;border:1px solid var(--line);border-radius:12px;background:var(--pn);color:var(--ink);font-family:var(--display);font-weight:700;font-size:16px;letter-spacing:.14em;text-transform:uppercase;cursor:pointer}'
+'.hm .r4{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}'
+'.hm .r4 button{min-height:72px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;border:1px solid var(--line);border-radius:12px;background:var(--pn);color:var(--ink);font-family:var(--display);font-weight:700;font-size:11px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;padding:6px 2px;min-width:0}'
+'.hm .r4 button span{font-size:22px;color:var(--accent);line-height:1}.hm button:disabled{opacity:.4;cursor:default}'
+'.hm .vr{text-align:center;color:var(--muted);font-family:var(--display);font-size:12px;letter-spacing:.2em;margin-top:8px}'
+'.hm .tp{display:flex;align-items:center;gap:10px;margin-bottom:6px}.hm .tp b{font-family:var(--display);font-size:22px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent)}'
+'.hm .bk{width:40px;height:40px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--accent);font-size:22px;line-height:1;cursor:pointer}'
+'.hm .ol:focus-visible,.hm .co:focus-visible,.hm .r4 button:focus-visible,.hm .bk:focus-visible{outline:2px solid var(--accent);outline-offset:2px}'
+'.hm .tx2{color:var(--ink);font-size:14px;line-height:1.55}.hm .tx2 p{margin:0 0 8px}';
try{document.head.appendChild(css);}catch(e){}
const top=t=>'<div class="tp"><button class="bk" data-hm="back" aria-label="Geri">‹</button><b>'+t+'</b></div>';
function home(){const g=has(),o=g&&S.over,ab=g?PART[S.me].n:'',nw=S.confirmNew;
  return `<div class="hm"><img class="lg" src="icon-192.png" alt=""><div class="ti">Karar Masası</div><div class="su">Siyaset ve ekonomi simülasyonu</div>
  ${g?`<button class="co" data-hm="go"><span class="bd">${S.me}</span><span class="tx"><small>${o?'Son oyun':'Devam et'}</small><b>${ab}</b><span>${dateLabel(S.month)} · ${S.term}. dönem${o?' · '+S.over.t:' · seçime '+toEl()+' ay'}</span></span><span class="pl">▶</span></button>`:''}
  <button class="btn nw" data-hm="new">${nw&&g&&!o?'Emin misin? Tekrar bas':'▶ Yeni oyun'}</button>
  <button class="ol" data-hm="kayit"><span>⤓</span>Kayıt yükle</button>
  <div class="r4"><button data-hm="rehber"><span>?</span>Rehber</button><button data-hm="ist" ${g?'':'disabled'}><span>▤</span>İstatistik</button><button data-hm="ayar"><span>⚙</span>Ayarlar</button><button data-hm="hak"><span>ⓘ</span>Hakkında</button></div>
  <div class="vr">KARAR MASASI</div></div>`;}
function slotsH(){const g=has();return top('Kayıt yükle')+'<div class="panel dg" style="padding:4px 12px">'+[1,2,3].map(i=>`<div class="sl2"><span class="n">${i}</span><span class="h">${ls('km-sm'+i)||'Boş'}</span>${g?`<button class="btn sm" data-slot="s${i}">Kaydet</button>`:''}${ls('km-s'+i)?`<button class="btn sm sec" data-slot="l${i}">Yükle</button>`:''}</div>`).join('')+'</div><div class="note">'+(g?'Kaydet, şu anki oyunu yuvaya yazar. Yükle, yuvadaki oyunu açar ve şu anki oyunun yerine geçer.':'Yuvada kayıtlı oyun varsa Yükle ile devam edebilirsin.')+'</div>';}
const TXT={rehber:['Nasıl oynanır','<p>Her ay üç olay çıkar. Her birine bir karar verirsin, sonra Ayı Bitir ile ayı ilerletirsin.</p><p>Enflasyon, işsizlik, büyüme, bütçe açığı, borç, rezerv ve cari açık halk desteğini belirler. Destek düşerse seçimi kaybedersin.</p><p>Bütçe, vergi, faiz ve politikalar uzun vadeli ayarlardır; etkileri aylar içinde ortaya çıkar. Rezerv tükenirse IMF acil kredisi yalnızca bir kez devreye girer.</p><p>Meclis, kabine, koalisyon ve dış ilişkiler ayrı ekranlardadır. Ekonomi grubundaki Alt göstergeler gıda, kira, enerji ve toplum sonuçlarını gösterir.</p>'],
hak:['Hakkında','<p>Karar Masası, Türkiye\'de siyaset ve ekonomiyi yönettiğin bir simülasyondur.</p><p>Başlangıç değerleri gerçeğe yakın tahminlerdir. Olaylar, bakanlar ve kişi adları kurgusaldır.</p><p>Oyun bu cihazda otomatik kaydedilir.</p>']};
function sub(){if(hs==='kayit')return slotsH();if(hs==='ayar')return top('Ayarlar')+'<div class="dg">'+ayar()+ayar2()+(has()?zorP():'')+'</div>';const t=TXT[hs];return top(t[0])+'<div class="panel tx2">'+t[1]+'</div>';}
{const _r=render;render=function(){if(hm){try{const a=document.getElementById('app');if(a){document.documentElement.removeAttribute('data-nav');a.innerHTML='<div class="wrap">'+(hs?'<div class="hm">'+sub()+'</div>':home())+'</div>';return;}}catch(e){}}if(S&&S.tab==='diger')S.tab='istat';_r();try{const bs=document.querySelectorAll('nav.bnav .bn'),l=bs[bs.length-1];if(l){l.removeAttribute('data-tab');l.setAttribute('data-hm','home');}}catch(e){}};}
GR[5][1]='Menü';GR[5][2]=['istat'];{const _i=V.istat;V.istat=function(){return ist()+_i();};}
document.addEventListener('click',ev=>{const t=ev.target.closest&&ev.target.closest('button');if(!t)return;const k=t.dataset.hm,sl=t.dataset.slot;
  if(sl&&hm&&sl[0]==='l'){setTimeout(()=>{if(has()){hm=0;hs=null;}render();},0);return;}
  if(k===undefined)return;ev.stopPropagation();
  if(k==='go'){hm=0;hs=null;}else if(k==='home'){hm=1;hs=null;S.confirmNew=false;}else if(k==='back')hs=null;
  else if(k==='new'){if(!has()||S.over||S.confirmNew){S.confirmNew=false;newGame();hm=0;hs=null;}else{S.confirmNew=true;setTimeout(()=>{if(S&&S.confirmNew){S.confirmNew=false;render();}},4000);}}
  else if(k==='ist'){hm=0;hs=null;S.scr=null;S.tab='istat';}else hs=k;
  render();window.scrollTo(0,0);},true);
window.kmHome={set:v=>{hm=v;hs=null;}};render();
})();
