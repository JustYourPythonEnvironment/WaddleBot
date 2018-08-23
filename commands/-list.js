const database = require("firebase").database();
const helpEmbed = require('../embeds/helpEmbed.js');
const Utils = require('../utils/Utils.js');
const { HELP, HELP_SHORT } = require('../assets/flags.json');

const configuration = {
  enabled: true,
  name: '-list',
  aliases: [ '-l' ],
  description: 'lists all of the saved media.',
  usage: '-list',
};

module.exports = {
  conf: configuration,

  run: async (client, message, args) => {

    if (args[0] === HELP || args[0] === HELP_SHORT) {
      helpEmbed(message, configuration);
      Utils.errAndMsg(message.channel, 'Invalid arguments.');
    } else {
      database.ref(`reactions/`).once('value')
        .then(snapshot => {
          const mediaData = snapshot.val();
          const embed = {
            author: {
              name: 'All Saved Media',
            },
            fields: Object.keys(mediaData)
              .filter(key => key !== 'TEMPLATE')
              .map(key => { return { name: `${key} - (Created by: @${mediaData[key].addedBy.username})`, value: mediaData[key].media }})
          };
          message.channel.send({ embed });
        })
        .catch(err => Utils.errAndMsg(message.channel, err));
    }
    return;
  },
};
