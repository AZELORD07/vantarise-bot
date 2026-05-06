import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  InteractionType,
  ComponentType,
} from "discord.js";

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  console.error("DISCORD_TOKEN ve DISCORD_CLIENT_ID gereklidir.");
  process.exit(1);
}

const commands = [
  new SlashCommandBuilder()
    .setName("bilgilendirme")
    .setDescription("Vantarise sunucu bilgilerini görüntüle")
    .toJSON(),
  new SlashCommandBuilder()
    .setName("iletisim")
    .setDescription("Yetkililer ve destek hattı ile iletişime geç")
    .toJSON(),
];

const FOOTER_TEXT = "Vantarise • vantarise.net";
function footer() { return { text: FOOTER_TEXT }; }

function getEmbed(category) {
  const now = new Date();
  switch (category) {
    case "discord":
      return new EmbedBuilder()
        .setTitle("Discord Topluluğumuza Katılın!")
        .setColor(0x5865f2)
        .setThumbnail("https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.png")
        .setDescription("## 🔗 discord.gg/vantarise\n\nDiscord grubumuza katılarak aşağıdaki avantajlardan yararlanabilirsiniz:")
        .addFields({ name: "Neden Katılmalısınız?", value: "🎉 Çekilişlerden anında haberdar olun\n🔔 Güncelleme ve bakım duyurularını kaçırmayın\n⚡ Destek ekibimizle hızlıca iletişime geçin\n🏆 Özel etkinliklere katılın" })
        .setFooter(footer()).setTimestamp(now);

    case "website":
      return new EmbedBuilder()
        .setTitle("Vantarise Resmi Web Sitesi")
        .setColor(0x059669)
        .setDescription("## 🌐 www.vantarise.net")
        .addFields({ name: "Sitede Neler Yapabilirsiniz?", value: "💎 VIP satın alabilirsiniz\n🎒 Özel eşyalar satın alabilirsiniz\n🎫 Destek talebi oluşturabilirsiniz\n🎁 Sürpriz indirim ve hediyeleri kullanabilirsiniz" })
        .setFooter(footer()).setTimestamp(now);

    case "pets":
      return new EmbedBuilder()
        .setTitle("Evcil Hayvanlar (Pets)")
        .setColor(0x9333ea)
        .setDescription("## 🐾 Pet Sistemi\n`/pet` yazarak pet menüsünü açabilirsiniz.")
        .addFields(
          { name: "Kozmetik Petler", value: "VIP alarak çoğu pete erişebilirsiniz.\n⚠️ Bu petler **yalnızca kozmetiktir** *(PhantomVIP ve üstü)*" },
          { name: "Savaş Petleri ⚔️", value: "**Ender Dragon Peti** ve **Ghast Peti** özeldir:\n🛡️ Sizi diğer oyunculara karşı **korur**\n⚔️ Sizinle beraber **sonuna kadar savaşır!**" }
        )
        .setFooter(footer()).setTimestamp(now);

    case "vip":
      return new EmbedBuilder()
        .setTitle("VIP Paketleri")
        .setColor(0xd97706)
        .setDescription("## 💎 VIP Bilgileri\nVantarise'de 3 farklı VIP paketi mevcuttur.")
        .addFields(
          { name: "🟡 EclipseVIP — 134.99 TL", value: "```\n/vpanel • /uc ile uçma • Özel Tag, Kit, Maden\n2x /canta • /partikul • /pelerin\n/can • /yemek • +1 Arsa (Toplam 3)\nTek Seferlik +45.000TL Para\n```" },
          { name: "🟣 PhantomVIP — 184.99 TL", value: "```\n/vpanel • /uc ile uçma • Özel Tag, Kit, Maden\n2x /canta • /partikul • /pelerin\n/can • /yemek • Sohbet Rengi\n/pet Kozmetik • +2 Arsa (Toplam 4)\nTek Seferlik +85.000TL Para\n```" },
          { name: "🔴 VantaVIP — 244.99 TL", value: "```\n/vpanel • /uc ile uçma • Özel Tag, Kit, Maden\n2x /canta • /partikul • /pelerin\n/can • /yemek • Sohbet Rengi\n/pet Kozmetik • /tamir (Yalnızca VantaVIP)\n+3 Arsa (Toplam 5) • Tek Seferlik +145.000TL Para\n```" },
          { name: "📌 Önemli Notlar", value: "⚠️ Aktif VIP üzerine alımda eski VIP iptal olur\n⚠️ VIP bitince extra arsa elinizden alınmaz; ancak unclaimlerseniz yeni alamazsınız\n✅ Satın alınan VIP **anında** hesabınızda aktif olur\n🛒 Satın almak için → **www.vantarise.net**" }
        )
        .setFooter(footer()).setTimestamp(now);

    case "pazar":
      return new EmbedBuilder()
        .setTitle("Pazar Sistemi")
        .setColor(0xea580c)
        .setDescription("## 🏪 Adım Adım Pazar Kurma Rehberi\nKendi pazarınızı kurarak ürünlerinizi satabilirsiniz!")
        .addFields(
          { name: "1️⃣  Sandığı Hazırlayın", value: "Sandığı yere yerleştirin ve içine **satılacak ürünleri** koyun." },
          { name: "2️⃣  Tabela Yerleştirin", value: "Sandığın **tam üzerine** bir Tabela yerleştirin." },
          { name: "3️⃣  Tabelayı Doldurun", value: "```\n1. Satır → (Boş Bırakın)\n2. Satır → Fiyat       (Örn: 500)\n3. Satır → Miktar      (Örn: 64)\n4. Satır → Ürün Adı   (/pazar id ile öğrenin)\n```" },
          { name: "📌 Örnek Kurulum", value: "En üste **dokunma** → 2. satıra `100` → 3. satıra `1` → en alta `diamond`" }
        )
        .setFooter(footer()).setTimestamp(now);

    case "kurallar":
      return new EmbedBuilder()
        .setTitle("Sunucu Kuralları")
        .setColor(0xdc2626)
        .setDescription("## 📜 Vantarise Kuralları\nTüm oyuncularımız bu kuralları okumuş ve **kabul etmiş** sayılır.")
        .addFields(
          { name: "⚔️ Oyun İçi Kurallar", value: "**1 —** **Saygı ve Üslup:** Küfür, hakaret ve aşağılayıcı söylemler kesinlikle yasaktır.\n**2 —** **Hile:** X-ray, Killaura, Fly, Reach vb. ve makro kullanımı sınırsız ban sebebidir.\n**3 —** **Bug Kullanımı:** Sunucu açıklarını kendi yararına kullanmak yasaktır.\n**5 —** **Insiding:** Klana girip eşya çalmak veya zarar verip ayrılmak ağır ceza sebebidir.\n**11 —** **TP Tuzağı:** Oyuncuyu yanına çağırıp tuzağa düşürmek yasaktır.\n**12 —** **Lag Makinesi:** Sunucuyu yavaşlatacak devasa redstone yapıları yasaktır.\n**14 —** **Claim Griefing:** Rakip klanı kendi bölgesine hapsetmek yasaktır.\n**16 —** **Safezone Abuse:** Savaşta Safezone girip çıkarak avantaj sağlamak yasaktır." },
          { name: "💬 Sohbet Kuralları", value: "**4 —** **Reklam:** Başka sunucu/Discord/sosyal medya linki paylaşmak yasaktır.\n**6 —** **Spam:** Aynı mesajı tekrarlamak veya anlamsız karakter dizileri yasaktır.\n**9 —** **Siyaset ve Din:** Bu konularda tartışma ve propaganda yasaktır.\n**10 —** **Uygunsuz İsim/Skin:** Müstehcen veya nefret içerikli isim ve kostümler yasaktır." },
          { name: "🛡️ Hesap ve Ticaret Kuralları", value: "**7 —** **Dolandırıcılık:** Yanıltıcı ticaret veya oyunculara el koymak yasaktır.\n**8 —** **Yetkililere Saygı:** Yetkililere hakaret etmek veya sahte kanıt sunmak yasaktır.\n**13 —** **Hesap Güvenliği:** Her oyuncu kendi hesabından sorumludur.\n**15 —** **RMT:** Oyun içi öğelerin gerçek parayla platformlar arası satışı yasaktır.\n**17 —** **Kanıt Zorunluluğu:** Şikayette geçerli video/ekran görüntüsü zorunludur." },
          { name: "\u200b", value: "🔴 **Tüm oyuncularımız kuralları okumuş ve kabul etmiş sayılır!**" }
        )
        .setFooter(footer()).setTimestamp(now);

    default:
      return new EmbedBuilder().setTitle("Bilinmeyen Kategori").setColor(0x6b7280);
  }
}

