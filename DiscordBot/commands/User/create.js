const { MessageEmbed } = require("discord.js");
const User = require("../../../model/user.js");
const functions = require("../../../structs/functions.js");

module.exports = {
    commandInfo: {
        name: "create",
        description: "Create an account",
        options: [
            {
                name: "email",
                description: "Your email.",
                required: true,
                type: 3
            },
            {
                name: "password",
                description: "Your password.",
                required: true,
                type: 3
            }
        ],
    },
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const { options } = interaction;

        const discordId = interaction.user.id;
        const email = options.get("email").value;
        const password = options.get("password").value;
        const username = interaction.user.username;

        const existingEmail = await User.findOne({ email: email });
        const existingUser = await User.findOne({ username: username });

        const emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!emailFilter.test(email)) {
            return interaction.editReply({ content: "You did not provide a valid email address!", ephemeral: true });
        }
        if (existingEmail) {
            return interaction.editReply({ content: "Email is already in use, please choose another one.", ephemeral: true });
        }
        if (existingUser) {
            return interaction.editReply({ content: "You already have an account.", ephemeral: true });
        }
        if (password.length >= 128) {
            return interaction.editReply({ content: "Your password must be less than 128 characters long.", ephemeral: true });
        }
        if (password.length < 4) {
            return interaction.editReply({ content: "Your password must be at least 4 characters long.", ephemeral: true });
        }

        await functions.registerUser(discordId, username, email, password).then(resp => {
            let embed = new MessageEmbed()
                .setColor("#A020F0")
                .setDescription(`Welcome to Reload Baceknd , **${username}**, have a great time!`) 
                .setImage("https://i.imgur.com/dSGYw51.png"); // image

            interaction.editReply({ embeds: [embed], ephemeral: true });
        });
    }
}
