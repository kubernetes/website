---
layout: blog
title: "Kubernetes 1.24: 避免为 Services 分配 IP 地址时发生冲突"
date: 2022-05-23
slug: service-ip-dynamic-and-static-allocation
---
<!--
layout: blog
title: "Kubernetes 1.24: Avoid Collisions Assigning IP Addresses to Services"
date: 2022-05-23
slug: service-ip-dynamic-and-static-allocation
-->

<!--
**Author:** Antonio Ojea (Red Hat)
-->
**作者：** Antonio Ojea (Red Hat)

<!--
In Kubernetes, [Services](/docs/concepts/services-networking/service/) are an abstract way to expose
an application running on a set of Pods. Services
can have a cluster-scoped virtual IP address (using a Service of `type: ClusterIP`).
Clients can connect using that virtual IP address, and Kubernetes then load-balances traffic to that
Service across the different backing Pods.
-->
在 Kubernetes 中，[Services](/zh-cn/docs/concepts/services-networking/service/)
是一种抽象，用来暴露运行在一组 Pod 上的应用。
Service 可以有一个集群范围的虚拟 IP 地址（使用 `type: ClusterIP` 的 Service）。
客户端可以使用该虚拟 IP 地址进行连接， Kubernetes 为对该 Service 的访问流量提供负载均衡，以访问不同的后端 Pod。

<!--
## How Service ClusterIPs are allocated?
-->
## Service ClusterIP 是如何分配的？

<!--
A Service `ClusterIP` can be assigned:
-->
Service `ClusterIP` 有如下分配方式：

<!--
_dynamically_
: the cluster's control plane automatically picks a free IP address from within the configured IP range for `type: ClusterIP` Services.
-->
**动态**
：集群的控制平面会自动从配置的 IP 范围内为 `type:ClusterIP` 的 Service 选择一个空闲 IP 地址。

<!--
_statically_
: you specify an IP address of your choice, from within the configured IP range for Services.
-->
**静态**
：你可以指定一个来自 Service 配置的 IP 范围内的 IP 地址。

<!--
Across your whole cluster, every Service `ClusterIP` must be unique.
Trying to create a Service with a specific `ClusterIP` that has already
been allocated will return an error.
-->
在整个集群中，每个 Service 的 `ClusterIP` 必须是唯一的。
尝试创建一个已经被分配了 `ClusterIP` 的 Service 将会返回错误。

<!--
## Why do you need to reserve Service Cluster IPs?
-->
## 为什么需要预留 Service Cluster IP？

<!--
Sometimes you may want to have Services running in well-known IP addresses, so other components and
users in the cluster can use them.
-->
有时，你可能希望让 Service 运行在众所周知的 IP 地址上，以便集群中的其他组件和用户可以使用它们。

<!--
The best example is the DNS Service for the cluster. Some Kubernetes installers assign the 10th address from
the Service IP range to the DNS service. Assuming you configured your cluster with Service IP range
10.96.0.0/16 and you want your DNS Service IP to be 10.96.0.10, you'd have to create a Service like
this:
-->
最好的例子是集群的 DNS Service。一些 Kubernetes 安装程序将 Service IP 范围中的第 10 个地址分配给 DNS Service。
假设你配置集群 Service IP 范围是 10.96.0.0/16，并且希望 DNS Service IP 为 10.96.0.10，
那么你必须创建一个如下所示的 Service：

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    k8s-app: kube-dns
    kubernetes.io/cluster-service: "true"
    kubernetes.io/name: CoreDNS
  name: kube-dns
  namespace: kube-system
spec:
  clusterIP: 10.96.0.10
  ports:
  - name: dns
    port: 53
    protocol: UDP
    targetPort: 53
  - name: dns-tcp
    port: 53
    protocol: TCP
    targetPort: 53
  selector:
    k8s-app: kube-dns
  type: ClusterIP
