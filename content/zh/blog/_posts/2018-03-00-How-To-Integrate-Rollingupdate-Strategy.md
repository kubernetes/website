---
title: "如何在 Kubernetes 中为 TPR 集成滚动更新策略"
date: 2018-03-13
slug: how-to-integrate-rollingupdate-strategy
url: /blog/2018/03/How-To-Integrate-Rollingupdate-Strategy
---
<!--
---
title: "How to Integrate RollingUpdate Strategy for TPR in Kubernetes"
date: 2018-03-13
slug: how-to-integrate-rollingupdate-strategy
url: /blog/2018/03/How-To-Integrate-Rollingupdate-Strategy
---
-->

<!--
With Kubernetes, it's easy to manage and scale stateless applications like web apps and API services right out of the box. To date, almost all of the talks about Kubernetes has been about microservices and stateless applications.

With the popularity of container-based microservice architectures, there is a strong need to deploy and manage RDBMS(Relational Database Management Systems). RDBMS requires experienced database-specific knowledge to correctly scale, upgrade, and re-configure while protecting against data loss or unavailability.

For example, MySQL (the most popular open source RDBMS) needs to store data in files that are persistent and exclusive to each MySQL database's storage. Each MySQL database needs to be individually distinct, another, more complex is in cluster that need to distinguish one MySQL database from a cluster as a different role, such as master, slave, or shard. High availability and zero data loss are also hard to accomplish when replacing database nodes on failed machines.
-->
在 Kubernetes 中，开箱即可轻松管理和扩展无状态应用程序，例如 Web 应用程序和 API 服务。迄今为止，关于 Kubernetes 所有的讨论几乎都涉及微服务和无状态应用程序。

随着基于容器的微服务体系结构的普及，迫切需要部署和管理 RDBMS（关系数据库管理系统）。RDBMS 需要熟练的特定于数据库的知识进行正确地扩展、升级和重新配置，同时防止数据丢失或不可用。

例如，MySQL（最流行的开源 RDBMS）需要将数据存储在 MySQL 数据库中的持久且互斥的文件中。每个 MySQL 数据库都需要彼此独立，然而，群集中的情况则更为复杂，需要将集群中的一个 MySQL 数据库区别为不同角色，例如主，从或分片。在替换故障机器上的数据库节点时，也很难实现高可用性和零数据丢失。

<!--
Using powerful Kubernetes API extension mechanisms, we can encode RDBMS domain knowledge into software, named WQ-RDS, running atop Kubernetes like built-in resources.

WQ-RDS leverages Kubernetes primitive resources and controllers, it deliveries a number of enterprise-grade features and brings a significantly reliable way to automate time-consuming operational tasks like database setup, patching backups, and setting up high availability clusters. WQ-RDS supports mainstream versions of Oracle and MySQL (both compatible with MariaDB).

Let's demonstrate how to manage a MySQL sharding cluster.
-->
使用强大的 Kubernetes API 扩展机制，我们可以将 RDBMS 领域知识编码成名为 WQ-RDS 的软件，该软件可以像内置资源一样在 Kubernetes 上运行。

WQ-RDS 利用 Kubernetes 原始资源和控制器，提供了许多企业级功能，为自动耗时的操作任务带带了一种非常可靠的方法，例如数据库设置、修补备份和设置高可用性集群。WQ-RDS 支持 Oracle 和 MySQL 的主流版本（均与 MariaDB 兼容）。

让我们演示如何管理 MySQL 分片集群。

<!--
###  MySQL Sharding Cluster

MySQL Sharding Cluster is a scale-out database architecture. Based on the hash algorithm, the architecture distributes data across all the shards of the cluster. Sharding is entirely transparent to clients: Proxy is able to connect to any Shards in the cluster and issue queries to the correct shards directly.
-->
###  MySQL 分片集群

MySQL 分片集群是一种横向扩展的数据库体系结构。基于哈希算法，该体系结构将数据分布在集群的所有分片上。分片对客户端是完全透明的：代理能够连接到集群中的任何分片，并直接向正确的分片发出查询。

| ----- |
| ![][1] |
|

