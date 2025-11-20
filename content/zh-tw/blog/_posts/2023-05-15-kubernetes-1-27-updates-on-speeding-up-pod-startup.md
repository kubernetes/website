---
layout: blog
title: "Kubernetes 1.27：關於加快 Pod 啓動的進展"
date: 2023-05-15T00:00:00+0000
slug: speed-up-pod-startup
---
<!--
layout: blog
title: "Kubernetes 1.27: updates on speeding up Pod startup"
date: 2023-05-15T00:00:00+0000
slug: speed-up-pod-startup
-->

<!--
**Authors**: Paco Xu (DaoCloud), Sergey Kanzhelev (Google), Ruiwen Zhao (Google)
-->
**作者**：Paco Xu (DaoCloud), Sergey Kanzhelev (Google), Ruiwen Zhao (Google)
**譯者**：Michael Yao (DaoCloud)

<!--
How can Pod start-up be accelerated on nodes in large clusters? This is a common issue that
cluster administrators may face.

This blog post focuses on methods to speed up pod start-up from the kubelet side. It does not
involve the creation time of pods by controller-manager through kube-apiserver, nor does it
include scheduling time for pods or webhooks executed on it.
-->
如何在大型叢集中加快節點上的 Pod 啓動？這是叢集管理員可能面臨的常見問題。

本篇博文重點介紹了從 kubelet 一側加快 Pod 啓動的方法。它不涉及通過
kube-apiserver 由 controller-manager 創建 Pod 所用的時間，
也不包括 Pod 的調度時間或在其上執行 Webhook 的時間。

<!--
We have mentioned some important factors here to consider from the kubelet's perspective, but
this is not an exhaustive list. As Kubernetes v1.27 is released, this blog highlights
significant changes in v1.27 that aid in speeding up pod start-up.
-->
我們從 kubelet 的角度考慮，在本文提到了一些重要的影響因素，但這並不是詳盡羅列。
隨着 Kubernetes v1.27 的發佈，本文強調了在 v1.27 中有助於加快 Pod 啓動的重大變更。

<!--
## Parallel container image pulls

Pulling images always takes some time and what's worse is that image pulls are done serially by
default. In other words, kubelet will send only one image pull request to the image service at
a time. Other image pull requests have to wait until the one being processed is complete.
-->
## 並行容器映像檔拉取

拉取映像檔總是需要一些時間的，更糟糕的是，映像檔拉取預設是串行作業。
換句話說，kubelet 一次只會向映像檔服務發送一個映像檔拉取請求。
其他的映像檔拉取請求必須等到正在處理的拉取請求完成。

<!--
To enable parallel image pulls, set the `serializeImagePulls` field to false in the kubelet
configuration. When `serializeImagePulls` is disabled, requests for image pulls are immediately
sent to the image service and multiple images can be pulled concurrently.
-->
要啓用並行映像檔拉取，請在 kubelet 設定中將 `serializeImagePulls` 字段設置爲 false。
當 `serializeImagePulls` 被禁用時，將立即向映像檔服務發送映像檔拉取請求，並可以並行拉取多個映像檔。

<!--
### Maximum parallel image pulls will help secure your node from overloading on image pulling

We introduced a new feature in kubelet that sets a limit on the number of parallel image
pulls at the node level. This limit restricts the maximum number of images that can be pulled
simultaneously. If there is an image pull request beyond this limit, it will be blocked until
one of the ongoing image pulls finishes. Before enabling this feature, please ensure that your
container runtime's image service can handle parallel image pulls effectively.
-->
### 設定並行映像檔拉取最大值有助於防止節點因映像檔拉取而過載

我們在 kubelet 中引入了一個新特性，可以在節點級別設置並行映像檔拉取的限值。
此限值限制了可以同時拉取的最大映像檔數量。如果有個映像檔拉取請求超過了這個限值，
該請求將被阻止，直到其中一個正在進行的映像檔拉取完成爲止。
在啓用此特性之前，請確保容器運行時的映像檔服務可以有效處理並行映像檔拉取。

<!--
To limit the number of simultaneous image pulls, you can configure the `maxParallelImagePulls`
field in kubelet. By setting `maxParallelImagePulls` to a value of _n_, only _n_ images will
be pulled concurrently. Any additional image pulls beyond this limit will wait until at least
one ongoing pull is complete.