function buildSelectMenu(selected) {
  const options = [
    { label: "Discord", desc: "Sunucumuza katılın", value: "discord", emoji: "🔵" },
    { label: "Web Sitesi", desc: "Resmi sitemiz hakkında", value: "website", emoji: "🌐" },
    { label: "Pets Bilgisi", desc: "Evcil hayvan sistemi", value: "pets", emoji: "🐾" },
    { label: "VIP Bilgileri", desc: "Paketler ve fiyatlar", value: "vip", emoji: "💎" },
    { label: "Pazar Sistemi", desc: "Pazar kurma rehberi", value: "pazar", emoji: "🏪" },
    { label: "Sunucu Kuralları", desc: "17 kural ve açıklamaları", value: "kurallar", emoji: "📜" },
  ];
  const menu = new StringSelectMenuBuilder()
    .setCustomId("bilgilendirme_menu")
    .setPlaceholder("📋  Bir kategori seçin...")
    .addOptions(options.map(o =>
      new StringSelectMenuOptionBuilder()
        .setLabel(o.label).setDescription(o.desc)
        .setValue(o.value).setEmoji(o.emoji)
        .setDefault(o.value === selected)
    ));
  return new ActionRowBuilder().addComponents(menu);
}

function buildMainEmbed() {
  return new EmbedBuilder()
    .setTitle("Vantarise Bilgilendirme Merkezi")
    .setColor(0x7c3aed)
    .setDescription("Aşağıdaki menüden bir kategori seçerek sunucu hakkında detaylı bilgi alabilirsiniz.\n\u200b")
    .addFields(
      { name: "🔵  Discord", value: "Topluluğumuza katılın", inline: true },
      { name: "🌐  Web Sitesi", value: "Resmi sitemiz", inline: true },
      { name: "🐾  Pets", value: "Evcil hayvanlar", inline: true },
      { name: "💎  VIP", value: "Paket bilgileri", inline: true },
      { name: "🏪  Pazar", value: "Pazar kurma rehberi", inline: true },
      { name: "📜  Kurallar", value: "Sunucu kuralları", inline: true },
    )
    .setFooter(footer()).setTimestamp();
}

