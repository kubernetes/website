---
title: " 每周 Kubernetes 社区例会笔记 - 2015 年 4 月 3 日 "
date: 2015-04-04
slug: weekly-kubernetes-community-hangout
---
<!--
title: " Weekly Kubernetes Community Hangout Notes - April 3 2015 "
date: 2015-04-04
slug: weekly-kubernetes-community-hangout
url: /blog/2015/04/Weekly-Kubernetes-Community-Hangout
-->

<!--
# Kubernetes: Weekly Kubernetes Community Hangout Notes
-->
# Kubernetes: 每周 Kubernetes 社区聚会笔记

<!--
Every week the Kubernetes contributing community meet virtually over Google Hangouts. We want anyone who's interested to know what's discussed in this forum.
-->
每周，Kubernetes 贡献社区几乎都会通过 Google Hangouts 开会。
我们希望任何有兴趣的人都知道本论坛讨论的内容。

<!--
Agenda:
-->
议程：

<!--
* Quinton - Cluster federation
* Satnam - Performance benchmarking update
-->
* Quinton - 集群联邦
* Satnam - 性能基准测试更新

<!--
*Notes from meeting:*
-->
*会议记录：*

<!--
1. Quinton - Cluster federation
* Ideas floating around after meetup in SF
* * Please read and comment
* Not 1.0, but put a doc together to show roadmap
* Can be built outside of Kubernetes
* API to control things across multiple clusters, include some logic
-->
1. Quinton - 集群联邦
* 在旧金山见面会后，想法浮出水面
* * 请阅读、评论
* 不是 1.0，而是将文档放在一起以显示路线图
* 可以在 Kubernetes 之外构建
* 用于控制多个集群中事物的 API ，包括一些逻辑

<!--
1. Auth(n)(z)

2. Scheduling Policies

3. …
-->
1. Auth(n)(z)

2. 调度策略

3. ……
<!--
* Different reasons for cluster federation

1. Zone (un) availability : Resilient to zone failures

2. Hybrid cloud: some in cloud, some on prem. for various reasons

3. Avoid cloud provider lock-in.  For various reasons

4. "Cloudbursting" - automatic overflow into the cloud
-->
* 集群联邦的不同原因

1. 区域(非)可用性:对区域故障的弹性

2. 混合云：有些在云中，有些在本地。 由于各种原因

3. 避免锁定云提供商。 由于各种原因

4. "Cloudbursting" - 自动溢出到云中

<!--
* Hard problems

1. Location affinity.  How close do pods need to be?

    1. Workload coupling

    2. Absolute location (e.g. eu data needs to be in eu)

2. Cross cluster service discovery

    1. How does service/DNS work across clusters

3. Cross cluster workload migration

    1. How do you move an application piece by piece across clusters?

4. Cross cluster scheduling

    1. How do know enough about clusters to know where to schedule

    2. Possibly use a cost function to achieve affinities with minimal complexity

    3. Can also use cost to determine where to schedule (under used clusters are cheaper than over-used clusters)
 -->
 * 困难的问题
 
 1. 位置亲和性。Pod 需要多近？

    1. 工作负载的耦合

    2. 绝对位置(例如，欧盟数据需要在欧盟内)

2. 跨集群服务发现

    1. 服务/DNS 如何跨集群工作

3. 跨集群工作负载迁移

    1. 如何在跨集群中逐块移动应用程序?

4. 跨集群调度

    1.  如何充分了解集群以知道在哪里进行调度

    2. 可能使用成本函数以最小的复杂性得出亲和性

    3. 还可以使用成本来确定调度位置（使用不足的集群比过度使用的集群便宜）

<!--
* Implicit requirements

1. Cross cluster integration shouldn't create cross-cluster failure modes

    1. Independently usable in a disaster situation where Ubernetes dies.

2. Unified visibility

    1. Want to have unified monitoring, alerting, logging, introspection, ux, etc.

3. Unified quota and identity management
 -->
 * 隐含要求

1. 跨集群集成不应创建跨集群故障模式

    1. 在 Ubernetes 死亡的灾难情况下可以独立使用。

2. 统一可见性

    1. 希望有统一的监控，报警，日志，内省，用户体验等。

3. 统一的配额和身份管理

    1. 希望将用户数据库和 auth(n)/(z) 放在一个位置
    

<!--
* Important to note, most causes of software failure are not the infrastructure

1. Botched software upgrades

2. Botched config upgrades

3. Botched key distribution

4. Overload

5. Failed external dependencies
 -->
 * 需要注意的是，导致软件故障的大多数原因不是基础架构

1. 拙劣的软件升级

2. 拙劣的配置升级

3. 拙劣的密钥分发

4. 过载

5. 失败的外部依赖

 <!--
* Discussion:

1. Where do you draw the "ubernetes" line

    1. Likely at the availability zone, but could be at the rack, or the region

2. Important to not pigeon hole and prevent other users
 -->
 * 讨论：

1. ”ubernetes“ 的边界确定

    1. 可能在可用区，但也可能在机架，或地区

2. 重要的是不要鸽子洞并防止其他用户

 <!--
 2. Satnam - Soak Test
* Want to measure things that run for a long time to make sure that the cluster is stable over time.  Performance doesn't degrade, no memory leaks, etc.
* github.com/GoogleCloudPlatform/kubernetes/test/soak/…
* Single binary, puts lots of pods on each node, and queries each pod to make sure that it is running.
* Pods are being created much, much more quickly (even in the past week) to make things go more quickly.
* Once the pods are up running, we hit the pods via the proxy.  Decision to hit the proxy was deliberate so that we test the kubernetes apiserver.
* Code is already checked in.
* Pin pods to each node, exercise every pod, make sure that you get a response for each node.
* Single binary, run forever.
* Brian - v1beta3 is enabled by default, v1beta1 and v1beta2 deprecated, turned off  in June.  Should still work with upgrading existing clusters, etc.
 -->
 2. Satnam - 浸泡测试
* 想要测量长时间运行的事务，以确保集群在一段时间内是稳定的。性能不会降低，不会发生内存泄漏等。
* github.com/GoogleCloudPlatform/kubernetes/test/soak/…
* 单个二进制文件，在每个节点上放置许多 Pod，并查询每个 Pod 以确保其正在运行。
* Pod 的创建速度越来越快（即使在过去一周内），也可以使事情进展得更快。
* Pod 运行起来后，我们通过代理点击 Pod。决定使用代理是有意的，因此我们测试了 kubernetes apiserver。
* 代码已经签入。
* 将 Pod 固定在每个节点上，练习每个 Pod，确保你得到每个节点的响应。
* 单个二进制文件，永远运行。
* Brian - v1beta3 默认启用， v1beta1 和 v1beta2 不支持，在6月关闭。仍应与升级现有集群等一起使用。