```

<!--
but as I explained before, the IP address 10.96.0.10 has not been reserved; if other Services are created
before or in parallel with dynamic allocation, there is a chance they can allocate this IP, hence,
you will not be able to create the DNS Service because it will fail with a conflict error.
-->
但正如我之前解释的，IP 地址 10.96.0.10 没有被保留；
如果其他 Service 在动态分配之前创建或与动态分配并行创建，则它们有可能分配此 IP 地址，
因此，你将无法创建 DNS Service，因为它将因冲突错误而失败。

<!--
## How can you avoid Service ClusterIP conflicts? {#avoid-ClusterIP-conflict}
-->
## 如何避免 Service ClusterIP 冲突？ {#avoid-ClusterIP-conflict}

<!--
In Kubernetes 1.24, you can enable a new feature gate `ServiceIPStaticSubrange`.
Turning this on allows you to use a different IP
allocation strategy for Services, reducing the risk of collision.
-->
在 Kubernetes 1.24 中，你可以启用一个新的特性门控 `ServiceIPStaticSubrange`。
启用此特性允许你为 Service 使用不同的 IP 分配策略，减少冲突的风险。

<!--
The `ClusterIP` range will be divided, based on the formula `min(max(16, cidrSize / 16), 256)`,
described as _never less than 16 or more than 256 with a graduated step between them_.
-->
`ClusterIP` 范围将根据公式 `min(max(16, cidrSize / 16), 256)` 进行划分，
该公式可描述为 “在不小于 16 且不大于 256 之间有一个步进量（Graduated Step）”。

<!--
Dynamic IP assignment will use the upper band by default, once this has been exhausted it will
use the lower range. This will allow users to use static allocations on the lower band with a low
risk of collision.
-->
分配默认使用上半段地址，当上半段地址耗尽后，将使用下半段地址范围。
这将允许用户在下半段地址中使用静态分配从而降低冲突的风险。

<!--
Examples:
-->
举例：

<!--
#### Service IP CIDR block: 10.96.0.0/24
-->
#### Service IP CIDR 地址段： 10.96.0.0/24

<!--
Range Size: 2<sup>8</sup> - 2 = 254  
Band Offset: `min(max(16, 256/16), 256)` = `min(16, 256)` = 16  
Static band start: 10.96.0.1  
Static band end: 10.96.0.16  
Range end: 10.96.0.254   
-->
地址段大小：2<sup>8</sup> - 2 = 254  
地址段偏移：`min(max(16, 256/16), 256)` = `min(16, 256)` = 16  
静态地址段起点：10.96.0.1  
静态地址段终点：10.96.0.16  
地址范围终点：10.96.0.254

<!--
{{< mermaid >}}
pie showData
    title 10.96.0.0/24
    "Static" : 16
    "Dynamic" : 238
{{< /mermaid >}}
-->
{{< mermaid >}}
pie showData
title 10.96.0.0/24
"静态" : 16
"动态" : 238
{{< /mermaid >}}

<!--
#### Service IP CIDR block: 10.96.0.0/20
-->
#### Service IP CIDR 地址段： 10.96.0.0/20

<!--
Range Size: 2<sup>12</sup> - 2 = 4094  
Band Offset: `min(max(16, 4096/16), 256)` = `min(256, 256)` = 256  
Static band start: 10.96.0.1  
Static band end: 10.96.1.0  
Range end: 10.96.15.254  
-->
地址段大小：2<sup>12</sup> - 2 = 4094  
地址段偏移：`min(max(16, 4096/16), 256)` = `min(256, 256)` = 256  
静态地址段起点：10.96.0.1  
静态地址段终点：10.96.1.0  
地址范围终点：10.96.15.254

<!--
{{< mermaid >}}
pie showData
    title 10.96.0.0/20
    "Static" : 256
    "Dynamic" : 3838
{{< /mermaid >}}
-->
{{< mermaid >}}
pie showData
title 10.96.0.0/20
"静态" : 256
"动态" : 3838
{{< /mermaid >}}

<!--
#### Service IP CIDR block: 10.96.0.0/16
-->
#### Service IP CIDR 地址段： 10.96.0.0/16

<!--
Range Size: 2<sup>16</sup> - 2 = 65534  
Band Offset: `min(max(16, 65536/16), 256)` = `min(4096, 256)` = 256  
Static band start: 10.96.0.1  
Static band ends: 10.96.1.0  
Range end: 10.96.255.254  
-->
地址段大小：2<sup>16</sup> - 2 = 65534  
地址段偏移：`min(max(16, 65536/16), 256)` = `min(4096, 256)` = 256  
静态地址段起点：10.96.0.1  
静态地址段终点：10.96.1.0  
地址范围终点：10.96.255.254

<!--
{{< mermaid >}}
pie showData
    title 10.96.0.0/16
    "Static" : 256
    "Dynamic" : 65278
{{< /mermaid >}}
-->
{{< mermaid >}}
pie showData
title 10.96.0.0/16
"静态" : 256
"动态" : 65278
{{< /mermaid >}}

<!--
## Get involved with SIG Network
-->
## 加入 SIG Network

<!--
The current SIG-Network [KEPs](https://github.com/orgs/kubernetes/projects/10) and [issues](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue+label%3Asig%2Fnetwork) on GitHub illustrate the SIG’s areas of emphasis.
-->
当前 SIG-Network 在 GitHub 上的 [KEPs](https://github.com/orgs/kubernetes/projects/10) 和
[issues](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue+label%3Asig%2Fnetwork)
表明了该 SIG 的重点领域。

<!--
[SIG Network meetings](https://github.com/kubernetes/community/tree/master/sig-network) are a friendly, welcoming venue for you to connect with the community and share your ideas.
Looking forward to hearing from you!
-->
[SIG Network 会议](https://github.com/kubernetes/community/tree/master/sig-network)是一个友好、热情的地方，
你可以与社区联系并分享你的想法。期待你的回音！
