---
layout: blog
title: 'Kubernetes v1.30 初探'
date: 2024-03-12
slug: kubernetes-1-30-upcoming-changes
---
<!--
layout: blog
title: 'A Peek at Kubernetes v1.30'
date: 2024-03-12
slug: kubernetes-1-30-upcoming-changes
-->

<!-- 
**Authors:** Amit Dsouza, Frederick Kautz, Kristin Martin, Abigail McCarthy, Natali Vlatko
-->
**作者:** Amit Dsouza, Frederick Kautz, Kristin Martin, Abigail McCarthy, Natali Vlatko

**译者:** Paco Xu (DaoCloud)

<!--
## A quick look: exciting changes in Kubernetes v1.30

It's a new year and a new Kubernetes release. We're halfway through the release cycle and
have quite a few interesting and exciting enhancements coming in v1.30. From brand new features
in alpha, to established features graduating to stable, to long-awaited improvements, this release
has something for everyone to pay attention to!

To tide you over until the official release, here's a sneak peek of the enhancements we're most
excited about in this cycle!
-->

## 快速预览：Kubernetes v1.30 中令人兴奋的变化

新年新版本，v1.30 发布周期已过半，我们将迎来一系列有趣且令人兴奋的增强功能。
从全新的 alpha 特性，到已有的特性升级为稳定版，再到期待已久的改进，这个版本对每个人都有值得关注的内容！

为了让你在正式发布之前对其有所了解，下面给出我们在这个周期中最为期待的增强功能的预览！

<!--
## Major changes for Kubernetes v1.30
-->
## Kubernetes v1.30 的主要变化

<!--
### Structured parameters for dynamic resource allocation ([KEP-4381](https://kep.k8s.io/4381))
-->
### 动态资源分配（DRA）的结构化参数 ([KEP-4381](https://kep.k8s.io/4381))

<!--
[Dynamic resource allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) was
added to Kubernetes as an alpha feature in v1.26. It defines an alternative to the traditional
device-plugin API for requesting access to third-party resources. By design, dynamic resource
allocation uses parameters for resources that are completely opaque to core Kubernetes. This
approach poses a problem for the Cluster Autoscaler (CA) or any higher-level controller that
needs to make decisions for a group of pods (e.g. a job scheduler). It cannot simulate the effect of
allocating or deallocating claims over time. Only the third-party DRA drivers have the information
available to do this.
-->
[动态资源分配（DRA）](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) 在 Kubernetes v1.26 中作为 alpha 特性添加。
它定义了一种替代传统设备插件 device plugin API 的方式，用于请求访问第三方资源。
在设计上，动态资源分配（DRA）使用的资源参数对于核心 Kubernetes 完全不透明。
这种方法对于集群自动缩放器（CA）或任何需要为一组 Pod 做决策的高级控制器（例如作业调度器）都会带来问题。
这一设计无法模拟在不同时间分配或释放请求的效果。
只有第三方 DRA 驱动程序才拥有信息来做到这一点。

<!--
​​Structured Parameters for dynamic resource allocation is an extension to the original
implementation that addresses this problem by building a framework to support making these claim
parameters less opaque. Instead of handling the semantics of all claim parameters themselves,
drivers could manage resources and describe them using a specific "structured model" pre-defined by
Kubernetes. This would allow components aware of this "structured model" to make decisions about
these resources without outsourcing them to some third-party controller. For example, the scheduler
could allocate claims rapidly without back-and-forth communication with dynamic resource
allocation drivers. Work done for this release centers on defining the framework necessary to enable
different "structured models" and to implement the "named resources" model. This model allows
listing individual resource instances and, compared to the traditional device plugin API, adds the
ability to select those instances individually via attributes.
-->
动态资源分配（DRA）的结构化参数是对原始实现的扩展，它通过构建一个框架来支持增加请求参数的透明度来解决这个问题。
驱动程序不再需要自己处理所有请求参数的语义，而是可以使用 Kubernetes 预定义的特定“结构化模型”来管理和描述资源。
这一设计允许了解这个“结构化规范”的组件做出关于这些资源的决策，而不再将它们外包给某些第三方控制器。
例如，调度器可以在不与动态资源分配（DRA）驱动程序反复通信的前提下快速完成分配请求。
这个版本的工作重点是定义一个框架来支持不同的“结构化模型”，并实现“命名资源”模型。
此模型允许列出各个资源实例，同时，与传统的设备插件 API 相比，模型增加了通过属性逐一选择实例的能力。

