FROM node:24.11.1-alpine

WORKDIR /home/induel

COPY package*.json ./
COPY patches ./patches
RUN npm install

EXPOSE 5173

CMD ["npm", "run", "docker:dev"]