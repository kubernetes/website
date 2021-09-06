---
title: Horizontal Pod Autoscaler
feature:
  title: Horizontal 스케일링
  description: >
    간단한 명령어나 UI를 통해서 또는 CPU 사용량에 따라 자동으로 애플리케이션의 스케일을 업 또는 다운한다.

content_type: concept
weight: 90
---





<!-- overview -->

Horizontal Pod Autoscaler는 CPU 사용량
(또는 [사용자 정의 메트릭](https://git.k8s.io/community/contributors/design-proposals/instrumentation/custom-metrics-api.md),
아니면 다른 애플리케이션 지원 메트릭)을 관찰하여 레플리케이션
컨트롤러(ReplicationController), 디플로이먼트(Deployment), 레플리카셋(ReplicaSet) 또는 스테이트풀셋(StatefulSet)의 파드 개수를 자동으로 스케일한다. Horizontal
Pod Autoscaler는 크기를 조정할 수 없는 오브젝트(예: 데몬셋(DaemonSet))에는 적용되지 않는다.

Horizontal Pod Autoscaler는 쿠버네티스 API 리소스 및 컨트롤러로 구현된다.
리소스는 컨트롤러의 동작을 결정한다.
컨트롤러는 관찰된 평균 CPU 사용률이 사용자가 지정한 대상과 일치하도록 레플리케이션
컨트롤러 또는 디플로이먼트에서 레플리카 개수를 주기적으로 조정한다.




<!-- body -->

## Horizontal Pod Autoscaler는 어떻게 작동하는가?

![Horizontal Pod Autoscaler 다이어그램](/images/docs/horizontal-pod-autoscaler.svg)

Horizontal Pod Autoscaler는 컨트롤러
관리자의 `--horizontal-pod-autoscaler-sync-period` 플래그(기본값은
15초)에 의해 제어되는 주기를 가진 컨트롤 루프로 구현된다.

각 주기 동안 컨트롤러 관리자는 각 HorizontalPodAutoscaler 정의에
지정된 메트릭에 대해 리소스 사용률을 질의한다. 컨트롤러 관리자는 리소스
메트릭 API(파드 단위 리소스 메트릭 용)
또는 사용자 지정 메트릭 API(다른 모든 메트릭 용)에서 메트릭을 가져온다.

* 파드 단위 리소스 메트릭(예 : CPU)의 경우 컨트롤러는 HorizontalPodAutoscaler가
  대상으로하는 각 파드에 대한 리소스 메트릭 API에서 메트릭을 가져온다.
  그런 다음, 목표 사용률 값이 설정되면, 컨트롤러는 각 파드의
  컨테이너에 대한 동등한 자원 요청을 퍼센트 단위로 하여 사용률 값을
  계산한다. 대상 원시 값이 설정된 경우 원시 메트릭 값이 직접 사용된다.
  그리고, 컨트롤러는 모든 대상 파드에서 사용된 사용률의 평균 또는 원시 값(지정된
  대상 유형에 따라 다름)을 가져와서 원하는 레플리카의 개수를 스케일하는데
  사용되는 비율을 생성한다.

  파드의 컨테이너 중 일부에 적절한 리소스 요청이 설정되지 않은 경우,
  파드의 CPU 사용률은 정의되지 않으며, 따라서 오토스케일러는
  해당 메트릭에 대해 아무런 조치도 취하지 않는다. 오토스케일링
  알고리즘의 작동 방식에 대한 자세한 내용은 아래 [알고리즘 세부 정보](#알고리즘-세부-정보)
  섹션을 참조하기 바란다.

* 파드 단위 사용자 정의 메트릭의 경우, 컨트롤러는 사용률 값이 아닌 원시 값을 사용한다는 점을
  제외하고는 파드 단위 리소스 메트릭과 유사하게 작동한다.

* 오브젝트 메트릭 및 외부 메트릭의 경우, 문제의 오브젝트를 표현하는
  단일 메트릭을 가져온다. 이 메트릭은 목표 값과
  비교되어 위와 같은 비율을 생성한다. `autoscaling/v2beta2` API
  버전에서는, 비교가 이루어지기 전에 해당 값을 파드의 개수로
  선택적으로 나눌 수 있다.

HorizontalPodAutoscaler는 보통 일련의 API 집합(`metrics.k8s.io`,
`custom.metrics.k8s.io`, `external.metrics.k8s.io`)에서 메트릭을 가져온다. `metrics.k8s.io` API는 대개 별도로
시작해야 하는 메트릭-서버에 의해 제공된다. 가이드는
[메트릭-서버](/ko/docs/tasks/debug-application-cluster/resource-metrics-pipeline/#메트릭-서버)를
참조한다. HorizontalPodAutoscaler는 힙스터(Heapster)에서 직접 메트릭을 가져올 수도 있다.

{{< note >}}
{{< feature-state state="deprecated" for_k8s_version="v1.11" >}}
힙스터에서 메트릭 가져오기는 Kubernetes 1.11에서 사용 중단(deprecated)됨.
{{< /note >}}

자세한 사항은 [메트릭 API를 위한 지원](#메트릭-API를-위한-지원)을 참조한다.

오토스케일러는 스케일 하위 리소스를 사용하여 상응하는 확장 가능 컨트롤러(예: 레플리케이션 컨트롤러, 디플로이먼트, 레플리케이션 셋)에 접근한다.
스케일은 레플리카의 개수를 동적으로 설정하고 각 현재 상태를 검사 할 수 있게 해주는 인터페이스이다.
하위 리소스 스케일에 대한 자세한 내용은
[여기](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#scale-subresource)에서 확인할 수 있다.

### 알고리즘 세부 정보

가장 기본적인 관점에서, Horizontal Pod Autoscaler 컨트롤러는
원하는(desired) 메트릭 값과 현재(current) 메트릭 값 사이의 비율로
작동한다.

```
원하는 레플리카 수 = ceil[현재 레플리카 수 * ( 현재 메트릭 값 / 원하는 메트릭 값 )]
```

예를 들어 현재 메트릭 값이 `200m`이고 원하는 값이
`100m`인 경우 `200.0 / 100.0 == 2.0`이므로 복제본 수가 두 배가
된다. 만약 현재 값이 `50m` 이면, `50.0 / 100.0 == 0.5` 이므로
복제본 수를 반으로 줄일 것이다. 비율이 1.0(0.1을 기본값으로 사용하는
`-horizontal-pod-autoscaler-tolerance` 플래그를 사용하여
전역적으로 구성 가능한 허용 오차 내)에 충분히 가깝다면 스케일링을 건너 뛸 것이다.

`targetAverageValue` 또는 `targetAverageUtilization`가 지정되면,
`currentMetricValue`는 HorizontalPodAutoscaler의 스케일 목표
안에 있는 모든 파드에서 주어진 메트릭의 평균을 취하여 계산된다.
허용치를 확인하고 최종 값을 결정하기 전에, 파드
준비 상태와 누락된 메트릭을 고려한다.

삭제 타임 스탬프가 설정된 모든 파드(즉, 종료
중인 파드) 및 실패한 파드는 모두 폐기된다.

특정 파드에 메트릭이 누락된 경우, 나중을 위해 처리를 미뤄두는데, 이와
같이 누락된 메트릭이 있는 모든 파드는 최종 스케일 량을 조정하는데 사용된다.

CPU를 스케일할 때, 어떤 파드라도 아직 준비가 안되었거나 (즉, 여전히
초기화 중인 경우) * 또는 * 파드의 최신 메트릭 포인트가 준비되기
전이라면, 마찬가지로 해당 파드는 나중에 처리된다.

기술적 제약으로 인해, HorizontalPodAutoscaler 컨트롤러는
 특정 CPU 메트릭을 나중에 사용할지 말지 결정할 때, 파드가 준비되는
시작 시간을 정확하게 알 수 없다. 대신, 파드가 아직 준비되지
않았고 시작 이후 짧은 시간 내에 파드가 준비되지 않은 상태로
전환된다면, 해당 파드를 "아직 준비되지 않음(not yet ready)"으로 간주한다.
이 값은 `--horizontal-pod-autoscaler-initial-readiness-delay` 플래그로 설정되며, 기본값은 30초
이다. 일단 파드가 준비되고 시작된 후 구성 가능한 시간 이내이면,
준비를 위한 어떠한 전환이라도 이를 시작 시간으로 간주한다. 이
값은 `--horizontal-pod-autoscaler-cpu-initialization-period` 플래그로 설정되며
기본값은 5분이다.

`현재 메트릭 값 / 원하는 메트릭 값` 기본 스케일 비율은 나중에
사용하기로 되어 있거나 위에서 폐기되지 않은 남아있는 파드를 사용하여 계산된다.

누락된 메트릭이 있는 경우, 파드가 스케일 다운의 경우
원하는 값의 100%를 소비하고 스케일 업의 경우 0%를 소비한다고
가정하여 평균을 보다 보수적으로 재계산한다. 이것은 잠재적인
스케일의 크기를 약화시킨다.

또한 아직-준비되지-않은 파드가 있는 경우 누락된 메트릭이나
아직-준비되지-않은 파드를 고려하지 않고 스케일 업했을 경우,
아직-준비되지-않은 파드가 원하는 메트릭의 0%를 소비한다고
보수적으로 가정하고 스케일 확장의 크기를 약화시킨다.

아직-준비되지-않은 파드나 누락된 메트릭을 고려한 후에 사용
비율을 다시 계산한다. 새 비율이 스케일 방향을
바꾸거나, 허용 오차 내에 있으면 스케일링을 건너뛴다. 그렇지 않으면, 새
비율을 사용하여 스케일한다.

평균 사용량에 대한 *원래* 값은 새로운 사용 비율이 사용되는
경우에도 아직-준비되지-않은 파드 또는 누락된 메트릭에 대한
고려없이 HorizontalPodAutoscaler 상태를 통해 다시
보고된다.

HorizontalPodAutoscaler에 여러 메트릭이 지정된 경우, 이 계산은
각 메트릭에 대해 수행된 다음 원하는 레플리카 수 중 가장
큰 값이 선택된다. 이러한 메트릭 중 어떠한 것도 원하는
레플리카 수로 변환할 수 없는 경우(예 : 메트릭 API에서 메트릭을
가져오는 중 오류 발생) 스케일을 건너뛴다.
이는 하나 이상의 메트릭이
현재 값보다 높은 `desiredReplicas` 을 제공하는 경우
HPA가 여전히 확장할 수 있음을 의미한다.

마지막으로, HPA가 목표를 스케일하기 직전에 스케일 권장 사항이
기록된다. 컨트롤러는 구성 가능한 창(window) 내에서 가장 높은 권장
사항을 선택하도록 해당 창 내의 모든 권장 사항을 고려한다. 이 값은 `--horizontal-pod-autoscaler-downscale-stabilization` 플래그를  사용하여 설정할 수 있고, 기본값은 5분이다.
즉, 스케일 다운이 점진적으로 발생하여 급격히 변동하는 메트릭 값의
영향을 완만하게 한다.

## API 오브젝트

Horizontal Pod Autoscaler는 쿠버네티스 `autoscaling` API 그룹의 API 리소스이다.
CPU에 대한 오토스케일링 지원만 포함하는 안정된 버전은
`autoscaling/v1` API 버전에서 찾을 수 있다.

메모리 및 사용자 정의 메트릭에 대한 스케일링 지원을 포함하는 베타 버전은
`autoscaling/v2beta2`에서 확인할 수 있다. `autoscaling/v2beta2`에서 소개된
새로운 필드는 `autoscaling/v1`로 작업할 때 어노테이션으로 보존된다.

HorizontalPodAutoscaler API 오브젝트 생성시 지정된 이름이 유효한
[DNS 서브도메인 이름](/ko/docs/concepts/overview/working-with-objects/names/#dns-서브도메인-이름)인지 확인해야 한다.
API 오브젝트에 대한 자세한 내용은
[HorizontalPodAutoscaler 오브젝트](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#horizontalpodautoscaler-v1-autoscaling)에서 찾을 수 있다.

## kubectl에서 Horizontal Pod Autoscaler 지원

Horizontal Pod Autoscaler는 모든 API 리소스와 마찬가지로 `kubectl`에 의해 표준 방식으로 지원된다.
`kubectl create` 커맨드를 사용하여 새로운 오토스케일러를 만들 수 있다.
`kubectl get hpa`로 오토스케일러 목록을 조회할 수 있고, `kubectl describe hpa`로 세부 사항을 확인할 수 있다.
마지막으로 `kubectl delete hpa`를 사용하여 오토스케일러를 삭제할 수 있다.

또한 Horizontal Pod Autoscaler를 생성할 수 있는 `kubectl autoscale`이라는 특별한 명령이 있다.
예를 들어 `kubectl autoscale rs foo --min=2 --max=5 --cpu-percent=80`을
실행하면 레플리케이션 셋 *foo* 에 대한 오토스케일러가 생성되고, 목표 CPU 사용률은 `80 %`,
그리고 2와 5 사이의 레플리카 개수로 설정된다.
`kubectl autoscale`에 대한 자세한 문서는 [여기](/docs/reference/generated/kubectl/kubectl-commands/#autoscale)에서 찾을 수 있다.


## 롤링 업데이트 중 오토스케일링

현재 쿠버네티스에서는 기본 레플리카셋를 관리하는 디플로이먼트 오브젝트를 사용하여 롤링 업데이트를 수행할 수 있다.
Horizontal Pod Autoscaler는 후자의 방법을 지원한다. Horizontal Pod Autoscaler는 디플로이먼트 오브젝트에 바인딩되고,
디플로이먼트 오브젝트를 위한 크기를 설정하며, 디플로이먼트는 기본 레플리카셋의 크기를 결정한다.

Horizontal Pod Autoscaler는 레플리케이션 컨트롤러를 직접 조작하는 롤링 업데이트에서 작동하지 않는다.
즉, Horizontal Pod Autoscaler를 레플리케이션 컨트롤러에 바인딩하고 롤링 업데이트를 수행할 수 없다. (예 : `kubectl rolling-update`)
작동하지 않는 이유는 롤링 업데이트에서 새 레플리케이션 컨트롤러를 만들 때,
Horizontal Pod Autoscaler가 새 레플리케이션 컨트롤러에 바인딩되지 않기 때문이다.

## 쿨-다운 / 지연에 대한 지원

Horizontal Pod Autoscaler를 사용하여 레플리카 그룹의 스케일을 관리할 때,
평가된 메트릭의 동적인 특징 때문에 레플리카 수가
자주 변동할 수 있다. 이것은 때로는 *스래싱 (thrashing)* 이라고도 한다.

v1.6 부터 클러스터 운영자는 `kube-controller-manager` 컴포넌트의 플래그로
노출된 글로벌 HPA 설정을 튜닝하여 이 문제를 완화할 수 있다.

v1.12부터는 새로운 알고리즘 업데이트가 업스케일 지연에 대한
필요성을 제거하였다.

- `--horizontal-pod-autoscaler-downscale-delay` : 다운스케일이
  안정화되기까지의 시간 간격을 지정한다.
  Horizontal Pod Autoscaler는 이전의 권장하는 크기를 기억하고,
  이 시간 간격에서의 가장 큰 크기에서만 작동한다.
  기본값은 5분(`5m0s`)이다.

{{< note >}}
이러한 파라미터 값을 조정할 때 클러스터 운영자는 가능한 결과를 알아야
한다. 지연(쿨-다운) 값이 너무 길면, Horizontal Pod Autoscaler가
워크로드 변경에 반응하지 않는다는 불만이 있을 수 있다. 그러나 지연 값을
너무 짧게 설정하면, 레플리카셋의 크기가 평소와 같이 계속 스래싱될 수
있다.
{{< /note >}}

## 리소스 메트릭 지원

모든 HPA 대상은 스케일링 대상에서 파드의 리소스 사용량을 기준으로 스케일링할 수 있다.
파드의 명세를 정의할 때는 `cpu` 및 `memory` 와 같은 리소스 요청을
지정해야 한다. 이것은 리소스 사용률을 결정하는 데 사용되며 HPA 컨트롤러에서 대상을
스케일링하거나 축소하는 데 사용한다. 리소스 사용률 기반 스케일링을 사용하려면 다음과 같은 메트릭 소스를
지정해야 한다.

```yaml
type: Resource
resource:
  name: cpu
  target:
    type: Utilization
    averageUtilization: 60
```
이 메트릭을 사용하면 HPA 컨트롤러는 스케일링 대상에서 파드의 평균 사용률을
60%로 유지한다. 사용률은 파드의 요청된 리소스에 대한 현재 리소스 사용량 간의
비율이다. 사용률 계산 및 평균 산출 방법에 대한 자세한 내용은 [알고리즘](#알고리즘-세부-정보)을
참조한다.

{{< note >}}
모든 컨테이너의 리소스 사용량이 합산되므로 총 파드 사용량이 개별 컨테이너 리소스 사용량을
정확하게 나타내지 못할 수 있다. 이로 인해 단일 컨테이너가
높은 사용량으로 실행될 수 있고 전체 파드 사용량이 여전히 허용 가능한 한도 내에 있기 때문에 HPA가 스케일링되지 않는
상황이 발생할 수 있다.
{{< /note >}}

### 컨테이너 리소스 메트릭

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}

`HorizontalPodAutoscaler` 는 대상 리소스를 스케일링하기 위해 HPA가 파드 집합에서 개별 컨테이너의
리소스 사용량을 추적할 수 있는 컨테이너 메트릭 소스도 지원한다.
이를 통해 특정 파드에서 가장 중요한 컨테이너의 스케일링 임계값을 구성할 수 있다.
예를 들어 웹 애플리케이션 프로그램과 로깅 사이드카가 있는 경우 사이드카 컨테이너와 해당 리소스 사용을 무시하고
웹 애플리케이션의 리소스 사용을 기준으로 스케일링할 수 있다.

대상 리소스를 다른 컨테이너 세트를 사용하여 새 파드 명세를 갖도록 수정하는 경우
새로 추가된 컨테이너도 스케일링에 사용해야 한다면 HPA 사양을 수정해야 한다.
메트릭 소스에 지정된 컨테이너가 없거나 파드의 하위 집합에만 있는 경우
해당 파드는 무시되고 권장 사항이 다시 계산된다. 계산에 대한 자세한 내용은 [알고리즘](#알고리즘-세부-정보)을
을 참조한다. 컨테이너 리소스를 오토스케일링에 사용하려면 다음과 같이
메트릭 소스를 정의한다.
```yaml
type: ContainerResource
containerResource:
  name: cpu
  container: application
  target:
    type: Utilization
    averageUtilization: 60
```

위의 예에서 HPA 컨트롤러는 모든 파드의 `application` 컨테이너에 있는 CPU의 평균 사용률이
60%가 되도록 대상을 조정한다.

{{< note >}}
HorizontalPodAutoscaler가 추적하는 컨테이너의 이름을 변경하는 경우
특정 순서로 변경을 수행하여 변경 사항이 적용되는 동안 스케일링을 계속 사용할 수 있고
효율적으로 유지할 수 있다. 컨테이너를 정의하는 리소스(예: 배포)를
업데이트하기 전에 연결된 HPA를 업데이트하여 새 컨테이너 이름과 이전 컨테이너 이름을
모두 추적해야 한다. 이러한 방식으로 HPA는 업데이트 프로세스 전반에 걸쳐 스케일링 권장 사항을
계산할 수 있다.

컨테이너 이름 변경을 워크로드 리소스로 롤아웃한 후에는 HPA 사양에서
이전 컨테이너 이름을 제거하여 정리한다.
{{< /note >}}

## 멀티 메트릭을 위한 지원

Kubernetes 1.6은 멀티 메트릭을 기반으로 스케일링을 지원한다. `autoscaling/v2beta2` API
버전을 사용하여 Horizontal Pod Autoscaler가 스케일을 조정할 멀티 메트릭을 지정할 수 있다. 그런 다음 Horizontal Pod
Autoscaler 컨트롤러가 각 메트릭을 평가하고, 해당 메트릭을 기반으로 새 스케일을 제안한다.
제안된 스케일 중 가장 큰 것이 새로운 스케일로 사용된다.

## 사용자 정의 메트릭을 위한 지원

{{< note >}}
쿠버네티스 1.2는 특수 어노테이션을 사용하여 애플리케이션 관련 메트릭을 기반으로 하는 스케일의 알파 지원을 추가했다.
쿠버네티스 1.6에서는 이러한 어노테이션 지원이 제거되고 새로운 오토스케일링 API가 추가되었다. 이전 사용자 정의
메트릭 수집 방법을 계속 사용할 수는 있지만, Horizontal Pod Autoscaler에서는 이 메트릭을 사용할 수 없다. 그리고
Horizontal Pod Autoscaler 컨트롤러에서는 더 이상 스케일 할 사용자 정의 메트릭을 지정하는 이전 어노테이션을 사용할 수 없다.
{{< /note >}}

쿠버네티스 1.6에서는 Horizontal Pod Autoscaler에서 사용자 정의 메트릭을 사용할 수 있도록 지원한다.
`autoscaling/v2beta2` API에서 사용할 Horizontal Pod Autoscaler에 대한 사용자 정의 메트릭을 추가 할 수 있다.
그리고 쿠버네티스는 새 사용자 정의 메트릭 API에 질의하여 적절한 사용자 정의 메트릭의 값을 가져온다.

요구 사항은 [메트릭을 위한 지원](#메트릭-API를-위한-지원)을 참조한다.

## 메트릭 API를 위한 지원

기본적으로 HorizontalPodAutoscaler 컨트롤러는 일련의 API에서 메트릭을 검색한다. 이러한
API에 접속하려면 클러스터 관리자는 다음을 확인해야 한다.

* [API 애그리게이션 레이어](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) 활성화

* 해당 API 등록:

   * 리소스 메트릭의 경우, 일반적으로 이것은 [메트릭-서버](https://github.com/kubernetes-sigs/metrics-server)가 제공하는 `metrics.k8s.io` API이다.
     클러스터 애드온으로 시작할 수 있다.

   * 사용자 정의 메트릭의 경우, 이것은 `custom.metrics.k8s.io` API이다. 메트릭 솔루션 공급 업체에서 제공하는 "어댑터" API 서버에서 제공한다.
     메트릭 파이프라인 또는 [알려진 솔루션 목록](https://github.com/kubernetes/metrics/blob/master/IMPLEMENTATIONS.md#custom-metrics-api)으로 확인한다.
     직접 작성하고 싶다면 [샘플](https://github.com/kubernetes-sigs/custom-metrics-apiserver)을 확인한다.

   * 외부 메트릭의 경우, 이것은 `external.metrics.k8s.io` API이다. 위에 제공된 사용자 정의 메트릭 어댑터에서 제공될 수 있다.

* `--horizontal-pod-autoscaler-use-rest-clients`는 `true`이거나 설정되지 않음. 이것을 false로 설정하면 더 이상 사용되지 않는 힙스터 기반 오토스케일링으로 전환된다.

이런 다양한 메트릭 경로와 각각의 다른 점에 대한 상세 내용은 관련 디자인 제안서인
[HPA V2](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/autoscaling/hpa-v2.md),
[custom.metrics.k8s.io](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/custom-metrics-api.md),
[external.metrics.k8s.io](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/external-metrics-api.md)를 참조한다.

어떻게 사용하는지에 대한 예시는 [커스텀 메트릭 사용하는 작업 과정](/ko/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#다양한-메트릭-및-사용자-정의-메트릭을-기초로한-오토스케일링)과
[외부 메트릭스 사용하는 작업 과정](/ko/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#쿠버네티스-오브젝트와-관련이-없는-메트릭을-기초로한-오토스케일링)을 참조한다.

## 구성가능한 스케일링 동작 지원

[v1.18](https://github.com/kubernetes/enhancements/blob/master/keps/sig-autoscaling/20190307-configurable-scale-velocity-for-hpa.md)
부터 `v2beta2` API는 HPA `behavior` 필드를 통해
스케일링 동작을 구성할 수 있다.
동작은 `behavior` 필드 아래의 `scaleUp` 또는 `scaleDown`
섹션에서 스케일링 업과 다운을 위해 별도로 지정된다. 안정화 윈도우는
스케일링 대상에서 레플리카 수의 플래핑(flapping)을 방지하는
양방향에 대해 지정할 수 있다. 마찬가지로 스케일링 정책을 지정하면
스케일링 중 레플리카 변경 속도를 제어할 수 있다.

### 스케일링 정책

스펙의 `behavior` 섹션에 하나 이상의 스케일링 폴리시를 지정할 수 있다.
폴리시가 여러 개 지정된 경우 가장 많은 양의 변경을
허용하는 정책이 기본적으로 선택된 폴리시이다. 다음 예시는 스케일 다운 중 이
동작을 보여준다.

```yaml
behavior:
  scaleDown:
    policies:
    - type: Pods
      value: 4
      periodSeconds: 60
    - type: Percent
      value: 10
      periodSeconds: 60
```

`periodSeconds` 는 폴리시가 참(true)으로 유지되어야 하는 기간을 나타낸다.
첫 번째 정책은 _(파드들)_ 이 1분 내에 최대 4개의 레플리카를 스케일 다운할 수 있도록 허용한다.
두 번째 정책은 _비율_ 로 현재 레플리카의 최대 10%를 1분 내에 스케일 다운할 수 있도록 허용한다.

기본적으로 가장 많은 변경을 허용하는 정책이 선택되기에 두 번째 정책은
파드의 레플리카 수가 40개를 초과하는 경우에만 사용된다. 레플리카가 40개 이하인 경우 첫 번째 정책이 적용된다.
예를 들어 80개의 레플리카가 있고 대상을 10개의 레플리카로 축소해야 하는
경우 첫 번째 단계에서 8개의 레플리카가 스케일 다운 된다. 레플리카의 수가 72개일 때
다음 반복에서 파드의 10%는 7.2 이지만, 숫자는 8로 올림된다. 오토스케일러 컨트롤러의
각 루프에서 변경될 파드의 수는 현재 레플리카의 수에 따라 재계산된다. 레플리카의 수가 40
미만으로 떨어지면 첫 번째 폴리시 _(파드들)_ 가 적용되고 한번에
4개의 레플리카가 줄어든다.

확장 방향에 대해 `selectPolicy` 필드를 확인하여 폴리시 선택을 변경할 수 있다.
레플리카의 수를 최소로 변경할 수 있는 폴리시를 선택하는 `최소(Min)`로 값을 설정한다.
값을 `Disabled` 로 설정하면 해당 방향으로 스케일링이 완전히
비활성화 된다.

### 안정화 윈도우

안정화 윈도우는 스케일링에 사용되는 메트릭이 계속 변동할 때 레플리카의 플래핑을
다시 제한하기 위해 사용된다. 안정화 윈도우는 스케일링을 방지하기 위해 과거부터
계산된 의도한 상태를 고려하는 오토스케일링 알고리즘에 의해 사용된다.
다음의 예시에서 `scaleDown` 에 대해 안정화 윈도우가 지정되어있다.

```yaml
scaleDown:
  stabilizationWindowSeconds: 300
```

메트릭이 대상을 축소해야하는 것을 나타내는 경우 알고리즘은
이전에 계산된 의도한 상태를 살펴보고 지정된 간격의 최고 값을 사용한다.
위의 예시에서 지난 5분 동안 모든 의도한 상태가 고려된다.

### 기본 동작

사용자 지정 스케일링을 사용하려면 일부 필드를 지정해야 한다. 사용자 정의해야
하는 값만 지정할 수 있다. 이러한 사용자 지정 값은 기본값과 병합된다. 기본값은 HPA
알고리즘의 기존 동작과 일치한다.

```yaml
behavior:
  scaleDown:
    stabilizationWindowSeconds: 300
    policies:
    - type: Percent
      value: 100
      periodSeconds: 15
  scaleUp:
    stabilizationWindowSeconds: 0
    policies:
    - type: Percent
      value: 100
      periodSeconds: 15
    - type: Pods
      value: 4
      periodSeconds: 15
    selectPolicy: Max
```
안정화 윈도우의 스케일링 다운의 경우 _300_ 초 (또는 제공된
경우`--horizontal-pod-autoscaler-downscale-stabilization` 플래그의 값)이다. 스케일링 다운에서는 현재
실행 중인 레플리카의 100%를 제거할 수 있는 단일 정책만 있으며, 이는 스케일링
대상을 최소 허용 레플리카로 축소할 수 있음을 의미한다.
스케일링 업에는 안정화 윈도우가 없다. 메트릭이 대상을 스케일 업해야 한다고 표시된다면 대상이 즉시 스케일 업된다.
두 가지 폴리시가 있다. HPA가 정상 상태에 도달 할 때까지 15초 마다
4개의 파드 또는 현재 실행 중인 레플리카의 100% 가 추가된다.

### 예시: 다운스케일 안정화 윈도우 변경

사용자 지정 다운스케일 안정화 윈도우를 1분 동안 제공하기 위해
다음 동작이 HPA에 추가된다.

```yaml
behavior:
  scaleDown:
    stabilizationWindowSeconds: 60
```

### 예시: 스케일 다운 비율 제한

HPA에 의해 파드가 제거되는 속도를 분당 10%로 제한하기 위해
다음 동작이 HPA에 추가된다.

```yaml
behavior:
  scaleDown:
    policies:
    - type: Percent
      value: 10
      periodSeconds: 60
```

마지막으로 5개의 파드를 드롭하기 위해 다른 폴리시를 추가하고, 최소 선택
전략을 추가할 수 있다.
분당 5개 이하의 파드가 제거되지 않도록, 고정 크기가 5인 두 번째 축소
정책을 추가하고, `selectPolicy` 를 최소로 설정하면 된다. `selectPolicy` 를 `Min` 으로 설정하면
자동 스케일러가 가장 적은 수의 파드에 영향을 주는 정책을 선택함을 의미한다.

```yaml
behavior:
  scaleDown:
    policies:
    - type: Percent
      value: 10
      periodSeconds: 60
    - type: Pods
      value: 5
      periodSeconds: 60
    selectPolicy: Min
```

### 예시: 스케일 다운 비활성화

`selectPolicy` 의 `Disabled` 값은 주어진 방향으로의 스케일링을 끈다.
따라서 다운 스케일링을 방지하기 위해 다음 폴리시가 사용된다.

```yaml
behavior:
  scaleDown:
    selectPolicy: Disabled
```

## 암시적 유지 관리 모드 비활성화

HPA 구성 자체를 변경할 필요없이 대상에 대한
HPA를 암시적으로 비활성화할 수 있다. 대상의 의도한
레플리카 수가 0으로 설정되고, HPA의 최소 레플리카 수가 0 보다 크면, 대상의
의도한 레플리카 수 또는 HPA의 최소 레플리카 수를 수동으로 조정하여
다시 활성화할 때까지 HPA는 대상 조정을
중지한다(그리고 `ScalingActive` 조건 자체를 `false`로 설정).

## {{% heading "whatsnext" %}}


* 디자인 문서: [Horizontal Pod Autoscaling](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md).
* kubectl 오토스케일 커맨드: [kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands/#autoscale).
* [Horizontal Pod Autoscaler](/ko/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)의 사용 예제.
