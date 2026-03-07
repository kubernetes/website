---
layout: blog
title: 'Kubernetes 1.30：只读卷挂载终于可以真正实现只读了'
date: 2024-04-23
slug: recursive-read-only-mounts
---

**作者:** Akihiro Suda (NTT)

**译者:** Xin Li (DaoCloud)

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
只读卷挂载从一开始就是 Kubernetes 的一个特性。
令人惊讶的是，在 Linux 上的某些条件下，只读挂载并不是完全只读的。
从 v1.30 版本开始，这类卷挂载可以被处理为完全只读；v1.30 为**递归只读挂载**提供 Alpha 支持。

<!--
## Read-only volume mounts are not really read-only by default

Volume mounts can be deceptively complicated.

You might expect that the following manifest makes everything under `/mnt` in the containers read-only:
-->
## 默认情况下，只读卷装载并不是真正的只读

卷挂载可能看似复杂。

你可能期望以下清单使容器中 `/mnt` 下的所有内容变为只读：

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
但是，`/mnt` 下的任何子挂载可能仍然是可写的！
例如，假设 `/mnt/my-nfs-server` 在主机上是可写的。
在容器内部，写入 `/mnt/*` 将被拒绝，但 `/mnt/my-nfs-server/*` 仍然可写。

<!--
## New mount option: recursiveReadOnly

Kubernetes 1.30 added a new mount option `recursiveReadOnly` so as to make submounts recursively read-only.

The option can be enabled as follows:
-->
## 新的挂载选项：递归只读

Kubernetes 1.30 添加了一个新的挂载选项 `recursiveReadOnly`，以使子挂载递归只读。

可以按如下方式启用该选项：

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
          # 可能的值为 `Enabled`、`IfPossible` 和 `Disabled`。
          # 需要与 `readOnly: true` 一起指定。
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
这是通过使用 Linux 内核 v5.12 中添加的
[`mount_setattr(2)`](https://man7.org/linux/man-pages/man2/mount_setattr.2.html)
应用带有 `AT_RECURSIVE` 标志的 `MOUNT_ATTR_RDONLY` 属性来实现的。

为了向后兼容，`recursiveReadOnly` 字段不是 `readOnly` 的替代品，而是与其结合使用。
要获得正确的递归只读挂载，你必须设置这两个字段。

<!--
## Feature availability {#availability}

To enable `recursiveReadOnly` mounts, the following components have to be used:
-->
## 特性可用性   {#availability}

要启用 `recursiveReadOnly` 挂载，必须使用以下组件：

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
* Kubernetes：v1.30 或更新版本，并启用 `RecursiveReadOnlyMounts` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
  从 v1.30 开始，此特性被标记为 Alpha。

* CRI 运行时：
  * containerd：v2.0 或更新版本

* OCI 运行时：
  * runc：v1.1 或更新版本
  * crun: v1.8.6 或更新版本

* Linux 内核: v5.12 或更新版本


<!--
## What's next?

Kubernetes SIG Node hope - and expect - that the feature will be promoted to beta and eventually
general availability (GA) in future releases of Kubernetes, so that users no longer need to enable
the feature gate manually.

The default value of `recursiveReadOnly` will still remain `Disabled`, for backwards compatibility.
-->
## 接下来

Kubernetes SIG Node 希望并期望该特性将在 Kubernetes
的未来版本中升级为 Beta 版本并最终稳定可用（GA），以便用户不再需要手动启用此特性门控。

为了向后兼容，`recursive ReadOnly` 的默认值仍将保持 `Disabled`。

<!--
## How can I learn more?
-->
## 怎样才能了解更多？

<!-- https://github.com/kubernetes/website/pull/45159 -->

<!--
Please check out the [documentation](/docs/concepts/storage/volumes/#read-only-mounts)
for the further details of `recursiveReadOnly` mounts.
-->
请查看[文档](/zh-cn/docs/concepts/storage/volumes/#read-only-mounts)以获取
`recursiveReadOnly` 挂载的更多详细信息。

<!--
## How to get involved?

This feature is driven by the SIG Node community. Please join us to connect with
the community and share your ideas and feedback around the above feature and
beyond. We look forward to hearing from you!
-->
## 如何参与？

此特性由 SIG Node 社区推动。
请加入我们，与社区建立联系，并分享你对上述特性及其他特性的想法和反馈。
我们期待你的回音！
