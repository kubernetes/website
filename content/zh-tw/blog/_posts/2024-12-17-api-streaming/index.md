---
layout: blog
title: '使用 API 流式傳輸來增強 Kubernetes API 伺服器效率'
date: 2024-12-17
slug: kube-apiserver-api-streaming
author: >
  Stefan Schimanski (Upbound),
  Wojciech Tyczynski (Google),
  Lukasz Szaszkiewicz (Red Hat)
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: 'Enhancing Kubernetes API Server Efficiency with API Streaming'
date: 2024-12-17
slug: kube-apiserver-api-streaming
author: >
 Stefan Schimanski (Upbound),
 Wojciech Tyczynski (Google),
 Lukasz Szaszkiewicz (Red Hat)
-->

<!--
Managing Kubernetes clusters efficiently is critical, especially as their size is growing. 
A significant challenge with large clusters is the memory overhead caused by **list** requests.
-->
高效管理 Kubernetes 叢集至關重要，特別是在叢集規模不斷增長的情況下更是如此。
大型叢集面臨的一個重大挑戰是 **list** 請求所造成的內存開銷。

<!--
In the existing implementation, the kube-apiserver processes **list** requests by assembling the entire response in-memory before transmitting any data to the client. 
But what if the response body is substantial, say hundreds of megabytes? Additionally, imagine a scenario where multiple **list** requests flood in simultaneously, perhaps after a brief network outage. 
While [API Priority and Fairness](/docs/concepts/cluster-administration/flow-control) has proven to reasonably protect kube-apiserver from CPU overload, its impact is visibly smaller for memory protection. 
This can be explained by the differing nature of resource consumption by a single API request - the CPU usage at any given time is capped by a constant, whereas memory, being uncompressible, can grow proportionally with the number of processed objects and is unbounded.
This situation poses a genuine risk, potentially overwhelming and crashing any kube-apiserver within seconds due to out-of-memory (OOM) conditions. To better visualize the issue, let's consider the below graph.
-->
在現有的實現中，kube-apiserver 在處理 **list** 請求時，先在內存中組裝整個響應，再將所有數據傳輸給客戶端。
但如果響應體非常龐大，比如數百兆字節呢？另外再想象這樣一種場景，有多個 **list** 請求同時湧入，可能是在短暫的網路中斷後湧入。
雖然 [API 優先級和公平性](/zh-cn/docs/concepts/cluster-administration/flow-control)已經證明可以合理地保護
kube-apiserver 免受 CPU 過載，但其對內存保護的影響卻明顯較弱。這可以解釋爲各個 API 請求的資源消耗性質有所不同。
在任何給定時間，CPU 使用量都會受到某個常量的限制，而內存由於不可壓縮，會隨着處理對象數量的增加而成比例增長，且沒有上限。
這種情況會帶來真正的風險，kube-apiserver 可能會在幾秒鐘內因內存不足（OOM）狀況而淹沒和崩潰。
爲了更直觀地查驗這個問題，我們看看下面的圖表。

<!--
{{< figure src="kube-apiserver-memory_usage.png" alt="Monitoring graph showing kube-apiserver memory usage" class="diagram-large" clicktozoom="true" >}}
-->
{{< figure src="kube-apiserver-memory_usage.png" alt="顯示 kube-apiserver 內存使用量的監控圖表" class="diagram-large" clicktozoom="true" >}}

