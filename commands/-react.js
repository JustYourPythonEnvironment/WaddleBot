const helpEmbed = require('../embeds/helpEmbed.js');
const Utils = require('../utils/Utils.js');
const { HELP, HELP_SHORT } = require('../assets/flags.json');

const configuration = {
  enabled: true,
  name: '-react',
  aliases: [ '-r' ],
  description: 'reacts with a saved media.',
  usage: '-react <NAME>',
};

module.exports = {
  conf: configuration,

  run: async (client, message, args) => {

    if (args[0] === HELP || args[0] === HELP_SHORT || args.length < 1) {
      helpEmbed(message, configuration);
      Utils.errAndMsg(message.channel, 'Invalid arguments.');
    } else {
      client.database.ref(`aliases/${args[0]}`).once('value')
        .then(aliasSnapShot => {
          client.database.ref(`reactions/${aliasSnapShot.val()}/media`).once('value')
            .then(mediaSnapShot => message.channel.send(mediaSnapShot.val()))
            .catch(err => Utils.errAndMsg(message.channel, err));
        })
        .catch(err => Utils.errAndMsg(message.channel, err));
    }
    return;
  },
};
