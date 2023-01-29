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
cluster runs a [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/)
(unless you have deployed your own alternative component in place of `kube-proxy`).
-->
Kubernetes 集群中的每个{{< glossary_tooltip term_id="node" text="节点" >}}会运行一个
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
以外的{{< glossary_tooltip term_id="service" text="服务">}}，实现**虚拟 IP** 机制。

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
cases until you reboot.  Thus, running kube-proxy is something that should only be done
by an administrator which understands the consequences of having a low level, privileged
network proxying service on a computer.  Although the `kube-proxy` executable supports a
`cleanup` function, this function is not an official feature and thus is only available
to use as-is.
-->
在下文中，你可以了解到 kube-proxy 各种实现方式的工作原理。
总的来说，你应该注意到，在运行 `kube-proxy` 时，
可能会修改内核级别的规则（例如，可能会创建 iptables 规则），
在某些情况下，这些规则直到重启才会被清理。
因此，运行 kube-proxy 这件事应该只由了解在计算机上使用低级别、特权网络代理服务会带来的后果的管理员执行。
尽管 `kube-proxy` 可执行文件支持 `cleanup` 功能，但这个功能并不是官方特性，因此只能根据具体情况使用。

<!--
<a id="example"></a>
Some of the details in this reference refer to an example: the backend Pods for a stateless
image-processing workload, running with three replicas. Those replicas are
fungible&mdash;frontends do not care which backend they use.  While the actual Pods that
compose the backend set may change, the frontend clients should not need to be aware of that,
nor should they need to keep track of the set of backends themselves.
-->
<a id="example"></a>
本文中的一些细节会引用这样一个例子：
运行了 3 个 Pod 副本的无状态图像处理后端工作负载。
这些副本是可互换的；前端不需要关心它们调用了哪个后端副本。
即使组成这一组后端程序的 Pod 实际上可能会发生变化，
前端客户端不应该也没必要知道，而且也不需要跟踪这一组后端的状态。

<!-- body -->

<!--
## Proxy modes
-->
## 代理模式 {#proxy-modes}

<!--
Note that the kube-proxy starts up in different modes, which are determined by its configuration.

- The kube-proxy's configuration is done via a ConfigMap, and the ConfigMap for
  kube-proxy effectively deprecates the behavior for almost all of the flags for
  the kube-proxy.
- The ConfigMap for the kube-proxy does not support live reloading of configuration.
- The ConfigMap parameters for the kube-proxy cannot all be validated and verified on startup.
  For example, if your operating system doesn't allow you to run iptables commands,
  the standard kernel kube-proxy implementation will not work.
  Likewise, if you have an operating system which doesn't support `netsh`,
  it will not run in Windows userspace mode.
-->
注意，kube-proxy 会根据不同配置以不同的模式启动。

- kube-proxy 的配置是通过 ConfigMap 完成的，kube-proxy 的 ConfigMap 实际上弃用了 kube-proxy 大部分标志的行为。
- kube-proxy 的 ConfigMap 不支持配置的实时重新加载。
- kube-proxy 不能在启动时验证和检查所有的 ConfigMap 参数。
  例如，如果你的操作系统不允许你运行 iptables 命令，标准的 kube-proxy 内核实现将无法工作。
  同样，如果你的操作系统不支持 `netsh`，它也无法在 Windows 用户空间模式下运行。

<!--
### `iptables` proxy mode {#proxy-mode-iptables}
-->
### `iptables` 代理模式 {#proxy-mode-iptables}

<!--
In this mode, kube-proxy watches the Kubernetes control plane for the addition and
removal of Service and EndpointSlice objects. For each Service, it installs
iptables rules, which capture traffic to the Service's `clusterIP` and `port`,
and redirect that traffic to one of the Service's
backend sets. For each endpoint, it installs iptables rules which
select a backend Pod.
-->
在这种模式下，kube-proxy 监视 Kubernetes 控制平面，获知对 Service 和 EndpointSlice 对象的添加和删除操作。
对于每个 Service，kube-proxy 会添加 iptables 规则，这些规则捕获流向 Service 的 `clusterIP` 和 `port` 的流量，
并将这些流量重定向到 Service 后端集合中的其中之一。
对于每个端点，它会添加指向一个特定后端 Pod 的 iptables 规则。

<!--
By default, kube-proxy in iptables mode chooses a backend at random.

