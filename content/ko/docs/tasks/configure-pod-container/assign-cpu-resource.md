---
title: 컨테이너 및 파드 CPU 리소스 할당
content_type: task
weight: 20
---

<!-- overview -->

이 페이지에서는 컨테이너의 CPU *요청량*과 CPU *상한*을 지정하는 방법을 보여준다.
컨테이너는 설정된 상한보다 더 많은 CPU는 사용할 수 없다.
제공된 시스템에 CPU 가용량이 남아있다면, 컨테이너는 요청량만큼의 CPU를 할당받는 것을
보장받는다.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

태스크 예제를 수행하기 위해서는 최소 1개의 CPU가 가용한 클러스터가 필요하다.

이 페이지의 몇 가지 단계를 수행하기 위해서는 클러스터 내
[metrics-server](https://github.com/kubernetes-sigs/metrics-server)
서비스 실행이 필요하다. 이미 실행 중인 metrics-server가 있다면
다음 단계를 건너뛸 수 있다.

{{< glossary_tooltip term_id="minikube" >}}를 사용 중이라면,
다음 명령어를 실행해 metric-server를 활성화할 수 있다.

```shell
minikube addons enable metrics-server
```

metric-server(아니면 `metrics.k8s.io`와 같은 다른 제공자의 리소스 메트릭 API)가
실행 중인지를 확인하기 위해 다음의 명령어를 실행한다.

```shell
kubectl get apiservices
```

리소스 메트릭 API를 사용할 수 있다면 출력에 `metrics.k8s.io`에
대한 참조가 포함되어 있을 것이다.


```
NAME
v1beta1.metrics.k8s.io
```




<!-- steps -->

## 네임스페이스 생성

이 예제에서 생성한 자원과 클러스터 내 나머지를 분리하기 위해
{{< glossary_tooltip term_id="namespace" >}}를 생성한다.

```shell
kubectl create namespace cpu-example
```

## CPU 요청량 및 상한 지정

컨테이너에 CPU 요청량을 지정하기 위해서는 컨테이너의 리소스 매니페스트에 `resources:requests`
필드를 포함한다. CPU 상한을 지정하기 위해서는 `resources:limits` 필드를 포함한다.

이 예제에서는, 하나의 컨테이너를 가진 파드를 생성한다.
컨테이너는 0.5 CPU 요청량과 1 CPU 상한을 갖는다. 아래는 파드의 구성 파일이다.

{{< codenew file="pods/resource/cpu-request-limit.yaml" >}}

구성 파일 내 `args` 섹션은 컨테이너가 시작될 때 인수(argument)를 제공한다.
`-cpus "2"` 인수는 컨테이너가 2 CPU 할당을 시도하도록 한다.

파드 생성:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit.yaml --namespace=cpu-example
```

파드가 실행 중인지 확인:

```shell
kubectl get pod cpu-demo --namespace=cpu-example
```

파드에 대한 자세한 정보 확인:

```shell
kubectl get pod cpu-demo --output=yaml --namespace=cpu-example
```

출력은 파드 내 하나의 컨테이너에 0.5 milliCPU 요청량과
1 CPU 상한이 있는 것을 보여준다.

```yaml
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 500m
```

`kubectl top`을 실행하여 파드 메트릭 가져오기:

```shell
kubectl top pod cpu-demo --namespace=cpu-example
```

출력은 파드가 974 milliCPU를 사용하는 것을 보여주는데,
이는 파드의 1 CPU 상한보다는 약간 적은 수치이다.

```
NAME                        CPU(cores)   MEMORY(bytes)
cpu-demo                    974m         <something>
```

만약 `-cpu "2"`로 설정한다면, 컨테이너가 2 CPU를 사용하도록 설정한 것이 된다. 하지만 컨테이너는 1 CPU까지만을 사용하도록 허용되어 있다는 사실을 기억하자. 컨테이너는 상한보다 더 많은 CPU 리소스를 사용하려고 하기 때문에, 컨테이너의 CPU 사용은 쓰로틀(throttled) 될 것이다.

{{< note >}}
CPU 사용이 1.0보다 낮은 것에 대한 또 다른 원인은, 노드에 충분한 CPU 리소스가 가용하지 않기 때문일 수도 있다.
"시작하기 전에"의 요구사항에서 이 예제를 위해 클러스터는 최소 1 CPU가 필요하다는 사실을 기억하자. 만약 컨테이너가 1 CPU 밖에 가지고 있지 않은 노드 위에서 실행된다면, 컨테이너는 자신에게 명시되어 있는 CPU 상한과 무관하게 1 CPU 이상으로 사용하지 못할 것이다.
{{< /note >}}

## CPU 단위(unit)

CPU 리소스는 _CPU_ 단위로 측정된다. 쿠버네티스에서 1 CPU는, 다음과 같다.

- 1 AWS vCPU
- 1 GCP Core
- 1 Azure vCore
- 1 하이퍼스레드 (베어메탈 서버의 하이퍼스레딩 인텔 프로세서)

분수 값도 가능하다. 0.5 CPU를 요청한 컨테이너는 1 CPU를 요청한 컨테이너 CPU의 절반 가량을 보장받는다.
접미사 m을 사용하여 밀리(milli)를 표현할 수도 있다. 예를 들어서 100m CPU, 100milliCPU,
그리고 0.1 CPU는 모두 같다. 1m보다 정밀한 표현은 허용하지 않는다.

CPU는 상대적인 수량이 아닌, 절대적인 수량으로 요청된다.
즉 0.1는 싱글 코어, 듀얼 코어, 48-코어 머신에서도 같은 양을 나타낸다.

파드 삭제:

```shell
kubectl delete pod cpu-demo --namespace=cpu-example
```

## 노드보다 훨씬 높은 CPU 요청량을 지정할 경우

CPU 요청량과 상한은 컨테이너와 연관되어 있지만,
파드가 CPU 요청량과 상한을 갖는다고 생각하는 것이 유용하다.
특정 파드의 CPU 요청량은 해당 파드의 모든 컨테이너 CPU 요청량의 합과 같다.
마찬가지로, 특정 파드의 CPU 상한은 해당 파드의 모든 컨테이너 CPU 상한의 합과 같다.

파드 스케줄링은 요청량에 따라 수행된다. 파드는 파드 CPU 요청량을 만족할 정도로
노드에 충분한 CPU 리소스가 있을 때에만 노드에 스케줄링한다.

이 예제에서는, 클러스터의 모든 노드 가용량을 초과하는 CPU 요청량을
가진 파드를 생성했다. 아래는 하나의 컨테이너를 가진 파드에 대한 설정 파일이다.
컨테이너는 100 CPU을 요청하고 있는데, 이것은 클러스터의 모든 노드 가용량을
초과하는 것이다.

{{< codenew file="pods/resource/cpu-request-limit-2.yaml" >}}

파드 생성:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit-2.yaml --namespace=cpu-example
```

파드 상태 확인:

```shell
kubectl get pod cpu-demo-2 --namespace=cpu-example
```

출력은 파드 상태가 Pending 상태임을 보여준다. 이것은 파드는 어떤 노드에서도 실행되도록
스케줄되지 않았고, 이후에도 Pending 상태가 지속될 것이라는 것을 의미한다.


```
NAME         READY     STATUS    RESTARTS   AGE
cpu-demo-2   0/1       Pending   0          7m
```

이벤트를 포함한 파드 상세 정보 확인:


```shell
kubectl describe pod cpu-demo-2 --namespace=cpu-example
```

출력은 노드의 CPU 리소스가 부족하여
파드가 스케줄링될 수 없음을 보여준다.


```
Events:
  Reason                        Message
  ------                        -------
  FailedScheduling      No nodes are available that match all of the following predicates:: Insufficient cpu (3).
```

파드 삭제:

```shell
kubectl delete pod cpu-demo-2 --namespace=cpu-example
```

## CPU 상한을 지정하지 않을 경우

컨테이너에 CPU 상한을 지정하지 않으면 다음 상황 중 하나가 발생한다.

- 컨테이너가 사용할 수 있는 CPU 리소스에 상한선이 없다.
  컨테이너는 실행 중인 노드에서 사용 가능한 모든 CPU 리소스를 사용해버릴 수도 있다.

- 기본 CPU 상한이 지정된 네임스페이스에서 실행 중인 컨테이너에는 해당 기본 상한이 자동으로
  할당된다. 클러스터 관리자들은
  [리밋레인지(LimitRange)](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core/)를 사용해
  CPU 상한의 기본 값을 지정할 수 있다.

## CPU 상한은 지정했지만 CPU 요청량을 지정하지 않을 경우

만약 CPU 상한은 지정했지만 CPU 요청량을 지정하지 않았다면, 쿠버네티스는 자동으로
상한에 맞는 CPU 요청량을 지정한다. 비슷하게, 컨테이너가 자신의 메모리 상한을 지정했지만
메모리 요청량을 지정하지 않았다면, 쿠버네티스는 자동으로 상한에 맞는
메모리 요청량을 지정한다.

## CPU 요청량 및 상한 개념 도입 동기

클러스터에서 실행되는 컨테이너에 CPU 요청량과 상한을 구성하면
클러스터 내 노드들의 가용 가능한 CPU 리소스를 효율적으로 사용할 수 있게 된다.
파드의 CPU 요청량을 낮게 유지하면 파드가 높은 확률로 스케줄링 될 수 있다.
CPU 상한이 CPU 요청량보다 크도록 설정한다면 다음 두 가지를 달성할 수 있다.

- 가용한 CPU 리소스가 있는 경우 파드가 이를 버스트(burst) 하여 사용할 수 있다.
- 파드가 버스트 중 사용할 수 있는 CPU 리소스 양을 적절히 제한할 수 있다.

## 정리

네임스페이스 삭제:

```shell
kubectl delete namespace cpu-example
```



## {{% heading "whatsnext" %}}



### 앱 개발자들을 위한 문서

- [컨테이너 및 파드 메모리 리소스 할당](/ko/docs/tasks/configure-pod-container/assign-memory-resource/)

- [파드에 대한 서비스 품질 구성](/ko/docs/tasks/configure-pod-container/quality-service-pod/)

### 클러스터 관리자들을 위한 문서

- [네임스페이스에 대한 기본 메모리 요청량과 상한 구성](/ko/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

- [네임스페이스에 대한 기본 CPU 요청량과 상한 구성](/ko/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

- [네임스페이스에 대한 메모리의 최소 및 최대 메모리 제약 조건 구성](/ko/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

- [네임스페이스에 대한 CPU의 최소 및 최대 제약 조건 구성](/ko/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

- [네임스페이스에 대한 메모리 및 CPU 쿼터 구성](/ko/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

- [네임스페이스에 대한 파드 쿼터 구성](/ko/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

- [API 오브젝트 할당량 구성](/docs/tasks/administer-cluster/quota-api-object/)


