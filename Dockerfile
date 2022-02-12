FROM node:12

WORKDIR /app

COPY . /app

RUN yarn install --ignore-optional

RUN npm run build

EXPOSE 1337

CMD "npm" "run" "start"
