const { SlashCommandBuilder } = require('discord.js');
const apiService = require('../services/apiService');
const { createInfoEmbed, createErrorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Shows the current system status and overall metrics'),
  
  async execute(interaction) {
    await interaction.deferReply();
    const { data, error } = await apiService.getStatus();

    if (error) {
      return interaction.editReply({ embeds: [createErrorEmbed(error)] });
    }

    const embed = createInfoEmbed('VoltVision System Status')
      .addFields(
        { name: 'Gateway Status', value: data.status === 'online' ? '🟢 Online' : '🔴 Offline', inline: true },
        { name: 'Total Devices', value: `${data.totalDevices}`, inline: true },
        { name: 'Devices ON', value: `${data.devicesOn}`, inline: true },
        { name: 'Current Power', value: `${data.currentPowerWatts} W`, inline: true },
        { name: 'Active Alerts', value: `${data.activeAlerts}`, inline: true }
      );

    await interaction.editReply({ embeds: [embed] });
  },
};
