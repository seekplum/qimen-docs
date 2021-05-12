FROM python:3.8-slim as download-stage
WORKDIR /
ARG QIMEN_DOWNLOAD_TOKEN
ARG QIMEN_DOWNLOAD_COOKIE
ARG QIMEN_DOWNLOAD_ONLY_ONLINE_DOC
ENV QIMEN_DOWNLOAD_TOKEN=$QIMEN_DOWNLOAD_TOKEN
ENV QIMEN_DOWNLOAD_COOKIE=$QIMEN_DOWNLOAD_COOKIE
ENV QIMEN_DOWNLOAD_ONLY_ONLINE_DOC=$QIMEN_DOWNLOAD_ONLY_ONLINE_DOC
COPY ./deploy/download.py .
RUN python download.py

FROM node:12-alpine as build-stage
WORKDIR /code
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
RUN yarn config set registry https://registry.npm.taobao.org \
    && yarn config set cache-folder /root/.yarn_cache \
    && yarn install --ignore-optional --no-emoji --no-progress --non-interactive
COPY . ./
COPY --from=download-stage /public/data ./public/data
RUN rm -rf ./build/* && npm run build

FROM caddy:2.1.1
COPY --from=build-stage /code/build /usr/share/caddy/docs
COPY ./deploy/Caddyfile /etc/caddy/Caddyfile
