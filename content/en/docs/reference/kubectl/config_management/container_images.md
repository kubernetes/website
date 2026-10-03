---
title: "Container Images"
linkTitle: "Container Images"
weight: 4
type: docs
description: >
    Dealing with Application Containers
---


{{< alert color="success" title="TL;DR" >}}
- Override or set the Name and Tag for Container Images
{{< /alert >}}

# Container Images

## Motivation

It may be useful to define the tags or digests of container images which are used across many Workloads.

Container image tags and digests are used to refer to a specific version or instance of a container
image - e.g. for the `nginx` container image you might use the tag `1.15.9` or `1.14.2`.

- Update the container image name or tag for multiple Workloads at once
- Increase visibility of the versions of container images being used within
  the project
- Set the image tag from external sources - such as environment variables
- Copy or Fork an existing Project and change the Image Tag for a container
- Change the registry used for an image

Consider the following `deployment.yaml` file,

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: the-deployment
spec:
  template:
    spec:
      containers:
      - name: mypostgresdb
        image: postgres:8
      - name: nginxapp
        image: nginx:1.7.9
      - name: myapp
        image: my-demo-app:latest
      - name: alpine-app
        image: alpine:3.7

```

the `image` tag under `containers` specified the image that has to be pulled from the container registry.


Some of things that can be done with images:
- Setting a Name
- Setting a Tag
- Setting a Digest
- Setting a Tag from the latest commit SHA
- Setting a Tag from an Environment Variable

{{% alert color="success" title="Command / Examples" %}}
Check out the [reference](/references/kustomize/kustomization/images/) for commands and examples for `images`
{{% /alert %}}