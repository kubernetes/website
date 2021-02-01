---
title: 扩展 Kubernetes 集群
content_type: concept
weight: 10
---
<!--
title: Extending your Kubernetes Cluster
reviewers:
- erictune
- lavalamp
- cheftako
- chenopis
content_type: concept
weight: 10
-->

<!-- overview -->

<!--
Kubernetes is highly configurable and extensible. As a result,
there is rarely a need to fork or submit patches to the Kubernetes
project code.

This guide describes the options for customizing a Kubernetes cluster. It is
aimed at {{< glossary_tooltip text="cluster operators" term_id="cluster-operator" >}}
who want to understand how to adapt their
Kubernetes cluster to the needs of their work environment. Developers who are prospective
{{< glossary_tooltip text="Platform Developers" term_id="platform-developer" >}}
or Kubernetes Project {{< glossary_tooltip text="Contributors" term_id="contributor" >}}
will also find it useful as an introduction to what extension points and
patterns exist, and their trade-offs and limitations.
-->
Kubernetes 是高度可配置和可扩展的。因此，极少需要分发或提交补丁代码给 Kubernetes 项目。

本文档介绍自定义 Kubernetes 集群的选项。本文档的目标读者包括希望了解如何使
Kubernetes 集群满足其业务环境需求的
{{< glossary_tooltip text="集群运维人员" term_id="cluster-operator" >}}、
Kubernetes 项目的{{< glossary_tooltip text="贡献者" term_id="contributor" >}}。
或潜在的{{< glossary_tooltip text="平台开发人员" term_id="platform-developer" >}}
也可以从本文找到有用的信息，如对已存在扩展点和模式的介绍，以及它们的权衡和限制。 

<!-- body -->

<!--
## Overview

Customization approaches can be broadly divided into *configuration*, which only involves changing flags, local configuration files, or API resources; and *extensions*, which involve running additional programs or services. This document is primarily about extensions.
-->
## 概述

定制方法可以大致分为 *配置（Configuration）* 和 *扩展（Extension）* 。
*配置* 只涉及更改标志参数、本地配置文件或 API 资源；
*扩展* 涉及运行额外的程序或服务。本文档主要内容是关于扩展。

<!--
## Configuration

*Configuration files* and *flags* are documented in the Reference section of the online documentation, under each binary:

* [kubelet](/docs/reference/command-line-tools-reference/kubelet/)
* [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/)
* [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/)
* [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/).
-->
## 配置  {#configuration}

关于 *配置文件* 和 *标志* 的说明文档位于在线文档的"参考"部分，按照可执行文件组织：

* [kubelet](/zh/docs/reference/command-line-tools-reference/kubelet/)
* [kube-apiserver](/zh/docs/reference/command-line-tools-reference/kube-apiserver/)
* [kube-controller-manager](/zh/docs/reference/command-line-tools-reference/kube-controller-manager/)
* [kube-scheduler](/zh/docs/reference/command-line-tools-reference/kube-scheduler/).

<!--
Flags and configuration files may not always be changeable in a hosted Kubernetes service or a distribution with managed installation. When they are changeable, they are usually only changeable by the cluster administrator. Also, they are subject to change in future Kubernetes versions, and setting them may require restarting processes. For those reasons, they should be used only when there are no other options.
-->
在托管的 Kubernetes 服务或受控安装的 Kubernetes 版本中，标志和配置文件可能并不总是可以更改的。而且当它们可以进行更改时，它们通常只能由集群管理员进行更改。此外，标志和配置文件在未来的 Kubernetes 版本中可能会发生变化，并且更改设置后它们可能需要重新启动进程。出于这些原因，只有在没有其他选择的情况下才使用它们。

<!--
*Built-in Policy APIs*, such as [ResourceQuota](/docs/concepts/policy/resource-quotas/), [PodSecurityPolicies](/docs/concepts/policy/pod-security-policy/), [NetworkPolicy](/docs/concepts/services-networking/network-policies/) and Role-based Access Control ([RBAC](/docs/reference/access-authn-authz/rbac/)), are built-in Kubernetes APIs. APIs are typically used with hosted Kubernetes services and with managed Kubernetes installations. They are declarative and use the same conventions as other Kubernetes resources like pods, so new cluster configuration can be repeatable and be managed the same way as applications. And, where they are stable, they enjoy a [defined support policy](/docs/reference/using-api/deprecation-policy/) like other Kubernetes APIs. For these reasons, they are preferred over *configuration files* and *flags* where suitable.
-->
*内置策略 API* ，例如 [ResourceQuota](/zh/docs/concepts/policy/resource-quotas/)、
[PodSecurityPolicy](/zh/docs/concepts/policy/pod-security-policy/)、
[NetworkPolicy](/zh/docs/concepts/services-networking/network-policies/)
和基于角色的权限控制 ([RBAC](/zh/docs/reference/access-authn-authz/rbac/))，
是内置的 Kubernetes API。API 通常与托管的 Kubernetes 服务和受控的 Kubernetes 安装一起使用。
它们是声明性的，并使用与其他 Kubernetes 资源（如 Pod ）相同的约定，所以新的集群配置可以重复使用，
并以与应用程序相同的方式进行管理。
而且，当它们变稳定后，也遵循和其他 Kubernetes API 一样的
[支持政策](/zh/docs/reference/using-api/deprecation-policy/)。
出于这些原因，在合适的情况下它们优先于 *配置文件* 和 *标志* 被使用。

