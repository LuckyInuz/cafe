const Discord = require("discord.js");
const db = require("quick.db");

const noorderlist = new Discord.MessageEmbed()
.setColor(config.maincolor)
.setDescription('ไม่มีรายการอาหารค้างในระบบ')
exports.run = async (client, message, args) => {
    
    if (!message.member.roles.cache.some(r => r.id === "--cook role--")) { //เช็กว่ามีโรลพ่อครัวหรือไม่
        let onlycooker = new Discord.MessageEmbed()
            .setColor(config.maincolor)
            .setDescription(`เฉพาะพนักงานทำอาหารเท่านั้นที่ใช้คำสั่งนี้ได้`);
        return message.channel.send(onlycooker);
    }
    
    let temporderlist = await db.get(`order_global_list.list`);
    let orderlist = []; 
    if(typeof(temporderlist)=="number"){
        orderlist.push(temporderlist)
    }else {
        orderlist = temporderlist
    }

    orderlist = orderlist || 0
    
    if (orderlist === 0) {
        return message.channel.send(noorderlist);
    }

    if (orderlist.length <= 0) {
        return message.channel.send(noorderlist);
    }

    let allorderlist = "";
    for (let i = 0; i < orderlist.length; i++) {
         allorderlist += "- " + orderlist[i] + "\n";
    }

    let hereorderlist = new Discord.MessageEmbed()
        .setColor(config.maincolor)
        .setDescription("รายการอาหารที่ค้างในระบบ\n\n" + allorderlist);
    message.channel.send(hereorderlist);
    
}   