const { REST, Routes } = require('discord.js');
const { token, clientId } = require('../config/config');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, '../commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  commands.push(command.data.toJSON());
}

if (!token || !clientId) {
  console.error('[ERROR] Missing DISCORD_TOKEN or CLIENT_ID in .env file!');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log(`[Register] Started refreshing ${commands.length} application (/) commands.`);

    // Use applicationCommands to register globally (may take up to an hour to cache on all servers)
    // or applicationGuildCommands for a specific server (instant).
    // Using global registration here for simplicity.
    const data = await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );

    console.log(`[Register] Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();
