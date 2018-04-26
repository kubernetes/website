---
title: 联邦（Federation）
cn-approvers:
- xiaosuiba
---
<!--
title: Federation
-->

{% capture overview %}
<!--
This page explains why and how to manage multiple Kubernetes clusters using
federation.
-->
本文阐述了为什么以及如何使用 federation 管理多个 Kubernetes 集群。
{% endcapture %}

{% capture body %}
<!--
## Why federation
-->
## 为什么要使用 federation

<!--
Federation makes it easy to manage multiple clusters. It does so by providing 2
major building blocks:

  * Sync resources across clusters: Federation provides the ability to keep
    resources in multiple clusters in sync. For example, you can ensure that the same deployment exists in multiple clusters.
  * Cross cluster discovery: Federation provides the ability to auto-configure DNS servers and load balancers with backends from all clusters. For example, you can ensure that a global VIP or DNS record can be used to access backends from multiple clusters.
-->

Federation 使管理多个集群变得简单。它通过提供两个主要构建模块来实现：

  * 跨集群同步资源：Federation 提供了在多个集群中保持资源同步的能力。例如，可以保证同一个 deployment 在多个集群中存在。
  * 跨集群服务发现：Federation 提供了自动配置 DNS 服务以及在所有集群后端上进行负载均衡的能力。例如，可以提供一个全局 VIP 或者 DNS 记录，通过它可以访问多个集群后端。

<!--
Some other use cases that federation enables are:

* High Availability: By spreading load across clusters and auto configuring DNS
  servers and load balancers, federation minimises the impact of cluster
  failure.
* Avoiding provider lock-in: By making it easier to migrate applications across
  clusters, federation prevents cluster provider lock-in.
  -->

Federation 还可以提供一些其它用例：

* 高可用：通过在集群间分布负载并自动配置 DNS 服务和负载均衡，federation 最大限度地减少集群故障的影响。
* 避免厂商锁定：通过更简单的跨集群应用迁移方式，federation 可以防止集群厂商锁定。

<!--
Federation is not helpful unless you have multiple clusters. Some of the reasons
why you might want multiple clusters are:

* Low latency: Having clusters in multiple regions minimize latency by serving
  users from the cluster that is closest to them.
* Fault isolation: It might be better to have multiple small clusters rather
  than a single large  cluster for fault isolation (for example: multiple
  clusters in different availability zones of a cloud provider).
  See [Multi cluster guide](/docs/concepts/cluster-administration/federation/) for details.
