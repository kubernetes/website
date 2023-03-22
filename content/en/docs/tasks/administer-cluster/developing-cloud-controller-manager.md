---
reviewers:
- luxas
- thockin
- wlan0
title: Developing Cloud Controller Manager
content_type: concept
weight: 190
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.11" state="beta" >}}

{{< glossary_definition term_id="cloud-controller-manager" length="all" prepend="The cloud-controller-manager is">}}



<!-- body -->

## Background

Since cloud providers develop and release at a different pace compared to the Kubernetes project, abstracting the provider-specific code to the `cloud-controller-manager` binary allows cloud vendors to evolve independently from the core Kubernetes code.

The Kubernetes project provides skeleton cloud-controller-manager code with Go interfaces to allow you (or your cloud provider) to plug in your own implementations. This means that a cloud provider can implement a cloud-controller-manager by importing packages from Kubernetes core; each cloudprovider will register their own code by calling `cloudprovider.RegisterCloudProvider` to update a global variable of available cloud providers.

## Developing

### Out of tree

To build an out-of-tree cloud-controller-manager for your cloud:

1. Create a go package with an implementation that satisfies [cloudprovider.Interface](https://github.com/kubernetes/cloud-provider/blob/master/cloud.go).
2. Use [`main.go` in cloud-controller-manager](https://github.com/kubernetes/kubernetes/blob/master/cmd/cloud-controller-manager/main.go) from Kubernetes core as a template for your `main.go`. As mentioned above, the only difference should be the cloud package that will be imported.
3. Import your cloud package in `main.go`, ensure your package has an `init` block to run [`cloudprovider.RegisterCloudProvider`](https://github.com/kubernetes/cloud-provider/blob/master/plugins.go).

Many cloud providers publish their controller manager code as open source. If you are creating
a new cloud-controller-manager from scratch, you could take an existing out-of-tree cloud
controller manager as your starting point.

### In tree

For in-tree cloud providers, you can run the in-tree cloud controller manager as a {{< glossary_tooltip term_id="daemonset" >}} in your cluster. See [Cloud Controller Manager Administration](/docs/tasks/administer-cluster/running-cloud-controller/) for more details.


