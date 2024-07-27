---
title: 限制范围
api_metadata:
- apiVersion: "v1"
  kind: "LimitRange"
content_type: concept
weight: 10
---
<!--
reviewers:
- nelvadas
title: Limit Ranges
api_metadata:
- apiVersion: "v1"
  kind: "LimitRange"
content_type: concept
weight: 10
-->

<!-- overview -->

<!--
By default, containers run with unbounded [compute resources](/docs/concepts/configuration/manage-resources-containers/) on a Kubernetes cluster.
Using  Kubernetes [resource quotas](/docs/concepts/policy/resource-quotas/),
administrators (also termed _cluster operators_) can restrict consumption and creation
of cluster resources (such as CPU time, memory, and persistent storage) within a specified
{{< glossary_tooltip text="namespace" term_id="namespace" >}}.
Within a namespace, a {{< glossary_tooltip text="Pod" term_id="Pod" >}} can consume as much CPU and memory as is allowed by the ResourceQuotas that apply to that namespace. As a cluster operator, or as a namespace-level administrator, you might also be concerned about making sure that a single object cannot monopolize all available resources within a namespace.

A LimitRange is a policy to constrain the resource allocations (limits and requests) that you can specify for each applicable object kind (such as Pod or {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}) in a namespace.
-->
默认情况下， Kubernetes 集群上的容器运行使用的[计算资源](/zh-cn/docs/concepts/configuration/manage-resources-containers/)没有限制。
使用 Kubernetes [资源配额](/zh-cn/docs/concepts/policy/resource-quotas/)，
管理员（也称为 **集群操作者**）可以在一个指定的{{< glossary_tooltip text="命名空间" term_id="namespace" >}}内限制集群资源的使用与创建。
在命名空间中，一个 {{< glossary_tooltip text="Pod" term_id="Pod" >}} 最多能够使用命名空间的资源配额所定义的 CPU 和内存用量。
作为集群操作者或命名空间级的管理员，你可能也会担心如何确保一个 Pod 不会垄断命名空间内所有可用的资源。

LimitRange 是限制命名空间内可为每个适用的对象类别
（例如 Pod 或 {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}）
指定的资源分配量（限制和请求）的策略对象。

<!-- body -->

<!--
A _LimitRange_ provides constraints that can:

- Enforce minimum and maximum compute resources usage per Pod or Container in a namespace.
- Enforce minimum and maximum storage request per {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} in a namespace.
- Enforce a ratio between request and limit for a resource in a namespace.
- Set default request/limit for compute resources in a namespace and automatically inject them to Containers at runtime.
-->

一个 **LimitRange（限制范围）** 对象提供的限制能够做到：

- 在一个命名空间中实施对每个 Pod 或 Container 最小和最大的资源使用量的限制。
- 在一个命名空间中实施对每个 {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}
  能申请的最小和最大的存储空间大小的限制。
- 在一个命名空间中实施对一种资源的申请值和限制值的比值的控制。
- 设置一个命名空间中对计算资源的默认申请/限制值，并且自动的在运行时注入到多个 Container 中。

<!--
A LimitRange is enforced in a particular namespace when there is a
LimitRange object in that namespace.
-->
当某命名空间中有一个 LimitRange 对象时，将在该命名空间中实施 LimitRange 限制。

<!--
The name of a LimitRange object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
LimitRange 的名称必须是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
## Constraints on resource limits and requests

- The administrator creates a LimitRange in a namespace.
- Users create (or try to create) objects in that namespace, such as Pods or PersistentVolumeClaims.
- First, the `LimitRange` admission controller applies default request and limit values for all Pods (and their containers) that do not set compute resource requirements.
- Second, the `LimitRange` tracks usage to ensure it does not exceed resource minimum, maximum and ratio defined in any `LimitRange` present in the namespace.
- If you attempt to create or update an object (Pod or PersistentVolumeClaim) that violates a `LimitRange` constraint, your request to the API server will fail with an HTTP status code `403 Forbidden` and a message explaining the constraint that has been violated.
- If you add a `LimitRange` in a namespace that applies to compute-related resources such as
 `cpu` and `memory`, you must specify
  requests or limits for those values. Otherwise, the system may reject Pod creation.
- `LimitRange` validations occur only at Pod admission stage, not on running Pods.
  If you add or modify a LimitRange, the Pods that already exist in that namespace
  continue unchanged.
- If two or more `LimitRange` objects exist in the namespace, it is not deterministic which default value will be applied.
-->
## 资源限制和请求的约束   {#constraints-on-resource-limits-and-requests}

