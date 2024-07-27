---
reviewers:
- bsalamat
- k82cn
- ahg-g
title: Resource Bin Packing
content_type: concept
weight: 80
---

<!-- overview -->

In the [scheduling-plugin](/docs/reference/scheduling/config/#scheduling-plugins) `NodeResourcesFit` of kube-scheduler, there are two
scoring strategies that support the bin packing of resources: `MostAllocated` and `RequestedToCapacityRatio`.

<!-- body -->

## Enabling bin packing using MostAllocated strategy
The `MostAllocated` strategy scores the nodes based on the utilization of resources, favoring the ones with higher allocation.
For each resource type, you can set a weight to modify its influence in the node score.

To set the `MostAllocated` strategy for the `NodeResourcesFit` plugin, use a
[scheduler configuration](/docs/reference/scheduling/config) similar to the following:

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

To learn more about other parameters and their default configuration, see the API documentation for
[`NodeResourcesFitArgs`](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-NodeResourcesFitArgs).

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

Below is an example configuration that sets
the bin packing behavior for extended resources `intel.com/foo` and `intel.com/bar`
using the `requestedToCapacityRatio` field.

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

Referencing the `KubeSchedulerConfiguration` file with the kube-scheduler
flag `--config=/path/to/config/file` will pass the configuration to the
scheduler.

To learn more about other parameters and their default configuration, see the API documentation for
[`NodeResourcesFitArgs`](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-NodeResourcesFitArgs).

### Tuning the score function

`shape` is used to specify the behavior of the `RequestedToCapacityRatio` function.

```yaml
shape:
  - utilization: 0
    score: 0
  - utilization: 100
    score: 10
```

The above arguments give the node a `score` of 0 if `utilization` is 0% and 10 for
`utilization` 100%, thus enabling bin packing behavior. To enable least
requested the score value must be reversed as follows.

```yaml
shape:
  - utilization: 0
    score: 10
  - utilization: 100
    score: 0
```

`resources` is an optional parameter which defaults to:

```yaml
resources:
  - name: cpu
    weight: 1
  - name: memory
    weight: 1
```

It can be used to add extended resources as follows:

```yaml
resources:
  - name: intel.com/foo
    weight: 5
  - name: cpu
    weight: 3
  - name: memory
    weight: 1
```

The `weight` parameter is optional and is set to 1 if not specified. Also, the
`weight` cannot be set to a negative value.

### Node scoring for capacity allocation

This section is intended for those who want to understand the internal details
of this feature.
Below is an example of how the node score is calculated for a given set of values.

Requested resources:

```
intel.com/foo : 2
memory: 256MB
cpu: 2
```

Resource weights:

```
intel.com/foo : 5
memory: 1
cpu: 3
```

FunctionShapePoint {{0, 0}, {100, 10}}

Node 1 spec:

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

Node score:

```
intel.com/foo  = resourceScoringFunction((2+1),4)
               = (100 - ((4-3)*100/4)
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

Node 2 spec:

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

Node score:

```
intel.com/foo  = resourceScoringFunction((2+2),8)
               =  (100 - ((8-4)*100/8)
               =  (100 - 50)
               =  50
               =  rawScoringFunction(50)
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

- Read more about the [scheduling framework](/docs/concepts/scheduling-eviction/scheduling-framework/)
- Read more about [scheduler configuration](/docs/reference/scheduling/config/)
