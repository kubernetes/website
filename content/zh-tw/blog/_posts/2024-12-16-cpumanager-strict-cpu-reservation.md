---
layout: blog
title: 'Kubernetes v1.32 增加了新的 CPU Manager 靜態策略選項用於嚴格 CPU 預留'
date: 2024-12-16
slug: cpumanager-strict-cpu-reservation
author: >
  [Jing Zhang](https://github.com/jingczhang) (Nokia)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: 'Kubernetes v1.32 Adds A New CPU Manager Static Policy Option For Strict CPU Reservation'
date: 2024-12-16
slug: cpumanager-strict-cpu-reservation
author: >
  [Jing Zhang](https://github.com/jingczhang) (Nokia)
-->

<!--
In Kubernetes v1.32, after years of community discussion, we are excited to introduce a
`strict-cpu-reservation` option for the [CPU Manager static policy](/docs/tasks/administer-cluster/cpu-management-policies/#static-policy-options).
This feature is currently in alpha, with the associated policy hidden by default. You can only use the
policy if you explicitly enable the alpha behavior in your cluster.
-->
在 Kubernetes v1.32 中，經過社區多年的討論，我們很高興地引入了
[CPU Manager 靜態策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/#static-policy-options)的
`strict-cpu-reservation` 選項。此特性當前處於 Alpha 階段，默認情況下關聯的策略是隱藏的。
只有在你的集羣中明確啓用了此 Alpha 行爲後，才能使用此策略。

<!--
## Understanding the feature

The CPU Manager static policy is used to reduce latency or improve performance. The `reservedSystemCPUs` defines an explicit CPU set for OS system daemons and kubernetes system daemons. This option is designed for Telco/NFV type use cases where uncontrolled interrupts/timers may impact the workload performance. you can use this option to define the explicit cpuset for the system/kubernetes daemons as well as the interrupts/timers, so the rest CPUs on the system can be used exclusively for workloads, with less impact from uncontrolled interrupts/timers. More details of this parameter can be found on the [Explicitly Reserved CPU List](/docs/tasks/administer-cluster/reserve-compute-resources/#explicitly-reserved-cpu-list) page.

If you want to protect your system daemons and interrupt processing, the obvious way is to use the `reservedSystemCPUs` option.
-->
## 理解此特性

CPU Manager 靜態策略用於減少延遲或提高性能。`reservedSystemCPUs`
定義了一個明確的 CPU 集合，供操作系統系統守護進程和 Kubernetes 系統守護進程使用。
此選項專爲 Telco/NFV 類型的使用場景設計，在這些場景中，不受控制的中斷/計時器可能會影響工作負載的性能。
你可以使用此選項爲系統/Kubernetes 守護進程以及中斷/計時器定義明確的 CPU 集合，
從而使系統上的其餘 CPU 可以專用於工作負載，並減少不受控制的中斷/計時器帶來的影響。
有關此參數的更多詳細信息，請參閱
[顯式預留的 CPU 列表](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#explicitly-reserved-cpu-list)
頁面。

如果你希望保護系統守護進程和中斷處理，顯而易見的方法是使用 `reservedSystemCPUs` 選項。

<!--
However, until the Kubernetes v1.32 release, this isolation was only implemented for guaranteed
pods that made requests for a whole number of CPUs. At pod admission time, the kubelet only
compares the CPU _requests_ against the allocatable CPUs. In Kubernetes, limits can be higher than
the requests; the previous implementation allowed burstable and best-effort pods to use up
the capacity of `reservedSystemCPUs`, which could then starve host OS services of CPU - and we
know that people saw this in real life deployments.
The existing behavior also made benchmarking (for both infrastructure and workloads) results inaccurate.

When this new `strict-cpu-reservation` policy option is enabled, the CPU Manager static policy will not allow any workload to use the reserved system CPU cores.
-->
然而，在 Kubernetes v1.32 發佈之前，這種隔離僅針對請求整數個 CPU
的 Guaranteed 類型 Pod 實現。在 Pod 准入時，kubelet 僅將 CPU
**請求量**與可分配的 CPU 進行比較。在 Kubernetes 中，限制值可以高於請求值；
之前的實現允許 Burstable 和 BestEffort 類型的 Pod 使用 `reservedSystemCPUs` 的容量，
這可能導致主機操作系統服務缺乏足夠的 CPU 資源 —— 並且我們已經知道在實際部署中確實發生過這種情況。
現有的行爲還導致基礎設施和工作負載的基準測試結果不準確。

當啓用這個新的 `strict-cpu-reservation` 策略選項後，CPU Manager
靜態策略將不允許任何工作負載使用預留的系統 CPU 核心。

<!--
## Enabling the feature

To enable this feature, you need to turn on both the `CPUManagerPolicyAlphaOptions` feature gate and the `strict-cpu-reservation` policy option. And you need to remove the `/var/lib/kubelet/cpu_manager_state` file if it exists and restart kubelet.

With the following kubelet configuration:
-->
## 啓用此特性

要啓用此特性，你需要同時開啓 `CPUManagerPolicyAlphaOptions` 特性門控和
`strict-cpu-reservation` 策略選項。並且如果存在 `/var/lib/kubelet/cpu_manager_state`
文件，則需要刪除該文件並重啓 kubelet。

使用以下 kubelet 配置：

```yaml
kind: KubeletConfiguration
apiVersion: kubelet.config.k8s.io/v1beta1
featureGates:
  ...
  CPUManagerPolicyOptions: true
  CPUManagerPolicyAlphaOptions: true
cpuManagerPolicy: static
cpuManagerPolicyOptions:
  strict-cpu-reservation: "true"
reservedSystemCPUs: "0,32,1,33,16,48"
...
```

<!--
When `strict-cpu-reservation` is not set or set to false:
-->
當未設置 `strict-cpu-reservation` 或將其設置爲 false 時：

```console
# cat /var/lib/kubelet/cpu_manager_state
{"policyName":"static","defaultCpuSet":"0-63","checksum":1058907510}
```

<!--
When `strict-cpu-reservation` is set to true:
-->
當 `strict-cpu-reservation` 設置爲 true 時：

```console
# cat /var/lib/kubelet/cpu_manager_state
{"policyName":"static","defaultCpuSet":"2-15,17-31,34-47,49-63","checksum":4141502832}
```

<!--
## Monitoring the feature

You can monitor the feature impact by checking the following CPU Manager counters:
- `cpu_manager_shared_pool_size_millicores`: report shared pool size, in millicores (e.g. 13500m)
- `cpu_manager_exclusive_cpu_allocation_count`: report exclusively allocated cores, counting full cores (e.g. 16)
-->
## 監控此特性

你可以通過檢查以下 CPU Manager 計數器來監控該特性的影響：

- `cpu_manager_shared_pool_size_millicores`：報告共享池大小，以毫核爲單位（例如 13500m）
- `cpu_manager_exclusive_cpu_allocation_count`：報告獨佔分配的核心數，按完整核心計數（例如 16）

<!--
Your best-effort workloads may starve if the `cpu_manager_shared_pool_size_millicores` count is zero for prolonged time.

We believe any pod that is required for operational purpose like a log forwarder should not run as best-effort, but you can review and adjust the amount of CPU cores reserved as needed.
-->
如果 `cpu_manager_shared_pool_size_millicores` 計數在長時間內爲零，
你的 BestEffort 類型工作負載可能會因資源匱乏而受到影響。

我們建議，任何用於操作目的的 Pod（如日誌轉發器）都不應以 BestEffort 方式運行，
但你可以根據需要審查並調整預留的 CPU 核心數量。

<!--
## Conclusion

Strict CPU reservation is critical for Telco/NFV use cases. It is also a prerequisite for enabling the all-in-one type of deployments where workloads are placed on nodes serving combined control+worker+storage roles.

We want you to start using the feature and looking forward to your feedback.
-->
## 總結

嚴格的 CPU 預留對於 Telco/NFV 使用場景至關重要。
它也是啓用一體化部署類型（其中工作負載被放置在同時擔任控制面節點、工作節點和存儲角色的節點上）的前提條件。

我們希望你開始使用該特性，並期待你的反饋。

<!--
## Further reading

Please check out the [Control CPU Management Policies on the Node](/docs/tasks/administer-cluster/cpu-management-policies/)
task page to learn more about the CPU Manager, and how it fits in relation to the other node-level resource managers.
-->
## 進一步閱讀

請查看[節點上的控制 CPU 管理策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)任務頁面，
以瞭解更多關於 CPU Manager 的信息，以及它如何與其他節點級資源管理器相關聯。

<!--
## Getting involved

This feature is driven by the [SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md). If you are interested in helping develop this feature, sharing feedback, or participating in any other ongoing SIG Node projects, please attend the SIG Node meeting for more details.
-->
## 參與其中

此特性由 [SIG Node](https://github.com/kubernetes/community/blob/master/sig-node/README.md)
推動。如果你有興趣幫助開發此特性、分享反饋或參與任何其他正在進行的 SIG Node 項目，
請參加 SIG Node 會議以獲取更多詳情。
