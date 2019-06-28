---
title: Federated Deployment
content_template: templates/task
---

{{% capture overview %}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

This guide explains how to use Deployments in the Federation control plane.

Deployments in the federation control plane (referred to as "Federated Deployments" in
this guide) are very similar to the traditional [Kubernetes
Deployment](/docs/concepts/workloads/controllers/deployment/) and provide the same functionality.
Creating them in the federation control plane ensures that the desired number of
replicas exist across the registered clusters.

{{< feature-state for_k8s_version="1.5" state="alpha" >}}

Some features
(such as full rollout compatibility) are still in development.
{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "federated-task-tutorial-prereqs.md" >}}
* You should also have a basic
[working knowledge of Kubernetes](/docs/tutorials/kubernetes-basics/) in
general and [Deployments](/docs/concepts/workloads/controllers/deployment/) in particular.

{{% /capture %}}

{{% capture steps %}}
## Creating a Federated Deployment

The API for Federated Deployment is compatible with the
API for traditional Kubernetes Deployment. You can create a Deployment by sending
a request to the federation apiserver.

You can do that using [kubectl](/docs/user-guide/kubectl/) by running:

``` shell
kubectl --context=federation-cluster create -f mydeployment.yaml
```

The `--context=federation-cluster` flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster.

Once a Federated Deployment is created, the federation control plane will create
a Deployment in all underlying Kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:

``` shell
kubectl --context=gce-asia-east1a get deployment mydep
```

The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone.

These Deployments in underlying clusters will match the federation Deployment
_except_ in the number of replicas and revision-related annotations.
Federation control plane ensures that the
sum of replicas in each cluster combined matches the desired number of replicas in the
Federated Deployment.

### Spreading Replicas in Underlying Clusters

By default, replicas are spread equally in all the underlying clusters. For example:
if you have 3 registered clusters and you create a Federated Deployment with
`spec.replicas = 9`, then each Deployment in the 3 clusters will have
`spec.replicas=3`.
To modify the number of replicas in each cluster, you can specify
[FederatedReplicaSetPreference](https://github.com/kubernetes/federation/blob/{{< param "githubbranch" >}}/apis/federation/types.go)
as an annotation with key `federation.kubernetes.io/deployment-preferences`
on Federated Deployment.


## Updating a Federated Deployment

You can update a Federated Deployment as you would update a Kubernetes
Deployment; however, for a Federated Deployment, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.
The federation control plane ensures that whenever the Federated Deployment is
updated, it updates the corresponding Deployments in all underlying clusters to
match it. So if the rolling update strategy was chosen then the underlying
cluster will do the rolling update independently and `maxSurge` and `maxUnavailable`
will apply only to individual clusters. This behavior may change in the future.

If your update includes a change in number of replicas, the federation
control plane will change the number of replicas in underlying clusters to
ensure that their sum remains equal to the number of desired replicas in
Federated Deployment.

## Deleting a Federated Deployment

You can delete a Federated Deployment as you would delete a Kubernetes
Deployment; however, for a Federated Deployment, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.

For example, you can do that using kubectl by running:

```shell
kubectl --context=federation-cluster delete deployment mydep
```

{{% /capture %}}


