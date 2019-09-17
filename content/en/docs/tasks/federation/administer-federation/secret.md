---
title: Federated Secrets
content_template: templates/concept
---

{{% capture overview %}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

This guide explains how to use secrets in Federation control plane.

Secrets in federation control plane (referred to as "federated secrets" in
this guide) are very similar to the traditional [Kubernetes
Secrets](/docs/concepts/configuration/secret/) providing the same functionality.
Creating them in the federation control plane ensures that they are synchronized
across all the clusters in federation.
{{% /capture %}}


{{% capture body %}}

## Prerequisites

This guide assumes that you have a running Kubernetes Cluster
Federation installation. If not, then head over to the
[federation admin guide](/docs/admin/federation/) to learn how to
bring up a cluster federation (or have your cluster administrator do
this for you). Other tutorials, for example
[this one](https://github.com/kelseyhightower/kubernetes-cluster-federation)
by Kelsey Hightower, are also available to help you.

You should also have a basic
[working knowledge of Kubernetes](/docs/tutorials/kubernetes-basics/) in
general and [Secrets](/docs/concepts/configuration/secret/) in particular.

## Creating a Federated Secret

The API for Federated Secret is 100% compatible with the
API for traditional Kubernetes Secret. You can create a secret by sending
a request to the federation apiserver.

You can do that using [kubectl](/docs/user-guide/kubectl/) by running:

``` shell
kubectl --context=federation-cluster create -f mysecret.yaml
```

The `--context=federation-cluster` flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster.

Once a federated secret is created, the federation control plane will create
a matching secret in all underlying Kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:

``` shell
kubectl --context=gce-asia-east1a get secret mysecret
```

The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone.

These secrets in underlying clusters will match the federated secret.


## Updating a Federated Secret

You can update a federated secret as you would update a Kubernetes
secret; however, for a federated secret, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.
The Federation control plane ensures that whenever the federated secret is
updated, it updates the corresponding secrets in all underlying clusters to
match it.

## Deleting a Federated Secret

You can delete a federated secret as you would delete a Kubernetes
secret; however, for a federated secret, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.

For example, you can do that using kubectl by running:

```shell
kubectl --context=federation-cluster delete secret mysecret
```

{{< note >}}
At this point, deleting a federated secret will not delete the corresponding secrets from underlying clusters. You must delete the underlying secrets manually. We intend to fix this in the future.
{{< /note >}}

{{% /capture %}}
