/* Beyaz ekran olursa hatayi ekranda goster */
(function(){function show(m){try{var d=document.getElementById('kmerr');if(!d){d=document.createElement('pre');d.id='kmerr';d.style.cssText='position:fixed;left:0;right:0;bottom:0;max-height:40%;overflow:auto;margin:0;padding:8px;background:#300;color:#fff;font:11px monospace;z-index:100000;white-space:pre-wrap';document.body.appendChild(d);}d.textContent+=m+'\n';}catch(e){}}
window.addEventListener('error',function(e){show('Hata: '+e.message+' ('+(e.lineno||'')+':'+(e.colno||'')+')');});
window.addEventListener('unhandledrejection',function(e){show('Hata: '+(e.reason&&e.reason.message||e.reason));});})();
