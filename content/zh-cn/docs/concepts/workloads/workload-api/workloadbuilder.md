---
title: 调度构建块 API 与 workloadbuilder 库
content_type: concept
description: >-
  可重用的调度 API 原语，树内和树外工作负载控制器将其嵌入自己的 API 中，
  以及将这些原语编译为 Workload、PodGroup 和 CompositePodGroup 对象的共享
  workloadbuilder 库。
weight: 40
---
<!--
title: Scheduling Building Block APIs and the workloadbuilder Library
content_type: concept
description: >-
  Reusable scheduling API primitives that in-tree and out-of-tree workload controllers embed
  in their own APIs, and the shared workloadbuilder library that compiles them into Workload,
  PodGroup, and CompositePodGroup objects.
weight: 40
-->

<!-- overview -->

{{< feature-state feature_gate_name="GenericWorkload" >}}

<!--
Workload-aware Scheduling defines a set of reusable API *building blocks* under the
`scheduling.k8s.io` {{< glossary_tooltip text="API group" term_id="api-group" >}}.
Controller authors embed these primitives into their own APIs so that users express
scheduling intent (gang scheduling, topology, disruption behavior) with a consistent
schema across the ecosystem, and the shared `workloadbuilder` library compiles that
intent into the scheduler-facing [Workload](/docs/concepts/workloads/workload-api/),
[PodGroup](/docs/concepts/workloads/podgroup-api/), and [CompositePodGroup](/docs/concepts/workloads/workload-api/compositepodgroup-api/) objects.
-->
工作负载感知调度在 `scheduling.k8s.io`
{{< glossary_tooltip text="API 组" term_id="api-group" >}}下定义了一组可重用的 API **构建块**。
控制器作者可以将这些原语嵌入自己的 API，以便用户能够以一致的模式在整个生态系统中表达调度意图
（Gang 调度、拓扑、干扰行为），而共享的 `workloadbuilder` 库则把这种意图编译为面向调度器的
[Workload](/zh-cn/docs/concepts/workloads/workload-api/)、
[PodGroup](/zh-cn/docs/concepts/workloads/podgroup-api/) 和
[CompositePodGroup](/zh-cn/docs/concepts/workloads/compositepodgroup-api/) 对象。

<!--
The built-in consumer of these building blocks today is the
[Job](/docs/concepts/workloads/controllers/job/) controller, gated by the
`WorkloadWithJob` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).
-->
目前这些构建块的内置使用方是
[Job](/zh-cn/docs/concepts/workloads/controllers/job/) 控制器，它由 `WorkloadWithJob`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)控制启用。

<!-- body -->

<!--
## Reusable building blocks
-->
## 可重用的构建块   {#reusable-building-blocks}

<!--
The building blocks are strongly-typed Go structs in the `scheduling.k8s.io/v1alpha3`
API group. They are meant for *controller authors*: a controller embeds these structs into
its own API type as fields, and the `workloadbuilder` library compiles them. The type names
follow two conventions: leaf-level types are prefixed `WorkloadPodGroup...` (for example,
`WorkloadPodGroupSchedulingPolicy`) and the multi-level variants - `WorkloadCompositePodGroup...`.
-->
这些构建块是 `scheduling.k8s.io/v1alpha3` API 组中强类型的 Go 结构体。
它们是面向**控制器作者**的：控制器将这些结构体作为字段嵌入自己的 API 类型，
再由 `workloadbuilder` 库进行编译。类型名称遵循两种约定：
叶子级类型的名称以 `WorkloadPodGroup...` 为前缀（例如
`WorkloadPodGroupSchedulingPolicy`），多级变体则以 `WorkloadCompositePodGroup...` 为前缀。

<!--
Each controller chooses the field names and structure that are idiomatic for its own API, so
these blocks impose no fixed top-level shape. Although not strictly enforced, reusing the 
standard field names and structure is recommended, so that a user who has configured gang 
scheduling on one controller's resource recognizes the same options on another's.
-->
每个控制器都可以为自己的 API 选择惯用的字段名称和结构，因此这些构建块并不强制固定的顶层结构。
虽然并非硬性要求，但建议复用标准的字段名称和结构，这样在一个控制器的资源上配置过 Gang 调度的用户，
就能在另一个控制器的资源上认出相同的选项。

