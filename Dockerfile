### STAGE 1: Build ###
FROM node AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build:localize
RUN npm run build:ssr

### STAGE 2: Run ###
FROM nginx
RUN npm install pm2 -g
COPY nginx.prod.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/ /usr/share/nginx/html/
COPY ../myworry.key ../myworry.crt /usr/share/nginx/html/

