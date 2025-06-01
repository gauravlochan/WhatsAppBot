# WhatsApp Bot

A customizable WhatsApp bot built with Node.js and whatsapp-web.js.

## Features

- Message handling with automatic responses
- Command system for processing specific commands
- Session management for conversation context
- Media handling capabilities
- Configurable responses and behaviors
- QR code authentication for WhatsApp Web connection

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A WhatsApp account

### Installation

1. Clone the repository or download the source code
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file from the example:

```bash
cp .env.example .env
```

4. Start the bot:

```bash
npm start
```

5. Scan the QR code with your WhatsApp account to authenticate

## Available Commands

- `!help` - Display available commands
- `!echo [message]` - Repeat the message you send
- `!info` - Display information about the bot
- `!ping` - Check if the bot is responsive

## Adding New Commands

To add a new command, create a new JavaScript file in the `src/commands` directory. The file should export an object with the following properties:

- `name` - The name of the command (without the prefix)
- `description` - A brief description of what the command does
- `usage` - How to use the command
- `execute` - The function to execute when the command is invoked

Example:

```javascript
module.exports = {
  name: 'hello',
  description: 'Greets the user',
  usage: '!hello [name]',
  
  async execute(message, args) {
    const name = args.join(' ') || 'there';
    await message.reply(`Hello, ${name}!`);
  }
};
```

## License

This project is licensed under the MIT License.