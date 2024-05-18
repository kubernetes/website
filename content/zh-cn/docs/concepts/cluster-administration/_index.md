---
title: 集群管理
weight: 100
content_type: concept
description: >
  关于创建和管理 Kubernetes 集群的底层细节。
no_list: true
card:
  name: setup
  weight: 60
  anchors:
  - anchor: "#securing-a-cluster"
    title: 保护集群
---
<!--
title: Cluster Administration
reviewers:
- davidopp
- lavalamp
weight: 100
content_type: concept
description: >
  Lower-level detail relevant to creating or administering a Kubernetes cluster.
no_list: true
card:
  name: setup
  weight: 60
  anchors:
  - anchor: "#securing-a-cluster"
    title: Securing a cluster
-->

<!-- overview -->
<!--
The cluster administration overview is for anyone creating or administering a Kubernetes cluster.
It assumes some familiarity with core Kubernetes [concepts](/docs/concepts/).
-->
集群管理概述面向任何创建和管理 Kubernetes 集群的读者人群。
我们假设你大概了解一些核心的 Kubernetes [概念](/zh-cn/docs/concepts/)。


<!-- body -->
<!--
## Planning a cluster

See the guides in [Setup](/docs/setup/) for examples of how to plan, set up, and configure
Kubernetes clusters. The solutions listed in this article are called *distros*.
-->
## 规划集群   {#planning-a-cluster}

查阅[安装](/zh-cn/docs/setup/)中的指导，获取如何规划、建立以及配置 Kubernetes
集群的示例。本文所列的文章称为**发行版**。

{{< note >}}
<!--
Not all distros are actively maintained. Choose distros which have been tested with a recent
version of Kubernetes.
-->
并非所有发行版都是被积极维护的。
请选择使用最近 Kubernetes 版本测试过的发行版。
{{< /note >}}

<!--
Before choosing a guide, here are some considerations:
-->
在选择一个指南前，有一些因素需要考虑：

<!--
- Do you want to try out Kubernetes on your computer, or do you want to build a high-availability,
  multi-node cluster? Choose distros best suited for your needs.
- Will you be using **a hosted Kubernetes cluster**, such as
  [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/), or **hosting your own cluster**?
- Will your cluster be **on-premises**, or **in the cloud (IaaS)**? Kubernetes does not directly
  support hybrid clusters. Instead, you can set up multiple clusters.
- **If you are configuring Kubernetes on-premises**, consider which
  [networking model](/docs/concepts/cluster-administration/networking/) fits best.
- Will you be running Kubernetes on **"bare metal" hardware** or on **virtual machines (VMs)**?
- Do you **want to run a cluster**, or do you expect to do **active development of Kubernetes project code**?
  If the latter, choose an actively-developed distro. Some distros only use binary releases, but
  offer a greater variety of choices.
- Familiarize yourself with the [components](/docs/concepts/overview/components/) needed to run a cluster.
-->
- 你是打算在你的计算机上尝试 Kubernetes，还是要构建一个高可用的多节点集群？
  请选择最适合你需求的发行版。
- 你正在使用类似 [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/)
  这样的**被托管的 Kubernetes 集群**, 还是**管理你自己的集群**？
- 你的集群是在**本地**还是**云（IaaS）** 上？Kubernetes 不能直接支持混合集群。
  作为代替，你可以建立多个集群。
- **如果你在本地配置 Kubernetes**，
  需要考虑哪种[网络模型](/zh-cn/docs/concepts/cluster-administration/networking/)最适合。
- 你的 Kubernetes 在**裸机**上还是**虚拟机（VM）** 上运行？
- 你是想**运行一个集群**，还是打算**参与开发 Kubernetes 项目代码**？
  如果是后者，请选择一个处于开发状态的发行版。
  某些发行版只提供二进制发布版，但提供更多的选择。
- 让你自己熟悉运行一个集群所需的[组件](/zh-cn/docs/concepts/overview/components/)。

<!--
## Managing a cluster

* Learn how to [manage nodes](/docs/concepts/architecture/nodes/).
  * Read about [cluster autoscaling](/docs/concepts/cluster-administration/cluster-autoscaling/).

