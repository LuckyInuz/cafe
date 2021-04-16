const { Message } = require('discord.js')

exports.run = async (client, message, args) => {
        //lets use parameters (optional)
        /**
         * @param {Message} message
         */
        //so firstly we will check whether the author of the message has permissions
        //this line means if the author doesn't have manage roles permission it will stop the process and send the following text
        if(!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send('ท่านไม่มีสิทธิ์ในการจัดการบทบาทค่ะ')
        //next we define some variables
        const target = message.mentions.members.first() //member = mentions
        if(!target) return message.channel.send('กรุณาแท๊ก member ด้วยค่ะ') //when no member is pinged
        const role = message.mentions.roles.first() // roles = mentions
        if(!role) return message.channel.send('กรุณาแท็ก ยศด้วยค่ะ') //when no role is specified or pinged
        //now the code!
        await target.roles.add(role) // adding the role to the user
        message.channel.send(`${target.user.username} ได้ทำการเพิ่มยศแล้วค่ะ`)
}
