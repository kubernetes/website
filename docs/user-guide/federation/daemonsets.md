---
title: Federated DaemonSet
---

This guide explains how to use DaemonSets in a federation control plane.

* TOC
{:toc}

## Prerequisites

This guide assumes that you have a running Kubernetes Cluster
Federation installation. If not, then head over to the
[federation admin guide](/docs/admin/federation/) to learn how to
bring up a cluster federation (or have your cluster administrator do
this for you). 
Other tutorials, such as Kelsey Hightower's 
[Federated Kubernetes Tutorial](https://github.com/kelseyhightower/kubernetes-cluster-federation),
might also help you create a Federated Kubernetes cluster.

You should also have a basic
[working knowledge of Kubernetes](/docs/getting-started-guides/) in
general and DaemonSets in particular.

## Overview

DaemonSets in federation control plane ("Federated Daemonsets" in
this guide) are very similar to the traditional [Kubernetes
DaemonSets](/docs/user-guide/DaemonSets/) and provide the same functionality.
Creating them in the federation control plane ensures that they are synchronized
across all the clusters in federation.


## Creating a Federated Daemonset

The API for Federated Daemonset is 100% compatible with the
API for traditional Kubernetes DaemonSet. You can create a DaemonSet by sending
a request to the federation apiserver.

You can do that using [kubectl](/docs/user-guide/kubectl/) by running:

``` shell
kubectl --context=federation-cluster create -f mydaemonset.yaml
```

The `--context=federation-cluster` flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster.

Once a Federated Daemonset is created, the federation control plane will create
a matching DaemonSet in all underlying Kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:

``` shell
kubectl --context=gce-asia-east1a get daemonset mydaemonset
```

The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone.

These DaemonSets in underlying clusters will match the Federated Daemonset.


## Updating a Federated Daemonset

You can update a Federated Daemonset as you would update a Kubernetes
DaemonSet; however, for a Federated Daemonset, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.
The federation control plane ensures that whenever the Federated Daemonset is
updated, it updates the corresponding DaemonSets in all underlying clusters to
match it.

## Deleting a Federated Daemonset

You can delete a Federated Daemonset as you would delete a Kubernetes
DaemonSet; however, for a Federated Daemonset, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.

For example, you can do that using kubectl by running:

```shell
kubectl --context=federation-cluster delete daemonset mydaemonset
```