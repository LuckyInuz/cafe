const Discord = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");

exports.run = async (client, message, args) => {
	
	if (!message.member.roles.cache.some(r => r.id === "--cook role--")){//เช็กว่ามีโรลพ่อครัวหรือไม่
        let onlycooker = new Discord.MessageEmbed()
            .setColor(config.maincolor)
            .setDescription(`เฉพาะพนักงานทำอาหารเท่านั้นที่ใช้คำสั่งนี้ได้`);
        return message.channel.send(onlycooker);
    }
    
    let user = message.author;

    let orderid = args[0];
    
    let whoorder = await db.get(`${orderid}_order_uid`);//ดึงไอดีผู้ใช้
    if (whoorder === user.id) return message.channel.send(`:x: ไม่สามารถรับออเดอร์ตนเองได้`);//กันไม่ให้รับออเดอร์ตนเอง
    
    let checkaccept = await db.get(`${user.id}_order_accept`);//เช็กว่ารับออเดอร์อาหารไปหรือยัง
    checkaccept = checkaccept || 0//ถ้า checkaccept เป็น null ให้เป็น 0

    if (checkaccept !== 0) {//รับออเดอร์ไปแล้วอีเวร จะรับห่าไรอีก
        let alreadyaccept = new Discord.MessageEmbed()
            .setColor(config.maincolor)
            .setDescription(`นายท่านรับออเดอร์อาหารไปแล้ว\n\`กรุณาทำให้เสร็จก่อนรับใหม่อีกครั้ง\``);
        return message.channel.send(alreadyaccept);
    }
    
    if(!args[0]) {//ไม่มีการระบุเลขออเดอร์
        let noorderid = new Discord.MessageEmbed()
                .setColor(config.maincolor)
                .setDescription(`กรุณาระบุเลขออเดอร์ที่ต้องการ\n\`เช่น ${config.prefix}accept เลขออเดอร์\``);
        return message.channel.send(noorderid);
    }

    let aboutorder = await db.get(`${orderid}_order_info`);//ดึงข้อมูลออเดอร์ที่ระบุ
    if (aboutorder === null || aboutorder === undefined) {//ถ้าเกิดข้อมูลที่ว่าไม่มี ระเบิดคำสั่ง
        let notfoundorder = new Discord.MessageEmbed()
            .setColor(config.maincolor)
            .setDescription('ไม่เจอออเดอร์ที่ระบุ');
        return message.channel.send(notfoundorder);
    }
    let checkorderaccept = await db.get(`${orderid}_order_accept`);//ดึงข้อมูลดูว่ารายการอาหารมีคนรับหรือยัง
    checkorderaccept = checkorderaccept || 0
    if (checkorderaccept === 1) {//ถ้าเกิดมีคนรับออเดอร์ไปแล้ว ระเบิดคำสั่ง
        let orderalreadyaccept = new Discord.MessageEmbed()
            .setColor(config.maincolor)
            .setDescription('ออเดอร์นี้มีคนรับไปแล้ว');
        return message.channel.send(orderalreadyaccept);
    }
    let guildid = await db.get(`${orderid}_order_guild`);//ดึงไอดีกิล
    let chid = await db.get(`${orderid}_order_ch`);//ดึงไอดีห้อง
    
    let acceptedorder = new Discord.MessageEmbed()//ส่งกลับไปยังดิสที่สั่งออเดอร์ว่ามีคนรับออเดอร์แล้ว
        .setColor(config.maincolor)
        .setAuthor("ยินดีด้วย! มีคนรับออเดอร์ของนายท่านแล้ว")
        .setDescription(`:love_letter: **__รายละเอียด__**\n┊\`เชฟทำอาหาร\` ${message.author.tag}\n╰\`เลขออเดอร์\` ${orderid}\n`)
        .setFooter(`🕐คาดว่าใช้เวลา 5 - 10 นาทีในการจัดส่ง`)
    let guild = client.guilds.cache.get(guildid);//ดึงข้อมูลดิสที่ส่งออเดอร์มา
    let channel = guild.channels.cache.get(chid);//ดึงข้อมูลห้องที่ส่งออเดอร์มา
    channel.send(acceptedorder);

    let timetocook = new Discord.MessageEmbed()//สั่งกลับเพื่อให้รู้ว่าได้เวลาลุยทำอาหาร
        .setColor(config.maincolor)
        .setAuthor(`${user.username} ได้รับออเดอร์แล้ว`, user.avatarURL() + "?size=512")
        .setDescription(`<@${whoorder}>\n\n:love_letter: **__รายละเอียด__**\n┊\`เลขที่ออเดอร์\` ${orderid}\n╰\`เลขผู้ออเดอร์\` ${whoorder}\n`)
        .setFooter(`หลังทำอาหารเสร็จพิมพ์ ${config.prefix}done`)
    message.channel.send(timetocook);
    client.channels.cache.get(`--log role--`).send(timetocook);//เพิ่มบันทึก Log ไว้ใช้ดูตอน Report

    let foodorderlist = await db.get(`order_global_list.list`);
    newfoodorderlist = foodorderlist.filter(item => item !== orderid);
    db.set(`order_global_list.list`, newfoodorderlist);
    
    db.subtract(`order_not_accepted`, 1);//ลบจำนวนออเดอร์ที่ยังไม่มีใครรับ
    db.set(`${orderid}_order_accept`, 1);//ตั้งค่าไม่ให้คนอื่นมารับออเดอร์ซ้ำ
    db.set(`${orderid}_order_chef`, user.id);//ตั้งค่าบันทึกไอดีเชฟลงในออเดอร์
    db.set(`${user.id}_order_accept`, orderid);//บันทึกออเดอร์ไอดีลงพ่อครัวแม่ครัว
    db.set(`${user.id}_order_send`, Date.now());//บันทึกเวลาในการสั่งอาหาร
}