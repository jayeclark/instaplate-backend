FROM node:12-alpine

WORKDIR /app

COPY . /app

RUN yarn install --ignore-optional

RUN npm run build

CMD "npm" "run" "start"
