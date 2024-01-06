# Credit to Julien Guyomard (https://github.com/jguyomard). This Dockerfile
# is essentially based on his Dockerfile at
# https://github.com/jguyomard/docker-hugo/blob/master/Dockerfile. The most significant
# change is that the Hugo version is now an overridable argument rather than a fixed
# environment variable.

FROM docker.io/library/golang:1.20-alpine

LABEL maintainer="Luc Perkins <lperkins@linuxfoundation.org>"

RUN apk add --no-cache \
    curl \
    gcc \
    g++ \
    musl-dev \
    build-base \
    libc6-compat

ARG HUGO_VERSION

RUN mkdir $HOME/src && \
    cd $HOME/src && \
    curl -L https://github.com/gohugoio/hugo/archive/refs/tags/v${HUGO_VERSION}.tar.gz | tar -xz && \
    cd "hugo-${HUGO_VERSION}" && \
    go install --tags extended

# Fetch prebuilt PageFind binary
RUN curl -L --max-time 300 --silent -o /tmp/pagefind.tar.gz https://github.com/CloudCannon/pagefind/releases/download/v1.0.4/pagefind-v1.0.4-$(uname -m)-unknown-linux-musl.tar.gz && \
    tar zxOf /tmp/pagefind.tar.gz pagefind > /bin/pagefind && \
    chmod 0755 /bin/pagefind && \
    rm -f /tmp/pagefind.tar.gz

FROM docker.io/library/golang:1.20-alpine

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

COPY --chmod=0755 scripts/hugo_preview.sh /scripts/hugo_preview.sh

COPY --from=0 /go/bin/hugo /usr/local/bin/hugo
COPY --from=0 /bin/pagefind /usr/local/bin/pagefind

WORKDIR /src

USER hugo:hugo

EXPOSE 1313

ENTRYPOINT ["/scripts/hugo_preview.sh"]

CMD []
