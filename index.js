import 'dotenv/config';
import {
  Client,
  GatewayIntentBits,
  ChannelType,
  Partials
} from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.GuildMember]
});

client.once('ready', () => {
  console.log(`✅ Bot conectado como: ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'conectados') return;

  try {
    // Evita timeout
    await interaction.deferReply({ ephemeral: false });

    const canal = interaction.options.getChannel('canal', true);

    if (![ChannelType.GuildVoice, ChannelType.GuildStageVoice].includes(canal.type)) {
      return interaction.editReply('❌ Debes elegir un **canal de voz**.');
    }

    const miembros = canal.members ?? new Map();
    const cantidad = miembros.size;

    const apodos = [...miembros.values()]
      .map(m => m.displayName ?? m.user?.username ?? '—')
      .sort((a, b) => a.localeCompare(b, 'es'));

    const lista = apodos.length > 0
      ? apodos.map(n => `• ${n}`).join('\n')
      : 'No hay usuarios conectados.';

    await interaction.editReply(`📢 **Canal:** ${canal.name}\n👥 **Cantidad:** ${cantidad}\n\n${lista}`);

  } catch (err) {
    console.error('❌ Error en /conectados:', err);

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply('⚠️ Ocurrió un error procesando el comando.');
    } else {
      await interaction.reply({ content: '⚠️ Ocurrió un error procesando el comando.', ephemeral: true });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
