const Discord = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");

exports.run = async (client, message, args) => {
    
    let global_rate = await db.get(`rate_global`) || 0;
    let global_rate_aver = await db.get(`rate_global_aver`) || 0;
    message.channel.send(`:clipboard: คะแนนร้านค้าตอนนี้คือ \`${(global_rate/global_rate_aver).toFixed(1)||0} ดาว\``)
    
}   