<!--
### Node memory swap support ([KEP-2400](https://kep.k8s.io/2400))
-->
### 节点交换内存 SWAP 支持 ([KEP-2400](https://kep.k8s.io/2400))

<!--
In Kubernetes v1.30, memory swap support on Linux nodes gets a big change to how it works - with a
strong emphasis on improving system stability. In previous Kubernetes versions, the `NodeSwap`
feature gate was disabled by default, and when enabled, it used `UnlimitedSwap` behavior as the
default behavior. To achieve better stability, `UnlimitedSwap` behavior (which might compromise node
stability) will be removed in v1.30.
-->
在 Kubernetes v1.30 中，Linux 节点上的交换内存支持机制有了重大改进，其重点是提高系统的稳定性。
以前的 Kubernetes 版本默认情况下禁用了 `NodeSwap` 特性门控。当门控被启用时，`UnlimitedSwap` 行为被作为默认行为。
为了提高稳定性，`UnlimitedSwap` 行为（可能会影响节点的稳定性）将在 v1.30 中被移除。

<!--
The updated, still-beta support for swap on Linux nodes will be available by default. However, the
default behavior will be to run the node set to `NoSwap` (not `UnlimitedSwap`) mode. In `NoSwap`
mode, the kubelet supports running on a node where swap space is active, but Pods don't use any of
the page file. You'll still need to set `--fail-swap-on=false` for the kubelet to run on that node.
However, the big change is the other mode: `LimitedSwap`. In this mode, the kubelet actually uses
the page file on that node and allows Pods to have some of their virtual memory paged out.
Containers (and their parent pods)  do not have access to swap beyond their memory limit, but the
system can still use the swap space if available.
-->
更新后的 Linux 节点上的交换内存支持仍然是 beta 级别，并且默认情况下开启。
然而，节点默认行为是使用 `NoSwap`（而不是 `UnlimitedSwap`）模式。
在 `NoSwap` 模式下，kubelet 支持在启用了磁盘交换空间的节点上运行，但 Pod 不会使用页面文件（pagefile）。
你仍然需要为 kubelet 设置 `--fail-swap-on=false` 才能让 kubelet 在该节点上运行。
特性的另一个重大变化是针对另一种模式：`LimitedSwap`。
在 `LimitedSwap` 模式下，kubelet 会实际使用节点上的页面文件，并允许 Pod 的一些虚拟内存被换页出去。
容器（及其父 Pod）访问交换内存空间不可超出其内存限制，但系统的确可以使用可用的交换空间。

<!--
Kubernetes' Node special interest group (SIG Node) will also update the documentation to help you
understand how to use the revised implementation, based on feedback from end users, contributors,
and the wider Kubernetes community.
-->
Kubernetes 的 SIG Node 小组还将根据最终用户、贡献者和更广泛的 Kubernetes 社区的反馈更新文档，
以帮助你了解如何使用经过修订的实现。

