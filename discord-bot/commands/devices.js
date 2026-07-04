const { SlashCommandBuilder } = require('discord.js');
const apiService = require('../services/apiService');
const { createInfoEmbed, createErrorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('devices')
    .setDescription('Shows all devices grouped by room'),
  
  async execute(interaction) {
    await interaction.deferReply();
    const { data: devices, error } = await apiService.getDevices();

    if (error) {
      return interaction.editReply({ embeds: [createErrorEmbed(error)] });
    }

    if (!devices || devices.length === 0) {
      return interaction.editReply({ embeds: [createInfoEmbed('No devices found.')] });
    }

    const embed = createInfoEmbed('VoltVision Devices');
    
    // Group devices by roomName
    const grouped = {};
    devices.forEach(dev => {
      if (!grouped[dev.roomName]) grouped[dev.roomName] = [];
      grouped[dev.roomName].push(dev);
    });

    for (const [room, devs] of Object.entries(grouped)) {
      const devStrings = devs.map(d => {
        const statusEmoji = d.status === 'on' ? '⚡' : '💤';
        return `${statusEmoji} **${d.name}** - ${d.status.toUpperCase()} (${d.status === 'on' ? d.powerWatts + 'W' : '0W'})`;
      });
      embed.addFields({ name: room, value: devStrings.join('\n') });
    }

    await interaction.editReply({ embeds: [embed] });
  },
};
