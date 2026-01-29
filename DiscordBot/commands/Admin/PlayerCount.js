const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "playercount",
    description: "Shows current players that are connected to the backend",

    async execute(message) {
        if (!global.Clients) return message.reply("Error idk what to put here.");

        const players = global.Clients.map(c => {
            const minutes = Math.floor((Date.now() - c.loginTime) / 60000);
            return `**${c.displayName}** — ${minutes} min online`;
        });

        const embed = new EmbedBuilder()
            .setTitle("Current Online Players")
            .setDescription(players.length ? players.join("\n") : "No players online")
            .setColor("Green")
            .setFooter({ text: `Total Players: ${global.Clients.length}` })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
