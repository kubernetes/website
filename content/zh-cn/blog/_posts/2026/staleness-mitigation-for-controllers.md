---
layout: blog
title: "Kubernetes v1.36：控制器的陈旧性缓解和可观测性"
date: 2026-04-28T10:35:00-08:00
slug: kubernetes-v1-36-staleness-mitigation-for-controllers
author: >
  [Michael Aspinwall](https://github.com/michaelasp) (Google)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.36: Staleness Mitigation and Observability for Controllers"
date: 2026-04-28T10:35:00-08:00
slug: kubernetes-v1-36-staleness-mitigation-for-controllers
author: >
  [Michael Aspinwall](https://github.com/michaelasp) (Google)
---
-->

<!--
Staleness in Kubernetes controllers is a problem that affects many controllers, and is something may affect controller behavior
in subtle ways. It is usually not until it is too late, when a controller in production has already taken incorrect action, that
staleness is found to be an issue due to some underlying assumption made by the controller author. Some issues caused by staleness
include controllers taking incorrect actions, controllers not taking action when they should, and controllers taking too long to
take action. I am excited to announce that Kubernetes v1.36 includes new features that help mitigate staleness in controllers
and provide better observability into controller behavior.
-->
Kubernetes 控制器中的陈旧性是一个影响许多控制器的问题，它可能以微妙的方式影响控制器行为。
通常直到为时已晚，当生产环境中的控制器已经采取了错误操作时，由于控制器作者做出的某些潜在假设，
陈旧性才被发现是一个问题。
陈旧性导致的一些问题包括控制器采取不正确的操作、控制器在应该采取行动时没有采取行动，
以及控制器采取行动的时间过长。
我很高兴地宣布，Kubernetes v1.36 增加了有助于缓解控制器陈旧性并提供更好的控制器行为可观测性的新特性。

<!--
## What is staleness?
-->
## 什么是陈旧性？

<!--
Staleness in controllers comes from an outdated view of the world inside of the controller cache. In order to provide a fast user
experience, controllers typically maintain a local cache of the state of the cluster. This cache is populated by watching the
Kubernetes API server for changes to objects that the controller cares about. When the controller needs to take action, it will
first check its cache to see if it has the latest information. If it does not, it will then update its cache by watching the API
server for changes to objects that the controller cares about. This process is known as _reconciliation_.
-->
控制器中的陈旧性来自控制器缓存中过时的状态视图。
为了提供快速的用户体验，控制器通常维护集群状态的本地缓存。
这个缓存通过监视 Kubernetes API 服务器来获取控制器关心的对象的更改来填充。
当控制器需要采取行动时，它首先检查其缓存以查看是否有最新信息。
如果没有，它将通过监视 API 服务器来更新其缓存，以获取控制器关心的对象的更改。
这个过程被称为**调谐**。

<!--
However, there are some cases where the controller's cache may be outdated. For example, if the controller is restarted, it will
need to rebuild its cache by watching the API server for changes to objects that the controller cares about. During this time, the
controller's cache will be outdated, and it will not be able to take action. Additionally, if the API server is down, the controller's
cache will not be updated, and it will not be able to take action. These are just a few examples of cases where the controller's
cache may be outdated.
-->
然而，在某些情况下，控制器的缓存可能会过时。
例如，如果控制器重新启动，它需要通过监视 API 服务器来重建其缓存，
以获取控制器关心的对象的更改。在此期间，控制器的缓存将是过时的，它将无法采取行动。
此外，如果 API 服务器宕机，控制器的缓存将不会更新，它也将无法采取行动。
这些只是控制器缓存可能过时的几个例子。

<!--
## Improvements in 1.36
-->
## 1.36 中的改进

<!--
Kubernetes v1.36 includes improvements in both client-go as well as implementations of highly contended controllers in
kube-controller-manager, using those client-go improvements. 
-->
Kubernetes v1.36 改进了 client-go，
并利用 client-go 的改进实现了 kube-controller-manager 中高竞争控制器的改进。

<!--
### client-go improvements
-->
### client-go 改进

<!--
In client-go, the project added _atomic FIFO processing_ (feature gate
name `AtomicFIFO`), which is on top of the existing FIFO queue implementation. The new approach allows for
the queue to atomically handle operations that are received in batches, such as the initial set of objects from a 
_list_ operation that an informer uses to populate its cache. This ensures that the queue is always in a consistent state,
even when events come out of order. Prior to this, events were added to the queue
in the order that they were received, which could lead to an inconsistent state in the cache that does not accurately reflect
the state of the cluster.
-->
在 client-go 中，项目添加**原子 FIFO 处理**（特性门控名称 `AtomicFIFO`），
它建立在现有的 FIFO 队列实现之上。
新方法允许队列原子地处理批量接收的操作，例如 Informer 用于填充其缓存的
**list** 操作中的初始对象集。
这确保队列始终处于一致状态，即使事件乱序到达。
在此之前，事件按接收顺序添加到队列中，这可能导致缓存中的状态不一致，无法准确反映集群的状态。

<!--
With this change, you can now ensure that the queue is always in a consistent state, even when events come out of order. To take
advantage of this, clients using client-go can now introspect into the cache to determine the latest resource version that the
controller cache has seen. This is done with the newly added function `LastStoreSyncResourceVersion()` implemented on the `Store`
interface [here](https://pkg.go.dev/k8s.io/client-go@v0.36.0/tools/cache#Store). This function is the basis for the staleness mitigation 
features in kube-controller-manager.
-->
通过此更改，即使事件乱序到达，你现在也可以确保队列始终处于一致状态。
为了利用这一点，使用 client-go 的客户端现在可以查询缓存状态，
以确定控制器缓存所看到的最新资源版本。
这是通过在 `Store` 接口上新添加的 `LastStoreSyncResourceVersion()`
函数实现的[此处](https://pkg.go.dev/k8s.io/client-go@v0.36.0/tools/cache#Store)。
此函数是 kube-controller-manager 中陈旧性缓解特性的基础。

<!--
### kube-controller-manager improvements
-->
### kube-controller-manager 改进

<!--
In kube-controller-manager, the v1.36 release has added the ability for 4 different controllers to use this new capability. The controllers are:

1. DaemonSet controller
2. StatefulSet controller
3. ReplicaSet controller
4. Job controller
-->
在 kube-controller-manager 中，v1.36 版本添加了 4 个不同控制器使用此新特性的能力。
这些控制器是：

1. DaemonSet 控制器
2. StatefulSet 控制器
3. ReplicaSet 控制器
4. Job 控制器

<!--
These controllers all act on pods, which in most cases are under the highest amount of contention in a cluster. The changes are
on by default for these controllers, and can be disabled by setting the feature gates `StaleControllerConsistency<API type>`
to `false` for the specific controller you wish to disable it for. For example, to disable the feature for the DaemonSet controller,
you would set the feature gate `StaleControllerConsistencyDaemonSet` to `false`.
-->
这些控制器都作用于 Pod，在大多数情况下，Pod 是集群中竞争最激烈的资源。
这些更改默认对这些控制器启用，
可以通过为要禁用的特定控制器设置特性门控 `StaleControllerConsistency<API type>` 为 `false` 来禁用。
例如，要为 DaemonSet 控制器禁用此特性，你需要设置特性门控 `StaleControllerConsistencyDaemonSet` 为 `false`。

<!--
When the relevant feature gate is enabled, the controller will first check the latest 
[resource version](/docs/reference/using-api/api-concepts/#resource-versions) of the cache before taking action. If the
latest resource version of the cache is lower than what the controller has written to the API server for the object it is trying to
reconcile, the controller will not take action. This is because the controller's cache is outdated, and it does not have the latest
information about the state of the cluster.
-->
当相关特性门控启用时，
控制器在采取行动之前将首先检查缓存的最新[资源版本](/zh-cn/docs/reference/using-api/api-concepts/#resource-versions)。
如果缓存的最新资源版本低于控制器为其尝试协调的对象写入 API 服务器的版本，
控制器将不会采取行动。这是因为控制器的缓存已过时，它没有关于集群状态的最新信息。

<!--
### Use for informer authors
-->
### 面向 Informer 作者的使用方式

<!--
Informer authors using client-go can also immediately take advantage of these improvements. See an example of how to use this feature 
in the [ReplicaSet informer](https://github.com/kubernetes/kubernetes/pull/137212). This PR shows how to use the new feature to check 
if the informer's cache is stale before taking action. The client-go library provides a `ConsistencyStore` data structure that queries the store
and compares the latest resource version of the cache with the written resource version of the object. 
-->
使用 client-go 的 Informer 作者也可以立即利用这些改进。
请参阅 [ReplicaSet Informer](https://github.com/kubernetes/kubernetes/pull/137212)
中如何使用此功能的示例。此 PR 展示了如何使用新功能在采取行动之前检查 Informer 的缓存是否陈旧。
client-go 库提供了一个 `ConsistencyStore` 数据结构，
它查询存储并将缓存的最新资源版本与对象的写入资源版本进行比较。

<!--
The ReplicaSet controller tracks both the ReplicaSet's resource version and the resource version of the pods that the ReplicaSet 
manages. For a specific ReplicaSet, it tracks the latest written resource version of the pods that the ReplicaSet owns as well as
any writes to the ReplicaSet itself. If the latest resource version of the cache is lower than what the controller has
written to the API server for the object it is trying to reconcile, the controller will not take action. This is because the
controller's cache is outdated, and it does not have the latest information about the state of the cluster.
-->
ReplicaSet 控制器跟踪 ReplicaSet 的资源版本以及 ReplicaSet 管理的 Pod 的资源版本。
对于特定的 ReplicaSet，它跟踪 ReplicaSet 拥有的 Pod 的最新写入资源版本以及对 ReplicaSet 本身的任何写入。
如果缓存的最新资源版本低于控制器为其尝试协调的对象写入 API 服务器的版本，控制器将不会采取行动。
这是因为控制器的缓存已过时，它没有关于集群状态的最新信息。

<!--
An informer author can use the `ConsistencyStore` to track the latest resource version of the objects that the informer cares about.
It provides 3 main functions:
-->
Informer 作者可以使用 `ConsistencyStore` 来跟踪 Informer 关心的对象的最新资源版本。
它提供了 3 个主要函数：

```go
type ConsistencyStore interface {
	// WroteAt records that the given object was written at the given resource version.
	WroteAt(owningObj runtime.Object, uid types.UID, groupResource schema.GroupResource, resourceVersion string)

	// EnsureReady returns true if the cache is up to date for the given object.
	// It is used prior to reconciliation to decide whether to reconcile or not.
	EnsureReady(namespacedName types.NamespacedName) bool

	// Clear removes the given object from the consistency store.
	// It is used when an object is deleted.
	Clear(namespacedName types.NamespacedName, uid types.UID)
}
```

<!--
1. `WroteAt`: This function is called by the controller when it writes to the API server for an object. It is used to record the 
latest resource version of the object that the controller has written to the API server. The `owningObj` is the object that the 
controller is reconciling, and the `uid` is the UID of that object. The resource version and GroupResource are the resource version 
and GroupResource of the object that the controller has written to the API server. The object is not explicitly tracked, since the 
controller only cares about waiting to catch up to the latest resource version of the written object.
2. `EnsureReady`: This function is called by the controller to ensure that the cache is up to date for the object. It is used prior 
to reconciliation to decide whether to reconcile or not. It returns true if the cache is up to date for the object, and false 
otherwise. It will use the information provided by `WroteAt` to determine if the cache is up to date.
3. `Clear`: This function is called by the controller when an object is deleted. It is used to remove the object from the consistency 
store. This is mostly used for cleanup when an object is deleted to prevent the consistency store from growing indefinitely.
-->
1. `WroteAt`：当控制器向 API 服务器写入对象时调用此函数。
   它用于记录控制器写入 API 服务器的对象的最新资源版本。
   `owningObj` 是控制器正在协调的对象，`uid` 是该对象的 UID。
   资源版本和 GroupResource 是控制器写入 API 服务器的对象的资源版本和 GroupResource。
   对象不会被显式跟踪，因为控制器只关心等待赶上写入对象的最新资源版本。
2. `EnsureReady`：控制器调用此函数以确保对象的缓存是最新的。
   它在协调之前用于决定是否进行协调。如果对象的缓存是最新的，它返回 true，否则返回 false。
   它将使用 `WroteAt` 提供的信息来确定缓存是否是最新的。
3. `Clear`：当对象被删除时，控制器调用此函数。
   它用于从一致性存储中删除对象。
   这主要用于在对象被删除时进行清理，以防止一致性存储无限增长。

<!--
The UID is used to distinguish between different objects that have the same name, such as when an object is deleted and then 
recreated. It is not needed for EnsureReady because the consistency store is only concerned with catching up to the latest resource 
version of the object, not the specific object. It is primarily used to ensure that the controller doesn't delete the entry for 
an object when it is recreated with a new UID.
-->
UID 用于区分具有相同名称的不同对象，例如当对象被删除然后重新创建时。
EnsureReady 不需要它，因为一致性存储只关心赶上对象的最新资源版本，而不是特定对象。
它主要用于确保控制器不会在对象使用新 UID 重新创建时删除该对象的条目。

<!--
With these 3 functions, an informer author can implement staleness mitigation in their controller.
-->
使用这 3 个函数，Informer 作者可以在其控制器中实现陈旧性缓解。

<!--
## Observability
-->
## 可观测性

<!--
In addition to the staleness mitigation features, the Kubernetes project has also added related instrumentation to kube-controller-manager
in 1.36. These metrics are also enabled by default, and are controlled using the same set of feature gates.
-->
除了陈旧性缓解功能外，Kubernetes 项目还在 1.36 中为 kube-controller-manager
添加了相关的插桩功能。这些指标也默认启用，并使用同一组特性门控进行控制。

<!--
### Metrics
-->
### 指标

<!--
The following [alpha metrics](/docs/reference/instrumentation/metrics/#list-of-alpha-kubernetes-metrics) have been added to kube-controller-manager in 1.36:
-->
以下 [Alpha 指标](/docs/reference/instrumentation/metrics/#list-of-alpha-kubernetes-metrics)
已在 1.36 中添加到 kube-controller-manager：

<!--
`stale_sync_skips_total`: The number of times the controller has skipped a sync due to stale cache. This metric is exposed
for each controller that uses the staleness mitigation feature with the subsystem of the controller.
-->
`stale_sync_skips_total`：控制器因缓存陈旧而跳过同步的次数。此指标为使用陈旧性缓解功能的每个控制器公开，带有控制器的子系统标签。

<!--
This metric is exposed by the kube-controller-manager metrics endpoint, and can be used to monitor the health of the controller.
-->
此指标由 kube-controller-manager 指标端点公开，可用于监控控制器的健康状况。

<!--
Along with this metric, client-go also emits metrics that expose the latest resource version of every shared informer
with the subsystem of the informer. This allows you to see the latest resource version of each informer, and use that to
determine if the controller's cache is stale, especially great for comparing against the resource version of the API server.
-->
除了此指标外，client-go 还发出公开每个共享 Informer 的最新资源版本的指标，带有 Informer 的子系统标签。
这允许你查看每个 Informer 的最新资源版本，并使用它来确定控制器的缓存是否陈旧，
特别适合与 API 服务器的资源版本进行比较。

<!--
This metric is named `store_resource_version` and has the Group, Version, and Resource as labels.
-->
此指标名为 `store_resource_version`，具有 Group、Version 和 Resource 作为标签。

<!--
## What's next?
-->
## 下一步是什么？

<!--
Kubernetes SIG API Machinery is excited to continue working on this feature and hope to bring it to more controllers in the future. 
We are also interested in hearing your feedback on this feature. Please let us know what you think in the comments
below or by opening an [issue](https://github.com/kubernetes/kubernetes/issues) on the Kubernetes GitHub repository.
-->
Kubernetes SIG API Machinery 很高兴继续开发此功能，
并希望将来将其推广到更多控制器。我们也很想听听你对此特性的反馈。
请在下面的评论中或通过在 Kubernetes GitHub 仓库上打开
[Issue](https://github.com/kubernetes/kubernetes/issues) 告诉我们你的想法。

<!--
We are also working with [controller-runtime](https://github.com/kubernetes-sigs/controller-runtime/pull/3473) to enable this set of
semantics for all controllers built with controller-runtime. This will allow any controller built with controller-runtime to gain
the benefits of read your own writes, without having to implement the logic themselves.
-->
我们还正在与 [controller-runtime](https://github.com/kubernetes-sigs/controller-runtime/pull/3473) 合作，
为所有使用 controller-runtime 构建的控制器启用这组语义。
这将允许任何使用 controller-runtime 构建的控制器获得"读取自己写入"的好处，而无需自己实现逻辑。
