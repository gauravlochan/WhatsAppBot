const axios = require('axios');

module.exports = {
  name: 'joke',
  description: 'Tells you a random joke',
  usage: '!joke',
  
  /**
   * Execute the joke command
   * @param {Object} message - The message object
   * @param {string[]} args - Command arguments
   */
  async execute(message, args) {
    try {
      // Fetch a random joke from JokeAPI
      const response = await axios.get('https://v2.jokeapi.dev/joke/Any?safe-mode');
      const joke = response.data;

      let jokeText;
      if (joke.type === 'single') {
        jokeText = joke.joke;
      } else {
        jokeText = `${joke.setup}\n\n${joke.delivery}`;
      }

      await message.reply(jokeText);
    } catch (error) {
      await message.reply('Sorry, I couldn\'t fetch a joke right now. Try again later!');
    }
  }
}; 