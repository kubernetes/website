---
title: Reference
approvers:
- chenopis
linkTitle: "Reference"
main_menu: true
weight: 70
content_template: templates/concept
---

{{% capture overview %}}

This section of the Kubernetes documentation contains references.

{{% /capture %}}

{{% capture body %}}

## API Reference

* [Kubernetes API Overview](/docs/reference/using-api/api-overview/) - Overview of the API for Kubernetes.
* [Kubernetes API Reference {{< latest-version >}}](/docs/reference/generated/kubernetes-api/{{< latest-version >}}/)

## API Client Libraries

To call the Kubernetes API from a programming language, you can use
[client libraries](/docs/reference/using-api/client-libraries/). Officially supported
client libraries:

- [Kubernetes Go client library](https://github.com/kubernetes/client-go/)
- [Kubernetes Python client library](https://github.com/kubernetes-client/python)
- [Kubernetes Java client library](https://github.com/kubernetes-client/java)
- [Kubernetes JavaScript client library](https://github.com/kubernetes-client/javascript)

## CLI Reference

* [kubectl](/docs/reference/kubectl/overview/) - Main CLI tool for running commands and managing Kubernetes clusters.
    * [JSONPath](/docs/reference/kubectl/jsonpath/) - Syntax guide for using [JSONPath expressions](http://goessner.net/articles/JsonPath/) with kubectl.
* [kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm/) - CLI tool to easily provision a secure Kubernetes cluster.

## Components Reference

* [kubelet](/docs/reference/command-line-tools-reference/kubelet/) - The primary *node agent* that runs on each node. The kubelet takes a set of PodSpecs and ensures that the described containers are running and healthy.
* [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/) - REST API that validates and configures data for API objects such as  pods, services, replication controllers.
* [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/) - Daemon that embeds the core control loops shipped with Kubernetes.
* [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) - Can do simple TCP/UDP stream forwarding or round-robin TCP/UDP forwarding across a set of back-ends.
* [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/) - Scheduler that manages availability, performance, and capacity.
  * [kube-scheduler Policies](/docs/reference/scheduling/policies)
  * [kube-scheduler Profiles](/docs/reference/scheduling/profiles)

## Design Docs

An archive of the design docs for Kubernetes functionality. Good starting points are [Kubernetes Architecture](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md) and [Kubernetes Design Overview](https://git.k8s.io/community/contributors/design-proposals).

{{% /capture %}}
