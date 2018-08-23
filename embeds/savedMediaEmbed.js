const { RichEmbed } = require('discord.js');

module.exports = (channel, name, info) => {
  const embed = new RichEmbed()
    .setTitle(name)
    .addField('**Source**', info.media)
    .addField('**Created By**', `@${info.addedBy.username}`)
    .addField('**TimeStamp**', new Date(info.timestamp).toString());

  channel.send(embed);
  return;
}
