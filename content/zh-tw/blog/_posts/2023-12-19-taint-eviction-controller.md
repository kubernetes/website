---
layout: blog
title: "Kubernetes 1.29: 解耦污點管理器與節點生命週期控制器"
date: 2023-12-19
slug: kubernetes-1-29-taint-eviction-controller
---
<!--
layout: blog
title: "Kubernetes 1.29: Decoupling taint-manager from node-lifecycle-controller"
date: 2023-12-19
slug: kubernetes-1-29-taint-eviction-controller
-->

<!-- 
**Authors:** Yuan Chen (Apple), Andrea Tosatto (Apple) 
-->
**作者:** Yuan Chen (Apple), Andrea Tosatto (Apple)

**譯者:** Allen Zhang

<!-- 
This blog discusses a new feature in Kubernetes 1.29 to improve the handling of taint-based pod eviction. 
-->
這篇博客討論在 Kubernetes 1.29 中基於污點的 Pod 驅逐處理的新特性。

<!-- 
## Background 
-->
## 背景

<!-- 
In Kubernetes 1.29, an improvement has been introduced to enhance the taint-based pod eviction handling on nodes.
This blog discusses the changes made to node-lifecycle-controller
to separate its responsibilities and improve overall code maintainability. 
-->
在 Kubernetes 1.29 中引入了一項改進，以加強節點上基於污點的 Pod 驅逐處理。
本文將討論對節點生命週期控制器（node-lifecycle-controller）所做的更改，以分離職責並提高代碼的整體可維護性。

<!-- 
## Summary of changes 
-->
## 變動摘要

<!-- 
node-lifecycle-controller previously combined two independent functions: 
-->
節點生命週期控制器之前組合了兩個獨立的功能：

<!-- 
- Adding a pre-defined set of `NoExecute` taints to Node based on Node's condition.
- Performing pod eviction on `NoExecute` taint. 
-->
- 基於節點的條件爲節點新增了一組預定義的污點 `NoExecute`。
- 對有 `NoExecute` 污點的 Pod 執行驅逐操作。

<!-- 
With the Kubernetes 1.29 release, the taint-based eviction implementation has been
moved out of node-lifecycle-controller into a separate and independent component called taint-eviction-controller.
This separation aims to disentangle code, enhance code maintainability,
and facilitate future extensions to either component. 
-->
在 Kubernetes 1.29 版本中，基於污點的驅逐實現已經從節點生命週期控制器中移出，
成爲一個名爲污點驅逐控制器（taint-eviction-controller）的獨立組件。
旨在拆分代碼，提高代碼的可維護性，並方便未來對這兩個組件進行擴展。

<!-- 
As part of the change, additional metrics were introduced to help you monitor taint-based pod evictions: 
-->
以下新指標可以幫助你監控基於污點的 Pod 驅逐：

<!-- 
- `pod_deletion_duration_seconds` measures the latency between the time when a taint effect
has been activated for the Pod and its deletion via taint-eviction-controller.
- `pod_deletions_total` reports the total number of Pods deleted by taint-eviction-controller since its start. 
-->
- `pod_deletion_duration_seconds` 表示當 Pod 的污點被激活直到這個 Pod 被污點驅逐控制器刪除的延遲時間。
- `pod_deletions_total` 表示自從污點驅逐控制器啓動以來驅逐的 Pod 總數。

<!-- 
## How to use the new feature? 
-->
## 如何使用這個新特性？

<!-- 
A new feature gate, `SeparateTaintEvictionController`, has been added. The feature is enabled by default as Beta in Kubernetes 1.29.
Please refer to the [feature gate document](/docs/reference/command-line-tools-reference/feature-gates/). 
-->
名爲 `SeparateTaintEvictionController` 的特性門控已被添加。該特性在 Kubernetes 1.29 Beta 版本中默認開啓。
詳情請參閱[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
 

<!-- 
When this feature is enabled, users can optionally disable taint-based eviction by setting `--controllers=-taint-eviction-controller`
in kube-controller-manager. 
-->
當這項特性啓用時，用戶可以通過在 `kube-controller-manager` 通過手動設置
`--controllers=-taint-eviction-controller` 的方式來禁用基於污點的驅逐功能。

<!-- 
To disable the new feature and use the old taint-manager within node-lifecylecycle-controller , users can set the feature gate `SeparateTaintEvictionController=false`. 
-->
如果想禁用該特性並在節點生命週期中使用舊版本污點管理器，用戶可以通過設置 `SeparateTaintEvictionController=false` 來禁用。

<!-- 
## Use cases 
-->
## 使用案例

<!-- 
This new feature will allow cluster administrators to extend and enhance the default
taint-eviction-controller and even replace the default taint-eviction-controller with a
custom implementation to meet different needs. An example is to better support
stateful workloads that use PersistentVolume on local disks. 
-->
該特性將允許集羣管理員擴展、增強默認的污點驅逐控制器，並且可以使用自定義的實現方式替換默認的污點驅逐控制器以滿足不同的需要。
例如：更好地支持在本地磁盤的持久卷中的有狀態工作負載。

<!-- 
## FAQ 
-->
## FAQ

<!-- 
**Does this feature change the existing behavior of taint-based pod evictions?** 
-->
**該特性是否會改變現有的基於污點的 Pod 驅逐行爲？**

<!-- 
No, the taint-based pod eviction behavior remains unchanged. If the feature gate
`SeparateTaintEvictionController` is turned off, the legacy node-lifecycle-controller with taint-manager will continue to be used. 
-->
不會，基於污點的 Pod 驅逐行爲保持不變。如果特性門控 `SeparateTaintEvictionController` 被關閉，
將繼續使用之前的節點生命週期管理器中的污點管理器。

<!-- 
**Will enabling/using this feature result in an increase in the time taken by any operations covered by existing SLIs/SLOs?** 
-->
**啓用/使用此特性是否會導致現有 SLI/SLO 中任何操作的用時增加？**

<!-- 
No. 
-->
不會。

<!-- 
**Will enabling/using this feature result in an increase in resource usage (CPU, RAM, disk, IO, ...)?** 
-->
**啓用/使用此特性是否會導致資源利用量（如 CPU、內存、磁盤、IO 等）的增加？**

<!-- 
The increase in resource usage by running a separate `taint-eviction-controller` will be negligible. 
-->
運行單獨的 `taint-eviction-controller` 所增加的資源利用量可以忽略不計。

<!-- 
## Learn more 
-->
## 瞭解更多

<!-- 
For more details, refer to the [KEP](http://kep.k8s.io/3902). 
-->
更多細節請參考 [KEP](http://kep.k8s.io/3902)。

<!-- 
## Acknowledgments 
-->
## 特別鳴謝

<!-- 
As with any Kubernetes feature, multiple community members have contributed, from
writing the KEP to implementing the new controller and reviewing the KEP and code. Special thanks to: 
-->
與任何 Kubernetes 特性一樣，從撰寫 KEP 到實現新控制器再到審覈 KEP 和代碼，多名社區成員都做出了貢獻，特別感謝：

- Aldo Culquicondor (@alculquicondor)
- Maciej Szulik (@soltysh)
- Filip Křepinský (@atiratree)
- Han Kang (@logicalhan)
- Wei Huang (@Huang-Wei)
- Sergey Kanzhelevi (@SergeyKanzhelev)
- Ravi Gudimetla (@ravisantoshgudimetla)
- Deep Debroy (@ddebroy)
