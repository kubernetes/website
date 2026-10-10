---
layout: blog
title: 'Kubernetes v1.34 抢先一览'
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
Kubernetes v1.34 将于 2025 年 8 月底发布。
本次发版不会移除或弃用任何特性，但包含了数量惊人的增强特性。
以下列出一些本次发版最令人兴奋的特性！

请注意，以下内容反映的是 v1.34 当前的开发状态，发布前可能会发生变更。

<!--
## Featured enhancements of Kubernetes v1.34

The following list highlights some of the notable enhancements likely to be included in the v1.34 release, 
but is not an exhaustive list of all planned changes. 
This is not a commitment and the release content is subject to change.
-->
## Kubernetes v1.34 的重点增强特性

以下列出了一些可能会包含在 v1.34 版本中的重要增强特性，
但这并不是所有计划更改的详尽列表。
这并不构成承诺，发布内容可能会发生变更。

<!--
### The core of DRA targets stable

[Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) (DRA) provides a flexible way to categorize, 
request, and use devices like GPUs or custom hardware in your Kubernetes cluster.
-->
### DRA 核心功能趋向稳定

[动态资源分配](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)（DRA）
提供了一种灵活的方式来分类、请求和使用集群中的 GPU 或定制硬件等设备。

<!--
Since the v1.30 release, DRA has been based around claiming devices using _structured parameters_ that are opaque to the core of Kubernetes.
The relevant enhancement proposal, [KEP-4381](https://kep.k8s.io/4381), took inspiration from dynamic provisioning for storage volumes.
DRA with structured parameters relies on a set of supporting API kinds: ResourceClaim, DeviceClass, ResourceClaimTemplate, 
and ResourceSlice API types under `resource.k8s.io`, while extending the `.spec` for Pods with a new `resourceClaims` field.
The core of DRA is targeting graduation to stable in Kubernetes v1.34.
-->
自 v1.30 版本起，DRA 已基于**结构化参数**来申领设备，这些参数对于 Kubernetes 核心是不可见的。
相关增强提案 [KEP-4381](https://kep.k8s.io/4381) 借鉴了存储卷动态制备的思路。
使用结构化参数的 DRA 依赖一组辅助 API 类别：包括 `resource.k8s.io` 下的
ResourceClaim、DeviceClass、ResourceClaimTemplate 和 ResourceSlice，
还在 Pod 的 `.spec` 中新增了 `resourceClaims` 字段。
DRA 的核心功能计划在 Kubernetes v1.34 中进阶至稳定阶段。

<!--
With DRA, device drivers and cluster admins define device classes that are available for use. 
Workloads can claim devices from a device class within device requests. 
Kubernetes allocates matching devices to specific claims and places the corresponding Pods on nodes that can access the allocated devices. 
This framework provides flexible device filtering using CEL, centralized device categorization, and simplified Pod requests, among other benefits.

Once this feature has graduated, the `resource.k8s.io/v1` APIs will be available by default.
-->
借助 DRA，设备驱动和集群管理员定义可用的设备类。
工作负载可以在设备请求中从设备类申领设备。
Kubernetes 为每个申领分配匹配的设备，并将相关 Pod 安排到可访问所分配设备的节点上。
这种框架提供了使用 CEL 的灵活设备筛选、集中式设备分类和简化的 Pod 请求等优点。

一旦此特性进入稳定阶段，`resource.k8s.io/v1` API 将默认可用。

<!--
### ServiceAccount tokens for image pull authentication

The [ServiceAccount](/docs/concepts/security/service-accounts/) token integration for `kubelet` credential providers is likely to reach beta and be enabled by default in Kubernetes v1.34. 
This allows the `kubelet` to use these tokens when pulling container images from registries that require authentication.

That support already exists as alpha, and is tracked as part of [KEP-4412](https://kep.k8s.io/4412).
-->
### 使用 ServiceAccount 令牌进行镜像拉取身份认证

ServiceAccount 令牌与 kubelet 凭据提供程序集成的特性预计将在 Kubernetes v1.34 中进入 Beta 阶段并默认启用。
这将允许 kubelet 在从需要身份认证的镜像仓库中拉取容器镜像时使用这些令牌。

此特性已作为 Alpha 存在，并由 [KEP-4412](https://kep.k8s.io/4412) 跟踪。

<!--
The existing alpha integration allows the `kubelet` to use short-lived, automatically rotated ServiceAccount tokens (that follow OIDC-compliant semantics) to authenticate to a container image registry. 
Each token is scoped to one associated Pod; the overall mechanism replaces the need for long-lived image pull Secrets.

Adopting this new approach reduces security risks, supports workload-level identity, and helps cut operational overhead. 
It brings image pull authentication closer to modern, identity-aware good practice.
-->
现有的 Alpha 集成允许 kubelet 使用生命期短、自动轮换的 ServiceAccount 令牌
（符合 OIDC 标准）来向容器镜像仓库进行身份认证。
每个令牌与一个 Pod 相关联；整个机制可替代长期存在的镜像拉取 Secret。

采用这一新方式可以降低安全风险、支持工作负载级身份，并减少运维负担。
它让镜像拉取认证更加贴合现代、具备身份感知的最佳实践。

<!--
### Pod replacement policy for Deployments

After a change to a [Deployment](/docs/concepts/workloads/controllers/deployment/), terminating pods may stay up for a considerable amount of time and may consume additional resources.
As part of [KEP-3973](https://kep.k8s.io/3973), the `.spec.podReplacementPolicy` field will be introduced (as alpha) for Deployments.

If your cluster has the feature enabled, you'll be able to select one of two policies:
-->
### Deployment 的 Pod 替换策略

对 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)
做出变更后，终止中的 Pod 可能会保留较长时间，并消耗额外资源。
作为 [KEP-3973](https://kep.k8s.io/3973) 的一部分，`.spec.podReplacementPolicy`
字段将以 Alpha 形式引入到 Deployment 中。

如果你的集群启用了此特性，你可以选择以下两种策略之一：

<!--
`TerminationStarted`
: Creates new pods as soon as old ones start terminating, resulting in faster rollouts at the cost of potentially higher resource consumption.

`TerminationComplete`
: Waits until old pods fully terminate before creating new ones, resulting in slower rollouts but ensuring controlled resource consumption.
-->
`TerminationStarted`  
: 一旦旧 Pod 开始终止，立即创建新 Pod，带来更快的上线速度，但资源消耗可能更高。

`TerminationComplete`  
: 等待旧 Pod 完全终止后才创建新 Pod，上线速度较慢，但资源消耗控制更好。

<!--
This feature makes Deployment behavior more predictable by letting you choose when new pods should be created during updates or scaling. 
It's beneficial when working in clusters with tight resource constraints or with workloads with long termination periods. 

It's expected to be available as an alpha feature and can be enabled using the `DeploymentPodReplacementPolicy` and `DeploymentReplicaSetTerminatingReplicas` feature gates in the API server and kube-controller-manager.
-->
此特性通过让你选择更新或扩缩容期间何时创建新 Pod，从而使 Deployment 行为更可控。
在资源受限的集群或终止时间较长的工作负载中尤为有用。

预计此特性将作为 Alpha 特性推出，并可通过在 API 服务器和 kube-controller-manager 中启用
`DeploymentPodReplacementPolicy` 和 `DeploymentReplicaSetTerminatingReplicas` 特性门控启用。

<!--
### Production-ready tracing for `kubelet` and API Server

To address the longstanding challenge of debugging node-level issues by correlating disconnected logs, 
[KEP-2831](https://kep.k8s.io/2831) provides deep, contextual insights into the `kubelet`.
-->
### kubelet 和 API 服务器的生产级追踪特性

为了解决通过日志关联进行节点级调试的长期难题，
[KEP-2831](https://kep.k8s.io/2831) 为 kubelet 提供了深度上下文可视化能力。

<!--
This feature instruments critical `kubelet` operations, particularly its gRPC calls to the Container Runtime Interface (CRI), using the vendor-agnostic OpenTelemetry standard. 
It allows operators to visualize the entire lifecycle of events (for example: a Pod startup) to pinpoint sources of latency and errors. 
Its most powerful aspect is the propagation of trace context; the `kubelet` passes a trace ID with its requests to the container runtime, enabling runtimes to link their own spans.
-->
此特性使用供应商中立的 OpenTelemetry 标准，为关键的 kubelet 操作（特别是其对容器运行时接口的 gRPC 调用）做了插桩。
它使运维人员能够可视化整个事件生命周期（例如：Pod 启动）以定位延迟或错误来源。
其强大之处在于传播链路上下文：kubelet 在向容器运行时发送请求时附带链路 ID，使运行时能够链接自身的 Span。

<!--
This effort is complemented by a parallel enhancement, [KEP-647](https://kep.k8s.io/647), which brings the same tracing capabilities to the Kubernetes API server. 
Together, these enhancements provide a more unified, end-to-end view of events, simplifying the process of pinpointing latency and errors from the control plane down to the node. 
These features have matured through the official Kubernetes release process. 
[KEP-2831](https://kep.k8s.io/2831) was introduced as an alpha feature in v1.25, while [KEP-647](https://kep.k8s.io/647) debuted as alpha in v1.22. 
Both enhancements were promoted to beta together in the v1.27 release. 
Looking forward, Kubelet Tracing ([KEP-2831](https://kep.k8s.io/2831)) and API Server Tracing ([KEP-647](https://kep.k8s.io/647)) are now targeting graduation to stable in the upcoming v1.34 release.
-->
这一工作得到了另一个增强提案 [KEP-647](https://kep.k8s.io/647) 的配合，
后者为 Kubernetes API 服务器引入了相同的链路追踪能力。
两者结合提供了从控制面到节点的端到端事件视图，极大简化了定位延迟和错误的过程。
这些特性已在 Kubernetes 正式版本发布流程中逐渐成熟：  
[KEP-2831](https://kep.k8s.io/2831) 在 v1.25 中以 Alpha 发布，
[KEP-647](https://kep.k8s.io/647) 在 v1.22 中首次作为 Alpha 发布，
这两个特性在 v1.27 中一起进阶至 Beta。
展望未来，kubelet 追踪（[KEP-2831](https://kep.k8s.io/2831)）和
API 服务器追踪（[KEP-647](https://kep.k8s.io/647)）计划在 v1.34 中进入稳定阶段。

<!--
### `PreferSameZone` and `PreferSameNode` traffic distribution for Services

The `spec.trafficDistribution` field within a Kubernetes [Service](/docs/concepts/services-networking/service/) allows users to express preferences for how traffic should be routed to Service endpoints. 
-->
### Service 的 `PreferSameZone` 和 `PreferSameNode` 流量分发

Kubernetes [Service](/zh-cn/docs/concepts/services-networking/service/) 的
`spec.trafficDistribution` 字段允许用户表达服务端点的流量路由偏好。

<!--
[KEP-3015](https://kep.k8s.io/3015) deprecates `PreferClose` and introduces two additional values: `PreferSameZone` and `PreferSameNode`. 
`PreferSameZone` is equivalent to the current `PreferClose`. 
`PreferSameNode` prioritizes sending traffic to endpoints on the same node as the client.  

This feature was introduced in v1.33 behind the `PreferSameTrafficDistribution` feature gate. 
It is targeting graduation to beta in v1.34 with its feature gate enabled by default.
-->
[KEP-3015](https://kep.k8s.io/3015) 弃用了 `PreferClose`，并引入了两个新值：`PreferSameZone` 和 `PreferSameNode`。
`PreferSameZone` 等价于当前的 `PreferClose`；  
`PreferSameNode` 优先将流量发送至与客户端位于同一节点的端点。

此特性在 v1.33 中引入，受 `PreferSameTrafficDistribution` 特性门控控制。
v1.34 中此特性预计将进入 Beta，并默认启用。

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

KYAML 是为 Kubernetes 设计的更安全、更少歧义的 YAML 子集。
无论你使用哪个版本的 Kubernetes，都可以使用 KYAML 编写清单和 Helm 模板。
你可以编写 KYAML 并将其作为输入传递给**任意**版本的 kubectl，因为所有 KYAML 文件都是合法的 YAML。
在 kubectl v1.34 中，你还可以请求以 KYAML 格式输出（如：`kubectl get -o kyaml …`）。
当然，如果你愿意，也可以继续使用 JSON 或 YAML 格式输出。

<!--
KYAML addresses specific challenges with both YAML and JSON. 
YAML's significant whitespace requires careful attention to indentation and nesting, 
while its optional string-quoting can lead to unexpected type coercion (for example: ["The Norway Bug"](https://hitchdev.com/strictyaml/why/implicit-typing-removed/)). 
Meanwhile, JSON lacks comment support and has strict requirements for trailing commas and quoted keys.  

[KEP-5295](https://kep.k8s.io/5295) introduces KYAML, which tries to address the most significant problems by:
-->
KYAML 解决了 YAML 和 JSON 的一些具体问题：  
YAML 对缩进的敏感性需要你注意空格和嵌套，
而其可选的字符串引号可能导致意外类型转换
（参见 [“挪威 bug”](https://hitchdev.com/strictyaml/why/implicit-typing-removed/)）。
与此同时，JSON 不支持注释，且对尾逗号和键的引号有严格要求。

[KEP-5295](https://kep.k8s.io/5295) 引入了 KYAML，尝试解决这些主要问题：

<!--
* Always double-quoting value strings

* Leaving keys unquoted unless they are potentially ambiguous

* Always using `{}` for mappings (associative arrays)

* Always using `[]` for lists
-->
* 所有值字符串始终使用英文双引号

* 键不加英文引号，除非可能产生歧义

* 所有映射使用 `{}` 表示（即关联数组）

* 所有列表使用 `[]` 表示

<!--
This might sound a lot like JSON, because it is! But unlike JSON, KYAML supports comments, allows trailing commas, and doesn't require quoted keys.

We're hoping to see KYAML introduced as a new output format for `kubectl` v1.34.
As with all these features, none of these changes are 100% confirmed; watch this space!
-->
这听起来像 JSON？确实如此！但与 JSON 不同的是，KYAML 支持注释、允许尾逗号，且不强制键加引号。

我们希望在 kubectl v1.34 中将 KYAML 引入为一种新的输出格式。
如同其他特性一样，这些变更尚未百分百确定，敬请关注！

<!--
As a format, KYAML is and will remain a **strict subset of YAML**, ensuring that any compliant YAML parser can parse KYAML documents. 
Kubernetes does not require you to provide input specifically formatted as KYAML, and we have no plans to change that.
-->
KYAML 作为一种格式，是 YAML 的**严格子集**，
这确保任何符合规范的 YAML 解析器都能解析 KYAML 文档。
Kubernetes 并不要求你必须提供 KYAML 格式的输入，也没有这方面的计划。

<!--
### Fine-grained autoscaling control with HPA configurable tolerance

[KEP-4951](https://kep.k8s.io/4951) introduces a new feature that allows users to configure autoscaling tolerance on a per-HPA basis, 
overriding the default cluster-wide 10% tolerance setting that often proves too coarse-grained for diverse workloads. 
The enhancement adds an optional `tolerance` field to the HPA's `spec.behavior.scaleUp` and `spec.behavior.scaleDown` sections, 
enabling different tolerance values for scale-up and scale-down operations, 
which is particularly valuable since scale-up responsiveness is typically more critical than scale-down speed for handling traffic surges.
-->
### HPA 支持精细化自动扩缩控制容忍度配置

[KEP-4951](https://kep.k8s.io/4951) 引入了一项新特性，允许用户在每个 HPA 上配置扩缩容忍度，
以覆盖默认的集群级 10% 容忍度设置，这一默认值对多样化的工作负载来说往往过于粗略。
本次增强为 HPA 的 `spec.behavior.scaleUp` 和 `spec.behavior.scaleDown` 部分新增了可选的 `tolerance` 字段，
使得扩容和缩容操作可以采用不同的容忍值。
这非常有用，因为在应对突发流量时，扩容响应通常比缩容速度更为关键。

<!--
Released as alpha in Kubernetes v1.33 behind the `HPAConfigurableTolerance` feature gate, this feature is expected to graduate to beta in v1.34.
This improvement helps to address scaling challenges with large deployments, where for scaling in,
a 10% tolerance might mean leaving hundreds of unnecessary Pods running.
Using the new, more flexible approach would enable workload-specific optimization for both
responsive and conservative scaling behaviors.
-->
此特性作为 Alpha 特性，在 Kubernetes v1.33 中引入，并受 `HPAConfigurableTolerance` 特性门控控制。
预计将在 v1.34 中进阶为 Beta。
这项改进有助于解决大规模部署中的扩缩容难题，例如在缩容时，10% 的容忍度可能意味着会保留数百个不必要的 Pod。
通过这一更灵活的配置方式，用户可以针对不同工作负载优化扩缩容行为的响应性和保守性。

<!--
## Want to know more?
New features and deprecations are also announced in the Kubernetes release notes. 
We will formally announce what's new in [Kubernetes v1.34](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.34.md) as part of the CHANGELOG for that release.

The Kubernetes v1.34 release is planned for **Wednesday 27th August 2025**. Stay tuned for updates!
-->
## 想了解更多？

新特性和弃用项也会在 Kubernetes 发布说明中公布。我们将在
[Kubernetes v1.34](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.34.md)
变更日志中正式宣布新增内容。

Kubernetes v1.34 的计划发布时间为 **2025 年 8 月 27 日（周三）**。敬请期待更多更新！

<!--
## Get involved
The simplest way to get involved with Kubernetes is to join one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. 
Have something you'd like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. 
Thank you for your continued feedback and support.
-->
## 参与其中

参与 Kubernetes 最简单的方式就是加入与你兴趣相关的[特别兴趣小组（SIG）](https://github.com/kubernetes/community/blob/master/sig-list.md)。
有想要向社区分享的内容？欢迎在每周的[社区会议](https://github.com/kubernetes/community/tree/master/communication)上发声，
或通过以下渠道参与讨论。感谢你一如既往的反馈和支持！

<!--
* Follow us on Bluesky [@kubernetes.io](https://bsky.app/profile/kubernetes.io) for the latest updates
* Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
* Join the community on [Slack](http://slack.k8s.io/)
* Post questions (or answer questions) on [Server Fault](https://serverfault.com/questions/tagged/kubernetes) or [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
* Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* Read more about what's happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
* Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
-->
* 在 Bluesky 上关注我们 [@kubernetes.io](https://bsky.app/profile/kubernetes.io)，获取最新动态
* 在 [Discuss](https://discuss.kubernetes.io/) 上参与社区讨论
* 加入 [Slack 社区](http://slack.k8s.io/)
* 在 [Server Fault](https://serverfault.com/questions/tagged/kubernetes) 或
  [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes) 上提问或回答问题
* 分享你的 Kubernetes [使用故事](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* 阅读 Kubernetes [官方博客](https://kubernetes.io/blog/)上的更多动态
* 了解 [Kubernetes 发布团队](https://github.com/kubernetes/sig-release/tree/master/release-team)的更多信息
