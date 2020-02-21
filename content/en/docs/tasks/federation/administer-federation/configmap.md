---
title: Federated ConfigMap
content_template: templates/task
---

{{% capture overview %}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

This guide explains how to use ConfigMaps in a Federation control plane.

Federated ConfigMaps are very similar to the traditional [Kubernetes
ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/) and provide the same functionality.
Creating them in the federation control plane ensures that they are synchronized
across all the clusters in federation.

{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "federated-task-tutorial-prereqs.md" >}}
* You should also have a basic
[working knowledge of Kubernetes](/docs/tutorials/kubernetes-basics/) in
general and [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/) in particular.

{{% /capture %}}

{{% capture steps %}}

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

{{< note >}}
Deleting a Federated ConfigMap does not delete the corresponding ConfigMaps from underlying clusters. You must delete the underlying ConfigMaps manually.
{{< /note >}}

{{% /capture %}}


