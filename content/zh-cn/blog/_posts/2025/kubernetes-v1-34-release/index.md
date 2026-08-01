---
layout: blog
title: "Kubernetes v1.34：风与意志（O' WaW）"
date: 2025-08-27T10:30:00-08:00
evergreen: true
slug: kubernetes-v1-34-release
release_announcement:
  minor_version: "1.34"
author: >
  [Kubernetes v1.34 发布团队](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.34/release-team.md)
---
<!--
layout: blog
title: "Kubernetes v1.34: Of Wind & Will (O' WaW)"
date: 2025-08-27T10:30:00-08:00
evergreen: true
slug: kubernetes-v1-34-release
release_announcement:
  minor_version: "1.34"
author: >
  [Kubernetes v1.34 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.34/release-team.md)
-->

<!--
**Editors:** Agustina Barbetta, Alejandro Josue Leon Bellido, Graziano Casto, Melony Qin, Dipesh Rawat
-->
**编辑**：Agustina Barbetta、Alejandro Josue Leon Bellido、Graziano Casto、Melony Qin、Dipesh Rawat

<!--
Similar to previous releases, the release of Kubernetes v1.34 introduces new stable, beta, and alpha features. The consistent delivery of high-quality releases underscores the strength of our development cycle and the vibrant support from our community.

This release consists of 58 enhancements. Of those enhancements, 23 have graduated to Stable, 22 have entered Beta, and 13 have entered Alpha.

