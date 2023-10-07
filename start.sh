#!/bin/bash

# Check if the node_modules folder contains any files or folders
if [ ! -d "build" ]; then
  echo "Running strapi build"
  node node_modules/@strapi/strapi/bin/strapi.js build
  echo "Finished strapi build"
fi
echo "Strapi Admin built, starting server"
pm2 start server.js --no-daemon
