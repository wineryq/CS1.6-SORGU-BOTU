module.exports = {
  // Bot yapılandırması
  token: "TOKEN_GIR", // ENVYI SIKTIR ET GIR SURAY
  prefix: ".", // Komut öneki
  
  // Kanal yapılandırması
  logKanalId: "", // Log mesajlarının gönderileceği kanal ID'si
  
  // Rol yapılandırması
  yetkiliRolId: "", // Yetkili rol ID'si
  
  // Varsayılan sunucular
  varsayilanSunucular: [
    {
      isim: "Örnek CS 1.6 Sunucusu",
      ip: "example.com",
      port: 27015
    }
  ],
  
  // Mesajlar
  mesajlar: {
    yetkisizKullanici: "Bu komutu kullanmak için yetkiniz bulunmuyor!",
    komutBasarili: "Komut başarıyla uygulandı!",
    hataMesaji: "Bir hata oluştu, lütfen daha sonra tekrar deneyin.",
    sunucuEklendi: "Sunucu başarıyla eklendi!",
    sunucuSilindi: "Sunucu başarıyla silindi!",
    sunucuBulunamadi: "Belirtilen sunucu bulunamadı!",
    sunucuYok: "Kayıtlı sunucu bulunmuyor!"
  },
  
  // Embed renkleri
  renkler: {
    basarili: "#00FF00",
    hata: "#FF0000",
    bilgi: "#0099FF",
    uyari: "#FFFF00"
  },
  
  // Zaman dilimi
  zamanDilimi: "Europe/Istanbul"
};