---
reviewers:
- bsalamat
- k82cn
- ahg-g
title: 扩展资源的资源箱打包
content_type: concept
weight: 10
---
<!--
---
reviewers:
- bsalamat
- k82cn
- ahg-g
title: Resource Bin Packing for Extended Resources
content_type: concept
weight: 10
---
-->

<!-- overview -->

{{< feature-state for_k8s_version="1.16" state="alpha" >}}

<!--
The kube-scheduler can be configured to enable bin packing of resources along with extended resources using `RequestedToCapacityRatioResourceAllocation` priority function. Priority functions can be used to fine-tune the kube-scheduler as per custom needs. 
-->
可以将 kube-scheduler 配置为使用 `RequestedToCapacityRatioResourceAllocation` 优先级函数启用资源箱打包以及扩展资源。
优先级函数可用于根据自定义需求微调 kube-scheduler 。



<!-- body -->

<!--
## Enabling Bin Packing using RequestedToCapacityRatioResourceAllocation
-->
## 使用 RequestedToCapacityRatioResourceAllocation 启用装箱

<!--
Before Kubernetes 1.15, Kube-scheduler used to allow scoring nodes based on the request to capacity ratio of primary resources like CPU and Memory. Kubernetes 1.16 added a new parameter to the priority function that allows the users to specify the resources along with weights for each resource to score nodes based on the request to capacity ratio. This allows users to bin pack extended resources by using appropriate parameters improves the utilization of scarce resources in large clusters. The behavior of the `RequestedToCapacityRatioResourceAllocation` priority function can be controlled by a configuration option called `requestedToCapacityRatioArguments`. This argument consists of two parameters `shape` and `resources`. Shape allows the user to tune the function as least requested or most requested based on `utilization` and `score` values. Resources
consists of `name` which specifies the resource to be considered during scoring and `weight` specify the weight of each resource.
-->
在 Kubernetes 1.15 之前，Kube-scheduler 用于允许根据主要资源，如 CPU 和内存对容量之比的请求对节点进行评分。
Kubernetes 1.16 在优先级函数中添加了一个新参数，该参数允许用户指定资源以及每个资源的权重，以便根据容量之比的请求为节点评分。
这允许用户通过使用适当的参数来打包扩展资源，从而提高了大型集群中稀缺资源的利用率。
`RequestedToCapacityRatioResourceAllocation` 优先级函数的行为可以通过名为 `requestedToCapacityRatioArguments` 的配置选项进行控制。
这个论证由两个参数 `shape` 和 `resources` 组成。
Shape 允许用户根据 `utilization` 和 `score` 值将功能调整为要求最少或要求最高的功能。
资源由 `name` 和  `weight` 组成，`name` 指定评分时要考虑的资源，`weight` 指定每种资源的权重。 

<!--
Below is an example configuration that sets `requestedToCapacityRatioArguments` to bin packing behavior for extended resources `intel.com/foo` and `intel.com/bar`
-->
以下是一个配置示例，该配置将 `requestedToCapacityRatioArguments` 设置为扩展资源 `intel.com/foo` 和 `intel.com/bar` 的装箱行为

```json
{
    "kind" : "Policy",
    "apiVersion" : "v1",

    ...

    "priorities" : [

       ...

      {
        "name": "RequestedToCapacityRatioPriority",
        "weight": 2,
        "argument": {
          "requestedToCapacityRatioArguments": {
            "shape": [
              {"utilization": 0, "score": 0},
              {"utilization": 100, "score": 10}
            ],
            "resources": [
              {"name": "intel.com/foo", "weight": 3},
              {"name": "intel.com/bar", "weight": 5}
            ]
          }
        }
      }
    ],
  }
```

<!--
**This feature is disabled by default**
-->
**默认情况下禁用此功能**

<!--
### Tuning RequestedToCapacityRatioResourceAllocation Priority Function
-->
### 调整 RequestedToCapacityRatioResourceAllocation 优先级函数

<!--
`shape` is used to specify the behavior of the `RequestedToCapacityRatioPriority` function.
-->
`shape` 用于指定 `RequestedToCapacityRatioPriority` 函数的行为。

```yaml
 {"utilization": 0, "score": 0},
 {"utilization": 100, "score": 10}
```

<!--
The above arguments give the node a score of 0 if utilization is 0% and 10 for utilization 100%, thus enabling bin packing behavior. To enable least requested the score value must be reversed as follows.
-->
上面的参数在利用率为 0% 时给节点评分为0，在利用率为 100% 时给节点评分为10，因此启用了装箱行为。
要启用最少请求，必须按如下方式反转得分值。

```yaml
 {"utilization": 0, "score": 100},
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
weight 参数是可选的，如果未指定，则设置为1。
同样， weight 不能设置为负值。

<!--
### How the RequestedToCapacityRatioResourceAllocation Priority Function Scores Nodes
-->
### RequestedToCapacityRatioResourceAllocation 优先级函数如何对节点评分

<!--
This section is intended for those who want to understand the internal details
of this feature.
Below is an example of how the node score is calculated for a given set of values.
-->
本部分适用于希望了解此功能的内部细节的人员。
以下是如何针对给定的一组值计算节点得分的示例。

```
Requested Resources

intel.com/foo : 2
Memory: 256MB
CPU: 2

Resource Weights

intel.com/foo : 5
Memory: 1
CPU: 3

FunctionShapePoint {{0, 0}, {100, 10}}

Node 1 Spec

Available:
intel.com/foo : 4
Memory : 1 GB
CPU: 8

Used:
intel.com/foo: 1
Memory: 256MB
CPU: 1


Node Score:

intel.com/foo  = resourceScoringFunction((2+1),4)
               =  (100 - ((4-3)*100/4)
               =  (100 - 25)
               =  75
               =  rawScoringFunction(75)
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


Node 2 Spec

Available:
intel.com/foo: 8
Memory: 1GB
CPU: 8

Used:

intel.com/foo: 2
Memory: 512MB
CPU: 6


Node Score:

intel.com/foo  = resourceScoringFunction((2+2),8)
               =  (100 - ((8-4)*100/8)
               =  (100 - 25)
               =  50
               =  rawScoringFunction(50)
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



