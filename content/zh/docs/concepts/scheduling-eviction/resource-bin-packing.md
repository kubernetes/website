---
title: 扩展资源的资源装箱
content_type: concept
weight: 80
---
<!--
---
reviewers:
- bsalamat
- k82cn
- ahg-g
title: Resource Bin Packing for Extended Resources
content_type: concept
weight: 80
---
-->

<!-- overview -->

{{< feature-state for_k8s_version="1.16" state="alpha" >}}

<!--
The kube-scheduler can be configured to enable bin packing of resources along with extended resources using `RequestedToCapacityRatioResourceAllocation` priority function. Priority functions can be used to fine-tune the kube-scheduler as per custom needs.
-->

使用 `RequestedToCapacityRatioResourceAllocation` 优先级函数，可以将 kube-scheduler
配置为支持包含扩展资源在内的资源装箱操作。
优先级函数可用于根据自定义需求微调 kube-scheduler 。

<!-- body -->

<!--
## Enabling Bin Packing using RequestedToCapacityRatioResourceAllocation

Kubernetes allows the users to specify the resources along with weights for
each resource to score nodes based on the request to capacity ratio. This
allows users to bin pack extended resources by using appropriate parameters
and improves the utilization of scarce resources in large clusters. The
behavior of the `RequestedToCapacityRatioResourceAllocation` priority function
can be controlled by a configuration option called `RequestedToCapacityRatioArgs`. 
This argument consists of two parameters `shape` and `resources`. The `shape` 
parameter allows the user to tune the function as least requested or most 
requested based on `utilization` and `score` values.  The `resources` parameter 
consists of `name` of the resource to be considered during scoring and `weight` 
specify the weight of each resource.

-->

## 使用 RequestedToCapacityRatioResourceAllocation 启用装箱

Kubernetes 允许用户指定资源以及每类资源的权重，
以便根据请求数量与可用容量之比率为节点评分。
这就使得用户可以通过使用适当的参数来对扩展资源执行装箱操作，从而提高了大型集群中稀缺资源的利用率。
`RequestedToCapacityRatioResourceAllocation` 优先级函数的行为可以通过名为
`RequestedToCapacityRatioArgs` 的配置选项进行控制。
该标志由两个参数 `shape` 和 `resources` 组成。
`shape` 允许用户根据 `utilization` 和 `score` 值将函数调整为
最少请求（least requested）或最多请求（most requested）计算。
`resources` 包含由 `name` 和  `weight` 组成，`name` 指定评分时要考虑的资源，
`weight` 指定每种资源的权重。

<!--
Below is an example configuration that sets
`requestedToCapacityRatioArguments` to bin packing behavior for extended
resources `intel.com/foo` and `intel.com/bar`.
-->

以下是一个配置示例，该配置将 `requestedToCapacityRatioArguments` 设置为对扩展资源
`intel.com/foo` 和 `intel.com/bar` 的装箱行为

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta1
kind: KubeSchedulerConfiguration
profiles:
# ...
  pluginConfig:
  - name: RequestedToCapacityRatio
    args: 
      shape:
      - utilization: 0
        score: 10
      - utilization: 100
        score: 0
      resources:
      - name: intel.com/foo
        weight: 3
      - name: intel.com/bar
        weight: 5
```

<!--
Referencing the `KubeSchedulerConfiguration` file with the kube-scheduler 
flag `--config=/path/to/config/file` will pass the configuration to the 
scheduler.
-->
使用 kube-scheduler 标志 `--config=/path/to/config/file` 
引用 `KubeSchedulerConfiguration` 文件将配置传递给调度器。

<!--
**This feature is disabled by default**
-->

**默认情况下此功能处于被禁用状态**

<!--
### Tuning RequestedToCapacityRatioResourceAllocation Priority Function

`shape` is used to specify the behavior of the `RequestedToCapacityRatioPriority` function.
-->
### 调整 RequestedToCapacityRatioResourceAllocation 优先级函数

`shape` 用于指定 `RequestedToCapacityRatioPriority` 函数的行为。

```yaml
 {"utilization": 0, "score": 0},
 {"utilization": 100, "score": 10}
