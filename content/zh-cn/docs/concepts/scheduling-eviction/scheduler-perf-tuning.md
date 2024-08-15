---
title: 调度器性能调优
content_type: concept
weight: 70
---
<!--
---
reviewers:
- bsalamat
title: Scheduler Performance Tuning
content_type: concept
weight: 70
---
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.14" state="beta" >}}

<!--
[kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler)
is the Kubernetes default scheduler. It is responsible for placement of Pods
on Nodes in a cluster.
-->
作为 kubernetes 集群的默认调度器，
[kube-scheduler](/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler)
主要负责将 Pod 调度到集群的 Node 上。

<!--
Nodes in a cluster that meet the scheduling requirements of a Pod are
called _feasible_ Nodes for the Pod. The scheduler finds feasible Nodes
for a Pod and then runs a set of functions to score the feasible Nodes,
picking a Node with the highest score among the feasible ones to run
the Pod. The scheduler then notifies the API server about this decision
in a process called _Binding_.
-->
在一个集群中，满足一个 Pod 调度请求的所有 Node 称之为**可调度** Node。
调度器先在集群中找到一个 Pod 的可调度 Node，然后根据一系列函数对这些可调度 Node 打分，
之后选出其中得分最高的 Node 来运行 Pod。
最后，调度器将这个调度决定告知 kube-apiserver，这个过程叫做**绑定（Binding）**。

<!--
This page explains performance tuning optimizations that are relevant for
large Kubernetes clusters.
-->
这篇文章将会介绍一些在大规模 Kubernetes 集群下调度器性能优化的方式。

<!-- body -->

<!--
In large clusters, you can tune the scheduler's behaviour balancing
scheduling outcomes between latency (new Pods are placed quickly) and
accuracy (the scheduler rarely makes poor placement decisions).

You configure this tuning setting via kube-scheduler setting
`percentageOfNodesToScore`. This KubeSchedulerConfiguration setting determines
a threshold for scheduling nodes in your cluster.
-->
在大规模集群中，你可以调节调度器的表现来平衡调度的延迟（新 Pod 快速就位）
和精度（调度器很少做出糟糕的放置决策）。

你可以通过设置 kube-scheduler 的 `percentageOfNodesToScore` 来配置这个调优设置。
这个 KubeSchedulerConfiguration 设置决定了调度集群中节点的阈值。

<!--
### Setting the threshold
-->
### 设置阈值

<!--
The `percentageOfNodesToScore` option accepts whole numeric values between 0
and 100. The value 0 is a special number which indicates that the kube-scheduler
should use its compiled-in default.
If you set `percentageOfNodesToScore` above 100, kube-scheduler acts as if you
had set a value of 100.
-->
`percentageOfNodesToScore` 选项接受从 0 到 100 之间的整数值。
0 值比较特殊，表示 kube-scheduler 应该使用其编译后的默认值。
如果你设置 `percentageOfNodesToScore` 的值超过了 100，
kube-scheduler 的表现等价于设置值为 100。

<!--
To change the value, edit the
[kube-scheduler configuration file](/docs/reference/config-api/kube-scheduler-config.v1/)
and then restart the scheduler.
In many cases, the configuration file can be found at `/etc/kubernetes/config/kube-scheduler.yaml`.
-->
要修改这个值，先编辑
[kube-scheduler 的配置文件](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/)然后重启调度器。
大多数情况下，这个配置文件是 `/etc/kubernetes/config/kube-scheduler.yaml`。

<!--
After you have made this change, you can run
-->
修改完成后，你可以执行

```bash
kubectl get pods -n kube-system | grep kube-scheduler
```

<!--
to verify that the kube-scheduler component is healthy.
-->
来检查该 kube-scheduler 组件是否健康。

<!--
## Node scoring threshold {#percentage-of-nodes-to-score}
-->
## 节点打分阈值 {#percentage-of-nodes-to-score}

<!--
To improve scheduling performance, the kube-scheduler can stop looking for
feasible nodes once it has found enough of them. In large clusters, this saves
time compared to a naive approach that would consider every node.
-->
要提升调度性能，kube-scheduler 可以在找到足够的可调度节点之后停止查找。
在大规模集群中，比起考虑每个节点的简单方法相比可以节省时间。

<!--
You specify a threshold for how many nodes are enough, as a whole number percentage
of all the nodes in your cluster. The kube-scheduler converts this into an
integer number of nodes. During scheduling, if the kube-scheduler has identified
enough feasible nodes to exceed the configured percentage, the kube-scheduler
stops searching for more feasible nodes and moves on to the
[scoring phase](/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler-implementation).
-->
你可以使用整个集群节点总数的百分比作为阈值来指定需要多少节点就足够。
kube-scheduler 会将它转换为节点数的整数值。在调度期间，如果
kube-scheduler 已确认的可调度节点数足以超过了配置的百分比数量，
kube-scheduler 将停止继续查找可调度节点并继续进行
[打分阶段](/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler-implementation)。

