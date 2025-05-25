# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Expose the port Vite is configured to use
EXPOSE 3000

# Run Vite dev server (via local install)
CMD ["npx", "vite"]
