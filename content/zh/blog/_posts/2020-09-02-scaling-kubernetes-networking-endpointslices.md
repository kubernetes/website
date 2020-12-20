---
layout: blog
title: "使用 EndpointSlices 扩展 Kubernetes 网络"
date: 2020-09-02
slug: scaling-kubernetes-networking-with-endpointslices
---
<!--
layout: blog
title: 'Scaling Kubernetes Networking With EndpointSlices'
date: 2020-09-02
slug: scaling-kubernetes-networking-with-endpointslices
-->

<!--
**Author:** Rob Scott (Google)
-->
**作者:** Rob Scott (Google)

<!--
EndpointSlices are an exciting new API that provides a scalable and extensible alternative to the Endpoints API. EndpointSlices track IP addresses, ports, readiness, and topology information for Pods backing a Service.
-->
EndpointSlices 是一个令人兴奋的新 API，它提供一种方案以替代 Endpoints API，且是可延展和可扩展的。 EndpointSlice 跟踪用来支持服务的 Pod 的 IP 地址、端口、就绪态和拓扑信息。

<!--
In Kubernetes 1.19 this feature is enabled by default with kube-proxy reading from [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/) instead of Endpoints. Although this will mostly be an invisible change, it should result in noticeable scalability improvements in large clusters. It also enables significant new features in future Kubernetes releases like [Topology Aware Routing](/docs/concepts/services-networking/service-topology/).
-->
Kubernetes 1.19 默认启用此功能，并且 kube-proxy 从 [EndpointSlices](/zh/docs/concepts/services-networking/endpoint-slices/) 而不是 Endpoints 中读取数据。
尽管这些更改大多对用户不可见，但它确保大型群集中的可扩缩得到了显着改善。
它还使得在将来的 Kubernetes 版本添加重要的新功能变得可能，例如[拓扑感知的路由](/zh/docs/concepts/services-networking/service-topology/)。

<!--
## Scalability Limitations of the Endpoints API 
With the Endpoints API, there was only one Endpoints resource for a Service. That meant that it needed to be able to store IP addresses and ports (network endpoints) for every Pod that was backing the corresponding Service. This resulted in huge API resources. To compound this problem, kube-proxy was running on every node and watching for any updates to Endpoints resources. If even a single network endpoint changed in an Endpoints resource, the whole object would have to be sent to each of those instances of kube-proxy.
-->
## Endpoints API 的可扩缩性限制
使用 Endpoints API，一个服务只能有一个 Endpoints 资源。这意味着它需要能够为支持相应服务的每个 Pod 存储 IP 地址和端口（网络端点）。这导致了大量的 API 资源。
为了解决此问题，kube-proxy 在每个节点上运行，并监视 Endpoints 资源的所有更新。
甚至即使在 Endpoints 资源中只有一个网络端点发生了更改，整个对象也必须发送到每个 kube-proxy 实例。

<!--
A further limitation of the Endpoints API is that it limits the number of network endpoints that can be tracked for a Service. The default size limit for an object stored in etcd is 1.5MB. In some cases that can limit an Endpoints resource to 5,000 Pod IPs. This is not an issue for most users, but it becomes a significant problem for users with Services approaching this size.
-->
Endpoints API 的另一个限制是它限制了可为单个服务跟踪的网络端点数量。存储在 etcd 中的对象默认大小限制为1.5MB。
在某些情况下，这一限制可能会导致 Endpoints 资源被限制为最多 5000个 Pod IP。
对于大多数用户而言，这不是问题，但是对于服务接近此大小的用户而言，这将成为一个重大问题。

<!--
To show just how significant these issues become at scale it helps to have a simple example. Think about a Service which has 5,000 Pods, it might end up with a 1.5MB Endpoints resource. If even a single network endpoint in that list changes, the full Endpoints resource will need to be distributed to each Node in the cluster. This becomes quite an issue in a large cluster with 3,000 Nodes. Each update would involve sending 4.5GB of data (1.5MB Endpoints * 3,000 Nodes) across the cluster. That's nearly enough to fill up a DVD, and it would happen for each Endpoints change. Imagine a rolling update that results in all 5,000 Pods being replaced - that's more than 22TB (or 5,000 DVDs) worth of data transferred.
-->
为了说明这些问题的严重程度，举一个简单的例子是有帮助的。考虑某个具有 5000 个 Pod 的 Service，它最终可能具有1.5MB 的 Endpoints 资源。
如果该列表中的单个网络端点发生了更改，则需要将完整的 Endpoints 资源发布到群集中的每个节点。
在具有 3000 个节点的大型群集中，这成为一个很大的问题。
每次更新将涉及跨集群发送 4.5 GB 数据（1.5MB Endpoints * 3000 Nodes）。
这几乎足以填满一个 DVD，并且每次 Endpoints 更改都会发生这种情况。
想象一下，如果滚动更新会导致全部 5000 个 Pod 都被替换 —— 传输的数据量超过 22TB（或 5000 DVD）。

<!--
## Splitting endpoints up with the EndpointSlice API
The EndpointSlice API was designed to address this issue with an approach similar to sharding. Instead of tracking all Pod IPs for a Service with a single Endpoints resource, we split them into multiple smaller EndpointSlices. 
-->
## 使用 EndpointSlice API 拆分端点
EndpointSlice API 旨在通过类似于分片的方法来解决此问题。我们没有使用单个 Endpoints 资源服务跟踪的所有 Pod IP，而是将它们拆分为多个较小的 EndpointSlice。

