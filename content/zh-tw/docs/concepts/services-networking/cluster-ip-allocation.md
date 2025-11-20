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

在 Kubernetes 中，[Service](/zh-cn/docs/concepts/services-networking/service/) 是一種抽象的方式，
用於公開在一組 Pod 上運行的應用。
Service 可以具有叢集作用域的虛擬 IP 地址（使用 `type: ClusterIP` 的 Service）。
客戶端可以使用該虛擬 IP 地址進行連接，Kubernetes 通過不同的後臺 Pod 對該 Service 的流量進行負載均衡。
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
當 Kubernetes 需要爲 Service 分配虛擬 IP 地址時，該分配會通過以下兩種方式之一進行：

**動態分配**
: 叢集的控制面自動從所設定的 IP 範圍內爲 `type: ClusterIP` 選擇一個空閒 IP 地址。

**靜態分配**
: 根據爲 Service 所設定的 IP 範圍，選定並設置你的 IP 地址。

在整個叢集中，每個 Service 的 `ClusterIP` 都必須是唯一的。
嘗試使用已分配的 `ClusterIP` 創建 Service 將返回錯誤。

<!--
## Why do you need to reserve Service Cluster IPs?
Sometimes you may want to have Services running in well-known IP addresses, so other components and
users in the cluster can use them.
The best example is the DNS Service for the cluster. As a soft convention, some Kubernetes installers assign the 10th IP address from
the Service IP range to the DNS service. Assuming you configured your cluster with Service IP range
10.96.0.0/16 and you want your DNS Service IP to be 10.96.0.10, you'd have to create a Service like
this:
-->
## 爲什麼需要預留 Service 的 ClusterIP ？

有時你可能希望 Services 在衆所周知的 IP 上面運行，以便叢集中的其他組件和使用者可以使用它們。

最好的例子是叢集的 DNS Service。作爲一種非強制性的約定，一些 Kubernetes 安裝程式
將 Service IP 範圍中的第 10 個 IP 地址分配給 DNS 服務。假設將叢集的 Service IP 範圍設定爲 
10.96.0.0/16，並且希望 DNS Service IP 爲 10.96.0.10，則必須創建如下 Service：

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
But, as it was explained before, the IP address 10.96.0.10 has not been reserved.
If other Services are created before or in parallel with dynamic allocation, there is a chance they can allocate this IP.
Hence, you will not be able to create the DNS Service because it will fail with a conflict error.
-->
但如前所述，IP 地址 10.96.0.10 尚未被保留。如果在 DNS 啓動之前或同時採用動態分配機制創建其他 Service，
則它們有可能被分配此 IP，因此，你將無法創建 DNS Service，因爲它會因衝突錯誤而失敗。

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

## 如何避免 Service ClusterIP 衝突？{#avoid-ClusterIP-conflict}

Kubernetes 中用來將 ClusterIP 分配給 Service 的分配策略降低了衝突的風險。

`ClusterIP` 範圍根據公式 `min(max(16, cidrSize / 16), 256)` 進行劃分，
描述爲不小於 16 且不大於 256，並在二者之間有一個漸進的步長。

預設情況下，動態 IP 分配使用地址較高的一段，一旦用完，它將使用較低範圍。
這將允許使用者在衝突風險較低的較低地址段上使用靜態分配。

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

此示例使用 IP 地址範圍：10.96.0.0/24（CIDR 表示法）作爲 Service 的 IP 地址。
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
範圍大小：2<sup>8</sup> - 2 = 254  
帶寬偏移量：`min(max(16, 256/16), 256)` = `min(16, 256)` = 16  
靜態帶寬起始地址：10.96.0.1  
靜態帶寬結束地址：10.96.0.16  
範圍結束地址：10.96.0.254  

{{< mermaid >}}
pie showData
    title 10.96.0.0/24
    "靜態分配" : 16
    "動態分配" : 238
{{< /mermaid >}}

<!--
### Example 2 {#allocation-example-2}
This example uses the IP address range: 10.96.0.0/20 (CIDR notation) for the IP addresses
of Services.
-->
### 示例 2 {#allocation-example-2}

此示例使用 IP 地址範圍 10.96.0.0/20（CIDR 表示法）作爲 Service 的 IP 地址。

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

範圍大小：2<sup>12</sup> - 2 = 4094  
帶寬偏移量：`min(max(16, 4096/16), 256)` = `min(256, 256)` = 256  
靜態帶寬起始地址：10.96.0.1  
靜態帶寬結束地址：10.96.1.0  
範圍結束地址：10.96.15.254  

{{< mermaid >}}
pie showData
    title 10.96.0.0/20
    "靜態分配" : 256
    "動態分配" : 3838
{{< /mermaid >}}

<!--
### Example 3 {#allocation-example-3}
This example uses the IP address range: 10.96.0.0/16 (CIDR notation) for the IP addresses
of Services.
-->
### 示例 3 {#allocation-example-3}

此示例使用 IP 地址範圍 10.96.0.0/16（CIDR 表示法）作爲 Service 的 IP 地址。

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
範圍大小：2<sup>16</sup> - 2 = 65534  
帶寬偏移量：`min(max(16, 65536/16), 256)` = `min(4096, 256)` = 256  
靜態帶寬起始地址：10.96.0.1  
靜態帶寬結束地址：10.96.1.0  
範圍結束地址：10.96.255.254  

{{< mermaid >}}
pie showData
    title 10.96.0.0/16
    "靜態分配" : 256
    "動態分配" : 65278
{{< /mermaid >}}

<!--
## {{% heading "whatsnext" %}}
* Read about [Service External Traffic Policy](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)
* Read about [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/)
* Read about [Services](/docs/concepts/services-networking/service/)
-->
## {{% heading "whatsnext" %}}

* 閱讀[服務外部流量策略](/zh-cn/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)
* 閱讀[應用程式與服務連接](/zh-cn/docs/tutorials/services/connect-applications-service/)
* 閱讀[服務](/zh-cn/docs/concepts/services-networking/service/)

