/* ek20: Başarımlar, istatistikte gösterim */
{const _e=endTurn;endTurn=function(){const m0=S.month;_e();try{if(S.month!==m0&&S.ach){checkAch().forEach(n=>logA('Başarım',n.replace('Başarım: ',''),'Yeni başarım kazanıldı.'));save();}}catch(e){}};}
{const _i=V.istat;V.istat=function(){return _i()+basarim();};}
