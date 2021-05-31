---
title: 扩展 Kubernetes
weight: 110
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
weight: 110
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
Kubernetes is highly configurable and extensible. As a result,
there is rarely a need to fork or submit patches to the Kubernetes
project code.

This guide describes the options for customizing a Kubernetes
cluster. It is aimed at {{< glossary_tooltip text="cluster operators" term_id="cluster-operator" >}} who want to
understand how to adapt their Kubernetes cluster to the needs of
their work environment. Developers who are prospective {{< glossary_tooltip text="Platform Developers" term_id="platform-developer" >}} or Kubernetes Project {{< glossary_tooltip text="Contributors" term_id="contributor" >}} will also find it
useful as an introduction to what extension points and patterns
exist, and their trade-offs and limitations.
-->
Kubernetes 是高度可配置且可扩展的。因此，大多数情况下，你不需要
派生自己的 Kubernetes 副本或者向项目代码提交补丁。

本指南描述定制 Kubernetes 的可选方式。主要针对的读者是希望了解如何针对自身工作环境
需要来调整 Kubernetes 的{{< glossary_tooltip text="集群管理者" term_id="cluster-operator" >}}。
对于那些充当{{< glossary_tooltip text="平台开发人员" term_id="platform-developer" >}}
的开发人员或 Kubernetes 项目的{{< glossary_tooltip text="贡献者" term_id="contributor" >}}
而言，他们也会在本指南中找到有用的介绍信息，了解系统中存在哪些扩展点和扩展模式，
以及它们所附带的各种权衡和约束等等。

<!-- body -->

<!--
## Overview

Customization approaches can be broadly divided into *configuration*, which only involves changing flags, local configuration files, or API resources; and *extensions*, which involve running additional programs or services. This document is primarily about extensions.
-->
## 概述  {#overview}

定制化的方法主要可分为 *配置（Configuration）* 和 *扩展（Extensions）* 两种。
前者主要涉及改变参数标志、本地配置文件或者 API 资源；
后者则需要额外运行一些程序或服务。
本文主要关注扩展。

<!--
## Configuration

*Configuration files* and *flags* are documented in the Reference section of the online documentation, under each binary:

* [kubelet](/docs/reference/command-line-tools-reference/kubelet/)
* [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/)
* [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/)
* [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/).
-->

## Configuration

*配置文件*和*参数标志*的说明位于在线文档的参考章节，按可执行文件组织：

* [kubelet](/zh/docs/reference/command-line-tools-reference/kubelet/)
* [kube-apiserver](/zh/docs/reference/command-line-tools-reference/kube-apiserver/)
* [kube-controller-manager](/zh/docs/reference/command-line-tools-reference/kube-controller-manager/)
* [kube-scheduler](/zh/docs/reference/command-line-tools-reference/kube-scheduler/).

<!--
Flags and configuration files may not always be changeable in a hosted Kubernetes service or a distribution with managed installation. When they are changeable, they are usually only changeable by the cluster administrator. Also, they are subject to change in future Kubernetes versions, and setting them may require restarting processes. For those reasons, they should be used only when there are no other options.
-->
在托管的 Kubernetes 服务中或者受控安装的发行版本中，参数标志和配置文件不总是可以
修改的。即使它们是可修改的，通常其修改权限也仅限于集群管理员。
此外，这些内容在将来的 Kubernetes 版本中很可能发生变化，设置新参数或配置文件可能
需要重启进程。
有鉴于此，通常应该在没有其他替代方案时才应考虑更改参数标志和配置文件。

<!--
*Built-in Policy APIs*, such as [ResourceQuota](/docs/concepts/policy/resource-quotas/), [PodSecurityPolicies](/docs/concepts/policy/pod-security-policy/), [NetworkPolicy](/docs/concepts/services-networking/network-policies/) and Role-based Access Control ([RBAC](/docs/reference/access-authn-authz/rbac/)), are built-in Kubernetes APIs. APIs are typically used with hosted Kubernetes services and with managed Kubernetes installations. They are declarative and use the same conventions as other Kubernetes resources like pods, so new cluster configuration can be repeatable and be managed the same way as applications. And, where they are stable, they enjoy a [defined support policy](/docs/reference/deprecation-policy/) like other Kubernetes APIs. For these reasons, they are preferred over *configuration files* and *flags* where suitable.
-->
*内置的策略 API*，例如[ResourceQuota](/zh/docs/concepts/policy/resource-quotas/)、
[PodSecurityPolicies](/zh/docs/concepts/policy/pod-security-policy/)、
[NetworkPolicy](/zh/docs/concepts/services-networking/network-policies/)
和基于角色的访问控制（[RBAC](/zh/docs/reference/access-authn-authz/rbac/)）等等
都是内置的 Kubernetes API。
API 通常用于托管的 Kubernetes 服务和受控的 Kubernetes 安装环境中。
这些 API 是声明式的，与 Pod 这类其他 Kubernetes 资源遵从相同的约定，所以
新的集群配置是可复用的，并且可以当作应用程序来管理。
此外，对于稳定版本的 API 而言，它们与其他 Kubernetes API 一样，采纳的是
一种[预定义的支持策略](/zh/docs/reference/using-api/deprecation-policy/)。
出于以上原因，在条件允许的情况下，基于 API 的方案应该优先于*配置文件*和*参数标志*。

