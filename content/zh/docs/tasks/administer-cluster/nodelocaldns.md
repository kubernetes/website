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
This feature can be enabled using the command:
-->
可以使用以下命令启用此功能：

`KUBE_ENABLE_NODELOCAL_DNS=true go run hack/e2e.go -v --up`

<!--
This works for e2e clusters created on GCE. On all other environments, the following steps will setup NodeLocal DNSCache:
-->
这适用于在 GCE 上创建 e2e 集群。
在所有其他环境上，以下步骤将设置 NodeLocal DNSCache ：

<!--
* A yaml similar to [this](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml) can be applied using `kubectl create -f` command.
-->
* 可以使用 `kubectl create -f` 命令应用类似于[这个](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml)的 Yaml 。

<!--
* --cluster-dns flag to kubelet needs to be modified to use the LOCAL_DNS IP that NodeLocal DNSCache is listening on (169.254.20.10 by default)
-->
* 需要修改 kubelet 的 --cluster-dns 标志以使用 NodeLocal DNSCache 正在侦听的 LOCAL_DNS IP（默认为 169.254.20.10 ）

<!--
Once enabled, node-local-dns Pods will run in the kube-system namespace on each of the cluster nodes. This Pod runs [CoreDNS](https://github.com/coredns/coredns) in cache mode, so all CoreDNS metrics exposed by the different plugins will be available on a per-node basis.
-->
启用后，node-local-dns Pods 将在每个集群节点上的 kube-system 名称空间中运行。
此 Pod 在缓存模式下运行 [CoreDNS](https://github.com/coredns/coredns) ，因此每个节点都可以使用不同插件公开的所有 CoreDNS 指标。

<!--
### Feature availability
-->
### 功能可用性

<!--
The addon can be applied using the yaml specified above in any k8s version. The feature support is as described:
-->
可以在任何 K8s 版本中使用上面指定的 yaml 应用该插件。
功能支持如下所述：

<!--
| k8s version | Feature support |
| :---------: |:-----------:|
| 1.15 | Beta(Not enabled by default) |
| 1.13 | Alpha(Not enabled by default) |
-->
| k8s 版本 | 功能支持 |
| :---------: |:-----------:|
| 1.15 | Beta(默认情况下未启用) |
| 1.13 | Alpha(默认情况下未启用) |

 

