---
layout: blog
title: 'Kubernetes 1.31：細粒度的 SupplementalGroups 控制'
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
本博客討論了 Kubernetes 1.31 中的一項新特性，目的是改善處理 Pod 中容器內的附加組。

<!--
## Motivation: Implicit group memberships defined in `/etc/group` in the container image

Although this behavior may not be popular with many Kubernetes cluster users/admins, kubernetes, by default, _merges_ group information from the Pod with information defined in `/etc/group` in the container image.

Let's see an example, below Pod specifies `runAsUser=1000`, `runAsGroup=3000` and `supplementalGroups=4000` in the Pod's security context.
-->
## 動機：容器鏡像中 `/etc/group` 中定義的隱式組成員關係

儘管這種行爲可能並不受許多 Kubernetes 集羣用戶/管理員的歡迎，
但 Kubernetes 默認情況下會將 Pod 中的組信息與容器鏡像中 `/etc/group` 中定義的信息進行**合併**。

讓我們看一個例子，以下 Pod 在 Pod 的安全上下文中指定了
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
在 `ctr` 容器中執行 `id` 命令的結果是什麼？

```console
# 創建 Pod：
$ kubectl apply -f https://k8s.io/blog/2024-08-22-Fine-grained-SupplementalGroups-control/implicit-groups.yaml

# 驗證 Pod 的容器正在運行：
$ kubectl get pod implicit-groups

# 檢查 id 命令
$ kubectl exec implicit-groups -- id
```

<!--
Then, output should be similar to this:
-->
輸出應類似於：

```none
uid=1000 gid=3000 groups=3000,4000,50000
```

<!--
Where does group ID `50000` in supplementary groups (`groups` field) come from, even though `50000` is not defined in the Pod's manifest at all? The answer is `/etc/group` file in the container image.

Checking the contents of `/etc/group` in the container image should show below:
-->
儘管 `50000` 根本沒有在 Pod 的清單中被定義，但附加組中的組 ID `50000`（`groups` 字段）是從哪裏來的呢？
答案是容器鏡像中的 `/etc/group` 文件。

檢查容器鏡像中 `/etc/group` 的內容應如下所示：

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
原來如此！容器的主要用戶 `1000` 屬於最後一個條目中的組 `50000`。

因此，容器鏡像中爲容器的主要用戶定義的組成員關係會被**隱式**合併到 Pod 的信息中。
請注意，這是當前 CRI 實現從 Docker 繼承的設計決策，而社區直到現在才重新考慮這個問題。

<!--
### What's wrong with it?

