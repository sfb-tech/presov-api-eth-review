FROM node:10-jessie

RUN mkdir -p /usr/src/
WORKDIR /usr/src
RUN mkdir -p /usr/src/app

# COPY dependency files for better caching
WORKDIR /usr/src/app
COPY ./yarn.lock /usr/src/app/
COPY ./package.json /usr/src/app/
RUN yarn install

COPY . /usr/src/app
ENV NODE_ENV production
ENV PORT 8080 
ENV ENABLE_DB_LOG local

EXPOSE 8080

CMD ["node", "server.js"]