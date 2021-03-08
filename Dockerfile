FROM node:14-slim

WORKDIR /app/client

COPY ./package.json /app/client
COPY ./yarn.lock /app/client

RUN yarn install

COPY . .

EXPOSE 3000

CMD [ "yarn", "dev" ]