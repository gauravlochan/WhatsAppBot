const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const logger = require('./utils/logger');
const commandHandler = require('./commands');
const { SESSION_DATA_PATH } = require('./config');

let client;

/**
 * Initialize the WhatsApp bot
 * @returns {Promise} A promise that resolves when the bot is ready
 */
async function initializeBot() {
  logger.info('Initializing WhatsApp client...');
  
  // Create a new client instance
  client = new Client({
    authStrategy: new LocalAuth({
      dataPath: SESSION_DATA_PATH
    }),
    puppeteer: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    }
  });

  // Set up event listeners
  setupEventListeners();
  
  // Initialize the client
  await client.initialize();
  
  return client;
}

/**
 * Set up event listeners for the WhatsApp client
 */
function setupEventListeners() {
  // Generate QR code for authentication
  client.on('qr', (qr) => {
    logger.info('QR Code received. Scan this with your WhatsApp app:');
    qrcode.generate(qr, { small: true });
  });

  // Handle authentication
  client.on('authenticated', () => {
    logger.success('Authentication successful!');
  });

  // Handle auth failures
  client.on('auth_failure', (error) => {
    logger.error('Authentication failed:', error);
  });

  // Handle successful client initialization
  client.on('ready', () => {
    logger.success('WhatsApp client is ready!');
  });

  // Handle incoming messages
  client.on('message', async (message) => {
    try {
      await handleIncomingMessage(message);
    } catch (error) {
      logger.error('Error handling message:', error);
    }
  });

  // Handle disconnects
  client.on('disconnected', (reason) => {
    logger.warn('Client disconnected:', reason);
    // Attempt to reconnect
    client.initialize();
  });
}

/**
 * Handle incoming messages
 * @param {Object} message - The incoming message object
 */
async function handleIncomingMessage(message) {
  const messageContent = message.body.trim();
  
  // Log the incoming message
  logger.info(`New message from ${message.from}: ${messageContent}`);
  
  // Check if message is a command (starts with !)
  if (messageContent.startsWith('!')) {
    await commandHandler.handleCommand(message, client);
    return;
  }
  
  // Process regular messages
  if (message.from.endsWith('@c.us')) { // Ensure it's from a user, not a group
    // Auto-reply to regular messages
    const autoReply = "Hi there! This is an automated response. You can use commands like !help to interact with me.";
    await message.reply(autoReply);
  }
}

/**
 * Send a message to a specific chat
 * @param {string} to - The recipient's ID
 * @param {string} content - The message content
 */
async function sendMessage(to, content) {
  try {
    await client.sendMessage(to, content);
    logger.info(`Message sent to ${to}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send message to ${to}:`, error);
    return false;
  }
}

module.exports = {
  initializeBot,
  sendMessage,
  getClient: () => client
};