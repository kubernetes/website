---
title: 集群网络系统
content_type: concept
weight: 50
---
<!--
reviewers:
- thockin
title: Cluster Networking
content_type: concept
weight: 50
-->

<!-- overview -->

<!--
Networking is a central part of Kubernetes, but it can be challenging to
understand exactly how it is expected to work.  There are 4 distinct networking
problems to address:

1. Highly-coupled container-to-container communications: this is solved by
   {{< glossary_tooltip text="Pods" term_id="pod" >}} and `localhost` communications.
2. Pod-to-Pod communications: this is the primary focus of this document.
3. Pod-to-Service communications: this is covered by [Services](/docs/concepts/services-networking/service/).
4. External-to-Service communications: this is also covered by Services.
-->
集群网络系统是 Kubernetes 的核心部分，但是想要准确了解它的工作原理可是个不小的挑战。
下面列出的是网络系统的的四个主要问题：

1. 高度耦合的容器间通信：这个已经被 {{< glossary_tooltip text="Pod" term_id="pod" >}}
   和 `localhost` 通信解决了。
2. Pod 间通信：这是本文档讲述的重点。
3. Pod 与 Service 间通信：涵盖在 [Service](/zh-cn/docs/concepts/services-networking/service/) 中。
4. 外部与 Service 间通信：也涵盖在 Service 中。

<!-- body -->

<!--
Kubernetes is all about sharing machines among applications.  Typically,
sharing machines requires ensuring that two applications do not try to use the
same ports.  Coordinating ports across multiple developers is very difficult to
do at scale and exposes users to cluster-level issues outside of their control.
-->
Kubernetes 的宗旨就是在应用之间共享机器。
通常来说，共享机器需要两个应用之间不能使用相同的端口，但是在多个应用开发者之间
去大规模地协调端口是件很困难的事情，尤其是还要让用户暴露在他们控制范围之外的集群级别的问题上。

<!--
Dynamic port allocation brings a lot of complications to the system - every
application has to take ports as flags, the API servers have to know how to
insert dynamic port numbers into configuration blocks, services have to know
how to find each other, etc.  Rather than deal with this, Kubernetes takes a
different approach.

To learn about the Kubernetes networking model, see [here](/docs/concepts/services-networking/).
-->
动态分配端口也会给系统带来很多复杂度 - 每个应用都需要设置一个端口的参数，
而 API 服务器还需要知道如何将动态端口数值插入到配置模块中，服务也需要知道如何找到对方等等。
与其去解决这些问题，Kubernetes 选择了其他不同的方法。

要了解 Kubernetes 网络模型，请参阅[此处](/zh-cn/docs/concepts/services-networking/)。

<!--
## Kubernetes IP address ranges

Kubernetes clusters require to allocate non-overlapping IP addresses for Pods, Services and Nodes,
from a range of available addresses configured in the following components:
-->
## Kubernetes IP 地址范围   {#kubernetest-ip-address-ranges}

Kubernetes 集群需要从以下组件中配置的可用地址范围中为 Pod、Service 和 Node 分配不重叠的 IP 地址：

<!--
- The network plugin is configured to assign IP addresses to Pods.
- The kube-apiserver is configured to assign IP addresses to Services.
- The kubelet or the cloud-controller-manager is configured to assign IP addresses to Nodes.
-->
- 网络插件配置为向 Pod 分配 IP 地址。
- kube-apiserver 配置为向 Service 分配 IP 地址。
- kubelet 或 cloud-controller-manager 配置为向 Node 分配 IP 地址。

<!--
{{< figure src="/docs/images/kubernetes-cluster-network.svg" alt="A figure illustrating the different network ranges in a kubernetes cluster" class="diagram-medium" >}}
-->
{{< figure src="/zh-cn/docs/images/kubernetes-cluster-network.svg" alt="此图展示了 Kubernetes 集群中不同的网络范围" class="diagram-medium" >}}

<!--
## Cluster networking types {#cluster-network-ipfamilies}

Kubernetes clusters, attending to the IP families configured, can be categorized into:
-->
## 集群网络类型   {#cluster-network-ipfamilies}

根据配置的 IP 协议族，Kubernetes 集群可以分为以下几类：

