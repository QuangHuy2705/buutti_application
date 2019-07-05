FROM node:10 
WORKDIR /app
COPY . /app
RUN npm install
ENTRYPOINT ["npm","run","start"]