* Scalability: There are scalability limits to a single kubernetes cluster (this
  should not be the case for most users. For more details:
  [Kubernetes Scaling and Performance Goals](https://git.k8s.io/community/sig-scalability/goals.md)).
* [Hybrid cloud](#hybrid-cloud-capabilities): You can have multiple clusters on different cloud providers or
  on-premises data centers.
-->

Federation 对于单个集群没有用处。基于下面这些原因您可能会需要多个集群：

* 低延迟：通过在多个区域部署集群可以最大限度减少区域近端用户的延迟。
* 故障隔离：拥有多个小集群可能比单个大集群更利于故障隔离（例如：在云服务提供商的不同可用区中的多个集群）。详情请参考 [多集群指南](/docs/concepts/cluster-administration/federation/)。
* 可伸缩性：单个集群有可伸缩性限制（对于大多数用户这不是典型场景。更多细节请参考 [Kubernetes 弹性伸缩与性能目标](https://git.k8s.io/community/sig-scalability/goals.md)）。
* [混合云](#混合云能力)：您可以在不同的云服务提供商或本地数据中心中拥有多个集群。

<!--
### Caveats
-->
### 警告

<!--
While there are a lot of attractive use cases for federation, there are also
some caveats:

* Increased network bandwidth and cost: The federation control plane watches all
  clusters to ensure that the current state is as expected. This can lead to
  significant network cost if the clusters are running in different regions on
  a cloud provider or on different cloud providers.
* Reduced cross cluster isolation: A bug in the federation control plane can
  impact all clusters. This is mitigated by keeping the logic in federation
  control plane to a minimum. It mostly delegates to the control plane in
  kubernetes clusters whenever it can. The design and implementation also errs
  on the side of safety and avoiding multi-cluster outage.
* Maturity: The federation project is relatively new and is not very mature.
  Not all resources are available and many are still alpha. [Issue
  88](https://github.com/kubernetes/kubernetes/issues/88) enumerates
  known issues with the system that the team is busy solving.
-->

虽然 federation 有很多吸引人的使用案例，但也有一些注意事项：

* 增加网络带宽和成本：federation 控制平面监控所有集群以确保当前状态符合预期。如果集群在云服务提供商的不同区域或者不同的云服务提供商上运行时，这将导致明显的网络成本增加。
* 减少跨集群隔离：federation 控制平面中的 bug 可能影响所有集群。通过在 federation 中实现最少的逻辑可以缓解这种情况。只要有可能，它就将尽力把工作委托给 kubernetes 集群中的控制平面。这种设计和实现在安全性及避免多集群停止运行上也是错误的。
* 成熟度：federation 项目相对比较新，还不是很成熟。并不是所有资源都可用，许多仍然处于 alpha 状态。 [Issue 88](https://github.com/kubernetes/kubernetes/issues/88) 列举了团队目前正忙于解决的与系统相关的已知问题。

<!--
### Hybrid cloud capabilities
-->
### 混合云能力

<!--
Federations of Kubernetes Clusters can include clusters running in
different cloud providers (e.g. Google Cloud, AWS), and on-premises
(e.g. on OpenStack). Simply create all of the clusters that you
require, in the appropriate cloud providers and/or locations, and
register each cluster's API endpoint and credentials with your
Federation API Server (See the
[federation admin guide](/docs/admin/federation/) for details).
-->
Kubernetes 集群 federation 可以包含运行在不同云服务提供商（例如 Google Cloud、AWS）及本地（例如在 OpenStack 上）的集群。您只需要按需在适合的云服务提供商和/或地点上简单的创建集群，然后向 Federation API Server 注册每个集群的 API endpoint 和凭据即可。（详细信息请参阅 [federation 管理指南](/docs/admin/federation/)）。

<!--
Thereafter, your [API resources](#api-resources) can span different clusters
and cloud providers.
-->
此后，您的 [API 资源](#API-资源) 就可以跨越不同的集群和云服务提供商。

<!--
## Setting up federation
-->
## 设置 federation

<!--
To be able to federate multiple clusters, you first need to set up a federation
control plane.
Follow the [setup guide](/docs/tutorials/federation/set-up-cluster-federation-kubefed/) to set up the
federation control plane.
-->
为了能够联合（federate）多个集群，首先需要建立一个 federation 控制平面。请按照 [设置指南](/docs/tutorials/federation/set-up-cluster-federation-kubefed/) 设置 federation 控制平面。 

<!--
## API resources
-->
## API 资源

<!--
Once you have the control plane set up, you can start creating federation API
resources.
The following guides explain some of the resources in detail:
-->
一旦设置了控制平面，您就可以开始创建 federation API 资源。
以下指南详细介绍了一些资源：

* [Cluster](/docs/tasks/administer-federation/cluster/)
* [ConfigMap](/docs/tasks/administer-federation/configmap/)
* [DaemonSets](/docs/tasks/administer-federation/daemonset/)
* [Deployment](/docs/tasks/administer-federation/deployment/)
* [Events](/docs/tasks/administer-federation/events/)
* [Hpa](/docs/tasks/administer-federation/hpa/)
* [Ingress](/docs/tasks/administer-federation/ingress/)
* [Jobs](/docs/tasks/administer-federation/job/)
* [Namespaces](/docs/tasks/administer-federation/namespaces/)
* [ReplicaSets](/docs/tasks/administer-federation/replicaset/)
* [Secrets](/docs/tasks/administer-federation/secret/)
* [Services](/docs/concepts/cluster-administration/federation-service-discovery/)

<!--
[API reference docs](/docs/reference/federation/) lists all the
resources supported by federation apiserver.
-->
[API 参考文档](/docs/reference/federation/) 列举了 federation apiserver 支持的所有资源。

<!--
## Cascading deletion
-->
## 级联删除

<!--
Kubernetes version 1.6 includes support for cascading deletion of federated
resources. With cascading deletion, when you delete a resource from the
federation control plane, you also delete the corresponding resources in all underlying clusters.
-->
Kubernetes 1.6 版本包括了对联邦资源（federated resources）级联删除的支持。通过级联删除，当您从 federation 控制平面删除一个资源时，会同时删除所有底层集群中对应的资源。

<!--
Cascading deletion is not enabled by default when using the REST API. To enable
it, set the option `DeleteOptions.orphanDependents=false` when you delete a
resource from the federation control plane using the REST API. Using `kubectl
delete`
enables cascading deletion by default. You can disable it by running `kubectl
delete --cascade=false`
-->
当使用 REST API 时，级联删除没有默认开启。要想在使用 REST API 从 federation 控制平面删除资源时启用级联删除，请设置 `DeleteOptions.orphanDependents=false` 选项。使用 `kubectl delete` 时默认使用级联删除。您可以通过运行 `kubectl delete --cascade=false` 来禁用该功能。

<!--
Note: Kubernetes version 1.5 included cascading deletion support for a subset of
federation resources.
-->
注意：Kubernetes 1.5 版本支持的级联删除仅支持部分 federation 资源。

<!--
## Scope of a single cluster
-->
## 单个集群范围

<!--
On IaaS providers such as Google Compute Engine or Amazon Web Services, a VM exists in a
[zone](https://cloud.google.com/compute/docs/zones) or [availability
zone](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html).
We suggest that all the VMs in a Kubernetes cluster should be in the same availability zone, because:

  - compared to having a single global Kubernetes cluster, there are fewer single-points of failure.
  - compared to a cluster that spans availability zones, it is easier to reason about the availability properties of a
    single-zone cluster.
  - when the Kubernetes developers are designing the system (e.g. making assumptions about latency, bandwidth, or
    correlated failures) they are assuming all the machines are in a single data center, or otherwise closely connected.
-->

在诸如 Google Compute Engine 或者 Amazon Web Services 等 IaaS 服务提供商中，虚拟机存在于 [区域](https://cloud.google.com/compute/docs/zones) 或 [可用区](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html) 上。我们建议 Kubernetes 集群中的所有虚拟机应该位于相同的可用区，因为：

  - 与拥有单个全局 Kubernetes 集群相比，单点故障更少。
  - 与跨可用区集群相比，推测单区域集群的可用性属性更容易。
  - 当 Kubernetes 开发人员设计系统时（例如对延迟，带宽或相关故障进行假设），它们假设所有的机器都在一个单一的数据中心，或以其它方式紧密连接。

<!--
It is okay to have multiple clusters per availability zone, though on balance we think fewer is better.
Reasons to prefer fewer clusters are:

  - improved bin packing of Pods in some cases with more nodes in one cluster (less resource fragmentation).
  - reduced operational overhead (though the advantage is diminished as ops tooling and processes mature).
  - reduced costs for per-cluster fixed resource costs, e.g. apiserver VMs (but small as a percentage
    of overall cluster cost for medium to large clusters).
-->

在每个可用区域同时拥有多个集群也是可以的，但总体而言，我们认为少一点更好。
选择较少集群的理由是：

  - 某些情况下，在一个集群中拥有更多的节点可以改进 Pod 的装箱打包（较少资源碎片）。
  - 减少运维开销（尽管随着运维工具和流程的成熟，优势已经减少）。
  - 减少每个集群固定资源成本的开销，例如 apiserver 虚拟机（但对于大中型集群的整体集群成本来说百分比很小）。

<!--
Reasons to have multiple clusters include:

  - strict security policies requiring isolation of one class of work from another (but, see Partitioning Clusters
    below).
  - test clusters to canary new Kubernetes releases or other cluster software.
-->

拥有多个集群的原因包括：

  - 严格的安全策略要求将一类工作与另一类工作隔离开来（但是，请参见下面的分区集群（Partitioning Clusters））。
  - 对新的 Kubernetes 发行版或其它集群软件进行灰度测试。

<!--
## Selecting the right number of clusters
-->
## 选择正确的集群数量

<!--
The selection of the number of Kubernetes clusters may be a relatively static choice, only revisited occasionally.
By contrast, the number of nodes in a cluster and the number of pods in a service may change frequently according to
load and growth.
-->
Kubernetes 集群数量的选择可能是一个相对静态的选择，只是偶尔重新设置。相比之下，依据负载情况和增长，集群的节点数量和 service 的 pod 数量可能会经常变化。

<!--
To pick the number of clusters, first, decide which regions you need to be in to have adequate latency to all your end users, for services that will run
on Kubernetes (if you use a Content Distribution Network, the latency requirements for the CDN-hosted content need not
be considered).  Legal issues might influence this as well. For example, a company with a global customer base might decide to have clusters in US, EU, AP, and SA regions.
Call the number of regions to be in `R`.
-->
要选择集群的数量，首先要确定使用哪些区域，以便为所有终端用户提供足够低的延迟，以在 Kubernetes 上运行服务（如果您使用内容分发网络（Content Distribution Network，CDN），则 CDN 托管内容的时延要求不需要考虑）。法律问题也可能影响到这一点。例如，拥有全球客户群的公司可能会决定在美国、欧盟、亚太和南亚地区拥有集群。我们将选择的区域数量称为 `R`。

<!--
Second, decide how many clusters should be able to be unavailable at the same time, while still being available.  Call
the number that can be unavailable `U`.  If you are not sure, then 1 is a fine choice.
-->
其次，决定在整体仍然可用的前提下，可以同时有多少集群不可用。将不可用集群的数量称为 `U`。如果您不能确定，那么 1 是一个不错的选择。

<!--
If it is allowable for load-balancing to direct traffic to any region in the event of a cluster failure, then
you need at least the larger of `R` or `U + 1` clusters.  If it is not (e.g. you want to ensure low latency for all
users in the event of a cluster failure), then you need to have `R * (U + 1)` clusters
(`U + 1` in each of `R` regions).  In any case, try to put each cluster in a different zone.
-->
如果在集群故障的情形下允许负载均衡将流量引导到任何区域，则至少需要有比 `R` 或 `U + 1` 数量更大的集群。如果不行的话（例如希望在集群发生故障时对所有用户确保低延迟），那么您需要有数量为 `R * (U + 1)` 的集群（`R` 个区域，每个中有 `U + 1` 个集群）。无论如何，请尝试将每个集群放在不同的区域中。

<!--
Finally, if any of your clusters would need more than the maximum recommended number of nodes for a Kubernetes cluster, then
you may need even more clusters.  Kubernetes v1.3 supports clusters up to 1000 nodes in size. Kubernetes v1.8 supports
clusters up to 5000 nodes. See [Building Large Clusters](/docs/admin/cluster-large/) for more guidance.
-->
最后，如果您的任何集群需要比 Kubernetes 集群最大建议节点数更多的节点，那么您可能需要更多的集群。 Kubernetes v1.3 支持最多 1000 个节点的集群。 Kubernetes v1.8 支持最多 5000 个节点的集群。更多的指导请参见 [构建大型集群](/docs/admin/cluster-large/)。

{% endcapture %}

{% capture whatsnext %}
<!--
* Learn more about the [Federation
  proposal](https://github.com/kubernetes/community/blob/{{page.githubbranch}}/contributors/design-proposals/multicluster/federation.md).
* See this [setup guide](/docs/tutorials/federation/set-up-cluster-federation-kubefed/) for cluster federation.
* See this [Kubecon2016 talk on federation](https://www.youtube.com/watch?v=pq9lbkmxpS8)
-->
* 了解更多关于 [Federation 提议](https://github.com/kubernetes/community/blob/{{page.githubbranch}}/contributors/design-proposals/multicluster/federation.md)。
* 有关集群 federation，请参阅此 [安装指南](/docs/tutorials/federation/set-up-cluster-federation-kubefed/)。
* 请参阅 [federation 在 Kubecon2016 上的讨论](https://www.youtube.com/watch?v=pq9lbkmxpS8)。
{% endcapture %}

{% include templates/concept.md %}

