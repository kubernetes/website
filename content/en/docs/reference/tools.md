---
reviewers:
- janetkuo
title: Tools
content_type: concept
---

<!-- overview -->
Kubernetes contains several built-in tools to help you work with the Kubernetes system.


<!-- body -->
## Kubectl

[`kubectl`](/docs/tasks/tools/install-kubectl/) is the command line tool for Kubernetes. It controls the Kubernetes cluster manager.

## Kubeadm

[`kubeadm`](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) is the command line tool for easily provisioning a secure Kubernetes cluster on top of physical or cloud servers or virtual machines (currently in alpha).

## Minikube

[`minikube`](https://minikube.sigs.k8s.io/docs/) is a tool that helps
run a single-node Kubernetes cluster locally on your workstation for
development and testing purposes.

## Dashboard

[`Dashboard`](/docs/tasks/access-application-cluster/web-ui-dashboard/), the web-based user interface of Kubernetes, allows you to deploy containerized applications
to a Kubernetes cluster, troubleshoot them, and manage the cluster and its resources itself.

## Helm

[`Kubernetes Helm`](https://github.com/kubernetes/helm) is a tool for managing packages of pre-configured
Kubernetes resources, aka Kubernetes charts.

Use Helm to:

* Find and use popular software packaged as Kubernetes charts
* Share your own applications as Kubernetes charts
* Create reproducible builds of your Kubernetes applications
* Intelligently manage your Kubernetes manifest files
* Manage releases of Helm packages

## Kompose

[`Kompose`](https://github.com/kubernetes/kompose) is a tool to help Docker Compose users move to Kubernetes.

Use Kompose to:

* Translate a Docker Compose file into Kubernetes objects
* Go from local Docker development to managing your application via Kubernetes
* Convert v1 or v2 Docker Compose `yaml` files or [Distributed Application Bundles](https://docs.docker.com/compose/bundles/)

