---
layout: blog
title: "Kubernetes 1.27：爲 NodePort Service 分配端口時避免衝突"
date: 2023-05-11
slug: nodeport-dynamic-and-static-allocation
---
<!--
layout: blog
title: "Kubernetes 1.27: Avoid Collisions Assigning Ports to NodePort Services"
date: 2023-05-11
slug: nodeport-dynamic-and-static-allocation
-->

<!--
**Author:** Xu Zhenglun (Alibaba)
-->
**作者:** Xu Zhenglun (Alibaba)

**譯者:** [Michael Yao](https://github.com/windsonsea) (DaoCloud)

<!--
In Kubernetes, a Service can be used to provide a unified traffic endpoint for 
applications running on a set of Pods. Clients can use the virtual IP address (or _VIP_) provided
by the Service for access, and Kubernetes provides load balancing for traffic accessing
different back-end Pods, but a ClusterIP type of Service is limited to providing access to
nodes within the cluster, while traffic from outside the cluster cannot be routed.
One way to solve this problem is to use a `type: NodePort` Service, which sets up a mapping
to a specific port of all nodes in the cluster, thus redirecting traffic from the
outside to the inside of the cluster.
-->
在 Kubernetes 中，對於以一組 Pod 運行的應用，Service 可以爲其提供統一的流量端點。
客戶端可以使用 Service 提供的虛擬 IP 地址（或 **VIP**）進行訪問，
Kubernetes 爲訪問不同的後端 Pod 的流量提供負載均衡能力，
但 ClusterIP 類型的 Service 僅限於供集羣內的節點來訪問，
而來自集羣外的流量無法被路由。解決這個難題的一種方式是使用 `type: NodePort` Service，
這種服務會在集羣所有節點上爲特定端口建立映射關係，從而將來自集羣外的流量重定向到集羣內。

<!--
## How Kubernetes allocates node ports to Services?

When a `type: NodePort` Service is created, its corresponding port(s) are allocated in one
of two ways:

- **Dynamic** : If the Service type is `NodePort` and you do not set a `nodePort` 
  value explicitly in the `spec` for that Service, the Kubernetes control plane will
  automatically allocate an unused port to it at creation time.

- **Static** : In addition to the dynamic auto-assignment described above, you can also
  explicitly assign a port that is within the nodeport port range configuration.
-->
## Kubernetes 如何爲 Services 分配節點端口？

當 `type: NodePort` Service 被創建時，其所對應的端口將以下述兩種方式之一分配：

- **動態分配**：如果 Service 類型是 `NodePort` 且你沒有爲 Service 顯式設置 `nodePort` 值，
  Kubernetes 控制面將在創建時自動爲其分配一個未使用的端口。

- **靜態分配**：除了上述動態自動分配，你還可以顯式指定 nodeport 端口範圍配置內的某端口。

<!--
The value of `nodePort` that you manually assign must be unique across the whole cluster.
Attempting to create a Service of `type: NodePort` where you explicitly specify a node port that
was already allocated results in an error.
-->
你手動分配的 `nodePort` 值在整個集羣範圍內一定不能重複。
如果嘗試在創建 `type: NodePort` Service 時顯式指定已分配的節點端口，將產生錯誤。

<!--
## Why do you need to reserve ports of NodePort Service? 

Sometimes, you may want to have a NodePort Service running on well-known ports
so that other components and users inside o r outside the cluster can use them.
-->
## 爲什麼需要保留 NodePort Service 的端口？

有時你可能想要 NodePort Service 運行在衆所周知的端口上，
便於集羣內外的其他組件和用戶可以使用這些端口。

<!--
In some complex cluster deployments with a mix of Kubernetes nodes and other servers on the same network, 
it may be necessary to use some pre-defined ports for communication. In particular, some fundamental
components cannot rely on the VIPs that back `type: LoadBalancer` Services
because the virtual IP address mapping implementation for that cluster also relies on
these foundational components.

Now suppose you need to expose a Minio object storage service on Kubernetes to clients 
running outside the Kubernetes cluster, and the agreed port is `30009`, we need to 
create a Service as follows:
-->
在某些複雜的集羣部署場景中在同一網絡上混合了 Kubernetes 節點和其他服務器，
可能有必要使用某些預定義的端口進行通信。尤爲特別的是，某些基礎組件無法使用用來支撐
`type: LoadBalancer` Service 的 VIP，因爲針對集羣實現的虛擬 IP 地址映射也依賴這些基礎組件。

現在假設你需要在 Kubernetes 上將一個 Minio 對象存儲服務暴露給運行在 Kubernetes 集羣外的客戶端，
協商後的端口是 `30009`，我們需要創建以下 Service：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: minio
spec:
  ports:
  - name: api
    nodePort: 30009
    port: 9000
    protocol: TCP
    targetPort: 9000
  selector:
    app: minio
  type: NodePort
```

<!--
However, as mentioned before, if the port (30009) required for the `minio` Service is not reserved,
and another `type: NodePort` (or possibly `type: LoadBalancer`) Service is created and dynamically
allocated before or concurrently with the `minio` Service, TCP port 30009 might be allocated to that
other Service; if so, creation of the `minio` Service will fail due to a node port collision.
-->
然而如前文所述，如果 `minio` Service 所需的端口 (30009) 未被預留，
且另一個 `type: NodePort`（或者也包括 `type: LoadBalancer`）Service
在 `minio` Service 之前或與之同時被創建、動態分配，TCP 端口 30009 可能被分配給了這個 Service；
如果出現這種情況，`minio` Service 的創建將由於節點端口衝突而失敗。

<!--
## How can you avoid NodePort Service port conflicts? 
Kubernetes 1.24 introduced changes for `type: ClusterIP` Services, dividing the CIDR range for cluster
IP addresses into two blocks that use different allocation policies to [reduce the risk of conflicts](/docs/reference/networking/virtual-ips/#avoiding-collisions).
In Kubernetes 1.27, as an alpha feature, you can adopt a similar policy for `type: NodePort` Services.
You can enable a new [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`ServiceNodePortStaticSubrange`. Turning this on allows you to use a different port allocation strategy
for `type: NodePort` Services, and reduce the risk of collision.
-->
## 如何才能避免 NodePort Service 端口衝突？

Kubernetes 1.24 引入了針對 `type: ClusterIP` Service 的變更，將集羣 IP 地址的 CIDR
範圍劃分爲使用不同分配策略的兩塊來[減少衝突的風險](/zh-cn/docs/reference/networking/virtual-ips/#avoiding-collisions)。
在 Kubernetes 1.27 中，作爲一個 Alpha 特性，你可以爲 `type: NodePort` Service 採用類似的策略。
你可以啓用新的[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
`ServiceNodePortStaticSubrange`。開啓此門控將允許你爲
`type: NodePort` Service 使用不同的端口分配策略，減少衝突的風險。

<!--
The port range for `NodePort` will be divided, based on the formula `min(max(16, nodeport-size / 32), 128)`. 
The outcome of the formula will be a number between 16 and 128, with a step size that increases as the 
size of the nodeport range increases. The outcome of the formula determine that the size of static port 
range. When the port range is less than 16, the size of static port range will be set to 0, 
which means that all ports will be dynamically allocated.

Dynamic port assignment will use the upper band by default, once this has been exhausted it will use the lower range.
This will allow users to use static allocations on the lower band with a low risk of collision.
-->
`NodePort` 的端口範圍將基於公式 `min(max(16, 節點端口數 / 32), 128)` 進行劃分。
這個公式的結果將是一個介於 16 到 128 的數字，隨着節點端口範圍變大，步進值也會變大。
此公式的結果決定了靜態端口範圍的大小。當端口範圍小於 16 時，靜態端口範圍的大小將被設爲 0，
這意味着所有端口都將被動態分配。

動態端口分配默認使用數值較高的一段，一旦用完，它將使用較低範圍。
這將允許用戶在衝突風險較低的較低端口段上使用靜態分配。

<!--
## Examples

### default range: 30000-32767
| Range properties        | Values                                                |
|-------------------------|-------------------------------------------------------|
| service-node-port-range | 30000-32767                                           |
| Band Offset             | &ensp; `min(max(16, 2768/32), 128)` <br>= `min(max(16, 86), 128)` <br>= `min(86, 128)` <br>= 86 |
| Static band start       | 30000                                                 |
| Static band end         | 30085                                                 |
| Dynamic band start      | 30086                                                 |
| Dynamic band end        | 32767                                                 |
-->
## 示例

### 默認範圍：30000-32767

| 範圍屬性                | 值                                                                                              |
| ----------------------- | ----------------------------------------------------------------------------------------------- |
| service-node-port-range | 30000-32767                                                                                     |
| 分段偏移量              | &ensp; `min(max(16, 2768/32), 128)` <br>= `min(max(16, 86), 128)` <br>= `min(86, 128)` <br>= 86 |
| 起始靜態段              | 30000                                                                                           |
| 結束靜態段              | 30085                                                                                           |
| 起始動態段              | 30086                                                                                           |
| 結束動態段              | 32767                                                                                           |

{{< mermaid >}}
pie showData
    title 30000-32767
    "Static" : 86
    "Dynamic" : 2682
{{< /mermaid >}}

<!--
### very small range: 30000-30015
| Range properties        | Values                                                |
|-------------------------|-------------------------------------------------------|
| service-node-port-range | 30000-30015                                           |
| Band Offset             | 0                                                     |
| Static band start       | -                                                     |
| Static band end         | -                                                     |
| Dynamic band start      | 30000                                                 |
| Dynamic band end        | 30015                                                 |
-->
### 超小範圍：30000-30015

| 範圍屬性                 | 值          |
| ----------------------- | ----------- |
| service-node-port-range | 30000-30015 |
| 分段偏移量               | 0           |
| 起始靜態段               | -           |
| 結束靜態段               | -           |
| 起始動態段               | 30000       |
| 動態動態段               | 30015       |

{{< mermaid >}}
pie showData
    title 30000-30015
    "Static" : 0
    "Dynamic" : 16
{{< /mermaid >}}

<!--
### small(lower boundary) range: 30000-30127
| Range properties        | Values                                                |
|-------------------------|-------------------------------------------------------|
| service-node-port-range | 30000-30127                                           |
| Band Offset             | &ensp; `min(max(16, 128/32), 128)` <br>= `min(max(16, 4), 128)` <br>= `min(16, 128)` <br>= 16 |
| Static band start       | 30000                                                 |
| Static band end         | 30015                                                 |
| Dynamic band start      | 30016                                                 |
| Dynamic band end        | 30127                                                 |
-->
### 小（下邊界）範圍：30000-30127

| 範圍屬性                | 值                                                                                            |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| service-node-port-range | 30000-30127                                                                                   |
| 分段偏移量              | &ensp; `min(max(16, 128/32), 128)` <br>= `min(max(16, 4), 128)` <br>= `min(16, 128)` <br>= 16 |
| 起始靜態段              | 30000                                                                                         |
| 結束靜態段              | 30015                                                                                         |
| 起始動態段              | 30016                                                                                         |
| 結束動態段              | 30127                                                                                         |

{{< mermaid >}}
pie showData
    title 30000-30127
    "Static" : 16
    "Dynamic" : 112
{{< /mermaid >}}

<!--
### large(upper boundary) range: 30000-34095
| Range properties        | Values                                                |
|-------------------------|-------------------------------------------------------|
| service-node-port-range | 30000-34095                                           |
| Band Offset             | &ensp; `min(max(16, 4096/32), 128)` <br>= `min(max(16, 128), 128)` <br>= `min(128, 128)` <br>= 128 |
| Static band start       | 30000                                                 |
| Static band end         | 30127                                                 |
| Dynamic band start      | 30128                                                 |
| Dynamic band end        | 34095                                                 |
-->
### 大（上邊界）範圍：30000-34095

| 範圍屬性                | 值                                                                                                 |
| -----------------------| -------------------------------------------------------------------------------------------------- |
| service-node-port-range | 30000-34095                                                                                        |
| 分段偏移量              | &ensp; `min(max(16, 4096/32), 128)` <br>= `min(max(16, 128), 128)` <br>= `min(128, 128)` <br>= 128 |
| 起始靜態段              | 30000                                                                                              |
| 結束靜態段              | 30127                                                                                              |
| 起始動態段              | 30128                                                                                              |
| 結束動態段              | 34095                                                                                              |

{{< mermaid >}}
pie showData
    title 30000-34095
    "Static" : 128
    "Dynamic" : 3968
{{< /mermaid >}}

<!--
### very large range: 30000-38191
| Range properties        | Values                                                |
|-------------------------|-------------------------------------------------------|
| service-node-port-range | 30000-38191                                           |
| Band Offset             | &ensp; `min(max(16, 8192/32), 128)` <br>= `min(max(16, 256), 128)` <br>= `min(256, 128)` <br>= 128 |
| Static band start       | 30000                                                 |
| Static band end         | 30127                                                 |
| Dynamic band start      | 30128                                                 |
| Dynamic band end        | 38191                                                 |
-->
### 超大範圍：30000-38191

| 範圍屬性                | 值                                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| service-node-port-range | 30000-38191                                                                                        |
| 分段偏移量             | &ensp; `min(max(16, 8192/32), 128)` <br>= `min(max(16, 256), 128)` <br>= `min(256, 128)` <br>= 128 |
| 起始靜態段              | 30000                                                                                              |
| 結束靜態段              | 30127                                                                                              |
| 起始動態段              | 30128                                                                                              |
| 結束動態段              | 38191                                                                                              |

{{< mermaid >}}
pie showData
    title 30000-38191
    "Static" : 128
    "Dynamic" : 8064
{{< /mermaid >}}
