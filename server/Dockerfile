FROM node:16-alpine

WORKDIR /usr/src/app

COPY . .

COPY package* ./

RUN npm install --quiet

EXPOSE 3001

CMD ["npm", "run", "server"]