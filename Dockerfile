# To build:
# > docker build --build-arg APP_URL=${APP_URL} --tag thefarang/charity:${NODE_ENV} .
#
# To run:
# > docker run --port 80:80 --env-file .env thefarang/charity:${NODE_ENV}

FROM node:8.5.0-alpine

# Create the build and deployment directories
RUN mkdir -p /app/src
WORKDIR /app

# Copy across the app code and the task runner to build the app.
COPY ./src /app/src
COPY package.json /app/
COPY gulpfile.js /app/

# Make the APP_URL build arg available for use by gulp (for building sitemaps)
ARG APP_URL
RUN echo 'Using application url: ' && echo $APP_URL

# Install app dependencies and app build dependencies
# Build the app assets
# Uninstall development dependencies
# Clean the npm cache
# Delete redundant build files
RUN npm install && \
    npm install --global gulp-cli@2.0.1 && \
    npm run setup-app && \
    npm uninstall gulp-cli && \
    npm uninstall gulp browserify gulp-less gulp-rename nodemon standard vinyl-source-stream && \
    npm cache clean --force && \
    rm -rf /app/src/assets && \
    rm -f /app/gulpfile.js && \
    mv /app/src /app/deploy

CMD ["npm", "start"]

# Result
# /app/deploy/
# /app/node_modules/
# /app/package.json
