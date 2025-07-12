---
layout: blog
title: 'Kubernetes v1.31：通过基于缓存的一致性读加速集群性能'
date: 2024-08-15
slug: consistent-read-from-cache-beta
author: >
  Marek Siarkowicz (Google)
translator: >
  [Jin Li](https://github.com/qlijin) (UOS)
---
<!--
layout: blog
title: 'Kubernetes v1.31: Accelerating Cluster Performance with Consistent Reads from Cache'
date: 2024-08-15
slug: consistent-read-from-cache-beta
author: >
  Marek Siarkowicz (Google)
->

<!--
Kubernetes is renowned for its robust orchestration of containerized applications,
but as clusters grow, the demands on the control plane can become a bottleneck.
A key challenge has been ensuring strongly consistent reads from the etcd datastore,
requiring resource-intensive quorum reads.
-->
Kubernetes 以其强大的容器化应用编排能力而闻名，但随着集群规模扩大，
对控制平面的需求可能成为性能瓶颈。其中一个主要挑战是确保从
etcd 数据存储进行强一致性读，这通常需要资源密集型仲裁读取操作。

<!--
Today, the Kubernetes community is excited to announce a major improvement:
_consistent reads from cache_, graduating to Beta in Kubernetes v1.31.

### Why consistent reads matter
-->
今天，Kubernetes 社区很高兴地宣布一个重大改进：**基于缓存的一致性读**，
已在 Kubernetes v1.31 中晋升至 Beta 阶段。

### 为什么一致性读如此重要   {#why-consistent-reads-matter}

<!--
Consistent reads are essential for ensuring that Kubernetes components have an accurate view of the latest cluster state.
Guaranteeing consistent reads is crucial for maintaining the accuracy and reliability of Kubernetes operations,
enabling components to make informed decisions based on up-to-date information.
In large-scale clusters, fetching and processing this data can be a performance bottleneck,
especially for requests that involve filtering results.
-->
一致性读是确保 Kubernetes 组件准确了解最新集群状态的关键。
保证一致性读对于保持 Kubernetes 操作准确性和可靠性至关重要，
使组件能够根据最新信息做出明智决策。
在大型集群中，数据的获取和处理往往会成为性能瓶颈，特别是那些需要过滤结果的请求。

<!--
While Kubernetes can filter data by namespace directly within etcd,
any other filtering by labels or field selectors requires the entire dataset to be fetched from etcd and then filtered in-memory by the Kubernetes API server.
This is particularly impactful for components like the kubelet,
which only needs to list pods scheduled to its node - but previously required the API Server and etcd to process all pods in the cluster.
-->
虽然 Kubernetes 可以直接在 etcd 中按命名空间过滤数据，但如果按标签或字段选择器过滤，
则需要从 etcd 获取整个数据集，然后由 Kubernetes API 服务器在内存中执行过滤操作。
这对 Kubelet 等组件的影响尤为显著，因为 Kubelet 现在仅需列出调度到其节点的 Pod，
而之前却需要 API 服务器和 etcd 处理集群中所有的 Pod。

<!--
### The breakthrough: Caching with confidence

Kubernetes has long used a watch cache to optimize read operations.
The watch cache stores a snapshot of the cluster state and receives updates through etcd watches.
However, until now, it couldn't serve consistent reads directly, as there was no guarantee the cache was sufficiently up-to-date.
-->
### 突破：自信地缓存   {#the-breakthrough-Caching-with-confidence}

Kubernetes 长期以来一直使用监视缓存来优化读取操作。
监视缓存保存集群状态的快照，并通过对 etcd 的监视获取更新。
然而，直到现在,它无法直接支持一致性读，因为没有机制保证缓存是最新的。

<!--
The _consistent reads from cache_ feature addresses this by leveraging etcd's
[progress notifications](https://etcd.io/docs/v3.5/dev-guide/interacting_v3/#watch-progress)
mechanism.
These notifications inform the watch cache about how current its data is compared to etcd.
When a consistent read is requested, the system first checks if the watch cache is up-to-date.
-->
**基于缓存的一致性读** 特性通过使用 etcd 的
[进度通知](https://etcd.io/docs/v3.5/dev-guide/interacting_v3/#watch-progress)
机制来解决这一问题。这些通知会向监视缓存说明其数据与 etcd 相比的新旧状态。
当发出一致性读请求时，系统会首先检查监视缓存是否为最新状态。

<!--
If the cache is not up-to-date, the system queries etcd for progress notifications until it's confirmed that the cache is sufficiently fresh.
Once ready, the read is efficiently served directly from the cache,
which can significantly improve performance,
particularly in cases where it would require fetching a lot of data from etcd.
This enables requests that filter data to be served from the cache,
with only minimal metadata needing to be read from etcd.
-->
如果缓存未更新到最新状态，系统会通过查询 etcd 的进度通知，直到确认缓存已经足够新。
一旦缓存就绪，读取操作就可以直接从缓存中高效地获取数据，这可以显著提升性能，
尤其是在需要从 etcd 获取大量数据的场景下。这种方式支持通过缓存处理数据过滤请求，
仅需从 etcd 读取少量的元数据。

<!--
**Important Note:** To benefit from this feature, your Kubernetes cluster must be running etcd version 3.4.31+ or 3.5.13+.
For older etcd versions, Kubernetes will automatically fall back to serving consistent reads directly from etcd.

### Performance gains you'll notice

This seemingly simple change has a profound impact on Kubernetes performance and scalability:
-->
**重要提示：** 要享受此特性带来的好处，你的 Kubernetes 集群需运行
etcd 版本 3.4.31+ 或 3.5.13+。对于较早版本的 Etcd，Kubernetes
将自动回退为直接从 etcd 提供一致性读。

### 你将注意到的性能提升   {#performance-gains-youll-notice}

这个看似简单的改动，对 Kubernetes 的性能和可扩展性有着深远影响:

<!--
* **Reduced etcd Load:** Kubernetes v1.31 can offload work from etcd,
  freeing up resources for other critical operations.
* **Lower Latency:** Serving reads from cache is significantly faster than fetching
  and processing data from etcd. This translates to quicker responses for components,
  improving overall cluster responsiveness.
* **Improved Scalability:** Large clusters with thousands of nodes and pods will
  see the most significant gains, as the reduction in etcd load allows the
  control plane to handle more requests without sacrificing performance.
-->
* **降低 etcd 负载：** Kubernetes v1.31 可以将部分工作从 etcd 分载出去，
  为其他关键操作释放资源。
* **更低的延迟：** 从缓存读取数据的速度显著快于从 etcd 获取并处理数据。
  这使组件的响应速度更快，提升了集群整体的响应能力。
* **增强的可扩展性：** 拥有数千个节点和 Pod 的大型集群将获得最显著的性能增益，
  因为 etcd 负载的降低使得控制平面可以在不牺牲性能的情况下处理更多请求。

<!--
**5k Node Scalability Test Results:** In recent scalability tests on 5,000 node
clusters, enabling consistent reads from cache delivered impressive improvements:

* **30% reduction** in kube-apiserver CPU usage
* **25% reduction** in etcd CPU usage
* **Up to 3x reduction** (from 5 seconds to 1.5 seconds) in 99th percentile pod LIST request latency
-->
**5 千节点扩缩容测试结果：** 在最近针对 5,000 节点集群的扩缩容测试中，
启用基于缓存的一致性读带来了显著提升：

* **kube-apiserver CPU 使用率降低 30%**
* **etcd CPU 使用率降低 25%**
* **第 99 百分位的 Pod 列表请求延迟出现了高至 3 倍的减少（从 5 秒降至 1.5 秒）**

<!--
### What's next?

With the graduation to beta, consistent reads from cache are enabled by default,
offering a seamless performance boost to all Kubernetes users running a supported
etcd version.

Our journey doesn't end here. Kubernetes community is actively exploring
pagination support in the watch cache, which will unlock even more performance
optimizations in the future.
-->
## 下一步是什么？   {#whats-next}

随着基于缓存的一致性读特性晋升至 Beta 版，该特性已默认启用，为所有使用受支持 etcd
版本的 Kubernetes 用户提供了无缝的性能提升。

我们的探索并未止步于此。Kubernetes 社区正积极研究在监视缓存中加入分页支持，
未来有望带来更多性能优化。

<!--
### Getting started

Upgrading to Kubernetes v1.31 and ensuring you are using etcd version 3.4.31+ or
3.5.13+ is the easiest way to experience the benefits of consistent reads from
cache.
If you have any questions or feedback, don't hesitate to reach out to the Kubernetes community.
-->
### 开始使用   {#getting-started}

升级到 Kubernetes v1.31 并确保使用 etcd 版本 3.4.31+ 或 3.5.13+，
是体验基于缓存的一致性读优势的最简单方法。如果有任何问题或反馈，不要犹豫，
随时联系 Kubernetes 社区。

<!--
**Let us know how** _consistent reads from cache_ **transforms your Kubernetes experience!**

Special thanks to @ah8ad3 and @p0lyn0mial for their contributions to this feature!
-->
请让我们知道**基于缓存的一致性读**如何改善了你的 Kubernetes 体验！

特别感谢 @ah8ad3 和 @p0lyn0mial 对这一特性做出的贡献！  