<!--
Note: Each shard corresponds to a single MySQL instance. Currently, WQ-RDS supports a maximum of 64 shards.
-->
注意：每个分片对应一个 MySQL 实例。当前，WQ-RDS 最多支持 64 个分片。

 |

<!--
All of the shards are built with Kubernetes Statefulset, Services, Storage Class, configmap, secrets and MySQL. WQ-RDS manages the entire lifecycle of the sharding cluster. Advantages of the sharding cluster are obvious:  

* Scale out queries per second (QPS) and transactions per second (TPS)
* Scale out storage capacity: gain more storage by distributing data to multiple nodes
-->
所有的分片都是使用 Kubernetes Statefulset，Services，Storage Class，configmap，secrets 和 MySQL 构建的。WQ-RDS 管理分片群集的整个生命周期。分片集群的优势显而易见：

* 扩展每秒查询数（QPS）和每秒事务数（TPS）
* 扩展存储容量：通过将数据分布到多个节点来获得更多存储空间

<!--
###  Create a MySQL Sharding Cluster

Let's create a Kubernetes cluster with 8 shards.  
-->
###  创建 MySQL 分片集群

让我们创建一个具有 8 个分片的 Kubernetes 集群。

```
 kubectl create -f mysqlshardingcluster.yaml
```
<!--
Next, create a MySQL Sharding Cluster including 8 shards.  

* TPR : MysqlCluster and MysqlDatabase
-->
接下来，创建一个包含 8 个分片的 MySQL 分片集群。

* TPR： MysqlCluster 和 MysqlDatabase

```
[root@k8s-master ~]# kubectl get mysqlcluster  


NAME             KIND

clustershard-c   MysqlCluster.v1.mysql.orain.com
```

<!--
MysqlDatabase from clustershard-c0 to clustershard-c7 belongs to MysqlCluster clustershard-c.
-->
MysqlDatabase 中 clustershard-c0 到 clustershard-c7 分片集群都属于 MysqlCluster 中的 clustershard-c。

```
[root@k8s-master ~]# kubectl get mysqldatabase  

NAME KIND  

clustershard-c0 MysqlDatabase.v1.mysql.orain.com  

clustershard-c1 MysqlDatabase.v1.mysql.orain.com  

clustershard-c2 MysqlDatabase.v1.mysql.orain.com  

clustershard-c3 MysqlDatabase.v1.mysql.orain.com  

clustershard-c4 MysqlDatabase.v1.mysql.orain.com  

clustershard-c5 MysqlDatabase.v1.mysql.orain.com  

clustershard-c6 MysqlDatabase.v1.mysql.orain.com  

clustershard-c7 MysqlDatabase.v1.mysql.orain.com
```

<!--
Next, let's look at two main features: high availability and RollingUpdate strategy.

To demonstrate, we'll start by running sysbench to generate some load on the cluster. In this example, QPS metrics are generated by MySQL export, collected by Prometheus, and visualized in Grafana.
-->
接下来，让我们看一下两个主要功能：高可用性和滚动更新策略。

为了方便演示，我们将从运行 sysbench 开始，先在集群上生成一些负载。在此示例中，QPS 指标由 MySQL 导出生成，由 Prometheus 收集，并在 Grafana 中进行可视化。

<!--
###  Feature: high availability

WQ-RDS handles MySQL instance crashes while protecting against data loss.

When killing clustershard-c0, WQ-RDS will detect that clustershard-c0 is unavailable and replace clustershard-c0 on failed machine, taking about 35 seconds on average.
-->
###  功能：高可用性

WQ-RDS 可以在防止数据丢失的同时处理崩溃的 MySQL 实例。

当处理掉 clustershard-c0 时，WQ-RDS 将检测到 clustershard-c0 不可用，并替换故障机器上的 clustershard-c0，平均大约需要 35 秒。

![][2]

<!--
zero data loss at same time.
-->
同时可以做到零数据丢失。

![][3]  

<!--
###  Feature : RollingUpdate Strategy

MySQL Sharding Cluster brings us not only strong scalability but also some level of maintenance complexity. For example, when updating a MySQL configuration like innodb_buffer_pool_size, a DBA has to perform a number of steps:

