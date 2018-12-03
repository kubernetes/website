---
reviewers:
- bsalamat
title: 调度器性能调优
content_template: templates/concept
weight: 70
---

<!-- ---
reviewers:
- bsalamat
title: Scheduler Performance Tuning
content_template: templates/concept
weight: 70
--- -->

{{% capture overview %}}

{{< feature-state for_k8s_version="1.12" >}}

<!-- Kube-scheduler is the Kubernetes default scheduler. It is responsible for
placement of Pods on Nodes in a cluster. Nodes in a cluster that meet the
scheduling requirements of a Pod are called "feasible" Nodes for the Pod. The
scheduler finds feasible Nodes for a Pod and then runs a set of functions to
score the feasible Nodes and picks a Node with the highest score among the
feasible ones to run the Pod. The scheduler then notifies the API server about this
decision in a process called "Binding". -->

Kube-scheduler 是 Kubernetes 的默认调度器。负责将 Pods 安排到集群中的节点上。
集群中达到 Pod 调度要求的节点也被称为这个 Pod 的“可行性”节点。
调度器首先找出 Pod 的可行性节点，然后运行一套打分函数来为可行性节点打分，
最后挑选出分数最高的可行性节点来运行 Pod。随后，调度器将这个决定通知给 API 服务器，
这个通知流程叫做“绑定”（"Binding"）。

{{% /capture %}}

{{% capture body %}}

<!-- ## Percentage of Nodes to Score -->
## 可行性打分的节点比例

<!-- Before Kubernetes 1.12, Kube-scheduler used to check the feasibility of all the
nodes in a cluster and then scored the feasible ones. Kubernetes 1.12 has a new
feature that allows the scheduler to stop looking for more feasible nodes once
it finds a certain number of them. This improves the scheduler's performance in
large clusters. The number is specified as a percentage of the cluster size and
is controlled by a configuration option called `percentageOfNodesToScore`. The
range should be between 1 and 100. Other values are considered as 100%. The
default value of this option is 50%. A cluster administrator can change this value by providing a
different value in the scheduler configuration. However, it may not be necessary to change this value. -->

在 Kubernetes 1.12 之前， Kube-scheduler 曾经是检查集群中所有节点的可行性，并为它们依次打分。
而在 Kubernetes 1.12 中加入了一项新的功能，允许调度器在找到足够合适的可行性节点之后，停止搜索。
这项功能将提高调度器在大型集群应用中的性能。这是一个比例参数，通过一个名为 `percentageOfNodesToScore` 的配置选项，
指明了集群大小中的比例。参数值范围在 1 到 100 之间。其它的数值将被认为是 100%。
选项的默认值为 50%。集群管理员也可以在调度器的配置文件中，提供不同数值来做修改。
但可能也并不需要修改这个值。

```yaml
apiVersion: componentconfig/v1alpha1
kind: KubeSchedulerConfiguration
algorithmSource:
  provider: DefaultProvider

...

percentageOfNodesToScore: 50
```

{{< note >}}

<!-- **Note**: In clusters with zero or less than 50 feasible nodes, the
scheduler still checks all the nodes, simply because there are not enough
feasible nodes to stop the scheduler's search early. -->

**注意**：如果集群中可行性节点的数量为 0 或者小于 50 个，调度器还是会检查所有的节点，
仅仅是因为没有足够多的可行性节点让调度器终止搜索。

{{< /note >}}



<!-- **To disable this feature**, you can set `percentageOfNodesToScore` to 100. -->
可以将 `percentageOfNodesToScore` 设置为 100 来**禁止这项功能**。

<!-- ### Tuning percentageOfNodesToScore -->
### 调优 `percentageOfNodesToScore`

<!-- `percentageOfNodesToScore` must be a value between 1 and 100
with the default value of 50. There is also a hardcoded minimum value of 50
nodes which is applied internally. The scheduler tries to find at
least 50 nodes regardless of the value of `percentageOfNodesToScore`. This means
that changing this option to lower values in clusters with several hundred nodes
will not have much impact on the number of feasible nodes that the scheduler
tries to find. This is intentional as this option is unlikely to improve
performance noticeably in smaller clusters. In large clusters with over a 1000
nodes setting this value to lower numbers may show a noticeable performance
improvement. -->

