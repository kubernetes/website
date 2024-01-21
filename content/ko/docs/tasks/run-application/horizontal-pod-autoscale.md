---
# reviewers:
# - fgrzadkowski
# - jszczepkowski
# - directxman12
title: Horizontal Pod Autoscaling
feature:
  title: Horizontal 스케일링
  description: >
    간단한 명령어나 UI를 통해서 또는 CPU 사용량에 따라 자동으로 애플리케이션의 스케일을 업 또는 다운한다.
content_type: concept
weight: 90
---

<!-- overview -->

쿠버네티스에서, _HorizontalPodAutoscaler_ 는 워크로드 리소스(예:
{{< glossary_tooltip text="디플로이먼트" term_id="deployment" >}} 또는
{{< glossary_tooltip text="스테이트풀셋" term_id="statefulset" >}})를 자동으로 업데이트하며,
워크로드의 크기를 수요에 맞게 자동으로 스케일링하는 것을 목표로 한다.

수평 스케일링은 부하 증가에 대해
{{< glossary_tooltip text="파드" term_id="pod" >}}를 더 배치하는 것을 뜻한다.
이는 _수직_ 스케일링(쿠버네티스에서는,
해당 워크로드를 위해 이미 실행 중인 파드에
더 많은 자원(예: 메모리 또는 CPU)를 할당하는 것)과는 다르다.

부하량이 줄어들고, 파드의 수가 최소 설정값 이상인 경우,
HorizontalPodAutoscaler는 워크로드 리소스(디플로이먼트, 스테이트풀셋,
또는 다른 비슷한 리소스)에게 스케일 다운을 지시한다.

Horizontal Pod Autoscaling은 크기 조절이 불가능한 오브젝트(예:
{{< glossary_tooltip text="데몬셋" term_id="daemonset" >}})에는 적용할 수 없다.

HorizontalPodAutoscaler는 쿠버네티스 API 자원 및
{{< glossary_tooltip text="컨트롤러" term_id="controller" >}} 형태로 구현되어 있다.
HorizontalPodAutoscaler API 자원은 컨트롤러의 행동을 결정한다.
쿠버네티스 {{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}}
내에서 실행되는 HPA 컨트롤러는 평균 CPU 사용률, 평균 메모리 사용률,
또는 다른 커스텀 메트릭 등의 관측된 메트릭을 목표에 맞추기 위해
목표물(예: 디플로이먼트)의 적정 크기를 주기적으로 조정한다.

Horizontal Pod Autoscaling을 활용하는
[연습 예제](/ko/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)가 존재한다.

<!-- body -->

## HorizontalPodAutoscaler는 어떻게 작동하는가?

{{< mermaid >}}
graph BT

hpa[Horizontal Pod Autoscaler] --> scale[Scale]

subgraph rc[RC / Deployment]
    scale
end

scale -.-> pod1[Pod 1]
scale -.-> pod2[Pod 2]
scale -.-> pod3[Pod N]

classDef hpa fill:#D5A6BD,stroke:#1E1E1D,stroke-width:1px,color:#1E1E1D;
classDef rc fill:#F9CB9C,stroke:#1E1E1D,stroke-width:1px,color:#1E1E1D;
classDef scale fill:#B6D7A8,stroke:#1E1E1D,stroke-width:1px,color:#1E1E1D;
classDef pod fill:#9FC5E8,stroke:#1E1E1D,stroke-width:1px,color:#1E1E1D;
class hpa hpa;
class rc rc;
class scale scale;
class pod1,pod2,pod3 pod
{{< /mermaid >}}

그림 1. HorizontalPodAutoscaler는 디플로이먼트 및 디플로이먼트의 레플리카셋의 크기를 조정한다.

쿠버네티스는 Horizontal Pod Autoscaling을
간헐적으로(intermittently) 실행되는
컨트롤 루프 형태로 구현했다(지속적인 프로세스가 아니다).
실행 주기는 [`kube-controller-manager`](/docs/reference/command-line-tools-reference/kube-controller-manager/)의
`--horizontal-pod-autoscaler-sync-period` 파라미터에 의해 설정된다(기본 주기는 15초이다).

