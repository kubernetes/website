---
---

This guide explains how to use DaemonSets in Federation control plane.

* TOC
{:toc}

## Prerequisites

This guide assumes that you have a running Kubernetes Cluster
Federation installation. If not, then head over to the
[federation admin guide](/docs/admin/federation/) to learn how to
bring up a cluster federation (or have your cluster administrator do
this for you). Other tutorials, for example
[this one](https://github.com/kelseyhightower/kubernetes-cluster-federation)
by Kelsey Hightower, are also available to help you.

You are also expected to have a basic
[working knowledge of Kubernetes](/docs/getting-started-guides/) in
general and [DaemonSets](/docs/user-guide/DaemonSets/) in particular.

## Overview

DaemonSets in federation control plane (referred to as "federated DaemonSets" in
this guide) are very similar to the traditional [Kubernetes
DaemonSets](/docs/user-guide/DaemonSets/) providing the same functionality.
Creating them in the federation control plane ensures that they are synchronized
across all the clusters in federation.


## Creating a Federated DaemonSet

The API for Federated DaemonSet is 100% compatible with the
API for traditional Kubernetes DaemonSet. You can create a DaemonSet by sending
a request to the federation apiserver.

You can do that using [kubectl](/docs/user-guide/kubectl/) by running:

``` shell
kubectl --context=federation-cluster create -f mydaemonset.yaml
```

The '--context=federation-cluster' flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a kubernetes
cluster.

Once a federated DaemonSet is created, the federation control plane will create
a matching DaemonSet in all underlying kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:

``` shell
kubectl --context=gce-asia-east1a get daemonset mydaemonset
```

The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone.

These DaemonSets in underlying clusters will match the federated DaemonSet.


## Updating a Federated DaemonSet

You can update a federated DaemonSet as you would update a Kubernetes
DaemonSet; however, for a federated DaemonSet, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.
The Federation control plan ensures that whenever the federated DaemonSet is
updated, it updates the corresponding DaemonSets in all underlying clusters to
match it.

## Deleting a Federated DaemonSet

You can delete a federated DaemonSet as you would delete a Kubernetes
DaemonSet; however, for a federated DaemonSet, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.

For example, you can do that using kubectl by running:

```shell
kubectl --context=federation-cluster delete daemonset mydaemonset
```

Note that at this point, deleting a federated DaemonSet will not delete the
corresponding DaemonSets from underlying clusters.
You must delete the underlying DaemonSets manually.
We intend to fix this in the future.
