---
reviewers:
- bowei
- zihongz
title: 在 Kubernetes 集群中使用 NodeLocal DNSCache
content_type: task
---
<!--
---
reviewers:
- bowei
- zihongz
title: Using NodeLocal DNSCache in Kubernetes clusters
content_type: task
---
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
## 引言

<!--
NodeLocal DNSCache improves Cluster DNS performance by running a dns caching agent on cluster nodes as a DaemonSet. In today's architecture, Pods in ClusterFirst DNS mode reach out to a kube-dns serviceIP for DNS queries. This is translated to a kube-dns/CoreDNS endpoint via iptables rules added by kube-proxy. With this new architecture, Pods will reach out to the dns caching agent running on the same node, thereby avoiding iptables DNAT rules and connection tracking. The local caching agent will query kube-dns service for cache misses of cluster hostnames(cluster.local suffix by default).
-->
NodeLocal DNSCache 通过在集群节点上作为 DaemonSet 运行 dns 缓存代理来提高集群 DNS 性能。
在当今的体系结构中，处于 ClusterFirst DNS 模式的 Pod 可以连接到 kube-dns serviceIP 进行 DNS 查询。
通过 kube-proxy 添加的 iptables 规则将其转换为 kube-dns/CoreDNS 端点。
借助这种新架构，Pods 将可以访问在同一节点上运行的 dns 缓存代理，从而避免了 iptables DNAT 规则和连接跟踪。
本地缓存代理将查询 kube-dns 服务以获取集群主机名的缓存缺失（默认为 cluster.local 后缀）。

<!--
## Motivation
-->
## 动机

<!--
* With the current DNS architecture, it is possible that Pods with the highest DNS QPS have to reach out to a different node, if there is no local kube-dns/CoreDNS instance.
Having a local cache will help improve the latency in such scenarios.
-->
* 使用当前的 DNS 体系结构，如果没有本地 kube-dns/CoreDNS 实例，则具有最高 DNS QPS 的 Pod 可能必须延伸到另一个节点。
在这种脚本下，拥有本地缓存将有助于改善延迟。

