---
layout: blog
title: "Kubernetes v1.28：可追溯的默认 StorageClass 进阶至 GA"
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

**译者:** [Michael Yao](https://github.com/windsonsea) (DaoCloud)

<!--
Announcing graduation to General Availability (GA) - Retroactive Default StorageClass Assignment
in Kubernetes v1.28!
-->
可追溯的默认 StorageClass 赋值（Retroactive Default StorageClass Assignment）在
Kubernetes v1.28 中宣布进阶至正式发布（GA）！

<!--
Kubernetes SIG Storage team is thrilled to announce that the
"Retroactive Default StorageClass Assignment" feature,
introduced as an alpha in Kubernetes v1.25, has now graduated to GA
and is officially part of the Kubernetes v1.28 release.
This enhancement brings a significant improvement to how default
[StorageClasses](/docs/concepts/storage/storage-classes/) are assigned
to PersistentVolumeClaims (PVCs).
-->
Kubernetes SIG Storage 团队非常高兴地宣布，在 Kubernetes v1.25 中作为
Alpha 特性引入的 “可追溯默认 StorageClass 赋值” 现已进阶至 GA，
并正式成为 Kubernetes v1.28 发行版的一部分。
这项增强特性极大地改进了默认的 [StorageClasses](/zh-cn/docs/concepts/storage/storage-classes/)
为 PersistentVolumeClaim (PVC) 赋值的方式。

<!--
With this feature enabled, you no longer need to create a default StorageClass
first and then a PVC to assign the class. Instead, any PVCs without a StorageClass
assigned will now be retroactively updated to include the default StorageClass.
This enhancement ensures that PVCs no longer get stuck in an unbound state,
and storage provisioning works seamlessly,
even when a default StorageClass is not defined at the time of PVC creation.
-->
启用此特性后，你不再需要先创建默认的 StorageClass，再创建 PVC 来指定存储类。
现在，未分配 StorageClass 的所有 PVC 都将被自动更新为包含默认的 StorageClass。
此项增强特性确保即使默认的 StorageClass 在 PVC 创建时未被定义，
PVC 也不会再滞留在未绑定状态，存储制备工作可以无缝进行。

<!--
## What changed?

The PersistentVolume (PV) controller has been modified to automatically assign
a default StorageClass to any unbound PersistentVolumeClaim with the `storageClassName` not set.
Additionally, the PersistentVolumeClaim admission validation mechanism within
the API server has been adjusted to allow changing values from an unset state
to an actual StorageClass name.
-->
## 有什么变化？   {#what-changed}

PersistentVolume (PV) 控制器已修改为：当未设置 `storageClassName` 时，自动向任何未绑定的
PersistentVolumeClaim 分配一个默认的 StorageClass。此外，API 服务器中的 PersistentVolumeClaim
准入验证机制也已调整为允许将值从未设置状态更改为实际的 StorageClass 名称。

<!--
## How to use it?

As this feature has graduated to GA, there's no need to enable a feature gate anymore.
Simply make sure you are running Kubernetes v1.28 or later, and the feature will be
available for use.
-->
## 如何使用？  {#how-to-use-it}

由于此特性已进阶至 GA，所以不再需要启用特性门控。
只需确保你运行的是 Kubernetes v1.28 或更高版本，此特性即可供使用。

<!--
For more details, read about
[default StorageClass assignment](/docs/concepts/storage/persistent-volumes/#retroactive-default-storageclass-assignment)
in the Kubernetes documentation. You can also read the previous
[blog post](/blog/2023/01/05/retroactive-default-storage-class/)
announcing beta graduation in v1.26.
-->
有关更多细节，可以查阅 Kubernetes
文档中的[默认 StorageClass 赋值](/zh-cn/docs/concepts/storage/persistent-volumes/#retroactive-default-storageclass-assignment)。
你也可以阅读以前在 v1.26 中宣布进阶至 Beta
的[博客文章](/zh-cn/blog/2023/01/05/retroactive-default-storage-class/)。

<!--
To provide feedback, join our [Kubernetes Storage Special-Interest-Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG)
or participate in discussions on our [public Slack channel](https://app.slack.com/client/T09NY5SBT/C09QZFCE5).
-->
要提供反馈，请加入我们的
[Kubernetes 存储特别兴趣小组](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG)
或参与[公共 Slack 频道](https://app.slack.com/client/T09NY5SBT/C09QZFCE5)上的讨论。
