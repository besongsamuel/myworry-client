#!/bin/bash
echo  "Setting NPM Bin Path"
PATH="/usr/local/bin/:$PATH"
pm2 stop all
echo "Stop nginx"
nginx -s stop
# echo "Removing Myworry Server"
# rm -rf myworry-client
# echo "Cloning client from Git.."
# git clone git@github.com:besongsamuel/myworry-client.git

# cd myworry-client
# pwd
# echo "Installing Dependencies"
# npm install
echo "Building Angular Application..."
printf 'n' | ng build --localize
echo "Building SSR Server..."
ng run myworry-client:server:production
echo "Applying start Server..."
pm2 start ./ssr-pm2.json
echo 'Copy config file'
cp nginx.dev.conf /usr/local/etc/nginx/nginx.conf
echo 'Start nginx'
nginx