const Utils = require('../utils/Utils.js');

module.exports = async (client, oldMessage, newMessage) => {
  if (newMessage.author.bot || newMessage.content.indexOf(client.config.prefix) !== 0) return;
  Utils.handleCommand(client, newMessage);
  return;
};