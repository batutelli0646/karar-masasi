/* ek26: Yatay / dikey düzen. Ayarlar'dan seçilir, ilk açılışta sorulur. km-or: dikey|yatay, km-orq: 1 ise her açılışta sorar. */
const orV=()=>ls('km-or')==='yatay'?'yatay':'dikey';
/* Yön: ekran gerçekten yataysa doğrudan yatay düzen; ana uygulama dönmüyorsa (dikey kilitli) sayfa 90° döndürülür. data-ol: yatay düzen, data-rot: döndürülmüş, data-flip: ters yön */
function orFit(){try{const d=document.documentElement,y=orV()==='yatay',w=innerWidth,h=innerHeight,rot=y&&h>w,ew=rot?h:w,eh=rot?w:h;
  if(y&&ew>=560)d.setAttribute('data-ol','1');else d.removeAttribute('data-ol');
  if(rot&&ew>=560)d.setAttribute('data-rot','1');else d.removeAttribute('data-rot');
  if(ls('km-orr')==='1')d.setAttribute('data-flip','1');else d.removeAttribute('data-flip');
  d.style.setProperty('--eh',eh+'px');}catch(e){}}
{const _a=arayuzApply;arayuzApply=function(){_a.apply(this,arguments);try{const d=document.documentElement,y=orV()==='yatay',o=screen.orientation;if(y)d.setAttribute('data-or','yatay');else d.removeAttribute('data-or');orFit();if(o){if(y&&o.lock)o.lock('landscape').catch(()=>{});else if(!y&&o.unlock)o.unlock();}}catch(e){}};}
addEventListener('resize',orFit);addEventListener('orientationchange',()=>setTimeout(orFit,150));
{const _st=window.scrollTo;window.scrollTo=function(){if(document.documentElement.hasAttribute('data-rot')){document.body.scrollTop=0;return;}return _st.apply(this,arguments);};}
const ayarO=()=>{const y=orV()==='yatay',q=ls('km-orq')==='1';return `<div class="panel"><div class="dl">Ekran yönü</div><div class="chips" style="margin:6px 0 4px"><button class="btn sm ${y?'sec':''}" data-set="km-or:dikey">Dikey</button><button class="btn sm ${y?'':'sec'}" data-set="km-or:yatay">Yatay</button></div><div class="dl" style="margin-top:8px">Açılışta sor</div><div class="chips" style="margin:6px 0 4px"><button class="btn sm ${q?'':'sec'}" data-set="km-orq:1">Evet</button><button class="btn sm ${q?'sec':''}" data-set="km-orq:0">Hayır</button></div><div class="note">Yatay: menü sol kenarda, geniş sayfalar iki sütunlu olur. Telefonu yan çevirmen gerekir.</div></div>${typeof ayarH28==='function'?ayarH28():''}`;};
{const _r=render;render=function(){try{document.documentElement.setAttribute('data-tab',(S&&S.tab)||'');}catch(e){}return _r.apply(this,arguments);};}
(function(){try{
  const h=document.createElement('div');h.id='orh';h.innerHTML='<span>Telefonu yan çevir</span><span class="of"><button data-orr="1" aria-label="Yönü ters çevir">⇄</button><button data-orx="1" aria-label="Kapat">×</button></span>';h.onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.orx)h.style.display='none';else if(b.dataset.orr){ls('km-orr',ls('km-orr')==='1'?'0':'1');orFit();}};document.body.appendChild(h);
  if(navigator.webdriver)return; /* otomatik testlerde soru çıkmaz */
  const ask=!ls('km-or')||(ls('km-orq')==='1'&&!sessionStorage.getItem('km-orq-seen'));if(!ask)return;sessionStorage.setItem('km-orq-seen','1');
  const d=document.createElement('div');d.id='orq';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-label','Ekran yönü');
  d.innerHTML='<div class="orc"><h2>Nasıl oynamak istersin?</h2><div class="orb"><button data-or="dikey"><i class="p"></i><b>Dikey</b><span>Telefonu tek elle tut</span></button><button data-or="yatay"><i class="l"></i><b>Yatay</b><span>Geniş ekran, yan menü</span></button></div><p>Ayarlar bölümünden istediğin zaman değiştirebilirsin.</p></div>';
  d.onclick=e=>{const b=e.target.closest('button');if(!b)return;ls('km-or',b.dataset.or);arayuzApply();d.remove();try{render();}catch(x){}};
  document.body.appendChild(d);
}catch(e){}})();
arayuzApply();
