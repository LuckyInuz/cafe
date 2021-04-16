const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    if (message.author.bot) return;
    let prefix = config.prefix;
    if(!message.content.startsWith(prefix)) return;

    let help = new Discord.MessageEmbed()
.setAuthor(`คำสั่งต่างๆ`)
.setDescription(`:sushi: __**รายละเอียดคำสั่ง**__
┊\`${config.prefix}order (อาหารที่จะสั่ง)\` สั่งอาหาร
┊\`${config.prefix}cancel (ID ออเดอร์)\` ยกเลิกออเดอร์
┊\`${config.prefix}rate (คะแนน 1-5) (คำติชม)\` ให้คะแนนร้านค้า
┊\`${config.prefix}caferate\` เช็คคะแนนร้านค้า
┊\`${config.prefix}report (ID ออเดอร์) (เหคุผล)\` แจ้งการกระทำพนักงาน
┊\`${config.prefix}order (อาหารที่จะสั่ง)\` สั่งอาหาร
┊\`${config.prefix}cancel (ID ออเดอร์)\` ยกเลิกออเดอร์
┊\`${config.prefix}rate (คะแนน 1-5) (คำติชม)\` ให้คะแนนร้านค้า
┊\`${config.prefix}caferate\` เช็คคะแนนร้านค้า
┊\`${config.prefix}report (ID ออเดอร์) (เหคุผล)\` แจ้งการกระทำพนักงาน
┊\`${config.prefix}orderlist\` สำหรับดูออเดอร์ที่ค้าง
┊\`${config.prefix}deny\` สำหรับยกเลิกออเดอร์ที่ไม่ถูกต้อง
┊\`${config.prefix}accept (ID ออเดอร์)\` รับออเดอร์และทำอาหาร
┊\`${config.prefix}done\` แจ้งว่าอาหารเสร็จแล้ว
┊\`${config.prefix}orderinfo\` เช็คข้อมูลออเดอร์
┊\`${config.prefix}status (on/off)\` เปิดปิดร้าน
┊\`${config.prefix}calc (จำนวน)\` เครื่องคิดเลข
┊\`${config.prefix}addrole (ยศ)\` เพิ่มยศสมาชิก
┊\`${config.prefix}removerole (ยศ)\` ลดยศสมาชิก
╰\`${config.prefix}apply\` สมัครเข้าทำงาน`)
.setColor(config.maincolor)
.setFooter(`SleepyMaid Cafe [ คาเฟ้ Roleplay ที่ดีที่สุด! ]`)
return message.channel.send(help);
}