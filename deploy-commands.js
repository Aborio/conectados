import 'dotenv/config';
import { REST, Routes, ApplicationCommandOptionType, ChannelType } from 'discord.js';

const commands = [
  {
    name: 'conectados',
    description: 'Cuenta y lista los usuarios conectados en un canal de voz',
    options: [
      {
        name: 'canal',
        description: 'Canal de voz a consultar',
        type: ApplicationCommandOptionType.Channel,
        required: true,
        channel_types: [ChannelType.GuildVoice, ChannelType.GuildStageVoice]
      },
      {
        name: 'eventos',
        description: 'Texto libre: eventos/horarios/nota para incluir en el informe',
        type: ApplicationCommandOptionType.String,
        required: false
      }
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function main() {
  try {
    if (process.env.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
      );
      console.log('✅ Comandos (guild) registrados.');
    } else {
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
      );
      console.log('✅ Comandos (globales) registrados.');
    }
  } catch (err) {
    console.error('❌ Error registrando comandos:', err);
  }
}
main();
