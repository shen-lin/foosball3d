FROM node:8

ENV environment QA
ENV host foosball.cfapps.us30.hana.ondemand.com


WORKDIR /usr/src/app/

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 443

CMD [ "npm", "run", "start" ]