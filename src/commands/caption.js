const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const os = require('os');
const logger = require('../utils/logger');

module.exports = {
  name: 'caption',
  description: 'Adds a caption to an image',
  usage: '!caption [text] (reply to an image)',
  
  /**
   * Execute the caption command
   * @param {Object} message - The message object
   * @param {string[]} args - Command arguments
   */
  async execute(message, args) {
    try {
      // Check if there's a quoted message (reply)
      const quotedMsg = await message.getQuotedMessage();
      logger.info('Quoted message:', quotedMsg ? 'Found' : 'Not found');
      
      if (!quotedMsg || !quotedMsg.hasMedia) {
        await message.reply('Please reply to an image with the caption command!');
        return;
      }

      // Get the caption text
      const captionText = args.join(' ');
      if (!captionText) {
        await message.reply('Please provide caption text!');
        return;
      }

      logger.info('Downloading media...');
      // Download the image
      const media = await quotedMsg.downloadMedia();
      logger.info('Media downloaded:', media ? 'Success' : 'Failed');
      
      if (!media) {
        await message.reply('Failed to download the image.');
        return;
      }

      logger.info('Media type:', media.mimetype);
      logger.info('Media data length:', media.data.length);

      // Create a temporary file for the image
      const tempDir = os.tmpdir();
      const inputPath = path.join(tempDir, 'input.jpg');
      const outputPath = path.join(tempDir, 'output.jpg');

      logger.info('Saving image to:', inputPath);
      // Save the downloaded image
      const imageBuffer = Buffer.from(media.data, 'base64');
      fs.writeFileSync(inputPath, imageBuffer);
      logger.info('Image saved successfully');

      logger.info('Getting image metadata...');
      // Get image metadata
      const metadata = await sharp(inputPath).metadata();
      logger.info('Image metadata:', metadata);
      
      // Create a text overlay
      const svgText = `
        <svg width="${metadata.width}" height="${metadata.height}">
          <style>
            .caption { 
              font-family: Arial;
              font-size: 40px;
              font-weight: bold;
              fill: white;
              stroke: black;
              stroke-width: 2;
              text-anchor: middle;
            }
          </style>
          <text x="50%" y="90%" class="caption">${captionText}</text>
        </svg>
      `;

      logger.info('Processing image with caption...');
      // Process the image
      await sharp(inputPath)
        .composite([{
          input: Buffer.from(svgText),
          top: 0,
          left: 0,
        }])
        .toFile(outputPath);
      logger.info('Image processed successfully');

      logger.info('Reading processed image...');
      // Send the modified image
      const processedImage = fs.readFileSync(outputPath);
      logger.info('Sending processed image...');
      
      // Send as a new message with media
      await message.getChat().then(chat => {
        chat.sendMessage('Here\'s your captioned image!', {
          media: {
            mimetype: 'image/jpeg',
            data: processedImage.toString('base64')
          }
        });
      });
      logger.info('Image sent successfully');

      // Clean up temporary files
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
      logger.info('Temporary files cleaned up');

    } catch (error) {
      logger.error('Error in caption command:', error);
      logger.error('Error stack:', error.stack);
      await message.reply('Sorry, there was an error processing your image.');
    }
  }
}; 