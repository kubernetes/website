---
---

## Building

For each container, the build steps are the same. The examples below
are for the `show` container. Replace `show` with `backend` for the
backend container.

## Prerequisites: Get the Code and Dockerfile

The code for the show container is in Golang, you can copy it from below or get it via the link.

{% include code.html language="go" file="show/show.go" ghlink="/docs/user-guide/environment-guide/containers/show/show.go" %}

The Dockerfile is minimalistic using the `golang:onbuild` image. 

{% include code.html language="plaintext" file="backend/Dockerfile" ghlink="/docs/user-guide/environment-guide/containers/backend/Dockerfile" %}

You are now ready to build and push the container images.

## Google Container Registry ([GCR](https://cloud.google.com/tools/container-registry/))

You will need a local Docker client and the `gcloud` CLI to be able to push to GCR.

    docker build -t gcr.io/<project-name>/show .
    gcloud docker push gcr.io/<project-name>/show

## Docker Hub

You will need a local Docker client and an account on Docker Hub to push to Docker Hub.

    docker build -t <username>/show .
    docker push <username>/show

## Change Pod Definitions

Edit both `show-rc.yaml` and `backend-rc.yaml` and replace the
specified `image:` with the one that you built.
