const Discord = require('discord.js');
const math = require('mathjs');

exports.run = async (client, message, args) => {

        if (!args[0]) return message.channel.send("กรุณระบุตัวเลขที่จะให้คิด");

        let result;
        try {
            result = math.evaluate(args.join(" ").replace(/[x]/gi, "*").replace(/[,]/g, ".").replace(/[÷]/gi, "/"));
        } catch (e) {
            return message.channel.send("**กรุณาระบุตัวแปรให้ถูกต้อง!**\n\nตัวอย่าง `1+1`,`2*2`,`3/3`");
        }

        let embed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`${client.user.username} เครื่องคิดเลข`, message.author.displayAvatarURL({ dynamic: true }))
            .addField("**ค่าจำนวน**", `\`\`\`Js\n${args.join("").replace(/[x]/gi, "*").replace(/[,]/g, ".").replace(/[÷]/gi, "/")}\`\`\``)
            .addField("**ผลลัพธ์**", `\`\`\`Js\n${result}\`\`\``)
            .setFooter(message.guild.name, message.guild.iconURL());
        message.channel.send(embed);
    }
