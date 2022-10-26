const {
   Client,
   GatewayIntentBits,
   Partials,
   Collection,
   Permissions,
   ActionRowBuilder,
   SelectMenuBuilder,
   MessageButton,
   EmbedBuilder,
   ButtonBuilder,
   ButtonStyle,
   InteractionType,
   ChannelType,
} = require('discord.js');
const client = new Client({
   intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.DirectMessages],
   partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});
const fs = require('fs');
const config = require('./config/config.json');
const SlashRegistry = require('./functions/slashRegistry.js');


client.on('ready', async () => {
   console.log("Fluffer Bot Logged In");
   //Register Slash Commands
   if (config.slashGuildIDs.length > 0) {
      SlashRegistry.registerCommands(client);
   }
}); //End of ready()


//Slash commands
client.on('interactionCreate', async interaction => {
   if (interaction.type !== InteractionType.ApplicationCommand) {
      return;
   }
   let user = interaction.user;
   if (user.bot == true) {
      return;
   }
   const command = client.commands.get(interaction.commandName);
   if (!command) {
      return;
   }
   try {
      let slashReturn = await command.execute(client, interaction);
      try {
         if (slashReturn === 'delete') {
            interaction.deleteReply().catch(err);
         }
      } catch (err) {}
   } catch (error) {
      console.error(error);
      await interaction.reply({
         content: 'There was an error while executing this command!',
         ephemeral: true
      }).catch(console.error);
   }
}); //End of slash commands


//AutoComplete
client.on('interactionCreate', async interaction => {
   if (!interaction.isAutocomplete()) return;
   let focusedValue = interaction.options.getFocused();
   let subList = JSON.parse(fs.readFileSync('./config/subList.json'));
   let filteredAll = subList.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase()));
   let shuffled = filteredAll
      .map(value => ({
         value,
         sort: Math.random()
      }))
      .sort((a, b) => a.sort - b.sort)
      .map(({
         value
      }) => value);
   var suggestions = [];
   for (var s = 0; s < 25 && s < shuffled.length; s++) {
      suggestions.push(shuffled[s]);
   }
   await interaction.respond(
      suggestions.map(choice => ({
         name: choice,
         value: choice
      }))
   ).catch(console.error);
}); //End of 


client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.login(config.token);