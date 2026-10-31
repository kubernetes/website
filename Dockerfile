# Credit to Julien Guyomard (https://github.com/jguyomard). This Dockerfile
# is essentially based on his Dockerfile at
# https://github.com/jguyomard/docker-hugo/blob/master/Dockerfile. The only significant
# change is that the Hugo version is now an overridable argument rather than a fixed
# environment variable.

FROM docker.io/library/alpine@sha256:28bd5fe8b56d1bd048e5babf5b10710ebe0bae67db86916198a6eec434943f8b
ARG HUGO_VERSION
ARG TARGETARCH

RUN apk add --no-cache \
    git \
    gcompat \
    libstdc++ \
    npm \
    openssh-client \
    rsync

RUN set -euxo pipefail; \
    archive="hugo_extended_${HUGO_VERSION}_linux-${TARGETARCH}.tar.gz"; \
    checksums="hugo_${HUGO_VERSION}_checksums.txt"; \
    release_url="https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}"; \
    cd /tmp; \
    wget -q "${release_url}/${archive}" "${release_url}/${checksums}"; \
    grep -F "  ${archive}" "${checksums}" | sha256sum -c -; \
    tar -xzf "${archive}" -C /usr/local/bin hugo; \
    rm -f "${archive}" "${checksums}"

RUN addgroup -Sg 1000 hugo && \
    adduser -Sg hugo -u 1000 -h /var/hugo hugo && \
    git config --file /var/hugo/.gitconfig --add safe.directory /src && \
    chown -R hugo: /var/hugo

WORKDIR /src
COPY package.json package-lock.json ./


# Only Docsy's theme assets are needed for local previews. Ignoring install
# scripts avoids preparing Docsy's development environment (including another
# Hugo binary), while omitting optional tooling excludes Netlify CLI.
RUN npm ci --ignore-scripts --omit=optional --cache=/tmp/npm-cache && \
    rm -rf /tmp/npm-cache

USER hugo:hugo

EXPOSE 1313