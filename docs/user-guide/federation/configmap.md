---
title: Federated ConfigMap
---

This guide explains how to use ConfigMaps in a Federation control plane.

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
general and [ConfigMaps](/docs/user-guide/ConfigMaps/) in particular.

## Overview

Federated ConfigMaps are very similar to the traditional [Kubernetes
ConfigMaps](/docs/user-guide/configmap/) and provide the same functionality.
Creating them in the federation control plane ensures that they are synchronized
across all the clusters in federation.


## Creating a Federated ConfigMap

The API for Federated ConfigMap is 100% compatible with the
API for traditional Kubernetes ConfigMap. You can create a ConfigMap by sending
a request to the federation apiserver.

You can do that using [kubectl](/docs/user-guide/kubectl/) by running:

``` shell
kubectl --context=federation-cluster create -f myconfigmap.yaml
```

The `--context=federation-cluster` flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster.

Once a Federated ConfigMap is created, the federation control plane will create
a matching ConfigMap in all underlying Kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:

``` shell
kubectl --context=gce-asia-east1a get configmap myconfigmap
```

The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone.

These ConfigMaps in underlying clusters will match the Federated ConfigMap.


## Updating a Federated ConfigMap

You can update a Federated ConfigMap as you would update a Kubernetes
ConfigMap; however, for a Federated ConfigMap, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.
The federation control plane ensures that whenever the Federated ConfigMap is
updated, it updates the corresponding ConfigMaps in all underlying clusters to
match it.

## Deleting a Federated ConfigMap

You can delete a Federated ConfigMap as you would delete a Kubernetes
ConfigMap; however, for a Federated ConfigMap, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.

For example, you can do that using kubectl by running:

```shell
kubectl --context=federation-cluster delete configmap 
```

Note that at this point, deleting a Federated ConfigMap will not delete the
corresponding ConfigMaps from underlying clusters.
You must delete the underlying ConfigMaps manually.
We intend to fix this in the future.
