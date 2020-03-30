<!--
---
title: 'Process ID Limiting for Stability Improvements in Kubernetes 1.14'
date: 2019-04-15
---
-->
---
title: 'Kubernetes 1.14稳定性改进中的进程ID限制'
date: 2019-04-15
---

<!--
**Author: Derek Carr**

Have you ever seen someone take more than their fair share of the cookies? The one person who reaches in and grabs a half dozen fresh baked chocolate chip chunk morsels and skitters off like Cookie Monster exclaiming “Om nom nom nom.”

In some rare workloads, a similar occurrence was taking place inside Kubernetes clusters. With each Pod and Node, there comes a finite number of possible process IDs (PIDs) for all applications to share. While it is rare for any one process or pod to reach in and grab all the PIDs, some users were experiencing resource starvation due to this type of behavior. So in Kubernetes 1.14, we introduced an enhancement to mitigate the risk of a single pod monopolizing all of the PIDs available.
-->
**作者: Derek Carr**

你是否见过有人拿走了比属于他们那一份更多的饼干？ 一个人走过来，抓起半打新鲜烤制的大块巧克力饼干然后匆匆离去，就像饼干怪兽大喊“ Om nom nom nom”。

在一些罕见的工作负载中，Kubernetes集群内部也发生了类似的情况。每个Pod和Node都有有限数量的可能的进程ID（PID），供所有应用程序共享。尽管很少有进程或Pod能够进入并获取所有PID，但由于这种行为，一些用户会遇到资源匮乏的情况。 因此，在Kubernetes 1.14中，我们引入了一项增强功能，以降低单个Pod垄断所有可用PID的风险。

<!--
## Can You Spare Some PIDs?

Here, we’re talking about the greed of certain containers. Outside the ideal, runaway processes occur from time to time, particularly in clusters where testing is taking place. Thus, some wildly non-production-ready activity is happening.

In such a scenario, it’s possible for something akin to a fork bomb taking place inside a node. As resources slowly erode, being taken over by some zombie-like process that continually spawns children, other legitimate workloads begin to get bumped in favor of this inflating balloon of wasted processing power. This could result in other processes on the same pod being starved of their needed PIDs. It could also lead to interesting side effects as a node could fail and a replica of that pod is scheduled to a new machine where the process repeats across your entire cluster.
-->

## 你能分享一些PIDs吗？

在这里，我们谈论的是某些容器的贪婪性。 在理想情况之外，失控过程有时会发生，特别是在测试集群中。 因此，在这些集群中会发生一些混乱的非生产环境准备就绪的事情。

在这种情况下，可能会在节点内部发生类似于分叉函数炸弹的事件。随着资源的缓慢腐蚀，被一些不断产生子进程的僵尸般的进程所接管，其他正常的工作负载会因为这些像气球般不断膨胀的进程浪费行为而开始受到冲击。这可能导致同一吊舱上的其他进程缺少所需的PID。这也可能导致有趣的副作用，因为节点可能会发生故障，并且该Pod的副本将安排到新的机器上，至此，该过程将在整个群集中重复进行。

<!--
## Fixing the Problem

Thus, in Kubernetes 1.14, we have added a feature that allows for the configuration of a kubelet to limit the number of PIDs a given pod can consume. If that machine supports 32,768 PIDs and 100 pods, one can give each pod a budget of 300 PIDs to prevent total exhaustion of PIDs. If the admin wants to overcommit PIDs similar to cpu or memory, they may do so as well with some additional risks. Either way, no one pod can bring the whole machine down. This will generally prevent against simple fork bombs from taking over your cluster.

This change allows administrators to protect one pod from another, but does not ensure if all pods on the machine can protect the node, and the node agents themselves from falling over. Thus, we’ve introduced a feature in this release in alpha form that provides isolation of PIDs from end user workloads on a pod from the node agents (kubelet, runtime, etc.). The admin is able to reserve a specific number of PIDs--similar to how one reserves CPU or memory today--and ensure they are never consumed by pods on that machine. Once that graduates from alpha, to beta, then stable in future releases of Kubernetes, we’ll have protection against an easily starved Linux resource.

Get started with [Kubernetes 1.14](https://github.com/kubernetes/kubernetes/releases/tag/v1.14.0).
-->
## 解决问题

因此，在Kubernetes 1.14中，我们增加了一个允许限制给定Pod可以消耗的pid数量kubelet配置的特性。如果该机器支持32768个PIDs和100个Pod，则可以为每个Pod提供300个PIDs的预算，以防止PIDs完全耗尽。如果管理员想要像CPU或内存那样过度使用PIDs，那么他们也可以配置超额使用，但是这样会有一些额外风险。不管怎样，没有一个Pod能搞坏整个机器。这通常会防止简单的分叉函数炸弹接管你的集群。

此更改允许管理员保护一个Pod不受另一个Pod的影响，但不能确保计算机上的所有Pod都能保护节点和节点代理本身不受影响。因此，我们在这个版本中以Alpha的形式引入了这个一个特性，它提供了PIDs在节点代理（kubelet、runtime等）与Pod上的最终用户工作负载的分离。管理员可以预定特定数量的pid（类似于今天如何预定CPU或内存），并确保它们不会被该计算机上的pod消耗。一旦从Alpha进入到Beta，然后在将来的Kubernetes版本中稳定下来，我们就可以使用这个特性防止Linux资源耗尽。

开始使用[Kubernetes 1.14]（https://github.com/Kubernetes/Kubernetes/releases/tag/v1.14.0）。
<!--
## Get Involved

If you have feedback for this feature or are interested in getting involved with the design and development, join the [Node Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-node).

### About the author:
Derek Carr is Senior Principal Software Engineer at Red Hat. He is a Kubernetes contributor and member of the Kubernetes Community Steering Committee.
-->
##参与其中

如果您对此特性有反馈或有兴趣参与其设计与开发，请加入[节点特别兴趣小组](https://github.com/kubernetes/community/tree/master/sig Node)。

###关于作者：
Derek Carr是Red Hat高级首席软件工程师。他也是Kubernetes的贡献者和Kubernetes社区指导委员会的成员。
