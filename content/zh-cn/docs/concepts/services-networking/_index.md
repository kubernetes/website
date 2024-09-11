---
title: "服务、负载均衡和联网"
weight: 60
description: Kubernetes 网络背后的概念和资源。
---

<!--
## The Kubernetes network model

Every [`Pod`](/docs/concepts/workloads/pods/) in a cluster gets its own unique cluster-wide IP address
(one address per IP address family).
This means you do not need to explicitly create links between `Pods` and you
almost never need to deal with mapping container ports to host ports.  
This creates a clean, backwards-compatible model where `Pods` can be treated
much like VMs or physical hosts from the perspectives of port allocation,
naming, service discovery, [load balancing](/docs/concepts/services-networking/ingress/#load-balancing),
application configuration, and migration.
-->
## Kubernetes 网络模型   {#the-kubernetes-network-model}

集群中每一个 [`Pod`](/zh-cn/docs/concepts/workloads/pods/) 都会获得自己的、
独一无二的 IP 地址（每个 IP 地址族一个地址），
这就意味着你不需要显式地在 `Pod` 之间创建链接，你几乎不需要处理容器端口到主机端口之间的映射。
这将形成一个干净的、向后兼容的模型；在这个模型里，从端口分配、命名、服务发现、
[负载均衡](/zh-cn/docs/concepts/services-networking/ingress/#load-balancing)、
应用配置和迁移的角度来看，`Pod` 可以被视作虚拟机或者物理主机。

<!--
Kubernetes imposes the following fundamental requirements on any networking
implementation (barring any intentional network segmentation policies):
-->
Kubernetes 强制要求所有网络设施都满足以下基本要求（从而排除了有意隔离网络的策略）：

<!--
* pods can communicate with all other pods on any other [node](/docs/concepts/architecture/nodes/) 
  without NAT
* agents on a node (e.g. system daemons, kubelet) can communicate with all
  pods on that node
-->
* Pod 能够与所有其他[节点](/zh-cn/docs/concepts/architecture/nodes/)上的 Pod 通信，
  且不需要网络地址转译（NAT）
* 节点上的代理（比如：系统守护进程、kubelet）可以和节点上的所有 Pod 通信

<!--
For those platforms that support `Pods` running in the host network (such as Linux), when pods are attached to the host network of a node they can still communicate with all pods on all nodes without NAT.
-->
对于支持在主机网络中运行 `Pod` 的平台（比如：Linux），
当 Pod 挂接到节点的宿主网络上时，它们仍可以不通过 NAT 和所有节点上的 Pod 通信。

<!--
This model is not only less complex overall, but it is principally compatible
with the desire for Kubernetes to enable low-friction porting of apps from VMs
to containers.  If your job previously ran in a VM, your VM had an IP and could
talk to other VMs in your project.  This is the same basic model.

Kubernetes IP addresses exist at the `Pod` scope - containers within a `Pod`
share their network namespaces - including their IP address and MAC address.
This means that containers within a `Pod` can all reach each other's ports on
`localhost`. This also means that containers within a `Pod` must coordinate port
usage, but this is no different from processes in a VM.  This is called the
"IP-per-pod" model.
-->
这个模型不仅不复杂，而且还和 Kubernetes 的实现从虚拟机向容器平滑迁移的初衷相符，
如果你的任务开始是在虚拟机中运行的，你的虚拟机有一个 IP，
可以和项目中其他虚拟机通信。这里的模型是基本相同的。

Kubernetes 的 IP 地址存在于 `Pod` 范围内 —— 容器共享它们的网络命名空间 ——
包括它们的 IP 地址和 MAC 地址。
这就意味着 `Pod` 内的容器都可以通过 `localhost` 到达对方端口。
这也意味着 `Pod` 内的容器需要相互协调端口的使用，但是这和虚拟机中的进程似乎没有什么不同，
这也被称为“一个 Pod 一个 IP”模型。

<!--
How this is implemented is a detail of the particular container runtime in use.

It is possible to request ports on the `Node` itself which forward to your `Pod`
(called host ports), but this is a very niche operation. How that forwarding is
implemented is also a detail of the container runtime. The `Pod` itself is
blind to the existence or non-existence of host ports.
-->
如何实现以上需求是所使用的特定容器运行时的细节。

也可以在 `Node` 本身请求端口，并用这类端口转发到你的 `Pod`（称之为主机端口），
但这是一个很特殊的操作。转发方式如何实现也是容器运行时的细节。
`Pod` 自己并不知道这些主机端口的存在。

<!--
Kubernetes networking addresses four concerns:
- Containers within a Pod [use networking to communicate](/docs/concepts/services-networking/dns-pod-service/) via loopback.
- Cluster networking provides communication between different Pods.
- The [Service](/docs/concepts/services-networking/service/) API lets you
  [expose an application running in Pods](/docs/tutorials/services/connect-applications-service/)
  to be reachable from outside your cluster.
  - [Ingress](/docs/concepts/services-networking/ingress/) provides extra functionality
    specifically for exposing HTTP applications, websites and APIs.
  - [Gateway API](/docs/concepts/services-networking/gateway/) is an {{<glossary_tooltip text="add-on" term_id="addons">}}
    that provides an expressive, extensible, and role-oriented family of API kinds for modeling service networking.
- You can also use Services to
  [publish services only for consumption inside your cluster](/docs/concepts/services-networking/service-traffic-policy/).
-->
Kubernetes 网络解决四方面的问题：

- 一个 Pod 中的容器之间[通过本地回路（loopback）通信](/zh-cn/docs/concepts/services-networking/dns-pod-service/)。
- 集群网络在不同 Pod 之间提供通信。
- [Service](/zh-cn/docs/concepts/services-networking/service/) API
  允许你[向外暴露 Pod 中运行的应用](/zh-cn/docs/tutorials/services/connect-applications-service/)，
  以支持来自于集群外部的访问。
  - [Ingress](/zh-cn/docs/concepts/services-networking/ingress/)
    提供专门用于暴露 HTTP 应用程序、网站和 API 的额外功能。
  - [Gateway API](/zh-cn/docs/concepts/services-networking/gateway/)
    是一个{{<glossary_tooltip text="插件" term_id="addons">}}，
    为服务网络建模提供富有表现力、可扩展和面向角色的 API 系列类别。
- 你也可以使用 Service
  来[发布仅供集群内部使用的服务](/zh-cn/docs/concepts/services-networking/service-traffic-policy/)。

<!--
The [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/)
tutorial lets you learn about Services and Kubernetes networking with a hands-on example.

[Cluster Networking](/docs/concepts/cluster-administration/networking/) explains how to set
up networking for your cluster, and also provides an overview of the technologies involved.
-->
[使用 Service 连接到应用](/zh-cn/docs/tutorials/services/connect-applications-service/)教程通过一个实际的示例让你了解
Service 和 Kubernetes 如何联网。

[集群网络](/zh-cn/docs/concepts/cluster-administration/networking/)解释了如何为集群设置网络，
还概述了所涉及的技术。