<!--
The graph shows the memory usage of a kube-apiserver during a synthetic test.
(see the [synthetic test](#the-synthetic-test) section for more details).
The results clearly show that increasing the number of informers significantly boosts the server's memory consumption. 
Notably, at approximately 16:40, the server crashed when serving only 16 informers.
-->
以上圖表顯示了 kube-apiserver 在一次模擬測試中的內存使用情況。
（有關更多細節，參見[模擬測試](#the-synthetic-test)一節）。
結果清楚地表明，增加 informer 的數量顯著提高了伺服器的內存消耗量。
值得注意的是，在大約 16:40 時，伺服器在僅提供了 16 個 informer 時就崩潰了。

<!--
## Why does kube-apiserver allocate so much memory for list requests?

Our investigation revealed that this substantial memory allocation occurs because the server before sending the first byte to the client must:
* fetch data from the database,
* deserialize the data from its stored format,
* and finally construct the final response by converting and serializing the data into a client requested format
-->
## 爲什麼 kube-apiserver 爲 list 請求分配這麼多內存？   {#why-does-kube-apiserver-allocates-so-much-memory-for-list-requests}

我們的調查顯示，這種大量內存分配的發生是因爲在向客戶端發送第一個字節之前，伺服器必須：

* 從數據庫中獲取數據
* 對數據執行從其存儲格式的反序列化
* 最後通過將數據轉換和序列化爲客戶端所請求的格式來構造最終的響應。

<!--
This sequence results in significant temporary memory consumption. 
The actual usage depends on many factors like the page size, applied filters (e.g. label selectors), query parameters, and sizes of individual objects. 

Unfortunately, neither [API Priority and Fairness](/docs/concepts/cluster-administration/flow-control) nor Golang's garbage collection or Golang memory limits can prevent the system from exhausting memory under these conditions. 
The memory is allocated suddenly and rapidly, and just a few requests can quickly deplete the available memory, leading to resource exhaustion.
-->
這個序列導致了顯著的臨時內存消耗。實際使用量取決於許多因素，
比如分頁大小、所施加的過濾器（例如標籤選擇算符）、查詢參數和單個對象的體量。

不巧的是，無論是 [API 優先級和公平性](/zh-cn/docs/concepts/cluster-administration/flow-control)，
還是 Golang 的垃圾收集或 Golang 的內存限制，都無法在這些狀況下防止系統耗盡內存。
內存是被突然且快速分配的，僅僅幾個請求就可能迅速耗盡可用內存，導致資源耗盡。

<!--
Depending on how the API server is run on the node, it might either be killed through OOM by the kernel when exceeding the configured memory limits during these uncontrolled spikes, or if limits are not configured it might have even worse impact on the control plane node.
And worst, after the first API server failure, the same requests will likely hit another control plane node in an HA setup with probably the same impact. 
Potentially a situation that is hard to diagnose and hard to recover from.
-->
取決於 API 伺服器在節點上的運行方式，API 伺服器可能在這些不受控制的峯值期間因爲超過所設定的內存限制而被內核通過 OOM 殺死，
或者如果沒有爲伺服器設定限制值，則其可能對控制平面節點產生更糟糕的影響。最糟糕的是，
在第一個 API 伺服器出現故障後，相同的請求將很可能會影響高可用（HA）部署中的另一個控制平面節點，
並可能產生相同的影響。這可能是一個難以診斷和難以恢復的情況。

<!--
## Streaming list requests

Today, we're excited to announce a major improvement. 
With the graduation of the _watch list_ feature to beta in Kubernetes 1.32, client-go users can opt-in (after explicitly enabling `WatchListClient` feature gate) 
to streaming lists by switching from **list** to (a special kind of) **watch** requests.
-->
## 流式處理 list 請求   {#streaming-list-requests}

今天，我們很高興地宣佈一項重大改進。隨着 Kubernetes 1.32 中 _watch list_ 特性進階至 Beta，
client-go 使用者可以選擇（在顯式啓用 `WatchListClient` 特性門控後）通過將 **list** 請求切換爲（某種特殊類別的）
**watch** 請求來進行流式處理。

<!--
**Watch** requests are served from the _watch cache_, an in-memory cache designed to improve scalability of read operations. 
By streaming each item individually instead of returning the entire collection, the new method maintains constant memory overhead. 
The API server is bound by the maximum allowed size of an object in etcd plus a few additional allocations. 
This approach drastically reduces the temporary memory usage compared to traditional **list** requests, ensuring a more efficient and stable system, 
especially in clusters with a large number of objects of a given type or large average object sizes where despite paging memory consumption used to be high.
-->
**watch** 請求使用 **監視緩存（watch cache）** 提供服務，監視緩存是設計來提高讀操作擴縮容能力的一個內存緩存。
通過逐個流式傳輸每一項，而不是返回整個集合，這種新方法保持了恆定的內存開銷。
API 伺服器受限於 etcd 中對象的最大允許體量加上少量額外分配的內存。
與傳統的 **list** 請求相比，尤其是在分頁情況下內存消耗仍較高的、具有大量特定類別的對象或對象體量平均較大的叢集中，
這種方法大幅降低了臨時內存使用量，確保了系統更高效和更穩定。

<!--
Building on the insight gained from the synthetic test (see the [synthetic test](#the-synthetic-test), we developed an automated performance test to systematically evaluate the impact of the _watch list_ feature. 
This test replicates the same scenario, generating a large number of Secrets with a large payload, and scaling the number of informers to simulate heavy **list** request patterns. 
The automated test is executed periodically to monitor memory usage of the server with the feature enabled and disabled.
-->
基於模擬測試所瞭解的情況（參見[模擬測試](#the-synthetic-test)），我們開發了一種自動化的性能測試，
以系統地評估 _watch list_ 特性的影響。此測試能夠重現相同的場景，生成大量載荷較大的 Secret，
並擴縮容 informer 的數量以模擬高頻率的 **list** 請求模式。
這種自動化測試被定期執行，以監控啓用和禁用此特性後伺服器的內存使用情況。

<!--
The results showed significant improvements with the _watch list_ feature enabled. 
With the feature turned on, the kube-apiserver’s memory consumption stabilized at approximately **2 GB**. 
By contrast, with the feature disabled, memory usage increased to approximately **20GB**, a **10x** increase! 
These results confirm the effectiveness of the new streaming API, which reduces the temporary memory footprint.
-->
結果表明，啓用 _watch list_ 特性後有顯著改善。
啓用此特性時，kube-apiserver 的內存消耗穩定在大約 **2 GB**。
相比之下，禁用此特性時，內存使用量增加到約 **20 GB**，增長了 **10 倍**！
這些結果證實了新的流式 API 的有效性，減少了臨時內存佔用。

<!--
## Enabling API Streaming for your component

Upgrade to Kubernetes 1.32. Make sure your cluster uses etcd in version 3.4.31+ or 3.5.13+.
Change your client software to use watch lists. If your client code is written in Golang, you'll want to enable `WatchListClient` for client-go. 
For details on enabling that feature, read [Introducing Feature Gates to Client-Go: Enhancing Flexibility and Control](/blog/2024/08/12/feature-gates-in-client-go).
-->
## 爲你的組件啓用 API 流式傳輸   {#enabling-api-streaming-for-your-component}

升級到 Kubernetes 1.32。確保你的叢集使用 etcd v3.4.31+ 或 v3.5.13+。將你的客戶端軟件更改爲使用 watch list。
如果你的客戶端代碼是用 Golang 編寫的，你將需要爲 client-go 啓用 `WatchListClient`。有關啓用該特性的細節，
參閱[爲 client-go 引入特性門控：增強靈活性和控制](/zh-cn/blog/2024/08/12/feature-gates-in-client-go)。

<!--
## What's next?
In Kubernetes 1.32, the feature is enabled in kube-controller-manager by default despite its beta state. 
This will eventually be expanded to other core components like kube-scheduler or kubelet; once the feature becomes generally available, if not earlier.
Other 3rd-party components are encouraged to opt-in to the feature during the beta phase, especially when they are at risk of accessing a large number of resources or kinds with potentially large object sizes.
-->
## 接下來   {#whats-next}

在 Kubernetes 1.32 中，儘管此特性處於 Beta 狀態，但在 kube-controller-manager 中默認被啓用。
一旦此特性進階至正式發佈（GA），或許更早，此特性最終將被擴展到 kube-scheduler 或 kubelet 這類其他核心組件。
我們鼓勵其他第三方組件在此特性處於 Beta 階段時選擇使用此特性，特別是這些組件在有可能訪問大量資源或對象體量較大的情況下。

<!--
For the time being, [API Priority and Fairness](/docs/concepts/cluster-administration/flow-control) assigns a reasonable small cost to **list** requests. 
This is necessary to allow enough parallelism for the average case where **list** requests are cheap enough. 
But it does not match the spiky exceptional situation of many and large objects. 
Once the majority of the Kubernetes ecosystem has switched to _watch list_, the **list** cost estimation can be changed to larger values without risking degraded performance in the average case,
and with that increasing the protection against this kind of requests that can still hit the API server in the future.
-->
目前，[API 優先級和公平性](/zh-cn/docs/concepts/cluster-administration/flow-control)爲
**list** 請求帶來了少量但合理的開銷。這是必要的，以允許在通常 **list** 請求開銷足夠低的情況下實現足夠的並行性。
但這並不適用於對象數量衆多、體量巨大的峯值異常情形。一旦大多數 Kubernetes 生態體系切換到 _watch list_ ，
就可以將 **list** 開銷估算調整爲更大的值，而不必擔心在平均情況下出現性能下降，
從而提高對未來可能仍會影響 API 伺服器的此類請求的保護。

<!--
## The synthetic test

In order to reproduce the issue, we conducted a manual test to understand the impact of **list** requests on kube-apiserver memory usage. 
In the test, we created 400 Secrets, each containing 1 MB of data, and used informers to retrieve all Secrets.
-->
## 模擬測試   {#the-synthetic-test}

爲了重現此問題，我們實施了手動測試，以瞭解 **list** 請求對 kube-apiserver 內存使用量的影響。
在測試中，我們創建了 400 個 Secret，每個 Secret 包含 1 MB 的數據，並使用 informer 檢索所有 Secret。

<!--
The results were alarming, only 16 informers were needed to cause the test server to run out of memory and crash, demonstrating how quickly memory consumption can grow under such conditions.

Special shout out to [@deads2k](https://github.com/deads2k) for his help in shaping this feature.
-->
結果令人擔憂，僅需 16 個 informer 就足以導致測試伺服器內存耗盡並崩潰，展示了在這些狀況下內存消耗快速增長的方式。

特別感謝 [@deads2k](https://github.com/deads2k) 在構造此特性所提供的幫助。

<!--
## Kubernetes 1.33 update

Since this feature was started, [Marek Siarkowicz](https://github.com/serathius) integrated a new technology into the
Kubernetes API server: _streaming collection encoding_.
Kubernetes v1.33 introduced two related feature gates, `StreamingCollectionEncodingToJSON` and `StreamingCollectionEncodingToProtobuf`.
These features encode via a stream and avoid allocating all the memory at once.
This functionality is bit-for-bit compatible with existing **list** encodings, produces even greater server-side memory savings, and doesn't require any changes to client code.
In 1.33, the `WatchList` feature gate is disabled by default.
-->
## Kubernetes 1.33 更新   {#kubernetes-1.33-update}

自該功能啓動以來，[Marek Siarkowicz](https://github.com/serathius) 在 Kubernetes API
伺服器中加入了一項新技術：**流式集合編碼**。在 Kubernetes v1.33 中，引入了兩個相關的特性門控：
`StreamingCollectionEncodingToJSON` 和 `StreamingCollectionEncodingToProtobuf`。它們通過流的方式進行編碼，
避免一次性分配所有內存。該功能與現有的 **list** 編碼實現了比特級完全兼容，不僅能更顯著地節省伺服器端內存，
而且無需修改任何客戶端代碼。在 1.33 版本中，`WatchList` 特性門控默認是禁用的。  
