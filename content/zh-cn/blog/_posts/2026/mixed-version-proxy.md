---
layout: blog
title: "Kubernetes v1.36：混合版本代理升级到 Beta"
date: 2026-05-15T10:00:00-08:00
slug: kubernetes-1-36-feature-mixed-version-proxy-beta
author: >
  Richa Banker (Google)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.36: Mixed Version Proxy Graduates to Beta "
date: 2026-05-15T10:00:00-08:00
slug: kubernetes-1-36-feature-mixed-version-proxy-beta
author: >
  Richa Banker (Google)
---
-->

<!--
Back in Kubernetes 1.28, we introduced the `Mixed Version Proxy (MVP)` as an Alpha feature (under the feature gate `UnknownVersionInteroperabilityProxy`) in a [previous blog post](/blog/2023/08/28/kubernetes-1-28-feature-mixed-version-proxy-alpha/). The goal was simple but critical: make cluster upgrades safer by ensuring that requests for resources not yet known to an older API server are correctly routed to a newer peer API server, instead of returning an incorrect `404 Not Found`.
-->
早在 Kubernetes 1.28 中，
我们在[之前的博客文章](/blog/2023/08/28/kubernetes-1-28-feature-mixed-version-proxy-alpha/)中引入了
`Mixed Version Proxy (MVP)` 作为 Alpha 特性（在特性门控 `UnknownVersionInteroperabilityProxy` 下）。
目标简单但关键：通过确保对旧版 API 服务器尚不了解的资源请求被正确路由到较新的对等 API 服务器，
而不是返回不正确的 `404 Not Found`，从而使集群升级更安全。

<!--
We are excited to announce that the Mixed Version Proxy is moving to Beta in Kubernetes 1.36 and will be enabled by default! The feature has evolved significantly since its initial release, addressing key gaps and modernizing its architecture.
-->
我们很高兴地宣布，Mixed Version Proxy 将在 Kubernetes 1.36 中升级到 Beta 版本，
并将默认启用！该特性自首次发布以来有了显著发展，解决了关键差距并实现了架构现代化。

<!--
Here is a look at how the feature has evolved and what you need to know to leverage it in your clusters.
-->
以下介绍该特性的发展历程以及在集群中使用它需要了解的内容。

<!--
## What problem are we solving?
-->
## 我们正在解决什么问题？

<!--
In a highly available control plane undergoing an upgrade, you often have API servers running different versions. These servers might serve different sets of APIs (Groups, Versions, Resources).
Without MVP, if a client request lands on an API server that does not serve the requested resource (e.g., a new API version introduced in the upgrade), that server returns a `404 Not Found`. This is technically incorrect because the resource is available in the cluster, just not on that specific server. This can lead to serious side effects, such as mistaken garbage collection or blocked namespace deletions.
MVP solves this by proxying the request to a peer API server that can serve it.
-->
在正在升级的高可用控制平面中，你通常会有运行不同版本的 API 服务器。
这些服务器可能提供不同的 API 集（Groups、Versions、Resources）。
没有 MVP，如果客户端请求落在不提供所请求资源的 API 服务器上（例如，升级中引入的新 API 版本），
该服务器会返回 `404 Not Found`。这在技术上是不正确的，因为资源在集群中是可用的，
只是不在该特定服务器上。这可能导致严重的副作用，例如错误的垃圾收集或命名空间删除被阻止。
MVP 通过将请求代理到能够提供该资源的对等 API 服务器来解决这个问题。

{{< mermaid >}}
sequenceDiagram
    participant Client
    participant API_Server_A as API Server A (Older/Different)
    participant API_Server_B as API Server B (Newer/Capable)
    
    Client->>API_Server_A: 1. Request for Resource (e.g., v2)
    Note over API_Server_A: Determines it cannot serve locally
    API_Server_A->>API_Server_A: 2. Looks up capable peer in Discovery Cache
    API_Server_A->>API_Server_B: 3. Proxies request (adds x-kubernetes-peer-proxied header)
    API_Server_B->>API_Server_B: 4. Processes request locally
    API_Server_B-->>API_Server_A: 5. Returns Response
    API_Server_A-->>Client: 6. Forwards Response
{{< /mermaid >}}

