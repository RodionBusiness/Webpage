FROM node:9.5.0-stretch

LABEL maintainer="vtelyatnikov@axmit.com"

WORKDIR /home/node/app

# Install system dependencies
RUN wget -q -O \
  /tmp/libpng12.deb \
  http://mirrors.kernel.org/ubuntu/pool/main/libp/libpng/libpng12-0_1.2.54-1ubuntu1_amd64.deb \
  && dpkg -i /tmp/libpng12.deb \
  && rm /tmp/libpng12.deb

RUN apt-get update && \
  apt-get install zip -y && \
  apt-get clean && \
  zip --version

# Install npm packages
COPY package.json yarn.lock ./
RUN yarn install

# Copy sources
COPY *.json \
      *.config.js \
      .env* \
    ./
COPY src src

# Image settings
EXPOSE 8084
CMD [ "yarn", "start:docker" ]
