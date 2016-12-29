---
title: Federated Namespaces
---

This guide explains how to use namespaces in Federation control plane.

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
general and [Namespaces](/docs/user-guide/namespaces/) in particular.

## Overview

Namespaces in federation control plane (referred to as "federated namespaces" in
this guide) are very similar to the traditional [Kubernetes
Namespaces](/docs/user-guide/namespaces/) providing the same functionality.
Creating them in the federation control plane ensures that they are synchronized
across all the clusters in federation.


## Creating a Federated Namespace

The API for Federated Namespaces is 100% compatible with the
API for traditional Kubernetes Namespaces. You can create a namespace by sending
a request to the federation apiserver.

You can do that using kubectl by running:

``` shell
kubectl --context=federation-cluster create -f myns.yaml
```

The '--context=federation-cluster' flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster.

Once a federated namespace is created, the federation control plane will create
a matching namespace in all underlying Kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:

``` shell
kubectl --context=gce-asia-east1a get namespaces myns
```

The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone. The name and
spec of the underlying namespace will match those of
the Federated Namespace that you created above.


## Updating a Federated Namespace

You can update a federated namespace as you would update a Kubernetes
namespace, just send the request to federation apiserver instead of sending it
to a specific Kubernetes cluster.
Federation control plan will ensure that whenever the federated namespace is
updated, it updates the corresponding namespaces in all underlying clusters to
match it.

## Deleting a Federated Namespace

You can delete a federated namespace as you would delete a Kubernetes
namespace, just send the request to federation apiserver instead of sending it
to a specific Kubernetes cluster.

For example, you can do that using kubectl by running:

```shell
kubectl --context=federation-cluster delete ns myns
```

As in Kubernetes, deleting a federated namespace will delete all resources in that
namespace from the federation control plane.

Note that at this point, deleting a federated namespace will not delete the
corresponding namespaces and resources in those namespaces from underlying clusters.
Users are expected to delete them manually.
We intend to fix this in the future.
