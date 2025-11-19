---
layout: blog
title: "Kubernetes 1.27：持久卷的單個 Pod 訪問模式升級到 Beta"
date: 2023-04-20
slug: read-write-once-pod-access-mode-beta
---
<!--
layout: blog
title: "Kubernetes 1.27: Single Pod Access Mode for PersistentVolumes Graduates to Beta"
date: 2023-04-20
slug: read-write-once-pod-access-mode-beta
-->

<!--
**Author:** Chris Henzie (Google)
-->
**作者**：Chris Henzie (Google)

**譯者**：顧欣 (ICBC)

<!--
With the release of Kubernetes v1.27 the ReadWriteOncePod feature has graduated
to beta. In this blog post, we'll take a closer look at this feature, what it
does, and how it has evolved in the beta release.
-->
隨着 Kubernetes v1.27 的發佈，ReadWriteOncePod 功能已經升級爲 Beta 版。
在這篇博客文章中，我們將更詳細地介紹這個功能，作用以及在 Beta 版本中的發展。

<!--
## What is ReadWriteOncePod?
-->
## 什麼是 ReadWriteOncePod  {#what-is-readwriteoncepod}

<!--
ReadWriteOncePod is a new access mode for
[PersistentVolumes](/docs/concepts/storage/persistent-volumes/#persistent-volumes) (PVs)
and [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) (PVCs)
introduced in Kubernetes v1.22. This access mode enables you to restrict volume
access to a single pod in the cluster, ensuring that only one pod can write to
the volume at a time. This can be particularly useful for stateful workloads
that require single-writer access to storage.
-->
ReadWriteOncePod 是 Kubernetes 在 v1.22 中引入的一種新的訪問模式，
適用於 [PersistentVolume](/zh-cn/docs/concepts/storage/persistent-volumes/#persistent-volumes)(PVs)
和 [PersistentVolumeClaim](/zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)(PVCs)。
此訪問模式使你能夠將存儲卷訪問限制在集羣中的單個 Pod 上，確保一次只有一個 Pod 可以寫入存儲卷。
這可能對需要單一寫入者訪問存儲的有狀態工作負載特別有用。

<!--
For more context on access modes and how ReadWriteOncePod works read
[What are access modes and why are they important?](/blog/2021/09/13/read-write-once-pod-access-mode-alpha/#what-are-access-modes-and-why-are-they-important)
in the _Introducing Single Pod Access Mode for PersistentVolumes_ article from 2021.
-->
要了解有關訪問模式和 ReadWriteOncePod 如何工作的更多背景信息，
請閱讀 2021 年介紹 PersistentVolume 的單個 Pod 訪問模式的文章中的[什麼是訪問模式和爲什麼它們如此重要？](/blog/2021/09/13/read-write-once-pod-access-mode-alpha/#what-are-access-modes-and-why-are-they-important)。

<!--
## Changes in the ReadWriteOncePod beta
-->
## ReadWriteOncePod 的 Beta 版中變化  {#changes-in-the-readwriteoncepod-beta}

<!--
The ReadWriteOncePod beta adds support for
[scheduler preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
of pods using ReadWriteOncePod PVCs.
-->
ReadWriteOncePod Beta 版爲使用 ReadWriteOncePod PVC 的 Pod 添加[調度器搶佔](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)。

<!--
Scheduler preemption allows higher-priority pods to preempt lower-priority pods,
so that they can start running on the same node. With this release, pods using
ReadWriteOncePod PVCs can also be preempted if a higher-priority pod requires
the same PVC.
-->
調度器搶佔允許更高優先級的 Pod 搶佔較低優先級的 Pod，以便它們可以在同一節點上運行。
在此版本中，如果更高優先級的 Pod 需要相同的 PVC，使用 ReadWriteOncePod PVCs 的 Pod 也可以被搶佔。

<!--
## How can I start using ReadWriteOncePod?
-->
## 如何開始使用 ReadWriteOncePod？  {#how-can-i-start-using-readwriteoncepod}

<!--
With ReadWriteOncePod now in beta, it will be enabled by default in cluster
versions v1.27 and beyond.
-->
隨着 ReadWriteOncePod 現已升級爲 Beta 版，在 v1.27 及更高版本的集羣中將默認啓用該功能。

<!--
Note that ReadWriteOncePod is
[only supported for CSI volumes](/docs/concepts/storage/persistent-volumes/#access-modes).
Before using this feature you will need to update the following
[CSI sidecars](https://kubernetes-csi.github.io/docs/sidecar-containers.html)
to these versions or greater:
-->
請注意，ReadWriteOncePod [僅支持 CSI 卷](/zh-cn/docs/concepts/storage/persistent-volumes/#access-modes)。
在使用此功能之前，你需要將以下 [CSI Sidecars](https://kubernetes-csi.github.io/docs/sidecar-containers.html)更新至以下版本或更高版本：

<!--
- [csi-provisioner:v3.0.0+](https://github.com/kubernetes-csi/external-provisioner/releases/tag/v3.0.0)
- [csi-attacher:v3.3.0+](https://github.com/kubernetes-csi/external-attacher/releases/tag/v3.3.0)
- [csi-resizer:v1.3.0+](https://github.com/kubernetes-csi/external-resizer/releases/tag/v1.3.0)
-->
- [csi-provisioner:v3.0.0+](https://github.com/kubernetes-csi/external-provisioner/releases/tag/v3.0.0)
- [csi-attacher:v3.3.0+](https://github.com/kubernetes-csi/external-attacher/releases/tag/v3.3.0)
- [csi-resizer:v1.3.0+](https://github.com/kubernetes-csi/external-resizer/releases/tag/v1.3.0)

<!--
To start using ReadWriteOncePod, create a PVC with the ReadWriteOncePod access mode:
-->
要開始使用 ReadWriteOncePod，請創建具有 ReadWriteOncePod 訪問模式的 PVC：

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: single-writer-only
spec:
  accessModes:
  - ReadWriteOncePod #僅允許一個容器訪問且獨佔寫入權限。
  resources:
    requests:
      storage: 1Gi
```

<!--
If your storage plugin supports
[dynamic provisioning](/docs/concepts/storage/dynamic-provisioning/),
new PersistentVolumes will be created with the ReadWriteOncePod access mode applied.

Read [Migrating existing PersistentVolumes](/blog/2021/09/13/read-write-once-pod-access-mode-alpha/#migrating-existing-persistentvolumes)
for details on migrating existing volumes to use ReadWriteOncePod.
-->
如果你的存儲插件支持[動態製備](/zh-cn/docs/concepts/storage/dynamic-provisioning/)，
新創建的持久卷將應用 ReadWriteOncePod 訪問模式。

閱讀[遷移現有持久卷](/blog/2021/09/13/read-write-once-pod-access-mode-alpha/#migrating-existing-persistentvolumes)
以瞭解如何遷移現有卷以使用 ReadWriteOncePod。

<!--
## How can I learn more?
-->
## 如何瞭解更多信息？ {#how-can-i-learn-more}

<!--
Please see the [alpha blog post](/blog/2021/09/13/read-write-once-pod-access-mode-alpha)
and [KEP-2485](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/2485-read-write-once-pod-pv-access-mode/README.md)
for more details on the ReadWriteOncePod access mode and motivations for CSI spec changes.
-->
請查看 [Alpha 版博客](/blog/2021/09/13/read-write-once-pod-access-mode-alpha)和
[KEP-2485](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/2485-read-write-once-pod-pv-access-mode/README.md)
以瞭解關於 ReadWriteOncePod 訪問模式的更多詳細信息以及對 CSI 規約作更改的動機。

<!--
## How do I get involved?
-->
## 如何參與？ {#how-do-i-get-involved}

<!--
The [Kubernetes #csi Slack channel](https://kubernetes.slack.com/messages/csi)
and any of the standard
[SIG Storage communication channels](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact)
are great mediums to reach out to the SIG Storage and the CSI teams.
-->
[Kubernetes #csi Slack](https://kubernetes.slack.com/messages/csi)頻道以及任何常規的
[SIG 存儲溝通渠道](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact)
都是聯繫 SIG 存儲和 CSI 團隊的最佳途徑。

<!--
Special thanks to the following people whose thoughtful reviews and feedback helped shape this feature:
-->
特別感謝以下人士的仔細的審查和反饋，幫助完成了這個功能：

<!--
* Abdullah Gharaibeh (ahg-g)
* Aldo Culquicondor (alculquicondor)
* Antonio Ojea (aojea)
* David Eads (deads2k)
* Jan Šafránek (jsafrane)
* Joe Betz (jpbetz)
* Kante Yin (kerthcet)
* Michelle Au (msau42)
* Tim Bannister (sftim)
* Xing Yang (xing-yang)
-->
* Abdullah Gharaibeh (ahg-g)
* Aldo Culquicondor (alculquicondor)
* Antonio Ojea (aojea)
* David Eads (deads2k)
* Jan Šafránek (jsafrane)
* Joe Betz (jpbetz)
* Kante Yin (kerthcet)
* Michelle Au (msau42)
* Tim Bannister (sftim)
* Xing Yang (xing-yang)

<!--
If you’re interested in getting involved with the design and development of CSI
or any part of the Kubernetes storage system, join the
[Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG).
We’re rapidly growing and always welcome new contributors.
-->
如果您有興趣參與 CSI 或 Kubernetes 存儲系統的任何部分的設計和開發，
請加入 [Kubernetes 存儲特別興趣小組](https://github.com/kubernetes/community/tree/master/sig-storage)(SIG)。
我們正在迅速發展，始終歡迎新的貢獻者。