<!--
- IPv4 only: The network plugin, kube-apiserver and kubelet/cloud-controller-manager are configured to assign only IPv4 addresses.
- IPv6 only: The network plugin, kube-apiserver and kubelet/cloud-controller-manager are configured to assign only IPv6 addresses.
- IPv4/IPv6 or IPv6/IPv4 [dual-stack](/docs/concepts/services-networking/dual-stack/):
  - The network plugin is configured to assign IPv4 and IPv6 addresses.
  - The kube-apiserver is configured to assign IPv4 and IPv6 addresses.
  - The kubelet or cloud-controller-manager is configured to assign IPv4 and IPv6 address.
  - All components must agree on the configured primary IP family.
-->
- 仅 IPv4：网络插件、kube-apiserver 和 kubelet/cloud-controller-manager 配置为仅分配 IPv4 地址。
- 仅 IPv6：网络插件、kube-apiserver 和 kubelet/cloud-controller-manager 配置为仅分配 IPv6 地址。
- IPv4/IPv6 或 IPv6/IPv4 [双协议栈](/zh-cn/docs/concepts/services-networking/dual-stack/)：
  - 网络插件配置为分配 IPv4 和 IPv6 地址。
  - kube-apiserver 配置为分配 IPv4 和 IPv6 地址。
  - kubelet 或 cloud-controller-manager 配置为分配 IPv4 和 IPv6 地址。
  - 所有组件必须就配置的主要 IP 协议族达成一致。

<!--
Kubernetes clusters only consider the IP families present on the Pods, Services and Nodes objects,
independently of the existing IPs of the represented objects. Per example, a server or a pod can have multiple
IP addresses on its interfaces, but only the IP addresses in `node.status.addresses` or `pod.status.ips` are
considered for implementing the Kubernetes network model and defining the type of the cluster.
-->
Kubernetes 集群只考虑 Pod、Service 和 Node 对象中存在的 IP 协议族，而不考虑所表示对象的现有 IP。
例如，服务器或 Pod 的接口上可以有多个 IP 地址，但只有 `node.status.addresses` 或 `pod.status.ips`
中的 IP 地址被认为是实现 Kubernetes 网络模型和定义集群类型的。

<!--
## How to implement the Kubernetes network model

The network model is implemented by the container runtime on each node. The most common container
runtimes use [Container Network Interface](https://github.com/containernetworking/cni) (CNI)
plugins to manage their network and security capabilities. Many different CNI plugins exist from
many different vendors. Some of these provide only basic features of adding and removing network
interfaces, while others provide more sophisticated solutions, such as integration with other
container orchestration systems, running multiple CNI plugins, advanced IPAM features etc.
-->
## 如何实现 Kubernetes 的网络模型    {#how-to-implement-the-kubernetes-network-model}

网络模型由各节点上的容器运行时来实现。最常见的容器运行时使用
[Container Network Interface](https://github.com/containernetworking/cni) (CNI) 插件来管理其网络和安全能力。
来自不同供应商 CNI 插件有很多。其中一些仅提供添加和删除网络接口的基本功能，
而另一些则提供更复杂的解决方案，例如与其他容器编排系统集成、运行多个 CNI 插件、高级 IPAM 功能等。

<!--
See [this page](/docs/concepts/cluster-administration/addons/#networking-and-network-policy)
for a non-exhaustive list of networking addons supported by Kubernetes.
-->
请参阅[此页面](/zh-cn/docs/concepts/cluster-administration/addons/#networking-and-network-policy)了解
Kubernetes 支持的网络插件的非详尽列表。

## {{% heading "whatsnext" %}}

<!--
The early design of the networking model and its rationale are described in more detail in the
[networking design document](https://git.k8s.io/design-proposals-archive/network/networking.md).
For future plans and some on-going efforts that aim to improve Kubernetes networking, please
refer to the SIG-Network
[KEPs](https://github.com/kubernetes/enhancements/tree/master/keps/sig-network).
-->
网络模型的早期设计、运行原理都在[联网设计文档](https://git.k8s.io/design-proposals-archive/network/networking.md)里有详细描述。
关于未来的计划，以及旨在改进 Kubernetes 联网能力的一些正在进行的工作，可以参考 SIG Network
的 [KEPs](https://github.com/kubernetes/enhancements/tree/master/keps/sig-network)。
