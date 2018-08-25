const helpEmbed = require('../embeds/helpEmbed.js');
const Utils = require('../utils/Utils.js');
const { HELP, HELP_SHORT } = require('../assets/flags.json');

const configuration = {
  enabled: true,
  name: '-update',
  aliases: [ '-u' ],
  description: 'updates with a saved media with a new source.',
  usage: '-update <NAME> <NEW_SOURCE_URL>',
};

module.exports = {
  conf: configuration,

  run: async (client, message, args) => {

    if (args[0] === HELP || args[0] === HELP_SHORT || args.length < 2) {
      helpEmbed(message, configuration);
      Utils.errAndMsg(message.channel, 'Invalid arguments.');
    } else {
      try {
        const aliasSnapshot = await client.database.ref(`aliases/${args[0]}`).once('value');
        await client.database.ref(`reactions/${aliasSnapshot.val()}`).update({ media: args[1] });
        message.channel.send(`I've updated ${args[0]} with ${args[1]}`);
      } catch (err) {
        console.error(err);
        message.channel.send(`TT! I couldn't update ${args[0]} with ${args[1]} because: ${err}!`);
      }
    }
    return;
  },
};
