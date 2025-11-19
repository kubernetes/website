---
layout: blog
title: "Kubernetes 1.25：應用滾動上線所用的兩個特性進入穩定階段"
date: 2022-09-15
slug: "app-rollout-features-reach-stable"
---
<!--
layout: blog
title: "Kubernetes 1.25: Two Features for Apps Rollouts Graduate to Stable"
date: 2022-09-15
slug: "app-rollout-features-reach-stable"
-->

<!--
**Authors:** Ravi Gudimetla (Apple), Filip Křepinský (Red Hat), Maciej Szulik (Red Hat)
-->
**作者：** Ravi Gudimetla (Apple)、Filip Křepinský (Red Hat)、Maciej Szulik (Red Hat)

<!--
This blog describes the two features namely `minReadySeconds` for StatefulSets and `maxSurge` for DaemonSets that SIG Apps is happy to graduate to stable in Kubernetes 1.25.

Specifying `minReadySeconds` slows down a rollout of a StatefulSet, when using a `RollingUpdate` value in `.spec.updateStrategy` field, by waiting for each pod for a desired time.
This time can be used for initializing the pod (e.g. warming up the cache) or as a delay before acknowledging the pod.
-->
這篇博客描述了兩個特性，即用於 StatefulSet 的 `minReadySeconds` 以及用於 DaemonSet 的 `maxSurge`，
SIG Apps 很高興宣佈這兩個特性在 Kubernetes 1.25 進入穩定階段。

當 `.spec.updateStrategy` 字段設置爲 `RollingUpdate` 時，
你可以設置 `minReadySeconds`， 通過讓每個 Pod 等待一段預期時間來減緩 StatefulSet 的滾動上線。

<!--
`maxSurge` allows a DaemonSet workload to run multiple instances of the same pod on a node during a rollout when using a `RollingUpdate` value in `.spec.updateStrategy` field.
This helps to minimize the downtime of the DaemonSet for consumers.

These features were already available in a Deployment and other workloads. This graduation helps to align this functionality across the workloads.
-->
當 `.spec.updateStrategy` 字段設置爲 `RollingUpdate` 時，
`maxSurge` 允許 DaemonSet 工作負載在滾動上線期間在一個節點上運行同一 Pod 的多個實例。
這對於消費者而言有助於將 DaemonSet 的停機時間降到最低。

這兩個特性也可用於 Deployment 和其他工作負載。此功能的提級有助於將這一功能在所有工作負載上對齊。

<!--
## What problems do these features solve?

### minReadySeconds for StatefulSets {#solved-problem-statefulset-minreadyseconds}
-->
## 這兩個特性能解決什麼問題？   {#what-problems-do-these-features-solve}

### 針對 StatefulSet 的 minReadySeconds   {#solved-problem-statefulset-minreadyseconds}

<!--
`minReadySeconds` ensures that the StatefulSet workload is `Ready` for the given number of seconds before reporting the
pod as `Available`. The notion of being `Ready` and `Available` is quite important for workloads. For example, some workloads, like Prometheus with multiple instances of Alertmanager, should be considered `Available` only when the Alertmanager's state transfer is complete. `minReadySeconds` also helps when using loadbalancers with cloud providers. Since the pod should be `Ready` for the given number of seconds, it provides buffer time to prevent killing pods in rotation before new pods show up.
-->
`minReadySeconds` 確保 StatefulSet 工作負載在給定的秒數內處於 `Ready`，
然後纔會將該 Pod 報告爲 `Available`。
處於 `Ready` 和 `Available` 狀況的這種說法對工作負載相當重要。
例如 Prometheus 這些工作負載有多個 Alertmanager 實例，
只有 Alertmanager 的狀態轉換完成後才應該被視爲 `Available`。
`minReadySeconds` 還有助於雲驅動確定何時使用負載均衡器。
因爲 Pod 應在給定的秒數內處於 `Ready`，所以這就提供了一段緩衝時間，
防止新 Pod 還沒起來之前就在輪轉過程中殺死了舊 Pod。

<!--
### maxSurge for DaemonSets {#how-use-daemonset-maxsurge}

Kubernetes system-level components like CNI, CSI are typically run as DaemonSets. These components can have impact on the availability of the workloads if those DaemonSets go down momentarily during the upgrades. The feature allows DaemonSet pods to temporarily increase their number, thereby ensuring zero-downtime for the DaemonSets.

Please note that the usage of `hostPort` in conjunction with `maxSurge` in DaemonSets is not allowed as DaemonSet pods are tied to a single node and two active pods cannot share the same port on the same node.
-->
### 針對 DaemonSet 的 maxSurge     {#how-use-daemonset-maxsurge}

CNI、CSI 這類 Kubernetes 系統級別的組件通常以 DaemonSet 方式運行。如果這些 DaemonSet 在升級期間瞬間掛掉，
對應的組件可能會影響工作負載的可用性。此特性允許 DaemonSet Pod 臨時增加數量，以此確保 DaemonSet 的停機時間爲零。

請注意在 DaemonSet 中不允許同時使用 `hostPort` 和 `maxSurge`，
因爲 DaemonSet Pod 被捆綁到了一個節點，所以兩個活躍的 Pod 無法共享同一節點上的相同端口。

<!--
## How does it work?

### minReadySeconds for StatefulSets {#how-does-statefulset-minreadyseconds-work}

The StatefulSet controller watches for the StatefulSet pods and counts how long a particular pod has been in the `Running` state, if this value is greater than or equal to the time specified in `.spec.minReadySeconds` field of the StatefulSet, the StatefulSet controller updates the `AvailableReplicas` field in the StatefulSet's status.
-->
## 工作原理    {#how-does-it-work}

