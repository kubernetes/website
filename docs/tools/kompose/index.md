---

approvers:
- cdrage

title: Kompose Overview
---

`kompose` is a tool to help users who are familiar with `docker-compose` move to **Kubernetes**. `kompose` takes a Docker Compose file and translates it into Kubernetes resources.

`kompose` is a convenience tool to go from local Docker development to managing your application with Kubernetes. Transformation of the Docker Compose format to Kubernetes resources manifest may not be exact, but it helps tremendously when first deploying an application on Kubernetes.

## Use Case

If you have a Docker Compose `docker-compose.yml` or a Docker Distributed Application Bundle `docker-compose-bundle.dab` file, you can convert it into Kubernetes deployments and services like this:

```console
$ kompose --bundle docker-compose-bundle.dab convert
WARN[0000]: Unsupported key networks - ignoring
file "redis-svc.yaml" created
file "web-svc.yaml" created
file "web-deployment.yaml" created
file "redis-deployment.yaml" created

$ kompose -f docker-compose.yml convert
WARN[0000]: Unsupported key networks - ignoring
file "redis-svc.yaml" created
file "web-svc.yaml" created
file "web-deployment.yaml" created
file "redis-deployment.yaml" created
```

## Installation 

Grab the latest [release](https://github.com/kubernetes-incubator/kompose/releases) for your OS, untar and extract the binary.

### Linux

```sh
wget https://github.com/kubernetes-incubator/kompose/releases/download/v0.1.2/kompose_linux-amd64.tar.gz
tar -xvf kompose_linux-amd64.tar.gz --strip 1
sudo mv kompose /usr/local/bin
```
