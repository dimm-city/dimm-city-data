#! /bin/bash

NODE_VERSION="18.17.1"

# Set default values for DEPLOYMENT_SOURCE and DEPLOYMENT_TARGET
DEPLOYMENT_SOURCE="${DEPLOYMENT_SOURCE:-/tmp/zipdeploy/extracted}"
DEPLOYMENT_TARGET="${DEPLOYMENT_TARGET:-/home/site/wwwroot}"

# Get current Node.js version
CURRENT_NODE_VERSION=$(node -v)

# Install Node.js only if the current version is less than the specified version
if [[ $(echo -e "$CURRENT_NODE_VERSION\nv$NODE_VERSION" | sort -V | head -n1) != "v$NODE_VERSION" ]]; then
  echo "Install correct node version on build container"
  curl https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz -o node.tar.xz
  echo "Downloaded node"
  ls -la | grep node.tar
  tar -xvf node.tar.xz
  rm node.tar.xz
  export PATH=/tmp/zipdeploy/extracted/node-v$NODE_VERSION-linux-x64/bin/:$PATH
fi
TMP_NV=$(node --version)
TMP_NPM=$(npm --version)
echo "Node: $TMP_NV | NPM: $TMP_NPM"



echo "Syncing source code from $DEPLOYMENT_SOURCE to $DEPLOYMENT_TARGET"

# # Count of files existing in source but not target
# echo "Count of files existing in source but not target:"
# rsync -n -i -a -r --no-o --no-g --delete ./ /home/site/wwwroot | grep -c '^\.'

# # Count of files existing in target but not source
# echo "Count of files existing in target but not source:"
# rsync -n -i -a -r /home/site/wwwroot/ ./ | grep -c '^\.'

# # Count of files that are newer in source than in target
# echo "Count of files that are newer in source than in target:"

# rsync -n -i -a -r --delete ./ /home/site/wwwroot | grep -c '^>'
rsync -arv --no-o --no-g --delete --ignore-existing --size-only --exclude ".deployment" --exclude "deploy.sh" --exclude "node*" --exclude "build" ./ /home/site/wwwroot
echo "Source code sync complete"

echo "Installing packages and build admin UI"
npm install
npm run build

echo "Syncing node_modules and build directories"
rsync -arv --no-o --no-g --delete --ignore-existing --size-only --exclude ".deployment" --exclude "deploy.sh" --exclude "node-*" ./ /home/site/wwwroot
