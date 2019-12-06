---
title: Horizontal Pod Autoscaler 연습
content_template: templates/task
weight: 100
---

{{% capture overview %}}

Horizontal Pod Autoscaler는
CPU 사용량(또는 베타 지원의 다른 애플리케이션 지원 메트릭)을 관찰하여
레플리케이션 컨트롤러, 디플로이먼트, 레플리카 셋 또는 스테이트풀 셋의 파드 개수를 자동으로 스케일한다.

이 문서는 php-apache 서버를 대상으로 Horizontal Pod Autoscaler를 동작해보는 예제이다. Horizontal Pod Autoscaler 동작과 관련된 더 많은 정보를 위해서는 [Horizontal Pod Autoscaler 사용자 가이드](/docs/tasks/run-application/horizontal-pod-autoscale/)를 참고하기 바란다.

{{% /capture %}}



{{% capture prerequisites %}}

이 예제는 버전 1.2 또는 이상의 쿠버네티스 클러스터와 kubectl을 필요로 한다.
[메트릭-서버](https://github.com/kubernetes-incubator/metrics-server/) 모니터링을 클러스터에 배포하여 리소스 메트릭 API를 통해 메트릭을 제공해야 한다.
Horizontal Pod Autoscaler가 메트릭을 수집할때 해당 API를 사용한다.
메트릭-서버를 배포하는 지침은 [메트릭-서버](https://github.com/kubernetes-incubator/metrics-server/)의 GitHub 저장소에 있고, [GCE 가이드](/docs/setup/turnkey/gce/)로 클러스터를 올리는 경우 메트릭-서버 모니터링은 디폴트로 활성화된다.

Horizontal Pod Autoscaler에 다양한 자원 메트릭을 적용하고자 하는 경우,
버전 1.6 또는 이상의 쿠버네티스 클러스터와 kubectl를 사용해야 한다.
또한, 사용자 정의 메트릭을 사용하기 위해서는, 클러스터가 사용자 정의 메트릭 API를 제공하는 API 서버와 통신할 수 있어야 한다.
마지막으로 쿠버네티스 오브젝트와 관련이 없는 메트릭을 사용하는 경우,
버전 1.10 또는 이상의 쿠버네티스 클러스터와 kubectl을 사용해야 하며, 외부 메트릭 API와 통신이 가능해야 한다.
자세한 사항은 [Horizontal Pod Autoscaler 사용자 가이드](/docs/tasks/run-application/horizontal-pod-autoscale/#support-for-custom-metrics)를 참고하길 바란다.

{{% /capture %}}

{{% capture steps %}}

## php-apache 서버 구동 및 노출

Horizontal Pod Autoscaler 시연을 위해 php-apache 이미지를 맞춤 제작한 Docker 이미지를 사용한다.
Dockerfile은 다음과 같다.

```
FROM php:5-apache
ADD index.php /var/www/html/index.php
RUN chmod a+rx index.php
```

index.php는 CPU 과부하 연산을 수행한다.

```
<?php
  $x = 0.0001;
  for ($i = 0; $i <= 1000000; $i++) {
    $x += sqrt($x);
  }
  echo "OK!";
?>
```

첫 번째 단계로, 실행 중인 이미지의 디플로이먼트를 시작하고 서비스로 노출시킨다.

```shell
kubectl run php-apache --image=k8s.gcr.io/hpa-example --requests=cpu=200m --limits=cpu=500m --expose --port=80
```
```
service/php-apache created
deployment.apps/php-apache created
```

## Horizontal Pod Autoscaler 생성

이제 서비스가 동작중이므로,
[kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands#autoscale)를 사용하여 오토스케일러를 생성한다.
다음 명령어는 첫 번째 단계에서 만든 php-apache 디플로이먼트 파드의 개수를
1부터 10 사이로 유지하는 Horizontal Pod Autoscaler를 생성한다.
간단히 얘기하면, HPA는 (디플로이먼트를 통한) 평균 CPU 사용량을 50%로 유지하기 위하여 레플리카의 개수를 늘리고 줄인다.
[kubectl run](https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/docs/user-guide/kubectl/kubectl_run.md)으로 각 파드는 200 밀리코어까지 요청할 수 있고,
따라서 여기서 말하는 평균 CPU 사용은 100 밀리코어를 말한다).
이에 대한 자세한 알고리즘은 [여기](/docs/tasks/run-application/horizontal-pod-autoscale/#algorithm-details)를 참고하기 바란다.

```shell
kubectl autoscale deployment php-apache --cpu-percent=50 --min=1 --max=10
```
```
horizontalpodautoscaler.autoscaling/php-apache autoscaled
```

실행 중인 오토스케일러의 현재 상태를 확인해본다.

```shell
kubectl get hpa
```
```
NAME         REFERENCE                     TARGET    MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   0% / 50%  1         10        1          18s

```

아직 서버로 어떠한 요청도 하지 않았기 때문에, 현재 CPU 소비는 0%임을 확인할 수 있다 (``CURRENT``은 디플로이먼트에 의해 제어되는 파드들의 평균을 나타낸다).

## 부하 증가

이번에는 부하가 증가함에 따라 오토스케일러가 어떻게 반응하는지를 살펴볼 것이다. 먼저 컨테이너를 하나 실행하고, php-apache 서비스에 무한루프의 쿼리를 전송한다(다른 터미널을 열어 수행하기 바란다).


```shell
kubectl run --generator=run-pod/v1 -it --rm load-generator --image=busybox /bin/sh

Hit enter for command prompt

while true; do wget -q -O- http://php-apache.default.svc.cluster.local; done
```

실행 후, 약 1분 정도 후에 CPU 부하가 올라가는 것을 볼 수 있다.

```shell
kubectl get hpa
```
```
NAME         REFERENCE                     TARGET      CURRENT   MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   305% / 50%  305%      1         10        1          3m

```

CPU 소비가 305%까지 증가하였다.
결과적으로, 디플로이먼트의 레플리카 개수는 7개까지 증가하였다.

```shell
kubectl get deployment php-apache
```
```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
php-apache   7/7      7           7           19m
```

{{< note >}}
레플리카의 개수를 안정화시키는데 몇 분이 걸릴 수 있다.
부하의 양은 환경에 따라 다르기 때문에,
최종 레플리카의 개수는 본 예제와 다를 수 있다.
{{< /note >}}

## 부하 중지

본 예제를 마무리하기 위해 부하를 중단시킨다.

`busybox` 컨테이너를 띄운 터미널에서,
`<Ctrl> + C`로 부하 발생을 중단시킨다.

그런 다음 (몇 분 후에) 결과를 확인한다.

```shell
kubectl get hpa
```
```
NAME         REFERENCE                     TARGET       MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   0% / 50%     1         10        1          11m
```

```shell
kubectl get deployment php-apache
```
```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
php-apache   1/1     1            1           27m
```

CPU 사용량은 0으로 떨어졌고, HPA는 레플리카의 개수를 1로 낮췄다.

{{< note >}}
레플리카 오토스케일링은 몇 분 정도 소요된다.
{{< /note >}}

{{% /capture %}}

{{% capture discussion %}}

## 다양한 메트릭 및 사용자 정의 메트릭을 기초로한 오토스케일링

`php-apache` 디플로이먼트를 오토스케일링할 때,
`autoscaling/v2beta2` API 버전을 사용하여 추가적인 메트릭을 제공할 수 있다.

첫 번째로, `autoscaling/v2beta2` 형식으로 HorizontalPodAutoscaler YAML 파일을 생성한다.

```shell
kubectl get hpa.v2beta2.autoscaling -o yaml > /tmp/hpa-v2.yaml
```

에디터로 `/tmp/hpa-v2.yaml` 파일을 열면, 다음과 같은 YAML을 확인할 수 있다.

```yaml
apiVersion: autoscaling/v2beta2
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
  namespace: default
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

또한, `AverageUtilization` 대신 `AverageValue`의 `target` 타입을,
그리고 `target.averageUtilization` 대신 `target.averageValue`로 설정하여
자원 메트릭을 퍼센트 대신 값으로 명시할 수 있다.

파드 메트릭과 오브젝트 메트릭 두 가지의 *사용자 정의 메트릭* 이 있다.
파드 메트릭과 오브젝트 메트릭. 이 메트릭은 클러스터에 특화된 이름을 가지고 있으며,
더 고급화된 클러스터 모니터링 설정이 필요하다.

이러한 대체 메트릭 타입중 첫 번째는 *파드 메트릭* 이다.
이 메트릭은 파드들을 설명하고, 파드들간의 평균을 내며,
대상 값과 비교하여 레플리카 개수를 결정한다.

이것들은 `AverageValue`의 `target`만을 지원한다는 것을 제외하면,
자원 메트릭과 매우 유사하게 동작한다.

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
    apiVersion: networking.k8s.io/v1beta1
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
apiVersion: autoscaling/v2beta2
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
  namespace: default
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
        apiVersion: networking.k8s.io/v1beta1
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
        apiVersion: networking.k8s.io/v1beta1
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
    name: `http_requests`
    selector: `verb=GET`
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
위의 예제처럼 `name`과 `selector`를 갖는 `metric` 블록을 제공하고,
`Object` 대신에 `External` 메트릭 타입을 사용한다.
만일 여러개의 시계열이 `metricSelector`와 일치하면, HorizontalPodAutoscaler가 값의 합을 사용한다.
외부 메트릭들은 `Value`와 `AverageValue` 대상 타입을 모두 지원하고,
`Object` 타입을 사용할 때와 똑같이 동작한다.

예를 들면 애플리케이션이 호스팅 된 대기열 서비스에서 작업을 처리하는 경우,
다음과 같이 HorizontalPodAutoscaler 매니퍼스트에 30개의 미해결 태스크 당 한 개의 워커를 지정하도록 추가할 수 있다.

```yaml
- type: External
  external:
    metric:
      name: queue_messages_ready
      selector: "queue=worker_tasks"
    target:
      type: AverageValue
      averageValue: 30
```

가능하다면, 외부 메트릭 대신 사용자 정의 메트릭 대상 타입을 사용하길 권장한다.
왜냐하면, 클러스터 관리자가 사용자 정의 메트릭 API를 보안관점에서 더 쉽게 보호할 수 있기 때문이다.
외부 메트릭 API는 잠재적으로 어떠한 메트릭에도 접근할 수 있기에, 클러스터 관리자는 API를 노출시킬때 신중해야 한다.

## 부록: Horizontal Pod Autoscaler 상태 조건

HorizontalPodAutoscaler의 `autoscaling/v2beta2` 형식을 사용하면,
HorizontalPodAutoscaler에서 쿠버네티스가 설정한 *상태 조건* 을 확인할 수 있다.
이 상태 조건들은 HorizontalPodAutoscaler가 스케일을 할 수 있는지,
어떤 방식으로든 제한되어 있는지 여부를 나타낸다.

이 조건은 `status.conditions`에 나타난다.
HorizontalPodAutoscaler에 영향을 주는 조건을 보기 위해 `kubectl describe hpa`를 사용할 수 있다.

```shell
kubectl describe hpa cm-test
```
```shell
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
두 번째 `ScalingActive`는 HPA가 활성화되어있는지(즉 대상 레플리카 개수가 0이 아닌지),
원하는 스케일을 계산할 수 있는지 여부를 나타낸다. 만약 `False` 인 경우,
일반적으로 메트릭을 가져오는데 문제가 있다.
마지막으로, 마지막 조건인 `ScalingLimited`는
원하는 스케일 한도가 HorizontalPodAutoscaler의 최대/최소값으로 제한돼있음을 나타낸다.
이는 HorizontalPodAutoscaler에서 레플리카의 개수 제한을 최대/최소값으로 올리거나 낮추려는 것이다.

## 부록: 수량

HorizontalPodAutoscaler와 메트릭 API에서 모든 메트릭은
쿠버네티스에서 사용하는 *수량* 숫자 표기법을 사용한다.
예를 들면, `10500m` 수량은 10진법 `10.5`으로 쓰인다.
메트릭 API들은 가능한 경우 접미사 없이 정수를 반환하며,
일반적으로 수량을 밀리단위로 반환한다.
10진수로 표현했을때, `1`과 `1500m` 또는 `1`과 `1.5` 로 메트릭 값을 나타낼 수 있다.
더 많은 정보를 위해서는 [수량에 관한 용어집](/docs/reference/glossary?core-object=true#term-quantity) 을 참고하기 바란다.

## 부록: 다른 가능한 시나리오

### 명시적으로 오토스케일러 만들기

HorizontalPodAutoscaler를 생성하기 위해 `kubectl autoscale` 명령어를 사용하지 않고,
명시적으로 다음 파일을 사용하여 만들 수 있다.

{{< codenew file="application/hpa/php-apache.yaml" >}}

다음 명령어를 실행하여 오토스케일러를 생성할 것이다.

```shell
kubectl create -f https://k8s.io/examples/application/hpa/php-apache.yaml
```
```
horizontalpodautoscaler.autoscaling/php-apache created
```

{{% /capture %}}
