const Discord = require("discord.js")
const bot = new Discord.Client({ disableEveryone: true })
const config = require("./config.json") 
const ms = require("ms")
bot.afk = new Map();
const strftime = require("strftime")
const token = process.env.token;

bot.on("ready", () => {
    bot.user.setPresence({
        game: { 
            name: 'Discord.js',
            type: 'PLAYING'
        },
        status: "online"
    })
    console.log("Бот онлайн!")
  });

  





bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
  
    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
  let args = messageArray.slice(1);
  if (message.content.includes(message.mentions.users.first())) {
    bot.afk.forEach(key => {
      if (key.id == message.mentions.users.first().id) {
        message.guild.fetchMember(key.id).then(member => {
          let user_tag = member.user.tag;
          return message.channel.send(`**${user_tag}** сейчас АФК : ${key.reason}`);
        });
      }
    });
  }
  bot.afk.forEach(key => {
    if (message.author.id == key.id) {
      bot.afk.delete(message.author.id);
      return message.reply(`Вас убрали с АФК!`).then(msg => msg.delete(5000));
    }
  });
  if(cmd === `${prefix}report`){
    message.delete();
    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return message.channel.send("Надо тегнуть пользователя.");
    let reason = args.join(" ").slice(22);

    let reportEmbed = new Discord.RichEmbed()
      .setDescription("Репорт")
      .setColor("#15f152")
      .addField("Репорт пользователь", `${rUser} с ID: ${rUser.id}`)
      .addField("Автор репорта", `${message.author} с ID: ${message.author.id}`)
      .addField("Канал", message.channel)
      .setTimestamp()
      .addField("Причина:", reason);

      let reportschannel = message.guild.channels.find(`name`, "reports");
      if(!reportschannel) return message.channel.send("Не найден канал для репортов.");

      reportschannel.send(reportEmbed);
      message.member.send("Ваш отчёт был доставлен, это его вид:", reportEmbed)
  }
  if(cmd === `${prefix}afk`){
    let reason = args.join(' ') ? args.join(' ') : 'AFK';
    let afklist = bot.afk.get(message.author.id);

    if (!afklist) {
        let construct = {
            id: message.author.id,
            reason: reason
        };

        bot.afk.set(message.author.id, construct);
        
        return message.reply(`Вы теперь АФК по причине: ${reason}`).then(msg => msg.delete(5000));

}
  }
  if(cmd === `mod`){

    let helpEmbed = new Discord.RichEmbed()
    .setTitle("HELP MOD")
    .setTimestamp()
    .setColor('RANDOM')
    .addField("Tempute - Работает", `${prefix}tempmute <@user> <time> <reason>`)
    .addField("Mute - Работает", `${prefix}mute <@user> <reason>`)
    .addField("Unmute - Работает", `${prefix}unmute <@user>`)

    .addField("Report - Работает", `${prefix}report`)
    .addField("User id - Работает", `${prefix}userid <@user>`)
    .addField("Warn - Работает", `${prefix}warn`)
    .addField("Kick - Работает", `${prefix}kick`)
    .addField("Ban - Работает", `${prefix}ban <@user>`)
    .addField("Clear - Работает", `${prefix}clear `)
    .addField("        ` Автор`: Famas_4sh", `Пусто`);

    return message.channel.send(helpEmbed);
  };
  if(cmd === "h" || cmd === "help"){
    const embedH = new Discord.RichEmbed()
    .setColor('RANDOM')
    .addField(`User info - `, `${prefix}userinfo`)
    .addField(`Server info -`, ` ${prefix}serverinfo `)
    .addField(` Say - `, `${prefix}say`)
    .addField(`Moderators -`, `${prefix}mod`)
    .addField(`Config :`, "config")
    .addField(`8ball или 8b`, `${prefix}8b`)
    .addField("АФК", `${prefix}afk`)
    

    message.channel.send(embedH)
  }
  if(cmd === `${prefix}warn`){
    message.delete();
    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return message.channel.send("Надо тегнуть пользователя.");
    let reason = args.join(" ").slice(22);
    let modlog = bot.guild.channel.find("name", `logs`)
    if(!modlog) return message.reply("Нет канала logs")


    if(!message.author.hasPermission("MANAGE_SERVER")) return message.reply("Нет")

    let embed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .addField("Предупреждение", "Варн")
    .addField("Модератор", message.author)
    .addField("Пользователь", rUser)
    .addField("Причина", reason);
    modlog.channel.send(embed)
    message.channel.send("*Пользователя предупредили!*")
  }
  if(cmd === `${prefix}config`){

    let embed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .addField(`Для работы бота требуются каналы`, "Название каналов")

    .addField(`Канал`, "reports" )
    .addField(`Канал`, "logs")
    .setTimestamp()

    message.channel.send(embed)
  }
  if(cmd === `${prefix}ban`){

   

    let reason = args.slice(1).join(' ')
    let user = message.mentions.users.first();
   
    if(!message.member.hasPermission("BAN_MEMBERS")) return errors.noPerms(message, "BAN_MEMBERS");

    if(reason.length < 1) return message.reply("Укажите причину для бана!");
    if(message.mentions.users.size < 1) return message.reply('Вы должны упомянуть кого-то').catch(console.error);
    let incidentchannel = message.guild.channels.find(`name`, "logs");
    if(!incidentchannel) return message.channel.send("Не найден logs канал.");


    if(!message.guild.member(user).bannable) return message.reply("Нет.");
    message.guild.ban(user, 2);

    const banw = new Discord.RichEmbed()
    .setDescription("Function")
    .setColor('RANDOM')
    .setTimestamp()
    .addField("Action", "Бан")
    .addField("Пользователь:", `${user.username}#${message.author.discriminator}`)
    .addField("Модератор", `${message.author.username}#${message.author.discriminator}`)
    .addField("ID:", `${user.id}` );

    message.channel.send(`Пользователь ${user.username} забанен <:BanHammer:498911349061976074>`)
  user.send(`Вас забанили на сервере ${message.guild.name}, причина: ${reason}`)
    return incidentchannel.send(banw);
    

  };
  if(cmd === `${prefix}kick`){
  

    let reason = args.slice(1).join(' ');
    
    let user = message.mentions.users.first();
  
    if(!message.member.hasPermission("KICK_MEMBERS")) return errors.noPerms(message, "KICK_MEMBERS");
    
    let incidentchannel = message.guild.channels.find(`name`, "logs");
    if(!incidentchannel) return message.channel.send("Не найден logs канал.");
    if (reason.length < 1) return message.reply('Укажите причину.');
    if (message.mentions.users.size < 1) return message.reply('Вы должны упомянуть кого-то').catch(console.error);
  
    if (!message.guild.member(user).kickable) return message.reply('Я не могу кикнуть его');
    message.guild.member(user).kick();
  
    const embed = new Discord.RichEmbed()
      .setColor(0x00AE86)
      .setTimestamp()
      .addField('Action:', 'Кик')
      .addField('Пользователь', `${user.username}#${user.discriminator} (${user.id})`)
      .addField('Модератор:', `${message.author.username}#${message.author.discriminator}`)
      .addField('Причина', reason);

      user.send(`Вас кикнули с ${message.guild.name}, причина : ${reason}`)
      const msg = await message.channel.send("Kick function");
      msg.edit(`***Я изгнал пользователя! Id: ${user.id}***`);
 
    return bot.channels.get(incidentchannel.id).sendEmbed(embed);
    
  };
  if(cmd === `${prefix}lockdown`){
    if(!message.member.hasPermission("MANAGE_GUILD")) return errors.noPerms(message, "MANAGE_GUILD");
    if (!bot.lockit) bot.lockit = [];
    let time = args.join(' ');
    let validUnlocks = ['release', 'unlock'];
    if (!time) return message.reply('Установите время закрытия канала!');
  
    if (validUnlocks.includes(time)) {
      message.channel.overwritePermissions(message.guild.id, {
        SEND_MESSAGES: null
      }).then(() => {
        message.channel.sendMessage('Закрытие оконченно.');
        clearTimeout(bot.lockit[message.channel.id]);
        delete bot.lockit[message.channel.id];
      }).catch(error => {
        console.log(error);
      });
    } else {
      message.channel.overwritePermissions(message.guild.id, {
        SEND_MESSAGES: false
      }).then(() => {
        message.channel.sendMessage(`Канал закрыт на ${ms(ms(time), { long:true })}`).then(() => {
  
          bot.lockit[message.channel.id] = setTimeout(() => {
            message.channel.overwritePermissions(message.guild.id, {
              SEND_MESSAGES: null
            }).then(message.channel.sendMessage('Закрытие оконченно.')).catch(console.error);
            delete bot.lockit[message.channel.id];
          }, ms(time));
  
        }).catch(error => {
          console.log(error);
        });
      });
    }
  };
  if(cmd === `${prefix}say`){
    //if(message.member.hasPermission("  ")) return message.reply("No");
      let botmessage = args.join(" ");
      message.delete().catch();
      message.channel.send(botmessage);
  }
  if(cmd === `${prefix}clear`){
    //let logchannel = message.guild.channels.find(`name`, "wumpuslog");
    //if(!logchannel) return message.channel.send("Не найден wumpuslog канал.");
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");
    if(!args[0]) return message.channel.send("oof.");
    message.channel.bulkDelete(args[0]).then(() => {
        logchannel.send(`Удалено ${args[0]} сообщений.`).then(msg => message.delete(5000))
    });
  };
  if(cmd === `${prefix}unban`){
   
    let user = args[0];

    if(!user) return message.reply('Укажите id пользователя!').catch(console.error);
    message.guild.unban(user);
    let incidentchannel = message.guild.channels.find(`name`, "logs");
    if(!incidentchannel) return message.channel.send("Не найден logs канал");


    const unban = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setTimestamp()
    .addField("Action", "Unban")
    .addField("Пользователь:", `${user.username}#${message.author.discriminator}`)
    .addField("Модератор", `${message.author.username}#${message.author.discriminator}`);

    message.reply(`С пользователя сняли бан!`);
    user.send(`Вас разбанили на сервере ${message.guild.name}`);
    return incidentchannel.send(unban);

  };
 if(cmd === `${prefix}test`){
     message.reply("YES!") 
 }
   

 if(cmd === `${prefix}tempmute`){
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Нельзя!");
    let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!tomute) return message.reply("Не найден пользователь");
    if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Нельзя!");
    let reason = args.slice(2).join(" ");
    if(!reason) return message.reply("Укажите причину");
  
    let muterole = message.guild.roles.find(`name`, "muted");
    //start of create role
    if(!muterole){
      try{
        muterole = await message.guild.createRole({
          name: "muted",
          color: "#000000",
          permissions:[]
        })
        message.guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(muterole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          });
        });
      }catch(e){
        console.log(e.stack);
      }
    }
    //end of create role
    let mutetime = args[1];
    if(!mutetime) return message.reply("Вы не указали время");
  
    message.delete().catch(O_o=>{});
  
    let embed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .addField("Сервер:", message.guild.name)
    .addField("Модератор:", message.author.username)
    .addField("Был замьючен на:", mutetime)
    .addField("Причина", reason);

    try{
      await tomute.send(embed)
    }catch(e){
      message.channel.send(`*Пользователь был заглушен, на ${mutetime}, по причине: ${reason}*`)
    }
  
    let muteembed = new Discord.RichEmbed()
    .setDescription(`Модератор ${message.author}`)
    .setColor("#0000000")
    .addField("Пользователь", tomute)
    .addField("Было в канале:", message.channel)
    .addField("Сообщение было создано в", message.createdAt)
    .addField("Был замьючен на:", mutetime)
    .addField("Причина", reason);
  
    let channel = message.guild.channels.find(c => c.name === "logs");
    if(!channel) return message.reply("Сначало создайте канал logs!");
    channel.send(muteembed);
  
    await(tomute.addRole(muterole.id));
  
    setTimeout(function(){
      tomute.removeRole(muterole.id);
  }, ms(mutetime));
 }
 if(cmd === `${prefix}unmute`){
  let user = message.mentions.users.first();

  let iMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if(!iMember) return message.reply("Надо тегнуть пользователя");

  let incidentchannel = message.guild.channels.find(`name`, "logs");
  if(!incidentchannel) return message.channel.send("Не найден канал logs.");

///let muteRole = bot.guilds.get(message.guild.id).roles.find('name', 'muted');

let sRole = message.guild.roles.find(`name`, `muted`)
if(!sRole){
  try{
    sRole = await message.guild.createRole({
      name: "muted",
      color: "#000000",
      permissions:[]
    })
    message.guild.channels.forEach(async (channel, id) => {
      await channel.overwritePermissions(muterole, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false
      });
    });
  }catch(e){
    console.log(e.stack);
  }
}




