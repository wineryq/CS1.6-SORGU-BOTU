# CS 1.6 Status Bot

Discord sunucunuz için Counter-Strike 1.6 sunucu durumu kontrol botu.

## Özellikler

- CS 1.6 sunucularının durumunu kontrol etme
- Sunucu oyuncu listesi görüntüleme
- Sunucu harita bilgisi görüntüleme
- Sunucu ekleme ve silme
- Türkçe arayüz

## Kurulum

1. [Discord Geliştirici Portalı](https://discord.com/developers/applications)'ndan bir bot oluşturun
2. Botu sunucunuza gerekli izinlerle davet edin
3. `.env` dosyasına bot tokenınızı ekleyin:
   ```
   TOKEN=discord_bot_tokeniniz
   ```
   **ÖNEMLİ:** Bot çalışmıyor ise, `.env` dosyasındaki `YOUR_DISCORD_BOT_TOKEN` yazısını Discord Developer Portal'dan aldığınız gerçek token ile değiştirdiğinizden emin olun.

4. `config.js` dosyasını düzenleyin:
   - Log kanalı ID'si
   - Yetkili rol ID'si
   - Varsayılan sunucular
5. Bağımlılıkları yükleyin:
   ```
   npm install
   ```
6. Botu başlatın:
   ```
   npm start
   ```

## Kullanım

- `.yardım` - Komut listesini gösterir
- `.durum` - Tüm kayıtlı sunucuların durumunu gösterir
- `.durum [indeks]` - Belirli bir sunucunun durumunu gösterir
- `.ekle [isim] [ip] [port]` - Yeni bir sunucu ekler
- `.sil [indeks]` - Kayıtlı bir sunucuyu siler
- `.liste` - Kayıtlı sunucuların listesini gösterir

## Gereksinimler

- Node.js v20 veya üstü
- Discord.js v14
- Gamedig
- CroxyDB veri depolama

## Sorun Giderme

- **"Invalid token" hatası alıyorsanız:** `.env` dosyasındaki token'ı Discord Developer Portal'dan aldığınız gerçek token ile değiştirin.
- **Bot komutlara yanıt vermiyorsa:** Bot'un doğru izinlerle sunucuya eklendiğinden emin olun.
- **Sunucu durumu sorgulanamıyorsa:** Sunucu IP ve port bilgilerinin doğru olduğundan emin olun.