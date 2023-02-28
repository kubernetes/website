---
# reviewers:
# - fgrzadkowski
# - jszczepkowski
# - justinsb
# - directxman12
title: HorizontalPodAutoscaler 연습
content_type: task
weight: 100
min-kubernetes-server-version: 1.23
---

<!-- overview -->

[HorizontalPodAutoscaler](/ko/docs/tasks/run-application/horizontal-pod-autoscale/)(약어: HPA)는 
워크로드 리소스(예: {{< glossary_tooltip text="디플로이먼트" term_id="deployment" >}} 또는 
{{< glossary_tooltip text="스테이트풀셋" term_id="statefulset" >}})를 
자동으로 업데이트하며, 
워크로드의 크기를 수요에 맞게 
자동으로 스케일링하는 것을 목표로 한다.

수평 스케일링은 부하 증가에 대해 
{{< glossary_tooltip text="파드" term_id="pod" >}}를 더 배치하는 것을 뜻한다. 
이는 _수직_ 스케일링(쿠버네티스에서는, 
해당 워크로드를 위해 이미 실행 중인 파드에 
더 많은 자원(예: 메모리 또는 CPU)를 할당하는 것)과는 다르다.

부하량이 줄어들고, 파드의 수가 최소 설정값 이상인 경우, 
HorizontalPodAutoscaler는 워크로드 리소스(디플로이먼트, 스테이트풀셋, 
또는 다른 비슷한 리소스)에게 스케일 다운을 지시한다.

이 문서는 예제 웹 앱의 크기를 자동으로 조절하도록 
HorizontalPodAutoscaler를 설정하는 예시를 다룬다. 
이 예시 워크로드는 PHP 코드를 실행하는 아파치 httpd이다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}} 이전 버전의 
쿠버네티스를 사용하고 있다면, 해당 버전의 문서를 
참고한다([사용 가능한 문서의 버전](/ko/docs/home/supported-doc-versions/) 참고).

