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
      client.database.ref(`aliases/${args[0]}`).once('value')
        .then(aliasSnapShot => {
          const mediaName = aliasSnapShot.val();
          client.database.ref(`reactions/${mediaName}`).once('value')
            .then(snapshot => {
              const aliases = snapshot.val().aliases;
              let updateData = {};
              updateData[`reactions/${mediaName}`] = null;
              updateData[`aliases/${mediaName}`] = null;
              aliases.forEach(arg => updateData[`aliases/${arg}`] = null);
              client.database.ref().update(updateData)
                .then(() => message.channel.send(`I've removed ${args[0]}!`))
                .catch(err => Utils.errAndMsg(message.channel, err));
            }).catch(err => Utils.errAndMsg(message.channel, err));
        }).catch(err => Utils.errAndMsg(message.channel, err));
    }
    return;
  },
};
