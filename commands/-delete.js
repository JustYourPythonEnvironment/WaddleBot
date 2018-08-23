const database = require("firebase").database();
const helpEmbed = require('../embeds/helpEmbed.js');
const Utils = require('../utils/Utils.js');
const { HELP, HELP_SHORT } = require('../assets/flags.json');

const configuration = {
  enabled: true,
  name: '-delete',
  aliases: [ '-d' ],
  description: 'Deletes a media by name',
  usage: '-delete <NAME>',
};

module.exports = {
  conf: configuration,

  run: async (client, message, args) => {

    if (args[0] === HELP || args[0] === HELP_SHORT || args.length < 1) {
      helpEmbed(message, configuration);
      Utils.errAndMsg(message.channel, 'Invalid arguments.');
    } else {
      database.ref(`reactions/${args[0]}`).remove()
        .then(() => message.channel.send(`I've removed ${args[0]}!`))
        .catch(err => Utils.errAndMsg(message.channel, err));;
    }
    return;
  },
};
