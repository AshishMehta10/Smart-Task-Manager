# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first (to leverage Docker layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally for development
RUN npm install -g nodemon

# Copy the rest of the application code
COPY . .

# Expose port for backend (e.g., Express server runs on 5000)
EXPOSE 5000

# Default command to run the backend with nodemon
CMD ["npx", "nodemon"]
