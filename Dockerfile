FROM node:lts-alpine AS build
WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build


FROM nginxinc/nginx-unprivileged:stable-alpine
EXPOSE 8080

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
