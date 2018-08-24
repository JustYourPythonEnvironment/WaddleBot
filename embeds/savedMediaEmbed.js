const { RichEmbed } = require('discord.js');
const { getHumanReadableDateTime } = require('../utils/Utils.js');

module.exports = (channel, name, info, user) => {
  const embed = new RichEmbed()
    .setTitle(name)
    .addField('**Source**', info.media)
    .addField('**Created By**', `${user}`)
    .addField('**Timestamp**', getHumanReadableDateTime(info.timestamp));

  channel.send(embed);
  return;
}
