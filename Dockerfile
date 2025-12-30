FROM node:24.11.1-alpine

WORKDIR /home/induel

COPY package*.json ./
RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]