`percentageOfNodesToScore` 的数值必须在 1 到 100 之间，默认值为 50。
在内部设计里面，还存在有硬编码的至少 50 个节点的要求。无论 `percentageOfNodesToScore` 设置如何，
调度器都至少会搜索 50 个节点。换言之，在只有数百个节点的集群中调低这个参数，并不会对调度器搜索可行性节点有影响。
这样设计是经过考虑的，因为在较小的集群中，这个参数并不会显著提升性能。
而在超过 1000 个节点的大型集群中调低这个参数，将会有显著的性能提升。

<!-- An important note to consider when setting this value is that when a smaller
number of nodes in a cluster are checked for feasibility, some nodes are not
sent to be scored for a given Pod. As a result, a Node which could possibly
score a higher value for running the given Pod might not even be passed to the
scoring phase. This would result in a less than ideal placement of the Pod. For
this reason, the value should not be set to very low percentages. A general rule
of thumb is to never set the value to anything lower than 30. Lower values
should be used only when the scheduler's throughput is critical for your
application and the score of nodes is not important. In other words, you prefer
to run the Pod on any Node as long as it is feasible. -->

在设置这个数值时，需要注意一点，如果集群中只有较少的一部分节点进行了可行性检查，
有些节点将不会被作可行性打分。
因而，有运行 Pod 可行性分数更高的节点甚至可能不会到达打分阶段。这会造成一个并不十分理想的安排结果。
正因为如此，这个数值不应该设置得非常低。
一个重要原则就是这个数值不应该小于 30。
更小的数值只应该在应用对调度器的吞吐量十分敏感，而节点的可行性打分相对不重要的前提下使用。
换言之，只要节点适合运行 Pod 就可以安排到该节点上运行。

<!-- It is not recommended to lower this value from its default if your cluster has
only several hundred Nodes. It is unlikely to improve the scheduler's
performance significantly. -->

如果集群只有数百个节点，我们不建议将参数值调到比默认值低。因为这并不能显著提升调度器的性能。

<!-- ### How the scheduler iterates over Nodes -->
### 调度器是如何遍历节点的

<!-- This section is intended for those who want to understand the internal details
of this feature. -->

这一节是为那些希望了解这项功能内部细节的人准备的。

<!-- In order to give all the Nodes in a cluster a fair chance of being considered
for running Pods, the scheduler iterates over the nodes in a round robin
fashion. You can imagine that Nodes are in an array. The scheduler starts from
the start of the array and checks feasibility of the nodes until it finds enough
Nodes as specified by `percentageOfNodesToScore`. For the next Pod, the
scheduler continues from the point in the Node array that it stopped at when checking
feasibility of Nodes for the previous Pod. -->

为了让集群中所有的节点都有平等的机会被考虑运行 Pods，调度器需要以轮转的方式遍历所有的节点。
你可以这样理解：所有节点都在记录在某数组之中，调度器从数组的一端开始检查节点的可行性，直到找到 `percentageOfNodesToScore`
指明的、足够多的节点。对于下一个 pod，调度器将从前一个 Pod 的结束节点开始，继续开始搜索。

<!-- If Nodes are in multiple zones, the scheduler iterates over Nodes in various
zones to ensure that Nodes from different zones are considered in the
feasibility checks. As an example, consider six nodes in two zones: -->

如果节点在不同的区域，调度器也将遍历不同区域的所有节点，保证不同区域的节点都会被考虑在列。
例如，如果六个节点分布在两个区域：

```
Zone 1: Node 1, Node 2, Node 3, Node 4
Zone 2: Node 5, Node 6
```

<!-- The Scheduler evaluates feasibility of the nodes in this order: -->

调度器将会按照下面的顺序来对所有的节点进行可行性检查：

```
Node 1, Node 5, Node 2, Node 6, Node 3, Node 4
```

<!-- After going over all the Nodes, it goes back to Node 1. -->

当遍历完所有的节点后，会重新从 Node 1 开始搜索。

{{% /capture %}}