1\. Apply change time.  
2\. Disable client access to database proxies.  
3\. Start a rolling upgrade.
-->
###  功能：滚动更新策略

MySQL 分片集群不仅为我们带来了强大的可伸缩性，还有一定程度的维护复杂性。例如，更新诸如 innodb_buffer_pool_size 之类的 MySQL 配置时，DBA 必须执行许多步骤：

1\. 应用更改时间。   
2\. 禁止客户端访问数据库代理。   
3\. 开始滚动升级。  

<!--
Rolling upgrades need to proceed in order and are the most demanding step of the process. One cannot continue a rolling upgrade until and unless previous updates to MySQL instances are running and ready.

4 Verify the cluster.  
5\. Enable client access to database proxies.
-->
滚动升级需要按顺序进行，并且是该过程中最严格的步骤。除非之前对 MySQL 实例的更新已经运行且准备就绪，否则无法继续进行滚动升级。

4\. 验证集群。   
5\. 允许客户端访问数据库代理。  

<!--
Possible problems with a rolling upgrade include:  

* node reboot
* MySQL instances restart
* human error
Instead, WQ-RDS enables a DBA to perform rolling upgrades automatically.
-->
滚动升级可能出现的问题包括：

* 节点重启
* MySQL 实例重启
* 人为错误
相反，WQ-RDS 使 DBA 能够自动执行滚动升级。

<!--
###  StatefulSet RollingUpdate in Kubernetes

Kubernetes 1.7 includes a major feature that adds automated updates to StatefulSets and supports a range of update strategies including rolling updates.

**Note:** For more information about [StatefulSet RollingUpdate][4], see the Kubernetes docs.

Because TPR (currently CRD) does not support the rolling upgrade strategy, we needed to integrate the RollingUpdate strategy into WQ-RDS. Fortunately, the [Kubernetes repo][5] is a treasure for learning. In the process of implementation, there are some points to share:  
-->
###  Kubernetes 中的 StatefulSet 滚动更新

Kubernetes 1.7 包含一项主要功能，该功能可向 StatefulSet 添加自动更新，并支持包括滚动更新在内的一系列更新策略。

**注意：** 有关 [StatefulSet 滚动更新][4] 的更多信息，请参见 Kubernetes 文档。

因为 TPR（当前为 CRD）不支持滚动升级策略，所以我们需要将滚动升级策略集成到 WQ-RDS 中。幸运的是，[Kubernetes repo][5] 是学习的宝库。在实施过程中，有几点要分享：

<!--
* **MySQL Sharding Cluster has ****changed**: Each StatefulSet has its corresponding ControllerRevision, which records all the revision data and order (like git). Whenever StatefulSet is syncing, StatefulSet Controller will firstly compare it's spec to the latest corresponding ControllerRevision data (similar to git diff). If changed, a new ControllerrRevision will be generated, and the revision number will be incremented by 1. WQ-RDS borrows the process, MySQL Sharding Cluster object will record all the revision and order in ControllerRevision.
* **How to initialize MySQL Sharding Cluster to meet request ****replicas**: Statefulset supports two [Pod management policies][4]: Parallel and OrderedReady. Because MySQL Sharding Cluster doesn't require ordered creation for its initial processes, we use the Parallel policy to accelerate the initialization of the cluster.
-->
* **MySQL 分片集群发生了 ****变化**：每个 StatefulSet 都有其对应的 ControllerRevision，它记录所有修订数据和顺序（如 git）。每当 StatefulSet 进行同步时，StatefulSet Controller 都会首先将它的规范与最新的相应 ControllerRevision 数据（类似于 git diff）进行比较。如果发生了更改，将生成一个新的 ControllerrRevision，修订号将增加 1。WQ-RDS 借用了该过程，MySQL 分片集群对象将在 ControllerRevision 中记录所有修订和顺序。
* **如何初始化 MySQL 分片集群以满足请求 ****副本**：Statefulset 支持两种 [Pod 管理策略][4]：Parallel 和 OrderedReady。由于 MySQL 分片集群的初始过程不需要顺序创建，因此我们使用 Parallel 策略来加速集群的初始化。

