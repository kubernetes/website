# Credit to Julien Guyomard (https://github.com/jguyomard). This Dockerfile
# is essentially based on his Dockerfile at
# https://github.com/jguyomard/docker-hugo/blob/master/Dockerfile. The only significant
# change is that the Hugo version is now an overridable argument rather than a fixed
# environment variable.

FROM golang:1.18-alpine

LABEL maintainer="Luc Perkins <lperkins@linuxfoundation.org>"

RUN apk add --no-cache \
    curl \
    gcc \
    g++ \
    musl-dev \
    build-base \
    libc6-compat

ARG HUGO_VERSION=0.103.1

RUN mkdir $HOME/src
COPY [hugo-0.103.1.tar.gz, $HOME/src/]

RUN cd $HOME/src/ \
    tar -xz ./hugo-0.103.1.tar.gz \
    go install --tags extended

FROM golang:1.18-alpine
RUN  go env -w GOPROXY=https://goproxy.cn,direct
RUN apk add --no-cache \
    runuser \
    git \
    openssh-client \
    rsync \
    npm && \
    npm install -D autoprefixer postcss-cli

RUN mkdir -p /var/hugo && \
    addgroup -Sg 1000 hugo && \
    adduser -Sg hugo -u 1000 -h /var/hugo hugo && \
    chown -R hugo: /var/hugo && \
    runuser -u hugo -- git config --global --add safe.directory /src

#COPY --from=0 /go/bin/hugo /usr/local/bin/hugo

WORKDIR /src

USER hugo:hugo

EXPOSE 1313
