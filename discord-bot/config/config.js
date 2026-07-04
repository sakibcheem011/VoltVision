require('dotenv').config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  backendUrl: process.env.BACKEND_URL || 'http://localhost:4000',
};
