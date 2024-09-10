---
title: 大规模集群的注意事项
weight: 10
---

<!-- 
reviewers:
- davidopp
- lavalamp
title: Considerations for large clusters
weight: 10
-->

<!--
A cluster is a set of {{< glossary_tooltip text="nodes" term_id="node" >}} (physical
or virtual machines) running Kubernetes agents, managed by the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}.
Kubernetes {{< param "version" >}} supports clusters with up to 5,000 nodes. More specifically,
Kubernetes is designed to accommodate configurations that meet *all* of the following criteria:
-->
集群是运行 Kubernetes 代理的、
由{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}管理的一组
{{< glossary_tooltip text="节点" term_id="node" >}}（物理机或虚拟机）。
Kubernetes {{< param "version" >}} 单个集群支持的最大节点数为 5,000。
更具体地说，Kubernetes 旨在适应满足以下**所有**标准的配置：

<!--
* No more than 110 pods per node
* No more than 5,000 nodes
* No more than 150,000 total pods
* No more than 300,000 total containers
-->
* 每个节点的 Pod 数量不超过 110
* 节点数不超过 5,000
* Pod 总数不超过 150,000
* 容器总数不超过 300,000

<!-- 
You can scale your cluster by adding or removing nodes. The way you do this depends
on how your cluster is deployed.
-->
你可以通过添加或删除节点来扩展集群。集群扩缩的方式取决于集群的部署方式。

<!--  
## Cloud provider resource quotas {#quota-issues}

To avoid running into cloud provider quota issues, when creating a cluster with many nodes,
consider:
* Requesting a quota increase for cloud resources such as:
    * Computer instances
    * CPUs
    * Storage volumes
    * In-use IP addresses
    * Packet filtering rule sets
    * Number of load balancers
    * Network subnets
    * Log streams
* Gating the cluster scaling actions to bring up new nodes in batches, with a pause
  between batches, because some cloud providers rate limit the creation of new instances.
-->
## 云供应商资源配额 {#quota-issues}

为避免遇到云供应商配额问题，在创建具有大规模节点的集群时，请考虑以下事项：

* 请求增加云资源的配额，例如：
  * 计算实例
  * CPU
  * 存储卷
  * 使用中的 IP 地址
  * 数据包过滤规则集
  * 负载均衡数量
  * 网络子网
  * 日志流
* 由于某些云供应商限制了创建新实例的速度，因此通过分批启动新节点来控制集群扩展操作，并在各批之间有一个暂停。

<!--  
## Control plane components

For a large cluster, you need a control plane with sufficient compute and other
resources.

Typically you would run one or two control plane instances per failure zone,
scaling those instances vertically first and then scaling horizontally after reaching
the point of falling returns to (vertical) scale.
-->
## 控制面组件   {#control-plane-components}

对于大型集群，你需要一个具有足够计算能力和其他资源的控制平面。

通常，你将在每个故障区域运行一个或两个控制平面实例，
先垂直缩放这些实例，然后在到达下降点（垂直）后再水平缩放。

<!-- 
You should run at least one instance per failure zone to provide fault-tolerance. Kubernetes
nodes do not automatically steer traffic towards control-plane endpoints that are in the
same failure zone; however, your cloud provider might have its own mechanisms to do this.

For example, using a managed load balancer, you configure the load balancer to send traffic
that originates from the kubelet and Pods in failure zone _A_, and direct that traffic only
to the control plane hosts that are also in zone _A_. If a single control-plane host or
endpoint failure zone _A_ goes offline, that means that all the control-plane traffic for
nodes in zone _A_ is now being sent between zones. Running multiple control plane hosts in
each zone makes that outcome less likely.
-->
你应该在每个故障区域至少应运行一个实例，以提供容错能力。
Kubernetes 节点不会自动将流量引向相同故障区域中的控制平面端点。
但是，你的云供应商可能有自己的机制来执行此操作。

例如，使用托管的负载均衡器时，你可以配置负载均衡器发送源自故障区域 **A** 中的 kubelet 和 Pod 的流量，
并将该流量仅定向到也位于区域 **A** 中的控制平面主机。
如果单个控制平面主机或端点故障区域 **A** 脱机，则意味着区域 **A** 中的节点的所有控制平面流量现在都在区域之间发送。
在每个区域中运行多个控制平面主机能降低出现这种结果的可能性。

<!--
### etcd storage
-->
### etcd 存储   {#etcd-storage}

<!--
To improve performance of large clusters, you can store Event objects in a separate
dedicated etcd instance.
-->
为了提高大规模集群的性能，你可以将事件对象存储在单独的专用 etcd 实例中。

<!--
When creating a cluster, you can (using custom tooling):

* start and configure additional etcd instance
* configure the {{< glossary_tooltip term_id="kube-apiserver" text="API server" >}} to use it for storing events
-->
在创建集群时，你可以（使用自定义工具）：

* 启动并配置额外的 etcd 实例
* 配置 {{< glossary_tooltip term_id="kube-apiserver" text="API 服务器" >}}，将它用于存储事件

