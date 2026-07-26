---
layout: blog
title: "卷健康监控的 Alpha 更新"
date: 2021-04-16
slug: volume-health-monitoring-alpha-update
---
<!--
layout: blog
title: "Volume Health Monitoring Alpha Update"
date: 2021-04-16
slug: volume-health-monitoring-alpha-update
-->

<!--
**Author:** Xing Yang (VMware)
-->
**作者：** Xing Yang (VMware)

<!--
The CSI Volume Health Monitoring feature, originally introduced in 1.19 has undergone a large update for the 1.21 release.
-->
最初在 1.19 中引入的 CSI 卷健康监控功能在 1.21 版本中进行了大规模更新。

<!--
## Why add Volume Health Monitoring to Kubernetes?
-->
## 为什么要向 Kubernetes 添加卷健康监控？

<!--
Without Volume Health Monitoring, Kubernetes has no knowledge of the state of the underlying volumes of a storage system after a PVC is provisioned and used by a Pod. Many things could happen to the underlying storage system after a volume is provisioned in Kubernetes. For example, the volume could be deleted by accident outside of Kubernetes, the disk that the volume resides on could fail, it could be out of capacity, the disk may be degraded which affects its performance, and so on. Even when the volume is mounted on a pod and used by an application, there could be problems later on such as read/write I/O errors, file system corruption, accidental unmounting of the volume outside of Kubernetes, etc. It is very hard to debug and detect root causes when something happened like this.
-->
如果没有卷健康监控，在 PVC 被 Pod 配置和使用后，Kubernetes 将不知道存储系统的底层卷的状态。
在 Kubernetes 中配置卷后，底层存储系统可能会发生很多事情。
例如，卷可能在 Kubernetes 之外被意外删除、卷所在的磁盘可能发生故障、容量不足、磁盘可能被降级而影响其性能等等。
即使卷被挂载到 Pod 上并被应用程序使用，以后也可能会出现诸如读/写 I/O 错误、文件系统损坏、在 Kubernetes 之外被意外卸载卷等问题。
当发生这样的事情时，调试和检测根本原因是非常困难的。

<!--
Volume health monitoring can be very beneficial to Kubernetes users. It can communicate with the CSI driver to retrieve errors detected by the underlying storage system. PVC events can be reported up to the user to take action. For example, if the volume is out of capacity, they could request a volume expansion to get more space.
-->
卷健康监控对 Kubernetes 用户非常有益。
它可以与 CSI 驱动程序通信以检索到底层存储系统检测到的错误。
用户可以收到报告上来的 PVC 事件继而采取行动。
例如，如果卷容量不足，他们可以请求卷扩展以获得更多空间。

<!--
## What is Volume Health Monitoring?
-->
## 什么是卷健康监控？

<!--
CSI Volume Health Monitoring allows CSI Drivers to detect abnormal volume conditions from the underlying storage systems and report them as events on PVCs or Pods.
-->
CSI 卷健康监控允许 CSI 驱动程序检测来自底层存储系统的异常卷状况，并将其作为 PVC 或 Pod 上的事件报送。

<!--
The Kubernetes components that monitor the volumes and report events with volume health information include the following:
-->
监控卷和使用卷健康信息报送事件的 Kubernetes 组件包括：

<!--
* Kubelet, in addition to gathering the existing volume stats will watch the volume health of the PVCs on that node. If a PVC has an abnormal health condition, an event will be reported on the pod object using the PVC. If multiple pods are using the same PVC, events will be reported on all pods using that PVC.
-->
* Kubelet 除了收集现有的卷统计信息外，还将观察该节点上 PVC 的卷健康状况。
  如果 PVC 的健康状况异常，则会在使用 PVC 的 Pod 对象上报送事件。
  如果多个 Pod 使用相同的 PVC，则将在使用该 PVC 的所有 Pod 上报送事件。 
