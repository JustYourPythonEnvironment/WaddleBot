const collection = require('lodash/collection');
const helpEmbed = require('../embeds/helpEmbed.js');
const Utils = require('../utils/Utils.js');
const { HELP, HELP_SHORT } = require('../assets/flags.json');

const configuration = {
  enabled: true,
  name: 'list',
  aliases: [ 'l' ],
  description: 'lists all of the saved media.',
  usage: 'list',
};

module.exports = {
  conf: configuration,

  run: async (client, message, args) => {

    if (args[0] === HELP || args[0] === HELP_SHORT) {
      helpEmbed(message, configuration);
      Utils.errAndMsg(message.channel, 'Invalid arguments.');
    } else {
      try {
        const snapshot = await client.database.ref(`reactions/`).orderByKey().once('value');
        const mediaData = snapshot.val();
        const sortedMediaNames = collection.groupBy(Object.keys(mediaData).filter(key => key !== 'TEMPLATE'), name => name[0]);
        const fields = Object.keys(sortedMediaNames).map(key => { return { name: key, value: sortedMediaNames[key].join(', ') }; });
        message.channel.send("Saved Media:");
        while (fields.length > 0) {
          const embed = {
            fields: fields.splice(0, 25)
          };

          message.channel.send({ embed });
        }
      } catch (err) {
        console.error(err);
        message.channel.send(`TT! I couldn't list all media because: ${err}`);
      }
    }
    return;
  },
};
