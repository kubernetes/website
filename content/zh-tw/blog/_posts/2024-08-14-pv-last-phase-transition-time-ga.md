---
layout: blog
title: "Kubernetes v1.31: PersistentVolume 的最後階段轉換時間進階到 GA"
date: 2024-08-14
slug: last-phase-transition-time-ga
author: >
  Roman Bednář (Red Hat)
translator: >
  [Jin Li](https://github.com/qlijin) (UOS)
---
<!--
layout: blog
title: "Kubernetes v1.31: PersistentVolume Last Phase Transition Time Moves to GA"
date: 2024-08-14
slug: last-phase-transition-time-ga
author: >
  Roman Bednář (Red Hat)
-->

<!--
Announcing the graduation to General Availability (GA) of the PersistentVolume `lastTransitionTime` status
field, in Kubernetes v1.31!

The Kubernetes SIG Storage team is excited to announce that the "PersistentVolumeLastPhaseTransitionTime" feature, introduced
as an alpha in Kubernetes v1.28, has now reached GA status and is officially part of the Kubernetes v1.31 release. This enhancement
helps Kubernetes users understand when a [PersistentVolume](/docs/concepts/storage/persistent-volumes/) transitions between 
different phases, allowing for more efficient and informed resource management.
-->
現在宣佈 PersistentVolume 的 `lastTransitionTime` 狀態字段在 Kubernetes v1.31
版本進階至正式發佈（GA）！

Kubernetes SIG Storage 團隊很高興地宣佈，"PersistentVolumeLastPhaseTransitionTime"
特性自 Kubernetes v1.28 作爲 Alpha 版本引入以來，現已進階至正式發佈（GA），並正式成爲
Kubernetes v1.31 版本的一部分。該功能幫助 Kubernetes 用戶增強對
[PersistentVolume](/zh-cn/docs/concepts/storage/persistent-volumes/)
在不同階段之間轉換的理解，從而實現更高效和更明智的資源管理。

<!--
For a v1.31 cluster, you can now assume that every PersistentVolume object has a
`.status.lastTransitionTime` field, that holds a timestamp of
when the volume last transitioned its phase. This change is not immediate; the new field will be populated whenever a PersistentVolume
is updated and first transitions between phases (`Pending`, `Bound`, or `Released`) after upgrading to Kubernetes v1.31.
-->
在 v1.31 集羣中，你可以默認每個 PersistentVolume 對象都包含
`.status.lastTransitionTime` 字段，該字段記錄存儲卷最近一次發生階段轉換時的時間戳。
該更改不會立刻生效，而是在升級到 Kubernetes v1.31 後，當 PersistentVolume
發生更新並首次在（`Pending`、`Bound` 或 `Released`）這幾個階段之間進行轉換時，
纔會填充該字段。

<!--
## What changed?

The API strategy for updating PersistentVolume objects has been modified to populate the `.status.lastTransitionTime` field with the
current timestamp whenever a PersistentVolume transitions phases. Users are allowed to set this field manually if needed, but it will
be overwritten when the PersistentVolume transitions phases again.
-->
## 有什麼變化？  {#what-changed}

更新 PersistentVolume 對象的 API 策略已經被修改，
當存儲卷轉換階段時會自動填充當前時間戳到 `.status.lastTransitionTime` 字段。
如果需要，用戶可以手動設置該字段，但當 PersistentVolume
再次轉換階段時，該字段會被新時間戳覆蓋。

<!--
For more details, read about
[Phase transition timestamp](/docs/concepts/storage/persistent-volumes/#phase-transition-timestamp) in the Kubernetes documentation.
You can also read the previous [blog post](/blog/2023/10/23/persistent-volume-last-phase-transition-time) announcing the feature as alpha in v1.28.
-->
想了解更多信息，可以查閱 Kubernetes 文檔中的
[階段轉換時間戳](/zh-cn/docs/concepts/storage/persistent-volumes/#phase-transition-timestamp)。
你還可以閱讀此前的
[博客文章](/zh-cn/blog/2023/10/23/persistent-volume-last-phase-transition-time)，
該文章介紹了此特性在 v1.28 版本中作爲 Alpha 版本發佈的情況。

<!--
To provide feedback, join our [Kubernetes Storage Special-Interest-Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG)
or participate in discussions on our [public Slack channel](https://app.slack.com/client/T09NY5SBT/C09QZFCE5).
-->
要提供反饋，請加入我們的
[Kubernetes 存儲特別興趣小組](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG)
或參與[公共 Slack 頻道](https://app.slack.com/client/T09NY5SBT/C09QZFCE5)上的討論。
