const { MessageEmbed } = require("discord.js");
const path = require("path");
const fs = require("fs");
const Users = require("../../../model/user.js");
const Profiles = require("../../../model/profiles.js");
const log = require("../../../structs/log.js");
const destr = require("destr");

module.exports = {
    commandInfo: {
        name: "claimfulllocker",
        description: "Claim full locker."
    },

    execute: async (interaction) => {
        const allowedRoleId = "UR_ROLE_ID"; // ur donator role 

        if (!interaction.member.roles.cache.has(allowedRoleId)) {
            return interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        const userId = interaction.user.id;

        try {
            const targetUser = await Users.findOne({ discordId: userId });
            if (!targetUser) {
                return interaction.editReply({ content: "You do not own an account." });
            }

            const profile = await Profiles.findOne({ accountId: targetUser.accountId });
            if (!profile) {
                return interaction.editReply({ content: "You do not have a profile." });
            }

            const allItems = destr(fs.readFileSync(path.join(__dirname, "../../../Config/DefaultProfiles/allathena.json"), "utf8")); // the path where the athena with all skins
            if (!allItems) {
                return interaction.editReply({ content: "Failed to load full locker items." });
            }

            await Profiles.findOneAndUpdate(
                { accountId: targetUser.accountId },
                { $set: { "profiles.athena.items": allItems.items } }
            );

            const embed = new MessageEmbed()
                .setTitle("Full Locker Claimed")
                .setDescription("You have successfully claimed a full locker. And thank you for donating!")
                .setColor("BLACK")
                .setFooter({
                    text: "Reload Backend",
                    iconURL: "https://i.imgur.com/2RImwlb.png" // image im the embedded
                })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            log.error("An error occurred:", error);
            return interaction.editReply({ content: "Something went wrong." });
        }
    }
};
