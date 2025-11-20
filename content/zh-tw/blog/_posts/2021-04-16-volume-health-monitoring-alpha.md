---
layout: blog
title: "卷健康監控的 Alpha 更新"
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
最初在 1.19 中引入的 CSI 卷健康監控功能在 1.21 版本中進行了大規模更新。

<!--
## Why add Volume Health Monitoring to Kubernetes?
-->
## 爲什麼要向 Kubernetes 添加捲健康監控？

<!--
Without Volume Health Monitoring, Kubernetes has no knowledge of the state of the underlying volumes of a storage system after a PVC is provisioned and used by a Pod. Many things could happen to the underlying storage system after a volume is provisioned in Kubernetes. For example, the volume could be deleted by accident outside of Kubernetes, the disk that the volume resides on could fail, it could be out of capacity, the disk may be degraded which affects its performance, and so on. Even when the volume is mounted on a pod and used by an application, there could be problems later on such as read/write I/O errors, file system corruption, accidental unmounting of the volume outside of Kubernetes, etc. It is very hard to debug and detect root causes when something happened like this.
-->
如果沒有卷健康監控，在 PVC 被 Pod 設定和使用後，Kubernetes 將不知道儲存系統的底層卷的狀態。
在 Kubernetes 中設定卷後，底層儲存系統可能會發生很多事情。
例如，卷可能在 Kubernetes 之外被意外刪除、卷所在的磁盤可能發生故障、容量不足、磁盤可能被降級而影響其性能等等。
即使卷被掛載到 Pod 上並被應用程式使用，以後也可能會出現諸如讀/寫 I/O 錯誤、檔案系統損壞、在 Kubernetes 之外被意外卸載卷等問題。
當發生這樣的事情時，調試和檢測根本原因是非常困難的。

<!--
Volume health monitoring can be very beneficial to Kubernetes users. It can communicate with the CSI driver to retrieve errors detected by the underlying storage system. PVC events can be reported up to the user to take action. For example, if the volume is out of capacity, they could request a volume expansion to get more space.
-->
卷健康監控對 Kubernetes 使用者非常有益。
它可以與 CSI 驅動程式通信以檢索到底層儲存系統檢測到的錯誤。
使用者可以收到報告上來的 PVC 事件繼而採取行動。
例如，如果卷容量不足，他們可以請求卷擴展以獲得更多空間。

<!--
## What is Volume Health Monitoring?
-->
## 什麼是卷健康監控？

<!--
CSI Volume Health Monitoring allows CSI Drivers to detect abnormal volume conditions from the underlying storage systems and report them as events on PVCs or Pods.
-->
CSI 卷健康監控允許 CSI 驅動程式檢測來自底層儲存系統的異常卷狀況，並將其作爲 PVC 或 Pod 上的事件報送。

<!--
The Kubernetes components that monitor the volumes and report events with volume health information include the following:
-->
監控捲和使用卷健康資訊報送事件的 Kubernetes 組件包括：

<!--
* Kubelet, in addition to gathering the existing volume stats will watch the volume health of the PVCs on that node. If a PVC has an abnormal health condition, an event will be reported on the pod object using the PVC. If multiple pods are using the same PVC, events will be reported on all pods using that PVC.
-->
* Kubelet 除了收集現有的卷統計資訊外，還將觀察該節點上 PVC 的卷健康狀況。
  如果 PVC 的健康狀況異常，則會在使用 PVC 的 Pod 對象上報送事件。
  如果多個 Pod 使用相同的 PVC，則將在使用該 PVC 的所有 Pod 上報送事件。 