<!--
Consider an example where a Service is backed by 15 pods. We'd end up with a single Endpoints resource that tracked all of them. If EndpointSlices were configured to store 5 endpoints each, we'd end up with 3 different EndpointSlices:
![EndpointSlices](/images/blog/2020-09-02-scaling-kubernetes-networking-endpointslices/endpoint-slices.png)
-->
考虑一个示例，其中一个服务由 15 个容器支持。我们最终将获得一个跟踪所有端点的单个 Endpoints 资源。如果将 EndpointSlices 配置为每个存储 5 个端点，则最终将得到 3 个不同的 EndpointSlices：
![EndpointSlices](/images/blog/2020-09-02-scaling-kubernetes-networking-endpointslices/endpoint-slices.png)

<!--
By default, EndpointSlices  store as many as 100 endpoints each, though this can be configured with the `--max-endpoints-per-slice` flag on kube-controller-manager.
-->
默认情况下，每个 EndpointSlices 存储多达 100 个端点，可以在 kube-controller-manager 上使用 `--max-endpoints-per-slice` 标志进行配置。

<!--
## EndpointSlices provide 10x scalability improvements
This API dramatically improves networking scalability. Now when a Pod is added or removed, only 1 small EndpointSlice needs to be updated. This difference becomes quite noticeable when hundreds or thousands of Pods are backing a single Service. 
-->
## EndpointSlices 将可扩缩性提高了 10 倍
该 API 大大提高了网络可扩缩性。现在，当添加或删除某个 Pod 时，只需更新 1 个小的 EndpointSlice。
在成百上千个 Pod 支持的单个 Service 情况下，这种差异变得非常明显。

<!--
Potentially more significant, now that all Pod IPs for a Service don't need to be stored in a single resource, we don't have to worry about the size limit for objects stored in etcd. EndpointSlices have already been used to scale Services beyond 100,000 network endpoints.
-->
可能更重要的是，既然一个 Service 的所有 Pod IP 都不需要存储在单个资源中，那么我们不必担心存储在 etcd 中对象的大小限制。
EndpointSlice 已经用来将 Service 扩充到超过 100,000 个网络端点。

<!--
All of this is brought together with some significant performance improvements that have been made in kube-proxy. When using EndpointSlices at scale, significantly less data will be transferred for endpoints updates and kube-proxy should be faster to update iptables or ipvs rules. Beyond that, Services can now scale to at least 10 times beyond any previous limitations.
-->
所有这些都与 kube-proxy 所做的一些重大性能改进整合在一起。当大规模使用 EndpointSlices 时，用于端点更新的数据将大大减少，并且 kube-proxy 应该会更快地更新 iptables 或 ipvs 规则。除此之外， Services 现在可以扩展到以前任何限制的至少10倍大小。

<!--
## EndpointSlices enable new functionality
Introduced as an alpha feature in Kubernetes v1.16, EndpointSlices were built to enable some exciting new functionality in future Kubernetes releases. This could include dual-stack Services, topology aware routing, and endpoint subsetting.
-->
## EndpointSlices 启用新功能
作为 Kubernetes v1.16 中的 Alpha 功能，引入的 EndpointSlices 旨在在将来的 Kubernetes 版本中启用一些令人兴奋的新功能。这包括双栈服务、拓扑感知路由和特定端点的设置。

<!--
Dual-Stack Services are an exciting new feature that has been in development alongside EndpointSlices. They will utilize both IPv4 and IPv6 addresses for Services and rely on the addressType field on EndpointSlices to track these addresses by IP family. 
-->
双栈服务是一项与 EndpointSlices 一起开发的令人兴奋的新功能。它们将利用 IPv4 和 IPv6 地址来提供服务，并依靠 EndpointSlices 上的 addressType 字段按 IP 群组 跟踪这些地址。

<!--
Topology aware routing will update kube-proxy to prefer routing requests within the same zone or region. This makes use of the topology fields stored for each endpoint in an EndpointSlice. As a further refinement of that, we're exploring the potential of endpoint subsetting. This would allow kube-proxy to only watch a subset of EndpointSlices. For example, this might be combined with topology aware routing so that kube-proxy would only need to watch EndpointSlices containing endpoints within the same zone. This would provide another very significant scalability improvement.
-->
拓扑感知路由将更新 kube-proxy，以偏爱相同区域或地区内的路由请求。这利用了 EndpointSlice 中每个端点存储的拓扑字段。
作为对此的进一步改进，我们正在探索特定端点的设置的潜力。这将允许 kube-proxy 只监测 EndpointSlices 的子集。例如，这可以与拓扑感知路由结合使用，以便 kube-proxy 仅需监视包含同一区域内端点的 EndpointSlice。
这将提供另一个非常显著的可扩缩性提升。

<!--
## What does this mean for the Endpoints API?
Although the EndpointSlice API is providing a newer and more scalable alternative to the Endpoints API, the Endpoints API will continue to be considered generally available and stable. The most significant change planned for the Endpoints API will involve beginning to truncate Endpoints that would otherwise run into scalability issues.
-->
## 这对 Endpoints API 意味着什么？
尽管 EndpointSlice API 为 Endpoints API 提供了更新，更可扩展的替代方案，但是 Endpoints API 仍旧被认为是正式发布的且稳定的。
为 Endpoints API 所规划的最重要的更改将开始涉及截断 Endpoints，以避免遇到可扩缩性问题。

<!--
The Endpoints API is not going away, but many new features will rely on the EndpointSlice API. To take advantage of the new scalability and functionality that EndpointSlices provide, applications that currently consume Endpoints will likely want to consider supporting EndpointSlices in the future.
-->
Endpoints API 不会消失，但是许多新功能将依赖于 EndpointSlice API。为了利用 EndpointSlices 提供的新的可扩缩性和功能，当前使用 Endpoints 的应用程序可能会希望在将来考虑支持 EndpointSlices。
