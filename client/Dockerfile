FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 3000

RUN npm run build

CMD [ "npm", "start" ]

# FROM node:16-alpine AS builder

# WORKDIR /app

# COPY package*.json ./

# RUN npm install 

# COPY . .

# EXPOSE 3000

# RUN npm run build


# FROM nginx:1.22.0-alpine

# COPY --from=builder /app/build /usr/share/nginx/html

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]