<!--
To adopt the building blocks, a controller adds the ones it wants to support as fields on
its own types. For example, the [Job](/docs/concepts/workloads/controllers/job/) API groups
all four of them into a single type reachable at `spec.scheduling`:
-->
要采用这些构建块，控制器可以把想要支持的那些构建块作为字段添加到自己的类型上。
例如，[Job](/zh-cn/docs/concepts/workloads/controllers/job/) API
把全部四种构建块归入一个可通过 `spec.scheduling` 访问的单一类型：

```go
type JobSchedulingConfiguration struct {
    SchedulingPolicy      *schedulingv1alpha3.WorkloadPodGroupSchedulingPolicy
    SchedulingConstraints *schedulingv1alpha3.WorkloadPodGroupSchedulingConstraints
    DisruptionMode        *schedulingv1alpha3.WorkloadPodGroupDisruptionMode
    ResourceClaims        []schedulingv1alpha3.WorkloadPodGroupResourceClaim
}
```

<!--
A different controller might nest the same blocks per component of a multi-part workload,
or support only a subset of them.
-->
另一个控制器可能会按照多组件工作负载的各个组件来嵌套相同的构建块，
也可能只支持其中的一部分。

<!--
### Scheduling policy
-->
### 调度策略   {#scheduling-policy}

<!--
The scheduling policy block carries the same `basic` and `gang` policies as a PodGroup's
`spec.schedulingPolicy`. See 
[PodGroup scheduling policies](/docs/concepts/workloads/workload-api/policies/)
for what each policy means and how the scheduler applies it.
-->
调度策略构建块所包含的 `basic` 和 `gang` 策略与 PodGroup 的
`spec.schedulingPolicy` 相同。关于每种策略的含义以及调度器如何应用它们，
参见 [PodGroup 调度策略](/zh-cn/docs/concepts/workloads/workload-api/policies/)。

<!--
The one difference is that the block's `gang` minimum count is optional. Users may leave
`minCount` unset, in which case the controller supplies a default that makes sense for its
own domain; the Job controller, for example, uses the Job's parallelism.
-->
唯一的区别是该构建块中 `gang` 的最小数量是可选的。
用户可以保持 `minCount` 未设置，此时控制器会提供一个适合自身领域的默认值；
例如，Job 控制器使用 Job 的并行度。

<!--
### Scheduling constraints
-->
### 调度约束   {#scheduling-constraints}

<!--
The scheduling constraints block carries the topology constraints documented in
[Topology-aware workload scheduling](/docs/concepts/workloads/workload-api/topology-aware-scheduling/):
a node label key naming the domain (such as a rack or a zone) that every Pod in the group
must share, with at most one topology constraint per group. Controllers should freeze the
field after creation, since constraints are immutable in the compiled Workload.
-->
调度约束构建块所包含的是[拓扑感知工作负载调度](/zh-cn/docs/concepts/workloads/workload-api/topology-aware-scheduling/)中所述的拓扑约束：
一个用于指定域（例如机架或可用区）的节点标签键，
组内每个 Pod 都必须共享该域；每个组最多只能有一个拓扑约束。
控制器应在创建后冻结该字段，因为在编译后的 Workload 中约束是不可变的。

<!--
### Disruption mode
-->
### 干扰模式   {#disruption-mode}

<!--
The disruption mode block selects whether the group's Pods may be disrupted individually
(`single`) or only as a unit (`all`), corresponding to the `Pod` and `PodGroup` disruption
modes documented in
[Pod group disruption and priority](/docs/concepts/workloads/workload-api/disruption-and-priority/).
-->
干扰模式构建块用于选择组内的 Pod 是可以被逐个干扰（`single`），
还是只能作为一个整体被干扰（`all`）；这与
[Pod 组干扰和优先级](/zh-cn/docs/concepts/workloads/workload-api/disruption-and-priority/)中所述的
`Pod` 和 `PodGroup` 两种干扰模式相对应。

