const Discord = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");

exports.run = async (client, message, args) => {

  if (!message.member.roles.cache.some(r => r.id === "--cook role--")) { //เช็กว่ามีโรลพ่อครัวหรือไม่
    let onlycooker = new Discord.MessageEmbed()
      .setColor(config.maincolor)
      .setDescription(`เฉพาะพนักงานทำอาหารเท่านั้นที่ใช้คำสั่งนี้ได้`);
    return message.channel.send(onlycooker);
  }
  if (!args[0]) return message.channel.send(`กรุณาระบุชื่ออาหาร`)
  let user = message.author;

  let checkaccept = await db.get(`${user.id}_order_accept`); //เช็กว่ารับออเดอร์อาหารไปหรือยัง
  checkaccept = checkaccept || 0 //ถ้า checkaccept เป็น null ให้เป็น 0

  if (checkaccept === 0) { //ถ้ายังไม่ได้รับออเดอร์ ระเบิดคำสั่ง
    let notacceptyet = new Discord.MessageEmbed()
      .setColor(config.maincolor)
      .setDescription('กรุณารับออเดอร์อาหารก่อน');
    return message.channel.send(notacceptyet);
  }

  let orderid = await db.get(`${user.id}_order_accept`); //ดึงไอดีออเดอร์
  let guildid = await db.get(`${orderid}_order_guild`); //ดึงไอดีกิล
  let chid = await db.get(`${orderid}_order_ch`); //ดึงไอดีห้อง
  let whoorder = await db.get(`${orderid}_order_uid`); //ดึงไอดีผู้ใช้
  let whousername = await db.get(`${orderid}_order_username`); //ดึงชื่อผู้ออเดอร์
  let invitelink = await db.get(`${orderid}_order_invite`); //ดึงลิงก์เข้าดิส

  let author = await db.get(`${user.id}_order_send`) //ดึงข้อมูล oder_send
  let timeout = 1; //ตั้งเวลาห้ามรับจนกว่าจะครบ
  //let timeout = (1000*60)*2; //ตั้งเวลาห้ามรับจนกว่าจะครบ
  if (author !== null && timeout - (Date.now() - author) > 0) {
    let time = ms(timeout - (Date.now() - author));

    let timeEmbed = new Discord.MessageEmbed()
      .setColor(config.maincolor)
      .setDescription(`กำลังอยู่ในระหว่างการทำอาหารโปรดรอ \n\`${time.minutes}นาที ${time.seconds}วิเพื่อทำรายการ\``);
    message.channel.send(timeEmbed)

  } else {
    let delivery = ['GrabFoods', 'FoodsPanda', 'Fortune Delivery', 'SleepySpecial']
    let random_index = Math.floor((Math.random() * delivery.length));
    let randomdelivery = delivery[random_index];
    let orderdone = new Discord.MessageEmbed() //ส่งกลับไปยังดิสที่สั่งออเดอร์ว่าอาหารเสร็จแล้วจ้า
      .setColor(config.maincolor)
      .setAuthor("อาหารถูกปรุงสำเสร็จแล้ว")
      .setDescription(`:love_letter: __**รายละเอียด**__\n┊\`ผู้จัดส่ง\` ${randomdelivery}\n╰\`ผู้รับ\` <@${whoorder}>\n\n\`กรุณารอซักครูอาหารกำลังจะมาส่งในไม่ช้า!\``);
    let guild = client.guilds.cache.get(guildid); //ดึงข้อมูลดิสที่ส่งออเดอร์มา
    let channel = guild.channels.cache.get(chid); //ดึงข้อมูลห้องที่ส่งออเดอร์มา
    channel.send(orderdone);

    let deliverytime = new Discord.MessageEmbed() //สั่งกลับเพื่อให้รู้ว่าได้เวลาส่งอาหาร
      .setColor(config.maincolor)
      .setAuthor(`${user.username} ปรุงอาหารสำเร็จแล้ว`, user.avatarURL() + "?size=512")
      .setDescription(`:clipboard: __**รายละเอียด**__\n┊\`เลขที่ออเดอร์\` ${orderid}\n╰\`ชื่อผู้รับ\` ${whousername}\n\n\`อาหารที่สั่งคือ\` \`\`\`${args.slice(0).join(' ')}\`\`\`\n\`กรุณารับรูปภาพอาหารจากเชฟ ${user.username}\``)
      .setFooter(`กรุณาไปส่งให้ไวและสุภาพที่สุด!`);
    client.channels.cache.get(config.channel_sender).send(`<@&--cook role--> กรุณากด ✅ เพื่อรับหน้าที่ส่งอาหาร`);
    client.channels.cache.get(config.channel_sender).send(deliverytime).then((msg) => {
      msg.react('✅');
      collector = msg.createReactionCollector((reaction, user) => !user.bot, { max: 1, time: (1000 * 60)*4 , errors: ['time'] }); //ตั้งหมดเวลาหมดอายุของ order
      collector.on('collect', async (m, u) => {

        msg.channel.send(`${u} ได้รับหน้าที่ส่งอาหารออเดอร์ที่ \`${orderid}\` โปรดเช็ค DM ด้วยค่ะ`)
        u.send(`กรุณาส่งออเดอร์ \`${orderid}\` ที่ ${invitelink}`).catch(function (err) {
          message.channel.send(new Discord.MessageEmbed().setDescription(`ไม่สามารถส่งที่อยู่ไปทาง DM ได้เนื่องจาก ${u.username} ปิดข้อความส่วนตัว\nกรุณาส่งออเดอร์ \`${orderid}\` ที่ ${invitelink}}`).setColor(config.maincolor)); // user turn off dm
      }) //dm แล้วส่งที่อยู่
        collector.stop('have dalivery'); //พบคนส่ง

      })
      collector.on(`end`, (collected, reason) => {
        if (reason && reason === 'have dalivery') {
          msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));//ลบ Emoji
          console.log(orderid + ` ` + `have dalivery`);
        } else {
          msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));//ลบ Emoji
          let guildend = client.guilds.cache.get(guildid); //ดึงข้อมูลดิสที่ส่งออเดอร์มา
          let channelend = guildend.channels.cache.get(chid); //ดึงข้อมูลห้องที่ส่งออเดอร์มา

          /* ระเบิดทิ้งซะ---- */
            
          db.subtract(`order_not_accepted`, 1);//ลดจำนวนออเดอร์ยังไม่ได้รับ
          db.delete(`${whoorder}_order_status`);
          db.delete(`${orderid}_order_info`);
          db.delete(`${orderid}_order_guild`);
          db.delete(`${orderid}_order_ch`);
          db.delete(`${orderid}_order_uid`);
          db.delete(`${orderid}_order_username`);
          db.delete(`${whoorder}_order_info`);
          db.delete(`${whoorder}_order_cancel`);
          db.delete(`${orderid}_order_accept`);
          db.delete(`${user.id}_order_accept`);
          db.delete(`${orderid}_order_invite`);

          msg.channel.send(new Discord.MessageEmbed().setDescription(`ไม่สามารถจัดส่งออเดอร์ได้เนื่องจาก\n\`ไม่พบผู้จัดส่งหนูกำลังรายงานไปยังผู้สั่งออเดอร์...ในขณะนี้ค่ะ\``).setColor(config.maincolor))
          channelend.send(`<@${whoorder}>`) //แท็กคนที่ order
          channelend.send(new Discord.MessageEmbed().setDescription(`ไม่สามารถจัดส่งออเดอร์ได้เนื่องจาก\n\`ไม่สามารถหาผู้จัดส่งได้\``).setColor(config.maincolor)); //ส่งกลับ
        }
      })
    })
    let restochef = new Discord.MessageEmbed() //ส่งข้อความตอบกลับเชฟ
      .setColor(config.maincolor)
      .setAuthor(`${user.username} ปรุงอาหารสำเร็จแล้ว`, user.avatarURL() + "?size=512")
      .setDescription(`\`ส่งรายละเอียดการจัดส่งให้คนส่งอาหารแล้ว\``)
      message.channel.send(restochef);

    db.subtract(`order_not_accepted`, 1);//ลดจำนวนออเดอร์ยังไม่ได้รับ
    db.delete(`${whoorder}_order_status`);
    db.delete(`${orderid}_order_info`);
    db.delete(`${orderid}_order_guild`);
    db.delete(`${orderid}_order_ch`);
    db.delete(`${orderid}_order_uid`);
    db.delete(`${orderid}_order_username`);
    db.delete(`${whoorder}_order_info`);
    db.delete(`${whoorder}_order_cancel`);
    db.delete(`${orderid}_order_accept`);
    db.delete(`${user.id}_order_accept`);
    db.delete(`${orderid}_order_invite`);
  }
}