<!--
* An [External Volume Health Monitor Controller](https://github.com/kubernetes-csi/external-health-monitor) watches volume health of the PVCs and reports events on the PVCs.
-->
* 一個[外部卷健康監視控制器](https://github.com/kubernetes-csi/external-health-monitor)監視 PVC 的卷健康並報告 PVC 上的事件。

<!--
Note that the node side volume health monitoring logic was an external agent when this feature was first introduced in the Kubernetes 1.19 release. In Kubernetes 1.21, the node side volume health monitoring logic was moved from the external agent into the Kubelet, to avoid making duplicate CSI function calls. With this change in 1.21, a new alpha [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `CSIVolumeHealth` was introduced for the volume health monitoring logic in Kubelet.
-->
請注意，在 Kubernetes 1.19 版本中首次引入此功能時，節點側卷健康監控邏輯是一個外部代理。
在 Kubernetes 1.21 中，節點側卷健康監控邏輯從外部代理移至 Kubelet，以避免 CSI 函數重複調用。
隨着 1.21 中的這一變化，爲 Kubelet 中的卷健康監控邏輯引入了一個新的 alpha [特性門](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/) `CSIVolumeHealth`。 

<!--
Currently the Volume Health Monitoring feature is informational only as it only reports abnormal volume health events on PVCs or Pods. Users will need to check these events and manually fix the problems. This feature serves as a stepping stone towards programmatic detection and resolution of volume health issues by Kubernetes in the future.
-->
目前，卷健康監控功能僅供參考，因爲它只報送 PVC 或 Pod 上的異常卷健康事件。
使用者將需要檢查這些事件並手動修復問題。
此功能可作爲 Kubernetes 未來以編程方式檢測和解決卷健康問題的基石。

<!--
## How do I use Volume Health on my Kubernetes Cluster?
-->
## 如何在 Kubernetes 叢集上使用卷健康？

<!--
To use the Volume Health feature, first make sure the CSI driver you are using supports this feature. Refer to this [CSI drivers doc](https://kubernetes-csi.github.io/docs/drivers.html) to find out which CSI drivers support this feature.
-->
要使用卷健康功能，首先確保你使用的 CSI 驅動程式支持此功能。
請參閱此 [CSI 驅動程式文檔](https://kubernetes-csi.github.io/docs/drivers.html)以瞭解哪些 CSI 驅動程式支持此功能。

<!--
To enable Volume Health Monitoring from the node side, the alpha feature gate `CSIVolumeHealth` needs to be enabled.
-->
要從節點側啓用卷健康監控，需要啓用 alpha 特性門 `CSIVolumeHealth`。

<!--
If a CSI driver supports the Volume Health Monitoring feature from the controller side, events regarding abnormal volume conditions will be recorded on PVCs.
-->
如果 CSI 驅動程式支持控制器端的卷健康監控功能，則有關異常卷條件的事件將記錄在 PVC 上。

<!--
If a CSI driver supports the Volume Health Monitoring feature from the controller side, user can also get events regarding node failures if the `enable-node-watcher` flag is set to true when deploying the External Health Monitor Controller. When a node failure event is detected, an event will be reported on the PVC to indicate that pods using this PVC are on a failed node.
-->
如果 CSI 驅動程式支持控制器端的卷健康監控功能，
當部署外部健康監控控制器時 `enable-node-watcher` 標誌設置爲 true，使用者還可以獲得有關節點故障的事件。
當檢測到節點故障事件時，會在 PVC 上報送一個事件，指示使用該 PVC 的 Pod 在故障節點上。

<!--
If a CSI driver supports the Volume Health Monitoring feature from the node side, events regarding abnormal volume conditions will be recorded on pods using the PVCs.
-->
如果 CSI 驅動程式支持節點端的卷健康監控功能，則有關異常卷條件的事件將使用 PVC 記錄在 Pod 上。

<!--
## As a storage vendor, how do I add support for volume health to my CSI driver?
-->
## 作爲儲存供應商，如何向 CSI 驅動程式添加對卷健康的支持？

<!--
Volume Health Monitoring includes two parts:
* An External Volume Health Monitoring Controller monitors volume health from the controller side.
* Kubelet monitors volume health from the node side.
-->
卷健康監控包括兩個部分：
* 外部卷健康監控控制器從控制器端監控捲健康。
* Kubelet 從節點端監控捲的健康狀況。

<!--
For details, see the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md) and the [Kubernetes-CSI Driver Developer Guide](https://kubernetes-csi.github.io/docs/volume-health-monitor.html).
-->
有關詳細資訊，請參閱 [CSI 規約](https://github.com/container-storage-interface/spec/blob/master/spec.md)
和 [Kubernetes-CSI 驅動開發者指南](https://kubernetes-csi.github.io/docs/volume-health-monitor.html)。

<!--
There is a sample implementation for volume health in [CSI host path driver](https://github.com/kubernetes-csi/csi-driver-host-path).
-->
[CSI 主機路徑驅動程式](https://github.com/kubernetes-csi/csi-driver-host-path)中有一個卷健康的示例實現。

<!--
### Controller Side Volume Health Monitoring
-->
### 控制器端卷健康監控

<!--
To learn how to deploy the External Volume Health Monitoring controller, see [CSI external-health-monitor-controller](https://kubernetes-csi.github.io/docs/external-health-monitor-controller.html) in the CSI documentation.
-->
要了解如何部署外部卷健康監控控制器，
請參閱 CSI 文檔中的 [CSI external-health-monitor-controller](https://kubernetes-csi.github.io/docs/external-health-monitor-controller.html)。

<!--
The External Health Monitor Controller calls either `ListVolumes` or `ControllerGetVolume` CSI RPC and reports VolumeConditionAbnormal events with messages on PVCs if abnormal volume conditions are detected. Only CSI drivers with `LIST_VOLUMES` and `VOLUME_CONDITION` controller capability or `GET_VOLUME` and `VOLUME_CONDITION` controller capability support Volume Health Monitoring in the external controller.
-->
如果檢測到異常卷條件，
外部健康監視器控制器調用 `ListVolumes` 或者 `ControllerGetVolume` CSI RPC 並報送 VolumeConditionAbnormal 事件以及 PVC 上的消息。
只有具有 `LIST_VOLUMES` 和 `VOLUME_CONDITION` 控制器能力、
或者具有 `GET_VOLUME` 和 `VOLUME_CONDITION` 能力的 CSI 驅動程式才支持外部控制器中的卷健康監控。

<!--
To implement the volume health feature from the controller side, a CSI driver **must** add support for the new controller capabilities.
-->
要從控制器端實現卷健康功能，CSI 驅動程式**必須**添加對新控制器功能的支持。

<!--
If a CSI driver supports `LIST_VOLUMES` and `VOLUME_CONDITION` controller capabilities, it **must** implement controller RPC `ListVolumes` and report the volume condition in the response.
-->
如果 CSI 驅動程式支持 `LIST_VOLUMES` 和 `VOLUME_CONDITION` 控制器功能，它**必須**實現控制器 RPC `ListVolumes` 並在響應中報送卷狀況。

<!--
If a CSI driver supports `GET_VOLUME` and `VOLUME_CONDITION` controller capability, it **must** implement controller PRC `ControllerGetVolume` and report the volume condition in the response.
-->
如果 CSI 驅動程式支持 `GET_VOLUME` 和 `VOLUME_CONDITION` 控制器功能，它**必須**實現控制器 PRC `ControllerGetVolume` 並在響應中報送卷狀況。

<!--
If a CSI driver supports `LIST_VOLUMES`, `GET_VOLUME`, and `VOLUME_CONDITION` controller capabilities, only `ListVolumes` CSI RPC will be invoked by the External Health Monitor Controller.
-->
如果 CSI 驅動程式支持 `LIST_VOLUMES`、`GET_VOLUME` 和 `VOLUME_CONDITION` 控制器功能，則外部健康監視控制器將僅調用 `ListVolumes` CSI RPC。

<!--
### Node Side Volume Health Monitoring
-->
### 節點側卷健康監控

<!--
Kubelet calls `NodeGetVolumeStats` CSI RPC and reports VolumeConditionAbnormal events with messages on Pods if abnormal volume conditions are detected. Only CSI drivers with `VOLUME_CONDITION` node capability support Volume Health Monitoring in Kubelet.
-->
如果檢測到異常的卷條件，
Kubelet 會調用 `NodeGetVolumeStats` CSI RPC 並報送 VolumeConditionAbnormal 事件以及 Pod 上的資訊。
只有具有 `VOLUME_CONDITION` 節點功能的 CSI 驅動程式才支持 Kubelet 中的卷健康監控。

<!--
To implement the volume health feature from the node side, a CSI driver **must** add support for the new node capabilities.
-->
要從節點端實現卷健康功能，CSI 驅動程式**必須**添加對新節點功能的支持。

<!--
If a CSI driver supports `VOLUME_CONDITION` node capability, it **must** report the volume condition in node RPC `NodeGetVoumeStats`.
-->
如果 CSI 驅動程式支持 `VOLUME_CONDITION` 節點能力，它**必須**在節點 RPC `NodeGetVoumeStats` 中報送卷狀況。

<!--
## What’s next?
-->
## 下一步是什麼？

<!--
Depending on feedback and adoption, the Kubernetes team plans to push the CSI volume health implementation to beta in either 1.22 or 1.23.
-->
根據反饋和採納情況，Kubernetes 團隊計劃在 1.22 或 1.23 中將 CSI 卷健康實施推向 beta。

<!--
We are also exploring how to use volume health information for programmatic detection and automatic reconcile in Kubernetes.
-->
我們還在探索如何在 Kubernetes 中使用卷健康資訊進行編程檢測和自動協調。

<!--
## How can I learn more?
-->
## 如何瞭解更多？

<!--
To learn the design details for Volume Health Monitoring, read the [Volume Health Monitor](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1432-volume-health-monitor) enhancement proposal.
-->
要了解卷健康監控的設計細節，請閱讀[卷健康監控](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1432-volume-health-monitor)增強提案。

<!--
The Volume Health Monitor controller source code is at [https://github.com/kubernetes-csi/external-health-monitor](https://github.com/kubernetes-csi/external-health-monitor).
-->
卷健康檢測控制器源代碼位於：
[https://github.com/kubernetes-csi/external-health-monitor](https://github.com/kubernetes-csi/external-health-monitor)。

<!--
There are also more details about volume health checks in the [Container Storage Interface Documentation](https://kubernetes-csi.github.io/docs/).
-->
[容器儲存介面文檔](https://kubernetes-csi.github.io/docs/)中還有關於卷健康檢查的更多詳細資訊。

<!--
## How do I get involved?
-->
## 如何參與？

<!--
The [Kubernetes Slack channel #csi](https://kubernetes.slack.com/messages/csi) and any of the [standard SIG Storage communication channels](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact) are great mediums to reach out to the SIG Storage and the CSI team.
-->
[Kubernetes Slack 頻道 #csi](https://kubernetes.slack.com/messages/csi)
和任何[標準 SIG Storage 通信頻道](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact)都是聯繫 SIG Storage 和 CSI 團隊的絕佳媒介。

<!--
We offer a huge thank you to the contributors who helped release this feature in 1.21. We want to thank Yuquan Ren ([NickrenREN](https://github.com/nickrenren)) who implemented the initial volume health monitor controller and agent in the external health monitor repo, thank Ran Xu ([fengzixu](https://github.com/fengzixu)) who moved the volume health monitoring logic from the external agent to Kubelet in 1.21, and we offer special thanks to the following people for their insightful reviews: David Ashpole ([dashpole](https://github.com/dashpole)), Michelle Au ([msau42](https://github.com/msau42)), David Eads ([deads2k](https://github.com/deads2k)), Elana Hashman ([ehashman](https://github.com/ehashman)), Seth Jennings ([sjenning](https://github.com/sjenning)), and Jiawei Wang ([Jiawei0227](https://github.com/Jiawei0227)).
--> 
我們非常感謝在 1.21 中幫助發佈此功能的貢獻者。
我們要感謝 Yuquan Ren ([NickrenREN](https://github.com/nickrenren)) 在外部健康監控倉庫中實現了初始卷健康監控控制器和代理，
感謝 Ran Xu ([fengzixu](https://github.com/fengzixu)) 在 1.21 中將卷健康監控邏輯從外部代理轉移到 Kubelet，
我們特別感謝以下人員的深刻評論：
David Ashpole ([dashpole](https://github.com/dashpole))、
Michelle Au ([msau42](https://github.com/msau42))、
David Eads ([deads2k](https://github.com/deads2k))、
Elana Hashman ([ehashman](https://github.com/ehashman))、
Seth Jennings ([sjenning](https://github.com/sjenning)) 和 Jiawei Wang ([Jiawei0227](https://github.com/Jiawei0227))

<!--
Those interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system, join the [Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG). We’re rapidly growing and always welcome new contributors.
-->
那些有興趣參與 CSI 或 Kubernetes 儲存系統任何部分的設計和開發的人，
請加入 [Kubernetes Storage 特殊興趣小組](https://github.com/kubernetes/community/tree/master/sig-storage)（SIG）。
我們正在迅速發展，並且歡迎新的貢獻者。
