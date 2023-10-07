# cp package.json /node_modules
# echo "copied package.json"
# npm install --prefix /node_modules


#npm install
#npm run build
node --version
npm --version
echo $DEPLOYMENT_SOURCE
echo $DEPLOYMENT_TARGET
rm -rf "$DEPLOYMENT_TARGET"
mkdir "$DEPLOYMENT_TARGET"
cp -r "$DEPLOYMENT_SOURCE"/* "$DEPLOYMENT_TARGET"
#mv node_modules/ /node_modules
