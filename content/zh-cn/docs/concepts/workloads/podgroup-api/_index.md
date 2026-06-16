---
title: PodGroup API
weight: 25
no_list: true
---

<!-- overview -->

{{< feature-state feature_gate_name="GenericWorkload" >}}

<!--
A PodGroup is a runtime object that represents a group of Pods scheduled together as a single unit.
-->
PodGroup 是一个运行时对象，代表一组作为单个单元一起调度的 Pod。

<!--
While the [Workload API](/docs/concepts/workloads/workload-api/) defines scheduling policy
templates, PodGroups are the runtime counterparts that carry both the policy and the scheduling status
for a specific instance of that group.
-->
虽然[工作负载 API](/zh-cn/docs/concepts/workloads/workload-api/) 定义了调度策略模板，
但 PodGroup 是运行时对应的对象，它同时承载了策略和该组特定实例的调度状态。

<!-- body -->

<!--
## What is a PodGroup?
-->
## 什么是 PodGroup？   {#what-is-a-podgroup}

<!--
The PodGroup API resource is part of the `scheduling.k8s.io/v1alpha2`
{{< glossary_tooltip text="API group" term_id="api-group" >}}
and your cluster must have that API group enabled, as well as the `GenericWorkload`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
before you can use this API.
-->
PodGroup API 资源是 `scheduling.k8s.io/v1alpha2`
{{< glossary_tooltip text="API 组" term_id="api-group" >}}的一部分，
在使用此 API 之前，你的集群必须启用该 API 组以及 `GenericWorkload`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

<!--
A PodGroup is a self-contained scheduling unit. It defines the group of Pods that should be scheduled together, carries the
scheduling policy that governs placement, and records the runtime status of that
scheduling decision.
-->
PodGroup 是一个自包含的调度单元。它定义了应该一起调度的 Pod 组，
承载了控制放置的调度策略，并记录了该调度决策的运行时状态。

<!--
## API structure
-->
## API 结构   {#api-structure}

<!--
A PodGroup consists of a `spec` that defines the desired scheduling behavior and
a `status` that reflects the current scheduling state.
-->
PodGroup 由定义所需调度行为的 `spec` 和反映当前调度状态的 `status` 组成。

<!--
### Scheduling policy
-->
### 调度策略   {#scheduling-policy}

<!--
Each PodGroup carries a [scheduling policy](/docs/concepts/workloads/workload-api/policies/)
(`basic` or `gang`) in `spec.schedulingPolicy`. When a workload controller creates
the PodGroup, this policy is copied from the Workload's PodGroupTemplate at creation time.
For standalone PodGroups, you set the policy directly.
-->
每个 PodGroup 在 `spec.schedulingPolicy` 中承载一个[调度策略](/zh-cn/docs/concepts/workloads/workload-api/policies/)
（`basic` 或 `Gang`）。当工作负载控制器创建 PodGroup 时，
此策略在创建时从 Workload 的 PodGroupTemplate 复制。
对于独立的 PodGroup，你直接设置策略。

```yaml
spec:
  schedulingPolicy:
    gang:
      minCount: 4
```

<!--
### Template reference
-->
### 模板引用   {#template-reference}

<!--
The optional `spec.podGroupTemplateRef` links the PodGroup back to the PodGroupTemplate
in the Workload it was created from. This is useful for observability and tooling.
-->
可选的 `spec.podGroupTemplateRef` 将 PodGroup 链接回它所创建自的 Workload 中的 PodGroupTemplate。
这对于可观测性和工具非常有用。

```yaml
spec:
  podGroupTemplateRef:
    workload:
      workloadName: training-policy
      podGroupTemplateName: worker
```

<!--
### Requesting DRA devices for a PodGroup
-->
### 为 PodGroup 请求 DRA 设备   {#requesting-dra-devices-for-a-podgroup}

{{< feature-state feature_gate_name="DRAWorkloadResourceClaims" >}}