<!--
Read the previous [blog post](/blog/2023/08/24/swap-linux-beta/) or the [node swap
documentation](/docs/concepts/architecture/nodes/#swap-memory) for more details on 
Linux node swap support in Kubernetes.
-->
阅读之前的[博客文章](/zh-cn/blog/2023/08/24/swap-linux-beta/)或[交换内存管理文档](/zh-cn/docs/concepts/architecture/nodes/#swap-memory)以获取有关
Kubernetes 中 Linux 节点交换支持的更多详细信息。

<!--
### Support user namespaces in pods ([KEP-127](https://kep.k8s.io/127))
-->
### 支持 Pod 运行在用户命名空间 ([KEP-127](https://kep.k8s.io/127))

<!--
[User namespaces](/docs/concepts/workloads/pods/user-namespaces) is a Linux-only feature that better
isolates pods to prevent or mitigate several CVEs rated high/critical, including
[CVE-2024-21626](https://github.com/opencontainers/runc/security/advisories/GHSA-xr7r-f8xq-vfvv),
published in January 2024. In Kubernetes 1.30, support for user namespaces is migrating to beta and
now supports pods with and without volumes, custom UID/GID ranges, and more!
-->
[用户命名空间](/zh-cn/docs/concepts/workloads/pods/user-namespaces) 是一个仅在 Linux 上可用的特性，它更好地隔离 Pod，
以防止或减轻几个高/严重级别的 CVE，包括 2024 年 1 月发布的 [CVE-2024-21626](https://github.com/opencontainers/runc/security/advisories/GHSA-xr7r-f8xq-vfvv)。
在 Kubernetes 1.30 中，对用户命名空间的支持正在迁移到 beta，并且现在支持带有和不带有卷的 Pod，自定义 UID/GID 范围等等！

<!--
### Structured authorization configuration ([KEP-3221](https://kep.k8s.io/3221))
-->
### 结构化鉴权配置([KEP-3221](https://kep.k8s.io/3221))

<!--
Support for [structured authorization
configuration](/docs/reference/access-authn-authz/authorization/#configuring-the-api-server-using-an-authorization-config-file)
is moving to beta and will be enabled by default. This feature enables the creation of
authorization chains with multiple webhooks with well-defined parameters that validate requests in a
particular order and allows fine-grained control – such as explicit Deny on failures. The
configuration file approach even allows you to specify [CEL](/docs/reference/using-api/cel/) rules
to pre-filter requests before they are dispatched to webhooks, helping you to prevent unnecessary
invocations. The API server also automatically reloads the authorizer chain when the configuration
file is modified.
-->
对[结构化鉴权配置](/zh-cn/docs/reference/access-authn-authz/authorization/#configuring-the-api-server-using-an-authorization-config-file)的支持正在晋级到 Beta 版本，并将默认启用。
这个特性支持创建具有明确参数定义的多个 Webhook 所构成的鉴权链；这些 Webhook 按特定顺序验证请求，
并允许进行细粒度的控制，例如在失败时明确拒绝。
配置文件方法甚至允许你指定 [CEL](/zh-cn/docs/reference/using-api/cel/) 规则，以在将请求分派到 Webhook 之前对其进行预过滤，帮助你防止不必要的调用。
当配置文件被修改时，API 服务器还会自动重新加载鉴权链。

<!--
You must specify the path to that authorization configuration using the `--authorization-config`
command line argument. If you want to keep using command line flags instead of a
configuration file, those will continue to work as-is. To gain access to new authorization webhook
capabilities like multiple webhooks, failure policy, and pre-filter rules, switch to putting options
in an `--authorization-config` file. From Kubernetes 1.30, the configuration file format is
beta-level, and only requires specifying `--authorization-config` since the feature gate is enabled by
default. An example configuration with all possible values is provided in the [Authorization
docs](/docs/reference/access-authn-authz/authorization/#configuring-the-api-server-using-an-authorization-config-file).
For more details, read the [Authorization
docs](/docs/reference/access-authn-authz/authorization/#configuring-the-api-server-using-an-authorization-config-file).
-->
你必须使用 `--authorization-config` 命令行参数指定鉴权配置的路径。
如果你想继续使用命令行标志而不是配置文件，命令行方式没有变化。
要访问新的 Webhook 功能，例如多 Webhook 支持、失败策略和预过滤规则，需要切换到将选项放在 `--authorization-config` 文件中。
从 Kubernetes 1.30 开始，配置文件格式约定是 beta 级别的，只需要指定 `--authorization-config`，因为特性门控默认启用。
[鉴权文档](/zh-cn/docs/reference/access-authn-authz/authorization/#configuring-the-api-server-using-an-authorization-config-file)
中提供了一个包含所有可能值的示例配置。
有关更多详细信息，请阅读[鉴权文档](/zh-cn/docs/reference/access-authn-authz/authorization/#configuring-the-api-server-using-an-authorization-config-file)。

<!--
### Container resource based pod autoscaling ([KEP-1610](https://kep.k8s.io/1610))
-->
### 基于容器资源指标的 Pod 自动扩缩容 ([KEP-1610](https://kep.k8s.io/1610))

<!--
Horizontal pod autoscaling based on `ContainerResource` metrics will graduate to stable in v1.30.
This new behavior for HorizontalPodAutoscaler allows you to configure automatic scaling based on the
resource usage for individual containers, rather than the aggregate resource use over a Pod. See our
[previous article](/blog/2023/05/02/hpa-container-resource-metric/) for further details, or read
[container resource metrics](/docs/tasks/run-application/horizontal-pod-autoscale/#container-resource-metrics).
-->
基于 `ContainerResource` 指标的 Pod 水平自动扩缩容将在 v1.30 中升级为稳定版。
HorizontalPodAutoscaler 的这一新行为允许你根据各个容器的资源使用情况而不是 Pod 的聚合资源使用情况来配置自动伸缩。
有关更多详细信息，请参阅我们的[先前文章](/zh-cn/blog/2023/05/02/hpa-container-resource-metric/)，
或阅读[容器资源指标](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/#container-resource-metrics)。

<!--
### CEL for admission control ([KEP-3488](https://kep.k8s.io/3488))
-->
### 在准入控制中使用 CEL ([KEP-3488](https://kep.k8s.io/3488))

<!--
Integrating Common Expression Language (CEL) for admission control in Kubernetes introduces a more
dynamic and expressive way of evaluating admission requests. This feature allows complex,
fine-grained policies to be defined and enforced directly through the Kubernetes API, enhancing
security and governance capabilities without compromising performance or flexibility.
-->
Kubernetes 为准入控制集成了 Common Expression Language (CEL) 。
这一集成引入了一种更动态、表达能力更强的方式来判定准入请求。
这个特性允许通过 Kubernetes API 直接定义和执行复杂的、细粒度的策略，同时增强了安全性和治理能力，而不会影响性能或灵活性。

<!--
CEL's addition to Kubernetes admission control empowers cluster administrators to craft intricate
rules that can evaluate the content of API requests against the desired state and policies of the
cluster without resorting to Webhook-based access controllers. This level of control is crucial for
maintaining the integrity, security, and efficiency of cluster operations, making Kubernetes
environments more robust and adaptable to various use cases and requirements. For more information
on using CEL for admission control, see the [API
documentation](/docs/reference/access-authn-authz/validating-admission-policy/) for
ValidatingAdmissionPolicy.
-->
将 CEL 引入到 Kubernetes 的准入控制后，集群管理员就具有了制定复杂规则的能力，
这些规则可以根据集群的期望状态和策略来评估 API 请求的内容，而无需使用基于 Webhook 的访问控制器。
这种控制水平对于维护集群操作的完整性、安全性和效率至关重要，使 Kubernetes 环境更加健壮，更适应各种用例和需求。
有关使用 CEL 进行准入控制的更多信息，请参阅 [API 文档](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/)中的 ValidatingAdmissionPolicy。

<!--
We hope you're as excited for this release as we are. Keep an eye out for the official release 
blog in a few weeks for more highlights!
-->
我们希望你和我们一样对这个版本的发布感到兴奋。请在未来几周内密切关注官方发布博客，以了解其他亮点！
