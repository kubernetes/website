---
layout: blog
title: '使用 API 流式传输来增强 Kubernetes API 服务器效率'
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
高效管理 Kubernetes 集群至关重要，特别是在集群规模不断增长的情况下更是如此。
大型集群面临的一个重大挑战是 **list** 请求所造成的内存开销。

<!--
In the existing implementation, the kube-apiserver processes **list** requests by assembling the entire response in-memory before transmitting any data to the client. 
But what if the response body is substantial, say hundreds of megabytes? Additionally, imagine a scenario where multiple **list** requests flood in simultaneously, perhaps after a brief network outage. 
While [API Priority and Fairness](/docs/concepts/cluster-administration/flow-control) has proven to reasonably protect kube-apiserver from CPU overload, its impact is visibly smaller for memory protection. 
This can be explained by the differing nature of resource consumption by a single API request - the CPU usage at any given time is capped by a constant, whereas memory, being uncompressible, can grow proportionally with the number of processed objects and is unbounded.
This situation poses a genuine risk, potentially overwhelming and crashing any kube-apiserver within seconds due to out-of-memory (OOM) conditions. To better visualize the issue, let's consider the below graph.
-->
在现有的实现中，kube-apiserver 在处理 **list** 请求时，先在内存中组装整个响应，再将所有数据传输给客户端。
但如果响应体非常庞大，比如数百兆字节呢？另外再想象这样一种场景，有多个 **list** 请求同时涌入，可能是在短暂的网络中断后涌入。
虽然 [API 优先级和公平性](/zh-cn/docs/concepts/cluster-administration/flow-control)已经证明可以合理地保护
kube-apiserver 免受 CPU 过载，但其对内存保护的影响却明显较弱。这可以解释为各个 API 请求的资源消耗性质有所不同。
在任何给定时间，CPU 使用量都会受到某个常量的限制，而内存由于不可压缩，会随着处理对象数量的增加而成比例增长，且没有上限。
这种情况会带来真正的风险，kube-apiserver 可能会在几秒钟内因内存不足（OOM）状况而淹没和崩溃。
为了更直观地查验这个问题，我们看看下面的图表。

<!--
{{< figure src="kube-apiserver-memory_usage.png" alt="Monitoring graph showing kube-apiserver memory usage" class="diagram-large" clicktozoom="true" >}}
-->
{{< figure src="kube-apiserver-memory_usage.png" alt="显示 kube-apiserver 内存使用量的监控图表" class="diagram-large" clicktozoom="true" >}}