The _implicitly_ merged group information from `/etc/group` in the container image may cause some concerns particularly in accessing volumes (see [kubernetes/kubernetes#112879](https://issue.k8s.io/112879) for details) because file permission is controlled by uid/gid in Linux. Even worse, the implicit gids from `/etc/group` can not be detected/validated by any policy engines because there is no clue for the implicit group information in the manifest. This can also be a concern for Kubernetes security.
-->
### 這有什麼問題？

從容器鏡像中的 `/etc/group` **隱式**合併的組信息可能會引起一些擔憂，特別是在訪問卷時
（有關細節參見 [kubernetes/kubernetes#112879](https://issue.k8s.io/112879)），
因爲在 Linux 中文件權限是通過 uid/gid 進行控制的。
更糟糕的是，隱式的 gid 無法被任何策略引擎所檢測/驗證，因爲在清單中沒有隱式組信息的線索。
這對 Kubernetes 的安全性也可能構成隱患。

<!--
## Fine-grained SupplementalGroups control in a Pod: `SupplementaryGroupsPolicy`

To tackle the above problem, Kubernetes 1.31 introduces new field `supplementalGroupsPolicy` in Pod's `.spec.securityContext`.

This field provies a way to control how to calculate supplementary groups for the container processes in a Pod. The available policy is below:
-->
## Pod 中的細粒度 SupplementalGroups 控制：`SupplementaryGroupsPolicy`

爲了解決上述問題，Kubernetes 1.31 在 Pod 的 `.spec.securityContext`
中引入了新的字段 `supplementalGroupsPolicy`。

此字段提供了一種控制 Pod 中容器進程如何計算附加組的方法。可用的策略如下：

<!--
* _Merge_: The group membership defined in `/etc/group` for the container's primary user will be merged. If not specified, this policy will be applied (i.e. as-is behavior for backword compatibility).

* _Strict_: it only attaches specified group IDs in `fsGroup`, `supplementalGroups`, or `runAsGroup` fields as the supplementary groups of the container processes. This means no group membership defined in `/etc/group` for the container's primary user will be merged.

Let's see how `Strict` policy works.
-->
* **Merge**：將容器的主要用戶在 `/etc/group` 中定義的組成員關係進行合併。
  如果不指定，則應用此策略（即爲了向後兼容性而保持的原有行爲）。

* **Strict**：僅將 `fsGroup`、`supplementalGroups` 或 `runAsGroup`
  字段中指定的組 ID 掛接爲容器進程的附加組。這意味着容器的主要用戶在 `/etc/group` 中定義的任何組成員關係都不會被合併。

讓我們看看 `Strict` 策略是如何工作的。

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
# 創建 Pod：
$ kubectl apply -f https://k8s.io/blog/2024-08-22-Fine-grained-SupplementalGroups-control/strict-supplementalgroups-policy.yaml

# 驗證 Pod 的容器正在運行：
$ kubectl get pod strict-supplementalgroups-policy

# 檢查進程身份：
kubectl exec -it strict-supplementalgroups-policy -- id
```

<!--
The output should be similar to this:
-->
輸出應類似於：

```none
uid=1000 gid=3000 groups=3000,4000
```

<!--
You can see `Strict` policy can exclude group `50000` from `groups`! 

Thus, ensuring `supplementalGroupsPolicy: Strict` (enforced by some policy mechanism) helps prevent the implicit supplementary groups in a Pod.
-->
你可以看到 `Strict` 策略可以將組 `50000` 從 `groups` 中排除出去！

因此，確保（通過某些策略機制強制執行的）`supplementalGroupsPolicy: Strict` 有助於防止 Pod 中的隱式附加組。

{{<note>}}
<!--
Actually, this is not enough because container with sufficient privileges / capability can change its process identity. Please see the following section for details.
-->
實際上，這還不夠，因爲具有足夠權限/能力的容器可以更改其進程身份。
有關細節參見以下章節。
{{</note>}}

<!--
## Attached process identity in Pod status

This feature also exposes the process identity attached to the first container process of the container
via `.status.containerStatuses[].user.linux` field. It would be helpful to see if implicit group IDs are attached.
-->
## Pod 狀態中掛接的進程身份

此特性還通過 `.status.containerStatuses[].user.linux`
字段公開掛接到容器的第一個容器進程的進程身份。這將有助於查看隱式組 ID 是否被掛接。

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
請注意，`status.containerStatuses[].user.linux` 字段中的值是**首次掛接**到容器中第一個容器進程的進程身份。
如果容器具有足夠的權限調用與進程身份相關的系統調用（例如
[`setuid(2)`](https://man7.org/linux/man-pages/man2/setuid.2.html)、
[`setgid(2)`](https://man7.org/linux/man-pages/man2/setgid.2.html) 或
[`setgroups(2)`](https://man7.org/linux/man-pages/man2/setgroups.2.html) 等），
則容器進程可以更改其身份。因此，**實際**的進程身份將是動態的。
{{</note>}}

<!--
## Feature availability

To enable `supplementalGroupsPolicy` field, the following components have to be used:
-->
## 特性可用性

要啓用 `supplementalGroupsPolicy` 字段，必須使用以下組件：

<!--
- Kubernetes: v1.31 or later, with the `SupplementalGroupsPolicy` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) enabled. As of v1.31, the gate is marked as alpha.
- CRI runtime:
  - containerd: v2.0 or later
  - CRI-O: v1.31 or later

You can see if the feature is supported in the Node's `.status.features.supplementalGroupsPolicy` field.
-->
- Kubernetes：v1.31 或更高版本，啓用 `SupplementalGroupsPolicy`
  [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
  截至 v1.31，此門控標記爲 Alpha。
- CRI 運行時：
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
## 接下來

Kubernetes SIG Node 希望並期待此特性將在 Kubernetes 後續版本中進階至 Beta，
並最終進階至正式發佈（GA），以便用戶不再需要手動啓用特性門控。

當 `supplementalGroupsPolicy` 未被指定時，將應用 `Merge` 策略，以保持向後兼容性。

<!--
## How can I learn more?
-->
## 我如何瞭解更多？

<!-- https://github.com/kubernetes/website/pull/46920 -->

<!--
- [Configure a Security Context for a Pod or Container](/docs/tasks/configure-pod-container/security-context/)
for the further details of `supplementalGroupsPolicy`
- [KEP-3619: Fine-grained SupplementalGroups control](https://github.com/kubernetes/enhancements/issues/3619)
-->
- [爲 Pod 或容器配置安全上下文](/docs/tasks/configure-pod-container/security-context/)以獲取有關
  `supplementalGroupsPolicy` 的更多細節
- [KEP-3619：細粒度 SupplementalGroups 控制](https://github.com/kubernetes/enhancements/issues/3619)

<!--
## How to get involved?

This feature is driven by the SIG Node community. Please join us to connect with
the community and share your ideas and feedback around the above feature and
beyond. We look forward to hearing from you!
-->
## 如何參與？

此特性由 SIG Node 社區推動。請加入我們，與社區保持聯繫，
分享你對上述特性及其他方面的想法和反饋。我們期待聽到你的聲音！
