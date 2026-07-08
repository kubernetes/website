---
layout: blog
title: "Kubernetes 1.33：卷填充器进阶至 GA"
date: 2025-05-08T10:30:00-08:00
slug: kubernetes-v1-33-volume-populators-ga
author: >
  Danna Wang (Google)
  Sunny Song (Google)
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes 1.33: Volume Populators Graduate to GA"
date: 2025-05-08T10:30:00-08:00
slug: kubernetes-v1-33-volume-populators-ga
author: >
  Danna Wang (Google)
  Sunny Song (Google)
-->

<!--
Kubernetes _volume populators_ are now  generally available (GA)! The `AnyVolumeDataSource` feature
gate is treated as always enabled for Kubernetes v1.33, which means that users can specify any appropriate
[custom resource](/docs/concepts/extend-kubernetes/api-extension/custom-resources/#custom-resources)
as the data source of a PersistentVolumeClaim (PVC).

An example of how to use dataSourceRef in PVC:
-->
Kubernetes 的**卷填充器**现已进阶至 GA（正式发布）！
`AnyVolumeDataSource` 特性门控在 Kubernetes v1.33 中设为始终启用，
这意味着用户可以将任何合适的[自定义资源](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/#custom-resources)作为
PersistentVolumeClaim（PVC）的数据源。

以下是如何在 PVC 中使用 dataSourceRef 的示例：

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc1
spec:
  ...
  dataSourceRef:
    apiGroup: provider.example.com
    kind: Provider
    name: provider1
```

<!--
## What is new

There are four major enhancements from beta.

### Populator Pod is optional

During the beta phase, contributors to Kubernetes identified potential resource leaks with PersistentVolumeClaim (PVC) deletion while volume population was in progress; these leaks happened due to limitations in finalizer handling.
Ahead of the graduation to general availability, the Kubernetes project added support to delete temporary resources (PVC prime, etc.) if the original PVC is deleted.
-->
## 新变化   {#what-is-new}

从 Beta 进阶到 GA 后，主要有四个增强。

### 填充器 Pod 成为可选   {#populator-pod-is-optional}

在 Beta 阶段，Kubernetes 的贡献者们发现当正在进行卷填充时删除
PersistentVolumeClaim（PVC）可能导致资源泄露问题，这些泄漏是由于 Finalizer 处理机制的局限性所致。
在进阶至 GA 之前，Kubernetes 项目增加了在原始 PVC 被删除时对删除临时资源（PVC 派生体等）的支持。

<!--
To accommodate this, we've introduced three new plugin-based functions:
* `PopulateFn()`: Executes the provider-specific data population logic.
* `PopulateCompleteFn()`: Checks if the data population operation has finished successfully.
* `PopulateCleanupFn()`: Cleans up temporary resources created by the provider-specific functions after data population is completed

A provider example is added in [lib-volume-populator/example](https://github.com/kubernetes-csi/lib-volume-populator/tree/master/example).
-->
为支持此能力，我们引入了三个基于插件的新函数：

* `PopulateFn()`：执行特定于提供程序的数据填充逻辑。
* `PopulateCompleteFn()`：检查数据填充操作是否成功完成。
* `PopulateCleanupFn()`：在数据填充完成后，清理由提供程序特定函数创建的临时资源。

有关提供程序的例子，参见
[lib-volume-populator/example](https://github.com/kubernetes-csi/lib-volume-populator/tree/master/example)。

<!--
### Mutator functions to modify the Kubernetes resources

For GA, the CSI volume populator controller code gained a `MutatorConfig`, allowing the specification of mutator functions to modify Kubernetes resources.
For example, if the PVC prime is not an exact copy of the PVC and you need provider-specific information for the driver, you can include this information in the optional `MutatorConfig`. 
This allows you to customize the Kubernetes objects in the volume populator.
-->
### 支持修改 Kubernetes 资源的 Mutator 函数

在 GA 版本中，CSI 卷填充器控制器代码新增了 `MutatorConfig`，允许指定 Mutator 函数用于修改 Kubernetes 资源。
例如，如果 PVC 派生体不是 PVC 的完美副本，并且你需要为驱动提供一些特定于提供程序的信息，
你可以通过可选的 `MutatorConfig` 将这些信息加入。这使你能够自定义卷填充器中的 Kubernetes 对象。

<!--
### Flexible metric handling for providers

Our beta phase highlighted a new requirement: the need to aggregate metrics not just from lib-volume-populator, but also from other components within the provider's codebase.
-->
### 灵活处理提供程序的指标

在 Beta 阶段，我们发现一个新需求：不仅需要从 lib-volume-populator
聚合指标，还要能够从提供程序代码库中的其他组件聚合指标。

<!--
To address this, SIG Storage introduced a [provider metric manager](https://github.com/kubernetes-csi/lib-volume-populator/blob/8a922a5302fdba13a6c27328ee50e5396940214b/populator-machinery/controller.go#L122).
This enhancement delegates the implementation of metrics logic to the provider itself, rather than relying solely on lib-volume-populator.
This shift provides greater flexibility and control over metrics collection and aggregation, enabling a more comprehensive view of provider performance.
-->
为此，SIG Storage 引入了一个[提供程序指标管理器](https://github.com/kubernetes-csi/lib-volume-populator/blob/8a922a5302fdba13a6c27328ee50e5396940214b/populator-machinery/controller.go#L122)。
此增强特性将指标逻辑的实现委托给提供程序自身，而不再仅仅依赖于 lib-volume-populator。
这种转变使指标收集与聚合更灵活、更好控制，有助于更好地观察提供程序的总体性能。

<!--
### Clean up for temporary resources

During the beta phase, we identified potential resource leaks with PersistentVolumeClaim (PVC) deletion while volume population was in progress, due to limitations in finalizer handling. We have improved the populator to support the deletion of temporary resources (PVC prime, etc.) if the original PVC is deleted in this GA release.
-->
### 清理临时资源

在 Beta 阶段，我们发现当卷填充过程尚未完成时删除 PVC 会导致资源泄露问题，这是由于
Finalizer 的局限性引起的。在 GA 版本中，我们改善了填充器特性，在原始 PVC 被删除时支持删除临时资源（如 PVC 派生体等）。

<!--
## How to use it

To try it out, please follow the [steps](/blog/2022/05/16/volume-populators-beta/#trying-it-out) in the previous beta blog.

## Future directions and potential feature requests

For next step, there are several potential feature requests for volume populator:
-->
## 如何使用   {#how-to-use-it}

如需试用，请参考之前 Beta 版本博客中的[操作步骤](/zh-cn/blog/2022/05/16/volume-populators-beta/#trying-it-out)。

## 后续方向与潜在特性请求   {#future-directions-and-potential-feature-requests}

下一阶段，卷填充器可能会引入以下特性请求：

<!--
* Multi sync: the current implementation is a one-time unidirectional sync from source to destination. This can be extended to support multiple syncs, enabling periodic syncs or allowing users to sync on demand
* Bidirectional sync: an extension of multi sync above, but making it bidirectional between source and destination
* Populate data with priorities: with a list of different dataSourceRef, populate based on priorities
* Populate data from multiple sources of the same provider: populate multiple different sources to one destination
* Populate data from multiple sources of the different providers: populate multiple different sources to one destination, pipelining different resources’ population
-->
* 多次同步：当前实现是从源到目的地的一次性单向同步，可以扩展为支持周期性同步或允许用户按需同步。
* 双向同步：多次同步的扩展版本，实现源与目的地之间的双向同步。
* 基于优先级的数据填充：提供多个 dataSourceRef，并按优先级进行数据填充。
* 从同一提供程序的多个源填充数据：将多个不同源填充到同一个目的地。
* 从不同提供程序的多个源填充数据：将多个不同源填充到一个目的地，支持流水线式的不同资源的填充。

<!--
To ensure we're building something truly valuable, Kubernetes SIG Storage would love to hear about any specific use cases you have in mind for this feature.
For any inquiries or specific questions related to volume populator, please reach out to the [SIG Storage community](https://github.com/kubernetes/community/tree/master/sig-storage).
-->
为了确保我们构建的特性真正有价值，Kubernetes SIG Storage 非常希望了解你所知道的与此特性有关的任何具体使用场景。
如有任何关于卷填充器的疑问或特定问题，请联系
[SIG Storage 社区](https://github.com/kubernetes/community/tree/master/sig-storage)。
