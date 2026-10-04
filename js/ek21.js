/* ek21: çift mekanik temizliği — aynı işi yapan temas, istihbarat ve anlaşma kayıtları tek kayıtta toplanır */
{const drop=(A,names)=>{for(let i=A.length-1;i>=0;i--)if(names.includes(A[i][0]))A.splice(i,1);};
 drop(UHO,['Devlet başkanı düzeyinde ziyaret','Ortak ticaret heyeti','Burs ve değişim programı','Enerji işbirliği görüşmesi','Havayolu seferleri ve sınır kapısı','Savunma sanayii ortaklığı görüşmesi','Büyükelçiyi istişare için geri çağır','Ticarette kısıtlama']);
 drop(IO,['Terörle mücadele istihbaratı','Yabancı casus ağını çökert','Yabancı medya etkisi analizi']);
 /* vize: ülke bazlı vize rejimi (DVZ) ve Serbest Sınır paktı yeterli; nükleer: Nükleer Enerji Yasası kapsıyor */
 drop(DEALS,['vize_ab','nukleer2']);['vize_ab','nukleer2'].forEach(k=>{delete DQ[k];});
 AL.length=0;AL.push(...DEALS,...PROJ,...PRIV);}
/* göçmen: tek kaynak S.ref (Nüfus ve Göç); "Mülteci sayısı" göstergesi onu okur, geri dönüş programı tek (donus) */
{const i=PL.findIndex(x=>x[0]==='mulgeri');if(i>=0)PL.splice(i,1);}
