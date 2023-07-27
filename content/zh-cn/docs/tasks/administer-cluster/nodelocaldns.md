---
title: 在 Kubernetes 集群中使用 NodeLocal DNSCache
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
本页概述了 Kubernetes 中的 NodeLocal DNSCache 功能。

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
NodeLocal DNSCache 通过在集群节点上作为 DaemonSet 运行 DNS 缓存代理来提高集群 DNS 性能。
在当今的体系结构中，运行在 'ClusterFirst' DNS 模式下的 Pod 可以连接到 kube-dns `serviceIP` 进行 DNS 查询。
通过 kube-proxy 添加的 iptables 规则将其转换为 kube-dns/CoreDNS 端点。
借助这种新架构，Pod 将可以访问在同一节点上运行的 DNS 缓存代理，从而避免 iptables DNAT 规则和连接跟踪。
本地缓存代理将查询 kube-dns 服务以获取集群主机名的缓存缺失（默认为 "`cluster.local`" 后缀）。

<!--
## Motivation
-->
## 动机   {#motivation}

<!--
* With the current DNS architecture, it is possible that Pods with the highest DNS QPS
  have to reach out to a different node, if there is no local kube-dns/CoreDNS instance.
  Having a local cache will help improve the latency in such scenarios.
-->
* 使用当前的 DNS 体系结构，如果没有本地 kube-dns/CoreDNS 实例，则具有最高 DNS QPS
  的 Pod 可能必须延伸到另一个节点。
  在这种场景下，拥有本地缓存将有助于改善延迟。

