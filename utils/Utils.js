const errorPhrases = require('../assets/errorPhrases.json');
const moment = require('moment');
const collection = require('lodash/collection');

logAndMsg = (channel, msg) => {
    console.log(msg);
    channel.send(msg);
};
getRandomIndex = (arr) => Math.floor(Math.random() * arr.length);
errAndMsg = (channel, err) => {
    console.error(err);
    channel.send(`${errorPhrases[getRandomIndex(errorPhrases)]} ${err}`);
};

getUnixTimestamp = () => {
    return moment().valueOf();
};

getHumanReadableDateTime = (datetime) => {
    return moment(datetime).format("dddd, MMMM Do YYYY, h:mm:ssA");
};

formatArrayAsList = arr => {
    // https://stackoverflow.com/a/29234240/5750790
    let outStr = "";
    arr = arr.map(el => '`' + el + '`');
    if (arr.length === 1) {
        outStr = arr[0];
    } else if (arr.length === 2) {
        outStr = arr.join(' and ');
    } else if (arr.length > 2) {
        outStr = arr.slice(0, -1).join(', ') + ', and ' + arr.slice(-1);
    }
    return outStr;
};

updateReactionsList = (snapshot, channel) => {
    const mediaData = snapshot.val();
    const sortedMediaNames = collection.groupBy(Object.keys(mediaData).filter(key => key !== 'TEMPLATE'), name => name[0].toLowerCase());
    channel.fetchMessages().then(messages => messages.forEach(msg => msg.delete()));
    const embeds = Object.keys(sortedMediaNames).sort().map(key => ({
        title: key.match(/[a-z]/i) ? `:regional_indicator_${key}:` : key,
        description: sortedMediaNames[key].reduce((acc, val) => acc + `, [${val}](${mediaData[val].media})`, '').substring(2),
    }));

    // send in order
    embeds.reduce((chain, embed) => chain.then(() => channel.send({ embed })), Promise.resolve());
};


module.exports = {
    logAndMsg,
    getRandomIndex,
    errAndMsg,
    getUnixTimestamp,
    getHumanReadableDateTime,
    formatArrayAsList,
    updateReactionsList,
};
