const {
	EmbedBuilder,
	SlashCommandBuilder
} = require('discord.js');
const fs = require('fs');
const config = require('../config/config.json');
const subreddit = require('../functions/subreddit.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName((config.subredditCommand).toLowerCase().replaceAll(/[^a-z0-9]/gi, '_'))
		.setDescription(`Search Subreddits`)
		.addStringOption(option =>
			option.setName('subreddit')
			.setDescription('What do you want to look at you pervert?')
			.setRequired(true)
			.setAutocomplete(true)),

	async execute(client, interaction) {
		let channel = await client.channels.fetch(interaction.channelId).catch(console.error);
		let guild = await client.guilds.fetch(interaction.guildId).catch(console.error);
		let userSearch = interaction.options.getString('subreddit');
		subreddit.sub(client, interaction, userSearch);
	}, //End of execute()
};