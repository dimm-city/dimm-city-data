FROM node:16-alpine

ENV PORT 1337
ENV HOST 0.0.0.0
ENV NODE_ENV production

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
#COPY yarn.lock /usr/src/app/

RUN npm install

COPY . /usr/src/app/
RUN npm run build

EXPOSE 1337

CMD [ "npm", "start" ]