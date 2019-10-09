---
approvers:
- lavalamp
title: Kubernetes 组件
redirect_from:
- "/docs/admin/cluster-components/"
- "/docs/admin/cluster-components.html"
content_template: templates/concept
weight: 20
---
{{% capture overview %}}
本文档概述了 Kubernetes 所需的各种二进制组件, 用于提供齐全的功能。
{{% /capture %}}

{{% capture body %}}

## Master 组件

Master 组件提供的集群控制。Master 组件对集群做出全局性决策(例如：调度)，以及检测和响应集群事件(副本控制器的`replicas`字段不满足时,启动新的副本)。

Master 组件可以在集群中的任何节点上运行。然而，为了简单起见，设置脚本通常会启动同一个虚拟机上所有 Master 组件，并且不会在此虚拟机上运行用户容器。请参阅[构建高可用性群集](/docs/admin/high-availability)示例对于多主机 VM 的设置。

### API服务器

[kube-apiserver](/docs/admin/kube-apiserver)对外暴露了Kubernetes API。它是的 Kubernetes 前端控制层。它被设计为水平扩展，即通过部署更多实例来缩放。请参阅[构建高可用性群集](/docs/admin/high-availability).

### etcd

[etcd](/docs/admin/etcd) 用于 Kubernetes 的后端存储。所有集群数据都存储在此处，始终为您的 Kubernetes 集群的 etcd 数据提供备份计划。

### kube-controller-manager

[kube-controller-manager](/docs/admin/kube-controller-manager)运行控制器，它们是处理集群中常规任务的后台线程。逻辑上，每个控制器是一个单独的进程，但为了降低复杂性，它们都被编译成独立的可执行文件，并在单个进程中运行。

这些控制器包括:

* 节点控制器: 当节点移除时，负责注意和响应。
* 副本控制器: 负责维护系统中每个副本控制器对象正确数量的 Pod。
* 端点控制器: 填充 端点(Endpoints) 对象(即连接 Services & Pods)。
* 服务帐户和令牌控制器: 为新的命名空间创建默认帐户和 API 访问令牌.

### 云控制器管理器-(cloud-controller-manager)

cloud-controller-manager 是用于与底层云提供商交互的控制器。云控制器管理器可执行组件是 Kubernetes v1.6 版本中引入的 Alpha 功能。

cloud-controller-manager 仅运行云提供商特定的控制器循环。您必须在 kube-controller-manager 中禁用这些控制器循环，您可以通过在启动 kube-controller-manager 时将 `--cloud-provider` 标志设置为`external`来禁用控制器循环。

cloud-controller-manager 允许云供应商代码和 Kubernetes 核心彼此独立发展，在以前的版本中，Kubernetes 核心代码依赖于云提供商特定的功能代码。在未来的版本中，云供应商的特定代码应由云供应商自己维护，并与运行 Kubernetes 的云控制器管理器相关联。

以下控制器具有云提供商依赖关系:

* 节点控制器: 用于检查云提供商以确定节点是否在云中停止响应后被删除
* 路由控制器: 用于在底层云基础架构中设置路由
* 服务控制器: 用于创建，更新和删除云提供商负载平衡器
* 数据卷控制器: 用于创建，附加和装载卷，并与云提供商进行交互以协调卷

### 调度器 - (kube-scheduler)

[kube-scheduler](/docs/admin/kube-scheduler)监视没有分配节点的新创建的 Pod，选择一个节点供他们运行。

### 插件(addons)

插件是实现集群功能的 Pod 和 Service。 Pods 可以通过 Deployments，ReplicationControllers 管理。插件对象本身是受命名空间限制的，被创建于 `kube-system` 命名空间。

Addon 管理器用于创建和维护附加资源. 有关详细信息，请参阅[here](http://releases.k8s.io/HEAD/cluster/addons).

#### DNS

虽然其他插件并不是必需的，但所有 Kubernetes 集群都应该具有[Cluster DNS](/docs/concepts/services-networking/dns-pod-service/)，许多示例依赖于它。

Cluster DNS 是一个 DNS 服务器，和您部署环境中的其他 DNS 服务器一起工作，为 Kubernetes 服务提供DNS记录。

Kubernetes 启动的容器自动将 DNS 服务器包含在 DNS 搜索中。

#### 用户界面

dashboard 提供了集群状态的只读概述。有关更多信息，请参阅[使用HTTP代理访问 Kubernetes API](/docs/tasks/access-kubernetes-api/http-proxy-access-api/)


#### 容器资源监控

[容器资源监控](/docs/user-guide/monitoring)将关于容器的一些常见的时间序列度量值保存到一个集中的数据库中，并提供用于浏览这些数据的界面。

#### 集群层面日志

[集群层面日志](/docs/user-guide/logging/overview) 机制负责将容器的日志数据保存到一个集中的日志存储中，该存储能够提供搜索和浏览接口。

## 节点组件

节点组件在每个节点上运行，维护运行的 Pod 并提供 Kubernetes 运行时环境。

### kubelet

[kubelet](/docs/admin/kubelet)是主要的节点代理,它监测已分配给其节点的 Pod(通过 apiserver 或通过本地配置文件)，提供如下功能:

* 挂载 Pod 所需要的数据卷(Volume)。
* 下载 Pod 的 secrets。
* 通过 Docker 运行(或通过 rkt)运行 Pod 的容器。
* 周期性的对容器生命周期进行探测。
* 如果需要，通过创建 *镜像 Pod（Mirror Pod）* 将 Pod 的状态报告回系统的其余部分。
* 将节点的状态报告回系统的其余部分。

### kube-proxy

[kube-proxy](/docs/admin/kube-proxy)通过维护主机上的网络规则并执行连接转发，实现了Kubernetes服务抽象。


### docker

Docker 用于运行容器。

### rkt

支持 rkt 运行容器作为 Docker 的试验性替代方案。

### supervisord

supervisord 是一个轻量级的进程监控系统，可以用来保证 kubelet 和 docker 运行。

### fluentd

fluentd 是一个守护进程，它有助于提供[集群层面日志](#cluster-level-logging) 集群层面的日志。

{{% /capture %}}


