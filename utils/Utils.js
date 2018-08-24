const errorPhrases = require('../assets/errorPhrases.json');
const moment = require('moment');

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

module.exports = {
  logAndMsg,
  getRandomIndex,
  errAndMsg,
  getUnixTimestamp,
  getHumanReadableDateTime,
};