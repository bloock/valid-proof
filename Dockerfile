FROM node:14-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM nginx:1.21-alpine AS server

WORKDIR /usr/share/nginx/html

RUN apk add --no-cache bash

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder ./app/build /usr/share/nginx/html

EXPOSE 80
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]