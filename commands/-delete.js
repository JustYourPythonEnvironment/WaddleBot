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
      try {
        const aliasSnapshot = await client.database.ref(`aliases/${args[0]}`).once('value');
        const mediaName = aliasSnapshot.val();
        const mediaSnapshot = await client.database.ref(`reactions/${mediaName}`).once('value');
        const aliases = mediaSnapshot.val().aliases;

        // aggregates all the necessary updates in updateData for atomic operation
        let updateData = {};
        updateData[`reactions/${mediaName}`] = null;
        updateData[`aliases/${mediaName}`] = null;
        if (aliases) aliases.forEach(arg => updateData[`aliases/${arg}`] = null);

        await client.database.ref().update(updateData);
        message.channel.send(`I've removed ${args[0]}!`);
      } catch (err) {
        console.error(err);
        message.channel.send(`TT! I couldn't remove ${args[0]} because: ${err}`);
      }
    }
    return;
  },
};
