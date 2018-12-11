---
title: 扩缩
content_template: templates/task
---

<!-- ---
title: Scaling
content_template: templates/task
--- -->

{{% capture overview %}}

<!-- This page shows how to horizontally scale master and worker nodes on a cluster. -->
本文将讨论如何在集群中扩缩主节点和工作节点。

{{% /capture %}}

{{% capture prerequisites %}}

<!-- This page assumes you have a working Juju deployed cluster. -->

本文假设您已经有一个用 Juju 部署、正在运行的集群。

<!-- Any of the applications can be scaled out post-deployment.
The charms update the status messages with progress, so it is recommended to run. -->

任何应用都可以在部署之后进行横向扩容。
charms 将会不停地更新进度状态信息，建议运行如下命令。

```
watch -c juju status --color
```
{{% /capture %}}

{{% capture steps %}}

<!-- ## Kubernetes masters -->

## Kubernetes 主节点

<!-- The provided Kubernetes master nodes act as a control plane for the cluster.
The deployment has been designed so that these nodes can be scaled independently
of worker nodes to allow for more operational flexibility.
To scale a master node up, simply execute: -->

Kubernetes 主节点充当了集群中控制平面的角色。
在设计上，这些主节点可以独立于工作节点进行扩缩容，从而带来运维上的灵活性。
想要添加一个主节点，只需要执行以下命令：

    juju add-unit kubernetes-master

<!-- This will add another master node to the control plane.
See the [building high-availability clusters](/docs/admin/high-availability)
section of the documentation for more information. -->

这将会在控制平面中添加一个新的主节点。
参见[构建高可用集群](/docs/admin/high-availability)文档，获取更多信息。

<!-- ## Kubernetes workers -->

## Kubernetes 工作节点

<!-- The kubernetes-worker nodes are the load-bearing units of a Kubernetes cluster. -->

kubernetes-worker 节点是 Kubernetes 集群中承担负载的部分。

<!-- By default pods are automatically spread throughout the kubernetes-worker units
that you have deployed. -->

默认情况下，pod 会自动均匀部署在 kubernetes-worker 节点上。

<!-- To add more kubernetes-worker units to the cluster: -->

如果想要在集群中添加更多的 kubernetes-worker 节点，运行如下命令：

```
juju add-unit kubernetes-worker
```

<!-- or specify machine constraints to create larger nodes: -->

或者修改机器限制，来创建更大的节点：

```
juju set-constraints kubernetes-worker "cpu-cores=8 mem=32G"
juju add-unit kubernetes-worker
```

<!-- Refer to the
[machine constraints documentation](https://jujucharms.com/docs/stable/charms-constraints)
for other machine constraints that might be useful for the kubernetes-worker units. -->

参见[机器限制文档](https://jujucharms.com/docs/stable/charms-constraints)，
了解其它机器约束，这些约束可能对 kubernetes-worker unit 有帮助。

## etcd

<!-- Etcd is used as a key-value store for the Kubernetes cluster.
The bundle defaults to one instance in this cluster. -->

Etcd 在 Kubernetes 集群中用作键值存储。
集群默认使用一个存储实例。

<!-- For quorum reasons it is recommended to keep an odd number of etcd nodes.
3, 5, 7, and 9 nodes are the recommended amount of nodes,
depending on your cluster size. The CoreOS etcd documentation has a chart for the
[optimal cluster size](https://coreos.com/etcd/docs/latest/admin_guide.html#optimal-cluster-size)
to determine fault tolerance. -->

由于仲裁机制的关系，推荐保有奇数个 etcd 节点。
根据集群的大小，推荐使用3、5、7 或 9 个节点。
CoreOS etcd 文档有一个关于[最佳集群大小](https://coreos.com/etcd/docs/latest/admin_guide.html#optimal-cluster-size)的图表，
可以参考确定最佳的容错设计。

<!-- To add an etcd unit: -->
添加 etcd 单元:

```
juju add-unit etcd
```

<!-- Shrinking of an etcd cluster after growth is not recommended. -->
不建议在扩容 etcd 集群之后对其缩容。

<!-- ## Juju controller -->
## Juju 控制器

<!-- A single node is responsible for coordinating with all the Juju agents
on each machine that manage Kubernetes; it is called the controller node.
For production deployments it is recommended to enable HA of the controller node: -->

一个负责协调每台机器上 Juju 代理（这些代理管理 Kubernetes 集群）的节点被称为控制器节点。
对于生产环境下的部署，建议启用控制器节点的高可用性：

    juju enable-ha

<!-- Enabling HA results in 3 controller nodes, this should be sufficient for most use cases.
5 and 7 controller nodes are also supported for extra large deployments. -->

启用 HA 将会创建 3 个控制器节点，对于大多数情况而言应该是足够的。
而对于超大型的部署，也同时支持 5 或 7 个控制器节点。

<!-- Refer to the [Juju HA controller documentation](https://jujucharms.com/docs/2.2/controllers-ha) for more information. -->

参见 [Juju HA 控制器文档](https://jujucharms.com/docs/2.2/controllers-ha) 获取更多信息.

{{% /capture %}}
