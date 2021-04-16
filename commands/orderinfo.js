const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {

    let user = message.author;

    if (message.member.roles.cache.some(r => r.id === "--cook role--")) {//เช็กว่ามีโรลพ่อครัวหรือไม่ + อันนี้ทำให้ล็อกใช้คำสั่งเช็กออเดอร์พ่อครัวได้แค่ในดิส cafe
        let checkaccept = await db.get(`${user.id}_order_accept`);//เช็กว่ารับออเดอร์อาหารไปหรือยัง
        checkaccept = checkaccept || 0//ถ้า checkaccept เป็น null ให้เป็น 0
        if (checkaccept === 0) {//ถ้ายังไม่ได้รับออเดอร์ ระเบิดคำสั่ง
            let notacceptyet = new Discord.MessageEmbed()
                .setColor(config.maincolor)
                .setDescription('นายท่านยังไม่มีออเดอร์อาหารให้ทำ');
            return message.channel.send(notacceptyet);
        }
        let orderid = await db.get(`${user.id}_order_accept`);
        let orderabout = await db.get(`${orderid}_order_info`);
        let cookinfo = new Discord.MessageEmbed()
            .setColor(config.maincolor)
            .setDescription(`\`เชฟที่จัดการอาหาร\` <@${user.id}>\n\`รายละเอียดอาหารที่ต้องทำ\` [${orderabout}](https://www.google.com/search?q=${orderabout.join('+')}&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjxgKzI_LbrAhVEU30KHUvPAbIQ_AUoAXoECBIQAw&biw=1920&bih=969)`);
        return message.channel.send(cookinfo);
    } else {
        let checkorder = await db.get(`${user.id}_order_status`);//เช็กว่าสั่งอาหารไปหรือยัง
        checkorder = checkorder || 0//ถ้า checkorder เป็น null ให้เป็น 0
        if (checkorder === 0) {//ถ้ายังไม่ได้สั่ง ระเบิดคำสั่งแม่ง
            let notorderyet = new Discord.MessageEmbed()
                .setColor(config.maincolor)
                .setDescription('นายท่านยังไม่ได้สั่งอาหารอะไรเลยนะคะ');
            return message.channel.send(notorderyet);
        }
        let orderid = await db.get(`${user.id}_order_info`);
        let orderabout = await db.get(`${orderid}_order_info`);
        let foodinfo = new Discord.MessageEmbed()
            .setColor(config.maincolor)
            .setDescription(`<@${user.id}>\n\nรายละเอียดอาหารที่สั่ง :\n${orderabout}`);
        return message.channel.send(foodinfo);
    }
        
}   