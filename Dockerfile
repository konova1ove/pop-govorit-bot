# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port (not needed for Telegram bot, but good practice)
EXPOSE 3000

# Start the bot
CMD ["node", "bot.js"]