FROM node:8.5.0-alpine

# Build app directory
RUN mkdir -p /app/src
WORKDIR /app

# Install the app dependencies
COPY package.json /app/
RUN npm install --silent

# Install global task runner
RUN npm install --global gulp-cli@2.0.1

# Cleanup installation
RUN npm cache clean --force --silent

# Copy the app files, configuration and build tool to the app directory
COPY ./src /app/src
COPY .env /app/
COPY gulpfile.js /app/

# Execute the task runner to build the assets
RUN npm run build-assets

# Copy docker-compose startup script to the app directory
COPY ./docker-compose-cmd.sh /app/
RUN chmod 755 /app/docker-compose-cmd.sh

EXPOSE 80
