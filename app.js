require('dotenv').config();
const { Client, Intents } = require('discord.js');
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

const adminChannel = '963035863099535360';

const addLog = (title, message, color) => {
  client.channels.cache.get(adminChannel).send({
    embeds: [
      {
        title: title,
        description: message,
        color: color,
      },
    ],
  });
};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot === true) {
    return;
  }

  if (!message.content) {
    return;
  }

  const messageToSend =
    `<@${message.author.id}> typed this message ` +
    '`' +
    `${message.content}` +
    '`';

  addLog(null, messageToSend, 0x65db86);
});

client.on('messageDelete', (message) => {
  const messageToSend =
    `<@${message.author.id}> deleted a message which contained ` +
    '`' +
    `${message.content}` +
    '`';

  if (message.author.bot === true) {
    return;
  }
  addLog(null, messageToSend, 0xff8461);
});

client.on('messageUpdate', (message, newMessage) => {
  const messageToSend =
    `<@${message.author.id}> updated a message from ` +
    '`' +
    `${message.content}` +
    '` to `' +
    `${newMessage.content}` +
    '`';

  if (message.author.bot === true) {
    return;
  }
  addLog(null, messageToSend, 0x0099ff);
});

client.on('channelCreate', async (channel) => {
  if (!channel.guild) return false;

  const AuditLogFetch = await channel.guild.fetchAuditLogs({
    limit: 1,
    type: 'CHANNEL_CREATE',
  });

  if (!AuditLogFetch.entries.first()) return;

  const Entry = AuditLogFetch.entries.first();

  addLog(
    null,
    `${`<@${Entry.executor.id}>` || 'Someone'} created this channel <#${
      channel.id
    }>`,
    0x65db86
  );
});

client.on('channelDelete', async (channel) => {
  if (!channel.guild) return false;

  const AuditLogFetch = await channel.guild.fetchAuditLogs({
    limit: 1,
    type: 'CHANNEL_DELETE',
  });

  if (!AuditLogFetch.entries.first()) return;

  const Entry = AuditLogFetch.entries.first();

  addLog(
    null,
    `${`<@${Entry.executor.id}>` || 'Someone'} deleted a channel named ` +
      '`' +
      channel.name +
      '`',
    0xff8461
  );
});

client.on('guildBanAdd', async (ban) => {
  const AuditLogFetch = await ban.guild.fetchAuditLogs({
    limit: 1,
    type: 'MEMBER_BAN_ADD',
  });

  if (!AuditLogFetch.entries.first()) return;

  const Entry = AuditLogFetch.entries.first();

  addLog(
    null,
    `<@${ban.user.id}> was banned by <@${Entry.executor.id}>`,
    0xff8461
  );
});

client.on('guildBanRemove', async (ban) => {
  const AuditLogFetch = await ban.guild.fetchAuditLogs({
    limit: 1,
    type: 'MEMBER_BAN_REMOVE',
  });

  if (!AuditLogFetch.entries.first()) return;

  const Entry = AuditLogFetch.entries.first();

  addLog(
    null,
    `<@${ban.user.id}> was unbanned by <@${Entry.executor.id}>`,
    0x65db86
  );
});

client.on('guildMemberAdd', async (member) => {
  addLog(null, `<@${member.id}> joined the server!`, 0x65db86);
});

client.on('guildMemberRemove', async (member) => {
  addLog(null, `<@${member.id}> left the server`, 0xff8461);
});

client.on('messageReactionAdd', (reaction, user) => {
  addLog(
    null,
    `<@${user.id}> reacted with ` +
      '`' +
      reaction.emoji.name +
      '`' +
      ` to a message with id ` +
      '`' +
      reaction.message.id +
      '`',
    0x65db86
  );
});

client.on('messageReactionRemove', (reaction, user) => {
  addLog(
    null,
    `<@${user.id}> removed this reaction ` +
      '`' +
      reaction.emoji.name +
      '`' +
      ` from a message which has this id ` +
      '`' +
      reaction.message.id +
      '`',
    0x65db86
  );
});

client.login(process.env.BOT_TOKEN);
