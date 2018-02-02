FROM node:8.5.0-alpine

RUN mkdir -p /app/src
WORKDIR /app

COPY package.json /app/
RUN npm install --silent
RUN npm cache clean --force --silent

COPY ./src /app/src
COPY .env /app/
RUN npm run browserify

EXPOSE 80
