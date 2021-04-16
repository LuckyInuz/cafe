const fs = require("fs");
module.exports = (client) => {
  client.user.setPresence({ activity: { name: `${config.prefix}help | ${client.users.cache.size} กำลังทานอาหาร` , type: 'WATCHING'}, status: 'online' });
  client.setInterval(() => {
        client.user.setPresence({ activity: { name: `${config.prefix}help | ${client.users.cache.size} กำลังทานอาหาร` , type: 'WATCHING'}, status: 'online' });
  }, 60000)
  console.log(client.user.tag+` has ready!`);
}
