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

cd myworry-client
pwd
echo "Installing Dependencies"
npm install
echo "Building Angular Application..."
ng build --prod --localize
echo "Building SSR..."
ng run myworry-client:server:production
echo "Applying prod settings..."

pm2 stop all

echo "Starting Server"

pm2 start index.js