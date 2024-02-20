---
title: 扩展 Kubernetes
weight: 999  # 这一节应放在最后
description: 改变你的 Kubernetes 集群的行为的若干方法。
feature:
  title: 为扩展性设计
  description: >
    无需更改上游源码即可扩展你的 Kubernetes 集群。
content_type: concept
no_list: true
---
<!--
title: Extending Kubernetes
weight: 999 # this section should come last
description: Different ways to change the behavior of your Kubernetes cluster.
reviewers:
- erictune
- lavalamp
- cheftako
- chenopis
feature:
  title: Designed for extensibility
  description: >
    Add features to your Kubernetes cluster without changing upstream source code.
content_type: concept
no_list: true
-->

<!-- overview -->

<!--
Kubernetes is highly configurable and extensible. As a result, there is rarely a need to fork or
submit patches to the Kubernetes project code.

This guide describes the options for customizing a Kubernetes cluster. It is aimed at
{{< glossary_tooltip text="cluster operators" term_id="cluster-operator" >}} who want to understand
how to adapt their Kubernetes cluster to the needs of their work environment. Developers who are
prospective {{< glossary_tooltip text="Platform Developers" term_id="platform-developer" >}} or
Kubernetes Project {{< glossary_tooltip text="Contributors" term_id="contributor" >}} will also
find it useful as an introduction to what extension points and patterns exist, and their
trade-offs and limitations.
-->
Kubernetes 是高度可配置且可扩展的。因此，大多数情况下，
你不需要派生自己的 Kubernetes 副本或者向项目代码提交补丁。

本指南描述定制 Kubernetes 的可选方式。主要针对的读者是希望了解如何针对自身工作环境需要来调整
Kubernetes 的{{< glossary_tooltip text="集群管理者" term_id="cluster-operator" >}}。
对于那些充当{{< glossary_tooltip text="平台开发人员" term_id="platform-developer" >}}的开发人员或
Kubernetes 项目的{{< glossary_tooltip text="贡献者" term_id="contributor" >}}而言，
他们也会在本指南中找到有用的介绍信息，了解系统中存在哪些扩展点和扩展模式，
以及它们所附带的各种权衡和约束等等。