<!--
* **How to perform a Rolling ****Upgrade**: Statefulset recreates pods in strictly decreasing order. The difference is that WQ-RDS updates shards instead of recreating them, as shown below:
-->
* **如何执行滚动 ****升级**：Statefulset 以严格降序的方式重新创建 pod。区别在于 WQ-RDS 更新碎片而不是重新创建碎片，如下所示：
![][6]

<!--
* **When RollingUpdate ends**: Kubernetes signals termination clearly. A rolling update completes when all of a set's Pods have been updated to the updateRevision. The status's currentRevision is set to updateRevision and its updateRevision is set to the empty string. The status's currentReplicas is set to updateReplicas and its updateReplicas are set to 0.
-->
* **滚动更新结束时**：Kubernetes 发出明确终止信号。当一组所有的 Pod 更新到 updateRevision 时，滚动更新完成。状态的 currentRevision 设置为 updateRevision，其 updateRevision 设置为空字符串。状态的 currentReplicas 设置为 updateReplicas，其 updateReplicas 设置为 0。

<!--
###  Controller revision in WQ-RDS

Revision information is stored in MysqlCluster.Status and is no different than Statefulset.Status.
-->
###  WQ-RDS 中的控制器修改

修订信息存储在 MysqlCluster.Status 和 Statefulset.Status 中的没有差别。

```

root@k8s-master ~]# kubectl get mysqlcluster -o yaml clustershard-c

apiVersion: v1

items:

\- apiVersion: mysql.orain.com/v1

 kind: MysqlCluster

 metadata:

   creationTimestamp: 2017-10-20T08:19:41Z

   labels:

     AppName: clustershard-crm

     Createdby: orain.com

     DBType: MySQL

   name: clustershard-c

   namespace: default

   resourceVersion: "415852"

   uid: 6bb089bb-b56f-11e7-ae02-525400e717a6

 spec:



     dbresourcespec:

       limitedcpu: 1200m

       limitedmemory: 400Mi

       requestcpu: 1000m

       requestmemory: 400Mi



 status:

   currentReplicas: 8

   currentRevision: clustershard-c-648d878965

   replicas: 8

   updateRevision: clustershard-c-648d878965

kind: List

```

<!--
### Example: Perform a rolling upgrade

Finally, We can now update "clustershard-c" to update configuration "innodb_buffer_pool_size" from 6GB to 7GB and reboot.

The process takes 480 seconds.
-->
### 示例：执行滚动升级

最后，我们现在可以更新 "clustershard-c"，将配置 "innodb_buffer_pool_size" 从 6GB 更新到 7GB，然后重新启动。

该过程需要 480 秒。

![][7]

<!--
The upgrade is in monotonically decreasing manner:
-->
以单调递减的方式升级：

![][8]

![][9]

![][10]

![][11]

![][12]

![][13]

![][14]

![][15] 

<!--
###  Conclusion

RollingUpgrade is meaningful to database administrators. It provides a more effective way to operator database.
-->
###  结论

滚动升级对数据库管理员很有意义。它为操作数据库提供了一种更有效的方式。

\--Orain Xiong, co-founder, Woqutech