<!--
## How has it evolved since 1.28
-->
## 自 1.28 以来的发展

<!--
The initial Alpha implementation was a great proof of concept, but it had some limitations and relied on older mechanisms. Here is how we have modernized it for Beta:
-->
最初的 Alpha 实现是一个很好的概念证明，但它有一些局限性并且依赖于旧机制。
以下是我们为 Beta 版本进行现代化改进的方式：

<!--
1. From StorageVersion API to Aggregated Discovery
In the Alpha version, API servers relied on the `StorageVersion API` to figure out which peers served which resources. While functional, this approach had a significant limitation: the `StorageVersion API` is not yet supported for CRDs and aggregated APIs.
For Beta, we have replaced the reliance on `StorageVersion API` calls with the use of `Aggregated Discovery`. API servers now use the aggregated discovery data to dynamically understand the capabilities of their peers.
-->
1. 从 StorageVersion API 到聚合发现
   在 Alpha 版本中，API 服务器依赖 `StorageVersion API` 来确定哪些对等服务器提供哪些资源。
   虽然功能正常，但这种方法有一个显著的局限性：`StorageVersion API` 尚不支持 CRD 和聚合 API。
   对于 Beta 版本，我们用 `Aggregated Discovery` 取代了对 `StorageVersion API` 调用的依赖。
   API 服务器现在使用聚合发现数据来动态了解其对等服务器的能力。

<!--
2. The Missing Piece: Peer-Aggregated Discovery
The [1.28 blog post](/blog/2023/08/28/kubernetes-1-28-feature-mixed-version-proxy-alpha/) noted a significant gap: while we could proxy resource requests, discovery requests still only showed what the local API server knew about.
In 1.36, we have added `Peer-Aggregated Discovery` support! Now, when a client performs discovery (e.g., listing available APIs), the API server merges its local view with the discovery data from all active peers. This provides clients with a complete, unified view of all APIs available across the entire cluster, regardless of which API server they connected to.
-->
2. 缺失的部分：对等聚合发现
   [1.28 博客文章](/blog/2023/08/28/kubernetes-1-28-feature-mixed-version-proxy-alpha/)指出了一个显著的差距：
   虽然我们可以代理资源请求，但发现请求仍然只显示本地 API 服务器知道的内容。
   在 1.36 中，我们添加了 `Peer-Aggregated Discovery` 支持！
   现在，当客户端执行发现（例如，列出可用的 API）时，API 服务器会将其本地视图与所有活动对等服务器的发现数据合并。
   这为客户端提供了整个集群中所有可用 API 的完整、统一视图，无论它们连接到哪个 API 服务器。
   
{{< mermaid >}}
sequenceDiagram
    participant Client
    participant API_Server_A as API Server A
    participant API_Server_B as API Server B
    
    Client->>API_Server_A: 1. Request Discovery Document
    API_Server_A->>API_Server_A: 2. Gets Local APIs
    API_Server_A->>API_Server_B: 3. Gets Peer APIs (Cached or Direct)
    API_Server_A->>API_Server_A: 4. Merges and sorts lists deterministically
    API_Server_A-->>Client: 5. Returns Unified Discovery Document
{{< /mermaid >}}

<!--
While peer-aggregated discovery will be the default behavior (note that peer-aggregated discovery is enabled if the `--peer-ca-file` flag is set, otherwise the server will fallback to showing only its local APIs), there may be cases where you need to inspect only the resources served by the specific API server you are connected to. You can request this non-aggregated view by including the `profile=nopeer` parameter in your request's `Accept` header (e.g., `Accept: application/json;g=apidiscovery.k8s.io;v=v2;as=APIGroupDiscoveryList;profile=nopeer`).
-->
虽然对等聚合发现将是默认行为（请注意，如果设置了 `--peer-ca-file` 标志，
则启用对等聚合发现，否则服务器将回退到仅显示其本地 API），但在某些情况下，
你可能需要只检查你连接的特定 API 服务器提供的资源。
你可以通过在请求的 `Accept` 头中包含 `profile=nopeer` 
参数来请求此非聚合视图（例如，`Accept: application/json;g=apidiscovery.k8s.io;v=v2;as=APIGroupDiscoveryList;profile=nopeer`）。