<!--
The graph shows the memory usage of a kube-apiserver during a synthetic test.
(see the [synthetic test](#the-synthetic-test) section for more details).
The results clearly show that increasing the number of informers significantly boosts the server's memory consumption. 
Notably, at approximately 16:40, the server crashed when serving only 16 informers.
-->
以上图表显示了 kube-apiserver 在一次模拟测试中的内存使用情况。
（有关更多细节，参见[模拟测试](#the-synthetic-test)一节）。
结果清楚地表明，增加 informer 的数量显著提高了服务器的内存消耗量。
值得注意的是，在大约 16:40 时，服务器在仅提供了 16 个 informer 时就崩溃了。

<!--
## Why does kube-apiserver allocate so much memory for list requests?

Our investigation revealed that this substantial memory allocation occurs because the server before sending the first byte to the client must:
* fetch data from the database,
* deserialize the data from its stored format,
* and finally construct the final response by converting and serializing the data into a client requested format
-->
## 为什么 kube-apiserver 为 list 请求分配这么多内存？   {#why-does-kube-apiserver-allocates-so-much-memory-for-list-requests}

我们的调查显示，这种大量内存分配的发生是因为在向客户端发送第一个字节之前，服务器必须：

* 从数据库中获取数据
* 对数据执行从其存储格式的反序列化
* 最后通过将数据转换和序列化为客户端所请求的格式来构造最终的响应。

<!--
This sequence results in significant temporary memory consumption. 
The actual usage depends on many factors like the page size, applied filters (e.g. label selectors), query parameters, and sizes of individual objects. 

Unfortunately, neither [API Priority and Fairness](/docs/concepts/cluster-administration/flow-control) nor Golang's garbage collection or Golang memory limits can prevent the system from exhausting memory under these conditions. 
The memory is allocated suddenly and rapidly, and just a few requests can quickly deplete the available memory, leading to resource exhaustion.
-->
这个序列导致了显著的临时内存消耗。实际使用量取决于许多因素，
比如分页大小、所施加的过滤器（例如标签选择算符）、查询参数和单个对象的体量。

不巧的是，无论是 [API 优先级和公平性](/zh-cn/docs/concepts/cluster-administration/flow-control)，
还是 Golang 的垃圾收集或 Golang 的内存限制，都无法在这些状况下防止系统耗尽内存。
内存是被突然且快速分配的，仅仅几个请求就可能迅速耗尽可用内存，导致资源耗尽。

<!--
Depending on how the API server is run on the node, it might either be killed through OOM by the kernel when exceeding the configured memory limits during these uncontrolled spikes, or if limits are not configured it might have even worse impact on the control plane node.
And worst, after the first API server failure, the same requests will likely hit another control plane node in an HA setup with probably the same impact. 
Potentially a situation that is hard to diagnose and hard to recover from.
-->
取决于 API 服务器在节点上的运行方式，API 服务器可能在这些不受控制的峰值期间因为超过所配置的内存限制而被内核通过 OOM 杀死，
或者如果没有为服务器配置限制值，则其可能对控制平面节点产生更糟糕的影响。最糟糕的是，
在第一个 API 服务器出现故障后，相同的请求将很可能会影响高可用（HA）部署中的另一个控制平面节点，
并可能产生相同的影响。这可能是一个难以诊断和难以恢复的情况。

<!--
## Streaming list requests

Today, we're excited to announce a major improvement. 
With the graduation of the _watch list_ feature to beta in Kubernetes 1.32, client-go users can opt-in (after explicitly enabling `WatchListClient` feature gate) 
to streaming lists by switching from **list** to (a special kind of) **watch** requests.
-->
## 流式处理 list 请求   {#streaming-list-requests}

今天，我们很高兴地宣布一项重大改进。随着 Kubernetes 1.32 中 _watch list_ 特性进阶至 Beta，
client-go 用户可以选择（在显式启用 `WatchListClient` 特性门控后）通过将 **list** 请求切换为（某种特殊类别的）
**watch** 请求来进行流式处理。

<!--
**Watch** requests are served from the _watch cache_, an in-memory cache designed to improve scalability of read operations. 
By streaming each item individually instead of returning the entire collection, the new method maintains constant memory overhead. 
The API server is bound by the maximum allowed size of an object in etcd plus a few additional allocations. 
This approach drastically reduces the temporary memory usage compared to traditional **list** requests, ensuring a more efficient and stable system, 
especially in clusters with a large number of objects of a given type or large average object sizes where despite paging memory consumption used to be high.
-->
**watch** 请求使用 **监视缓存（watch cache）** 提供服务，监视缓存是设计来提高读操作扩缩容能力的一个内存缓存。
通过逐个流式传输每一项，而不是返回整个集合，这种新方法保持了恒定的内存开销。
API 服务器受限于 etcd 中对象的最大允许体量加上少量额外分配的内存。
与传统的 **list** 请求相比，尤其是在分页情况下内存消耗仍较高的、具有大量特定类别的对象或对象体量平均较大的集群中，
这种方法大幅降低了临时内存使用量，确保了系统更高效和更稳定。

<!--
Building on the insight gained from the synthetic test (see the [synthetic test](#the-synthetic-test), we developed an automated performance test to systematically evaluate the impact of the _watch list_ feature. 
This test replicates the same scenario, generating a large number of Secrets with a large payload, and scaling the number of informers to simulate heavy **list** request patterns. 
The automated test is executed periodically to monitor memory usage of the server with the feature enabled and disabled.
-->
基于模拟测试所了解的情况（参见[模拟测试](#the-synthetic-test)），我们开发了一种自动化的性能测试，
以系统地评估 _watch list_ 特性的影响。此测试能够重现相同的场景，生成大量载荷较大的 Secret，
并扩缩容 informer 的数量以模拟高频率的 **list** 请求模式。
这种自动化测试被定期执行，以监控启用和禁用此特性后服务器的内存使用情况。

<!--
The results showed significant improvements with the _watch list_ feature enabled. 
With the feature turned on, the kube-apiserver’s memory consumption stabilized at approximately **2 GB**. 
By contrast, with the feature disabled, memory usage increased to approximately **20GB**, a **10x** increase! 
These results confirm the effectiveness of the new streaming API, which reduces the temporary memory footprint.
-->
结果表明，启用 _watch list_ 特性后有显著改善。
启用此特性时，kube-apiserver 的内存消耗稳定在大约 **2 GB**。
相比之下，禁用此特性时，内存使用量增加到约 **20 GB**，增长了 **10 倍**！
这些结果证实了新的流式 API 的有效性，减少了临时内存占用。

<!--
## Enabling API Streaming for your component

Upgrade to Kubernetes 1.32. Make sure your cluster uses etcd in version 3.4.31+ or 3.5.13+.
Change your client software to use watch lists. If your client code is written in Golang, you'll want to enable `WatchListClient` for client-go. 
For details on enabling that feature, read [Introducing Feature Gates to Client-Go: Enhancing Flexibility and Control](/blog/2024/08/12/feature-gates-in-client-go).
-->
## 为你的组件启用 API 流式传输   {#enabling-api-streaming-for-your-component}

升级到 Kubernetes 1.32。确保你的集群使用 etcd v3.4.31+ 或 v3.5.13+。将你的客户端软件更改为使用 watch list。
如果你的客户端代码是用 Golang 编写的，你将需要为 client-go 启用 `WatchListClient`。有关启用该特性的细节，
参阅[为 client-go 引入特性门控：增强灵活性和控制](/zh-cn/blog/2024/08/12/feature-gates-in-client-go)。

<!--
## What's next?
In Kubernetes 1.32, the feature is enabled in kube-controller-manager by default despite its beta state. 
This will eventually be expanded to other core components like kube-scheduler or kubelet; once the feature becomes generally available, if not earlier.
Other 3rd-party components are encouraged to opt-in to the feature during the beta phase, especially when they are at risk of accessing a large number of resources or kinds with potentially large object sizes.
-->
## 接下来   {#whats-next}

在 Kubernetes 1.32 中，尽管此特性处于 Beta 状态，但在 kube-controller-manager 中默认被启用。
一旦此特性进阶至正式发布（GA），或许更早，此特性最终将被扩展到 kube-scheduler 或 kubelet 这类其他核心组件。
我们鼓励其他第三方组件在此特性处于 Beta 阶段时选择使用此特性，特别是这些组件在有可能访问大量资源或对象体量较大的情况下。

<!--
For the time being, [API Priority and Fairness](/docs/concepts/cluster-administration/flow-control) assigns a reasonable small cost to **list** requests. 
This is necessary to allow enough parallelism for the average case where **list** requests are cheap enough. 
But it does not match the spiky exceptional situation of many and large objects. 
Once the majority of the Kubernetes ecosystem has switched to _watch list_, the **list** cost estimation can be changed to larger values without risking degraded performance in the average case,
and with that increasing the protection against this kind of requests that can still hit the API server in the future.
-->
目前，[API 优先级和公平性](/zh-cn/docs/concepts/cluster-administration/flow-control)为
**list** 请求带来了少量但合理的开销。这是必要的，以允许在通常 **list** 请求开销足够低的情况下实现足够的并行性。
但这并不适用于对象数量众多、体量巨大的峰值异常情形。一旦大多数 Kubernetes 生态体系切换到 _watch list_ ，
就可以将 **list** 开销估算调整为更大的值，而不必担心在平均情况下出现性能下降，
从而提高对未来可能仍会影响 API 服务器的此类请求的保护。

<!--
## The synthetic test

In order to reproduce the issue, we conducted a manual test to understand the impact of **list** requests on kube-apiserver memory usage. 
In the test, we created 400 Secrets, each containing 1 MB of data, and used informers to retrieve all Secrets.
-->
## 模拟测试   {#the-synthetic-test}

为了重现此问题，我们实施了手动测试，以了解 **list** 请求对 kube-apiserver 内存使用量的影响。
在测试中，我们创建了 400 个 Secret，每个 Secret 包含 1 MB 的数据，并使用 informer 检索所有 Secret。

<!--
The results were alarming, only 16 informers were needed to cause the test server to run out of memory and crash, demonstrating how quickly memory consumption can grow under such conditions.

Special shout out to [@deads2k](https://github.com/deads2k) for his help in shaping this feature.
-->
结果令人担忧，仅需 16 个 informer 就足以导致测试服务器内存耗尽并崩溃，展示了在这些状况下内存消耗快速增长的方式。

特别感谢 [@deads2k](https://github.com/deads2k) 在构造此特性所提供的帮助。

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

自该功能启动以来，[Marek Siarkowicz](https://github.com/serathius) 在 Kubernetes API
服务器中加入了一项新技术：**流式集合编码**。在 Kubernetes v1.33 中，引入了两个相关的特性门控：
`StreamingCollectionEncodingToJSON` 和 `StreamingCollectionEncodingToProtobuf`。它们通过流的方式进行编码，
避免一次性分配所有内存。该功能与现有的 **list** 编码实现了比特级完全兼容，不仅能更显著地节省服务器端内存，
而且无需修改任何客户端代码。在 1.33 版本中，`WatchList` 特性门控默认是禁用的。  
