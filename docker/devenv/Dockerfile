FROM ubuntu:22.04
MAINTAINER Kaleidos hello@kaleidos.net
ARG DEBIAN_FRONTEND=noninteractive

ENV LANG=en_US.UTF-8
ENV LC_ALL=en_US.UTF-8
ENV NODE_VERSION=v18.16.1

# Install dependencies
RUN apt-get update
RUN apt-get install -y -qq curl python3 git python3-venv python3-dev locales tmux bash npm

# Configure locales
RUN echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen
RUN locale-gen
RUN rm -rf /var/lib/apt/lists/*

ENV PATH="/usr/local/nodejs/bin:$PATH"

# Install node
RUN set -eux; \
    ARCH="$(dpkg --print-architecture)"; \
    case "${ARCH}" in \
       aarch64|arm64) \
         BINARY_URL="https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-linux-arm64.tar.xz"; \
         ;; \
       amd64|x86_64) \
         BINARY_URL="https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-linux-x64.tar.xz"; \
         ;; \
       *) \
         echo "Unsupported arch: ${ARCH}"; \
         exit 1; \
         ;; \
    esac; \
    curl -LfsSo /tmp/nodejs.tar.xz ${BINARY_URL}; \
    mkdir -p /usr/local/nodejs; \
    cd /usr/local/nodejs; \
    tar -xf /tmp/nodejs.tar.xz --strip-components=1; \
    chown -R root /usr/local/nodejs; \
    /usr/local/nodejs/bin/npm install -g yarn; \
    rm -rf /tmp/nodejs.tar.xz;

WORKDIR /home
COPY tmux.conf /root/.tmux.conf
COPY start-tmux.sh /root/start-tmux.sh
