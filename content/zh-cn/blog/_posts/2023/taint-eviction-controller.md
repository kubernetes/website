---
layout: blog
title: "Kubernetes 1.29: 解耦污点管理器与节点生命周期控制器"
date: 2023-12-19
slug: kubernetes-1-29-taint-eviction-controller
---
<!--
layout: blog
title: "Kubernetes 1.29: Decoupling taint-manager from node-lifecycle-controller"
date: 2023-12-19
slug: kubernetes-1-29-taint-eviction-controller
-->

<!-- 
**Authors:** Yuan Chen (Apple), Andrea Tosatto (Apple) 
-->
**作者:** Yuan Chen (Apple), Andrea Tosatto (Apple)

**译者:** Allen Zhang

<!-- 
This blog discusses a new feature in Kubernetes 1.29 to improve the handling of taint-based pod eviction. 
-->
这篇博客讨论在 Kubernetes 1.29 中基于污点的 Pod 驱逐处理的新特性。

<!-- 
## Background 
-->
## 背景

<!-- 
In Kubernetes 1.29, an improvement has been introduced to enhance the taint-based pod eviction handling on nodes.
This blog discusses the changes made to node-lifecycle-controller
to separate its responsibilities and improve overall code maintainability. 
-->
在 Kubernetes 1.29 中引入了一项改进，以加强节点上基于污点的 Pod 驱逐处理。
本文将讨论对节点生命周期控制器（node-lifecycle-controller）所做的更改，以分离职责并提高代码的整体可维护性。

<!-- 
## Summary of changes 
-->
## 变动摘要

<!-- 
node-lifecycle-controller previously combined two independent functions: 
-->
节点生命周期控制器之前组合了两个独立的功能：

<!-- 
- Adding a pre-defined set of `NoExecute` taints to Node based on Node's condition.
- Performing pod eviction on `NoExecute` taint. 
-->
- 基于节点的条件为节点新增了一组预定义的污点 `NoExecute`。
- 对有 `NoExecute` 污点的 Pod 执行驱逐操作。

<!-- 
With the Kubernetes 1.29 release, the taint-based eviction implementation has been
moved out of node-lifecycle-controller into a separate and independent component called taint-eviction-controller.
This separation aims to disentangle code, enhance code maintainability,
and facilitate future extensions to either component. 
-->
在 Kubernetes 1.29 版本中，基于污点的驱逐实现已经从节点生命周期控制器中移出，
成为一个名为污点驱逐控制器（taint-eviction-controller）的独立组件。
旨在拆分代码，提高代码的可维护性，并方便未来对这两个组件进行扩展。

<!-- 
As part of the change, additional metrics were introduced to help you monitor taint-based pod evictions: 
-->
以下新指标可以帮助你监控基于污点的 Pod 驱逐：

<!-- 
- `pod_deletion_duration_seconds` measures the latency between the time when a taint effect
has been activated for the Pod and its deletion via taint-eviction-controller.
- `pod_deletions_total` reports the total number of Pods deleted by taint-eviction-controller since its start. 
-->
- `pod_deletion_duration_seconds` 表示当 Pod 的污点被激活直到这个 Pod 被污点驱逐控制器删除的延迟时间。
- `pod_deletions_total` 表示自从污点驱逐控制器启动以来驱逐的 Pod 总数。

<!-- 
## How to use the new feature? 
-->
## 如何使用这个新特性？

<!-- 
A new feature gate, `SeparateTaintEvictionController`, has been added. The feature is enabled by default as Beta in Kubernetes 1.29.
Please refer to the [feature gate document](/docs/reference/command-line-tools-reference/feature-gates/). 
-->
名为 `SeparateTaintEvictionController` 的特性门控已被添加。该特性在 Kubernetes 1.29 Beta 版本中默认开启。
详情请参阅[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
 

<!-- 
When this feature is enabled, users can optionally disable taint-based eviction by setting `--controllers=-taint-eviction-controller`
in kube-controller-manager. 
-->
当这项特性启用时，用户可以通过在 `kube-controller-manager` 通过手动设置
`--controllers=-taint-eviction-controller` 的方式来禁用基于污点的驱逐功能。

<!-- 
To disable the new feature and use the old taint-manager within node-lifecylecycle-controller , users can set the feature gate `SeparateTaintEvictionController=false`. 
-->
如果想禁用该特性并在节点生命周期中使用旧版本污点管理器，用户可以通过设置 `SeparateTaintEvictionController=false` 来禁用。

<!-- 
## Use cases 
-->
## 使用案例

<!-- 
This new feature will allow cluster administrators to extend and enhance the default
taint-eviction-controller and even replace the default taint-eviction-controller with a
custom implementation to meet different needs. An example is to better support
stateful workloads that use PersistentVolume on local disks. 
-->
该特性将允许集群管理员扩展、增强默认的污点驱逐控制器，并且可以使用自定义的实现方式替换默认的污点驱逐控制器以满足不同的需要。
例如：更好地支持在本地磁盘的持久卷中的有状态工作负载。

<!-- 
## FAQ 
-->
## FAQ

<!-- 
**Does this feature change the existing behavior of taint-based pod evictions?** 
-->
**该特性是否会改变现有的基于污点的 Pod 驱逐行为？**

<!-- 
No, the taint-based pod eviction behavior remains unchanged. If the feature gate
`SeparateTaintEvictionController` is turned off, the legacy node-lifecycle-controller with taint-manager will continue to be used. 
-->
不会，基于污点的 Pod 驱逐行为保持不变。如果特性门控 `SeparateTaintEvictionController` 被关闭，
将继续使用之前的节点生命周期管理器中的污点管理器。

<!-- 
**Will enabling/using this feature result in an increase in the time taken by any operations covered by existing SLIs/SLOs?** 
-->
**启用/使用此特性是否会导致现有 SLI/SLO 中任何操作的用时增加？**

<!-- 
No. 
-->
不会。

<!-- 
**Will enabling/using this feature result in an increase in resource usage (CPU, RAM, disk, IO, ...)?** 
-->
**启用/使用此特性是否会导致资源利用量（如 CPU、内存、磁盘、IO 等）的增加？**

<!-- 
The increase in resource usage by running a separate `taint-eviction-controller` will be negligible. 
-->
运行单独的 `taint-eviction-controller` 所增加的资源利用量可以忽略不计。

<!-- 
## Learn more 
-->
## 了解更多

<!-- 
For more details, refer to the [KEP](http://kep.k8s.io/3902). 
-->
更多细节请参考 [KEP](http://kep.k8s.io/3902)。

<!-- 
## Acknowledgments 
-->
## 特别鸣谢

<!-- 
As with any Kubernetes feature, multiple community members have contributed, from
writing the KEP to implementing the new controller and reviewing the KEP and code. Special thanks to: 
-->
与任何 Kubernetes 特性一样，从撰写 KEP 到实现新控制器再到审核 KEP 和代码，多名社区成员都做出了贡献，特别感谢：

- Aldo Culquicondor (@alculquicondor)
- Maciej Szulik (@soltysh)
- Filip Křepinský (@atiratree)
- Han Kang (@logicalhan)
- Wei Huang (@Huang-Wei)
- Sergey Kanzhelevi (@SergeyKanzhelev)
- Ravi Gudimetla (@ravisantoshgudimetla)
- Deep Debroy (@ddebroy)
