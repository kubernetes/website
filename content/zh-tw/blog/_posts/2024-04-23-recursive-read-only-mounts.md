---
layout: blog
title: 'Kubernetes 1.30：只讀卷掛載終於可以真正實現只讀了'
date: 2024-04-23
slug: recursive-read-only-mounts
---

**作者:** Akihiro Suda (NTT)

**譯者:** Xin Li (DaoCloud)

<!--
layout: blog
title: 'Kubernetes 1.30: Read-only volume mounts can be finally literally read-only'
date: 2024-04-23
slug: recursive-read-only-mounts
author: >
  Akihiro Suda (NTT)
-->

<!--
Read-only volume mounts have been a feature of Kubernetes since the beginning.
Surprisingly, read-only mounts are not completely read-only under certain conditions on Linux.
As of the v1.30 release, they can be made completely read-only,
with alpha support for _recursive read-only mounts_.
-->
只讀卷掛載從一開始就是 Kubernetes 的一個特性。
令人驚訝的是，在 Linux 上的某些條件下，只讀掛載並不是完全只讀的。
從 v1.30 版本開始，這類卷掛載可以被處理爲完全只讀；v1.30 爲**遞歸只讀掛載**提供 Alpha 支持。

<!--
## Read-only volume mounts are not really read-only by default

Volume mounts can be deceptively complicated.

You might expect that the following manifest makes everything under `/mnt` in the containers read-only:
-->
## 預設情況下，只讀卷裝載並不是真正的只讀

卷掛載可能看似複雜。

你可能期望以下清單使容器中 `/mnt` 下的所有內容變爲只讀：

```yaml
---
apiVersion: v1
kind: Pod
spec:
  volumes:
    - name: mnt
      hostPath:
        path: /mnt
  containers:
    - volumeMounts:
        - name: mnt
          mountPath: /mnt
          readOnly: true
```

<!--
However, any sub-mounts beneath `/mnt` may still be writable!
For example, consider that `/mnt/my-nfs-server` is writeable on the host.
Inside the container, writes to `/mnt/*` will be rejected but `/mnt/my-nfs-server/*` will still be writeable.
-->
但是，`/mnt` 下的任何子掛載可能仍然是可寫的！
例如，假設 `/mnt/my-nfs-server` 在主機上是可寫的。
在容器內部，寫入 `/mnt/*` 將被拒絕，但 `/mnt/my-nfs-server/*` 仍然可寫。

<!--
## New mount option: recursiveReadOnly

Kubernetes 1.30 added a new mount option `recursiveReadOnly` so as to make submounts recursively read-only.

The option can be enabled as follows:
-->
## 新的掛載選項：遞歸只讀

Kubernetes 1.30 添加了一個新的掛載選項 `recursiveReadOnly`，以使子掛載遞歸只讀。

可以按如下方式啓用該選項：

<!--
# Possible values are `Enabled`, `IfPossible`, and `Disabled`.
# Needs to be specified in conjunction with `readOnly: true`.
-->
{{< highlight yaml "linenos=false,hl_lines=14-17" >}}
---
apiVersion: v1
kind: Pod
spec:
  volumes:
    - name: mnt
      hostPath:
        path: /mnt
  containers:
    - volumeMounts:
        - name: mnt
          mountPath: /mnt
          readOnly: true
          # NEW
          # 可能的值爲 `Enabled`、`IfPossible` 和 `Disabled`。
          # 需要與 `readOnly: true` 一起指定。
          recursiveReadOnly: Enabled
{{< /highlight >}}

<!--
This is implemented by applying the `MOUNT_ATTR_RDONLY` attribute with the `AT_RECURSIVE` flag
using [`mount_setattr(2)`](https://man7.org/linux/man-pages/man2/mount_setattr.2.html) added in
Linux kernel v5.12.

For backwards compatibility, the `recursiveReadOnly` field is not a replacement for `readOnly`,
but is used _in conjunction_ with it.
To get a properly recursive read-only mount, you must set both fields.
-->
這是通過使用 Linux 內核 v5.12 中添加的
[`mount_setattr(2)`](https://man7.org/linux/man-pages/man2/mount_setattr.2.html)
應用帶有 `AT_RECURSIVE` 標誌的 `MOUNT_ATTR_RDONLY` 屬性來實現的。

爲了向後兼容，`recursiveReadOnly` 字段不是 `readOnly` 的替代品，而是與其結合使用。
要獲得正確的遞歸只讀掛載，你必須設置這兩個字段。

<!--
## Feature availability {#availability}

To enable `recursiveReadOnly` mounts, the following components have to be used:
-->
## 特性可用性   {#availability}

要啓用 `recursiveReadOnly` 掛載，必須使用以下組件：

<!--
* Kubernetes: v1.30 or later, with the `RecursiveReadOnlyMounts`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) enabled.
  As of v1.30, the gate is marked as alpha.

* CRI runtime:
  * containerd: v2.0 or later

* OCI runtime:
  * runc: v1.1 or later
  * crun: v1.8.6 or later

* Linux kernel: v5.12 or later
-->
* Kubernetes：v1.30 或更新版本，並啓用 `RecursiveReadOnlyMounts` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
  從 v1.30 開始，此特性被標記爲 Alpha。

* CRI 運行時：
  * containerd：v2.0 或更新版本

* OCI 運行時：
  * runc：v1.1 或更新版本
  * crun: v1.8.6 或更新版本

* Linux 內核: v5.12 或更新版本


<!--
## What's next?

Kubernetes SIG Node hope - and expect - that the feature will be promoted to beta and eventually
general availability (GA) in future releases of Kubernetes, so that users no longer need to enable
the feature gate manually.

The default value of `recursiveReadOnly` will still remain `Disabled`, for backwards compatibility.
-->
## 接下來

Kubernetes SIG Node 希望並期望該特性將在 Kubernetes
的未來版本中升級爲 Beta 版本並最終穩定可用（GA），以便使用者不再需要手動啓用此特性門控。

爲了向後兼容，`recursive ReadOnly` 的預設值仍將保持 `Disabled`。

<!--
## How can I learn more?
-->
## 怎樣才能瞭解更多？

<!-- https://github.com/kubernetes/website/pull/45159 -->

<!--
Please check out the [documentation](/docs/concepts/storage/volumes/#read-only-mounts)
for the further details of `recursiveReadOnly` mounts.
-->
請查看[文檔](/zh-cn/docs/concepts/storage/volumes/#read-only-mounts)以獲取
`recursiveReadOnly` 掛載的更多詳細資訊。

<!--
## How to get involved?

This feature is driven by the SIG Node community. Please join us to connect with
the community and share your ideas and feedback around the above feature and
beyond. We look forward to hearing from you!
-->
## 如何參與？

此特性由 SIG Node 社區推動。
請加入我們，與社區建立聯繫，並分享你對上述特性及其他特性的想法和反饋。
我們期待你的迴音！