```

<!--
The above arguments give the node a score of 0 if utilization is 0% and 10 for utilization 100%, thus enabling bin packing behavior. To enable least requested the score value must be reversed as follows.
-->

上面的参数在 `utilization` 为 0% 时给节点评分为 0，在 `utilization` 为
100% 时给节点评分为 10，因此启用了装箱行为。
要启用最少请求（least requested）模式，必须按如下方式反转得分值。

```yaml
 {"utilization": 0, "score": 10},
 {"utilization": 100, "score": 0}
```

<!--
`resources` is an optional parameter which by defaults is set to:
-->
`resources` 是一个可选参数，默认情况下设置为：

``` yaml
"resources": [
    {"name": "CPU", "weight": 1},
    {"name": "Memory", "weight": 1}
]
```

<!--
It can be used to add extended resources as follows:
-->
它可以用来添加扩展资源，如下所示：

```yaml
"resources": [
    {"name": "intel.com/foo", "weight": 5},
    {"name": "CPU", "weight": 3},
    {"name": "Memory", "weight": 1}
]
```

<!--
The weight parameter is optional and is set to 1 if not specified. Also, the weight cannot be set to a negative value.
-->
weight 参数是可选的，如果未指定，则设置为 1。
同时，weight 不能设置为负值。

<!--
### How the RequestedToCapacityRatioResourceAllocation Priority Function Scores Nodes

This section is intended for those who want to understand the internal details
of this feature.
Below is an example of how the node score is calculated for a given set of values.
-->

### RequestedToCapacityRatioResourceAllocation 优先级函数如何对节点评分

本节适用于希望了解此功能的内部细节的人员。
以下是如何针对给定的一组值来计算节点得分的示例。

```
请求的资源

intel.com/foo: 2
Memory: 256MB
CPU: 2

资源权重

intel.com/foo: 5
Memory: 1
CPU: 3

FunctionShapePoint {{0, 0}, {100, 10}}

节点 Node 1 配置

可用：
  intel.com/foo : 4
  Memory : 1 GB
  CPU: 8

已用：
  intel.com/foo: 1
  Memory: 256MB
  CPU: 1

节点得分：

intel.com/foo  = resourceScoringFunction((2+1),4)
               = (100 - ((4-3)*100/4)
               = (100 - 25)
               = 75
               = rawScoringFunction(75)
               = 7

Memory         = resourceScoringFunction((256+256),1024)
               = (100 -((1024-512)*100/1024))
               = 50
               = rawScoringFunction(50)
               = 5

CPU            = resourceScoringFunction((2+1),8)
               = (100 -((8-3)*100/8))
               = 37.5
               = rawScoringFunction(37.5)
               = 3

NodeScore   =  (7 * 5) + (5 * 1) + (3 * 3) / (5 + 1 + 3)
            =  5


节点 Node 2 配置

可用：
  intel.com/foo: 8
  Memory: 1GB
  CPU: 8

已用：
  intel.com/foo: 2
  Memory: 512MB
  CPU: 6

节点得分：

intel.com/foo  = resourceScoringFunction((2+2),8)
               = (100 - ((8-4)*100/8)
               = (100 - 50)
               = 50
               = rawScoringFunction(50)
               = 5

Memory         = resourceScoringFunction((256+512),1024)
               = (100 -((1024-768)*100/1024))
               = 75
               = rawScoringFunction(75)
               = 7

CPU            = resourceScoringFunction((2+6),8)
               = (100 -((8-8)*100/8))
               = 100
               = rawScoringFunction(100)
               = 10

NodeScore   =  (5 * 5) + (7 * 1) + (10 * 3) / (5 + 1 + 3)
            =  7
```
