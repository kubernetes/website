---
assignees:
- janetkuo
title: Tools
---

Kubernetes contains several built-in tools to help you work with the Kubernetes system, and also supports third-party tooling.

#### Native Tools

Kubernetes contains the following built-in tools:

##### Kubectl 

[`kubectl`](/docs/user-guide/kubectl/) is the command line tool for Kubernetes. It controls the Kubernetes cluster manager.

##### Kubefed

[`kubefed`](/docs/admin/federation/kubefed/) is the command line tool
to help you administrate your federated clusters.

##### Dashboard 

[Dashboard](/docs/user-guide/ui/), the web-based user interface of Kubernetes, allows you to deploy containerized applications
to a Kubernetes cluster, troubleshoot them, and manage the cluster and its resources itself. 

#### Third-Party Tools

Kubernetes supports various third-party tools. These include, but are not limited to:

##### Helm

[Kubernetes Helm](https://github.com/kubernetes/helm) is a tool for managing packages of pre-configured
Kubernetes resources, aka Kubernetes charts.

Use Helm to: 

* Find and use popular software packaged as Kubernetes charts
* Share your own applications as Kubernetes charts
* Create reproducible builds of your Kubernetes applications
* Intelligently manage your Kubernetes manifest files
* Manage releases of Helm packages

##### Kompose 

[Kompose](https://github.com/kubernetes-incubator/kompose) is a tool to help users familiar with Docker Compose
move to Kubernetes. 

Use Kompose to:

* Translate a Docker Compose file into Kubernetes objects
* Go from local Docker development to managing your application via Kubernetes
* Convert v1 or v2 Docker Compose `yaml` files or [Distributed Application Bundles](https://docs.docker.com/compose/bundles/)