<!--
## Extensions

Extensions are software components that extend and deeply integrate with Kubernetes.
They adapt it to support new types and new kinds of hardware.

Most cluster administrators will use a hosted or distribution
instance of Kubernetes. As a result, most Kubernetes users will not need to
install extensions and fewer will need to author new ones.
-->
## 扩展程序  {#extension}

扩展程序是指对 Kubernetes 进行扩展和深度集成的软件组件。它们适合用于支持新的类型和新型硬件。

大多数集群管理员会使用托管的或统一分发的 Kubernetes 实例。
因此，大多数 Kubernetes 用户不需要安装扩展程序，而且还有少部分用户甚至需要编写新的扩展程序。

<!--
## Extension Patterns
-->
## 扩展模式  {#extension-patterns}

<!--
Kubernetes is designed to be automated by writing client programs. Any
program that reads and/or writes to the Kubernetes API can provide useful
automation. *Automation* can run on the cluster or off it. By following
the guidance in this doc you can write highly available and robust automation.
Automation generally works with any Kubernetes cluster, including hosted
clusters and managed installations.
-->
Kubernetes 的设计是通过编写客户端程序来实现自动化的。
任何读和（或）写 Kubernetes API 的程序都可以提供有用的自动化工作。
*自动化* 程序可以运行在集群之中或之外。按照本文档的指导，你可以编写出高可用的和健壮的自动化程序。
自动化程序通常适用于任何 Kubernetes 集群，包括托管集群和受管理安装的集群。

<!--
There is a specific pattern for writing client programs that work well with
Kubernetes called the *Controller* pattern. Controllers typically read an
object's `.spec`, possibly do things, and then update the object's `.status`.

A controller is a client of Kubernetes. When Kubernetes is the client and
calls out to a remote service, it is called a *Webhook*. The remote service
is called a *Webhook Backend*. Like Controllers, Webhooks do add a point of
failure.
-->
*控制器（Controller）* 模式是编写适合 Kubernetes 的客户端程序的一种特定模式。
控制器通常读取一个对象的 `.spec` 字段，可能做出一些处理，然后更新对象的 `.status` 字段。

一个控制器是 Kubernetes 的一个客户端。
当 Kubernetes 作为客户端调用远程服务时，它被称为 *Webhook* ，
远程服务称为 *Webhook* 后端。 和控制器类似，Webhooks 增加了一个失败点。

