FROM mcr.microsoft.com/azure-functions/node:2.0-node10

WORKDIR /azure-sample
COPY package*.json /azure-sample/
RUN npm install

ADD ./ /azure-sample

CMD npm run test:e2e