await(iMember.removeRole(sRole.id))
const embed = new Discord.RichEmbed()
.setDescription(`Модератор ${message.author}`)
.setColor("#0000000")
.addField("Пользователь", iMember)
.addField("Было в канале:", message.channel)
.addField("Сообщение было создано в", message.createdAt)

.addField("Результат", "С пользователя сняли мут");

message.channel.send(`***С пользователя ${iMember} снята заглушка!***`)
  
  incidentchannel.send(embed);
 
}
if(cmd === `${prefix}mute`){
  if(!message.member.hasPermission("MANAGE_ROLES")) return message.reply("Нет")
  let reason = args.slice(1).join(' ');
  let user = message.mentions.users.first();
  let modlog = bot.channels.find('name', 'logs');
  let muteRole = bot.guilds.get(message.guild.id).roles.find('name', 'muted');
  if (!modlog) return message.reply('Я не нашел канал logs').catch(console.error);
  if(!muteRole){
    try{
      muteRole = await message.guild.createRole({
        name: "muted",
        color: "#000000",
        permissions:[]
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muteRole, {
       
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    }catch(e){
      console.log(e.stack);
    }
}
  if (reason.length < 1) return message.reply('Вы должны указать причину для заглушки').catch(console.error);
  if (message.mentions.users.size < 1) return message.reply('Вы должны тегнуть пользователя.').catch(console.error);
  const embed = new Discord.RichEmbed()
  .setDescription(`Модератор ${message.author}`)
  .setColor("#0000000")
  .addField("Пользователь", user)
  .addField("Было в канале:", message.channel)
  .addField("Сообщение было создано в", message.createdAt)
  .addField("Причина", reason);
 
  if (!message.guild.member(bot.user).hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) return message.reply('У меня нет прав на это.').catch(console.error);

  message.channel.send(`***Пользователь ${user.username} был заглушен по причине : ${reason}***`)
    message.guild.member(user).addRole(muteRole)
      bot.channels.get(modlog.id).sendEmbed(embed).catch(console.error);
  const muteEmb = new Discord.RichEmbed()
  .setColor('RANDOM')
  .addField("Сервер:", message.guild.name)
  .addField("Модератор:", message.author.username)
  
  .addField("Причина", reason);
user.send(muteEmb)

 }
 if(cmd === `${prefix}ping`){
  const msg = await message.channel.send("Ping?");
  msg.edit(`Pong! Latency is "${msg.createdTimestamp - message.createdTimestamp}ms". API Latency is "${Math.round(bot.ping)}ms"`);
};
if(cmd === `${prefix}userinfo`){
  let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]))
  let argsUser
  if (member) argsUser = member.user
  else argsUser = message.author

  let statuses = {
      online: 'В сети',
      idle: 'Нет на месте',
      dnd: 'Не беспокоить',
      offline: 'Не в сети'
  }
  let game
  if (!argsUser.presence.game) game = `Имеет статус **${statuses[argsUser.presence.status]}**`
  else if (argsUser.presence.game.type == 0) game = `Играет в **${argsUser.presence.game.name}**`
  else if (argsUser.presence.game.type == 1) game = `Стримит [**${argsUser.presence.game.name}**](${argsUser.presence.game.url})`
  else if (argsUser.presence.game.type == 2) game = `Слушает **${argsUser.presence.game.name}**`
  else if (argsUser.presence.game.type == 3) game = `Смотрит **${argsUser.presence.game.name}**`

  let day = 1000 * 60 * 60 * 24
  let date1 = new Date(message.createdTimestamp)
  let date2 = new Date(argsUser.createdTimestamp)
  let date3 = new Date(message.guild.member(argsUser).joinedTimestamp)
  let diff1 = Math.round(Math.abs((date1.getTime() - date2.getTime()) / day))
  let diff2 = Math.round(Math.abs((date1.getTime() - date3.getTime()) / day))

  let embed = new Discord.RichEmbed()
      .setTitle(argsUser.username)
      .setDescription(game)
      .addField('Дата регистарции в дискорде', `${strftime('%d.%m.%Y в %H:%M', new Date(argsUser.createdTimestamp))}\n(${diff1} дн. назад)`, true)
      .addField('Дата вступления', `${strftime('%d.%m.%Y в %H:%M', new Date(message.guild.member(argsUser).joinedTimestamp))}\n(${diff2} дн. назад)`, true)
      .addField('Роли', message.guild.member(argsUser).roles.filter(r => r.id != message.guild.id).map(role => role.name).join(', ') || 'Не имеет')
      .setColor(message.guild.member(argsUser).displayHexColor)
      .setTimestamp()
      .setThumbnail(argsUser.avatarURL)
      .setFooter(`ID: ${argsUser.id}`)
await message.channel.send(embed)
}
if(cmd === `${prefix}serverinfo`){
  function checkDays(date) {
   let now = new Date();
   let diff = now.getTime() - date.getTime();
   let days = Math.floor(diff / 86400000);
   return days + (days == 1 ? " день" : " дней") + " назад";
};
let verifLevels = ["Нет", "Слабая", "Средняя", "(╯°□°）╯︵  ┻━┻", "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"];
let region = {
   "brazil": ":flag_br: Brazil",
   "eu-central": ":flag_eu: Central Europe",
   "singapore": ":flag_sg: Singapore",
   "us-central": ":flag_us: U.S. Central",
   "sydney": ":flag_au: Sydney",
   "us-east": ":flag_us: U.S. East",
   "us-south": ":flag_us: U.S. South",
   "us-west": ":flag_us: U.S. West",
   "eu-west": ":flag_eu: Western Europe",
   "vip-us-east": ":flag_us: VIP U.S. East",
   "london": ":flag_gb: London",
   "amsterdam": ":flag_nl: Amsterdam",
   "hongkong": ":flag_hk: Hong Kong",
   "russia": ":flag_ru: Russia",
   "southafrica": ":flag_za:  South Africa"
};
const embed = new Discord.RichEmbed()
   .setAuthor(message.guild.name, message.guild.iconURL)
   .addField("Имя", message.guild.name, true)
   .addField("ID", message.guild.id, true)
   .addField("Владелец", `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true)
   .addField("Регион", region[message.guild.region], true)
   .addField("Всего | Людей | Боты", `${message.guild.members.size} | ${message.guild.members.filter(member => !member.user.bot).size} | ${message.guild.members.filter(member => member.user.bot).size}`, true)
   .addField("Уровень безопасности", verifLevels[message.guild.verificationLevel], true)
   .addField("Каналов", message.guild.channels.size, true)
   .addField("Ролей", message.guild.roles.size, true)
   .addField("Дата создания", `${message.channel.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})`, true)
   .setThumbnail(message.guild.iconURL)
message.channel.send({embed});
}
    
    if(cmd === `${prefix}botstatus`){
    
        let embed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .addField("Последнее обновление", "Добавленна команда botstatus")
        .addField("Перезагрузка", "15.06.19")
        .addField("Версия", "1.5.2")
        .addField("Имя", "Mafia")
        
        return message.channel.send(embed)
    
    }
if(cmd === `${prefix}8ball` || cmd === `${prefix}8b`){
  if(!args[2]) return message.reply("Скажите полный вопрос!");
      let replies = ["Да.", "Нет.", "*Мне мешает меркурий, спроси позже*","Возможно частично", "Звезды говорят да, а я нет!", "Безусловно","Возможно.", " Я не знаю.", "Скажите позже."];
      let result = Math.floor((Math.random() * replies.length));
      let question = args.slice(0).join(" ");


      let ballEmbed = new Discord.RichEmbed()
      .setAuthor(message.author.tag)
      .setColor("#aaaaaa")
      .addField("Вопрос", question)
      .addField("Ответ", replies[result]);

      message.channel.send(ballEmbed);
  };
})

bot.login(token)
