const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");

/*

CODE : AkenoSann#4284, Nadeon#1735 
กรุณาศึกษาโค๊ตก่อนใช้งานเนื่องจากทางเราไม่ได้เขียน Config ไว้ในทุกๆที่

#กรุณาอย่าแอบอ้างว่าเป็นผลงานตัวเองหากไม่ได้เขียนเอง 100%

*/




const client = new Discord.Client();
const config = require("./config.json");
global.config = config;

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Load ${commandName}` + " Command");
    client.commands.set(commandName, props);
  });
});

client.login(config.token);