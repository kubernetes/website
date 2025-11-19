---
layout: blog
title: "Kubernetes 1.29：PodReadyToStartContainers 狀況進階至 Beta"
date: 2023-12-19
slug: pod-ready-to-start-containers-condition-now-in-beta
---
<!--
layout: blog
title: "Kubernetes 1.29: PodReadyToStartContainers Condition Moves to Beta"
date: 2023-12-19
slug: pod-ready-to-start-containers-condition-now-in-beta
-->

<!--
**Authors**: Zefeng Chen (independent), Kevin Hannon (Red Hat)
-->
**作者**：Zefeng Chen (independent), Kevin Hannon (Red Hat)

**譯者**：[Michael Yao](https://github.com/windsonsea)

<!--
With the recent release of Kubernetes 1.29, the `PodReadyToStartContainers`
[condition](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions) is 
available by default.
The kubelet manages the value for that condition throughout a Pod's lifecycle, 
in the status field of a Pod. The kubelet will use the `PodReadyToStartContainers`
condition to accurately surface the initialization state of a Pod,
from the perspective of Pod sandbox creation and network configuration by a container runtime.
-->
隨着最近發佈的 Kubernetes 1.29，`PodReadyToStartContainers`
[狀況](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)默認可用。
kubelet 在 Pod 的整個生命週期中管理該狀況的值，將其存儲在 Pod 的狀態字段中。
kubelet 將通過容器運行時從 Pod 沙箱創建和網絡配置的角度使用 `PodReadyToStartContainers`
狀況準確地展示 Pod 的初始化狀態，

<!--
## What's the motivation for this feature?
-->
## 這個特性的動機是什麼？

<!--
Cluster administrators did not have a clear and easily accessible way to view the completion of Pod's sandbox creation
and initialization. As of 1.28, the `Initialized` condition in Pods tracks the execution of init containers.
However, it has limitations in accurately reflecting the completion of sandbox creation and readiness to start containers for all Pods in a cluster. 
This distinction is particularly important in multi-tenant clusters where tenants own the Pod specifications, including the set of init containers, 
while cluster administrators manage storage plugins, networking plugins, and container runtime handlers. 
Therefore, there is a need for an improved mechanism to provide cluster administrators with a clear and 
comprehensive view of Pod sandbox creation completion and container readiness.
-->
集羣管理員以前沒有明確且輕鬆訪問的方式來查看 Pod 沙箱創建和初始化的完成情況。
從 1.28 版本開始，Pod 中的 `Initialized` 狀況跟蹤 Init 容器的執行情況。
然而，它在準確反映沙箱創建完成和容器準備啓動的方面存在一些限制，無法適用於集羣中的所有 Pod。
在多租戶集羣中，這種區別尤爲重要，租戶擁有包括 Init 容器集合在內的 Pod 規約，
而集羣管理員管理存儲插件、網絡插件和容器運行時處理程序。
因此，需要改進這個機制，以便爲集羣管理員提供清晰和全面的 Pod 沙箱創建完成和容器就緒狀態的視圖。

<!--
## What's the benefit?

1. Improved Visibility: Cluster administrators gain a clearer and more comprehensive view of Pod sandbox
   creation completion and container readiness.
   This enhanced visibility allows them to make better-informed decisions and troubleshoot issues more effectively.
-->
## 這個特性有什麼好處？

1. 改進可見性：集羣管理員可以更清晰和全面地查看 Pod 沙箱的創建完成和容器的就緒狀態。
   這種增強的可見性使他們能夠做出更明智的決策，並更有效地解決問題。

<!--
2. Metric Collection and Monitoring: Monitoring services can leverage the fields associated with
   the `PodReadyToStartContainers` condition to report sandbox creation state and latency.
   Metrics can be collected at per-Pod cardinality or aggregated based on various
   properties of the Pod, such as `volumes`, `runtimeClassName`, custom annotations for CNI
   and IPAM plugins or arbitrary labels and annotations, and `storageClassName` of
   PersistentVolumeClaims.
   This enables comprehensive monitoring and analysis of Pod readiness across the cluster.
-->
2. 指標收集和監控：監控服務可以利用與 `PodReadyToStartContainers` 狀況相關的字段來報告沙箱創建狀態和延遲。
   可以按照每個 Pod 的基數進行指標收集，或者根據 Pod 的各種屬性進行聚合，例如
   `volumes`、`runtimeClassName`、CNI 和 IPAM 插件的自定義註解，
   以及任意標籤和註解，以及 PersistentVolumeClaims 的 `storageClassName`。
   這樣可以全面監控和分析集羣中 Pod 的就緒狀態。

<!--
3. Enhanced Troubleshooting: With a more accurate representation of Pod sandbox creation and container readiness,
   cluster administrators can quickly identify and address any issues that may arise during the initialization process.
   This leads to improved troubleshooting capabilities and reduced downtime.
-->
3. 增強故障排查能力：通過更準確地表示 Pod 沙箱的創建和容器的就緒狀態，
   集羣管理員可以快速識別和解決初始化過程中可能出現的任何問題。
   這將提高故障排查能力，並減少停機時間。

<!--
### What’s next?

Due to feedback and adoption, the Kubernetes team promoted `PodReadyToStartContainersCondition` to Beta in 1.29. 
Your comments will help determine if this condition continues forward to get promoted to GA, 
so please submit additional feedback on this feature!
-->
### 後續事項

鑑於反饋和採用情況，Kubernetes 團隊在 1.29 版本中將 `PodReadyToStartContainersCondition`
進階至 Beta版。你的評論將有助於確定該狀況是否繼續並晉升至 GA，請針對此特性提交更多反饋！

<!--
### How can I learn more?

Please check out the
[documentation](/docs/concepts/workloads/pods/pod-lifecycle/) for the
`PodReadyToStartContainersCondition` to learn more about it and how it fits in relation to
other Pod conditions.
-->
### 如何瞭解更多？

請查看關於 `PodReadyToStartContainersCondition`
的[文檔](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/)，
以瞭解其更多信息及其與其他 Pod 狀況的關係。

<!--
### How to get involved?

This feature is driven by the SIG Node community. Please join us to connect with
the community and share your ideas and feedback around the above feature and
beyond. We look forward to hearing from you!
-->
### 如何參與？

該特性由 SIG Node 社區推動。請加入我們，與社區建立聯繫，分享你對這一特性及更多內容的想法和反饋。
我們期待傾聽你的建議！
