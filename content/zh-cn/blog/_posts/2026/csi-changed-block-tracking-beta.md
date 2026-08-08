---
layout: blog
title: "Kubernetes 变更块跟踪（Changed Block Tracking，CBT）API - Beta 差异"
draft: true
date: 2026-07-07T10:00:00-08:00
slug: csi-changed-block-tracking-beta
author: >
   [Prasad Ghangal](https://github.com/PrasadG193) (Veeam Kasten)
translator: >
   [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: 'Kubernetes Changed Block Tracking API - Beta Differences'
draft: true
date: 2026-07-07T10:00:00-08:00
slug: csi-changed-block-tracking-beta
author: >
   [Prasad Ghangal](https://github.com/PrasadG193) (Veeam Kasten)
-->

<!--
Changed Block Tracking (CBT) support for CSI drivers
[shipped as Alpha](/blog/2025/09/25/csi-changed-block-tracking/) in
September 2025. With the March `v1.0.0` release of the
[external-snapshot-metadata](https://github.com/kubernetes-csi/external-snapshot-metadata)
project, the feature moved to **Beta**.
-->
CSI 驱动的变更块跟踪（Changed Block Tracking，CBT）支持已于
2025 年 9 月[作为 Alpha 特性发布](/zh-cn/blog/2025/09/25/csi-changed-block-tracking/)。
随着 [external-snapshot-metadata](https://github.com/kubernetes-csi/external-snapshot-metadata)
项目在 3 月发布 `v1.0.0` 版本，该特性已进入 **Beta** 阶段。

<!--
If you aren't yet familiar with _changed block tracking_ for storage in
Kubernetes, the
[Alpha announcement](/blog/2025/09/25/csi-changed-block-tracking/) covers
the motivation, the three primary components (the CSI `SnapshotMetadata`
gRPC service, the SnapshotMetadataService CRD, and the
`external-snapshot-metadata` sidecar), and a walkthrough of how to use the
API. This post focuses on what is different in Beta.
-->
如果你还不熟悉 Kubernetes 存储的**变更块跟踪**，
[Alpha 公告](/zh-cn/blog/2025/09/25/csi-changed-block-tracking/)介绍了其动机、
三个主要组件（CSI `SnapshotMetadata` gRPC 服务、SnapshotMetadataService CRD
和 `external-snapshot-metadata` 边车）以及如何使用该 API 的演练。
本文重点关注 Beta 版本中的不同之处。

<!--
## What's new in Beta
-->
## Beta 中的新特性

<!--
The main change in this release is the promotion of the
SnapshotMetadataService CRD from `v1alpha1` to `v1beta1`. The CRD used to
advertise a driver's metadata service now serves
`cbt.storage.k8s.io/v1beta1`. The schema itself is unchanged, but this
release **removes** `v1alpha1` (rather than serving it alongside the new version).
If you are upgrading from Alpha, you need to:
-->
此版本的主要变更是将 SnapshotMetadataService CRD 从 `v1alpha1` 升级到 `v1beta1`。
用于通告驱动元数据服务的 CRD 现在提供 `cbt.storage.k8s.io/v1beta1`。
模式本身没有变化，但此版本**移除了** `v1alpha1`（而不是与新版本同时提供）。
如果你从 Alpha 升级，需要：

- 重新应用 `v1.0.0` 附带的 CRD 定义。
- 更新 SnapshotMetadataService 清单，使用 `apiVersion: cbt.storage.k8s.io/v1beta1`。
- 更新任何与该 CRD 通信的客户端或控制器代码。

<!--
This is a one-time change. There is no automatic conversion between the two
versions.
-->
这是一次性变更。两个版本之间没有自动转换。

<!--
## Compatibility
-->
## 兼容性

- 最低 Kubernetes 版本：**1.33**
- CSI 规范：**1.10 或更高**
- 容器镜像：`registry.k8s.io/sig-storage/csi-snapshot-metadata:v1.0.0`

<!--
## Trying it out
-->
## 试用

<!--
The [Getting Started section in the Alpha
blog](/blog/2025/09/25/csi-changed-block-tracking/#getting-started) still
applies. In short:
-->
[Alpha 博客中的入门章节](/zh-cn/blog/2025/09/25/csi-changed-block-tracking/#getting-started)
仍然适用。简而言之：

1. 确保你的 CSI 驱动支持卷快照并附带 `external-snapshot-metadata` 边车。
2. 安装 SnapshotMetadataService CRD（`v1.0.0` 版本中的 `v1beta1` 定义）。
3. 为你的驱动创建一个 SnapshotMetadataService 资源。
4. 使用客户端 —— `snapshot-metadata-lister` 或你自己的实现 ——
   调用 `GetMetadataAllocated` 和 `GetMetadataDelta`。

<!--
If you want to see the full flow end-to-end, the
[hostpath driver example](https://github.com/kubernetes-csi/csi-driver-host-path/blob/master/docs/example-ephemeral.md)
is a good starting point.
-->
如果你想查看完整的端到端流程，
[hostpath 驱动示例](https://github.com/kubernetes-csi/csi-driver-host-path/blob/master/docs/example-ephemeral.md)是一个很好的起点。

<!--
## What's next?
-->
## 下一步？

<!--
The focus for the rest of the Beta cycle is wider CSI driver adoption and
operational feedback before the feature moves towards GA. If you maintain a
CSI driver, this is a good time to evaluate adding support. If you are
building a backup application on top of the API, feedback on the streaming
clients and the iterator package is very welcome.
-->
Beta 周期剩余阶段的重点是更广泛的 CSI 驱动采用和运维反馈，
然后该特性才会向 GA 推进。如果你维护一个 CSI 驱动，
现在是评估添加支持的好时机。如果你正在基于该 API 构建备份应用，
非常欢迎提供关于流式客户端和迭代器包的反馈。

<!--
## Where can I learn more?
-->
## 在哪里可以了解更多？

- [CSI 开发者文档](https://kubernetes-csi.github.io/docs/external-snapshot-metadata.html)
  中的快照元数据部分。
- [KEP-3314](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/3314-csi-changed-block-tracking)。
- [external-snapshot-metadata](https://github.com/kubernetes-csi/external-snapshot-metadata)
  仓库。
- gRPC
  [模式](https://github.com/kubernetes-csi/external-snapshot-metadata/blob/main/proto/schema.proto)。
- [snapshot-metadata-lister](https://github.com/kubernetes-csi/external-snapshot-metadata/tree/main/examples/snapshot-metadata-lister)
  示例客户端。

<!--
## How do I get involved?
-->
## 如何参与？

<!--
This work is the result of contributions from many people across SIG Storage.
A big thank you to everyone who helped review, code, and test the feature
through Alpha and into Beta:
-->
这项工作是 SIG Storage 许多人贡献的结果。衷心感谢所有在 Alpha 到 Beta 期间
帮助审查、编码和测试该特性的人：

- Ben Swartzlander ([bswartz](https://github.com/bswartz))
- Carl Braganza ([carlbraganza](https://github.com/carlbraganza))
- Daniil Fedotov ([hairyhum](https://github.com/hairyhum))
- Ivan Sim ([ihcsim](https://github.com/ihcsim))
- Nikhil Ladha ([Nikhil-Ladha](https://github.com/Nikhil-Ladha))
- Praveen M ([iPraveenParihar](https://github.com/iPraveenParihar))
- Rakshith R ([Rakshith-R](https://github.com/Rakshith-R))
- Xing Yang ([xing-yang](https://github.com/xing-yang))

<!--
If you would like to get involved with CSI or storage in Kubernetes,
[SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage)
is the place to start. The [Data Protection Working
Group](https://docs.google.com/document/d/15tLCV3csvjHbKb16DVk-mfUmFry_Rlwo-2uG6KNGsfw/edit)
also holds regular meetings, and new attendees are always welcome.
-->
如果你想参与 Kubernetes 中的 CSI 或存储相关工作，
[SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage)
是一个很好的起点。
[数据保护工作组](https://docs.google.com/document/d/15tLCV3csvjHbKb16DVk-mfUmFry_Rlwo-2uG6KNGsfw/edit)
也会定期举行会议，随时欢迎新参与者加入。
