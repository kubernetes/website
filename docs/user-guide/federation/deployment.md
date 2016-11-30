---
---

This guide explains how to use Deployments in the Federation control plane.

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
general and [ReplicaSets](/docs/user-guide/replicasets/) in particular.

## Overview

Deployments in federation control plane (referred to as "federated Deployments" in
this guide) are very similar to the traditional [Kubernetes
ReplicaSets](/docs/user-guide/replicasets/), and provide the same functionality.
Creating them in the federation control plane ensures that the desired number of
replicas exist across the registered clusters.

** Federated Deployment is currently in ALPHA, which means that the core functionality
works but there are features, like full rollout compatiblity, that are not there yet. **

## Creating a Federated Deployment

The API for Federated Deployment is compatible with the
API for traditional Kubernetes Deployment. You can create a Deployment by sending
a request to the federation apiserver.

You can do that using [kubectl](/docs/user-guide/kubectl/) by running:

``` shell
kubectl --context=federation-cluster create -f mydeployment.yaml
```

The '--context=federation-cluster' flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a kubernetes
cluster.

Once a federated Deployment is created, the federation control plane will create
a Deployment in all underlying kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:

``` shell
kubectl --context=gce-asia-east1a get deployment mydep
```

The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone.

These Deployments in underlying clusters will match the federation Deployment
except in the number of replicas. Federation control plane will ensure that the
sum of replicas in each cluster match the desired number of replicas in the
federation Deployment. 

### Spreading Replicas in Underlying Clusters

By default, replicas are spread equally in all the underlying clusters. For ex:
if you have 3 registered clusters and you create a federated Deployment with
`spec.replicas = 9`, then each Deployment in the 3 clusters will have
`spec.replicas=3`.
To modify the number of replicas in each cluster, you can specify
[FederatedReplicaSetPreference](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/federation/apis/federation/types.go)
as an annotation with key `federation.kubernetes.io/replica-set-preferences`
on federated Deployment.


## Updating a Federated Deployment

You can update a federated Deployment as you would update a Kubernetes
Deployment; however, for a federated Deployment, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.
The Federation control plan ensures that whenever the federated Deployment is
updated, it updates the corresponding Deployments in all underlying clusters to
match it. So if the rolling update strategy was chosen then the underlying 
cluster will do the rolling update independently and `maxSurge` and `maxUnavailable`
will apply only to individual clusters. This behavior may change in the future.

If your update includes a change in number of replicas, the federation
control plane will change the number of replicas in underlying clusters to
ensure that their sum remains equal to the number of desired replicas in
federated Deployment.

## Deleting a Federated Deployment

You can delete a federated Deployment as you would delete a Kubernetes
Deployment; however, for a federated Deployment, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.

For example, you can do that using kubectl by running:

```shell
kubectl --context=federation-cluster delete deployment mydep
```

Note that at this point, deleting a federated Deployment will not delete the
corresponding Deployments from underlying clusters.
You must delete the underlying Deployments manually.
We intend to fix this in the future.
