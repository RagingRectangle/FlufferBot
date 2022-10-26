const mysql = require('mysql2');
const config = require('./config/config.json');

createDatabase();
async function createDatabase() {
   var dbConfig = config.database;
   dbConfig.multipleStatements = true;
   let connection = mysql.createConnection(config.database);
   let searchesTableQuery = `CREATE TABLE if not exists searches (id VARCHAR(20) NOT NULL, date VARCHAR(45) NOT NULL, phrase VARCHAR(100) NOT NULL, user_id VARCHAR(20) NOT NULL, guild_id VARCHAR(20) NOT NULL, PRIMARY KEY (id));`
   let subredditsTableQuery = `CREATE TABLE if not exists subreddits (id VARCHAR(20) NOT NULL, date VARCHAR(45) NOT NULL, subreddit VARCHAR(100) NOT NULL, link VARCHAR(100) NOT NULL, user_id VARCHAR(20) NOT NULL, guild_id VARCHAR(20) NOT NULL, PRIMARY KEY (id));`
   let webmsTableQuery = `CREATE TABLE if not exists webms (id VARCHAR(20) NOT NULL, title VARCHAR(100) NOT NULL, gif VARCHAR(100) NOT NULL, webm VARCHAR(100) NOT NULL, guild_id VARCHAR(20) NOT NULL, PRIMARY KEY (id));`
   try {
      connection.query(`${searchesTableQuery} ${subredditsTableQuery} ${webmsTableQuery}`, (error, results) => {
         if (error) {
            console.log("Database creation error:", error);
            connection.end();
         } else {
            connection.end();
            console.log("Database tables created.");
         }
      }); //End of connection
   } catch (err) {
      console.log("Database creation error:", err);
   }
} //End of createDatabase()