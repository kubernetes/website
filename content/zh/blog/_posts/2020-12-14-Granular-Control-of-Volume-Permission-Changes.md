--- 
layout: blog 
title: 'Kubernetes 1.20: 卷权限修改的粒度控制'
date: 2020-12-14 
slug: kubernetes-release-1.20-fsGroupChangePolicy-fsGroupPolicy
---

**作者**: Hemant Kumar, Red Hat & Christian Huffman, Red Hat

Kubernetes 1.20 带来了两个重要的 beta 功能，使 Kubernetes 管理员和用户都可以更充分地控制在 Pod 中挂载卷时如何应用卷权限。
<!--
--- 
layout: blog 
title: 'Kubernetes 1.20: Granular Control of Volume Permission Changes'
date: 2020-12-14 
slug: kubernetes-release-1.20-fsGroupChangePolicy-fsGroupPolicy
---

**Authors**: Hemant Kumar, Red Hat & Christian Huffman, Red Hat

Kubernetes 1.20 brings two important beta features, allowing Kubernetes admins and users alike to have more adequate control over how volume permissions are applied when a volume is mounted inside a Pod.
-->

<!--
### Allow users to skip recursive permission changes on mount
Traditionally if your pod is running as a non-root user ([which you should](https://twitter.com/thockin/status/1333892204490735617)), you must specify a `fsGroup` inside the pod’s security context so that the volume can be readable and writable by the Pod. This requirement is covered in more detail in [here](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/).

But one side-effect of setting `fsGroup` is that, each time a volume is mounted, Kubernetes must recursively `chown()` and `chmod()` all the files and directories inside the volume - with a few exceptions noted below. This happens even if group ownership of the volume already matches the requested `fsGroup`, and can be pretty expensive for larger volumes with lots of small files, which causes pod startup to take a long time. This scenario has been a [known problem](https://github.com/kubernetes/kubernetes/issues/69699) for a while, and in Kubernetes 1.20 we are providing knobs to opt-out of recursive permission changes if the volume already has the correct permissions.

When configuring a pod’s security context, set `fsGroupChangePolicy` to "OnRootMismatch" so if the root of the volume already has the correct permissions, the recursive permission change can be skipped. Kubernetes ensures that permissions of the top-level directory are changed last the first time it applies permissions.
-->
### 允许用户跳过挂载时的递归权限更改
传统意义上，如果你的 Pod 以非 root 用户运行 ([你应该这样做](https://twitter.com/thockin/status/1333892204490735617))，
你必须在 Pod 的安全上下文中指定一个 `fsGroup`，以便 Pod 可以读写该卷。
[此处](/zh/docs/tasks/configure-pod-container/security-context/)更详细地介绍了此要求。

但是设置 `fsGroup` 的一个副作用是，每次挂载一个卷时，Kubernetes 必须递归 `chown()` 和 `chmod()` 该卷中的所有文件和目录-以下有一些例外。即使该卷的组所有权已经与所请求的 `fsGroup` 相匹配，这种情况也会发生，并且对于具有许多小文件的较大卷来说可能开销非常大，这会导致 Pod 启动花费很长时间。这种情况已经成为 [已知问题](https://github.com/kubernetes/kubernetes/issues/69699) 一段时间了，并且在 Kubernetes 1.20中，如果卷已经具有正确的权限，我们将提供旋钮以选择退出递归权限更改。

在配置 Pod 的安全上下文时，请将 `fsGroupChangePolicy` 设置为"OnRootMismatch"，这样，如果卷的根目录已经具有正确的权限，则可以跳过递归权限的更改。Kubernetes 确保在初次使用权限时最后修改顶级目录的权限。

```yaml
securityContext:
  runAsUser: 1000
  runAsGroup: 3000
  fsGroup: 2000
  fsGroupChangePolicy: "OnRootMismatch"
```
<!--
You can learn more about this in [Configure volume permission and ownership change policy for Pods](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/#configure-volume-permission-and-ownership-change-policy-for-pods).
-->
你可以通过 [为 Pods 配置卷权限和所有权更改策略](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/#configure-volume-permission-and-ownership-change-policy-for-pods) 了解更多。

<!--
### Allow CSI Drivers to declare support for fsGroup based permissions

Although the previous section implied that Kubernetes _always_ recursively changes permissions of a volume if a Pod has a `fsGroup`, this is not strictly true. For certain multi-writer volume types, such as NFS or Gluster, the cluster doesn’t perform recursive permission changes even if the pod has a `fsGroup`. Other volume types may not even support `chown()`/`chmod()`, which rely on Unix-style permission control primitives. 

So how do we know when to apply recursive permission changes and when we shouldn't? For in-tree storage drivers, this was relatively simple. For [CSI](https://kubernetes-csi.github.io/docs/introduction.html#introduction) drivers that could span a multitude of platforms and storage types, this problem can be a bigger challenge.

Previously, whenever a CSI volume was mounted to a Pod, Kubernetes would attempt to automatically determine if the permissions and ownership should be modified. These methods were imprecise and could cause issues as we already mentioned, depending on the storage type.

The CSIDriver custom resource now has a `.spec.fsGroupPolicy` field, allowing storage drivers to explicitly opt in or out of these recursive modifications. By having the CSI driver specify a policy for the backing volumes, Kubernetes can avoid needless modification attempts. This optimization helps to reduce volume mount time and also cuts own reporting errors about modifications that would never succeed.
-->
### 允许 CSI 驱动程序声明对基于 fsGroup 的权限的支持

尽管上一节暗示如果 Pod 具有 `fsGroup`，Kubernetes _总是_递归地更改卷的权限，但这并不是严格意义上正确的。
对于某些支持多写者的卷类型，例如 NFS 或 Gluster，即使 Pod 具有 `fsGroup`，集群也不会执行递归权限更改。
其他卷类型甚至可能不支持 `chown()`/`chmod()`，它们依赖于 Unix 风格的权限控制原语。

那么，我们如何知道何时应用或不应用递归权限更改呢？对于树内存储驱动程序，这相对简单。对于可能跨越多种平台和存储类型的 [CSI](https://kubernetes-csi.github.io/docs/introduction.html#introduction) 驱动程序，此问题可能是一个更大的挑战。

以前，每当将 CSI 卷挂载入 Pod 时，Kubernetes 都会尝试自动确定是否应修改权限和所有权。这些方法不精确，可能会导致问题，正如我们已经提到的，具体取决于存储类型。

CSIDriver 定制资源现在具有一个 `.spec.fsGroupPolicy` 字段，从而允许存储驱动程序显式选择加入或退出这些递归修改。通过让 CSI 驱动程序为后备卷指定策略，Kubernetes 可以避免不必要的修改尝试。此优化有助于减少卷挂载时间，并减少永远无法成功进行的修改的报告错误。

<!--
#### CSIDriver FSGroupPolicy API

Three FSGroupPolicy values are available as of Kubernetes 1.20, with more planned for future releases.

- **ReadWriteOnceWithFSType** - This is the default policy, applied if no `fsGroupPolicy` is defined; this preserves the behavior from previous Kubernetes releases. Each volume is examined at mount time to determine if permissions should be recursively applied.
- **File** - Always attempt to apply permission modifications, regardless of the filesystem type or PersistentVolumeClaim’s access mode.
- **None** - Never apply permission modifications.
-->
#### CSIDriver FSGroupPolicy API

从 Kubernetes 1.20 开始，三个 FSGroupPolicy 值可用，并且为将来的版本预设了更多的值。

- **ReadWriteOnceWithFSType** - 这是默认策略，如果未定义 `fsGroupPolicy`，则应用此策略；这保留了 Kubernetes 以前版本中的行为。在挂载时检查每个卷，以确定是否应循环地应用权限。
- **File** - 无论文件系统类型或 PersistentVolumeClaim 的访问模式如何，始终尝试应用权限修改。
- **None** - 切勿应用权限修改。

<!--
#### How do I use it?
The only configuration needed is defining `fsGroupPolicy` inside of the `.spec` for a CSIDriver. Once that element is defined, any subsequently mounted volumes will automatically use the defined policy. There’s no additional deployment required!
-->
#### 如何使用？
唯一需要的配置是在 CSIDriver 的 .spec 内定义 fsGroupPolicy。定义该参数后，所有后续挂载的卷将自动使用定义的策略。无需其他部署！

<!--
#### What’s next?

Depending on feedback and adoption, the Kubernetes team plans to push these implementations to GA in either 1.21 or 1.22. 
-->
#### 接下来怎么办？

根据反馈和采用情况，Kubernetes 团队计划在 1.21 或 1.22 版本中将这些实现正式发布。

<!--
### How can I learn more?
This feature is explained in more detail in Kubernetes project documentation: [CSI Driver fsGroup Support](https://kubernetes-csi.github.io/docs/support-fsgroup.html) and [Configure volume permission and ownership change policy for Pods ](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/#configure-volume-permission-and-ownership-change-policy-for-pods).
-->
### 如何了解更多？
Kubernetes项目文档中更详细地说明了此功能：[CSI Driver fsGroup Support](https://kubernetes-csi.github.io/docs/support-fsgroup.html) 及 [为 Pods 配置卷权限和所有权更改策略 ](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/#configure-volume-permission-and-ownership-change-policy-for-pods)。

<!--
### How do I get involved?
The [Kubernetes Slack channel #csi](https://kubernetes.slack.com/messages/csi) and any of the [standard SIG Storage communication channels](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact) are great mediums to reach out to the SIG Storage and the CSI team.

Those interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system, join the [Kubernetes Storage Special Interest Group (SIG)](https://github.com/kubernetes/community/tree/master/sig-storage). We’re rapidly growing and always welcome new contributors.
-->
### 如何加入？
[Kubernetes Slack 频道 #csi](https://kubernetes.slack.com/messages/csi) 和任意 [标准SIG存储通信频道](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact) 是联系 SIG 存储和 CSI 团队的绝佳媒介。

对参与 CSI 或 Kubernetes 存储系统任何部分的设计和开发感兴趣的人，请加入 [Kubernetes Storage Special Interest Group (SIG)](https://github.com/kubernetes/community/tree/master/sig-storage)。我们正在迅速发展，并随时欢迎新的贡献者。