각 주기마다, 컨트롤러 매니저는 각 HorizontalPodAutoscaler 정의에 지정된 메트릭에 대해 리소스 사용률을 질의한다.
컨트롤러 매니저는 `scaleTargetRef`에 의해 정의된 타겟 리소스를 찾고 나서,
타겟 리소스의 `.spec.selector` 레이블을 보고 파드를 선택하며,
리소스 메트릭 API(파드 단위 리소스 메트릭 용) 또는
커스텀 메트릭 API(그 외 모든 메트릭 용)로부터 메트릭을 수집한다.

* 파드 단위 리소스 메트릭(예 : CPU)의 경우 컨트롤러는 HorizontalPodAutoscaler가
  대상으로하는 각 파드에 대한 리소스 메트릭 API에서 메트릭을 가져온다.
  그런 다음, 목표 사용률 값이 설정되면, 컨트롤러는 각 파드의
  컨테이너에 대한 동등한 [자원 요청](/ko/docs/concepts/configuration/manage-resources-containers/#요청-및-제한)을
  퍼센트 단위로 하여 사용률 값을
  계산한다. 대상 원시 값이 설정된 경우 원시 메트릭 값이 직접 사용된다.
  그리고, 컨트롤러는 모든 대상 파드에서 사용된 사용률의 평균 또는 원시 값(지정된
  대상 유형에 따라 다름)을 가져와서 원하는 레플리카의 개수를 스케일하는데
  사용되는 비율을 생성한다.

  파드의 컨테이너 중 일부에 적절한 리소스 요청이 설정되지 않은 경우,
  파드의 CPU 사용률은 정의되지 않으며, 따라서 오토스케일러는
  해당 메트릭에 대해 아무런 조치도 취하지 않는다. 오토스케일링
  알고리즘의 작동 방식에 대한 자세한 내용은 아래 [알고리즘 세부 정보](#알고리즘-세부-정보) 섹션을 참조하기 바란다.

* 파드 단위 사용자 정의 메트릭의 경우, 컨트롤러는 사용률 값이 아닌 원시 값을 사용한다는 점을
  제외하고는 파드 단위 리소스 메트릭과 유사하게 작동한다.

* 오브젝트 메트릭 및 외부 메트릭의 경우, 문제의 오브젝트를 표현하는
  단일 메트릭을 가져온다. 이 메트릭은 목표 값과
  비교되어 위와 같은 비율을 생성한다. `autoscaling/v2` API
  버전에서는, 비교가 이루어지기 전에 해당 값을 파드의 개수로
  선택적으로 나눌 수 있다.

HorizontalPodAutoscaler를 사용하는 일반적인 방법은
{{< glossary_tooltip text="집약된 API" term_id="aggregation-layer" >}}(`metrics.k8s.io`,
`custom.metrics.k8s.io`, 또는 `external.metrics.k8s.io`)로부터 메트릭을 가져오도록 설정하는 것이다.
`metrics.k8s.io` API는 보통 메트릭 서버(Metrics Server)라는 애드온에 의해 제공되며,
Metrics Server는 별도로 실행해야 한다. 자원 메트릭에 대한 추가 정보는
[Metrics Server](/ko/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/#metrics-server)를 참고한다.

[메트릭 API를 위한 지원](#메트릭-api를-위한-지원)에서 위의 API들에 대한 안정성 보장 및 지원 상태를
확인할 수 있다.

HorizontalPodAutoscaler 컨트롤러는 스케일링을 지원하는 상응하는
워크로드 리소스(예: 디플로이먼트 및 스테이트풀셋)에 접근한다.
이들 리소스 각각은 `scale`이라는 하위 리소스를 갖고 있으며,
이 하위 리소스는 레플리카의 수를 동적으로 설정하고 각각의 현재 상태를 확인할 수 있도록 하는 인터페이스이다.
쿠버네티스 API의 하위 리소스에 대한 일반적인 정보는 [쿠버네티스 API 개념](/docs/reference/using-api/api-concepts/)에서 확인할 수 있다.

### 알고리즘 세부 정보

가장 기본적인 관점에서, HorizontalPodAutoscaler 컨트롤러는
원하는(desired) 메트릭 값과 현재(current) 메트릭 값 사이의 비율로
작동한다.

```
원하는 레플리카 수 = ceil[현재 레플리카 수 * ( 현재 메트릭 값 / 원하는 메트릭 값 )]
```

예를 들어 현재 메트릭 값이 `200m`이고 원하는 값이
`100m`인 경우 `200.0 / 100.0 == 2.0`이므로 복제본 수가 두 배가
된다. 만약 현재 값이 `50m` 이면, `50.0 / 100.0 == 0.5` 이므로
복제본 수를 반으로 줄일 것이다. 컨트롤 플레인은 비율이 1.0(기본값이 0.1인
`-horizontal-pod-autoscaler-tolerance` 플래그를 사용하여
전역적으로 구성 가능한 허용 오차 내)에 충분히 가깝다면 스케일링을 건너 뛸 것이다.

`targetAverageValue` 또는 `targetAverageUtilization`가 지정되면,
`currentMetricValue`는 HorizontalPodAutoscaler의 스케일 목표
안에 있는 모든 파드에서 주어진 메트릭의 평균을 취하여 계산된다.

허용치를 확인하고 최종 값을 결정하기 전에,
컨트롤 플레인은 누락된 메트릭이 있는지,
그리고 몇 개의 파드가 [`Ready`](/ko/docs/concepts/workloads/pods/pod-lifecycle/#파드의-조건)인지도 고려한다.
삭제 타임스탬프가 설정된 모든 파드(파드에 삭제 타임스탬프가 있으면
셧다운/삭제 중임을 뜻한다)는 무시되며, 모든 실패한 파드는
버려진다.

특정 파드에 메트릭이 누락된 경우, 나중을 위해 처리를 미뤄두는데, 이와
같이 누락된 메트릭이 있는 모든 파드는 최종 스케일 량을 조정하는데 사용된다.

CPU를 스케일할 때, 파드가 아직 Ready되지 않았거나(여전히
초기화중이거나, unhealthy하여서) *또는* 파드의 최신 메트릭 포인트가 준비되기
전이라면, 마찬가지로 해당 파드는 나중에 처리된다.

기술적 제약으로 인해, HorizontalPodAutoscaler 컨트롤러는
특정 CPU 메트릭을 나중에 사용할지 말지 결정할 때, 파드가 준비되는
시작 시간을 정확하게 알 수 없다. 대신, 파드가 아직 준비되지
않았고 시작 이후 짧은 시간 내에 파드가 준비 상태로
전환된다면, 해당 파드를 "아직 준비되지 않음(not yet ready)"으로 간주한다.
이 값은 `--horizontal-pod-autoscaler-initial-readiness-delay` 플래그로 설정되며, 기본값은 30초
이다. 일단 파드가 준비되고 시작된 후 구성 가능한 시간 이내이면,
준비를 위한 어떠한 전환이라도 이를 시작 시간으로 간주한다. 이
값은 `--horizontal-pod-autoscaler-cpu-initialization-period` 플래그로 설정되며
기본값은 5분이다.

`현재 메트릭 값 / 원하는 메트릭 값` 기본 스케일 비율은 나중에
사용하기로 되어 있거나 위에서 폐기되지 않은 남아있는 파드를 사용하여 계산된다.

누락된 메트릭이 있는 경우, 컨트롤 플레인은 파드가 스케일 다운의 경우
원하는 값의 100%를 소비하고 스케일 업의 경우 0%를 소비한다고
가정하여 평균을 보다 보수적으로 재계산한다. 이것은 잠재적인
스케일의 크기를 약화시킨다.

또한, 아직-준비되지-않은 파드가 있고, 누락된 메트릭이나
아직-준비되지-않은 파드가 고려되지 않고 워크로드가 스케일업 된 경우,
컨트롤러는 아직-준비되지-않은 파드가 원하는 메트릭의 0%를 소비한다고
보수적으로 가정하고 스케일 확장의 크기를 약화시킨다.

아직-준비되지-않은 파드나 누락된 메트릭을 고려한 후에,
컨트롤러가 사용률을 다시 계산한다.
새로 계산한 사용률이 스케일 방향을 바꾸거나, 허용 오차 내에 있으면,
컨트롤러가 스케일링을 건너뛴다.
그렇지 않으면, 새로 계산한 사용률를 이용하여 파드 수 변경 결정을 내린다.

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

Horizontal Pod Autoscaler는
쿠버네티스 `autoscaling` API 그룹의 API 리소스이다.
현재의 안정 버전은 `autoscaling/v2` API 버전이며,
메모리와 커스텀 메트릭에 대한 스케일링을 지원한다.
`autoscaling/v2`에서 추가된 새로운 필드는 `autoscaling/v1`를 이용할 때에는
어노테이션으로 보존된다.

HorizontalPodAutoscaler API 오브젝트 생성시 지정된 이름이 유효한
[DNS 서브도메인 이름](/ko/docs/concepts/overview/working-with-objects/names/#dns-서브도메인-이름)인지 확인해야 한다.
API 오브젝트에 대한 자세한 내용은
[HorizontalPodAutoscaler 오브젝트](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#horizontalpodautoscaler-v2-autoscaling)에서 찾을 수 있다.

## 워크로드 스케일링의 안정성 {#flapping}

HorizontalPodAutoscaler를 사용하여 레플리카 그룹의 크기를 관리할 때,
측정하는 메트릭의 동적 특성 때문에 레플리카 수가 계속 자주 요동칠 수 있다.
이는 종종 *thrashing* 또는 *flapping*이라고 불린다.
이는 사이버네틱스 분야의 *이력 현상(hysteresis)* 개념과 비슷하다.



## 롤링 업데이트 중 오토스케일링

쿠버네티스는 디플로이먼트에 대한 롤링 업데이트를 지원한다.
이 경우, 디플로이먼트가 기저 레플리카셋을 알아서 관리한다.
디플로이먼트에 오토스케일링을 설정하려면,
각 디플로이먼트에 대한 HorizontalPodAutoscaler를 생성한다.
HorizontalPodAutoscaler는 디플로이먼트의 `replicas` 필드를 관리한다.
디플로이먼트 컨트롤러는 기저 레플리카셋에 `replicas` 값을 적용하여
롤아웃 과정 중/이후에 적절한 숫자까지 늘어나도록 한다.

오토스케일된 레플리카가 있는 스테이트풀셋의 롤링 업데이트를 수행하면,
스테이트풀셋이 직접 파드의 숫자를 관리한다(즉,
레플리카셋과 같은 중간 리소스가 없다).

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

HorizontalPodAutoscaler API는 대상 리소스를 스케일링하기 위해 HPA가 파드 집합에서 개별 컨테이너의
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


## 사용자 정의 메트릭을 이용하는 스케일링

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

(이전에는 `autoscaling/v2beta2` API 버전이 이 기능을 베타 기능으로 제공했었다.)

`autoscaling/v2beta2` API 버전을 사용하는 경우,
(쿠버네티스 또는 어느 쿠버네티스 구성 요소에도 포함되어 있지 않은)
커스텀 메트릭을 기반으로 스케일링을 수행하도록 HorizontalPodAutoscaler를 구성할 수 있다.
이 경우 HorizontalPodAutoscaler 컨트롤러가 이러한 커스텀 메트릭을 쿠버네티스 API로부터 조회한다.

요구 사항에 대한 정보는 [메트릭 API를 위한 지원](#메트릭-api를-위한-지원)을 참조한다.

## 복수의 메트릭을 이용하는 스케일링

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

(이전에는 `autoscaling/v2beta2` API 버전이 이 기능을 베타 기능으로 제공했었다.)

`autoscaling/v2` API 버전을 사용하는 경우,
HorizontalPodAutoscaler는 스케일링에 사용할 복수의 메트릭을 설정할 수 있다.
이 경우 HorizontalPodAutoscaler 컨트롤러가 각 메트릭을 확인하고 해당 단일 메트릭에 대한 새로운 스케일링 크기를 제안한다.
HorizontalPodAutoscaler는 새롭게 제안된 스케일링 크기 중 가장 큰 값을 선택하여 워크로드 사이즈를
조정한다(이 값이 이전에 설정한 '총 최대값(overall maximum)'보다는 크지 않을 때에만).

## 메트릭 API를 위한 지원

기본적으로 HorizontalPodAutoscaler 컨트롤러는 일련의 API에서 메트릭을 검색한다. 이러한
API에 접속하려면 클러스터 관리자는 다음을 확인해야 한다.

* [API 애그리게이션 레이어](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) 활성화

* 해당 API 등록:

  * 리소스 메트릭의 경우, 일반적으로 이것은 [메트릭-서버](https://github.com/kubernetes-sigs/metrics-server)가 제공하는 `metrics.k8s.io` API이다.
    클러스터 애드온으로 실행할 수 있다.

  * 사용자 정의 메트릭의 경우, 이것은 `custom.metrics.k8s.io` API이다. 메트릭 솔루션 공급 업체에서 제공하는 "어댑터" API 서버에서 제공한다.
    사용 가능한 쿠버네티스 메트릭 어댑터가 있는지 확인하려면 사용하고자 하는 메트릭 파이프라인을 확인한다.

  * 외부 메트릭의 경우, 이것은 `external.metrics.k8s.io` API이다. 위에 제공된 사용자 정의 메트릭 어댑터에서 제공될 수 있다.

이런 다양한 메트릭 경로와 각각의 다른 점에 대한 상세 내용은 관련 디자인 제안서인
[HPA V2](https://git.k8s.io/design-proposals-archive/autoscaling/hpa-v2.md),
[custom.metrics.k8s.io](https://git.k8s.io/design-proposals-archive/instrumentation/custom-metrics-api.md),
[external.metrics.k8s.io](https://git.k8s.io/design-proposals-archive/instrumentation/external-metrics-api.md)를 참조한다.

어떻게 사용하는지에 대한 예시는 [커스텀 메트릭 사용하는 작업 과정](/ko/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#다양한-메트릭-및-사용자-정의-메트릭을-기초로한-오토스케일링)과
[외부 메트릭스 사용하는 작업 과정](/ko/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#쿠버네티스-오브젝트와-관련이-없는-메트릭을-기초로한-오토스케일링)을 참조한다.

## 구성가능한 스케일링 동작

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

(이전에는 `autoscaling/v2beta2` API 버전이 이 기능을 베타 기능으로 제공했었다.)

`v2` 버전의 HorizontalPodAutoscaler API를 사용한다면,
`behavior` 필드([API 레퍼런스](/docs/reference/kubernetes-api/workload-resources/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscalerSpec) 참고)를
사용하여 스케일업 동작과 스케일다운 동작을 별도로 구성할 수 있다.
각 방향에 대한 동작은 `behavior` 필드 아래의
`scaleUp` / `scaleDown`를 설정하여 지정할 수 있다.

_안정화 윈도우_ 를 명시하여 스케일링 목적물의
레플리카 수 [흔들림](#flapping)을 방지할 수 있다. 스케일링 정책을 이용하여 스케일링 시
레플리카 수 변화 속도를 조절할 수도 있다.

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
비활성화된다.

### 안정화 윈도우

안정화 윈도우는 스케일링에 사용되는 메트릭이 계속 변동할 때
레플리카 수의 [흔들림](#flapping)을 제한하기 위해 사용된다.
오토스케일링 알고리즘은 이전의 목표 상태를 추론하고
워크로드 수의 원치 않는 변화를 방지하기 위해 이 안정화 윈도우를 활용한다.

예를 들어, 다음 예제 스니펫에서, `scaleDown`에 대해 안정화 윈도우가 설정되었다.

```yaml
behavior:
  scaleDown:
    stabilizationWindowSeconds: 300
```

메트릭 관측 결과 스케일링 목적물이 스케일 다운 되어야 하는 경우,
알고리즘은 이전에 계산된 목표 상태를 확인하고, 해당 구간에서 계산된 값 중 가장 높은 값을 사용한다.
위의 예시에서, 이전 5분 동안의 모든 목표 상태가 고려 대상이 된다.

이를 통해 동적 최대값(rolling maximum)을 근사화하여,
스케일링 알고리즘이 빠른 시간 간격으로 파드를 제거하고 바로 다시 동일한 파드를 재생성하는 현상을 방지할 수 있다.

### 기본 동작

사용자 지정 스케일링을 사용하기 위해서 모든 필드를 지정하지 않아도 된다. 사용자 정의가 필요한 값만
지정할 수 있다. 이러한 사용자 지정 값은 기본값과 병합된다. 기본값은 HPA
알고리즘의 기존 동작과 동일하다.

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

### 예시: 스케일 다운 속도 제한

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

분당 제거되는 파드 수가 5를 넘지 않도록 하기 위해, 크기가 5로 고정된 두 번째 축소
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

## kubectl의 HorizontalPodAutoscaler 지원

Horizontal Pod Autoscaler는 모든 API 리소스와 마찬가지로 `kubectl`에 의해 표준 방식으로 지원된다.
`kubectl create` 커맨드를 사용하여 새로운 오토스케일러를 만들 수 있다.
`kubectl get hpa`로 오토스케일러 목록을 조회할 수 있고, `kubectl describe hpa`로 세부 사항을 확인할 수 있다.
마지막으로 `kubectl delete hpa`를 사용하여 오토스케일러를 삭제할 수 있다.

또한 Horizontal Pod Autoscaler를 생성할 수 있는 `kubectl autoscale`이라는 특별한 명령이 있다.
예를 들어 `kubectl autoscale rs foo --min=2 --max=5 --cpu-percent=80`을
실행하면 레플리카셋 *foo* 에 대한 오토스케일러가 생성되고, 목표 CPU 사용률은 `80 %`,
그리고 2와 5 사이의 레플리카 개수로 설정된다.

## 암시적 점검 모드(maintenance-mode) 비활성화

HPA 구성 자체를 변경할 필요없이 대상에 대한
HPA를 암시적으로 비활성화할 수 있다. 대상의 의도한
레플리카 수가 0으로 설정되고, HPA의 최소 레플리카 수가 0 보다 크면, 대상의
의도한 레플리카 수 또는 HPA의 최소 레플리카 수를 수동으로 조정하여
다시 활성화할 때까지 HPA는 대상 조정을
중지한다(그리고 `ScalingActive` 조건 자체를 `false`로 설정).

### 디플로이먼트와 스테이트풀셋을 horizontal autoscaling으로 전환하기

HPA가 활성화되어 있으면, 디플로이먼트, 스테이트풀셋 모두 또는 둘 중 하나의
{{< glossary_tooltip text="매니페스트" term_id="manifest" >}}에서
`spec.replicas`의 값을 삭제하는 것이 바람직하다.
이렇게 적용하지 않으면, (예를 들어 `kubectl apply -f deployment.yaml` 명령으로)
오브젝트에 변경이 생길 때마다 쿠버네티스가 파드의 수를
`spec.replicas`에 기재된 값으로 조정할 것이다.
이는 바람직하지 않으며 HPA가 활성화된 경우에 문제가 될 수 있다.

`spec.replicas` 값을 제거하면 1회성으로 파드 숫자가 줄어들 수 있는데,
이는 이 키의 기본값이 1이기 때문이다(레퍼런스:
[디플로이먼트 레플리카](/ko/docs/concepts/workloads/controllers/deployment#레플리카)).
값을 업데이트하면, 파드 1개를 제외하고 나머지 파드가 종료 절차에 들어간다.
이후의 디플로이먼트 애플리케이션은 정상적으로 작동하며 롤링 업데이트 구성도 의도한 대로 동작한다.
이러한 1회성 저하를 방지하는 방법이 존재하며,
디플로이먼트 수정 방법에 따라 다음 중 한 가지 방법을 선택한다.

{{< tabs name="fix_replicas_instructions" >}}
{{% tab name="클라이언트 쪽에 적용하기 (기본값))" %}}

1. `kubectl apply edit-last-applied deployment/<디플로이먼트_이름>`
2. 에디터에서 `spec.replicas`를 삭제한다. 저장하고 에디터를 종료하면, `kubectl`이
   업데이트 사항을 적용한다. 이 단계에서 파드 숫자가 변경되지는 않는다.
3. 이제 매니페스트에서 `spec.replicas`를 삭제할 수 있다.
   소스 코드 관리 도구를 사용하고 있다면, 변경 사항을 추적할 수 있도록
   변경 사항을 커밋하고 추가 필요 단계를 수행한다.
4. 이제 `kubectl apply -f deployment.yaml`를 실행할 수 있다.

{{% /tab %}}
{{% tab name="서버 쪽에 적용하기" %}}

[서버 쪽에 적용하기](/docs/reference/using-api/server-side-apply/)를 수행하려면,
정확히 이러한 사용 사례를 다루고 있는 [소유권 이전하기](/docs/reference/using-api/server-side-apply/#transferring-ownership)
가이드라인을 참조한다.

{{% /tab %}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

클러스터에 오토스케일링을 구성한다면, [Cluster Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler)와 같은
클러스터 수준의 오토스케일러 사용을 고려해 볼 수 있다.

HorizontalPodAutoscaler에 대한 더 많은 정보는 아래를 참고한다.

* horizontal pod autoscaling에 대한 [연습 예제](/ko/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)를 확인한다.
* [`kubectl autoscale`](/docs/reference/generated/kubectl/kubectl-commands/#autoscale) 문서를 확인한다.
* 커스텀 메트릭 어댑터를 직접 작성하고 싶다면,
  [샘플](https://github.com/kubernetes-sigs/custom-metrics-apiserver)을 확인한다.
* HorizontalPodAutoscaler [API 레퍼런스](/docs/reference/kubernetes-api/workload-resources/horizontal-pod-autoscaler-v2/)를 확인한다.
