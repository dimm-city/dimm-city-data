FROM node:16-alpine

ENV PORT 8080
ENV HOST 0.0.0.0
ENV NODE_ENV production

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm install
RUN npm install -g pm2

COPY . /usr/src/app/
RUN npm run build

EXPOSE 8080

CMD [ "pm2","start","server.js","--no-daemon" ]