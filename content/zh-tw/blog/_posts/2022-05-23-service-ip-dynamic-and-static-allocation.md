---
layout: blog
title: "Kubernetes 1.24: 避免爲 Services 分配 IP 地址時發生衝突"
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
是一種抽象，用來暴露運行在一組 Pod 上的應用。
Service 可以有一個叢集範圍的虛擬 IP 地址（使用 `type: ClusterIP` 的 Service）。
客戶端可以使用該虛擬 IP 地址進行連接， Kubernetes 爲對該 Service 的訪問流量提供負載均衡，以訪問不同的後端 Pod。

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
**動態**
：叢集的控制平面會自動從設定的 IP 範圍內爲 `type:ClusterIP` 的 Service 選擇一個空閒 IP 地址。

<!--
_statically_
: you specify an IP address of your choice, from within the configured IP range for Services.
-->
**靜態**
：你可以指定一個來自 Service 設定的 IP 範圍內的 IP 地址。

<!--
Across your whole cluster, every Service `ClusterIP` must be unique.
Trying to create a Service with a specific `ClusterIP` that has already
been allocated will return an error.
-->
在整個叢集中，每個 Service 的 `ClusterIP` 必須是唯一的。
嘗試創建一個已經被分配了 `ClusterIP` 的 Service 將會返回錯誤。

<!--
## Why do you need to reserve Service Cluster IPs?
-->
## 爲什麼需要預留 Service Cluster IP？

<!--
Sometimes you may want to have Services running in well-known IP addresses, so other components and
users in the cluster can use them.
-->
有時，你可能希望讓 Service 運行在衆所周知的 IP 地址上，以便叢集中的其他組件和使用者可以使用它們。

<!--
The best example is the DNS Service for the cluster. Some Kubernetes installers assign the 10th address from
the Service IP range to the DNS service. Assuming you configured your cluster with Service IP range
10.96.0.0/16 and you want your DNS Service IP to be 10.96.0.10, you'd have to create a Service like
this:
-->
最好的例子是叢集的 DNS Service。一些 Kubernetes 安裝程序將 Service IP 範圍中的第 10 個地址分配給 DNS Service。
假設你設定叢集 Service IP 範圍是 10.96.0.0/16，並且希望 DNS Service IP 爲 10.96.0.10，
那麼你必須創建一個如下所示的 Service：

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
但正如我之前解釋的，IP 地址 10.96.0.10 沒有被保留；
如果其他 Service 在動態分配之前創建或與動態分配並行創建，則它們有可能分配此 IP 地址，
因此，你將無法創建 DNS Service，因爲它將因衝突錯誤而失敗。

<!--
## How can you avoid Service ClusterIP conflicts? {#avoid-ClusterIP-conflict}
-->
## 如何避免 Service ClusterIP 衝突？ {#avoid-ClusterIP-conflict}

<!--
In Kubernetes 1.24, you can enable a new feature gate `ServiceIPStaticSubrange`.
Turning this on allows you to use a different IP
allocation strategy for Services, reducing the risk of collision.
-->
在 Kubernetes 1.24 中，你可以啓用一個新的特性門控 `ServiceIPStaticSubrange`。
啓用此特性允許你爲 Service 使用不同的 IP 分配策略，減少衝突的風險。

<!--
The `ClusterIP` range will be divided, based on the formula `min(max(16, cidrSize / 16), 256)`,
described as _never less than 16 or more than 256 with a graduated step between them_.
-->
`ClusterIP` 範圍將根據公式 `min(max(16, cidrSize / 16), 256)` 進行劃分，
該公式可描述爲 “在不小於 16 且不大於 256 之間有一個步進量（Graduated Step）”。

<!--
Dynamic IP assignment will use the upper band by default, once this has been exhausted it will
use the lower range. This will allow users to use static allocations on the lower band with a low
risk of collision.
-->
分配默認使用上半段地址，當上半段地址耗盡後，將使用下半段地址範圍。
這將允許使用者在下半段地址中使用靜態分配從而降低衝突的風險。

<!--
Examples:
-->
舉例：

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
靜態地址段起點：10.96.0.1  
靜態地址段終點：10.96.0.16  
地址範圍終點：10.96.0.254

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
"靜態" : 16
"動態" : 238
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
靜態地址段起點：10.96.0.1  
靜態地址段終點：10.96.1.0  
地址範圍終點：10.96.15.254

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
"靜態" : 256
"動態" : 3838
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
靜態地址段起點：10.96.0.1  
靜態地址段終點：10.96.1.0  
地址範圍終點：10.96.255.254

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
"靜態" : 256
"動態" : 65278
{{< /mermaid >}}

<!--
## Get involved with SIG Network
-->
## 加入 SIG Network

<!--
The current SIG-Network [KEPs](https://github.com/orgs/kubernetes/projects/10) and [issues](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue+label%3Asig%2Fnetwork) on GitHub illustrate the SIG’s areas of emphasis.
-->
當前 SIG-Network 在 GitHub 上的 [KEPs](https://github.com/orgs/kubernetes/projects/10) 和
[issues](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue+label%3Asig%2Fnetwork)
表明了該 SIG 的重點領域。

<!--
[SIG Network meetings](https://github.com/kubernetes/community/tree/master/sig-network) are a friendly, welcoming venue for you to connect with the community and share your ideas.
Looking forward to hearing from you!
-->
[SIG Network 會議](https://github.com/kubernetes/community/tree/master/sig-network)是一個友好、熱情的地方，
你可以與社區聯繫並分享你的想法。期待你的迴音！
