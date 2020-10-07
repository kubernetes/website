---
title: "Install Tools"
description: Set up Kubernetes tools on your computer.
weight: 10
no_list: true
---

## kubectl

The Kubernetes command-line tool, `kubectl`, allows you to run commands against
Kubernetes clusters. You can use `kubectl` to deploy applications, inspect and
manage cluster resources, and view logs.

See [Install and Set Up `kubectl`](/docs/tasks/tools/install-kubectl/) for
information about how to download and install `kubectl` and set it up for
accessing your cluster.

<a class="btn btn-primary" href="/docs/tasks/tools/install-kubectl/" role="button" aria-label="View kubectl Install and Set Up Guide">View kubectl Install and Set Up Guide</a>

You can also read the
[`kubectl` reference documentation](/docs/reference/kubectl/).

## minikube

[`minikube`](https://minikube.sigs.k8s.io/) is a tool that lets you run Kubernetes
locally. `minikube` runs a single-node Kubernetes cluster on your personal
computer (including Windows, macOS and Linux PCs) so that you can try out
Kubernetes, or for daily development work.

You can follow the official
[Get Started!](https://minikube.sigs.k8s.io/docs/start/) guide if your focus is
on getting the tool installed.

<a class="btn btn-primary" href="https://minikube.sigs.k8s.io/docs/start/" role="button" aria-label="View minikube Get Started! Guide">View minikube Get Started! Guide</a>

Once you have `minikube` working, you can use it to
[run a sample application](/docs/tutorials/hello-minikube/).

## kind

Like `minikube`, [`kind`](https://kind.sigs.k8s.io/docs/) lets you run Kubernetes on
your local computer. Unlike `minikube`, `kind` only works with a single container
runtime: it requires that you have [Docker](https://docs.docker.com/get-docker/)
installed and configured.

[Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/) shows you what
you need to do to get up and running with `kind`.

<a class="btn btn-primary" href="https://kind.sigs.k8s.io/docs/user/quick-start/" role="button" aria-label="View kind Quick Start Guide">View kind Quick Start Guide</a>
