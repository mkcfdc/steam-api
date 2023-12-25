# Stage 1: Build the React application

# Use Node 20 with Alpine as the base image
FROM node:20-alpine as build

# Set the working directory in the Docker container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock if using Yarn)
COPY package.json package-lock.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the React application
#RUN npm run build
RUN npm run build

# Stage 2: Serve the application with Nginx

# Use Nginx with Alpine as the base image
FROM nginx:alpine

# Copy the built files from the build stage to the Nginx server
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration file
COPY ./nginx/gladwater.gg.conf /etc/nginx/default.conf
COPY ./nginx/dhparam /etc/ssl/dhparam

# Copy SSL certificates
COPY ./ssl /etc/ssl/

# Expose port 80 and 443 for HTTP and HTTPS
EXPOSE 80
EXPOSE 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
