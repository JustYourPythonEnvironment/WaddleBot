const helpEmbed = require('../embeds/helpEmbed.js');
const Utils = require('../utils/Utils.js');
const { HELP, HELP_SHORT } = require('../assets/flags.json');
const stringSimilarity = require('string-similarity');

const configuration = {
  enabled: true,
  name: 'react',
  aliases: [ 'r' ],
  description: 'reacts with a saved media.',
  usage: 'react <NAME>',
};

module.exports = {
  conf: configuration,

  run: async (client, message, args) => {

    if (args[0] === HELP || args[0] === HELP_SHORT || args.length < 1) {
      helpEmbed(message, configuration);
      Utils.errAndMsg(message.channel, 'Invalid arguments.');
    } else {
      try {
        const aliasSnapshot = await client.database.ref(`aliases/${args[0]}`).once('value');
        const mediaSnapshot = await client.database.ref(`reactions/${aliasSnapshot.val()}/media`).once('value');
        message.channel.send(mediaSnapshot.val());
      } catch (err) {
        // find most similar reaction if not found
        const snapshot = await client.database.ref(`reactions/`).once('value');
        const mediaKeys = Object.keys(snapshot.val());
        const bestMatch = stringSimilarity.findBestMatch(args[0], mediaKeys).bestMatch.target;

        try {
          const aliasSnapshot = await client.database.ref(`aliases/${bestMatch}`).once('value');
          const mediaSnapshot = await client.database.ref(`reactions/${aliasSnapshot.val()}/media`).once('value');
          message.channel.send(mediaSnapshot.val());
        } catch (err) {
          console.error(err);
          message.channel.send(`TT! I can't find ${args[0]}!`);
        }
      }
    }
    return;
  },
};
