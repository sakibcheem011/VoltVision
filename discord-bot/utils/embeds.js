const { EmbedBuilder } = require('discord.js');

const createErrorEmbed = (errorMsg) => {
  return new EmbedBuilder()
    .setColor(0xFF0000)
    .setTitle('⚠️ Gateway Connection Error')
    .setDescription(errorMsg || 'An unknown error occurred.')
    .setTimestamp();
};

const createSuccessEmbed = (title) => {
  return new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle(title)
    .setTimestamp();
};

const createInfoEmbed = (title) => {
  return new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(title)
    .setTimestamp();
};

module.exports = {
  createErrorEmbed,
  createSuccessEmbed,
  createInfoEmbed,
};