<!--
Customization approaches can be broadly divided into [configuration](#configuration), which only
involves changing command line arguments, local configuration files, or API resources; and [extensions](#extensions),
which involve running additional programs, additional network services, or both.
This document is primarily about _extensions_.
-->
定制化的方法主要可分为[配置](#configuration)和[扩展](#extensions)两种。
前者主要涉及更改命令行参数、本地配置文件或者 API 资源；
后者则需要额外运行一些程序、网络服务或两者。
本文主要关注**扩展**。
<!-- body -->

<!--
## Configuration

*Configuration files* and *command arguments* are documented in the [Reference](/docs/reference/) section of the online
documentation, with a page for each binary:

* [`kube-apiserver`](/docs/reference/command-line-tools-reference/kube-apiserver/)
* [`kube-controller-manager`](/docs/reference/command-line-tools-reference/kube-controller-manager/)
* [`kube-scheduler`](/docs/reference/command-line-tools-reference/kube-scheduler/)
* [`kubelet`](/docs/reference/command-line-tools-reference/kubelet/)
* [`kube-proxy`](/docs/reference/command-line-tools-reference/kube-proxy/)
-->
## 配置   {#configuration}

**配置文件**和**命令参数**的说明位于在线文档的[参考](/zh-cn/docs/reference/)一节，
每个可执行文件一个页面：

* [`kube-apiserver`](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)
* [`kube-controller-manager`](/zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/)
* [`kube-scheduler`](/zh-cn/docs/reference/command-line-tools-reference/kube-scheduler/)
* [`kubelet`](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)
* [`kube-proxy`](/zh-cn/docs/reference/command-line-tools-reference/kube-proxy/)

<!--
Command arguments and configuration files may not always be changeable in a hosted Kubernetes service or a
distribution with managed installation. When they are changeable, they are usually only changeable
by the cluster operator. Also, they are subject to change in future Kubernetes versions, and
setting them may require restarting processes. For those reasons, they should be used only when
there are no other options.
-->
在托管的 Kubernetes 服务中或者受控安装的发行版本中，命令参数和配置文件不总是可以修改的。
即使它们是可修改的，通常其修改权限也仅限于集群操作员。
此外，这些内容在将来的 Kubernetes 版本中很可能发生变化，设置新参数或配置文件可能需要重启进程。
有鉴于此，应该在没有其他替代方案时才会使用这些命令参数和配置文件。

<!--
Built-in *policy APIs*, such as [ResourceQuota](/docs/concepts/policy/resource-quotas/),
[NetworkPolicy](/docs/concepts/services-networking/network-policies/) and Role-based Access Control
([RBAC](/docs/reference/access-authn-authz/rbac/)), are built-in Kubernetes APIs that provide declaratively configured policy settings.
APIs are typically usable even with hosted Kubernetes services and with managed Kubernetes installations.
The built-in policy APIs follow the same conventions as other Kubernetes resources such as Pods.
When you use a policy APIs that is [stable](/docs/reference/using-api/#api-versioning), you benefit from a
[defined support policy](/docs/reference/using-api/deprecation-policy/) like other Kubernetes APIs.
For these reasons, policy APIs are recommended over *configuration files* and *command arguments* where suitable.
-->
诸如 [ResourceQuota](/zh-cn/docs/concepts/policy/resource-quotas/)、
[NetworkPolicy](/zh-cn/docs/concepts/services-networking/network-policies/)
和基于角色的访问控制（[RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/)）
等**内置策略 API** 都是以声明方式配置策略选项的内置 Kubernetes API。
即使在托管的 Kubernetes 服务和受控的 Kubernetes 安装环境中，API 通常也是可用的。
内置策略 API 遵循与 Pod 这类其他 Kubernetes 资源相同的约定。
当你使用[稳定版本](/zh-cn/docs/reference/using-api/#api-versioning)的策略 API，
它们与其他 Kubernetes API 一样，采纳的是一种[预定义的支持策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。
出于以上原因，在条件允许的情况下，基于策略 API 的方案应该优先于**配置文件**和**命令参数**。

<!--
## Extensions

Extensions are software components that extend and deeply integrate with Kubernetes.
They adapt it to support new types and new kinds of hardware.

Many cluster administrators use a hosted or distribution instance of Kubernetes.
These clusters come with extensions pre-installed. As a result, most Kubernetes
users will not need to install extensions and even fewer users will need to author new ones.
-->
## 扩展    {#extensions}

扩展（Extensions）是一些扩充 Kubernetes 能力并与之深度集成的软件组件。
它们调整 Kubernetes 的工作方式使之支持新的类型和新的硬件种类。

大多数集群管理员会使用一种托管的 Kubernetes 服务或者其某种发行版本。
这类集群通常都预先安装了扩展。因此，大多数 Kubernetes 用户不需要安装扩展，
至于需要自己编写新的扩展的情况就更少了。

<!--
### Extension patterns

Kubernetes is designed to be automated by writing client programs. Any
program that reads and/or writes to the Kubernetes API can provide useful
automation. *Automation* can run on the cluster or off it. By following
the guidance in this doc you can write highly available and robust automation.
Automation generally works with any Kubernetes cluster, including hosted
clusters and managed installations.
-->
### 扩展模式   {#extension-patterns}

Kubernetes 从设计上即支持通过编写客户端程序来将其操作自动化。
任何能够对 Kubernetes API 发出读写指令的程序都可以提供有用的自动化能力。
**自动化组件**可以运行在集群上，也可以运行在集群之外。
通过遵从本文中的指南，你可以编写高度可用的、运行稳定的自动化组件。
自动化组件通常可以用于所有 Kubernetes 集群，包括托管的集群和受控的安装环境。

<!--
There is a specific pattern for writing client programs that work well with
Kubernetes called the {{< glossary_tooltip term_id="controller" text="controller" >}}
pattern. Controllers typically read an object's `.spec`, possibly do things, and then
update the object's `.status`.

A controller is a client of the Kubernetes API. When Kubernetes is the client and calls
out to a remote service, Kubernetes calls this a *webhook*. The remote service is called
a *webhook backend*. As with custom controllers, webhooks do add a point of failure.
-->
编写客户端程序有一种特殊的{{< glossary_tooltip term_id="controller" text="控制器（Controller）" >}}模式，
能够与 Kubernetes 很好地协同工作。控制器通常会读取某个对象的 `.spec`，或许还会执行一些操作，
之后更新对象的 `.status`。

控制器是 Kubernetes API 的客户端。当 Kubernetes 充当客户端且调用某远程服务时，
Kubernetes 将此称作 **Webhook**。该远程服务称作 **Webhook 后端**。
与定制的控制器相似，Webhook 也会引入失效点（Point of Failure）。

{{< note >}}
<!--
Outside of Kubernetes, the term “webhook” typically refers to a mechanism for asynchronous
notifications, where the webhook call serves as a one-way notification to another system or
component. In the Kubernetes ecosystem, even synchronous HTTP callouts are often
described as “webhooks”.
-->
在 Kubernetes 之外，“Webhook” 这个词通常是指一种异步通知机制，
其中 Webhook 调用将用作对另一个系统或组件的单向通知。
在 Kubernetes 生态系统中，甚至同步的 HTTP 调用也经常被描述为 “Webhook”。
{{< /note >}}

<!--
In the webhook model, Kubernetes makes a network request to a remote service.
With the alternative *binary Plugin* model, Kubernetes executes a binary (program).
Binary plugins are used by the kubelet (for example, [CSI storage plugins](https://kubernetes-csi.github.io/docs/)
and [CNI network plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)),
and by kubectl (see [Extend kubectl with plugins](/docs/tasks/extend-kubectl/kubectl-plugins/)).
-->
在 Webhook 模型中，Kubernetes 向远程服务发起网络请求。
在另一种称作**可执行文件插件（Binary Plugin）** 模型中，Kubernetes 执行某个可执行文件（程序）。
这些可执行文件插件由 kubelet（例如，[CSI 存储插件](https://kubernetes-csi.github.io/docs/)和
[CNI 网络插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)）
和 kubectl 使用。

<!--
### Extension points

This diagram shows the extension points in a Kubernetes cluster and the
clients that access it.
-->
### 扩展点   {#extension-points}

下图展示了 Kubernetes 集群中的这些扩展点及其访问集群的客户端。

<!-- image source: https://docs.google.com/drawings/d/1k2YdJgNTtNfW7_A8moIIkij-DmVgEhNrn3y2OODwqQQ/view -->

{{< figure src="/docs/concepts/extend-kubernetes/extension-points.png"
    alt="用符号表示的七个编号的 Kubernetes 扩展点"
    class="diagram-large" caption="Kubernetes 扩展点" >}}

<!--
#### Key to the figure
-->
#### 图示要点   {#key-to-the-figure}

<!--
1. Users often interact with the Kubernetes API using `kubectl`. [Plugins](#client-extensions)
   customise the behaviour of clients. There are generic extensions that can apply to different clients,
   as well as specific ways to extend `kubectl`.

1. The API server handles all requests. Several types of extension points in the API server allow
   authenticating requests, or blocking them based on their content, editing content, and handling
   deletion. These are described in the [API Access Extensions](#api-access-extensions) section.

1. The API server serves various kinds of *resources*. *Built-in resource kinds*, such as
   `pods`, are defined by the Kubernetes project and can't be changed.
   Read [API extensions](#api-extensions) to learn about extending the Kubernetes API.
-->
1. 用户通常使用 `kubectl` 与 Kubernetes API 交互。
   [插件](#client-extensions)定制客户端的行为。
   有一些通用的扩展可以应用到不同的客户端，还有一些特定的方式可以扩展 `kubectl`。

2. API 服务器处理所有请求。API 服务器中的几种扩展点能够使用户对请求执行身份认证、
   基于其内容阻止请求、编辑请求内容、处理删除操作等等。
   这些扩展点在 [API 访问扩展](#api-access-extensions)节详述。

3. API 服务器能提供各种类型的**资源（Resources）** 服务。
   诸如 `pods` 的**内置资源类型**是由 Kubernetes 项目所定义的，无法改变。
   请查阅 [API 扩展](#api-extensions)了解如何扩展 Kubernetes API。

<!--
1. The Kubernetes scheduler [decides](/docs/concepts/scheduling-eviction/assign-pod-node/)
   which nodes to place pods on. There are several ways to extend scheduling, which are
   described in the [Scheduling extensions](#scheduling-extensions) section.

1. Much of the behavior of Kubernetes is implemented by programs called
   {{< glossary_tooltip term_id="controller" text="controllers" >}}, that are
   clients of the API server. Controllers are often used in conjunction with custom resources.
   Read [combining new APIs with automation](#combining-new-apis-with-automation) and
   [Changing built-in resources](#changing-built-in-resources) to learn more.
-->
4. Kubernetes 调度器负责[决定](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)
   Pod 要放置到哪些节点上执行。有几种方式来扩展调度行为，这些方法将在[调度器扩展](#scheduling-extensions)节中展开说明。

5. Kubernetes 中的很多行为都是通过称为{{< glossary_tooltip term_id="controller" text="控制器（Controller）" >}}的程序来实现的，
   这些程序也都是 API 服务器的客户端。控制器常常与定制资源结合使用。
   进一步了解请查阅[结合使用新的 API 与自动化组件](#combining-new-apis-with-automation)和[更改内置资源](#changing-built-in-resources)。

<!--
1. The kubelet runs on servers (nodes), and helps pods appear like virtual servers with their own IPs on
   the cluster network. [Network Plugins](#network-plugins) allow for different implementations of
   pod networking.

1. You can use [Device Plugins](#device-plugins) to integrate custom hardware or other special
   node-local facilities, and make these available to Pods running in your cluster. The kubelet
   includes support for working with device plugins.

   The kubelet also mounts and unmounts
   {{< glossary_tooltip text="volume" term_id="volume" >}} for pods and their containers.
   You can use [Storage Plugins](#storage-plugins) to add support for new kinds
   of storage and other volume types.
-->
6. Kubelet 运行在各个服务器（节点）上，帮助 Pod 展现为虚拟的服务器并在集群网络中拥有自己的 IP。
   [网络插件](#network-plugins)使得 Kubernetes 能够采用不同实现技术来连接 Pod 网络。

7. 你可以使用[设备插件](#device-plugins)集成定制硬件或其他专用的节点本地设施，
   使得这些设施可用于集群中运行的 Pod。Kubelet 包括了对使用设备插件的支持。

   kubelet 也会为 Pod 及其容器增加或解除{{< glossary_tooltip text="卷" term_id="volume" >}}的挂载。
   你可以使用[存储插件](#storage-plugins)增加对新存储类别和其他卷类型的支持。

<!--
#### Extension point choice flowchart {#extension-flowchart}

If you are unsure where to start, this flowchart can help. Note that some solutions may involve
several types of extensions.
-->
#### 扩展点选择流程图   {#extension-flowchart}

如果你无法确定从何处入手，下面的流程图可能对你有些帮助。
注意，某些方案可能需要同时采用几种类型的扩展。

<!-- image source for flowchart: https://docs.google.com/drawings/d/1sdviU6lDz4BpnzJNHfNpQrqI9F19QZ07KnhnxVrp2yg/edit -->

{{< figure src="/zh-cn/docs/concepts/extend-kubernetes/flowchart.svg"
    alt="附带使用场景问题和实现指南的流程图。绿圈表示是；红圈表示否。"
    class="diagram-large" caption="选择一个扩展方式的流程图指导" >}}

---

<!--
## Client extensions

Plugins for kubectl are separate binaries that add or replace the behavior of specific subcommands.
The `kubectl` tool can also integrate with [credential plugins](/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins)
These extensions only affect a individual user's local environment, and so cannot enforce site-wide policies.

If you want to extend the `kubectl` tool, read [Extend kubectl with plugins](/docs/tasks/extend-kubectl/kubectl-plugins/).
-->
## 客户端扩展   {#client-extensions}

kubectl 所用的插件是单独的二进制文件，用于添加或替换特定子命令的行为。
`kubectl` 工具还可以与[凭据插件](/zh-cn/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins)集成。
这些扩展只影响单个用户的本地环境，因此不能强制执行站点范围的策略。

如果你要扩展 `kubectl` 工具，请阅读[用插件扩展 kubectl](/zh-cn/docs/tasks/extend-kubectl/kubectl-plugins/)。

<!--
## API extensions

### Custom resource definitions

Consider adding a _Custom Resource_ to Kubernetes if you want to define new controllers, application
configuration objects or other declarative APIs, and to manage them using Kubernetes tools, such
as `kubectl`.

For more about Custom Resources, see the
[Custom Resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/) concept guide.
-->
## API 扩展  {#api-extensions}

### 定制资源对象   {#custom-resource-definitions}

如果你想要定义新的控制器、应用配置对象或者其他声明式 API，并且使用 Kubernetes
工具（如 `kubectl`）来管理它们，可以考虑向 Kubernetes 添加**定制资源**。

关于定制资源的更多信息，可参见[定制资源概念指南](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)。

<!--
### API aggregation layer

You can use Kubernetes' [API Aggregation Layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
to integrate the Kubernetes API with additional services such as for [metrics](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/).
-->
### API 聚合层   {#api-aggregation-layer}

你可以使用 Kubernetes 的
[API 聚合层](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)将
Kubernetes API 与其他服务集成，例如[指标](/zh-cn/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)。

<!--
### Combining new APIs with automation

A combination of a custom resource API and a control loop is called the
{{< glossary_tooltip term_id="controller" text="controllers" >}} pattern. If your controller takes
the place of a human operator deploying infrastructure based on a desired state, then the controller
may also be following the {{< glossary_tooltip text="operator pattern" term_id="operator-pattern" >}}.
The Operator pattern is used to manage specific applications; usually, these are applications that
maintain state and require care in how they are managed.

You can also make your own custom APIs and control loops that manage other resources, such as storage,
or to define policies (such as an access control restriction).
-->
### 结合使用新 API 与自动化组件 {#combinding-new-apis-with-automation}

定制资源 API 与控制回路的组合称作{{< glossary_tooltip term_id="controller" text="控制器" >}}模式。
如果你的控制器代替人工操作员根据所需状态部署基础设施，那么控制器也可以遵循
{{<glossary_tooltip text="Operator 模式" term_id="operator-pattern" >}}。
Operator 模式用于管理特定的应用；通常，这些应用需要维护状态并需要仔细考虑状态的管理方式。

你还可以创建自己的定制 API 和控制回路来管理其他资源（例如存储）或定义策略（例如访问控制限制）。

<!--
### Changing built-in resources

When you extend the Kubernetes API by adding custom resources, the added resources always fall
into a new API Groups. You cannot replace or change existing API groups.
Adding an API does not directly let you affect the behavior of existing APIs (such as Pods), whereas
_API Access Extensions_ do.
-->
### 更改内置资源   {#changing-built-in-resources}

当你通过添加定制资源来扩展 Kubernetes 时，所添加的资源总是会被放在一个新的 API 组中。
你不可以替换或更改现有的 API 组。添加新的 API 不会直接让你影响现有
API（如 Pod）的行为，不过 **API 访问扩展**能够实现这点。

<!--
## API access extensions

When a request reaches the Kubernetes API Server, it is first _authenticated_, then _authorized_,
and is then subject to various types of _admission control_ (some requests are in fact not
authenticated, and get special treatment). See
[Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access/)
for more on this flow.

Each of the steps in the Kubernetes authentication / authorization flow offers extension points.
-->
## API 访问扩展    {#api-access-extensions}

当请求到达 Kubernetes API 服务器时，首先要经过**身份认证**，之后是**鉴权**操作，
再之后要经过若干类型的**准入控制**（某些请求实际上未通过身份认证，需要特殊处理）。
参见[控制 Kubernetes API 访问](/zh-cn/docs/concepts/security/controlling-access/)以了解此流程的细节。

Kubernetes 身份认证/授权流程中的每个步骤都提供了扩展点。

<!--
### Authentication

[Authentication](/docs/reference/access-authn-authz/authentication/) maps headers or certificates
in all requests to a username for the client making the request.

Kubernetes has several built-in authentication methods that it supports. It can also sit behind an
authenticating proxy, and it can send a token from an `Authorization:` header to a remote service for
verification (an [authentication webhook](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication))
if those don't meet your needs.
-->
### 身份认证    {#authentication}

[身份认证](/zh-cn/docs/reference/access-authn-authz/authentication/)负责将所有请求中的头部或证书映射到发出该请求的客户端的用户名。

Kubernetes 提供若干内置的身份认证方法。它也可以运行在某种身份认证代理的后面，
并且可以将来自 `Authorization:` 头部的令牌发送到某个远程服务
（[认证 Webhook](/zh-cn/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)
来执行验证操作，以备内置方法无法满足你的要求。

<!--
### Authorization

[Authorization](/docs/reference/access-authn-authz/authorization/) determines whether specific
users can read, write, and do other operations on API resources. It works at the level of whole
resources -- it doesn't discriminate based on arbitrary object fields.

If the built-in authorization options don't meet your needs, an
[authorization webhook](/docs/reference/access-authn-authz/webhook/)
allows calling out to custom code that makes an authorization decision.
-->
### 鉴权    {#authorization}

[鉴权](/zh-cn/docs/reference/access-authn-authz/authorization/)操作负责确定特定的用户是否可以读、写 API
资源或对其执行其他操作。此操作仅在整个资源集合的层面进行。
换言之，它不会基于对象的特定字段作出不同的判决。

如果内置的鉴权选项无法满足你的需要，
你可以使用[鉴权 Webhook](/zh-cn/docs/reference/access-authn-authz/webhook/)
来调用用户提供的代码，执行定制的鉴权决定。

<!--
### Dynamic admission control

After a request is authorized, if it is a write operation, it also goes through
[Admission Control](/docs/reference/access-authn-authz/admission-controllers/) steps.
In addition to the built-in steps, there are several extensions:

* The [Image Policy webhook](/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)
  restricts what images can be run in containers.
* To make arbitrary admission control decisions, a general
  [Admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
  can be used. Admission webhooks can reject creations or updates.
  Some admission webhooks modify the incoming request data before it is handled further by Kubernetes.
-->
### 动态准入控制  {#dynamic-admission-control}

请求的鉴权操作结束之后，如果请求的是写操作，
还会经过[准入控制](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)处理步骤。
除了内置的处理步骤，还存在一些扩展点：

* [镜像策略 Webhook](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)
  能够限制容器中可以运行哪些镜像。
* 为了执行任意的准入控制决定，
  可以使用一种通用的[准入 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
  机制。这类准入 Webhook 可以拒绝创建或更新请求。
  一些准入 Webhook 会先修改传入的请求数据，才会由 Kubernetes 进一步处理这些传入请求数据。

<!--
## Infrastructure extensions

### Device plugins

_Device plugins_ allow a node to discover new Node resources (in addition to the
builtin ones like cpu and memory) via a
[Device Plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/).
-->
## 基础设施扩展    {#infrastructure-extensions}

### 设备插件   {#device-plugins}

**设备插件**允许一个节点通过[设备插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)发现新的
Node 资源（除了内置的类似 CPU 和内存这类资源之外）。

<!--
### Storage plugins

{{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} (CSI) plugins provide
a way to extend Kubernetes with supports for new kinds of volumes. The volumes can be backed by
durable external storage, or provide ephemeral storage, or they might offer a read-only interface
to information using a filesystem paradigm.

Kubernetes also includes support for [FlexVolume](/docs/concepts/storage/volumes/#flexvolume) plugins,
which are deprecated since Kubernetes v1.23 (in favour of CSI).
-->
### 存储插件  {#storage-plugins}

{{< glossary_tooltip text="容器存储接口" term_id="csi" >}} (CSI) 插件提供了一种扩展
Kubernetes 的方式使其支持新类别的卷。
这些卷可以由持久的外部存储提供支持，可以提供临时存储，还可以使用文件系统范型为信息提供只读接口。

Kubernetes 还包括对 [FlexVolume](/zh-cn/docs/concepts/storage/volumes/#flexvolume)
插件的支持，该插件自 Kubernetes v1.23 起被弃用（被 CSI 替代）。

<!--
FlexVolume plugins allow users to mount volume types that aren't natively supported by Kubernetes. When
you run a Pod that relies on FlexVolume storage, the kubelet calls a binary plugin to mount the volume.
The archived [FlexVolume](https://git.k8s.io/design-proposals-archive/storage/flexvolume-deployment.md)
design proposal has more detail on this approach.

The [Kubernetes Volume Plugin FAQ for Storage Vendors](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors)
includes general information on storage plugins.
-->
FlexVolume 插件允许用户挂载 Kubernetes 本身不支持的卷类型。
当你运行依赖于 FlexVolume 存储的 Pod 时，kubelet 会调用一个二进制插件来挂载该卷。
归档的 [FlexVolume](https://git.k8s.io/design-proposals-archive/storage/flexvolume-deployment.md)
设计提案对此方法有更多详细说明。

[Kubernetes 存储供应商的卷插件 FAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors)
包含了有关存储插件的通用信息。

<!--
### Network plugins

Your Kubernetes cluster needs a _network plugin_ in order to have a working Pod network
and to support other aspects of the Kubernetes network model.

[Network Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
allow Kubernetes to work with different networking topologies and technologies.
-->
### 网络插件   {#network-plugins}

你的 Kubernetes 集群需要一个**网络插件**才能拥有一个正常工作的 Pod 网络，
才能支持 Kubernetes 网络模型的其他方面。

[网络插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)可以让
Kubernetes 使用不同的网络拓扑和技术。

<!--
### Kubelet image credential provider plugins

{{< feature-state for_k8s_version="v1.26" state="stable" >}}
Kubelet image credential providers are plugins for the kubelet to dynamically retrieve image registry
credentials. The credentials are then used when pulling images from container image registries that
match the configuration.

The plugins can communicate with external services or use local files to obtain credentials. This way,
the kubelet does not need to have static credentials for each registry, and can support various
authentication methods and protocols.

For plugin configuration details, see
[Configure a kubelet image credential provider](/docs/tasks/administer-cluster/kubelet-credential-provider/).
-->
### Kubelet 镜像凭据提供程序插件   {#kubelet-image-credential-provider-plugins}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}
Kubelet 镜像凭据提供程序是 Kubelet 动态检索镜像仓库凭据的插件。
当你从与配置匹配的容器镜像仓库中拉取镜像时，这些凭据将被使用。

这些插件可以与外部服务通信或使用本地文件来获取凭据。这样，kubelet
就不需要为每个仓库都设置静态凭据，并且可以支持各种身份验证方法和协议。

有关插件配置的详细信息，请参阅
[配置 kubelet 镜像凭据提供程序](/zh-cn/docs/tasks/administer-cluster/kubelet-credential-provider/)。

<!--
## Scheduling extensions

The scheduler is a special type of controller that watches pods, and assigns
pods to nodes. The default scheduler can be replaced entirely, while
continuing to use other Kubernetes components, or
[multiple schedulers](/docs/tasks/extend-kubernetes/configure-multiple-schedulers/)
can run at the same time.

This is a significant undertaking, and almost all Kubernetes users find they
do not need to modify the scheduler.
-->
## 调度扩展   {#scheduling-extensions}

调度器是一种特殊的控制器，负责监视 Pod 变化并将 Pod 分派给节点。
默认的调度器可以被整体替换掉，同时继续使用其他 Kubernetes 组件。
或者也可以在同一时刻使用[多个调度器](/zh-cn/docs/tasks/extend-kubernetes/configure-multiple-schedulers/)。

这是一项非同小可的任务，几乎绝大多数 Kubernetes
用户都会发现其实他们不需要修改调度器。

<!--
You can control which [scheduling plugins](/docs/reference/scheduling/config/#scheduling-plugins)
are active, or associate sets of plugins with different named [scheduler profiles](/docs/reference/scheduling/config/#multiple-profiles).
You can also write your own plugin that integrates with one or more of the kube-scheduler's
[extension points](/docs/concepts/scheduling-eviction/scheduling-framework/#extension-points).

Finally, the built in `kube-scheduler` component supports a
[webhook](https://git.k8s.io/design-proposals-archive/scheduling/scheduler_extender.md)
that permits a remote HTTP backend (scheduler extension) to filter and / or prioritize
the nodes that the kube-scheduler chooses for a pod.
-->
你可以控制哪些[调度插件](/zh-cn/docs/reference/scheduling/config/#scheduling-plugins)处于激活状态，
或将插件集关联到名字不同的[调度器配置文件](/zh-cn/docs/reference/scheduling/config/#multiple-profiles)上。
你还可以编写自己的插件，与一个或多个 kube-scheduler
的[扩展点](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/#extension-points)集成。

最后，内置的 `kube-scheduler` 组件支持
[Webhook](https://git.k8s.io/design-proposals-archive/scheduling/scheduler_extender.md)，
从而允许远程 HTTP 后端（调度器扩展）来为 kube-scheduler 选择的 Pod 所在节点执行过滤和优先排序操作。

{{< note >}}
<!--
You can only affect node filtering
and node prioritization with a scheduler extender webhook; other extension points are
not available through the webhook integration.
-->
你只能使用调度器扩展程序 Webhook 来影响节点过滤和节点优先排序；
其他扩展点无法通过集成 Webhook 获得。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
* Learn more about infrastructure extensions
  * [Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  * [Network Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
  * CSI [storage plugins](https://kubernetes-csi.github.io/docs/)
* Learn about [kubectl plugins](/docs/tasks/extend-kubectl/kubectl-plugins/)
* Learn more about [Custom Resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
* Learn more about [Extension API Servers](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
* Learn about [Dynamic admission control](/docs/reference/access-authn-authz/extensible-admission-controllers/)
* Learn about the [Operator pattern](/docs/concepts/extend-kubernetes/operator/)
-->
* 进一步了解基础设施扩展
  * [设备插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  * [网络插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
  * CSI [存储插件](https://kubernetes-csi.github.io/docs/)
* 进一步了解 [kubectl 插件](/zh-cn/docs/tasks/extend-kubectl/kubectl-plugins/)
* 进一步了解[定制资源](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
* 进一步了解[扩展 API 服务器](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
* 进一步了解[动态准入控制](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)
* 进一步了解 [Operator 模式](/zh-cn/docs/concepts/extend-kubernetes/operator/)
