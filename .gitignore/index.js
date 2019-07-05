const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();
client.login(process.env.TOKEN);
var prefix = ("*")

const config = require("./config.json");


client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot lancé, avec ${client.users.size} utilisateurs, dans ${client.channels.size} salons de ${client.guilds.size} serveurs.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`${client.guilds.size} serveurs | Prefix : +`, { type: 'WATCHING'});
  client.user.setStatus('dnd')
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`${client.guilds.size} serveurs | Prefix : +`, { type: 'WATCHING'});
  client.user.setStatus('dnd')
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(` ${client.guilds.size} serveurs | Prefix : +`, { type: 'WATCHING'});
  client.user.setStatus('dnd')
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;

  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Let's go with a few common example commands! Feel free to delete or change those.
  client.on('message', message => {

  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Pooong");
    m.edit(`:ping_pong: Pong ! Latence :  ${m.createdTimestamp - message.createdTimestamp} ms. Latence API : ${Math.round(client.ping)} ms.`);
  }

  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }

  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");

    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";

    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }

  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";

    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }

  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.

    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);

    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));

      if(command === "help") {
        const help_embed = new Discord.RichEmbed()
          .setTitle("Liste des commandes disponnibles :")
          .setAuthor("AtoshiRobot", "https://imgur.com/eWMV9Vj")
          /*
           * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
           */
          .setColor(0x00AE86)
          .setDescription("Préfixe : *")
          .setFooter("AtoshiRobot ", "https://imgur.com/eWMV9Vj")
          .setThumbnail("https://imgur.com/eWMV9Vj")
          /*
           * Takes a Date object, defaults to current date.
           */
          .setTimestamp()
          .addField("*ping",
            "Ping du BOT et de l'API de Discord.")
          .setTimestamp()
          .addField("*say",
            "Dire ce que vous voulez au BOT. **Usage :** *say Exemple")
          .setTimestamp()
          .addField("*purge",
            "Supprime un certain nombre de messages (entre 2 et 100). **Usage :** *purge 50")
          .setTimestamp()
          .addField("*kick",
            "Kick une personne. **Usage :** *kick @Utilisateur")
          .setTimestamp()
          .addField("*ban",
            "Ban une personne. **Usage :** *ban @Utilisateur")

          message.channel.send(help_embed);
      }
   }});

if (message.content === prefix + "info") {
    var info_embed = new Discord.RichEmbed()
    .setdescription("Information du Discord")
    info_embed.addField("Nom du Discord", message.guild.name)
    info_embed.addField("Crée le", message.guild.CreatedAt)
    info_embed.addField("Tu as rejoin le", message.member.joinedAt)
    info_embed.addField("Utilisateur sur le Discord", message.guild.MemberCount)
    info_embed.setColor('#01FE23')
message.channel.sendEmbed(embed)
}
  
if (message.content.startsWith(prefix + "sondage")) {
    let args = message.content.split(" ").slice(1);
    let thingToEcho = args.join(" ")
    var embed = new Discord.RichEmbed()
        embed.setDescription("Sondage")
        embed.addField(thingToEcho, "Répondre avec :white_check_mark: ou :x:")
        embed.setColor('#01A1FE')
    message.guild.channels.find("name", "sondage").sendEmbed(embed)
    .then(function (message){
        message.react("✔")
        message.react("✘")
    }).catch(function() {
    });
    }else{
        message.reply("Tu n'a pas la permission")
    }
