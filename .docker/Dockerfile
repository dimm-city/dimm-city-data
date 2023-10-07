# # Creating multi-stage build for production
# FROM node:18-alpine as build
# RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git > /dev/null 2>&1
# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /opt/
# COPY package.json package-lock.json ./
# RUN npm install -g node-gyp
# RUN npm config set fetch-retry-maxtimeout 600000 -g && npm install --only=production
# ENV PATH /opt/node_modules/.bin:$PATH
# WORKDIR /opt/app
# COPY . .
# RUN npm run build

# Creating final production image
#FROM mcr.microsoft.com/appsvc/node:18-lts_20230908.2.tuxprod
FROM node:18-bullseye
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN npm install -g node-gyp pm2
RUN mkdir /opt/strapi
COPY . /opt/strapi/
WORKDIR /opt/strapi
RUN npm install
RUN npm run build
# COPY --from=build /opt/node_modules ./app/node_modules
# WORKDIR /opt/app
# COPY --from=build /opt/app ./
ENV PATH /opt/strapi/node_modules/.bin:$PATH

# RUN chown -R node:node /opt/app
# USER node

ENV HOST=127.0.0.1
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "run", "start"]
