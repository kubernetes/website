---
title: "容器中运行有状态的应用！？ Kubernetes 1.3 说 “是！” "
date: 2016-07-13
slug: stateful-applications-in-containers-kubernetes
---
<!--
title: " Stateful Applications in Containers!? Kubernetes 1.3 Says “Yes!” "
date: 2016-07-13
slug: stateful-applications-in-containers-kubernetes
url: /blog/2016/07/stateful-applications-in-containers-kubernetes
-->

<!--
_Editor's note: today’s guest post is from Mark Balch, VP of Products at Diamanti, who’ll share more about the contributions they’ve made to Kubernetes._    
-->
_编者注： 今天的来宾帖子来自 Diamanti 产品副总裁 Mark Balch，他将分享有关他们对 Kubernetes 所做的贡献的更多信息。_ 

<!--

Congratulations to the Kubernetes community on another [value-packed release](https://kubernetes.io/blog/2016/07/kubernetes-1-3-bridging-cloud-native-and-enterprise-workloads/). A focus on stateful applications and federated clusters are two reasons why I’m so excited about 1.3. Kubernetes support for stateful apps such as Cassandra, Kafka, and MongoDB is critical. Important services rely on databases, key value stores, message queues, and more. Additionally, relying on one data center or container cluster simply won’t work as apps grow to serve millions of users around the world. Cluster federation allows users to deploy apps across multiple clusters and data centers for scale and resiliency.

-->
祝贺 Kubernetes 社区发布了另一个[有价值的版本](https://kubernetes.io/blog/2016/07/kubernetes-1-3-bridging-cloud-native-and-enterprise-workloads/)。
专注于有状态应用程序和联邦集群是我对 1.3 如此兴奋的两个原因。
Kubernetes 对有状态应用程序（例如 Cassandra、Kafka 和 MongoDB）的支持至关重要。
重要服务依赖于数据库、键值存储、消息队列等。
此外，随着应用程序的发展为全球数百万用户提供服务，仅依靠一个数据中心或容器集群将无法正常工作。
联邦集群允许用户跨多个集群和数据中心部署应用程序，以实现规模和弹性。

<!--
You may have [heard me say before](https://www.diamanti.com/blog/the-next-great-application-platform/) that containers are the next great application platform. Diamanti is accelerating container adoption for stateful apps in production - where performance and ease of deployment really matter.&nbsp;  
-->
您可能[之前听过我说过](https://www.diamanti.com/blog/the-next-great-application-platform/)，容器是下一个出色的应用程序平台。
Diamanti 正在加速在生产中使用有状态应用程序的容器-在这方面，性能和易于部署非常重要。

<!--
**Apps Need More Than Cattle**  
-->
**应用程序不仅仅需要牛**  

<!--
Beyond stateless containers like web servers (so-called “cattle” because they are interchangeable), users are increasingly deploying stateful workloads with containers to benefit from “build once, run anywhere” and to improve bare metal efficiency/utilization. These “pets” (so-called because each requires special handling) bring new requirements including longer life cycle, configuration dependencies, stateful failover, and performance sensitivity. Container orchestration must address these needs to successfully deploy and scale apps.  
-->
除了诸如Web服务器之类的无状态容器（因为它们是可互换的，因此被称为“牛”）之外，用户越来越多地使用容器来部署有状态工作负载，以从“一次构建，随处运行”中受益并提高裸机效率/利用率。
这些“宠物”（之所以称为“宠物”，是因为每个宠物都需要特殊的处理）带来了新的要求，包括更长的生命周期，配置依赖项，有状态故障转移以及性能敏感性。
容器编排必须满足这些需求，才能成功部署和扩展应用程序。

<!--
Enter [Pet Set](/docs/user-guide/petset/), a new object in Kubernetes 1.3 for improved stateful application support. Pet Set sequences through the startup phase of each database replica (for example), ensuring orderly master/slave configuration. Pet Set also simplifies service discovery by leveraging ubiquitous DNS SRV records, a well-recognized and long-understood mechanism.  
-->
输入 [Pet Set](/docs/user-guide/petset/)，这是 Kubernetes 1.3 中的新对象，用于改进对状态应用程序的支持。
Pet Set 在每个数据库副本的启动阶段进行排序（例如），以确保有序的主/从配置。
Pet Set 还利用普遍存在的 DNS SRV 记录简化了服务发现，DNS SRV 记录是一种广为人知且长期了解的机制。

<!--
Diamanti’s [FlexVolume contribution](https://github.com/kubernetes/kubernetes/pull/13840) to Kubernetes enables stateful workloads by providing persistent volumes with low-latency storage and guaranteed performance, including enforced quality-of-service from container to media.  
-->
Diamanti 对 Kubernetes 的 [FlexVolume 贡献](https://github.com/kubernetes/kubernetes/pull/13840) 通过为持久卷提供低延迟存储并保证性能来实现有状态工作负载，包括从容器到媒体的强制服务质量。

<!--
**A Federalist**  
-->
**联邦主义者** 

<!--
Users who are planning for application availability must contend with issues of failover and scale across geography. Cross-cluster federated services allows containerized apps to easily deploy across multiple clusters. Federated services tackles challenges such as managing multiple container clusters and coordinating service deployment and discovery across federated clusters.  
-->
为应用可用性作规划的用户必须应对故障迁移问题并在整个地理区域内扩展。
跨集群联邦服务允许容器化的应用程序轻松跨多个集群进行部署。
联邦服务解决了诸如管理多个容器集群以及协调跨联邦集群的服务部署和发现之类的挑战。

<!--
Like a strictly centralized model, federation provides a common app deployment interface. With each cluster retaining autonomy, however, federation adds flexibility to manage clusters locally during network outages and other events. Cross-cluster federated services also applies consistent service naming and adoption across container clusters, simplifying DNS resolution.  
-->
像严格的集中式模型一样，联邦身份验证提供了通用的应用程序部署界面。
但是，由于每个集群都具有自治权，因此联邦会增加了在网络中断和其他事件期间在本地管理集群的灵活性。
跨集群联邦服务还可以提供跨容器集群应用一致的服务命名和采用，简化 DNS 解析。

<!--
It’s easy to imagine powerful multi-cluster use cases with cross-cluster federated services in future releases. An example is scheduling containers based on governance, security, and performance requirements. Diamanti’s scheduler extension was developed with this concept in mind. Our [first implementation](https://github.com/kubernetes/kubernetes/pull/13580) makes the Kubernetes scheduler aware of network and storage resources local to each cluster node. Similar concepts can be applied in the future to broader placement controls with cross-cluster federated services.&nbsp;  
-->
很容易想象在将来的版本中具有跨集群联邦服务的强大多集群用例。
一个示例是根据治理，安全性和性能要求调度容器。
Diamanti 的调度程序扩展是在考虑了这一概念的基础上开发的。
我们的[第一个实现](https://github.com/kubernetes/kubernetes/pull/13580)使 Kubernetes 调度程序意识到每个集群节点本地的网络和存储资源。
将来，类似的概念可以应用于跨集群联邦服务的更广泛的放置控件。

<!--
**Get Involved**  
-->
**参与其中**  

<!--
With interest growing in stateful apps, work has already started to further enhance Kubernetes storage. The Storage Special Interest Group is discussing proposals to support local storage resources. Diamanti is looking forward to extend FlexVolume to include richer APIs that enable local storage and storage services including data protection, replication, and reduction. We’re also working on proposals for improved app placement, migration, and failover across container clusters through Kubernetes cross-cluster federated services.  
-->
随着对有状态应用的兴趣日益浓厚，人们已经开始进一步增强 Kubernetes 存储的工作。
存储特别兴趣小组正在讨论支持本地存储资源的提案。
Diamanti 期待将 FlexVolume 扩展到包括更丰富的 API，这些 API 可以启用本地存储和存储服务，包括数据保护，复制和缩减。
我们还正在研究有关通过 Kubernetes 跨集群联邦服务改善应用程序放置，迁移和跨容器集群故障转移的建议。

<!--
Join the conversation and contribute! Here are some places to get started:  
-->
加入对话并做出贡献！
这里是一些入门的地方：

<!--
- Product Management [group](https://groups.google.com/forum/#!forum/kubernetes-sig-pm)
- Kubernetes [Storage SIG](https://groups.google.com/forum/#!forum/kubernetes-sig-storage)&nbsp;
- Kubernetes [Cluster Federation SIG](https://groups.google.com/forum/#!forum/kubernetes-sig-federation)
-->
- 产品管理 [组](https://groups.google.com/forum/#!forum/kubernetes-sig-pm)
- Kubernetes [存储 SIG](https://groups.google.com/forum/#!forum/kubernetes-sig-storage)&nbsp;
- Kubernetes [集群联邦 SIG](https://groups.google.com/forum/#!forum/kubernetes-sig-federation)

<!--
_-- Mark Balch, VP Products, [Diamanti](https://diamanti.com/). Twitter [@markbalch](https://twitter.com/markbalch)_  
-->
_-- [Diamanti](https://diamanti.com/) 产品副总裁 Mark Balch。 Twitter [@markbalch](https://twitter.com/markbalch)_
