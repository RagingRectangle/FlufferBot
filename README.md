# Fluffer Bot

## About
A very NSFW Discord bot that uses slash commands to search Pornhub for webms/gifs as well as subreddit posts. Posts will not be duplicated in the same guild unless the same gif/post has been uploaded multiple times.

Join the Discord server for any help and to keep up with updates: https://discord.gg/USxvyB9QTz
  
 
  
  
## Requirements
1: Node 16+ installed on server

2: Discord bot with:
  - Server Members Intent
  - Message Content Intent
  - Read/write perms in channels

3: Database with user access

 
  
  
## Install
```
git clone https://github.com/RagingRectangle/FlufferBot.git
cd FlufferBot
cp -r config.example config
npm install
<FILL OUT CONFIG>
node database.js (Create db tables)
```
 
  
  

## Config Setup
- **token:** Discord bot token.
- **slashGuildIDs:** Server IDs where slash commands should be registered.
- **webms:** Send webms instead of gifs (Webms won't play on iOS devices 🙄. If set to true then gifs will still be available as embeded links for those unfortunate enough to be using iPhones).
- **gifCommand:** Command to search for webms/gifs on Pornhub using keywords/phrases.
- **subredditCommand:** Command to search any subreddit for a random post.
- **database:** Basic db info.
- **/config/subList:** The list of subreddits to suggest as autofills, add/remove any that you want.
 
  
  

## Usage
- Start the bot in a console with `node fluffer.js`
- Can (*should*) use PM2 to run instead with `pm2 start fluffer.js`