# Use Ubuntu as the base image
FROM ubuntu:20.04

WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# copy go & brodocs
COPY --from=golang:latest /usr/local/go /usr/local/go
COPY --from=gauravpadam/brodocs:latest / /app/brodocs


# Install necessary packages and dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3.7 \
    python3-pip \
    git \
    sudo \
    make \
    gcc \
    && apt install --reinstall build-essential -y

# Upgrade pip and install PyYAML
RUN pip3 install --upgrade pip
RUN pip3 install pyyaml

# Set the GOPATH & NODEPATH environment variable

ENV PATH="/usr/local/go/bin:${PATH}"
ENV PATH="/app/brodocs/usr/local/bin:${PATH}"

