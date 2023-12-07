---
title: Service ClusterIP 分配
content_type: concept
weight: 120
---

<!--
reviewers:
- sftim
- thockin
title: Service ClusterIP allocation
content_type: concept
weight: 120
-->

<!-- overview -->
<!--
In Kubernetes, [Services](/docs/concepts/services-networking/service/) are an abstract way to expose
an application running on a set of Pods. Services
can have a cluster-scoped virtual IP address (using a Service of `type: ClusterIP`).
Clients can connect using that virtual IP address, and Kubernetes then load-balances traffic to that
Service across the different backing Pods.
-->

在 Kubernetes 中，[Service](/zh-cn/docs/concepts/services-networking/service/) 是一种抽象的方式，
用于公开在一组 Pod 上运行的应用。
Service 可以具有集群作用域的虚拟 IP 地址（使用 `type: ClusterIP` 的 Service）。
客户端可以使用该虚拟 IP 地址进行连接，Kubernetes 通过不同的后台 Pod 对该 Service 的流量进行负载均衡。
<!-- body -->
<!--
## How Service ClusterIPs are allocated?
When Kubernetes needs to assign a virtual IP address for a Service,
that assignment happens one of two ways:

_dynamically_
: the cluster's control plane automatically picks a free IP address from within the configured IP range for `type: ClusterIP` Services.

_statically_
: you specify an IP address of your choice, from within the configured IP range for Services.

Across your whole cluster, every Service `ClusterIP` must be unique.
Trying to create a Service with a specific `ClusterIP` that has already
been allocated will return an error.
-->
## Service ClusterIP 是如何分配的？
当 Kubernetes 需要为 Service 分配虚拟 IP 地址时，该分配会通过以下两种方式之一进行：

**动态分配**
: 集群的控制面自动从所配置的 IP 范围内为 `type: ClusterIP` 选择一个空闲 IP 地址。

**静态分配**
: 根据为 Service 所配置的 IP 范围，选定并设置你的 IP 地址。

在整个集群中，每个 Service 的 `ClusterIP` 都必须是唯一的。
尝试使用已分配的 `ClusterIP` 创建 Service 将返回错误。

<!--
## Why do you need to reserve Service Cluster IPs?
Sometimes you may want to have Services running in well-known IP addresses, so other components and
users in the cluster can use them.
The best example is the DNS Service for the cluster. As a soft convention, some Kubernetes installers assign the 10th IP address from
the Service IP range to the DNS service. Assuming you configured your cluster with Service IP range
10.96.0.0/16 and you want your DNS Service IP to be 10.96.0.10, you'd have to create a Service like
this:
-->
## 为什么需要预留 Service 的 ClusterIP ？

有时你可能希望 Services 在众所周知的 IP 上面运行，以便集群中的其他组件和用户可以使用它们。

最好的例子是集群的 DNS Service。作为一种非强制性的约定，一些 Kubernetes 安装程序
将 Service IP 范围中的第 10 个 IP 地址分配给 DNS 服务。假设将集群的 Service IP 范围配置为 
10.96.0.0/16，并且希望 DNS Service IP 为 10.96.0.10，则必须创建如下 Service：

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
but as it was explained before, the IP address 10.96.0.10 has not been reserved; if other Services are created
before or in parallel with dynamic allocation, there is a chance they can allocate this IP, hence,
you will not be able to create the DNS Service because it will fail with a conflict error.
-->
但如前所述，IP 地址 10.96.0.10 尚未被保留。如果在 DNS 启动之前或同时采用动态分配机制创建其他 Service，
则它们有可能被分配此 IP，因此，你将无法创建 DNS Service，因为它会因冲突错误而失败。

<!--
## How can you avoid Service ClusterIP conflicts? {#avoid-ClusterIP-conflict}
The allocation strategy implemented in Kubernetes to allocate ClusterIPs to Services reduces the
risk of collision.
The `ClusterIP` range is divided, based on the formula `min(max(16, cidrSize / 16), 256)`,
described as _never less than 16 or more than 256 with a graduated step between them_.
Dynamic IP assignment uses the upper band by default, once this has been exhausted it will
use the lower range. This will allow users to use static allocations on the lower band with a low
risk of collision.
-->

## 如何避免 Service ClusterIP 冲突？{#avoid-ClusterIP-conflict}

Kubernetes 中用來将 ClusterIP 分配给 Service 的分配策略降低了冲突的风险。

`ClusterIP` 范围根据公式 `min(max(16, cidrSize / 16), 256)` 进行划分，
描述为不小于 16 且不大于 256，并在二者之间有一个渐进的步长。

