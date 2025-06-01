const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const config = require('../config');

// Command registry
const commands = new Map();

// Load command handlers
function loadCommands() {
  const commandsDir = path.join(__dirname);
  
  // Skip the index.js file
  const commandFiles = fs.readdirSync(commandsDir)
    .filter(file => file !== 'index.js' && file.endsWith('.js'));
  
  for (const file of commandFiles) {
    try {
      const commandModule = require(path.join(commandsDir, file));
      if (commandModule.name && commandModule.execute) {
        commands.set(commandModule.name.toLowerCase(), commandModule);
        logger.info(`Registered command: ${commandModule.name}`);
      }
    } catch (error) {
      logger.error(`Failed to load command from ${file}:`, error);
    }
  }
}

/**
 * Handle a command message
 * @param {Object} message - The incoming message
 * @param {Object} client - The WhatsApp client instance
 */
async function handleCommand(message, client) {
  const messageContent = message.body.trim();
  
  // Extract command name (remove prefix and get first word)
  const commandName = messageContent.split(' ')[0].slice(config.COMMAND_PREFIX.length).toLowerCase();
  
  // Extract arguments (everything after command)
  const args = messageContent.split(' ').slice(1);
  
  // Check if command exists
  if (commands.has(commandName)) {
    try {
      // Execute the command
      const command = commands.get(commandName);
      logger.info(`Executing command: ${commandName}`);
      await command.execute(message, args, client);
    } catch (error) {
      logger.error(`Error executing command ${commandName}:`, error);
      await message.reply("Sorry, there was an error executing that command.");
    }
  } else {
    // Unknown command
    await message.reply(config.RESPONSES.UNKNOWN_COMMAND);
  }
}

// Initialize command registry
loadCommands();

// Export both the commands Map and the handler
module.exports = {
  handleCommand,
  commands
};