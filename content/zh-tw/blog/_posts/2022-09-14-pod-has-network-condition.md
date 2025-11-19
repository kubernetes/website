---
layout: blog
title: 'Kubernetes 1.25：Pod 新增 PodHasNetwork 狀況'
date: 2022-09-14
slug: pod-has-network-condition
author: >
  Deep Debroy (Apple)
---
<!--
layout: blog
title: 'Kubernetes 1.25: PodHasNetwork Condition for Pods'
date: 2022-09-14
slug: pod-has-network-condition
author: >
  Deep Debroy (Apple)
-->

<!--
Kubernetes 1.25 introduces Alpha support for a new kubelet-managed pod condition
in the status field of a pod: `PodHasNetwork`. The kubelet, for a worker node,
will use the `PodHasNetwork` condition to accurately surface the initialization
state of a pod from the perspective of pod sandbox creation and network
configuration by a container runtime (typically in coordination with CNI
plugins). The kubelet starts to pull container images and start individual
containers (including init containers) after the status of the `PodHasNetwork`
condition is set to `"True"`. Metrics collection services that report latency of
pod initialization from a cluster infrastructural perspective (i.e. agnostic of
per container characteristics like image size or payload) can utilize the
`PodHasNetwork` condition to accurately generate Service Level Indicators
(SLIs). Certain operators or controllers that manage underlying pods may utilize
the `PodHasNetwork` condition to optimize the set of actions performed when pods
repeatedly fail to come up.
-->
Kubernetes 1.25 引入了對 kubelet 所管理的新的 Pod 狀況 `PodHasNetwork` 的 Alpha 支持，
該狀況位於 Pod 的 status 字段中 。對於工作節點，kubelet 將使用 `PodHasNetwork` 狀況從容器運行時
（通常與 CNI 插件協作）創建 Pod 沙箱和網絡配置的角度準確地瞭解 Pod 的初始化狀態。
在 `PodHasNetwork` 狀況的 status 設置爲 `"True"` 後，kubelet 開始拉取容器鏡像並啓動獨立的容器
（包括 Init 容器）。從集羣基礎設施的角度報告 Pod 初始化延遲的指標採集服務
（無需知道每個容器的鏡像大小或有效負載等特徵）就可以利用 `PodHasNetwork`
狀況來準確生成服務水平指標（Service Level Indicator，SLI）。
某些管理底層 Pod 的 Operator 或控制器可以利用 `PodHasNetwork` 狀況來優化 Pod 反覆出現失敗時要執行的操作。

<!--
### Updates for Kubernetes 1.28

The `PodHasNetwork` condition has been renamed to `PodReadyToStartContainers`.
Alongside that change, the feature gate `PodHasNetworkCondition` has been replaced by
`PodReadyToStartContainersCondition`. You need to set `PodReadyToStartContainersCondition`
to true in order to use the new feature in v1.28.0 and later.
-->
### Kubernetes 1.28 更新內容  

`PodHasNetwork` 狀況已更名爲 `PodReadyToStartContainers`。與此變更同步的是，特性門控
`PodHasNetworkCondition` 已被替換爲 `PodReadyToStartContainersCondition`。
你需要將 `PodReadyToStartContainersCondition` 設置爲 true，
才能在 v1.28.0 及更高版本中使用這一新特性。

<!--
### How is this different from the existing Initialized condition reported for pods?

The kubelet sets the status of the existing `Initialized` condition reported in
the status field of a pod depending on the presence of init containers in a pod.
-->
### 這與現在爲 Pod 所報告的 Intialized 狀況有何不同？

根據 Pod 中是否存在 Init 容器，kubelet 會設置在 Pod 的 status 字段中報告的 `Initialized` 狀況的狀態。

<!--
If a pod specifies init containers, the status of the `Initialized` condition in
the pod status will not be set to `"True"` until all init containers for the pod
have succeeded. However, init containers, configured by users, may have errors
(payload crashing, invalid image, etc) and the number of init containers
configured in a pod may vary across different workloads. Therefore,
cluster-wide, infrastructural SLIs around pod initialization cannot depend on
the `Initialized` condition of pods.
-->
如果 Pod 指定了 Init 容器，則 Pod 狀態中的 `Initialized` 狀況的 status 將不會設置爲 `"True"`，
直到該 Pod 的所有 Init 容器都成功爲止。但是，用戶配置的 Init 容器可能會出現錯誤（有效負載崩潰、無效鏡像等），
並且 Pod 中配置的 Init 容器數量可能因工作負載不同而異。
因此，關於 Pod 初始化的集羣範圍基礎設施 SLI 不能依賴於 Pod 的 `Initialized` 狀況。

<!--
If a pod does not specify init containers, the status of the `Initialized`
condition in the pod status is set to `"True"` very early in the lifecycle of
the pod. This occurs before the kubelet initiates any pod runtime sandbox
creation and network configuration steps. As a result, a pod without init
containers will report the status of the `Initialized` condition as `"True"`
even if the container runtime is not able to successfully initialize the pod
sandbox environment.
-->
如果 Pod 未指定 Init 容器，則在 Pod 生命週期的早期，
Pod 狀態中的 `Initialized` 狀況的 status 會被設置爲 `"True"`。
這一設置發生在 kubelet 開始創建 Pod 運行時沙箱及配置網絡之前。
因此，即使容器運行時未能成功初始化 Pod 沙箱環境，沒有 Init 容器的
Pod 也會將 `Initialized` 狀況的 status 報告爲 `"True"`。

