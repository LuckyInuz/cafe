const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.some(r => r.id === "--staff role--")) { //เช็กว่า staff มั้ย
        message.channel.send(`ไม่สามารถเปลี่ยนสถานะร้านได้นะคะ! เนื่องจากคุณไม่ใช่พนักงานภายในร้าน`)
    } else {
        if (!args[0]) return message.channel.send(`:x: กรุณาใส่สถานะร้านค้าเช่น ${config.prefix}status _on_`)
        if (args[0] === `on`) {
            db.set(`cafe_status_on_off`, `on`);
            message.channel.send(`:white_check_mark: ตั้งสถานะร้านเป็นเปิดแล้วเจ้าค่ะ !`)
            let guilda = client.guilds.cache.get(config.mainguild_id); //ดึงข้อมูลดิสที่รับออเดอร์ Main
            let channela = guilda.channels.cache.get(`--status channel--`); //ดึงข้อมูลห้องสถานะ
            channela.setName(`₊˚ʚ꒰📋꒱︰ OPEN`);
        } else if (args[0] === `off`) {
            db.set(`cafe_status_on_off`, `off`);
            message.channel.send(`:white_check_mark: ตั้งสถานะร้านเป็นปิดแล้วเจ้าค่ะ !`)
            let guildb = client.guilds.cache.get(config.mainguild_id); //ดึงข้อมูลดิสที่รับออเดอร์ Main
            let channelb = guildb.channels.cache.get(`--status channel--`); //ดึงข้อมูลห้องสถานะ
            channelb.setName(`₊˚ʚ꒰📋꒱︰ CLOSE`);
        } else {
            message.channel.send(`:x: กรุณาใส่สถานะร้านค้าเช่น ${config.prefix}status _on_`)
        }
    }

}