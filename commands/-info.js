const helpEmbed = require('../embeds/helpEmbed.js');
const savedMediaEmbed = require('../embeds/savedMediaEmbed.js');
const Utils = require('../utils/Utils.js');
const { HELP, HELP_SHORT } = require('../assets/flags.json');

const configuration = {
  enabled: true,
  name: '-info',
  aliases: [ '-i' ],
  description: 'shows info of a saved media.',
  usage: '-info <NAME>',
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
        const mediaSnapshot = await client.database.ref(`reactions/${aliasSnapshot.val()}`).once('value');
        const name = mediaSnapshot.key;
        const info = mediaSnapshot.val();
        const user = await client.fetchUser(info.addedBy.id).catch(console.error) || 'Unknown User';
        savedMediaEmbed(message.channel, name, info, user);
      } catch (err) {
        console.error(err);
        message.channel.send(`TT! I can't find ${args[0]}!`);
      }
    }
    return;
  },
};