<!--
* An [External Volume Health Monitor Controller](https://github.com/kubernetes-csi/external-health-monitor) watches volume health of the PVCs and reports events on the PVCs.
-->
* 一个[外部卷健康监视控制器](https://github.com/kubernetes-csi/external-health-monitor)监视 PVC 的卷健康并报告 PVC 上的事件。

<!--
Note that the node side volume health monitoring logic was an external agent when this feature was first introduced in the Kubernetes 1.19 release. In Kubernetes 1.21, the node side volume health monitoring logic was moved from the external agent into the Kubelet, to avoid making duplicate CSI function calls. With this change in 1.21, a new alpha [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `CSIVolumeHealth` was introduced for the volume health monitoring logic in Kubelet.
-->
请注意，在 Kubernetes 1.19 版本中首次引入此功能时，节点侧卷健康监控逻辑是一个外部代理。
在 Kubernetes 1.21 中，节点侧卷健康监控逻辑从外部代理移至 Kubelet，以避免 CSI 函数重复调用。
随着 1.21 中的这一变化，为 Kubelet 中的卷健康监控逻辑引入了一个新的 alpha [特性门](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/) `CSIVolumeHealth`。 

<!--
Currently the Volume Health Monitoring feature is informational only as it only reports abnormal volume health events on PVCs or Pods. Users will need to check these events and manually fix the problems. This feature serves as a stepping stone towards programmatic detection and resolution of volume health issues by Kubernetes in the future.
-->
目前，卷健康监控功能仅供参考，因为它只报送 PVC 或 Pod 上的异常卷健康事件。
用户将需要检查这些事件并手动修复问题。
此功能可作为 Kubernetes 未来以编程方式检测和解决卷健康问题的基石。

<!--
## How do I use Volume Health on my Kubernetes Cluster?
-->
## 如何在 Kubernetes 集群上使用卷健康？

<!--
To use the Volume Health feature, first make sure the CSI driver you are using supports this feature. Refer to this [CSI drivers doc](https://kubernetes-csi.github.io/docs/drivers.html) to find out which CSI drivers support this feature.
-->
要使用卷健康功能，首先确保你使用的 CSI 驱动程序支持此功能。
请参阅此 [CSI 驱动程序文档](https://kubernetes-csi.github.io/docs/drivers.html)以了解哪些 CSI 驱动程序支持此功能。

<!--
To enable Volume Health Monitoring from the node side, the alpha feature gate `CSIVolumeHealth` needs to be enabled.
-->
要从节点侧启用卷健康监控，需要启用 alpha 特性门 `CSIVolumeHealth`。

<!--
If a CSI driver supports the Volume Health Monitoring feature from the controller side, events regarding abnormal volume conditions will be recorded on PVCs.
-->
如果 CSI 驱动程序支持控制器端的卷健康监控功能，则有关异常卷条件的事件将记录在 PVC 上。

<!--
If a CSI driver supports the Volume Health Monitoring feature from the controller side, user can also get events regarding node failures if the `enable-node-watcher` flag is set to true when deploying the External Health Monitor Controller. When a node failure event is detected, an event will be reported on the PVC to indicate that pods using this PVC are on a failed node.
-->
如果 CSI 驱动程序支持控制器端的卷健康监控功能，
当部署外部健康监控控制器时 `enable-node-watcher` 标志设置为 true，用户还可以获得有关节点故障的事件。
当检测到节点故障事件时，会在 PVC 上报送一个事件，指示使用该 PVC 的 Pod 在故障节点上。

<!--
If a CSI driver supports the Volume Health Monitoring feature from the node side, events regarding abnormal volume conditions will be recorded on pods using the PVCs.
-->
如果 CSI 驱动程序支持节点端的卷健康监控功能，则有关异常卷条件的事件将使用 PVC 记录在 Pod 上。

<!--
## As a storage vendor, how do I add support for volume health to my CSI driver?
-->
## 作为存储供应商，如何向 CSI 驱动程序添加对卷健康的支持？

<!--
Volume Health Monitoring includes two parts:
* An External Volume Health Monitoring Controller monitors volume health from the controller side.
* Kubelet monitors volume health from the node side.
-->
卷健康监控包括两个部分：
* 外部卷健康监控控制器从控制器端监控卷健康。
* Kubelet 从节点端监控卷的健康状况。

<!--
For details, see the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md) and the [Kubernetes-CSI Driver Developer Guide](https://kubernetes-csi.github.io/docs/volume-health-monitor.html).
-->
有关详细信息，请参阅 [CSI 规约](https://github.com/container-storage-interface/spec/blob/master/spec.md)
和 [Kubernetes-CSI 驱动开发者指南](https://kubernetes-csi.github.io/docs/volume-health-monitor.html)。

<!--
There is a sample implementation for volume health in [CSI host path driver](https://github.com/kubernetes-csi/csi-driver-host-path).
-->
[CSI 主机路径驱动程序](https://github.com/kubernetes-csi/csi-driver-host-path)中有一个卷健康的示例实现。

<!--
### Controller Side Volume Health Monitoring
-->
### 控制器端卷健康监控

<!--
To learn how to deploy the External Volume Health Monitoring controller, see [CSI external-health-monitor-controller](https://kubernetes-csi.github.io/docs/external-health-monitor-controller.html) in the CSI documentation.
-->
要了解如何部署外部卷健康监控控制器，
请参阅 CSI 文档中的 [CSI external-health-monitor-controller](https://kubernetes-csi.github.io/docs/external-health-monitor-controller.html)。

<!--
The External Health Monitor Controller calls either `ListVolumes` or `ControllerGetVolume` CSI RPC and reports VolumeConditionAbnormal events with messages on PVCs if abnormal volume conditions are detected. Only CSI drivers with `LIST_VOLUMES` and `VOLUME_CONDITION` controller capability or `GET_VOLUME` and `VOLUME_CONDITION` controller capability support Volume Health Monitoring in the external controller.
-->
如果检测到异常卷条件，
外部健康监视器控制器调用 `ListVolumes` 或者 `ControllerGetVolume` CSI RPC 并报送 VolumeConditionAbnormal 事件以及 PVC 上的消息。
只有具有 `LIST_VOLUMES` 和 `VOLUME_CONDITION` 控制器能力、
或者具有 `GET_VOLUME` 和 `VOLUME_CONDITION` 能力的 CSI 驱动程序才支持外部控制器中的卷健康监控。

<!--
To implement the volume health feature from the controller side, a CSI driver **must** add support for the new controller capabilities.
-->
要从控制器端实现卷健康功能，CSI 驱动程序**必须**添加对新控制器功能的支持。

<!--
If a CSI driver supports `LIST_VOLUMES` and `VOLUME_CONDITION` controller capabilities, it **must** implement controller RPC `ListVolumes` and report the volume condition in the response.
-->
如果 CSI 驱动程序支持 `LIST_VOLUMES` 和 `VOLUME_CONDITION` 控制器功能，它**必须**实现控制器 RPC `ListVolumes` 并在响应中报送卷状况。

<!--
If a CSI driver supports `GET_VOLUME` and `VOLUME_CONDITION` controller capability, it **must** implement controller PRC `ControllerGetVolume` and report the volume condition in the response.
-->
如果 CSI 驱动程序支持 `GET_VOLUME` 和 `VOLUME_CONDITION` 控制器功能，它**必须**实现控制器 PRC `ControllerGetVolume` 并在响应中报送卷状况。

<!--
If a CSI driver supports `LIST_VOLUMES`, `GET_VOLUME`, and `VOLUME_CONDITION` controller capabilities, only `ListVolumes` CSI RPC will be invoked by the External Health Monitor Controller.
-->
如果 CSI 驱动程序支持 `LIST_VOLUMES`、`GET_VOLUME` 和 `VOLUME_CONDITION` 控制器功能，则外部健康监视控制器将仅调用 `ListVolumes` CSI RPC。

<!--
### Node Side Volume Health Monitoring
-->
### 节点侧卷健康监控

<!--
Kubelet calls `NodeGetVolumeStats` CSI RPC and reports VolumeConditionAbnormal events with messages on Pods if abnormal volume conditions are detected. Only CSI drivers with `VOLUME_CONDITION` node capability support Volume Health Monitoring in Kubelet.
-->
如果检测到异常的卷条件，
Kubelet 会调用 `NodeGetVolumeStats` CSI RPC 并报送 VolumeConditionAbnormal 事件以及 Pod 上的信息。
只有具有 `VOLUME_CONDITION` 节点功能的 CSI 驱动程序才支持 Kubelet 中的卷健康监控。

<!--
To implement the volume health feature from the node side, a CSI driver **must** add support for the new node capabilities.
-->
要从节点端实现卷健康功能，CSI 驱动程序**必须**添加对新节点功能的支持。

<!--
If a CSI driver supports `VOLUME_CONDITION` node capability, it **must** report the volume condition in node RPC `NodeGetVoumeStats`.
-->
如果 CSI 驱动程序支持 `VOLUME_CONDITION` 节点能力，它**必须**在节点 RPC `NodeGetVoumeStats` 中报送卷状况。

<!--
## What’s next?
-->
## 下一步是什么？

<!--
Depending on feedback and adoption, the Kubernetes team plans to push the CSI volume health implementation to beta in either 1.22 or 1.23.
-->
根据反馈和采纳情况，Kubernetes 团队计划在 1.22 或 1.23 中将 CSI 卷健康实施推向 beta。

<!--
We are also exploring how to use volume health information for programmatic detection and automatic reconcile in Kubernetes.
-->
我们还在探索如何在 Kubernetes 中使用卷健康信息进行编程检测和自动协调。

<!--
## How can I learn more?
-->
## 如何了解更多？

<!--
To learn the design details for Volume Health Monitoring, read the [Volume Health Monitor](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1432-volume-health-monitor) enhancement proposal.
-->
要了解卷健康监控的设计细节，请阅读[卷健康监控](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1432-volume-health-monitor)增强提案。

<!--
The Volume Health Monitor controller source code is at [https://github.com/kubernetes-csi/external-health-monitor](https://github.com/kubernetes-csi/external-health-monitor).
-->
卷健康检测控制器源代码位于：
[https://github.com/kubernetes-csi/external-health-monitor](https://github.com/kubernetes-csi/external-health-monitor)。

<!--
There are also more details about volume health checks in the [Container Storage Interface Documentation](https://kubernetes-csi.github.io/docs/).
-->
[容器存储接口文档](https://kubernetes-csi.github.io/docs/)中还有关于卷健康检查的更多详细信息。

<!--
## How do I get involved?
-->
## 如何参与？

<!--
The [Kubernetes Slack channel #csi](https://kubernetes.slack.com/messages/csi) and any of the [standard SIG Storage communication channels](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact) are great mediums to reach out to the SIG Storage and the CSI team.
-->
[Kubernetes Slack 频道 #csi](https://kubernetes.slack.com/messages/csi)
和任何[标准 SIG Storage 通信频道](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact)都是联系 SIG Storage 和 CSI 团队的绝佳媒介。

<!--
We offer a huge thank you to the contributors who helped release this feature in 1.21. We want to thank Yuquan Ren ([NickrenREN](https://github.com/nickrenren)) who implemented the initial volume health monitor controller and agent in the external health monitor repo, thank Ran Xu ([fengzixu](https://github.com/fengzixu)) who moved the volume health monitoring logic from the external agent to Kubelet in 1.21, and we offer special thanks to the following people for their insightful reviews: David Ashpole ([dashpole](https://github.com/dashpole)), Michelle Au ([msau42](https://github.com/msau42)), David Eads ([deads2k](https://github.com/deads2k)), Elana Hashman ([ehashman](https://github.com/ehashman)), Seth Jennings ([sjenning](https://github.com/sjenning)), and Jiawei Wang ([Jiawei0227](https://github.com/Jiawei0227)).
--> 
我们非常感谢在 1.21 中帮助发布此功能的贡献者。
我们要感谢 Yuquan Ren ([NickrenREN](https://github.com/nickrenren)) 在外部健康监控仓库中实现了初始卷健康监控控制器和代理，
感谢 Ran Xu ([fengzixu](https://github.com/fengzixu)) 在 1.21 中将卷健康监控逻辑从外部代理转移到 Kubelet，
我们特别感谢以下人员的深刻评论：
David Ashpole ([dashpole](https://github.com/dashpole))、
Michelle Au ([msau42](https://github.com/msau42))、
David Eads ([deads2k](https://github.com/deads2k))、
Elana Hashman ([ehashman](https://github.com/ehashman))、
Seth Jennings ([sjenning](https://github.com/sjenning)) 和 Jiawei Wang ([Jiawei0227](https://github.com/Jiawei0227))

<!--
Those interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system, join the [Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG). We’re rapidly growing and always welcome new contributors.
-->
那些有兴趣参与 CSI 或 Kubernetes 存储系统任何部分的设计和开发的人，
请加入 [Kubernetes Storage 特殊兴趣小组](https://github.com/kubernetes/community/tree/master/sig-storage)（SIG）。
我们正在迅速发展，并且欢迎新的贡献者。