<!--
Relative to either situation above, the `PodHasNetwork` condition surfaces more
accurate data around when the pod runtime sandbox was initialized with
networking configured so that the kubelet can proceed to launch user-configured
containers (including init containers) in the pod.
-->
相對於上述任何一種情況，`PodHasNetwork` 狀況會在 Pod 運行時沙箱被初始化並配置了網絡時能夠提供更準確的數據，
這樣 kubelet 可以繼續在 Pod 中啓動用戶配置的容器（包括 Init 容器）。

<!--
### Special Cases

If a pod specifies `hostNetwork` as `"True"`, the `PodHasNetwork` condition is
set to `"True"` based on successful creation of the pod sandbox while the
network configuration state of the pod sandbox is ignored. This is because the
CRI implementation typically skips any pod sandbox network configuration when
`hostNetwork` is set to `"True"` for a pod.
-->
### 特殊場景

如果一個 Pod 指定 `hostNetwork` 爲 `"True"`，
系統會根據 Pod 沙箱創建操作是否成功來決定要不要將 `PodHasNetwork` 狀況設置爲 `"True"`，
設置此狀況時會忽略 Pod 沙箱的網絡配置狀態。這是因爲 Pod 的 `hostNetwork` 被設置爲
`"True"` 時 CRI 實現通常會跳過所有 Pod 沙箱網絡配置。

<!--
A node agent may dynamically re-configure network interface(s) for a pod by
watching changes in pod annotations that specify additional networking
configuration (e.g. `k8s.v1.cni.cncf.io/networks`). Dynamic updates of pod
networking configuration after the pod sandbox is initialized by Kubelet (in
coordination with a container runtime) are not reflected by the `PodHasNetwork`
condition.
-->
節點代理可以通過監視指定附加網絡配置（例如 `k8s.v1.cni.cncf.io/networks`）的 Pod 註解變化，
來動態地爲 Pod 重新配置網絡接口。Pod 沙箱被 Kubelet 初始化（結合容器運行時）之後
Pod 網絡配置的動態更新不反映在 `PodHasNetwork` 狀況中。

<!--
### Try out the PodHasNetwork condition for pods

In order to have the kubelet report the `PodHasNetwork` condition in the status
field of a pod, please enable the `PodHasNetworkCondition` feature gate on the
kubelet.

For a pod whose runtime sandbox has been successfully created and has networking
configured, the kubelet will report the `PodHasNetwork` condition with status set to `"True"`:
-->
### 試用 Pod 的 `PodHasNetwork` 狀況

爲了讓 kubelet 在 Pod 的 status 字段中報告 `PodHasNetwork` 狀況，需在 kubelet 上啓用
`PodHasNetworkCondition` 特性門控。

對於已成功創建運行時沙箱並已配置網絡的 Pod，在 status 設置爲 `"True"` 後，
kubelet 將報告 `PodHasNetwork` 狀況：

```
$ kubectl describe pod nginx1
Name:             nginx1
Namespace:        default
...
Conditions:
  Type              Status
  PodHasNetwork     True
  Initialized       True
  Ready             True
  ContainersReady   True
  PodScheduled      True
```

<!--
For a pod whose runtime sandbox has not been created yet (and networking not
configured either), the kubelet will report the `PodHasNetwork` condition with
status set to `"False"`:
-->
對於尚未創建運行時沙箱（也未配置網絡）的 Pod，在 status 設置爲 `"False"` 後，
kubelet 將報告 `PodHasNetwork` 狀況：

```
$ kubectl describe pod nginx2
Name:             nginx2
Namespace:        default
...
Conditions:
  Type              Status
  PodHasNetwork     False
  Initialized       True
  Ready             False
  ContainersReady   False
  PodScheduled      True
```

<!--
### What’s next?

Depending on feedback and adoption, the Kubernetes team plans to push the
reporting of the `PodHasNetwork` condition to Beta in 1.26 or 1.27.
-->
### 下一步是什麼？

Kubernetes 團隊根據反饋和採用情況，計劃在 1.26 或 1.27 中將 `PodHasNetwork` 狀況的報告提升到 Beta 階段。

<!--
### How can I learn more?

Please check out the
[documentation](/docs/concepts/workloads/pods/pod-lifecycle/) for the
`PodHasNetwork` condition to learn more about it and how it fits in relation to
other pod conditions.
-->
### 我如何瞭解更多信息？

請查閱 `PodHasNetwork` 狀況有關的[文檔](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/)，
以瞭解有關該狀況的更多信息以及它與其他 Pod 狀況的關係。

<!--
### How to get involved?

This feature is driven by the SIG Node community. Please join us to connect with
the community and share your ideas and feedback around the above feature and
beyond. We look forward to hearing from you!
-->
### 如何參與？

此特性由 SIG Node 社區驅動。請加入我們與社區建立聯繫，並就上述特性及其他問題分享你的想法和反饋。
我們期待你的迴音！

<!--
### Acknowledgements

We want to thank the following people for their insightful and helpful reviews
of the KEP and PRs around this feature: Derek Carr (@derekwaynecarr), Mrunal
Patel (@mrunalp), Dawn Chen (@dchen1107), Qiutong Song (@qiutongs), Ruiwen Zhao
(@ruiwen-zhao), Tim Bannister (@sftim), Danielle Lancashire (@endocrimes) and
Agam Dua (@agamdua).
-->
### 致謝

我們要感謝以下人員圍繞此特性對 KEP 和 PR 進行了極具洞察力和相當有助益的評審工作：
Derek Carr (@derekwaynecarr)、Mrunal Patel (@mrunalp)、Dawn Chen (@dchen1107)、
Qiutong Song (@qiutongs)、Ruiwen Zhao (@ruiwen-zhao)、Tim Bannister (@sftim)、
Danielle Lancashire (@endocrimes) 和 Agam Dua (@agamdua)。
