const {
	EmbedBuilder,
	SlashCommandBuilder
} = require('discord.js');
const fs = require('fs');
const config = require('../config/config.json');
const Gif = require('../functions/gif.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName((config.gifCommand).toLowerCase().replaceAll(/[^a-z0-9]/gi, '_'))
		.setDescription(`Search for NSFW gifs`)
		.addStringOption(option =>
			option.setName('search')
			.setDescription('What do you want to look at you pervert?')
			.setRequired(true)),

	async execute(client, interaction) {
		let channel = await client.channels.fetch(interaction.channelId).catch(console.error);
		let guild = await client.guilds.fetch(interaction.guildId).catch(console.error);
		let userSearch = interaction.options.getString('search');
		Gif.gifs(client, interaction, userSearch);
	}, //End of execute()
};