<!--
* Skipping iptables DNAT and connection tracking will help reduce
  [conntrack races](https://github.com/kubernetes/kubernetes/issues/56903)
  and avoid UDP DNS entries filling up conntrack table.
-->
* 跳过 iptables DNAT 和连接跟踪将有助于减少
  [conntrack 竞争](https://github.com/kubernetes/kubernetes/issues/56903)并避免
  UDP DNS 条目填满 conntrack 表。

<!--
* Connections from the local caching agent to kube-dns service can be upgraded to TCP.
  TCP conntrack entries will be removed on connection close in contrast with
  UDP entries that have to timeout
  ([default](https://www.kernel.org/doc/Documentation/networking/nf_conntrack-sysctl.txt)
  `nf_conntrack_udp_timeout` is 30 seconds)
-->
* 从本地缓存代理到 kube-dns 服务的连接可以升级为 TCP。
  TCP conntrack 条目将在连接关闭时被删除，相反 UDP 条目必须超时
  （[默认](https://www.kernel.org/doc/Documentation/networking/nf_conntrack-sysctl.txt)
  `nf_conntrack_udp_timeout` 是 30 秒）。

<!--
* Upgrading DNS queries from UDP to TCP would reduce tail latency attributed to
  dropped UDP packets and DNS timeouts usually up to 30s (3 retries + 10s timeout).
  Since the nodelocal cache listens for UDP DNS queries, applications don't need to be changed.
-->
* 将 DNS 查询从 UDP 升级到 TCP 将减少由于被丢弃的 UDP 包和 DNS 超时而带来的尾部等待时间；
  这类延时通常长达 30 秒（3 次重试 + 10 秒超时）。
  由于 nodelocal 缓存监听 UDP DNS 查询，应用不需要变更。

<!--
* Metrics & visibility into DNS requests at a node level.
-->
* 在节点级别对 DNS 请求的度量和可见性。

<!--
* Negative caching can be re-enabled, thereby reducing the number of queries for the kube-dns service.
-->
* 可以重新启用负缓存，从而减少对 kube-dns 服务的查询数量。

<!--
## Architecture Diagram
-->
## 架构图   {#architecture-diagram}

<!--
This is the path followed by DNS Queries after NodeLocal DNSCache is enabled:
-->
启用 NodeLocal DNSCache 之后，DNS 查询所遵循的路径如下：

<!--
{{< figure src="/images/docs/nodelocaldns.svg" alt="NodeLocal DNSCache flow" title="Nodelocal DNSCache flow" caption="This image shows how NodeLocal DNSCache handles DNS queries." class="diagram-medium" >}}
-->
{{< figure src="/images/docs/nodelocaldns.svg" alt="NodeLocal DNSCache 流" title="Nodelocal DNSCache 流" caption="此图显示了 NodeLocal DNSCache 如何处理 DNS 查询。" class="diagram-medium" >}}

<!--
## Configuration
-->
## 配置   {#configuration}

{{< note >}}
<!--
The local listen IP address for NodeLocal DNSCache can be any address that
can be guaranteed to not collide with any existing IP in your cluster.
It's recommended to use an address with a local scope, for example,
from the 'link-local' range '169.254.0.0/16' for IPv4 or from the
'Unique Local Address' range in IPv6 'fd00::/8'.
-->
NodeLocal DNSCache 的本地侦听 IP 地址可以是任何地址，只要该地址不和你的集群里现有的 IP 地址发生冲突。
推荐使用本地范围内的地址，例如，IPv4 链路本地区段 '169.254.0.0/16' 内的地址，
或者 IPv6 唯一本地地址区段 'fd00::/8' 内的地址。
{{< /note >}}

<!--
This feature can be enabled using the following steps:
-->
可以使用以下步骤启动此功能：

<!--
* Prepare a manifest similar to the sample
  [`nodelocaldns.yaml`](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml)
  and save it as `nodelocaldns.yaml.`
-->
* 根据示例 [`nodelocaldns.yaml`](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml)
  准备一个清单，把它保存为 `nodelocaldns.yaml`。

<!--
* If using IPv6, the CoreDNS configuration file needs to enclose all the IPv6 addresses
  into square brackets if used in 'IP:Port' format.
  If you are using the sample manifest from the previous point, this will require you to modify
  [the configuration line L70](https://github.com/kubernetes/kubernetes/blob/b2ecd1b3a3192fbbe2b9e348e095326f51dc43dd/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml#L70)
  like this: "`health [__PILLAR__LOCAL__DNS__]:8080`"
-->
* 如果使用 IPv6，在使用 'IP:Port' 格式的时候需要把 CoreDNS 配置文件里的所有 IPv6 地址用方括号包起来。
  如果你使用上述的示例清单，
  需要把[配置行 L70](https://github.com/kubernetes/kubernetes/blob/b2ecd1b3a3192fbbe2b9e348e095326f51dc43dd/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml#L70)
  修改为： "`health [__PILLAR__LOCAL__DNS__]:8080`"。

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
* 把清单里的变量更改为正确的值：

  ```shell
  kubedns=`kubectl get svc kube-dns -n kube-system -o jsonpath={.spec.clusterIP}`
  domain=<cluster-domain>
  localdns=<node-local-address>
  ```

  `<cluster-domain>` 的默认值是 "`cluster.local`"。`<node-local-address>` 是
  NodeLocal DNSCache 选择的本地侦听 IP 地址。

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
  * 如果 kube-proxy 运行在 IPTABLES 模式：

    ``` bash
    sed -i "s/__PILLAR__LOCAL__DNS__/$localdns/g; s/__PILLAR__DNS__DOMAIN__/$domain/g; s/__PILLAR__DNS__SERVER__/$kubedns/g" nodelocaldns.yaml
    ```

    node-local-dns Pod 会设置 `__PILLAR__CLUSTER__DNS__` 和 `__PILLAR__UPSTREAM__SERVERS__`。
    在此模式下, node-local-dns Pod 会同时侦听 kube-dns 服务的 IP 地址和
    `<node-local-address>` 的地址，以便 Pod 可以使用其中任何一个 IP 地址来查询 DNS 记录。

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
  * 如果 kube-proxy 运行在 IPVS 模式：

    ``` bash
    sed -i "s/__PILLAR__LOCAL__DNS__/$localdns/g; s/__PILLAR__DNS__DOMAIN__/$domain/g; s/,__PILLAR__DNS__SERVER__//g; s/__PILLAR__CLUSTER__DNS__/$kubedns/g" nodelocaldns.yaml
    ```

    在此模式下，node-local-dns Pod 只会侦听 `<node-local-address>` 的地址。
    node-local-dns 接口不能绑定 kube-dns 的集群 IP 地址，因为 IPVS 负载均衡使用的接口已经占用了该地址。
    node-local-dns Pod 会设置 `__PILLAR__UPSTREAM__SERVERS__`。

<!--
* Run `kubectl create -f nodelocaldns.yaml`

* If using kube-proxy in IPVS mode, `--cluster-dns` flag to kubelet needs to be modified
  to use `<node-local-address>` that NodeLocal DNSCache is listening on.
  Otherwise, there is no need to modify the value of the `--cluster-dns` flag,
  since NodeLocal DNSCache listens on both the kube-dns service IP as well as
  `<node-local-address>`.
-->
* 运行 `kubectl create -f nodelocaldns.yaml`

* 如果 kube-proxy 运行在 IPVS 模式，需要修改 kubelet 的 `--cluster-dns` 参数
  NodeLocal DNSCache 正在侦听的 `<node-local-address>` 地址。
  否则，不需要修改 `--cluster-dns` 参数，因为 NodeLocal DNSCache 会同时侦听
  kube-dns 服务的 IP 地址和 `<node-local-address>` 的地址。

<!--
Once enabled, the `node-local-dns` Pods will run in the `kube-system` namespace
on each of the cluster nodes. This Pod runs [CoreDNS](https://github.com/coredns/coredns)
in cache mode, so all CoreDNS metrics exposed by the different plugins will
be available on a per-node basis.

You can disable this feature by removing the DaemonSet, using `kubectl delete -f <manifest>`.
You should also revert any changes you made to the kubelet configuration.
-->
启用后，`node-local-dns` Pod 将在每个集群节点上的 `kube-system` 名字空间中运行。
此 Pod 在缓存模式下运行 [CoreDNS](https://github.com/coredns/coredns)，
因此每个节点都可以使用不同插件公开的所有 CoreDNS 指标。

如果要禁用该功能，你可以使用 `kubectl delete -f <manifest>` 来删除 DaemonSet。
你还应该回滚你对 kubelet 配置所做的所有改动。

<!--
## StubDomains and Upstream server Configuration
-->
## StubDomains 和上游服务器配置   {#stubdomains-and-upstream-server-configuration}

<!--
StubDomains and upstream servers specified in the `kube-dns` ConfigMap in the `kube-system` namespace
are automatically picked up by `node-local-dns` pods. The ConfigMap contents need to follow the format
shown in [the example](/docs/tasks/administer-cluster/dns-custom-nameservers/#example-1).
The `node-local-dns` ConfigMap can also be modified directly with the stubDomain configuration
in the Corefile format. Some cloud providers might not allow modifying `node-local-dns` ConfigMap directly.
In those cases, the `kube-dns` ConfigMap can be updated.
-->
`node-local-dns` Pod 能够自动读取 `kube-system` 名字空间中 `kube-dns` ConfigMap
中保存的 StubDomains 和上游服务器信息。ConfigMap
中的内容需要遵从[此示例](/zh-cn/docs/tasks/administer-cluster/dns-custom-nameservers/#example-1)中所给的格式。
`node-local-dns` ConfigMap 也可被直接修改，使用 Corefile 格式设置 stubDomain 配置。
某些云厂商可能不允许直接修改 `node-local-dns` ConfigMap 的内容。
在这种情况下，可以更新 `kube-dns` ConfigMap。

<!--
## Setting memory limits
-->
## 设置内存限制   {#setting-memory-limits}

<!--
The `node-local-dns` Pods use memory for storing cache entries and processing queries.
Since they do not watch Kubernetes objects, the cluster size or the number of Services / EndpointSlices do not directly affect memory usage. Memory usage is influenced by the DNS query pattern.
From [CoreDNS docs](https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md),
> The default cache size is 10000 entries, which uses about 30 MB when completely filled.
-->
`node-local-dns` Pod 使用内存来保存缓存项并处理查询。
由于它们并不监视 Kubernetes 对象变化，集群规模或者 Service/EndpointSlices
的数量都不会直接影响内存用量。内存用量会受到 DNS 查询模式的影响。
根据 [CoreDNS 文档](https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md),

> The default cache size is 10000 entries, which uses about 30 MB when completely filled.
> （默认的缓存大小是 10000 个表项，当完全填充时会使用约 30 MB 内存）

<!--
This would be the memory usage for each server block (if the cache gets completely filled).
Memory usage can be reduced by specifying smaller cache sizes.

The number of concurrent queries is linked to the memory demand, because each extra
goroutine used for handling a query requires an amount of memory. You can set an upper limit
using the `max_concurrent` option in the forward plugin.
-->
这一数值是（缓存完全被填充时）每个服务器块的内存用量。
通过设置小一点的缓存大小可以降低内存用量。

并发查询的数量会影响内存需求，因为用来处理查询请求而创建的 Go 协程都需要一定量的内存。
你可以在 forward 插件中使用 `max_concurrent` 选项设置并发查询数量上限。

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
如果一个 `node-local-dns` Pod 尝试使用的内存超出可提供的内存量
（因为系统资源总量的，或者所配置的[资源约束](/zh-cn/docs/concepts/configuration/manage-resources-containers/)）的原因，
操作系统可能会关闭这一 Pod 的容器。
发生这种情况时，被终止的（"OOMKilled"）容器不会清理其启动期间所添加的定制包过滤规则。
该 `node-local-dns` 容器应该会被重启（因其作为 DaemonSet 的一部分被管理），
但因上述原因可能每次容器失败时都会导致 DNS 有一小段时间不可用：
the packet filtering rules direct DNS queries to a local Pod that is unhealthy
（包过滤器规则将 DNS 查询转发到本地某个不健康的 Pod）。

<!--
You can determine a suitable memory limit by running node-local-dns pods without a limit and
measuring the peak usage. You can also set up and use a
[VerticalPodAutoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler)
in _recommender mode_, and then check its recommendations.
-->
通过不带限制地运行 `node-local-dns` Pod 并度量其内存用量峰值，你可以为其确定一个合适的内存限制值。
你也可以安装并使用一个运行在 “Recommender Mode（建议者模式）” 的
[VerticalPodAutoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler)，
并查看该组件输出的建议信息。

