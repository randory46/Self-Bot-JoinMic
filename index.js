const { Client } = require("discord.js-selfbot-v13");
const client = new Client();

const prefix = "!self";
const admins = ["934067721602228315", "Copy ID Account"];

client.on("ready", async () => {
  console.log(`${client.user.username} is ready!`);

  client.user.setStatus("idle");
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith(prefix + "test")) {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    console.log("Command received:", args);
  }

  if (message.content.startsWith(prefix + "jv")) {
    setTimeout(() => {
      message.delete();
    }, 2000);

    if (!admins.includes(message.member.id))
      return message.reply("Missing Permission").then((msg) => {
        setTimeout(() => {
          msg.delete();
        }, 4000);
      });

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    client.channels.fetch(args[1]).then((channel) => {
      require("@discordjs/voice").joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfMute: true,
        selfDeaf: false,
      });
      message.author.send(`Joined to <#${channel.id}>`);
    });
  }

  if (message.content.startsWith(prefix + "dc")) {
    setTimeout(() => {
      message.delete();
    }, 2000);
    if (!admins.includes(message.member.id))
      return message.reply("Missing Permission").then((msg) => {
        setTimeout(() => {
          msg.delete();
        }, 4000);
      });
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const { getVoiceConnection } = require("@discordjs/voice");
    const connection = getVoiceConnection(args[1]);
    if (connection) {
      try {
        connection.destroy();
        message.author.send(
          `Disconnected from <#${connection.joinConfig.channelId}> .`
        );
      } catch (error) {
        console.log("have error : " + error);
      }
    } else {
      message.author.send("Not connected to the specified voice channel.");
    }
  }
});

client.login("Token");
