const { MessageEmbed } = require("discord.js");
const User = require("../../../model/user.js");
const functions = require("../../../structs/functions.js");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("./Config/config.json").toString());

module.exports = {
    commandInfo: {
        name: "ban",
        description: "Ban a user by their in-game or Discord username.",
        options: [
            {
                name: "username",
                description: "In-game or Discord username.",
                required: true,
                type: 3
            },
            {
                name: "reason",
                description: "Reason for the ban.",
                required: false,
                type: 3
            }
        ]
    },

    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (!config.moderators.includes(interaction.user.id)) {
            return interaction.editReply({ content: "You do not have moderator permissions.", ephemeral: true });
        }

        const usernameInput = interaction.options.get("username").value.toLowerCase();
        const reason = interaction.options.get("reason")?.value || "No reason provided";

        let targetUser = await User.findOne({ username_lower: usernameInput });

        if (!targetUser) {
            const match = interaction.client.users.cache.find(user =>
                user.username.toLowerCase() === usernameInput
            );

            if (match) {
                targetUser = await User.findOne({ discordId: match.id });
            }
        }

        if (!targetUser) {
            return interaction.editReply({ content: "User not found by in-game or Discord name.", ephemeral: true });
        }

        if (targetUser.banned) {
            return interaction.editReply({ content: "This account is already banned.", ephemeral: true });
        }

        await targetUser.updateOne({ $set: { banned: true, banReason: reason } });


        }

        if (accessToken != -1 || refreshToken != -1) functions.UpdateTokens();


        const replyEmbed = new MessageEmbed()
            .setTitle("User Banned")
            .addField("Username", targetUser.username, true)
            .addField("Reason", reason, true)
            .setColor("RED")
            .setTimestamp();

        await interaction.editReply({ embeds: [replyEmbed], ephemeral: true });

        // THE DM INFO yeah
        if (targetUser.discordId) {
            try {
                const discordUser = await interaction.client.users.fetch(targetUser.discordId);

                const dmEmbed = new MessageEmbed()
                    .setTitle("You Have Been Banned from Reload Backend")
                    .setDescription("You have been banned ingame.")
                    .addField("Username", targetUser.username, true)
                    .addField("Reason", reason, true)
                    .setColor("RED")
                    .setFooter("If you think this was a mistake, contact support.")
                    .setTimestamp();

                await discordUser.send({ embeds: [dmEmbed] });
            } catch (err) {
                console.log(`Failed to send DM to ${targetUser.username}:`, err.message);
            }
        }
    }
};
