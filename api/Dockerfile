# Use Node 20 with Alpine as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json) files
COPY package*.json ./

# Install project dependencies
# For production, you might want to use `npm ci --only=production`
RUN npm install

# Copy the rest of your application's code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your app (modify this if your entry point is different)
CMD ["node", "index.js"]