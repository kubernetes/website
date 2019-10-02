---
reviewers:
- bsalamat
- k82cn
- ahg-g
title: Resource Bin Packing for Extended Resources
content_template: templates/concept
weight: 10
---

{{% capture overview %}}

{{< feature-state for_k8s_version="1.16" state="alpha" >}}

The kube-scheduler can be configured to enable bin packing of resources along with extended resources using `RequestedToCapacityRatioResourceAllocation` priority function. Priority functions can be used to fine-tune the kube-scheduler as per custom needs. 

{{% /capture %}}

{{% capture body %}}

## Enabling Bin Packing using RequestedToCapacityRatioResourceAllocation

Before Kubernetes 1.15, Kube-scheduler used to allow scoring nodes based on the request to capacity ratio of primary resources like CPU and Memory. Kubernetes 1.16 added a new parameter to the priority function that allows the users to specify the resources along with weights for each resource to score nodes based on the request to capacity ratio. This allows users to bin pack extended resources by using appropriate parameters improves the utilization of scarce resources in large clusters. The behavior of the `RequestedToCapacityRatioResourceAllocation` priority function can be controlled by a configuration option called `requestedToCapacityRatioArguments`. This argument consists of two parameters `shape` and `resources`. Shape allows the user to tune the function as least requested or most requested based on `utilization` and `score` values. Resources
consists of `name` which specifies the resource to be considered during scoring and `weight` specify the weight of each resource.

Below is an example configuration that sets `requestedToCapacityRatioArguments` to bin packing behavior for extended resources `intel.com/foo` and `intel.com/bar`

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

**This feature is disabled by default**

### Tuning RequestedToCapacityRatioResourceAllocation Priority Function

`shape` is used to specify the behavior of the `RequestedToCapacityRatioPriority` function.

```yaml
 {"utilization": 0, "score": 0},
 {"utilization": 100, "score": 10}
```

The above arguments give the node a score of 0 if utilization is 0% and 10 for utilization 100%, thus enabling bin packing behavior. To enable least requested the score value must be reversed as follows.

```yaml
 {"utilization": 0, "score": 100},
 {"utilization": 100, "score": 0}
```

`resources` is an optional parameter which by defaults is set to:

``` yaml
"resources": [
              {"name": "CPU", "weight": 1},
              {"name": "Memory", "weight": 1}
            ]
```

It can be used to add extended resources as follows: 

```yaml
"resources": [
              {"name": "intel.com/foo", "weight": 5},
              {"name": "CPU", "weight": 3},
              {"name": "Memory", "weight": 1}
            ]
```

The weight parameter is optional and is set to 1 if not specified. Also, the weight cannot be set to a negative value.

### How the RequestedToCapacityRatioResourceAllocation Priority Function Scores Nodes

This section is intended for those who want to understand the internal details
of this feature.
Below is an example of how the node score is calculated for a given set of values.

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

{{% /capture %}}