You can find more details in the associated KEP: [Kubelet limit of Parallel Image Pulls](https://kep.k8s.io/3673)
 (KEP-3673).
 -->
要限制並行映像檔拉取的數量，你可以在 kubelet 中設定 `maxParallelImagePulls` 字段。
將 `maxParallelImagePulls` 的值設置爲 **n** 後，並行拉取的映像檔數將不能超過 **n** 個。
超過此限值的任何其他映像檔拉取請求都需要等到至少一個正在進行的拉取被完成爲止。

你可以在關聯的 KEP 中找到更多細節：
[Kubelet 並行映像檔拉取數限值](https://kep.k8s.io/3673) (KEP-3673)。

<!--
## Raised default API query-per-second limits for kubelet

To improve pod startup in scenarios with multiple pods on a node, particularly sudden scaling
situations, it is necessary for Kubelet to synchronize the pod status and prepare configmaps,
secrets, or volumes. This requires a large bandwidth to access kube-apiserver.
-->
## 提高了 kubelet 預設 API 每秒查詢限值

爲了在節點上具有多個 Pod 的場景中加快 Pod 啓動，特別是在突然擴縮的情況下，
kubelet 需要同步 Pod 狀態並準備 ConfigMap、Secret 或卷。這就需要大帶寬訪問 kube-apiserver。

<!--
In versions prior to v1.27, the default `kubeAPIQPS` was 5 and `kubeAPIBurst` was 10. However,
the kubelet in v1.27 has increased these defaults to 50 and 100 respectively for better performance during
pod startup. It's worth noting that this isn't the only reason why we've bumped up the API QPS
limits for Kubelet.
-->
在 v1.27 之前的版本中，`kubeAPIQPS` 的預設值爲 5，`kubeAPIBurst` 的預設值爲 10。
然而在 v1.27 中，kubelet 爲了提高 Pod 啓動性能，將這些預設值分別提高到了 50 和 100。
值得注意的是，這並不是我們提高 kubelet 的 API QPS 限值的唯一原因。

<!--
1. It has a potential to be hugely throttled now (default QPS = 5)
2. In large clusters they can generate significant load anyway as there are a lot of them
3. They have a dedicated PriorityLevel and FlowSchema that we can easily control
-->
1. 現在的情況是 API 請求可能會被過度限制（預設 QPS = 5）
2. 在大型叢集中，API 請求仍然可能產生相當大的負載，因爲數量很多
3. 我們現在可以輕鬆控制一個專門爲此設計的 PriorityLevel 和 FlowSchema

<!--
Previously, we often encountered `volume mount timeout` on kubelet in node with more than 50 pods
during pod start up. We suggest that cluster operators bump `kubeAPIQPS` to 20 and `kubeAPIBurst` to 40,
 especially if using bare metal nodes.

More detials can be found in the KEP <https://kep.k8s.io/1040> and the pull request [#116121](https://github.com/kubernetes/kubernetes/pull/116121).
-->
以前在具有 50 個以上 Pod 的節點中，我們經常在 Pod 啓動期間在 kubelet 上遇到 `volume mount timeout`。
特別是在使用裸金屬節點時，我們建議叢集操作員將 `kubeAPIQPS` 提高到 20，`kubeAPIBurst` 提高到 40。

更多細節請參閱 KEP <https://kep.k8s.io/1040> 和
[PR#116121](https://github.com/kubernetes/kubernetes/pull/116121)。

<!--
## Event triggered updates to container status

`Evented PLEG` (PLEG is short for "Pod Lifecycle Event Generator") is set to be in beta for v1.27,
Kubernetes offers two ways for the kubelet to detect Pod lifecycle events, such as the last
process in a container shutting down.
In Kubernetes v1.27, the _event based_ mechanism has graduated to beta but remains
disabled by default. If you do explicitly switch to event-based lifecycle change detection,
the kubelet is able to start Pods more quickly than with the default approach that relies on polling.
The default mechanism, polling for lifecycle changes, adds a noticeable overhead; this affects
the kubelet's ability to handle different tasks in parallel, and leads to poor performance and
reliability issues. For these reasons, we recommend that you switch your nodes to use
event-based pod lifecycle change detection.
-->
## 事件驅動的容器狀態更新

在 v1.27 中，`Evented PLEG`
（PLEG 是英文 Pod Lifecycle Event Generator 的縮寫，表示 “Pod 生命週期事件生成器”）
進階至 Beta 階段。Kubernetes 爲 kubelet 提供了兩種方法來檢測 Pod 的生命週期事件，
例如容器中最後一個進程關閉。在 Kubernetes v1.27 中，**基於事件的** 機制已進階至 Beta，
但預設被禁用。如果你顯式切換爲基於事件的生命週期變更檢測，則 kubelet
能夠比依賴輪詢的預設方法更快地啓動 Pod。預設的輪詢生命週期變化機制會增加明顯的開銷，
這會影響 kubelet 處理不同任務的並行能力，並導致性能和可靠性問題。
出於這些原因，我們建議你將節點切換爲使用基於事件的 Pod 生命週期變更檢測。

<!--
Further details can be found in the KEP <https://kep.k8s.io/3386> and
[Switching From Polling to CRI Event-based Updates to Container Status](/docs/tasks/administer-cluster/switch-to-evented-pleg/).
-->
更多細節請參閱 KEP <https://kep.k8s.io/3386>
和[容器狀態從輪詢切換爲基於 CRI 事件更新](/zh-cn/docs/tasks/administer-cluster/switch-to-evented-pleg/)。

<!--
## Raise your pod resource limit if needed

During start-up, some pods may consume a considerable amount of CPU or memory. If the CPU limit is
low, this can significantly slow down the pod start-up process. To improve the memory management,
Kubernetes v1.22 introduced a feature gate called MemoryQoS to kubelet. This feature enables
kubelet to set memory QoS at container, pod, and QoS levels for better protection and guaranteed
quality of memory when running with cgroups v2. Although it has benefits, it is possible that
enabling this feature gate may affect the start-up speed of the pod if the pod startup consumes
a large amount of memory.
-->
## 必要時提高 Pod 資源限值

某些 Pod 在啓動過程中可能會耗用大量的 CPU 或內存。
如果 CPU 限值較低，則可能會顯著降低 Pod 啓動過程的速度。
爲了改善內存管理，Kubernetes v1.22 引入了一個名爲 MemoryQoS 的特性門控。
該特性使 kubelet 能夠在容器、Pod 和 QoS 級別上設置內存 QoS，以便更好地保護和確保在運行
CGroup V2 時的內存質量。儘管此特性門控有一定的好處，但如果 Pod 啓動消耗大量內存，
啓用此特性門控可能會影響 Pod 的啓動速度。

<!--
Kubelet configuration now includes `memoryThrottlingFactor`. This factor is multiplied by
the memory limit or node allocatable memory to set the cgroupv2 `memory.high` value for enforcing
MemoryQoS. Decreasing this factor sets a lower high limit for container cgroups, increasing reclaim
pressure. Increasing this factor will put less reclaim pressure. The default value is 0.8 initially
and will change to 0.9 in Kubernetes v1.27. This parameter adjustment can reduce the potential
impact of this feature on pod startup speed.

Further details can be found in the KEP <https://kep.k8s.io/2570>.
-->
Kubelet 設定現在包括 `memoryThrottlingFactor`。該因子乘以內存限制或節點可分配內存，
可以設置 cgroupv2  `memory.high` 值來執行 MemoryQoS。
減小該因子將爲容器 cgroup 設置較低的上限，同時增加了回收壓力。
提高此因子將減少回收壓力。預設值最初爲 0.8，並將在 Kubernetes v1.27 中更改爲 0.9。
調整此參數可以減少此特性對 Pod 啓動速度的潛在影響。

更多細節請參閱 KEP <https://kep.k8s.io/2570>。

<!--
## What's more?

In Kubernetes v1.26, a new histogram metric `pod_start_sli_duration_seconds` was added for Pod
startup latency SLI/SLO details. Additionally, the kubelet log will now display more information
about pod start-related timestamps, as shown below:
-->
## 更多說明

在 Kubernetes v1.26 中，新增了一個名爲 `pod_start_sli_duration_seconds` 的直方圖指標，
用於顯示 Pod 啓動延遲 SLI/SLO 詳情。此外，kubelet 日誌現在會展示更多與 Pod 啓動相關的時間戳資訊，如下所示：

> Dec 30 15:33:13.375379 e2e-022435249c-674b9-minion-group-gdj4 kubelet[8362]: I1230 15:33:13.375359    8362 pod_startup_latency_tracker.go:102] "Observed pod startup duration" pod="kube-system/konnectivity-agent-gnc9k" podStartSLOduration=-9.223372029479458e+09 pod.CreationTimestamp="2022-12-30 15:33:06 +0000 UTC" firstStartedPulling="2022-12-30 15:33:09.258791695 +0000 UTC m=+13.029631711" lastFinishedPulling="0001-01-01 00:00:00 +0000 UTC" observedRunningTime="2022-12-30 15:33:13.375009262 +0000 UTC m=+17.145849275" watchObservedRunningTime="2022-12-30 15:33:13.375317944 +0000 UTC m=+17.146157970"

<!--
The SELinux Relabeling with Mount Options feature moved to Beta in v1.27. This feature speeds up
container startup by mounting volumes with the correct SELinux label instead of changing each file
on the volumes recursively. Further details can be found in the KEP <https://kep.k8s.io/1710>.

To identify the cause of slow pod startup, analyzing metrics and logs can be helpful. Other
factors that may impact pod startup include container runtime, disk speed, CPU and memory
resources on the node.
-->
SELinux 掛載選項重標記功能在 v1.27 中升至 Beta 版本。
該特性通過掛載具有正確 SELinux 標籤的捲來加快容器啓動速度，
而不是遞歸地更改捲上的每個檔案。更多細節請參閱 KEP <https://kep.k8s.io/1710>。

爲了確定 Pod 啓動緩慢的原因，分析指標和日誌可能會有所幫助。
其他可能會影響 Pod 啓動的因素包括容器運行時、磁盤速度、節點上的 CPU 和內存資源。

<!--
SIG Node is responsible for ensuring fast Pod startup times, while addressing issues in large
clusters falls under the purview of SIG Scalability as well.
-->
SIG Node 負責確保 Pod 快速啓動，而解決大型叢集中的問題則屬於 SIG Scalability 的範疇。
