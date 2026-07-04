const { SlashCommandBuilder } = require('discord.js');
const apiService = require('../services/apiService');
const { createInfoEmbed, createErrorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('alerts')
    .setDescription('Shows all active alerts'),
  
  async execute(interaction) {
    await interaction.deferReply();
    const { data: alerts, error } = await apiService.getAlerts();

    if (error) {
      return interaction.editReply({ embeds: [createErrorEmbed(error)] });
    }

    const activeAlerts = alerts?.filter(a => a.status === 'active') || [];

    if (activeAlerts.length === 0) {
      return interaction.editReply({ embeds: [createInfoEmbed('✅ No active alerts at the moment.')] });
    }

    const embed = createInfoEmbed('⚠️ Active System Alerts').setColor(0xFFA500);
    
    activeAlerts.forEach(alert => {
      embed.addFields({
        name: `[${alert.severity.toUpperCase()}] ${alert.title} - ${alert.roomName}`,
        value: `${alert.description}\n*Time: ${alert.timestamp}*`
      });
    });

    await interaction.editReply({ embeds: [embed] });
  },
};