<!--
* Skipping iptables DNAT and connection tracking will help reduce [conntrack races](https://github.com/kubernetes/kubernetes/issues/56903) and avoid UDP DNS entries filling up conntrack table.
-->
* 跳过 iptables DNAT 和连接跟踪将有助于减少 [conntrack 竞争](https://github.com/kubernetes/kubernetes/issues/56903)并避免 UDP DNS 条目填满 conntrack 表。

<!--
* Connections from local caching agent to kube-dns servie can be upgraded to TCP. TCP conntrack entries will be removed on connection close in contrast with UDP entries that have to timeout ([default](https://www.kernel.org/doc/Documentation/networking/nf_conntrack-sysctl.txt) `nf_conntrack_udp_timeout` is 30 seconds)
-->
* 从本地缓存代理到 kube-dns 服务的连接可以升级到 TCP 。
TCP conntrack 条目将在连接关闭时被删除，相反 UDP 条目必须超时([默认](https://www.kernel.org/doc/Documentation/networking/nf_conntrack-sysctl.txt) `nf_conntrack_udp_timeout` 是 30 秒)

<!--
* Upgrading DNS queries from UDP to TCP would reduce tail latency attributed to dropped UDP packets and DNS timeouts usually up to 30s (3 retries + 10s timeout). Since the nodelocal cache listens for UDP DNS queries, applications don't need to be changed.
-->
* 将 DNS 查询从 UDP 升级到 TCP 将减少归因于丢弃的 UDP 数据包和 DNS 超时的尾部等待时间，通常长达 30 秒（3 次重试+ 10 秒超时）。

<!--
* Metrics & visibility into dns requests at a node level.
-->
* 在节点级别对 dns 请求的度量和可见性。

<!--
* Negative caching can be re-enabled, thereby reducing number of queries to kube-dns service.
-->
* 可以重新启用负缓存，从而减少对 kube-dns 服务的查询数量。

<!--
## Architecture Diagram
-->
## 架构图

<!--
This is the path followed by DNS Queries after NodeLocal DNSCache is enabled:
-->
启用 NodeLocal DNSCache 之后，这是 DNS 查询所遵循的路径：


<!--
{{< figure src="/images/docs/nodelocaldns.svg" alt="NodeLocal DNSCache flow" title="Nodelocal DNSCache flow" caption="This image shows how NodeLocal DNSCache handles DNS queries." >}}
-->
{{< figure src="/images/docs/nodelocaldns.svg" alt="NodeLocal DNSCache 流" title="Nodelocal DNSCache 流" caption="此图显示了 NodeLocal DNSCache 如何处理 DNS 查询。" >}}

<!--
## Configuration
-->
## 配置
<!--
{{< note >}} The local listen IP address for NodeLocal DNSCache can be any address that can be guaranteed to not collide with any existing IP in your cluster. It's recommended to use an address with a local scope, per example, from the link-local range 169.254.0.0/16 for IPv4 or from the Unique Local Address range in IPv6 fd00::/8.
{{< /note >}}
-->
{{< note >}} 
NodeLocal DNSCache 的本地侦听 IP 地址可以是任何地址，只要该地址不和你的集群里现有的 IP 地址发生冲突。
推荐使用本地范围内的地址，例如，IPv4 链路本地区段 169.254.0.0/16 内的地址，
或者 IPv6 唯一本地地址区段 fd00::/8 内的地址。
{{< /note >}}

<!--
This feature can be enabled using the following steps:
-->
可以使用以下步骤启动此功能：

<!--
* Prepare a manifest similar to the sample [`nodelocaldns.yaml`](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml) and save it as `nodelocaldns.yaml.`
-->
* 根据示例 [`nodelocaldns.yaml`](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml) 
  准备一个清单，把它保存为 `nodelocaldns.yaml`。
<!--
* If using IPv6, the CoreDNS configuration file need to enclose all the IPv6 addresses into square brackets if used in IP:Port format. 
If you are using the sample manifest from the previous point, this will require to modify [the configuration line L70](https://github.com/kubernetes/kubernetes/blob/b2ecd1b3a3192fbbe2b9e348e095326f51dc43dd/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml#L70) like this `health [__PILLAR__LOCAL__DNS__]:8080`
-->
* 如果使用 IPv6，在使用 IP:Port 格式的时候需要把 CoreDNS 配置文件里的所有 IPv6 地址用方括号包起来。
  如果你使用上述的示例清单，需要把 [配置行 L70](https://github.com/kubernetes/kubernetes/blob/b2ecd1b3a3192fbbe2b9e348e095326f51dc43dd/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml#L70) 
  修改为 `health [__PILLAR__LOCAL__DNS__]:8080`。
<!--
* Substitute the variables in the manifest with the right values:

     * kubedns=`kubectl get svc kube-dns -n kube-system -o jsonpath={.spec.clusterIP}`

     * domain=`<cluster-domain>`

     * localdns=`<node-local-address>`

     `<cluster-domain>` is "cluster.local" by default. `<node-local-address>` is the local listen IP address chosen for NodeLocal DNSCache.
-->
* 把清单里的变量更改为正确的值：
     * kubedns=`kubectl get svc kube-dns -n kube-system -o jsonpath={.spec.clusterIP}`

     * domain=`<cluster-domain>`

     * localdns=`<node-local-address>`

     `<cluster-domain>` 的默认值是 "cluster.local"。 `<node-local-address>` 是 NodeLocal DNSCache 选择的本地侦听 IP 地址。

<!--
   * If kube-proxy is running in IPTABLES mode:

     ``` bash
     sed -i "s/__PILLAR__LOCAL__DNS__/$localdns/g; s/__PILLAR__DNS__DOMAIN__/$domain/g; s/__PILLAR__DNS__SERVER__/$kubedns/g" nodelocaldns.yaml
     ```

     `__PILLAR__CLUSTER__DNS__` and `__PILLAR__UPSTREAM__SERVERS__` will be populated by the node-local-dns pods.
     In this mode, node-local-dns pods listen on both the kube-dns service IP as well as `<node-local-address>`, so pods can lookup DNS records using either IP address.
-->   
   * 如果 kube-proxy 运行在 IPTABLES 模式：

     ``` bash
     sed -i "s/__PILLAR__LOCAL__DNS__/$localdns/g; s/__PILLAR__DNS__DOMAIN__/$domain/g; s/__PILLAR__DNS__SERVER__/$kubedns/g" nodelocaldns.yaml
     ```

     node-local-dns Pods 会设置 `__PILLAR__CLUSTER__DNS__` 和 `__PILLAR__UPSTREAM__SERVERS__`。
     在此模式下, node-local-dns Pods 会同时侦听 kube-dns 服务的 IP 地址和 `<node-local-address>` 的地址，
     以便 Pods 可以使用其中任何一个 IP 地址来查询 DNS 记录。
<!--
  * If kube-proxy is running in IPVS mode:

    ``` bash
     sed -i "s/__PILLAR__LOCAL__DNS__/$localdns/g; s/__PILLAR__DNS__DOMAIN__/$domain/g; s/,__PILLAR__DNS__SERVER__//g; s/__PILLAR__CLUSTER__DNS__/$kubedns/g" nodelocaldns.yaml
    ```
     In this mode, node-local-dns pods listen only on `<node-local-address>`. The node-local-dns interface cannot bind the kube-dns cluster IP since the interface used for IPVS loadbalancing already uses this address.
     `__PILLAR__UPSTREAM__SERVERS__` will be populated by the node-local-dns pods.
-->
   * 如果 kube-proxy 运行在 IPVS 模式：

     ``` bash
     sed -i "s/__PILLAR__LOCAL__DNS__/$localdns/g; s/__PILLAR__DNS__DOMAIN__/$domain/g; s/__PILLAR__DNS__SERVER__//g; s/__PILLAR__CLUSTER__DNS__/$kubedns/g" nodelocaldns.yaml
     ```

     在此模式下，node-local-dns Pods 只会侦听 `<node-local-address>` 的地址。
     node-local-dns 接口不能绑定 kube-dns 的集群 IP 地址，因为 IPVS 负载均衡
     使用的接口已经占用了该地址。
     node-local-dns Pods 会设置 `__PILLAR__UPSTREAM__SERVERS__`。
     
<!--
* Run `kubectl create -f nodelocaldns.yaml`
* If using kube-proxy in IPVS mode, `--cluster-dns` flag to kubelet needs to be modified to use `<node-local-address>` that NodeLocal DNSCache is listening on.
  Otherwise, there is no need to modify the value of the `--cluster-dns` flag, since NodeLocal DNSCache listens on both the kube-dns service IP as well as `<node-local-address>`.
-->
* 运行 `kubectl create -f nodelocaldns.yaml`
* 如果 kube-proxy 运行在 IPVS 模式，需要修改 kubelet 的 `--cluster-dns` 参数为 NodeLocal DNSCache 正在侦听的 `<node-local-address>` 地址。
  否则，不需要修改 `--cluster-dns` 参数，因为 NodeLocal DNSCache 会同时侦听 kube-dns 服务的 IP 地址和 `<node-local-address>` 的地址。

<!--
Once enabled, node-local-dns Pods will run in the kube-system namespace on each of the cluster nodes. This Pod runs [CoreDNS](https://github.com/coredns/coredns) in cache mode, so all CoreDNS metrics exposed by the different plugins will be available on a per-node basis.

You can disable this feature by removing the DaemonSet, using `kubectl delete -f <manifest>` . You should also revert any changes you made to the kubelet configuration.
-->
启用后，node-local-dns Pods 将在每个集群节点上的 kube-system 名字空间中运行。
此 Pod 在缓存模式下运行 [CoreDNS](https://github.com/coredns/coredns) ，因此每个节点都可以使用不同插件公开的所有 CoreDNS 指标。

如果要禁用该功能，你可以使用 `kubectl delete -f <manifest>` 来删除 DaemonSet。你还应该恢复你对 kubelet 配置所做的所有改动。

<!--
## StubDomains and Upstream server Configuration
-->
## 存根域和上游服务器配置

<!--
StubDomains and upstream servers specified in the `kube-dns` ConfigMap in the `kube-system` namespace
are automatically picked up by `node-local-dns` pods. The ConfigMap contents need to follow the format
shown in [the example](/docs/tasks/administer-cluster/dns-custom-nameservers/#example-1).
The `node-local-dns` ConfigMap can also be modified directly with the stubDomain configuration
in the Corefile format. Some cloud providers might not allow modifying `node-local-dns` ConfigMap directly.
In those cases, the `kube-dns` ConfigMap can be updated.
-->
在 `kube-system` 命名空间中的 `kube-dns` ConfigMap 中指定的存根域以及上游服务器，会被 `node-local-dns` pods 自动采用。
其中，ConfigMap 的内容需要遵循[示例](/zh/docs/tasks/administer-cluster/dns-custom-nameservers/#示例-1)中的格式。
也可以将存根域的配置以 Corefile 的格式直接写入 `node-local-dns` ConfigMap 中。不过一些云供应商可能会不允许直接修改 `node-local-dns` ConfigMap，在那种情况下，可以转而更新 `kube-dns` ConfigMap。

<!--
## Setting memory limits
-->
## 设置内存限制

<!--
node-local-dns pods use memory for storing cache entries and processing queries. Since they do not watch Kubernetes objects, the cluster size or the number of Services/Endpoints do not directly affect memory usage. Memory usage is influenced by the DNS query pattern.
From [CoreDNS docs](https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md),
> The default cache size is 10000 entries, which uses about 30 MB when completely filled.

This would be the memory usage for each server block (if the cache gets completely filled).
Memory usage can be reduced by specifying smaller cache sizes.
-->
node-local-dns pods 使用内存来缓存记录和处理查询请求。因为不需要监视 Kubernetes 对象，所以集群的规模或是 Services/Endpoints 的数量不会直接影响内存用量。内存用量受 DNS 查询模式的影响。
[CoreDNS 文档](https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md)中有以下描述，
> 默认缓存大小为 10000 条记录，当填满时将会使用大约 30 MB 内存。

这会是每个服务器的内存用量(如果缓存被填满的话)。可以通过缩小缓存大小来减少内存用量。

<!--
The number of concurrent queries is linked to the memory demand, because each extra
goroutine used for handling a query requires an amount of memory. You can set an upper limit
using the `max_concurrent` option in the forward plugin.
-->
因为每一个额外的用于处理一次查询请求的 goroutine 都会消耗一定量的内存，所以同时发生的查询数会影响内存需求。
你可以通过设置转发插件中的 `max_concurrent` 选项来设置查询数的上限。

<!--
If a node-local-dns pod attempts to use more memory than is available (because of total system
resources, or because of a configured
[resource limit](/docs/concepts/configuration/manage-resources-containers/)), the operating system
may shut down that pod's container.
If this happens, the container that is terminated (“OOMKilled”) does not clean up the custom
packet filtering rules that it previously added during startup.
The node-local-dns container should get restarted (since managed as part of a DaemonSet), but this
will lead to a brief DNS downtime each time that the container fails: the packet filtering rules direct
DNS queries to a local Pod that is unhealthy.
-->
如果一个 node-local-dns pod 尝试使用的内存超出了可用范围 (因为系统资源总量的限制，或是配置了[资源限制](/zh/docs/concepts/configuration/manage-resources-containers/))，操作系统可能会关停该 pod 的容器。
在这种情况下，被关停的容器 (“OOMKilled”) 不会清理它于启动时添加的自定义包过滤规则。
关停之后 node-local-dns 容器应会自动启动 (因为它是 DaemonSet 的一部分)，但是每一次的关停都会导致DNS短时间的停工，因为：包过滤规则将 DNS 查询请求传给了一个不健康的本地 Pod。

<!--
You can determine a suitable memory limit by running node-local-dns pods without a limit and
measuring the peak usage. You can also set up and use a
[VerticalPodAutoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler)
in _recommender mode_, and then check its recommendations.
-->
你可以通过运行无限制的 node-local-dns pods 并计测内存峰值用量的方式来决定一个合适的内存限制。
你也可以设置并使用 _recommender 模式_ 的 [VerticalPodAutoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler)，然后检查其推荐。