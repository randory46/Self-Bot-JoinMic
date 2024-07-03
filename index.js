const { Client } = require("discord.js-selfbot-v13");
const colors = require("colors");
const client = new Client();

const prefix = "!self";
const admins = ["CopyIDadmin"]; //کپی ایدی ادمین باید اکانتی جدا از اکانت اصلی که توکنش رو وارد کردید باشه

const infoText =
  "```diff\n- Bot Commands:\n\n" +
  "+ " +
  prefix +
  "join CopyIDvoice - Request bot to join your voice channel\n" +
  "+ " +
  prefix +
  "leave CopyIDserver - Request bot to leave your voice channel\n```";

client.on("ready", async () => {
  console.log(`${client.user.username} is ready!`);

  try {
    admins.map(async (probs) => {
      if (!probs) return;
      (await client.users.fetch(probs)).send(infoText);
    });
  } catch (error) {
    console.error(error);
  }

  client.user.setStatus("idle");
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith(prefix + "test")) {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    console.log("Command received:", args);
  }

  if (message.content.startsWith(prefix + "join")) {
    setTimeout(() => {
      message.delete();
    }, 2000);

    if (
      !admins.includes(message.member.id) ||
      message.author.id !== client.user.id
    )
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

  if (message.content.startsWith(prefix + "leave")) {
    setTimeout(() => {
      message.delete();
    }, 2000);
    if (
      !admins.includes(message.member.id) ||
      message.author.id !== client.user.id
    )
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
          `Disconnected from <#${connection.joinConfig.channelId}> .`,
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

process.on("unhandledRejection", (e) => {
  return console.error(colors.red(e));
});
client.on("error", (e) => {
  console.error(colors.red(e));
});
client.on("shardError", (e) => {
  console.error(colors.red(e));
});
