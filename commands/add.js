const emojiRegex = require('emoji-regex');
const helpEmbed = require('../embeds/helpEmbed.js');
const Utils = require('../utils/Utils.js');
const { HELP, HELP_SHORT } = require('../assets/flags.json');

const configuration = {
  enabled: true,
  name: 'add',
  aliases: [ 'a' ],
  description: 'Saves a media to <NAME> with aliases <ALIASES>',
  usage: 'add <NAME> <MEDIA> <ALIASES>',
};

const regex = emojiRegex();

module.exports = {
  conf: configuration,

  run: async (client, message, args) => {

    if (args[0] === HELP || args[0] === HELP_SHORT || args.length < 2) {
      helpEmbed(message, configuration);
      Utils.errAndMsg(message.channel, 'Invalid arguments.');
    } else if (args.filter(arg => regex.exec(arg)).length > 0) {
      message.channel.send('Reaction names may not contain emojis. Please try again.')
    } else {
      let aliases = args.slice(2);

      // aggregates all the necessary updates in updateData for atomic operation
      let updateData = {};
      updateData[`reactions/${args[0]}`] = {
        media: args[1],
        addedBy: {
          id: message.author.id,
          username: message.author.username
        },
        timestamp: Utils.getUnixTimestamp(),
        aliases
      };
      updateData[`aliases/${args[0]}`] = args[0];
      aliases.forEach(arg => updateData[`aliases/${arg}`] = args[0]);

      try {
        await client.database.ref().update(updateData);
        message.channel.send(`I've set ${args[1]} to ${args[0]}!`)
      } catch (err) {
        console.error(err);
        message.channel.send(`TT! I couldn't add ${args[0]} because: ${err}`);
      }
    }
    return;
  },
};
