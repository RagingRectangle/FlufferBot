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

const download = require('download-file');
const fs = require('fs');
const moment = require('moment');
const mysql = require('mysql2');
const config = require('../config/config.json');
const Pornsearch = require('pornsearch');

module.exports = {
   gifs: async function gifs(client, interaction, userSearch) {
      interaction.deferReply();
      var newWebm = false;
      for (var page = 1; page < 11; page++) {
         let scrapeResults = await this.scrapeGifs(page, userSearch);
         if (scrapeResults == 'ERROR') {
            await interaction.editReply({
               content: `No new posts for this search were found.`,
            }).catch(console.error);
            return;
         }
         let dbCheck = await this.runQuery(`SELECT * FROM webms WHERE guild_id = "${interaction.guildId}" AND webm IN (${scrapeResults[1].join(', ')})`);
         //No new gifs found
         if (dbCheck.length == 0) {
            this.pickRandomGif(interaction, scrapeResults[0]);
            newWebm = true;
            break;
         }
         var newGifs = [];
         for (var s in scrapeResults[0]) {
            var isNew = true;
            for (var d in dbCheck) {
               if (scrapeResults[0][s]['webm'] == dbCheck[d]['webm']) {
                  isNew = false;
               }
            } //End of d loop
            if (isNew == true) {
               newGifs.push(scrapeResults[0][s]);
            }
         } //End of s loop
         //Try next page
         if (newGifs.length == 0) {
            continue;
         }
         this.pickRandomGif(interaction, newGifs);
         newWebm = true;
         break;
      } //End of page loop
      if (newWebm == false) {
         await interaction.editReply({
            content: `No new posts for this search were found.`,
         }).catch(console.error);
      }
   }, //End of gifs()


   pickRandomGif: async function pickRandomGif(interaction, gifs) {
      let rdm = Math.floor(Math.random() * (gifs.length - 1));
      let gif = gifs[rdm];
      if (config.webms == true){
         download(gif['webm'], {
            directory: "./webms/",
            filename: `${gif['title'].replaceAll(/[^a-z0-9]/gi, '_')}.webm`
         }, async function (err) {
            if (err) {
               console.log("download error:", err);
            } else {
               module.exports.sendGif(interaction, gif);
            }
         }) //End of download()
      }
      else {
         module.exports.sendGif(interaction, gif);
      }
   }, //End of pickRandomGif()


   sendGif: async function sendGif(interaction, gif) {
      //Send webm
      if (config.webms == true) {
         await interaction.editReply({
            content: `[${gif['title']}](<${gif['url']}>)`,
            files: [new AttachmentBuilder(`./webms/${gif['title'].replaceAll(/[^a-z0-9]/gi, '_')}.webm`)]
         }).catch(console.error);
         try {
            fs.unlinkSync(`./webms/${gif['title'].replaceAll(/[^a-z0-9]/gi, '_')}.webm`);
         } catch (err) {
            console.log(`Failed to delete webm: ${err}`);
         }
      }
      //Send gif only
      else {
         await interaction.editReply({
            content: gif['url']
         }).catch(console.error);
      }
      this.saveGifData(interaction, gif)
   }, //End of sendGif()


   saveGifData: async function saveGifData(interaction, gif) {
      let searchesQuery = `INSERT INTO searches (id, date, phrase, user_id, guild_id) VALUES ("${interaction.id}", "${moment().format('x')}", "${interaction.options.getString('search').replaceAll(/[^a-z0-9]/gi, ' ')}", "${interaction.user.id}", "${interaction.guildId}")`;
      let searchesResult = await this.runQuery(searchesQuery);
      if (searchesResult == 'ERROR') {
         console.log("searchesResult sql error!");
      }
      let webmsQuery = `INSERT INTO webms (id, title, gif, webm, guild_id) VALUES ("${interaction.id}", "${gif['title'].replaceAll(/[^a-z0-9]/gi, ' ')}", "${gif['url']}", "${gif['webm']}", "${interaction.guildId}")`;
      let webmsResult = await this.runQuery(webmsQuery);
      if (webmsResult == 'ERROR') {
         console.log("webmsResult sql error!");
      }
   }, //End of saveGifData


   runQuery: async function runQuery(query) {
      let connection = mysql.createConnection(config.database);
      return new Promise((resolve, reject) => {
         try {
            connection.query(query, (error, results) => {
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
   }, //End of runQuery()


   scrapeGifs: async function scrapeGifs(page, userSearch) {
      return new Promise((resolve, reject) => {
         try {
            Pornsearch.search(userSearch.replaceAll(' ', '%20'))
               .gifs(page).catch(err => {
                  console.log(err);
                  return resolve('ERROR');
               })
               .then(gifs => {
                  if (gifs != undefined) {
                     var allGifs = [];
                     var webmArray = [];
                     for (var g in gifs) {
                        if (gifs[g]['title'].replaceAll(/[^a-z0-9]/gi, '_').replaceAll("'", "").replaceAll(";", "") != '' && gifs[g]['webm'].replaceAll(/[^a-z0-9]/gi, '_') != '') {
                           allGifs.push(gifs[g]);
                           webmArray.push(`"${gifs[g]['webm']}"`);
                        }
                     } //End of g loop
                     return resolve([allGifs, webmArray]);
                  }
               });
         } catch {
            console.log("scrapeGifs error!");
         }
      });
   }, //End of scrapeGifs()
}