默认情况下，动态 IP 分配使用地址较高的一段，一旦用完，它将使用较低范围。
这将允许用户在冲突风险较低的较低地址段上使用静态分配。

<!--
## Examples {#allocation-examples}
-->
## 示例 {#allocation-examples}

<!--
### Example 1 {#allocation-example-1}
This example uses the IP address range: 10.96.0.0/24 (CIDR notation) for the IP addresses
of Services.
-->
### 示例 1 {#allocation-example-1}

此示例使用 IP 地址范围：10.96.0.0/24（CIDR 表示法）作为 Service 的 IP 地址。
<!--
Range Size: 2<sup>8</sup> - 2 = 254  
Band Offset: `min(max(16, 256/16), 256)` = `min(16, 256)` = 16  
Static band start: 10.96.0.1  
Static band end: 10.96.0.16  
Range end: 10.96.0.254   

{{< mermaid >}}
pie showData
    title 10.96.0.0/24
    "Static" : 16
    "Dynamic" : 238
{{< /mermaid >}}
-->
范围大小：2<sup>8</sup> - 2 = 254  
带宽偏移量：`min(max(16, 256/16), 256)` = `min(16, 256)` = 16  
静态带宽起始地址：10.96.0.1  
静态带宽结束地址：10.96.0.16  
范围结束地址：10.96.0.254  

{{< mermaid >}}
pie showData
    title 10.96.0.0/24
    "静态分配" : 16
    "动态分配" : 238
{{< /mermaid >}}

<!--
### Example 2 {#allocation-example-2}
This example uses the IP address range: 10.96.0.0/20 (CIDR notation) for the IP addresses
of Services.
-->
### 示例 2 {#allocation-example-2}

此示例使用 IP 地址范围 10.96.0.0/20（CIDR 表示法）作为 Service 的 IP 地址。

<!--
Range Size: 2<sup>12</sup> - 2 = 4094  
Band Offset: `min(max(16, 4096/16), 256)` = `min(256, 256)` = 256  
Static band start: 10.96.0.1  
Static band end: 10.96.1.0  
Range end: 10.96.15.254  

{{< mermaid >}}
pie showData
    title 10.96.0.0/20
    "Static" : 256
    "Dynamic" : 3838
{{< /mermaid >}}
-->

范围大小：2<sup>12</sup> - 2 = 4094  
带宽偏移量：`min(max(16, 4096/16), 256)` = `min(256, 256)` = 256  
静态带宽起始地址：10.96.0.1  
静态带宽结束地址：10.96.1.0  
范围结束地址：10.96.15.254  

{{< mermaid >}}
pie showData
    title 10.96.0.0/20
    "静态分配" : 256
    "动态分配" : 3838
{{< /mermaid >}}

<!--
### Example 3 {#allocation-example-3}
This example uses the IP address range: 10.96.0.0/16 (CIDR notation) for the IP addresses
of Services.
-->
### 示例 3 {#allocation-example-3}

此示例使用 IP 地址范围 10.96.0.0/16（CIDR 表示法）作为 Service 的 IP 地址。

<!--
Range Size: 2<sup>16</sup> - 2 = 65534  
Band Offset: `min(max(16, 65536/16), 256)` = `min(4096, 256)` = 256  
Static band start: 10.96.0.1  
Static band ends: 10.96.1.0  
Range end: 10.96.255.254  

{{< mermaid >}}
pie showData
    title 10.96.0.0/16
    "Static" : 256
    "Dynamic" : 65278
{{< /mermaid >}}

-->
范围大小：2<sup>16</sup> - 2 = 65534  
带宽偏移量：`min(max(16, 65536/16), 256)` = `min(4096, 256)` = 256  
静态带宽起始地址：10.96.0.1  
静态带宽结束地址：10.96.1.0  
范围结束地址：10.96.255.254  

{{< mermaid >}}
pie showData
    title 10.96.0.0/16
    "静态分配" : 256
    "动态分配" : 65278
{{< /mermaid >}}

<!--
## {{% heading "whatsnext" %}}
* Read about [Service External Traffic Policy](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)
* Read about [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/)
* Read about [Services](/docs/concepts/services-networking/service/)
-->
## {{% heading "whatsnext" %}}

* 阅读[服务外部流量策略](/zh-cn/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)
* 阅读[应用程序与服务连接](/zh-cn/docs/tutorials/services/connect-applications-service/)
* 阅读[服务](/zh-cn/docs/concepts/services-networking/service/)

