# Myworry Client

MyMorry Client is the Front End application for the MyWorry Project. It is powered on the backend my the MyWorry Server. It is built using Angular 9 using the Material Design. 

## How to get started

1. Download the Git Repository and go into it
2. Run npm install to install all dependencies
3. Because some of the components require https, it is necessary to have serve this application over https. To do so, you will need to generate a certificate and a private key. To do so, run the following `openssl req -newkey rsa:2048 -x509 -nodes -keyout myworry.key -new -out myworry.crt -sha256 -days 365`. This will generate a file called myworry.key and myworry.crt. 
4. Place the files generated on the same directory where the git repository was downloaded 
5. Install or Trust the myworry.crt on your computer's CA. 
6. From the repository directory, run `npm run start` and navigate to `https://localhost:4200`

This will start a server that runs the web application on port 4200 and watches for changes. 
