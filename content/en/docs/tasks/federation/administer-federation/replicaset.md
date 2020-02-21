---
title: Federated ReplicaSets
content_template: templates/task
---

{{% capture overview %}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

This guide explains how to use ReplicaSets in the Federation control plane.

ReplicaSets in the federation control plane (referred to as "federated ReplicaSets" in
this guide) are very similar to the traditional [Kubernetes
ReplicaSets](/docs/concepts/workloads/controllers/replicaset/), and provide the same functionality.
Creating them in the federation control plane ensures that the desired number of
replicas exist across the registered clusters.
{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "federated-task-tutorial-prereqs.md" >}}
* You should also have a basic
[working knowledge of Kubernetes](/docs/tutorials/kubernetes-basics/) in
general and [ReplicaSets](/docs/concepts/workloads/controllers/replicaset/) in particular.
{{% /capture %}}

{{% capture steps %}}

## Creating a Federated ReplicaSet

The API for Federated ReplicaSet is 100% compatible with the
API for traditional Kubernetes ReplicaSet. You can create a ReplicaSet by sending
a request to the federation apiserver.

You can do that using [kubectl](/docs/user-guide/kubectl/) by running:

``` shell
kubectl --context=federation-cluster create -f myrs.yaml
```

The `--context=federation-cluster` flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster.

Once a federated ReplicaSet is created, the federation control plane will create
a ReplicaSet in all underlying Kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:

``` shell
kubectl --context=gce-asia-east1a get rs myrs
```

The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone.

The ReplicaSets in the underlying clusters will match the federation ReplicaSet
except in the number of replicas. The federation control plane will ensure that the
sum of the replicas in each cluster match the desired number of replicas in the
federation ReplicaSet.

### Spreading Replicas in Underlying Clusters

By default, replicas are spread equally in all the underlying clusters. For example:
if you have 3 registered clusters and you create a federated ReplicaSet with
`spec.replicas = 9`, then each ReplicaSet in the 3 clusters will have
`spec.replicas=3`.
To modify the number of replicas in each cluster, you can add an annotation with
key `federation.kubernetes.io/replica-set-preferences` to the federated ReplicaSet.
The value of the annoation is a serialized JSON that contains fields shown in
the following example:

```
{
  "rebalance": true,
  "clusters": {
    "foo": {
      "minReplicas": 10,
      "maxReplicas": 50,
      "weight": 100
    },
    "bar": {
      "minReplicas": 10,
      "maxReplicas": 100,
      "weight": 200
    }
  }
}
```

The `rebalance` boolean field specifies whether replicas already scheduled and running
may be moved in order to match current state to the specified preferences.
The `clusters` object field contains a map where users can specify the constraints
for replica placement across the clusters (`foo` and `bar` in the example).
For each cluster, you can specify the minimum number of replicas that should be
assigned to it (default is zero), the maximum number of replicas the cluster can
accept (default is unbounded) and a number expressing the relative weight of
preferences to place additional replicas to that cluster.

## Updating a Federated ReplicaSet

You can update a federated ReplicaSet as you would update a Kubernetes
ReplicaSet; however, for a federated ReplicaSet, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.
The Federation control plane ensures that whenever the federated ReplicaSet is
updated, it updates the corresponding ReplicaSet in all underlying clusters to
match it.
If your update includes a change in number of replicas, the federation
control plane will change the number of replicas in underlying clusters to
ensure that their sum remains equal to the number of desired replicas in
federated ReplicaSet.

## Deleting a Federated ReplicaSet

You can delete a federated ReplicaSet as you would delete a Kubernetes
ReplicaSet; however, for a federated ReplicaSet, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.

For example, you can do that using kubectl by running:

```shell
kubectl --context=federation-cluster delete rs myrs
```

{{< note >}}
At this point, deleting a federated ReplicaSet will not delete the corresponding ReplicaSets from underlying clusters. You must delete the underlying ReplicaSets manually. We intend to fix this in the future.
{{< /note >}}

{{% /capture %}}


