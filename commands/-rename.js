const helpEmbed = require('../embeds/helpEmbed.js');
const Utils = require('../utils/Utils.js');
const { HELP, HELP_SHORT } = require('../assets/flags.json');

const configuration = {
  enabled: true,
  name: '-rename',
  aliases: [ '-rn' ],
  description: 'Renames a media from <OLD_NAME> to <NEW_NAME>',
  usage: '-rename <OLD_NAME> <NEW_NAME>',
};

module.exports = {
  conf: configuration,

  run: async (client, message, args) => {

    if (args[0] === HELP || args[0] === HELP_SHORT || args.length < 2) {
      helpEmbed(message, configuration);
      Utils.errAndMsg(message.channel, 'Invalid arguments.');
    } else {
      const oldMedia = database.ref(`reactions/${args[0]}`);
      oldMedia.once('value')
        .then(snapshot => {
          client.database.ref(`reactions/${args[1]}`).set(snapshot.val())
            .then(() => {
              oldMedia.remove()
                .then(() => message.channel.send(`I've renamed ${args[0]} to ${args[1]}!`));
            })
        }).catch(err => Utils.errAndMsg(message.channel, err));
    }
    return;
  },
};
