const config = require('../config');

module.exports = {
  name: 'info',
  description: 'Displays information about the bot',
  usage: '!info',
  
  /**
   * Execute the info command
   * @param {Object} message - The message object
   */
  async execute(message) {
    const infoText = `*${config.BOT_NAME}*
Version: ${config.BOT_VERSION}
Created with whatsapp-web.js

*Available Commands:*
Use !help to see all available commands.

*How to Use:*
Send a message starting with ! followed by a command name.
Example: !help, !echo Hello World

This bot is running on Node.js ${process.version}.`;
    
    await message.reply(infoText);
  }
};