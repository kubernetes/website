---
layout: blog
title: 'Kubernetes v1.31：通過基於緩存的一致性讀加速集羣性能'
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
Kubernetes 以其強大的容器化應用編排能力而聞名，但隨着集羣規模擴大，
對控制平面的需求可能成爲性能瓶頸。其中一個主要挑戰是確保從
etcd 數據存儲進行強一致性讀，這通常需要資源密集型仲裁讀取操作。

<!--
Today, the Kubernetes community is excited to announce a major improvement:
_consistent reads from cache_, graduating to Beta in Kubernetes v1.31.

### Why consistent reads matter
-->
今天，Kubernetes 社區很高興地宣佈一個重大改進：**基於緩存的一致性讀**，
已在 Kubernetes v1.31 中晉升至 Beta 階段。

### 爲什麼一致性讀如此重要   {#why-consistent-reads-matter}

<!--
Consistent reads are essential for ensuring that Kubernetes components have an accurate view of the latest cluster state.
Guaranteeing consistent reads is crucial for maintaining the accuracy and reliability of Kubernetes operations,
enabling components to make informed decisions based on up-to-date information.
In large-scale clusters, fetching and processing this data can be a performance bottleneck,
especially for requests that involve filtering results.
-->
一致性讀是確保 Kubernetes 組件準確瞭解最新集羣狀態的關鍵。
保證一致性讀對於保持 Kubernetes 操作準確性和可靠性至關重要，
使組件能夠根據最新信息做出明智決策。
在大型集羣中，數據的獲取和處理往往會成爲性能瓶頸，特別是那些需要過濾結果的請求。

<!--
While Kubernetes can filter data by namespace directly within etcd,
any other filtering by labels or field selectors requires the entire dataset to be fetched from etcd and then filtered in-memory by the Kubernetes API server.
This is particularly impactful for components like the kubelet,
which only needs to list pods scheduled to its node - but previously required the API Server and etcd to process all pods in the cluster.
-->
雖然 Kubernetes 可以直接在 etcd 中按命名空間過濾數據，但如果按標籤或字段選擇器過濾，
則需要從 etcd 獲取整個數據集，然後由 Kubernetes API 服務器在內存中執行過濾操作。
這對 Kubelet 等組件的影響尤爲顯著，因爲 Kubelet 現在僅需列出調度到其節點的 Pod，
而之前卻需要 API 服務器和 etcd 處理集羣中所有的 Pod。

<!--
### The breakthrough: Caching with confidence

Kubernetes has long used a watch cache to optimize read operations.
The watch cache stores a snapshot of the cluster state and receives updates through etcd watches.
However, until now, it couldn't serve consistent reads directly, as there was no guarantee the cache was sufficiently up-to-date.
-->
### 突破：自信地緩存   {#the-breakthrough-Caching-with-confidence}

Kubernetes 長期以來一直使用監視緩存來優化讀取操作。
監視緩存保存集羣狀態的快照，並通過對 etcd 的監視獲取更新。
然而，直到現在,它無法直接支持一致性讀，因爲沒有機制保證緩存是最新的。

