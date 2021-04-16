const Discord = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");

exports.run = async (client, message, args) => {
    if(message.guild.id === `--order channel--`) return message.channel.send(new Discord.MessageEmbed().setColor(config.maincolor).setDescription(`${message.author} กรุณาใช้ห้อง <#832462938891223080>\nเพื่อสั่งอาหารโดยไม่จำเป็นต้องใช้คำสั่งแค่ Tag เรียกพนักงานเพื่อสั่งอาหาร`))
    
    if (!message.guild.me.hasPermission("CREATE_INSTANT_INVITE")) return message.channel.send(new Discord.MessageEmbed().setColor(config.maincolor).setAuthor(`❌ ${message.guild.name} อยู่นอกพื้นที่การสั่งอาหาร`).setDescription(`\`กรุณาให้สิทธิ์การสร้างลิ้งก์เชิญเพื่อรับสิทธิ์การบริการ!\``)); // เช็คว่าสามารถส่งอาหารได้หรือไม่ (check perm ---> create invite)
    let user = message.author;

    let status_cafe = await db.get(`cafe_status_on_off`)||`off`;
    if(status_cafe === `off`) { 
        db.set(`cafe_status_on_off`, `off`);
        message.channel.send(new Discord.MessageEmbed().setDescription(`ขณะนี้ร้านปิดให้บริการอยู่ชั่วคราวกรุณาสั่งออเดอร์ภายหลังหรือเช็คสถานะร้านก่อนสั่ง`).setColor(config.maincolor))
    }else{

    let isorderfull = await db.get(`order_not_accepted`);
    if (isorderfull >= 50) return message.channel.send("ขณะนี้ออเดอร์เต็มกรุณารอคิว");
    
    let checkorder = await db.get(`${user.id}_order_status`);//เช็กว่าสั่งอาหารไปหรือยัง
    checkorder = checkorder || 0//ถ้า checkorder เป็น null ให้เป็น 0

    if (checkorder === 1) {//สั่งออเดอร์ไปแล้วอีเวร จะสั่งห่าไรอีก
        let alreadyorder = new Discord.MessageEmbed()
            .setColor(config.maincolor)
            .setDescription('นายท่านสั่งอาหารไปแล้ว\n\`กรุณารอรับอาหารก่อนสั่งใหม่อีกครั้ง\`');
        return message.channel.send(alreadyorder);
    }
    
    if(!args.slice(0).join(' ')) {//ไม่มีการระบุรายละเอียดอาหาร
        let noorderdetail = new Discord.MessageEmbed()
                .setColor(config.maincolor)
                .setDescription(`กรุณาระบุอาหารที่ต้องการสั่ง\n\`${config.prefix}order สเต๊กเนื้อหมูสันนอก\``);
        return message.channel.send(noorderdetail);
    }

    if(args.slice(0).join(' ').length > 50) {//รายการอาหารมิใช่เรียงความค่ะอีดอก
        let detailtoolong = new Discord.MessageEmbed()
            .setColor(config.maincolor)
            .setDescription('รายละเอียดอาหารยาวเกินไป\n\`จำกัดตัวอักษรสูงสุดแค่ 50 ตัวอักษร\`');
        return message.channel.send(detailtoolong);
    }
    
    const shortcode = (n) => {//สุ่มเลข
    const possible = '0123456789'
    let text = ''
    for (var i = 0; i < n + 1; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))
    return text;
    }

    const orderid = shortcode(4)+message.author.id.slice(0,7);//random สร้าง id ออเดอร์

    let invite = await message.channel.createInvite({maxUses: 1}) //สร้าง invite 24 hr.
    let orderdetail = args.slice(0).join(' ')
    let ordersent = new Discord.MessageEmbed()
        .setColor(config.maincolor)
        .setAuthor("มีออเดอร์อาหารชิ้นใหม่!", user.avatarURL() + "?size=512")
        .setDescription(`:love_letter: __**ข้อมูลการออเดอร์สินค้า**__\n┊\`เลขออเดอร์อาหาร\` ${orderid}\n┊\`ชื่อผู้ที่ออเดอร์\` ${message.author.tag}\n┊\`พื้นที่จัดส่ง\` ${message.guild.name}\n╰\`รายละเอียดออเดอร์\`\n \`\`\`${orderdetail}\`\`\`\n\n\`เมนูที่ใกล้เคียง\` [คลิกเพื่อตรวจสอบ](https://www.google.com/search?q=${encodeURIComponent(orderdetail)}&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjxgKzI_LbrAhVEU30KHUvPAbIQ_AUoAXoECBIQAw&biw=1920&bih=969)`)
        .setFooter(`กรุณารับออเดอร์ด้วยคำสั่ง ${config.prefix}accept ${orderid}`);
        let guild = client.guilds.cache.get(config.mainguild_id);//ดึงข้อมูลดิสที่รับออเดอร์ Main
        let channel = guild.channels.cache.get(config.channel_cafe); //ดึงข้อมูลห้องที่รับออเดอร์ (เชฟ)
    channel.send(ordersent);

    let orderarrived = new Discord.MessageEmbed()
        .setColor(config.maincolor)
        .setAuthor("ส่งออเดอร์เรียบร้อยแล้ว", user.avatarURL() + "?size=512")
        .setDescription(`:love_letter: __**ข้อมูลการออเดอร์สินค้า**__\n┊\`สถานะ\` กำลังรอเชฟรับออเดอร์\n╰\`รายละเอียดออเดอร์\` \`\`\`${args.slice(0).join(' ')}\`\`\``)
    message.channel.send(orderarrived);

    db.add(`order_not_accepted`, 1);//เพิ่มจำนวนออเดอร์ยังไม่ได้รับ
    db.push(`order_global_list.list`, orderid);//บันทึกออเดอร์ที่ยังไม่มีใครรับลงใน array
    db.set(`${user.id}_order_status`, 1);//บันทึกว่าผู้ใช้งานนี้สั่งแล้ว
    db.set(`${orderid}_order_info`, args.slice(0).join(' '));//บันทึกข้อมูลเมนูในเลขไอดี
    db.set(`${orderid}_order_guild`, message.guild.id);//บันทึกไอดีดิสในออเดอร์
    db.set(`${orderid}_order_ch`, message.channel.id);//บันทึกไอดีห้องในออเดอร์
    db.set(`${orderid}_order_uid`, user.id);//บันทึกไอดีผู้ใช้ในออเดอร์
    db.set(`${orderid}_order_username`, user.username);//บันทึกชื่อผู้สั่งลงในออเดอร์
    db.set(`${orderid}_order_invite`, `${invite}`);//บันทึกลิงก์ชวนลงในออเดอร์
    db.set(`${user.id}_order_info`, orderid);//บันทึกออเดอร์ไอดีในผู้ใช้
    db.set(`${user.id}_order_cancel`, Date.now());//บันทึกเวลาในการยกเลิกออเดอร์
}
}   