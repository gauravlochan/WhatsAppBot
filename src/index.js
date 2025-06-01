const { initializeBot } = require('./bot');
const logger = require('./utils/logger');

// Display welcome message
logger.info('Starting WhatsApp Bot...');

// Initialize the WhatsApp bot
initializeBot()
  .then(() => {
    logger.success('Bot initialization complete!');
  })
  .catch((error) => {
    logger.error('Failed to initialize bot:', error);
    process.exit(1);
  });

// Handle process termination
process.on('SIGINT', () => {
  logger.info('Shutting down bot...');
  process.exit(0);
});