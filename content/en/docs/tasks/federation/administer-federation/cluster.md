---
title: Federated Cluster
content_template: templates/task
---

{{% capture overview %}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

This guide explains how to use Clusters API resource in a Federation control plane.

Different than other Kubernetes resources, such as Deployments, Services and ConfigMaps,
clusters only exist in the federation context, i.e. those requests must be submitted to the
federation api-server.

{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "federated-task-tutorial-prereqs.md" >}}
* You should also have a basic [working knowledge of Kubernetes](/docs/setup/) in
general.

{{% /capture %}}

{{% capture steps %}}

## Listing Clusters

To list the clusters available in your federation, you can use [kubectl](/docs/user-guide/kubectl/) by
running:

``` shell
kubectl --context=federation get clusters
```

The `--context=federation` flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster. If you submit it to a k8s cluster, you will receive an error saying

```the server doesn't have a resource type "clusters"```

If you passed the correct Federation context but received a message error saying

```No resources found.```

it means that you haven't
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

## Labeling Clusters

You can label clusters the same way as any other Kubernetes object, which can help with grouping clusters and can also be leveraged by the ClusterSelector.

``` shell
kubectl --context=rivendell label cluster gondor key1=value1 key2=value2
```

## ClusterSelector Annotation

Starting in Kubernetes 1.7, there is alpha support for directing objects across the federated clusters with the annotation `federation.alpha.kubernetes.io/cluster-selector`. The *ClusterSelector* is conceptually similar to `nodeSelector`, but instead of selecting against labels on nodes, it selects against labels on federated clusters.

The annotation value must be JSON formatted and must be parsable into the [ClusterSelector API type](/docs/reference/federation/v1beta1/definitions/#_v1beta1_clusterselector). For example: `[{"key": "load", "operator": "Lt", "values": ["10"]}]`. Content that doesn't parse correctly will throw an error and prevent distribution of the object to any federated clusters. Objects of type ConfigMap, Secret, Daemonset, Service and Ingress are included in the alpha implementation.

Here is an example ClusterSelector annotation, which will only select clusters WITH the label `pci=true` and WITHOUT the label `environment=test`:

``` yaml
  metadata:
    annotations:
      federation.alpha.kubernetes.io/cluster-selector: '[{"key": "pci", "operator":
        "In", "values": ["true"]}, {"key": "environment", "operator": "NotIn", "values":
        ["test"]}]'
```

The *key* is matched against label names on the federated clusters.

The *values* are matched against the label values on the federated clusters.

The possible *operators* are: `In`, `NotIn`, `Exists`, `DoesNotExist`, `Gt`, `Lt`.

The *values* field is expected to be empty when `Exists` or `DoesNotExist` is specified and may include more than one string when `In` or `NotIn` are used.

Currently, only integers are supported with `Gt` or `Lt`.

## Clusters API reference

The full clusters API reference is currently in `federation/v1beta1` and more details can be found in the
[Federation API reference page](/docs/reference/federation/).

{{% /capture %}}