<!--
## Required configuration 
-->
## 必需的配置

<!--
While the feature gate will be enabled by default, it requires certain flags to be set to allow for secure communication between peer API servers. To function correctly, make sure your API server is configured with the following flags:
-->
虽然特性门控将默认启用，但它需要设置某些标志以允许对等 API 服务器之间的安全通信。
要正常工作，请确保你的 API 服务器配置了以下标志：

<!--
- `--feature-gates=UnknownVersionInteroperabilityProxy=true`: This will be default in 1.36, but it is good to verify
- `--peer-ca-file=<path-to-ca>`: [CRITICAL] This is a required flag. You must provide the CA bundle that the source API server will use to authenticate the serving certificates of destination peer API servers. Without this, proxying will fail due to TLS verification errors.
- `--peer-advertise-ip` and `--peer-advertise-port`: These flags are used to set the network address that peers should use to reach this API server. If unset, the values from `--advertise-address` or `--bind-address` are used. If you have complex network topologies where API servers communicate over a specific internal interface, setting these flags explicitly is highly recommended.
-->
- `--feature-gates=UnknownVersionInteroperabilityProxy=true`：这在 1.36 中将是默认值，但最好进行验证
- `--peer-ca-file=<path-to-ca>`：[CRITICAL] 这是必需的标志。
  你必须提供源 API 服务器将用于验证目标对等 API 服务器服务证书的 CA 包。没有这个，代理将因 TLS 验证错误而失败。
- `--peer-advertise-ip` 和 `--peer-advertise-port`：这些标志用于设置对等服务器应使用的网络地址来访问此 API 服务器。
  如果未设置，则使用 `--advertise-address` 或 `--bind-address` 的值。
  如果你的网络拓扑复杂，API 服务器通过特定内部接口通信，强烈建议显式设置这些标志。

<!--
### Configuring with `kubeadm`
-->
### 使用 `kubeadm` 配置

<!--
If you manage your cluster with `kubeadm`, you can configure these flags in your `ClusterConfiguration` file:
-->
如果你使用 `kubeadm` 管理集群，可以在 `ClusterConfiguration` 文件中配置这些标志：

<!--
peer-advertise-ip and port if needed
-->
```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
apiServer:
  extraArgs:
    peer-ca-file: "/etc/kubernetes/pki/ca.crt"
    # `eer-advertise-ip 和端口（如果需要）
```

<!--
## Call to action
-->
## 行动号召

<!--
If you are running multi-master clusters and upgrading them regularly, the Mixed Version Proxy is a major safety improvement. With it becoming default in 1.36, we encourage you to:
-->
如果你运行多主集群并定期升级它们，Mixed Version Proxy 是一项重大的安全改进。
随着它在 1.36 中成为默认功能，我们鼓励你：

<!--
1. Review your API server flags to ensure `--peer-ca-file` is set properly.
2. Test the feature in your staging environments as you prepare for the 1.36 upgrade.
3. Provide feedback to SIG API Machinery ([Slack](https://kubernetes.slack.com/messages/sig-api-machinery/), [mailing list](https://groups.google.com/g/kubernetes-sig-api-machinery), or by [attending SIG API Machinery meetings](https://github.com/kubernetes/community/tree/master/sig-api-machinery#meetings)) on your experience.
-->
1. 检查你的 API 服务器标志，确保 `--peer-ca-file` 已正确设置。
2. 在准备 1.36 升级时，在你的暂存环境中测试此功能。
3. 向 SIG API Machinery 提供反馈（[Slack](https://kubernetes.slack.com/messages/sig-api-machinery/)、
   [邮件列表](https://groups.google.com/g/kubernetes-sig-api-machinery)，
   或通过[参加 SIG API Machinery 会议](https://github.com/kubernetes/community/tree/master/sig-api-machinery#meetings)）
   分享你的体验。