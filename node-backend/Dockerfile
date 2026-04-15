FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source files
COPY . .

# Expose the API port
EXPOSE 8080

# Use non-root user for security
USER node

CMD ["node", "server.js"]
