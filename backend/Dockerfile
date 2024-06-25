FROM node:22

WORKDIR /home/OpinioNet/backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000
CMD ["npm", "start"]
