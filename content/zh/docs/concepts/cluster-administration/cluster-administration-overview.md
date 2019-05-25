---
approvers:
- davidopp
- lavalamp

title: 集群管理概述
content_template: templates/concept
---

{{% capture overview %}}

集群管理概述面向任何创建和管理 Kubernetes 集群的读者人群。我们假设你对 [用户指南](/docs/user-guide/)中的概念有一些熟悉。
{{% /capture %}}

{{% capture body %}}

## 规划集群


查阅 [安装](/docs/setup/) 中的指导，获取如何规划、建立以及配置 Kubernetes 集群的示例。本文所列的文章称为*发行版* 。


在选择一个指南前，有一些因素需要考虑：

 - 你是打算在你的电脑上尝试 Kubernetes，还是要构建一个高可用的多节点集群？请选择最适合你需求的发行版。
 - **如果你正在设计一个高可用集群**，请了解[在多个 zones 中配置集群](/docs/admin/multi-cluster)。
 - 你的集群是在**本地**还是**云（IaaS）**上？Kubernetes 不能直接支持混合集群。作为代替，你可以建立多个集群。
 - **如果你在本地配置 Kubernetes**，需要考虑哪种[网络模型](/docs/admin/networking)最适合。一种自定义网络的选项是 [*OpenVSwitch GRE/VxLAN 网络*](/docs/admin/ovs-networking/)，它使用 OpenVSwitch 在跨 Kubernetes 节点的 pods 之间建立起网络。
 - 你的 Kubernetes 在 **裸金属硬件** 还是 **虚拟机（VMs）**上运行？
 - 你**只想运行一个集群**，还是打算**活动开发 Kubernetes 项目代码**？如果是后者，请选择一个活动开发的发行版。某些发行版只提供二进制发布版，但提供更多的选择。
 - 让你自己熟悉运行一个集群所需的[组件](/docs/admin/cluster-components) 。


请注意：不是所有的发行版都被积极维护着。请选择测试过最近版本的 Kubernetes 的发行版。


如果你正在使用和 Salt 有关的指南，请查阅  [使用 Salt 配置 Kubernetes](/docs/admin/salt)。


## 管理集群


[管理集群](/docs/concepts/cluster-administration/cluster-management/)叙述了和集群生命周期相关的几个主题：创建一个新集群、升级集群的 master 和 worker 节点、执行节点维护（例如内核升级）以及升级活动集群的 Kubernetes API 版本。


## 保护集群


* [Kubernetes 容器环境](/docs/concepts/containers/container-environment-variables/) 描述了 Kubernetes 节点上由 Kubelet 管理的容器的环境。


* [控制到 Kubernetes API 的访问](/docs/admin/accessing-the-api) 描述了如何为用户和 service accounts 建立权限许可.


*  [用户认证](/docs/admin/authentication) 阐述了 Kubernetes 中的认证功能，包括许多认证选项。


*  [授权](/docs/admin/authorization)从认证中分离出来，用于控制如何处理 HTTP 请求。


*  [使用 Admission Controllers](/docs/admin/admission-controllers) 阐述了在认证和授权之后拦截到 Kubernetes API 服务的请求的插件。


* [在 Kubernetes Cluster 中使用 Sysctls](/docs/concepts/cluster-administration/sysctl-cluster/) 描述了管理员如何使用 `sysctl` 命令行工具来设置内核参数。


* [审计](/docs/tasks/debug-application-cluster/audit/) 描述了如何与 Kubernetes 的审计日志交互。


### 保护 kubelet

  * [Master 节点通信](/docs/concepts/cluster-administration/master-node-communication/)
  * [TLS 引导](/docs/admin/kubelet-tls-bootstrapping/)
  * [Kubelet 认证/授权](/docs/admin/kubelet-authentication-authorization/)


## 可选集群服务


*  [DNS 与 SkyDNS 集成](/docs/concepts/services-networking/dns-pod-service/)描述了如何将一个 DNS 名解析到一个Kubernetes service。


* [记录和监控集群活动](/docs/concepts/cluster-administration/logging/) 阐述了Kubernetes 的日志如何工作以及怎样实现。

{{% /capture %}}


