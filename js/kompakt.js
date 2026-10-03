/* Sıkıştırma: kaydırıcı + hemen altındaki düğmeler tek satırda yan yana */
(function(){
const st=document.createElement('style');
st.textContent='.rr{display:flex;align-items:center;gap:8px;margin:2px 0}.rr>.rng{flex:1;min-width:0;width:auto;margin:0}.rr>.chips,.rr>.step{margin:0!important;flex:none}';
document.head.appendChild(st);
function pack(){try{document.querySelectorAll('input.rng').forEach(r=>{if(r.parentElement.classList.contains('rr'))return;const n=r.nextElementSibling;if(!n||!(n.classList.contains('chips')||n.classList.contains('step')))return;if(n.children.length>3||n.querySelector('input'))return;const w=document.createElement('div');w.className='rr';r.parentNode.insertBefore(w,r);w.appendChild(r);w.appendChild(n);});}catch(e){}}
const _r=render;render=function(){const x=_r.apply(this,arguments);pack();return x;};
pack();
})();
