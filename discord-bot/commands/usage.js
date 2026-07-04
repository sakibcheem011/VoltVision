const { SlashCommandBuilder } = require('discord.js');
const apiService = require('../services/apiService');
const { createInfoEmbed, createErrorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('usage')
    .setDescription('Shows today\'s energy usage, current power, and estimated cost'),
  
  async execute(interaction) {
    await interaction.deferReply();
    const { data, error } = await apiService.getUsage();

    if (error) {
      return interaction.editReply({ embeds: [createErrorEmbed(error)] });
    }

    const embed = createInfoEmbed('VoltVision Energy Analytics')
      .addFields(
        { name: 'Current Total Power', value: `${data.currentPowerWatts} W`, inline: true },
        { name: 'Today\'s Energy', value: `${data.todayEnergyKwh} kWh`, inline: true },
        { name: 'Estimated Cost', value: `${data.estimatedCostToday} ${data.currency}`, inline: true }
      );

    await interaction.editReply({ embeds: [embed] });
  },
};