- 管理员在一个命名空间内创建一个 `LimitRange` 对象。
- 用户在此命名空间内创建（或尝试创建） Pod 和 PersistentVolumeClaim 等对象。
- 首先，`LimitRange` 准入控制器对所有没有设置计算资源需求的所有 Pod（及其容器）设置默认请求值与限制值。
- 其次，`LimitRange` 跟踪其使用量以保证没有超出命名空间中存在的任意 `LimitRange` 所定义的最小、最大资源使用量以及使用量比值。
- 若尝试创建或更新的对象（Pod 和 PersistentVolumeClaim）违反了 `LimitRange` 的约束，
  向 API 服务器的请求会失败，并返回 HTTP 状态码 `403 Forbidden` 以及描述哪一项约束被违反的消息。
- 若你在命名空间中添加 `LimitRange` 启用了对 `cpu` 和 `memory` 等计算相关资源的限制，
  你必须指定这些值的请求使用量与限制使用量。否则，系统将会拒绝创建 Pod。
- `LimitRange` 的验证仅在 Pod 准入阶段进行，不对正在运行的 Pod 进行验证。
  如果你添加或修改 LimitRange，命名空间中已存在的 Pod 将继续不变。
- 如果命名空间中存在两个或更多 `LimitRange` 对象，应用哪个默认值是不确定的。

<!--
## LimitRange and admission checks for Pods

A `LimitRange` does **not** check the consistency of the default values it applies. This means that a default value for the _limit_ that is set by `LimitRange` may be less than the _request_ value specified for the container in the spec that a client submits to the API server. If that happens, the final Pod will not be schedulable.

For example, you define a `LimitRange` with this manifest:
-->
## Pod 的 LimitRange 和准入检查     {#limitrange-and-admission-checks-for-pod}

`LimitRange` **不** 检查所应用的默认值的一致性。
这意味着 `LimitRange` 设置的 **limit** 的默认值可能小于客户端提交给 API 服务器的规约中为容器指定的 **request** 值。
如果发生这种情况，最终 Pod 将无法调度。

例如，你使用如下清单定义一个 `LimitRange`：

{{% code_sample file="concepts/policy/limit-range/problematic-limit-range.yaml" %}}

<!--
along with a Pod that declares a CPU resource request of `700m`, but not a limit:
-->
以及一个声明 CPU 资源请求为 `700m` 但未声明限制值的 Pod：

{{% code_sample file="concepts/policy/limit-range/example-conflict-with-limitrange-cpu.yaml" %}}

<!--
then that Pod will not be scheduled, failing with an error similar to:
-->
那么该 Pod 将不会被调度，失败并出现类似以下的错误：

```
Pod "example-conflict-with-limitrange-cpu" is invalid: spec.containers[0].resources.requests: Invalid value: "700m": must be less than or equal to cpu limit
```

<!--
If you set both `request` and `limit`, then that new Pod will be scheduled successfully even with the same `LimitRange` in place:
-->
如果你同时设置了 `request` 和 `limit`，那么即使使用相同的 `LimitRange`，新 Pod 也会被成功调度：

{{% code_sample file="concepts/policy/limit-range/example-no-conflict-with-limitrange-cpu.yaml" %}}

<!--
## Example resource constraints

Examples of policies that could be created using `LimitRange` are:

- In a 2 node cluster with a capacity of 8 GiB RAM and 16 cores, constrain Pods in a namespace to request 100m of CPU with a max limit of 500m for CPU and request 200Mi for Memory with a max limit of 600Mi for Memory.
- Define default CPU limit and request to 150m and memory default request to 300Mi for Containers started with no cpu and memory requests in their specs.
-->
## 资源约束示例   {#example-resource-constraints}

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
For examples on using limits, see:

- [how to configure minimum and maximum CPU constraints per namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/).
- [how to configure minimum and maximum Memory constraints per namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/).
- [how to configure default CPU Requests and Limits per namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/).
- [how to configure default Memory Requests and Limits per namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/).
- [how to configure minimum and maximum Storage consumption per namespace](/docs/tasks/administer-cluster/limit-storage-consumption/#limitrange-to-limit-requests-for-storage).
- a [detailed example on configuring quota per namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/).

Refer to the [LimitRanger design document](https://git.k8s.io/design-proposals-archive/resource-management/admission_control_limit_range.md) for context and historical information.
-->
关于使用限值的例子，可参阅：

- [如何配置每个命名空间最小和最大的 CPU 约束](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)。
- [如何配置每个命名空间最小和最大的内存约束](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)。
- [如何配置每个命名空间默认的 CPU 申请值和限制值](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)。
- [如何配置每个命名空间默认的内存申请值和限制值](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)。
- [如何配置每个命名空间最小和最大存储使用量](/zh-cn/docs/tasks/administer-cluster/limit-storage-consumption/#limitrange-to-limit-requests-for-storage)。
- [配置每个命名空间的配额的详细例子](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)。

有关上下文和历史信息，请参阅 [LimitRanger 设计文档](https://git.k8s.io/design-proposals-archive/resource-management/admission_control_limit_range.md)。
