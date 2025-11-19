---
layout: blog
title: "Kubernetes v1.28：可追溯的默認 StorageClass 進階至 GA"
date: 2023-08-18
slug: retroactive-default-storage-class-ga
---

<!--
layout: blog
title: "Kubernetes v1.28: Retroactive Default StorageClass move to GA"
date: 2023-08-18
slug: retroactive-default-storage-class-ga
-->

<!--
**Author:** Roman Bednář (Red Hat)
-->
**作者:** Roman Bednář (Red Hat)

**譯者:** [Michael Yao](https://github.com/windsonsea) (DaoCloud)

<!--
Announcing graduation to General Availability (GA) - Retroactive Default StorageClass Assignment
in Kubernetes v1.28!
-->
可追溯的默認 StorageClass 賦值（Retroactive Default StorageClass Assignment）在
Kubernetes v1.28 中宣佈進階至正式發佈（GA）！

<!--
Kubernetes SIG Storage team is thrilled to announce that the
"Retroactive Default StorageClass Assignment" feature,
introduced as an alpha in Kubernetes v1.25, has now graduated to GA
and is officially part of the Kubernetes v1.28 release.
This enhancement brings a significant improvement to how default
[StorageClasses](/docs/concepts/storage/storage-classes/) are assigned
to PersistentVolumeClaims (PVCs).
-->
Kubernetes SIG Storage 團隊非常高興地宣佈，在 Kubernetes v1.25 中作爲
Alpha 特性引入的 “可追溯默認 StorageClass 賦值” 現已進階至 GA，
並正式成爲 Kubernetes v1.28 發行版的一部分。
這項增強特性極大地改進了默認的 [StorageClasses](/zh-cn/docs/concepts/storage/storage-classes/)
爲 PersistentVolumeClaim (PVC) 賦值的方式。

<!--
With this feature enabled, you no longer need to create a default StorageClass
first and then a PVC to assign the class. Instead, any PVCs without a StorageClass
assigned will now be retroactively updated to include the default StorageClass.
This enhancement ensures that PVCs no longer get stuck in an unbound state,
and storage provisioning works seamlessly,
even when a default StorageClass is not defined at the time of PVC creation.
-->
啓用此特性後，你不再需要先創建默認的 StorageClass，再創建 PVC 來指定存儲類。
現在，未分配 StorageClass 的所有 PVC 都將被自動更新爲包含默認的 StorageClass。
此項增強特性確保即使默認的 StorageClass 在 PVC 創建時未被定義，
PVC 也不會再滯留在未綁定狀態，存儲製備工作可以無縫進行。

<!--
## What changed?

The PersistentVolume (PV) controller has been modified to automatically assign
a default StorageClass to any unbound PersistentVolumeClaim with the `storageClassName` not set.
Additionally, the PersistentVolumeClaim admission validation mechanism within
the API server has been adjusted to allow changing values from an unset state
to an actual StorageClass name.
-->
## 有什麼變化？   {#what-changed}

PersistentVolume (PV) 控制器已修改爲：當未設置 `storageClassName` 時，自動向任何未綁定的
PersistentVolumeClaim 分配一個默認的 StorageClass。此外，API 伺服器中的 PersistentVolumeClaim
准入驗證機制也已調整爲允許將值從未設置狀態更改爲實際的 StorageClass 名稱。

<!--
## How to use it?

As this feature has graduated to GA, there's no need to enable a feature gate anymore.
Simply make sure you are running Kubernetes v1.28 or later, and the feature will be
available for use.
-->
## 如何使用？  {#how-to-use-it}

由於此特性已進階至 GA，所以不再需要啓用特性門控。
只需確保你運行的是 Kubernetes v1.28 或更高版本，此特性即可供使用。

<!--
For more details, read about
[default StorageClass assignment](/docs/concepts/storage/persistent-volumes/#retroactive-default-storageclass-assignment)
in the Kubernetes documentation. You can also read the previous
[blog post](/blog/2023/01/05/retroactive-default-storage-class/)
announcing beta graduation in v1.26.
-->
有關更多細節，可以查閱 Kubernetes
文檔中的[默認 StorageClass 賦值](/zh-cn/docs/concepts/storage/persistent-volumes/#retroactive-default-storageclass-assignment)。
你也可以閱讀以前在 v1.26 中宣佈進階至 Beta
的[博客文章](/zh-cn/blog/2023/01/05/retroactive-default-storage-class/)。

<!--
To provide feedback, join our [Kubernetes Storage Special-Interest-Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG)
or participate in discussions on our [public Slack channel](https://app.slack.com/client/T09NY5SBT/C09QZFCE5).
-->
要提供反饋，請加入我們的
[Kubernetes 存儲特別興趣小組](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG)
或參與[公共 Slack 頻道](https://app.slack.com/client/T09NY5SBT/C09QZFCE5)上的討論。
