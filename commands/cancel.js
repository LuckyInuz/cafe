const Discord = require("discord.js");
const db = require(`quick.db`);
const ms = require("parse-ms");
exports.run = async (client, message, args) => {

  let why = args.slice(0).join(' '); // เหตุผล
  let user = message.author;
  let author = await db.get(`${user.id}_order_cancel`) //ดึงข้อมูล oder_cancel
  let order_check = await db.get(`${user.id}_order_info`) //ดึงข้อมูล oder_info
  if (order_check === null || order_check === undefined) return message.channel.send(`ไม่พบออเดอร์ที่สั่ง`)
      
  let timeout = 600000; //ตั้งเวลาห้ามกดยกเลิก
      if (author !== null && timeout - (Date.now() - author) > 0) {
        let time = ms(timeout - (Date.now() - author));

        let timeEmbed = new Discord.MessageEmbed()
          .setColor(config.maincolor)
          .setDescription(`นายท่านพึ่งทำการสั่งอาหารไปโปรดรอ\n\`${time.minutes}นาที ${time.seconds}วิ เพื่อยกเลิกออเดอร์\``);
        message.channel.send(timeEmbed)
      } else {

      message.channel.send(new Discord.MessageEmbed() //แจ้งเตือนยกเลิก
          .setDescription(`ทำการส่งรายการยกเลิกออเดอร์`).setColor(config.maincolor))
          .then(()=>{ //ส่งข้อมูลกลับ Main ว่ายกเลิก Order
            let guild = client.guilds.cache.get(config.mainguild_id);//ดึงข้อมูลดิสหลักสั่งอาหาร
            let channel = guild.channels.cache.get(config.mainchannel_id); //ดึงข้อมูลห้องที่ส่งออเดอร์
            channel.send(new Discord.MessageEmbed()
          .setAuthor(`รายการยกเลิกออเดอร์`).setColor(config.maincolor).setDescription(`📋 __**รายละเอียด**__┊\`ชื่อผู้ยกเลิก\` ${user.username}\n┊\`จากเซิร์ฟเวอร์\` ${message.guild.name}\n╰\`เหตุผล\` ${why||`รอนานเกินไป`}`)
          .setFooter(`ทำการยกเลิกเวลา`).setTimestamp())
          })

          let chef_id = await db.get(`${order_check}_order_chef`);
          chef_id = chef_id || 0
          if (chef_id !== 0) {

              let foodorderlist = await db.get(`order_global_list.list`);
              newfoodorderlist = foodorderlist.filter(item => item !== order_check);
              db.set(`order_global_list.list`, newfoodorderlist);
              
              db.delete(`${chef_id}_order_accept`);
              db.delete(`${user.id}_order_status`);
              db.delete(`${user.id}_order_info`);
              db.delete(`${user.id}_order_cancel`);
              db.delete(`${order_check}_order_info`);
              db.delete(`${order_check}_order_guild`);
              db.delete(`${order_check}_order_ch`);
              db.delete(`${order_check}_order_uid`);
              db.delete(`${order_check}_order_username`);
              db.delete(`${order_check}_order_accept`);
              db.delete(`${order_check}_order_invite`);
              db.delete(`${order_check}_order_chef`);
          } else {

              let foodorderlist = await db.get(`order_global_list.list`);
              newfoodorderlist = foodorderlist.filter(item => item !== order_check);
              db.set(`order_global_list.list`, newfoodorderlist);
              
              db.subtract(`order_not_accepted`, 1);
              db.delete(`${user.id}_order_status`);
              db.delete(`${user.id}_order_info`);
              db.delete(`${user.id}_order_cancel`);
              db.delete(`${order_check}_order_info`);
              db.delete(`${order_check}_order_guild`);
              db.delete(`${order_check}_order_ch`);
              db.delete(`${order_check}_order_uid`);
              db.delete(`${order_check}_order_username`);
              db.delete(`${order_check}_order_accept`);
              db.delete(`${order_check}_order_invite`);
          }
          
      }
    }