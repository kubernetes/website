---
title: 联邦 Job
cn-approvers:
- pigletfly
---
<!--
---
title: Federated Jobs
---
-->

{% capture overview %}

<!--
This guide explains how to use jobs in the federation control plane.

Jobs in the federation control plane (referred to as "federated jobs" in
this guide) are similar to the traditional [Kubernetes
jobs](/docs/concepts/workloads/controllers/job/), and provide the same functionality.
Creating jobs in the federation control plane ensures that the desired number of
parallelism and completions exist across the registered clusters.
-->
本指南阐述了如何在联邦控制平面中使用 job 。

在联邦控制平面中的 Job (在本指南中称为"联邦 job") 和传统的 [Kubernetes Job](/docs/concepts/workloads/controllers/job/)很相似，提供了一样的功能。在联邦控制平面中创建联邦 job 可以确保在所有注册的集群中 job 的并行和完成数量和预期的一致。

{% endcapture %}

{% capture prerequisites %}

* {% include federated-task-tutorial-prereqs.md %}
* You are also expected to have a basic
[working knowledge of Kubernetes](/docs/setup/) in
general and [jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/) in particular.
{% endcapture %}

{% capture steps %}

<!--
## Creating a federated job

The API for federated jobs is fully compatible with the
API for traditional Kubernetes jobs. You can create a job by sending
a request to the federation apiserver.
-->
## 创建联邦 job

联邦 job 的 API 和传统的 Kubernetes job API 是完全兼容的。您可以通过请求联邦 apiserver 来创建一个联邦 job。

<!--
You can do that using [kubectl](/docs/user-guide/kubectl/) by running:
-->
您可以通过使用 [kubectl](/docs/user-guide/kubectl/) 运行下面的指令来创建联邦 job：

``` shell
kubectl --context=federation-cluster create -f myjob.yaml
```
<!--
The '--context=federation-cluster' flag tells kubectl to submit the
request to the federation API server instead of sending it to a Kubernetes
cluster.-->

`--context=federation-cluster` 参数告诉 kubectl 发送请求到联邦 apiserver 而不是某个 Kubernetes 集群。
<!--
Once a federated job is created, the federation control plane creates
a job in all underlying Kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:-->

一旦联邦 job 被创建了，联邦控制平面就会在所有底层 Kubernetes 集群中创建对应的 job。
您可以通过检查底层每个集群来对其进行验证，例如：

``` shell
kubectl --context=gce-asia-east1a get job myjob
```
<!--
The previous example assumes that you have a context named `gce-asia-east1a`
configured in your client for your cluster in that zone.-->
上面的例子假定您在客户端中配置了一个叫做 'gce-asia-east1a' 的上下文，用于请求那个区域的集群。

<!--
The jobs in the underlying clusters match the federated job
except in the number of parallelism and completions. The federation control plane ensures that the
sum of the parallelism and completions in each cluster matches the desired number of parallelism and completions in the
federated job.
-->
底层集群中的 job 的并行数和完成数将会和联邦 job 的保持一致。联邦控制平面将确保联邦的所有集群都和联邦 job 有同样的并行数和完成数。

<!--
### Spreading job tasks in underlying clusters
-->
### 底层集群中 job 任务的分布

<!--
By default, parallelism and completions are spread equally in all underlying clusters. For example:
if you have 3 registered clusters and you create a federated job with
`spec.parallelism = 9` and `spec.completions = 18`, then each job in the 3 clusters has
`spec.parallelism = 3` and `spec.completions = 6`.-->
默认情况下，并行数和完成数在所有底层集群中是均匀分布的。例如：如果您有 3 个注册的集群并且用 `spec.parallelism = 9` 和 `spec.completions = 18` 参数创建了一个联邦 job，然后在这 3 个集群中每个 job 的并行数会是 `spec.parallelism = 3` ，完成数会是 `spec.completions = 6` 。
<!--
To modify the number of parallelism and completions in each cluster, you can specify
[ReplicaAllocationPreferences](https://github.com/kubernetes/federation/blob/{{page.githubbranch}}/apis/federation/types.go)
as an annotation with key `federation.kubernetes.io/job-preferences`
on the federated job.
-->
如果要修改每个集群中的并行数和完成数，您可以在联邦 job 中使用 `federation.kubernetes.io/job-preferences` 作为注解键值来修改 [ReplicaAllocationPreferences](https://github.com/kubernetes/federation/blob/{{page.githubbranch}}/apis/federation/types.go)。

<!--
## Updating a federated job-->
## 更新联邦 job
<!--
You can update a federated job as you would update a Kubernetes
job; however, for a federated job, you must send the request to
the federation API server instead of sending it to a specific Kubernetes cluster.
The federation control plane ensures that whenever the federated job is
updated, it updates the corresponding job in all underlying clusters to
match it.-->
您可以像更新 Kubernetes job 一样更新联邦 job。但是，对于联邦 job，您必须发送请求到联邦 apiserver 而不是某个特定的 Kubernetes 集群。联邦控制平面会确保任何时候联邦 job 更新后，它会将对应的 job 更新到所有的底层集群中来和它保持一致。

<!--
If your update includes a change in number of parallelism and completions, the federation
control plane changes the number of parallelism and completions in underlying clusters to
ensure that their sum remains equal to the number of desired parallelism and completions in
federated job.
-->
如果您做了包含并行数和完成数的更改，联邦控制平面将会更改底层集群中的并行数和完成数以确保它们的总数和联邦 job 期望的并行数和完成数保持一致。
<!--
## Deleting a federated job-->
## 删除联邦 job

<!--
You can delete a federated job as you would delete a Kubernetes
job; however, for a federated job, you must send the request to
the federation API server instead of sending it to a specific Kubernetes cluster.-->
您可以像删除 Kubernetes job 一样删除联邦 job。但是，对于联邦 job，您必须发送请求到联邦 apiserver 而不是某个特定的 Kubernetes 集群。

<!--For example, with kubectl:-->
例如，您可以使用 kubectl 运行下面的命令来删除联邦 job：

```shell
kubectl --context=federation-cluster delete job myjob
```
<!--
**Note:** Deleting a federated job will not delete the
corresponding jobs from underlying clusters.
You must delete the underlying jobs manually.
{: .note}
-->
**注意:**删除联邦 job 并不会删除底层集群中对应的 job。您必须自己手动删除底层集群中的 job。
{: .note}

{% endcapture %}

{% include templates/task.md %}
