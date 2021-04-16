const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {

    let user = message.author;
    
    if (!args[0] || isNaN(args[0])) return message.reply(`กรุณากรอกเลขออเดอร์ให้ถูกต้อง \`ตัวอย่าง .report เลขออเดอร์ ทำงานไม่สุภาพ\``);

    if (args[0].length > 15) return message.reply(`เลขออเดอร์ต้องไม่เกิน 15 ตัว`);

    if (!args.slice(1).join(' ')) return message.reply(`กรุณากรอกเหตุผลที่รายงาน \`ตัวอย่าง .report เลขออเดอร์ ทำงานไม่สุภาพ\``);

    if (args.slice(1).join(' ').length > 100) return message.reply(`รายงานต้องไม่เกิน 100 ตัวอักษร`);

    message.channel.send(`เราจะทำการตรวจสอบที่รายงานมา เราขอบคุณสำหรับการรายงาน`).then((msg)=>{
        let guild = client.guilds.cache.get(config.mainguild_id);//ดึงข้อมูลดิสหลักสั่งอาหาร
        let channel = guild.channels.cache.get('--report channel--'); //ดึงข้อมูลห้อง report
    channel.send(`------\nรายงานออเดอร์ : ${args[0]}\nไอดีผู้รายงาน : ${user.id}\n\nเหตุผล :\n${args.slice(1).join(' ')}\n------`);
    })
}   