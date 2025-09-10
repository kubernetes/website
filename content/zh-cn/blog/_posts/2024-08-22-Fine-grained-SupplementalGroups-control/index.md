---
layout: blog
title: 'Kubernetes 1.31：细粒度的 SupplementalGroups 控制'
date: 2024-08-22
slug: fine-grained-supplementalgroups-control
author: >
  Shingo Omura (Woven By Toyota)
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: 'Kubernetes 1.31: Fine-grained SupplementalGroups control'
date: 2024-08-22
slug: fine-grained-supplementalgroups-control
author: >
  Shingo Omura (Woven By Toyota)
-->

<!--
This blog discusses a new feature in Kubernetes 1.31 to improve the handling of supplementary groups in containers within Pods.
-->
本博客讨论了 Kubernetes 1.31 中的一项新特性，目的是改善处理 Pod 中容器内的附加组。

<!--
## Motivation: Implicit group memberships defined in `/etc/group` in the container image

Although this behavior may not be popular with many Kubernetes cluster users/admins, kubernetes, by default, _merges_ group information from the Pod with information defined in `/etc/group` in the container image.

Let's see an example, below Pod specifies `runAsUser=1000`, `runAsGroup=3000` and `supplementalGroups=4000` in the Pod's security context.
-->
## 动机：容器镜像中 `/etc/group` 中定义的隐式组成员关系

尽管这种行为可能并不受许多 Kubernetes 集群用户/管理员的欢迎，
但 Kubernetes 默认情况下会将 Pod 中的组信息与容器镜像中 `/etc/group` 中定义的信息进行**合并**。

让我们看一个例子，以下 Pod 在 Pod 的安全上下文中指定了
`runAsUser=1000`、`runAsGroup=3000` 和 `supplementalGroups=4000`。

{{% code_sample file="implicit-groups.yaml" %}}

<!--
What is the result of `id` command in the `ctr` container?

```console
# Create the Pod:
$ kubectl apply -f https://k8s.io/blog/2024-08-22-Fine-grained-SupplementalGroups-control/implicit-groups.yaml

# Verify that the Pod's Container is running:
$ kubectl get pod implicit-groups

# Check the id command
$ kubectl exec implicit-groups -- id
```
-->
在 `ctr` 容器中执行 `id` 命令的结果是什么？

```console
# 创建 Pod：
$ kubectl apply -f https://k8s.io/blog/2024-08-22-Fine-grained-SupplementalGroups-control/implicit-groups.yaml

# 验证 Pod 的容器正在运行：
$ kubectl get pod implicit-groups

# 检查 id 命令
$ kubectl exec implicit-groups -- id
```

<!--
Then, output should be similar to this:
-->
输出应类似于：

```none
uid=1000 gid=3000 groups=3000,4000,50000
```

<!--
Where does group ID `50000` in supplementary groups (`groups` field) come from, even though `50000` is not defined in the Pod's manifest at all? The answer is `/etc/group` file in the container image.

Checking the contents of `/etc/group` in the container image should show below:
-->
尽管 `50000` 根本没有在 Pod 的清单中被定义，但附加组中的组 ID `50000`（`groups` 字段）是从哪里来的呢？
答案是容器镜像中的 `/etc/group` 文件。

检查容器镜像中 `/etc/group` 的内容应如下所示：

```console
$ kubectl exec implicit-groups -- cat /etc/group
...
user-defined-in-image:x:1000:
group-defined-in-image:x:50000:user-defined-in-image
```

<!--
Aha! The container's primary user `1000` belongs to the group `50000` in the last entry.

Thus, the group membership defined in `/etc/group` in the container image for the container's primary user is _implicitly_ merged to the information from the Pod. Please note that this was a design decision the current CRI implementations inherited from Docker, and the community never really reconsidered it until now.
-->
原来如此！容器的主要用户 `1000` 属于最后一个条目中的组 `50000`。

因此，容器镜像中为容器的主要用户定义的组成员关系会被**隐式**合并到 Pod 的信息中。
请注意，这是当前 CRI 实现从 Docker 继承的设计决策，而社区直到现在才重新考虑这个问题。

<!--
### What's wrong with it?

