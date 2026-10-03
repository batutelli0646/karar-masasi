/* Sıkıştırma: kaydırıcı + hemen altındaki düğmeler tek satırda yan yana */
(function(){if(!document.createElement||!document.head)return;
const st=document.createElement('style');
st.textContent='.rr{display:flex;align-items:center;gap:8px;margin:2px 0}.rr>.rng{flex:1;min-width:0;width:auto;margin:0}.rr>.chips,.rr>.step{margin:0!important;flex:none}';
document.head.appendChild(st);
function pack(){try{document.querySelectorAll('input.rng').forEach(r=>{if(r.parentElement.classList.contains('rr'))return;const n=r.nextElementSibling;if(!n||!(n.classList.contains('chips')||n.classList.contains('step')))return;if(n.children.length>3||n.querySelector('input'))return;const w=document.createElement('div');w.className='rr';r.parentNode.insertBefore(w,r);w.appendChild(r);w.appendChild(n);});}catch(e){}}
const _r=render;render=function(){const x=_r.apply(this,arguments);pack();return x;};
pack();
})();

/* Basılı tut: +/− düğmeleri hızlanarak tekrarlar */
(function(){if(!document.createElement||!document.head)return;
const sig=b=>b.outerHTML.slice(0,b.outerHTML.indexOf('>')+1);
let tm=null,held=false,cur=null;
function find(c){const a=[...document.querySelectorAll('button[data-d]')].filter(x=>sig(x)===c.s);return a[c.i]||null;}
function stop(){clearTimeout(tm);tm=null;cur=null;}
function loop(n){if(!cur)return;const b=find(cur);if(!b||b.disabled){stop();return;}held=true;b.click();tm=setTimeout(()=>loop(n+1),n<6?130:n<14?80:45);}
document.addEventListener('pointerdown',ev=>{const b=ev.target.closest&&ev.target.closest('button[data-d]');if(!b||!b.closest('.step'))return;const s=sig(b),i=[...document.querySelectorAll('button[data-d]')].filter(x=>sig(x)===s).indexOf(b);held=false;cur={s,i};clearTimeout(tm);tm=setTimeout(()=>loop(0),380);},true);
['pointerup','pointercancel','pointerleave'].forEach(e=>document.addEventListener(e,()=>{stop();},true));
document.addEventListener('click',ev=>{if(held&&ev.isTrusted){held=false;ev.stopPropagation();ev.preventDefault();}},true);
document.addEventListener('contextmenu',ev=>{if(ev.target.closest&&ev.target.closest('button[data-d]'))ev.preventDefault();});
const st=document.createElement('style');st.textContent='button[data-d]{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;touch-action:manipulation}';document.head.appendChild(st);
})();
