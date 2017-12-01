---
title: 联邦
---

{% capture overview %}
本页面阐明了为何以及如何使用联邦创建Kubernetes集群。
{% endcapture %}

{% capture body %}
## 为何使用联邦

联邦可以使多个集群的管理简单化。它提供了两个主要构件模块：

  * 跨集群同步资源：联邦能够让资源在多个集群中同步。例如，你可以确保在多个集群中存在同样的部署。
  * 跨集群发现：联邦能够在所有集群的后端自动配置DNS服务和负载均衡。例如，通过多个集群的后端，你可以确保全局的VIP或DNS记录可用。

联邦技术的其他应用场景：

* 高可用性：通过跨集群分摊负载，自动配置DNS服务和负载均衡，联邦将集群失败所带来的影响降到最低。
* 避免供应商锁定：跨集群使迁移应用程序变得更容易，联邦服务避免了供应商锁定。


只有在多个集群的场景下联邦服务才是有帮助的。这里列出了一些你会使用多个集群的原因：

* 降低延迟：在多个区域含有集群，可使用离用户最近的集群来服务用户，从而最大限度降低延迟。
* 故障隔离：对于故障隔离，也许有多个小的集群比有一个大的集群要更好一些（例如：一个云供应商的不同可用域里有多个集群）。详细信息请参阅[多集群指南](/docs/admin/multi-cluster)。
* 可伸缩性：对于单个kubernetes集群是有伸缩性限制的（但对于大多数用户来说并非如此。更多细节参考[Kubernetes扩展和性能目标](https://git.k8s.io/community/sig-scalability/goals.md)）。
* [混合云](#混合云的能力)：可以有多个集群，它们分别拥有不同的云供应商或者本地数据中心。

### 注意事项

虽然联邦有很多吸引人的场景，但这里还是有一些需要关注的事项：

* 增加网络的带宽和损耗：联邦控制面会监控所有的集群，来确保集群的当前状态与预期一致。那么当这些集群运行在一个或者多个云提供者的不同区域中，则会带来重大的网络损耗。
* 降低集群的隔离：当联邦控制面中存在一个故障时，会影响所有的集群。把联邦控制面的逻辑降到最小可以缓解这个问题。 无论何时，它都是kubernetes集群里控制面的代表。设计和实现也使其变得更安全,避免多集群运行中断。
* 完整性：联邦项目相对较新，还不是很成熟。不是所有资源都可用，且很多资源才刚刚开始。[Issue 38893](https://github.com/kubernetes/kubernetes/issues/38893) 列举了一些团队正忙于解决的系统已知问题。

### 混合云的能力

Kubernetes集群里的联邦包括运行在不同云供应商上的集群（例如，谷歌云、亚马逊），和本地部署的集群（例如，OpenStack）。只需在适当的云供应商和/或位置创建所需的所有集群，并将每个集群的API endpoint和凭据注册到您的联邦API服务中（详情参考[联邦管理指南](/docs/admin/federation/)）。

在此之后，您的[API资源](#api资源)就可以跨越不同的集群和云供应商。

## 建立联邦

若要能联合多个集群，首先需要建立一个联邦控制面。参照[安装指南](/docs/tutorials/federation/set-up-cluster-federation-kubefed/) 建立联邦控制面。

## API资源

控制面建立完成后，就可以开始创建联邦API资源了。
以下指南详细介绍了一些资源：

* [Cluster](/docs/tasks/administer-federation/cluster/)
* [ConfigMap](/docs/tasks/administer-federation/configmap/)
* [DaemonSets](/docs/tasks/administer-federation/daemonset/)
* [Deployment](/docs/tasks/administer-federation/deployment/)
* [Events](/docs/tasks/administer-federation/events/)
* [Ingress](/docs/tasks/administer-federation/ingress/)
* [Namespaces](/docs/tasks/administer-federation/namespaces/)
* [ReplicaSets](/docs/tasks/administer-federation/replicaset/)
* [Secrets](/docs/tasks/administer-federation/secret/)
* [Services](/docs/concepts/cluster-administration/federation-service-discovery/)

[API参考文档](/docs/reference/federation/)列举了联邦API服务支持的所有资源。

## 级联删除

Kubernetes1.6版本支持联邦资源级联删除。使用级联删除，即当删除联邦控制面的一个资源时，也删除了所有底层集群中的相应资源。

当使用REST API时，级联删除功能不是默认开启的。若使用REST API从联邦控制面删除一个资源时，要开启级联删除功能，即需配置选项 `DeleteOptions.orphanDependents=false`。使用`kubectl delete`使级联删除功能默认开启。使用`kubectl delete --cascade=false`禁用级联删除功能。

注意：Kubernetes1.5版本开始支持联邦资源子集的级联删除。

## 单个集群的范围

对于IaaS供应商如谷歌计算引擎或亚马逊网络服务，一个虚拟机存在于一个[域](https://cloud.google.com/compute/docs/zones)或[可用域](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html)中。
我们建议一个Kubernetes集群里的所有虚机应该在相同的可用域里，因为：

  - 与单一的全局Kubernetes集群对比，该方式有较少的单点故障。
  - 与跨可用域的集群对比，该方式更容易推断单区域集群的可用性属性。
  - 当Kubernetes开发者设计一个系统(例如，对延迟、带宽或相关故障进行假设)，他们也会假设所有的机器都在一个单一的数据中心，或者以其他方式紧密相连。

每个可用区域里包含多个集群当然是可以的，但是总的来说我们认为集群数越少越好。
偏爱较少集群数的原因是：

  - 在某些情况下，在一个集群里有更多的节点，可以改进Pods的装箱问题（更少的资源碎片）。
  - 减少操作开销（尽管随着OPS工具和流程的成熟而降低了这块的优势）。
  - 为每个集群的固定资源花费降低开销，例如，使用apiserver的虚拟机（但是在全体集群开销中，中小型集群的开销占比要小的多）。

多集群的原因包括：

  - 严格的安全性策略要求隔离一类工作与另一类工作（但是，请参见下面的集群分割）。
  - 测试集群或其他集群软件直至最优的新Kubernetes版本发布。

## 选择合适的集群数

Kubernetes集群数量选择也许是一个相对静止的选择，因为对其重新审核的情况很少。相比之下，一个集群中的节点数和一个服务中的pods数可能会根据负载和增长频繁变化。

选择集群的数量，首先，需要决定哪些区域对于将要运行在Kubernetes上的服务，可以有足够的时间到达所有的终端用户（如果使用内容分发网络，则不需要考虑CDN-hosted内容的延迟需求）。法律问题也可能影响这一点。例如，拥有全球客户群的公司可能会对于在美国、欧盟、亚太和南非地区拥有集群起到决定权。使用`R`代表区域的数量。

其次，决定有多少集群在同一时间不可用，而一些仍然可用。使用`U`代表不可用的数量。如果不确定，最好选择1。

如果允许负载均衡在集群故障发生时将通信引导到任何区域，那么至少需要较大的`R`或`U + 1`集群。若非如此（例如，若要在集群故障发生时确保所有用户的低延迟），则需要`R * (U + 1)`集群(在每一个`R`区域里都有`U + 1`)。在任何情况下，尝试将每个集群放在不同的区域中。

最后，如果你的集群需求超过一个Kubernetes集群推荐的最大节点数，那么你可能需要更多的集群。Kubernetes1.3版本支持多达1000个节点的集群规模。

{% endcapture %}

{% capture whatsnext %}
* 进一步学习[联邦提案](https://github.com/kubernetes/community/blob/{{page.githubbranch}}/contributors/design-proposals/multicluster/federation.md)。
* 集群联邦参考该[配置指导](/docs/tutorials/federation/set-up-cluster-federation-kubefed/)。
* 查看[Kubecon2016浅谈联邦](https://www.youtube.com/watch?v=pq9lbkmxpS8)
{% endcapture %}

{% include templates/concept.md %}