[1]: https://lh5.googleusercontent.com/4WiSkxX-XBqARVqQ0No-1tZ31op90LAUkTco3FdIO1mFScNOTVtMCgnjaO8SRUmms-6MAb46CzxlXDhLBqAAAmbx26atJnu4t1FTTALZx_CbUPqrCxjL746DW4TD42-03Ac9VB2c
[2]: https://lh3.googleusercontent.com/sXqVqfTu6rMWn0mlHLgHHqATe_qsx1tNmMfX60HoTwyhd5HCL4A_ViFBQAZfOoVGioeXcI_XXbzVFUdq2hbKGwS0OXH6PFGqgpZshfBwrT088bz4KqeyTbHpQR2olyzE6eRo1fan
[3]: https://lh6.googleusercontent.com/7xnN_sODa-3Ch3ScAUlggCTeYfnE3-wxRaCIHrljHCB7LnXgth8zeCv0gk_UU1jbSDBQuACQ2Mf1FO1-E7GvMWwGKjp7irenAKp4DkHlA5LR9OVuLXqubPFhhksA8kfBUh4Z4OuN
[4]: https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#rolling-updates
[5]: https://github.com/kubernetes/kubernetes
[6]: https://lh6.googleusercontent.com/B4ig8krCsXwvMeBy8NamQi1DrihUEzBcRTHCqhn9kUvlcpPrFoYUNAxn61qh8S2HXcdg31QpOhWSsYHP0jI4QxPkKpZ5oY-k9gFp1eK63qt6rwTMMWMiBs45DObY6rw2R7c0lNPu
[7]: https://lh4.googleusercontent.com/LOxFDdojYxnPvSHDYwivVge6vGImK7uTdyvCsKrxCMF3rIlVkw7mHeNhJiNJwz1aGzVhZXpqrgzHC6pIbkPk3JPAtuSqX9ovAYBzK01BGfzwkXvMGZomAh4L0DahGyD3QB715B-Z
[8]: https://lh6.googleusercontent.com/DhFbY3JDh23A_91c04TujxWM9xCX_xq1xOCXHi7XAd75LzKwDtbH6Gr_2VXCscg8AeVCQzw3Inw4M-uvssWq8od4va0wd-fIyClVY63FjRfeU16fQda_XqzBYRIhrG5W3tDnCAwC
[9]: https://lh6.googleusercontent.com/bAJtLRRl2TqQrfBOooNm9DIEuezoBhT3f-XuOyGxp8sKePzfRaQYcJ7PFvL30xw9jeUpc-3rVw6Qjr46dFRk7mmUsf3oichNEuC-BFwCEtpbxK0_BjSJxtIE4B5xR4CGw1m6Hf0D
[10]: https://lh4.googleusercontent.com/ALYk-EP_rYibA95nIIo8TKx8BYuSY9w1Pqw4JLEiV89K9i06uBhkTrYWX26FjYtheGKVwwVMTtDKH7UTBovGf8AEpK97T3RT23RSAUTs4GyDFaDOGmlRAczbGLm0UjQglbB_NPdF
[11]: https://lh4.googleusercontent.com/gmM6UbgVOBWPJBpIMutxeTxGiwtjFv25KAHQw3ebVAF5Kxm-uxkPKEiYKhpwYUTyDe5knYlGmQDDHiN8eefBJx0fbK7jg4IlpG5_DXMUG6rNNFIbpP7Q94ANROIeUfe5JP6t-k37
[12]: https://lh5.googleusercontent.com/aiczeqRNRls8lh-LYbnx112kgZI2gvaBMimAk74KlLhR3EVicuKAemTKr2eKUSFPjmKbsg_gw_nY1G4YU0-3J1EjDPOhz55UUri47Py-s-jRf0dF-lAKn6TRrF6IvGtv2aldWa3k
[13]: https://lh6.googleusercontent.com/mwRQP_wXMCzpXsC5sqb0nJ9jU4KdUl4FiUE26gQZMQbrn5zcgqSYZB03CLmGsT2Nuq-7x00W4Ar3IUAh7hxEksQEGl6ugAmY0wo7xjzisNH9VE1qto9Afx8QW2Sr6NR-SBDeJfTt
[14]: https://lh6.googleusercontent.com/joraaJ-qX-K8zTdAFBJWeOswQQtNeX6yezKGkSM56FNYQT-XYrgsxvNLYBE0askw9huAmJhebCVU4AMvjz4B6xlIjdLwO3vMX7_dWBzkfu05HZ3-NOsFnqg-jvkLknl-ldRzUcFO
[15]: https://lh5.googleusercontent.com/ayoUAhD-azUjUqjut7iSiW8FBFJpCJZLRJDT9mXJoy4QTutAsGgr4yPvbFumaXasOqpsmJ_zZ2k7nrQl2YrjGqPr83PXe-tXjj9OLc-GYhhtJTzBEeddWpZn5pDyBpdw9I4sD-O0
