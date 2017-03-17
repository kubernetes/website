---
title: 联邦用户指南
---

本指南解释了为什么使用联邦，以及如何使用联邦管理多个 Kubernetes 集群。


* TOC
{:toc}


## 为什么需要联邦

联邦使管理多个集群变得容易。它提供两个主要构建模块:

  * 跨集群资源同步: 联帮有能力保持资源在多个集群中同步。例如，确保在多个集群中存在相同的部署。
  * 跨集群发现: 它提供自动配置 DNS 和所有集群后端的负载均衡能力。例如，确保使用全局的 VIP 或 DNS 记录访问后端的多个集群。

联邦启用的一些其他用例:

* 高可用性: 通过自动配置 DNS 服务器和负载均衡器达到跨集群的负载平衡，联邦可以将集群的错误影响降到最低。
* 避免锁定: 通过使跨集群应用迁移变得更容易，联邦解决了集群锁定。

除非您有多个集群，否则联邦没有帮助。 您可能需要多集群的一些原因是:

* 低延迟: 在多个地理区域中提供集群，就可以让用户就近访问服务，进而最小化服务延迟。
* 故障隔离: 可能更好的是拥有多个小集群而不是单个大集群用于故障的隔离。 (例如: 云服务商不同可用性区域中的多个集群)。
  [多集群指南](/docs/admin/multi-cluster) 可以获取更多的细节信息。
* 可扩展性: 单个 Kubernetes 集群有扩展性限制 (这不应该是大多数用户的情况。更多细节:
  [Kubernetes 扩展和性能目标](https://github.com/kubernetes/community/blob/master/sig-scalability/goals.md)).
* 混合云: 您可以在不同的云服务商或内部数据中心，拥有多个集群。

### 警告

虽然联邦有很多有吸引力的用例，但也有一些注意事项。

* 增加的网络带宽和成本: 联邦控制并监视所有集群，以确保当前状态与预期的一致。如果集群在云服务商或不同云服务商上的不同区域中运行，这可能会导致显著的网络成本的上升。
* 降低跨集群隔离: 联邦控制平台中的错误会影响所有集群。这可以通过将联邦控制平台中的逻辑保持最小来缓解。它大多委托 Kubernetes 集群自己去调度，另外设计和实施在安全方面也面临挑战，应避免多集群的服务中断。
* 成熟度: 联邦项目相对较新，不是很成熟。并不是所有的资源都可用，许多仍是alpha。 [问题
  38893](https://github.com/kubernetes/kubernetes/issues/38893) 列出了团队正忙于解决的系统已知问题。

## 开始

为了能够联合多个集群，我们首先需要设置一个联邦控制平台。
按照 [安装指南](/docs/admin/federation/) 设置联邦控制平台。

## 混合云功能

Kubernetes 集群联邦可以包括不同云提供商 (例如 Google Cloud, AWS) 和内部部署 (例如 OpenStack) 上运行的集群。
只需在适当的云提供程序或位置中创建所需的所有集群。并使用您的联邦 API 服务器注册每个集群的 API 端点和凭据。(有关详细信息，请参阅
[联邦管理员指南](/docs/admin/federation/))。

此后，您的 API 资源可以跨越不同的集群和云提供商。

## API 资源

一旦我们设置了联邦控制台，我们就可以开始创建联邦 API 资源。
以下指南详细解释了一些资源:

* [ConfigMap](https://kubernetes.io/docs/user-guide/federation/configmap/)
* [DaemonSets](https://kubernetes.io/docs/user-guide/federation/daemonsets/)
* [Deployment](https://kubernetes.io/docs/user-guide/federation/deployment/)
* [Events](https://kubernetes.io/docs/user-guide/federation/events/)
* [Ingress](https://kubernetes.io/docs/user-guide/federation/federated-ingress/)
* [Namespaces](https://kubernetes.io/docs/user-guide/federation/namespaces/)
* [ReplicaSets](https://kubernetes.io/docs/user-guide/federation/replicasets/)
* [Secrets](https://kubernetes.io/docs/user-guide/federation/secrets/)
* [Services](https://kubernetes.io/docs/user-guide/federation/federated-services/)

[API 参考文档](/docs/federation/api-reference/) 列出了所有联邦 apiserver 支持的资源。

## 级联删除

Kubernetes 版本1.5包括了对联邦级联资源删除的支持。使用级联删除，当从联邦控制平台中删除资源时，所有基础集群中的相应资源也将被删除。

要启用级联删除，请设置选项
`DeleteOptions.orphanDependents=false` 当您从联邦控制平台删除资源时。

以是联邦资源受级联删除的影响:

* [Ingress](https://kubernetes.io/docs/user-guide/federation/federated-ingress/)
* [Namespaces](https://kubernetes.io/docs/user-guide/federation/namespaces/)
* [ReplicaSets](https://kubernetes.io/docs/user-guide/federation/replicasets/)
* [Secrets](https://kubernetes.io/docs/user-guide/federation/secrets/)
* [Deployment](https://kubernetes.io/docs/user-guide/federation/deployment/)
* [DaemonSets](https://kubernetes.io/docs/user-guide/federation/daemonsets/)

注意: 默认情况下，从联邦控制平台删除资源不会从基础集群中删除相应的资源。

## 了解更多信息

* [联邦提案](https://github.com/kubernetes/community/blob/{{page.githubbranch}}/contributors/design-proposals/federation.md)
* [Kubecon2016 谈联邦](https://www.youtube.com/watch?v=pq9lbkmxpS8)