<!--
## Extensions

Extensions are software components that extend and deeply integrate with Kubernetes.
They adapt it to support new types and new kinds of hardware.

Most cluster administrators will use a hosted or distribution
instance of Kubernetes. As a result, most Kubernetes users will not need to
install extensions and fewer will need to author new ones.
-->
## 扩展    {#extensions}

扩展（Extensions）是一些扩充 Kubernetes 能力并与之深度集成的软件组件。
它们调整 Kubernetes 的工作方式使之支持新的类型和新的硬件种类。

大多数集群管理员会使用一种托管的 Kubernetes 服务或者其某种发行版本。
因此，大多数 Kubernetes 用户不需要安装扩展，
至于需要自己编写新的扩展的情况就更少了。

<!--
## Extension Patterns

Kubernetes is designed to be automated by writing client programs. Any
program that reads and/or writes to the Kubernetes API can provide useful
automation. *Automation* can run on the cluster or off it. By following
the guidance in this doc you can write highly available and robust automation.
Automation generally works with any Kubernetes cluster, including hosted
clusters and managed installations.
-->
## 扩展模式   {#extension-patterns}

Kubernetes 从设计上即支持通过编写客户端程序来将其操作自动化。
任何能够对 Kubernetes API 发出读写指令的程序都可以提供有用的自动化能力。
*自动化组件*可以运行在集群上，也可以运行在集群之外。
通过遵从本文中的指南，你可以编写高度可用的、运行稳定的自动化组件。
自动化组件通常可以用于所有 Kubernetes 集群，包括托管的集群和受控的安装环境。

<!--
There is a specific pattern for writing client programs that work well with
Kubernetes called the *Controller* pattern. Controllers typically read an
object's `.spec`, possibly do things, and then update the object's `.status`.

A controller is a client of Kubernetes. When Kubernetes is the client and
calls out to a remote service, it is called a *Webhook*. The remote service
is called a *Webhook Backend*. Like Controllers, Webhooks do add a point of
failure.
-->
编写客户端程序有一种特殊的*Controller（控制器）*模式，能够与 Kubernetes 很好地
协同工作。控制器通常会读取某个对象的 `.spec`，或许还会执行一些操作，之后更新
对象的 `.status`。

控制器是 Kubernetes 的客户端。当 Kubernetes 充当客户端，调用某远程服务时，对应
的远程组件称作*Webhook*。 远程服务称作*Webhook 后端*。 
与控制器模式相似，Webhook 也会在整个架构中引入新的失效点（Point of Failure）。

<!--
In the webhook model, Kubernetes makes a network request to a remote service.
In the *Binary Plugin* model, Kubernetes executes a binary (program).
Binary plugins are used by the kubelet (e.g. [Flex Volume
Plugins](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md)
and [Network
Plugins](/docs/concepts/cluster-administration/network-plugins/))
and by kubectl.

Below is a diagram showing how the extension points interact with the
Kubernetes control plane.
-->
在 Webhook 模式中，Kubernetes 向远程服务发起网络请求。
在*可执行文件插件（Binary Plugin）*模式中，Kubernetes 执行某个可执行文件（程序）。
可执行文件插件在 kubelet （例如，
[FlexVolume 插件](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md)
和[网络插件](/zh/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)）
和 kubectl 中使用。

下面的示意图中展示了这些扩展点如何与 Kubernetes 控制面交互。

<!-- image source drawing https://docs.google.com/drawings/d/1muJ7Oxuj_7Gtv7HV9-2zJbOnkQJnjxq-v1ym_kZfB-4/edit?ts=5a01e054 -->
<!--
![Extension Points and the Control Plane](/docs/concepts/extend-kubernetes/control-plane.png)
-->
![扩展点与控制面](/docs/concepts/extend-kubernetes/control-plane.png)

<!--
## Extension Points

