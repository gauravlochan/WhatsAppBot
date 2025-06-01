const { commands } = require('./index');

module.exports = {
  name: 'help',
  description: 'Displays a list of available commands',
  usage: '!help [command]',
  
  /**
   * Execute the help command
   * @param {Object} message - The message object
   * @param {string[]} args - Command arguments
   */
  async execute(message, args) {
    try {
      // If a specific command was requested
      if (args.length > 0) {
        const commandName = args[0].toLowerCase();
        if (commands.has(commandName)) {
          const command = commands.get(commandName);
          let helpText = `*Command: !${command.name}*\n`;
          
          if (command.description) {
            helpText += `*Description:* ${command.description}\n`;
          }
          
          if (command.usage) {
            helpText += `*Usage:* ${command.usage}\n`;
          }
          
          await message.reply(helpText);
        } else {
          await message.reply(`Command '!${commandName}' not found. Use !help to see all available commands.`);
        }
        return;
      }
      
      // List all commands
      let helpText = '*Available Commands:*\n\n';
      
      for (const [name, command] of commands.entries()) {
        helpText += `*!${name}*`;
        if (command.description) {
          helpText += `: ${command.description}`;
        }
        helpText += '\n';
      }
      
      helpText += '\nUse !help [command] for more information about a specific command.';
      
      await message.reply(helpText);
    } catch (error) {
      console.error('Error in help command:', error);
      await message.reply('Sorry, there was an error displaying the help information.');
    }
  }
};