Using iptables to handle traffic has a lower system overhead, because traffic
is handled by Linux netfilter without the need to switch between userspace and the
kernel space. This approach is also likely to be more reliable.
-->
默认情况下，iptables 模式下的 kube-proxy 会随机选择一个后端。

使用 iptables 处理流量的系统开销较低，因为流量由 Linux netfilter 处理，
无需在用户空间和内核空间之间切换。这种方案也更为可靠。

<!--
If kube-proxy is running in iptables mode and the first Pod that's selected
does not respond, the connection fails. This is different from the old `userspace`
mode: in that scenario, kube-proxy would detect that the connection to the first
Pod had failed and would automatically retry with a different backend Pod.
-->
如果 kube-proxy 以 iptables 模式运行，并且它选择的第一个 Pod 没有响应，
那么连接会失败。这与用户空间模式不同：
在后者这种情况下，kube-proxy 会检测到与第一个 Pod 的连接失败，
并会自动用不同的后端 Pod 重试。

<!--
You can use Pod [readiness probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)
to verify that backend Pods are working OK, so that kube-proxy in iptables mode
only sees backends that test out as healthy. Doing this means you avoid
having traffic sent via kube-proxy to a Pod that's known to have failed.
-->
你可以使用 Pod [就绪探针](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)来验证后端 Pod 是否健康。
这样可以避免 kube-proxy 将流量发送到已知失败的 Pod 上。

<!--
{{< figure src="/images/docs/services-iptables-overview.svg" title="Virtual IP mechanism for Services, using iptables mode" class="diagram-medium" >}}
-->
{{< figure src="/images/docs/services-iptables-overview.svg" title="iptables 模式下 Service 的虚拟 IP 机制" class="diagram-medium" >}}

<!--
#### Example {#packet-processing-iptables}
-->
#### 示例 {#packet-processing-iptables}