There are also some [deprecations and removals](#deprecations-and-removals) in this release; make sure to read about those.
-->
与之前版本类似，Kubernetes v1.34 的发布引入了新的稳定（GA）、Beta 和 Alpha 特性。
持续交付高质量版本，体现了我们开发周期的韧性，也离不开社区的热情支持。

此版本包含 58 项增强，其中 23 项晋升为稳定版，22 项进入 Beta，13 项进入 Alpha。

本次发布还包含一些[弃用与移除](#deprecations-and-removals)内容，请务必阅读相关说明。

<!--
## Release theme and logo
-->
## 发布主题与徽标   {#release-theme-and-logo}

{{< figure
  src="k8s-v1.34.png"
  alt="Kubernetes v1.34 徽标：三只熊驾驶一艘木船在海上航行，船帆上有爪印与舵轮标志，海风吹拂。"
  class="release-logo"
>}}

<!--
A release powered by the wind around us — and the will within us.

Every release cycle, we inherit winds that we don't really control — the state of our tooling, documentation, and the historical quirks of our project. Sometimes these winds fill our sails, sometimes they push us sideways or die down.

What keeps Kubernetes moving isn't the perfect winds, but the will of our sailors who adjust the sails, man the helm, chart the courses and keep the ship steady. The release happens not because conditions are always ideal, but because of the people who build it, the people who release it, and the bears, cats, dogs, wizards, and curious minds who keep Kubernetes sailing strong — no matter which way the wind blows.

This release, **Of Wind & Will (O' WaW)**, honors the winds that have shaped us, and the will that propels us forward.
-->
受我们周围的风，以及我们内心意志驱动的一个版本发布。

在每一个发布周期中，我们都会继承一些自己其实无法掌控的“风”：
工具链的现状、文档的状态，以及项目历史留下的种种特殊包袱。
有时这些风会鼓满船帆，助我们前行；有时它们会把我们吹偏，甚至归于沉寂。

真正让 Kubernetes 持续前进的，不是完美的风，而是那些“水手”的意志。
他们调整风帆、掌舵定向、规划航线，并让整艘船保持稳定。
发布之所以能够达成，不是因为条件始终理想，而是因为那些建设它的人、
发布它的人，以及那些无论风向如何都让 Kubernetes 稳健远航的熊、猫、狗、
巫师与充满好奇心的人们。

本次发布 **Of Wind & Will (O' WaW)**，致敬塑造我们的风，以及推动我们继续前行的意志。

<sub>^ 你问为什么是熊？继续猜吧！</sub>

<!--
## Spotlight on key updates

Kubernetes v1.34 is packed with new features and improvements. Here are a few select updates the Release Team would like to highlight!
-->
## 重点更新速览   {#spotlight-on-key-updates}

Kubernetes v1.34 带来了大量新特性与改进。下面是发布团队希望重点介绍的几个更新！

<!--
### Stable: The core of DRA is GA
-->
### 稳定（GA）阶段：DRA 核心能力正式发布   {#stable-the-core-of-dra-is-ga}

[动态资源分配](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)（Dynamic Resource Allocation，DRA）
支持以更强大的方式选择、分配、共享和配置 GPU、TPU、NIC 及其他设备。

自 v1.30 起，DRA 就围绕“结构化参数（structured parameters）”来声明设备请求展开，
这些参数对 Kubernetes 核心本身而言是透明的。
这一增强借鉴了存储卷动态制备（dynamic provisioning）的思路。
基于结构化参数的 DRA 依赖一组位于 `resource.k8s.io` 下的配套 API 类型：
`ResourceClaim`、`DeviceClass`、`ResourceClaimTemplate` 和 `ResourceSlice`，
同时还为 Pod 的 `.spec` 增加了新的 `resourceClaims` 字段。
`resource.k8s.io/v1` API 已晋升为稳定版，并默认可用。

此项工作是 [KEP #4381](https://kep.k8s.io/4381) 的一部分，由 WG Device Management 牵头完成。

<!--
### Beta: Projected ServiceAccount tokens for `kubelet` image credential providers
-->
### Beta：用于 `kubelet` 镜像凭据提供器的投射式 ServiceAccount 令牌   {#beta-projected-serviceaccount-tokens-for-kubelet-image-credential-providers}

`kubelet` 的凭据提供器常用于拉取私有容器镜像，但传统上它们依赖于保存在节点或集群中的长期 Secret。
这种方式会增加安全风险和管理负担，因为这些凭据不与具体工作负载绑定，也不会自动轮换。

为了解决这一问题，`kubelet` 现在可以请求短生命周期、限定受众（audience-bound）的
ServiceAccount 令牌来向镜像仓库进行认证。
这样一来，镜像拉取授权就可以基于 Pod 自身的身份，而不再依赖节点级别的凭据。

这项功能的主要收益是显著增强安全性。
它消除了镜像拉取对长期 Secret 的依赖，缩小了攻击面，也简化了管理员和开发者的凭据管理工作。

此项工作是 [KEP #4412](https://kep.k8s.io/4412) 的一部分，由 SIG Auth 和 SIG Node 牵头完成。

<!--
### Alpha: Support for KYAML, a Kubernetes dialect of YAML
-->
### Alpha：支持 KYAML，这是一种面向 Kubernetes 的 YAML 方言   {#alpha-support-for-kyaml-a-kubernetes-dialect-of-yaml}

KYAML 致力于成为一种更安全、歧义更少的 YAML 子集，并且是专门为 Kubernetes 设计的。
从 Kubernetes v1.34 开始，无论你使用哪个版本的 Kubernetes，
都可以将 KYAML 作为 `kubectl` 的一种新输出格式。

KYAML 针对 YAML 和 JSON 各自的一些痛点进行了改进。
YAML 对空白与缩进十分敏感，而其字符串是否加引号又是可选的，
这可能导致意外的类型强制转换（例如 [The Norway Bug](https://hitchdev.com/strictyaml/why/implicit-typing-removed/)）。
与此同时，JSON 不支持注释，并且对尾随逗号和带引号的键有严格要求。

由于所有 KYAML 文件也都是合法的 YAML 文件，所以你可以编写 KYAML，
并将其作为输入传给任意版本的 `kubectl`。
在 `kubectl` v1.34 中，你还可以通过设置环境变量 `KUBECTL_KYAML=true`
来[请求 KYAML 输出](/zh-cn/docs/reference/kubectl/#syntax-1)（例如 `kubectl get -o kyaml ...`）。
如果你更偏好，也依然可以继续请求 JSON 或 YAML 输出。

此项工作是 [KEP #5295](https://kep.k8s.io/5295) 的一部分，由 SIG CLI 牵头完成。

<!--
## Features graduating to Stable

*This is a selection of some of the improvements that are now stable following the v1.34 release.*
-->
## 进入稳定（GA）阶段的特性   {#features-graduating-to-stable}

**以下列出 v1.34 发布后进入稳定（GA）阶段的一些改进。**

<!--
### Delayed creation of Job’s replacement Pods
-->
### 延迟创建 Job 的替代 Pod   {#delayed-creation-of-jobs-replacement-pods}

默认情况下，当某个 Pod 开始终止时，Job 控制器会立即创建替代 Pod，
这会导致新旧两个 Pod 同时运行。
在资源受限的集群中，这种行为可能引发资源争用：
新的替代 Pod 可能要等到原 Pod 完全终止后才能找到可用节点，
同时也可能触发不必要的集群自动扩容。
此外，TensorFlow 和 [JAX](https://jax.readthedocs.io/en/latest/) 等机器学习框架往往要求同一索引一次只能有一个 Pod 运行，
因此并行替换会带来问题。

这一特性为 Job 引入了 `.spec.podReplacementPolicy`。
你现在可以选择仅在原 Pod 已彻底终止（即 `.status.phase: Failed`）后再创建替代 Pod。
要启用这一行为，可设置 `.spec.podReplacementPolicy: Failed`。
该特性在 v1.28 作为 Alpha 引入，并已于 v1.34 晋升为稳定版。

此项工作是 [KEP #3939](https://kep.k8s.io/3939) 的一部分，由 SIG Apps 牵头完成。

<!--
### Recovery from volume expansion failure
-->
### 从卷扩容失败中恢复   {#recovery-from-volume-expansion-failure}

该特性允许用户在底层存储提供商不支持扩容时，取消当前的卷扩容操作，
然后改用较小的值重试，从而提高扩容成功的机会。
该特性在 v1.23 作为 Alpha 引入，并于 v1.34 晋升为稳定版。

此项工作是 [KEP #1790](https://kep.k8s.io/1790) 的一部分，由 SIG Storage 牵头完成。

<!--
### VolumeAttributesClass for volume modification
-->
### 用于卷修改的 VolumeAttributesClass   {#volumeattributesclass-for-volume-modification}

[VolumeAttributesClass](/zh-cn/docs/concepts/storage/volume-attributes-classes/)
已在 v1.34 晋升为稳定版。
VolumeAttributesClass 是一种通用、原生于 Kubernetes 的 API，
可用于修改卷参数，例如预配置的 IO 能力。
在存储提供商支持的前提下，它使工作负载能够在线对卷进行纵向扩展，
以平衡成本和性能。

与 Kubernetes 中所有新的卷特性一样，该 API 通过
[容器存储接口（CSI）](https://kubernetes-csi.github.io/docs/)
实现。你的 CSI 驱动需要支持新的 `ModifyVolume` API，
这也是该特性在 CSI 侧对应的能力。

此项工作是 [KEP #3751](https://kep.k8s.io/3751) 的一部分，由 SIG Storage 牵头完成。

<!--
### Structured authentication configuration
-->
### 结构化认证配置   {#structured-authentication-configuration}

Kubernetes v1.29 引入了一种新的配置文件格式，用于管理 API Server 的客户端认证，
替代以往依赖大量命令行选项的方式。
[`AuthenticationConfiguration`](/zh-cn/docs/reference/access-authn-authz/authentication/#using-authentication-configuration)
允许管理员同时支持多个 JWT 认证器、CEL 表达式校验以及动态重载。

这一变更显著提升了集群认证配置的可管理性与可审计性，并在 v1.34 晋升为稳定版。

此项工作是 [KEP #3331](https://kep.k8s.io/3331) 的一部分，由 SIG Auth 牵头完成。

<!--
### Finer-grained authorization based on selectors
-->
### 基于选择器的更细粒度授权   {#finer-grained-authorization-based-on-selectors}

Kubernetes 的授权器（包括 Webhook 授权器和内置节点授权器）现在可以基于请求中的字段选择器
（field selectors）和标签选择器（label selectors）作出授权决策。
当你发送带选择器的 **list**、**watch** 或 **deletecollection** 请求时，
授权层可以结合这部分上下文来评估访问权限。

例如，你现在可以编写一条授权策略，只允许列出绑定到特定 `.spec.nodeName` 的 Pod。
客户端（例如某个节点上的 kubelet）必须显式带上策略所要求的字段选择器，
否则请求就会被拒绝。
这一变化使得在按节点隔离、定制多租户等场景中，更细粒度地落实最小权限原则成为可能。

此项工作是 [KEP #4601](https://kep.k8s.io/4601) 的一部分，由 SIG Auth 牵头完成。

<!--
### Restrict anonymous requests with fine-grained controls
-->
### 用更细粒度的控制限制匿名请求   {#restrict-anonymous-requests-with-fine-grained-controls}

与其简单地全开或全关匿名访问，现在你可以配置一份严格的端点白名单，
只允许未认证请求访问特定端点。
对于依赖匿名访问 `/healthz`、`/readyz` 或 `/livez` 这类健康检查与引导端点的集群来说，
这是一种更安全的替代方案。

借助这一特性，即使发生意外的 RBAC 配置错误，也能避免匿名用户获得过宽权限，
同时又不必修改外部探针或初始化工具。

此项工作是 [KEP #4633](https://kep.k8s.io/4633) 的一部分，由 SIG Auth 牵头完成。

<!--
### More efficient requeueing through plugin-specific callbacks
-->
### 通过插件专属回调实现更高效的重新入队   {#more-efficient-requeueing-through-plugin-specific-callbacks}

`kube-scheduler` 现在可以更准确地判断，何时应该重试调度此前不可调度的 Pod。
现在，每个调度插件都可以注册回调函数，用于告诉调度器：
某个传入的集群事件是否有可能让某个被拒绝的 Pod 重新变得可调度。

这减少了不必要的重试，并提升了整体调度吞吐，特别是在使用动态资源分配的集群中。
该特性还允许某些插件在安全的情况下跳过通常的退避延迟，从而让特定场景下的调度更快。

此项工作是 [KEP #4247](https://kep.k8s.io/4247) 的一部分，由 SIG Scheduling 牵头完成。

<!--
### Ordered Namespace deletion
-->
### 有序的命名空间删除   {#ordered-namespace-deletion}

近乎随机的资源删除顺序可能造成安全缺口或意外行为，
例如关联的 NetworkPolicy 已被删除，但 Pod 仍然残留。
这一改进为 Kubernetes [命名空间](/zh-cn/docs/concepts/overview/working-with-objects/namespaces/)
引入了更有结构的删除流程，以确保资源移除更加安全且确定。
通过强制执行尊重逻辑与安全依赖关系的删除顺序，该方案能够确保 Pod 在其他资源之前被移除。

该特性在 v1.33 引入，并于 v1.34 晋升为稳定版。
这一升级提升了安全性和可靠性，降低了非确定性删除带来的风险，
其中包括 [CVE-2024-7598](https://github.com/advisories/GHSA-r56h-j38w-hrqq) 所描述的漏洞。

此项工作是 [KEP #5080](https://kep.k8s.io/5080) 的一部分，由 SIG API Machinery 牵头完成。

<!--
### Streaming **list** responses
-->
### 流式 **list** 响应   {#streaming-list-responses}

过去，在 Kubernetes 中处理大规模 **list** 响应一直是一项可扩展性挑战。
当客户端请求庞大的资源列表（例如成千上万个 Pod 或自定义资源）时，
API Server 需要先把整组对象序列化到一个巨大的内存缓冲区中，再把结果发送出去。
这一过程会带来明显的内存压力，并可能导致性能下降，进而影响集群整体稳定性。

为了解决这一限制，Kubernetes 为集合类型（list 响应）引入了流式编码机制。
对于 JSON 和 Kubernetes Protobuf 响应格式，这一机制默认启用，并且对应的特性门控已经稳定。
这样做的主要收益，是避免在 API Server 上分配巨大的连续内存，
从而获得更小、更可预测的内存占用。
因此，集群在大规模环境下会更加稳健且高效，
尤其是在频繁请求大体量资源列表的场景中。

此项工作是 [KEP #5116](https://kep.k8s.io/5116) 的一部分，由 SIG API Machinery 牵头完成。

<!--
### Resilient watch cache initialization
-->
### 更稳健的 Watch Cache 初始化   {#resilient-watch-cache-initialization}

Watch Cache 是 `kube-apiserver` 内部的一层缓存，
用于维护 etcd 中集群状态的最终一致性副本。
过去，在 `kube-apiserver` 启动期间，或者需要重新初始化 Watch Cache 时，
这一过程可能会出现问题。

为了解决这些问题，Watch Cache 的初始化流程如今具备了更强的抗失败能力，
从而提高了控制平面的稳健性，并确保控制器与客户端可以可靠地建立 watch。
这一改进在 v1.31 作为 Beta 引入，并已于 v1.34 晋升为稳定版。

此项工作是 [KEP #4568](https://kep.k8s.io/4568) 的一部分，由 SIG API Machinery 和 SIG Scalability 牵头完成。

<!--
### Relaxing DNS search path validation
-->
### 放宽 DNS 搜索路径校验   {#relaxing-dns-search-path-validation}

此前，Kubernetes 对 Pod 的 DNS `search` 路径执行严格校验，
这在复杂或遗留网络环境中经常造成集成困难。
某些组织基础设施所必需的配置可能因此被阻止，管理员不得不采用繁琐的绕行方案。

为了解决这一问题，放宽 DNS 校验的能力在 v1.32 作为 Alpha 引入，
并于 v1.34 晋升为稳定版。
一个常见用法是：某些 Pod 既要访问 Kubernetes 内部服务，也要访问外部域名。
通过在 Pod 的 `.spec.dnsConfig.searches` 列表中将单独一个点（`.`）设为首项，
管理员可以阻止系统解析器在外部查询时附加集群内部搜索域。
这样可以避免对外部主机名向集群内部 DNS 服务器发起多余请求，
提升效率，并减少潜在的解析错误。

此项工作是 [KEP #4427](https://kep.k8s.io/4427) 的一部分，由 SIG Network 牵头完成。

<!--
### Support for Direct Service Return (DSR) in Windows `kube-proxy`
-->
### Windows `kube-proxy` 中对 Direct Service Return（DSR）的支持   {#support-for-direct-service-return-dsr-in-windows-kube-proxy}

DSR 可以提升性能：当返回流量原本经由负载均衡器路由时，
它允许返回流量绕过负载均衡器，直接回送给客户端，
从而减轻负载均衡器压力并降低整体延迟。
关于 Windows 上的 DSR，可参见
[Direct Server Return (DSR) in a nutshell](https://techcommunity.microsoft.com/blog/networkingblog/direct-server-return-dsr-in-a-nutshell/693710)。

该特性最初于 v1.14 引入，并已于 v1.34 晋升为稳定版。

此项工作是 [KEP #5100](https://kep.k8s.io/5100) 的一部分，由 SIG Windows 牵头完成。

<!--
### Sleep action for Container lifecycle hooks
-->
### 容器生命周期钩子的 Sleep 动作   {#sleep-action-for-container-lifecycle-hooks}

为容器的 `PreStop` 与 `PostStart` 生命周期钩子引入 Sleep 动作，
提供了一种直接的方式来管理优雅关闭，并改善整体容器生命周期管理。

Sleep 动作允许容器在启动后或终止前暂停指定时长。
如果传入负数或零值的休眠时长，则会立即返回，相当于 no-op。
Sleep 动作在 Kubernetes v1.29 中引入，对零值的支持则在 v1.32 中加入。
这两项能力均已于 v1.34 晋升为稳定版。

此项工作是 [KEP #3960](https://kep.k8s.io/3960) 和 [KEP #4818](https://kep.k8s.io/4818) 的一部分，由 SIG Node 牵头完成。

<!--
### Linux node swap support
-->
### Linux 节点 Swap 支持   {#linux-node-swap-support}

过去，Kubernetes 缺乏对 Swap 的支持，这会导致工作负载稳定性受损：
当节点面临内存压力时，系统往往不得不粗暴地终止进程。
这尤其影响那些占用大量但访问频率不高的内存型应用，也使得资源管理难以更加平滑。

为了解决这一问题，Kubernetes 在 v1.22 中引入了按节点配置的 Swap 支持，
并经历了 Alpha 与 Beta 阶段，最终于 v1.34 晋升为稳定版。
其主要模式 `LimitedSwap` 允许 Pod 在原有内存限制内使用 Swap。
默认情况下，`kubelet` 使用 `NoSwap` 模式，也就是 Kubernetes 工作负载不可使用 Swap。

这一特性提升了工作负载稳定性，并使资源利用更高效。
它让集群能够承载更广泛类型的应用，尤其适用于资源受限环境；
当然，管理员也需要权衡开启 Swap 可能带来的性能影响。

此项工作是 [KEP #2400](https://kep.k8s.io/2400) 的一部分，由 SIG Node 牵头完成。

<!--
### Allow special characters in environment variables
-->
### 允许环境变量名中使用特殊字符   {#allow-special-characters-in-environment-variables}

Kubernetes 现已放宽环境变量校验规则，
允许变量名中使用几乎所有可打印 ASCII 字符，唯一例外是 `=`。
这一变化支持了需要在变量名中使用非常规字符的场景，
例如 .NET Core 这类使用 `:` 来表达嵌套配置键的框架。

放宽后的校验规则既适用于 Pod 规约中直接声明的环境变量，
也适用于通过 `envFrom` 从 ConfigMap 与 Secret 中注入的环境变量。

此项工作是 [KEP #4369](https://kep.k8s.io/4369) 的一部分，由 SIG Node 牵头完成。

<!--
### Taint management is separated from Node lifecycle
-->
### 污点管理与节点生命周期解耦   {#taint-management-is-separated-from-node-lifecycle}

过去，`TaintManager` 根据节点状态（例如 `NotReady`、`Unreachable`）为节点施加 `NoSchedule`
与 `NoExecute` 污点的逻辑，与节点生命周期控制器强耦合。
这种耦合使代码更难维护与测试，也限制了基于污点的驱逐机制的灵活性。

这一 KEP 将 `TaintManager` 重构为 Kubernetes 控制器管理器中的独立控制器。
这是一项面向内部架构的改进，旨在提升代码模块化与可维护性。
它使得基于污点的驱逐逻辑能够被独立演进与测试，
但对用户如何使用污点本身没有直接影响。

此项工作是 [KEP #3902](https://kep.k8s.io/3902) 的一部分，由 SIG Scheduling 和 SIG Node 牵头完成。

<!--
## New features in Beta

*This is a selection of some of the improvements that are now beta following the v1.34 release.*
-->
## Beta 中的新特性   {#new-features-in-beta}

**以下列出 v1.34 发布后进入 Beta 阶段的一些改进。**

<!--
### Pod-level resource requests and limits
-->
### Pod 级别的资源请求与限制   {#pod-level-resource-requests-and-limits}

为多容器 Pod 定义资源需求一直比较棘手，因为过去请求与限制只能逐容器设置。
这迫使开发者要么为每个容器预留过量资源，要么非常细碎地拆分总资源预算，
导致配置复杂且经常造成资源分配低效。

为简化这一问题，Kubernetes 引入了在 Pod 级别声明资源请求与限制的能力。
开发者现在可以为整个 Pod 定义一个总体资源预算，
再由 Pod 内各个容器共享使用。
该特性在 v1.32 作为 Alpha 引入，并于 v1.34 晋升为 Beta；
现在 HPA 也已支持 Pod 级资源规格。

其主要收益在于，以更直观、更直接的方式管理多容器 Pod 的资源。
它确保所有容器合计使用的资源不会超过 Pod 设定的上限，
从而带来更合理的资源规划、更准确的调度以及更高效的集群资源利用。

此项工作是 [KEP #2837](https://kep.k8s.io/2837) 的一部分，由 SIG Scheduling 和 SIG Autoscaling 牵头完成。

<!--
### `.kuberc` file for `kubectl` user preferences
-->
### 用于 `kubectl` 用户偏好的 `.kuberc` 文件   {#kuberc-file-for-kubectl-user-preferences}

`.kuberc` 配置文件允许你为 `kubectl` 定义偏好项，例如默认选项和命令别名。
与 kubeconfig 不同，`.kuberc` 不包含集群信息、用户名或密码。
该特性在 v1.33 作为 Alpha 引入，当时由环境变量 `KUBECTL_KUBERC` 控制；
它已于 v1.34 晋升为 Beta，并默认启用。

此项工作是 [KEP #3104](https://kep.k8s.io/3104) 的一部分，由 SIG CLI 牵头完成。

<!--
### External ServiceAccount token signing
-->
### 外部 ServiceAccount 令牌签名   {#external-serviceaccount-token-signing}

传统上，Kubernetes 使用在 `kube-apiserver` 启动时从磁盘加载的静态签名密钥来管理
ServiceAccount 令牌。
这一特性引入了 `ExternalJWTSigner` gRPC 服务，
支持在进程外完成签名，使 Kubernetes 发行版能够集成外部密钥管理方案
（例如 HSM 或云 KMS），以取代基于静态磁盘密钥的 ServiceAccount 令牌签名。

这项外部 JWT 签名能力在 v1.32 作为 Alpha 引入，并于 v1.34 晋升为 Beta，且默认启用。

此项工作是 [KEP #740](https://kep.k8s.io/740) 的一部分，由 SIG Auth 牵头完成。

<!--
### DRA features in beta
-->
### Beta 阶段的 DRA 特性   {#dra-features-in-beta}

<!--
#### Admin access for secure resource monitoring
-->
#### 用于安全资源监控的管理员访问   {#admin-access-for-secure-resource-monitoring}

DRA 通过 `ResourceClaim` 或 `ResourceClaimTemplate` 中的 `adminAccess` 字段，
支持受控的管理员访问能力。
这使集群操作员可以访问那些已经被其他工作负载使用的设备，用于监控或诊断。
这种特权模式仅限于那些有权在带有
`resource.k8s.io/admin-access: "true"` 标签的命名空间中创建相关对象的用户，
从而确保普通工作负载不受影响。
该特性于 v1.34 晋升为 Beta，在保留基于命名空间的授权检查与工作负载隔离的同时，
提供了安全的资源内省能力。

此项工作是 [KEP #5018](https://kep.k8s.io/5018) 的一部分，由 WG Device Management 和 SIG Auth 牵头完成。

<!--
#### Prioritized alternatives in ResourceClaims and ResourceClaimTemplates
-->
#### ResourceClaims 与 ResourceClaimTemplates 中的优先级备选项   {#prioritized-alternatives-in-resourceclaims-and-resourceclaimtemplates}

某个工作负载也许在单张高性能 GPU 上运行最佳，但也可能在两张中档 GPU 上完成任务。
启用特性门控 `DRAPrioritizedList`（现已默认开启）后，
`ResourceClaim` 与 `ResourceClaimTemplate` 会新增名为 `firstAvailable` 的字段。
该字段是一个有序列表，允许用户声明请求可以以多种不同方式被满足，
甚至在某些硬件不可用时选择不分配任何设备。
调度器会按顺序尝试这些备选项，从而为工作负载分配集群中当前可用的最佳设备组合。

此项工作是 [KEP #4816](https://kep.k8s.io/4816) 的一部分，由 WG Device Management 牵头完成。

<!--
#### The `kubelet` reports allocated DRA resources
-->
#### `kubelet` 报告已分配的 DRA 资源   {#the-kubelet-reports-allocated-dra-resources}

`kubelet` 的 API 现已更新，可报告通过 DRA 为 Pod 分配的资源。
这使节点监控代理能够发现节点上各个 Pod 所分配到的 DRA 资源。
此外，这也使节点侧组件能够使用 PodResourcesAPI，
并在开发新特性与新集成时利用这些 DRA 信息。
从 Kubernetes v1.34 开始，该特性默认启用。

此项工作是 [KEP #3695](https://kep.k8s.io/3695) 的一部分，由 WG Device Management 牵头完成。

<!--
### `kube-scheduler` non-blocking API calls
-->
### `kube-scheduler` 的非阻塞 API 调用   {#kube-scheduler-non-blocking-api-calls}

`kube-scheduler` 在调度周期中执行阻塞式 API 调用，这会形成性能瓶颈。
这一特性通过带请求去重的优先级队列体系引入异步 API 处理能力，
让调度器可以在后台等待 API 操作完成的同时，继续处理其他 Pod。

它带来的关键收益包括：降低调度时延、避免 API 延迟导致调度线程饥饿、
并让不可调度 Pod 能够更快重试。
这一实现保持了向后兼容，同时新增了用于观测待处理 API 操作的监控指标。

此项工作是 [KEP #5229](https://kep.k8s.io/5229) 的一部分，由 SIG Scheduling 牵头完成。

<!--
### Mutating admission policies
-->
### 变更准入策略   {#mutating-admission-policies}

[MutatingAdmissionPolicies](/zh-cn/docs/reference/access-authn-authz/mutating-admission-policy/)
为变更型准入 Webhook 提供了一种声明式、进程内的替代方案。
这一特性结合了 CEL 的对象构造能力、JSON Patch 策略，以及 Server Side Apply 的合并算法。

它显著简化了准入控制：
管理员现在可以直接在 API Server 中定义变更规则。
该特性在 v1.32 作为 Alpha 引入，并于 v1.34 晋升为 Beta。

此项工作是 [KEP #3962](https://kep.k8s.io/3962) 的一部分，由 SIG API Machinery 牵头完成。

<!--
### Snapshottable API server cache
-->
### 可快照化的 API Server 缓存   {#snapshottable-api-server-cache}

`kube-apiserver` 的缓存机制（Watch Cache）能够高效服务于“最新观测状态”的请求。
但对于请求历史状态的 **list** 操作（例如基于分页，或指定较旧 `resourceVersion` 的请求），
系统往往会绕过缓存，直接访问 etcd。
这种直接访问会显著增加性能成本，对于大型资源还可能因为传输大对象而造成内存压力，
进而影响稳定性。

在默认开启 `ListFromCacheSnapshot` 特性门控后，
如果 `kube-apiserver` 发现某个快照的 `resourceVersion` 足以满足请求，
就会优先从快照中返回响应。
`kube-apiserver` 启动时并没有快照，之后会在每次 watch 事件发生时创建新快照，
并在检测到 etcd 已压缩，或者缓存中存在超过 75 秒的旧事件且缓存已满时丢弃这些快照。
若请求所需的 `resourceVersion` 不可用，则服务器会回退到 etcd。

此项工作是 [KEP #4988](https://kep.k8s.io/4988) 的一部分，由 SIG API Machinery 牵头完成。

<!--
### Tooling for declarative validation of Kubernetes-native types
-->
### 面向 Kubernetes 原生类型的声明式校验工具   {#tooling-for-declarative-validation-of-kubernetes-native-types}

在这一版本之前，Kubernetes 内建 API 的校验规则几乎都靠手写，
这使得维护者很难发现、理解、改进或测试这些规则。
也没有统一方式可以找出某个 API 适用的全部校验规则。

声明式校验（Declarative Validation）让 Kubernetes 维护者更容易进行 API 开发、维护与评审，
同时也便于程序化分析，从而改善工具链与文档质量。
对于那些使用 Kubernetes 库编写控制器等程序的人来说，
新的方式允许通过 IDL 标签来添加新字段，而不必再手写复杂的校验函数。
这一变化通过自动生成大量样板式校验逻辑，加快了 API 创建速度，
并通过在版本化类型上执行校验，提供更相关的错误信息。

这一增强在 v1.33 升级为 Beta，并在 v1.34 中继续保持 Beta。
它将基于 CEL 的校验规则带到 Kubernetes 原生类型中，
允许直接在类型定义内声明更细粒度的验证逻辑，从而改善 API 一致性与开发体验。

此项工作是 [KEP #5073](https://kep.k8s.io/5073) 的一部分，由 SIG API Machinery 牵头完成。

<!--
### Streaming informers for **list** requests
-->
### 面向 **list** 请求的流式 Informer   {#streaming-informers-for-list-requests}

流式 Informer 特性自 v1.32 起进入 Beta，并在 v1.34 中继续得到完善。
这一能力允许 **list** 请求直接从 API Server 的 Watch Cache 中以对象流的形式返回数据，
而不是直接从 etcd 中组装分页结果。
通过复用 **watch** 操作所使用的机制，API Server 能在服务大数据集时保持稳定的内存占用，
并避免影响稳定性的内存分配尖峰。

在本次发布中，`kube-apiserver` 和 `kube-controller-manager` 默认都会利用新的 `WatchList` 机制。
对于 `kube-apiserver` 而言，这意味着 list 请求能够以更高效的流式方式返回；
而 `kube-controller-manager` 则受益于更加节省内存、更加可预测的 Informer 工作方式。
这些改进结合起来，降低了大型 list 操作期间的内存压力，并提升了持续高负载下的可靠性，
使 list 流式传输更加高效可预测。

此项工作是 [KEP #3157](https://kep.k8s.io/3157) 的一部分，由 SIG API Machinery 和 SIG Scalability 牵头完成。

<!--
### Graceful node shutdown handling for Windows nodes
-->
### Windows 节点的优雅关机处理   {#graceful-node-shutdown-handling-for-windows-nodes}

Windows 节点上的 `kubelet` 现在可以检测系统关机事件，
并开始优雅终止正在运行的 Pod。
这与 Linux 上已有的行为保持一致，可帮助工作负载在计划内关机或重启时干净退出。

当系统进入关机流程时，`kubelet` 会按标准终止逻辑作出反应，
遵循已配置的生命周期钩子与宽限期，在节点断电前给予 Pod 足够时间完成停止。
这一特性依赖 Windows 的预关机通知能力来协调整个过程。
它提升了维护、重启或系统更新期间的工作负载可靠性。
该特性现已进入 Beta，并默认启用。

此项工作是 [KEP #4802](https://kep.k8s.io/4802) 的一部分，由 SIG Windows 牵头完成。

<!--
### In-place Pod resize improvements
-->
### Pod 原地调整资源能力的进一步增强   {#in-place-pod-resize-improvements}

Pod 原地调整资源在 v1.33 晋升为 Beta 并默认启用，
而在 v1.34 中又进一步得到改进，
包括支持降低内存使用量，以及与 Pod 级资源特性的集成。

该特性在 v1.34 中仍处于 Beta。
如需查看详细用法与示例，请参考文档：
[调整分配给容器的 CPU 与内存资源](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/)。

此项工作是 [KEP #1287](https://kep.k8s.io/1287) 的一部分，由 SIG Node 和 SIG Autoscaling 牵头完成。

<!--
## New features in Alpha

*This is a selection of some of the improvements that are now alpha following the v1.34 release.*
-->
## Alpha 中的新特性   {#new-features-in-alpha}

**以下列出 v1.34 发布后进入 Alpha 阶段的一些改进。**

<!--
### Pod certificates for mTLS authentication
-->
### 用于 mTLS 认证的 Pod 证书   {#pod-certificates-for-mtls-authentication}

在集群内部对工作负载进行认证，尤其是与 API Server 通信时，
以往主要依赖 ServiceAccount 令牌。
虽然这种方式有效，但对于建立适用于双向 TLS（mTLS）的强身份、可验证身份而言，
它并不总是理想选择；同时，在与要求证书认证的外部系统集成时也会带来挑战。

Kubernetes v1.34 引入了一套内建机制，
让 Pod 可以通过 [PodCertificateRequests](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#pod-certificate-requests)
获取 X.509 证书。
`kubelet` 可以代表 Pod 请求和管理这些证书，
从而使 Pod 能通过 mTLS 向 Kubernetes API Server 及其他服务完成认证。

这一特性的主要收益，是为 Pod 提供更强大、更灵活的身份机制。
它为实现高强度 mTLS 认证提供了原生路径，而不必完全依赖 Bearer Token，
这让 Kubernetes 更贴近标准安全实践，也简化了与证书感知型可观测性和安全工具的集成。

此项工作是 [KEP #4317](https://kep.k8s.io/4317) 的一部分，由 SIG Auth 牵头完成。

<!--
### "Restricted" Pod security standard now forbids remote probes
-->
### “Restricted” Pod 安全标准现已禁止远程探针   {#restricted-pod-security-standard-now-forbids-remote-probes}

探针与生命周期处理器中的 `host` 字段允许用户为 `kubelet` 指定一个不同于 `podIP` 的探测目标。
然而，这也给误用和绕过安全控制的攻击打开了通路，
因为 `host` 字段理论上可以被设置为**任何**值，
包括安全敏感的外部主机，甚至是节点本机的 localhost。

在 Kubernetes v1.34 中，只有满足以下条件的 Pod 才符合
[Restricted](/zh-cn/docs/concepts/security/pod-security-standards/#restricted)
Pod 安全标准：要么不设置 `host` 字段，要么根本不使用这类探针。
你可以使用 Pod Security Admission，或第三方方案，来强制执行这一标准。
由于这涉及安全控制，请务必结合文档理解你所选机制的限制与行为。

此项工作是 [KEP #4940](https://kep.k8s.io/4940) 的一部分，由 SIG Auth 牵头完成。

<!--
### Use `.status.nominatedNodeName` to express Pod placement
-->
### 使用 `.status.nominatedNodeName` 表达 Pod 放置意图   {#use-statusnominatednodename-to-express-pod-placement}

当 `kube-scheduler` 需要较长时间才能把 Pod 绑定到节点时，
集群自动扩缩器可能无法意识到该 Pod 实际上即将被绑定到某个特定节点。
结果就是，它可能误把该节点视作利用率不足，并错误地将其删除。

为了解决这一问题，`kube-scheduler` 现在可以将 `.status.nominatedNodeName`
不仅用于表示抢占中的目标节点，也用来表达 Pod 的放置意图。
开启 `NominatedNodeNameForExpectation` 特性门控后，调度器会使用该字段来指明
Pod 预期将被绑定到何处，从而把内部保留信息暴露出来，帮助外部组件作出更合理的决策。

此项工作是 [KEP #5278](https://kep.k8s.io/5278) 的一部分，由 SIG Scheduling 牵头完成。

<!--
### DRA features in alpha
-->
### Alpha 阶段的 DRA 特性   {#dra-features-in-alpha}

<!--
#### Resource health status for DRA
-->
#### 面向 DRA 的资源健康状态   {#resource-health-status-for-dra}

当某个 Pod 正在使用一个已经故障或暂时不健康的设备时，往往很难察觉，
这让排查 Pod 崩溃问题变得困难甚至不可能。
面向 DRA 的资源健康状态特性，通过在 Pod 状态中暴露分配给 Pod 的设备健康信息，
提升了可观测性。
这有助于更容易定位由不健康设备引起的 Pod 问题，并采取恰当应对措施。

要启用这一功能，必须启用 `ResourceHealthStatus` 特性门控，
并要求 DRA 驱动实现 `DRAResourceHealth` gRPC 服务。

此项工作是 [KEP #4680](https://kep.k8s.io/4680) 的一部分，由 WG Device Management 牵头完成。

<!--
#### Extended resource mapping
-->
#### 扩展资源映射   {#extended-resource-mapping}

扩展资源映射提供了一种比 DRA 灵活表达能力更简单的替代方式，
通过直接、清晰的方式来描述资源容量与消耗。
该特性允许集群管理员把由 DRA 管理的资源以**扩展资源**的形式向外暴露，
从而使应用开发者与运维人员仍可以使用熟悉的容器 `.spec.resources` 语法来消费这些资源。

这让现有工作负载无需修改即可采用 DRA，
从而简化应用开发者与集群管理员迁移到 DRA 的过程。

此项工作是 [KEP #5004](https://kep.k8s.io/5004) 的一部分，由 WG Device Management 牵头完成。

<!--
#### DRA consumable capacity
-->
#### DRA 可消费容量   {#dra-consumable-capacity}

Kubernetes v1.33 已允许资源驱动声明设备中可供分配的“切片”，
而不必把整个设备视为只能整体分配的资源。
但这种方式仍不足以处理某些场景：
例如设备驱动希望根据用户需求管理设备资源的细粒度、动态部分，
或者希望在 `ResourceClaim` 之外共享这些资源，
而 `ResourceClaim` 又受其规约和命名空间约束。

启用 `DRAConsumableCapacity` 特性门控（在 v1.34 作为 Alpha 引入）后，
资源驱动就可以在多个 `ResourceClaim` 之间，甚至在多个 `DeviceRequest` 之间，
共享同一设备或同一设备切片。
该特性还扩展了调度器，使其能够根据 `capacity` 字段定义来分配设备资源的部分容量。

这一 DRA 特性改善了跨命名空间、跨声明的设备共享能力，
使之更贴合 Pod 的真实需求。
它让驱动可以强制执行容量上限，提升调度质量，
并支持诸如带宽感知网络、多租户共享等新场景。

此项工作是 [KEP #5075](https://kep.k8s.io/5075) 的一部分，由 WG Device Management 牵头完成。

<!--
#### Device binding conditions
-->
#### 设备绑定条件   {#device-binding-conditions}

Kubernetes 调度器现在可以通过延迟把 Pod 绑定到某个节点，
直到其所需的外部资源（例如可附加设备或 FPGA）被确认已就绪，
从而提升调度可靠性。

这一延迟机制是在调度框架的 [PreBind 阶段](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/#pre-bind)
实现的。在这一阶段，调度器会检查所有必需的设备条件是否已经满足，再继续执行绑定。
这使调度器能够与外部设备控制器协同工作，带来更稳健、更可预测的调度结果。

此项工作是 [KEP #5007](https://kep.k8s.io/5007) 的一部分，由 WG Device Management 牵头完成。

<!--
### Container restart rules
-->
### 容器重启规则   {#container-restart-rules}

当前，Pod 中所有容器在退出或崩溃后都会遵循同一个 `.spec.restartPolicy`。
然而，对于运行多个容器的 Pod 来说，不同容器往往有不同的重启需求。
例如，对于用于执行初始化任务的 Init 容器，如果其失败，你可能并不想反复重试初始化。
又比如，在长时间运行训练任务的机器学习环境中，
某些因可重试退出码而失败的容器，更适合在原地快速重启，
而不是触发整个 Pod 重建并丢失已完成的进度。

Kubernetes v1.34 引入 `ContainerRestartRules` 特性门控。
启用后，你可以为 Pod 中的每个容器单独指定 `restartPolicy`，
也可以通过 `restartPolicyRules` 列表，根据最近一次退出码来覆盖 `restartPolicy`。
这为复杂场景提供了所需的细粒度控制，也有助于更好地利用计算资源。

此项工作是 [KEP #5307](https://kep.k8s.io/5307) 的一部分，由 SIG Node 牵头完成。

<!--
### Load environment variables from files created in runtime
-->
### 从运行时创建的文件中加载环境变量   {#load-environment-variables-from-files-created-in-runtime}

应用开发者长期以来一直希望在声明环境变量方面拥有更高灵活性。
传统上，环境变量是在 API Server 侧通过静态值、ConfigMap 或 Secret 来声明的。

在 `EnvFiles` 特性门控之下，Kubernetes v1.34 引入了在运行时声明环境变量的能力。
某个容器（通常是 Init 容器）可以生成变量并把它写入文件，
后续容器则可以在启动时从该文件中加载环境变量。
这种方式不再需要通过“包装”目标容器的入口点来实现变量注入，
从而支持更灵活的 Pod 内部容器编排。

这一特性尤其适合 AI/ML 训练任务：
在这类场景中，训练 Job 中的每个 Pod 都可能需要使用运行时才能确定的初始化值。

此项工作是 [KEP #5307](https://kep.k8s.io/3721) 的一部分，由 SIG Node 牵头完成。

<!--
## Graduations, deprecations, and removals in v1.34
-->
## v1.34 中的毕业、弃用与移除   {#graduations-deprecations-and-removals-in-v134}

<!--
### Graduations to stable
-->
### 晋升为稳定版的特性   {#graduations-to-stable}

以下列出所有晋升为稳定版（即 *General Availability*）的特性。
如需查看包含新特性以及从 Alpha 晋升到 Beta 的完整更新列表，请参阅发布说明。

本次发布共有 23 项增强晋升为稳定版：

* [环境变量支持几乎所有可打印 ASCII 字符](https://kep.k8s.io/4369)
* [允许 Job 控制器在 Pod 完全终止后再重建 Pod](https://kep.k8s.io/3939)
* [允许 PreStop Hook 的 Sleep Action 使用零值](https://kep.k8s.io/4818)
* [API Server 追踪](https://kep.k8s.io/647)
* [AppArmor 支持](https://kep.k8s.io/24)
* [基于字段选择器和标签选择器进行授权](https://kep.k8s.io/4601)
* [从缓存中执行一致性读取](https://kep.k8s.io/2340)
* [将 TaintManager 从 NodeLifecycleController 中解耦](https://kep.k8s.io/3902)
* [从 CRI 发现 cgroup 驱动](https://kep.k8s.io/4033)
* [DRA：结构化参数](https://kep.k8s.io/4381)
* [为 PreStop Hook 引入 Sleep Action](https://kep.k8s.io/3960)
* [Kubelet OpenTelemetry 追踪](https://kep.k8s.io/2831)
* [Kubernetes VolumeAttributesClass 的 ModifyVolume 能力](https://kep.k8s.io/3751)
* [节点内存 Swap 支持](https://kep.k8s.io/2400)
* [仅允许匿名认证访问已配置端点](https://kep.k8s.io/4633)
* [有序的命名空间删除](https://kep.k8s.io/5080)
* [kube-scheduler 中按插件粒度的准确重入队回调函数](https://kep.k8s.io/4247)
* [放宽 DNS 搜索字符串校验](https://kep.k8s.io/4427)
* [增强 Watch Cache 初始化鲁棒性](https://kep.k8s.io/4568)
* [为 LIST 响应提供流式编码](https://kep.k8s.io/5116)
* [结构化认证配置](https://kep.k8s.io/3331)
* [Windows kube-proxy 中对 DSR 与 Overlay Networking 的支持](https://kep.k8s.io/5100)
* [支持从卷扩容失败中恢复](https://kep.k8s.io/1790)

<!--
### Deprecations and removals
-->
### 弃用与移除   {#deprecations-and-removals}

随着 Kubernetes 不断发展成熟，为了提升项目整体健康度，
某些特性会被弃用、移除，或者被更优方案替代。
关于这一流程的更多细节，请参阅 Kubernetes 的
[弃用与移除策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。
Kubernetes v1.34 包含几项值得注意的弃用内容。

<!--
#### Manual cgroup driver configuration is deprecated
-->
#### 手动配置 cgroup 驱动已被弃用   {#manual-cgroup-driver-configuration-is-deprecated}

长期以来，为 Kubernetes 集群正确配置 cgroup 驱动一直是用户的痛点。
Kubernetes v1.28 让 `kubelet` 能够查询 CRI 实现，以发现应使用哪一种 cgroup 驱动。
这一自动检测机制现已**强烈推荐**使用，并在 v1.34 晋升为稳定版。

如果你的 CRI 容器运行时不支持报告所需的 cgroup 驱动，
你应考虑升级或更换容器运行时。
`kubelet` 配置文件中的 `cgroupDriver` 配置项现已弃用。
对应的命令行选项 `--cgroup-driver` 也已在此前弃用，
因为 Kubernetes 推荐使用配置文件而非命令行参数。
这两个入口都将在未来版本被移除，且移除时间不会早于 v1.36。

此项工作是 [KEP #4033](https://kep.k8s.io/4033) 的一部分，由 SIG Node 牵头完成。

<!--
#### Kubernetes to end containerd 1.x support in v1.36
-->
#### Kubernetes 将在 v1.36 终止对 containerd 1.x 的支持   {#kubernetes-to-end-containerd-1x-support-in-v136}

尽管 Kubernetes v1.34 仍然支持 containerd 1.7 以及 containerd 的其他 LTS 版本，
但由于自动检测 cgroup 驱动这一能力已经成熟，
Kubernetes SIG Node 社区已经正式确定 containerd 1.x 的最终支持时间线。
最后一个继续提供此支持的 Kubernetes 版本将是 v1.35，
这与 containerd 1.7 的生命周期终止时间保持一致。

这是一项提前预警：如果你仍在使用 containerd 1.x，
应尽快考虑迁移到 2.0 及以上版本。
你可以通过监控 `kubelet_cri_losing_support` 指标，
来判断集群中是否存在即将失去支持的 containerd 版本节点。

此项工作是 [KEP #4033](https://kep.k8s.io/4033) 的一部分，由 SIG Node 牵头完成。

<!--
#### `PreferClose` traffic distribution is deprecated
-->
#### `PreferClose` 流量分配已被弃用   {#preferclose-traffic-distribution-is-deprecated}

Kubernetes [Service](/zh-cn/docs/concepts/services-networking/service/) 中的
`spec.trafficDistribution` 字段允许用户表达希望如何把流量路由到 Service 端点。

[KEP-3015](https://kep.k8s.io/3015) 弃用了 `PreferClose`，
并引入两个新值：`PreferSameZone` 与 `PreferSameNode`。
`PreferSameZone` 是现有 `PreferClose` 的别名，用来更清楚地表达其语义；
`PreferSameNode` 则表示在可能的情况下优先把连接投递到本地端点，
否则回退到远端端点。

这一特性在 v1.33 通过 `PreferSameTrafficDistribution` 特性门控引入，
并于 v1.34 晋升为 Beta，且默认启用。

此项工作是 [KEP #3015](https://kep.k8s.io/3015) 的一部分，由 SIG Network 牵头完成。

<!--
## Release notes
-->
## 发布说明   {#release-notes}

Kubernetes v1.34 的完整发布详情，请查看我们的
[发布说明](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.34.md)。

<!--
## Availability
-->
## 获取方式   {#availability}

Kubernetes v1.34 可从 [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.34.0)
或 [Kubernetes 下载页面](/releases/download/) 获取。

要开始使用 Kubernetes，可以先看看这些[交互式教程](/zh-cn/docs/tutorials/)，
或通过 [minikube](https://minikube.sigs.k8s.io/) 运行本地 Kubernetes 集群。
你也可以使用
[kubeadm](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
轻松安装 v1.34。

<!--
## Release Team
-->
## 发布团队   {#release-team}

Kubernetes 的成功离不开社区的支持、投入与辛勤工作。
每个发布团队都由一群充满奉献精神的社区志愿者组成，
他们通力协作，构建出 Kubernetes 发布所需的众多组成部分。
这需要来自社区各个角落的专业技能，从代码本身，到文档，再到项目管理。

我们缅怀
[Rodolfo "Rodo" Martínez Vega](https://github.com/cncf/memorials/blob/main/rodolfo-martinez.md)，
这位充满热忱的贡献者以其对技术与社区建设的激情，
在 Kubernetes 社区留下了深刻印记。
Rodo 曾在多个 Kubernetes 发布周期中担任发布团队成员，
包括 v1.22-v1.23 和 v1.25-v1.30，
以始终如一的投入为项目的稳定与成功作出贡献。

除了在发布团队中的工作，Rodo 还长期致力于建设 Cloud Native LATAM 社区，
帮助弥合该领域中的语言与文化鸿沟。
他在 Kubernetes 西班牙语文档与 CNCF 术语表上的贡献，
体现了他让全球西班牙语开发者都能更容易获取知识的坚持。
Rodo 的精神将继续存在于那些受到他指导的社区成员中，
存在于他参与交付的一个个版本中，也存在于他帮助培育起来的 LATAM Kubernetes 社区中。

我们要感谢整个
[发布团队](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.34/release-team.md)，
感谢他们投入大量时间与精力，把 Kubernetes v1.34 交付给社区。
团队成员既有第一次担任 shadow 的新人，也有历经多个发布周期的资深负责人。
我们尤其要向本次发布负责人 Vyom Yadav 表达感谢，
感谢他带领大家顺利完成这一发布周期，亲自投入解决挑战，
并为社区注入推动前进的能量与关怀。

<!--
## Project Velocity
-->
## 项目活跃度   {#project-velocity}

CNCF K8s
[DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All)
项目汇总了许多与 Kubernetes 及其子项目活跃度有关的数据点，
其中涵盖从个人贡献者数量到贡献公司数量等信息，
用以展现推动这一生态持续演进的广度与深度。

在为期 15 周的 v1.34 发布周期中（从 2025 年 5 月 19 日到 2025 年 8 月 27 日），
Kubernetes 共吸引了 106 家公司和 491 位个人贡献者参与。
在更广泛的云原生生态中，这一数字则提升至 370 家公司和 2235 位贡献者。

请注意，这里的“贡献”包括提交代码、代码审查、发表评论、创建 Issue 或 PR、
审阅 PR（包括博客和文档），以及在 Issue 和 PR 下评论等活动。
如果你有兴趣参与贡献，请访问贡献者网站上的
[Getting Started](https://www.kubernetes.dev/docs/guide/#getting-started) 页面。

数据来源：

* [贡献 Kubernetes 的公司](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1747609200000&to=1756335599000&var-period=d28&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes)
* [整体生态的贡献](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1747609200000&to=1756335599000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)

<!--
## Event Update
-->
## 活动更新   {#event-update}

了解即将到来的 Kubernetes 与云原生活动，包括 KubeCon + CloudNativeCon、
KCD 以及全球其他值得关注的大会。保持关注，并积极参与 Kubernetes 社区！

**2025 年 8 月**

- [**KCD - Kubernetes Community Days: Colombia**](https://community.cncf.io/events/details/cncf-kcd-colombia-presents-kcd-colombia-2025/)：2025 年 8 月 28 日｜哥伦比亚 Bogotá

**2025 年 9 月**

- [**CloudCon Sydney**](https://community.cncf.io/events/details/cncf-cloud-native-sydney-presents-cloudcon-sydney-sydney-international-convention-centre-910-september/)：2025 年 9 月 9-10 日｜澳大利亚 Sydney
- [**KCD - Kubernetes Community Days: San Francisco Bay Area**](https://community.cncf.io/events/details/cncf-kcd-sf-bay-area-presents-kcd-san-francisco-bay-area/)：2025 年 9 月 9 日｜美国 San Francisco
- [**KCD - Kubernetes Community Days: Washington DC**](https://community.cncf.io/events/details/cncf-kcd-washington-dc-presents-kcd-washington-dc-2025/)：2025 年 9 月 16 日｜美国 Washington, D.C.
- [**KCD - Kubernetes Community Days: Sofia**](https://community.cncf.io/events/details/cncf-kcd-sofia-presents-kubernetes-community-days-sofia/)：2025 年 9 月 18 日｜保加利亚 Sofia
- [**KCD - Kubernetes Community Days: El Salvador**](https://community.cncf.io/events/details/cncf-kcd-el-salvador-presents-kcd-el-salvador/)：2025 年 9 月 20 日｜萨尔瓦多 San Salvador

**2025 年 10 月**

- [**KCD - Kubernetes Community Days: Warsaw**](https://community.cncf.io/events/details/cncf-kcd-warsaw-presents-kcd-warsaw-2025/)：2025 年 10 月 9 日｜波兰 Warsaw
- [**KCD - Kubernetes Community Days: Edinburgh**](https://community.cncf.io/events/details/cncf-kcd-uk-presents-kubernetes-community-days-uk-edinburgh-2025/)：2025 年 10 月 21 日｜英国 Edinburgh
- [**KCD - Kubernetes Community Days: Sri Lanka**](https://community.cncf.io/events/details/cncf-kcd-sri-lanka-presents-kcd-sri-lanka-2025/)：2025 年 10 月 26 日｜斯里兰卡 Colombo

**2025 年 11 月**

- [**KCD - Kubernetes Community Days: Porto**](https://community.cncf.io/events/details/cncf-kcd-porto-presents-kcd-porto-2025/)：2025 年 11 月 3 日｜葡萄牙 Porto
- [**KubeCon + CloudNativeCon North America 2025**](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/)：2025 年 11 月 10-13 日｜美国 Atlanta
- [**KCD - Kubernetes Community Days: Hangzhou**](https://sessionize.com/kcd-hangzhou-and-oicd-2025/)：2025 年 11 月 15 日｜中国 Hangzhou

**2025 年 12 月**

- [**KCD - Kubernetes Community Days: Suisse Romande**](https://community.cncf.io/events/details/cncf-kcd-suisse-romande-presents-kcd-suisse-romande/)：2025 年 12 月 4 日｜瑞士 Geneva

最新活动详情可在[这里](https://community.cncf.io/events/#/list)查看。

<!--
## Upcoming Release Webinar
-->
## 即将举行的发布说明会   {#upcoming-release-webinar}

欢迎在 **2025 年 9 月 24 日（星期三）16:00（UTC）**
与 Kubernetes v1.34 发布团队成员一起了解本次发布的重点亮点。
欲了解更多信息并完成注册，请访问 CNCF Online Programs 站点上的
[活动页面](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cloud-native-live-kubernetes-v134-release/)。

<!--
## Get Involved
-->
## 参与社区   {#get-involved}

参与 Kubernetes 最简单的方式之一，是加入与你兴趣相符的
[特别兴趣小组（SIG）](https://github.com/kubernetes/community/blob/master/sig-list.md)。
如果你有想向 Kubernetes 社区分享的内容，
欢迎在每周的[社区会议](https://github.com/kubernetes/community/tree/master/communication)上发声，
也可以通过下列渠道参与交流。感谢你一直以来的反馈与支持。

* 在 Bluesky 关注 [@Kubernetesio](https://bsky.app/profile/kubernetes.io)，获取最新动态
* 参与 [Discuss](https://discuss.kubernetes.io/) 社区讨论
* 加入 [Kubernetes Slack](http://slack.k8s.io/)
* 在 [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes) 提问或回答问题
* 分享你的 Kubernetes [故事](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* 在 [博客](https://kubernetes.io/blog/) 上了解 Kubernetes 的最新动态
* 进一步了解 [Kubernetes 发布团队](https://github.com/kubernetes/sig-release/tree/master/release-team)
