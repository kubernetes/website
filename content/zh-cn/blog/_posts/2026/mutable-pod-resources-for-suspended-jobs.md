---
layout: blog
title: "Kubernetes v1.36：Job 挂起时可变更的容器资源（Beta）"
date: 2026-04-27T10:35:00-08:00
slug: kubernetes-v1-36-mutable-pod-resources-for-suspended-jobs
author: >
  [Kevin Hannon](https://github.com/kannon92) (Red Hat)
translator: >
  [Paco Xu](https://github.com/pacoxu) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.36: Mutable Pod Resources for Suspended Jobs (beta)"
date: 2026-04-27T10:35:00-08:00
slug: kubernetes-v1-36-mutable-pod-resources-for-suspended-jobs
author: >
  [Kevin Hannon](https://github.com/kannon92) (Red Hat)
-->

<!--
Kubernetes v1.36 promotes the ability to modify container resource requests and limits
in the pod template of a suspended Job to beta. First introduced as alpha in v1.35, this
feature allows queue controllers and cluster administrators to adjust CPU, memory, GPU,
and extended resource specifications on a Job while it is suspended, before it starts
or resumes running.
-->
Kubernetes v1.36 将“在挂起 Job 的 Pod 模板中修改容器资源请求和限制”的能力提升到了 Beta。
这一特性首次在 v1.35 中以 Alpha 形式引入，允许队列控制器和集群管理员在 Job 处于挂起状态时，
在其启动或恢复运行之前，调整 CPU、内存、GPU 以及扩展资源的配置。

<!--
## Why mutable pod resources for suspended Jobs?
-->
## 为什么挂起 Job 的 Pod 模板需要可变更资源？

<!--
Batch and machine learning workloads often have resource requirements that are not
precisely known at Job creation time. The optimal resource allocation depends on
current cluster capacity, queue priorities, and the availability of specialized hardware
like GPUs.
-->
批处理和机器学习工作负载在创建 Job 时，其资源需求往往还无法精确确定。
最优的资源分配取决于当前集群容量、队列优先级，以及 GPU 等专用硬件的可用性。

<!--
Before this feature, resource requirements in a Job's pod template were immutable once set.
If a queue controller like [Kueue](https://kueue.sigs.k8s.io/) determined that a suspended
Job should run with different resources, the only option was to delete and recreate the Job,
losing any associated metadata, status, or history. This feature also provides a way
to let a specific Job instance for a CronJob progress slowly with reduced resources,
rather than outright failing to run if the cluster is heavily loaded.
-->
在这项特性出现之前，Job 的 Pod 模板中的资源需求一旦设定便不可更改。
如果像 [Kueue](https://kueue.sigs.k8s.io/) 这样的队列控制器判断某个挂起 Job
应以不同的资源配置运行，唯一的办法就是删除并重新创建该 Job，
这会导致相关的元数据、状态和历史记录一并丢失。
这项特性还提供了另一种可能：当集群负载较高时，允许某个 CronJob 派生出的具体 Job 实例
以较少的资源缓慢推进，而不是因为资源不足而完全无法运行。

<!--
Consider a machine learning training Job initially requesting 4 GPUs:
-->
设想一个机器学习训练 Job，最初请求 4 块 GPU：

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: training-job-example-abcd123
  labels:
    app.kubernetes.io/name: trainer
spec:
  suspend: true
  template:
    metadata:
      annotations:
        kubernetes.io/description: "ML training, ID abcd123"
    spec:
      containers:
      - name: trainer
        image: example-registry.example.com/training:2026-04-23T150405.678
        resources:
          requests:
            cpu: "8"
            memory: "32Gi"
            example-hardware-vendor.com/gpu: "4"
          limits:
            cpu: "8"
            memory: "32Gi"
            example-hardware-vendor.com/gpu: "4"
      restartPolicy: Never
```

<!--
A queue controller managing cluster resources might determine that only 2 GPUs
are available. With this feature, the controller can update the Job's resource
requests before resuming it:
-->
管理集群资源的队列控制器可能会发现当前只有 2 块 GPU 可用。
借助这项特性，控制器可以在恢复该 Job 之前更新其资源请求：

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: training-job-example-abcd123
  labels:
    app.kubernetes.io/name: trainer
spec:
  suspend: true
  template:
    metadata:
      annotations:
        kubernetes.io/description: "ML training, ID abcd123"
    spec:
      containers:
      - name: trainer
        image: example-registry.example.com/training:2026-04-23T150405.678
        resources:
          requests:
            cpu: "4"
            memory: "16Gi"
            example-hardware-vendor.com/gpu: "2"
          limits:
            cpu: "4"
            memory: "16Gi"
            example-hardware-vendor.com/gpu: "2"
      restartPolicy: Never
```

<!--
Once the resources are updated, the controller resumes the Job by setting
`spec.suspend` to `false`, and the new Pods are created with the adjusted
resource specifications.
-->
资源更新完成后，控制器将 `spec.suspend` 设为 `false` 以恢复 Job，
新创建的 Pod 就会使用调整后的资源配置。

<!--
## How it works
-->
## 工作原理

<!--
The Kubernetes API server relaxes the immutability constraint on pod template
resource fields specifically for suspended Jobs. No new API types have been introduced;
the existing Job and pod template structures accommodate the change through
relaxed validation.
-->
Kubernetes API 服务器针对挂起 Job，放宽了 Pod 模板中资源字段的不可变约束。
这一变化没有引入新的 API 类型；现有的 Job 和 Pod 模板结构通过放宽校验规则
即可支持此能力。

<!--
The mutable fields are:
- `spec.template.spec.containers[*].resources.requests`
- `spec.template.spec.containers[*].resources.limits`
- `spec.template.spec.initContainers[*].resources.requests`
- `spec.template.spec.initContainers[*].resources.limits`
-->
可变更的字段包括：

- `spec.template.spec.containers[*].resources.requests`
- `spec.template.spec.containers[*].resources.limits`
- `spec.template.spec.initContainers[*].resources.requests`
- `spec.template.spec.initContainers[*].resources.limits`

<!--
Resource updates are permitted when the following conditions are met:
1. The Job has `spec.suspend` set to `true`.
2. For a Job that was previously running and then suspended, all active
   Pods must have terminated (`status.active` equals 0) before resource
   mutations are accepted.
-->
只有在满足以下条件时，才允许更新资源：

1. Job 的 `spec.suspend` 被设置为 `true`。
2. 如果某个 Job 之前已经运行过，之后又被挂起，则必须等所有活动中的 Pod
   都终止（`status.active` 等于 0）后，才会接受资源变更。

<!--
Standard resource validation still applies. For example, resource limits
must be greater than or equal to requests, and extended resources must be
specified as whole numbers where required.
-->
标准的资源校验规则仍然适用。例如，资源限制值必须大于或等于请求值；
而扩展资源在有要求时则必须以整数形式指定。

<!--
## What's new in beta
-->
## Beta 版本有哪些变化

<!--
With the promotion to beta in Kubernetes v1.36, the
`MutablePodResourcesForSuspendedJobs` feature gate is enabled by default.
This means clusters running v1.36 can use this feature without any additional
configuration on the API server.
-->
随着该特性在 Kubernetes v1.36 中升级为 Beta，
`MutablePodResourcesForSuspendedJobs` 特性门控也默认启用。
这意味着运行 v1.36 的集群无需在 API 服务器上进行额外配置，就可以直接使用该特性。

<!--
## Try it out
-->
## 动手试用

<!--
If your cluster is running Kubernetes v1.36 or later, this feature is available
by default. For v1.35 clusters, enable the `MutablePodResourcesForSuspendedJobs`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) on
the `kube-apiserver`.
-->
如果你的集群运行的是 Kubernetes v1.36 或更高版本，这项特性默认可用。
对于 v1.35 集群，你需要在 `kube-apiserver` 上启用
`MutablePodResourcesForSuspendedJobs`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

<!--
You can test it by creating a suspended Job, updating its container resources
using `kubectl edit` or a controller, and then resuming the Job:
-->
你可以按以下步骤测试这项能力：创建一个挂起的 Job，使用 `kubectl edit`
或控制器更新其容器资源，然后恢复这个 Job：

```shell
# 创建一个挂起的 Job
kubectl apply -f my-job.yaml --server-side

# 编辑资源请求
kubectl edit job training-job-example-abcd123

# 恢复 Job
kubectl patch job training-job-example-abcd123 -p '{"spec":{"suspend":false}}'
```

<!--
## Considerations
-->
## 使用时的注意事项

<!--
### Running Jobs that are suspended
-->
### 挂起正在运行的 Job

<!--
If you suspend a Job that was already running, you must wait for **all** of that Job's active
Pods to terminate before modifying resources. The API server rejects resource
mutations while `status.active` is greater than zero. This prevents inconsistency
between running Pods and the updated pod template.
-->
如果你挂起的是一个已经在运行中的 Job，那么在修改资源之前，
必须等待该 Job 的**所有**活动 Pod 都终止。
当 `status.active` 大于 0 时，API 服务器会拒绝资源变更请求。
这样可以避免正在运行的 Pod 与更新后的 Pod 模板之间出现不一致。

<!--
### Pod replacement policy
-->
### Pod 替换策略

<!--
When using this feature with Jobs that may have failed Pods, consider setting
`podReplacementPolicy: Failed`. This ensures that replacement Pods are only
created after the previous Pods have fully terminated, preventing resource
contention from overlapping Pods.
-->
当你在可能存在失败 Pod 的 Job 中使用这项特性时，可以考虑设置
`podReplacementPolicy: Failed`。
这样可以确保替换 Pod 只会在前一个 Pod 完全终止之后才被创建，
从而避免因 Pod 重叠运行而产生资源争用。

<!--
### ResourceClaims
-->
### ResourceClaims

<!--
Dynamic Resource Allocation (DRA) `resourceClaimTemplates` remain immutable.
If your workload uses DRA, you must recreate the claim templates separately
to match any resource changes.
-->
动态资源分配（DRA）的 `resourceClaimTemplates` 仍然是不可变的。
如果你的工作负载使用了 DRA，那么在资源发生变化时，
你必须单独重新创建这些资源申领模板，以使其与新的资源配置保持一致。

<!--
## Getting involved
-->
## 参与其中

<!--
This feature was developed by [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps)
This feature was developed by [SIG Apps](https://www.kubernetes.dev/community/community-groups/sigs/apps/)
with input from [WG Batch](https://www.kubernetes.dev/community/community-groups/wg/batch/). Both groups welcome feedback
as the feature progresses toward stable.
-->
这项特性由 [SIG Apps](https://www.kubernetes.dev/community/community-groups/sigs/apps/)
开发，并吸收了 [WG Batch](https://www.kubernetes.dev/community/community-groups/wg/batch/) 的意见。
随着该特性逐步迈向稳定版本，这两个社区小组都欢迎你的反馈。

<!--
You can reach out through:
- Slack channel [#sig-apps](https://kubernetes.slack.com/archives/C18NZM5K9).
- Slack channel [#wg-batch](https://kubernetes.slack.com/archives/C032ZE66A2X).
- The [KEP-5440](https://kep.k8s.io/5440) tracking issue.
-->
你可以通过以下方式联系他们：

- Slack 频道 [#sig-apps](https://kubernetes.slack.com/archives/C18NZM5K9)
- Slack 频道 [#wg-batch](https://kubernetes.slack.com/archives/C032ZE66A2X)
- [KEP-5440](https://kep.k8s.io/5440) 跟踪议题
