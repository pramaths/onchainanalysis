FROM node:18-alpine

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

RUN npm test

EXPOSE 8000

CMD ["npm", "start"]