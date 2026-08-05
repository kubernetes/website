---
title: "服务、负载均衡和联网"
weight: 60
description: >
  Kubernetes 网络背后的概念和资源。
---
<!--
title: "Services, Load Balancing, and Networking"
weight: 60
description: >
  Concepts and resources behind networking in Kubernetes.
-->

<!--
## The Kubernetes network model

The Kubernetes network model is built out of several pieces:

* Each [pod](/docs/concepts/workloads/pods/) in a cluster gets its
  own unique cluster-wide IP address.

  * A pod has its own private network namespace which is shared by
    all of the containers within the pod. Processes running in
    different containers in the same pod can communicate with each
    other over `localhost`.
-->
## Kubernetes 网络模型   {#the-kubernetes-network-model}

Kubernetes 网络模型由几个部分构成：

* 集群中的每个 [Pod](/zh-cn/docs/concepts/workloads/pods/)
  都会获得自己的、独一无二的集群范围 IP 地址。

  * Pod 有自己的私有网络命名空间，Pod 内的所有容器共享这个命名空间。
    运行在同一个 Pod 中的不同容器的进程彼此之间可以通过 `localhost` 进行通信。

<!--
* The _pod network_ (also called a cluster network) handles communication
  between pods. It ensures that (barring intentional network segmentation):

  * All pods can communicate with all other pods, whether they are
    on the same [node](/docs/concepts/architecture/nodes/) or on
    different nodes. Pods can communicate with each other
    directly, without the use of proxies or address translation (NAT).

    On Windows, this rule does not apply to host-network pods.

  * Agents on a node (such as system daemons, or kubelet) can
    communicate with all pods on that node.
-->
* **Pod 网络**（也称为集群网络）处理 Pod 之间的通信。它确保（除非故意进行网络分段）：

  * 所有 Pod 可以与所有其他 Pod 进行通信，
    无论它们是在同一个[节点](/zh-cn/docs/concepts/architecture/nodes/)还是在不同的节点上。
    Pod 可以直接相互通信，而无需使用代理或地址转换（NAT）。

    在 Windows 上，这条规则不适用于主机网络 Pod。

  * 节点上的代理（例如系统守护进程或 kubelet）可以与该节点上的所有 Pod 进行通信。

<!--
* The [Service](/docs/concepts/services-networking/service/) API
  lets you provide a stable (long lived) IP address or hostname for a service implemented
  by one or more backend pods, where the individual pods making up
  the service can change over time.

  * Kubernetes automatically manages
    [EndpointSlice](/docs/concepts/services-networking/endpoint-slices/)
    objects to provide information about the pods currently backing a Service.

  * A service proxy implementation monitors the set of Service and
    EndpointSlice objects, and programs the data plane to route
    service traffic to its backends, by using operating system or
    cloud provider APIs to intercept or rewrite packets.
-->
* [Service](/zh-cn/docs/concepts/services-networking/service/) API
  允许你为由一个或多个后端 Pod 实现的服务提供一个稳定（长效）的 IP 地址或主机名，
  其中组成服务的各个 Pod 可以随时变化。

  * Kubernetes 会自动管理
    [EndpointSlice](/zh-cn/docs/concepts/services-networking/endpoint-slices/)
    对象，以提供有关当前用来提供 Service 的 Pod 的信息。

  * 服务代理实现通过使用操作系统或云平台 API 来拦截或重写数据包，
    监视 Service 和 EndpointSlice 对象集，并在数据平面编程将服务流量路由到其后端。