<!--
In the webhook model, Kubernetes makes a network request to a remote service.
In the *Binary Plugin* model, Kubernetes executes a binary (program).
Binary plugins are used by the kubelet (e.g.
[Flex Volume Plugins](/docs/concepts/storage/volumes/#flexvolume)
and [Network Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/))
and by kubectl.
-->
在 webhook 模型里，Kubernetes 向远程服务发送一个网络请求。
在 *可执行文件插件* 模型里，Kubernetes 执行一个可执行文件（程序）。
可执行文件插件被 kubelet（如
[Flex 卷插件](/zh/docs/concepts/storage/volumes/#flexvolume)
和[网络插件](/zh/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
和 `kubectl` 所使用。

<!--
Below is a diagram showing how the extension points interact with the
Kubernetes control plane.
-->
下图显示了扩展点如何与 Kubernetes 控制平面进行交互。

<img src="https://docs.google.com/drawings/d/e/2PACX-1vQBRWyXLVUlQPlp7BvxvV9S1mxyXSM6rAc_cbLANvKlu6kCCf-kGTporTMIeG5GZtUdxXz1xowN7RmL/pub?w=960&h=720">

<!-- image source drawing https://docs.google.com/drawings/d/1muJ7Oxuj_7Gtv7HV9-2zJbOnkQJnjxq-v1ym_kZfB-4/edit?ts=5a01e054 -->

<!--
## Extension Points

This diagram shows the extension points in a Kubernetes system.

<img src="https://docs.google.com/drawings/d/e/2PACX-1vSH5ZWUO2jH9f34YHenhnCd14baEb4vT-pzfxeFC7NzdNqRDgdz4DDAVqArtH4onOGqh0bhwMX0zGBb/pub?w=425&h=809">
-->
## 扩展点   {#extension-points}

下图显示了 Kubernetes 系统的扩展点。

<img src="https://docs.google.com/drawings/d/e/2PACX-1vSH5ZWUO2jH9f34YHenhnCd14baEb4vT-pzfxeFC7NzdNqRDgdz4DDAVqArtH4onOGqh0bhwMX0zGBb/pub?w=425&h=809">

<!-- image source diagrams: https://docs.google.com/drawings/d/1k2YdJgNTtNfW7_A8moIIkij-DmVgEhNrn3y2OODwqQQ/view -->

<!--
1. Users often interact with the Kubernetes API using `kubectl`. [Kubectl plugins](/docs/tasks/extend-kubectl/kubectl-plugins/) extend the kubectl binary. They only affect the individual user's local environment, and so cannot enforce site-wide policies.
2. The apiserver handles all requests. Several types of extension points in the apiserver allow authenticating requests, or blocking them based on their content, editing content, and handling deletion. These are described in the [API Access Extensions](/docs/concepts/extend-kubernetes/#api-access-extensions) section.
3. The apiserver serves various kinds of *resources*. *Built-in resource kinds*, like `pods`, are defined by the Kubernetes project and can't be changed. You can also add resources that you define, or that other projects have defined, called *Custom Resources*, as explained in the [Custom Resources](/docs/concepts/extend-kubernetes/#user-defined-types) section. Custom Resources are often used with API Access Extensions.
4. The Kubernetes scheduler decides which nodes to place pods on. There are several ways to extend scheduling. These are described in the [Scheduler Extensions](/docs/concepts/extend-kubernetes/#scheduler-extensions) section.
5. Much of the behavior of Kubernetes is implemented by programs called Controllers which are clients of the API-Server. Controllers are often used in conjunction with Custom Resources.
6. The kubelet runs on servers, and helps pods appear like virtual servers with their own IPs on the cluster network. [Network Plugins](/docs/concepts/extend-kubernetes/#network-plugins) allow for different implementations of pod networking.
7. The kubelet also mounts and unmounts volumes for containers. New types of storage can be supported via [Storage Plugins](/docs/concepts/extend-kubernetes/#storage-plugins).

-->

1. 用户通常使用 `kubectl` 与 Kubernetes API 进行交互。
   [kubectl 插件](/zh/docs/tasks/extend-kubectl/kubectl-plugins/)扩展了 kubectl 可执行文件。
   它们只影响个人用户的本地环境，因此不能执行站点范围的策略。
2. API 服务器处理所有请求。API 服务器中的几种类型的扩展点允许对请求进行身份认证或根据其内容对其进行阻止、
   编辑内容以及处理删除操作。这些内容在
   [API 访问扩展](/zh/docs/concepts/extend-kubernetes/#api-access-extensions)小节中描述。
3. API 服务器提供各种 *资源（Resource）* 。 *内置的资源种类（Resource Kinds）* ，如 `pods`，
   由 Kubernetes 项目定义，不能更改。你还可以添加你自己定义的资源或其他项目已定义的资源，
   称为 *自定义资源（Custom Resource）*，如[自定义资源](/zh/docs/concepts/extend-kubernetes/#user-defined-types)
   部分所述。自定义资源通常与 API 访问扩展一起使用。
4. Kubernetes 调度器决定将 Pod 放置到哪个节点。有几种方法可以扩展调度器。
   这些内容在[调度器扩展](/zh/docs/concepts/extend-kubernetes/#scheduler-extensions)
   小节中描述。
5. Kubernetes 的大部分行为都是由称为控制器（Controllers）的程序实现的，这些程序是 API 服务器的客户端。
   控制器通常与自定义资源一起使用。
6. `kubelet` 在主机上运行，并帮助 Pod 看起来就像在集群网络上拥有自己的 IP 的虚拟服务器。
   [网络插件](/zh/docs/concepts/extend-kubernetes/#network-plugins)让你可以实现不同的 pod 网络。
7. `kubelet` 也负责为容器挂载和卸载卷。新的存储类型可以通过
   [存储插件](/zh/docs/concepts/extend-kubernetes/#storage-plugins)支持。

<!--
If you are unsure where to start, this flowchart can help. Note that some solutions may involve several types of extensions.
-->
如果你不确定从哪里开始扩展，下面流程图可以提供一些帮助。请注意，某些解决方案可能涉及多种类型的扩展。

<img src="https://docs.google.com/drawings/d/e/2PACX-1vRWXNNIVWFDqzDY0CsKZJY3AR8sDeFDXItdc5awYxVH8s0OLherMlEPVUpxPIB1CSUu7GPk7B2fEnzM/pub?w=1440&h=1080">

<!-- image source drawing: https://docs.google.com/drawings/d/1sdviU6lDz4BpnzJNHfNpQrqI9F19QZ07KnhnxVrp2yg/edit -->

<!--
## API Extensions
### User-Defined Types

Consider adding a Custom Resource to Kubernetes if you want to define new controllers, application configuration objects or other declarative APIs, and to manage them using Kubernetes tools, such as `kubectl`.

Do not use a Custom Resource as data storage for application, user, or monitoring data.

For more about Custom Resources, see the [Custom Resources concept guide](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).
-->
## API 扩展  {#api-extensions}

### 用户自定义类型  {#user-defined-types}

如果你想定义新的控制器、应用程序配置对象或其他声明式 API，并使用 Kubernetes
工具（如 `kubectl`）管理它们，请考虑为 Kubernetes 添加一个自定义资源。

不要使用自定义资源作为应用、用户或者监控数据的数据存储。

有关自定义资源的更多信息，请查看
[自定义资源概念指南](/zh/docs/concepts/extend-kubernetes/api-extension/custom-resources/)。

<!--
### Combining New APIs with Automation

The combination of a custom resource API and a control loop is called the [Operator pattern](/docs/concepts/extend-kubernetes/operator/). The Operator pattern is used to manage specific, usually stateful, applications. These custom APIs and control loops can also be used to control other resources, such as storage or policies.
-->
### 将新的 API 与自动化相结合

自定义资源 API 和控制循环的组合称为
[操作者（Operator）模式](/zh/docs/concepts/extend-kubernetes/operator/)。
操作者模式用于管理特定的，通常是有状态的应用程序。
这些自定义 API 和控制循环还可用于控制其他资源，例如存储或策略。

<!--
### Changing Built-in Resources

When you extend the Kubernetes API by adding custom resources, the added resources always fall into a new API Groups. You cannot replace or change existing API groups.
Adding an API does not directly let you affect the behavior of existing APIs (e.g. Pods), but API Access Extensions do.
-->
### 改变内置资源

当你通过添加自定义资源来扩展 Kubernetes API 时，添加的资源始终属于新的 API 组。
你不能替换或更改已有的 API 组。
添加 API 不会直接影响现有 API（例如 Pod ）的行为，但是 API 访问扩展可以。

<!--
### API Access Extensions

When a request reaches the Kubernetes API Server, it is first Authenticated, then Authorized, then subject to various types of Admission Control. See [Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access/) for more on this flow.

Each of these steps offers extension points.

Kubernetes has several built-in authentication methods that it supports. It can also sit behind an authenticating proxy, and it can send a token from an Authorization header to a remote service for verification (a webhook). All of these methods are covered in the [Authentication documentation](/docs/reference/access-authn-authz/authentication/).
-->
### API 访问扩展  {#api-access-extensions}

当请求到达 Kubernetes API Server 时，它首先被要求进行用户认证，然后要进行授权检查，
接着受到各种类型的准入控制的检查。有关此流程的更多信息，请参阅
[Kubernetes API 访问控制](/zh/docs/concepts/security/controlling-access/)。

上述每个步骤都提供了扩展点。

Kubernetes 有几个它支持的内置认证方法。它还可以位于身份验证代理之后，并将 Authorziation 头部
中的令牌发送给远程服务（webhook）进行验证。所有这些方法都在
[身份验证文档](/zh/docs/reference/access-authn-authz/authentication/)中介绍。

<!--
### Authentication

[Authentication](/docs/reference/access-authn-authz/authentication/) maps headers or certificates in all requests to a username for the client making the request.

Kubernetes provides several built-in authentication methods, and an [Authentication webhook](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication) method if those don't meet your needs.
-->
### 身份认证  {#authentication}

[身份认证](/zh/docs/reference/access-authn-authz/authentication/)
将所有请求中的头部字段或证书映射为发出请求的客户端的用户名。

Kubernetes 提供了几种内置的身份认证方法，如果这些方法不符合你的需求，可以使用
[身份认证 Webhook](/zh/docs/reference/access-authn-authz/authentication/#webhook-token-authentication) 方法。

<!--
### Authorization

 [Authorization](/docs/reference/access-authn-authz/webhook/) determines whether specific users can read, write, and do other operations on API resources. It just works at the level of whole resources -- it doesn't discriminate based on arbitrary object fields. If the built-in authorization options don't meet your needs, and [Authorization webhook](/docs/reference/access-authn-authz/webhook/) allows calling out to user-provided code to make an authorization decision.
-->
### 鉴权  {#authorization}

[鉴权组件](/zh/docs/reference/access-authn-authz/authorization/)决定特定用户是否可以对
API 资源执行读取、写入以及其他操作。它只是在整个资源的层面上工作 --
它不基于任意的对象字段进行区分。如果内置授权选项不能满足你的需求，
[鉴权 Webhook](/zh/docs/reference/access-authn-authz/webhook/)
允许调用用户提供的代码来作出授权决定。

<!--
### Dynamic Admission Control

After a request is authorized, if it is a write operation, it also goes through [Admission Control](/docs/reference/access-authn-authz/admission-controllers/) steps. In addition to the built-in steps, there are several extensions:

*   The [Image Policy webhook](/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook) restricts what images can be run in containers.
*   To make arbitrary admission control decisions, a general [Admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks) can be used. Admission Webhooks can reject creations or updates.
-->
### 动态准入控制

在请求被授权之后，如果是写入操作，它还将进入
[准入控制](/zh/docs/reference/access-authn-authz/admission-controllers/)
步骤。除了内置的步骤之外，还有几个扩展：

* [镜像策略 Webhook](/zh/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)
  限制哪些镜像可以在容器中运行。
* 为了进行灵活的准入控制决策，可以使用通用的
  [准入 Webhook](/zh/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)。
  准入 Webhooks 可以拒绝创建或更新操作。

<!--
## Infrastructure Extensions


### Storage Plugins

[Flex Volumes](/docs/concepts/storage/volumes/#flexvolume)
allow users to mount volume types without built-in support by having the
Kubelet call a Binary Plugin to mount the volume.
-->
## 基础设施扩展

### 存储插件

[Flex Volumes](/zh/docs/concepts/storage/volumes/#flexvolume)
允许用户挂载无内置插件支持的卷类型，它通过 Kubelet 调用一个可执行文件插件来挂载卷。

<!--
### Device Plugins

Device plugins allow a node to discover new Node resources (in addition to the
builtin ones like cpu and memory) via a
[Device Plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/).
-->
### 设备插件   {#device-plugins}

设备插件允许节点通过
[设备插件](/zh/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/).
发现新的节点资源（除了内置的 CPU 和内存之外）。

<!--
### Network Plugins

Different networking fabrics can be supported via node-level
[Network Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/).
-->
### 网络插件   {#network-plugins}

不同的网络结构可以通过节点级的
[网络插件](/zh/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
得到支持。

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
### 调度器扩展  {#scheduler-extensions}

调度器是一种特殊类型的控制器，用于监视 pod 并将其分配到节点。
默认的调度器可以完全被替换，而继续使用其他 Kubernetes 组件，或者可以同时运行
[多个调度器](/zh/docs/tasks/extend-kubernetes/configure-multiple-schedulers/)。

这是一个不太轻松的任务，几乎所有的 Kubernetes 用户都会意识到他们并不需要修改调度器。

调度器也支持
[Webhook](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/scheduler_extender.md)，
它允许使用一个 Webhook 后端（调度器扩展程序）为 Pod 筛选节点和确定节点的优先级。


<!--
## {{% heading "whatsnext" %}}

* Learn more about [Custom Resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
* Learn about [Dynamic admission control](/docs/reference/access-authn-authz/extensible-admission-controllers/)
* Learn more about Infrastructure extensions
  * [Network Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
  * [Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
* Learn about [kubectl plugins](/docs/tasks/extend-kubectl/kubectl-plugins/)
* Learn about the [Operator pattern](/docs/concepts/extend-kubernetes/operator/)
-->
## {{% heading "whatsnext" %}}


* 详细了解[自定义资源](/zh/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
* 了解[动态准入控制](/zh/docs/reference/access-authn-authz/extensible-admission-controllers/)
* 详细了解基础设施扩展
  * [网络插件](/zh/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
  * [设备插件](/zh/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
* 了解 [kubectl 插件](/zh/docs/tasks/extend-kubectl/kubectl-plugins/)
* 了解[操作者模式](/zh/docs/concepts/extend-kubernetes/operator/)


