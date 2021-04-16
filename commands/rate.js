const Discord = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");

exports.run = async (client, message, args) => {
    
    let user = message.author
    
    let author = await db.get(`${user.id}_rate_cooldown`);

    let timeout = 3600000;//รีวิวได้ทุก 1 ชั่วโมง

    if (author !== null && timeout - (Date.now() - author) > 0) {
        let time = ms(timeout - (Date.now() - author));
        let timeEmbed = new Discord.MessageEmbed()
            .setColor(config.maincolor)
            .setDescription(`นายท่านเพิ่งรีวิวไปกรุณาลองอีกรอบใน\n\`${time.minutes} นาที ${time.seconds} วิ\``);
        message.channel.send(timeEmbed)
    } else {

        let amountstar = parseInt(args[0]);
        let writereview = args.slice(1).join(' ');
        if (isNaN(amountstar) || amountstar > 5 || amountstar <= 0) return message.channel.send(`:x: กรุณาใส่คะแนนให้ถูกต้อง ! \`ตัวอย่าง ${config.prefix}rate 1-5 พนักงานสุภาพทำงานเร็วมากๆ\``); //ไม่ให้ดาวแล้วจะพิมพ์คำสั่งทำไม?
        if (args.slice(1).join(' ').length > 100) return message.reply(`รีวิวต้องไม่เกิน 100 ตัวอักษร`);
        if (!args.slice(1).join(' ')) return message.channel.send(`กรุณากรอกเหตุผล ! \`ตัวอย่าง ${config.prefix}rate 1-5 พนักงานสุภาพทำงานเร็วมาก ๆ\``); //ถ้าไม่ใส่เหตุผลไม่ได้
        message.channel.send(`ขอบคุณสำหรับการให้ ${args[0]} ดาวกับร้านของเรา`); //สำเร็จ!
        
        let guild = client.guilds.cache.get(config.mainguild_id);//ดึงข้อมูลดิสหลัก
        let channel = guild.channels.cache.get('--review channel--'); //ดึงข้อมูลห้องที่ส่งรีวิว
        channel.send(`◖:cherry_blossom:━━━━━━━━━━━━━━━━:cherry_blossom:◗
\`${user.username}\` ได้ให้รีวิว **${amountstar} ดาว**
\`เขียนรีวิวว่า\` ${writereview||`ไม่พบการเขียนรีวิว`}`);

        db.add(`rate_global`, amountstar); //เพิ่มข้อมูลคะแนนสำหรับร้านค้า
        db.add(`rate_global_aver`, 1); //เพิ่มจำนวนรีวิวไว้หาค่าเฉลี่ย
        db.set(`${user.id}_rate_cooldown`, Date.now()); //ตั้งค่าไม่ให้ส่งรีวิวรัว

    }
}   