This diagram shows the extension points in a Kubernetes system.
-->
## 扩展点   {#extension-points}

此示意图显示的是 Kubernetes 系统中的扩展点。

<!-- image source diagrams: https://docs.google.com/drawings/d/1k2YdJgNTtNfW7_A8moIIkij-DmVgEhNrn3y2OODwqQQ/view -->
<!--
![Extension Points](/docs/concepts/extend-kubernetes/extension-points.png)
-->
![扩展点](/docs/concepts/extend-kubernetes/extension-points.png)

<!--
1.   Users often interact with the Kubernetes API using `kubectl`. [Kubectl plugins](/docs/tasks/extend-kubectl/kubectl-plugins/) extend the kubectl binary. They only affect the individual user's local environment, and so cannot enforce site-wide policies.
2.   The apiserver handles all requests. Several types of extension points in the apiserver allow authenticating requests, or blocking them based on their content, editing content, and handling deletion. These are described in the [API Access Extensions](#api-access-extensions) section.
3.   The apiserver serves various kinds of *resources*. *Built-in resource kinds*, like `pods`, are defined by the Kubernetes project and can't be changed. You can also add resources that you define, or that other projects have defined, called *Custom Resources*, as explained in the [Custom Resources](#user-defined-types) section. Custom Resources are often used with API Access Extensions.
4.   The Kubernetes scheduler decides which nodes to place pods on. There are several ways to extend scheduling. These are described in the [Scheduler Extensions](#scheduler-extensions) section.
5.   Much of the behavior of Kubernetes is implemented by programs called Controllers which are clients of the API-Server. Controllers are often used in conjunction with Custom Resources.
6.   The kubelet runs on servers, and helps pods appear like virtual servers with their own IPs on the cluster network. [Network Plugins](#network-plugins) allow for different implementations of pod networking.
7.  The kubelet also mounts and unmounts volumes for containers. New types of storage can be supported via [Storage Plugins](#storage-plugins).

If you are unsure where to start, this flowchart can help. Note that some solutions may involve several types of extensions.
-->
1. 用户通常使用 `kubectl` 与 Kubernetes API 交互。
   [kubectl 插件](/zh/docs/tasks/extend-kubectl/kubectl-plugins/)能够扩展 kubectl 程序的行为。
   这些插件只会影响到每个用户的本地环境，因此无法用来强制实施整个站点范围的策略。

2. API 服务器处理所有请求。API 服务器中的几种扩展点能够使用户对请求执行身份认证、
   基于其内容阻止请求、编辑请求内容、处理删除操作等等。
   这些扩展点在 [API 访问扩展](#api-access-extensions)
   节详述。

3. API 服务器向外提供不同类型的*资源（resources）*。
   *内置的资源类型*，如 `pods`，是由 Kubernetes 项目所定义的，无法改变。
   你也可以添加自己定义的或者其他项目所定义的称作*自定义资源（Custom Resources）*
   的资源，正如[自定义资源](#user-defined-types)节所描述的那样。
   自定义资源通常与 API 访问扩展点结合使用。

4. Kubernetes 调度器负责决定 Pod 要放置到哪些节点上执行。
   有几种方式来扩展调度行为。这些方法将在
   [调度器扩展](#scheduler-extensions)节中展开。

5. Kubernetes 中的很多行为都是通过称为控制器（Controllers）的程序来实现的，这些程序也都是 API 服务器
   的客户端。控制器常常与自定义资源结合使用。

6. 组件 kubelet 运行在各个节点上，帮助 Pod 展现为虚拟的服务器并在集群网络中拥有自己的 IP。
   [网络插件](#network-plugins)使得 Kubernetes 能够采用
   不同实现技术来连接 Pod 网络。

7. 组件 kubelet 也会为容器增加或解除存储卷的挂载。
   通过[存储插件](#storage-plugins)，可以支持新的存储类型。

如果你无法确定从何处入手，下面的流程图可能对你有些帮助。
注意，某些方案可能需要同时采用几种类型的扩展。

<!-- image source drawing: https://docs.google.com/drawings/d/1sdviU6lDz4BpnzJNHfNpQrqI9F19QZ07KnhnxVrp2yg/edit -->
<!--
![Flowchart for Extension](/docs/concepts/extend-kubernetes/flowchart.png)
-->
![扩展流程图](/docs/concepts/extend-kubernetes/flowchart.png)

<!--
## API Extensions

### User-Defined Types

Consider adding a Custom Resource to Kubernetes if you want to define new controllers, application configuration objects or other declarative APIs, and to manage them using Kubernetes tools, such as `kubectl`.

Do not use a Custom Resource as data storage for application, user, or monitoring data.

For more about Custom Resources, see the [Custom Resources concept guide](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).
-->
## API 扩展  {#api-extensions}

### 用户定义的类型   {#user-defined-types}

如果你想要定义新的控制器、应用配置对象或者其他声明式 API，并且使用 Kubernetes
工具（如 `kubectl`）来管理它们，可以考虑向 Kubernetes 添加自定义资源。

不要使用自定义资源来充当应用、用户或者监控数据的数据存储。

关于自定义资源的更多信息，可参见[自定义资源概念指南](/zh/docs/concepts/extend-kubernetes/api-extension/custom-resources/)。

<!--
### Combining New APIs with Automation

The combination of a custom resource API and a control loop is called the [Operator pattern](/docs/concepts/extend-kubernetes/operator/). The Operator pattern is used to manage specific, usually stateful, applications. These custom APIs and control loops can also be used to control other resources, such as storage or policies.
-->
### 结合使用新 API 与自动化组件 {#combinding-new-apis-with-automation}

自定义资源 API 与控制回路的组合称作
[Operator 模式](/zh/docs/concepts/extend-kubernetes/operator/)。
Operator 模式用来管理特定的、通常是有状态的应用。
这些自定义 API 和控制回路也可用来控制其他资源，如存储或策略。

<!--
### Changing Built-in Resources

When you extend the Kubernetes API by adding custom resources, the added resources always fall into a new API Groups. You cannot replace or change existing API groups.
Adding an API does not directly let you affect the behavior of existing APIs (e.g. Pods), but API Access Extensions do.
-->
### 更改内置资源   {#changing-built-in-resources}

当你通过添加自定义资源来扩展 Kubernetes 时，所添加的资源通常会被放在一个新的
API 组中。你不可以替换或更改现有的 API 组。
添加新的 API 不会直接让你影响现有 API （如 Pods）的行为，不过 API
访问扩展能够实现这点。

<!--
### API Access Extensions

When a request reaches the Kubernetes API Server, it is first Authenticated, then Authorized, then subject to various types of Admission Control. See [Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access/) for more on this flow.

Each of these steps offers extension points.

Kubernetes has several built-in authentication methods that it supports. It can also sit behind an authenticating proxy, and it can send a token from an Authorization header to a remote service for verification (a webhook). All of these methods are covered in the [Authentication documentation](/docs/reference/access-authn-authz/authentication/).
-->
### API 访问扩展    {#api-access-extensions}

当请求到达 Kubernetes API 服务器时，首先要经过身份认证，之后是鉴权操作，
再之后要经过若干类型的准入控制器的检查。
参见[控制 Kubernetes API 访问](/zh/docs/concepts/security/controlling-access/)
以了解此流程的细节。

这些步骤中都存在扩展点。

Kubernetes 提供若干内置的身份认证方法。
它也可以运行在某中身份认证代理的后面，并且可以将来自鉴权头部的令牌发送到
某个远程服务（Webhook）来执行验证操作。
所有这些方法都在[身份认证文档](/zh/docs/reference/access-authn-authz/authentication/)
中有详细论述。

<!--
### Authentication

[Authentication](/docs/reference/access-authn-authz/authentication/) maps headers or certificates in all requests to a username for the client making the request.

Kubernetes provides several built-in authentication methods, and an [Authentication webhook](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication) method if those don't meet your needs.
-->
### 身份认证    {#authentication}

[身份认证](/zh/docs/reference/access-authn-authz/authentication/)负责将所有请求中
的头部或证书映射到发出该请求的客户端的用户名。

Kubernetes 提供若干种内置的认证方法，以及
[认证 Webhook](/zh/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)
方法以备内置方法无法满足你的要求。

<!--
### Authorization

[Authorization](/docs/reference/access-authn-authz/webhook/) determines whether specific users can read, write, and do other operations on API resources. It works at the level of whole resources - it doesn't discriminate based on arbitrary object fields. If the built-in authorization options don't meet your needs, and [Authorization webhook](/docs/reference/access-authn-authz/webhook/) allows calling out to user-provided code to make an authorization decision.
-->
### 鉴权    {#authorization}

[鉴权](/zh/docs/reference/access-authn-authz/webhook/)操作负责确定特定的用户
是否可以读、写 API 资源或对其执行其他操作。
此操作仅在整个资源集合的层面进行。
换言之，它不会基于对象的特定字段作出不同的判决。
如果内置的鉴权选项无法满足你的需要，你可以使用
[鉴权 Webhook](/zh/docs/reference/access-authn-authz/webhook/)来调用用户提供
的代码，执行定制的鉴权操作。

<!--
### Dynamic Admission Control

After a request is authorized, if it is a write operation, it also goes through [Admission Control](/docs/reference/access-authn-authz/admission-controllers/) steps. In addition to the built-in steps, there are several extensions:

*   The [Image Policy webhook](/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook) restricts what images can be run in containers.
*   To make arbitrary admission control decisions, a general [Admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks) can be used. Admission Webhooks can reject creations or updates.
-->
### 动态准入控制  {#dynamic-admission-control}

请求的鉴权操作结束之后，如果请求的是写操作，还会经过
[准入控制](/zh/docs/reference/access-authn-authz/admission-controllers/)处理步骤。
除了内置的处理步骤，还存在一些扩展点：

* [Image Policy webhook](/zh/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)
  能够限制容器中可以运行哪些镜像。
* 为了执行任意的准入控制，可以使用一种通用的
  [Admission webhook](/zh/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks) 
  机制。这类 Webhook 可以拒绝对象创建或更新请求。

<!--
## Infrastructure Extensions

### Storage Plugins

[Flex Volumes](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/flexvolume-deployment.md
) allow users to mount volume types without built-in support by having the
Kubelet call a Binary Plugin to mount the volume.
-->
## 基础设施扩展    {#infrastructure-extensions}

### 存储插件  {#storage-plugins}

[FlexVolumes](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/flexvolume-deployment.md
)
卷可以让用户挂载无需内建支持的卷类型，kubelet 会调用可执行文件插件
来挂载对应的存储卷。

<!--
### Device Plugins

Device plugins allow a node to discover new Node resources (in addition to the
builtin ones like cpu and memory) via a [Device
Plugin](/docs/concepts/cluster-administration/device-plugins/).

### Network Plugins

Different networking fabrics can be supported via node-level [Network Plugins](/docs/admin/network-plugins/).
-->
### 设备插件    {#device-plugins}

使用[设备插件](/zh/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)，
节点能够发现新的节点资源（除了内置的类似 CPU 和内存这类资源）。

### 网络插件   {#network-plugins}

通过节点层面的[网络插件](/zh/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)，可以支持
不同的网络设施。

<!--
### Scheduler Extensions

The scheduler is a special type of controller that watches pods, and assigns
pods to nodes. The default scheduler can be replaced entirely, while
continuing to use other Kubernetes components, or
[multiple schedulers](/docs/tasks/extend-kubernetes/configure-multiple-schedulers/)
can run at the same time.

This is a significant undertaking, and almost all Kubernetes users find they
do not need to modify the scheduler.

The scheduler also supports a
[webhook](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/scheduler_extender.md)
that permits a webhook backend (scheduler extension) to filter and prioritize
the nodes chosen for a pod.
-->
### 调度器扩展   {#scheduler-extensions}

调度器是一种特殊的控制器，负责监视 Pod 变化并将 Pod 分派给节点。
默认的调度器可以被整体替换掉，同时继续使用其他 Kubernetes 组件。
或者也可以在同一时刻使用
[多个调度器](/zh/docs/tasks/extend-kubernetes/configure-multiple-schedulers/)。

这是一项非同小可的任务，几乎绝大多数 Kubernetes
用户都会发现其实他们不需要修改调度器。

调度器也支持一种
[Webhook](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/scheduler_extender.md)，
允许使用某种 Webhook 后端（调度器扩展）来为 Pod 可选的节点执行过滤和优先排序操作。


## {{% heading "whatsnext" %}}

<!--
* Learn more about [Custom Resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
* Learn about [Dynamic admission control](/docs/reference/access-authn-authz/extensible-admission-controllers/)
* Learn more about Infrastructure extensions
  * [Network Plugins](/docs/concepts/cluster-administration/network-plugins/)
  * [Device Plugins](/docs/concepts/cluster-administration/device-plugins/)
* Learn about [kubectl plugins](/docs/tasks/extend-kubectl/kubectl-plugins/)
* Learn about the [Operator pattern](/docs/concepts/extend-kubernetes/operator/)
-->
* 进一步了解[自定义资源](/zh/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
* 了解[动态准入控制](/zh/docs/reference/access-authn-authz/extensible-admission-controllers/)
* 进一步了解基础设施扩展
  * [网络插件](/zh/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
  * [设备插件](/zh/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
* 了解 [kubectl 插件](/zh/docs/tasks/extend-kubectl/kubectl-plugins/)
* 了解 [Operator 模式](/zh/docs/concepts/extend-kubernetes/operator/)


