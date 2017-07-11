---
title: Reference Documentation
assignees:
- chenopis
---

## API Reference

* [Kubernetes API Overview](/docs/reference/api-overview/) - Overview of the API for Kubernetes.
* Kubernetes API Versions
  * [1.7](/docs/api-reference/v1.7/)
  * [1.6](/docs/api-reference/v1.6/)
  * [1.5](/docs/api-reference/v1.5/)

## API Client Libraries

To call the Kubernetes API from a programming language, you can use
[client libraries](/docs/reference/client-libraries/). Officially supported
client libraries:

- [Kubernetes Go client library](https://github.com/kubernetes/client-go/)
- [Kubernetes Python client libary](https://github.com/kubernetes-incubator/client-python)

## CLI Reference

* [kubectl](/docs/user-guide/kubectl-overview) - Main CLI tool for running commands and managing Kubernetes clusters.
    * [JSONPath](/docs/user-guide/jsonpath/) - Syntax guide for using [JSONPath expressions](http://goessner.net/articles/JsonPath/) with kubectl.
* [kubeadm](/docs/admin/kubeadm/) - CLI tool to easily provision a secure Kubernetes cluster 

## Config Reference

* [kubelet](/docs/admin/kubelet/) - The primary *node agent* that runs on each node. The kubelet takes a set of PodSpecs and ensures that the described containers are running and healthy.
* [kube-apiserver](/docs/admin/kube-apiserver/) - REST API that validates and configures data for API objects such as  pods, services, replication controllers.
* [kube-controller-manager](/docs/admin/kube-controller-manager/) - Daemon that embeds the core control loops shipped with Kubernetes.
* [kube-proxy](/docs/admin/kube-proxy/) - Can do simple TCP/UDP stream forwarding or round-robin TCP/UDP forwarding across a set of back-ends.
* [kube-scheduler](/docs/admin/kube-scheduler/) - Scheduler that manages availability, performance, and capacity.
* [federation-apiserver](/docs/admin/federation-apiserver/) - API server for federated clusters.
* [federation-controller-manager](/docs/admin/federation-controller-manager/) - Daemon that embeds the core control loops shipped with Kubernetes federation.

## Design Docs

An archive of the design docs for Kubernetes functionality. Good starting points are [Kubernetes Architecture](https://git.k8s.io/community/contributors/design-proposals/architecture.md) and [Kubernetes Design Overview](https://github.com/kubernetes/kubernetes/tree/{{page.fullversion}}/docs/design).
