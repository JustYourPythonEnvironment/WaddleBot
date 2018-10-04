const collection = require('lodash/collection');
const helpEmbed = require('../embeds/helpEmbed.js');
const Utils = require('../utils/Utils.js');
const { HELP, HELP_SHORT } = require('../assets/flags.json');

const configuration = {
    enabled: true,
    name: 'search',
    aliases: [ 's' ],
    description: 'Searches for a reaction gif based on an input name.',
    usage: 'search <NAME>',
};

module.exports = {
    conf: configuration,

    run: async (client, message, args) => {

        if (args[0] === HELP || args[0] === HELP_SHORT || args.length < 1) {
            helpEmbed(message, configuration);
            Utils.errAndMsg(message.channel, 'Invalid arguments.');
        } else {
            const searchKey = args[0];
            try {
                const snapshot = await client.database.ref(`reactions/`).orderByKey().once('value');
                const mediaData = snapshot.val();
                const sortedMediaNames = collection.groupBy(Object.keys(mediaData).filter(key => key.includes(searchKey)), results => 'results');
                const results = sortedMediaNames.results;
                const numResults = results.length;
                if (numResults > 0) {
                    message.channel.send(`I found ${numResults} reaction${numResults > 1 ? 's' : ''} that contained ${searchKey}: ${formatArrayAsList(results)}.`);
                } else {
                    message.channel.send(`TT! I coudln't find any reactions containing ${searchTerm}!`);
                }
            } catch (err) {
                console.error(err);
                message.channel.send(`TT! I coudln't find any reactions containing ${searchTerm} because: ${err}`);
            }
        }
        return;
    },
};
