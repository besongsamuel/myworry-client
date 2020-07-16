#!/bin/bash
echo  "Setting NPM Bin Path"
PATH="/home/ec2-user/.nvm/versions/node/v14.4.0/bin:$PATH"
pm2 stop all
echo "Stop nginx"
nginx -s stop
echo "Removing Myworry Server"
rm -rf myworry-client
echo "Cloning client from Git.."
git clone git@github.com:besongsamuel/myworry-client.git

cd myworry-client
pwd
echo "Installing Dependencies"
npm install
echo "Building Angular Application..."
printf 'n' | ng build --prod --localize
echo "Building SSR Server..."
ng run myworry-client:server:production
echo "Applying start Server..."
pm2 start ./ssr-pm2.json
echo 'Copy config file'
cp nginx.prod.conf /etc/nginx/nginx.conf
echo 'Start nginx'
nginx