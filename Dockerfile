FROM node:12.18.1
ENV NODE_ENV=production

WORKDIR /web

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]
