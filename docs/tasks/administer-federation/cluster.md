---
title: Federated Cluster
redirect_from:
- "/docs/user-guide/federation/cluster/"
- "/docs/user-guide/federation/cluster.html"
---

{% capture overview %}

This guide explains how to use Clusters API resource in a Federation control plane.

Different than other Kuberentes resources, such as Deployments, Services and ConfigMaps,
clusters only exist in the federation context, i.e. those requests must be submitted to the
federation api-server.

{% endcapture %}

{% capture prerequisites %}

* {% include federated-task-tutorial-prereqs.md %}
* You should also have a basic [working knowledge of Kubernetes](/docs/setup/pick-right-solution/) in
general.

{% endcapture %}

{% capture steps %}

## Listing Clusters

To list the clusters available in your federation, you can use [kubectl](/docs/user-guide/kubectl/) by
running:

``` shell
kubectl --context=federation get clusters
```

The `--context=federation` flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster. If you submit it to a k8s cluster, you will receive an error saying
`the server doesn't have a resource type "clusters"`

If you passed the correct Federation context but received a message error saying
`No resources found.`, it means that you haven't
added any cluster to the Federation yet.

## Creating a Federated Cluster

Creating a `cluster` resource in federation means joining it to the federation. To do so, you can use
`kubefed join`. Basically, you need to give the new cluster a name and say what is the name of the
context that corresponds to a cluster that hosts the federation. The following example command adds
the cluster `gondor` to the federation running on host cluster `rivendell`:

``` shell
kubefed join gondor --host-cluster-context=rivendell
```

You can find more details on how to do that in the respective section in the
[kubefed guide](/docs/tutorials/federation/set-up-cluster-federation-kubefed/#adding-a-cluster-to-a-federation).

## Deleting a Federated Cluster

Converse to creating a cluster, deleting a cluster means unjoining this cluster from the
federation. This can be done with `kubefed unjoin` command. To remove the `gondor` cluster, just do:

``` shell
kubefed unjoin gondor --host-cluster-context=rivendell
```

You can find more details on unjoin in the
[kubefed guide](/docs/tutorials/federation/set-up-cluster-federation-kubefed/#removing-a-cluster-from-a-federation).

## Clusters API reference

The full clusters API reference is currently in `federation/v1beta1` and more details can be found in details in the
[Federation API reference page](https://kubernetes.io/docs/reference/federation/).

{% endcapture %}

{% include templates/task.md %}
