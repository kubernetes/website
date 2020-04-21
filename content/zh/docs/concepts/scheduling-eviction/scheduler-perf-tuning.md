---
title: 调度器性能调优
content_template: templates/concept
weight: 70
---
<!--
---
reviewers:
- bsalamat
title: Scheduler Performance Tuning
content_template: templates/concept
weight: 70
---
-->

{{% capture overview %}}

{{< feature-state for_k8s_version="1.14" state="beta" >}}

<!--
[kube-scheduler](/docs/concepts/scheduling/kube-scheduler/#kube-scheduler)
is the Kubernetes default scheduler. It is responsible for placement of Pods
on Nodes in a cluster.
-->
作为 kubernetes 集群的默认调度器，kube-scheduler 主要负责将 Pod 调度到集群的 Node 上。

<!--
Nodes in a cluster that meet the scheduling requirements of a Pod are
called _feasible_ Nodes for the Pod. The scheduler finds feasible Nodes
for a Pod and then runs a set of functions to score the feasible Nodes,
picking a Node with the highest score among the feasible ones to run
the Pod. The scheduler then notifies the API server about this decision
in a process called _Binding_.
-->
在一个集群中，满足一个 Pod 调度请求的所有 Node 称之为 _可调度_ Node。调度器先在集群中找到一个 Pod 的可调度 Node，然后根据一系列函数对这些可调度 Node打分，之后选出其中得分最高的 Node 来运行 Pod。最后，调度器将这个调度决定告知 kube-apiserver，这个过程叫做 _绑定_。

<!--
This page explains performance tuning optimizations that are relevant for
large Kubernetes clusters.
-->
这篇文章将会介绍一些在大规模 Kubernetes 集群下调度器性能优化的方式。

{{% /capture %}}

{{% capture body %}}

<!--
## Percentage of Nodes to Score
-->
## 设置打分阶段 Node 数量占集群总规模的百分比

<!--
Before Kubernetes 1.12, Kube-scheduler used to check the feasibility of all
nodes in a cluster and then scored the feasible ones. Kubernetes 1.12 added a
new feature that allows the scheduler to stop looking for more feasible nodes
once it finds a certain number of them. This improves the scheduler's
performance in large clusters. The number is specified as a percentage of the
cluster size. The percentage can be controlled by a configuration option called
`percentageOfNodesToScore`. The range should be between 1 and 100. Larger values
are considered as 100%. Zero is equivalent to not providing the config option.
Kubernetes 1.14 has logic to find the percentage of nodes to score based on the
size of the cluster if it is not specified in the configuration. It uses a
linear formula which yields 50% for a 100-node cluster. The formula yields 10%
for a 5000-node cluster. The lower bound for the automatic value is 5%. In other
words, the scheduler always scores at least 5% of the cluster no matter how
large the cluster is, unless the user provides the config option with a value
smaller than 5.
-->
在 Kubernetes 1.12 版本之前，kube-scheduler 会检查集群中所有节点的可调度性，并且给可调度节点打分。Kubernetes 1.12 版本添加了一个新的功能，允许调度器在找到一定数量的可调度节点之后就停止继续寻找可调度节点。该功能能提高调度器在大规模集群下的调度性能。这个数值是集群规模的百分比。这个百分比通过 `percentageOfNodesToScore` 参数来进行配置。其值的范围在 1 到 100 之间，最大值就是 100%。如果设置为 0 就代表没有提供这个参数配置。Kubernetes 1.14 版本又加入了一个特性，在该参数没有被用户配置的情况下，调度器会根据集群的规模自动设置一个集群比例，然后通过这个比例筛选一定数量的可调度节点进入打分阶段。该特性使用线性公式计算出集群比例，如在 100-node 的集群下取 50%。在 5000-node 的集群下取 10%。这个自动设置的参数的最低值是 5%。换句话说，调度器至少会对集群中 5% 的节点进行打分，除非用户将该参数设置的低于 5。

<!--
Below is an example configuration that sets `percentageOfNodesToScore` to 50%.
-->
下面就是一个将 `percentageOfNodesToScore` 参数设置为 50% 的例子。

```yaml
apiVersion: kubescheduler.config.k8s.io/v1alpha1
kind: KubeSchedulerConfiguration
algorithmSource:
  provider: DefaultProvider

...

percentageOfNodesToScore: 50
```

<!--
{{< note >}} In clusters with less than 50 feasible nodes, the scheduler still
checks all the nodes, simply because there are not enough feasible nodes to stop
the scheduler's search early. {{< /note >}}
-->
{{< note >}} 当集群中的可调度节点少于 50 个时，调度器仍然会去检查所有的 Node，因为可调度节点太少，不足以停止调度器最初的过滤选择。{{< /note >}}

<!--
**To disable this feature**, you can set `percentageOfNodesToScore` to 100.
-->
**如果想要关闭这个功能**，你可以将 `percentageOfNodesToScore` 值设置成 100。

<!--
### Tuning percentageOfNodesToScore
-->
### 调节 percentageOfNodesToScore 参数

<!--
`percentageOfNodesToScore` must be a value between 1 and 100 with the default
value being calculated based on the cluster size. There is also a hardcoded
minimum value of 50 nodes. This means that changing
this option to lower values in clusters with several hundred nodes will not have
much impact on the number of feasible nodes that the scheduler tries to find.
This is intentional as this option is unlikely to improve performance noticeably
in smaller clusters. In large clusters with over a 1000 nodes setting this value
to lower numbers may show a noticeable performance improvement.
-->
`percentageOfNodesToScore` 的值必须在 1 到 100 之间，而且其默认值是通过集群的规模计算得来的。另外，还有一个 50 个 Node 的数值是硬编码在程序里面的。设置这个值的作用在于：当集群的规模是数百个 Node 并且 `percentageOfNodesToScore` 参数设置的过低的时候，调度器筛选到的可调度节点数目基本不会受到该参数影响。当集群规模较小时，这个设置将导致调度器性能提升并不明显。然而在一个超过 1000 个 Node 的集群中，将调优参数设置为一个较低的值可以很明显的提升调度器性能。

<!--
An important note to consider when setting this value is that when a smaller
number of nodes in a cluster are checked for feasibility, some nodes are not
sent to be scored for a given Pod. As a result, a Node which could possibly
score a higher value for running the given Pod might not even be passed to the
scoring phase. This would result in a less than ideal placement of the Pod. For
this reason, the value should not be set to very low percentages. A general rule
of thumb is to never set the value to anything lower than 10. Lower values
should be used only when the scheduler's throughput is critical for your
application and the score of nodes is not important. In other words, you prefer
to run the Pod on any Node as long as it is feasible. 
-->
值得注意的是，该参数设置后可能会导致只有集群中少数节点被选为可调度节点，很多 node 都没有进入到打分阶段。这样就会造成一种后果，一个本来可以在打分阶段得分很高的 Node 甚至都不能进入打分阶段。由于这个原因，这个参数不应该被设置成一个很低的值。通常的做法是不会将这个参数的值设置的低于 10。很低的参数值一般在调度器的吞吐量很高且对 node 的打分不重要的情况下才使用。换句话说，只有当你更倾向于在可调度节点中任意选择一个 Node 来运行这个 Pod 时，才使用很低的参数设置。

<!--
If your cluster has several hundred Nodes or fewer, we do not recommend lowering
the default value of this configuration option. It is unlikely to improve the
scheduler's performance significantly.
-->
如果你的集群规模只有数百个节点或者更少，我们并不推荐你将这个参数设置得比默认值更低。因为这种情况下不太可能有效的提高调度器性能。

<!--
### How the scheduler iterates over Nodes
-->
### 调度器做调度选择的时候如何覆盖所有的 Node

<!--
This section is intended for those who want to understand the internal details
of this feature.
-->
如果你想要理解这一个特性的内部细节，那么请仔细阅读这一章节。

<!--
In order to give all the Nodes in a cluster a fair chance of being considered
for running Pods, the scheduler iterates over the nodes in a round robin
fashion. You can imagine that Nodes are in an array. The scheduler starts from
the start of the array and checks feasibility of the nodes until it finds enough
Nodes as specified by `percentageOfNodesToScore`. For the next Pod, the
scheduler continues from the point in the Node array that it stopped at when
checking feasibility of Nodes for the previous Pod.
-->
在将 Pod 调度到 Node 上时，为了让集群中所有 Node 都有公平的机会去运行这些 Pod，调度器将会以轮询的方式覆盖全部的 Node。你可以将 Node 列表想象成一个数组。调度器从数组的头部开始筛选可调度节点，依次向后直到可调度节点的数量达到 `percentageOfNodesToScore` 参数的要求。在对下一个 Pod 进行调度的时候，前一个 Pod 调度筛选停止的 Node 列表的位置，将会来作为这次调度筛选 Node 开始的位置。

<!--
If Nodes are in multiple zones, the scheduler iterates over Nodes in various
zones to ensure that Nodes from different zones are considered in the
feasibility checks. As an example, consider six nodes in two zones:
-->
如果集群中的 Node 在多个区域，那么调度器将从不同的区域中轮询 Node，来确保不同区域的 Node 接受可调度性检查。如下例，考虑两个区域中的六个节点：

```
Zone 1: Node 1, Node 2, Node 3, Node 4
Zone 2: Node 5, Node 6
```

<!--
The Scheduler evaluates feasibility of the nodes in this order:
-->
调度器将会按照如下的顺序去评估 Node 的可调度性：

```
Node 1, Node 5, Node 2, Node 6, Node 3, Node 4
```

<!--
After going over all the Nodes, it goes back to Node 1.
-->
在评估完所有 Node 后，将会返回到 Node 1，从头开始。

{{% /capture %}}
