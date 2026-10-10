---
title: 资源装箱
content_type: concept
weight: 80
---
<!--
reviewers:
- bsalamat
- k82cn
- ahg-g
title: Resource Bin Packing
content_type: concept
weight: 80
-->

<!-- overview -->

{{< note >}}
<!--
This article applies to resource bin packing in context of scheduling of a single pod. For bin packing when scheduling pod groups, please read the [article about Topology-aware Scheduling](/docs/concepts/scheduling-eviction/topology-aware-scheduling/).
-->
本文适用于单个 Pod 调度过程中的资源装箱。对于 Pod 组调度中的装箱问题，
请参阅[拓扑感知调度](/zh-cn/docs/concepts/scheduling-eviction/topology-aware-scheduling/)。
{{< /note >}}

<!--
In the [scheduling-plugin](/docs/reference/scheduling/config/#scheduling-plugins) `NodeResourcesFit` of kube-scheduler, there are two
scoring strategies that support the bin packing of resources: `MostAllocated` and `RequestedToCapacityRatio`.
-->
在 kube-scheduler 的[调度插件](/zh-cn/docs/reference/scheduling/config/#scheduling-plugins)
`NodeResourcesFit` 中存在两种支持资源装箱（bin packing）的策略：`MostAllocated` 和
`RequestedToCapacityRatio`。

<!-- body -->

<!--
## Enabling bin packing using MostAllocated strategy

The `MostAllocated` strategy scores the nodes based on the utilization of resources, favoring the ones with higher allocation.
For each resource type, you can set a weight to modify its influence in the node score.

To set the `MostAllocated` strategy for the `NodeResourcesFit` plugin, use a
[scheduler configuration](/docs/reference/scheduling/config) similar to the following:
-->
## 使用 MostAllocated 策略启用资源装箱   {#enabling-bin-packing-using-mostallocated-strategy}

`MostAllocated` 策略基于资源的利用率来为节点计分，优选分配比率较高的节点。
针对每种资源类型，你可以设置一个权重值以改变其对节点得分的影响。

要为插件 `NodeResourcesFit` 设置 `MostAllocated` 策略，
可以使用一个类似于下面这样的[调度器配置](/zh-cn/docs/reference/scheduling/config/)：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
- pluginConfig:
  - args:
      scoringStrategy:
        resources:
        - name: cpu
          weight: 1
        - name: memory
          weight: 1
        - name: intel.com/foo
          weight: 3
        - name: intel.com/bar
          weight: 3
        type: MostAllocated
    name: NodeResourcesFit
```

<!--
With this configuration, nodes are scored using a weighted average of utilization across all four
resources. Because `intel.com/foo` and `intel.com/bar` each carry a weight of `3` versus `1` for
CPU and memory, the utilization of those extended resources has three times more influence on the
final node score. The scheduler selects the highest-scoring node, aiming to schedule pods on
highly utilized nodes. This helps prepare for scale-down of the least utilized nodes.
-->
通过此配置，节点使用所有四种资源的利用率加权平均进行评分。
因为 `intel.com/foo` 和 `intel.com/bar` 各自具有 `3` 的权重，
而 CPU 和内存的权重为 `1`，这些扩展资源的利用率对最终节点分数的影响是其他资源的三倍。
调度器选择得分最高的节点，旨在将 Pod 调度到利用率较高的节点上。
这有助于准备缩容利用率最低的节点。

<!--
To learn more about other parameters and their default configuration, see the API documentation for
[`NodeResourcesFitArgs`](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-NodeResourcesFitArgs).
-->
要进一步了解其它参数及其默认配置，请参阅
[`NodeResourcesFitArgs`](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-NodeResourcesFitArgs)
的 API 文档。

<!--
## Enabling bin packing using RequestedToCapacityRatio

The `RequestedToCapacityRatio` strategy allows the users to specify the resources along with weights for
each resource to score nodes based on the request to capacity ratio. This
allows users to bin pack extended resources by using appropriate parameters
to improve the utilization of scarce resources in large clusters. It favors nodes according to a
configured function of the allocated resources. The behavior of the `RequestedToCapacityRatio` in
the `NodeResourcesFit` score function can be controlled by the
[scoringStrategy](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-ScoringStrategy) field.
Within the `scoringStrategy` field, you can configure two parameters: `requestedToCapacityRatio` and
`resources`. The `shape` in the `requestedToCapacityRatio`
parameter allows the user to tune the function as least requested or most
requested based on `utilization` and `score` values. The `resources` parameter
comprises both the `name` of the resource to be considered during scoring and
its corresponding `weight`, which specifies the weight of each resource.
-->
## 使用 RequestedToCapacityRatio 策略来启用资源装箱 {#enabling-bin-packing-using-requestedtocapacityratio}

`RequestedToCapacityRatio` 策略允许用户基于请求值与容量的比率，针对参与节点计分的每类资源设置权重。
这一策略使得用户可以使用合适的参数来对扩展资源执行装箱操作，进而提升大规模集群中稀有资源的利用率。
此策略根据所分配资源的一个配置函数来评价节点。
`NodeResourcesFit` 计分函数中的 `RequestedToCapacityRatio` 可以通过
[scoringStrategy](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-ScoringStrategy)
字段来控制。在 `scoringStrategy` 字段中，你可以配置两个参数：
`requestedToCapacityRatio` 和 `resources`。`requestedToCapacityRatio` 参数中的 `shape`
设置使得用户能够调整函数的算法，基于 `utilization` 和 `score` 值计算最少请求或最多请求。
`resources` 参数中包含计分过程中需要考虑的资源的 `name`，以及对应的 `weight`，
后者指定了每个资源的权重。

<!--
Below is an example configuration that sets
the bin packing behavior for extended resources `intel.com/foo` and `intel.com/bar`
using the `requestedToCapacityRatio` field.
-->
下面是一个配置示例，使用 `requestedToCapacityRatio` 字段为扩展资源 `intel.com/foo`
和 `intel.com/bar` 设置装箱行为：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
- pluginConfig:
  - args:
      scoringStrategy:
        resources:
        - name: intel.com/foo
          weight: 3
        - name: intel.com/bar
          weight: 3
        requestedToCapacityRatio:
          shape:
          - utilization: 0
            score: 0
          - utilization: 100
            score: 10
        type: RequestedToCapacityRatio
    name: NodeResourcesFit
```

<!--
In this example, only the extended resources `intel.com/foo` and `intel.com/bar` are listed in
`resources`. The `NodeResourcesFit` plugin therefore scores nodes based solely on the utilization
of those two resources; CPU and memory do not contribute to the score from this plugin. Because the
configured shape assigns a higher score as utilization increases (`score: 0` at `utilization: 0`
rising to `score: 10` at `utilization: 100`), the scheduler prefers nodes where more of these
extended resources are already in use, bin-packing requests for them onto as few nodes as possible.
-->
在此示例中，仅列出了扩展资源 `intel.com/foo` 和 `intel.com/bar`。
因此，`NodeResourcesFit` 插件仅根据这两种资源的利用率来为节点评分；
CPU 和内存不对这个插件的分数产生影响。
由于配置的形状在利用率增加时分配更高的分数（利用率：0 时得分为 0，利用率：100 时得分为 10），
调度器更倾向于那些已经更多使用这些扩展资源的节点，将对它们的请求尽可能打包到尽量少的节点上。

<!--
To include CPU and memory in this scoring strategy, add them to the `resources` list. Note that all
resources in the list share the same `shape` function, so doing so will apply the same bin-packing
curve to those resources as well.
-->
要将 CPU 和内存包含在此评分策略中，可将它们添加到 `resources` 列表中。
请注意，列表中的所有资源共享相同的 `shape` 函数，
因此这样做也会对这些资源应用相同的装箱曲线。

<!--
Referencing the `KubeSchedulerConfiguration` file with the kube-scheduler
flag `--config=/path/to/config/file` will pass the configuration to the
scheduler.
-->
使用 kube-scheduler 标志 `--config=/path/to/config/file` 
引用 `KubeSchedulerConfiguration` 文件，可以将配置传递给调度器。

<!--
To learn more about other parameters and their default configuration, see the API documentation for
[`NodeResourcesFitArgs`](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-NodeResourcesFitArgs).
-->
要进一步了解其它参数及其默认配置，可以参阅
[`NodeResourcesFitArgs`](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-NodeResourcesFitArgs)
的 API 文档。

<!--
### Tuning the score function

`shape` is used to specify the behavior of the `RequestedToCapacityRatio` function.
-->
### 调整计分函数    {#tuning-the-score-function}

`shape` 用于指定 `RequestedToCapacityRatio` 函数的行为。

```yaml
shape:
  - utilization: 0
    score: 0
  - utilization: 100
    score: 10
```

<!--
The above arguments give the node a `score` of 0 if `utilization` is 0% and 10 for
`utilization` 100%, thus enabling bin packing behavior. To enable least
requested the score value must be reversed as follows.
-->
上面的参数在 `utilization` 为 0% 时给节点评分为 0，在 `utilization` 为
100% 时给节点评分为 10，因此启用了装箱行为。
要启用最少请求（least requested）模式，必须按如下方式反转得分值。

```yaml
shape:
  - utilization: 0
    score: 10
  - utilization: 100
    score: 0
```

<!--
`resources` is an optional parameter which defaults to:
-->
`resources` 是一个可选参数，默认值为：

```yaml
resources:
  - name: cpu
    weight: 1
  - name: memory
    weight: 1
```

<!--
It can be used to add extended resources as follows:
-->
它可以像下面这样用来添加扩展资源：

```yaml
resources:
  - name: intel.com/foo
    weight: 5
  - name: cpu
    weight: 3
  - name: memory
    weight: 1
```

<!--
The `weight` parameter is optional and is set to 1 if not specified. Also, the
`weight` cannot be set to a negative value.
-->
`weight` 参数是可选的，如果未指定，则设置为 1。
同时，`weight` 不能设置为负值。

<!--
### Node scoring for capacity allocation

This section is intended for those who want to understand the internal details
of this feature.
Below is an example of how the node score is calculated for a given set of values.
-->
### 节点容量分配的评分   {#node-scoring-for-capacity-allocation}

本节适用于希望了解此功能的内部细节的人员。
以下是如何针对给定的一组值来计算节点得分的示例。

<!--
Requested resources:
-->
请求的资源：

```
intel.com/foo : 2
memory: 256MB
cpu: 2
```

<!--
Resource weights:
-->
资源权重：

```
intel.com/foo : 5
memory: 1
cpu: 3
```

```
FunctionShapePoint {{0, 0}, {100, 10}}
```

<!--
Node 1 spec:
-->
节点 1 配置：

```
Available:
  intel.com/foo: 4
  memory: 1 GB
  cpu: 8

Used:
  intel.com/foo: 1
  memory: 256MB
  cpu: 1
```

<!--
Node score:
-->
节点得分：

```
intel.com/foo  = resourceScoringFunction((2+1),4)
               = (100 - ((4-3)*100/4))
               = (100 - 25)
               = 75                       # requested + used = 75% * available
               = rawScoringFunction(75)
               = 7                        # floor(75/10)

memory         = resourceScoringFunction((256+256),1024)
               = (100 -((1024-512)*100/1024))
               = 50                       # requested + used = 50% * available
               = rawScoringFunction(50)
               = 5                        # floor(50/10)

cpu            = resourceScoringFunction((2+1),8)
               = (100 -((8-3)*100/8))
               = 37.5                     # requested + used = 37.5% * available
               = rawScoringFunction(37.5)
               = 3                        # floor(37.5/10)

NodeScore   =  ((7 * 5) + (5 * 1) + (3 * 3)) / (5 + 1 + 3)
            =  5
```

<!--
Node 2 spec:
-->
节点 2 配置：

```
Available:
  intel.com/foo: 8
  memory: 1GB
  cpu: 8

Used:
  intel.com/foo: 2
  memory: 512MB
  cpu: 6
```

<!--
Node score:
-->
节点得分：

```
intel.com/foo  = resourceScoringFunction((2+2),8)
               = (100 - ((8-4)*100/8)
               = (100 - 50)
               = 50
               = rawScoringFunction(50)
               = 5

memory         = resourceScoringFunction((256+512),1024)
               = (100 -((1024-768)*100/1024))
               = 75
               = rawScoringFunction(75)
               = 7

cpu            = resourceScoringFunction((2+6),8)
               = (100 -((8-8)*100/8))
               = 100
               = rawScoringFunction(100)
               = 10

NodeScore   =  ((5 * 5) + (7 * 1) + (10 * 3)) / (5 + 1 + 3)
            =  7
```

## {{% heading "whatsnext" %}}

<!--
- Read more about the [scheduling framework](/docs/concepts/scheduling-eviction/scheduling-framework/)
- Read more about [scheduler configuration](/docs/reference/scheduling/config/)
-->
- 继续阅读[调度器框架](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/)
- 继续阅读[调度器配置](/zh-cn/docs/reference/scheduling/config/)
