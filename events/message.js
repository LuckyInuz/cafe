module.exports = (client, message) => {
  if (message.author.bot) return;
  if (message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command);
  if (!cmd) return;
  cmd.run(client, message, args).then(()=> {console.log(`Guild: ${message.guild.name} || Author: ${message.author.tag} || Commands: ${message.content.slice(1,999)}`)});
};