* Learn how to set up and manage the [resource quota](/docs/concepts/policy/resource-quotas/) for shared clusters.
-->
## 管理集群   {#managing-a-cluster}

* 学习如何[管理节点](/zh-cn/docs/concepts/architecture/nodes/)。
  * 阅读[集群自动扩缩](/zh-cn/docs/concepts/cluster-administration/cluster-autoscaling/)。

* 学习如何设定和管理集群共享的[资源配额](/zh-cn/docs/concepts/policy/resource-quotas/)。

<!--
## Securing a cluster
* [Generate Certificates](/docs/tasks/administer-cluster/certificates/) describes the steps to
  generate certificates using different tool chains.
* [Kubernetes Container Environment](/docs/concepts/containers/container-environment/) describes
  the environment for Kubelet managed containers on a Kubernetes node.
* [Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access) describes
  how Kubernetes implements access control for its own API.
* [Authenticating](/docs/reference/access-authn-authz/authentication/) explains authentication in
  Kubernetes, including the various authentication options.
* [Authorization](/docs/reference/access-authn-authz/authorization/) is separate from
  authentication, and controls how HTTP calls are handled.
* [Using Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/)
  explains plug-ins which intercepts requests to the Kubernetes API server after authentication
  and authorization.
* [Using Sysctls in a Kubernetes Cluster](/docs/tasks/administer-cluster/sysctl-cluster/)
  describes to an administrator how to use the `sysctl` command-line tool to set kernel parameters.
* [Auditing](/docs/tasks/debug/debug-cluster/audit/) describes how to interact with Kubernetes'
  audit logs.
-->
## 保护集群  {#securing-a-cluster}

* [生成证书](/zh-cn/docs/tasks/administer-cluster/certificates/)描述了使用不同的工具链生成证书的步骤。
* [Kubernetes 容器环境](/zh-cn/docs/concepts/containers/container-environment/)描述了
  Kubernetes 节点上由 Kubelet 管理的容器的环境。
* [控制对 Kubernetes API 的访问](/zh-cn/docs/concepts/security/controlling-access/)描述了 Kubernetes
  如何为自己的 API 实现访问控制。
* [身份认证](/zh-cn/docs/reference/access-authn-authz/authentication/)阐述了 Kubernetes
  中的身份认证功能，包括许多认证选项。
* [鉴权](/zh-cn/docs/reference/access-authn-authz/authorization/)与身份认证不同，用于控制如何处理 HTTP 请求。
* [使用准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers)阐述了在认证和授权之后拦截到
  Kubernetes API 服务的请求的插件。
* [在 Kubernetes 集群中使用 sysctl](/zh-cn/docs/tasks/administer-cluster/sysctl-cluster/)
  描述了管理员如何使用 `sysctl` 命令行工具来设置内核参数。
* [审计](/zh-cn/docs/tasks/debug/debug-cluster/audit/)描述了如何与 Kubernetes 的审计日志交互。

<!--
### Securing the kubelet

* [Control Plane-Node communication](/docs/concepts/architecture/control-plane-node-communication/)
* [TLS bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
* [Kubelet authentication/authorization](/docs/reference/access-authn-authz/kubelet-authn-authz/)
-->
### 保护 kubelet   {#securing-the-kubelet}

* [节点与控制面之间的通信](/zh-cn/docs/concepts/architecture/control-plane-node-communication/)
* [TLS 启动引导](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
* [Kubelet 认证/鉴权](/zh-cn/docs/reference/access-authn-authz/kubelet-authn-authz/)

<!--
## Optional Cluster Services

* [DNS Integration](/docs/concepts/services-networking/dns-pod-service/) describes how to resolve
  a DNS name directly to a Kubernetes service.
* [Logging and Monitoring Cluster Activity](/docs/concepts/cluster-administration/logging/)
  explains how logging in Kubernetes works and how to implement it.
-->
## 可选集群服务   {#optional-cluster-services}

* [DNS 集成](/zh-cn/docs/concepts/services-networking/dns-pod-service/)描述了如何将一个 DNS
  名解析到一个 Kubernetes service。
* [记录和监控集群活动](/zh-cn/docs/concepts/cluster-administration/logging/)阐述了 Kubernetes
  的日志如何工作以及怎样实现。

