---
title: 虛擬 IP 和服務代理
content_type: reference
weight: 50
---
<!--
title: Virtual IPs and Service Proxies
content_type: reference
weight: 50
-->

<!-- overview -->

<!--
Every {{< glossary_tooltip term_id="node" text="node" >}} in a Kubernetes
{{< glossary_tooltip term_id="cluster" text="cluster" >}} runs a
[kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/)
(unless you have deployed your own alternative component in place of `kube-proxy`).
-->
Kubernetes {{< glossary_tooltip text="叢集" term_id="cluster" >}}中的每個
{{< glossary_tooltip text="節點" term_id="node" >}}會運行一個
[kube-proxy](/zh-cn/docs/reference/command-line-tools-reference/kube-proxy/)
（除非你已經部署了自己的替換組件來替代 `kube-proxy`）。

<!--
The `kube-proxy` component is responsible for implementing a _virtual IP_
mechanism for {{< glossary_tooltip term_id="service" text="Services">}}
of `type` other than
[`ExternalName`](/docs/concepts/services-networking/service/#externalname).
-->
`kube-proxy` 組件負責除 `type` 爲
[`ExternalName`](/zh-cn/docs/concepts/services-networking/service/#externalname)
以外的 {{< glossary_tooltip term_id="service" text="Service">}} 實現**虛擬 IP** 機制。

<!--
Each instance of kube-proxy watches the Kubernetes
{{< glossary_tooltip term_id="control-plane" text="control plane" >}}
for the addition and removal of Service and EndpointSlice
{{< glossary_tooltip term_id="object" text="objects" >}}. For each Service, kube-proxy
calls appropriate APIs (depending on the kube-proxy mode) to configure
the node to capture traffic to the Service's `clusterIP` and `port`,
and redirect that traffic to one of the Service's endpoints
(usually a Pod, but possibly an arbitrary user-provided IP address). A control
loop ensures that the rules on each node are reliably synchronized with
the Service and EndpointSlice state as indicated by the API server.

{{< figure src="/images/docs/services-iptables-overview.svg" title="Virtual IP mechanism for Services, using iptables mode" class="diagram-medium" >}}
-->
kube-proxy 的每個實例都會監視 Kubernetes {{< glossary_tooltip text="控制平面" term_id="control-plane" >}}中
Service 和 EndpointSlice {{< glossary_tooltip text="對象" term_id="object" >}}的添加和刪除。對於每個
Service，kube-proxy 調用適當的 API（取決於 kube-proxy 模式）來設定節點，以捕獲流向 Service 的 `clusterIP` 和 `port`
的流量，並將這些流量重定向到 Service 的某個端點（通常是 Pod，但也可能是使用者提供的任意 IP 地址）。
一個控制迴路確保每個節點上的規則與 API 伺服器指示的 Service 和 EndpointSlice 狀態可靠同步。

{{< figure src="/zh-cn/docs/images/services-iptables-overview.svg" title="iptables 模式下 Service 的虛擬 IP 機制" class="diagram-medium" >}}

<!--
A question that pops up every now and then is why Kubernetes relies on
proxying to forward inbound traffic to backends. What about other
approaches? For example, would it be possible to configure DNS records that
have multiple A values (or AAAA for IPv6), and rely on round-robin name
resolution?
-->
一個時不時出現的問題是，爲什麼 Kubernetes 依賴代理將入站流量轉發到後端。
其他方案呢？例如，是否可以設定具有多個 A 值（或 IPv6 的 AAAA）的 DNS 記錄，
使用輪詢域名解析？

<!--
There are a few reasons for using proxying for Services:

* There is a long history of DNS implementations not respecting record TTLs,
  and caching the results of name lookups after they should have expired.
* Some apps do DNS lookups only once and cache the results indefinitely.
* Even if apps and libraries did proper re-resolution, the low or zero TTLs
  on the DNS records could impose a high load on DNS that then becomes
  difficult to manage.
-->
使用代理轉發方式實現 Service 的原因有以下幾個：

* DNS 的實現不遵守記錄的 TTL 約定的歷史由來已久，在記錄過期後可能仍有結果緩存。
* 有些應用只做一次 DNS 查詢，然後永久緩存結果。
* 即使應用程序和庫進行了適當的重新解析，TTL 取值較低或爲零的 DNS 記錄可能會給 DNS 帶來很大的壓力，
  從而變得難以管理。

<!--
Later in this page you can read about how various kube-proxy implementations work.
Overall, you should note that, when running `kube-proxy`, kernel level rules may be modified
(for example, iptables rules might get created), which won't get cleaned up, in some
cases until you reboot. Thus, running kube-proxy is something that should only be done
by an administrator who understands the consequences of having a low level, privileged
network proxying service on a computer. Although the `kube-proxy` executable supports a
`cleanup` function, this function is not an official feature and thus is only available
to use as-is.
-->
在下文中，你可以瞭解到 kube-proxy 各種實現方式的工作原理。
總的來說，你應該注意到，在運行 `kube-proxy` 時，
可能會修改內核級別的規則（例如，可能會創建 iptables 規則），
在某些情況下，這些規則直到重啓纔會被清理。
因此，運行 kube-proxy 這件事應該只由瞭解在計算機上使用低級別、特權網路代理服務會帶來的後果的管理員執行。
儘管 `kube-proxy` 可執行文件支持 `cleanup` 功能，但這個功能並不是官方特性，因此只能根據具體情況使用。

<!--
<a id="example"></a>
Some of the details in this reference refer to an example: the backend
{{< glossary_tooltip term_id="pod" text="Pods" >}} for a stateless
image-processing workloads, running with
three replicas. Those replicas are
fungible&mdash;frontends do not care which backend they use. While the actual Pods that
compose the backend set may change, the frontend clients should not need to be aware of that,
nor should they need to keep track of the set of backends themselves.
-->
<a id="example"></a>
本文中的一些細節會引用這樣一個例子：
運行了 3 個 {{< glossary_tooltip text="Pod" term_id="pod" >}}
副本的無狀態圖像處理後端工作負載。
這些副本是可互換的；前端不需要關心它們調用了哪個後端副本。
即使組成這一組後端程序的 Pod 實際上可能會發生變化，
前端客戶端不應該也沒必要知道，而且也不需要跟蹤這一組後端的狀態。

<!-- body -->

<!--
## Proxy modes
-->
## 代理模式 {#proxy-modes}

<!--
The kube-proxy starts up in different modes, which are determined by its configuration.

On Linux nodes, the available modes for kube-proxy are:

[`iptables`](#proxy-mode-iptables)
: A mode where the kube-proxy configures packet forwarding rules using iptables.

[`ipvs`](#proxy-mode-ipvs)
: a mode where the kube-proxy configures packet forwarding rules using ipvs.

[`nftables`](#proxy-mode-nftables)
: a mode where the kube-proxy configures packet forwarding rules using nftables.
-->
kube-proxy 會根據不同設定以不同的模式啓動。

在 Linux 節點上，kube-proxy 的可用模式是：

[`iptables`](#proxy-mode-iptables)
: kube-proxy 使用 iptables 設定數據包轉發規則的一種模式。

[`ipvs`](#proxy-mode-ipvs)
: kube-proxy 使用 ipvs 設定數據包轉發規則的一種模式。

[`nftables`](#proxy-mode-nftables)
: kube-proxy 使用 nftables 設定數據包轉發規則的一種模式。

<!--
There is only one mode available for kube-proxy on Windows:

[`kernelspace`](#proxy-mode-kernelspace)
: a mode where the kube-proxy configures packet forwarding rules in the Windows kernel
-->
Windows 上的 kube-proxy 只有一種模式可用：

[`kernelspace`](#proxy-mode-kernelspace)
: kube-proxy 在 Windows 內核中設定數據包轉發規則的一種模式。

<!--
### `iptables` proxy mode {#proxy-mode-iptables}

_This proxy mode is only available on Linux nodes._

In this mode, kube-proxy configures packet forwarding rules using the
iptables API of the kernel netfilter subsystem. For each endpoint, it
installs iptables rules which, by default, select a backend Pod at
random.
-->
### `iptables` 代理模式 {#proxy-mode-iptables}

**此代理模式僅適用於 Linux 節點。**

在這種模式下，kube-proxy 使用內核 netfilter 子系統的 iptables API 
設定數據包轉發規則。對於每個端點，kube-proxy 會添加 iptables 
規則，這些規則默認情況下會隨機選擇一個後端 Pod。

<!--
#### Example {#packet-processing-iptables}
-->
#### 示例 {#packet-processing-iptables}

<!--
As an example, consider the image processing application described [earlier](#example)
in the page.
When the backend Service is created, the Kubernetes control plane assigns a virtual
IP address, for example 10.0.0.1. For this example, assume that the
Service port is 1234.
All of the kube-proxy instances in the cluster observe the creation of the new
Service.
-->
例如，考慮本頁中[前面](#example)描述的圖像處理應用程序。
當創建後端 Service 時，Kubernetes 控制平面會分配一個虛擬 IP 地址，例如 10.0.0.1。
對於這個例子而言，假設 Service 端口是 1234。
叢集中的所有 kube-proxy 實例都會觀察到新 Service 的創建。

<!--
When kube-proxy on a node sees a new Service, it installs a series of iptables rules
which redirect from the virtual IP address to more iptables rules, defined per Service.
The per-Service rules link to further rules for each backend endpoint, and the per-
endpoint rules redirect traffic (using destination NAT) to the backends.
-->
當節點上的 kube-proxy 觀察到新 Service 時，它會添加一系列 iptables 規則，
這些規則從虛擬 IP 地址重定向到更多 iptables 規則，每個 Service 都定義了這些規則。
每個 Service 規則鏈接到每個後端端點的更多規則，
並且每個端點規則將流量重定向（使用目標 NAT）到後端。

<!--
When a client connects to the Service's virtual IP address the iptables rule kicks in.
A backend is chosen (either based on session affinity or randomly) and packets are
redirected to the backend without rewriting the client IP address.
-->
當客戶端連接到 Service 的虛擬 IP 地址時，iptables 規則會生效。
會選擇一個後端（基於會話親和性或隨機選擇），並將數據包重定向到後端，
無需重寫客戶端 IP 地址。

<!--
This same basic flow executes when traffic comes in through a `type: NodePort` Service, or
through a load-balancer, though in those cases the client IP address does get altered.
-->
當流量通過 `type: NodePort` Service 或負載均衡器進入時，也會執行相同的基本流程，
只是在這些情況下，客戶端 IP 地址會被更改。

<!--
#### Optimizing iptables mode performance

In iptables mode, kube-proxy creates a few iptables rules for every
Service, and a few iptables rules for each endpoint IP address. In
clusters with tens of thousands of Pods and Services, this means tens
of thousands of iptables rules, and kube-proxy may take a long time to update the rules
in the kernel when Services (or their EndpointSlices) change. You can adjust the syncing
behavior of kube-proxy via options in the
[`iptables` section](/docs/reference/config-api/kube-proxy-config.v1alpha1/#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPTablesConfiguration)
of the kube-proxy [configuration file](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
(which you specify via `kube-proxy --config <path>`):
-->
#### 優化 iptables 模式性能  {#optimizing-iptables-mode-performance}

在 iptables 模式下，kube-proxy 爲每個 Service 創建一些 iptables 規則，併爲每個端點
IP 地址創建一些 iptables 規則。在擁有數萬個 Pod 和 Service 的叢集中，這意味着數萬個
iptables 規則，當 Service（或其 EndpointSlice）發生變化時，kube-proxy
在更新內核中的規則時可能要用很長時間。你可以通過（`kube-proxy --config <path>` 指定的）
kube-proxy [設定文件](/zh-cn/docs/reference/config-api/kube-proxy-config.v1alpha1/)的
[`iptables` 章節](/zh-cn/docs/reference/config-api/kube-proxy-config.v1alpha1/#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPTablesConfiguration)中的選項來調整
kube-proxy 的同步行爲：

```yaml
...
iptables:
  minSyncPeriod: 1s
  syncPeriod: 30s
...
```

##### `minSyncPeriod`

<!--
The `minSyncPeriod` parameter sets the minimum duration between
attempts to resynchronize iptables rules with the kernel. If it is
`0s`, then kube-proxy will always immediately synchronize the rules
every time any Service or EndpointSlice changes. This works fine in very
small clusters, but it results in a lot of redundant work when lots of
things change in a small time period. For example, if you have a
Service backed by a {{< glossary_tooltip term_id="deployment" text="Deployment" >}}
with 100 pods, and you delete the
Deployment, then with `minSyncPeriod: 0s`, kube-proxy would end up
removing the Service's endpoints from the iptables rules one by one,
resulting in a total of 100 updates. With a larger `minSyncPeriod`, multiple
Pod deletion events would get aggregated together, so kube-proxy might
instead end up making, say, 5 updates, each removing 20 endpoints,
which will be much more efficient in terms of CPU, and result in the
full set of changes being synchronized faster.
-->
`minSyncPeriod` 參數設置嘗試同步 iptables 規則與內核之間的最短時長。
如果是 `0s`，那麼每次有任一 Service 或 EndpointSlice 發生變更時，kube-proxy 都會立即同步這些規則。
這種方式在較小的叢集中可以工作得很好，但如果在很短的時間內很多東西發生變更時，它會導致大量冗餘工作。
例如，如果你有一個由 {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
支持的 Service，共有 100 個 Pod，你刪除了這個 Deployment，
且設置了 `minSyncPeriod: 0s`，kube-proxy 最終會從 iptables 規則中逐個刪除 Service 的 Endpoint，
總共更新 100 次。使用較大的 `minSyncPeriod` 值時，多個 Pod 刪除事件將被聚合在一起，
因此 kube-proxy 最終可能會進行例如 5 次更新，每次移除 20 個端點，
這樣在 CPU 利用率方面更有效率，能夠更快地同步所有變更。

<!--
The larger the value of `minSyncPeriod`, the more work that can be
aggregated, but the downside is that each individual change may end up
waiting up to the full `minSyncPeriod` before being processed, meaning
that the iptables rules spend more time being out-of-sync with the
current API server state.
-->
`minSyncPeriod` 的值越大，可以聚合的工作越多，
但缺點是每個獨立的變更可能最終要等待整個 `minSyncPeriod` 週期後才能被處理，
這意味着 iptables 規則要用更多時間才能與當前的 API 伺服器狀態同步。

<!--
The default value of `1s` should work well in most clusters, but in very
large clusters it may be necessary to set it to a larger value.
Especially, if kube-proxy's `sync_proxy_rules_duration_seconds` metric
indicates an average time much larger than 1 second, then bumping up
`minSyncPeriod` may make updates more efficient.
-->
默認值 `1s` 適用於大多數叢集，在大型叢集中，可能需要將其設置爲更大的值。
（特別是，如果 kube-proxy 的 `sync_proxy_rules_duration_seconds` 指標表明平均時間遠大於 1 秒，
那麼提高 `minSyncPeriod` 可能會使更新更有效率。）

<!--
##### Updating legacy `minSyncPeriod` configuration {#minimize-iptables-restore}
-->
##### 更新原有的 `minSyncPeriod` 設定   {#minimize-iptables-restore}

<!--
Older versions of kube-proxy updated all the rules for all Services on
every sync; this led to performance issues (update lag) in large
clusters, and the recommended solution was to set a larger
`minSyncPeriod`. Since Kubernetes v1.28, the iptables mode of
kube-proxy uses a more minimal approach, only making updates where
Services or EndpointSlices have actually changed.
-->
舊版本的 kube-proxy 在每次同步時爲所有 Service 更新規則；
這在大型叢集中會造成性能問題（更新延遲），建議的解決方案是設置較大的 `minSyncPeriod`。
自 Kubernetes v1.28 開始，kube-proxy 的 iptables 模式採用了更精簡的方法，
只有在 Service 或 EndpointSlice 實際發生變化時纔會進行更新。

<!--
If you were previously overriding `minSyncPeriod`, you should try
removing that override and letting kube-proxy use the default value
(`1s`) or at least a smaller value than you were using before upgrading.
-->
如果你之前覆蓋了 `minSyncPeriod`，你應該嘗試刪除該覆蓋並讓 kube-proxy
使用默認值（`1s`）或至少比升級前使用的值小。

<!--
If you are not running kube-proxy from Kubernetes {{< skew currentVersion >}}, check
the behavior and associated advice for the version that you are actually running.
-->
如果你運行的不是 Kubernetes {{< skew currentVersion >}} 版本的 kube-proxy，
請檢查你實際運行的版本的行爲和相關建議。

##### `syncPeriod`

<!--
The `syncPeriod` parameter controls a handful of synchronization
operations that are not directly related to changes in individual
Services and EndpointSlices. In particular, it controls how quickly
kube-proxy notices if an external component has interfered with
kube-proxy's iptables rules. In large clusters, kube-proxy also only
performs certain cleanup operations once every `syncPeriod` to avoid
unnecessary work.
-->
`syncPeriod` 參數控制與單次 Service 和 EndpointSlice 的變更沒有直接關係的少數同步操作。
特別是，它控制 kube-proxy 在外部組件已干涉 kube-proxy 的 iptables 規則時通知的速度。
在大型叢集中，kube-proxy 也僅在每隔 `syncPeriod` 時長執行某些清理操作，以避免不必要的工作。

<!--
For the most part, increasing `syncPeriod` is not expected to have much
impact on performance, but in the past, it was sometimes useful to set
it to a very large value (eg, `1h`). This is no longer recommended,
and is likely to hurt functionality more than it improves performance.
-->
在大多數情況下，提高 `syncPeriod` 預計不會對性能產生太大影響，
但在過去，有時將其設置爲非常大的值（例如 `1h`）很有用。
現在不再推薦這種做法，因爲它對功能的破壞可能會超過對性能的改進。

<!--
### IPVS proxy mode {#proxy-mode-ipvs}

_This proxy mode is only available on Linux nodes._
-->
### IPVS 代理模式 {#proxy-mode-ipvs}

**此代理模式僅適用於 Linux 節點。**

<!--
In `ipvs` mode, kube-proxy uses the kernel IPVS and iptables APIs to
create rules to redirect traffic from Service IPs to endpoint IPs.
-->
在 `ipvs` 模式下，kube-proxy 使用內核 IPVS 和 iptables API
創建規則，將流量從 Service IP 重定向到端點 IP。

<!--
The IPVS proxy mode is based on netfilter hook function that is similar to
iptables mode, but uses a hash table as the underlying data structure and works
in the kernel space.
-->
IPVS 代理模式基於 netfilter 回調函數，類似於 iptables 模式，
但它使用哈希表作爲底層數據結構，在內核空間中生效。

{{< note >}}
<!--
The `ipvs` proxy mode was an experiment in providing a Linux
kube-proxy backend with better rule-synchronizing performance and
higher network-traffic throughput than the `iptables` mode. While it
succeeded in those goals, the kernel IPVS API turned out to be a bad
match for the Kubernetes Services API, and the `ipvs` backend was
never able to implement all of the edge cases of Kubernetes Service
functionality correctly. At some point in the future, it is expected
to be formally deprecated as a feature.
-->
作爲 Linux kube-proxy 的一種實驗性功能，`ipvs` 代理模式提供了比 `iptables`
模式更優的規則同步性能和更高的網路流量處理能力。
雖然它在這些目標上取得了成功，但內核 IPVS API 被證明不適合實現 Kubernetes Service API，
`ipvs` 後端從未能夠正確實現所有 Kubernetes Service 功能的邊緣情況。
預計在未來某個時刻，此特性將被正式棄用。

<!--
The `nftables` proxy mode (described below) is essentially a
replacement for both the `iptables` and `ipvs` modes, with better
performance than either of them, and is recommended as a replacement
for `ipvs`. If you are deploying onto Linux systems that are too old
to run the `nftables` proxy mode, you should also consider trying the
`iptables` mode rather than `ipvs`, since the performance of
`iptables` mode has improved greatly since the `ipvs` mode was first
introduced.
-->
下面描述的 `nftables` 代理模式實質上是 `iptables` 和 `ipvs` 模式的替代品，
性能優於兩者，建議作爲 `ipvs` 的替代。如果你要部署到過於陳舊而無法運行 `nftables`
代理模式的 Linux 系統上，你也應該考慮嘗試 `iptables` 模式而不是 `ipvs`，
因爲自從首次引入 `ipvs` 模式以來，`iptables` 模式的性能已經有了很大提升。
{{< /note >}}

<!--
IPVS provides more options for balancing traffic to backend Pods;
these are:
-->
IPVS 爲將流量均衡到後端 Pod 提供了更多選擇：

<!--
* `rr` (Round Robin): Traffic is equally distributed amongst the backing servers.

* `wrr` (Weighted Round Robin): Traffic is routed to the backing servers based on
  the weights of the servers. Servers with higher weights receive new connections
  and get more requests than servers with lower weights.

* `lc` (Least Connection): More traffic is assigned to servers with fewer active connections.
-->
* `rr`（輪詢）：流量被平均分發給後端伺服器。

* `wrr`（加權輪詢）：流量基於伺服器的權重被路由到後端伺服器。
  高權重的伺服器接收新的連接並處理比低權重伺服器更多的請求。

* `lc`（最少連接）：將更多流量分配給活躍連接數較少的伺服器。

<!--
* `wlc` (Weighted Least Connection): More traffic is routed to servers with fewer connections
  relative to their weights, that is, connections divided by weight.

* `lblc` (Locality based Least Connection): Traffic for the same IP address is sent to the
  same backing server if the server is not overloaded and available; otherwise the traffic
  is sent to servers with fewer connections, and keep it for future assignment.
-->
* `wlc`（加權最少連接）：將更多流量按照伺服器權重分配給連接數較少的伺服器，即基於連接數除以權重。

* `lblc`（基於地域的最少連接）：如果伺服器未超載且可用，則針對相同 IP 地址的流量被髮送到同一後端伺服器；
  否則，流量被髮送到連接較少的伺服器，並在未來的流量分配中保持這一分配決定。

<!--
* `lblcr` (Locality Based Least Connection with Replication): Traffic for the same IP
  address is sent to the server with least connections. If all the backing servers are
  overloaded, it picks up one with fewer connections and adds it to the target set.
  If the target set has not changed for the specified time, the server with the highest load
  is removed from the set, in order to avoid a high degree of replication.
-->
* `lblcr`（帶副本的基於地域的最少連接）：針對相同 IP 地址的流量被髮送到連接數最少的伺服器。
  如果所有後端伺服器都超載，則選擇連接較少的伺服器並將其添加到目標集中。
  如果目標集在指定時間內未發生變化，則從此集合中移除負載最高的伺服器，以避免副本的負載過高。

<!--
* `sh` (Source Hashing): Traffic is sent to a backing server by looking up a statically
  assigned hash table based on the source IP addresses.

* `dh` (Destination Hashing): Traffic is sent to a backing server by looking up a
  statically assigned hash table based on their destination addresses.
-->
* `sh`（源哈希）：通過查找基於源 IP 地址的靜態分配哈希表，將流量發送到某後端伺服器。

* `dh`（目標哈希）：通過查找基於目標地址的靜態分配哈希表，將流量發送到某後端伺服器。

<!--
* `sed` (Shortest Expected Delay): Traffic forwarded to a backing server with the shortest
  expected delay. The expected delay is `(C + 1) / U` if sent to a server, where `C` is
  the number of connections on the server and `U` is the fixed service rate (weight) of
  the server.

* `nq` (Never Queue): Traffic is sent to an idle server if there is one, instead of
  waiting for a fast one; if all servers are busy, the algorithm falls back to the `sed`
  behavior.
-->
* `sed`（最短預期延遲）：流量被轉發到具有最短預期延遲的後端伺服器。
  如果流量被髮送給伺服器，預期延遲爲 `(C + 1) / U`，其中 `C` 是伺服器上的連接數，
  `U` 是伺服器的固定服務速率（權重）。

* `nq`（永不排隊）：流量被髮送到一臺空閒伺服器（如果有的話），而不是等待一臺快速伺服器；
  如果所有伺服器都忙碌，算法將退回到 `sed` 行爲。

<!--
* `mh` (Maglev Hashing): Assigns incoming jobs based on
  [Google's Maglev hashing algorithm](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/44824.pdf),
  This scheduler has two flags: `mh-fallback`, which enables fallback to a different
  server if the selected server is unavailable, and `mh-port`, which adds the source port number to
  the hash computation. When using `mh`, kube-proxy always sets the `mh-port` flag and does not
  enable the `mh-fallback` flag.
  In proxy-mode=ipvs `mh` will work as source-hashing (`sh`), but with ports.
-->
* `mh`（Maglev Hashing）：基於 [Google 的 Maglev 哈希算法](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/44824.pdf)
  來分配接收的任務。此調度器有兩個標誌：
  `mh-fallback` 允許在選定的伺服器不可用時回退到另一臺伺服器；
  `mh-port` 將源端口號添加到哈希計算中。
  在使用 `mh` 時，`kube-proxy` 始終會設置 `mh-port` 標誌，但不會啓用 `mh-fallback` 標誌。
  在代理模式爲 ipvs 時，`mh` 的工作方式與源哈希（`sh`）類似，但會包含端口信息。

<!--
These scheduling algorithms are configured through the
[`ipvs.scheduler`](/docs/reference/config-api/kube-proxy-config.v1alpha1/#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPVSConfiguration)
field in the kube-proxy configuration.
-->
這些調度算法是通過 kube-proxy 設定中的
[ipvs.scheduler](/zh-cn/docs/reference/config-api/kube-proxy-config.v1alpha1/#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPVSConfiguration)
字段進行設定的。

{{< note >}}
<!--
To run kube-proxy in IPVS mode, you must make IPVS available on
the node before starting kube-proxy.

When kube-proxy starts in IPVS proxy mode, it verifies whether IPVS
kernel modules are available. If the IPVS kernel modules are not detected, then kube-proxy
exits with an error.
-->
要在 IPVS 模式下運行 kube-proxy，必須在啓動 kube-proxy 之前確保節點上的 IPVS 可用。

當 kube-proxy 以 IPVS 代理模式啓動時，它會驗證 IPVS 內核模塊是否可用。
如果未檢測到 IPVS 內核模塊，則 kube-proxy 會退出並報錯。
{{< /note >}}

<!--
{{< figure src="/images/docs/services-ipvs-overview.svg" title="Virtual IP address mechanism for Services, using IPVS mode" class="diagram-medium" >}}
-->
{{< figure src="/zh-cn/docs/images/services-ipvs-overview.svg" title="IPVS 模式下 Service 的虛擬 IP 地址機制" class="diagram-medium" >}}

<!--
### `nftables` proxy mode {#proxy-mode-nftables}

{{< feature-state feature_gate_name="NFTablesProxyMode" >}}

_This proxy mode is only available on Linux nodes, and requires kernel
5.13 or later._
-->
### `nftables` 代理模式 {#proxy-mode-nftables}

{{< feature-state feature_gate_name="NFTablesProxyMode" >}}

**此代理模式僅適用於 Linux 節點，並且需要 5.13 或更高的內核版本。**

<!--
In this mode, kube-proxy configures packet forwarding rules using the
nftables API of the kernel netfilter subsystem. For each endpoint, it
installs nftables rules which, by default, select a backend Pod at
random.
-->
在這種模式下，kube-proxy 使用內核 netfilter 子系統的 nftables API
設定數據包轉發規則。對於每個端點，它會添加 nftables
規則，這些規則默認情況下會隨機選擇一個後端 Pod。

<!--
The nftables API is the successor to the iptables API and is designed
to provide better performance and scalability than iptables. The
`nftables` proxy mode is able to process changes to service endpoints
faster and more efficiently than the `iptables` mode, and is also able
to more efficiently process packets in the kernel (though this only
becomes noticeable in clusters with tens of thousands of services).
-->
nftables API 是 iptables API 的後繼，旨在提供比 iptables 更好的性能和可擴展性。
`nftables` 代理模式能夠比 `iptables` 模式更快、更高效地處理 Service 端點的變化，
並且在內核中處理數據包的效率也更高（儘管這只有在擁有數萬個 Service 的叢集中才會比較明顯）。

<!--
As of Kubernetes {{< skew currentVersion >}}, the `nftables` mode is
still relatively new, and may not be compatible with all network
plugins; consult the documentation for your network plugin.
-->

在 Kubernetes {{< skew currentVersion >}} 中，`nftables`
模式仍然相對較新，可能還不兼容所有的網路插件；請查閱你的網路插件文檔。

<!--
#### Migrating from `iptables` mode to `nftables`

Users who want to switch from the default `iptables` mode to the
`nftables` mode should be aware that some features work slightly
differently the `nftables` mode:
-->
#### 從 `iptables` 模式到 `nftables` 模式的遷移 {#migrating-from-iptables-mode-to-nftables}

想要從默認的 `iptables` 模式切換到 `nftables` 模式的使用者應注意，在
`nftables` 模式下，一些特性的工作方式略有不同：

<!--
- **NodePort interfaces**: In `iptables` mode, by default,
  [NodePort services](/docs/concepts/services-networking/service/#type-nodeport)
  are reachable on all local IP addresses. This is usually not what
  users want, so the `nftables` mode defaults to
  `--nodeport-addresses primary`, meaning Services using `type: NodePort` are only
  reachable on the node's primary IPv4 and/or IPv6 addresses. You can
  override this by specifying an explicit value for that option:
  e.g., `--nodeport-addresses 0.0.0.0/0` to listen on all (local)
  IPv4 IPs.
-->
- **NodePort 接口**：在 `iptables` 模式下，默認情況下，
  [NodePort Service](/zh-cn/docs/concepts/services-networking/service/#type-nodeport) 可以在所有本地
  IP 地址上訪問。這通常不是使用者想要的，因此 `nftables` 模式默認使用 `--nodeport-addresses primary`，這意味着
  `type: NodePort` Service 只能通過節點上的主 IPv4 和/或 IPv6 地址進行訪問。
  你可以通過爲該選項指定一個明確的值來覆蓋此設置：例如，使用
  `--nodeport-addresses 0.0.0.0/0` 以監聽所有（本地）IPv4 IP。

<!--
- `type: NodePort` **Services on `127.0.0.1`**: In `iptables` mode, if the
  `--nodeport-addresses` range includes `127.0.0.1` (and the option
  `--iptables-localhost-nodeports false` option is not passed), then
  Services of `type: NodePort` are reachable even on "localhost" (`127.0.0.1`).
  In `nftables` mode (and `ipvs` mode), this will not work. If you
  are not sure if you are depending on this functionality, you can
  check kube-proxy's
  `iptables_localhost_nodeports_accepted_packets_total` metric; if it
  is non-0, that means that some client has connected to a `type: NodePort`
  Service via localhost/loopback.
-->
- **`127.0.0.1` 上的 `type: NodePort` Service**：在 `iptables` 模式下，如果
  `--nodeport-addresses` 範圍包括 `127.0.0.1`（且未傳遞 `--iptables-localhost-nodeports false` 選項），
  則 `type: NodePort` Service 甚至可以在 "localhost" (`127.0.0.1`) 上訪問。
  在 `nftables` 模式（和 `ipvs` 模式）下，這將不起作用。如果你不確定是否依賴此功能，
  可以檢查 kube-proxy 的 `iptables_localhost_nodeports_accepted_packets_total` 指標；
  如果該值非 0，則表示某些客戶端已通過本地主機或本地迴路連接到 `type: NodePort` Service。

<!--
- **NodePort interaction with firewalls**: The `iptables` mode of
  kube-proxy tries to be compatible with overly-aggressive firewalls;
  for each `type: NodePort` service, it will add rules to accept inbound
  traffic on that port, in case that traffic would otherwise be
  blocked by a firewall. This approach will not work with firewalls
  based on nftables, so kube-proxy's `nftables` mode does not do
  anything here; if you have a local firewall, you must ensure that
  it is properly configured to allow Kubernetes traffic through
  (e.g., by allowing inbound traffic on the entire NodePort range).
-->
- **NodePort 與防火牆的交互**：kube-proxy 的 `iptables` 模式嘗試與過於激進的防火牆兼容；
  對於每個 `type: NodePort` Service，它會添加規則以接受該端口的入站流量，以防該流量被防火牆阻止。
  這種方法不適用於基於 nftables 的防火牆，因此 kube-proxy 的 `nftables` 模式在這裏不會做任何事情；
  如果你有本地防火牆，必須確保其設定正確以允許 Kubernetes 流量通過（例如，允許整個 NodePort 範圍的入站流量）。

<!--
- **Conntrack bug workarounds**: Linux kernels prior to 6.1 have a
  bug that can result in long-lived TCP connections to service IPs
  being closed with the error "Connection reset by peer". The
  `iptables` mode of kube-proxy installs a workaround for this bug,
  but this workaround was later found to cause other problems in some
  clusters. The `nftables` mode does not install any workaround by
  default, but you can check kube-proxy's
  `iptables_ct_state_invalid_dropped_packets_total` metric to see if
  your cluster is depending on the workaround, and if so, you can run
  kube-proxy with the option `--conntrack-tcp-be-liberal` to work
  around the problem in `nftables` mode.
-->
- **Conntrack BUG 規避**：6.1 之前的 Linux 內核存在一個 BUG，可能導致與 Service IP 的長時間
   TCP 連接被關閉，並出現 “Connection reset by peer（對方重置連接）”的錯誤。kube-proxy 的 `iptables`
  模式爲此錯誤配備了一個修復程序，但後來發現該修復程序在某些叢集中會導致其他問題。
  `nftables` 模式默認不安裝任何修復程序，但你可以檢查 kube-proxy 的
  `iptables_ct_state_invalid_dropped_packets_total`
  指標，看看你的叢集是否依賴於該修復程序，如果是，你可以使用 `--conntrack-tcp-be-liberal`
  選項運行 kube-proxy，以在 `nftables` 模式下解決該問題。

<!--
### `kernelspace` proxy mode {#proxy-mode-kernelspace}

_This proxy mode is only available on Windows nodes._
-->
### `kernelspace` 代理模式   {#proxy-mode-kernelspace}

**此代理模式僅適用於 Windows 節點。**

<!--
The kube-proxy configures packet filtering rules in the Windows _Virtual Filtering Platform_ (VFP),
an extension to Windows vSwitch. These rules process encapsulated packets within the node-level
virtual networks, and rewrite packets so that the destination IP address (and layer 2 information)
is correct for getting the packet routed to the correct destination.
The Windows VFP is analogous to tools such as Linux `nftables` or `iptables`. The Windows VFP extends
the _Hyper-V Switch_, which was initially implemented to support virtual machine networking.
-->
kube-proxy 在 Windows **虛擬過濾平臺**（VFP）（Windows vSwitch 的擴展）中設定數據包過濾規則。
這些規則處理節點級虛擬網路中的封裝數據包，並重寫數據包，使目標 IP 地址（和第 2 層信息）正確，
以便將數據包路由到正確的目的地。Windows VFP 類似於 Linux `nftables` 或 `iptables` 等工具。
Windows VFP 是最初爲支持虛擬機網路而實現的 **Hyper-V Switch** 的擴展。

<!--
When a Pod on a node sends traffic to a virtual IP address, and the kube-proxy selects a Pod on
a different node as the load balancing target, the `kernelspace` proxy mode rewrites that packet
to be destined to the target backend Pod. The Windows _Host Networking Service_ (HNS) ensures that
packet rewriting rules are configured so that the return traffic appears to come from the virtual
IP address and not the specific backend Pod.
-->
當節點上的 Pod 將流量發送到某虛擬 IP 地址，且 kube-proxy 選擇不同節點上的 Pod
作爲負載均衡目標時，`kernelspace` 代理模式會重寫該數據包以將其發送到對應目標後端 Pod。
Windows 主機網路服務（HSN）會設定數據包重寫規則，確保返回流量看起來來自虛擬 IP 地址，
而不是特定的後端 Pod。

<!--
#### Direct server return for `kernelspace` mode {#windows-direct-server-return}
-->
#### `kernelspace` 模式的 Direct Server Return（DSR）    {#windows-direct-server-return}

{{< feature-state feature_gate_name="WinDSR" >}}

<!--
As an alternative to the basic operation, a node that hosts the backend Pod for a Service can
apply the packet rewriting directly, rather than placing this burden on the node where the client
Pod is running. This is called _direct server return_.
-->
作爲基本操作的替代方案，託管服務後端 Pod 的節點可以直接應用數據包重寫，
而不用將此工作交給運行客戶端 Pod 的節點來執行。這稱爲 **Direct Server Return（DSR）**。

<!--
To use this, you must run kube-proxy with the `--enable-dsr` command line argument **and**
enable the `WinDSR` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).

Direct server return also optimizes the case for Pod return traffic even when both Pods
are running on the same node.
-->
要使用這種技術，你必須使用 `--enable-dsr` 命令列參數運行 kube-proxy **並**啓用
`WinDSR` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

即使兩個 Pod 在同一節點上運行，DSR 也可優化 Pod 的返回流量。

<!--
## Session affinity
-->
## 會話親和性    {#session-affinity}

<!--
In these proxy models, the traffic bound for the Service's IP:Port is
proxied to an appropriate backend without the clients knowing anything
about Kubernetes or Services or Pods.
-->
在這些代理模型中，綁定到 Service IP:Port 的流量被代理到合適的後端，
客戶端不需要知道任何關於 Kubernetes、Service 或 Pod 的信息。

<!--
If you want to make sure that connections from a particular client
are passed to the same Pod each time, you can select the session affinity based
on the client's IP addresses by setting `.spec.sessionAffinity` to `ClientIP`
for a Service (the default is `None`).
-->
如果要確保來自特定客戶端的連接每次都傳遞給同一個 Pod，
你可以通過設置 Service 的 `.spec.sessionAffinity` 爲 `ClientIP`
來設置基於客戶端 IP 地址的會話親和性（默認爲 `None`）。

<!--
### Session stickiness timeout
-->
### 會話粘性超時     {#session-stickiness-timeout}

<!--
You can also set the maximum session sticky time by setting
`.spec.sessionAffinityConfig.clientIP.timeoutSeconds` appropriately for a Service.
(the default value is 10800, which works out to be 3 hours).
-->
你還可以通過設置 Service 的 `.spec.sessionAffinityConfig.clientIP.timeoutSeconds`
來設置最大會話粘性時間（默認值爲 10800，即 3 小時）。

{{< note >}}
<!--
On Windows, setting the maximum session sticky time for Services is not supported.
-->
在 Windows 上不支持爲 Service 設置最大會話粘性時間。
{{< /note >}}

<!--
## IP address assignment to Services
-->
## 將 IP 地址分配給 Service  {#ip-address-assignment-to-services}

<!--
Unlike Pod IP addresses, which actually route to a fixed destination,
Service IPs are not actually answered by a single host. Instead, kube-proxy
uses packet processing logic (such as Linux iptables) to define _virtual_ IP
addresses which are transparently redirected as needed.
-->
與實際路由到固定目標的 Pod IP 地址不同，Service IP 實際上不是由單個主機回答的。
相反，kube-proxy 使用數據包處理邏輯（例如 Linux 的 iptables）
來定義**虛擬** IP 地址，這些地址會按需被透明重定向。

<!--
When clients connect to the VIP, their traffic is automatically transported to an
appropriate endpoint. The environment variables and DNS for Services are actually
populated in terms of the Service's virtual IP address (and port).
-->
當客戶端連接到 VIP 時，其流量會自動傳輸到適當的端點。
實際上，Service 的環境變量和 DNS 是根據 Service 的虛擬 IP 地址（和端口）填充的。

<!--
### Avoiding collisions
-->
### 避免衝突      {#avoiding-collisions}

<!--
One of the primary philosophies of Kubernetes is that you should not be
exposed to situations that could cause your actions to fail through no fault
of your own. For the design of the Service resource, this means not making
you choose your own IP address if that choice might collide with
someone else's choice.  That is an isolation failure.
-->
Kubernetes 的主要哲學之一是，
你不應需要在完全不是你的問題的情況下面對可能導致你的操作失敗的情形。
對於 Service 資源的設計，也就是如果你選擇的端口號可能與其他人的選擇衝突，
就不應該讓你自己選擇 IP 地址。這是一種失敗隔離。

<!--
In order to allow you to choose an IP address for your Services, we must
ensure that no two Services can collide. Kubernetes does that by allocating each
Service its own IP address from within the `service-cluster-ip-range`
CIDR range that is configured for the {{< glossary_tooltip term_id="kube-apiserver" text="API Server" >}}.
-->
爲了允許你爲 Service 選擇 IP 地址，我們必須確保沒有任何兩個 Service 會發生衝突。
Kubernetes 通過從爲 {{< glossary_tooltip text="API 伺服器" term_id="kube-apiserver" >}}設定的
`service-cluster-ip-range` CIDR 範圍內爲每個 Service 分配自己的 IP 地址來實現這一點。

<!--
### IP address allocation tracking

To ensure each Service receives a unique IP address, an internal allocator atomically
updates a global allocation map in {{< glossary_tooltip term_id="etcd" >}}
prior to creating each Service. The map object must exist in the registry for
Services to get IP address assignments, otherwise creations will
fail with a message indicating an IP address could not be allocated.
-->
### IP 地址分配追蹤 {#ip-address-allocation-tracking}

爲了確保每個 Service 都獲得唯一的 IP 地址，內部分配器在創建每個 Service
之前更新 {{< glossary_tooltip term_id="etcd" >}} 中的全局分配映射，這種更新操作具有原子性。
映射對象必須存在於數據庫中，這樣 Service 才能獲得 IP 地址分配，
否則創建將失敗，並顯示無法分配 IP 地址。

<!--
In the control plane, a background controller is responsible for creating that
map (needed to support migrating from older versions of Kubernetes that used
in-memory locking). Kubernetes also uses controllers to check for invalid
assignments (for example: due to administrator intervention) and for cleaning up allocated
IP addresses that are no longer used by any Services.
-->
在控制平面中，後臺控制器負責創建該映射（從使用內存鎖定的舊版本的 Kubernetes 遷移時需要這一映射）。
Kubernetes 還使用控制器來檢查無效的分配（例如，因管理員干預而導致無效分配）
以及清理已分配但沒有 Service 使用的 IP 地址。

<!--
#### IP address allocation tracking using the Kubernetes API {#ip-address-objects}
-->
#### 使用 Kubernetes API 跟蹤 IP 地址分配 {#ip-address-objects}

{{< feature-state feature_gate_name="MultiCIDRServiceAllocator" >}}

<!--
The control plane replaces the existing etcd allocator with a revised implementation
that uses IPAddress and ServiceCIDR objects instead of an internal global allocation map.
Each cluster IP address associated to a Service then references an IPAddress object.
-->
控制平面用一個改進後的實現替換現有的 etcd 分配器，使用 IPAddress 和 ServiceCIDR
對象而不是內部的全局分配映射。與某 Service 關聯的每個 ClusterIP 地址將有一個對應的
IPAddress 對象。

<!--
Enabling the feature gate also replaces a background controller with an alternative
that handles the IPAddress objects and supports migration from the old allocator model.
Kubernetes {{< skew currentVersion >}} does not support migrating from IPAddress
objects to the internal allocation map.
-->
啓用該特性門控還會用替代實現將後臺控制器替換，來處理 IPAddress 對象並支持從舊的分配器模型遷移。
Kubernetes {{< skew currentVersion >}} 不支持從 IPAddress 對象遷移到內部分配映射。

<!--
One of the main benefits of the revised allocator is that it removes the size limitations
for the IP address range that can be used for the cluster IP address of Services.
With `MultiCIDRServiceAllocator` enabled, there are no limitations for IPv4, and for IPv6
you can use IP address netmasks that are a /64 or smaller (as opposed to /108 with the
legacy implementation).
-->
改進後的分配器的主要優點之一是它取消了對可用於 Service 的叢集 IP 地址的範圍大小限制。
啓用 `MultiCIDRServiceAllocator` 後，對 IPv4 沒有大小限制，而對於
IPv6，你可以使用等於或小於 /64 的 IP 地址子網掩碼（與舊實現中的 /108 相比）。

<!--
Making IP address allocations available via the API means that you as a cluster administrator
can allow users to inspect the IP addresses assigned to their Services.
Kubernetes extensions, such as the [Gateway API](/docs/concepts/services-networking/gateway/),
can use the IPAddress API to extend Kubernetes' inherent networking capabilities.
-->
通過 API 提供 IP 地址分配，意味着作爲叢集管理員，你可以允許使用者檢查分配給他們的 Service 的 IP 地址。
Kubernetes 擴展（例如 [Gateway API](/zh-cn/docs/concepts/services-networking/gateway/)）
可以使用 IPAddress API 來擴展 Kubernetes 的固有網路功能。

<!--
Here is a brief example of a user querying for IP addresses:
-->
以下是使用者查詢 IP 地址的簡短示例：

```shell
kubectl get services
```

```
NAME         TYPE        CLUSTER-IP        EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   2001:db8:1:2::1   <none>        443/TCP   3d1h
```

```shell
kubectl get ipaddresses
```

```
NAME              PARENTREF
2001:db8:1:2::1   services/default/kubernetes
2001:db8:1:2::a   services/kube-system/kube-dns
```
<!--
Kubernetes also allow users to dynamically define the available IP ranges for Services using
ServiceCIDR objects. During bootstrap, a default ServiceCIDR object named `kubernetes` is created
from the value of the `--service-cluster-ip-range` command line argument to kube-apiserver:
-->
Kubernetes 還允許使用者使用 ServiceCIDR 對象動態定義 Service 的可用 IP 範圍。
在引導過程中，叢集會根據 kube-apiserver 的 `--service-cluster-ip-range`
命令列參數的值創建一個名爲 `kubernetes` 的默認 ServiceCIDR 對象：

```shell
kubectl get servicecidrs
```

```
NAME         CIDRS         AGE
kubernetes   10.96.0.0/28  17m
```

<!--
Users can create or delete new ServiceCIDR objects to manage the available IP ranges for Services:
-->
使用者可以創建或刪除新的 ServiceCIDR 對象來管理 Service 的可用 IP 範圍：

```shell
cat <<'EOF' | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: ServiceCIDR
metadata:
  name: newservicecidr
spec:
  cidrs:
  - 10.96.0.0/24
EOF
```

```
servicecidr.networking.k8s.io/newcidr1 created
```

```shell
kubectl get servicecidrs
```

```
NAME             CIDRS         AGE
kubernetes       10.96.0.0/28  17m
newservicecidr   10.96.0.0/24  7m
```

<!--
Distributions or administrators of Kubernetes clusters may want to control that
new Service CIDRs added to the cluster does not overlap with other networks on
the cluster, that only belong to a specific range of IPs or just simple retain
the existing behavior of only having one ServiceCIDR per cluster.  An example of
a Validation Admission Policy to achieve this is:
-->
Kubernetes 發行版或叢集管理員可能希望控制叢集中新增的 Service CIDR，確保其不會與叢集中的其他網路發生衝突，
只屬於特定的 IP 範圍，或只是簡單地保留每個叢集僅使用一個 ServiceCIDR 的現有行爲。
爲實現這一目標，可以使用如下示例的驗證准入策略：

```yaml
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "servicecidrs-default"
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   ["networking.k8s.io"]
      apiVersions: ["v1","v1beta1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["servicecidrs"]
  matchConditions:
  - name: 'exclude-default-servicecidr'
    expression: "object.metadata.name != 'kubernetes'"
  variables:
  - name: allowed
    expression: "['10.96.0.0/16','2001:db8::/64']"
  validations:
  - expression: "object.spec.cidrs.all(i , variables.allowed.exists(j , cidr(j).containsCIDR(i)))"
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "servicecidrs-binding"
spec:
  policyName: "servicecidrs-default"
  validationActions: [Deny,Audit]
---
```

<!--
### IP address ranges for Service virtual IP addresses {#service-ip-static-sub-range}
-->
### Service 虛擬 IP 地址的地址段 {#service-ip-static-sub-range}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!--
Kubernetes divides the `ClusterIP` range into two bands, based on
the size of the configured `service-cluster-ip-range` by using the following formula
`min(max(16, cidrSize / 16), 256)`. That formula means the result is _never less than 16 or
more than 256, with a graduated step function between them_.
-->
Kubernetes 根據設定的 `service-cluster-ip-range` 的大小使用公式
`min(max(16, cidrSize / 16), 256)` 將 `ClusterIP` 範圍分爲兩段。
該公式意味着結果**介於 16 和 256 之間，並在上下界之間存在漸進階梯函數的分配**。

<!--
Kubernetes prefers to allocate dynamic IP addresses to Services by choosing from the upper band,
which means that if you want to assign a specific IP address to a `type: ClusterIP`
Service, you should manually assign an IP address from the **lower** band. That approach
reduces the risk of a conflict over allocation.
-->
Kubernetes 優先通過從高段中選擇來爲 Service 分配動態 IP 地址，
這意味着如果要將特定 IP 地址分配給 `type: ClusterIP` Service，
則應手動從**低**段中分配 IP 地址。該方法降低了分配導致衝突的風險。

<!--
## Traffic policies
-->
## 流量策略 {#traffic-policies}

<!--
You can set the `.spec.internalTrafficPolicy` and `.spec.externalTrafficPolicy` fields
to control how Kubernetes routes traffic to healthy (“ready”) backends.
-->
你可以設置 `.spec.internalTrafficPolicy` 和 `.spec.externalTrafficPolicy`
字段來控制 Kubernetes 如何將流量路由到健康（“就緒”）的後端。

<!--
### Internal traffic policy
-->
### 內部流量策略 {#internal-traffic-policy}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!--
You can set the `.spec.internalTrafficPolicy` field to control how traffic from
internal sources is routed. Valid values are `Cluster` and `Local`. Set the field to
`Cluster` to route internal traffic to all ready endpoints and `Local` to only route
to ready node-local endpoints. If the traffic policy is `Local` and there are no
node-local endpoints, traffic is dropped by kube-proxy.
-->
你可以設置 `.spec.internalTrafficPolicy` 字段來控制來自內部源的流量如何被路由。
有效值爲 `Cluster` 和 `Local`。
將字段設置爲 `Cluster` 會將內部流量路由到所有準備就緒的端點，
將字段設置爲 `Local` 僅會將流量路由到本地節點準備就緒的端點。
如果流量策略爲 `Local` 但沒有本地節點端點，那麼 kube-proxy 會丟棄該流量。

<!--
### External traffic policy
-->
### 外部流量策略 {#external-traffic-policy}

<!--
You can set the `.spec.externalTrafficPolicy` field to control how traffic from
external sources is routed. Valid values are `Cluster` and `Local`. Set the field
to `Cluster` to route external traffic to all ready endpoints and `Local` to only
route to ready node-local endpoints. If the traffic policy is `Local` and there
are no node-local endpoints, the kube-proxy does not forward any traffic for the
relevant Service.
-->
你可以設置 `.spec.externalTrafficPolicy` 字段來控制從外部源路由的流量。
有效值爲 `Cluster` 和 `Local`。
將字段設置爲 `Cluster` 會將外部流量路由到所有準備就緒的端點，
將字段設置爲 `Local` 僅會將流量路由到本地節點上準備就緒的端點。
如果流量策略爲 `Local` 並且沒有本地節點端點，
那麼 kube-proxy 不會轉發與相關 Service 相關的任何流量。

<!--
If `Cluster` is specified, all nodes are eligible load balancing targets _as long as_
the node is not being deleted and kube-proxy is healthy. In this mode: load balancer
health checks are configured to target the service proxy's readiness port and path.
In the case of kube-proxy this evaluates to: `${NODE_IP}:10256/healthz`. kube-proxy
will return either an HTTP code 200 or 503. kube-proxy's load balancer health check
endpoint returns 200 if:
-->
如果指定了 `Cluster`，則所有節點都可以作爲負載均衡目標，**只要**節點沒有被刪除且
kube-proxy 是健康的。在這種模式下：負載均衡器健康檢查被設定爲針對服務代理的就緒端口和路徑。對於
kube-proxy，這個健康檢查端點爲：`${NODE_IP}:10256/healthz`。kube-proxy 將返回 HTTP
狀態碼 200 或 503。如果滿足以下條件，kube-proxy 的負載均衡器健康檢查端點將返回 200：

<!--
1. kube-proxy is healthy, meaning:

   it's able to progress programming the network and isn't timing out while doing
   so (the timeout is defined to be: **2 × `iptables.syncPeriod`**); and

1. the node is not being deleted (there is no deletion timestamp set for the Node).
-->
1. kube-proxy 是健康的，意味着：

   它能夠繼續進行網路編程，並且在此過程中不會超時（超時時間定義爲：**2 × `iptables.syncPeriod`**）；並且

2. 節點沒有被刪除（Node 對象上沒有設置刪除時間戳）。

<!--
kube-proxy returns 503 and marks the node as not
eligible when it's being deleted because it supports connection
draining for terminating nodes. A couple of important things occur from the point
of view of a Kubernetes-managed load balancer when a node _is being_ / _is_ deleted.
-->
kube-proxy 在節點被刪除時返回 503 並將節點標記爲不符合條件的原因在於
kube-proxy 對處於終止過程中的節點支持連接騰空。從 Kubernetes 管理的負載均衡器的角度來看，
當節點**正在**/ **已**被刪除時，會發生一些重要的事情。

<!--
While deleting:

* kube-proxy will start failing its readiness probe and essentially mark the
  node as not eligible for load balancer traffic. The load balancer health
  check failing causes load balancers which support connection draining to
  allow existing connections to terminate, and block new connections from
  establishing.
-->
當節點被刪除時：

* kube-proxy 的就緒探針將開始失敗，並將該節點標記爲不勝任接收負載均衡器流量。
  負載均衡器健康檢查失敗會導致支持連接排空的負載均衡器允許現有連接終止，並阻止新連接建立。

<!--
When deleted:

* The service controller in the Kubernetes cloud controller manager removes the
  node from the referenced set of eligible targets. Removing any instance from
  the load balancer's set of backend targets immediately terminates all
  connections. This is also the reason kube-proxy first fails the health check
  while the node is deleting.
-->
當節點被刪除後：

* Kubernetes 雲控制器管理器中的服務控制器會將節點從所引用的候選目標集中移除。
  從負載均衡器的後端目標集中移除任何實例會立即終止所有連接。
  這也是 kube-proxy 在節點刪除過程中首先使健康檢查失敗的原因。

<!--
It's important to note for Kubernetes vendors that if any vendor configures the
kube-proxy readiness probe as a liveness probe: that kube-proxy will start
restarting continuously when a node is deleting until it has been fully deleted.
kube-proxy exposes a `/livez` path which, as opposed to the `/healthz` one, does
**not** consider the Node's deleting state and only its progress programming the
network. `/livez` is therefore the recommended path for anyone looking to define
a livenessProbe for kube-proxy.
-->
需要注意的是，對於 Kubernetes 供應商，如果任何供應商將
kube-proxy 的就緒探針設定爲存活探針：當節點正在刪除直到完全刪除時，kube-proxy
將開始不斷重啓。kube-proxy 公開了一個 `/livez` 路徑，與 `/healthz` 路徑不同，
`/livez` 路徑**不**考慮節點的刪除狀態，僅考慮其網路編程進度。因此，對於任何希望爲
 kube-proxy 定義存活探針的人來說，推薦使用 `/livez` 路徑。

<!--
Users deploying kube-proxy can inspect both the readiness / liveness state by
evaluating the metrics: `proxy_livez_total` / `proxy_healthz_total`. Both
metrics publish two series, one with the 200 label and one with the 503 one.
-->
部署 kube-proxy 的使用者可以通過評估指標 `proxy_livez_total` / `proxy_healthz_total`
來檢查就緒/存活狀態。這兩個指標都發布了兩個序列，一個帶有 200 標籤，另一個帶有 503 標籤。

<!--
For `Local` Services: kube-proxy will return 200 if

1. kube-proxy is healthy/ready, and
1. has a local endpoint on the node in question.

Node deletion does **not** have an impact on kube-proxy's return
code for what concerns load balancer health checks. The reason for this is:
deleting nodes could end up causing an ingress outage should all endpoints
simultaneously be running on said nodes.
-->
對於 `Local` Service：如果滿足以下條件，kube-proxy 將返回 200：

1. kube-proxy 是健康/就緒的，並且
2. 在相關節點上有一個本地端點。

對於負載均衡器健康檢查而言，節點刪除**不會**對 kube-proxy
的返回代碼產生影響。原因是：如果所有端點同時在上述節點上運行，則刪除節點最終可能會導致入站流量中斷。

<!--
The Kubernetes project recommends that cloud provider integration code
configures load balancer health checks that target the service proxy's healthz
port. If you are using or implementing your own virtual IP implementation,
that people can use instead of kube-proxy, you should set up a similar health
checking port with logic that matches the kube-proxy implementation.
-->
Kubernetes 項目建議雲提供商集成代碼設定負載均衡器健康檢查，以針對服務代理的 healthz 端口。
如果你正在使用或實現自己的虛擬 IP 實現，供人們使用它替代 kube-proxy，你應該設置一個類似的健康檢查端口，
其邏輯應與 kube-proxy 實現相匹配。

<!--
### Traffic to terminating endpoints
-->
### 流向正終止的端點的流量  {#traffic-to-terminating-endpoints}

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

<!--
If the `ProxyTerminatingEndpoints`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled in kube-proxy and the traffic policy is `Local`, that node's
kube-proxy uses a more complicated algorithm to select endpoints for a Service.
With the feature enabled, kube-proxy checks if the node
has local endpoints and whether or not all the local endpoints are marked as terminating.
If there are local endpoints and **all** of them are terminating, then kube-proxy
will forward traffic to those terminating endpoints. Otherwise, kube-proxy will always
prefer forwarding traffic to endpoints that are not terminating.
-->
如果爲 kube-proxy 啓用了 `ProxyTerminatingEndpoints`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)且流量策略爲 `Local`，
則節點的 kube-proxy 將使用更復雜的算法爲 Service 選擇端點。
啓用此特性時，kube-proxy 會檢查節點是否具有本地端點以及是否所有本地端點都標記爲正在終止過程中。
如果有本地端點並且**所有**本地端點都被標記爲處於終止過程中，
則 kube-proxy 會將轉發流量到這些正在終止過程中的端點。
否則，kube-proxy 會始終選擇將流量轉發到並未處於終止過程中的端點。

<!--
This forwarding behavior for terminating endpoints exists to allow `NodePort` and `LoadBalancer`
Services to gracefully drain connections when using `externalTrafficPolicy: Local`.

As a deployment goes through a rolling update, nodes backing a load balancer may transition from
N to 0 replicas of that deployment. In some cases, external load balancers can send traffic to
a node with 0 replicas in between health check probes. Routing traffic to terminating endpoints
ensures that Nodes that are scaling down Pods can gracefully receive and drain traffic to
those terminating Pods. By the time the Pod completes termination, the external load balancer
should have seen the node's health check failing and fully removed the node from the backend
pool.
-->
這種對處於終止過程中的端點的轉發行爲使得 `NodePort` 和 `LoadBalancer` Service
能有條不紊地騰空設置了 `externalTrafficPolicy: Local` 時的連接。

當一個 Deployment 被滾動更新時，處於負載均衡器後端的節點可能會將該 Deployment 的 N 個副本縮減到
0 個副本。在某些情況下，外部負載均衡器可能在兩次執行健康檢查探針之間將流量發送到具有 0 個副本的節點。
將流量路由到處於終止過程中的端點可確保正在縮減 Pod 的節點能夠正常接收流量，
並逐漸降低指向那些處於終止過程中的 Pod 的流量。
到 Pod 完成終止時，外部負載均衡器應該已經發現節點的健康檢查失敗並從後端池中完全移除該節點。

<!--
## Traffic Distribution
-->
## 流量分發 {#traffic-distribution}

{{< feature-state feature_gate_name="ServiceTrafficDistribution" >}}

<!--
The `spec.trafficDistribution` field within a Kubernetes Service allows you to
express preferences for how traffic should be routed to Service endpoints.

`PreferClose`
: This prioritizes sending traffic to endpoints in the same zone as the client.
  The EndpointSlice controller updates EndpointSlices with `hints` to
  communicate this preference, which kube-proxy then uses for routing decisions.
  If a client's zone does not have any available endpoints, traffic will be
  routed cluster-wide for that client.
-->
Kubernetes Service 中的 `spec.trafficDistribution` 字段允許你表達對流量如何路由到 Service 端點的偏好。

`PreferClose`  
: 這意味着優先將流量發送到與客戶端位於同一區域的端點。
  EndpointSlice 控制器使用 `hints` 來更新 EndpointSlices 以傳達此偏好，
  之後，kube-proxy 會使用這些提示進行路由決策。如果客戶端的區域沒有可用的端點，
  則流量將在整個叢集範圍內路由。

{{< feature-state feature_gate_name="PreferSameTrafficDistribution" >}}

<!--
In Kubernetes {{< skew currentVersion >}}, two additional values are
available (unless the `PreferSameTrafficDistribution` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) is
disabled):
-->
當啓用 `PreferSameTrafficDistribution`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)時，還可以使用兩個額外的取值：

在 Kubernetes {{< skew currentVersion >}} 中，除非禁用了
`PreferSameTrafficDistribution` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
否則將提供另外兩個值：

<!--
`PreferSameZone`
: This means the same thing as `PreferClose`, but is more explicit. (Originally,
  the intention was that `PreferClose` might later include functionality other
  than just "prefer same zone", but this is no longer planned. In the future,
  `PreferSameZone` will be the recommended value to use for this functionality,
  and `PreferClose` will be considered a deprecated alias for it.)
-->
`PreferSameZone`  
: 這意味着與 `PreferClose` 相同，但表達更爲明確。
  （最初，`PreferClose` 被設想爲未來可能包含除“優先同一區域”之外的其他功能，但這一計劃已被取消。
  未來，`PreferSameZone` 將成爲實現此類功能的推薦取值，而 `PreferClose` 將被視爲其棄用的別名。）

<!--
`PreferSameNode`
: This prioritizes sending traffic to endpoints on the same node as the client.
  As with `PreferClose`/`PreferSameZone`, the EndpointSlice controller updates
  EndpointSlices with `hints` indicating that a slice should be used for a
  particular node. If a client's node does not have any available endpoints,
  then the service proxy will fall back to "same zone" behavior, or cluster-wide
  if there are no same-zone endpoints either.
-->
`PreferSameNode`  
: 這意味着優先將流量發送到與客戶端位於同一節點上的端點。
  與 `PreferClose`/`PreferSameZone` 一樣，EndpointSlice 控制器會更新 EndpointSlice，
  添加 `hints` 表明某個切片應被用於特定節點。如果某客戶端所在節點沒有可用的端點，
  服務代理將回退至“同一區域”行爲；如果同一區域也沒有可用端點，則回退爲叢集範圍內路由。

<!--
In the absence of any value for `trafficDistribution`, the default strategy is
to distribute traffic evenly to all endpoints in the cluster.
-->
如果 `trafficDistribution` 沒有任何值，默認策略是將流量均勻分發給叢集中的所有端點。

<!--
### Comparison with `service.kubernetes.io/topology-mode: Auto`

The `trafficDistribution` field with `PreferClose`/`PreferSameZone`, and the older "Topology-Aware
Routing" feature using the `service.kubernetes.io/topology-mode: Auto`
annotation both aim to prioritize same-zone traffic. However, there is a key
difference in their approaches:
-->
### 與 `service.kubernetes.io/topology-mode: Auto` 的比較 {#comparison-with-service-kubernetes-io-topology-mode-auto}

`trafficDistribution` 字段中的 `PreferClose`/`PreferSameZone`
以及使用 `service.kubernetes.io/topology-mode: Auto`
註解的舊版“拓撲感知路由”特性都旨在優先處理同一區域的流量。
然而，它們的方法存在一些關鍵差異：

<!--
* `service.kubernetes.io/topology-mode: Auto` attempts to distribute traffic
  proportionally across zones based on allocatable CPU resources. This heuristic
  includes safeguards (such as the [fallback
  behavior](/docs/concepts/services-networking/topology-aware-routing/#three-or-more-endpoints-per-zone)
  for small numbers of endpoints), sacrificing some predictability in favor of
  potentially better load balancing.
-->
* `service.kubernetes.io/topology-mode: Auto`：嘗試根據可分配的 CPU
  資源在各區域之間按比例分配流量。此啓發式方法包括一些保障措施
  （例如針對少量端點的[回退行爲](/zh-cn/docs/concepts/services-networking/topology-aware-routing/#three-or-more-endpoints-per-zone)），
  犧牲一些可預測性以換取更好的負載均衡。

<!--
* `trafficDistribution: PreferClose`: This approach aims to be slightly simpler
  and more predictable: "If there are endpoints in the zone, they will receive
  all traffic for that zone, if there are no endpoints in a zone, the traffic
  will be distributed to other zones". While the approach may offer more
  predictability, it does mean that you are in control of managing a [potential
  overload](#considerations-for-using-traffic-distribution-control).

* `trafficDistribution: PreferClose` aims to be simpler and more predictable:
  "If there are endpoints in the zone, they will receive all traffic for that
  zone, if there are no endpoints in a zone, the traffic will be distributed to
  other zones". This approach offers more predictability, but it means that you
  are responsible for [avoiding endpoint
  overload](#considerations-for-using-traffic-distribution-control).
-->
* `trafficDistribution: PreferClose`：這種方法偏重更簡單和更可預測：
  “如果區域內有端點，它們將接收該區域的所有流量；如果區域內沒有端點，流量將分配到其他區域”。
  這種方法提供更多的可預測性，但這意味着你需要負責[避免端點過載](#considerations-for-using-traffic-distribution-control)。

<!--
If the `service.kubernetes.io/topology-mode` annotation is set to `Auto`, it
will take precedence over `trafficDistribution`. The annotation may be deprecated
in the future in favor of the `trafficDistribution` field.
-->
如果 `service.kubernetes.io/topology-mode` 註解設置爲 `Auto`，它將優先於
`trafficDistribution`。該註解將來可能會被棄用，取而代之的是 `trafficDistribution` 字段。

<!--
### Interaction with Traffic Policies

When compared to the `trafficDistribution` field, the traffic policy fields
(`externalTrafficPolicy` and `internalTrafficPolicy`) are meant to offer a
stricter traffic locality requirements. Here's how `trafficDistribution`
interacts with them:
-->
### 與流量策略的交互 {#interaction-with-traffic-policies}

與 `trafficDistribution` 字段相比，流量策略字段
（`externalTrafficPolicy` 和 `internalTrafficPolicy`）旨在提供更嚴格的流量局域化要求。
以下是 `trafficDistribution` 與它們的交互方式：

<!--
* Precedence of Traffic Policies: For a given Service, if a traffic policy
  (`externalTrafficPolicy` or `internalTrafficPolicy`) is set to `Local`, it
  takes precedence over `trafficDistribution` for the corresponding
  traffic type (external or internal, respectively).
-->
* 流量策略的優先序：對於給定的 Service，如果流量策略
  （`externalTrafficPolicy` 或 `internalTrafficPolicy`）設置爲 `Local`，
  則它優先於相應流量類型（分別爲外部或內部）的 `trafficDistribution`。

<!--
* `trafficDistribution` Influence: For a given Service, if a traffic policy
  (`externalTrafficPolicy` or `internalTrafficPolicy`) is set to `Cluster` (the
  default), or if the fields are not set, then `trafficDistribution`
  guides the routing behavior for the corresponding traffic type
  (external or internal, respectively). This means that an attempt will be made
  to route traffic to an endpoint that is in the same zone as the client.
-->
* `trafficDistribution` 的影響：對於給定的 Service，如果流量策略
  （`externalTrafficPolicy` 或 `internalTrafficPolicy`）設置爲 `Cluster`（默認值），
  或者這些字段未設置，那麼 `trafficDistribution` 將指導相應流量類型
  （分別爲外部或內部）的路由行爲。這意味着 kube-proxy 將嘗試將流量路由到與客戶端位於同一區域的端點。

<!--
### Considerations for using traffic distribution control

A Service using `trafficDistribution` will attempt to route traffic to (healthy)
endpoints within the appropriate topology, even if this means that some
endpoints receive much more traffic than other endpoints. If you do not have a
sufficient number of endpoints within the same topology ("same zone", "same
node", etc.) as the clients, then endpoints may become overloaded. This is
especially likely if incoming traffic is not proportionally distributed across
the topology. To mitigate this, consider the following strategies:
-->
### 使用流量分配控制的注意事項 {#considerations-for-using-traffic-distribution-control}

使用 `trafficDistribution` 的 Service 將嘗試將流量路由到適當拓撲中的（健康的）端點，
即使這意味着某些端點接收的流量遠遠超過其他端點。
如果某個區域內的端點數量不足，它們可能會過載。
如果傳入流量在各區域之間分佈不均，這種情況更有可能發生。爲減輕這種情況，請考慮以下策略：

<!--
* [Pod Topology Spread Constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/):
  Use Pod Topology Spread Constraints to distribute your pods evenly
  across zones or nodes.

* Zone-specific Deployments: If you are using "same zone" traffic
  distribution, but expect to see different traffic patterns in
  different zones, you can create a separate Deployment for each zone.
  This approach allows the separate workloads to scale independently.
  There are also workload management addons available from the
  ecosystem, outside the Kubernetes project itself, that can help
  here.
-->
* [Pod 拓撲分佈約束](/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/)：
  使用 Pod 拓撲分佈約束在各區域之間更均勻地分佈你的 Pod。

* 區域特定的 Deployment：如果你預計會看到不均衡的流量模式，
  可以爲每個區域創建一個單獨的 Deployment。這種方法允許獨立擴展各個工作負載。
  生態系統中還有一些 Kubernetes 項目之外的工作負載管理插件，可以在這方面提供幫助。

## {{% heading "whatsnext" %}}

<!--
To learn more about Services,
read [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/).
-->
要了解有關 Service 的更多信息，
請閱讀[使用 Service 連接應用](/zh-cn/docs/tutorials/services/connect-applications-service/)。

<!--
You can also:

* Read about [Services](/docs/concepts/services-networking/service/) as a concept
* Read about [Ingresses](/docs/concepts/services-networking/ingress/) as a concept
* Read the [API reference](/docs/reference/kubernetes-api/service-resources/service-v1/) for the Service API
-->
也可以：

* 閱讀 [Service](/zh-cn/docs/concepts/services-networking/service/) 瞭解其概念
* 閱讀 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/) 瞭解其概念
* 閱讀 [API 參考](/zh-cn/docs/reference/kubernetes-api/service-resources/service-v1/)進一步瞭解 Service API
