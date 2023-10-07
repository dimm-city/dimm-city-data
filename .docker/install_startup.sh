#!/bin/bash

# Check if the node_modules folder contains any files or folders
if [ -z "$(ls -A node_modules)" ]; then
  echo "Missing node dependencies, running npm install"
  npm ci
  echo "Running strapi build"
  node node_modules/@strapi/strapi/bin/strapi.js build
  echo "Strapi build complete, starting server"
fi
pm2 start server.js --no-daemon