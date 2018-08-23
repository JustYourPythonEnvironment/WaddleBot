const Utils = require('../utils/Utils.js');

module.exports = async (client, message) => {
  if (message.author.bot || message.content.indexOf(client.config.prefix) !== 0) return;
  Utils.handleCommand(client, message);
  return;
};