---
title: 垃圾收集
content_type: concept
weight: 70
---
<!--
title: Garbage Collection
content_type: concept
weight: 70
-->

<!-- overview -->

<!--
{{<glossary_definition term_id="garbage-collection" length="short">}} This
allows the clean up of resources like the following:
-->
{{<glossary_definition term_id="garbage-collection" length="short">}}
垃圾收集允许系统清理如下资源：

<!--
* [Terminated pods](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)
* [Completed Jobs](/docs/concepts/workloads/controllers/ttlafterfinished/)
* [Objects without owner references](#owners-dependents)
* [Unused containers and container images](#containers-images)
* [Dynamically provisioned PersistentVolumes with a StorageClass reclaim policy of Delete](/docs/concepts/storage/persistent-volumes/#delete)
* [Stale or expired CertificateSigningRequests (CSRs)](/docs/reference/access-authn-authz/certificate-signing-requests/#request-signing-process)
* {{<glossary_tooltip text="Nodes" term_id="node">}} deleted in the following scenarios:
  * On a cloud when the cluster uses a [cloud controller manager](/docs/concepts/architecture/cloud-controller/)
  * On-premises when the cluster uses an addon similar to a cloud controller
    manager
* [Node Lease objects](/docs/concepts/architecture/nodes/#heartbeats)
-->
* [终止的 Pod](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)
* [已完成的 Job](/zh-cn/docs/concepts/workloads/controllers/ttlafterfinished/)
* [不再存在属主引用的对象](#owners-dependents)
* [未使用的容器和容器镜像](#containers-images)
* [动态制备的、StorageClass 回收策略为 Delete 的 PV 卷](/zh-cn/docs/concepts/storage/persistent-volumes/#delete)
* [阻滞或者过期的 CertificateSigningRequest (CSR)](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#request-signing-process)
* 在以下情形中删除了的{{<glossary_tooltip text="节点" term_id="node">}}对象：
  * 当集群使用[云控制器管理器](/zh-cn/docs/concepts/architecture/cloud-controller/)运行于云端时；
  * 当集群使用类似于云控制器管理器的插件运行在本地环境中时。
* [节点租约对象](/zh-cn/docs/concepts/architecture/nodes/#heartbeats)

<!--
## Owners and dependents {#owners-dependents}

Many objects in Kubernetes link to each other through [*owner references*](/docs/concepts/overview/working-with-objects/owners-dependents/).
Owner references tell the control plane which objects are dependent on others.
Kubernetes uses owner references to give the control plane, and other API
clients, the opportunity to clean up related resources before deleting an
object. In most cases, Kubernetes manages owner references automatically.
-->
## 属主与依赖   {#owners-dependents}

Kubernetes 中很多对象通过[**属主引用**](/zh-cn/docs/concepts/overview/working-with-objects/owners-dependents/)
链接到彼此。属主引用（Owner Reference）可以告诉控制面哪些对象依赖于其他对象。
Kubernetes 使用属主引用来为控制面以及其他 API 客户端在删除某对象时提供一个清理关联资源的机会。
在大多数场合，Kubernetes 都是自动管理属主引用的。

<!--
Ownership is different from the [labels and selectors](/docs/concepts/overview/working-with-objects/labels/)
mechanism that some resources also use. For example, consider a
{{<glossary_tooltip text="Service" term_id="service">}} that creates
`EndpointSlice` objects. The Service uses *labels* to allow the control plane to
determine which `EndpointSlice` objects are used for that Service. In addition
to the labels, each `EndpointSlice` that is managed on behalf of a Service has
an owner reference. Owner references help different parts of Kubernetes avoid
interfering with objects they don’t control.
-->
属主关系与某些资源所使用的[标签和选择算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/)不同。
例如，考虑一个创建 `EndpointSlice` 对象的 {{<glossary_tooltip text="Service" term_id="service">}}。
Service 使用**标签**来允许控制面确定哪些 `EndpointSlice` 对象被该 Service 使用。
除了标签，每个被 Service 托管的 `EndpointSlice` 对象还有一个属主引用属性。
属主引用可以帮助 Kubernetes 中的不同组件避免干预并非由它们控制的对象。

{{< note >}}
<!--
Cross-namespace owner references are disallowed by design.
Namespaced dependents can specify cluster-scoped or namespaced owners.
A namespaced owner **must** exist in the same namespace as the dependent.
If it does not, the owner reference is treated as absent, and the dependent
is subject to deletion once all owners are verified absent.
-->
根据设计，系统不允许出现跨名字空间的属主引用。名字空间作用域的依赖对象可以指定集群作用域或者名字空间作用域的属主。
名字空间作用域的属主**必须**存在于依赖对象所在的同一名字空间。
如果属主位于不同名字空间，则属主引用被视为不存在，而当检查发现所有属主都已不存在时，依赖对象会被删除。

<!--
Cluster-scoped dependents can only specify cluster-scoped owners.
In v1.20+, if a cluster-scoped dependent specifies a namespaced kind as an owner,
it is treated as having an unresolvable owner reference, and is not able to be garbage collected.
-->
集群作用域的依赖对象只能指定集群作用域的属主。
在 1.20 及更高版本中，如果一个集群作用域的依赖对象指定了某个名字空间作用域的类别作为其属主，
则该对象被视为拥有一个无法解析的属主引用，因而无法被垃圾收集处理。

<!--
In v1.20+, if the garbage collector detects an invalid cross-namespace `ownerReference`,
or a cluster-scoped dependent with an `ownerReference` referencing a namespaced kind, a warning Event
with a reason of `OwnerRefInvalidNamespace` and an `involvedObject` of the invalid dependent is reported.
You can check for that kind of Event by running
`kubectl get events -A --field-selector=reason=OwnerRefInvalidNamespace`.
-->
在 1.20 及更高版本中，如果垃圾收集器检测到非法的跨名字空间 `ownerReference`，
或者某集群作用域的依赖对象的 `ownerReference` 引用某名字空间作用域的类别，
系统会生成一个警告事件，其原因为 `OwnerRefInvalidNamespace` 和 `involvedObject`
设置为非法的依赖对象。你可以通过运行
`kubectl get events -A --field-selector=reason=OwnerRefInvalidNamespace`
来检查是否存在这类事件。
{{< /note >}}

<!--
## Cascading deletion {#cascading-deletion}

Kubernetes checks for and deletes objects that no longer have owner
references, like the pods left behind when you delete a ReplicaSet. When you
delete an object, you can control whether Kubernetes deletes the object's
dependents automatically, in a process called *cascading deletion*. There are
two types of cascading deletion, as follows:

* Foreground cascading deletion
* Background cascading deletion
-->
## 级联删除    {#cascading-deletion}

Kubernetes 会检查并删除那些不再拥有属主引用的对象，例如在你删除了 ReplicaSet
之后留下来的 Pod。当你删除某个对象时，你可以控制 Kubernetes 是否去自动删除该对象的依赖对象，
这个过程称为**级联删除（Cascading Deletion）**。
级联删除有两种类型，分别如下：

* 前台级联删除
* 后台级联删除

<!--
You can also control how and when garbage collection deletes resources that have
owner references using Kubernetes {{<glossary_tooltip text="finalizers" term_id="finalizer">}}.
-->
你也可以使用 Kubernetes {{<glossary_tooltip text="Finalizers" term_id="finalizer">}}
来控制垃圾收集机制如何以及何时删除包含属主引用的资源。

<!--
### Foreground cascading deletion {#foreground-deletion}

In foreground cascading deletion, the owner object you're deleting first enters
a *deletion in progress* state. In this state, the following happens to the
owner object:
-->
### 前台级联删除 {#foreground-deletion}

在前台级联删除中，正在被你删除的属主对象首先进入 **deletion in progress** 状态。
在这种状态下，针对属主对象会发生以下事情：

<!--
* The Kubernetes API server sets the object's `metadata.deletionTimestamp`
  field to the time the object was marked for deletion.
* The Kubernetes API server also sets the `metadata.finalizers` field to
  `foregroundDeletion`. 
* The object remains visible through the Kubernetes API until the deletion
  process is complete.
-->
* Kubernetes API 服务器将某对象的 `metadata.deletionTimestamp`
  字段设置为该对象被标记为要删除的时间点。
* Kubernetes API 服务器也会将 `metadata.finalizers` 字段设置为 `foregroundDeletion`。
* 在删除过程完成之前，通过 Kubernetes API 仍然可以看到该对象。

<!--
After the owner object enters the deletion in progress state, the controller
deletes the dependents. After deleting all the dependent objects, the controller
deletes the owner object. At this point, the object is no longer visible in the
Kubernetes API.

During foreground cascading deletion, the only dependents that block owner
deletion are those that have the `ownerReference.blockOwnerDeletion=true` field.
See [Use foreground cascading deletion](/docs/tasks/administer-cluster/use-cascading-deletion/#use-foreground-cascading-deletion)
to learn more.
-->
当属主对象进入删除过程中状态后，控制器删除其依赖对象。控制器在删除完所有依赖对象之后，
删除属主对象。这时，通过 Kubernetes API 就无法再看到该对象。

在前台级联删除过程中，唯一可能阻止属主对象被删除的是那些带有
`ownerReference.blockOwnerDeletion=true` 字段的依赖对象。
参阅[使用前台级联删除](/zh-cn/docs/tasks/administer-cluster/use-cascading-deletion/#use-foreground-cascading-deletion)
以了解进一步的细节。

<!--
### Background cascading deletion {#background-deletion}

In background cascading deletion, the Kubernetes API server deletes the owner
object immediately and the controller cleans up the dependent objects in
the background. By default, Kubernetes uses background cascading deletion unless
you manually use foreground deletion or choose to orphan the dependent objects.

See [Use background cascading deletion](/docs/tasks/administer-cluster/use-cascading-deletion/#use-background-cascading-deletion)
to learn more.
-->
### 后台级联删除 {#background-deletion}

在后台级联删除过程中，Kubernetes 服务器立即删除属主对象，控制器在后台清理所有依赖对象。
默认情况下，Kubernetes 使用后台级联删除方案，除非你手动设置了要使用前台删除，
或者选择遗弃依赖对象。

参阅[使用后台级联删除](/zh-cn/docs/tasks/administer-cluster/use-cascading-deletion/#use-background-cascading-deletion)以了解进一步的细节。

<!--
### Orphaned dependents

When Kubernetes deletes an owner object, the dependents left behind are called
*orphan* objects. By default, Kubernetes deletes dependent objects. To learn how
to override this behaviour, see [Delete owner objects and orphan dependents](/docs/tasks/administer-cluster/use-cascading-deletion/#set-orphan-deletion-policy).
-->
### 被遗弃的依赖对象    {#orphaned-dependents}

当 Kubernetes 删除某个属主对象时，被留下来的依赖对象被称作被遗弃的（Orphaned）对象。
默认情况下，Kubernetes 会删除依赖对象。要了解如何重载这种默认行为，
可参阅[删除属主对象和遗弃依赖对象](/zh-cn/docs/tasks/administer-cluster/use-cascading-deletion/#set-orphan-deletion-policy)。

<!--
## Garbage collection of unused containers and images {#containers-images}

The {{<glossary_tooltip text="kubelet" term_id="kubelet">}} performs garbage
collection on unused images every two minutes and on unused containers every
minute. You should avoid using external garbage collection tools, as these can
break the kubelet behavior and remove containers that should exist.
-->
## 未使用容器和镜像的垃圾收集     {#containers-images}

{{<glossary_tooltip text="kubelet" term_id="kubelet">}} 会每两分钟对未使用的镜像执行一次垃圾收集，
每分钟对未使用的容器执行一次垃圾收集。
你应该避免使用外部的垃圾收集工具，因为外部工具可能会破坏 kubelet
的行为，移除应该保留的容器。

<!--
To configure options for unused container and image garbage collection, tune the
kubelet using a [configuration file](/docs/tasks/administer-cluster/kubelet-config-file/)
and change the parameters related to garbage collection using the
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
resource type.
-->
要配置对未使用容器和镜像的垃圾收集选项，
可以使用一个[配置文件](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)，基于
[`KubeletConfiguration`](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)
资源类型来调整与垃圾收集相关的 kubelet 行为。

<!--
### Container image lifecycle

Kubernetes manages the lifecycle of all images through its *image manager*,
which is part of the kubelet, with the cooperation of
{{< glossary_tooltip text="cadvisor" term_id="cadvisor" >}}. The kubelet
considers the following disk usage limits when making garbage collection
decisions:
-->
### 容器镜像生命周期     {#container-image-lifecycle}

Kubernetes 通过其**镜像管理器（Image Manager）** 来管理所有镜像的生命周期，
该管理器是 kubelet 的一部分，工作时与
{{< glossary_tooltip text="cadvisor" term_id="cadvisor" >}} 协同。
kubelet 在作出垃圾收集决定时会考虑如下磁盘用量约束：

* `HighThresholdPercent`
* `LowThresholdPercent`

<!--
Disk usage above the configured `HighThresholdPercent` value triggers garbage
collection, which deletes images in order based on the last time they were used,
starting with the oldest first. The kubelet deletes images
until disk usage reaches the `LowThresholdPercent` value.
-->
磁盘用量超出所配置的 `HighThresholdPercent` 值时会触发垃圾收集，
垃圾收集器会基于镜像上次被使用的时间来按顺序删除它们，首先删除的是最近未使用的镜像。
kubelet 会持续删除镜像，直到磁盘用量到达 `LowThresholdPercent` 值为止。

<!--
#### Garbage collection for unused container images {#image-maximum-age-gc}
-->
#### 未使用容器镜像的垃圾收集     {#image-maximum-age-gc}

{{< feature-state feature_gate_name="ImageMaximumGCAge" >}}

<!--
As an beta feature, you can specify the maximum time a local image can be unused for,
regardless of disk usage. This is a kubelet setting that you configure for each node.
-->
这是一个 Beta 特性，不论磁盘使用情况如何，你都可以指定本地镜像未被使用的最长时间。
这是一个可以为每个节点配置的 kubelet 设置。

<!--
To configure the setting, enable the `imageMaximumGCAge`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) for the kubelet,
and also set a value for the `imageMaximumGCAge` field in the kubelet configuration file.
-->
请为 kubelet 启用 `imageMaximumGCAge`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
并在 kubelet 配置文件中为 `imageMaximumGCAge` 字段赋值来配置该设置。

<!--
The value is specified as a Kubernetes _duration_; 
Valid time units for the `imageMaximumGCAge` field in the kubelet configuration file are:
- "ns" for nanoseconds
- "us" or "µs" for microseconds
- "ms" for milliseconds
- "s" for seconds
- "m" for minutes
- "h" for hours
-->
该值应遵循 Kubernetes **持续时间（Duration）** 格式；
在 kubelet 配置文件中，`imageMaximumGCAge` 字段的有效时间单位如下：

- "ns" 表示纳秒
- "us" 或 "µs" 表示微秒
- "ms" 表示毫秒
- "s" 表示秒
- "m" 表示分钟
- "h" 表示小时

<!--
For example, you can set the configuration field to `12h45m`,
which means 12 hours and 45 minutes.
-->
例如，你可以将配置字段设置为 `12h45m`，代表 12 小时 45 分钟。

{{< note >}}
<!--
This feature does not track image usage across kubelet restarts. If the kubelet
is restarted, the tracked image age is reset, causing the kubelet to wait the full
`imageMaximumGCAge` duration before qualifying images for garbage collection
based on image age.
-->
这个特性不会跟踪 kubelet 重新启动后的镜像使用情况。
如果 kubelet 被重新启动，所跟踪的镜像年龄会被重置，
导致 kubelet 在根据镜像年龄进行垃圾收集时需要等待完整的
`imageMaximumGCAge` 时长。
{{< /note>}}

<!--
### Container garbage collection {#container-image-garbage-collection}

The kubelet garbage collects unused containers based on the following variables,
which you can define:
-->
### 容器垃圾收集    {#container-image-garbage-collection}

kubelet 会基于如下变量对所有未使用的容器执行垃圾收集操作，这些变量都是你可以定义的：

<!--
* `MinAge`: the minimum age at which the kubelet can garbage collect a
  container. Disable by setting to `0`.
* `MaxPerPodContainer`: the maximum number of dead containers each Pod
  can have. Disable by setting to less than `0`.
* `MaxContainers`: the maximum number of dead containers the cluster can have.
  Disable by setting to less than `0`. 
-->
* `MinAge`：kubelet 可以垃圾回收某个容器时该容器的最小年龄。设置为 `0`
  表示禁止使用此规则。
* `MaxPerPodContainer`：每个 Pod 可以包含的已死亡的容器个数上限。设置为小于 `0`
  的值表示禁止使用此规则。
* `MaxContainers`：集群中可以存在的已死亡的容器个数上限。设置为小于 `0`
  的值意味着禁止应用此规则。

<!--
In addition to these variables, the kubelet garbage collects unidentified and
deleted containers, typically starting with the oldest first.

`MaxPerPodContainer` and `MaxContainers` may potentially conflict with each other
in situations where retaining the maximum number of containers per Pod
(`MaxPerPodContainer`) would go outside the allowable total of global dead
containers (`MaxContainers`). In this situation, the kubelet adjusts
`MaxPerPodContainer` to address the conflict. A worst-case scenario would be to
downgrade `MaxPerPodContainer` to `1` and evict the oldest containers.
Additionally, containers owned by pods that have been deleted are removed once
they are older than `MinAge`.
-->
除以上变量之外，kubelet 还会垃圾收集除无标识的以及已删除的容器，通常从最近未使用的容器开始。

当保持每个 Pod 的最大数量的容器（`MaxPerPodContainer`）会使得全局的已死亡容器个数超出上限
（`MaxContainers`）时，`MaxPerPodContainer` 和 `MaxContainers` 之间可能会出现冲突。
在这种情况下，kubelet 会调整 `MaxPerPodContainer` 来解决这一冲突。
最坏的情形是将 `MaxPerPodContainer` 降格为 `1`，并驱逐最近未使用的容器。
此外，当隶属于某已被删除的 Pod 的容器的年龄超过 `MinAge` 时，它们也会被删除。

{{<note>}}
<!--
The kubelet only garbage collects the containers it manages.
-->
kubelet 仅会回收由它所管理的容器。
{{</note>}}

<!--
## Configuring garbage collection {#configuring-gc}

You can tune garbage collection of resources by configuring options specific to
the controllers managing those resources. The following pages show you how to
configure garbage collection:

* [Configuring cascading deletion of Kubernetes objects](/docs/tasks/administer-cluster/use-cascading-deletion/)
* [Configuring cleanup of finished Jobs](/docs/concepts/workloads/controllers/ttlafterfinished/)
-->
## 配置垃圾收集     {#configuring-gc}

你可以通过配置特定于管理资源的控制器来调整资源的垃圾收集行为。
下面的页面为你展示如何配置垃圾收集：

* [配置 Kubernetes 对象的级联删除](/zh-cn/docs/tasks/administer-cluster/use-cascading-deletion/)
* [配置已完成 Job 的清理](/zh-cn/docs/concepts/workloads/controllers/ttlafterfinished/)

## {{% heading "whatsnext" %}}

<!--
* Learn more about [ownership of Kubernetes objects](/docs/concepts/overview/working-with-objects/owners-dependents/).
* Learn more about Kubernetes [finalizers](/docs/concepts/overview/working-with-objects/finalizers/).
* Learn about the [TTL controller](/docs/concepts/workloads/controllers/ttlafterfinished/) that cleans up finished Jobs.
-->
* 进一步了解 [Kubernetes 对象的属主关系](/zh-cn/docs/concepts/overview/working-with-objects/owners-dependents/)。
* 进一步了解 Kubernetes [finalizers](/zh-cn/docs/concepts/overview/working-with-objects/finalizers/)。
* 进一步了解 [TTL 控制器](/zh-cn/docs/concepts/workloads/controllers/ttlafterfinished/)，
  该控制器负责清理已完成的 Job。
