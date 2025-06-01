module.exports = {
  name: 'echo',
  description: 'Repeats the message you send',
  usage: '!echo [message]',
  
  /**
   * Execute the echo command
   * @param {Object} message - The message object
   * @param {string[]} args - Command arguments
   */
  async execute(message, args) {
    const content = args.join(' ');
    
    if (!content) {
      await message.reply('Please provide a message to echo!');
      return;
    }
    
    await message.reply(content);
  }
};