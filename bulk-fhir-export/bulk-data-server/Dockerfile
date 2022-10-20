FROM node:16-alpine

RUN apk add git

WORKDIR /bulk-data/app
RUN git clone "https://github.com/smart-on-fhir/bulk-data-server.git"

RUN apk add python3 make g++

WORKDIR /bulk-data/app/bulk-data-server
RUN npm i
CMD [ "npm", "start" ]