<!--
{{< glossary_tooltip text="Devices" term_id="device" >}} available through
{{< glossary_tooltip text="Dynamic Resource Allocation (DRA)" term_id="dra" >}}
can be requested by a PodGroup through its `spec.resourceClaims` field:
-->
通过{{< glossary_tooltip text="动态资源分配（DRA）" term_id="dra" >}}
可获得的{{< glossary_tooltip text="设备" term_id="device" >}}
可以由 PodGroup 通过其 `spec.resourceClaims` 字段请求：

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: training-group
  namespace: some-ns
spec:
  ...
  resourceClaims:
  - name: pg-claim
    resourceClaimName: my-pg-claim
  - name: pg-claim-template
    resourceClaimTemplateName: my-pg-template
```

<!--
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}
associated with PodGroups can be shared by all Pods belonging to the group. With
only a reference to the PodGroup in the ResourceClaim's `status.reservedFor`
instead of each individual Pod, any number of Pods in the same PodGroup can
share a ResourceClaim. ResourceClaims can also be generated from
{{< glossary_tooltip text="ResourceClaimTemplates" term_id="resourceclaimtemplate" >}}
for each PodGroup, allowing the devices allocated to each generated
ResourceClaim to be shared by the Pods in each PodGroup.
-->
与 PodGroup 关联的
{{< glossary_tooltip text="ResourceClaim" term_id="resourceclaim" >}}
可以由属于该组的所有 Pod 共享。
只需在 ResourceClaim 的 `status.reservedFor` 中引用 PodGroup，而不是每个单独的 Pod，
同一 PodGroup 中的任意数量的 Pod 都可以共享一个 ResourceClaim。
还可以为每个 PodGroup 从
{{< glossary_tooltip text="ResourceClaimTemplate" term_id="resourceclaimtemplate" >}}
生成 ResourceClaim，允许分配给每个生成的 ResourceClaim 的设备由每个 PodGroup 中的 Pod 共享。

<!--
For more details and a more complete example, see the
[DRA documentation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#workload-resource-claims).
-->
有关更多详细信息和更完整的示例，请参阅
[DRA 文档](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#workload-resource-claims)。

<!--
### Status
-->
### 状态   {#status}

<!--
The scheduler updates `status.conditions` to report whether the group has been
successfully scheduled. The primary condition is `PodGroupScheduled`, which is `True`
when all required Pods have been placed and `False` when scheduling fails.
-->
调度器更新 `status.conditions` 以报告组是否已成功调度。
主要条件是 `PodGroupScheduled`，当所有必需的 Pod 已放置时为 `True`，
当调度失败时为 `False`。

{{< note >}}
<!--
The `PodGroupScheduled` condition reflects the initial scheduling decision only.
The scheduler does not update it if Pods later fail or are evicted. See
[Limitations](/docs/concepts/workloads/podgroup-api/lifecycle/#limitations)
for details.
-->
`PodGroupScheduled` 条件仅反映初始调度决策。
如果 Pod 后续失败或被驱逐，调度器不会更新它。
有关详细信息，请参阅[限制](/zh-cn/docs/concepts/workloads/podgroup-api/lifecycle/#limitations)。
{{< /note >}}

<!--
See the [PodGroup lifecycle](/docs/concepts/workloads/podgroup-api/lifecycle/#podgroup-status)
page for the full list of conditions and reasons.
-->
有关条件和原因的完整列表，请参阅
[PodGroup 生命周期](/zh-cn/docs/concepts/workloads/podgroup-api/lifecycle/#podgroup-status)页面。

<!--
## Creating a PodGroup
-->
## 创建 PodGroup   {#creating-a-podgroup}

<!--
A PodGroup API resource is part of the `scheduling.k8s.io/v1alpha2`
{{< glossary_tooltip text="API group" term_id="api-group" >}}.
(and your cluster must have that API group enabled, as well as the `GenericWorkload`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
before you can use this API).
-->
PodGroup API 资源是 `scheduling.k8s.io/v1alpha2`
{{< glossary_tooltip text="API 组" term_id="api-group" >}}的一部分。
（在使用此 API 之前，你的集群必须启用该 API 组以及 `GenericWorkload`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。）

<!--
The following manifest creates a PodGroup with a gang scheduling policy that requires
at least 4 Pods to be schedulable simultaneously:
-->
以下清单创建一个具有 gang 调度策略的 PodGroup，该策略要求至少 4 个 Pod 同时可调度：

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: training-worker-0
  namespace: default
spec:
  schedulingPolicy:
    gang:
      minCount: 4
```

