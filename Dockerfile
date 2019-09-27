FROM node:10.16.3-alpine as build

WORKDIR /usr/the-dark-side-of-the-money

COPY . .

RUN npm install --production --quiet

RUN addgroup -g 101 -S app && \
  adduser -u 100 -S -G app -s /bin/false app && \
  chown -R app:app /usr/the-dark-side-of-the-money

USER app

EXPOSE 8008

ENV NODE_ENV=production

CMD [ "node", "index.js" ]
