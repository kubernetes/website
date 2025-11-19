---
layout: blog
title: 'Kubernetes v1.34 搶先一覽'
date: 2025-07-28
slug: kubernetes-v1-34-sneak-peek
author: >
  Agustina Barbetta,
  Alejandro Josue Leon Bellido,
  Graziano Casto,
  Melony Qin,
  Dipesh Rawat
translator: >
  Michael Yao (DaoCloud)
---
<!--
layout: blog
title: 'Kubernetes v1.34 Sneak Peek'
date: 2025-07-28
slug: kubernetes-v1-34-sneak-peek
author: >
  Agustina Barbetta,
  Alejandro Josue Leon Bellido,
  Graziano Casto,
  Melony Qin,
  Dipesh Rawat
-->

<!--
Kubernetes v1.34 is coming at the end of August 2025. 
This release will not include any removal or deprecation, but it is packed with an impressive number of enhancements. 
Here are some of the features we are most excited about in this cycle!  

Please note that this information reflects the current state of v1.34 development and may change before release.
-->
Kubernetes v1.34 將於 2025 年 8 月底發佈。
本次發版不會移除或棄用任何特性，但包含了數量驚人的增強特性。
以下列出一些本次發版最令人興奮的特性！

請注意，以下內容反映的是 v1.34 當前的開發狀態，發佈前可能會發生變更。

<!--
## Featured enhancements of Kubernetes v1.34

The following list highlights some of the notable enhancements likely to be included in the v1.34 release, 
but is not an exhaustive list of all planned changes. 
This is not a commitment and the release content is subject to change.
-->
## Kubernetes v1.34 的重點增強特性

以下列出了一些可能會包含在 v1.34 版本中的重要增強特性，
但這並不是所有計劃更改的詳盡列表。
這並不構成承諾，發佈內容可能會發生變更。

<!--
### The core of DRA targets stable

[Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) (DRA) provides a flexible way to categorize, 
request, and use devices like GPUs or custom hardware in your Kubernetes cluster.
-->
### DRA 核心功能趨向穩定

[動態資源分配](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)（DRA）
提供了一種靈活的方式來分類、請求和使用叢集中的 GPU 或定製硬件等設備。