<!--
[How the scheduler iterates over Nodes](#how-the-scheduler-iterates-over-nodes)
describes the process in detail.
-->
[调度器如何遍历节点](#how-the-scheduler-iterates-over-nodes)详细介绍了这个过程。

<!--
### Default threshold
-->
### 默认阈值

<!--
If you don't specify a threshold, Kubernetes calculates a figure using a
linear formula that yields 50% for a 100-node cluster and yields 10%
for a 5000-node cluster. The lower bound for the automatic value is 5%.
-->
如果你不指定阈值，Kubernetes 使用线性公式计算出一个比例，在 100-节点集群
下取 50%，在 5000-节点的集群下取 10%。这个自动设置的参数的最低值是 5%。

<!--
This means that the kube-scheduler always scores at least 5% of your cluster no
matter how large the cluster is, unless you have explicitly set
`percentageOfNodesToScore` to be smaller than 5.
-->
这意味着，调度器至少会对集群中 5% 的节点进行打分，除非用户将该参数设置的低于 5。

<!--
If you want the scheduler to score all nodes in your cluster, set
`percentageOfNodesToScore` to 100.
-->
如果你想让调度器对集群内所有节点进行打分，则将 `percentageOfNodesToScore` 设置为 100。

<!--
## Example
-->
## 示例

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
## Tuning percentageOfNodesToScore
-->
## 调节 percentageOfNodesToScore 参数

<!--
`percentageOfNodesToScore` must be a value between 1 and 100 with the default
value being calculated based on the cluster size. There is also a hardcoded
minimum value of 100 nodes.
-->
`percentageOfNodesToScore` 的值必须在 1 到 100 之间，而且其默认值是通过集群的规模计算得来的。
另外，还有一个 100 个 Node 的最小值是硬编码在程序中。

<!--
{{< note >}} In clusters with less than 100 feasible nodes, the scheduler still
checks all the nodes because there are not enough feasible nodes to stop
the scheduler's search early.

In a small cluster, if you set a low value for `percentageOfNodesToScore`, your
change will have no or little effect, for a similar reason.

If your cluster has several hundred Nodes or fewer, leave this configuration option
at its default value. Making changes is unlikely to improve the
scheduler's performance significantly.
{{< /note >}}
-->
{{< note >}}
当集群中的可调度节点少于 100 个时，调度器仍然会去检查所有的 Node，
因为可调度节点太少，不足以停止调度器最初的过滤选择。

同理，在小规模集群中，如果你将 `percentageOfNodesToScore`
设置为一个较低的值，则没有或者只有很小的效果。

如果集群只有几百个节点或者更少，请保持这个配置的默认值。
改变基本不会对调度器的性能有明显的提升。
{{< /note >}}

<!--
An important detail to consider when setting this value is that when a smaller
number of nodes in a cluster are checked for feasibility, some nodes are not
sent to be scored for a given Pod. As a result, a Node which could possibly
score a higher value for running the given Pod might not even be passed to the
scoring phase. This would result in a less than ideal placement of the Pod.

You should avoid setting `percentageOfNodesToScore` very low so that kube-scheduler
does not make frequent, poor Pod placement decisions. Avoid setting the
percentage to anything below 10%, unless the scheduler's throughput is critical
for your application and the score of nodes is not important. In other words, you
prefer to run the Pod on any Node as long as it is feasible.
-->
值得注意的是，该参数设置后可能会导致只有集群中少数节点被选为可调度节点，
很多节点都没有进入到打分阶段。这样就会造成一种后果，
一个本来可以在打分阶段得分很高的节点甚至都不能进入打分阶段。

由于这个原因，这个参数不应该被设置成一个很低的值。
通常的做法是不会将这个参数的值设置的低于 10。
很低的参数值一般在调度器的吞吐量很高且对节点的打分不重要的情况下才使用。
换句话说，只有当你更倾向于在可调度节点中任意选择一个节点来运行这个 Pod 时，
才使用很低的参数设置。

<!--
## How the scheduler iterates over Nodes
-->
## 调度器做调度选择的时候如何覆盖所有的 Node {#how-the-scheduler-iterates-over-nodes}

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
在将 Pod 调度到节点上时，为了让集群中所有节点都有公平的机会去运行这些 Pod，
调度器将会以轮询的方式覆盖全部的 Node。
你可以将 Node 列表想象成一个数组。调度器从数组的头部开始筛选可调度节点，
依次向后直到可调度节点的数量达到 `percentageOfNodesToScore` 参数的要求。
在对下一个 Pod 进行调度的时候，前一个 Pod 调度筛选停止的 Node 列表的位置，
将会来作为这次调度筛选 Node 开始的位置。

<!--
If Nodes are in multiple zones, the scheduler iterates over Nodes in various
zones to ensure that Nodes from different zones are considered in the
feasibility checks. As an example, consider six nodes in two zones:
-->
如果集群中的 Node 在多个区域，那么调度器将从不同的区域中轮询 Node，
来确保不同区域的 Node 接受可调度性检查。如下例，考虑两个区域中的六个节点：

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

## {{% heading "whatsnext" %}}

<!--
* Check the [kube-scheduler configuration reference (v1)](/docs/reference/config-api/kube-scheduler-config.v1/)
-->
* 参见 [kube-scheduler 配置参考（v1）](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/)
