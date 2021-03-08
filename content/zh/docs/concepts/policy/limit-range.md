---
title: 限制范围
content_type: concept
weight: 10
---

<!-- overview -->

<!--
By default, containers run with unbounded [compute resources](/docs/concepts/configuration/manage-resources-containers/) on a Kubernetes cluster.
With resource quotas, cluster administrators can restrict resource consumption and creation on a {{< glossary_tooltip text="namespace" term_id="namespace" >}} basis.
Within a namespace, a Pod or Container can consume as much CPU and memory as defined by the namespace's resource quota. There is a concern that one Pod or Container could monopolize all available resources. A LimitRange is a policy to constrain resource allocations (to Pods or Containers) in a namespace.
-->
默认情况下， Kubernetes 集群上的容器运行使用的[计算资源](/zh/docs/concepts/configuration/manage-resources-containers/)没有限制。
使用资源配额，集群管理员可以以{{< glossary_tooltip text="名称空间" term_id="namespace" >}}为单位，限制其资源的使用与创建。
在命名空间中，一个 Pod 或 Container 最多能够使用命名空间的资源配额所定义的 CPU 和内存用量。
有人担心，一个 Pod 或 Container 会垄断所有可用的资源。
LimitRange 是在命名空间内限制资源分配（给多个 Pod 或 Container）的策略对象。

<!-- body -->

<!--
A _LimitRange_ provides constraints that can:

- Enforce minimum and maximum compute resources usage per Pod or Container in a namespace.
- Enforce minimum and maximum storage request per PersistentVolumeClaim in a namespace.
- Enforce a ratio between request and limit for a resource in a namespace.
- Set default request/limit for compute resources in a namespace and automatically inject them to Containers at runtime.
-->

一个 _LimitRange（限制范围）_ 对象提供的限制能够做到：

- 在一个命名空间中实施对每个 Pod 或 Container 最小和最大的资源使用量的限制。
- 在一个命名空间中实施对每个 PersistentVolumeClaim 能申请的最小和最大的存储空间大小的限制。
- 在一个命名空间中实施对一种资源的申请值和限制值的比值的控制。
- 设置一个命名空间中对计算资源的默认申请/限制值，并且自动的在运行时注入到多个 Container 中。

<!--
## Enabling LimitRange

LimitRange support has been enabled by default since Kubernetes 1.10.

LimitRange support is enabled by default for many Kubernetes distributions.
-->
## 启用 LimitRange

对 LimitRange 的支持自 Kubernetes 1.10 版本默认启用。

LimitRange 支持在很多 Kubernetes 发行版本中也是默认启用的。

<!--
The name of a LimitRange object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
LimitRange 的名称必须是合法的
[DNS 子域名](/zh/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
### Overview of Limit Range

- The administrator creates one `LimitRange` in one namespace.
- Users create resources like Pods, Containers, and PersistentVolumeClaims in the namespace.
- The `LimitRanger` admission controller enforces defaults and limits for all Pods and Containers that do not set compute resource requirements and tracks usage to ensure it does not exceed resource minimum, maximum and ratio defined in any LimitRange present in the namespace.
- If creating or updating a resource (Pod, Container, PersistentVolumeClaim) that violates a LimitRange constraint, the request to the API server will fail with an HTTP status code `403 FORBIDDEN` and a message explaining the constraint that have been violated.
- If a LimitRange is activated in a namespace for compute resources like `cpu` and `memory`, users must specify
  requests or limits for those values. Otherwise, the system may reject Pod creation.
- LimitRange validations occurs only at Pod Admission stage, not on Running Pods.
-->
### 限制范围总览

- 管理员在一个命名空间内创建一个 `LimitRange` 对象。
- 用户在命名空间内创建 Pod ，Container 和 PersistentVolumeClaim 等资源。
- `LimitRanger` 准入控制器对所有没有设置计算资源需求的 Pod 和 Container 设置默认值与限制值，
  并跟踪其使用量以保证没有超出命名空间中存在的任意 LimitRange 对象中的最小、最大资源使用量以及使用量比值。
- 若创建或更新资源（Pod、 Container、PersistentVolumeClaim）违反了 LimitRange 的约束，
  向 API 服务器的请求会失败，并返回 HTTP 状态码 `403 FORBIDDEN` 与描述哪一项约束被违反的消息。
- 若命名空间中的 LimitRange 启用了对 `cpu` 和 `memory` 的限制，
  用户必须指定这些值的需求使用量与限制使用量。否则，系统将会拒绝创建 Pod。
- LimitRange 的验证仅在 Pod 准入阶段进行，不对正在运行的 Pod 进行验证。

<!--
Examples of policies that could be created using limit range are:

- In a 2 node cluster with a capacity of 8 GiB RAM and 16 cores, constrain Pods in a namespace to request 100m of CPU with a max limit of 500m for CPU and request 200Mi for Memory with a max limit of 600Mi for Memory.
- Define default CPU limit and request to 150m and memory default request to 300Mi for Containers started with no cpu and memory requests in their specs.
-->
能够使用限制范围创建的策略示例有：

- 在一个有两个节点，8 GiB 内存与16个核的集群中，限制一个命名空间的 Pod 申请
  100m 单位，最大 500m 单位的 CPU，以及申请 200Mi，最大 600Mi 的内存。
- 为 spec 中没有 cpu 和内存需求值的 Container 定义默认 CPU 限制值与需求值
  150m，内存默认需求值 300Mi。

<!--
In the case where the total limits of the namespace is less than the sum of the limits of the Pods/Containers,
there may be contention for resources. In this case, the Containers or Pods will not be created.
-->
在命名空间的总限制值小于 Pod 或 Container 的限制值的总和的情况下，可能会产生资源竞争。
在这种情况下，将不会创建 Container 或 Pod。

<!--
Neither contention nor changes to a LimitRange will affect already created resources.
-->
竞争和对 LimitRange 的改变都不会影响任何已经创建了的资源。

## {{% heading "whatsnext" %}}

<!--
See [LimitRanger design doc](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_limit_range.md) for more information.
-->
参阅 [LimitRanger 设计文档](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_limit_range.md)获取更多信息。

<!--
For examples on using limits, see:

- See [how to configure minimum and maximum CPU constraints per namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/).
- See [how to configure minimum and maximum Memory constraints per namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/).
- See [how to configure default CPU Requests and Limits per namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/).
- See [how to configure default Memory Requests and Limits per namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/).
- Check [how to configure minimum and maximum Storage consumption per namespace](/docs/tasks/administer-cluster/limit-storage-consumption/#limitrange-to-limit-requests-for-storage).
- See a [detailed example on configuring quota per namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/).
-->
关于使用限值的例子，可参看

- [如何配置每个命名空间最小和最大的 CPU 约束](/zh/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)。
- [如何配置每个命名空间最小和最大的内存约束](/zh/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)。
- [如何配置每个命名空间默认的 CPU 申请值和限制值](/zh/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)。
- [如何配置每个命名空间默认的内存申请值和限制值](/zh/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)。
- [如何配置每个命名空间最小和最大存储使用量](/zh/docs/tasks/administer-cluster/limit-storage-consumption/#limitrange-to-limit-requests-for-storage)。
- [配置每个命名空间的配额的详细例子](/zh/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)。

