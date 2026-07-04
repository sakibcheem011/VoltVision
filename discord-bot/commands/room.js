const { SlashCommandBuilder } = require('discord.js');
const apiService = require('../services/apiService');
const { createInfoEmbed, createErrorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('room')
    .setDescription('Shows detailed information for a specific room')
    .addStringOption(option =>
      option.setName('room_name')
        .setDescription('The name of the room to query (e.g. "Drawing Room")')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    await interaction.deferReply();
    const roomQuery = interaction.options.getString('room_name').toLowerCase();
    const { data: rooms, error } = await apiService.getRooms();

    if (error) {
      return interaction.editReply({ embeds: [createErrorEmbed(error)] });
    }

    const room = rooms?.find(r => r.name.toLowerCase().includes(roomQuery));

    if (!room) {
      return interaction.editReply({ embeds: [createErrorEmbed(`Could not find a room matching "${roomQuery}".`)] });
    }

    const embed = createInfoEmbed(`Room: ${room.name}`);
    
    // Occupancy
    const cameraStatus = room.camera.status === 'online' ? '🟢 Online' : '🔴 Offline';
    const occupancyText = room.camera.isOccupied ? `Yes (${room.camera.peopleCount} people)` : 'No';
    
    embed.addFields(
      { name: 'Camera Status', value: cameraStatus, inline: true },
      { name: 'Occupied', value: occupancyText, inline: true }
    );

    // Devices & Power
    const activeDevices = room.devices.filter(d => d.status === 'on');
    const totalPower = activeDevices.reduce((sum, d) => sum + d.powerWatts, 0);
    
    const deviceStrings = room.devices.map(d => {
      return `${d.status === 'on' ? '⚡' : '💤'} **${d.name}**: ${d.status.toUpperCase()} ${d.status === 'on' ? '(' + d.powerWatts + 'W)' : ''}`;
    });

    embed.addFields(
      { name: 'Current Room Power', value: `${totalPower} W`, inline: false },
      { name: 'Devices', value: deviceStrings.join('\n') || 'No devices in this room.', inline: false }
    );

    await interaction.editReply({ embeds: [embed] });
  },
};