이 예제를 실행하기 위해, 클러스터에 [Metrics Server](https://github.com/kubernetes-sigs/metrics-server#readme)가 
배포 및 구성되어 있어야 한다. 쿠버네티스 Metrics Server는 클러스터의 
{{<glossary_tooltip term_id="kubelet" text="kubelet">}}으로부터 
리소스 메트릭을 수집하고, 수집한 메트릭을 
[쿠버네티스 API](/ko/docs/concepts/overview/kubernetes-api/)를 통해 노출시키며, 
메트릭 수치를 나타내는 새로운 종류의 리소스를 추가하기 위해 
[APIService](/ko/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)를 사용할 수 있다.

Metrics Server를 실행하는 방법을 보려면 
[metrics-server 문서](https://github.com/kubernetes-sigs/metrics-server#deployment)를 참고한다.

<!-- steps -->

## php-apache 서버 구동 및 노출

HorizontalPodAutoscaler 시연을 위해, `hpa-example` 이미지를 사용하여 컨테이너를 실행하는 디플로이먼트를 시작하고,
다음의 매니페스트를 사용하여 디플로이먼트를
{{< glossary_tooltip term_id="service" text="서비스">}}로 노출한다.

{{< codenew file="application/php-apache.yaml" >}}

이를 위해, 다음의 명령어를 실행한다.

```shell
kubectl apply -f https://k8s.io/examples/application/php-apache.yaml
```

```
deployment.apps/php-apache created
service/php-apache created
```

## HorizontalPodAutoscaler 생성 {#create-horizontal-pod-autoscaler}

이제 서비스가 동작중이므로, 
`kubectl`을 사용하여 오토스케일러를 생성한다. 이를 위해 
[kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands#autoscale) 서브커맨드를 사용할 수 있다.

아래에서는 첫 번째 단계에서 만든 php-apache 
디플로이먼트 파드의 개수를 1부터 10 사이로 유지하는 
Horizontal Pod Autoscaler를 생성하는 명령어를 실행할 것이다.

간단히 이야기하면, HPA {{<glossary_tooltip text="컨트롤러" term_id="controller">}}는 
평균 CPU 사용량을 50%로 유지하기 위해 (디플로이먼트를 업데이트하여) 레플리카의 개수를 늘리고 줄인다.
그러면 디플로이먼트는 레플리카셋을 업데이트하며(이는 모든 쿠버네티스 디플로이먼트의 동작 방식 중 일부이다), 
레플리카셋은 자신의 `.spec` 필드의 변경 사항에 따라 파드를 추가하거나 제거한다.

`kubectl run`으로 각 파드는 200 밀리코어를 요청하므로, 평균 CPU 사용은 100 밀리코어이다.
알고리즘에 대한 세부 사항은 
[알고리즘 세부 정보](/ko/docs/tasks/run-application/horizontal-pod-autoscale/#알고리즘-세부-정보)를 참고한다.


HorizontalPodAutoscaler를 생성한다.

```shell
kubectl autoscale deployment php-apache --cpu-percent=50 --min=1 --max=10
```

```
horizontalpodautoscaler.autoscaling/php-apache autoscaled
```

다음을 실행하여, 새로 만들어진 HorizontalPodAutoscaler의 현재 상태를 확인할 수 있다.

```shell
# "hpa" 또는 "horizontalpodautoscaler" 둘 다 사용 가능하다.
kubectl get hpa
```

출력은 다음과 같다.
```
NAME         REFERENCE                     TARGET    MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   0% / 50%  1         10        1          18s
```

(HorizontalPodAutoscalers 이름이 다르다면, 이미 기존에 존재하고 있었다는 뜻이며, 
보통은 문제가 되지 않는다.)

아직 서버로 요청을 보내는 클라이언트가 없기 때문에, 현재 CPU 사용량이 0%임을 확인할 수 있다. 
(``TARGET`` 열은 디플로이먼트에 의해 제어되는 파드들의 평균을 나타낸다)

## 부하 증가시키기 {#increase-load}

다음으로, 부하가 증가함에 따라 오토스케일러가 어떻게 반응하는지를 살펴볼 것이다. 
이를 위해, 클라이언트 역할을 하는 다른 파드를 실행할 것이다. 
클라이언트 파드 안의 컨테이너가 php-apache 서비스에 쿼리를 보내는 무한 루프를 실행한다.

```shell
# 부하 생성을 유지하면서 나머지 스텝을 수행할 수 있도록,
# 다음의 명령을 별도의 터미널에서 실행한다.
kubectl run -i --tty load-generator --rm --image=busybox:1.28 --restart=Never -- /bin/sh -c "while sleep 0.01; do wget -q -O- http://php-apache; done"
```

이제 아래 명령을 실행한다.
```shell
# 준비가 되면, 관찰을 마치기 위해 Ctrl+C를 누른다.
kubectl get hpa
```

1분 쯤 지나면, 다음과 같이 CPU 부하가 올라간 것을 볼 수 있다.

```
NAME         REFERENCE                     TARGET      MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   305% / 50%  1         10        1          3m
```

그리고 다음과 같이 레플리카의 수가 증가한 것도 볼 수 있다.
```
NAME         REFERENCE                     TARGET      MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   305% / 50%  1         10        7          3m
```

CPU 사용률이 305%까지 증가하였다.
결과적으로, 디플로이먼트의 레플리카 개수가 7개까지 증가하였다.

```shell
kubectl get deployment php-apache
```

HorizontalPodAutoscaler를 조회했을 때와 동일한 레플리카 수를 확인할 수 있다.
```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
php-apache   7/7      7           7           19m
```

{{< note >}}
레플리카의 개수를 안정화시키는데 몇 분이 걸릴 수 있다.
부하의 양은 환경에 따라 다르기 때문에,
최종 레플리카의 개수는 본 예제와 다를 수 있다.
{{< /note >}}

## 부하 발생 중지하기 {#stop-load}

본 예제를 마무리하기 위해 부하를 중단시킨다.

`busybox` 파드를 띄운 터미널에서,
`<Ctrl> + C`로 부하 발생을 중단시킨다.

그런 다음 (몇 분 후에) 결과를 확인한다.

```shell
# 준비가 되면, 관찰을 마치기 위해 Ctrl+C를 누른다.
kubectl get hpa php-apache --watch
```

출력은 다음과 같다.
```
NAME         REFERENCE                     TARGET       MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   0% / 50%     1         10        1          11m
```

디플로이먼트도 스케일 다운 했음을 볼 수 있다.
```shell
kubectl get deployment php-apache
```

```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
php-apache   1/1     1            1           27m
```

CPU 사용량이 0으로 떨어져서, HPA가 자동으로 레플리카의 개수를 1로 줄였다.

{{< note >}}
레플리카 오토스케일링은 몇 분 정도 소요된다.
{{< /note >}}

<!-- discussion -->

## 다양한 메트릭 및 사용자 정의 메트릭을 기초로한 오토스케일링

`php-apache` 디플로이먼트를 오토스케일링할 때,
`autoscaling/v2` API 버전을 사용하여 추가적인 메트릭을 제공할 수 있다.

첫 번째로, `autoscaling/v2` 형식으로 HorizontalPodAutoscaler YAML 파일을 생성한다.

```shell
kubectl get hpa php-apache -o yaml > /tmp/hpa-v2.yaml
```

에디터로 `/tmp/hpa-v2.yaml` 파일을 열면, 다음과 같은 YAML을 확인할 수 있다.

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: php-apache
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
status:
  observedGeneration: 1
  lastScaleTime: <some-time>
  currentReplicas: 1
  desiredReplicas: 1
  currentMetrics:
  - type: Resource
    resource:
      name: cpu
      current:
        averageUtilization: 0
        averageValue: 0
```

`targetCPUUtilizationPercentage` 필드가 `metrics` 배열로 대체되었다.
CPU 사용량 메트릭은 *resource metric* 으로 파드 컨테이너 자원의 백분율로 표현된다.
CPU 외에 다른 메트릭을 지정할 수 있는데, 기본적으로 지원되는 다른 메트릭은 메모리뿐이다.
이 자원들은 한 클러스터에서 다른 클러스터로 이름을 변경할 수 없으며,
`metrics.k8s.io` API가 가용한 경우 언제든지 사용할 수 있어야 한다.

또한, `Utilization` 대신 `AverageValue`의 `target` 타입을,
그리고 `target.averageUtilization` 대신 `target.averageValue`로 설정하여
자원 메트릭을 퍼센트 대신 값으로 명시할 수 있다.

파드 메트릭과 오브젝트 메트릭 두 가지의 *사용자 정의 메트릭* 이 있다.
파드 메트릭과 오브젝트 메트릭. 이 메트릭은 클러스터에 특화된 이름을 가지고 있으며,
더 고급화된 클러스터 모니터링 설정이 필요하다.

이러한 대체 메트릭 타입중 첫 번째는 *파드 메트릭* 이다.
이 메트릭은 파드들을 설명하고, 파드들 간의 평균을 내며, 대상 값과 비교하여 레플리카 개수를 결정한다.
이것들은 `AverageValue`의 `target`만을 지원한다는 것을 제외하면, 자원 메트릭과 매우 유사하게 동작한다.

파드 메트릭은 이처럼 메트릭 블록을 사용하여 정의된다.

```yaml
type: Pods
pods:
  metric:
    name: packets-per-second
  target:
    type: AverageValue
    averageValue: 1k
```

두 번째 대체 메트릭 타입은 *오브젝트 메트릭* 이다.
이 메트릭은 파드를 기술하는 대신에 동일한 네임스페이스 내에 다른 오브젝트를 표현한다.
이 메트릭은 반드시 오브젝트로부터 가져올 필요는 없다. 단지 오브젝트를 기술할 뿐이다.
오브젝트 메트릭은 `Value`과 `AverageValue`의 `target` 타입을 지원한다.
`Value`를 사용할 경우 대상은 API로부터 반환되는 메트릭과 직접 비교된다.
`AverageValue`를 사용할 경우, 대상 값과 비교되기 이전에 사용자 정의 메트릭 API로부터 반환된 값은 파드의 개수로 나눠진다.
다음은 `requests-per-second` 메트릭을 YAML로 기술한 예제이다.

```yaml
type: Object
object:
  metric:
    name: requests-per-second
  describedObject:
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    name: main-route
  target:
    type: Value
    value: 2k
```

이러한 메트릭 블록을 여러 개 제공하면, HorizontalPodAutoscaler는 각 메트릭을 차례로 고려한다.
HorizontalPodAutoscaler는 각 메트릭에 대해 제안된 레플리카 개수를 계산하고,
그중 가장 높은 레플리카 개수를 선정한다.

예를 들어, 네트워크 트래픽 메트릭을 수집하는 모니터링 시스템이 있는 경우,
`kubectl edit` 명령어를 이용하여 다음과 같이 정의를 업데이트 할 수 있다.

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: php-apache
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
  - type: Pods
    pods:
      metric:
        name: packets-per-second
      target:
        type: AverageValue
        averageValue: 1k
  - type: Object
    object:
      metric:
        name: requests-per-second
      describedObject:
        apiVersion: networking.k8s.io/v1
        kind: Ingress
        name: main-route
      target:
        type: Value
        value: 10k
status:
  observedGeneration: 1
  lastScaleTime: <some-time>
  currentReplicas: 1
  desiredReplicas: 1
  currentMetrics:
  - type: Resource
    resource:
      name: cpu
    current:
      averageUtilization: 0
      averageValue: 0
  - type: Object
    object:
      metric:
        name: requests-per-second
      describedObject:
        apiVersion: networking.k8s.io/v1
        kind: Ingress
        name: main-route
      current:
        value: 10k
```

이후, HorizontalPodAutoscaler는 각 파드가 요청 된 약 50%의 CPU 사용률을 소모하는지,
초당 1000 패킷을 처리하는지,
메인-루트 인그레스 뒤의 모든 파드들이 초당 10000 요청을 처리하는지 확인한다.

### 보다 구체적인 메트릭을 기초로한 오토스케일링

많은 메트릭 파이프라인들을 사용하면 이름 또는 _labels_ 이라 불리는 추가적인 식별자로 메트릭을 설명할 수 있다.
그리고, 모든 비 자원 메트릭 타입(파드, 오브젝트 그리고 아래 기술된 외부 타입)에 대해,
메트릭 파이프라인으로 전달되는 추가 레이블 셀렉터를 지정할 수 있다.
예를 들면, `verb` 레이블로 `http_requests` 메트릭을 수집하는 경우,
다음과 같이 메트릭 블록을 지정하여 GET 요청에 대해 크기를 조정할 수 있다.

```yaml
type: Object
object:
  metric:
    name: http_requests
    selector: {matchLabels: {verb: GET}}
```

이 셀렉터는 쿠버네티스의 레이블 셀렉터와 동일한 문법이다.
모니터링 파이프라인은 네임과 셀렉터가 여러 시리즈와 일치하는 경우,
해당 여러 시리즈를 단일 값으로 축소하는 방법을 결정한다.
셀렉터는 부가적인 속성이며,
대상 오브젝트(`Pods` 타입의 대상 파드, `Object` 타입으로 기술된 오브젝트)가 아닌 메트릭을 선택할 수 없다.

### 쿠버네티스 오브젝트와 관련이 없는 메트릭을 기초로한 오토스케일링

쿠버네티스 위에서 동작하는 애플리케이션은, 쿠버네티스 클러스터의 어떤 오브젝트와도 관련이 없는 메트릭에 기반하여
오토스케일링을 할 수도 있다.
예로, 쿠버네티스 네임스페이스와 관련이 없는 서비스를 기초로한 메트릭을 들 수 있다.
쿠버네티스 버전 1.10 포함 이후 버전에서, *외부 메트릭* 을 사용하여 이러한 유스케이스를 해결할 수 있다.

외부 메트릭 사용시, 먼저 모니터링 시스템에 대한 이해가 있어야 한다.
이 설치는 사용자 정의 메트릭과 유사하다.
외부 메트릭을 사용하면 모니터링 시스템의 사용 가능한 메트릭에 기반하여 클러스터를 오토스케일링 할 수 있다.
위의 예제처럼 `name`과 `selector`를 갖는 `metric` 블록을 명시하고,
`Object` 대신에 `External` 메트릭 타입을 사용한다.
만일 여러 개의 시계열이 `metricSelector`와 일치하면, HorizontalPodAutoscaler가 값의 합을 사용한다.
외부 메트릭들은 `Value`와 `AverageValue` 대상 타입을 모두 지원하고,
`Object` 타입을 사용할 때와 똑같이 동작한다.

예를 들면 애플리케이션이 호스팅 된 대기열 서비스에서 작업을 처리하는 경우,
다음과 같이 HorizontalPodAutoscaler 매니퍼스트에 30개의 미해결 태스크 당 한 개의 워커를 지정하도록 추가할 수 있다.

```yaml
- type: External
  external:
    metric:
      name: queue_messages_ready
      selector:
        matchLabels:
          queue: "worker_tasks"
    target:
      type: AverageValue
      averageValue: 30
```

가능하다면, 외부 메트릭 대신 사용자 정의 메트릭 대상 타입을 사용하길 권장한다.
왜냐하면, 클러스터 관리자가 사용자 정의 메트릭 API를 보안관점에서 더 쉽게 보호할 수 있기 때문이다.
외부 메트릭 API는 잠재적으로 어떠한 메트릭에도 접근할 수 있기에, 클러스터 관리자는 API를 노출시킬때 신중해야 한다.

## 부록: Horizontal Pod Autoscaler 상태 조건

HorizontalPodAutoscaler의 `autoscaling/v2` 형식을 사용하면,
HorizontalPodAutoscaler에서 쿠버네티스가 설정한 *상태 조건* 을 확인할 수 있다.
이 상태 조건들은 HorizontalPodAutoscaler가 스케일을 할 수 있는지,
어떤 방식으로든 제한되어 있는지 여부를 나타낸다.

이 조건은 `status.conditions`에 나타난다.
HorizontalPodAutoscaler에 영향을 주는 조건을 보기 위해 `kubectl describe hpa`를 사용할 수 있다.

```shell
kubectl describe hpa cm-test
```

```
Name:                           cm-test
Namespace:                      prom
Labels:                         <none>
Annotations:                    <none>
CreationTimestamp:              Fri, 16 Jun 2017 18:09:22 +0000
Reference:                      ReplicationController/cm-test
Metrics:                        ( current / target )
  "http_requests" on pods:      66m / 500m
Min replicas:                   1
Max replicas:                   4
ReplicationController pods:     1 current / 1 desired
Conditions:
  Type                  Status  Reason                  Message
  ----                  ------  ------                  -------
  AbleToScale           True    ReadyForNewScale        the last scale time was sufficiently old as to warrant a new scale
  ScalingActive         True    ValidMetricFound        the HPA was able to successfully calculate a replica count from pods metric http_requests
  ScalingLimited        False   DesiredWithinRange      the desired replica count is within the acceptable range
Events:
```

이 HorizontalPodAutoscaler 경우, 건강 상태의 여러 조건들을 볼 수 있다.
첫 번째 `AbleToScale`는 HPA가 스케일을 가져오고 업데이트할 수 있는지,
백 오프 관련 조건으로 스케일링이 방지되는지 여부를 나타낸다.
두 번째 `ScalingActive`는 HPA가 활성화되어 있는지(즉 대상 레플리카 개수가 0이 아닌지),
원하는 스케일을 계산할 수 있는지 여부를 나타낸다. 만약 `False` 인 경우,
일반적으로 메트릭을 가져오는 데 문제가 있다.
마지막으로, 마지막 조건인 `ScalingLimited`는
원하는 스케일 한도가 HorizontalPodAutoscaler의 최대/최소값으로 제한돼있음을 나타낸다.
이는 HorizontalPodAutoscaler에서 레플리카의 개수 제한을 최대/최소값으로 올리거나 낮추려는 것이다.

## 수량

HorizontalPodAutoscaler와 메트릭 API에서 모든 메트릭은
쿠버네티스에서 사용하는
{{< glossary_tooltip term_id="quantity" text="수량">}} 숫자 표기법을 사용한다.
예를 들면, `10500m` 수량은 10진법 `10.5`으로 쓰인다.
메트릭 API들은 가능한 경우 접미사 없이 정수를 반환하며,
일반적으로 수량을 밀리단위로 반환한다.
10진수로 표현했을때, `1`과 `1500m` 또는 `1`과 `1.5` 로 메트릭 값을 나타낼 수 있다.

## 다른 가능한 시나리오

### 명시적으로 오토스케일러 만들기

HorizontalPodAutoscaler를 생성하기 위해 `kubectl autoscale` 명령어를 사용하지 않고,
명시적으로 다음 매니페스트를 사용하여 만들 수 있다.

{{< codenew file="application/hpa/php-apache.yaml" >}}

다음으로, 아래의 명령어를 실행하여 오토스케일러를 생성한다.

```shell
kubectl create -f https://k8s.io/examples/application/hpa/php-apache.yaml
```

```
horizontalpodautoscaler.autoscaling/php-apache created
```
