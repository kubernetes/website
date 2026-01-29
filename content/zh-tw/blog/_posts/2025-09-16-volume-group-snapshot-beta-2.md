---
layout: blog
title: "Kubernetes v1.34: 將卷組快照推進至 v1beta2 階段"
date: 2025-09-16T10:30:00-08:00
slug: kubernetes-v1-34-volume-group-snapshot-beta-2
author: >
   Xing Yang (VMware by Broadcom)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.34: Moving Volume Group Snapshots to v1beta2"
date: 2025-09-16T10:30:00-08:00
slug: kubernetes-v1-34-volume-group-snapshot-beta-2
author: >
   Xing Yang (VMware by Broadcom)
-->

<!--
Volume group snapshots were [introduced](/blog/2023/05/08/kubernetes-1-27-volume-group-snapshot-alpha/)
as an Alpha feature with the Kubernetes 1.27 release and moved to [Beta](/blog/2024/12/18/kubernetes-1-32-volume-group-snapshot-beta/) in the Kubernetes 1.32 release.
The recent release of Kubernetes v1.34 moved that support to a second beta.
The support for volume group snapshots relies on a set of
[extension APIs for group snapshots](https://kubernetes-csi.github.io/docs/group-snapshot-restore-feature.html#volume-group-snapshot-apis).
These APIs allow users to take crash consistent snapshots for a set of volumes.
Behind the scenes, Kubernetes uses a label selector to group multiple PersistentVolumeClaims
for snapshotting.
A key aim is to allow you restore that set of snapshots to new volumes and
recover your workload based on a crash consistent recovery point.

This new feature is only supported for [CSI](https://kubernetes-csi.github.io/docs/) volume drivers.
-->
卷組快照在 Kubernetes 1.27 版本中作爲 Alpha 特性被引入，
並在 Kubernetes 1.32 版本中移至 [Beta](/zh-cn/blog/2024/12/18/kubernetes-1-32-volume-group-snapshot-beta/) 階段。
Kubernetes v1.34 的最近一次發佈將該支持移至第二個 Beta 階段。
對卷組快照的支持依賴於一組[用於組快照的擴展 API](https://kubernetes-csi.github.io/docs/group-snapshot-restore-feature.html#volume-group-snapshot-apis)。
這些 API 允許使用者爲一組卷獲取崩潰一致性快照。在後臺，Kubernetes 根據標籤選擇器對多個
PersistentVolumeClaim 分組，並進行快照操作。關鍵目標是允許你將這組快照恢復到新捲上，
並基於崩潰一致性恢復點恢復工作負載。

此新特性僅支持 [CSI](https://kubernetes-csi.github.io/docs/) 卷驅動。

<!--
## What's new in Beta 2?

While testing the beta version, we encountered an [issue](https://github.com/kubernetes-csi/external-snapshotter/issues/1271) where the `restoreSize` field is not set for individual VolumeSnapshotContents and VolumeSnapshots if CSI driver does not implement the ListSnapshots RPC call.
We evaluated various options [here](https://docs.google.com/document/d/1LLBSHcnlLTaP6ZKjugtSGQHH2LGZPndyfnNqR1YvzS4/edit?tab=t.0) and decided to make this change releasing a new beta for the API.
-->
## Beta 2 的新內容

在測試 Beta 版本時，我們遇到了一個問題：如果 CSI 驅動未實現 ListSnapshots RPC 調用，
則對於單獨的 VolumeSnapshotContent 和 VolumeSnapshot 來說，`restoreSize` 字段不會被設置。
我們在這裏評估了不同的選項[此處](https://docs.google.com/document/d/1LLBSHcnlLTaP6ZKjugtSGQHH2LGZPndyfnNqR1YvzS4/edit?tab=t.0)，
並決定爲此發佈一個新的 Beta 版本 API。

<!--
Specifically, a VolumeSnapshotInfo struct is added in v1beta2, it contains information for an individual volume snapshot that is a member of a volume group snapshot.
VolumeSnapshotInfoList, a list of VolumeSnapshotInfo, is added to VolumeGroupSnapshotContentStatus, replacing VolumeSnapshotHandlePairList.
VolumeSnapshotInfoList is a list of snapshot information returned by the CSI driver to identify snapshots on the storage system.
VolumeSnapshotInfoList is populated by the csi-snapshotter sidecar based on the CSI CreateVolumeGroupSnapshotResponse returned by the CSI driver's CreateVolumeGroupSnapshot call.

The existing v1beta1 API objects will be converted to the new v1beta2 API objects by a conversion webhook.
-->
具體來說，在 v1beta2 中添加了一個 VolumeSnapshotInfo 結構，它包含了屬於卷組快照成員的單個卷快照的資訊。

VolumeSnapshotInfoList，即 VolumeSnapshotInfo 的列表，被添加到 VolumeGroupSnapshotContentStatus
中，取代了 VolumeSnapshotHandlePairList。

VolumeSnapshotInfoList 是 CSI 驅動通過 ListSnapshots 調用返回的快照資訊列表，用於識別儲存系統上的快照。

VolumeSnapshotInfoList 由 csi-snapshotter 邊車根據 CSI 驅動的 CreateVolumeGroupSnapshot
調用返回的 CSI CreateVolumeGroupSnapshotResponse 填充。

現有的 v1beta1 API 對象將通過轉換 Webhook 轉換爲新的 v1beta2 API 對象。

<!--
## What’s next?

Depending on feedback and adoption, the Kubernetes project plans to push the volume
group snapshot implementation to general availability (GA) in a future release.
-->
## 接下來？

根據反饋和採用情況，Kubernetes 項目計劃在未來的版本中將卷組快照實現推進到正式發佈版本（GA）。

<!--
## How can I learn more?

- The [design spec](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/3476-volume-group-snapshot)
  for the volume group snapshot feature.
- The [code repository](https://github.com/kubernetes-csi/external-snapshotter) for volume group
  snapshot APIs and controller.
- CSI [documentation](https://kubernetes-csi.github.io/docs/) on the group snapshot feature.
-->
## 如何瞭解更多？

- 卷組快照特性的[設計規範](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/3476-volume-group-snapshot)。
- 卷組快照 API 和控制器的[代碼倉庫](https://github.com/kubernetes-csi/external-snapshotter)。
- CSI 關於組快照特性的[文檔](https://kubernetes-csi.github.io/docs/)。

<!--
## How do I get involved?

This project, like all of Kubernetes, is the result of hard work by many contributors
from diverse backgrounds working together. On behalf of SIG Storage, I would like to
offer a huge thank you to the contributors who stepped up these last few quarters
to help the project reach beta:
-->
## 如何參與？

這個項目，如同所有的 Kubernetes 項目一樣，是許多來自不同背景的貢獻者共同努力的結果。
代表 SIG Storage，我想對過去幾個季度中挺身而出幫助項目達到 Beta 階段的貢獻者們表示巨大的感謝：


* Ben Swartzlander ([bswartz](https://github.com/bswartz))
* Hemant Kumar ([gnufied](https://github.com/gnufied))
* Jan Šafránek ([jsafrane](https://github.com/jsafrane))
* Madhu Rajanna ([Madhu-1](https://github.com/Madhu-1))
* Michelle Au ([msau42](https://github.com/msau42))
* Niels de Vos ([nixpanic](https://github.com/nixpanic))
* Leonardo Cecchi ([leonardoce](https://github.com/leonardoce))
* Saad Ali ([saad-ali](https://github.com/saad-ali))
* Xing Yang ([xing-yang](https://github.com/xing-yang))
* Yati Padia ([yati1998](https://github.com/yati1998))

<!--
For those interested in getting involved with the design and development of CSI or
any part of the Kubernetes Storage system, join the
[Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG).
We always welcome new contributors.

We also hold regular [Data Protection Working Group meetings](https://github.com/kubernetes/community/tree/master/wg-data-protection).
New attendees are welcome to join our discussions.
-->
對於那些有興趣參與 CSI 或 Kubernetes 儲存系統任何部分的設計和開發的人，可以加入
[Kubernetes 儲存特別興趣小組](https://github.com/kubernetes/community/tree/master/sig-storage)（SIG）。
我們始終歡迎新的貢獻者。

我們還定期舉行[資料保護工作組會議](https://github.com/kubernetes/community/tree/master/wg-data-protection)。
新參會者可以加入我們的討論。
