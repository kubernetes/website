---
layout: blog
title: Kubernetes 中 PersistentVolume 的最後階段轉換時間
date: 2023-10-23
slug: persistent-volume-last-phase-transition-time
---

<!--
layout: blog
title: PersistentVolume Last Phase Transition Time in Kubernetes
date: 2023-10-23
slug: persistent-volume-last-phase-transition-time
-->

<!--
**Author:** Roman Bednář (Red Hat)
-->
**作者：** Roman Bednář (Red Hat)

**譯者：** Xin Li (DaoCloud)

<!--
In the recent Kubernetes v1.28 release, we (SIG Storage) introduced a new alpha feature that aims to improve PersistentVolume (PV)
storage management and help cluster administrators gain better insights into the lifecycle of PVs.
With the addition of the `lastPhaseTransitionTime` field into the status of a PV,
cluster administrators are now able to track the last time a PV transitioned to a different
[phase](/docs/concepts/storage/persistent-volumes/#phase), allowing for more efficient
and informed resource management.
-->
在最近的 Kubernetes v1.28 版本中，我們（SIG Storage）引入了一項新的 Alpha 級別特性，
旨在改進 PersistentVolume（PV）存儲管理並幫助集羣管理員更好地瞭解 PV 的生命週期。
通過將 `lastPhaseTransitionTime` 字段添加到 PV 的狀態中，集羣管理員現在可以跟蹤
PV 上次轉換到不同[階段](/zh-cn/docs/concepts/storage/persistent-volumes/#phase)的時間，
從而實現更高效、更明智的資源管理。

<!--
## Why do we need new PV field? {#why-new-field}

PersistentVolumes in Kubernetes play a crucial role in providing storage resources to workloads running in the cluster.
However, managing these PVs effectively can be challenging, especially when it comes
to determining the last time a PV transitioned between different phases, such as
`Pending`, `Bound` or `Released`.
Administrators often need to know when a PV was last used or transitioned to certain
phases; for instance, to implement retention policies, perform cleanup, or monitor storage health.
-->
## 我們爲什麼需要新的 PV 字段？  {#why-new-field}

Kubernetes 中的 PersistentVolume 在爲集羣中運行的工作負載提供存儲資源方面發揮着至關重要的作用。
然而，有效管理這些 PV 可能具有挑戰性，特別是在確定 PV 在不同階段（`Pending`、`Bound` 或 `Released`）之間轉換的最後時間時。
管理員通常需要知道 PV 上次使用或轉換到某些階段的時間；例如，實施保留策略、執行清理或監控存儲運行狀況時。

<!--
In the past, Kubernetes users have faced data loss issues when using the `Delete` retain policy and had to resort to the safer `Retain` policy.
When we planned the work to introduce the new `lastPhaseTransitionTime` field, we
wanted to provide a more generic solution that can be used for various use cases,
including manual cleanup based on the time a volume was last used or producing alerts based on phase transition times.
-->
過去，Kubernetes 用戶在使用 `Delete` 保留策略時面臨數據丟失問題，不得不使用更安全的 `Retain` 策略。
當我們計劃引入新的 `lastPhaseTransitionTime` 字段時，我們希望提供一個更通用的解決方案，
可用於各種用例，包括根據捲上次使用時間進行手動清理或根據狀態轉變時間生成警報。

<!--
## How lastPhaseTransitionTime helps

Provided you've enabled the feature gate (see [How to use it](#how-to-use-it), the new `.status.lastPhaseTransitionTime` field of a PersistentVolume (PV)
is updated every time that PV transitions from one phase to another.
-->
## lastPhaseTransitionTime 如何提供幫助

如果你已啓用特性門控（請參閱[如何使用它](#how-to-use-it)），則每次 PV 從一個階段轉換到另一階段時，
PersistentVolume（PV）的新字段 `.status.lastPhaseTransitionTime` 都會被更新。

<!--
Whether it's transitioning from `Pending` to `Bound`, `Bound` to `Released`, or any other phase transition, the `lastPhaseTransitionTime` will be recorded.
For newly created PVs the phase will be set to `Pending` and the `lastPhaseTransitionTime` will be recorded as well.
-->
無論是從 `Pending` 轉換到 `Bound`、`Bound` 到 `Released`，還是任何其他階段轉換，都會記錄 `lastPhaseTransitionTime`。
對於新創建的 PV，將被聲明爲處於 `Pending` 階段，並且 `lastPhaseTransitionTime` 也將被記錄。

<!--
This feature allows cluster administrators to:
-->
此功能允許集羣管理員：

<!--
1. Implement Retention Policies

   With the `lastPhaseTransitionTime`, administrators can now track when a PV was last used or transitioned to the `Released` phase.
   This information can be crucial for implementing retention policies to clean up resources that have been in the `Released` phase for a specific duration.
   For example, it is now trivial to write a script or a policy that deletes all PVs that have been in the `Released` phase for a week.
-->
1. 實施保留政策

   通過 `lastPhaseTransitionTime`，管理員可以跟蹤 PV 上次使用或轉換到 `Released` 階段的時間。
   此信息對於實施保留策略以清理在特定時間內處於 `Released` 階段的資源至關重要。
   例如，現在編寫一個腳本或一個策略來刪除一週內處於 `Released` 階段的所有 PV 是很簡單的。

<!--
2. Monitor Storage Health

   By analyzing the phase transition times of PVs, administrators can monitor storage health more effectively.
   For example, they can identify PVs that have been in the `Pending` phase for an unusually long time, which may indicate underlying issues with the storage provisioner.
-->
2. 監控存儲運行狀況

   通過分析 PV 的相變時間，管理員可以更有效地監控存儲運行狀況。
   例如，他們可以識別處於 `Pending` 階段時間異常長的 PV，這可能表明存儲配置程序存在潛在問題。

<!--
## How to use it

The `lastPhaseTransitionTime` field is alpha starting from Kubernetes v1.28, so it requires
the `PersistentVolumeLastPhaseTransitionTime` feature gate to be enabled.
-->
## 如何使用它

從 Kubernetes v1.28 開始，`lastPhaseTransitionTime` 爲 Alpha 特性字段，因此需要啓用
`PersistentVolumeLastPhaseTransitionTime` 特性門控。

<!--
If you want to test the feature whilst it's alpha, you need to enable this feature gate on the `kube-controller-manager` and the `kube-apiserver`.

Use the `--feature-gates` command line argument:
-->
如果你想在該特性處於 Alpha 階段時對其進行測試，則需要在 `kube-controller-manager`
和 `kube-apiserver` 上啓用此特性門控。

使用 `--feature-gates` 命令行參數：

```shell
--feature-gates="...,PersistentVolumeLastPhaseTransitionTime=true"
```

<!--
Keep in mind that the feature enablement does not have immediate effect; the new field will be populated whenever a PV is updated and transitions between phases.
Administrators can then access the new field through the PV status, which can be retrieved using standard Kubernetes API calls or through Kubernetes client libraries.
-->
請記住，該特性啓用後不會立即生效；而是在 PV 更新以及階段之間轉換時，填充新字段。
然後，管理員可以通過查看 PV 狀態訪問新字段，此狀態可以使用標準 Kubernetes API
調用或通過 Kubernetes 客戶端庫進行檢索。

<!--
Here is an example of how to retrieve the `lastPhaseTransitionTime` for a specific PV using the `kubectl` command-line tool:
-->
以下示例展示瞭如何使用 `kubectl` 命令行工具檢索特定 PV 的 `lastPhaseTransitionTime`：

```shell
kubectl get pv <pv-name> -o jsonpath='{.status.lastPhaseTransitionTime}'
```

<!--
## Going forward

This feature was initially introduced as an alpha feature, behind a feature gate that is disabled by default.
During the alpha phase, we (Kubernetes SIG Storage) will collect feedback from the end user community and address any issues or improvements identified.

Once sufficient feedback has been received, or no complaints are received the feature can move to beta.
The beta phase will allow us to further validate the implementation and ensure its stability.
-->
## 未來發展

此特性最初是作爲 Alpha 特性引入的，位於默認情況下禁用的特性門控之下。
在 Alpha 階段，我們（Kubernetes SIG Storage）將收集最終用戶的反饋並解決發現的任何問題或改進。

一旦收到足夠的反饋，或者沒有收到投訴，該特性就可以進入 Beta 階段。
Beta 階段將使我們能夠進一步驗證實施並確保其穩定性。

<!--
At least two Kubernetes releases will happen between the release where this field graduates
to beta and the release that graduates the field to general availability (GA). That means that
the earliest release where this field could be generally available is Kubernetes 1.32,
likely to be scheduled for early 2025.
-->
在該字段升級到 Beta 級別和將該字段升級爲通用版 (GA) 的版本之間，至少會經過兩個 Kubernetes 版本。
這意味着該字段 GA 的最早版本是 Kubernetes 1.32，可能計劃於 2025 年初發布。

<!--
## Getting involved

We always welcome new contributors so if you would like to get involved you can
join our [Kubernetes Storage Special-Interest-Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG).
-->
## 歡迎參與

我們始終歡迎新的貢獻者，因此如果你想參與其中，可以加入我們的
[Kubernetes 存儲特殊興趣小組](https://github.com/kubernetes/community/tree/master/sig-storage)（SIG）。

<!--
If you would like to share feedback, you can do so on our
[public Slack channel](https://app.slack.com/client/T09NY5SBT/C09QZFCE5).
If you're not already part of that Slack workspace, you can visit https://slack.k8s.io/ for an invitation.
-->
如果你想分享反饋，可以在我們的 [公共 Slack 頻道](https://app.slack.com/client/T09NY5SBT/C09QZFCE5)上分享。
如果你尚未加入 Slack 工作區，可以訪問 https://slack.k8s.io/ 獲取邀請。

<!--
Special thanks to all the contributors that provided great reviews, shared valuable insight and helped implement this feature (alphabetical order):
-->
特別感謝所有提供精彩評論、分享寶貴意見並幫助實現此特性的貢獻者（按字母順序排列）：

- Han Kang ([logicalhan](https://github.com/logicalhan))
- Jan Šafránek ([jsafrane](https://github.com/jsafrane))
- Jordan Liggitt ([liggitt](https://github.com/liggitt))
- Kiki ([carlory](https://github.com/carlory))
- Michelle Au ([msau42](https://github.com/msau42))
- Tim Bannister ([sftim](https://github.com/sftim))
- Wojciech Tyczynski ([wojtek-t](https://github.com/wojtek-t))
- Xing Yang ([xing-yang](https://github.com/xing-yang))
