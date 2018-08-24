const helpEmbed = require('../embeds/helpEmbed.js');
const Utils = require('../utils/Utils.js');
const { HELP, HELP_SHORT } = require('../assets/flags.json');

const configuration = {
  enabled: true,
  name: '-add',
  aliases: [ '-a' ],
  description: 'Saves a media to <NAME> with aliases <ALIASES>',
  usage: '-add <NAME> <MEDIA> <ALIASES>',
};

module.exports = {
  conf: configuration,

  run: async (client, message, args) => {

    if (args[0] === HELP || args[0] === HELP_SHORT || args.length < 2) {
      helpEmbed(message, configuration);
      Utils.errAndMsg(message.channel, 'Invalid arguments.');
    } else {
      let aliases = args.slice(2);
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
      client.database.ref().update(updateData)
        .then(() => message.channel.send(`I've set ${args[1]} to ${args[0]}!`))
        .catch(err => Utils.errAndMsg(message.channel, err));;
    }
    return;
  },
};
