// CS 1.6 Status Bot - Turkish
const { Client, GatewayIntentBits, Partials, EmbedBuilder, PermissionsBitField } = require('discord.js');
const croxydb = require('croxydb');
const config = require('./config.js');
const Gamedig = require('gamedig');
const moment = require('moment-timezone');
require('dotenv').config();

// Zaman dilimini ayarla
moment.locale('tr');
moment.tz.setDefault(config.zamanDilimi);

// Yeni bir client oluştur
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.GuildMember,
    Partials.User
  ]
});

// Veritabanı başlatma
if (!croxydb.has('sunucular')) {
  croxydb.set('sunucular', config.varsayilanSunucular);
}

// Hazır olduğunda
client.once('ready', () => {
  console.log(`${client.user.tag} olarak giriş yapıldı!`);
  console.log(`Node.js v${process.versions.node}`);
  console.log('CS 1.6 Status Bot aktif!');
  
  // Bot durumunu ayarla
  client.user.setActivity('.yardım | CS 1.6 Status', { type: 'PLAYING' });
});

// Mesaj olayı
client.on('messageCreate', async (message) => {
  // Bot mesajlarını yoksay
  if (message.author.bot) return;
  
  // Prefix kontrolü
  if (!message.content.startsWith(config.prefix)) return;
  
  // Komut ve argümanları ayır
  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  
  // Yardım komutu
  if (command === 'yardım') {
    const embed = new EmbedBuilder()
      .setTitle('CS 1.6 Status Bot - Yardım')
      .setDescription('Counter-Strike 1.6 sunucularının durumunu kontrol etmek için kullanabileceğiniz komutlar.')
      .setColor(config.renkler.bilgi)
      .addFields(
        { name: `${config.prefix}yardım`, value: 'Yardım menüsünü gösterir.' },
        { name: `${config.prefix}durum`, value: 'Tüm kayıtlı sunucuların durumunu gösterir.' },
        { name: `${config.prefix}durum [indeks]`, value: 'Belirli bir sunucunun durumunu gösterir.' },
        { name: `${config.prefix}ekle [isim] [ip] [port]`, value: 'Yeni bir sunucu ekler.' },
        { name: `${config.prefix}sil [indeks]`, value: 'Kayıtlı bir sunucuyu siler.' },
        { name: `${config.prefix}liste`, value: 'Kayıtlı sunucuların listesini gösterir.' }
      )
      .setTimestamp()
      .setFooter({ text: 'CS 1.6 Status Bot', iconURL: client.user.displayAvatarURL() });
    
    message.channel.send({ embeds: [embed] });
  }
  
  // Durum komutu
  if (command === 'durum') {
    const sunucular = croxydb.get('sunucular');
    
    if (!sunucular || sunucular.length === 0) {
      return message.reply(config.mesajlar.sunucuYok);
    }
    
    const indeks = args[0];
    
    // Belirli bir sunucunun durumunu göster
    if (indeks) {
      const sunucuIndeks = parseInt(indeks) - 1;
      
      if (isNaN(sunucuIndeks) || sunucuIndeks < 0 || sunucuIndeks >= sunucular.length) {
        return message.reply(config.mesajlar.sunucuBulunamadi);
      }
      
      const sunucu = sunucular[sunucuIndeks];
      
      try {
        message.channel.send(`🔍 **${sunucu.isim}** sunucusu sorgulanıyor...`);
        
        const state = await Gamedig.query({
          type: 'cs16',
          host: sunucu.ip,
          port: sunucu.port,
          maxAttempts: 3
        });
        
        const embed = new EmbedBuilder()
          .setTitle(`📊 ${sunucu.isim} - Sunucu Durumu`)
          .setColor(config.renkler.basarili)
          .addFields(
            { name: '📡 Sunucu', value: `${sunucu.ip}:${sunucu.port}`, inline: true },
            { name: '🗺️ Harita', value: state.map || 'Bilinmiyor', inline: true },
            { name: '👥 Oyuncular', value: `${state.players.length}/${state.maxplayers}`, inline: true },
            { name: '🏓 Ping', value: `${state.ping}ms`, inline: true },
            { name: '🔄 Durum', value: '✅ Çevrimiçi', inline: true },
            { name: '🔐 Şifre', value: state.password ? '✅ Var' : '❌ Yok', inline: true }
          )
          .setTimestamp();
        
        // Oyuncu listesi
        if (state.players.length > 0) {
          let oyuncuListesi = '';
          
          state.players.sort((a, b) => (b.score || 0) - (a.score || 0)).forEach((player, index) => {
            oyuncuListesi += `${index + 1}. **${player.name || 'İsimsiz'}** - Skor: ${player.score || 0}\n`;
          });
          
          embed.addFields({ name: '🎮 Oyuncular', value: oyuncuListesi });
        }
        
        message.channel.send({ embeds: [embed] });
      } catch (error) {
        console.error('Sunucu sorgulama hatası:', error);
        
        const embed = new EmbedBuilder()
          .setTitle(`❌ ${sunucu.isim} - Sunucu Durumu`)
          .setColor(config.renkler.hata)
          .addFields(
            { name: '📡 Sunucu', value: `${sunucu.ip}:${sunucu.port}`, inline: true },
            { name: '🔄 Durum', value: '❌ Çevrimdışı veya ulaşılamıyor', inline: true }
          )
          .setTimestamp();
        
        message.channel.send({ embeds: [embed] });
      }
    } else {
      // Tüm sunucuların durumunu göster
      message.channel.send(`🔍 Tüm sunucular sorgulanıyor... (${sunucular.length} sunucu)`);
      
      const embed = new EmbedBuilder()
        .setTitle('📊 CS 1.6 Sunucu Durumları')
        .setColor(config.renkler.bilgi)
        .setTimestamp();
      
      let durumlar = '';
      
      for (let i = 0; i < sunucular.length; i++) {
        const sunucu = sunucular[i];
        
        try {
          const state = await Gamedig.query({
            type: 'cs16',
            host: sunucu.ip,
            port: sunucu.port,
            maxAttempts: 2
          });
          
          durumlar += `**${i + 1}. ${sunucu.isim}**\n`;
          durumlar += `📡 \`${sunucu.ip}:${sunucu.port}\`\n`;
          durumlar += `🗺️ Harita: ${state.map || 'Bilinmiyor'}\n`;
          durumlar += `👥 Oyuncular: ${state.players.length}/${state.maxplayers}\n`;
          durumlar += `🔄 Durum: ✅ Çevrimiçi\n\n`;
        } catch (error) {
          durumlar += `**${i + 1}. ${sunucu.isim}**\n`;
          durumlar += `📡 \`${sunucu.ip}:${sunucu.port}\`\n`;
          durumlar += `🔄 Durum: ❌ Çevrimdışı veya ulaşılamıyor\n\n`;
        }
      }
      
      embed.setDescription(durumlar);
      message.channel.send({ embeds: [embed] });
    }
  }
  
  // Ekle komutu
  if (command === 'ekle') {
    // Yetki kontrolü
    if (!message.member.roles.cache.has(config.yetkiliRolId) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply(config.mesajlar.yetkisizKullanici);
    }
    
    const isim = args[0];
    const ip = args[1];
    const port = parseInt(args[2]);
    
    if (!isim || !ip || isNaN(port)) {
      return message.reply(`Kullanım: ${config.prefix}ekle [isim] [ip] [port]`);
    }
    
    const sunucular = croxydb.get('sunucular') || [];
    
    sunucular.push({
      isim: isim,
      ip: ip,
      port: port
    });
    
    croxydb.set('sunucular', sunucular);
    
    const embed = new EmbedBuilder()
      .setTitle('✅ Sunucu Eklendi')
      .setColor(config.renkler.basarili)
      .addFields(
        { name: '📝 İsim', value: isim, inline: true },
        { name: '📡 IP', value: ip, inline: true },
        { name: '🔌 Port', value: port.toString(), inline: true }
      )
      .setTimestamp();
    
    message.channel.send({ embeds: [embed] });
  }
  
  // Sil komutu
  if (command === 'sil') {
    // Yetki kontrolü
    if (!message.member.roles.cache.has(config.yetkiliRolId) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply(config.mesajlar.yetkisizKullanici);
    }
    
    const indeks = parseInt(args[0]) - 1;
    
    if (isNaN(indeks)) {
      return message.reply(`Kullanım: ${config.prefix}sil [indeks]`);
    }
    
    const sunucular = croxydb.get('sunucular') || [];
    
    if (indeks < 0 || indeks >= sunucular.length) {
      return message.reply(config.mesajlar.sunucuBulunamadi);
    }
    
    const silinenSunucu = sunucular[indeks];
    sunucular.splice(indeks, 1);
    
    croxydb.set('sunucular', sunucular);
    
    const embed = new EmbedBuilder()
      .setTitle('🗑️ Sunucu Silindi')
      .setColor(config.renkler.uyari)
      .addFields(
        { name: '📝 İsim', value: silinenSunucu.isim, inline: true },
        { name: '📡 IP', value: silinenSunucu.ip, inline: true },
        { name: '🔌 Port', value: silinenSunucu.port.toString(), inline: true }
      )
      .setTimestamp();
    
    message.channel.send({ embeds: [embed] });
  }
  
  // Liste komutu
  if (command === 'liste') {
    const sunucular = croxydb.get('sunucular');
    
    if (!sunucular || sunucular.length === 0) {
      return message.reply(config.mesajlar.sunucuYok);
    }
    
    const embed = new EmbedBuilder()
      .setTitle('📋 Kayıtlı CS 1.6 Sunucuları')
      .setColor(config.renkler.bilgi)
      .setTimestamp();
    
    let liste = '';
    
    for (let i = 0; i < sunucular.length; i++) {
      const sunucu = sunucular[i];
      liste += `**${i + 1}.** ${sunucu.isim} - \`${sunucu.ip}:${sunucu.port}\`\n`;
    }
    
    embed.setDescription(liste);
    message.channel.send({ embeds: [embed] });
  }
});

// Discord'a giriş yap
client.login(config.token);