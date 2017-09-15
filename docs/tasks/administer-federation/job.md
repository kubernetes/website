---
title: Federated Jobs
---

{% capture overview %}
This guide explains how to use Jobs in the Federation control plane.

Jobs in the federation control plane (referred to as "federated Jobs" in
this guide) are very similar to the traditional [Kubernetes
Jobs](/docs/concepts/workloads/controllers/job/), and provide the same functionality.
Creating them in the federation control plane ensures that the desired number of
parallelism and completions exist across the registered clusters.
{% endcapture %}

{% capture prerequisites %}

* {% include federated-task-tutorial-prereqs.md %}
* You are also expected to have a basic
[working knowledge of Kubernetes](/docs/getting-started-guides/) in
general and [Jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/) in particular.
{% endcapture %}

{% capture steps %}

## Creating a Federated Jobs

The API for Federated Job is 100% compatible with the
API for traditional Kubernetes Job. You can create a Job by sending
a request to the federation apiserver.

You can do that using [kubectl](/docs/user-guide/kubectl/) by running:

``` shell
kubectl --context=federation-cluster create -f myjob.yaml
```

The '--context=federation-cluster' flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster.

Once a federated Job is created, the federation control plane will create
a Job in all underlying Kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:

``` shell
kubectl --context=gce-asia-east1a get job myjob
```

The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone.

The Jobs in the underlying clusters will match the federation Job
except in the number of parallelism and completions. The federation control plane will ensure that the
sum of the parallelism and completions in each cluster match the desired number of parallelism and completions in the
federation Job.

### Spreading Job tasks in Underlying Clusters

By default, parallelism and completions are spread equally in all the underlying clusters. For example:
if you have 3 registered clusters and you create a federated Job with
`spec.parallelism = 9` and `spec.completions = 18`, then each Job in the 3 clusters will have
`spec.parallelism = 3` and `spec.completions = 6`.
To modify the number of parallelism and completions in each cluster, you can specify
[ReplicaAllocationPreferences](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/federation/apis/federation/types.go)
as an annotation with key `federation.kubernetes.io/job-preferences`
on the federated Job.


## Updating a Federated Job

You can update a federated Job as you would update a Kubernetes
Job; however, for a federated Job, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.
The Federation control plane ensures that whenever the federated Job is
updated, it updates the corresponding Job in all underlying clusters to
match it.
If your update includes a change in number of parallelism and completions, the federation
control plane will change the number of parallelism and completions in underlying clusters to
ensure that their sum remains equal to the number of desired parallelism and completions in
federated Job.

## Deleting a Federated Job

You can delete a federated Job as you would delete a Kubernetes
Job; however, for a federated Job, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.

For example, you can do that using kubectl by running:

```shell
kubectl --context=federation-cluster delete job myjob
```

Note that at this point, deleting a federated Job will not delete the
corresponding Jobs from underlying clusters.
You must delete the underlying Jobs manually.
We intend to fix this in the future.

{% endcapture %}

{% include templates/task.md %}
