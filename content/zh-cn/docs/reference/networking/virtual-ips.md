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
Some of the details in this reference refer to an example: the back end Pods for a stateless
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
## 代理模式{#proxy-modes}

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
### User space proxy mode {#proxy-mode-userspace}
 -->
### 用户空间代理模式 {#proxy-mode-userspace}

{{< feature-state for_k8s_version="v1.23" state="deprecated" >}}

<!-- 
This (legacy) mode uses iptables to install interception rules, and then performs
traffic forwarding with the assistance of the kube-proxy tool.
The kube-proxy watches the Kubernetes control plane for the addition, modification
and removal of Service and EndpointSlice objects. For each Service, the kube-proxy
opens a port (randomly chosen) on the local node. Any connections to this _proxy port_
are proxied to one of the Service's backend Pods (as reported via
EndpointSlices). The kube-proxy takes the `sessionAffinity` setting of the Service into
account when deciding which backend Pod to use.
 -->

这种（遗留）模式使用 iptables 添加拦截规则，然后使用 kube-proxy 工具执行流量转发。
kube-proxy 监视 Kubernetes 控制平面对 Service 和 EndpointSlice 对象的增加、修改和删除。
对于每个 Service，kube-proxy 在本地节点上打开一个端口（随机选择）。
任何对这个**代理端口**的连接都将代理到 Service 的一个后端 Pod（通过 EndpointSlices 报告）。
kube-proxy 在决定使用哪个后端 Pod 时会考虑 Service 的 `sessionAffinity` 设置。

<!-- 
The user-space proxy installs iptables rules which capture traffic to the
Service's `clusterIP` (which is virtual) and `port`. Those rules redirect that traffic
to the proxy port which proxies the backend Pod.
 -->
用户空间代理添加 iptables 规则，这些规则捕获流向 Service 的 `clusterIP`（虚拟 IP）和 `port` 的流量。
这些规则将这些流量重定向到代理后端 Pod 的代理端口。

<!-- 
By default, kube-proxy in userspace mode chooses a backend via a round-robin algorithm.

{{< figure src="/images/docs/services-userspace-overview.svg" title="Services overview diagram for userspace proxy" class="diagram-medium" >}}
 -->
默认情况下，用户空间模式下的 kube-proxy 通过轮询算法选择后端。
  
{{< figure src="/images/docs/services-userspace-overview.svg" title="用户空间代理的 Service 概览" class="diagram-medium" >}}

<!-- 
#### Example {#packet-processing-userspace}
 -->
#### 示例 {#packet-processing-userspace}

