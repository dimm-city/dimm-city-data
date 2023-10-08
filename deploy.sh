#! /bin/bash

# node --version
# npm --version

# Set default values for DEPLOYMENT_SOURCE and DEPLOYMENT_TARGET
DEPLOYMENT_SOURCE="${DEPLOYMENT_SOURCE:-/tmp/zipdeploy/extracted}"
DEPLOYMENT_TARGET="${DEPLOYMENT_TARGET:-/home/site/wwwroot}"

echo "Removing $DEPLOYMENT_TARGET"
rm -rf "$DEPLOYMENT_TARGET"
echo "Copying $DEPLOYMENT_SOURCE to $DEPLOYMENT_TARGET"
mkdir "$DEPLOYMENT_TARGET"
cp -r "$DEPLOYMENT_SOURCE"/* "$DEPLOYMENT_TARGET"
echo "Copy complete, make sure the admin app is rebuilt during startup"