<!--
* The [Gateway](/docs/concepts/services-networking/gateway/) API
  (or its predecessor, [Ingress](/docs/concepts/services-networking/ingress/))
  allows you to make Services accessible to clients that are outside the cluster.

  * A simpler, but less-configurable, mechanism for cluster
    ingress is available via the Service API's
    [`type: LoadBalancer`](/docs/concepts/services-networking/service/#loadbalancer),
    when using a supported {{< glossary_tooltip term_id="cloud-provider">}}.

* [NetworkPolicy](/docs/concepts/services-networking/network-policies) is a built-in
  Kubernetes API that allows you to control traffic between pods, or between pods and
  the outside world.
-->
* [Gateway](/zh-cn/docs/concepts/services-networking/gateway/) API
  （或其前身 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/)
  使得集群外部的客户端能够访问 Service。

  * 当使用受支持的 {{< glossary_tooltip term_id="cloud-provider">}} 时，通过 Service API 的
    [`type: LoadBalancer`](/zh-cn/docs/concepts/services-networking/service/#loadbalancer)
    可以使用一种更简单但可配置性较低的集群 Ingress 机制。

* [NetworkPolicy](/zh-cn/docs/concepts/services-networking/network-policies)
  是一个内置的 Kubernetes API，允许你控制 Pod 之间的流量或 Pod 与外部世界之间的流量。

<!--
In older container systems, there was no automatic connectivity
between containers on different hosts, and so it was often necessary
to explicitly create links between containers, or to map container
ports to host ports to make them reachable by containers on other
hosts. This is not needed in Kubernetes; Kubernetes's model is that
pods can be treated much like VMs or physical hosts from the
perspectives of port allocation, naming, service discovery, load
balancing, application configuration, and migration.
-->
在早期的容器系统中，不同主机上的容器之间没有自动连通，
因此通常需要显式创建容器之间的链路，或将容器端口映射到主机端口，以便其他主机上的容器能够访问。
在 Kubernetes 中并不需要如此操作；在 Kubernetes 的网络模型中，
从端口分配、命名、服务发现、负载均衡、应用配置和迁移的角度来看，Pod 可以被视作虚拟机或物理主机。

<!--
Only a few parts of this model are implemented by Kubernetes itself.
For the other parts, Kubernetes defines the APIs, but the
corresponding functionality is provided by external components, some
of which are optional:

* Pod network namespace setup is handled by system-level software implementing the
  [Container Runtime Interface](/docs/concepts/containers/cri/).
-->
这个模型只有少部分是由 Kubernetes 自身实现的。
对于其他部分，Kubernetes 定义 API，但相应的功能由外部组件提供，其中一些是可选的：

* Pod 网络命名空间的设置由实现[容器运行时接口（CRI）](/zh-cn/docs/concepts/containers/cri/)的系统层面软件处理。

<!--
* The pod network itself is managed by a
  [pod network implementation](/docs/concepts/cluster-administration/addons/#networking-and-network-policy).
  On Linux, most container runtimes use the
  {{< glossary_tooltip text="Container Networking Interface (CNI)" term_id="cni" >}}
  to interact with the pod network implementation, so these
  implementations are often called _CNI plugins_.

* Kubernetes provides a default implementation of service proxying,
  called {{< glossary_tooltip term_id="kube-proxy">}}, but some pod
  network implementations instead use their own service proxy that
  is more tightly integrated with the rest of the implementation.
-->
* Pod 网络本身由
  [Pod 网络实现](/zh-cn/docs/concepts/cluster-administration/addons/#networking-and-network-policy)管理。
  在 Linux 上，大多数容器运行时使用{{< glossary_tooltip text="容器网络接口 (CNI)" term_id="cni" >}}
  与 Pod 网络实现进行交互，因此这些实现通常被称为 **CNI 插件**。

* Kubernetes 提供了一个默认的服务代理实现，称为 {{< glossary_tooltip term_id="kube-proxy">}}，
  但某些 Pod 网络实现使用其自己的服务代理，以便与实现的其余组件集成得更紧密。

<!--
* NetworkPolicy is generally also implemented by the pod network
  implementation. (Some simpler pod network implementations don't
  implement NetworkPolicy, or an administrator may choose to
  configure the pod network without NetworkPolicy support. In these
  cases, the API will still be present, but it will have no effect.)

* There are many [implementations of the Gateway API](https://gateway-api.sigs.k8s.io/implementations/),
  some of which are specific to particular cloud environments, some more
  focused on "bare metal" environments, and others more generic.
-->
* NetworkPolicy 通常也由 Pod 网络实现提供支持。
  （某些更简单的 Pod 网络实现不支持 NetworkPolicy，或者管理员可能会选择在不支持 NetworkPolicy
  的情况下配置 Pod 网络。在这些情况下，API 仍然存在，但将没有效果。）

* [Gateway API 的实现](https://gateway-api.sigs.k8s.io/implementations/)有很多，
  其中一些特定于某些云环境，还有一些更专注于“裸金属”环境，而其他一些则更加通用。

## {{% heading "whatsnext" %}}

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
