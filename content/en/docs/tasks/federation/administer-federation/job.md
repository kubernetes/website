---
title: Federated Jobs
content_template: templates/task
---

{{% capture overview %}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

This guide explains how to use jobs in the federation control plane.

Jobs in the federation control plane (referred to as "federated jobs" in
this guide) are similar to the traditional [Kubernetes
jobs](/docs/concepts/workloads/controllers/job/), and provide the same functionality.
Creating jobs in the federation control plane ensures that the desired number of
parallelism and completions exist across the registered clusters.
{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "federated-task-tutorial-prereqs.md" >}}
* You should also have a basic
[working knowledge of Kubernetes](/docs/tutorials/kubernetes-basics/) in
general and [jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/) in particular.
{{% /capture %}}

{{% capture steps %}}

## Creating a federated job

The API for federated jobs is fully compatible with the
API for traditional Kubernetes jobs. You can create a job by sending
a request to the federation apiserver.

You can do that using [kubectl](/docs/user-guide/kubectl/) by running:

``` shell
kubectl --context=federation-cluster create -f myjob.yaml
```

The `--context=federation-cluster` flag tells kubectl to submit the
request to the federation API server instead of sending it to a Kubernetes
cluster.

Once a federated job is created, the federation control plane creates
a job in all underlying Kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:

``` shell
kubectl --context=gce-asia-east1a get job myjob
```

The previous example assumes that you have a context named `gce-asia-east1a`
configured in your client for your cluster in that zone.

The jobs in the underlying clusters match the federated job
except in the number of parallelism and completions. The federation control plane ensures that the
sum of the parallelism and completions in each cluster matches the desired number of parallelism and completions in the
federated job.

### Spreading job tasks in underlying clusters

By default, parallelism and completions are spread equally in all underlying clusters. For example:
if you have 3 registered clusters and you create a federated job with
`spec.parallelism = 9` and `spec.completions = 18`, then each job in the 3 clusters has
`spec.parallelism = 3` and `spec.completions = 6`.
To modify the number of parallelism and completions in each cluster, you can specify
[ReplicaAllocationPreferences](https://github.com/kubernetes/federation/blob/{{< param "githubbranch" >}}/apis/federation/types.go)
as an annotation with key `federation.kubernetes.io/job-preferences`
on the federated job.


## Updating a federated job

You can update a federated job as you would update a Kubernetes
job; however, for a federated job, you must send the request to
the federation API server instead of sending it to a specific Kubernetes cluster.
The federation control plane ensures that whenever the federated job is
updated, it updates the corresponding job in all underlying clusters to
match it.

If your update includes a change in number of parallelism and completions, the federation
control plane changes the number of parallelism and completions in underlying clusters to
ensure that their sum remains equal to the number of desired parallelism and completions in
federated job.

## Deleting a federated job

You can delete a federated job as you would delete a Kubernetes
job; however, for a federated job, you must send the request to
the federation API server instead of sending it to a specific Kubernetes cluster.

For example, with kubectl:

```shell
kubectl --context=federation-cluster delete job myjob
```

{{< note >}}
Deleting a federated job will not delete the
corresponding jobs from underlying clusters.
You must delete the underlying jobs manually.
{{< /note >}}

{{% /capture %}}


