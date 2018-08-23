const database = require("firebase").database();
const helpEmbed = require('../embeds/helpEmbed.js');
const Utils = require('../utils/Utils.js');
const { HELP, HELP_SHORT } = require('../assets/flags.json');

const configuration = {
  enabled: true,
  name: '-add',
  aliases: [ '-a' ],
  description: 'Saves a media to <NAME>',
  usage: '-add <NAME> <MEDIA>',
};

module.exports = {
  conf: configuration,

  run: async (client, message, args) => {

    if (args[0] === HELP || args[0] === HELP_SHORT || args.length < 2) {
      helpEmbed(message, configuration);
      Utils.errAndMsg(message.channel, 'Invalid arguments.');
    } else {
      database.ref(`reactions/${args[0]}`).set(args[1])
        .then(() => message.channel.send(`I've set ${args[1]} to ${args[0]}!`))
        .catch(err => Utils.errAndMsg(message.channel, err));;
    }
    return;
  },
};
