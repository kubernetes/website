---
title: Learning environment
weight: 20
description: Tools to try out Kubernetes locally
no_list: true
---
<!-- overview -->

This page outlines some tools that you can use to set up a local Kubernetes cluster to try out Kubernetes concepts and features.
Before diving into setup, it's highly recommended to familiarize yourself with core Kubernetes concepts. You can find these in the [Concepts](/docs/concepts) section.


<!-- body -->

## How to communicate with a Kubernetes cluster?
When working with Kubernetes, you need a way to interact with and manage your cluster. This involves tasks such as deploying applications, inspecting resources, and debugging issues. The `kubectl` command-line tool serves as the primary interface for communicating with a configured Kubernetes cluster, allowing you to send commands and receive responses to and from the cluster's API server.

For more information including a complete list of kubectl operations, see the [`kubectl` reference documentation](/docs/reference/kubectl).

kubectl is installable on a variety of Linux platforms, macOS and Windows. Find your preferred operating system [here](/docs/tasks/tools/#kubectl).



## Options for trying out Kubernetes locally
To experiment with Kubernetes locally, you need tools that allow you to simulate a Kubernetes cluster on your machine. These tools create lightweight clusters for testing, development, or learning purposes without requiring extensive infrastructure.

### 1. kind
[`kind`](https://kind.sigs.k8s.io/) lets you run Kubernetes on your local computer. This tool requires that you have either [Docker](https://www.docker.com/) or [Podman](https://podman.io/) installed.

The kind [Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/) page shows you what you need to do to get up and running with kind.

### 2. minikube
Like `kind`, [`minikube`](https://minikube.sigs.k8s.io/) is a tool that lets you run Kubernetes locally. `minikube` runs an all-in-one or a multi-node local Kubernetes cluster on your personal computer (including Windows, macOS and Linux PCs) so that you can try out Kubernetes, or for daily development work.

You can follow the official [Get Started](https://minikube.sigs.k8s.io/docs/start/) guide to set it up.

### 3. Other 3rd party tools
There are additional tools like [MicroK8s](https://microk8s.io/docs) and [k3d](https://k3d.io/stable/) for running Kubernetes clusters locally.

### 4. Online Playground Environment
If you don’t want to install Kubernetes locally, you can use online environments to practice.

- [Killer Coda](https://killercoda.com/): Interactive Kubernetes labs for various scenarios.
- [Play With Kubernetes](https://labs.play-with-k8s.com/): Browser-based Kubernetes playground to spin up clusters on demand.


## What's next: Practice setting up a production-like cluster

While the tools above are great for learning, setting up a production-like cluster provides deeper insights into how Kubernetes operates in real-world scenarios. 

[Kubeadm]() is a tool designed to help you set up a secure and functional cluster with minimal complexity.

If you're interested in taking your learning even further, check out the [Production Environment](/docs/setup/production-environment/) page for advanced practices and considerations when preparing for real-world Kubernetes deployments.
