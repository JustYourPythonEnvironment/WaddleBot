const { updateReactionsList } = require('../utils/Utils.js');

module.exports = async (client) => {
  console.log('Ready!');
  client.user.setActivity(`with your heart.`);
  client.database.ref('reactions/').orderByKey().on('value', snapshot => {
    const reactionsChannel = client.channels.find(ch => ch.name === 'reaction-database');
    updateReactionsList(snapshot, reactionsChannel);
  });
};