<!--
The library rejects combinations that are not meaningful. For example, prevent `all` disruption mode 
for PodGroups with BasicSchedulingPolicy, because the preemption unit must not be larger than the 
scheduling unit - a group scheduled pod-by-pod has no group-level unit to preempt or disrupt.
-->
该库会拒绝没有意义的组合。例如，对于使用 BasicSchedulingPolicy 的 PodGroup，
应阻止其使用 `all` 干扰模式，因为抢占单元不能大于调度单元 ——
以逐 Pod 方式调度的组没有组级别的单元可供抢占或干扰。

<!--
### Resource claims
-->
### 资源申领   {#resource-claims}

<!--
The resource claims block expresses which
[dynamic resource allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
claims are shared by every Pod in the group rather than allocated per Pod. Each entry names
the claim within the group and points at either an existing
{{< glossary_tooltip text="ResourceClaim" term_id="resourceclaim" >}} or a
{{< glossary_tooltip text="ResourceClaimTemplate" term_id="resourceclaimtemplate" >}}
from which one is generated. A group may declare at most four claims.
-->
资源申领构建块用于表达哪些[动态资源分配](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)申领由组内每个
Pod 共享，而不是按 Pod 分别分配。每个条目都在组内为该申领命名，并指向一个现有的
{{< glossary_tooltip text="ResourceClaim" term_id="resourceclaim" >}} 或
{{< glossary_tooltip text="ResourceClaimTemplate" term_id="resourceclaimtemplate" >}}，
申领由后者生成。一个组最多可以声明四个申领。

<!--
Pods consume the devices allocated to the group by declaring a matching claim in their own
spec, using the same name and referring to the same object.
-->
Pod 通过在自己的规约中声明一个匹配的申领来使用分配给该组的设备，使用相同的名称并引用同一个对象。

<!--
### Composite building blocks
-->
### 复合构建块   {#composite-building-blocks}

<!--
Multi-level controllers that orchestrate other controllers (for example, JobSet
creating Jobs) coordinate a *group of groups*. For that layer, the API provides an
analogous set of primitives prefixed with `WorkloadCompositePodGroup...`
(for example `WorkloadCompositePodGroupSchedulingPolicy`). They follow the same shapes as
the leaf-level blocks, except the composite gang policy uses `minGroupCount` (the minimum
number of child groups that must be schedulable together) in place of the leaf's
`minCount`. Keeping leaf and composite types distinct lets each hierarchy level evolve
independently.
-->
编排其他控制器的多级控制器（例如用 JobSet 创建 Job）需要协调**组之组**。
针对这一层，API 提供了一组类似的原语，名称以 `WorkloadCompositePodGroup...` 为前缀
（例如 `WorkloadCompositePodGroupSchedulingPolicy`）。它们的形态与叶子级构建块相同，
只是复合的 gang 策略使用 `minGroupCount`（必须能够一起调度的最小子组数）来代替叶子级的 `minCount`。
将叶子类型和复合类型区分开来，可以让每个层级独立演进。

<!--
### Example: the Job integration
-->
### 示例：Job 集成   {#example-the-job-integration}

<!--
The Job controller is the built-in example of these blocks in use. A user fills in a Job's
`spec.scheduling`, and the controller compiles it into a Workload and PodGroup. See
[Integrate with Workload APIs](/docs/concepts/workloads/controllers/job/#integrate-with-workload-apis)
for a complete Job manifest, the defaults that apply when `spec.scheduling` is omitted, and
which fields you can change after creation.
-->
Job 控制器是这些构建块的内置使用示例。
用户填写 Job 的 `spec.scheduling`，控制器会将其编译为 Workload 和 PodGroup。
关于完整的 Job 清单、省略 `spec.scheduling` 时适用的默认值，以及创建后可更改哪些字段，
参见[与 Workload API 集成](/zh-cn/docs/concepts/workloads/controllers/job/#integrate-with-workload-apis)。

<!--
## The workloadbuilder library
-->
## workloadbuilder 库   {#the-workloadbuilder-library}

<!--
`workloadbuilder` is a shared Go library that turns a controller's scheduling intent into
the scheduler-facing Workload and its runtime PodGroup/CompositePodGroup objects, so each
controller does not reimplement defaulting, validation, and template compilation. It is designed for both
in-tree controllers (such as the Job controller) and out-of-tree controllers (such as
JobSet or Kubeflow TrainJob), which vendor it like any other Go dependency. It ships from
`k8s.io/component-helpers/scheduling/schedulingv1/workloadbuilder`.
-->
`workloadbuilder` 是一个共享的 Go 库，它把控制器的调度意图转换为面向调度器的 Workload 及其运行时的
PodGroup/CompositePodGroup 对象，这样每个控制器都不必重新实现默认值填充、验证和模板编译。
它同时面向树内控制器（例如 Job 控制器）和树外控制器（例如 JobSet 或 Kubeflow TrainJob），
后者像引入其他任何 Go 依赖一样将它像供应商一样加进来。
该库位于 `k8s.io/component-helpers/scheduling/schedulingv1/workloadbuilder`。

<!--
The library consumes the `scheduling.k8s.io/v1alpha3` building blocks and compiles them into
`scheduling.k8s.io/v1beta1` Workload and PodGroup objects, while CompositePodGroup
objects remain `scheduling.k8s.io/v1alpha3`.
-->
该库使用 `scheduling.k8s.io/v1alpha3` 的构建块，
将它们编译为 `scheduling.k8s.io/v1beta1` 的 Workload 和 PodGroup 对象，
而 CompositePodGroup 对象仍为 `scheduling.k8s.io/v1alpha3`。

<!--
### How a controller uses it
-->
### 控制器如何使用该库   {#how-a-controller-uses-it}

<!--
A controller describes its workload as a tree of `WorkloadItem` nodes, one per logical
component. A node with no children becomes a single `PodGroupTemplate`, while a node with
children becomes a `CompositePodGroupTemplate` over them, which is how a multi-level
controller represents a group of groups. Each node carries:
-->
控制器将其工作负载描述为由 `WorkloadItem` 节点组成的树，每个逻辑组件对应一个节点。
没有子节点的节点会变成单个 `PodGroupTemplate`，
而有子节点的节点则会覆盖这些子节点而成为一个 `CompositePodGroupTemplate`，
多级控制器正是以此来表示组之组。每个节点都带有：

<!--
* a *default config*, the controller's own defaults for anything the user leaves unset. This
  is where a controller decides, for example, that an unconfigured Job stays on `basic`
  scheduling.
* an *input*, the user's intent taken from the controller's API. The controller records each
  building block together with the field path it lives at, so validation errors point at the
  exact field the user set.
* optional *callbacks*, which adjust the merged configuration. This is how a controller
  supplies a context-specific default, such as filling in an unset gang minimum count from
  the Job's parallelism.
-->
- 一份**默认配置**，即控制器针对用户未设置的所有内容所提供的自身默认值。
  例如，控制器可以在这里决定，未配置的 Job 继续使用 `basic` 调度。
- 一份**输入**，即取自控制器 API 的用户意图。
  控制器会记录每个构建块及其所在的字段路径，
  因此验证错误会指向用户实际设置的那个准确字段。
- 可选的**回调**，用于调整合并后的配置。
  控制器正是以此提供与上下文相关的默认值，
  例如根据 Job 的并行度填充未设置的 gang 最小数量。

<!--
The controller then hands that tree to a `Builder` and works through four calls:
-->
然后，控制器把这棵树交给一个 `Builder`，并依次执行四次调用：

<!--
1. `NewBuilder` constructs the builder from the tree, along with the name, namespace, and
   owner reference for the object to be produced. The owner becomes the Workload's
   controller reference, which is used for discovery and garbage collection.
1. `Validate` resolves the tree and reports any problems as a list of field errors, which a
   controller returns from its own API validation.
1. `BuildWorkload` compiles the tree into a Workload. The result is cached, so several
   PodGroups can be created from one compiled result.
1. `NewPodGroup` creates a runtime PodGroup from one of the compiled templates, naming the
   template it should be built from.
-->
1. `NewBuilder` 根据这棵树构造构建器，
   同时指定要生成的对象的名称、名字空间和属主引用。
   该属主会成为 Workload 的控制器引用，用于资源发现和垃圾回收。
2. `Validate` 解析这棵树，并将任何问题以字段错误列表的形式报告出来，
   控制器会从自己的 API 验证中返回这些错误。
3. `BuildWorkload` 把这棵树编译为 Workload。
   结果会被缓存，因此可以基于同一个编译结果创建多个 PodGroup。
4. `NewPodGroup` 根据某个已编译的模板创建运行时 PodGroup，
   并指定应基于哪个模板来构建它。

<!--
```go
builder := workloadbuilder.NewBuilder(item, opts)
if errs := builder.Validate(ctx, workloadbuilder.ValidationInput{}); len(errs) > 0 {
    // reject the request
}
workload, err := builder.BuildWorkload()
podGroup, err := builder.NewPodGroup("trainer-pg", item.Name)
```
-->
```go
builder := workloadbuilder.NewBuilder(item, opts)
if errs := builder.Validate(ctx, workloadbuilder.ValidationInput{}); len(errs) > 0 {
    // 拒绝该请求
}
workload, err := builder.BuildWorkload()
podGroup, err := builder.NewPodGroup("trainer-pg", item.Name)
```

<!--
For complete, runnable versions of this flow, including how the Job controller wires it up,
see the examples in the
[package reference](https://pkg.go.dev/k8s.io/component-helpers/scheduling/schedulingv1/workloadbuilder).
-->
关于此流程完整、可运行的版本（包括 Job 控制器如何将其串联起来），
请参见[包参考](https://pkg.go.dev/k8s.io/component-helpers/scheduling/schedulingv1/workloadbuilder)中的示例。

<!--
### Validating a scheduling configuration
-->
### 验证调度配置   {#validating-a-scheduling-configuration}

<!--
`Validate` checks a configuration in two layers:
-->
`Validate` 分两层检查配置：

<!--
* **Structural validation** of the building blocks themselves: required fields, value ranges,
  the rule that exactly one member of a union is set, and immutability. These checks come from
  [declarative validation](/docs/reference/using-api/declarative-validation/) rules generated
  from the API types.
* **Controller-policy checks** that declarative validation cannot express: the allow-lists
  described below, and cross-field rules such as rejecting the `all` disruption mode alongside
  the `basic` policy.
-->
- 对构建块本身的**结构验证**：必填字段、取值范围、联合类型中恰好设置一个成员的规则，以及不可变性。
  这些检查来自根据 API 类型生成的[声明式验证](/zh-cn/docs/reference/using-api/declarative-validation/)规则。
- **控制器策略检查**，这是声明式验证无法表达的：
  下文所述的允许列表，以及诸如在 `basic` 策略下拒绝 `all` 干扰模式之类的跨字段规则。

<!--
Validation also differs between creating and updating an object. On an update, the library
additionally enforces the fields that are frozen after creation, which means the controller
has to supply the previously stored configuration along with the new one. On a create there is
nothing to compare against, so those checks do not apply.
-->
验证在创建对象和更新对象时也有所不同。
更新时，该库还会额外强制检查创建后被冻结的字段，
这意味着控制器必须同时提供之前存储的配置和新配置。
创建时没有可比较的对象，因此这些检查不适用。

<!--
#### Opting out of declarative validation
-->
#### 退出声明式验证   {#opting-out-of-declarative-validation}

<!--
Whether you want the first layer depends on where your controller runs, and one option
controls it:
-->
是否需要第一层取决于你的控制器运行在哪里，有一个选项可以控制它：

<!--
* **Out-of-tree controllers** leave declarative validation enabled, which is the default.
  Nothing else applies those structural rules to a custom resource, so a single `Validate`
  call covers both layers.
* **In-tree controllers** set `DisableDeclarativeValidation`, because the API server already
  runs declarative validation on the embedded blocks while validating the parent object.
  Skipping the first layer avoids checking the same fields twice, leaving `Validate` to run
  only the controller-policy checks.
-->
- **树外控制器**保持声明式验证为启用状态，这也是默认行为。
  对于自定义资源，没有其他机制会应用这些结构规则，
  因此一次 `Validate` 调用即可覆盖两层。
- **树内控制器**会设置 `DisableDeclarativeValidation`，
  因为 API 服务器在验证父对象时已经对内嵌的构建块运行了声明式验证。
  跳过第一层可以避免重复检查相同的字段，让 `Validate` 只运行控制器策略检查。

<!--
#### Opting in to scheduling options
-->
#### 选择启用调度选项   {#opting-in-to-scheduling-options}

<!--
Because the building-block types are shared across controllers, future releases may add
scheduling options that do not make sense for every controller. To keep new options from
silently leaking in, `workloadbuilder` uses an allow-list model: a controller declares the
policies and disruption modes it supports, and `Validate` rejects anything outside that set,
reporting the error at the offending block's field path.
-->
由于构建块类型由各个控制器共享，未来的发行版本可能会添加对某些控制器并不适用的调度选项。
为防止新选项悄无声息地渗入，`workloadbuilder` 采用允许列表模型：
控制器声明其支持的策略和干扰模式，`Validate` 会拒绝该集合之外的任何内容，
并在违规构建块的字段路径处报告错误。

<!--
Options are therefore denied by default. When a new policy is introduced, an existing
controller keeps rejecting it until its maintainers extend the allow-list, which for an
out-of-tree controller means updating its vendored copy of the library as well.
-->
因此，选项默认被拒绝。引入新策略时，现有控制器会一直拒绝它，
直到其维护者扩展允许列表为止；对树外控制器而言，这还意味着要一并更新其 vendor 的库副本。

```go
builder := workloadbuilder.NewBuilder(item, workloadbuilder.BuildOptions{
    Owner:                  owner,
    AllowedPolicies:        []workloadbuilder.SchedulingPolicyOption{workloadbuilder.BasicPolicy, workloadbuilder.GangPolicy},
    AllowedDisruptionModes: []workloadbuilder.DisruptionModeOption{workloadbuilder.SingleMode, workloadbuilder.AllMode},
})
allErrs := builder.Validate(ctx, workloadbuilder.ValidationInput{})
```

<!--
### Generating PodGroups from an existing Workload
-->
### 从现有 Workload 生成 PodGroup   {#generating-podgroups-from-an-existing-workload}

<!--
When the Workload already exists, whether compiled by a parent controller or created manually,
a child controller that only manages the runtime PodGroup uses `NewBuilderFromExistingWorkload`
instead. That builder creates PodGroup objects from the supplied Workload using its own owner
reference. It does not validate or compile anything, so the existing Workload is never
recompiled.
-->
当 Workload 已经存在时（无论它是由父控制器编译而来，还是手工创建的），
只管理运行时 PodGroup 的子控制器应改用 `NewBuilderFromExistingWorkload`。
该构建器使用自己的属主引用，从提供的 Workload 创建 PodGroup 对象。
它不进行任何验证或编译，因此现有的 Workload 永远不会被重新编译。

```go
builder := workloadbuilder.NewBuilderFromExistingWorkload(parentWorkload, workloadbuilder.BuildOptions{Owner: owner})
podGroup, err := builder.NewPodGroup("trainer-pg", "trainer-pgt-0")
```

## {{% heading "whatsnext" %}}

<!--
* Learn about [PodGroup scheduling policies](/docs/concepts/workloads/workload-api/policies/).
* Learn about [Pod group disruption and priority](/docs/concepts/workloads/workload-api/disruption-and-priority/).
* Learn about [Topology-aware workload scheduling](/docs/concepts/workloads/workload-api/topology-aware-scheduling/).
* See the [Workload API](/docs/concepts/workloads/workload-api/) overview.
* See how the Job controller [integrates with the Workload APIs](/docs/concepts/workloads/controllers/job/#integrate-with-workload-apis).
* Read the [`workloadbuilder` package reference](https://pkg.go.dev/k8s.io/component-helpers/scheduling/schedulingv1/workloadbuilder).
-->
- 了解 [PodGroup 调度策略](/zh-cn/docs/concepts/workloads/workload-api/policies/)。
- 了解 [Pod 组干扰和优先级](/zh-cn/docs/concepts/workloads/workload-api/disruption-and-priority/)。
- 了解[拓扑感知工作负载调度](/zh-cn/docs/concepts/workloads/workload-api/topology-aware-scheduling/)。
- 查看 [Workload API](/zh-cn/docs/concepts/workloads/workload-api/) 概述。
- 了解 Job 控制器如何[与 Workload API 集成](/zh-cn/docs/concepts/workloads/controllers/job/#integrate-with-workload-apis)。
- 阅读 [`workloadbuilder` 包参考](https://pkg.go.dev/k8s.io/component-helpers/scheduling/schedulingv1/workloadbuilder)。