<!--
See [Operating etcd clusters for Kubernetes](/docs/tasks/administer-cluster/configure-upgrade-etcd/) and
[Set up a High Availability etcd cluster with kubeadm](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
for details on configuring and managing etcd for a large cluster.
-->
有关为大型集群配置和管理 etcd 的详细信息，
请参阅[为 Kubernetes 运行 etcd 集群](/zh-cn/docs/tasks/administer-cluster/configure-upgrade-etcd/)
和使用 [kubeadm 创建一个高可用 etcd 集群](/zh-cn/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)。

<!--
### Addon Resources
-->
### 插件资源   {#addon-resources}

<!--
Kubernetes [resource limits](/docs/concepts/configuration/manage-resources-containers/)
help to minimize the impact of memory leaks and other ways that pods and containers can
impact on other components. These resource limits apply to
{{< glossary_tooltip text="addon" term_id="addons" >}} resources just as they apply to application workloads.

For example, you can set CPU and memory limits for a logging component:
-->
Kubernetes [资源限制](/zh-cn/docs/concepts/configuration/manage-resources-containers/)
有助于最大程度地减少内存泄漏的影响以及 Pod 和容器可能对其他组件的其他方式的影响。
这些资源限制适用于{{< glossary_tooltip text="插件" term_id="addons" >}}资源，
就像它们适用于应用程序工作负载一样。

例如，你可以对日志组件设置 CPU 和内存限制：

```yaml
  ...
  containers:
  - name: fluentd-cloud-logging
    image: fluent/fluentd-kubernetes-daemonset:v1
    resources:
      limits:
        cpu: 100m
        memory: 200Mi
```

<!-- 
Addons' default limits are typically based on data collected from experience running
each addon on small or medium Kubernetes clusters. When running on large
clusters, addons often consume more of some resources than their default limits.
If a large cluster is deployed without adjusting these values, the addon(s)
may continuously get killed because they keep hitting the memory limit.
Alternatively, the addon may run but with poor performance due to CPU time
slice restrictions.
-->
插件的默认限制通常基于从中小规模 Kubernetes 集群上运行每个插件的经验收集的数据。
插件在大规模集群上运行时，某些资源消耗常常比其默认限制更多。
如果在不调整这些值的情况下部署了大规模集群，则插件可能会不断被杀死，因为它们不断达到内存限制。
或者，插件可能会运行，但由于 CPU 时间片的限制而导致性能不佳。

<!--  
To avoid running into cluster addon resource issues, when creating a cluster with
many nodes, consider the following:

* Some addons scale vertically - there is one replica of the addon for the cluster
  or serving a whole failure zone. For these addons, increase requests and limits
  as you scale out your cluster.
* Many addons scale horizontally - you add capacity by running more pods - but with
  a very large cluster you may also need to raise CPU or memory limits slightly.
  The [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) can run in _recommender_ mode to provide suggested
  figures for requests and limits.
* Some addons run as one copy per node, controlled by a {{< glossary_tooltip text="DaemonSet"
  term_id="daemonset" >}}: for example, a node-level log aggregator. Similar to
  the case with horizontally-scaled addons, you may also need to raise CPU or memory
  limits slightly.
-->
为避免遇到集群插件资源问题，在创建大规模集群时，请考虑以下事项：

* 部分垂直扩展插件 —— 总有一个插件副本服务于整个集群或服务于整个故障区域。
  对于这些附加组件，请在扩大集群时加大资源请求和资源限制。
* 许多水平扩展插件 —— 你可以通过运行更多的 Pod 来增加容量——但是在大规模集群下，
  可能还需要稍微提高 CPU 或内存限制。
  [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme)
  可以在 **recommender** 模式下运行，以提供有关请求和限制的建议数字。
* 一些插件在每个节点上运行一个副本，并由 DaemonSet 控制：
  例如，节点级日志聚合器。与水平扩展插件的情况类似，
  你可能还需要稍微提高 CPU 或内存限制。

## {{% heading "whatsnext" %}}

<!-- 
* `VerticalPodAutoscaler` is a custom resource that you can deploy into your cluster
to help you manage resource requests and limits for pods.  
Learn more about [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) 
and how you can use it to scale cluster
components, including cluster-critical addons.

* Read about [cluster autoscaling](/docs/concepts/cluster-administration/cluster-autoscaling/)
-->
* `VerticalPodAutoscaler` 是一种自定义资源，你可以将其部署到集群中，帮助你管理 Pod 的资源请求和资源限制。
  了解有关 [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme)
  的更多信息，了解如何用它扩展集群组件（包括对集群至关重要的插件）的信息。

* 阅读关于[集群自动扩缩容](/zh-cn/docs/concepts/cluster-administration/cluster-autoscaling/)的信息。

<!-- 
* The [addon resizer](https://github.com/kubernetes/autoscaler/tree/master/addon-resizer#readme)
helps you in resizing the addons automatically as your cluster's scale changes.
-->
* [addon resizer](https://github.com/kubernetes/autoscaler/tree/master/addon-resizer#readme)
  可帮助你在集群规模变化时自动调整插件的大小。
