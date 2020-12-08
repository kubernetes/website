---
title: 在 Kubernetes 集群中使用 NodeLocal DNSCache
content_type: task
---
<!--
---
reviewers:
- bowei
- zihongz
- sftim
title: Using NodeLocal DNSCache in Kubernetes clusters
content_type: task
---
-->

<!-- overview -->
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

{{< note >}} The local listen IP address for NodeLocal DNSCache can be any IP in the 169.254.20.0/16 space or any other IP address that can be guaranteed to not collide with any existing IP. This document uses 169.254.20.10 as an example.
{{< /note >}}

-->
{{< note >}}
NodeLocal DNSCache 的本地侦听 IP 地址可以是 169.254.20.0/16 空间中的任何 IP，
也可以是可以保证不会与任何现有 IP 冲突的任何其他 IP 地址。
本文档以 169.254.20.10 为例。
{{< /note >}}

<!--
This feature can be enabled using the following steps:
-->
可以使用以下步骤启用此功能：

<!--
* Prepare a manifest similar to the sample [`nodelocaldns.yaml`](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml) and save it as `nodelocaldns.yaml.`
-->
* 准备与示例  [`nodelocaldns.yaml`]
  (https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml) 
  相似的清单并保存为 `nodelocaldns.yaml 。
<!--
* Substitute the variables in the manifest with the right values:
-->
* 用正确的值替换清单中的变量：

     * kubedns=`kubectl get svc kube-dns -n kube-system -o jsonpath={.spec.clusterIP}`

     * domain=`<cluster-domain>`

     * localdns=`<node-local-address>`

<!--
     `<cluster-domain>` is "cluster.local" by default. `<node-local-address>` is the local listen IP address chosen for NodeLocal DNSCache.
-->
     `<cluster-domain>` 默认为 "cluster.local"。
     `<node-local-address>` 是为 NodeLocal DNSCache 选择的本地监听 IP 地址。

<!--
   * If kube-proxy is running in IPTABLES mode:
-->
   * 如果 kube-proxy 以 IPTABLES 模式运行：

     ``` bash
     sed -i "s/__PILLAR__LOCAL__DNS__/$localdns/g; s/__PILLAR__DNS__DOMAIN__/$domain/g; s/__PILLAR__DNS__SERVER__/$kubedns/g" nodelocaldns.yaml
     ```

	<!--
     `__PILLAR__CLUSTER__DNS__` and `__PILLAR__UPSTREAM__SERVERS__` will be populated by the node-local-dns pods.
     In this mode, node-local-dns pods listen on both the kube-dns service IP as well as `<node-local-address>`, so pods can lookup DNS records using either IP address.
	-->
     `__PILLAR__CLUSTER__DNS__` 和 `__PILLAR__UPSTREAM__SERVERS__` 将由 node-local-dns Pods 填充。
     在这种模式下，node-local-dns Pods 会同时监听 kube-dns 服务 IP 和 `<node-local-address>`，
     因此 pods 可以使用任一 IP 地址查找 DNS 记录。

<!--
  * If kube-proxy is running in IPVS mode:
-->
  * 如果 kube-proxy运行在 IPVS 模式：

    ``` bash
     sed -i "s/__PILLAR__LOCAL__DNS__/$localdns/g; s/__PILLAR__DNS__DOMAIN__/$domain/g; s/__PILLAR__DNS__SERVER__//g; s/__PILLAR__CLUSTER__DNS__/$kubedns/g" nodelocaldns.yaml
    ```
<!--
     In this mode, node-local-dns pods listen only on `<node-local-address>`. The node-local-dns interface cannot bind the kube-dns cluster IP since the interface used for IPVS loadbalancing already uses this address.
     `__PILLAR__UPSTREAM__SERVERS__` will be populated by the node-local-dns pods.
-->
     在这种模式下，node-local-dns pod 只能在 `<node-local-address>` 上监听。
     node-local-dns 接口无法绑定 kube-dns 集群 IP，因为用于 IPVS 负载均衡的接口已使用此地址。
     `__PILLAR__UPSTREAM__SERVERS__` 将由 node-local-dns Pods 填充。

<!--
* Run `kubectl create -f nodelocaldns.yaml`
-->
* 运行 `kubectl create -f nodelocaldns.yaml`
<!--
* If using kube-proxy in IPVS mode, `--cluster-dns` flag to kubelet needs to be modified to use `<node-local-address>` that NodeLocal DNSCache is listening on.
  Otherwise, there is no need to modify the value of the `--cluster-dns` flag, since NodeLocal DNSCache listens on both the kube-dns service IP as well as `<node-local-address>`.
-->
* 如果在 IPVS 模式使用 kube-proxy，需要修改 kubelet 的 `--cluster-dns` 标志，
  以使用 NodeLocal DNSCache 正在监听的 `<node-local-address>`。
  否则，由于 NodeLocal DNSCache 监听 kube-dns 服务 IP 和 `<node-local-address>`，
  因此不需要修改 `--cluster-dns` 标志的值。

<!--
Once enabled, node-local-dns Pods will run in the kube-system namespace on each of the cluster nodes. This Pod runs [CoreDNS](https://github.com/coredns/coredns) in cache mode, so all CoreDNS metrics exposed by the different plugins will be available on a per-node basis.
-->
启用后，node-local-dns Pods 将在每个集群节点上的 kube-system 命名空间中运行。
这个 Pod 以缓存模式运行 [CoreDNS](https://github.com/coredns/coredns)，因此
所有由不同插件公开的 CoreDNS 指标将在每个节点均可用。

<!--
You can disable this feature by removing the DaemonSet, using `kubectl delete -f <manifest>` . You should also revert any changes you made to the kubelet configuration.
-->
你可以通过使用 `kubectl delete -f <manifest>` 删除 DaemonSet 来禁用此功能。 你还应该还原对 kubelet 配置所做的任何更改。

 
