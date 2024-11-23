FROM docker.io/library/debian:bookworm AS builder

LABEL maintainer="Kubernetes Authors https://github.com/kubernetes/website"
LABEL description="Image for building and serving a the Kubernetes website"

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates openssh-client curl git rsync golang make npm && \
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION} | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /var/cache/*

# Install Hugo
ARG HUGO_VERSION
RUN mkdir -p /build && \
    curl -L -o /build/hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb && \
    dpkg -i /build/hugo.deb && \
    rm -rf /build

# Create hugo user and configure Git
RUN useradd -m --user-group -u 60000 -d /var/hugo hugo && \
    chown -R hugo: /var/hugo && \
    runuser -u hugo -- git config --global --add safe.directory /src

WORKDIR /src

# Copy and install npm dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

USER hugo:hugo

EXPOSE 1313
