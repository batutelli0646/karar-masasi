/* Meclis: tek "Meclise sun" seçeneği, karışık oylama (kabul / ret / çekimser / katılmayan); seçim sonrası yeni kampanya sözleri */
function propose(id){
  const l=LAWS.find(x=>x[0]===id)||S.cl.find(x=>x[0]===id);if(!l)return;const c=l[2];
  if(c>avail()||S.laws[id])return;
  const rows=PK.map(k=>{const s=S.seats[k]||0;let f,u;
    if(k===S.me){f=clamp(.95+rnd(-.04,.03)-(S.par<4?.07:0)-(l[4]<.3?.05:0),.75,1);u=.3;}
    else if(S.coal.includes(k)){f=clamp(.68+S.kol/30+rnd(-.1,.1)+(l[4]-.5)*.25,.4,.98);u=.45;}
    else{f=clamp(l[4]*.4+cmp(S.me,k)/50-.08+rnd(-.12,.12),0,.92);u=.35+(l[4]>.5?.1:0);}
    const ab=Math.round(s*(k===S.me||S.coal.includes(k)?rnd(.01,.035):rnd(.03,.08))),pr=s-ab,y=Math.round(pr*f),rest=pr-y,cek=Math.round(rest*clamp(u*(1-Math.abs(f-.5)*.6)+rnd(-.05,.05),0,.6));
    return [k,y,rest-cek,cek,ab];});
  const sum=i=>rows.reduce((a,r)=>a+r[i],0),yes=sum(1),no=sum(2),abst=sum(3),absent=sum(4);
  const big=l[3]>=360,ref=id==='anayasa'&&yes>=360&&yes<400,ok=id==='anayasa'?(yes>=400||(ref&&S.des+rnd(-6,6)>=47)):yes>=l[3];
  S.cur.spent+=c;S.lawT[id]=S.month+3;
  if(ok){const ms=S.cl.includes(l)?su('dr'+id.slice(0,3)):1;if(S.cl.includes(l))suU('dr'+id.slice(0,3));applyFx(sfx2(l[6],ms));S.laws[id]=Math.max(S.month,.01);if(id==='baraj')S.barajM=S.month;const ex=l[7];if(ex&&ex.base)S.laws[ex.base]=Math.max(S.month,.01);if(ex&&ex.tax){S.tax[ex.tax]=ex.v;S.tref=S.tref||{};S.tref[ex.tax]=ex.v;delete (S.tp||{})[ex.tax];if(ex.nw)S.laws['vt_'+ex.tax]=Math.max(S.month,.01);}if(ex&&ex.repeal){delete S.laws[ex.repeal];}if(ex&&ex.erken){S.nel=S.month+2;S.erkM=1;}S.cur.spent=Math.max(0,S.cur.spent-1);}else applyFx({des:-.3,par:-.3});
  hap(ok?[20,30,20]:60,ok?660:220);S.vote={n:l[1],d:l[5],rows,yes,no,abst,absent,need:l[3],big,ok};
  logA(l[1],ok?'Kabul edildi':'Reddedildi',`Oylama: ${yes} kabul, ${no} ret, ${abst} çekimser, ${absent} katılmadı.${ref?' Halkoylamasına gidildi: '+(ok?'evet çıktı.':'hayır çıktı.'):''}`);save();render();
}
function voteScreen(){
  const v=S.vote,pres=v.yes+v.no+v.abst;
  return `<div class="wrap"><div class="end"><div class="muted" style="font-family:var(--mono);font-size:12px">TBMM Genel Kurulu · oylama</div><h1>${v.n}</h1><p>${v.d}</p><div class="fac" style="margin:14px 0">${v.rows.map(([k,y,n,a,ab])=>`<div class="f"><span>${PART[k].n}</span><div class="bar"><i style="width:${y/((y+n+a)||1)*100}%"></i></div><span class="dl">${y} / ${n} / ${a}</span></div>`).join('')}</div><div class="note">Her satır: kabul / ret / çekimser</div><div class="big">${v.yes} kabul · ${v.no} ret</div><div class="note">${v.abst} çekimser · ${v.absent} milletvekili katılmadı · ${pres} oy kullanıldı</div><div class="note">Gerekli kabul oyu: ${v.need} (çekimser ve katılmayanlar sayılmaz)</div><h2 style="margin-top:14px;color:var(--${v.ok?'good':'bad'})">${v.ok?'Yasalaştı':'Teklif reddedildi'}</h2><button class="btn" data-votok="1">Tamam</button></div></div>`;
}
/* Seçim kazanılınca yeni dönem sözleri seçilir; tutulmayan sözler halk desteğini düşürür */
{const _f=finishEl;finishEl=function(){const f=(S.pri||[]).filter(k=>PRI[k]&&!PRI[k][2]()).length;const r=_f.apply(this,arguments);
  try{if(f){applyFx({des:-1.5*f});logA('Seçim sözü','Tutulmayan sözler',`${f} söz tutulmadı; halk desteği düştü.`);}S.pri=[];S.prip=1;save();render();}catch(e){}return r;};}
SUBN.lobi='Ücret ve emekli';
