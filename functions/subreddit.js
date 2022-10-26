const {
   Client,
   GatewayIntentBits,
   Partials,
   Collection,
   Permissions,
   ActionRowBuilder,
   AttachmentBuilder,
   SelectMenuBuilder,
   MessageButton,
   ModalBuilder,
   EmbedBuilder,
   ButtonBuilder,
   ButtonStyle,
   InteractionType,
   TextInputStyle,
   TextInputBuilder,
   ChannelType
} = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({
   default: fetch
}) => fetch(...args));
const fs = require('fs');
const moment = require('moment');
const mysql = require('mysql2');
const config = require('../config/config.json');

module.exports = {
   sub: async function sub(client, interaction, userSearch) {
      await interaction.deferReply();
      function getRandomInt(max) {
         return Math.floor(Math.random() * max);
      }
      const result = await fetch(`https://www.reddit.com/r/${userSearch}.json`);
      res = await result.json();
      for (var i = 0; i < 15; i++) {
         try {
            var url = res.data.children[getRandomInt(res.data.children.length)].data.url;
            let historyCheck = await this.checkSubHistory(interaction, url);
            if (historyCheck == 'ERROR' || historyCheck[0]['count'] > 0) {
               if (i == 14) {
                  await interaction.editReply('Failed to get pic for this subreddit.').catch(console.error);
               } else {
                  continue;
               }
            } else {
               interaction.editReply(url).catch(console.error);
               this.saveSubData(client, interaction, userSearch, url);
               break;
            }
         } catch (err) {
            await interaction.editReply('Failed to get pic for this subreddit.').catch(console.error);
         }
      } //End of i loop
   }, //End of sub()


   checkSubHistory: async function checkSubHistory(interaction, link) {
      let historyCheckQuery = `SELECT COUNT(*) AS count FROM subreddits WHERE link = "${link}" AND guild_id = "${interaction.guildId}";`;
      let connection = mysql.createConnection(config.database);
      return new Promise((resolve, reject) => {
         try {
            connection.query(historyCheckQuery, (error, results) => {
               if (error) {
                  connection.end();
                  return resolve('ERROR');
               }
               connection.end();
               return resolve(results);
            });
         } catch (err) {
            return resolve('ERROR');
         }
      });
   }, //End of checkSubHistory


   saveSubData: async function saveSubData(client, interaction, userSearch, link) {
      let subQuery = `INSERT INTO subreddits (id, date, subreddit, link, user_id, guild_id) VALUES ("${interaction.id}", "${moment().format('x')}", "${userSearch}", "${link}", "${interaction.user.id}", "${interaction.guildId}");`;
      runQuery(subQuery);
      async function runQuery(subQuery) {
         let connection = mysql.createConnection(config.database);
         return new Promise((resolve, reject) => {
            try {
               connection.query(subQuery, (error, results) => {
                  if (error) {
                     connection.end();
                     return resolve('ERROR');
                  }
                  connection.end();
                  return resolve(results);
               });
            } catch (err) {
               return resolve('ERROR');
            }
         });
      } //End of runQuery()
   } //End of saveSubData
}