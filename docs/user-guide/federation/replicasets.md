---
---

This guide explains how to use replicasets in Federation control plane.


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
general and [Replicasets](/docs/user-guide/replicasets/) in particular.

## Overview

Replicasets in federation control plane (referred to as "federated replicasets" in
this guide) are very similar to the traditional [Kubernetes
Replicasets](/docs/user-guide/replicasets/) providing the same functionality.
Creating them in the federation control plane ensures that the desired number of
replicas exist across the registered clusters.


## Creating a Federated Replicaset

The API for Federated Replicaset is 100% compatible with the
API for traditional Kubernetes Replicaset. You can create a replicaset by sending
a request to the federation apiserver.

You can do that using kubectl by running:

``` shell
kubectl --context=federation-cluster create -f myrs.yaml
```

The '--context=federation-cluster' flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a kubernetes
cluster.

Once a federated replicaset is created, the federation control plane will create
a replicaset in all underlying kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:

``` shell
kubectl --context=gce-asia-east1a get rs myrs
```

The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone.

These replicasets in underlying clusters will match the federation replicaset
except in the number of replicas. Federation control plane will ensure that the
sum of replicas in each cluster match the desired number of replicas in the
federation replicaset.

### Spreading Replicas in Underlying Clusters

By default, replicas are spread equally in all the underlying clusters. For ex:
if you have 3 registered clusters and you create a federated replicaset with
`spec.replicas = 9`, then each replicaset in the 3 clusters will have
`spec.replicas=3`.
To modify the number of replicas in each cluster, you can specify
[FederatedReplicaSetPreference](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/federation/apis/federation/types.go)
as annotation with key `federation.kubernetes.io/replica-set-preferences`
on federated replicaset.


## Updating a Federated Replicaset

You can update a federated replicaset as you would update a Kubernetes
replicaset, just send the request to federation apiserver instead of sending it
to a specific kubernetes cluster.
Federation control plan will ensure that whenever the federated replicaset is
updated, it updates the corresponding replicasets in all underlying clusters to
match it.
If your update includes a change in number of replicas then the federation
control plane will change the number of replicas in underlying clusters to
ensure that their sum remains equal to the number of desired replicas in
federated replicaset.

## Deleting a Federated Replicaset

You can delete a federated replicaset as you would delete a Kubernetes
replicaset, just send the request to federation apiserver instead of sending it
to a specific kubernetes cluster.

For example, you can do that using kubectl by running:

```shell
kubectl --context=federation-cluster delete rs myrs
```

Note that at this point, deleting a federated replicaset will not delete the
corresponding replicasets from underlying clusters.
Users are expected to delete them manually.
We intend to fix this in the future.
