---
title: Federated DaemonSet
content_template: templates/task
---

{{% capture overview %}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

This guide explains how to use DaemonSets in a federation control plane.

DaemonSets in the federation control plane ("Federated Daemonsets" in
this guide) are very similar to the traditional Kubernetes
[DaemonSets](/docs/concepts/workloads/controllers/daemonset/) and provide the same functionality.
Creating them in the federation control plane ensures that they are synchronized
across all the clusters in federation.
{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "federated-task-tutorial-prereqs.md" >}}
* You are also expected to have a basic
[working knowledge of Kubernetes](/docs/setup/) in
general and [DaemonSets](/docs/concepts/workloads/controllers/daemonset/) in particular.

{{% /capture %}}

{{% capture steps %}}

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

{{% /capture %}}


