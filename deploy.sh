#!/bin/bash
echo  "Setting NPM Bin Path"
PATH="/home/ec2-user/.nvm/versions/node/v14.4.0/bin:$PATH"
pwd
cd /home/ec2-user/
pwd
echo "Removing Myworry Server"
rm -rf myworry-client
echo "Cloning client from Git.."
git clone git@github.com:besongsamuel/myworry-client.git

cd myworry-server
pwd
echo "Installing Dependencies"
npm install
echo "Fixing Broken Dependencies..."
cp -f deploy\ files/index.js node_modules/@loopback/authentication-passport/dist/index.js
cp -f deploy\ files/index.ts node_modules/@loopback/authentication-passport/src/index.ts
echo "Applying prod settings..."
cp -f src/keys.prod.ts src/keys.ts
cp -f oauth2-providers.prod.json oauth2-providers.json
echo "Building Server"
npm run build

pm2 stop all

echo "Starting Server"

pm2 start index.js