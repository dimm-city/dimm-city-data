#! /bin/bash


# Set default values for DEPLOYMENT_SOURCE and DEPLOYMENT_TARGET
DEPLOYMENT_SOURCE="${DEPLOYMENT_SOURCE:-/tmp/zipdeploy/extracted}"
DEPLOYMENT_TARGET="${DEPLOYMENT_TARGET:-/home/site/wwwroot}"

NODE_VERSION="18.17.1"

export PATH=/tmp/zipdeploy/extracted/node-v$NODE_VERSION-linux-x64/bin/:$PATH

# Get current Node.js version
CURRENT_NODE_VERSION=$(node -v)

# Install Node.js only if the current version is less than the specified version
if [[ $(echo -e "$CURRENT_NODE_VERSION\nv$NODE_VERSION" | sort -V | head -n1) != "v$NODE_VERSION" ]]; then
  echo "Install correct node version on build container"
  curl -s https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz -o node.tar.xz
  echo "Installing node"
  ls -la | grep node.tar
  tar -xf node.tar.xz
  rm node.tar.xz
  echo "Node install complete"
fi
TMP_NV=$(node --version)
TMP_NPM=$(npm --version)
echo "Node: $TMP_NV | NPM: $TMP_NPM"


echo "Syncing source code to wwwroot"
rsync -arv --no-o --no-g --ignore-existing --size-only --exclude ".deployment" --exclude "deploy.sh" --exclude "node-*" ./ /home/site/wwwroot

echo "Running install and build"
cd /home/site/wwwroot
rm package-lock.json
npm install
npm run build