<!-- 
As an example, consider the image processing application described [earlier](#example)
in the page.
When the backend Service is created, the Kubernetes control plane assigns a virtual
IP address, for example 10.0.0.1.  Assuming the Service port is 1234, the
Service is observed by all of the kube-proxy instances in the cluster.
When a proxy sees a new Service, it opens a new random port, establishes an
iptables redirect from the virtual IP address to this new port, and starts accepting
connections on it.
 -->
例如，考虑本文[前面](#example)描述的图像处理应用的例子。
当创建后端 Service 时，Kubernetes 控制平面分配一个虚拟 IP 地址，例如 10.0.0.1。
假设 Service 端口是 1234，那么集群中的所有 kube-proxy 实例都会观察到该 Service。
当一个 kube-proxy 观察到新 Service 时，它会随机打开一个新端口，
建立从虚拟 IP 地址到这个新端口的 iptables 重定向，并开始在其上接受连接。

<!-- 
When a client connects to the Service's virtual IP address, the iptables
rule kicks in, and redirects the packets to the proxy's own port.
The "Service proxy" chooses a backend, and starts proxying traffic from the client to the backend.
 -->
当客户端连接到 Service 的虚拟 IP 地址时，iptables 规则会生效，将数据包重定向到代理自身的端口。
“Service 代理” 选择一个后端，并开始代理客户端到后端的流量。

<!-- 
This means that Service owners can choose any port they want without risk of
collision.  Clients can connect to an IP and port, without being aware
of which Pods they are actually accessing.
 -->
这意味着 Service 所有者可以选择任何他们想要的端口而不会发生冲突。
客户端可以连接到 IP 和端口，也不需要知道它们实际访问的是哪些 Pod。

<!-- 
#### Scaling challenges {#scaling-challenges-userspace}
 -->
#### 扩缩容挑战 {#scaling-challenges-userspace}

<!-- 
Using the userspace proxy for VIPs works at small to medium scale, but will
not scale to very large clusters with thousands of Services.  The
[original design proposal for portals](https://github.com/kubernetes/kubernetes/issues/1107)
has more details on this.
 -->

在中小型规模集群中使用用户空间代理的 VIP 是有效的，但是不能拓展到具有数千个 Service 的大型集群。
[针对门户的初始设计提案](https://github.com/kubernetes/kubernetes/issues/1107)
中有更多的细节。

<!-- 
Using the userspace proxy obscures the source IP address of a packet accessing
a Service.
This makes some kinds of network filtering (firewalling) impossible.  The iptables
proxy mode does not
obscure in-cluster source IPs, but it does still impact clients coming through
a load balancer or node-port.
 -->
使用用户空间代理会隐藏访问 Service 的数据包的源 IP 地址。
这使得某些类型的网络过滤（防火墙）失效。
iptables 代理模式不会隐藏集群内的源 IP 地址，
但仍会隐藏通过负载均衡器或节点端口进入的客户端数据包源 IP 地址。

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
does not respond, the connection fails. This is different from userspace
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
{{< figure src="/images/docs/services-iptables-overview.svg" title="Services overview diagram for iptables proxy" class="diagram-medium" >}}
 -->
{{< figure src="/images/docs/services-iptables-overview.svg" title="iptables 代理的 Service 概览" class="diagram-medium" >}}

<!-- 
#### Example {#packet-processing-iptables}
 -->
#### 示例 {#packet-processing-iptables}

<!-- 
Again, consider the image processing application described [earlier](#example).
When the backend Service is created, the Kubernetes control plane assigns a virtual
IP address, for example 10.0.0.1.  For this example, assume that the
Service port is 1234.
All of the kube-proxy instances in the cluster observe the creation of the new
Service.
 -->
仍以[前面](#example)描述的图像处理应用程序为例。
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
redirected to the backend.  Unlike the userspace proxy, packets are never
copied to userspace, the kube-proxy does not have to be running for the virtual
IP address to work, and Nodes see traffic arriving from the unaltered client IP
address.
 -->
当客户端连接到 Service 的虚拟 IP 地址时，iptables 规则会生效。
会选择一个后端（基于会话亲和性或随机选择），并将数据包重定向到后端。
与用户空间代理不同，数据包不会被复制到用户空间，
不需要 kube-proxy 参与，虚拟 IP 地址就可以正常工作，
节点可以看到来自未更改的客户端 IP 地址的流量。

<!-- 
This same basic flow executes when traffic comes in through a node-port or
through a load-balancer, though in those cases the client IP address does get altered.
 -->
当流量通过节点端口或负载均衡器进入时，也会执行相同的基本流程，
只是在这些情况下，客户端 IP 地址会被更改。

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
 -->
在 `ipvs` 模式下，kube-proxy 监视 Kubernetes Service 和 EndpointSlice，
然后调用 `netlink` 接口创建 IPVS 规则，
并定期与 Kubernetes Service 和 EndpointSlice 同步 IPVS 规则。
该控制回路确保 IPVS 状态与期望的状态保持一致。

<!-- 
When accessing a Service, IPVS directs traffic to one of the backend Pods.

The IPVS proxy mode is based on netfilter hook function that is similar to
iptables mode, but uses a hash table as the underlying data structure and works
in the kernel space.
That means kube-proxy in IPVS mode redirects traffic with lower latency than
kube-proxy in iptables mode, with much better performance when synchronizing
proxy rules. Compared to the other proxy modes, IPVS mode also supports a
higher throughput of network traffic.
 -->

访问 Service 时，IPVS 会将流量导向到某一个后端 Pod 。

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
{{< figure src="/images/docs/services-ipvs-overview.svg" title="Services overview diagram for IPVS proxy" class="diagram-medium" >}}
 -->

{{< figure src="/images/docs/services-ipvs-overview.svg" title="IPVS 代理的 Service 概览" class="diagram-medium" >}}

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

{{< note >}}
{{< feature-state for_k8s_version="v1.22" state="alpha" >}}
<!-- 
If you enable the `ProxyTerminatingEndpoints`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
for the kube-proxy, the kube-proxy checks if the node
has local endpoints and whether or not all the local endpoints are marked as terminating.
If there are local endpoints and **all** of those are terminating, then the kube-proxy ignores
any external traffic policy of `Local`. Instead, whilst the node-local endpoints remain as all
terminating, the kube-proxy forwards traffic for that Service to healthy endpoints elsewhere,
as if the external traffic policy were set to `Cluster`.
 -->
如果为 kube-proxy 启用了 `ProxyTerminatingEndpoints`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
kube-proxy 会检查节点是否具有本地端点以及是否所有本地端点都标记为终止。
如果有本地端点并且**所有**本地端点都被标记为终止，则 kube-proxy 忽略所有取值为 `Local` 的外部流量策略。
相反，当所有本地节点端点均处于终止中时，
kube-proxy 将该 Service 的流量转发到其他健康端点，
就好像外部流量策略设置为 `Cluster` 一样。


<!--
This forwarding behavior for terminating endpoints exists to allow external load balancers to
gracefully drain connections that are backed by `NodePort` Services, even when the health check
node port starts to fail. Otherwise, traffic can be lost between the time a node is
still in the node pool of a load balancer and traffic is being dropped during the
termination period of a pod.
 -->
这种对处于终止中的端点的转发行为使得外部负载均衡器能优雅地排空由
`NodePort` 服务支持的连接，即使在健康检查节点端口开始出现故障时也是如此。
否则，在节点仍然在负载均衡器的节点池情况下，在 Pod 终止期间，流量可能会丢失。
{{< /note >}}

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
你可以设置 `.spec.internalTrafficPolicy` 字段来控制从内部源路由的流量。
有效值为 `Cluster` 和 `Local`。
将字段设置为 `Cluster` 会将内部流量路由到所有准备就绪的端点，
将字段设置为 `Local` 仅会将流量路由到本地节点准备就绪的端点。
如果流量策略为 `Local` 但没有本地节点端点，那么 kube-proxy 会丢弃该流量。

<!-- 
## {{% heading "whatsnext" %}}
 -->
## {{% heading "whatsnext" %}}

<!-- 
To learn more about Services,
read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/).
 -->
要了解有关 Service 的更多信息，
请阅读[使用 Service 连接应用](/zh-cn/docs/tutorials/services/connect-applications-service/)。

<!-- 
You can also:

* Read about [Services](/docs/concepts/services-networking/service/)
* Read the [API reference](/docs/reference/kubernetes-api/service-resources/service-v1/) for the Service API 
-->

也可以：
* 阅读 [Service](/zh-cn/docs/concepts/services-networking/service/)
* 阅读 [API 参考](/zh-cn/docs/reference/kubernetes-api/service-resources/service-v1/)进一步了解 Service API
