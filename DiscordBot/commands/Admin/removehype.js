const Users = require('../../../model/user');
const Profiles = require('../../../model/profiles');
const config = require('../../../Config/config.json');
const functions = require('../../../structs/functions.js');
const uuid = require("uuid");
const { MessageEmbed } = require("discord.js");

module.exports = {
    commandInfo: {
        name: "addhype",
        description: "lets you add arena points to a user",
        options: [
            {
                name: "user",
                description: "the user you want to change the Hype of",
                required: true,
                type: 6
            },
            {
                name: "hype",
                description: "the amount of hype points you want to give",
                required: true,
                type: 4
            }
        ]
    },
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (!config.moderators.includes(interaction.user.id)) {
            return interaction.editReply({ content: "you do not have moderator permissions.", ephemeral: true });
        }

        const selectedUser = interaction.options.getUser('user');
        const selectedUserId = selectedUser?.id;
        const user = await Users.findOne({ discordId: selectedUserId });

        if (!user) {
            return interaction.editReply({ content: "that user does not own an account", ephemeral: true });
        }

        const hype = parseInt(interaction.options.getInteger('hype'));
        if (isNaN(hype) || hype === 0) {
            return interaction.editReply({ content: "invalid hype amount specified.", ephemeral: true });
        }

     
        await functions.updateHypePoints(user, hype);
        
        const totalPoints = await functions.calculateTotalHypePoints(user);
        if (isNaN(totalPoints)) 
            return interaction.editReply({ content: "error calculating updated hype points.", ephemeral: true });

        const embed = new MessageEmbed()
            .setTitle("added points")
            .setDescription(`added **${hype}** points to <@${selectedUserId}>, updated points: ${totalPoints}`)
            .setThumbnail("https://i.imgur.com/zBvLCRx.png")
            .setColor("GREEN")
            .setFooter({
                text: "Reload Backend",
                iconURL: "https://cdn.discordapp.com/attachments/1358194526652727467/1358211573453426708/Ascend_Icon.png?ex=69637fd9&is=69622e59&hm=9fb087c23676781417a3c87f9ec8946e378228fed23ed1a2458f6197a2626c49&"
            })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed], ephemeral: true });
    }
};