/* Açılış animasyonu: ışıkla yükselen sütunlar + gong. Ayarlar > Açılış (km-sp: 1 sesli, s sessiz, 0 kapalı) */
(function(){
let mode='1';try{mode=localStorage.getItem('km-sp')||'1';if(sessionStorage.getItem('km-sp-seen'))mode='0';sessionStorage.setItem('km-sp-seen','1');}catch(e){}
if(mode==='0'||(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches))return;
let sub='Türkiye siyaset ve ekonomi simülasyonu';
try{const s=JSON.parse(localStorage.getItem('karar-masasi-v1')||'null');if(s&&s.month>0&&!s.pick)sub='Kaldığın yerden · Ay '+s.month;}catch(e){}
const st=document.createElement('style');
st.textContent='#spl{position:fixed;inset:0;z-index:99999;background:#0a0908;overflow:hidden;transition:opacity .35s;touch-action:manipulation}#spl.out{opacity:0;pointer-events:none}'
+'#spl .g{position:absolute;left:-30%;right:-30%;top:0;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(247,200,115,.5),rgba(242,166,90,.16) 40%,transparent 68%);animation:splr 1.5s cubic-bezier(.2,.7,.2,1) both}'
+'#spl svg{position:absolute;width:min(64vw,340px);left:50%;top:50%;margin:-26vh 0 0 calc(min(64vw,340px)/-2);aspect-ratio:1;overflow:visible}#spl svg *{transform-box:fill-box}'
+'#spl .c{transform-origin:50% 100%;fill:#E9EDEE;animation:splg .5s var(--d) both}#spl .b{animation:splg .4s both;transform-origin:50% 50%}#spl .rf{transform-origin:50% 50%;animation:spld .5s 1.35s cubic-bezier(.3,1.4,.5,1) both}'
+'#spl .t{position:absolute;left:0;right:0;top:calc(50% + 14vh);text-align:center;color:#E5ECEE;font:700 clamp(22px,7vw,32px) system-ui,sans-serif;letter-spacing:.2em;text-transform:uppercase;animation:splu .6s 1.6s both}'
+'#spl .t small{display:block;margin-top:8px;font:500 11px system-ui,sans-serif;letter-spacing:.2em;color:#8C9EA6}'
+'@keyframes splr{from{transform:translateY(55%) scale(.2);opacity:0}to{transform:none;opacity:1}}@keyframes splg{from{transform:scaleY(0);opacity:0}to{transform:none;opacity:1}}@keyframes spld{from{transform:translateY(-60px);opacity:0}to{transform:none;opacity:1}}@keyframes splu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}';
document.head.appendChild(st);
const x=[112,178,244,310,376],d=[.3,.5,.7,.9,1.1];
const el=document.createElement('div');el.id='spl';el.setAttribute('role','presentation');
el.innerHTML='<div class="g"></div><svg viewBox="0 0 512 512"><rect class="b" x="48" y="376" width="416" height="50" fill="#8A969C"/>'+x.map((v,i)=>'<rect class="c" style="--d:'+d[i]+'s" x="'+v+'" y="236" width="34" height="140" rx="4"/>').join('')+'<g class="rf"><path d="M84 228L256 100L428 228Z" fill="#F4F6F7"/><rect x="84" y="228" width="344" height="14" fill="#E9EDEE"/><circle cx="256" cy="168" r="16" fill="#F2A65A"/></g></svg><div class="t">Karar Masası<small></small></div>';
el.querySelector('small').textContent=sub;
document.body.appendChild(el);
let ctx=null,done=false;
const end=()=>{if(done)return;done=true;el.classList.add('out');setTimeout(()=>{el.remove();st.remove();try{ctx&&ctx.close();}catch(e){}},400);};
el.addEventListener('pointerdown',end);setTimeout(end,2600);
if(mode==='1')try{
 ctx=new(window.AudioContext||window.webkitAudioContext)();
 const go=()=>{if(!ctx||ctx.state!=='running'||done)return;const c=ctx,n=c.currentTime;
  const tn=(f,t,du,g)=>{const o=c.createOscillator(),v=c.createGain();o.frequency.value=f;v.gain.setValueAtTime(.0001,n+t);v.gain.exponentialRampToValueAtTime(g,n+t+.004);v.gain.exponentialRampToValueAtTime(.0001,n+t+du);o.connect(v).connect(c.destination);o.start(n+t);o.stop(n+t+du+.05);};
  [[1,1,1],[2.32,.6,.8],[3.7,.4,.6],[5.4,.25,.4]].forEach(p=>tn(110*p[0],.2,3*p[2],.3*p[1]));
  [[1,.3,1],[2.7,.2,.5]].forEach(p=>tn(220*p[0],1.35,2*p[2],.1*p[1]*3.3));
  const nb=c.createBuffer(1,c.sampleRate*2,c.sampleRate),a=nb.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;
  const s=c.createBufferSource(),f=c.createBiquadFilter(),v=c.createGain();s.buffer=nb;f.type='lowpass';f.frequency.value=700;v.gain.setValueAtTime(.0001,n+.2);v.gain.exponentialRampToValueAtTime(.12,n+.6);v.gain.exponentialRampToValueAtTime(.0001,n+2);s.connect(f).connect(v).connect(c.destination);s.start(n+.2);};
 const r=ctx.resume();(r&&r.then?r:Promise.resolve()).then(go).catch(()=>{});
}catch(e){}
})();
