/* Oyun müziği: kullanıcının kendi yaptığı ana tema, 9 sn döngü (0,9 sn bindirmeli). Ayarlar > Müzik: Kapalı / Düşük / Orta / Yüksek. */
(function(){
var ctx=null,master=null,tema=null,bas=null,qi=0,ready=false,next=0,t0=Date.now(),VOL=[0,.4,.7,1];
function lvl(){try{var v=localStorage.getItem('km-mu');return v===null?2:+v}catch(e){return 2}}
function dec(d,f){try{var s=atob(d.split(',')[1]),u=new Uint8Array(s.length);for(var i=0;i<s.length;i++)u[i]=s.charCodeAt(i);ctx.decodeAudioData(u.buffer,f,function(){})}catch(e){}}
function loadTema(){if(!ctx)return;if(!tema&&window.KM_TEMA){var d=KM_TEMA;KM_TEMA=null;dec(d,function(b){tema=b})}if(!bas&&window.KM_BAS){var e=KM_BAS;KM_BAS=null;dec(e,function(b){bas=b})}}
function ac(){if(!ctx){var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ctx=new C();master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination)}if(ctx.state==='suspended')ctx.resume();loadTema();return ctx}
function seg(c,t,B){var s=c.createBufferSource(),g=c.createGain(),L=B.duration,x=.9;s.buffer=B;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.55,t+x);g.gain.setValueAtTime(.55,t+L-x);g.gain.linearRampToValueAtTime(.0001,t+L);s.connect(g).connect(master);s.start(t)}
function loop(){if(!ready||document.hidden)return;var c=ac();if(!c||c.state!=='running')return;var v=lvl();master.gain.setTargetAtTime(VOL[v],c.currentTime,.3);if(!v||!tema)return;if(next<c.currentTime)next=c.currentTime+.1;while(next<c.currentTime+1.5){var B=qi%5===4&&bas?bas:tema;qi++;seg(c,next,B);next+=B.duration-.9}}
function unlock(){if(ready||Date.now()-t0<2800)return;ready=true;ac()}
['pointerdown','touchend','keydown'].forEach(function(e){document.addEventListener(e,unlock,{passive:true})});
setInterval(loop,200);
document.addEventListener('visibilitychange',function(){if(!ctx)return;if(document.hidden)ctx.suspend();else if(ready)ctx.resume()});
window.kmMu={now:function(){return tema&&lvl()?'Ana tema':null},go:function(){ready=true;ac()}};
})();