<!--
As an example, consider the image processing application described [earlier](#example)
in the page.
When the backend Service is created, the Kubernetes control plane assigns a virtual
IP address, for example 10.0.0.1.  For this example, assume that the
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
会选择一个后端（基于会话亲和性或随机选择），并将数据包重定向到后端，无需重写客户端 IP 地址。

<!--
This same basic flow executes when traffic comes in through a node-port or
through a load-balancer, though in those cases the client IP address does get altered.
-->
当流量通过节点端口或负载均衡器进入时，也会执行相同的基本流程，
只是在这些情况下，客户端 IP 地址会被更改。

<!--
#### Optimizing iptables mode performance

In large clusters (with tens of thousands of Pods and Services), the
iptables mode of kube-proxy may take a long time to update the rules
in the kernel when Services (or their EndpointSlices) change. You can adjust the syncing
behavior of kube-proxy via options in the [`iptables` section](/docs/reference/config-api/kube-proxy-config.v1alpha1/#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPTablesConfiguration)
of the
kube-proxy [configuration file](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
(which you specify via `kube-proxy --config <path>`):
-->
#### 优化 iptables 模式性能  {#optimizing-iptables-mode-performance}

在大型集群（有数万个 Pod 和 Service）中，当 Service（或其 EndpointSlices）发生变化时
iptables 模式的 kube-proxy 在更新内核中的规则时可能要用较长时间。
你可以通过（`kube-proxy --config <path>` 指定的）kube-proxy
[配置文件](/zh-cn/docs/reference/config-api/kube-proxy-config.v1alpha1/)的
[`iptables` 节](/zh-cn/docs/reference/config-api/kube-proxy-config.v1alpha1/#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPTablesConfiguration)中的选项来调整
kube-proxy 的同步行为：

```none
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
every time any Service or Endpoint changes. This works fine in very
small clusters, but it results in a lot of redundant work when lots of
things change in a small time period. For example, if you have a
Service backed by a Deployment with 100 pods, and you delete the
Deployment, then with `minSyncPeriod: 0s`, kube-proxy would end up
removing the Service's Endpoints from the iptables rules one by one,
for a total of 100 updates. With a larger `minSyncPeriod`, multiple
Pod deletion events would get aggregated together, so kube-proxy might
instead end up making, say, 5 updates, each removing 20 endpoints,
which will be much more efficient in terms of CPU, and result in the
full set of changes being synchronized faster.
-->
`minSyncPeriod` 参数设置尝试同步 iptables 规则与内核之间的最短时长。
如果是 `0s`，那么每次有任一 Service 或 Endpoint 发生变更时，kube-proxy 都会立即同步这些规则。
这种方式在较小的集群中可以工作得很好，但如果在很短的时间内很多东西发生变更时，它会导致大量冗余工作。
例如，如果你有一个由 Deployment 支持的 Service，共有 100 个 Pod，你删除了这个 Deployment，
且设置了 `minSyncPeriod: 0s`，kube-proxy 最终会从 iptables 规则中逐个删除 Service 的 Endpoint，
总共更新 100 次。使用较大的 `minSyncPeriod` 值时，多个 Pod 删除事件将被聚合在一起，
因此 kube-proxy 最终可能会进行例如 5 次更新，每次移除 20 个端点，
这样在 CPU 利用率方面更有效率，能够更快地同步所有变更。

<!--
The larger the value of `minSyncPeriod`, the more work that can be
aggregated, but the downside is that each individual change may end up
waiting up to the full `minSyncPeriod` before being processed, meaning
that the iptables rules spend more time being out-of-sync with the
current apiserver state.
-->
`minSyncPeriod` 的值越大，可以聚合的工作越多，
但缺点是每个独立的变更可能最终要等待整个 `minSyncPeriod` 周期后才能被处理，
这意味着 iptables 规则要用更多时间才能与当前的 apiserver 状态同步。

<!--
The default value of `1s` is a good compromise for small and medium
clusters. In large clusters, it may be necessary to set it to a larger
value. (Especially, if kube-proxy's
`sync_proxy_rules_duration_seconds` metric indicates an average
time much larger than 1 second, then bumping up `minSyncPeriod` may
make updates more efficient.)
-->
默认值 `1s` 对于中小型集群是一个很好的折衷方案。
在大型集群中，可能需要将其设置为更大的值。
（特别是，如果 kube-proxy 的 `sync_proxy_rules_duration_seconds` 指标表明平均时间远大于 1 秒，
那么提高 `minSyncPeriod` 可能会使更新更有效率。）

##### `syncPeriod`

<!--
The `syncPeriod` parameter controls a handful of synchronization
operations that are not directly related to changes in individual
Services and Endpoints. In particular, it controls how quickly
kube-proxy notices if an external component has interfered with
kube-proxy's iptables rules. In large clusters, kube-proxy also only
performs certain cleanup operations once every `syncPeriod` to avoid
unnecessary work.
-->
`syncPeriod` 参数控制与单次 Service 和 Endpoint 的变更没有直接关系的少数同步操作。
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
##### Experimental performance improvements {#minimize-iptables-restore}
-->
##### 实验性的性能改进 {#minimize-iptables-restore}

{{< feature-state for_k8s_version="v1.26" state="alpha" >}}

<!--
In Kubernetes 1.26, some new performance improvements were made to the
iptables proxy mode, but they are not enabled by default (and should
probably not be enabled in production clusters yet). To try them out,
enable the `MinimizeIPTablesRestore` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) for
kube-proxy with `--feature-gates=MinimizeIPTablesRestore=true,…`.
-->
在 Kubernetes 1.26 中，社区对 iptables 代理模式进行了一些新的性能改进，
但默认未启用（并且可能还不应该在生产集群中启用）。要试用它们，
请使用 `--feature-gates=MinimizeIPTablesRestore=true,…` 为 kube-proxy 启用 `MinimizeIPTablesRestore`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

<!--
If you enable that feature gate and you were previously overriding
`minSyncPeriod`, you should try removing that override and letting
kube-proxy use the default value (`1s`) or at least a smaller value
than you were using before.
-->
如果你启用该特性门控并且之前覆盖了 `minSyncPeriod`，
你应该尝试移除该覆盖并让 kube-proxy 使用默认值 (`1s`) 或至少使用比之前更小的值。

<!--
If you notice kube-proxy's
`sync_proxy_rules_iptables_restore_failures_total` or
`sync_proxy_rules_iptables_partial_restore_failures_total` metrics
increasing after enabling this feature, that likely indicates you are
encountering bugs in the feature and you should file a bug report.
-->
如果你注意到 kube-proxy 的 `sync_proxy_rules_iptables_restore_failures_total` 或
`sync_proxy_rules_iptables_partial_restore_failures_total` 指标在启用此特性后升高，
这可能表明你发现了该特性的错误，你应该提交错误报告。

<!--
### IPVS proxy mode {#proxy-mode-ipvs}
-->
### IPVS 代理模式 {#proxy-mode-ipvs}

<!--
In `ipvs` mode, kube-proxy watches Kubernetes Services and EndpointSlices,
calls `netlink` interface to create IPVS rules accordingly and synchronizes
IPVS rules with Kubernetes Services and EndpointSlices periodically.
This control loop ensures that IPVS status matches the desired
state.
When accessing a Service, IPVS directs traffic to one of the backend Pods.
-->
在 `ipvs` 模式下，kube-proxy 监视 Kubernetes Service 和 EndpointSlice，
然后调用 `netlink` 接口创建 IPVS 规则，
并定期与 Kubernetes Service 和 EndpointSlice 同步 IPVS 规则。
该控制回路确保 IPVS 状态与期望的状态保持一致。
访问 Service 时，IPVS 会将流量导向到某一个后端 Pod。

<!--
The IPVS proxy mode is based on netfilter hook function that is similar to
iptables mode, but uses a hash table as the underlying data structure and works
in the kernel space.
That means kube-proxy in IPVS mode redirects traffic with lower latency than
kube-proxy in iptables mode, with much better performance when synchronizing
proxy rules. Compared to the other proxy modes, IPVS mode also supports a
higher throughput of network traffic.
-->
IPVS 代理模式基于 netfilter 回调函数，类似于 iptables 模式，
但它使用哈希表作为底层数据结构，在内核空间中生效。
这意味着 IPVS 模式下的 kube-proxy 比 iptables 模式下的 kube-proxy
重定向流量的延迟更低，同步代理规则时性能也更好。
与其他代理模式相比，IPVS 模式还支持更高的网络流量吞吐量。

<!--
IPVS provides more options for balancing traffic to backend Pods;
these are:

* `rr`: round-robin
* `lc`: least connection (smallest number of open connections)
* `dh`: destination hashing
* `sh`: source hashing
* `sed`: shortest expected delay
* `nq`: never queue
-->
IPVS 为将流量均衡到后端 Pod 提供了更多选择：

* `rr`：轮询
* `lc`：最少连接（打开连接数最少）
* `dh`：目标地址哈希
* `sh`：源地址哈希
* `sed`：最短预期延迟
* `nq`：最少队列

{{< note >}}
<!--
To run kube-proxy in IPVS mode, you must make IPVS available on
the node before starting kube-proxy.

When kube-proxy starts in IPVS proxy mode, it verifies whether IPVS
kernel modules are available. If the IPVS kernel modules are not detected, then kube-proxy
falls back to running in iptables proxy mode.
-->
要在 IPVS 模式下运行 kube-proxy，必须在启动 kube-proxy 之前确保节点上的 IPVS 可用。

当 kube-proxy 以 IPVS 代理模式启动时，它会验证 IPVS 内核模块是否可用。
如果未检测到 IPVS 内核模块，则 kube-proxy 会退回到 iptables 代理模式运行。
{{< /note >}}

<!--
{{< figure src="/images/docs/services-ipvs-overview.svg" title="Virtual IP address mechanism for Services, using IPVS mode" class="diagram-medium" >}}
-->
{{< figure src="/images/docs/services-ipvs-overview.svg" title="IPVS 模式下 Service 的虚拟 IP 地址机制" class="diagram-medium" >}}

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
Service IPs are not actually answered by a single host.  Instead, kube-proxy
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
you choose your own port number if that choice might collide with
someone else's choice.  That is an isolation failure.
-->
Kubernetes 的主要哲学之一是，
你不应需要在完全不是你的问题的情况下面对可能导致你的操作失败的情形。
对于 Service 资源的设计，也就是如果你选择的端口号可能与其他人的选择冲突，
就不应该让你自己选择端口号。这是一种失败隔离。

<!--
In order to allow you to choose a port number for your Services, we must
ensure that no two Services can collide. Kubernetes does that by allocating each
Service its own IP address from within the `service-cluster-ip-range`
CIDR range that is configured for the API server.
-->
为了允许你为 Service 选择端口号，我们必须确保没有任何两个 Service 会发生冲突。
Kubernetes 通过从为 API 服务器配置的 `service-cluster-ip-range`
CIDR 范围内为每个 Service 分配自己的 IP 地址来实现这一点。

<!--
To ensure each Service receives a unique IP, an internal allocator atomically
updates a global allocation map in {{< glossary_tooltip term_id="etcd" >}}
prior to creating each Service. The map object must exist in the registry for
Services to get IP address assignments, otherwise creations will
fail with a message indicating an IP address could not be allocated.
-->
为了确保每个 Service 都获得唯一的 IP，内部分配器在创建每个 Service
之前更新 {{< glossary_tooltip term_id="etcd" >}} 中的全局分配映射，这种更新操作具有原子性。
映射对象必须存在于数据库中，这样 Service 才能获得 IP 地址分配，
否则创建将失败，并显示无法分配 IP 地址。

<!--
In the control plane, a background controller is responsible for creating that
map (needed to support migrating from older versions of Kubernetes that used
in-memory locking). Kubernetes also uses controllers to check for invalid
assignments (e.g. due to administrator intervention) and for cleaning up allocated
IP addresses that are no longer used by any Services.
-->
在控制平面中，后台控制器负责创建该映射（从使用内存锁定的旧版本的 Kubernetes 迁移时需要这一映射）。
Kubernetes 还使用控制器来检查无效的分配（例如，因管理员干预而导致无效分配）
以及清理已分配但没有 Service 使用的 IP 地址。

<!--
#### IP address ranges for Service virtual IP addresses {#service-ip-static-sub-range}
-->
#### Service 虚拟 IP 地址的地址段 {#service-ip-static-sub-range}

{{< feature-state for_k8s_version="v1.25" state="beta" >}}

<!--
Kubernetes divides the `ClusterIP` range into two bands, based on
the size of the configured `service-cluster-ip-range` by using the following formula
`min(max(16, cidrSize / 16), 256)`. That formula paraphrases as _never less than 16 or
more than 256, with a graduated step function between them_.
-->
Kubernetes 根据配置的 `service-cluster-ip-range` 的大小使用公式
`min(max(16, cidrSize / 16), 256)` 将 `ClusterIP` 范围分为两段。
该公式可以解释为：介于 16 和 256 之间，并在上下界之间存在渐进阶梯函数的分配。

<!--
Kubernetes prefers to allocate dynamic IP addresses to Services by choosing from the upper band,
which means that if you want to assign a specific IP address to a `type: ClusterIP`
Service, you should manually assign an IP address from the **lower** band. That approach
reduces the risk of a conflict over allocation.
-->
Kubernetes 优先通过从高段中选择来为 Service 分配动态 IP 地址，
这意味着如果要将特定 IP 地址分配给 `type: ClusterIP` Service，
则应手动从**低**段中分配 IP 地址。
该方法降低了分配导致冲突的风险。

<!--
If you disable the `ServiceIPStaticSubrange`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) then Kubernetes
uses a single shared pool for both manually and dynamically assigned IP addresses,
that are used for `type: ClusterIP` Services.
-->
如果你禁用 `ServiceIPStaticSubrange`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
则 Kubernetes 用于手动分配和动态分配的 IP 共享单个地址池，这适用于 `type: ClusterIP` 的 Service。

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

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

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
route to ready node-local endpoints. If the traffic policy is `Local` and there are
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
### Traffic to terminating endpoints
-->
### 流向正终止的端点的流量  {#traffic-to-terminating-endpoints}

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

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
This forwarding behavior for terminating endpoints exist to allow `NodePort` and `LoadBalancer`
Services to gracefully drain connections when using `externalTrafficPolicy: Local`.

As a deployment goes through a rolling update, nodes backing a load balancer may transition from
N to 0 replicas of that deployment. In some cases, external load balancers can send traffic to
a node with 0 replicas in between health check probes. Routing traffic to terminating endpoints
ensures that Node's that are scaling down Pods can gracefully receive and drain traffic to
those terminating Pods. By the time the Pod completes termination, the external load balancer
should have seen the node's health check failing and fully removed the node from the backend pool.
-->
这种对处于终止过程中的端点的转发行为使得 `NodePort` 和 `LoadBalancer` Service
能有条不紊地腾空设置了 `externalTrafficPolicy: Local` 时的连接。

当一个 Deployment 被滚动更新时，处于负载均衡器后端的节点可能会将该 Deployment 的 N 个副本缩减到
0 个副本。在某些情况下，外部负载均衡器可能在两次执行健康检查探针之间将流量发送到具有 0 个副本的节点。
将流量路由到处于终止过程中的端点可确保正在缩减 Pod 的节点能够正常接收流量，
并逐渐降低指向那些处于终止过程中的 Pod 的流量。
到 Pod 完成终止时，外部负载均衡器应该已经发现节点的健康检查失败并从后端池中完全移除该节点。

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