<!--
The _consistent reads from cache_ feature addresses this by leveraging etcd's
[progress notifications](https://etcd.io/docs/v3.5/dev-guide/interacting_v3/#watch-progress)
mechanism.
These notifications inform the watch cache about how current its data is compared to etcd.
When a consistent read is requested, the system first checks if the watch cache is up-to-date.
-->
**基於緩存的一致性讀** 特性通過使用 etcd 的
[進度通知](https://etcd.io/docs/v3.5/dev-guide/interacting_v3/#watch-progress)
機制來解決這一問題。這些通知會向監視緩存說明其數據與 etcd 相比的新舊狀態。
當發出一致性讀請求時，系統會首先檢查監視緩存是否爲最新狀態。

<!--
If the cache is not up-to-date, the system queries etcd for progress notifications until it's confirmed that the cache is sufficiently fresh.
Once ready, the read is efficiently served directly from the cache,
which can significantly improve performance,
particularly in cases where it would require fetching a lot of data from etcd.
This enables requests that filter data to be served from the cache,
with only minimal metadata needing to be read from etcd.
-->
如果緩存未更新到最新狀態，系統會通過查詢 etcd 的進度通知，直到確認緩存已經足夠新。
一旦緩存就緒，讀取操作就可以直接從緩存中高效地獲取數據，這可以顯著提升性能，
尤其是在需要從 etcd 獲取大量數據的場景下。這種方式支持通過緩存處理數據過濾請求，
僅需從 etcd 讀取少量的元數據。

<!--
**Important Note:** To benefit from this feature, your Kubernetes cluster must be running etcd version 3.4.31+ or 3.5.13+.
For older etcd versions, Kubernetes will automatically fall back to serving consistent reads directly from etcd.

### Performance gains you'll notice

This seemingly simple change has a profound impact on Kubernetes performance and scalability:
-->
**重要提示：** 要享受此特性帶來的好處，你的 Kubernetes 集羣需運行
etcd 版本 3.4.31+ 或 3.5.13+。對於較早版本的 Etcd，Kubernetes
將自動回退爲直接從 etcd 提供一致性讀。

### 你將注意到的性能提升   {#performance-gains-youll-notice}

這個看似簡單的改動，對 Kubernetes 的性能和可擴展性有着深遠影響:

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
* **降低 etcd 負載：** Kubernetes v1.31 可以將部分工作從 etcd 分載出去，
  爲其他關鍵操作釋放資源。
* **更低的延遲：** 從緩存讀取數據的速度顯著快於從 etcd 獲取並處理數據。
  這使組件的響應速度更快，提升了集羣整體的響應能力。
* **增強的可擴展性：** 擁有數千個節點和 Pod 的大型集羣將獲得最顯著的性能增益，
  因爲 etcd 負載的降低使得控制平面可以在不犧牲性能的情況下處理更多請求。

<!--
**5k Node Scalability Test Results:** In recent scalability tests on 5,000 node
clusters, enabling consistent reads from cache delivered impressive improvements:

* **30% reduction** in kube-apiserver CPU usage
* **25% reduction** in etcd CPU usage
* **Up to 3x reduction** (from 5 seconds to 1.5 seconds) in 99th percentile pod LIST request latency
-->
**5 千節點擴縮容測試結果：** 在最近針對 5,000 節點集羣的擴縮容測試中，
啓用基於緩存的一致性讀帶來了顯著提升：

* **kube-apiserver CPU 使用率降低 30%**
* **etcd CPU 使用率降低 25%**
* **第 99 百分位的 Pod 列表請求延遲出現了高至 3 倍的減少（從 5 秒降至 1.5 秒）**

<!--
### What's next?

With the graduation to beta, consistent reads from cache are enabled by default,
offering a seamless performance boost to all Kubernetes users running a supported
etcd version.

Our journey doesn't end here. Kubernetes community is actively exploring
pagination support in the watch cache, which will unlock even more performance
optimizations in the future.
-->
## 下一步是什麼？   {#whats-next}

隨着基於緩存的一致性讀特性晉升至 Beta 版，該特性已默認啓用，爲所有使用受支持 etcd
版本的 Kubernetes 用戶提供了無縫的性能提升。

我們的探索並未止步於此。Kubernetes 社區正積極研究在監視緩存中加入分頁支持，
未來有望帶來更多性能優化。

<!--
### Getting started

Upgrading to Kubernetes v1.31 and ensuring you are using etcd version 3.4.31+ or
3.5.13+ is the easiest way to experience the benefits of consistent reads from
cache.
If you have any questions or feedback, don't hesitate to reach out to the Kubernetes community.
-->
### 開始使用   {#getting-started}

升級到 Kubernetes v1.31 並確保使用 etcd 版本 3.4.31+ 或 3.5.13+，
是體驗基於緩存的一致性讀優勢的最簡單方法。如果有任何問題或反饋，不要猶豫，
隨時聯繫 Kubernetes 社區。

<!--
**Let us know how** _consistent reads from cache_ **transforms your Kubernetes experience!**

Special thanks to @ah8ad3 and @p0lyn0mial for their contributions to this feature!
-->
請讓我們知道**基於緩存的一致性讀**如何改善了你的 Kubernetes 體驗！

特別感謝 @ah8ad3 和 @p0lyn0mial 對這一特性做出的貢獻！  
