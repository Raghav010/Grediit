FROM node:16-alpine

RUN apk add python3 make g++

RUN mkdir -p /node/app
RUN chown node /node/app
USER node
WORKDIR /node/app

COPY --chown=node:node package*.json
RUN npm ci
COPY --chown=node:node . .

EXPOSE 3000
ENTRYPOINT ["npm", "start"]