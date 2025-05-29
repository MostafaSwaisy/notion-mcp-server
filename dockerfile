# Use official Node.js LTS image as the base
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Expose the port (use the same port as in your .env or default 3000)
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
