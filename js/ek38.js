/* ek38: bakan sadakati: bakanın sadakat puanı bütçe ve siyasi konjonktüre göre değişir; düşük sadakat sızıntı ve hizip olayı doğurur */
const sadK=k=>{const m=S.M&&S.M[k];if(!m)return null;if(m.sad==null){let h=0;for(const c of m.name)h=(h*31+c.charCodeAt(0))%97;m.sad=5+h%40/10;}return m;};
{const _m=mtx;mtx=function(k){const r=_m.apply(this,arguments),m=sadK(k);return m?r+' · sadakat '+nf(m.sad,1)+'/10':r;};}
function ek38Up(){const h=[];if(!S.M)return h;Object.keys(S.M).forEach(k=>{const m=sadK(k);if(!m)return;const b=MB[k]?S.bud[k]/MB[k]:1;
  m.sad=clamp(m.sad+(6-m.sad)*.03+(b<.9?-.12:b>1.1?.05:0)+(S.des<35?-.06:S.des>55?.03:0)+(S.par<4?-.05:0),0,10);
  if(m.sad<2.5&&S.month-(m.lk||-99)>=9&&Math.random()<.35){m.lk=S.month;if(Math.random()<.5){applyFx({des:-.8,bat:-.2});h.push(`${m.name} (${ROLES[k]?ROLES[k][0]:k}) hükümet içi yazışmaları basına sızdırdı.`);}else{applyFx({par:-.4,kol:-.3});h.push(`${m.name}, parti içinde hizip kurmakla suçlanıyor.`);}m.sad=Math.min(10,m.sad+1.5);logA('Kabine',m.name,'Sadakat krizi yaşandı.');}});return h;}
{const _d=dunyaUp;dunyaUp=function(){const h=_d.apply(this,arguments);try{h.push(...ek38Up());}catch(e){}return h;};}
