---
layout: blog
title: "Kubernetes 1.31: 節點 Cgroup 驅動程式的自動設定 (beta)"
date: 2024-08-21
slug: cri-cgroup-driver-lookup-now-beta
author: >
  Peter Hunt (Red Hat)
translator: >
  XiaoYang Zhang (Huawei)
---
<!--
layout: blog
title: "Kubernetes 1.31: Autoconfiguration For Node Cgroup Driver (beta)"
date: 2024-08-21
slug: cri-cgroup-driver-lookup-now-beta
author: >
Peter Hunt (Red Hat)
-->

<!--
Historically, configuring the correct cgroup driver has been a pain point for users running new
Kubernetes clusters. On Linux systems, there are two different cgroup drivers:
`cgroupfs` and `systemd`. In the past, both the [kubelet](/docs/reference/command-line-tools-reference/kubelet/)
and CRI implementation (like CRI-O or containerd) needed to be configured to use
the same cgroup driver, or else the kubelet would exit with an error. This was a
source of headaches for many cluster admins. However, there is light at the end of the tunnel!
-->
一直以來，爲新運行的 Kubernetes 叢集設定正確的 cgroup 驅動程式是使用者的一個痛點。
在 Linux 系統中，存在兩種不同的 cgroup 驅動程式：`cgroupfs` 和 `systemd`。
過去，[kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/) 和 CRI
實現（如 CRI-O 或 containerd）需要設定爲使用相同的 cgroup 驅動程式， 否則 kubelet 會報錯並退出。
這讓許多叢集管理員頭疼不已。不過，現在曙光乍現！

<!--
## Automated cgroup driver detection

In v1.28.0, the SIG Node community introduced the feature gate
`KubeletCgroupDriverFromCRI`, which instructs the kubelet to ask the CRI
implementation which cgroup driver to use. A few minor releases of Kubernetes
happened whilst we waited for support to land in the major two CRI implementations
(containerd and CRI-O), but as of v1.31.0, this feature is now beta!
-->
## 自動檢測 cgroup 驅動程式

在 v1.28.0 版本中，SIG Node 社區引入了 `KubeletCgroupDriverFromCRI` 特性門控，
它指示 kubelet 向 CRI 實現詢問使用哪個 cgroup 驅動程式。在兩個主要的 CRI 實現（containerd
和 CRI-O）增加對該功能的支持這段期間，Kubernetes 經歷了幾次小版本發佈，但從 v1.31.0 版本開始，此功能現已進入 beta 階段！

<!--
In addition to setting the feature gate, a cluster admin needs to ensure their
CRI implementation is new enough:

- containerd: Support was added in v2.0.0
- CRI-O: Support was added in v1.28.0
-->
除了設置特性門控之外，叢集管理員還需要確保 CRI 實現版本足夠新：

- containerd：v2.0.0 版本開始支持
- CRI-O：v1.28.0 版本開始支持

<!--
Then, they should ensure their CRI implementation is configured to the
cgroup_driver they would like to use.
-->
然後，他們應該確保設定其 CRI 實現使用他們想要的 cgroup 驅動程式。

<!--
## Future work

Eventually, support for the kubelet's `cgroupDriver` configuration field will be
dropped, and the kubelet will fail to start if the CRI implementation isn't new
enough to have support for this feature.
-->
## 未來工作

最終，kubelet 對 `cgroupDriver` 設定字段的支持將會被移除，如果 CRI 實現的版本不夠新，無法支持此功能，kubelet 將無法啓動。