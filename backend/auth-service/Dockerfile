# Use Node.js LTS Alpine for a small image footprint
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the source code
COPY . .

# Expose port
EXPOSE 3001

# Command to run the application
CMD ["npm", "start"]