FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy application
COPY . .

# Expose port
EXPOSE 3000

# Set environment
ENV REACT_APP_BACKEND_URL=http://localhost:8000

# Run application
CMD ["npm", "start"]
