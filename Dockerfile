# Credit to Julien Guyomard (https://github.com/jguyomard). This Dockerfile
# was previously based on his Dockerfile at
# https://github.com/jguyomard/docker-hugo/blob/master/Dockerfile.

LABEL maintainer="Luc Perkins <lperkins@linuxfoundation.org>"

FROM docker.io/library/debian:bookworm AS builder

RUN apt-get update && apt-get install -y \
  --no-install-recommends \
    ca-certificates \
    git \
    curl \
    golang \
    openssh-client \
    rsync \
    nodejs

ARG HUGO_VERSION
RUN mkdir /build && curl -L -o /build/hugo_extended_${HUGO_VERSION}_linux-amd64.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb && apt-get install -y /build/hugo_extended_${HUGO_VERSION}_linux-amd64.deb && rm -rf /build

RUN apt-get update && apt-get install -y \
  --no-install-recommends \
    npm

RUN rm -rf /var/cache/* # partial cleanup

WORKDIR /opt/npm
RUN npm install -D -g autoprefixer postcss-cli google/docsy#semver:0.11.0

RUN useradd -m --user-group -u 60000 -d /var/hugo hugo && \
    chown -R hugo: /var/hugo && \
    runuser -u hugo -- git config --global --add safe.directory /src

WORKDIR /src

USER hugo:hugo

EXPOSE 1313