### 針對 StatefulSet 的 minReadySeconds  {#how-does-statefulset-minreadyseconds-work}

StatefulSet 控制器監視 StatefulSet Pod 並統計特定的 Pod 已處於 `Running` 狀態多長時間了，
如果這個值大於或等於 StatefulSet 的 `.spec.minReadySeconds` 字段中指定的時間，
StatefulSet 控制器將更新 StatefulSet 的狀態中的 `AvailableReplicas` 字段。

<!--
### maxSurge for DaemonSets {#how-does-daemonset-maxsurge-work}

The DaemonSet controller creates the additional pods (above the desired number resulting from DaemonSet spec) based on the value given in `.spec.strategy.rollingUpdate.maxSurge`. The additional pods would run on the same node where the old DaemonSet pod is running till the old pod gets killed.
-->
### 針對 DaemonSet 的 maxSurge  {#how-does-daemonset-maxsurge-work}

DaemonSet 控制器根據 `.spec.strategy.rollingUpdate.maxSurge` 中給出的值創建額外 Pod
（超出 DaemonSet 規約所設定的預期數量）。
這些 Pod 將運行在舊 DaemonSet Pod 運行所在的同一節點上，直到這個舊 Pod 被殺死爲止。

<!--
- The default value is 0.
- The value cannot be `0` when `MaxUnavailable` is 0.
- The value can be specified either as an absolute number of pods, or a percentage (rounded up) of desired pods.
-->
- 默認值爲 0。
- 當 `MaxUnavailable` 爲 0 時此值不能爲 `0`。
- 此值可以指定爲一個絕對的 Pod 個數或預期 Pod 總數的百分比（向上取整）。

<!--
## How do I use it?

### minReadySeconds for StatefulSets {#how-use-statefulset-minreadyseconds}

Specify a value for `minReadySeconds` for any StatefulSet and check if pods are available or not by inspecting
`AvailableReplicas` field using:
-->
## 我如何使用它？   {#how-do-i-use-it}

### 針對 StatefulSet 的 minReadySeconds   {#how-use-statefulset-minreadyseconds}

執行以下命令爲任意 StatefulSet 指定一個 `minReadySeconds` 值，
通過檢驗 `AvailableReplicas` 字段查看這些 Pod 是否可用：

```
kubectl get statefulset/<StatefulSet 名稱> -o yaml
```

<!--
Please note that the default value of `minReadySeconds` is 0.

### maxSurge for DaemonSets {#how-use-daemonset-maxsurge}

Specify a value for `.spec.updateStrategy.rollingUpdate.maxSurge` and set `.spec.updateStrategy.rollingUpdate.maxUnavailable` to `0`. 

Then observe a faster rollout and higher number of pods running at the same time in the next rollout.
-->
請注意 `minReadySeconds` 的默認值爲 0。

### 針對 DaemonSet 的 maxSurge  {#how-use-daemonset-maxsurge}

爲 `.spec.updateStrategy.rollingUpdate.maxSurge` 指定一個值並將
`.spec.updateStrategy.rollingUpdate.maxUnavailable` 設置爲 `0`。

然後觀察下一次滾動上線是不是更快，同時運行的 Pod 數量是不是更多。

```
kubectl rollout restart daemonset <name_of_the_daemonset>
kubectl get pods -w
```

<!--
## How can I learn more?

### minReadySeconds for StatefulSets {#learn-more-statefulset-minreadyseconds}

- Documentation: https://k8s.io/docs/concepts/workloads/controllers/statefulset/#minimum-ready-seconds
- KEP: https://github.com/kubernetes/enhancements/issues/2599
- API Changes: https://github.com/kubernetes/kubernetes/pull/100842
-->
## 我如何才能瞭解更多？   {#how-can-i-learn-more}

### 針對 StatefulSet 的 minReadySeconds   {#learn-more-statefulset-minreadyseconds}

- 文檔： https://k8s.io/zh-cn/docs/concepts/workloads/controllers/statefulset/#minimum-ready-seconds
- KEP： https://github.com/kubernetes/enhancements/issues/2599
- API 變更： https://github.com/kubernetes/kubernetes/pull/100842

<!--
### maxSurge for DaemonSets {#learn-more-daemonset-maxsurge}

- Documentation: https://k8s.io/docs/tasks/manage-daemon/update-daemon-set/
- KEP: https://github.com/kubernetes/enhancements/issues/1591
- API Changes: https://github.com/kubernetes/kubernetes/pull/96375
-->
### 針對 DaemonSet 的 maxSurge   {#learn-more-daemonset-maxsurge}

- 文檔： https://k8s.io/zh-cn/docs/tasks/manage-daemon/update-daemon-set/
- KEP： https://github.com/kubernetes/enhancements/issues/1591
- API 變更： https://github.com/kubernetes/kubernetes/pull/96375

<!--
## How do I get involved?

Please reach out to us on [#sig-apps](https://kubernetes.slack.com/archives/C18NZM5K9) channel on Slack, or through the SIG Apps mailing list [kubernetes-sig-apps@googlegroups.com](https://groups.google.com/g/kubernetes-sig-apps).
-->
## 我如何參與？   {#how-do-i-get-involved}

請通過 Slack [#sig-apps](https://kubernetes.slack.com/archives/C18NZM5K9) 頻道或通過 SIG Apps
郵件列表 [kubernetes-sig-apps@googlegroups.com](https://groups.google.com/g/kubernetes-sig-apps) 聯繫我們。
