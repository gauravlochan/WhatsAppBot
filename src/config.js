require('dotenv').config();

/**
 * Bot configuration
 */
module.exports = {
  // Directory to store session data
  SESSION_DATA_PATH: process.env.SESSION_DATA_PATH || './.wwebjs_auth',
  
  // Bot settings
  BOT_NAME: process.env.BOT_NAME || 'WhatsApp Bot',
  BOT_VERSION: process.env.BOT_VERSION || '1.0.0',
  
  // Commands prefix
  COMMAND_PREFIX: process.env.COMMAND_PREFIX || '!',
  
  // Default responses
  RESPONSES: {
    WELCOME: "Welcome to the WhatsApp Bot! Type !help for a list of commands.",
    UNKNOWN_COMMAND: "Sorry, I don't recognize that command. Type !help for a list of available commands.",
    ERROR: "Sorry, something went wrong. Please try again later."
  }
};