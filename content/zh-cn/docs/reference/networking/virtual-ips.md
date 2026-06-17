---
title: 虚拟 IP 和服务代理
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
Kubernetes {{< glossary_tooltip text="集群" term_id="cluster" >}}中的每个
{{< glossary_tooltip text="节点" term_id="node" >}}会运行一个
[kube-proxy](/zh-cn/docs/reference/command-line-tools-reference/kube-proxy/)
（除非你已经部署了自己的替换组件来替代 `kube-proxy`）。

<!--
The `kube-proxy` component is responsible for implementing a _virtual IP_
mechanism for {{< glossary_tooltip term_id="service" text="Services">}}
of `type` other than
[`ExternalName`](/docs/concepts/services-networking/service/#externalname).
-->
`kube-proxy` 组件负责除 `type` 为
[`ExternalName`](/zh-cn/docs/concepts/services-networking/service/#externalname)
以外的 {{< glossary_tooltip term_id="service" text="Service">}} 实现**虚拟 IP** 机制。

<!--
Each instance of kube-proxy watches the Kubernetes
{{< glossary_tooltip term_id="control-plane" text="control plane" >}}
for the addition and removal of Service and {{< glossary_tooltip term_id="endpoint-slice" text="EndpointSlice" >}}
{{< glossary_tooltip term_id="object" text="objects" >}}. For each Service, kube-proxy
calls appropriate APIs (depending on the kube-proxy mode) to configure
the node to capture traffic to the Service's `clusterIP` and `port`,
and redirect that traffic to one of the Service's endpoints
(usually a Pod, but possibly an arbitrary user-provided IP address). A control
loop ensures that the rules on each node are reliably synchronized with
the Service and EndpointSlice state as indicated by the API server.

{{< figure src="/images/docs/services-iptables-overview.svg" title="Virtual IP mechanism for Services, using iptables mode" class="diagram-medium" >}}
-->
kube-proxy 的每个实例都会监视 Kubernetes {{< glossary_tooltip text="控制平面" term_id="control-plane" >}}中
Service 和 {{< glossary_tooltip term_id="endpoint-slice" text="EndpointSlice" >}}
{{< glossary_tooltip text="对象" term_id="object" >}}的添加和删除。对于每个
Service，kube-proxy 调用适当的 API（取决于 kube-proxy 模式）来配置节点，以捕获流向 Service 的 `clusterIP` 和 `port`
的流量，并将这些流量重定向到 Service 的某个端点（通常是 Pod，但也可能是用户提供的任意 IP 地址）。
一个控制回路确保每个节点上的规则与 API 服务器指示的 Service 和 EndpointSlice 状态可靠同步。

{{< figure src="/zh-cn/docs/images/services-iptables-overview.svg" title="iptables 模式下 Service 的虚拟 IP 机制" class="diagram-medium" >}}

<!--
A question that pops up every now and then is why Kubernetes relies on
proxying to forward inbound traffic to backends. What about other
approaches? For example, would it be possible to configure DNS records that
have multiple A values (or AAAA for IPv6), and rely on round-robin name
resolution?
-->
一个时不时出现的问题是，为什么 Kubernetes 依赖代理将入站流量转发到后端。
其他方案呢？例如，是否可以配置具有多个 A 值（或 IPv6 的 AAAA）的 DNS 记录，
使用轮询域名解析？

<!--
There are a few reasons for using proxying for Services:

* There is a long history of DNS implementations not respecting record TTLs,
  and caching the results of name lookups after they should have expired.
* Some apps do DNS lookups only once and cache the results indefinitely.
* Even if apps and libraries did proper re-resolution, the low or zero TTLs
  on the DNS records could impose a high load on DNS that then becomes
  difficult to manage.
-->
使用代理转发方式实现 Service 的原因有以下几个：

* DNS 的实现不遵守记录的 TTL 约定的历史由来已久，在记录过期后可能仍有结果缓存。
* 有些应用只做一次 DNS 查询，然后永久缓存结果。
* 即使应用程序和库进行了适当的重新解析，TTL 取值较低或为零的 DNS 记录可能会给 DNS 带来很大的压力，
  从而变得难以管理。

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
在下文中，你可以了解到 kube-proxy 各种实现方式的工作原理。
总的来说，你应该注意到，在运行 `kube-proxy` 时，
可能会修改内核级别的规则（例如，可能会创建 iptables 规则），
在某些情况下，这些规则直到重启才会被清理。
因此，运行 kube-proxy 这件事应该只由了解在计算机上使用低级别、特权网络代理服务会带来的后果的管理员执行。
尽管 `kube-proxy` 可执行文件支持 `cleanup` 功能，但这个功能并不是官方特性，因此只能根据具体情况使用。

<a id="example"></a>
<!--
Some of the details in this reference refer to an example: the backend
{{< glossary_tooltip term_id="pod" text="Pods" >}} for a stateless
image-processing workloads, running with
three replicas. Those replicas are
fungible&mdash;frontends do not care which backend they use. While the actual Pods that
compose the backend set may change, the frontend clients should not need to be aware of that,
nor should they need to keep track of the set of backends themselves.
-->
本文中的一些细节会引用这样一个例子：
运行了 3 个 {{< glossary_tooltip text="Pod" term_id="pod" >}}
副本的无状态图像处理后端工作负载。
这些副本是可互换的；前端不需要关心它们调用了哪个后端副本。
即使组成这一组后端程序的 Pod 实际上可能会发生变化，
前端客户端不应该也没必要知道，而且也不需要跟踪这一组后端的状态。

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
kube-proxy 会根据不同配置以不同的模式启动。

在 Linux 节点上，kube-proxy 的可用模式是：

[`iptables`](#proxy-mode-iptables)
: kube-proxy 使用 iptables 配置数据包转发规则的一种模式。

[`ipvs`](#proxy-mode-ipvs)
: kube-proxy 使用 ipvs 配置数据包转发规则的一种模式。

[`nftables`](#proxy-mode-nftables)
: kube-proxy 使用 nftables 配置数据包转发规则的一种模式。

<!--
There is only one mode available for kube-proxy on Windows:

[`kernelspace`](#proxy-mode-kernelspace)
: a mode where the kube-proxy configures packet forwarding rules in the Windows kernel
-->
Windows 上的 kube-proxy 只有一种模式可用：

[`kernelspace`](#proxy-mode-kernelspace)
: kube-proxy 在 Windows 内核中配置数据包转发规则的一种模式。

<!--
### `iptables` proxy mode {#proxy-mode-iptables}

_This proxy mode is only available on Linux nodes._

In this mode, kube-proxy configures packet forwarding rules using the
iptables API of the kernel netfilter subsystem. For each endpoint, it
installs iptables rules which, by default, select a backend Pod at
random.
-->
### `iptables` 代理模式 {#proxy-mode-iptables}

**此代理模式仅适用于 Linux 节点。**

在这种模式下，kube-proxy 使用内核 netfilter 子系统的 iptables API 
配置数据包转发规则。对于每个端点，kube-proxy 会添加 iptables 
规则，这些规则默认情况下会随机选择一个后端 Pod。

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
例如，考虑本页中[前面](#example)描述的图像处理应用程序。
当创建后端 Service 时，Kubernetes 控制平面会分配一个虚拟 IP 地址，例如 10.0.0.1。
对于这个例子而言，假设 Service 端口是 1234。
集群中的所有 kube-proxy 实例都会观察到新 Service 的创建。

<!--
When kube-proxy on a node sees a new Service, it installs a series of iptables rules
which redirect from the virtual IP address to more iptables rules, defined per Service.
The per-Service rules link to further rules for each backend endpoint, and the per-
endpoint rules redirect traffic (using destination NAT) to the backends.
-->
当节点上的 kube-proxy 观察到新 Service 时，它会添加一系列 iptables 规则，
这些规则从虚拟 IP 地址重定向到更多 iptables 规则，每个 Service 都定义了这些规则。
每个 Service 规则链接到每个后端端点的更多规则，
并且每个端点规则将流量重定向（使用目标 NAT）到后端。

<!--
When a client connects to the Service's virtual IP address the iptables rule kicks in.
A backend is chosen (either based on session affinity or randomly) and packets are
redirected to the backend without rewriting the client IP address.
-->
当客户端连接到 Service 的虚拟 IP 地址时，iptables 规则会生效。
会选择一个后端（基于会话亲和性或随机选择），并将数据包重定向到后端，
无需重写客户端 IP 地址。

<!--
This same basic flow executes when traffic comes in through a `type: NodePort` Service, or
through a load-balancer, though in those cases the client IP address does get altered.
-->
当流量通过 `type: NodePort` Service 或负载均衡器进入时，也会执行相同的基本流程，
只是在这些情况下，客户端 IP 地址会被更改。

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
#### 优化 iptables 模式性能  {#optimizing-iptables-mode-performance}

在 iptables 模式下，kube-proxy 为每个 Service 创建一些 iptables 规则，并为每个端点
IP 地址创建一些 iptables 规则。在拥有数万个 Pod 和 Service 的集群中，这意味着数万个
iptables 规则，当 Service（或其 EndpointSlice）发生变化时，kube-proxy
在更新内核中的规则时可能要用很长时间。你可以通过（`kube-proxy --config <path>` 指定的）
kube-proxy [配置文件](/zh-cn/docs/reference/config-api/kube-proxy-config.v1alpha1/)的
[`iptables` 章节](/zh-cn/docs/reference/config-api/kube-proxy-config.v1alpha1/#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPTablesConfiguration)中的选项来调整
kube-proxy 的同步行为：

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
`minSyncPeriod` 参数设置尝试同步 iptables 规则与内核之间的最短时长。
如果是 `0s`，那么每次有任一 Service 或 EndpointSlice 发生变更时，kube-proxy 都会立即同步这些规则。
这种方式在较小的集群中可以工作得很好，但如果在很短的时间内很多东西发生变更时，它会导致大量冗余工作。
例如，如果你有一个由 {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
支持的 Service，共有 100 个 Pod，你删除了这个 Deployment，
且设置了 `minSyncPeriod: 0s`，kube-proxy 最终会从 iptables 规则中逐个删除 Service 的 Endpoint，
总共更新 100 次。使用较大的 `minSyncPeriod` 值时，多个 Pod 删除事件将被聚合在一起，
因此 kube-proxy 最终可能会进行例如 5 次更新，每次移除 20 个端点，
这样在 CPU 利用率方面更有效率，能够更快地同步所有变更。

<!--
The larger the value of `minSyncPeriod`, the more work that can be
aggregated, but the downside is that each individual change may end up
waiting up to the full `minSyncPeriod` before being processed, meaning
that the iptables rules spend more time being out-of-sync with the
current API server state.
-->
`minSyncPeriod` 的值越大，可以聚合的工作越多，
但缺点是每个独立的变更可能最终要等待整个 `minSyncPeriod` 周期后才能被处理，
这意味着 iptables 规则要用更多时间才能与当前的 API 服务器状态同步。

<!--
The default value of `1s` should work well in most clusters, but in very
large clusters it may be necessary to set it to a larger value.
Especially, if kube-proxy's `sync_proxy_rules_duration_seconds` metric
indicates an average time much larger than 1 second, then bumping up
`minSyncPeriod` may make updates more efficient.
-->
默认值 `1s` 适用于大多数集群，在大型集群中，可能需要将其设置为更大的值。
（特别是，如果 kube-proxy 的 `sync_proxy_rules_duration_seconds`
指标表明平均时间远大于 1 秒，那么提高 `minSyncPeriod` 可能会使更新更有效率。）

<!--
##### Updating legacy `minSyncPeriod` configuration {#minimize-iptables-restore}
-->
##### 更新原有的 `minSyncPeriod` 配置   {#minimize-iptables-restore}

<!--
Older versions of kube-proxy updated all the rules for all Services on
every sync; this led to performance issues (update lag) in large
clusters, and the recommended solution was to set a larger
`minSyncPeriod`. Since Kubernetes v1.28, the iptables mode of
kube-proxy uses a more minimal approach, only making updates where
Services or EndpointSlices have actually changed.
-->
旧版本的 kube-proxy 在每次同步时为所有 Service 更新规则；
这在大型集群中会造成性能问题（更新延迟），建议的解决方案是设置较大的 `minSyncPeriod`。
自 Kubernetes v1.28 开始，kube-proxy 的 iptables 模式采用了更精简的方法，
只有在 Service 或 EndpointSlice 实际发生变化时才会进行更新。

<!--
If you were previously overriding `minSyncPeriod`, you should try
removing that override and letting kube-proxy use the default value
(`1s`) or at least a smaller value than you were using before upgrading.
-->
如果你之前覆盖了 `minSyncPeriod`，你应该尝试删除该覆盖并让 kube-proxy
使用默认值（`1s`）或至少比升级前使用的值小。

<!--
If you are not running kube-proxy from Kubernetes {{< skew currentVersion >}}, check
the behavior and associated advice for the version that you are actually running.
-->
如果你运行的不是 Kubernetes {{< skew currentVersion >}} 版本的 kube-proxy，
请检查你实际运行的版本的行为和相关建议。

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
`syncPeriod` 参数控制与单次 Service 和 EndpointSlice 的变更没有直接关系的少数同步操作。
特别是，它控制 kube-proxy 在外部组件已干涉 kube-proxy 的 iptables 规则时通知的速度。
在大型集群中，kube-proxy 也仅在每隔 `syncPeriod` 时长执行某些清理操作，以避免不必要的工作。

<!--
For the most part, increasing `syncPeriod` is not expected to have much
impact on performance, but in the past, it was sometimes useful to set
it to a very large value (eg, `1h`). This is no longer recommended,
and is likely to hurt functionality more than it improves performance.
-->
在大多数情况下，提高 `syncPeriod` 预计不会对性能产生太大影响，
但在过去，有时将其设置为非常大的值（例如 `1h`）很有用。
现在不再推荐这种做法，因为它对功能的破坏可能会超过对性能的改进。

<!--
### IPVS proxy mode {#proxy-mode-ipvs}
-->
### IPVS 代理模式 {#proxy-mode-ipvs}

{{< feature-state for_k8s_version="v1.35" state="deprecated" >}}

<!--
_This proxy mode is only available on Linux nodes._
-->
**此代理模式仅适用于 Linux 节点。**

<!--
In `ipvs` mode, kube-proxy uses the kernel IPVS and iptables APIs to
create rules to redirect traffic from Service IPs to endpoint IPs.
-->
在 `ipvs` 模式下，kube-proxy 使用内核 IPVS 和 iptables API
创建规则，将流量从 Service IP 重定向到端点 IP。

<!--
The IPVS proxy mode is based on netfilter hook function that is similar to
iptables mode, but uses a hash table as the underlying data structure and works
in the kernel space.
-->
IPVS 代理模式基于 netfilter 回调函数，类似于 iptables 模式，
但它使用哈希表作为底层数据结构，在内核空间中生效。

{{< note >}}
<!--
The `ipvs` proxy mode was an experiment in providing a Linux
kube-proxy backend with better rule-synchronizing performance and
higher network-traffic throughput than the `iptables` mode. While it
succeeded in those goals, the kernel IPVS API turned out to be a bad
match for the Kubernetes Services API, and the `ipvs` backend was
never able to implement all of the edge cases of Kubernetes Service
functionality correctly.
-->
作为 Linux kube-proxy 的一种实验性功能，`ipvs` 代理模式提供了比 `iptables`
模式更优的规则同步性能和更高的网络流量处理能力。
虽然它在这些目标上取得了成功，但内核 IPVS API 被证明不适合实现 Kubernetes Service API，
`ipvs` 后端从未能够正确实现所有 Kubernetes Service 功能的边缘情况。

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
下面描述的 `nftables` 代理模式实质上是 `iptables` 和 `ipvs` 模式的替代品，
性能优于两者，建议作为 `ipvs` 的替代。如果你要部署到过于陈旧而无法运行 `nftables`
代理模式的 Linux 系统上，你也应该考虑尝试 `iptables` 模式而不是 `ipvs`，
因为自从首次引入 `ipvs` 模式以来，`iptables` 模式的性能已经有了很大提升。
{{< /note >}}

<!--
IPVS provides more options for balancing traffic to backend Pods;
these are:
-->
IPVS 为将流量均衡到后端 Pod 提供了更多选择：

<!--
* `rr` (Round Robin): Traffic is equally distributed amongst the backing servers.

* `wrr` (Weighted Round Robin): Traffic is routed to the backing servers based on
  the weights of the servers. Servers with higher weights receive new connections
  and get more requests than servers with lower weights.

* `lc` (Least Connection): More traffic is assigned to servers with fewer active connections.
-->
* `rr`（轮询）：流量被平均分发给后端服务器。

* `wrr`（加权轮询）：流量基于服务器的权重被路由到后端服务器。
  高权重的服务器接收新的连接并处理比低权重服务器更多的请求。

* `lc`（最少连接）：将更多流量分配给活跃连接数较少的服务器。

<!--
* `wlc` (Weighted Least Connection): More traffic is routed to servers with fewer connections
  relative to their weights, that is, connections divided by weight.

* `lblc` (Locality based Least Connection): Traffic for the same IP address is sent to the
  same backing server if the server is not overloaded and available; otherwise the traffic
  is sent to servers with fewer connections, and keep it for future assignment.
-->
* `wlc`（加权最少连接）：将更多流量按照服务器权重分配给连接数较少的服务器，即基于连接数除以权重。

* `lblc`（基于地域的最少连接）：如果服务器未超载且可用，则针对相同 IP 地址的流量被发送到同一后端服务器；
  否则，流量被发送到连接较少的服务器，并在未来的流量分配中保持这一分配决定。

<!--
* `lblcr` (Locality Based Least Connection with Replication): Traffic for the same IP
  address is sent to the server with least connections. If all the backing servers are
  overloaded, it picks up one with fewer connections and adds it to the target set.
  If the target set has not changed for the specified time, the server with the highest load
  is removed from the set, in order to avoid a high degree of replication.
-->
* `lblcr`（带副本的基于地域的最少连接）：针对相同 IP 地址的流量被发送到连接数最少的服务器。
  如果所有后端服务器都超载，则选择连接较少的服务器并将其添加到目标集中。
  如果目标集在指定时间内未发生变化，则从此集合中移除负载最高的服务器，以避免副本的负载过高。

<!--
* `sh` (Source Hashing): Traffic is sent to a backing server by looking up a statically
  assigned hash table based on the source IP addresses.

* `dh` (Destination Hashing): Traffic is sent to a backing server by looking up a
  statically assigned hash table based on their destination addresses.
-->
* `sh`（源哈希）：通过查找基于源 IP 地址的静态分配哈希表，将流量发送到某后端服务器。

* `dh`（目标哈希）：通过查找基于目标地址的静态分配哈希表，将流量发送到某后端服务器。

<!--
* `sed` (Shortest Expected Delay): Traffic forwarded to a backing server with the shortest
  expected delay. The expected delay is `(C + 1) / U` if sent to a server, where `C` is
  the number of connections on the server and `U` is the fixed service rate (weight) of
  the server.

* `nq` (Never Queue): Traffic is sent to an idle server if there is one, instead of
  waiting for a fast one; if all servers are busy, the algorithm falls back to the `sed`
  behavior.
-->
* `sed`（最短预期延迟）：流量被转发到具有最短预期延迟的后端服务器。
  如果流量被发送给服务器，预期延迟为 `(C + 1) / U`，其中 `C` 是服务器上的连接数，
  `U` 是服务器的固定服务速率（权重）。

* `nq`（永不排队）：流量被发送到一台空闲服务器（如果有的话），而不是等待一台快速服务器；
  如果所有服务器都忙碌，算法将退回到 `sed` 行为。

<!--
* `mh` (Maglev Hashing): Assigns incoming jobs based on
  [Google's Maglev hashing algorithm](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/44824.pdf),
  This scheduler has two flags: `mh-fallback`, which enables fallback to a different
  server if the selected server is unavailable, and `mh-port`, which adds the source port number to
  the hash computation. When using `mh`, kube-proxy always sets the `mh-port` flag and does not
  enable the `mh-fallback` flag.
  In proxy-mode=ipvs `mh` will work as source-hashing (`sh`), but with ports.
-->
* `mh`（Maglev Hashing）：基于 [Google 的 Maglev 哈希算法](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/44824.pdf)
  来分配接收的任务。此调度器有两个标志：
  `mh-fallback` 允许在选定的服务器不可用时回退到另一台服务器；
  `mh-port` 将源端口号添加到哈希计算中。
  在使用 `mh` 时，`kube-proxy` 始终会设置 `mh-port` 标志，但不会启用 `mh-fallback` 标志。
  在代理模式为 ipvs 时，`mh` 的工作方式与源哈希（`sh`）类似，但会包含端口信息。

<!--
These scheduling algorithms are configured through the
[`ipvs.scheduler`](/docs/reference/config-api/kube-proxy-config.v1alpha1/#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPVSConfiguration)
field in the kube-proxy configuration.
-->
这些调度算法是通过 kube-proxy 配置中的
[ipvs.scheduler](/zh-cn/docs/reference/config-api/kube-proxy-config.v1alpha1/#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPVSConfiguration)
字段进行配置的。

{{< note >}}
<!--
To run kube-proxy in IPVS mode, you must make IPVS available on
the node before starting kube-proxy.

When kube-proxy starts in IPVS proxy mode, it verifies whether IPVS
kernel modules are available. If the IPVS kernel modules are not detected, then kube-proxy
exits with an error.
-->
要在 IPVS 模式下运行 kube-proxy，必须在启动 kube-proxy 之前确保节点上的 IPVS 可用。

当 kube-proxy 以 IPVS 代理模式启动时，它会验证 IPVS 内核模块是否可用。
如果未检测到 IPVS 内核模块，则 kube-proxy 会退出并报错。
{{< /note >}}

<!--
{{< figure src="/images/docs/services-ipvs-overview.svg" title="Virtual IP address mechanism for Services, using IPVS mode" class="diagram-medium" >}}
-->
{{< figure src="/zh-cn/docs/images/services-ipvs-overview.svg" title="IPVS 模式下 Service 的虚拟 IP 地址机制" class="diagram-medium" >}}

<!--
### `nftables` proxy mode {#proxy-mode-nftables}

{{< feature-state feature_gate_name="NFTablesProxyMode" >}}

_This proxy mode is only available on Linux nodes, and requires kernel
5.13 or later._
-->
### `nftables` 代理模式 {#proxy-mode-nftables}

{{< feature-state feature_gate_name="NFTablesProxyMode" >}}

**此代理模式仅适用于 Linux 节点，并且需要 5.13 或更高的内核版本。**

<!--
In this mode, kube-proxy configures packet forwarding rules using the
nftables API of the kernel netfilter subsystem. For each endpoint, it
installs nftables rules which, by default, select a backend Pod at
random.
-->
在这种模式下，kube-proxy 使用内核 netfilter 子系统的 nftables API
配置数据包转发规则。对于每个端点，它会添加 nftables
规则，这些规则默认情况下会随机选择一个后端 Pod。

<!--
The nftables API is the successor to the iptables API and is designed
to provide better performance and scalability than iptables. The
`nftables` proxy mode is able to process changes to service endpoints
faster and more efficiently than the `iptables` mode, and is also able
to more efficiently process packets in the kernel (though this only
becomes noticeable in clusters with tens of thousands of services).
-->
nftables API 是 iptables API 的后继，旨在提供比 iptables 更好的性能和可扩展性。
`nftables` 代理模式能够比 `iptables` 模式更快、更高效地处理 Service 端点的变化，
并且在内核中处理数据包的效率也更高（尽管这只有在拥有数万个 Service 的集群中才会比较明显）。

<!--
As of Kubernetes {{< skew currentVersion >}}, the `nftables` mode is
still relatively new, and may not be compatible with all network
plugins; consult the documentation for your network plugin.
-->

在 Kubernetes {{< skew currentVersion >}} 中，`nftables`
模式仍然相对较新，可能还不兼容所有的网络插件；请查阅你的网络插件文档。

<!--
#### Migrating from `iptables` mode to `nftables`

Users who want to switch from the default `iptables` mode to the
`nftables` mode should be aware that some features work slightly
differently the `nftables` mode:
-->
#### 从 `iptables` 模式到 `nftables` 模式的迁移 {#migrating-from-iptables-mode-to-nftables}

想要从默认的 `iptables` 模式切换到 `nftables` 模式的用户应注意，在
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
- **NodePort 接口**：在 `iptables` 模式下，默认情况下，
  [NodePort Service](/zh-cn/docs/concepts/services-networking/service/#type-nodeport) 可以在所有本地
  IP 地址上访问。这通常不是用户想要的，因此 `nftables` 模式默认使用 `--nodeport-addresses primary`，这意味着
  `type: NodePort` Service 只能通过节点上的主 IPv4 和/或 IPv6 地址进行访问。
  你可以通过为该选项指定一个明确的值来覆盖此设置：例如，使用
  `--nodeport-addresses 0.0.0.0/0` 以监听所有（本地）IPv4 IP。

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
  `--nodeport-addresses` 范围包括 `127.0.0.1`（且未传递 `--iptables-localhost-nodeports false` 选项），
  则 `type: NodePort` Service 甚至可以在 "localhost" (`127.0.0.1`) 上访问。
  在 `nftables` 模式（和 `ipvs` 模式）下，这将不起作用。如果你不确定是否依赖此功能，
  可以检查 kube-proxy 的 `iptables_localhost_nodeports_accepted_packets_total` 指标；
  如果该值非 0，则表示某些客户端已通过本地主机或本地回路连接到 `type: NodePort` Service。

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
- **NodePort 与防火墙的交互**：kube-proxy 的 `iptables` 模式尝试与过于激进的防火墙兼容；
  对于每个 `type: NodePort` Service，它会添加规则以接受该端口的入站流量，以防该流量被防火墙阻止。
  这种方法不适用于基于 nftables 的防火墙，因此 kube-proxy 的 `nftables` 模式在这里不会做任何事情；
  如果你有本地防火墙，必须确保其配置正确以允许 Kubernetes 流量通过（例如，允许整个 NodePort 范围的入站流量）。

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
- **Conntrack BUG 规避**：6.1 之前的 Linux 内核存在一个 BUG，可能导致与 Service IP 的长时间
   TCP 连接被关闭，并出现 “Connection reset by peer（对方重置连接）”的错误。kube-proxy 的 `iptables`
  模式为此错误配备了一个修复程序，但后来发现该修复程序在某些集群中会导致其他问题。
  `nftables` 模式默认不安装任何修复程序，但你可以检查 kube-proxy 的
  `iptables_ct_state_invalid_dropped_packets_total`
  指标，看看你的集群是否依赖于该修复程序，如果是，你可以使用 `--conntrack-tcp-be-liberal`
  选项运行 kube-proxy，以在 `nftables` 模式下解决该问题。

<!--
### `kernelspace` proxy mode {#proxy-mode-kernelspace}

_This proxy mode is only available on Windows nodes._
-->
### `kernelspace` 代理模式   {#proxy-mode-kernelspace}

**此代理模式仅适用于 Windows 节点。**

<!--
The kube-proxy configures packet filtering rules in the Windows _Virtual Filtering Platform_ (VFP),
an extension to Windows vSwitch. These rules process encapsulated packets within the node-level
virtual networks, and rewrite packets so that the destination IP address (and layer 2 information)
is correct for getting the packet routed to the correct destination.
The Windows VFP is analogous to tools such as Linux `nftables` or `iptables`. The Windows VFP extends
the _Hyper-V Switch_, which was initially implemented to support virtual machine networking.
-->
kube-proxy 在 Windows **虚拟过滤平台**（VFP）（Windows vSwitch 的扩展）中配置数据包过滤规则。
这些规则处理节点级虚拟网络中的封装数据包，并重写数据包，使目标 IP 地址（和第 2 层信息）正确，
以便将数据包路由到正确的目的地。Windows VFP 类似于 Linux `nftables` 或 `iptables` 等工具。
Windows VFP 是最初为支持虚拟机网络而实现的 **Hyper-V Switch** 的扩展。

<!--
When a Pod on a node sends traffic to a virtual IP address, and the kube-proxy selects a Pod on
a different node as the load balancing target, the `kernelspace` proxy mode rewrites that packet
to be destined to the target backend Pod. The Windows _Host Networking Service_ (HNS) ensures that
packet rewriting rules are configured so that the return traffic appears to come from the virtual
IP address and not the specific backend Pod.
-->
当节点上的 Pod 将流量发送到某虚拟 IP 地址，且 kube-proxy 选择不同节点上的 Pod
作为负载均衡目标时，`kernelspace` 代理模式会重写该数据包以将其发送到对应目标后端 Pod。
Windows 主机网络服务（HSN）会配置数据包重写规则，确保返回流量看起来来自虚拟 IP 地址，
而不是特定的后端 Pod。

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
作为基本操作的替代方案，托管服务后端 Pod 的节点可以直接应用数据包重写，
而不用将此工作交给运行客户端 Pod 的节点来执行。这称为 **Direct Server Return（DSR）**。

<!--
To use this, you must run kube-proxy with the `--enable-dsr` command line argument **and**
enable the `WinDSR` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).

Direct server return also optimizes the case for Pod return traffic even when both Pods
are running on the same node.
-->
要使用这种技术，你必须使用 `--enable-dsr` 命令行参数运行 kube-proxy **并**启用
`WinDSR` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

即使两个 Pod 在同一节点上运行，DSR 也可优化 Pod 的返回流量。

<!--
## Session affinity
-->
## 会话亲和性    {#session-affinity}

<!--
In these proxy models, the traffic bound for the Service's IP:Port is
proxied to an appropriate backend without the clients knowing anything
about Kubernetes or Services or Pods.
-->
在这些代理模型中，绑定到 Service IP:Port 的流量被代理到合适的后端，
客户端不需要知道任何关于 Kubernetes、Service 或 Pod 的信息。

<!--
If you want to make sure that connections from a particular client
are passed to the same Pod each time, you can select the session affinity based
on the client's IP addresses by setting `.spec.sessionAffinity` to `ClientIP`
for a Service (the default is `None`).
-->
如果要确保来自特定客户端的连接每次都传递给同一个 Pod，
你可以通过设置 Service 的 `.spec.sessionAffinity` 为 `ClientIP`
来设置基于客户端 IP 地址的会话亲和性（默认为 `None`）。

<!--
### Session stickiness timeout
-->
### 会话粘性超时     {#session-stickiness-timeout}

<!--
You can also set the maximum session sticky time by setting
`.spec.sessionAffinityConfig.clientIP.timeoutSeconds` appropriately for a Service.
(the default value is 10800, which works out to be 3 hours).
-->
你还可以通过设置 Service 的 `.spec.sessionAffinityConfig.clientIP.timeoutSeconds`
来设置最大会话粘性时间（默认值为 10800，即 3 小时）。

{{< note >}}
<!--
On Windows, setting the maximum session sticky time for Services is not supported.
-->
在 Windows 上不支持为 Service 设置最大会话粘性时间。
{{< /note >}}

<!--
## IP address assignment to Services
-->
## 将 IP 地址分配给 Service  {#ip-address-assignment-to-services}

<!--
Unlike Pod IP addresses, which actually route to a fixed destination,
Service IPs are not actually answered by a single host. Instead, kube-proxy
uses packet processing logic (such as Linux iptables) to define _virtual_ IP
addresses which are transparently redirected as needed.
-->
与实际路由到固定目标的 Pod IP 地址不同，Service IP 实际上不是由单个主机回答的。
相反，kube-proxy 使用数据包处理逻辑（例如 Linux 的 iptables）
来定义**虚拟** IP 地址，这些地址会按需被透明重定向。

<!--
When clients connect to the VIP, their traffic is automatically transported to an
appropriate endpoint. The environment variables and DNS for Services are actually
populated in terms of the Service's virtual IP address (and port).
-->
当客户端连接到 VIP 时，其流量会自动传输到适当的端点。
实际上，Service 的环境变量和 DNS 是根据 Service 的虚拟 IP 地址（和端口）填充的。

<!--
### Avoiding collisions
-->
### 避免冲突      {#avoiding-collisions}

<!--
One of the primary philosophies of Kubernetes is that you should not be
exposed to situations that could cause your actions to fail through no fault
of your own. For the design of the Service resource, this means not making
you choose your own IP address if that choice might collide with
someone else's choice.  That is an isolation failure.
-->
Kubernetes 的主要哲学之一是，
你不应需要在完全不是你的问题的情况下面对可能导致你的操作失败的情形。
对于 Service 资源的设计，也就是如果你选择的端口号可能与其他人的选择冲突，
就不应该让你自己选择 IP 地址。这是一种失败隔离。

<!--
In order to allow you to choose an IP address for your Services, we must
ensure that no two Services can collide. Kubernetes does that by allocating each
Service its own IP address from within the `service-cluster-ip-range`
CIDR range that is configured for the {{< glossary_tooltip term_id="kube-apiserver" text="API Server" >}}.
-->
为了允许你为 Service 选择 IP 地址，我们必须确保没有任何两个 Service 会发生冲突。
Kubernetes 通过从为 {{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}}配置的
`service-cluster-ip-range` CIDR 范围内为每个 Service 分配自己的 IP 地址来实现这一点。

<!--
### IP address allocation tracking

To ensure each Service receives a unique IP address, an internal allocator atomically
updates a global allocation map in {{< glossary_tooltip term_id="etcd" >}}
prior to creating each Service. The map object must exist in the registry for
Services to get IP address assignments, otherwise creations will
fail with a message indicating an IP address could not be allocated.
-->
### IP 地址分配追踪 {#ip-address-allocation-tracking}

为了确保每个 Service 都获得唯一的 IP 地址，内部分配器在创建每个 Service
之前更新 {{< glossary_tooltip term_id="etcd" >}} 中的全局分配映射，这种更新操作具有原子性。
映射对象必须存在于数据库中，这样 Service 才能获得 IP 地址分配，
否则创建将失败，并显示无法分配 IP 地址。

<!--
In the control plane, a background controller is responsible for creating that
map (needed to support migrating from older versions of Kubernetes that used
in-memory locking). Kubernetes also uses controllers to check for invalid
assignments (for example: due to administrator intervention) and for cleaning up allocated
IP addresses that are no longer used by any Services.
-->
在控制平面中，后台控制器负责创建该映射（从使用内存锁定的旧版本的 Kubernetes 迁移时需要这一映射）。
Kubernetes 还使用控制器来检查无效的分配（例如，因管理员干预而导致无效分配）
以及清理已分配但没有 Service 使用的 IP 地址。

<!--
#### IP address allocation tracking using the Kubernetes API {#ip-address-objects}
-->
#### 使用 Kubernetes API 跟踪 IP 地址分配 {#ip-address-objects}

{{< feature-state feature_gate_name="MultiCIDRServiceAllocator" >}}

<!--
The control plane replaces the existing etcd allocator with a revised implementation
that uses IPAddress and ServiceCIDR objects instead of an internal global allocation map.
Each cluster IP address associated to a Service then references an IPAddress object.
-->
控制平面用一个改进后的实现替换现有的 etcd 分配器，使用 IPAddress 和 ServiceCIDR
对象而不是内部的全局分配映射。与某 Service 关联的每个 ClusterIP 地址将有一个对应的
IPAddress 对象。

<!--
Enabling the feature gate also replaces a background controller with an alternative
that handles the IPAddress objects and supports migration from the old allocator model.
Kubernetes {{< skew currentVersion >}} does not support migrating from IPAddress
objects to the internal allocation map.
-->
启用该特性门控还会用替代实现将后台控制器替换，来处理 IPAddress 对象并支持从旧的分配器模型迁移。
Kubernetes {{< skew currentVersion >}} 不支持从 IPAddress 对象迁移到内部分配映射。

<!--
One of the main benefits of the revised allocator is that it removes the size limitations
for the IP address range that can be used for the cluster IP address of Services.
With `MultiCIDRServiceAllocator` enabled, there are no limitations for IPv4, and for IPv6
you can use IP address netmasks that are a /64 or smaller (as opposed to /108 with the
legacy implementation).
-->
改进后的分配器的主要优点之一是它取消了对可用于 Service 的集群 IP 地址的范围大小限制。
启用 `MultiCIDRServiceAllocator` 后，对 IPv4 没有大小限制，而对于
IPv6，你可以使用等于或小于 /64 的 IP 地址子网掩码（与旧实现中的 /108 相比）。

<!--
Making IP address allocations available via the API means that you as a cluster administrator
can allow users to inspect the IP addresses assigned to their Services.
Kubernetes extensions, such as the [Gateway API](/docs/concepts/services-networking/gateway/),
can use the IPAddress API to extend Kubernetes' inherent networking capabilities.
-->
通过 API 提供 IP 地址分配，意味着作为集群管理员，你可以允许用户检查分配给他们的 Service 的 IP 地址。
Kubernetes 扩展（例如 [Gateway API](/zh-cn/docs/concepts/services-networking/gateway/)）
可以使用 IPAddress API 来扩展 Kubernetes 的固有网络功能。

<!--
Here is a brief example of a user querying for IP addresses:
-->
以下是用户查询 IP 地址的简短示例：

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
Kubernetes 还允许用户使用 ServiceCIDR 对象动态定义 Service 的可用 IP 范围。
在引导过程中，集群会根据 kube-apiserver 的 `--service-cluster-ip-range`
命令行参数的值创建一个名为 `kubernetes` 的默认 ServiceCIDR 对象：

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
用户可以创建或删除新的 ServiceCIDR 对象来管理 Service 的可用 IP 范围：

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
Kubernetes 发行版或集群管理员可能希望控制集群中新增的 Service CIDR，确保其不会与集群中的其他网络发生冲突，
只属于特定的 IP 范围，或只是简单地保留每个集群仅使用一个 ServiceCIDR 的现有行为。
为实现这一目标，可以使用如下示例的验证准入策略：

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
### Service 虚拟 IP 地址的地址段 {#service-ip-static-sub-range}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!--
Kubernetes divides the `ClusterIP` range into two bands, based on
the size of the configured `service-cluster-ip-range` by using the following formula
`min(max(16, cidrSize / 16), 256)`. That formula means the result is _never less than 16 or
more than 256, with a graduated step function between them_.
-->
Kubernetes 根据配置的 `service-cluster-ip-range` 的大小使用公式
`min(max(16, cidrSize / 16), 256)` 将 `ClusterIP` 范围分为两段。
该公式意味着结果**介于 16 和 256 之间，并在上下界之间存在渐进阶梯函数的分配**。

<!--
Kubernetes prefers to allocate dynamic IP addresses to Services by choosing from the upper band,
which means that if you want to assign a specific IP address to a `type: ClusterIP`
Service, you should manually assign an IP address from the **lower** band. That approach
reduces the risk of a conflict over allocation.
-->
Kubernetes 优先通过从高段中选择来为 Service 分配动态 IP 地址，
这意味着如果要将特定 IP 地址分配给 `type: ClusterIP` Service，
则应手动从**低**段中分配 IP 地址。该方法降低了分配导致冲突的风险。

<!--
## Traffic policies
-->
## 流量策略 {#traffic-policies}

<!--
You can set the `.spec.internalTrafficPolicy` and `.spec.externalTrafficPolicy` fields
to control how Kubernetes routes traffic to healthy (“ready”) backends.
-->
你可以设置 `.spec.internalTrafficPolicy` 和 `.spec.externalTrafficPolicy`
字段来控制 Kubernetes 如何将流量路由到健康（“就绪”）的后端。

<!--
### Internal traffic policy
-->
### 内部流量策略 {#internal-traffic-policy}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!--
You can set the `.spec.internalTrafficPolicy` field to control how traffic from
internal sources is routed. Valid values are `Cluster` and `Local`. Set the field to
`Cluster` to route internal traffic to all ready endpoints and `Local` to only route
to ready node-local endpoints. If the traffic policy is `Local` and there are no
node-local endpoints, traffic is dropped by kube-proxy.
-->
你可以设置 `.spec.internalTrafficPolicy` 字段来控制来自内部源的流量如何被路由。
有效值为 `Cluster` 和 `Local`。
将字段设置为 `Cluster` 会将内部流量路由到所有准备就绪的端点，
将字段设置为 `Local` 仅会将流量路由到本地节点准备就绪的端点。
如果流量策略为 `Local` 但没有本地节点端点，那么 kube-proxy 会丢弃该流量。

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
你可以设置 `.spec.externalTrafficPolicy` 字段来控制从外部源路由的流量。
有效值为 `Cluster` 和 `Local`。
将字段设置为 `Cluster` 会将外部流量路由到所有准备就绪的端点，
将字段设置为 `Local` 仅会将流量路由到本地节点上准备就绪的端点。
如果流量策略为 `Local` 并且没有本地节点端点，
那么 kube-proxy 不会转发与相关 Service 相关的任何流量。

<!--
If `Cluster` is specified, all nodes are eligible load balancing targets _as long as_
the node is not being deleted and kube-proxy is healthy. In this mode: load balancer
health checks are configured to target the service proxy's readiness port and path.
In the case of kube-proxy this evaluates to: `${NODE_IP}:10256/healthz`. kube-proxy
will return either an HTTP code 200 or 503. kube-proxy's load balancer health check
endpoint returns 200 if:
-->
如果指定了 `Cluster`，则所有节点都可以作为负载均衡目标，**只要**节点没有被删除且
kube-proxy 是健康的。在这种模式下：负载均衡器健康检查被配置为针对服务代理的就绪端口和路径。对于
kube-proxy，这个健康检查端点为：`${NODE_IP}:10256/healthz`。kube-proxy 将返回 HTTP
状态码 200 或 503。如果满足以下条件，kube-proxy 的负载均衡器健康检查端点将返回 200：

<!--
1. kube-proxy is healthy, meaning:

   it's able to progress programming the network and isn't timing out while doing
   so (the timeout is defined to be: **2 × `iptables.syncPeriod`**); and

1. the node is not being deleted (there is no deletion timestamp set for the Node).
-->
1. kube-proxy 是健康的，意味着：

   它能够继续进行网络编程，并且在此过程中不会超时（超时时间定义为：**2 × `iptables.syncPeriod`**）；并且

2. 节点没有被删除（Node 对象上没有设置删除时间戳）。

<!--
kube-proxy returns 503 and marks the node as not
eligible when it's being deleted because it supports connection
draining for terminating nodes. A couple of important things occur from the point
of view of a Kubernetes-managed load balancer when a node _is being_ / _is_ deleted.
-->
kube-proxy 在节点被删除时返回 503 并将节点标记为不符合条件的原因在于
kube-proxy 对处于终止过程中的节点支持连接腾空。从 Kubernetes 管理的负载均衡器的角度来看，
当节点**正在**/ **已**被删除时，会发生一些重要的事情。

<!--
While deleting:

* kube-proxy will start failing its readiness probe and essentially mark the
  node as not eligible for load balancer traffic. The load balancer health
  check failing causes load balancers which support connection draining to
  allow existing connections to terminate, and block new connections from
  establishing.
-->
当节点被删除时：

* kube-proxy 的就绪探针将开始失败，并将该节点标记为不胜任接收负载均衡器流量。
  负载均衡器健康检查失败会导致支持连接排空的负载均衡器允许现有连接终止，并阻止新连接建立。

<!--
When deleted:

* The service controller in the Kubernetes cloud controller manager removes the
  node from the referenced set of eligible targets. Removing any instance from
  the load balancer's set of backend targets immediately terminates all
  connections. This is also the reason kube-proxy first fails the health check
  while the node is deleting.
-->
当节点被删除后：

* Kubernetes 云控制器管理器中的服务控制器会将节点从所引用的候选目标集中移除。
  从负载均衡器的后端目标集中移除任何实例会立即终止所有连接。
  这也是 kube-proxy 在节点删除过程中首先使健康检查失败的原因。

<!--
It's important to note for Kubernetes vendors that if any vendor configures the
kube-proxy readiness probe as a liveness probe: that kube-proxy will start
restarting continuously when a node is deleting until it has been fully deleted.
kube-proxy exposes a `/livez` path which, as opposed to the `/healthz` one, does
**not** consider the Node's deleting state and only its progress programming the
network. `/livez` is therefore the recommended path for anyone looking to define
a livenessProbe for kube-proxy.
-->
需要注意的是，对于 Kubernetes 供应商，如果任何供应商将
kube-proxy 的就绪探针配置为存活探针：当节点正在删除直到完全删除时，kube-proxy
将开始不断重启。kube-proxy 公开了一个 `/livez` 路径，与 `/healthz` 路径不同，
`/livez` 路径**不**考虑节点的删除状态，仅考虑其网络编程进度。因此，对于任何希望为
 kube-proxy 定义存活探针的人来说，推荐使用 `/livez` 路径。

<!--
Users deploying kube-proxy can inspect both the readiness / liveness state by
evaluating the metrics: `proxy_livez_total` / `proxy_healthz_total`. Both
metrics publish two series, one with the 200 label and one with the 503 one.
-->
部署 kube-proxy 的用户可以通过评估指标 `proxy_livez_total` / `proxy_healthz_total`
来检查就绪/存活状态。这两个指标都发布了两个序列，一个带有 200 标签，另一个带有 503 标签。

<!--
For `Local` Services: kube-proxy will return 200 if

1. kube-proxy is healthy/ready, and
1. has a local endpoint on the node in question.

Node deletion does **not** have an impact on kube-proxy's return
code for what concerns load balancer health checks. The reason for this is:
deleting nodes could end up causing an ingress outage should all endpoints
simultaneously be running on said nodes.
-->
对于 `Local` Service：如果满足以下条件，kube-proxy 将返回 200：

1. kube-proxy 是健康/就绪的，并且
2. 在相关节点上有一个本地端点。

对于负载均衡器健康检查而言，节点删除**不会**对 kube-proxy
的返回代码产生影响。原因是：如果所有端点同时在上述节点上运行，则删除节点最终可能会导致入站流量中断。

<!--
The Kubernetes project recommends that cloud provider integration code
configures load balancer health checks that target the service proxy's healthz
port. If you are using or implementing your own virtual IP implementation,
that people can use instead of kube-proxy, you should set up a similar health
checking port with logic that matches the kube-proxy implementation.
-->
Kubernetes 项目建议云提供商集成代码配置负载均衡器健康检查，以针对服务代理的 healthz 端口。
如果你正在使用或实现自己的虚拟 IP 实现，供人们使用它替代 kube-proxy，你应该设置一个类似的健康检查端口，
其逻辑应与 kube-proxy 实现相匹配。

<!--
### Traffic to terminating endpoints
-->
### 流向正终止的端点的流量  {#traffic-to-terminating-endpoints}

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
如果为 kube-proxy 启用了 `ProxyTerminatingEndpoints`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)且流量策略为 `Local`，
则节点的 kube-proxy 将使用更复杂的算法为 Service 选择端点。
启用此特性时，kube-proxy 会检查节点是否具有本地端点以及是否所有本地端点都标记为正在终止过程中。
如果有本地端点并且**所有**本地端点都被标记为处于终止过程中，
则 kube-proxy 会将转发流量到这些正在终止过程中的端点。
否则，kube-proxy 会始终选择将流量转发到并未处于终止过程中的端点。

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
这种对处于终止过程中的端点的转发行为使得 `NodePort` 和 `LoadBalancer` Service
能有条不紊地腾空设置了 `externalTrafficPolicy: Local` 时的连接。

当一个 Deployment 被滚动更新时，处于负载均衡器后端的节点可能会将该 Deployment 的 N 个副本缩减到
0 个副本。在某些情况下，外部负载均衡器可能在两次执行健康检查探针之间将流量发送到具有 0 个副本的节点。
将流量路由到处于终止过程中的端点可确保正在缩减 Pod 的节点能够正常接收流量，
并逐渐降低指向那些处于终止过程中的 Pod 的流量。
到 Pod 完成终止时，外部负载均衡器应该已经发现节点的健康检查失败并从后端池中完全移除该节点。

<!--
## Traffic Distribution control
-->
## 流量分发控制 {#traffic-distribution}

<!--
The `spec.trafficDistribution` field within a Kubernetes Service allows you to
express preferences for how traffic should be routed to Service endpoints.

`PreferSameZone`
: This prioritizes sending traffic to endpoints in the same zone as the client.
  The EndpointSlice controller updates EndpointSlices with `hints` to
  communicate this preference, which kube-proxy then uses for routing decisions.
  If a client's zone does not have any available endpoints, traffic will be
  routed cluster-wide for that client.
-->
Kubernetes Service 中的 `spec.trafficDistribution` 字段允许你表达对流量如何路由到 Service 端点的偏好。

`PreferClose`  
: 这意味着优先将流量发送到与客户端位于同一区域的端点。
  EndpointSlice 控制器使用 `hints` 来更新 EndpointSlices 以传达此偏好，
  之后，kube-proxy 会使用这些提示进行路由决策。如果客户端的区域没有可用的端点，
  则流量将在整个集群范围内路由。

<!--
`PreferSameNode`
: This prioritizes sending traffic to endpoints on the same node as the client.
  As with `PreferSameZone`, the EndpointSlice controller updates
  EndpointSlices with `hints` indicating that a slice should be used for a
  particular node. If a client's node does not have any available endpoints,
  then the service proxy will fall back to "same zone" behavior, or cluster-wide
  if there are no same-zone endpoints either.
-->
`PreferSameNode`  
: 这意味着优先将流量发送到与客户端位于同一节点上的端点。
  与 `PreferSameZone` 一样，EndpointSlice 控制器会更新 EndpointSlice，
  添加 `hints` 表明某个切片应被用于特定节点。如果某客户端所在节点没有可用的端点，
  服务代理将回退至“同一区域”行为；如果同一区域也没有可用端点，则回退为集群范围内路由。

<!--
`PreferClose` (deprecated)
: This is an older alias for `PreferSameZone` that is less clear about
  the semantics.
-->
`PreferClose`（已弃用）
: 这是 `PreferSameZone` 的一个较旧的别名，其语义不太明确。


<!--
In the absence of any value for `trafficDistribution`, the default strategy is
to distribute traffic evenly to all endpoints in the cluster.
-->
如果 `trafficDistribution` 没有任何值，默认策略是将流量均匀分发给集群中的所有端点。

<!--
### Comparison with `service.kubernetes.io/topology-mode: Auto`

The `trafficDistribution` field with `PreferSameZone`, and the older "Topology-Aware
Routing" feature using the `service.kubernetes.io/topology-mode: Auto`
annotation both aim to prioritize same-zone traffic. However, there is a key
difference in their approaches:
-->
### 与 `service.kubernetes.io/topology-mode: Auto` 的比较 {#comparison-with-service-kubernetes-io-topology-mode-auto}

`trafficDistribution` 字段中的 `PreferSameZone`
以及使用 `service.kubernetes.io/topology-mode: Auto`
注解的旧版“拓扑感知路由”特性都旨在优先处理同一区域的流量。
然而，它们的方法存在一些关键差异：

<!--
* `service.kubernetes.io/topology-mode: Auto` attempts to distribute traffic
  proportionally across zones based on allocatable CPU resources. This heuristic
  includes safeguards (such as the [fallback
  behavior](/docs/concepts/services-networking/topology-aware-routing/#three-or-more-endpoints-per-zone)
  for small numbers of endpoints), sacrificing some predictability in favor of
  potentially better load balancing.
-->
* `service.kubernetes.io/topology-mode: Auto`：尝试根据可分配的 CPU
  资源在各区域之间按比例分配流量。此启发式方法包括一些保障措施
  （例如针对少量端点的[回退行为](/zh-cn/docs/concepts/services-networking/topology-aware-routing/#three-or-more-endpoints-per-zone)），
  牺牲一些可预测性以换取更好的负载均衡。

<!--
* `trafficDistribution: PreferClose`: This approach aims to be slightly simpler
  and more predictable: "If there are endpoints in the zone, they will receive
  all traffic for that zone, if there are no endpoints in a zone, the traffic
  will be distributed to other zones". While the approach may offer more
  predictability, it does mean that you are in control of managing a [potential
  overload](#considerations-for-using-traffic-distribution-control).

* `trafficDistribution: PreferSameZone` aims to be simpler and more predictable:
  "If there are endpoints in the zone, they will receive all traffic for that
  zone, if there are no endpoints in a zone, the traffic will be distributed to
  other zones". This approach offers more predictability, but it means that you
  are responsible for [avoiding endpoint
  overload](#considerations-for-using-traffic-distribution-control).
-->
* `trafficDistribution: PreferSameZone`：这种方法偏重更简单和更可预测：
  “如果区域内有端点，它们将接收该区域的所有流量；如果区域内没有端点，流量将分配到其他区域”。
  这种方法提供更多的可预测性，但这意味着你需要负责[避免端点过载](#considerations-for-using-traffic-distribution-control)。

<!--
If the `service.kubernetes.io/topology-mode` annotation is set to `Auto`, it
will take precedence over `trafficDistribution`. The annotation may be deprecated
in the future in favor of the `trafficDistribution` field.
-->
如果 `service.kubernetes.io/topology-mode` 注解设置为 `Auto`，它将优先于
`trafficDistribution`。该注解将来可能会被弃用，取而代之的是 `trafficDistribution` 字段。

<!--
### Interaction with Traffic Policies

When compared to the `trafficDistribution` field, the traffic policy fields
(`externalTrafficPolicy` and `internalTrafficPolicy`) are meant to offer a
stricter traffic locality requirements. Here's how `trafficDistribution`
interacts with them:
-->
### 与流量策略的交互 {#interaction-with-traffic-policies}

与 `trafficDistribution` 字段相比，流量策略字段
（`externalTrafficPolicy` 和 `internalTrafficPolicy`）旨在提供更严格的流量局域化要求。
以下是 `trafficDistribution` 与它们的交互方式：

<!--
* Precedence of Traffic Policies: For a given Service, if a traffic policy
  (`externalTrafficPolicy` or `internalTrafficPolicy`) is set to `Local`, it
  takes precedence over `trafficDistribution` for the corresponding
  traffic type (external or internal, respectively).
-->
* 流量策略的优先序：对于给定的 Service，如果流量策略
  （`externalTrafficPolicy` 或 `internalTrafficPolicy`）设置为 `Local`，
  则它优先于相应流量类型（分别为外部或内部）的 `trafficDistribution`。

<!--
* `trafficDistribution` Influence: For a given Service, if a traffic policy
  (`externalTrafficPolicy` or `internalTrafficPolicy`) is set to `Cluster` (the
  default), or if the fields are not set, then `trafficDistribution`
  guides the routing behavior for the corresponding traffic type
  (external or internal, respectively). This means that an attempt will be made
  to route traffic to an endpoint that is in the same zone as the client.
-->
* `trafficDistribution` 的影响：对于给定的 Service，如果流量策略
  （`externalTrafficPolicy` 或 `internalTrafficPolicy`）设置为 `Cluster`（默认值），
  或者这些字段未设置，那么 `trafficDistribution` 将指导相应流量类型
  （分别为外部或内部）的路由行为。这意味着 kube-proxy 将尝试将流量路由到与客户端位于同一区域的端点。

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
### 使用流量分配控制的注意事项 {#considerations-for-using-traffic-distribution-control}

使用 `trafficDistribution` 的 Service 将尝试将流量路由到适当拓扑中的（健康的）端点，
即使这意味着某些端点接收的流量远远超过其他端点。
如果某个区域内的端点数量不足，它们可能会过载。
如果传入流量在各区域之间分布不均，这种情况更有可能发生。为减轻这种情况，请考虑以下策略：

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
* [Pod 拓扑分布约束](/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/)：
  使用 Pod 拓扑分布约束在各区域之间更均匀地分布你的 Pod。

* 区域特定的 Deployment：如果你预计会看到不均衡的流量模式，
  可以为每个区域创建一个单独的 Deployment。这种方法允许独立扩展各个工作负载。
  生态系统中还有一些 Kubernetes 项目之外的工作负载管理插件，可以在这方面提供帮助。

## {{% heading "whatsnext" %}}

<!--
To learn more about Services,
read [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/).
-->
要了解有关 Service 的更多信息，
请阅读[使用 Service 连接应用](/zh-cn/docs/tutorials/services/connect-applications-service/)。

<!--
You can also:

* Read about [Services](/docs/concepts/services-networking/service/) as a concept
* Read about [Ingresses](/docs/concepts/services-networking/ingress/) as a concept
* Read the [API reference](/docs/reference/kubernetes-api/service-resources/service-v1/) for the Service API
-->
也可以：

* 阅读 [Service](/zh-cn/docs/concepts/services-networking/service/) 了解其概念
* 阅读 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/) 了解其概念
* 阅读 [API 参考](/zh-cn/docs/reference/kubernetes-api/service-resources/service-v1/)进一步了解 Service API
