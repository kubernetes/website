---
title: 联邦 Job
content_template: templates/task
---

<!--
---
title: Federated Jobs
content_template: templates/task
---
-->

{{% capture overview %}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

<!--
This guide explains how to use jobs in the federation control plane.

Jobs in the federation control plane (referred to as "federated jobs" in
this guide) are similar to the traditional [Kubernetes
jobs](/docs/concepts/workloads/controllers/job/), and provide the same functionality.
Creating jobs in the federation control plane ensures that the desired number of
parallelism and completions exist across the registered clusters.
-->
本指南解释了如何在联邦控制平面中使用 job。

联邦控制平面中的一次性任务（在本指南中称为“联邦一次性任务”）类似于传统的 [Kubernetes 一次性任务](/docs/concepts/workloads/controllers/job/)，并且提供相同的功能。
在联邦控制平面中创建 job 可以确保在已注册的集群中存在所需的并行性和完成数。

{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "federated-task-tutorial-prereqs.md" >}}
* 你需要具备基本的 [Kubernetes 的工作知识](/docs/tutorials/kubernetes-basics/)，特别是 [job](/docs/concepts/workloads/controllers/jobs-run-to-completion/)。

<!--
* You should also have a basic
[working knowledge of Kubernetes](/docs/tutorials/kubernetes-basics/) in
general and [jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/) in particular.
-->

{{% /capture %}}

{{% capture steps %}}

<!--
## Creating a federated job
-->

## 创建一个联邦 job

<!--
The API for federated jobs is fully compatible with the
API for traditional Kubernetes jobs. You can create a job by sending
a request to the federation apiserver.

You can do that using [kubectl](/docs/user-guide/kubectl/) by running:
-->

用于联邦 job 的 API 与用于传统 Kubernetes job 的 API 完全兼容。您可以通过向联邦 apiserver 发送请求来创建 job。

你可以使用 [kubectl](/docs/user-guide/kubectl/) 来运行：

``` shell
kubectl --context=federation-cluster create -f myjob.yaml
```

<!--
The `--context=federation-cluster` flag tells kubectl to submit the
request to the federation API server instead of sending it to a Kubernetes
cluster.
-->
`--context=federation-cluster` 参数告诉 kubectl 将请求提交到联邦 API 服务器，而不是发送到 Kubernetes 集群。

<!--
Once a federated job is created, the federation control plane creates
a job in all underlying Kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:
-->
一旦创建了联邦 job，联邦控制平面将在所有底层 Kubernetes 集群中创建一个 job。
你可以通过检查每个集群底层来验证这一点，例如：

``` shell
kubectl --context=gce-asia-east1a get job myjob
```

<!--
The previous example assumes that you have a context named `gce-asia-east1a`
configured in your client for your cluster in that zone.
-->
前面的示例假设你的客户端中为该区域中的集群配置了一个名为 `gce-asia-east1a` 的上下文。

<!--
The jobs in the underlying clusters match the federated job
except in the number of parallelism and completions. The federation control plane ensures that the
sum of the parallelism and completions in each cluster matches the desired number of parallelism and completions in the
federated job.
-->
集群底层中的 job 与联邦 job 匹配，但并行性和完成数不匹配。
联邦控制平面确保每个集群中的并行性和完成数之和与联合作业中所需的并行度和完成数匹配。

<!--
### Spreading job tasks in underlying clusters
-->

### 将 job 任务分散到集群底层中

<!--
By default, parallelism and completions are spread equally in all underlying clusters. For example:
if you have 3 registered clusters and you create a federated job with
`spec.parallelism = 9` and `spec.completions = 18`, then each job in the 3 clusters has
`spec.parallelism = 3` and `spec.completions = 6`.
To modify the number of parallelism and completions in each cluster, you can specify
[ReplicaAllocationPreferences](https://github.com/kubernetes/federation/blob/{{< param "githubbranch" >}}/apis/federation/types.go)
as an annotation with key `federation.kubernetes.io/job-preferences`
on the federated job.
-->
默认情况下，并行性和完成数在所有底层集群中平均分布。例如：
如果你有 3 个已注册的集群，并且创建了一个联邦 job
`spec.parallelism = 9` 和 `spec.completions = 18`，那么 3 个集群中的每个 job 都有 `spec.parallelism = 3` 和 `spec.completions = 6`。
要修改每个集群中的并行性和完成数，可以指定 [ReplicaAllocationPreferences](https://github.com/kubernetes/federation/blob/{{< param "githubbranch" >}}/apis/federation/types.go)
作为 `federation.kubernetes.io/job-preferences` 联邦 job 上的 key 的注释。

<!--
## Updating a federated job
-->

## 更新联邦 job

<!--
You can update a federated job as you would update a Kubernetes
job; however, for a federated job, you must send the request to
the federation API server instead of sending it to a specific Kubernetes cluster.
The federation control plane ensures that whenever the federated job is
updated, it updates the corresponding job in all underlying clusters to
match it.
-->
可以像更新 Kubernetes job 一样更新联邦 job；但是，对于联邦 job，必须将请求发送到联邦 API 服务器，不是发送到指定的 Kubernetes 集群。
联邦控制平面确保无论何时更新联邦 job，它都会更新所有集群底层中的相应 job 以匹配它。

<!--
If your update includes a change in number of parallelism and completions, the federation
control plane changes the number of parallelism and completions in underlying clusters to
ensure that their sum remains equal to the number of desired parallelism and completions in
federated job.
-->
如果您的更新包含并行性和完成数的更改，则联邦控制平面将更改集群底层中的并行性和完成数，
确保它们的总和仍然等于联邦 job 中所需的并行性和完成数。

<!--
## Deleting a federated job
-->

## 删除联邦 job

<!--
You can delete a federated job as you would delete a Kubernetes
job; however, for a federated job, you must send the request to
the federation API server instead of sending it to a specific Kubernetes cluster.
-->
可以删除联邦 job，就像删除 Kubernetes job 一样;但是，对于联邦 job，必须将请求发送到联邦 API 服务器，不是发送到指定的 Kubernetes 集群。

<!--
For example, with kubectl:
-->
例如，使用 kubectl：

```shell
kubectl --context=federation-cluster delete job myjob
```

{{< note >}}

<!--
Deleting a federated job will not delete the
corresponding jobs from underlying clusters.
You must delete the underlying jobs manually.
-->
删除联邦作业不会从基础集群中删除相应的 job。
您必须手动删除基础 job。

{{< /note >}}

{{% /capture %}}


