const { WebhookClient, MessageEmbed } = require("discord.js");
const User = require("../model/user.js");
const Arena = require("../model/arena.js");
const WebhookMessage = require("../model/webhookMessage.js");

const webhook = new WebhookClient({
  url: "" // Your WEbhook
});

async function buildLeaderboardEmbed() {
    const arenaStats = await Arena.find({}).sort({ hype: -1 }).limit(20).lean();

    const leaderboardData = [];
    for (const p of arenaStats) {
        const user = await User.findOne({ accountId: p.accountId }).lean();
        if (user) leaderboardData.push({ username: user.username, hype: p.hype });
    }

    const now = new Date();
    const embed = new MessageEmbed()
        .setTitle("Hype Leaderboard")
        .setColor("BLUE")
        .setTimestamp(now)
        .setFooter({
            text: "Reload",
            iconURL: "https://i.imgur.com/2RImwlb.png"
        });

    let desc = "";
    for (let i = 0; i < 20; i++) {
        const p = leaderboardData[i];
        desc += p
            ? `${i + 1}. **${p.username}** - ${p.hype.toLocaleString()} hype\n`
            : `${i + 1}. **---** - 0 hype\n`;
    }

    embed.setDescription(desc);
    embed.addField("Last Updated", `<t:${Math.floor(now.getTime() / 1000)}:R>`);

    return embed;
}

async function postOrUpdateLeaderboard() {
    const embed = await buildLeaderboardEmbed();

    let record = await WebhookMessage.findOne({ key: "hypeLeaderboard" });

    if (!record) {
        const msg = await webhook.send({ embeds: [embed] });
        await WebhookMessage.create({
            key: "hypeLeaderboard",
            messageId: msg.id
        });
        return;
    }

    try {
        await webhook.editMessage(record.messageId, { embeds: [embed] });
    } catch {
        const msg = await webhook.send({ embeds: [embed] });
        record.messageId = msg.id;
        await record.save();
    }
}

module.exports = { postOrUpdateLeaderboard };