<!--
You can inspect PodGroups in your cluster:
-->
你可以在集群中检查 PodGroup：

```shell
kubectl get podgroups
```

<!--
To see the full status including scheduling conditions:
-->
要查看包括调度条件在内的完整状态：

```shell
kubectl describe podgroup training-worker-0
```

<!--
## How it fits together
-->
## 如何组合使用   {#how-it-fits-together}

<!--
The relationship between controllers, Workloads, PodGroups, and Pods follows this pattern:
-->
控制器、Workload、PodGroup 和 Pod 之间的关系遵循以下模式：

<!--
1. The workload controller creates a Workload that defines PodGroupTemplates with scheduling policies.
2. For each runtime instance, the controller creates a PodGroup from one of the Workload's PodGroupTemplates.
3. The controller creates Pods that reference the PodGroup
   via the `spec.schedulingGroup.podGroupName` field.
-->
1. 工作负载控制器创建一个 Workload，该 Workload 定义带有调度策略的 PodGroupTemplates。
2. 对于每个运行时实例，控制器从 Workload 的其中一个 PodGroupTemplate 创建一个 PodGroup。
3. 控制器创建通过 `spec.schedulingGroup.podGroupName` 字段引用 PodGroup 的 Pod。

<!--
The [Job](/docs/concepts/workloads/controllers/job/) controller is the only built-in
workload controller that follows this pattern for now.
Custom controllers can implement the same flow for their own workload types.
-->
[Job](/zh-cn/docs/concepts/workloads/controllers/job/) 控制器是目前唯一遵循此模式的内置工作负载控制器。
自定义控制器可以为自己的工作负载类型实现相同的流程。

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: Workload
metadata:
  name: training-policy
spec:
  podGroupTemplates:
  - name: worker
    schedulingPolicy:
      gang:
        minCount: 4
---
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: training-worker-0
spec:
  podGroupTemplateRef:
    workload:
      workloadName: training-policy
      podGroupTemplateName: worker
  schedulingPolicy:
    gang:
      minCount: 4
---
apiVersion: v1
kind: Pod
metadata:
  name: worker-0
spec:
  schedulingGroup:
    podGroupName: training-worker-0
  containers:
  - name: ml-worker
    image: training:v1
```

<!--
The Workload acts as a long-lived policy definition, while PodGroups handle the 
transient, per-instance runtime state. This separation means that status updates for
individual PodGroups do not contend on the shared Workload object.
-->
Workload 充当长期存在的策略定义，而 PodGroup 处理瞬态的、每个实例的运行时状态。
这种分离意味着单个 PodGroup 的状态更新不会与共享的 Workload 对象发生冲突。

## {{% heading "whatsnext" %}}

<!--
* Learn about the [PodGroup lifecycle](/docs/concepts/workloads/podgroup-api/lifecycle/) in detail.
* Read about the [Workload API](/docs/concepts/workloads/workload-api/) that provides PodGroupTemplates.
* See how Pods reference their PodGroup via the [scheduling group](/docs/concepts/workloads/pods/scheduling-group/) field.
* Understand the [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/) algorithm.
-->
* 详细了解 [PodGroup 生命周期](/zh-cn/docs/concepts/workloads/podgroup-api/lifecycle/)。
* 阅读提供 PodGroupTemplates 的[工作负载 API](/zh-cn/docs/concepts/workloads/workload-api/)。
* 查看 Pod 如何通过[调度组](/zh-cn/docs/concepts/workloads/pods/scheduling-group/)字段引用其 PodGroup。
* 理解[Gang调度](/zh-cn/docs/concepts/scheduling-eviction/gang-scheduling/)算法。
