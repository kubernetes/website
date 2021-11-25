---
title: Garbage Collection
content_type: concept
weight: 50
---

<!-- overview -->
{{<glossary_definition term_id="garbage-collection" length="short">}} 这
允许像下面这样清理资源:

  * [Failed pods](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)
  * [Completed Jobs](/docs/concepts/workloads/controllers/ttlafterfinished/)
  * [Objects without owner references](#拥有者)
  * [Unused containers and container images](#容器镜像)
  * [Dynamically provisioned PersistentVolumes with a StorageClass reclaim policy of Delete](/docs/concepts/storage/persistent-volumes/#delete)
  * [Stale or expired CertificateSigningRequests (CSRs)](/reference/access-authn-authz/certificate-signing-requests/#request-signing-process)
  * {{<glossary_tooltip text="Nodes" term_id="node">}} 在以下场景中删除:
    * 当集群使用 [cloud controller manager](/docs/concepts/architecture/cloud-controller/)
    * 当集群使用类似于云控制器的插件时，本地管理

  * [Node Lease objects](/docs/concepts/architecture/nodes/#heartbeats)

## 拥有者和家属 {#owners-dependents}

Kubernetes中的许多对象通过 [*所有者参考*](/docs/concepts/overview/working-with-objects/owners-dependents/). 
所有者参照告诉控制平面哪些对象依赖于其他对象。
Kubernetes使用所有者引用提供控制平面和其他API
客户端，在删除前清理相关资源的机会
对象在大多数情况下，Kubernetes会自动管理所有者引用。
所有权不同于 [标签和选择器](/docs/concepts/overview/working-with-objects/labels/)
一些资源也使用的机制。例如, 考虑一个
{{<glossary_tooltip text="服务" term_id="service">}} 在这里创建
`端点切片对象。该服务使用*标签*允许控制平面
确定用于该服务的“EndpointSlice”对象。此外
对于标签，代表服务管理的每个“EndpointSlice”都具有
所有者参考。所有者参考帮助Kubernetes的不同部分避免
干扰他们无法控制的对象。

{{< node >}}
设计不允许跨命名空间所有者引用。
命名空间的从属项可以指定群集范围的所有者或命名空间的所有者。
具有名称空间的所有者**必须**与从属所有者位于同一名称空间中。
如果没有，则所有者引用将被视为不存在，并且依赖者
一旦确认所有所有者均缺席，则可删除。

群集范围的从属项只能指定群集范围的所有者。
在v1.20+中，如果集群范围的依赖项指定名称空间的种类作为所有者，
它被视为具有不可解析的所有者引用，并且不能被垃圾收集。

在v1.20+中，如果垃圾收集器检测到无效的跨命名空间“ownerReference”，
或者是一个集群范围的依赖项，其“ownerReference”引用了一个名称空间的种类，或者是一个警告事件
报告的原因为“OwnerRefInvalidNamespace”和无效依赖项的“involvedObject”。
您可以通过运行
`kubectl get events-A--字段选择器=reason=OwnerRefInvalidNamespace`。

{{< /note >}}

## 级联删除 {#cascading-deletion}

Kubernetes检查并删除不再具有所有者的对象
引用，比如删除复制集时留下的pod。当你
删除对象时，可以控制Kubernetes是否删除对象的
在一个称为“级联删除”的过程中，依赖项会自动删除。有
两种类型的级联删除，如下所示：

  * 前景级联删除 
  * 后景级联删除

您还可以控制垃圾回收如何以及何时删除具有
使用Kubernetes的所有者引用{{<glossary_tooltip text="finalizers" term_id="finalizer">}}. 

### 前景级联删除 {#foreground-deletion}

在前台级联删除中，要删除的所有者对象首先进入
a*正在删除*状态。在此状态下，以下情况发生在
所有者对象：

	* Kubernetes API服务器设置对象的` metadata.deletionTimestamp'`
字段设置为对象标记为删除的时间。
	* Kubernetes API服务器还将“metadata.finalizers”字段设置为
`前景删除`。
	* 在删除之前，对象通过Kubernetes API保持可见
过程已经完成。

所有者对象进入删除进行中状态后，控制器
删除依赖项。删除所有从属对象后，控制器
删除所有者对象。此时，该对象在视图中不再可见
Kubernetes API。

在前台级联删除期间，块所有者的唯一依赖项
删除是具有“ownerReference.BlockOwnerDelete=true”字段的删除。
请参阅[使用前台级联删除]（/docs/tasks/administrate cluster/Use cascading deletation/#Use front cascading deletation）
了解更多。

### 后景级联删除 {#background-deletion}

在后台级联删除中，Kubernetes API服务器删除所有者
对象，并且控制器将清除中的从属对象
背景。默认情况下，Kubernetes使用后台级联删除，除非
手动使用前景删除或选择孤立从属对象。

请参阅[使用后台级联删除]（/docs/tasks/administrate cluster/Use cascading deletion/#Use background cascading deletion）
了解更多。
### 独立拥有者

当Kubernetes删除所有者对象时，将调用留下的依赖项
*孤立*对象。默认情况下，Kubernetes删除依赖对象。学习如何
要覆盖此行为，请参阅[删除所有者对象和孤立从属对象]（/docs/tasks/administrate cluster/use cascading deletation/#set orphan deletation policy）。

## 未使用容器和镜像的垃圾收集 {#containers-images}

{{<glossary\u tooltip text=“kubelet”term\u id=“kubelet”>}执行垃圾处理
每五分钟收集一次未使用的图像，每五分钟收集一次未使用的容器
分钟您应该避免使用外部垃圾收集工具，因为它们可以
打破kubelet行为并移除应该存在的容器。

要为未使用的容器和图像垃圾收集配置选项，请调整
kubelet使用[配置文件]（/docs/tasks/administrate cluster/kubelet config file/）
并使用
[`KubeletConfiguration`]（/docs/reference/config-api/kubeletconfig.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration）
资源类型。

### 容器映像生命周期

Kubernetes通过其*镜像管理器*管理所有图像的生命周期，
这是kubelet的一部分，与cadvisor合作。库贝莱酒店
在进行垃圾收集时考虑以下磁盘使用限制
决定：

  * `高阈值百分比`
  * `低阈值百分比`

磁盘使用率高于配置的“HighThresholdPercent”值会触发垃圾
集合，它根据上次使用图像的时间顺序删除图像，
先从最老的开始。kubelet删除图像
直到磁盘使用率达到“LowThresholdPercent”值。

### 容器映像垃圾回收 {#container-image-garbage-collection}

kubelet垃圾根据以下变量收集未使用的容器，
您可以定义：

  * `MinAge`: kubelet可以收集垃圾的最低年龄
容器通过设置为“0”禁用。
  * `MaxPerPodContainer`: 每个吊舱对的最大死容器数
可以有。通过设置为小于“0”来禁用。 
  * `MaxContainers`: 群集可以拥有的最大死容器数。
通过设置为小于“0”来禁用。 

除了这些变量外，kubelet垃圾收集未识别的
已删除的容器，通常从最旧的容器开始。

`MaxPerPodContainer`和MaxContainer`可能会相互冲突
在保持每个吊舱最大容器数量的情况下
（`MaxPerPodContainer`）将超出允许的全局死亡总数
容器（`MaxContainers`）。在这种情况下，kubelet会进行调整
`MaxPodPerContainer`解决冲突。最坏的情况是
将“MaxPerPodContainer”降级为“1”，并逐出最旧的容器。
此外，已删除的POD所拥有的容器将被删除一次
它们比“米纳奇”古老。

{{<note>}}
kubelet only垃圾收集它管理的容器。
{{</note>}}

## 垃圾是收集配置 {#configuring-gc}

您可以通过配置特定于的选项来优化资源的垃圾回收
管理这些资源的控制器。以下几页向您展示了如何
配置垃圾收集：

  * [配置Kubernetes对象的级联删除](/docs/tasks/administer-cluster/use-cascading-deletion/)
  * [配置已完成作业的清理](/docs/concepts/workloads/controllers/ttlafterfinished/)
  
<!-- * [配置未使用的容器和映像垃圾回收 ](/docs/tasks/administer-cluster/reconfigure-kubelet/) -->

## {{% heading "whatsnext" %}}

* 了解更多关于 [ownership of Kubernetes objects](/docs/concepts/overview/working-with-objects/owners-dependents/).
* 了解更多关于 Kubernetes [finalizers](/docs/concepts/overview/working-with-objects/finalizers/).
* 了解更多关于 [TTL controller](/docs/concepts/workloads/controllers/ttlafterfinished/) (beta) that cleans up finished Jobs.
