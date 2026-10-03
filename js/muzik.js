/* Oyun müziği: kullanıcının kendi yaptığı ana tema, 9 sn döngü (0,9 sn bindirmeli). Ayarlar > Müzik: Kapalı / Düşük / Orta / Yüksek. */
(function(){
var ctx=null,master=null,tema=null,ready=false,next=0,t0=Date.now(),VOL=[0,.4,.7,1];
function lvl(){try{var v=localStorage.getItem('km-mu');return v===null?2:+v}catch(e){return 2}}
function loadTema(){if(tema||!window.KM_TEMA||!ctx)return;try{var s=atob(KM_TEMA.split(',')[1]),u=new Uint8Array(s.length);for(var i=0;i<s.length;i++)u[i]=s.charCodeAt(i);ctx.decodeAudioData(u.buffer,function(b){tema=b},function(){})}catch(e){}}
function ac(){if(!ctx){var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ctx=new C();master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination)}if(ctx.state==='suspended')ctx.resume();loadTema();return ctx}
function seg(c,t){var s=c.createBufferSource(),g=c.createGain(),L=tema.duration,x=L-9;s.buffer=tema;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.55,t+x);g.gain.setValueAtTime(.55,t+9);g.gain.linearRampToValueAtTime(.0001,t+L);s.connect(g).connect(master);s.start(t)}
function loop(){if(!ready||document.hidden)return;var c=ac();if(!c||c.state!=='running')return;var v=lvl();master.gain.setTargetAtTime(VOL[v],c.currentTime,.3);if(!v||!tema)return;if(next<c.currentTime)next=c.currentTime+.1;while(next<c.currentTime+1.5){seg(c,next);next+=9}}
function unlock(){if(ready||Date.now()-t0<2800)return;ready=true;ac()}
['pointerdown','touchend','keydown'].forEach(function(e){document.addEventListener(e,unlock,{passive:true})});
setInterval(loop,200);
document.addEventListener('visibilitychange',function(){if(!ctx)return;if(document.hidden)ctx.suspend();else if(ready)ctx.resume()});
window.kmMu={now:function(){return tema&&lvl()?'Ana tema':null},go:function(){ready=true;ac()}};
})();
