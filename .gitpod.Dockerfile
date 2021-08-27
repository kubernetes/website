# Credit to Julien Guyomard (https://github.com/jguyomard). This Dockerfile
# is essentially based on his Dockerfile at
# https://github.com/jguyomard/docker-hugo/blob/master/Dockerfile. The only significant
# change is that the Hugo version is now an overridable argument rather than a fixed
# environment variable.

FROM golang:1.16.3-buster

LABEL maintainer="Luc Perkins <lperkins@linuxfoundation.org>"

RUN apt-get update && \
    apt-get install -y \
      curl \
      git \
      openssh-client \
      rsync \
      npm && \
    npm install -D autoprefixer postcss-cli && \
    rm -rf \
      /var/cache/debconf/* \
      /var/lib/apt/lists/* \
      /tmp/* \
      /var/tmp/*

ARG HUGO_VERSION=0.82.0

RUN mkdir -p /usr/local/src && \
    cd /usr/local/src && \
    curl -L https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_Linux-64bit.tar.gz | tar -xz && \
    mv hugo /usr/local/bin/hugo