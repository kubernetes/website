---
title: 확장된 리소스를 위한 리소스 빈 패킹(bin packing)
content_template: templates/concept
weight: 10
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}

kube-scheduler는 `RequestedToCapacityRatioResourceAllocation` 우선 순위 기능을 사용해서 확장된 리소스와 함께 리소스의 빈 패킹이 가능하도록 구성할 수 있다. 우선 순위 기능을 사용해서 맞춤 요구에 따라 kube-scheduler를 미세 조정할 수 있다.

{{% /capture %}}

{{% capture body %}}

## RequestedToCapacityRatioResourceAllocation을 사용해서 빈 패킹 활성화하기

쿠버네티스 1.15 이전에는 Kube-scheduler가 CPU 및 메모리와 같은 리소스의 용량 대비 요청 비율을 기반으로 노드의 점수를 매기는 것을 허용했다. 쿠버네티스 1.16은 우선 순위 기능에 새로운 파라미터를 추가해서 사용자가 용량 대비 요청 비율을 기반으로 노드에 점수를 매기도록 각 리소스의 가중치와 함께 리소스를 지정할 수 있다. 이를 통해 사용자는 적절한 파라미터를 사용해서 확장된 리소스를 빈 팩으로 만들수 있어 대규모의 클러스터에서 부족한 리소스의 활용도가 향상된다. `RequestedToCapacityRatioResourceAllocation` 우선 순위 기능의 동작은 `requestedToCapacityRatioArguments`라는 구성 옵션으로 제어할 수 있다. 이 인수는 `shape`와 `resources` 두 개의 파라미터로 구성된다. 셰이프(shape)는 사용자가 `utilization`과 `score` 값을 기반으로 최소 요청 또는 최대 요청된 대로 기능을 조정할 수 있게 한다. 리소스는
점수를 매길 때 고려할 리소스를 지정하는 `name` 과 각 리소스의 가중치를 지정하는 `weight` 로 구성된다.

다음은 확장된 리소스 `intel.com/foo` 와 `intel.com/bar` 에 대한 `requestedToCapacityRatioArguments` 를 빈 패킹 동작으로 설정하는 구성의 예시이다.

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

**이 기능은 기본적으로 비활성화되어 있다.**

### RequestedToCapacityRatioResourceAllocation 우선 순위 기능 튜닝하기

`shape` 는 `RequestedToCapacityRatioPriority` 기능의 동작을 지정하는 데 사용된다.

```yaml
 {"utilization": 0, "score": 0},
 {"utilization": 100, "score": 10}
```

위의 인수는 사용률이 0%인 경우 점수는 0, 사용률이 100%인 경우 10으로 하여, 빈 패킹 동작을 활성화한다. 최소 요청을 활성화하려면 점수 값을 다음과 같이 변경해야 한다.

```yaml
 {"utilization": 0, "score": 100},
 {"utilization": 100, "score": 0}
```

`resources` 는 기본적으로 다음과 같이 설정되는 선택적인 파라미터이다.

``` yaml
"resources": [
              {"name": "CPU", "weight": 1},
              {"name": "Memory", "weight": 1}
            ]
```

다음과 같이 확장된 리소스를 추가하는 데 사용할 수 있다.

```yaml
"resources": [
              {"name": "intel.com/foo", "weight": 5},
              {"name": "CPU", "weight": 3},
              {"name": "Memory", "weight": 1}
            ]
```

가중치 파라미터는 선택 사항이며 지정되지 않은 경우 1로 설정 된다. 또한, 가중치는 음수로 설정할 수 없다.

### RequestedToCapacityRatioResourceAllocation 우선 순위 기능이 노드에 점수를 매기는 방법

이 섹션은 이 기능 내부의 세부적인 사항을 이해하려는 사람들을
위한 것이다.
아래는 주어진 값의 집합에 대해 노드 점수가 계산되는 방법의 예시이다.

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
