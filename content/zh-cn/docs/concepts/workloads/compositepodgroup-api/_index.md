---
title: CompositePodGroup API
weight: 25
no_list: true
---
<!--
title: CompositePodGroup API
weight: 25
no_list: true
-->

<!-- overview -->
{{< feature-state feature_gate_name="CompositePodGroup" >}}

<!--
A `CompositePodGroup` is a runtime object that represents a non-leaf node in a multi-level workload
hierarchy. While the [Workload API](/docs/concepts/workloads/workload-api/) defines static scheduling
policy templates, `CompositePodGroup` and `PodGroup` objects are the runtime counterparts that
carry policies and hierarchy references for a specific workload instance.
-->
`CompositePodGroup` 是一个运行时对象，表示多级工作负载层级结构中的非叶节点。
虽然 [Workload API](/zh-cn/docs/concepts/workloads/workload-api/) 定义了静态调度策略模板，
但 `CompositePodGroup` 和 `PodGroup` 对象是运行时对应的对象，
它们为特定工作负载实例承载策略和层级引用。

<!-- body -->

<!--
## What is a CompositePodGroup?
-->
## 什么是 CompositePodGroup？   {#what-is-a-compositepodgroup}

<!--
The `CompositePodGroup` API resource is part of the `scheduling.k8s.io/v1alpha3`
{{< glossary_tooltip text="API group" term_id="api-group" >}}. Your cluster must have that API
group enabled, as well as the `CompositePodGroup`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
before you can use this API.
-->
`CompositePodGroup` API 资源是 `scheduling.k8s.io/v1alpha3`
{{< glossary_tooltip text="API 组" term_id="api-group" >}}的一部分。
在使用此 API 之前，你的集群必须启用该 API 组以及 `CompositePodGroup`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

<!--
A `CompositePodGroup` represents a grouping of child groups (which can be `CompositePodGroup` or
`PodGroup` objects). It carries scheduling policies, disruption modes, priority
settings, and optional topology constraints that apply collectively across its child groups.
-->
`CompositePodGroup` 表示一组子组（子组可以是 `CompositePodGroup` 或 `PodGroup` 对象）。
它承载调度策略、干扰模式、优先级设置，以及跨其子组集体生效的可选拓扑约束。

<!--
## API structure

A `CompositePodGroup` consists of a `spec` that defines the desired scheduling behavior
for its child groups, and a `status` subresource.
-->
## API 结构   {#api-structure}

`CompositePodGroup` 由定义其子组所需调度行为的 `spec` 和一个 `status` 子资源组成。

<!--
### Scheduling policy
-->
### 调度策略   {#scheduling-policy}

<!--
Each `CompositePodGroup` carries a [scheduling policy](/docs/concepts/workloads/workload-api/policies/)
(`basic` or `gang`) in `spec.schedulingPolicy`. When a workload controller creates a
`CompositePodGroup`, this policy is copied from the `Workload`'s `CompositePodGroupTemplate`
at creation time.
-->
每个 `CompositePodGroup` 在 `spec.schedulingPolicy`
中承载一个[调度策略](/zh-cn/docs/concepts/workloads/workload-api/policies/)（`basic` 或 `gang`）。
当工作负载控制器创建 `CompositePodGroup` 时，
此策略在创建时从 `Workload` 的 `CompositePodGroupTemplate` 复制。

<!--
For a `gang` policy on a `CompositePodGroup`, the `minGroupCount` field specifies the
minimum number of child groups that must be schedulable simultaneously:
-->
对于 `CompositePodGroup` 上的 `gang` 策略，
`minGroupCount` 字段指定必须可同时调度的最小组数量：

```yaml
spec:
  schedulingPolicy:
    gang:
      minGroupCount: 2
```

<!--
### Parent group reference
-->
### 父组引用   {#parent-group-reference}

<!--
Non-root `CompositePodGroup` resources specify their parent group using
`spec.parentCompositePodGroupName`. Root `CompositePodGroup` objects leave this field unset.
-->
非根级 `CompositePodGroup` 资源使用 `spec.parentCompositePodGroupName` 指定其父组。
根级 `CompositePodGroup` 对象不设置此字段。

```yaml
spec:
  parentCompositePodGroupName: root-group-0
```

<!--
### Workload reference
-->
### Workload 引用   {#workload-reference}

<!--
The `spec.workloadRef` field links the `CompositePodGroup` back to the
`CompositePodGroupTemplate` in the `Workload` object it was derived from.
-->
`spec.workloadRef` 字段将 `CompositePodGroup` 关联回
其派生自的 `Workload` 对象中的 `CompositePodGroupTemplate`。

```yaml
spec:
  workloadRef:
    workloadName: hierarchical-workload
    templateName: replica-group
```

<!--
### Status
-->
### 状态   {#status}

<!--
The `CompositePodGroup` API schema includes a `status` subresource. In the alpha release,
the `status` field is present in the API type, but `kube-scheduler` does not update or
populate status conditions for `CompositePodGroup` objects. Status tracking for composite
groups will be implemented in future releases.
-->
`CompositePodGroup` API 模式中包含一个 `status` 子资源。
在 Alpha 版本中，API 类型里存在 `status` 字段，
但 `kube-scheduler` 不会为 `CompositePodGroup` 对象更新或填充状态状况。
复合组的状态跟踪将在未来的发行版本中实现。

<!--
## Creating a CompositePodGroup

Workload controllers create `CompositePodGroup` objects automatically from `Workload`
templates at runtime.
-->
## 创建 CompositePodGroup   {#creating-a-compositepodgroup}

