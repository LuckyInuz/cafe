const Discord = require("discord.js");
const db = require(`quick.db`);
const ms = require("parse-ms");

exports.run = async (client, message, args) => {
	
  if (!message.member.roles.cache.some(r => r.id === "--cook role--")){//เช็กว่ามีโรลพ่อครัวหรือไม่
      let onlycooker = new Discord.MessageEmbed()
          .setColor(config.maincolor)
          .setDescription(`เฉพาะพนักงานทำอาหารเท่านั้นที่ใช้คำสั่งนี้ได้`);
      return message.channel.send(onlycooker);
  }
  
  let order_check = args[0];
  let why = args.slice(1).join(' '); // เหตุผล
  
  if(!order_check) {//ไม่มีการระบุเลขออเดอร์
      let noorderid = new Discord.MessageEmbed()
          .setColor(config.maincolor)
          .setDescription(`กรุณาระบุเลขออเดอร์\n\`เช่น ${config.prefix}deny เลขออเดอร์ เหตุผล\``);
      return message.channel.send(noorderid);
  }

  let user = message.author;
  let order_id = await db.get(`${order_check}_order_info`); //ดึงข้อมูลจาก order id
  if (order_id === null || order_id === undefined) return message.channel.send(`ไม่พบออเดอร์ที่สั่ง`);
  
  let checkorderaccept = await db.get(`${order_check}_order_accept`);
  if (checkorderaccept === 1) {//กันไม่ให้ deny ออเดอร์ที่มีคนรับไปแล้ว
      let cannotcancel = new Discord.MessageEmbed()
          .setColor(config.maincolor)
          .setDescription('ออเดอร์นี้มีเชฟกำลังทำอยู่ ยกเลิกไม่ได้');
      return message.channel.send(cannotcancel);
  }
  
  
  let order_guild = await db.get(`${order_check}_order_guild`);
  let order_chid = await db.get(`${order_check}_order_ch`);
  let who_order = await db.get(`${order_check}_order_uid`);
      
      message.channel.send(new Discord.MessageEmbed() //แจ้งเตือนยกเลิก
      .setDescription(`ทำการส่งรายการยกเลิกออเดอร์`).setColor(config.maincolor))
      .then(()=>{ //ส่งข้อมูลกลับห้องที่สั่งมาว่ายกเลิก
      let guild = client.guilds.cache.get(order_guild);//ดึงข้อมูลดิสสั่งอาหาร
      let channel = guild.channels.cache.get(order_chid); //ดึงข้อมูลห้องที่ส่งออเดอร์
      channel.send(new Discord.MessageEmbed()
      .setAuthor(`รายการยกเลิกออเดอร์`).setColor(config.maincolor).setDescription(`<@${who_order}>\n\n📋 __**รายละเอียด**__\n┊\`ชื่อเชฟผู้ยกเลิก\` ${user.username}\n┊\`เหตุผล\` ${why||`เมนูไม่ถูกต้อง`}`)
      .setFooter(`ทำการยกเลิกเวลา`).setTimestamp())
      })

      let foodorderlist = await db.get(`order_global_list.list`);
      newfoodorderlist = foodorderlist.filter(item => item !== order_check);
      db.set(`order_global_list.list`, newfoodorderlist);
              
      db.subtract(`order_not_accepted`, 1);
      db.delete(`${who_order}_order_status`);
      db.delete(`${who_order}_order_info`);
      db.delete(`${who_order}_order_cancel`);
      db.delete(`${order_check}_order_info`);
      db.delete(`${order_check}_order_guild`);
      db.delete(`${order_check}_order_ch`);
      db.delete(`${order_check}_order_uid`);
      db.delete(`${order_check}_order_username`);
      db.delete(`${order_check}_order_accept`);
      db.delete(`${order_check}_order_invite`);
          
}