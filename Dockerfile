# Credit to Julien Guyomard (https://github.com/jguyomard)

FROM alpine:latest

MAINTAINER Luc Perkins <lperkins@linuxfoundation.org>

RUN apk add --no-cache \
    curl \
    git \
    openssh-client \
    rsync

ARG HUGO_VERSION=

RUN mkdir -p /usr/local/src && \
    cd /usr/local/src && \
    curl -L https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_linux-64bit.tar.gz | tar -xz && \
    mv hugo /usr/local/bin/hugo && \
    curl -L https://bin.equinox.io/c/dhgbqpS8Bvy/minify-stable-linux-amd64.tgz | tar -xz && \
    mv minify /usr/local/bin && \
    addgroup -Sg 1000 hugo && \
    adduser -Sg hugo -u 1000 -h /src hugo

WORKDIR /src

EXPOSE 1313
