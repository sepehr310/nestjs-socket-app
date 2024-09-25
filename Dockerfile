# Base image
FROM node:18-alpine

# RUN addgroup app && adduser -S -G app app

# USER app

# Create app directory
WORKDIR /app

COPY package.json .

RUN npm i --force

COPY . .

EXPOSE 3000


RUN npm run build

# # Start the server using the production build
 CMD [ "npm" , "run" , "start" ]
