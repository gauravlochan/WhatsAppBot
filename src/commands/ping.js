module.exports = {
  name: 'ping',
  description: 'Checks if the bot is responsive',
  usage: '!ping',
  
  /**
   * Execute the ping command
   * @param {Object} message - The message object
   */
  async execute(message) {
    const startTime = Date.now();
    const reply = await message.reply('Pong!');
    const endTime = Date.now();
    
    // Calculate response time
    const responseTime = endTime - startTime;
    
    // Update the message with the response time
    await reply.edit(`Pong! Response time: ${responseTime}ms`);
  }
};