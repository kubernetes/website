ARG ALPINE_VERSION=3.24

FROM docker.io/library/alpine:${ALPINE_VERSION}

ARG HUGO_VERSION
ARG TARGETARCH

RUN apk add --no-cache \
    git \
    gcompat \
    libstdc++ \
    npm \
    openssh-client \
    rsync

# Download the official Hugo extended release instead of compiling it from source.
# TARGETARCH is provided by BuildKit; apk's architecture is used as a fallback for
# other container engines.
RUN set -eux; \
    apk add --no-cache --virtual .hugo-download-deps curl; \
    architecture="${TARGETARCH:-$(apk --print-arch)}"; \
    case "${architecture}" in \
        amd64|x86_64) architecture=amd64 ;; \
        arm64|aarch64) architecture=arm64 ;; \
        *) echo "Unsupported architecture: ${architecture}" >&2; exit 1 ;; \
    esac; \
    archive="hugo_extended_${HUGO_VERSION}_linux-${architecture}.tar.gz"; \
    checksums="hugo_${HUGO_VERSION}_checksums.txt"; \
    release_url="https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}"; \
    cd /tmp; \
    curl -fsSLO "${release_url}/${archive}"; \
    curl -fsSLO "${release_url}/${checksums}"; \
    grep -F "  ${archive}" "${checksums}" | sha256sum -c -; \
    tar -xzf "${archive}" -C /usr/local/bin hugo; \
    rm -f "${archive}" "${checksums}"; \
    apk del .hugo-download-deps

RUN mkdir -p /var/hugo && \
    addgroup -Sg 1000 hugo && \
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