---
reviewers:
- adrianmoisey
- omerap12
title: 수직 파드 오토스케일링
feature:
  title: 수직 스케일링
  description: >
    실제 사용 패턴을 기반으로 리소스 요청과 제한을 자동으로 조정한다.
content_type: concept
weight: 70
math: true
---

<!-- overview -->

쿠버네티스에서 _VerticalPodAutoscaler_ 는 워크로드 관리 {{< glossary_tooltip text="리소스" term_id="api-resource" >}}
({{< glossary_tooltip text="	디플로이먼트(Deployment)" term_id="deployment" >}}나
{{< glossary_tooltip text="스테이트풀셋(StatefulSet)" term_id="statefulset" >}}과 같은)를 자동으로 갱신하여, 인프라스트럭처
{{< glossary_tooltip text="리소스" term_id="infrastructure-resource" >}}
[요청 및 제한](/docs/concepts/configuration/manage-resources-containers/#요청 및 제한)을 실제 사용량에 맞추는 것을 목표로 한다.

수직 스케일링이란 리소스 수요가 증가했을 때, 워크로드를 위해 이미 실행 중인
{{< glossary_tooltip text="파드" term_id="pod" >}}에 더 많은 리소스(예: 메모리 또는 CPU)를 할당하는
방식으로 대응하는 것을 의미한다. 이는 _라이트사이징(rightsizing)_ 또는 때로 _오토파일럿(autopilot)_이라고도
불린다. 이는 쿠버네티스에서 부하를 분산하기 위해 더 많은 파드를 배포하는 것을 의미하는 수평 스케일링과는 다르다.

리소스 사용량이 감소하여 파드 리소스 요청이 최적 수준보다 높아지면, VerticalPodAutoscaler는 워크로드
리소스(디플로이먼트, 스테이트풀셋 또는 기타 유사한 리소스)에 리소스 요청을 다시 낮추도록 지시하여 리소스
낭비를 방지한다.

VerticalPodAutoscaler는 쿠버네티스 API 리소스와
{{< glossary_tooltip text="컨트롤러" term_id="controller" >}}로 구현된다.
이 리소스가 컨트롤러의 동작을 결정한다.
쿠버네티스 데이터 플레인 내에서 실행되는 수직 파드 오토스케일링 컨트롤러는 
과거 리소스 사용률 분석, 클러스터에서 사용 가능한 리소스의 양, 메모리 부족(OOM) 상태와 같은 
실시간 이벤트를 바탕으로 
대상(예: 디플로이먼트)의 리소스 요청과 제한을 주기적으로 조정한다.

<!-- body -->

## API 오브젝트

VerticalPodAutoscaler는 쿠버네티스에서 {{< glossary_tooltip text="사용자 정의 리소스" term_id="customresourcedefinition" >}}(CRD)로 정의된다. 핵심 쿠버네티스 API의 일부인 HorizontalPodAutoscaler와 달리, VPA는 클러스터에 별도로 설치해야 한다.

현재 안정된 API 버전은 `autoscaling.k8s.io/v1`이다. VPA 설치 및 API에 대한 자세한 내용은 [VPA GitHub 저장소](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler)에서 확인할 수 있다.

## VerticalPodAutoscaler는 어떻게 동작하는가?

{{< figure
  src="/images/docs/concepts/vpa-architecture.svg"
  alt="수직 파드 오토스케일링 아키텍처"
  class="diagram-large"
  caption="그림 1. VerticalPodAutoscaler는 디플로이먼트 내 파드의 리소스 요청과 제한을 제어한다"
>}}

<!-- https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNqlVG1P2zAQ_iuW-RpY0rVNG6RJpSkSH9hQuzFpLZo850o9nDiznQKj_PddYqcvMGmaSKXG53vuuefuHD9RrjKgCb3VrFyRs8-LguBjqh9uY1SWUnBmhSrIV6XvpGKZg9QPV4XVSkrQ8xRKqR5zKCx5R6Zj_JtZZmFZyRnYm11IqbL5lcrQP8ZgJgrQ3guFZ3b_OVgtuJlfujeZgV5vsawU89HVxYvNLBfGoNL59dWIjFqrSeRU3uwnWJfsO9fza9AWK5QoalRZZXAJmoynqQdr4CrHujIssubdsz2iKjOs1Hn9Gj0HVZDj4w_7ka-oa8BmZpUGQ6btdtN2s_FKW0pnNQHjFfA7Q5ZKE75ixS0g2Cs4kNaAJ2vBrSF18xH_pfEYIgpSSsZhszdMF7uzm_Ap_KrAIEEB9zXJph5CqwmXDeij85Gxhkb8ZjeUFzPynNgdWKMMWYuxu4746Lby16EXxU_gXg02TVWaA1kzWdU9-IuyRhEYp_wfpbZV3Au7Ip9KK3ImcSouCdLjGW7puWTGpLCslZKlkDI5Gp6Pe5NBYJDxDpKjaIK_1JvH9yKzqyQqHwKupNKt-_QFG9eZZ0t7o_5Z-ja29hA6xvPzdNjvv42RlaVnO-un8ej_q93j2_8MAn9gg92wsbH72dvjjx062G5r9O8D3268AY6uFn9KA7zxREYTqysIaA46Z7VJn-rABbUryGFBE1xmsGSVtAu6KJ4xrGTFN6XyNlKr6nZFkyWTBi0nPxUMb88txG1OMoGf9xbJ8K6ZPRZ8y9PUP1ZVYWkSdZs8NHmiDzSJOyedXhiGUe_9IIw63SigjzQZhCfhMO5FcTwcdgaDuPsc0N-NsPBkENf4MBr0O_1uNx4GFJrsl-6ub6785z9_1f9X -->

쿠버네티스는 간헐적으로 실행되는(지속적인 프로세스가 아닌) 여러 협력 컴포넌트를 통해 수직 파드 오토스케일링을 구현한다. VPA는 세 가지 주요 컴포넌트로 구성된다.

* 리소스 사용량을 분석하고 권장 사항을 제공하는 _recommender_.
* 파드를 축출하거나 즉시 수정하여 파드 리소스 요청하는 _updater_.
* 그리고 신규 또는 재생성된 파드에 리소스 권장 사항을 적용하는 VPA _admission controller_ 웹훅.

각 주기마다 한 번씩, Recommender는 각 VerticalPodAutoscaler 정의가 대상으로 하는 파드의 리소스 사용률을 조회한다. Recommender는 `targetRef`로 정의된 대상 리소스를 찾은 다음, 해당 대상 리소스의 `.spec.selector` 레이블을 기준으로 파드를 선택하고, 리소스 메트릭 API에서 메트릭을 가져와 실제 CPU와 메모리 소비량을 분석한다.

Recommender는 VerticalPodAutoscaler가 대상으로 하는 각 파드에 대해 현재와 과거의 리소스 사용 데이터(CPU 및 메모리)를 모두 분석한다. 다음 항목을 검토한다.
- 추세를 파악하기 위한 시간에 따른 과거 소비 패턴
- 충분한 여유 공간을 확보하기 위한 최대 사용량과 변동폭
- 메모리 부족(OOM) 이벤트 및 기타 리소스 관련 사건

이 분석을 바탕으로 Recommender는 세 가지 유형의 권장 사항을 계산한다.
- 목표 권장 값(일반적인 사용량에 대한 최적 리소스)
- 하한값(최소한으로 필요한 리소스)
- 상한값(합리적인 최대 리소스).

이러한 권장 사항은 VerticalPodAutoscaler 리소스의 `.status.recommendation` 필드에 저장된다.


_updater_ 컴포넌트는 VerticalPodAutoscaler 리소스를 모니터링하며, 현재 파드 리소스 요청을 권장 사항과 비교한다. 차이가 설정된 임계값을 초과하고 업데이트 정책이 이를 허용하는 경우, updater는 다음 중 하나를 수행할 수 있다.

- 파드를 축출하여 새로운 리소스 요청으로 재생성을 유도한다(전통적인 접근)
- 클러스터가 즉시 파드 리소스 업데이트를 지원하는 경우, 축출 없이 파드 리소스를 즉시 업데이트한다

선택되는 방식은 설정된 업데이트 모드, 클러스터 기능, 그리고 필요한 리소스 변경의 유형에 따라 달라진다. 즉시 업데이트를 사용할 수 있는 경우 파드 중단을 피할 수 있지만, 수정 가능한 리소스에 제한이 있을 수 있다. updater는 서비스 영향을 최소화하기 위해 PodDisruptionBudget을 준수한다.

_admission controller_는 파드 생성 요청을 가로채는 변형 웹훅으로 동작한다. 파드가
VerticalPodAutoscaler의 대상인지 확인하고, 대상이라면 파드가 생성되기 전에 권장 리소스 요청과 제한을
적용한다. 좀 더 구체적으로, admission controller는 VerticalPodAutoscaler 리소스의 `.status.recommendation` 항목에 있는 목표 권장 값을 새로운 리소스 요청으로 사용한다. admission controller는 새 파드가 최초 배포 중이든, updater에 의한 축출 이후든, 스케일링 작업으로 인한 것이든 관계없이 적절한 크기의 리소스 할당으로 시작하도록 보장한다.

VerticalPodAutoscaler는 클러스터에 쿠버네티스의 Metrics Server
{{< glossary_tooltip text="애드온" term_id="addons" >}}와 같은 메트릭 소스가 설치되어 있어야 한다.
VPA 컴포넌트는 `metrics.k8s.io` API에서 메트릭을 가져온다. 대부분의 클러스터에는 Metrics Server가 기본적으로 배포되어 있지 않으므로 별도로 실행해야 한다. 리소스 메트릭에 대한 자세한 내용은 [Metrics Server](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/#metrics-server)를 참고한다.

## 업데이트 모드(update modes)

VerticalPodAutoscaler는 리소스 권장 사항이 파드에 어떻게, 언제 적용되는지를
제어하는 다양한 _업데이트 모드_를 지원한다. 업데이트 모드는 VPA 스펙의 `updatePolicy`
아래에 있는 `updateMode` 필드로 설정한다.

```yaml
---
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: my-app-vpa
spec:
  targetRef:
    apiVersion: "apps/v1"
    kind: Deployment
    name: my-app
  updatePolicy:
    updateMode: "Recreate"  # Off, Initial, Recreate, InPlaceOrRecreate, InPlace
```

### Off {#updateMode-Off}

_Off_ 업데이트 모드에서는 VPA recommender가 여전히 리소스 사용량을 분석하고 
권장 사항을 생성하지만, 이 권장 사항이 파드에 자동으로 적용되지는 않는다. 
권장 사항은 VPA 오브젝트의 `.status` 필드에만 저장된다.

`kubectl`과 같은 도구를 사용하여 `.status`와 그 안의 권장 사항을 확인할 수 있다.

### Initial {#updateMode-Initial}

_Initial_ 모드에서 VPA는 파드가 처음 생성될 때만 리소스 요청을 설정한다. 시간이 지나 권장 사항이 바뀌더라도, 이미 실행 중인 파드의 리소스는 업데이트하지 않는다. 권장 사항은 파드 생성 시에만 적용된다.

### Recreate {#updateMode-Recreate}

_Recreate_ 모드에서 VPA는 현재 리소스 요청이 권장 사항과 크게 차이 날 때 
파드를 축출하여 파드 리소스를 능동적으로 관리한다. 파드가 축출되면 워크로드 
컨트롤러(디플로이먼트, 스테이트풀셋 등을 관리하는)가 대체 파드를 생성하고,
VPA admission controller가 새 파드에 업데이트된 리소스 요청을 적용한다.

### InPlaceOrRecreate {#updateMode-InPlaceOrRecreate}

`InPlaceOrRecreate` 모드에서 VPA는 가능한 경우 파드를 재시작하지 않고 파드 리소스 요청과 제한을 업데이트하려고 시도한다. 하지만 특정 리소스 변경에 대해 즉시 업데이트를 수행할 수 없는 경우, VPA는
(`Recreate` 모드와 유사하게) 파드 축출로 대체하여 워크로드 컨트롤러가 업데이트된 리소스로 대체 파드를 생성하도록 한다.

이 모드에서 updater는 [컨테이너 리소스 즉시 크기 조정](/docs/tasks/configure-pod-container/resize-container-resources/) 기능을 사용하여 권장 사항을 즉시 적용한다.


### InPlace {#updateMode-InPlace}

이 모드는 VPA 1.7.0의 알파(alpha) 기능으로 제공되며, `InPlacePodVerticalScaling` 
클러스터 기능 게이트가 활성화된 쿠버네티스 1.33 이상과, VPA updater 및 admission controller에서 
활성화된 `InPlace` 기능 게이트를 필요로 한다.
파드를 중단시키지 않고 업데이트를 적용하기 위해
[즉시 파드 크기 조정](/docs/concepts/workloads/pods/pod-lifecycle/#pod-resize)
기능을 사용한다.

`InPlace` 모드에서 VPA는 파드를 재시작하거나 축출하지 않고 파드 리소스 요청과
제한을 업데이트하려고 시도한다. `InPlaceOrRecreate`와 달리 이 모드는
**절대 축출로 대체하지 않는다**. (예를 들어 노드에 충분한 용량이 없는 등의 이유로)
즉시 업데이트를 적용할 수 없는 경우, VPA는 업데이트를 지연시키고 이후
조정 루프에서 다시 시도한다.

`InPlace` 모드를 사용하려면 VPA updater와 admission controller 양쪽에서 `InPlace` 기능 게이트를
활성화한다.

```shell
--feature-gates=InPlace=true
```

그런 다음 VPA 스펙에서 `updateMode`를 `"InPlace"`로 설정한다.

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: my-app-vpa
spec:
  targetRef:
    apiVersion: "apps/v1"
    kind: Deployment
    name: my-app
  updatePolicy:
    updateMode: "InPlace"
```

**`InPlaceOrRecreate`와의 주요 차이점:** 크기 조정이 지연되거나, 진행 중이거나, 수행이 불가능한
경우에도 `InPlace` 모드는 항상 대기하고 재시도한다 — 업데이트가 얼마나 오래 보류되든 파드를 축출하지
않는다.

### Auto(지원 중단) {#updateMode-Auto}

{{< note >}}
`Auto` 업데이트 모드는 **VPA 버전 1.4.0부터 지원이 중단되었다**. 축출 기반 업데이트에는 `Recreate`를,
축출로 대체되는 즉시 업데이트에는 `InPlaceOrRecreate`를 사용한다.
{{< /note >}}

`Auto` 모드는 현재 `Recreate` 모드의 별칭이며 동일하게 동작한다. 이는 향후 자동 업데이트 전략을 확장할 수 있도록 도입되었다.

## 리소스 정책

리소스 정책을 사용하면 VerticalPodAutoscaler가 권장 사항을 생성하고 업데이트를 적용하는 방식을 세밀하게
조정할 수 있다. 리소스 권장 사항의 경계를 설정하고, 관리할 리소스를 지정하며, 파드 내 개별 컨테이너마다 다른 정책을 구성할 수 있다.

리소스 정책은 VPA 스펙의 `resourcePolicy` 필드에 정의한다.

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: my-app-vpa
spec:
  targetRef:
    apiVersion: "apps/v1"
    kind: Deployment
    name: my-app
  updatePolicy:
    updateMode: "Recreate"
  resourcePolicy:
    containerPolicies:
    - containerName: "application"
      minAllowed:
        cpu: 100m
        memory: 128Mi
      maxAllowed:
        cpu: 2
        memory: 2Gi
      controlledResources:
      - cpu
      - memory
      controlledValues: RequestsAndLimits
```

#### minAllowed와 maxAllowed

이 필드들은 VPA 권장 사항의 경계를 설정한다.
실제 사용 데이터가 다른 값을 시사하더라도, VPA는 `minAllowed`보다 낮거나 `maxAllowed`보다 높은 리소스를 절대 권장하지 않는다.

#### controlledResources

`controlledResources` 필드는 파드 내 컨테이너에 대해 VPA가 관리해야 하는 리소스 유형을 지정한다.
지정하지 않으면 VPA는 기본적으로 CPU와 메모리를 모두 관리한다. VPA가 특정 리소스만 관리하도록 제한할
수 있다. 유효한 리소스 이름에는 `cpu`와 `memory`가 있다.

### controlledValues

`controlledValues` 필드는 VPA가 리소스 요청, 제한, 또는 둘 다를 제어할지를 결정한다.

RequestsAndLimits
: VPA는 요청과 제한을 모두 설정한다. 제한은 파드 스펙에 정의된 요청 대 제한 비율에 따라 요청에 비례하여 조정된다. 이는 기본 모드이다.

RequestsOnly
: VPA는 요청만 설정하고 제한은 그대로 둔다. 제한은 그대로 적용되며, 사용량이 제한을 초과하면 여전히 스로틀링이나 메모리 부족(OOM) 강제 종료가 발생할 수 있다.

이 두 개념에 대해 더 알아보려면 [요청 및 제한](/docs/concepts/configuration/manage-resources-containers/#요청 및 제한)을 참고한다.

## LimitRange 리소스

admission controller와 updater VPA 컴포넌트는 [리밋 레인지(LimitRange)](/docs/concepts/policy/limit-range/)에 정의된 제약 조건을 준수하도록 권장 사항을 후처리한다. 쿠버네티스 클러스터에서는 `type`이 Pod와 Container인 LimitRange 리소스를 확인한다.

예를 들어 컨테이너 리밋 레인지 리소스의 `max` 필드를 초과하면, 두 VPA 컴포넌트는 제한을 `max` 필드에 정의된 값으로 낮추고, 파드 스펙의 요청 대 제한 비율을 유지하기 위해 요청도 비례하여 줄인다.

## {{% heading "whatsnext" %}}

클러스터에서 오토스케일링을 구성한다면, 적절한 수의 노드를 실행하고 있는지 확인하기 위해
[노드 오토스케일링](/docs/concepts/cluster-administration/node-autoscaling/)
사용도 고려해 볼 수 있다.
[_수평_ 파드 오토스케일링](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/)에 대해서도 더 알아볼 수 있다.
