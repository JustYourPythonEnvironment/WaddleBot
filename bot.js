require('dotenv').config();
const Discord      = require('discord.js');
const firebase     = require("firebase");
const fs           = require('fs');
const config       = require('./config.json');

const discordToken = process.env.DISCORD_TOKEN;
const client       = new Discord.Client();

const COMMANDS_DIR = './commands/';
const EVENTS_DIR = './events/';

firebase.initializeApp({
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  databaseURL: process.env.FB_DB,
  storageBucket: process.env.DB_STORAGE_BUCKET,
});

const database = firebase.database();

client.config = config;
client.database = database;
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir(COMMANDS_DIR, (err, files) => {
  if (err) {
    console.error(err);
  } else {
    files.forEach(f => {
      /* eslint-disable-next-line import/no-dynamic-require, global-require */
      const props = require(`${COMMANDS_DIR}${f}`);
      if (props.conf.enabled) {
        client.commands.set(props.conf.name, props);
        props.conf.aliases.forEach(alias => {
          client.aliases.set(alias, props.conf.name);
        });
        console.log(`Loaded Command: ${props.conf.name}. 👌`);
      }
    });
  }
});

fs.readdir(EVENTS_DIR, (err, files) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Loading a total of ${files.length} events.`);
    files.forEach(f => {
      const eventName = f.split(".")[0];
      /* eslint-disable-next-line import/no-dynamic-require, global-require */
      const event = require(`${EVENTS_DIR}${f}`);
      client.on(eventName, event.bind(null, client));
      delete require.cache[require.resolve(`${EVENTS_DIR}${f}`)];
    });
  }
});

client.login(discordToken);
