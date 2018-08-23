const errorPhrases = require('../assets/errorPhrases.json');

logAndMsg = (channel, msg) => {
  console.log(msg);
  channel.send(msg);
};
getRandomIndex = (arr) => Math.floor(Math.random() * arr.length);
errAndMsg = (channel, err) => {
  console.error(err);
  channel.send(`${errorPhrases[getRandomIndex(errorPhrases)]} ${err}`);
};
handleCommand = (client, message) => {
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  console.log(args, command);

  let commandToRun = null;

  if (client.commands.has(command)) {
    commandToRun = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    commandToRun = client.commands.get(client.aliases.get(command));
  }

  if (commandToRun) {
    commandToRun.run(client, message, args);
  } else {
    errAndMsg(message.channel, 'Invalid command.');
  }
};


module.exports = {
  logAndMsg,
  getRandomIndex,
  errAndMsg,
  handleCommand,
};