function buildIletisimEmbed() {
  return new EmbedBuilder()
    .setTitle("İletişim & Destek")
    .setColor(0x0ea5e9)
    .setDescription("## 📞 Vantarise Destek Merkezi\nAşağıdaki kanallar üzerinden bize ulaşabilirsiniz.")
    .addFields(
      { name: "🌐 Web Sitesi", value: "Destek talebi oluşturmak için:\n**www.vantarise.net** → Giriş yap → Destek" },
      { name: "💬 Discord", value: "Sunucumuza katılarak destek kanallarından yardım alabilirsiniz:\n**discord.gg/vantarise**" },
      { name: "⚡ Hızlı Destek İpuçları", value: "```\n✔ Sorunuzu açık ve net yazın\n✔ Ekran görüntüsü veya video ekleyin\n✔ Kullanıcı adınızı belirtin\n✔ Yaşadığınız sorunu adım adım anlatın\n```" },
      { name: "⏰ Yanıt Süresi", value: "Yetkililerimiz en kısa sürede dönüş yapacaktır." }
    )
    .setFooter(footer()).setTimestamp();
}

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

async function registerCommands() {
  try {
    console.log("Slash komutları kaydediliyor...");
    await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), { body: commands });
    console.log("Slash komutları başarıyla kaydedildi.");
  } catch (err) {
    console.error("Slash komutları kaydedilemedi:", err);
  }
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("clientReady", () => {
  console.log(`Discord botu hazır: ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.type === InteractionType.ApplicationCommand) {
    if (interaction.commandName === "bilgilendirme") {
      await interaction.reply({ embeds: [buildMainEmbed()], components: [buildSelectMenu()], flags: 64 });
    }
    if (interaction.commandName === "iletisim") {
      await interaction.reply({ embeds: [buildIletisimEmbed()], flags: 64 });
    }
  }

  if (
    interaction.type === InteractionType.MessageComponent &&
    interaction.componentType === ComponentType.StringSelect &&
    interaction.customId === "bilgilendirme_menu"
  ) {
    const selected = interaction.values[0];
    await interaction.update({ embeds: [getEmbed(selected)], components: [buildSelectMenu(selected)] });
  }
});

await registerCommands();
await client.login(DISCORD_TOKEN);
