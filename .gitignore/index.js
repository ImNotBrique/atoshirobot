const Discord = require('discord.js')
const express = require('express');
const app = express();
const prefix = "!"
const bot = new Discord.Client()    
const talkedRecently = new Set();
bot.login(process.env.TOKEN)


bot.on('ready', function() { 
 console.log('Je suis connecté :D') 

    bot.user.setActivity(`${bot.guilds.size} serveurs | Prefix : !`, { type: 'WATCHING'});
    bot.user.setStatus('dnd')
  });
  
  bot.on("guildCreate", guild => {
    // This event triggers when the bot joins a guild.
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    bot.user.setActivity(`${bot.guilds.size} serveurs | Prefix : !`, { type: 'WATCHING'});
    bot.user.setStatus('dnd')
  });
  
  bot.on("guildDelete", guild => {
    // this event triggers when the bot is removed from a guild.
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    bot.user.setActivity(` ${bot.guilds.size} serveurs | Prefix : !`, { type: 'WATCHING'});
    bot.user.setStatus('dnd')
});



bot.on('message', message => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

 if(command === "kill"){
      if(talkedRecently.has(message.author.id)) {
            message.channel.send("Attends 1 minute " + message.author.username + " !");
    } else {
  let pseudo =  message.mentions.users.first().username
    if(!message.mentions.members.first()) return message.channel.send('Vous devez mentionner quelqu\'un !')
var e = new Discord.RichEmbed()
.setTitle(`${message.author.username} a tué ${pseudo} :skull_crossbones:`)
.setImage("https://cdn.discordapp.com/attachments/580117511941521427/592803283114917910/tenor_1.gif")
.setColor('000000')
.setFooter('©️ AthopiaTEAM | Powered by GlitchBot Creator')
message.channel.send(e)
        talkedRecently.add(message.author.id);
        setTimeout(() => {
          
          talkedRecently.delete(message.author.id);
        }, 60000);
    }

}
  if(command === "ping"){
  
  message.channel.send(':ping_pong: Pong ! 0 ms').then((msg) => {
    
    msg.edit(':ping_pong: Pong ! ' + `${Date.now() - message.createdTimestamp}` + " ms !")
  });
}
  
   if(command ===  'clear'){
     if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send('Il vous faut la permission `MANAGE_MESSAGES` pour éxécuter cette commande !   Erreur: 009')
    if((!args[0])) return message.channel.send('Merci de spécifier un nombre valide de messages à supprimer !')
    if(args[0] > 100) return message.channel.send('Merci de spécifier un nombre inférieur ou égale à 100')
    
    message.channel.bulkDelete(args[0])
       } 
 if(message.content === prefix + 'serverinfo'){
    if(!message.guild) return message.channel.send('Une erreur s\'est produite !')
    var e = new Discord.RichEmbed()
    .setThumbnail(message.guild.iconURL)
    .setAuthor(message.guild.name + ' (' + message.guild.id + ')', message.guild.iconURL)
    .addField('** :page_facing_up: Salons**', `:arrow_right: ${message.guild.channels.filter(off => off.type === 'text').size} textuels, ${message.guild.channels.filter(off => off.type === 'voice').size} vocaux\n:arrow_right: Salon afk: ${message.guild.afkChannel}`)
    .addField('** :boy:  Membres**', `:arrow_right: ${message.guild.memberCount} membres (${message.guild.members.filter(o => o.presence.status === 'online').size} en ligne &  ${message.guild.members.filter(member => member.user.bot).size} bot)\n:arrow_right: Owner:${message.guild.owner.user} (${message.guild.ownerID})`)
    .addField('** :heavy_plus_sign:  Informations additionelles**',`:arrow_right: Rôles: ${message.guild.roles.size}\n:arrow_right: Région: ${message.guild.region}\n:arrow_right: Date de création: ${message.guild.createdAt}\n:arrow_right: Niveau de vérification: ${message.guild.verificationLevel}`)
    .setFooter('©️ AthopiaTEAM | Powered by GlitchBot Creator ')
  .setColor('RANDOM')
    message.channel.send(e)
    }
   if(command === 'userinfo'){
  var useruseruser = message.guild.member(message.mentions.users.first());
    var useruseruserauthor = message.mentions.users.first();
    if(!useruseruser) {
      var e = new Discord.RichEmbed()
      .setThumbnail(message.author.displayAvatarURL)
      .setAuthor(message.author.username + '#' + message.author.discriminator + ' (' + message.author.id + ')', message.author.displayAvatarURL)
      .addField('** Informations de l\'utilisateur**', `:arrow_right: Création du compte: ${message.author.createdAt}\n:arrow_right: Statut: ${message.author.presence.status}\n:arrow_right: Jeu: ${message.author.presence.game}`)
      .addField('** Informations du membre**', `:arrow_right: Surnom: ${message.member.nickname}\n:arrow_right: A rejoint le serveur : ${message.member.joinedAt}\n:arrow_right: Nombre de rôles: ${message.member.roles.size - 1}`)
      .setColor(message.member.displayHexColor)
      message.channel.send(e)
    }else{
      var e = new Discord.RichEmbed()
      .setThumbnail(useruseruserauthor.displayAvatarURL)
      .setAuthor(useruseruserauthor.username + '#' + useruseruserauthor.discriminator + ' (' + useruseruserauthor.id + ')', useruseruserauthor.displayAvatarURL)
      .addField('** Informations de l\'utilisateur**', `:arrow_right: Création du compte: ${useruseruserauthor.createdAt}\n> Statut: ${useruseruser.presence.status}\n> Jeu: ${useruseruser.presence.game}`)
      .addField('** Informations du membre**', `:arrow_right: Surnom: ${useruseruser.nickname}\n> A rejoint le: ${useruseruser.joinedAt}\n> Nombre de rôles: ${useruseruser.roles.size - 1}`)
      .setFooter('©️ AthopiaTEAM | Powered by GlitchBot Creator')
      .setColor('RANDOM')
      message.channel.send(e)
    }
    
  }
   if(message.content === prefix + "invite"){
    var e = new Discord.RichEmbed()
   .addField('Invitation du BOT','[Invitation du BOT](https://discordapp.com/api/oauth2/authorize?client_id=596672194407563265&permissions=2146958839&scope=bot)\n [Chaine YouTube de ImNotBREAK](https://www.youtube.com/channel/UCjV7tGLVDlxsT3HT9xvYkiw?)')    
      .setColor('7289da')   
    .setFooter('©️ AthopiaTEAM | Powered by GlitchBot Creator')
    message.channel.send(e)
   }
  if(message.content === prefix + "partenaires"){
    var e = new Discord.RichEmbed()
   .addField('[Invitation du BOT](https://discord.gg/PkbhD3f)')    
      .setColor('7289da')   
    .setFooter('©️ AthopiaTEAM | Powered by GlitchBot Creator')
    message.channel.send(e)
  }
});
