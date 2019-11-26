const emojiRegex = require('emoji-regex');
const helpEmbed = require('../embeds/helpEmbed.js');
const Utils = require('../utils/Utils.js');
const { HELP, HELP_SHORT } = require('../assets/flags.json');

const configuration = {
  enabled: true,
  name: 'rename',
  aliases: [ 'rn' ],
  description: 'Renames a media from <OLD_NAME> to <NEW_NAME> with <NEW_ALIASES>. Note that this will remove old aliases',
  usage: 'rename <OLD_NAME> <NEW_NAME> <NEW_ALIASES>',
};

const regex = emojiRegex();

module.exports = {
  conf: configuration,

  run: async (client, message, args) => {

    if (args[0] === HELP || args[0] === HELP_SHORT || args.length < 2) {
      helpEmbed(message, configuration);
      Utils.errAndMsg(message.channel, 'Invalid arguments.');
    } else if (args.filter(arg => regex.exec(arg)).length > 0) {
      message.channel.send('Reaction aliases may not contain emojis. Please try again.')
    } else {
      try {
        const aliasSnapshot = await client.database.ref(`aliases/${args[0]}`).once('value');
        const mediaName = aliasSnapshot.val();
        const mediaSnapshot = await client.database.ref(`reactions/${mediaName}`).once('value');
        const media = mediaSnapshot.val();

        // aggregates all the necessary updates in updateData for atomic operation
        let updateData = {};
        if (media.aliases) media.aliases.forEach(arg => {updateData[`aliases/${arg}`] = null;});
        const newAliases = args.slice(2);
        media.aliases = newAliases;
        updateData[`reactions/${mediaName}`] = null;
        updateData[`reactions/${args[1]}`] = media;
        updateData[`aliases/${mediaName}`] = null;
        updateData[`aliases/${args[1]}`] = args[1];
        if (newAliases) newAliases.forEach(arg => updateData[`aliases/${arg}`] = args[1]);

        await client.database.ref().update(updateData);
        message.channel.send(`I've renamed ${mediaName} to ${args[1]}!`);
      } catch (err) {
        console.error(err);
        message.channel.send(`TT! I couldn't rename ${args[0]} to ${args[1]} because: ${err}`);
      }
    }
    return;
  },
};
