/* ek35: bağımsız Merkez Bankası modu, bütçe açığında kalıcılık, itibar dengesi */
const mbTarget=()=>clamp(Math.max(12,Math.round(S.enf+7)),RANGE.faiz?RANGE.faiz[0]:-1,150);
{const _m=mbUp;mbUp=function(){_m.apply(this,arguments);if(!S.mbi)return;const t=mbTarget(),d=clamp(t-S.lv.faiz,-2.5,2.5);if(Math.abs(d)<.05)return;S.lv.faiz=Math.round((S.lv.faiz+d)*10)/10;S.lv0.faiz=S.lv.faiz;logA('Merkez Bankası','PPK','Bağımsız MB faizi %'+nf(S.lv.faiz,1)+' düzeyine '+(d>0?'yükseltti':'indirdi')+'.');};}
function mbiTog(){S.mbi=!S.mbi;if(!S.mbi){S.gv=clamp(S.gv-5,0,100);logA('Merkez Bankası','Bağımsızlık','Merkez Bankasının karar yetkisi hükümete devredildi; güvenilirlik zedelendi.');}hap(20,520);save();render();}
function mbiCard(){return `<div class="panel"><b>Merkez Bankası bağımsızlığı</b> <span class="muted dl">${S.mbi?'bağımsız: PPK faizi enflasyona göre ayarlıyor':'faiz kararı sende'}</span>
<div class="note" style="margin:4px 0">Bağımsız modda PPK her ay faizi en fazla 2,5 puan oynatarak önerisine yaklaştırır (enflasyonun yaklaşık 7 puan üstü, en az %12). Bu modda faize elle müdahale güvenilirliği düşürür, bağımsızlığı bırakmak da.</div>
<div class="step fw"><button class="dxa" data-mbi="1"><span>${S.mbi?'Faiz yetkisini geri al':'Merkez Bankasını bağımsız bırak'}</span><b>${S.mbi?'güvenilirlik −5':'faiz kendiliğinden ayarlanır'}</b><i>›</i></button></div></div>`;}
{const _k=V.kurum;V.kurum=()=>mbiCard()+_k();}
document.addEventListener('click',ev=>{const t=ev.target.closest&&ev.target.closest('[data-mbi],[data-lv="faiz"]');if(!t||t.disabled)return;if(t.dataset.mbi){ev.stopImmediatePropagation();ev.preventDefault();return mbiTog();}if(S.mbi&&S.mbx!==S.month){S.mbx=S.month;S.gv=clamp(S.gv-3,0,100);}},true);
/* itibar (batı, doğu, bölge) olaylardan sistematik aşınmasın: hafif ek ortalamaya dönüş */
function ek35Up(){['bat','dog','bol'].forEach(k=>{S[k]+=(({bat:5,dog:5,bol:6})[k]-S[k])*.04;});return [];}
{const _d=dunyaUp;dunyaUp=function(){const h=_d.apply(this,arguments);try{h.push(...ek35Up());}catch(e){}return h;};}