The _implicitly_ merged group information from `/etc/group` in the container image may cause some concerns particularly in accessing volumes (see [kubernetes/kubernetes#112879](https://issue.k8s.io/112879) for details) because file permission is controlled by uid/gid in Linux. Even worse, the implicit gids from `/etc/group` can not be detected/validated by any policy engines because there is no clue for the implicit group information in the manifest. This can also be a concern for Kubernetes security.
-->
### 这有什么问题？

从容器镜像中的 `/etc/group` **隐式**合并的组信息可能会引起一些担忧，特别是在访问卷时
（有关细节参见 [kubernetes/kubernetes#112879](https://issue.k8s.io/112879)），
因为在 Linux 中文件权限是通过 uid/gid 进行控制的。
更糟糕的是，隐式的 gid 无法被任何策略引擎所检测/验证，因为在清单中没有隐式组信息的线索。
这对 Kubernetes 的安全性也可能构成隐患。

<!--
## Fine-grained SupplementalGroups control in a Pod: `SupplementaryGroupsPolicy`

To tackle the above problem, Kubernetes 1.31 introduces new field `supplementalGroupsPolicy` in Pod's `.spec.securityContext`.

This field provies a way to control how to calculate supplementary groups for the container processes in a Pod. The available policy is below:
-->
## Pod 中的细粒度 SupplementalGroups 控制：`SupplementaryGroupsPolicy`

为了解决上述问题，Kubernetes 1.31 在 Pod 的 `.spec.securityContext`
中引入了新的字段 `supplementalGroupsPolicy`。

此字段提供了一种控制 Pod 中容器进程如何计算附加组的方法。可用的策略如下：

<!--
* _Merge_: The group membership defined in `/etc/group` for the container's primary user will be merged. If not specified, this policy will be applied (i.e. as-is behavior for backword compatibility).

* _Strict_: it only attaches specified group IDs in `fsGroup`, `supplementalGroups`, or `runAsGroup` fields as the supplementary groups of the container processes. This means no group membership defined in `/etc/group` for the container's primary user will be merged.

Let's see how `Strict` policy works.
-->
* **Merge**：将容器的主要用户在 `/etc/group` 中定义的组成员关系进行合并。
  如果不指定，则应用此策略（即为了向后兼容性而保持的原有行为）。

* **Strict**：仅将 `fsGroup`、`supplementalGroups` 或 `runAsGroup`
  字段中指定的组 ID 挂接为容器进程的附加组。这意味着容器的主要用户在 `/etc/group` 中定义的任何组成员关系都不会被合并。

让我们看看 `Strict` 策略是如何工作的。

{{% code_sample file="strict-supplementalgroups-policy.yaml" %}}

<!--
```console
# Create the Pod:
$ kubectl apply -f https://k8s.io/blog/2024-08-22-Fine-grained-SupplementalGroups-control/strict-supplementalgroups-policy.yaml

# Verify that the Pod's Container is running:
$ kubectl get pod strict-supplementalgroups-policy

# Check the process identity:
kubectl exec -it strict-supplementalgroups-policy -- id
```
-->
```console
# 创建 Pod：
$ kubectl apply -f https://k8s.io/blog/2024-08-22-Fine-grained-SupplementalGroups-control/strict-supplementalgroups-policy.yaml

# 验证 Pod 的容器正在运行：
$ kubectl get pod strict-supplementalgroups-policy

# 检查进程身份：
kubectl exec -it strict-supplementalgroups-policy -- id
```

<!--
The output should be similar to this:
-->
输出应类似于：

```none
uid=1000 gid=3000 groups=3000,4000
```

<!--
You can see `Strict` policy can exclude group `50000` from `groups`! 

Thus, ensuring `supplementalGroupsPolicy: Strict` (enforced by some policy mechanism) helps prevent the implicit supplementary groups in a Pod.
-->
你可以看到 `Strict` 策略可以将组 `50000` 从 `groups` 中排除出去！

因此，确保（通过某些策略机制强制执行的）`supplementalGroupsPolicy: Strict` 有助于防止 Pod 中的隐式附加组。

{{<note>}}
<!--
Actually, this is not enough because container with sufficient privileges / capability can change its process identity. Please see the following section for details.
-->
实际上，这还不够，因为具有足够权限/能力的容器可以更改其进程身份。
有关细节参见以下章节。
{{</note>}}

<!--
## Attached process identity in Pod status

This feature also exposes the process identity attached to the first container process of the container
via `.status.containerStatuses[].user.linux` field. It would be helpful to see if implicit group IDs are attached.
-->
## Pod 状态中挂接的进程身份

此特性还通过 `.status.containerStatuses[].user.linux`
字段公开挂接到容器的第一个容器进程的进程身份。这将有助于查看隐式组 ID 是否被挂接。

```yaml
...
status:
  containerStatuses:
  - name: ctr
    user:
      linux:
        gid: 3000
        supplementalGroups:
        - 3000
        - 4000
        uid: 1000
...
```

{{<note>}}
<!--
Please note that the values in `status.containerStatuses[].user.linux` field is _the firstly attached_
process identity to the first container process in the container. If the container has sufficient privilege
to call system calls related to process identity (e.g. [`setuid(2)`](https://man7.org/linux/man-pages/man2/setuid.2.html), [`setgid(2)`](https://man7.org/linux/man-pages/man2/setgid.2.html) or [`setgroups(2)`](https://man7.org/linux/man-pages/man2/setgroups.2.html), etc.), the container process can change its identity. Thus, the _actual_ process identity will be dynamic.
-->
请注意，`status.containerStatuses[].user.linux` 字段中的值是**首次挂接**到容器中第一个容器进程的进程身份。
如果容器具有足够的权限调用与进程身份相关的系统调用（例如
[`setuid(2)`](https://man7.org/linux/man-pages/man2/setuid.2.html)、
[`setgid(2)`](https://man7.org/linux/man-pages/man2/setgid.2.html) 或
[`setgroups(2)`](https://man7.org/linux/man-pages/man2/setgroups.2.html) 等），
则容器进程可以更改其身份。因此，**实际**的进程身份将是动态的。
{{</note>}}

<!--
## Feature availability

To enable `supplementalGroupsPolicy` field, the following components have to be used:
-->
## 特性可用性

要启用 `supplementalGroupsPolicy` 字段，必须使用以下组件：

<!--
- Kubernetes: v1.31 or later, with the `SupplementalGroupsPolicy` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) enabled. As of v1.31, the gate is marked as alpha.
- CRI runtime:
  - containerd: v2.0 or later
  - CRI-O: v1.31 or later

You can see if the feature is supported in the Node's `.status.features.supplementalGroupsPolicy` field.
-->
- Kubernetes：v1.31 或更高版本，启用 `SupplementalGroupsPolicy`
  [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
  截至 v1.31，此门控标记为 Alpha。
- CRI 运行时：
  - containerd：v2.0 或更高版本
  - CRI-O：v1.31 或更高版本

你可以在 Node 的 `.status.features.supplementalGroupsPolicy` 字段中查看此特性是否受支持。

```yaml
apiVersion: v1
kind: Node
...
status:
  features:
    supplementalGroupsPolicy: true
```

<!--
## What's next?

Kubernetes SIG Node hope - and expect - that the feature will be promoted to beta and eventually
general availability (GA) in future releases of Kubernetes, so that users no longer need to enable
the feature gate manually.

`Merge` policy is applied when `supplementalGroupsPolicy` is not specified, for backwards compatibility.
-->
## 接下来

Kubernetes SIG Node 希望并期待此特性将在 Kubernetes 后续版本中进阶至 Beta，
并最终进阶至正式发布（GA），以便用户不再需要手动启用特性门控。

当 `supplementalGroupsPolicy` 未被指定时，将应用 `Merge` 策略，以保持向后兼容性。

<!--
## How can I learn more?
-->
## 我如何了解更多？

<!-- https://github.com/kubernetes/website/pull/46920 -->

<!--
- [Configure a Security Context for a Pod or Container](/docs/tasks/configure-pod-container/security-context/)
for the further details of `supplementalGroupsPolicy`
- [KEP-3619: Fine-grained SupplementalGroups control](https://github.com/kubernetes/enhancements/issues/3619)
-->
- [为 Pod 或容器配置安全上下文](/docs/tasks/configure-pod-container/security-context/)以获取有关
  `supplementalGroupsPolicy` 的更多细节
- [KEP-3619：细粒度 SupplementalGroups 控制](https://github.com/kubernetes/enhancements/issues/3619)

<!--
## How to get involved?

This feature is driven by the SIG Node community. Please join us to connect with
the community and share your ideas and feedback around the above feature and
beyond. We look forward to hearing from you!
-->
## 如何参与？

此特性由 SIG Node 社区推动。请加入我们，与社区保持联系，
分享你对上述特性及其他方面的想法和反馈。我们期待听到你的声音！
