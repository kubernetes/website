---
approvers:
- davidopp
- lavalamp
title: 集群管理概述
---

<!--
title: Cluster Administration Overview
-->

{% capture overview %}
<!--
The cluster administration overview is for anyone creating or administering a Kubernetes cluster.
It assumes some familiarity with concepts in the [User Guide](/docs/user-guide/).
-->
集群管理概述面向任何创建和管理 Kubernetes 集群的读者人群。我们假设你对 [用户指南](/docs/user-guide/)中的概念有一些熟悉。
{% endcapture %}

{% capture body %}
<!--
## Planning a cluster
-->
## 规划集群

<!--
See the guides in [Picking the Right Solution](/docs/setup/pick-right-solution/) for examples of how to plan, set up, and configure Kubernetes clusters. The solutions listed in this article are called *distros*.
-->
查阅 [选择正确解决方案](/docs/setup/pick-right-solution/) 中的指导，获取如何规划、建立以及配置 Kubernetes 集群的示例。本文所列的文章称为*发行版*。

<!--
Before choosing a guide, here are some considerations:

 - Do you just want to try out Kubernetes on your computer, or do you want to build a high-availability, multi-node cluster? Choose distros best suited for your needs.
 - **If you are designing for high-availability**, learn about configuring [clusters in multiple zones](/docs/admin/multi-cluster).
 - Will you be using **a hosted Kubernetes cluster**, such as [Google Container Engine (GKE)](https://cloud.google.com/container-engine/), or **hosting your own cluster**?
 - Will your cluster be **on-premises**, or **in the cloud (IaaS)**? Kubernetes does not directly support hybrid clusters. Instead, you can set up multiple clusters.
 - **If you are configuring Kubernetes on-premises**, consider which [networking model](/docs/admin/networking) fits best. One option for custom networking is [*OpenVSwitch GRE/VxLAN networking*](/docs/admin/ovs-networking/), which uses OpenVSwitch to set up networking between pods across Kubernetes nodes.
 - Will you be running Kubernetes on **"bare metal" hardware** or on **virtual machines (VMs)**?
 - Do you **just want to run a cluster**, or do you expect to do **active development of Kubernetes project code**? If the
   latter, choose a actively-developed distro. Some distros only use binary releases, but
   offer a greater variety of choices.
 - Familiarize yourself with the [components](/docs/admin/cluster-components) needed to run a cluster.
-->
在选择一个指南前，有一些因素需要考虑：

 - 你是打算在你的电脑上尝试 Kubernetes，还是要构建一个高可用的多节点集群？请选择最适合你需求的发行版。
 - **如果你正在设计一个高可用集群**，请了解[在多个 zones 中配置集群](/docs/admin/multi-cluster)。
 - 你的集群是在**本地**还是**云（IaaS）**上？Kubernetes 不能直接支持混合集群。作为代替，你可以建立多个集群。
 - **如果你在本地配置 Kubernetes**，需要考虑哪种[网络模型](/docs/admin/networking)最适合。一种自定义网络的选项是 [*OpenVSwitch GRE/VxLAN 网络*](/docs/admin/ovs-networking/)，它使用 OpenVSwitch 在跨 Kubernetes 节点的 pods 之间建立起网络。
 - 你的 Kubernetes 在 **裸金属硬件** 还是 **虚拟机（VMs）**上运行？
 - 你**只想运行一个集群**，还是打算**活动开发 Kubernetes 项目代码**？如果是后者，请选择一个活动开发的发行版。某些发行版只提供二进制发布版，但提供更多的选择。
 - 让你自己熟悉运行一个集群所需的[组件](/docs/admin/cluster-components) 。

<!--
Note: Not all distros are actively maintained. Choose distros which have been tested a recent version of Kubernetes.
-->
请注意：不是所有的发行版都被积极维护着。请选择测试过最近版本的 Kubernetes 的发行版。

<!--
If you are using a guide involving Salt, see [Configuring Kubernetes with Salt](/docs/admin/salt).
-->
如果你正在使用和 Salt 有关的指南，请查阅  [使用 Salt 配置 Kubernetes](/docs/admin/salt)。

<!--
## Managing a cluster
-->
## 管理集群

<!--
* [Managing a cluster](/docs/concepts/cluster-administration/cluster-management/) describes several topics related to the lifecycle of a cluster: creating a new cluster, upgrading your cluster’s master and worker nodes, performing node maintenance (e.g. kernel upgrades), and upgrading the Kubernetes API version of a running cluster..

* Learn how to [manage nodes](/docs/concepts/nodes/node/).

* Learn how to set up and manage the [resource quota](/docs/concepts/policy/resource-quotas/) for shared clusters.
-->
[管理集群](/docs/concepts/cluster-administration/cluster-management/)叙述了和集群生命周期相关的几个主题：创建一个新集群、升级集群的 master 和 worker 节点、执行节点维护（例如内核升级）以及升级活动集群的 Kubernetes API 版本。

<!--
## Securing a cluster
-->
## 保护集群

<!--
* [Kubernetes Container Environment](/docs/concepts/containers/container-environment-variables/) describes the environment for Kubelet managed containers on a Kubernetes node.
-->
* [Kubernetes 容器环境](/docs/concepts/containers/container-environment-variables/) 描述了 Kubernetes 节点上由 Kubelet 管理的容器的环境。

<!--
* [Controlling Access to the Kubernetes API](/docs/admin/accessing-the-api) describes how to set up permissions for users and service accounts.
-->
* [控制到 Kubernetes API 的访问](/docs/admin/accessing-the-api) 描述了如何为用户和 service accounts 建立权限许可。

<!--
* [Authenticating](/docs/admin/authentication) explains authentication in Kubernetes, including the various authentication options.
-->
*  [用户认证](/docs/admin/authentication) 阐述了 Kubernetes 中的认证功能，包括许多认证选项。

<!--
* [Authorization](/docs/admin/authorization) is separate from authentication, and controls how HTTP calls are handled.
-->
*  [授权](/docs/admin/authorization)从认证中分离出来，用于控制如何处理 HTTP 请求。

<!--
* [Using Admission Controllers](/docs/admin/admission-controllers) explains plug-ins which intercepts requests to the Kubernetes API server after authentication and authorization.
-->
*  [使用 Admission Controllers](/docs/admin/admission-controllers) 阐述了在认证和授权之后拦截到 Kubernetes API 服务的请求的插件。

<!--
* [Using Sysctls in a Kubernetes Cluster](/docs/concepts/cluster-administration/sysctl-cluster/) describes to an administrator how to use the `sysctl` command-line tool to set kernel parameters .
-->
* [在 Kubernetes Cluster 中使用 Sysctls](/docs/concepts/cluster-administration/sysctl-cluster/) 描述了管理员如何使用 `sysctl` 命令行工具来设置内核参数。

<!--
* [Auditing](/docs/tasks/debug-application-cluster/audit/) describes how to interact with Kubernetes' audit logs.
-->
* [审计](/docs/tasks/debug-application-cluster/audit/) 描述了如何与 Kubernetes 的审计日志交互。

<!--
### Securing the kubelet
-->
### 保护 kubelet
<!--
  * [Master-Node communication](/docs/concepts/cluster-administration/master-node-communication/)
  * [TLS bootstrapping](/docs/admin/kubelet-tls-bootstrapping/)
  * [Kubelet authentication/authorization](/docs/admin/kubelet-authentication-authorization/)
-->
  * [Master 节点通信](/docs/concepts/cluster-administration/master-node-communication/)
  * [TLS 引导](/docs/admin/kubelet-tls-bootstrapping/)
  * [Kubelet 认证/授权](/docs/admin/kubelet-authentication-authorization/)

<!--
## Optional Cluster Services
-->
## 可选集群服务

<!--
* [DNS Integration with SkyDNS](/docs/concepts/services-networking/dns-pod-service/) describes how to resolve a DNS name directly to a Kubernetes service.
-->
*  [DNS 与 SkyDNS 集成](/docs/concepts/services-networking/dns-pod-service/)描述了如何将一个 DNS 名解析到一个Kubernetes service。

<!--
* [Logging and Monitoring Cluster Activity](/docs/concepts/cluster-administration/logging/) explains how logging in Kubernetes works and how to implement it.
-->
* [记录和监控集群活动](/docs/concepts/cluster-administration/logging/) 阐述了Kubernetes 的日志如何工作以及怎样实现。

{% endcapture %}

{% include templates/concept.md %}
