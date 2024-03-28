---
layout: blog
title: "Kubernetes 资源限制案例：可预测性与效率"
date: 2023-11-16
slug: the-case-for-kubernetes-resource-limits
---

<!--
layout: blog
title: "The Case for Kubernetes Resource Limits: Predictability vs. Efficiency"
date: 2023-11-16
slug: the-case-for-kubernetes-resource-limits
-->

**作者**：Milan Plžík (Grafana Labs)
<!--
**Author:** Milan Plžík (Grafana Labs)
-->

**译者**：Wilson Wu (DaoCloud)

<!--
There’s been quite a lot of posts suggesting that not using Kubernetes resource limits might be a fairly useful thing (for example, [For the Love of God, Stop Using CPU Limits on Kubernetes](https://home.robusta.dev/blog/stop-using-cpu-limits/) or [Kubernetes: Make your services faster by removing CPU limits](https://erickhun.com/posts/kubernetes-faster-services-no-cpu-limits/) ). The points made there are totally valid – it doesn’t make much sense to pay for compute power that will not be used due to limits, nor to artificially increase latency. This post strives to argue that limits have their legitimate use as well.
-->
在 Kubernetes 中不对资源进行限制曾在许多文章中被提到，这可能是一项有用的举措
（例如，[看在上帝的份上，停止在 Kubernetes 上使用 CPU 限制（英文）](https://home.robusta.dev/blog/stop-using-cpu-limits/)或
[Kubernetes：通过消除 CPU 限制来提高服务速度（英文）](https://erickhun.com/posts/kubernetes-faster-services-no-cpu-limits/)）。
那些被提出的观点是完全正确的 —— 为由于限制而不会被使用的计算能力付费，
或者人为地增加延迟，并不合理。而本文力图论证限制也有其合理用途。

<!--
As a Site Reliability Engineer on the [Grafana Labs](https://grafana.com/) platform team, which maintains and improves internal infrastructure and tooling used by the product teams, I primarily try to make Kubernetes upgrades as smooth as possible. But I also spend a lot of time going down the rabbit hole of various interesting Kubernetes issues. This article reflects my personal opinion, and others in the community may disagree.
-->
作为 [Grafana Labs](https://grafana.com/) 平台团队的站点可靠性工程师，
负责维护和改进产品团队使用的内部基础设施和工具，我的主要工作是努力使 Kubernetes 升级尽可能顺利。
但我也花了很多时间研究各种有趣的 Kubernetes 问题。本文仅代表我的个人观点，社区中的其他人可能不同意。

<!--
Let’s flip the problem upside down. Every pod in a Kubernetes cluster has inherent resource limits – the actual CPU, memory, and other resources of the machine it’s running on. If those physical limits are reached by a pod, it will experience throttling similar to what is caused by reaching Kubernetes limits.
-->
让我们把问题倒过来。Kubernetes 集群中的每个 Pod 都有固有的资源限制 —— 实际的 CPU、
内存及其所运行机器的其他资源。如果某个 Pod 达到了这些物理限制，它会经历达到 Kubernetes 限制所导致的类似扼杀机制。

<!--
## The problem
-->
## 问题所在

<!--
Pods without (or with generous) limits can easily consume the extra resources on the node. This, however, has a hidden cost – the amount of extra resources available often heavily depends on pods scheduled on the particular node and their actual load. These extra resources make each pod a special snowflake when it comes to real resource allocation. Even worse, it’s fairly hard to figure out the resources that the pod had at its disposal at any given moment – certainly not without unwieldy data mining of pods running on a particular node, their resource consumption, and similar. And finally, even if we pass this obstacle, we can only have data sampled up to a certain rate and get profiles only for a certain fraction of our calls. This can be scaled up, but the amount of observability data generated might easily reach diminishing returns. Thus, there’s no easy way to tell if a pod had a quick spike and for a short period of time used twice as much memory as usual to handle a request burst.
-->
没有限制（或有限制过大）的 Pod 很容易消耗节点上的额外资源。
然而，这有一个隐藏的成本 —— 可用的额外资源量通常在很大程度上取决于被调度到特定节点上的 Pod 及其实际负载。
当涉及到实际资源分配时，这些额外的资源给每个 Pod 都增加了负担。
更糟糕的是，要弄清楚 Pod 在任何给定时刻可以使用的资源相当困难 —— 当然，
如果没有对特定节点上运行的 Pod 及其资源消耗等进行繁琐的数据挖掘，就更不可能了。
最后，即使我们克服了这个障碍，我们也只能以一定的速率采样数据，并且只能获取一部分调用的资料。
这项操作可以被扩大规模执行，但生成的可观测数据量可能很容易产生汇报缩减。因此，
没有简单的方法可以判断 Pod 是否曾出现快速峰值，以及是否曾经在短时间内使用了平时两倍的内存来处理突发请求。

<!--
Now, with Black Friday and Cyber Monday approaching, businesses expect a surge in traffic. Good performance data/benchmarks of the past performance allow businesses to plan for some extra capacity. But is data about pods without limits reliable? With memory or CPU instant spikes handled by the extra resources, everything might look good according to past data. But once the pod bin-packing changes and the extra resources get more scarce, everything might start looking different – ranging from request latencies rising negligibly to requests slowly snowballing and causing pod OOM kills. While almost no one actually cares about the former, the latter is a serious issue that requires instant capacity increase.
-->
现在，随着黑色星期五（Black Friday）和赛博星期一（Cyber Monday）活动的临近，企业预计流量将激增。
基于过去良好的性能/基准数据可以针对业务规划一些额外的资源容量。但基于无限制 Pod 的数据可靠吗？
根据过去的经验，通过额外的资源处理内存或 CPU 的即时峰值，可能一切看起来都很好。
但是，一旦 Pod 装箱发生变化并且额外的资源变得更加稀缺，
一切都可能开始变得不同 —— 从请求延迟的增加几乎可忽略不计到请求缓慢问题滚雪球式增长导致 Pod OOM 终止。
虽然几乎没有人真正关心前者，但后者是一个严重的问题，需要立即增加资源容量。

<!--
## Configuring the limits
-->
## 对限制进行配置

<!--
Not using limits takes a tradeoff – it opportunistically improves the performance if there are extra resources available, but lowers predictability of the performance, which might strike back in the future. There are a few approaches that can be used to increase the predictability again. Let’s pick two of them to analyze:
-->
不使用限制的方式需要进行权衡 —— 如果有额外的可用资源，它会机会性地提高性能，但会降低性能的可预测性，
这可能会在未来出现反弹。有一些方法可以用来再次提高可预测性。我们选其中两个来分析一下：

<!--
- **Configure workload limits to be a fixed (and small) percentage more than the requests** – I'll call it _fixed-fraction headroom_. This allows the use of some extra shared resources, but keeps the per-node overcommit bound and can be taken to guide worst-case estimates for the workload. Note that the bigger the limits percentage is, the bigger the variance in the performance that might happen across the workloads.
- **Configure workloads with `requests` = `limits`**. From some point of view, this is equivalent to giving each pod its own tiny machine with constrained resources; the performance is fairly predictable. This also puts the pod into the _Guaranteed_ QoS class, which makes it get evicted only after _BestEffort_ and _Burstable_ pods have been evicted by a node under resource pressure (see [Quality of Service for Pods](/docs/concepts/workloads/pods/pod-qos/)).
-->
- **将工作负载的限制配置为比请求资源多（且较小）固定的百分比的值** – 我将其称为**固定分数余量（fixed-fraction headroom）**。
  这允许使用一些额外的共享资源，但保持每个节点的过度使用限制，并且可以用来指导工作负载的最坏情况估算。
  请注意，限制的百分比越大，工作负载之间可能发生的性能差异就越大。
- **使用 `requests` = `limits` 配置工作负载**。从某些角度来看，
  这相当于为每个 Pod 提供了独占的有限资源的微型机器；性能是相当可预测的。
  这也会将 Pod 置于 **Guaranteed** QoS 类别中，这使得只有在 **BestEffort**
  和 **Burstable** Pod 被资源压力下的节点驱逐后，它才会被驱逐
  （请参阅 [Pod 的服务质量](/zh-cn/docs/concepts/workloads/pods/pod-qos/)）。

<!--
Some other cases might also be considered, but these are probably the two simplest ones to discuss.
-->
也可以考虑其他一些情况，但这可能是最容易讨论的两种情况。

<!--
## Cluster resource economy
-->
## 集群资源经济

<!--
Note that in both cases discussed above, we’re effectively preventing the workloads from using some cluster resources it has at the cost of getting more predictability – which might sound like a steep price to pay for a bit more stable performance. Let’s try to quantify the impact there.
-->
请注意，在上面讨论的两种情况下，我们以有效地阻止工作负载使用其拥有的某些集群资源的代价，
获得更多的可预测性 —— 这听起来可能是为了获得更稳定的性能而付出的高昂代价。让我们在这里尝试量化其影响。

<!--
### Bin-packing and cluster resource allocation
-->
### 装箱和集群资源分配

<!--
Firstly, let’s discuss bin-packing and cluster resource allocation. There’s some inherent cluster inefficiency that comes to play – it’s hard to achieve 100% resource allocation in a Kubernetes cluster. Thus, some percentage will be left unallocated.
-->
首先，我们来讨论一下装箱和集群资源分配。集群存在一些固有的低效率问题 —— 在 Kubernetes
集群中很难实现 100% 的资源分配。因此，将有一定比例的资源未被分配。

<!--
When configuring fixed-fraction headroom limits, a proportional amount of this will be available to the pods. If the percentage of unallocated resources in the cluster is lower than the constant we use for setting fixed-fraction headroom limits (see the figure, line 2), all the pods together are able to theoretically use up all the node’s resources; otherwise there are some resources that will inevitably be wasted (see the figure, line 1). In order to eliminate the inevitable resource waste, the percentage for fixed-fraction headroom limits should be configured so that it’s at least equal to the expected percentage of unallocated resources.
-->
配置固定分数余量限制时，Pod 可以使用其中的一定比例的余量限制。
如果集群中未被分配的资源百分比低于我们用于设置固定分数余量限制的常量（参见图，第 2 行），
则理论上所有 Pod 都能够用完节点的所有资源；否则，有些资源将不可避免地被浪费（见图，第 1 行）。
为了消除不可避免的资源浪费，应配置固定分数余量限制的百分比，使其至少等于未分配资源的预期百分比。

<!--
{{<figure alt="Chart displaying various requests/limits configurations" width="40%" src="requests-limits-configurations.svg">}}
-->
{{<figure alt="显示各种请求/限制配置的图表" width="40%" src="requests-limits-configurations.svg">}}

<!--
For requests = limits (see the figure, line 3), this does not hold: Unless we’re able to allocate all node’s resources, there’s going to be some inevitably wasted resources. Without any knobs to turn on the requests/limits side, the only suitable approach here is to ensure efficient bin-packing on the nodes by configuring correct machine profiles. This can be done either manually or by using a variety of cloud service provider tooling – for example [Karpenter](https://karpenter.sh/) for EKS or [GKE Node auto provisioning](https://cloud.google.com/kubernetes-engine/docs/how-to/node-auto-provisioning).
-->
对于请求=限制（见图，第 3 行），这不成立：除非我们能够分配所有节点的资源，
否则将不可避免地浪费一些资源。如果没有任何开关来放开请求/限制，
这里唯一合适的方法是通过配置正确的机器配置文件来确保节点上的高效装箱。
这可以手动完成，也可以使用各种云服务提供商工具完成，例如用于 EKS 的 [Karpenter](https://karpenter.sh/)
或 [GKE 节点自动配置](https://cloud.google.com/kubernetes-engine/docs/how-to/node-auto-provisioning)。

<!--
### Optimizing actual resource utilization
-->
### 优化实际资源利用率

<!--
Free resources also come in the form of unused resources of other pods (reserved vs. actual CPU utilization, etc.), and their availability can’t be predicted in any reasonable way. Configuring limits makes it next to impossible to utilize these. Looking at this from a different perspective, if a workload wastes a significant amount of resources it has requested, re-visiting its own resource requests might be a fair thing to do. Looking at past data and picking more fitting resource requests might help to make the packing more tight (although at the price of worsening its performance – for example increasing long tail latencies).
-->
空闲资源还会以其他 Pod 未使用资源的形式出现（预留资源与实际 CPU 利用率等），
并且无法以任何合理的方式预测它们的可用性。配置限制使得这些限制几乎不可能被利用。
从不同的角度来看，如果工作负载浪费了它所请求的大量资源，那么重新访问它自己的资源请求可能是一个公平的做法。
查看过去的数据并选择更合适的资源请求可能有助于使打包更加紧凑（尽管代价是性能恶化 —— 例如增加长尾延迟）。

<!--
## Conclusion
-->
## 结论

<!--
Optimizing resource requests and limits is hard. Although it’s much easier to break things when setting limits, those breakages might help prevent a catastrophe later by giving more insights into how the workload behaves in bordering conditions. There are cases where setting limits makes less sense: batch workloads (which are not latency-sensitive – for example non-live video encoding), best-effort services (don’t need that level of availability and can be preempted), clusters that have a lot of spare resources by design (various cases of specialty workloads – for example services that handle spikes by design).
-->
优化资源请求和限制很困难。尽管在设置限制时破坏事物要容易得多，但这些破坏可能有助于防止以后发生灾难，
因为可以更深入地了解工作负载在边界条件下的行为方式。在某些情况下，设置限制意义不大：
批处理工作负载（对延迟不敏感，例如非实时视频编码）、尽力而为的服务（不需要该级别的可用性并且可以被抢占）、
集群设计时拥有大量备用资源（特殊工作负载的各种情况 —— 例如设计处理峰值的服务）。

<!--
On the other hand, setting limits shouldn’t be avoided at all costs – even though figuring out the "right” value for limits is harder and configuring a wrong value yields less forgiving situations. Configuring limits helps you learn about a workload’s behavior in corner cases, and there are simple strategies that can help when reasoning about the right value. It’s a tradeoff between efficient resource usage and performance predictability and should be considered as such.
-->
另一方面，不应该不惜一切代价避免设置限制 —— 尽管找出限制的“正确”值比较困难，
并且配置错误的值会产生更不宽容的情况。配置限制可以帮助您了解工作负载在角落里的行为情况，
有一些简单的策略可以帮助推理正确的值。这是有效资源利用和性能可预测性之间的权衡，应该这样考虑。

<!--
There’s also an economic aspect of workloads with spiky resource usage. Having “freebie” resources always at hand does not serve as an incentive to improve performance for the product team. Big enough spikes might easily trigger efficiency issues or even problems when trying to defend a product’s SLA – and thus, might be a good candidate to mention when assessing any risks.
-->
资源使用量激增的工作负载还存在经济方面的问题。随时拥有“免费”资源并不能激励产品团队提高绩效。
足够大的峰值可能很容易引发效率问题，甚至在试图捍卫产品的 SLA 时出现问题，
因此，这可能是在评估任何风险时值得提及的一个不错的选择。
