const helpEmbed = require('../embeds/helpEmbed.js');
const Utils = require('../utils/Utils.js');
const { HELP, HELP_SHORT } = require('../assets/flags.json');

const configuration = {
  enabled: true,
  name: '-rename',
  aliases: [ '-rn' ],
  description: 'Renames a media from <OLD_NAME> to <NEW_NAME> with <NEW_ALIASES>. Note that this will remove old aliases',
  usage: '-rename <OLD_NAME> <NEW_NAME> <NEW_ALIASES>',
};

module.exports = {
  conf: configuration,

  run: async (client, message, args) => {

    if (args[0] === HELP || args[0] === HELP_SHORT || args.length < 2) {
      helpEmbed(message, configuration);
      Utils.errAndMsg(message.channel, 'Invalid arguments.');
    } else {
      client.database.ref(`aliases/${args[0]}`).once('value')
        .then(aliasSnapShot => {
          const mediaName = aliasSnapShot.val();
          const oldMediaRef = client.database.ref(`reactions/${mediaName}`);
          oldMediaRef.once('value')
            .then(snapshot => {
              const oldMedia = snapshot.val();
              if (oldMedia.aliases) oldMedia.aliases.forEach(arg => {updateData[`aliases/${arg}`] = null;});
              const newAliases = args.slice(2);
              oldMedia.aliases = newAliases;
              let updateData = {};
              updateData[`reactions/${args[1]}`] = oldMedia;
              updateData[`reactions/${mediaName}`] = null;
              updateData[`aliases/${mediaName}`] = null;
              updateData[`aliases/${args[1]}`] = args[1];
              if (newAliases) newAliases.forEach(arg => updateData[`aliases/${arg}`] = args[1]);
              client.database.ref().update(updateData)
                .then(() => {
                  oldMediaRef.remove()
                    .then(() => message.channel.send(`I've renamed ${mediaName} to ${args[1]}!`))
                    .catch(err => Utils.errAndMsg(message.channel, err));
                })
                .catch(err => Utils.errAndMsg(message.channel, err));
            }).catch(err => Utils.errAndMsg(message.channel, err));
        }).catch(err => Utils.errAndMsg(message.channel, err));
    }
    return;
  },
};
