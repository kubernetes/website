---
title: Horizontal Pod Autoscaler 워크스루
content_template: templates/task
weight: 100
---

{{% capture overview %}}

Horizontal Pod Autoscaler는 CPU 사용량(또는 베타 지원의 다른 어플리케이션 지원 메트릭)을 관찰하여 레플리케이션 컨트롤러, 디플로이먼트 또는 레플리카 셋의 파드 개수를 자동으로 스케일한다.

이 문서는 php-apache 서버를 대상으로 Horizontal Pod Autoscaler를 동작해보는 예제이다. Horizontal Pod Autoscaler 동작과 관련된 더 많은 정보를 위해서는 [Horizontal Pod Autoscaler 사용자 가이드](/docs/tasks/run-application/horizontal-pod-autoscale/)를 참고하기 바란다.

{{% /capture %}}



{{% capture prerequisites %}}

이 예제는 버전 1.2 또는 이상의 쿠버네티스 클러스터와 kubectl을 필요로 한다. 또한 자원 메트릭스 API인
[메트릭스-서버](https://github.com/kubernetes-incubator/metrics-server/) 모니터링 서비스가 필요한데, 이는 Horizontal Pod Autoscaler가 메트릭스를 수집할때 해당 API를 사용한다. ([GCE 가이드](/docs/setup/turnkey/gce/)로 클러스터를 올리는 경우 메트릭스-서버 모니터링은 디폴트로 활성화된다.)

Horizontal Pod Autoscaler에 다양한 자원 메트릭스를 적용하고자 하는 경우, 버전 1.6 또는 이상의 쿠버네티스 클러스터와 kubectl를 사용해야한다. 또한, 사용자 정의 메트릭스를 사용하기 위해서는, 당신의 클러스터가 사용자 정의 메트릭스 API를 제공하는 API서버와 통신할 수 있어야 한다. 마지막으로, 쿠버네티스 오브젝트와 관련이 없는 메트릭스를 사용하는 경우 버전 1.10 또는 이상의 쿠버네티스 클러스터와 kubectl을 사용해야하며, 외부 메트릭스 API와 통신이 가능해야한다. 자세한 사항은 [Horizontal Pod Autoscaler 사용자 가이드](/docs/tasks/run-application/horizontal-pod-autoscale/#support-for-custom-metrics)를 참고하길 바란다.

{{% /capture %}}

{{% capture steps %}}

## Run & expose php-apache 서버

Horizontal Pod Autoscaler 시연을 위해 php-apache 이미지를 커스터마이징한 Docker 이미지를 사용한다.
Dockerfile은 다음과 같다:


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

첫번째 단계로, 이미지를 배포하고 서비스로 노출시킨다:

```shell
$ kubectl run php-apache --image=k8s.gcr.io/hpa-example --requests=cpu=200m --expose --port=80
service/php-apache created
deployment.apps/php-apache created
```

## Horizontal Pod Autoscaler 생성

이제 서비스가 동작중이므로, [kubectl autoscale](https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/docs/user-guide/kubectl/kubectl_autoscale.md)를 사용하여 오토스케일러를 생성한다. 다음 명령어는 첫번째 스탭에서 만든 php-apache 디플로이먼트를 Horizontal Pod Autoscaler의 생성을 통해 파드 개수를 1부터 10사이로 유지한다.
간략히 얘기하면, HPA는 (디플로이먼트를 통한) 평균 CPU 사용량을 50%로 유지하기 위하여 리플리카의 개수를 늘리고 줄인다. ([kubectl run](https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/docs/user-guide/kubectl/kubectl_run.md)으로 각 파드의 CPU요청은 200밀리코어까지 할 수 있고, 따라서 여기서 말하는 평균 CPU 사용은 100밀리코어를 말한다.) 이에 대한 자세한 알고리즘은 [여기](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#autoscaling-algorithm)를 참고하기 바란다.

```shell
$ kubectl autoscale deployment php-apache --cpu-percent=50 --min=1 --max=10
horizontalpodautoscaler.autoscaling/php-apache autoscaled
```

실행중인 오토스케일러의 현재 상태를 체크해본다:
```shell
$ kubectl get hpa
NAME         REFERENCE                     TARGET    MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   0% / 50%  1         10        1          18s

```

아직 서버로 어떠한 요청도 하지 않았기 때문에, 현재 CPU 소비는 0%임을 확인할 수 있다 (``CURRENT``은 디플로이먼트에 의해 제어되는 파드들의 평균을 나타낸다).

## 부하 증가

이번에는 오토스케일러가 부하가 증가함에 따라 어떻게 반응하는지를 살펴볼 것이다. 먼저 컨테이너를 하나 실행하고, php-apache 서비스에 무한루프로 요청하는 쿼리를 수행한다(다른 터미널을 열어 수행하기 바란다):


```shell
$ kubectl run -i --tty load-generator --image=busybox /bin/sh

Hit enter for command prompt

$ while true; do wget -q -O- http://php-apache.default.svc.cluster.local; done
```

실행후, 약 1분내에 CPU 부하가 올라가는 것을 볼 수 있다:

```shell
$ kubectl get hpa
NAME         REFERENCE                     TARGET      CURRENT   MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   305% / 50%  305%      1         10        1          3m

```

CPU 소비가 305%까지 증가하였다. 결과적으로, 디플로이먼트의 리플리카 개수는 7개까지 증가하였다:

```shell
$ kubectl get deployment php-apache
NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
php-apache   7         7         7            7           19m
```

**Note** 때로는 리플리카의 개수를 안정화시키는데 몇 분이 걸릴 수 있다. 부하의 양은 환경에 따라 다르기 때문에, 최종 리플리카의 개수는 본 예제와 다를 수 있다.

## 부하 중지

본 예제를 마무리하기 위해 부하를 중단시킨다.
`busybox` 컨테이너를 띄운 터미널에서, `<Ctrl> + C`로 부하 발생을 중단시킨다. 그런 다음 (몇 분 후에) 결과를 확인한다:

```shell
$ kubectl get hpa
NAME         REFERENCE                     TARGET       MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   0% / 50%     1         10        1          11m

$ kubectl get deployment php-apache
NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
php-apache   1         1         1            1           27m
```

CPU 사용량은 0으로 떨어졌고, HPA는 리플리카의 개수를 1로 낮췄다.

{{< note >}}
**Note** 리플리카 오토스케일링은 몇 분 정도 소요된다.
{{< /note >}}

{{% /capture %}}

{{% capture discussion %}}

## 다양한 메트릭스를 기초로한 오토스케일링과 사용자 정의 메트릭스

`php-apache` 디플로이먼트를 오토스케일링할 때 `autoscaling/v2beta2` API 버전을 사용하여 추가적인 메트릭스를 제공할 수 있다.

첫번째로, `autoscaling/v2beta2` 폼으로 당신의 현재 HorizontalPodAutoscaler YAML 파일을 생성한다:

```shell
$ kubectl get hpa.v2beta2.autoscaling -o yaml > /tmp/hpa-v2.yaml
```

에디터로 `/tmp/hpa-v2.yaml` 파일을 열고 다음과 같이 YAML이 정의돼 있는 것을 확인한다:

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

`targetCPUUtilizationPercentage` 필드가 `metrics` 배열로 대체되었다. CPU 사용량 메트릭은 *resource metric* 으로 파드 컨테이너 자원의 백분율로 표현된다. CPU외에 다른 메트릭을 지정할 수 있는데, 기본적으로 지원되는 다른 메트릭은 메모리뿐이다. 이 자원들은 한 클러스터에서 다른 클러스터로 이름을 변경할 수 없으며, `metrics.k8s.io` API가 가용한 경우 언제든지 사용할 수 있어야 한다.



You can also specify resource metrics in terms of direct values, instead of as percentages of the
requested value, by using a `target` type of `AverageValue` instead of `AverageUtilization`, and
setting the corresponding `target.averageValue` field instead of the `target.averageUtilization`.

There are two other types of metrics, both of which are considered *custom metrics*: pod metrics and
object metrics.  These metrics may have names which are cluster specific, and require a more
advanced cluster monitoring setup.

The first of these alternative metric types is *pod metrics*.  These metrics describe pods, and
are averaged together across pods and compared with a target value to determine the replica count.
They work much like resource metrics, except that they *only* support a `target` type of `AverageValue`.

Pod metrics are specified using a metric block like this:

```yaml
type: Pods
pods:
  metric:
    name: packets-per-second
  target:
    type: AverageValue
    averageValue: 1k
```

The second alternative metric type is *object metrics*. These metrics describe a different
object in the same namespace, instead of describing pods. The metrics are not necessarily
fetched from the object; they only describe it. Object metrics support `target` types of
both `Value` and `AverageValue`.  With `Value`, the target is compared directly to the returned
metric from the API. With `AverageValue`, the value returned from the custom metrics API is divided
by the number of pods before being compared to the target. The following example is the YAML
representation of the `requests-per-second` metric.

```yaml
type: Object
object:
  metric:
    name: requests-per-second
  describedObject:
    apiVersion: extensions/v1beta1
    kind: Ingress
    name: main-route
  target:
    type: Value
    value: 2k
```

If you provide multiple such metric blocks, the HorizontalPodAutoscaler will consider each metric in turn.
The HorizontalPodAutoscaler will calculate proposed replica counts for each metric, and then choose the
one with the highest replica count.

For example, if you had your monitoring system collecting metrics about network traffic,
you could update the definition above using `kubectl edit` to look like this:

```yaml
apiVersion: autoscaling/v2beta1
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
        kind: AverageUtilization
        averageUtilization: 50
  - type: Pods
    pods:
      metric:
        name: packets-per-second
      targetAverageValue: 1k
  - type: Object
    object:
      metric:
        name: requests-per-second
      describedObject:
        apiVersion: extensions/v1beta1
        kind: Ingress
        name: main-route
      target:
        kind: Value
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
        apiVersion: extensions/v1beta1
        kind: Ingress
        name: main-route
      current:
        value: 10k
```

Then, your HorizontalPodAutoscaler would attempt to ensure that each pod was consuming roughly
50% of its requested CPU, serving 1000 packets per second, and that all pods behind the main-route
Ingress were serving a total of 10000 requests per second.

### Autoscaling on more specific metrics

Many metrics pipelines allow you to describe metrics either by name or by a set of additional
descriptors called _labels_. For all non-resource metric types (pod, object, and external,
described below), you can specify an additional label selector which is passed to your metric
pipeline. For instance, if you collect a metric `http_requests` with the `verb`
label, you can specify the following metric block to scale only on GET requests:

```yaml
type: Object
object:
  metric:
    name: `http_requests`
    selector: `verb=GET`
```

This selector uses the same syntax as the full Kubernetes label selectors. The monitoring pipeline
determines how to collapse multiple series into a single value, if the name and selector
match multiple series. The selector is additive, and cannot select metrics
that describe objects that are **not** the target object (the target pods in the case of the `Pods`
type, and the described object in the case of the `Object` type).

### Autoscaling on metrics not related to Kubernetes objects

Applications running on Kubernetes may need to autoscale based on metrics that don't have an obvious
relationship to any object in the Kubernetes cluster, such as metrics describing a hosted service with
no direct correlation to Kubernetes namespaces. In Kubernetes 1.10 and later, you can address this use case
with *external metrics*.

Using external metrics requires knowledge of your monitoring system; the setup is
similar to that required when using custom metrics. External metrics allow you to autoscale your cluster
based on any metric available in your monitoring system. Just provide a `metric` block with a
`name` and `selector`, as above, and use the `External` metric type instead of `Object`.
If multiple time series are matched by the `metricSelector`,
the sum of their values is used by the HorizontalPodAutoscaler.
External metrics support both the `Value` and `AverageValue` target types, which function exactly the same
as when you use the `Object` type.

For example if your application processes tasks from a hosted queue service, you could add the following
section to your HorizontalPodAutoscaler manifest to specify that you need one worker per 30 outstanding tasks.

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

When possible, it's preferable to use the custom metric target types instead of external metrics, since it's
easier for cluster administrators to secure the custom metrics API.  The external metrics API potentially allows
access to any metric, so cluster administrators should take care when exposing it.

## Appendix: Horizontal Pod Autoscaler Status Conditions

When using the `autoscaling/v2beta2` form of the HorizontalPodAutoscaler, you will be able to see
*status conditions* set by Kubernetes on the HorizontalPodAutoscaler.  These status conditions indicate
whether or not the HorizontalPodAutoscaler is able to scale, and whether or not it is currently restricted
in any way.

The conditions appear in the `status.conditions` field.  To see the conditions affecting a HorizontalPodAutoscaler,
we can use `kubectl describe hpa`:

```shell
$ kubectl describe hpa cm-test
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

For this HorizontalPodAutoscaler, we can see several conditions in a healthy state.  The first,
`AbleToScale`, indicates whether or not the HPA is able to fetch and update scales, as well as
whether or not any backoff-related conditions would prevent scaling.  The second, `ScalingActive`,
indicates whether or not the HPA is enabled (i.e. the replica count of the target is not zero) and
is able to calculate desired scales. When it is `False`, it generally indicates problems with
fetching metrics.  Finally, the last condition, `ScalingLimited`, indicates that the desired scale
was capped by the maximum or minimum of the HorizontalPodAutoscaler.  This is an indication that
you may wish to raise or lower the minimum or maximum replica count constraints on your
HorizontalPodAutoscaler.

## Appendix: Quantities

All metrics in the HorizontalPodAutoscaler and metrics APIs are specified using
a special whole-number notation known in Kubernetes as a *quantity*.  For example,
the quantity `10500m` would be written as `10.5` in decimal notation.  The metrics APIs
will return whole numbers without a suffix when possible, and will generally return
quantities in milli-units otherwise.  This means you might see your metric value fluctuate
between `1` and `1500m`, or `1` and `1.5` when written in decimal notation.  See the
[glossary entry on quantities](/docs/reference/glossary?core-object=true#term-quantity) for more information.

## Appendix: Other possible scenarios

### Creating the autoscaler declaratively

Instead of using `kubectl autoscale` command to create a HorizontalPodAutoscaler imperatively we
can use the following file to create it declaratively:

{{< codenew file="application/hpa/php-apache.yaml" >}}

We will create the autoscaler by executing the following command:

```shell
$ kubectl create -f https://k8s.io/examples/application/hpa/php-apache.yaml
horizontalpodautoscaler.autoscaling/php-apache created
```

{{% /capture %}}
