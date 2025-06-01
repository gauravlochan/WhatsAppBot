const chalk = require('chalk');

/**
 * Utility for logging messages with colors and timestamps
 */
const logger = {
  /**
   * Log an informational message
   * @param {...any} args - Message content
   */
  info: (...args) => {
    console.log(
      chalk.blue('[INFO]'),
      chalk.gray(`[${new Date().toLocaleTimeString()}]`),
      ...args
    );
  },
  
  /**
   * Log a success message
   * @param {...any} args - Message content
   */
  success: (...args) => {
    console.log(
      chalk.green('[SUCCESS]'),
      chalk.gray(`[${new Date().toLocaleTimeString()}]`),
      ...args
    );
  },
  
  /**
   * Log a warning message
   * @param {...any} args - Message content
   */
  warn: (...args) => {
    console.log(
      chalk.yellow('[WARNING]'),
      chalk.gray(`[${new Date().toLocaleTimeString()}]`),
      ...args
    );
  },
  
  /**
   * Log an error message
   * @param {...any} args - Message content
   */
  error: (...args) => {
    console.log(
      chalk.red('[ERROR]'),
      chalk.gray(`[${new Date().toLocaleTimeString()}]`),
      ...args
    );
  },
  
  /**
   * Log a debug message (only in development)
   * @param {...any} args - Message content
   */
  debug: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        chalk.magenta('[DEBUG]'),
        chalk.gray(`[${new Date().toLocaleTimeString()}]`),
        ...args
      );
    }
  }
};

module.exports = logger;