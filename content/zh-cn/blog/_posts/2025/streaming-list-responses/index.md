---
layout: blog
title: "Kubernetes v1.33：流式 List 响应"
date: 2025-05-09T10:30:00-08:00
slug: kubernetes-v1-33-streaming-list-responses
author: >
  Marek Siarkowicz (Google),
  Wei Fu (Microsoft)
transltor: >
  Michael Yao (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.33: Streaming List responses"
date: 2025-05-09T10:30:00-08:00
slug: kubernetes-v1-33-streaming-list-responses
author: >
  Marek Siarkowicz (Google),
  Wei Fu (Microsoft)
-->

<!--
Managing Kubernetes cluster stability becomes increasingly critical as your infrastructure grows. One of the most challenging aspects of operating large-scale clusters has been handling List requests that fetch substantial datasets - a common operation that could unexpectedly impact your cluster's stability.

Today, the Kubernetes community is excited to announce a significant architectural improvement: streaming encoding for List responses.
-->
随着基础设施的增长，管理 Kubernetes 集群的稳定性变得愈发重要。
在大规模集群的运维中，最具挑战性的操作之一就是处理获取大量数据集的 List 请求。
List 请求是一种常见的操作，却可能意外影响集群的稳定性。

今天，Kubernetes 社区非常高兴地宣布一项重大的架构改进：对 List 响应启用流式编码。

<!--
## The problem: unnecessary memory consumption with large resources

Current API response encoders just serialize an entire response into a single contiguous memory and perform one [ResponseWriter.Write](https://pkg.go.dev/net/http#ResponseWriter.Write) call to transmit data to the client. Despite HTTP/2's capability to split responses into smaller frames for transmission, the underlying HTTP server continues to hold the complete response data as a single buffer. Even as individual frames are transmitted to the client, the memory associated with these frames cannot be freed incrementally.
-->
## 问题：大型资源导致的不必要内存消耗

当前的 API 响应编码器会将整个响应序列化为一个连续的内存块，并通过一次
[ResponseWriter.Write](https://pkg.go.dev/net/http#ResponseWriter.Write)
调用将数据发送给客户端。尽管 HTTP/2 能够将响应拆分为较小的帧进行传输，
但底层的 HTTP 服务器仍然会将完整的响应数据保存在一个单一缓冲区中。
即使这些帧被逐步传输到客户端，与这些帧关联的内存也无法被逐步释放。

<!--
When cluster size grows, the single response body can be substantial - like hundreds of megabytes in size. At large scale, the current approach becomes particularly inefficient, as it prevents incremental memory release during transmission. Imagining that when network congestion occurs, that large response body’s memory block stays active for tens of seconds or even minutes. This limitation leads to unnecessarily high and prolonged memory consumption in the kube-apiserver process. If multiple large List requests occur simultaneously, the cumulative memory consumption can escalate rapidly, potentially leading to an Out-of-Memory (OOM) situation that compromises cluster stability.
-->
随着集群规模的扩大，单个响应体可能非常庞大，可能达到几百兆字节。
在大规模环境下，当前的方式显得特别低效，因为它使得系统无法在传输过程中逐步释放内存。
想象一下，如果网络发生拥堵，那么大型响应体的内存块会持续占用数十秒甚至几分钟。
这一局限性导致 kube-apiserver 进程出现不必要的高内存占用，持续时间也很长。
如果多个大型 List 请求同时发生，累计的内存消耗可能迅速飙升，最终可能触发
OOM（内存溢出）事件，从而危及集群稳定性。

<!--
The encoding/json package uses sync.Pool to reuse memory buffers during serialization. While efficient for consistent workloads, this mechanism creates challenges with sporadic large List responses. When processing these large responses, memory pools expand significantly. But due to sync.Pool's design, these oversized buffers remain reserved after use. Subsequent small List requests continue utilizing these large memory allocations, preventing garbage collection and maintaining persistently high memory consumption in the kube-apiserver even after the initial large responses complete.
-->
`encoding/json` 包在序列化时使用了 `sync.Pool` 来复用内存缓冲区。
这对于一致的工作负载来说是高效的，但在处理偶发性的大型 List 响应时却带来了新的挑战。
在处理这些大型响应时，内存池会迅速膨胀。而由于 `sync.Pool` 的设计特性，
这些膨胀后的缓冲区在使用后仍然会保留。后续的小型 List 请求继续使用这些大型内存分配，
导致垃圾回收无法生效，使得 kube-apiserver 在处理完大型响应后仍然保持较高的内存占用。

<!--
Additionally, [Protocol Buffers](https://github.com/protocolbuffers/protocolbuffers.github.io/blob/c14731f55296f8c6367faa4f2e55a3d3594544c6/content/programming-guides/techniques.md?plain=1#L39) are not designed to handle large datasets. But it’s great for handling **individual** messages within a large data set. This highlights the need for streaming-based approaches that can process and transmit large collections incrementally rather than as monolithic blocks.
-->
此外，[Protocol Buffers（协议缓冲）](https://github.com/protocolbuffers/protocolbuffers.github.io/blob/c14731f55296f8c6367faa4f2e55a3d3594544c6/content/programming-guides/techniques.md?plain=1#L39)
并不适合处理大型数据集。但它非常适合处理大型数据集中的**单个**消息。
这凸显出采用基于流式处理方式的必要性，这种方式可以逐步处理和传输大型集合，而不是一次性处理整个数据块。

<!--
> _As a general rule of thumb, if you are dealing in messages larger than a megabyte each, it may be time to consider an alternate strategy._
>
> _From https://protobuf.dev/programming-guides/techniques/_
-->
> **一个通用的经验法则是：如果你处理的消息每个都大于一兆字节，那么可能需要考虑替代策略。**
>  
> **引自：https://protobuf.dev/programming-guides/techniques/**

<!--
## Streaming encoder for List responses

The streaming encoding mechanism is specifically designed for List responses, leveraging their common well-defined collection structures. The core idea focuses exclusively on the **Items** field within collection structures, which represents the bulk of memory consumption in large responses. Rather than encoding the entire **Items** array as one contiguous memory block, the new streaming encoder processes and transmits each item individually, allowing memory to be freed progressively as frame or chunk is transmitted. As a result, encoding items one by one significantly reduces the memory footprint required by the API server.
-->
## List 响应的流式编码器

流式编码机制是专门为 List 响应设计的，它利用了这类响应通用且定义良好的集合结构。
核心思想是聚焦于集合结构中的 **Items** 字段，此字段在大型响应中占用了大部分内存。
新的流式编码器不再将整个 **Items** 数组编码为一个连续的内存块，而是逐个处理并传输每个 Item，
从而在传输每个帧或数据块后可以逐步释放内存。逐项编码显著减少了 API 服务器所需的内存占用。

<!--
With Kubernetes objects typically limited to 1.5 MiB (from ETCD), streaming encoding keeps memory consumption predictable and manageable regardless of how many objects are in a List response. The result is significantly improved API server stability, reduced memory spikes, and better overall cluster performance - especially in environments where multiple large List operations might occur simultaneously.
-->
考虑到 Kubernetes 对象通常限制在 1.5 MiB（由 ETCD 限制），流式编码可使内存占用更加可预测和易于管理，
无论 List 响应中包含多少个对象。其结果是大幅提升了 API 服务器的稳定性，减少了内存峰值，
并改善了整体集群性能，尤其是在同时发生多个大型 List 操作的环境下更是如此。

<!--
To ensure perfect backward compatibility, the streaming encoder validates Go struct tags rigorously before activation, guaranteeing byte-for-byte consistency with the original encoder. Standard encoding mechanisms process all fields except **Items**, maintaining identical output formatting throughout. This approach seamlessly supports all Kubernetes List types—from built-in **\*List** objects to Custom Resource **UnstructuredList** objects - requiring zero client-side modifications or awareness that the underlying encoding method has changed.
-->
为了确保完全向后兼容，流式编码器在启用前会严格验证 Go 结构体标签，确保与原始编码器在字节级别上保持一致。
标准编码机制仍然会处理除 **Items** 外的所有字段，从而保持输出格式的一致性。
这种方法无缝支持所有 Kubernetes 的 List 类型（从内置的 **\*List** 对象到自定义资源的 **UnstructuredList** 对象）
客户端无需任何修改，也无需感知底层的编码方式是否已发生变化。

<!--
## Performance gains you'll notice

*   **Reduced Memory Consumption:** Significantly lowers the memory footprint of the API server when handling large **list** requests,
    especially when dealing with **large resources**.
*   **Improved Scalability:** Enables the API server to handle more concurrent requests and larger datasets without running out of memory.
*   **Increased Stability:** Reduces the risk of OOM kills and service disruptions.
*   **Efficient Resource Utilization:** Optimizes memory usage and improves overall resource efficiency.
-->
## 肉眼可见的性能提升

* **内存消耗降低：** 当处理大型 **list** 请求，尤其是涉及**大型资源**时，API 服务器的内存占用大幅下降。
* **可扩展性提升：** 允许 API 服务器处理更多并发请求和更大数据集，而不会耗尽内存。
* **稳定性增强：** 降低 OOM 被杀和服务中断的风险。
* **资源利用率提升：** 优化内存使用率，提高整体资源效率。

<!--
## Benchmark results

To validate results Kubernetes has introduced a new **list** benchmark which executes concurrently 10 **list** requests each returning 1GB of data.

The benchmark has showed 20x improvement, reducing memory usage from 70-80GB to 3GB.
-->
## 基准测试结果

为了验证效果，Kubernetes 引入了一个新的 **list** 基准测试，同时并发执行 10 个 **list** 请求，每个请求返回 1GB 数据。

此基准测试显示内存使用量下降了 **20 倍**，从 70–80GB 降低到了 3GB。

<!--
{{< figure src="results.png" alt="Screenshot of a K8s performance dashboard showing memory usage for benchmark list going down from 60GB to 3GB" caption="List benchmark memory usage" >}}
-->
{{< figure src="results.png" alt="K8s 性能面板截图，显示基准 list 内存使用量从 60GB 降低到 3GB" caption="List 基准测试内存使用量" >}}
