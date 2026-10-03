/* Menü: yan çekmece (varsayılan) veya eski alt sekmeler. Ayarlar > Menü (km-nav: cek / alt) */
(function(){
let drw=0;const mode=()=>{try{return localStorage.getItem('km-nav')||'cek';}catch(e){return 'cek';}};
let css={};try{css=document.createElement('style');}catch(e){}
css.textContent='html[data-nav="cek"] .bnav,html[data-nav="cek"] .subtabs{display:none!important}html[data-nav="cek"] .endbar{bottom:env(safe-area-inset-bottom,0px)}html[data-nav="cek"] body{padding-block:0 90px}'
+'.mhb{flex:none;width:40px;height:40px;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--accent);font-size:20px;line-height:1;cursor:pointer;margin-right:2px}'
+'.mov{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:20}'
+'.mdr{position:fixed;top:0;bottom:0;left:0;width:min(82%,330px);background:var(--surface);border-right:1px solid var(--line);z-index:21;overflow-y:auto;padding:calc(10px + env(safe-area-inset-top,0px)) 0 calc(14px + env(safe-area-inset-bottom,0px))}'
+'.mdr .mt{display:flex;align-items:center;justify-content:space-between;padding:4px 14px 8px;font-family:var(--display);font-weight:700;font-size:20px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent)}'
+'.mdr .mt button{width:36px;height:36px;border:1px solid var(--line);border-radius:8px;background:var(--surface2);color:var(--ink);font-size:18px;cursor:pointer}'
+'.mdr h4{margin:12px 14px 4px;font-family:var(--display);font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}'
+'.mdr .ml{display:flex;justify-content:space-between;align-items:center;width:100%;text-align:left;padding:11px 14px;border:0;background:none;color:var(--ink);font:inherit;font-size:15px;cursor:pointer}'
+'.mdr .ml[aria-selected="true"]{background:var(--surface2);color:var(--accent);font-weight:600}'
+'.mhb:focus-visible,.mdr button:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}';
try{document.head.appendChild(css);}catch(e){}
const name=()=>{try{const g=grp();return g[1]+' · '+SUBN[S.tab];}catch(e){return 'Karar Masası';}};
function post(){try{const d=document.documentElement,on=mode()==='cek'&&document.querySelector('nav.bnav');if(!on){d.removeAttribute('data-nav');return;}d.setAttribute('data-nav','cek');
const ti=document.querySelector('.top-in');if(ti&&!ti.querySelector('.mhb')){const b=document.createElement('button');b.className='mhb';b.setAttribute('data-dr','1');b.setAttribute('aria-label','Menü');b.textContent='☰';ti.insertBefore(b,ti.firstChild);}
const br=document.querySelector('.top-in .brand');if(br&&!br.dataset.m){br.dataset.m=1;const s=br.querySelector('small');const t=document.createElement('div');t.style.cssText='font-size:17px;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';t.textContent=name();br.firstChild.replaceWith(t);}
if(drw){const a=document.getElementById('app'),w=document.createElement('div');w.innerHTML='<div class="mov" data-dr="0"></div><div class="mdr" role="dialog" aria-label="Menü"><div class="mt">Karar Masası<button data-dr="0" aria-label="Kapat">×</button></div>'+GR.map(([id,n,ks])=>'<h4>'+n+'</h4>'+ks.map(k=>'<button class="ml" data-tab="'+k+'" aria-selected="'+(S.tab===k)+'">'+SUBN[k]+rz(k)+'</button>').join('')).join('')+'</div>';while(w.firstChild)a.appendChild(w.firstChild);}}catch(e){}}
{const _r=render;render=function(){_r();post();};}
document.addEventListener('click',ev=>{const t=ev.target.closest&&ev.target.closest('button,[data-dr]');if(!t)return;if(t.dataset.dr!==undefined){ev.stopPropagation();drw=+t.dataset.dr;render();return;}if(drw&&t.dataset.tab){drw=0;}},true);
render();
})();
