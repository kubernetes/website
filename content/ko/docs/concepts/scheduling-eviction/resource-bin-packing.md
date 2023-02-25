---
# reviewers:
# - bsalamat
# - k82cn
# - ahg-g
title: 리소스 빈 패킹(bin packing)
content_type: concept
weight: 80
---

<!-- overview -->

kube-scheduler의 [스케줄링 플러그인](/ko/docs/reference/scheduling/config/#scheduling-plugins) `NodeResourcesFit`에는,
리소스의 빈 패킹(bin packing)을 지원하는 `MostAllocated`과 `RequestedToCapacityRatio`라는 두 가지 점수 산정(scoring) 전략이 있다.

<!-- body -->

## MostAllocated 전략을 사용하여 빈 패킹 활성화하기
`MostAllocated` 전략은 리소스 사용량을 기반으로 할당량이 많은 노드를 높게 평가하여 노드에 점수를 매긴다.
각 리소스 유형별로 가중치를 설정하여 노드 점수에 미치는 영향을 조정할 수 있다.

`NodeResourcesFit` 플러그인에 대한 `MostAllocated` 전략을 설정하려면,
다음과 유사한 [스케줄러 설정](/ko/docs/reference/scheduling/config)을 사용한다.

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
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

기타 파라미터와 기본 구성에 대한 자세한 내용은 
[`NodeResourcesFitArgs`](/docs/reference/config-api/kube-scheduler-config.v1beta3/#kubescheduler-config-k8s-io-v1beta3-NodeResourcesFitArgs)에 대한 API 문서를 참조한다.

## RequestedToCapacityRatio을 사용하여 빈 패킹 활성화하기

`RequestedToCapacityRatio` 전략은 사용자가 각 리소스에 대한 가중치와 함께 리소스를 지정하여
용량 대비 요청 비율을 기반으로 노드의 점수를 매길 수 있게 한다.
이를 통해 사용자는 적절한 파라미터를 사용하여 확장된 리소스를 빈 팩으로 만들 수 있어
대규모의 클러스터에서 부족한 리소스의 활용도를 향상시킬 수 있다. 이 전략은
할당된 리소스의 구성된 기능에 따라 노드를 선호하게 한다. `NodeResourcesFit`점수 기능의
`RequestedToCapacityRatio` 동작은 [scoringStrategy](/docs/reference/config-api/kube-scheduler-config.v1beta3/#kubescheduler-config-k8s-io-v1beta3-ScoringStrategy)필드를
이용하여 제어할 수 있다.
`scoringStrategy` 필드에서 `requestedToCapacityRatio`와 `resources`라는 두 개의 파라미터를
구성할 수 있다. `requestedToCapacityRatio`파라미터의
`shape`를 사용하면 `utilization`과 `score` 값을 기반으로
최소 요청 혹은 최대 요청된 대로 기능을 조정할 수 있게 한다.
`resources` 파라미터는 점수를 매길 때 고려할 리소스의 `name` 과 
각 리소스의 가중치를 지정하는 `weight` 로 구성된다.

다음은 `requestedToCapacityRatio` 를 이용해
확장된 리소스 `intel.com/foo` 와 `intel.com/bar` 에 대한 빈 패킹 동작을
설정하는 구성의 예시이다.

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
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

kube-scheduler 플래그 `--config=/path/to/config/file` 을 사용하여 
`KubeSchedulerConfiguration` 파일을 참조하면 구성이 스케줄러에
전달된다.

기타 파라미터와 기본 구성에 대한 자세한 내용은
[`NodeResourcesFitArgs`](/docs/reference/config-api/kube-scheduler-config.v1beta3/#kubescheduler-config-k8s-io-v1beta3-NodeResourcesFitArgs)에 대한 API 문서를 참조한다.

### 점수 기능 튜닝하기

`shape` 는 `RequestedToCapacityRatio` 기능의 동작을 지정하는 데 사용된다.

```yaml
shape:
 - utilization: 0
   score: 0
 - utilization: 100
   score: 10
```

위의 인수는 `utilization` 이 0%인 경우 `score` 는 0, `utilization` 이
100%인 경우 10으로 하여, 빈 패킹 동작을 활성화한다. 최소 요청을
활성화하려면 점수 값을 다음과 같이 변경해야 한다.

```yaml
shape:
  - utilization: 0
    score: 10
  - utilization: 100
    score: 0
```

`resources` 는 기본적으로 다음과 같이 설정되는 선택적인 파라미터이다.

``` yaml
resources:
  - name: cpu
    weight: 1
  - name: memory
    weight: 1
```

다음과 같이 확장된 리소스를 추가하는 데 사용할 수 있다.

```yaml
resources:
  - name: intel.com/foo
    weight: 5
  - name: cpu
    weight: 3
  - name: memory
    weight: 1
```

`weight` 파라미터는 선택 사항이며 지정되지 않은 경우 1로 설정 된다. 또한,
`weight` 는 음수로 설정할 수 없다.

### 용량 할당을 위해 노드에 점수 매기기

이 섹션은 이 기능 내부의 세부적인 사항을 이해하려는 사람들을
위한 것이다.
아래는 주어진 값의 집합에 대해 노드 점수가 계산되는 방법의 예시이다.

요청된 리소스는 다음과 같다.

```
intel.com/foo : 2
memory: 256MB
cpu: 2
```

리소스의 가중치는 다음과 같다.

```
intel.com/foo : 5
memory: 1
cpu: 3
```

FunctionShapePoint {{0, 0}, {100, 10}}

노드 1의 사양은 다음과 같다.

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

노드 점수는 다음과 같다.

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

NodeScore   =  (7 * 5) + (5 * 1) + (3 * 3) / (5 + 1 + 3)
            =  5
```

노드 2의 사양은 다음과 같다.

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

노드 점수는 다음과 같다.

```
intel.com/foo  = resourceScoringFunction((2+2),8)
               =  (100 - ((8-4)*100/8)
               =  (100 - 50)
               =  50
               =  rawScoringFunction(50)
               = 5

Memory         = resourceScoringFunction((256+512),1024)
               = (100 -((1024-768)*100/1024))
               = 75
               = rawScoringFunction(75)
               = 7

cpu            = resourceScoringFunction((2+6),8)
               = (100 -((8-8)*100/8))
               = 100
               = rawScoringFunction(100)
               = 10

NodeScore   =  (5 * 5) + (7 * 1) + (10 * 3) / (5 + 1 + 3)
            =  7

```

## {{% heading "whatsnext" %}}

- [스케줄링 프레임워크](/docs/concepts/scheduling-eviction/scheduling-framework/)에 대해 더 읽어본다.
- [스케줄러 구성](/ko/docs/reference/scheduling/config/)에 대해 더 읽어본다.

