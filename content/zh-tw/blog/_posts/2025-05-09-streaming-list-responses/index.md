---
layout: blog
title: "Kubernetes v1.33：流式 List 響應"
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
隨着基礎設施的增長，管理 Kubernetes 集羣的穩定性變得愈發重要。
在大規模集羣的運維中，最具挑戰性的操作之一就是處理獲取大量數據集的 List 請求。
List 請求是一種常見的操作，卻可能意外影響集羣的穩定性。

今天，Kubernetes 社區非常高興地宣佈一項重大的架構改進：對 List 響應啓用流式編碼。

<!--
## The problem: unnecessary memory consumption with large resources

Current API response encoders just serialize an entire response into a single contiguous memory and perform one [ResponseWriter.Write](https://pkg.go.dev/net/http#ResponseWriter.Write) call to transmit data to the client. Despite HTTP/2's capability to split responses into smaller frames for transmission, the underlying HTTP server continues to hold the complete response data as a single buffer. Even as individual frames are transmitted to the client, the memory associated with these frames cannot be freed incrementally.
-->
## 問題：大型資源導致的不必要內存消耗

當前的 API 響應編碼器會將整個響應序列化爲一個連續的內存塊，並通過一次
[ResponseWriter.Write](https://pkg.go.dev/net/http#ResponseWriter.Write)
調用將數據發送給客戶端。儘管 HTTP/2 能夠將響應拆分爲較小的幀進行傳輸，
但底層的 HTTP 服務器仍然會將完整的響應數據保存在一個單一緩衝區中。
即使這些幀被逐步傳輸到客戶端，與這些幀關聯的內存也無法被逐步釋放。

<!--
When cluster size grows, the single response body can be substantial - like hundreds of megabytes in size. At large scale, the current approach becomes particularly inefficient, as it prevents incremental memory release during transmission. Imagining that when network congestion occurs, that large response body’s memory block stays active for tens of seconds or even minutes. This limitation leads to unnecessarily high and prolonged memory consumption in the kube-apiserver process. If multiple large List requests occur simultaneously, the cumulative memory consumption can escalate rapidly, potentially leading to an Out-of-Memory (OOM) situation that compromises cluster stability.
-->
隨着集羣規模的擴大，單個響應體可能非常龐大，可能達到幾百兆字節。
在大規模環境下，當前的方式顯得特別低效，因爲它使得系統無法在傳輸過程中逐步釋放內存。
想象一下，如果網絡發生擁堵，那麼大型響應體的內存塊會持續佔用數十秒甚至幾分鐘。
這一侷限性導致 kube-apiserver 進程出現不必要的高內存佔用，持續時間也很長。
如果多個大型 List 請求同時發生，累計的內存消耗可能迅速飆升，最終可能觸發
OOM（內存溢出）事件，從而危及集羣穩定性。

<!--
The encoding/json package uses sync.Pool to reuse memory buffers during serialization. While efficient for consistent workloads, this mechanism creates challenges with sporadic large List responses. When processing these large responses, memory pools expand significantly. But due to sync.Pool's design, these oversized buffers remain reserved after use. Subsequent small List requests continue utilizing these large memory allocations, preventing garbage collection and maintaining persistently high memory consumption in the kube-apiserver even after the initial large responses complete.
-->
`encoding/json` 包在序列化時使用了 `sync.Pool` 來複用內存緩衝區。
這對於一致的工作負載來說是高效的，但在處理偶發性的大型 List 響應時卻帶來了新的挑戰。
在處理這些大型響應時，內存池會迅速膨脹。而由於 `sync.Pool` 的設計特性，
這些膨脹後的緩衝區在使用後仍然會保留。後續的小型 List 請求繼續使用這些大型內存分配，
導致垃圾回收無法生效，使得 kube-apiserver 在處理完大型響應後仍然保持較高的內存佔用。

<!--
Additionally, [Protocol Buffers](https://github.com/protocolbuffers/protocolbuffers.github.io/blob/c14731f55296f8c6367faa4f2e55a3d3594544c6/content/programming-guides/techniques.md?plain=1#L39) are not designed to handle large datasets. But it’s great for handling **individual** messages within a large data set. This highlights the need for streaming-based approaches that can process and transmit large collections incrementally rather than as monolithic blocks.
-->
此外，[Protocol Buffers（協議緩衝）](https://github.com/protocolbuffers/protocolbuffers.github.io/blob/c14731f55296f8c6367faa4f2e55a3d3594544c6/content/programming-guides/techniques.md?plain=1#L39)
並不適合處理大型數據集。但它非常適合處理大型數據集中的**單個**消息。
這凸顯出採用基於流式處理方式的必要性，這種方式可以逐步處理和傳輸大型集合，而不是一次性處理整個數據塊。

<!--
> _As a general rule of thumb, if you are dealing in messages larger than a megabyte each, it may be time to consider an alternate strategy._
>
> _From https://protobuf.dev/programming-guides/techniques/_
-->
> **一個通用的經驗法則是：如果你處理的消息每個都大於一兆字節，那麼可能需要考慮替代策略。**
>  
> **引自：https://protobuf.dev/programming-guides/techniques/**

<!--
## Streaming encoder for List responses

The streaming encoding mechanism is specifically designed for List responses, leveraging their common well-defined collection structures. The core idea focuses exclusively on the **Items** field within collection structures, which represents the bulk of memory consumption in large responses. Rather than encoding the entire **Items** array as one contiguous memory block, the new streaming encoder processes and transmits each item individually, allowing memory to be freed progressively as frame or chunk is transmitted. As a result, encoding items one by one significantly reduces the memory footprint required by the API server.
-->
## List 響應的流式編碼器

流式編碼機制是專門爲 List 響應設計的，它利用了這類響應通用且定義良好的集合結構。
核心思想是聚焦於集合結構中的 **Items** 字段，此字段在大型響應中佔用了大部分內存。
新的流式編碼器不再將整個 **Items** 數組編碼爲一個連續的內存塊，而是逐個處理並傳輸每個 Item，
從而在傳輸每個幀或數據塊後可以逐步釋放內存。逐項編碼顯著減少了 API 服務器所需的內存佔用。

<!--
With Kubernetes objects typically limited to 1.5 MiB (from ETCD), streaming encoding keeps memory consumption predictable and manageable regardless of how many objects are in a List response. The result is significantly improved API server stability, reduced memory spikes, and better overall cluster performance - especially in environments where multiple large List operations might occur simultaneously.
-->
考慮到 Kubernetes 對象通常限制在 1.5 MiB（由 ETCD 限制），流式編碼可使內存佔用更加可預測和易於管理，
無論 List 響應中包含多少個對象。其結果是大幅提升了 API 服務器的穩定性，減少了內存峯值，
並改善了整體集羣性能，尤其是在同時發生多個大型 List 操作的環境下更是如此。

<!--
To ensure perfect backward compatibility, the streaming encoder validates Go struct tags rigorously before activation, guaranteeing byte-for-byte consistency with the original encoder. Standard encoding mechanisms process all fields except **Items**, maintaining identical output formatting throughout. This approach seamlessly supports all Kubernetes List types—from built-in **\*List** objects to Custom Resource **UnstructuredList** objects - requiring zero client-side modifications or awareness that the underlying encoding method has changed.
-->
爲了確保完全向後兼容，流式編碼器在啓用前會嚴格驗證 Go 結構體標籤，確保與原始編碼器在字節級別上保持一致。
標準編碼機制仍然會處理除 **Items** 外的所有字段，從而保持輸出格式的一致性。
這種方法無縫支持所有 Kubernetes 的 List 類型（從內置的 **\*List** 對象到自定義資源的 **UnstructuredList** 對象）
客戶端無需任何修改，也無需感知底層的編碼方式是否已發生變化。

<!--
## Performance gains you'll notice

*   **Reduced Memory Consumption:** Significantly lowers the memory footprint of the API server when handling large **list** requests,
    especially when dealing with **large resources**.
*   **Improved Scalability:** Enables the API server to handle more concurrent requests and larger datasets without running out of memory.
*   **Increased Stability:** Reduces the risk of OOM kills and service disruptions.
*   **Efficient Resource Utilization:** Optimizes memory usage and improves overall resource efficiency.
-->
## 肉眼可見的性能提升

* **內存消耗降低：** 當處理大型 **list** 請求，尤其是涉及**大型資源**時，API 服務器的內存佔用大幅下降。
* **可擴展性提升：** 允許 API 服務器處理更多併發請求和更大數據集，而不會耗盡內存。
* **穩定性增強：** 降低 OOM 被殺和服務中斷的風險。
* **資源利用率提升：** 優化內存使用率，提高整體資源效率。

<!--
## Benchmark results

To validate results Kubernetes has introduced a new **list** benchmark which executes concurrently 10 **list** requests each returning 1GB of data.

The benchmark has showed 20x improvement, reducing memory usage from 70-80GB to 3GB.
-->
## 基準測試結果

爲了驗證效果，Kubernetes 引入了一個新的 **list** 基準測試，同時併發執行 10 個 **list** 請求，每個請求返回 1GB 數據。

此基準測試顯示內存使用量下降了 **20 倍**，從 70–80GB 降低到了 3GB。

<!--
{{< figure src="results.png" alt="Screenshot of a K8s performance dashboard showing memory usage for benchmark list going down from 60GB to 3GB" caption="List benchmark memory usage" >}}
-->
{{< figure src="results.png" alt="K8s 性能面板截圖，顯示基準 list 內存使用量從 60GB 降低到 3GB" caption="List 基準測試內存使用量" >}}
