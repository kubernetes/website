---
title: 在 Kubernetes 叢集中使用 NodeLocal DNSCache
content_type: task
weight: 390
---
<!--
reviewers:
- bowei
- zihongz
- sftim
title: Using NodeLocal DNSCache in Kubernetes Clusters
content_type: task
weight: 390
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

<!--
This page provides an overview of NodeLocal DNSCache feature in Kubernetes.
-->
本頁概述了 Kubernetes 中的 NodeLocal DNSCache 功能。

## {{% heading "prerequisites" %}}

 {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

 <!-- steps -->

<!--
## Introduction
-->
## 引言   {#introduction}

<!--
NodeLocal DNSCache improves Cluster DNS performance by running a DNS caching agent
on cluster nodes as a DaemonSet. In today's architecture, Pods in 'ClusterFirst' DNS mode
reach out to a kube-dns `serviceIP` for DNS queries. This is translated to a
kube-dns/CoreDNS endpoint via iptables rules added by kube-proxy.
With this new architecture, Pods will reach out to the DNS caching agent
running on the same node, thereby avoiding iptables DNAT rules and connection tracking.
The local caching agent will query kube-dns service for cache misses of cluster
hostnames ("`cluster.local`" suffix by default).
-->
NodeLocal DNSCache 通過在叢集節點上作爲 DaemonSet 運行 DNS 緩存代理來提高叢集 DNS 性能。
在當今的體系結構中，運行在 'ClusterFirst' DNS 模式下的 Pod 可以連接到 kube-dns `serviceIP` 進行 DNS 查詢。
通過 kube-proxy 添加的 iptables 規則將其轉換爲 kube-dns/CoreDNS 端點。
藉助這種新架構，Pod 將可以訪問在同一節點上運行的 DNS 緩存代理，從而避免 iptables DNAT 規則和連接跟蹤。
本地緩存代理將查詢 kube-dns 服務以獲取叢集主機名的緩存缺失（預設爲 "`cluster.local`" 後綴）。

<!--
## Motivation
-->
## 動機   {#motivation}

<!--
* With the current DNS architecture, it is possible that Pods with the highest DNS QPS
  have to reach out to a different node, if there is no local kube-dns/CoreDNS instance.
  Having a local cache will help improve the latency in such scenarios.
-->
* 使用當前的 DNS 體系結構，如果沒有本地 kube-dns/CoreDNS 實例，則具有最高 DNS QPS
  的 Pod 可能必須延伸到另一個節點。
  在這種場景下，擁有本地緩存將有助於改善延遲。

<!--
* Skipping iptables DNAT and connection tracking will help reduce
  [conntrack races](https://github.com/kubernetes/kubernetes/issues/56903)
  and avoid UDP DNS entries filling up conntrack table.
-->
* 跳過 iptables DNAT 和連接跟蹤將有助於減少
  [conntrack 競爭](https://github.com/kubernetes/kubernetes/issues/56903)並避免
  UDP DNS 條目填滿 conntrack 表。

<!--
* Connections from the local caching agent to kube-dns service can be upgraded to TCP.
  TCP conntrack entries will be removed on connection close in contrast with
  UDP entries that have to timeout
  ([default](https://www.kernel.org/doc/Documentation/networking/nf_conntrack-sysctl.txt)
  `nf_conntrack_udp_timeout` is 30 seconds)
-->
* 從本地緩存代理到 kube-dns 服務的連接可以升級爲 TCP。
  TCP conntrack 條目將在連接關閉時被刪除，相反 UDP 條目必須超時
  （[預設](https://www.kernel.org/doc/Documentation/networking/nf_conntrack-sysctl.txt)
  `nf_conntrack_udp_timeout` 是 30 秒）。

<!--
* Upgrading DNS queries from UDP to TCP would reduce tail latency attributed to
  dropped UDP packets and DNS timeouts usually up to 30s (3 retries + 10s timeout).
  Since the nodelocal cache listens for UDP DNS queries, applications don't need to be changed.
-->
* 將 DNS 查詢從 UDP 升級到 TCP 將減少由於被丟棄的 UDP 包和 DNS 超時而帶來的尾部等待時間；
  這類延時通常長達 30 秒（3 次重試 + 10 秒超時）。
  由於 nodelocal 緩存監聽 UDP DNS 查詢，應用不需要變更。

<!--
* Metrics & visibility into DNS requests at a node level.
-->
* 在節點級別對 DNS 請求的度量和可見性。

<!--
* Negative caching can be re-enabled, thereby reducing the number of queries for the kube-dns service.
-->
* 可以重新啓用負緩存，從而減少對 kube-dns 服務的查詢數量。

<!--
## Architecture Diagram
-->
## 架構圖   {#architecture-diagram}

<!--
This is the path followed by DNS Queries after NodeLocal DNSCache is enabled:
-->
啓用 NodeLocal DNSCache 之後，DNS 查詢所遵循的路徑如下：

<!--
{{< figure src="/images/docs/nodelocaldns.svg" alt="NodeLocal DNSCache flow" title="Nodelocal DNSCache flow" caption="This image shows how NodeLocal DNSCache handles DNS queries." class="diagram-medium" >}}
-->
{{< figure src="/images/docs/nodelocaldns.svg" alt="NodeLocal DNSCache 流" title="Nodelocal DNSCache 流" caption="此圖顯示了 NodeLocal DNSCache 如何處理 DNS 查詢。" class="diagram-medium" >}}

<!--
## Configuration
-->
## 設定   {#configuration}

{{< note >}}
<!--
The local listen IP address for NodeLocal DNSCache can be any address that
can be guaranteed to not collide with any existing IP in your cluster.
It's recommended to use an address with a local scope, for example,
from the 'link-local' range '169.254.0.0/16' for IPv4 or from the
'Unique Local Address' range in IPv6 'fd00::/8'.
-->
NodeLocal DNSCache 的本地偵聽 IP 地址可以是任何地址，只要該地址不和你的叢集裏現有的 IP 地址發生衝突。
推薦使用本地範圍內的地址，例如，IPv4 鏈路本地區段 '169.254.0.0/16' 內的地址，
或者 IPv6 唯一本地地址區段 'fd00::/8' 內的地址。
{{< /note >}}

<!--
This feature can be enabled using the following steps:
-->
可以使用以下步驟啓動此功能：

<!--
* Prepare a manifest similar to the sample
  [`nodelocaldns.yaml`](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml)
  and save it as `nodelocaldns.yaml`.
-->
* 根據示例 [`nodelocaldns.yaml`](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml)
  準備一個清單，把它保存爲 `nodelocaldns.yaml`。

<!--
* If using IPv6, the CoreDNS configuration file needs to enclose all the IPv6 addresses
  into square brackets if used in 'IP:Port' format.
  If you are using the sample manifest from the previous point, this will require you to modify
  [the configuration line L70](https://github.com/kubernetes/kubernetes/blob/b2ecd1b3a3192fbbe2b9e348e095326f51dc43dd/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml#L70)
  like this: "`health [__PILLAR__LOCAL__DNS__]:8080`"
-->
* 如果使用 IPv6，在使用 'IP:Port' 格式的時候需要把 CoreDNS 設定檔案裏的所有 IPv6 地址用方括號包起來。
  如果你使用上述的示例清單，
  需要把[設定行 L70](https://github.com/kubernetes/kubernetes/blob/b2ecd1b3a3192fbbe2b9e348e095326f51dc43dd/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml#L70)
  修改爲： "`health [__PILLAR__LOCAL__DNS__]:8080`"。

<!--
* Substitute the variables in the manifest with the right values:

  ```shell
  kubedns=`kubectl get svc kube-dns -n kube-system -o jsonpath={.spec.clusterIP}`
  domain=<cluster-domain>
  localdns=<node-local-address>
  ```

  `<cluster-domain>` is "`cluster.local`" by default. `<node-local-address>` is the
  local listen IP address chosen for NodeLocal DNSCache.
-->
* 把清單裏的變量更改爲正確的值：

  ```shell
  kubedns=`kubectl get svc kube-dns -n kube-system -o jsonpath={.spec.clusterIP}`
  domain=<cluster-domain>
  localdns=<node-local-address>
  ```

  `<cluster-domain>` 的預設值是 "`cluster.local`"。`<node-local-address>` 是
  NodeLocal DNSCache 選擇的本地偵聽 IP 地址。

<!--
  * If kube-proxy is running in IPTABLES mode:

    ``` bash
    sed -i "s/__PILLAR__LOCAL__DNS__/$localdns/g; s/__PILLAR__DNS__DOMAIN__/$domain/g; s/__PILLAR__DNS__SERVER__/$kubedns/g" nodelocaldns.yaml
    ```

    `__PILLAR__CLUSTER__DNS__` and `__PILLAR__UPSTREAM__SERVERS__` will be populated by
    the `node-local-dns` pods.
    In this mode, the `node-local-dns` pods listen on both the kube-dns service IP
    as well as `<node-local-address>`, so pods can look up DNS records using either IP address.
-->
  * 如果 kube-proxy 運行在 IPTABLES 模式：

    ``` bash
    sed -i "s/__PILLAR__LOCAL__DNS__/$localdns/g; s/__PILLAR__DNS__DOMAIN__/$domain/g; s/__PILLAR__DNS__SERVER__/$kubedns/g" nodelocaldns.yaml
    ```

    node-local-dns Pod 會設置 `__PILLAR__CLUSTER__DNS__` 和 `__PILLAR__UPSTREAM__SERVERS__`。
    在此模式下, node-local-dns Pod 會同時偵聽 kube-dns 服務的 IP 地址和
    `<node-local-address>` 的地址，以便 Pod 可以使用其中任何一個 IP 地址來查詢 DNS 記錄。

<!--
  * If kube-proxy is running in IPVS mode:

    ``` bash
    sed -i "s/__PILLAR__LOCAL__DNS__/$localdns/g; s/__PILLAR__DNS__DOMAIN__/$domain/g; s/,__PILLAR__DNS__SERVER__//g; s/__PILLAR__CLUSTER__DNS__/$kubedns/g" nodelocaldns.yaml
    ```

    In this mode, the `node-local-dns` pods listen only on `<node-local-address>`.
    The `node-local-dns` interface cannot bind the kube-dns cluster IP since the
    interface used for IPVS loadbalancing already uses this address.
    `__PILLAR__UPSTREAM__SERVERS__` will be populated by the node-local-dns pods.
-->
  * 如果 kube-proxy 運行在 IPVS 模式：

    ``` bash
    sed -i "s/__PILLAR__LOCAL__DNS__/$localdns/g; s/__PILLAR__DNS__DOMAIN__/$domain/g; s/,__PILLAR__DNS__SERVER__//g; s/__PILLAR__CLUSTER__DNS__/$kubedns/g" nodelocaldns.yaml
    ```

    在此模式下，node-local-dns Pod 只會偵聽 `<node-local-address>` 的地址。
    node-local-dns 介面不能綁定 kube-dns 的叢集 IP 地址，因爲 IPVS 負載均衡使用的介面已經佔用了該地址。
    node-local-dns Pod 會設置 `__PILLAR__UPSTREAM__SERVERS__`。

<!--
* Run `kubectl create -f nodelocaldns.yaml`

* If using kube-proxy in IPVS mode, `--cluster-dns` flag to kubelet needs to be modified
  to use `<node-local-address>` that NodeLocal DNSCache is listening on.
  Otherwise, there is no need to modify the value of the `--cluster-dns` flag,
  since NodeLocal DNSCache listens on both the kube-dns service IP as well as
  `<node-local-address>`.
-->
* 運行 `kubectl create -f nodelocaldns.yaml`

* 如果 kube-proxy 運行在 IPVS 模式，需要修改 kubelet 的 `--cluster-dns` 參數爲
  NodeLocal DNSCache 正在偵聽的 `<node-local-address>` 地址。
  否則，不需要修改 `--cluster-dns` 參數，因爲 NodeLocal DNSCache 會同時偵聽
  kube-dns 服務的 IP 地址和 `<node-local-address>` 的地址。

<!--
Once enabled, the `node-local-dns` Pods will run in the `kube-system` namespace
on each of the cluster nodes. This Pod runs [CoreDNS](https://github.com/coredns/coredns)
in cache mode, so all CoreDNS metrics exposed by the different plugins will
be available on a per-node basis.

You can disable this feature by removing the DaemonSet, using `kubectl delete -f <manifest>`.
You should also revert any changes you made to the kubelet configuration.
-->
啓用後，`node-local-dns` Pod 將在每個叢集節點上的 `kube-system` 名字空間中運行。
此 Pod 在緩存模式下運行 [CoreDNS](https://github.com/coredns/coredns)，
因此每個節點都可以使用不同插件公開的所有 CoreDNS 指標。

如果要禁用該功能，你可以使用 `kubectl delete -f <manifest>` 來刪除 DaemonSet。
你還應該回滾你對 kubelet 設定所做的所有改動。

<!--
## StubDomains and Upstream server Configuration
-->
## StubDomains 和上游伺服器設定   {#stubdomains-and-upstream-server-configuration}

<!--
StubDomains and upstream servers specified in the `kube-dns` ConfigMap in the `kube-system` namespace
are automatically picked up by `node-local-dns` pods. The ConfigMap contents need to follow the format
shown in [the example](/docs/tasks/administer-cluster/dns-custom-nameservers/#example-1).
The `node-local-dns` ConfigMap can also be modified directly with the stubDomain configuration
in the Corefile format. Some cloud providers might not allow modifying `node-local-dns` ConfigMap directly.
In those cases, the `kube-dns` ConfigMap can be updated.
-->
`node-local-dns` Pod 能夠自動讀取 `kube-system` 名字空間中 `kube-dns` ConfigMap
中保存的 StubDomains 和上游伺服器資訊。ConfigMap
中的內容需要遵從[此示例](/zh-cn/docs/tasks/administer-cluster/dns-custom-nameservers/#example-1)中所給的格式。
`node-local-dns` ConfigMap 也可被直接修改，使用 Corefile 格式設置 stubDomain 設定。
某些雲廠商可能不允許直接修改 `node-local-dns` ConfigMap 的內容。
在這種情況下，可以更新 `kube-dns` ConfigMap。

<!--
## Setting memory limits
-->
## 設置內存限制   {#setting-memory-limits}

<!--
The `node-local-dns` Pods use memory for storing cache entries and processing queries.
Since they do not watch Kubernetes objects, the cluster size or the number of Services / EndpointSlices do not directly affect memory usage. Memory usage is influenced by the DNS query pattern.
From [CoreDNS docs](https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md),
> The default cache size is 10000 entries, which uses about 30 MB when completely filled.
-->
`node-local-dns` Pod 使用內存來保存緩存項並處理查詢。
由於它們並不監視 Kubernetes 對象變化，叢集規模或者 Service/EndpointSlices
的數量都不會直接影響內存用量。內存用量會受到 DNS 查詢模式的影響。
根據 [CoreDNS 文檔](https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md),

> The default cache size is 10000 entries, which uses about 30 MB when completely filled.
> （預設的緩存大小是 10000 個表項，當完全填充時會使用約 30 MB 內存）

<!--
This would be the memory usage for each server block (if the cache gets completely filled).
Memory usage can be reduced by specifying smaller cache sizes.

The number of concurrent queries is linked to the memory demand, because each extra
goroutine used for handling a query requires an amount of memory. You can set an upper limit
using the `max_concurrent` option in the forward plugin.
-->
這一數值是（緩存完全被填充時）每個伺服器塊的內存用量。
通過設置小一點的緩存大小可以降低內存用量。

併發查詢的數量會影響內存需求，因爲用來處理查詢請求而創建的 Go 協程都需要一定量的內存。
你可以在 forward 插件中使用 `max_concurrent` 選項設置併發查詢數量上限。

<!--
If a `node-local-dns` Pod attempts to use more memory than is available (because of total system
resources, or because of a configured
[resource limit](/docs/concepts/configuration/manage-resources-containers/)), the operating system
may shut down that pod's container.
If this happens, the container that is terminated (“OOMKilled”) does not clean up the custom
packet filtering rules that it previously added during startup.
The `node-local-dns` container should get restarted (since managed as part of a DaemonSet), but this
will lead to a brief DNS downtime each time that the container fails: the packet filtering rules direct
DNS queries to a local Pod that is unhealthy.
-->
如果一個 `node-local-dns` Pod 嘗試使用的內存超出可提供的內存量
（因爲系統資源總量的，或者所設定的[資源約束](/zh-cn/docs/concepts/configuration/manage-resources-containers/)）的原因，
操作系統可能會關閉這一 Pod 的容器。
發生這種情況時，被終止的（"OOMKilled"）容器不會清理其啓動期間所添加的定製包過濾規則。
該 `node-local-dns` 容器應該會被重啓（因其作爲 DaemonSet 的一部分被管理），
但因上述原因可能每次容器失敗時都會導致 DNS 有一小段時間不可用：
the packet filtering rules direct DNS queries to a local Pod that is unhealthy
（包過濾器規則將 DNS 查詢轉發到本地某個不健康的 Pod）。

<!--
You can determine a suitable memory limit by running node-local-dns pods without a limit and
measuring the peak usage. You can also set up and use a
[VerticalPodAutoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler)
in _recommender mode_, and then check its recommendations.
-->
通過不帶限制地運行 `node-local-dns` Pod 並度量其內存用量峯值，你可以爲其確定一個合適的內存限制值。
你也可以安裝並使用一個運行在 “Recommender Mode（建議者模式）” 的
[VerticalPodAutoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler)，
並查看該組件輸出的建議資訊。

