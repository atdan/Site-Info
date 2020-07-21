FROM node:12

RUN mkdir -p /home/node/docker-app/node_modules && chown -R node:node /home/node/docker-app
WORKDIR /home/node/docker-app

COPY package*.json ./

RUN npm install

#USER root

COPY --chown=node:node . .

EXPOSE 3050

CMD ["node", "./app/bin/www.js"]