<!--
Since the v1.30 release, DRA has been based around claiming devices using _structured parameters_ that are opaque to the core of Kubernetes.
The relevant enhancement proposal, [KEP-4381](https://kep.k8s.io/4381), took inspiration from dynamic provisioning for storage volumes.
DRA with structured parameters relies on a set of supporting API kinds: ResourceClaim, DeviceClass, ResourceClaimTemplate, 
and ResourceSlice API types under `resource.k8s.io`, while extending the `.spec` for Pods with a new `resourceClaims` field.
The core of DRA is targeting graduation to stable in Kubernetes v1.34.
-->
自 v1.30 版本起，DRA 已基於**結構化參數**來申領設備，這些參數對於 Kubernetes 核心是不可見的。
相關增強提案 [KEP-4381](https://kep.k8s.io/4381) 借鑑了存儲捲動態製備的思路。
使用結構化參數的 DRA 依賴一組輔助 API 類別：包括 `resource.k8s.io` 下的
ResourceClaim、DeviceClass、ResourceClaimTemplate 和 ResourceSlice，
還在 Pod 的 `.spec` 中新增了 `resourceClaims` 字段。
DRA 的核心功能計劃在 Kubernetes v1.34 中進階至穩定階段。

<!--
With DRA, device drivers and cluster admins define device classes that are available for use. 
Workloads can claim devices from a device class within device requests. 
Kubernetes allocates matching devices to specific claims and places the corresponding Pods on nodes that can access the allocated devices. 
This framework provides flexible device filtering using CEL, centralized device categorization, and simplified Pod requests, among other benefits.

Once this feature has graduated, the `resource.k8s.io/v1` APIs will be available by default.
-->
藉助 DRA，設備驅動和叢集管理員定義可用的設備類。
工作負載可以在設備請求中從設備類申領設備。
Kubernetes 爲每個申領分配匹配的設備，並將相關 Pod 安排到可訪問所分配設備的節點上。
這種框架提供了使用 CEL 的靈活設備篩選、集中式設備分類和簡化的 Pod 請求等優點。

一旦此特性進入穩定階段，`resource.k8s.io/v1` API 將默認可用。

<!--
### ServiceAccount tokens for image pull authentication

The [ServiceAccount](/docs/concepts/security/service-accounts/) token integration for `kubelet` credential providers is likely to reach beta and be enabled by default in Kubernetes v1.34. 
This allows the `kubelet` to use these tokens when pulling container images from registries that require authentication.

That support already exists as alpha, and is tracked as part of [KEP-4412](https://kep.k8s.io/4412).
-->
### 使用 ServiceAccount 令牌進行映像檔拉取身份認證

ServiceAccount 令牌與 kubelet 憑據提供程序集成的特性預計將在 Kubernetes v1.34 中進入 Beta 階段並默認啓用。
這將允許 kubelet 在從需要身份認證的映像檔倉庫中拉取容器映像檔時使用這些令牌。

此特性已作爲 Alpha 存在，並由 [KEP-4412](https://kep.k8s.io/4412) 跟蹤。

<!--
The existing alpha integration allows the `kubelet` to use short-lived, automatically rotated ServiceAccount tokens (that follow OIDC-compliant semantics) to authenticate to a container image registry. 
Each token is scoped to one associated Pod; the overall mechanism replaces the need for long-lived image pull Secrets.

Adopting this new approach reduces security risks, supports workload-level identity, and helps cut operational overhead. 
It brings image pull authentication closer to modern, identity-aware good practice.
-->
現有的 Alpha 集成允許 kubelet 使用生命期短、自動輪換的 ServiceAccount 令牌
（符合 OIDC 標準）來向容器映像檔倉庫進行身份認證。
每個令牌與一個 Pod 相關聯；整個機制可替代長期存在的映像檔拉取 Secret。

採用這一新方式可以降低安全風險、支持工作負載級身份，並減少運維負擔。
它讓映像檔拉取認證更加貼合現代、具備身份感知的最佳實踐。

<!--
### Pod replacement policy for Deployments

After a change to a [Deployment](/docs/concepts/workloads/controllers/deployment/), terminating pods may stay up for a considerable amount of time and may consume additional resources.
As part of [KEP-3973](https://kep.k8s.io/3973), the `.spec.podReplacementPolicy` field will be introduced (as alpha) for Deployments.

If your cluster has the feature enabled, you'll be able to select one of two policies:
-->
### Deployment 的 Pod 替換策略

對 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)
做出變更後，終止中的 Pod 可能會保留較長時間，並消耗額外資源。
作爲 [KEP-3973](https://kep.k8s.io/3973) 的一部分，`.spec.podReplacementPolicy`
字段將以 Alpha 形式引入到 Deployment 中。

如果你的叢集啓用了此特性，你可以選擇以下兩種策略之一：

<!--
`TerminationStarted`
: Creates new pods as soon as old ones start terminating, resulting in faster rollouts at the cost of potentially higher resource consumption.

`TerminationComplete`
: Waits until old pods fully terminate before creating new ones, resulting in slower rollouts but ensuring controlled resource consumption.
-->
`TerminationStarted`  
: 一旦舊 Pod 開始終止，立即創建新 Pod，帶來更快的上線速度，但資源消耗可能更高。

`TerminationComplete`  
: 等待舊 Pod 完全終止後才創建新 Pod，上線速度較慢，但資源消耗控制更好。

<!--
This feature makes Deployment behavior more predictable by letting you choose when new pods should be created during updates or scaling. 
It's beneficial when working in clusters with tight resource constraints or with workloads with long termination periods. 

It's expected to be available as an alpha feature and can be enabled using the `DeploymentPodReplacementPolicy` and `DeploymentReplicaSetTerminatingReplicas` feature gates in the API server and kube-controller-manager.
-->
此特性通過讓你選擇更新或擴縮容期間何時創建新 Pod，從而使 Deployment 行爲更可控。
在資源受限的叢集或終止時間較長的工作負載中尤爲有用。

預計此特性將作爲 Alpha 特性推出，並可通過在 API 伺服器和 kube-controller-manager 中啓用
`DeploymentPodReplacementPolicy` 和 `DeploymentReplicaSetTerminatingReplicas` 特性門控啓用。

<!--
### Production-ready tracing for `kubelet` and API Server

To address the longstanding challenge of debugging node-level issues by correlating disconnected logs, 
[KEP-2831](https://kep.k8s.io/2831) provides deep, contextual insights into the `kubelet`.
-->
### kubelet 和 API 伺服器的生產級追蹤特性

爲了解決通過日誌關聯進行節點級調試的長期難題，
[KEP-2831](https://kep.k8s.io/2831) 爲 kubelet 提供了深度上下文可視化能力。

<!--
This feature instruments critical `kubelet` operations, particularly its gRPC calls to the Container Runtime Interface (CRI), using the vendor-agnostic OpenTelemetry standard. 
It allows operators to visualize the entire lifecycle of events (for example: a Pod startup) to pinpoint sources of latency and errors. 
Its most powerful aspect is the propagation of trace context; the `kubelet` passes a trace ID with its requests to the container runtime, enabling runtimes to link their own spans.
-->
此特性使用供應商中立的 OpenTelemetry 標準，爲關鍵的 kubelet 操作（特別是其對容器運行時接口的 gRPC 調用）做了插樁。
它使運維人員能夠可視化整個事件生命週期（例如：Pod 啓動）以定位延遲或錯誤來源。
其強大之處在於傳播鏈路上下文：kubelet 在向容器運行時發送請求時附帶鏈路 ID，使運行時能夠鏈接自身的 Span。

<!--
This effort is complemented by a parallel enhancement, [KEP-647](https://kep.k8s.io/647), which brings the same tracing capabilities to the Kubernetes API server. 
Together, these enhancements provide a more unified, end-to-end view of events, simplifying the process of pinpointing latency and errors from the control plane down to the node. 
These features have matured through the official Kubernetes release process. 
[KEP-2831](https://kep.k8s.io/2831) was introduced as an alpha feature in v1.25, while [KEP-647](https://kep.k8s.io/647) debuted as alpha in v1.22. 
Both enhancements were promoted to beta together in the v1.27 release. 
Looking forward, Kubelet Tracing ([KEP-2831](https://kep.k8s.io/2831)) and API Server Tracing ([KEP-647](https://kep.k8s.io/647)) are now targeting graduation to stable in the upcoming v1.34 release.
-->
這一工作得到了另一個增強提案 [KEP-647](https://kep.k8s.io/647) 的配合，
後者爲 Kubernetes API 伺服器引入了相同的鏈路追蹤能力。
兩者結合提供了從控制面到節點的端到端事件視圖，極大簡化了定位延遲和錯誤的過程。
這些特性已在 Kubernetes 正式版本發佈流程中逐漸成熟：  
[KEP-2831](https://kep.k8s.io/2831) 在 v1.25 中以 Alpha 發佈，
[KEP-647](https://kep.k8s.io/647) 在 v1.22 中首次作爲 Alpha 發佈，
這兩個特性在 v1.27 中一起進階至 Beta。
展望未來，kubelet 追蹤（[KEP-2831](https://kep.k8s.io/2831)）和
API 伺服器追蹤（[KEP-647](https://kep.k8s.io/647)）計劃在 v1.34 中進入穩定階段。

<!--
### `PreferSameZone` and `PreferSameNode` traffic distribution for Services

The `spec.trafficDistribution` field within a Kubernetes [Service](/docs/concepts/services-networking/service/) allows users to express preferences for how traffic should be routed to Service endpoints. 
-->
### Service 的 `PreferSameZone` 和 `PreferSameNode` 流量分發

Kubernetes [Service](/zh-cn/docs/concepts/services-networking/service/) 的
`spec.trafficDistribution` 字段允許使用者表達服務端點的流量路由偏好。

<!--
[KEP-3015](https://kep.k8s.io/3015) deprecates `PreferClose` and introduces two additional values: `PreferSameZone` and `PreferSameNode`. 
`PreferSameZone` is equivalent to the current `PreferClose`. 
`PreferSameNode` prioritizes sending traffic to endpoints on the same node as the client.  

This feature was introduced in v1.33 behind the `PreferSameTrafficDistribution` feature gate. 
It is targeting graduation to beta in v1.34 with its feature gate enabled by default.
-->
[KEP-3015](https://kep.k8s.io/3015) 棄用了 `PreferClose`，並引入了兩個新值：`PreferSameZone` 和 `PreferSameNode`。
`PreferSameZone` 等價於當前的 `PreferClose`；  
`PreferSameNode` 優先將流量發送至與客戶端位於同一節點的端點。

此特性在 v1.33 中引入，受 `PreferSameTrafficDistribution` 特性門控控制。
v1.34 中此特性預計將進入 Beta，並默認啓用。

<!--
### Support for KYAML: a Kubernetes dialect of YAML

KYAML aims to be a safer and less ambiguous YAML subset, and was designed specifically
for Kubernetes. Whatever version of Kubernetes you use, you'll be able use KYAML for writing manifests
and/or Helm charts.
You can write KYAML and pass it as an input to **any** version of `kubectl`,
because all KYAML files are also valid as YAML.
With kubectl v1.34, we expect you'll also be able to request KYAML output from `kubectl` (as in `kubectl get -o kyaml …`).
If you prefer, you can still request the output in JSON or YAML format.
-->
### 支持 KYAML：Kubernetes 的 YAML 方言

KYAML 是爲 Kubernetes 設計的更安全、更少歧義的 YAML 子集。
無論你使用哪個版本的 Kubernetes，都可以使用 KYAML 編寫清單和 Helm 模板。
你可以編寫 KYAML 並將其作爲輸入傳遞給**任意**版本的 kubectl，因爲所有 KYAML 文件都是合法的 YAML。
在 kubectl v1.34 中，你還可以請求以 KYAML 格式輸出（如：`kubectl get -o kyaml …`）。
當然，如果你願意，也可以繼續使用 JSON 或 YAML 格式輸出。

<!--
KYAML addresses specific challenges with both YAML and JSON. 
YAML's significant whitespace requires careful attention to indentation and nesting, 
while its optional string-quoting can lead to unexpected type coercion (for example: ["The Norway Bug"](https://hitchdev.com/strictyaml/why/implicit-typing-removed/)). 
Meanwhile, JSON lacks comment support and has strict requirements for trailing commas and quoted keys.  

[KEP-5295](https://kep.k8s.io/5295) introduces KYAML, which tries to address the most significant problems by:
-->
KYAML 解決了 YAML 和 JSON 的一些具體問題：  
YAML 對縮進的敏感性需要你注意空格和嵌套，
而其可選的字符串引號可能導致意外類型轉換
（參見 [“挪威 bug”](https://hitchdev.com/strictyaml/why/implicit-typing-removed/)）。
與此同時，JSON 不支持註釋，且對尾逗號和鍵的引號有嚴格要求。

[KEP-5295](https://kep.k8s.io/5295) 引入了 KYAML，嘗試解決這些主要問題：

<!--
* Always double-quoting value strings

* Leaving keys unquoted unless they are potentially ambiguous

* Always using `{}` for mappings (associative arrays)

* Always using `[]` for lists
-->
* 所有值字符串始終使用英文雙引號

* 鍵不加英文引號，除非可能產生歧義

* 所有映射使用 `{}` 表示（即關聯數組）

* 所有列表使用 `[]` 表示

<!--
This might sound a lot like JSON, because it is! But unlike JSON, KYAML supports comments, allows trailing commas, and doesn't require quoted keys.

We're hoping to see KYAML introduced as a new output format for `kubectl` v1.34.
As with all these features, none of these changes are 100% confirmed; watch this space!
-->
這聽起來像 JSON？確實如此！但與 JSON 不同的是，KYAML 支持註釋、允許尾逗號，且不強制鍵加引號。

我們希望在 kubectl v1.34 中將 KYAML 引入爲一種新的輸出格式。
如同其他特性一樣，這些變更尚未百分百確定，敬請關注！

<!--
As a format, KYAML is and will remain a **strict subset of YAML**, ensuring that any compliant YAML parser can parse KYAML documents. 
Kubernetes does not require you to provide input specifically formatted as KYAML, and we have no plans to change that.
-->
KYAML 作爲一種格式，是 YAML 的**嚴格子集**，
這確保任何符合規範的 YAML 解析器都能解析 KYAML 文檔。
Kubernetes 並不要求你必須提供 KYAML 格式的輸入，也沒有這方面的計劃。

<!--
### Fine-grained autoscaling control with HPA configurable tolerance

[KEP-4951](https://kep.k8s.io/4951) introduces a new feature that allows users to configure autoscaling tolerance on a per-HPA basis, 
overriding the default cluster-wide 10% tolerance setting that often proves too coarse-grained for diverse workloads. 
The enhancement adds an optional `tolerance` field to the HPA's `spec.behavior.scaleUp` and `spec.behavior.scaleDown` sections, 
enabling different tolerance values for scale-up and scale-down operations, 
which is particularly valuable since scale-up responsiveness is typically more critical than scale-down speed for handling traffic surges.
-->
### HPA 支持精細化自動擴縮控制容忍度設定

[KEP-4951](https://kep.k8s.io/4951) 引入了一項新特性，允許使用者在每個 HPA 上設定擴縮容忍度，
以覆蓋默認的叢集級 10% 容忍度設置，這一默認值對多樣化的工作負載來說往往過於粗略。
本次增強爲 HPA 的 `spec.behavior.scaleUp` 和 `spec.behavior.scaleDown` 部分新增了可選的 `tolerance` 字段，
使得擴容和縮容操作可以採用不同的容忍值。
這非常有用，因爲在應對突發流量時，擴容響應通常比縮容速度更爲關鍵。

<!--
Released as alpha in Kubernetes v1.33 behind the `HPAConfigurableTolerance` feature gate, this feature is expected to graduate to beta in v1.34.
This improvement helps to address scaling challenges with large deployments, where for scaling in,
a 10% tolerance might mean leaving hundreds of unnecessary Pods running.
Using the new, more flexible approach would enable workload-specific optimization for both
responsive and conservative scaling behaviors.
-->
此特性作爲 Alpha 特性，在 Kubernetes v1.33 中引入，並受 `HPAConfigurableTolerance` 特性門控控制。
預計將在 v1.34 中進階爲 Beta。
這項改進有助於解決大規模部署中的擴縮容難題，例如在縮容時，10% 的容忍度可能意味着會保留數百個不必要的 Pod。
通過這一更靈活的設定方式，使用者可以針對不同工作負載優化擴縮容行爲的響應性和保守性。

<!--
## Want to know more?
New features and deprecations are also announced in the Kubernetes release notes. 
We will formally announce what's new in [Kubernetes v1.34](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.34.md) as part of the CHANGELOG for that release.

The Kubernetes v1.34 release is planned for **Wednesday 27th August 2025**. Stay tuned for updates!
-->
## 想了解更多？

新特性和棄用項也會在 Kubernetes 發佈說明中公佈。我們將在
[Kubernetes v1.34](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.34.md)
變更日誌中正式宣佈新增內容。

Kubernetes v1.34 的計劃發佈時間爲 **2025 年 8 月 27 日（週三）**。敬請期待更多更新！

<!--
## Get involved
The simplest way to get involved with Kubernetes is to join one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. 
Have something you'd like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. 
Thank you for your continued feedback and support.
-->
## 參與其中

參與 Kubernetes 最簡單的方式就是加入與你興趣相關的[特別興趣小組（SIG）](https://github.com/kubernetes/community/blob/master/sig-list.md)。
有想要向社區分享的內容？歡迎在每週的[社區會議](https://github.com/kubernetes/community/tree/master/communication)上發聲，
或通過以下渠道參與討論。感謝你一如既往的反饋和支持！

<!--
* Follow us on Bluesky [@kubernetes.io](https://bsky.app/profile/kubernetes.io) for the latest updates
* Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
* Join the community on [Slack](http://slack.k8s.io/)
* Post questions (or answer questions) on [Server Fault](https://serverfault.com/questions/tagged/kubernetes) or [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
* Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* Read more about what's happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
* Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
-->
* 在 Bluesky 上關注我們 [@kubernetes.io](https://bsky.app/profile/kubernetes.io)，獲取最新動態
* 在 [Discuss](https://discuss.kubernetes.io/) 上參與社區討論
* 加入 [Slack 社區](http://slack.k8s.io/)
* 在 [Server Fault](https://serverfault.com/questions/tagged/kubernetes) 或
  [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes) 上提問或回答問題
* 分享你的 Kubernetes [使用故事](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* 閱讀 Kubernetes [官方博客](https://kubernetes.io/blog/)上的更多動態
* 瞭解 [Kubernetes 發佈團隊](https://github.com/kubernetes/sig-release/tree/master/release-team)的更多信息
