---
title: Federated Namespaces
content_template: templates/task
---

{{% capture overview %}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

This guide explains how to use Namespaces in Federation control plane.

Namespaces in federation control plane (referred to as "federated Namespaces" in
this guide) are very similar to the traditional [Kubernetes
Namespaces](/docs/concepts/overview/working-with-objects/namespaces/) providing the same functionality.
Creating them in the federation control plane ensures that they are synchronized
across all the clusters in federation.
{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "federated-task-tutorial-prereqs.md" >}}
* You are also expected to have a basic
[working knowledge of Kubernetes](/docs/setup/) in
general and [Namespaces](/docs/concepts/overview/working-with-objects/namespaces/) in particular.

{{% /capture %}}

{{% capture steps %}}

## Creating a Federated Namespace

The API for Federated Namespaces is 100% compatible with the
API for traditional Kubernetes Namespaces. You can create a Namespace by sending
a request to the federation apiserver.

You can do that using kubectl by running:

``` shell
kubectl --context=federation-cluster create -f myns.yaml
```

The `--context=federation-cluster` flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster.

Once a federated Namespace is created, the federation control plane will create
a matching Namespace in all underlying Kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:

``` shell
kubectl --context=gce-asia-east1a get namespaces myns
```

The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone. The name and
spec of the underlying Namespace will match those of
the Federated Namespace that you created above.


## Updating a Federated Namespace

You can update a federated Namespace as you would update a Kubernetes
Namespace, just send the request to federation apiserver instead of sending it
to a specific Kubernetes cluster.
Federation control plane will ensure that whenever the federated Namespace is
updated, it updates the corresponding Namespaces in all underlying clusters to
match it.

## Deleting a Federated Namespace

You can delete a federated Namespace as you would delete a Kubernetes
Namespace, just send the request to federation apiserver instead of sending it
to a specific Kubernetes cluster.

For example, you can do that using kubectl by running:

```shell
kubectl --context=federation-cluster delete ns myns
```

As in Kubernetes, deleting a federated Namespace will delete all resources in that
Namespace from the federation control plane.

{{< note >}}
At this point, deleting a federated Namespace will not delete the corresponding Namespace, or resources in those Namespaces, from underlying clusters. Users must delete them manually. We intend to fix this in the future.
{{< /note >}}

{{% /capture %}}


