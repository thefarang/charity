# To build:
# > docker build -t thefarang/charity .
#
# To run:
# > docker run -p 80:80 --env-file .env thefarang/charity

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

# Execute the task runner to build the assets
COPY gulpfile.js /app/
RUN npm run build-assets

CMD ["npm", "start"]

EXPOSE 80