工作负载控制器在运行时自动从 `Workload` 模板创建 `CompositePodGroup` 对象。

<!--
The following manifest creates a root `CompositePodGroup` with a gang scheduling policy
that requires at least 2 child groups to be schedulable simultaneously:
-->
以下清单创建一个带有 gang 调度策略的根级 `CompositePodGroup`，
该策略要求至少 2 个子组可同时调度：

```yaml
apiVersion: scheduling.k8s.io/v1alpha3
kind: CompositePodGroup
metadata:
  name: root-group-0
  namespace: default
spec:
  workloadRef:
    workloadName: hierarchical-workload
    templateName: root
  schedulingPolicy:
    gang:
      minGroupCount: 2
```

<!--
You can inspect `CompositePodGroup` resources in your cluster:
-->
你可以在集群中检查 `CompositePodGroup` 资源：

```shell
kubectl get compositepodgroups
```

<!--
To view details for a specific composite group:
-->
要查看某个特定复合组的详细信息：

```shell
kubectl describe compositepodgroup root-group-0
```

<!--
## How it fits together

The relationship between controllers, Workloads, CompositePodGroups, PodGroups, and
Pods follows this pattern:
-->
## 如何组合使用   {#how-it-fits-together}

控制器、Workload、CompositePodGroup、PodGroup 和 Pod 之间的关系遵循以下模式：

<!--
1. The workload controller creates a `Workload` defining a tree of
   `CompositePodGroupTemplates` and leaf `PodGroupTemplates`.
2. For each runtime instance, the controller creates a root `CompositePodGroup`,
   descendant `CompositePodGroup` objects, and leaf `PodGroup` objects in a top-down manner.
3. The controller creates `Pods` that reference their leaf `PodGroup` via
   `spec.schedulingGroup.podGroupName`.
-->
1. 工作负载控制器创建一个 `Workload`，其中定义了一棵由
   `CompositePodGroupTemplate` 和叶子 `PodGroupTemplate` 组成的树。
2. 对于每个运行时实例，控制器以自顶向下的方式创建一个根级 `CompositePodGroup`、
   若干后代 `CompositePodGroup` 对象以及叶子 `PodGroup` 对象。
3. 控制器创建通过 `spec.schedulingGroup.podGroupName`
   引用其叶子 `PodGroup` 的 `Pod`。

<!--
The following example illustrates a complete manifest hierarchy for a two-level workload:
-->
以下示例展示了一个双层工作负载的完整清单层级结构：

```yaml
apiVersion: scheduling.k8s.io/v1alpha3
kind: Workload
metadata:
  name: hierarchical-workload
  namespace: default
spec:
  compositePodGroupTemplates:
  - name: root
    schedulingPolicy:
      gang:
        minGroupCount: 2
    podGroupTemplates:
    - name: workers-a
      schedulingPolicy:
        gang:
          minCount: 4
    - name: workers-b
      schedulingPolicy:
        gang:
          minCount: 4
---
apiVersion: scheduling.k8s.io/v1alpha3
kind: CompositePodGroup
metadata:
  name: root-group-0
  namespace: default
spec:
  workloadRef:
    workloadName: hierarchical-workload
    templateName: root
  schedulingPolicy:
    gang:
      minGroupCount: 2
---
apiVersion: scheduling.k8s.io/v1alpha3
kind: PodGroup
metadata:
  name: workers-a-0
  namespace: default
spec:
  parentCompositePodGroupName: root-group-0
  workloadRef:
    workloadName: hierarchical-workload
    templateName: workers-a
  schedulingPolicy:
    gang:
      minCount: 4
---
apiVersion: scheduling.k8s.io/v1alpha3
kind: PodGroup
metadata:
  name: workers-b-0
  namespace: default
spec:
  parentCompositePodGroupName: root-group-0
  workloadRef:
    workloadName: hierarchical-workload
    templateName: workers-b
  schedulingPolicy:
    gang:
      minCount: 4
---
apiVersion: v1
kind: Pod
metadata:
  name: worker-a-0
  namespace: default
spec:
  schedulingGroup:
    podGroupName: workers-a-0
  containers:
  - name: worker
    image: registry.k8s.io/pause:3.9
```

<!--
The `Workload` acts as a long-lived policy template, while `CompositePodGroup` and
`PodGroup` resources handle per-instance runtime scheduling state.
-->
`Workload` 充当长期存在的策略模板，
而 `CompositePodGroup` 和 `PodGroup` 资源负责处理每个实例的运行时调度状态。

## {{% heading "whatsnext" %}}

<!--
* Read about the [CompositePodGroup lifecycle](/docs/concepts/workloads/compositepodgroup-api/lifecycle/).
* Learn about the [Workload API](/docs/concepts/workloads/workload-api/) and template definitions.
* See how leaf groups are structured in the [PodGroup API](/docs/concepts/workloads/podgroup-api/).
* Read about [PodGroup scheduling policies](/docs/concepts/workloads/workload-api/policies/).
* Learn about [Workload-aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/).
-->
* 阅读 [CompositePodGroup 生命周期](/zh-cn/docs/concepts/workloads/compositepodgroup-api/lifecycle/)。
* 了解 [Workload API](/zh-cn/docs/concepts/workloads/workload-api/) 和模板定义。
* 查看 [PodGroup API](/zh-cn/docs/concepts/workloads/podgroup-api/) 中叶子组的结构。
* 阅读 [PodGroup 调度策略](/zh-cn/docs/concepts/workloads/workload-api/policies/)。
* 了解[工作负载感知抢占](/zh-cn/docs/concepts/scheduling-eviction/workload-aware-preemption/)。
