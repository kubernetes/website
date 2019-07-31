---
reviewers:
- janetkuo
title: Tools
content_template: templates/concept
---

{{% capture overview %}}
Kubernetes contains several built-in tools to help you work with the Kubernetes system.
{{% /capture %}}

{{% capture body %}}
## Kubectl

[`kubectl`](/docs/tasks/tools/install-kubectl/) is the command line tool for Kubernetes. It controls the Kubernetes cluster manager.

## Kubeadm

[`kubeadm`](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) is the command line tool for easily provisioning a secure Kubernetes cluster on top of physical or cloud servers or virtual machines (currently in alpha).

## Kubefed

[`kubefed`](/docs/tasks/federation/set-up-cluster-federation-kubefed/) is the command line tool
to help you administrate your federated clusters.

## Minikube

[`minikube`](/docs/tasks/tools/install-minikube/) is a tool that makes it
easy to run a single-node Kubernetes cluster locally on your workstation for
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

[`Kompose`](https://github.com/kubernetes-incubator/kompose) is a tool to help Docker Compose users move to Kubernetes.

Use Kompose to:

* Translate a Docker Compose file into Kubernetes objects
* Go from local Docker development to managing your application via Kubernetes
* Convert v1 or v2 Docker Compose `yaml` files or [Distributed Application Bundles](https://docs.docker.com/compose/bundles/)
{{% /capture %}}
