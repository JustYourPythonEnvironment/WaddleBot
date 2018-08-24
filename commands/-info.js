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
      client.database.ref(`aliases/${args[0]}`).once('value')
        .then(aliasSnapShot => {
          client.database.ref(`reactions/${aliasSnapShot.val()}`).once('value')
            .then(async snapshot => {
              const name = snapshot.key;
              const info = snapshot.val();
              const user = await client.fetchUser(info.addedBy.id).catch((err) => {
                  console.log(err);
                }) || 'Unknown User';
              savedMediaEmbed(message.channel, name, info, user);
            }).catch(err => Utils.errAndMsg(message.channel, err));
        }).catch(err => Utils.errAndMsg(message.channel, err));
    }
    return;
  },
};
