FROM node:8

ENV environment QA


WORKDIR /usr/src/app/

RUN mkdir foosball-model
RUN mkdir foosball-gaming

WORKDIR /usr/src/app/foosball-model
COPY ./foosball-model/ ./

WORKDIR /usr/src/app/foosball-gaming
COPY ./foosball-gaming/package.json ./package.json
RUN npm install
COPY ./foosball-gaming/ ./

EXPOSE 7000

CMD [ "npm", "run", "start" ]