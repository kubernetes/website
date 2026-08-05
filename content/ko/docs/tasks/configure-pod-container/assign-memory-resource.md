---
title: 컨테이너 및 파드 메모리 리소스 할당
content_type: task
weight: 10
---

<!-- overview -->

이 페이지는 메모리 *요청량* 과 메모리 *상한* 을 컨테이너에 어떻게 지정하는지 보여준다.
컨테이너는 요청량 만큼의 메모리 확보가 보장되나
상한보다 더 많은 메모리는 사용할 수 없다.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

클러스터의 각 노드에 최소 300 MiB 메모리가 있어야 한다.

이 페이지의 몇 가지 단계를 수행하기 위해서는 클러스터 내
[metrics-server](https://github.com/kubernetes-sigs/metrics-server)
서비스 실행이 필요하다. 이미 실행 중인 metrics-server가 있다면
다음 단계를 건너뛸 수 있다.

Minikube를 사용 중이라면, 다음 명령어를 실행해 metric-server를
활성화할 수 있다.

```shell
minikube addons enable metrics-server
```

metric-server가 실행 중인지 확인하거나 다른 제공자의 리소스 메트릭 API (`metrics.k8s.io`)를 확인하기 위해
다음의 명령어를 실행한다.

```shell
kubectl get apiservices
```

리소스 메트릭 API를 사용할 수 있다면 출력에
`metrics.k8s.io`에 대한 참조가 포함되어 있다.

```shell
NAME      
v1beta1.metrics.k8s.io
```



<!-- steps -->

## 네임스페이스 생성

이 예제에서 생성할 자원과 클러스터 내 나머지를 분리하기 위해
네임스페이스를 생성한다.

```shell
kubectl create namespace mem-example
```

## 메모리 요청량 및 상한을 지정

컨테이너에 메모리 요청량을 지정하기 위해서는 컨테이너의 리소스 매니페스트에
`resources:requests` 필드를 포함한다. 리소스 상한을 지정하기 위해서는
`resources:limits` 필드를 포함한다.

이 예제에서 하나의 컨테이너를 가진 파드를 생성한다. 생성된 컨테이너는
100 MiB 메모리 요청량과 200 MiB 메모리 상한을 갖는다. 이 것이 파드 구성 파일이다.

{{< codenew file="pods/resource/memory-request-limit.yaml" >}}

구성 파일 내 `args` 섹션은 컨테이너가 시작될 때 아규먼트를 제공한다.
`"--vm-bytes", "150M"` 아규먼트는 컨테이너가 150 MiB 할당을 시도 하도록 한다.

파드 생성:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit.yaml --namespace=mem-example
```

파드 컨테이너가 실행 중인지 확인:

```shell
kubectl get pod memory-demo --namespace=mem-example
```

파드에 대한 자세한 정보 보기:

```shell
kubectl get pod memory-demo --output=yaml --namespace=mem-example
```

출력은 파드 내 하나의 컨테이너에 100MiB 메모리 요청량과
200 MiB 메모리 상한이 있는 것을 보여준다.


```yaml
...
resources:
  requests:
    memory: 100Mi
  limits:
    memory: 200Mi
...
```

`kubectl top`을 실행하여 파드 메트릭 가져오기:

```shell
kubectl top pod memory-demo --namespace=mem-example
```

출력은 파드가 약 150 MiB 해당하는 약 162,900,000 바이트 메모리를 사용하는 것을 보여준다.
이는 파드의 100 MiB 요청 보다 많으나
파드의 200 MiB 상한보다는 적다.

```
NAME                        CPU(cores)   MEMORY(bytes)
memory-demo                 <something>  162856960
```

파드 삭제:

```shell
kubectl delete pod memory-demo --namespace=mem-example
```

## 컨테이너의 메모리 상한을 초과

노드 내 메모리가 충분하다면 컨테이너는 지정한 요청량보다 많은 메모리를 사용 할 수 있다. 그러나
컨테이너는 지정한 메모리 상한보다 많은 메모리를 사용할 수 없다. 만약 컨테이너가 지정한 메모리 상한보다
많은 메모리를 할당하면 해당 컨테이너는 종료 대상 후보가 된다. 만약 컨테이너가 지속적으로
지정된 상한보다 많은 메모리를 사용한다면, 해당 컨테이너는 종료된다. 만약 종료된 컨테이너가
재실행 가능하다면 다른 런타임 실패와 마찬가지로 kubelet에 의해 재실행된다.

이 예제에서는 상한보다 많은 메모리를 할당하려는 파드를 생성한다.
이 것은 50 MiB 메모리 요청량과 100 MiB 메모리 상한을 갖는
하나의 컨테이너를 갖는 파드의 구성 파일이다.

{{< codenew file="pods/resource/memory-request-limit-2.yaml" >}}

구성 파일의 `args` 섹션에서 컨테이너가
100 MiB 상한을 훨씬 초과하는 250 MiB의 메모리를 할당하려는 것을 볼 수 있다.

파드 생성:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit-2.yaml --namespace=mem-example
```

파드에 대한 자세한 정보 보기:

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

이 시점에 컨테이너가 실행되거나 종료되었을 수 있다. 컨테이너가 종료될 때까지 이전의 명령을 반복한다.

```shell
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          24s
```

컨테이너 상태의 상세 상태 보기:

```shell
kubectl get pod memory-demo-2 --output=yaml --namespace=mem-example
```

컨테이너가 메모리 부족 (OOM) 으로 종료되었음이 출력된다.

```yaml
lastState:
   terminated:
     containerID: 65183c1877aaec2e8427bc95609cc52677a454b56fcb24340dbd22917c23b10f
     exitCode: 137
     finishedAt: 2017-06-20T20:52:19Z
     reason: OOMKilled
     startedAt: null
```

이 예제에서 컨테이너는 재실행 가능하여 kubelet에 의해 재실행된다.
컨테이너가 종료되었다 재실행되는 것을 보기 위해 다음 명령을 몇 번 반복한다.

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

출력은 컨테이너의 종료, 재실행, 재종료, 재실행 등을 보여준다.

```
kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          37s
```
```

kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-2   1/1       Running   2          40s
```

파드 내역에 대한 상세 정보 보기:

```
kubectl describe pod memory-demo-2 --namespace=mem-example
```

컨테이너가 반복적으로 시작하고 실패 하는 출력을 보여준다.

```
... Normal  Created   Created container with id 66a3a20aa7980e61be4922780bf9d24d1a1d8b7395c09861225b0eba1b1f8511
... Warning BackOff   Back-off restarting failed container
```

클러스터 노드에 대한 자세한 정보 보기:

```
kubectl describe nodes
```

출력에는 컨테이너가 메모리 부족으로 종료된 기록이 포함된다.

```
Warning OOMKilling Memory cgroup out of memory: Kill process 4481 (stress) score 1994 or sacrifice child
```

파드 삭제:

```shell
kubectl delete pod memory-demo-2 --namespace=mem-example
```

## 노드에 비해 너무 큰 메모리 요청량의 지정

메모리 요청량과 상한은 컨테이너와 관련있지만, 파드가 가지는
메모리 요청량과 상한으로 이해하면 유용하다. 파드의 메모리 요청량은
파드 내 모든 컨테이너의 메모리 요청량의 합이다. 마찬가지로
파드의 메모리 상한은 파드 내 모든 컨테이너의 메모리 상한의 합이다.

파드는 요청량을 기반하여 스케줄링된다. 노드에 파드의 메모리 요청량을 충족하기에 충분한 메모리가 있는
경우에만 파드가 노드에서 스케줄링된다.

이 예제에서는 메모리 요청량이 너무 커 클러스터 내 모든 노드의 용량을 초과하는 파드를 생성한다.
다음은 클러스터 내 모든 노드의 용량을 초과할 수 있는 1000 GiB 메모리 요청을 포함하는
컨테이너를 갖는
파드의 구성 파일이다.

{{< codenew file="pods/resource/memory-request-limit-3.yaml" >}}

파드 생성:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit-3.yaml --namespace=mem-example
```

파드 상태 보기:

```shell
kubectl get pod memory-demo-3 --namespace=mem-example
```

파드 상태가 PENDING 상태임이 출력된다. 즉 파드는 어떤 노드에서도 실행되도록 스케줄 되지 않고 PENDING가 계속 지속된다.

```
kubectl get pod memory-demo-3 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-3   0/1       Pending   0          25s
```

이벤트를 포함한 파드 상세 정보 보기:

```shell
kubectl describe pod memory-demo-3 --namespace=mem-example
```

출력은 노드 내 메모리가 부족하여 파드가 스케줄링될 수 없음을 보여준다.

```
Events:
  ...  Reason            Message
       ------            -------
  ...  FailedScheduling  No nodes are available that match all of the following predicates:: Insufficient memory (3).
```

## 메모리 단위

메모리 리소스는 byte 단위로 측정된다. 다음 접미사 중 하나로 정수 또는 고정 소수점으로
메모리를 표시할 수 있다. E, P, T, G, M, K, Ei, Pi, Ti, Gi, Mi, Ki.
예를 들어 다음은 거의 유사한 값을 나타낸다.

```
128974848, 129e6, 129M, 123Mi
```

파드 삭제:

```shell
kubectl delete pod memory-demo-3 --namespace=mem-example
```

## 메모리 상한을 지정하지 않으면

컨테이너에 메모리 상한을 지정하지 않으면 다음 중 하나가 적용된다.

* 컨테이너가 사용할 수 있는 메모리 상한은 없다. 컨테이너가
실행 중인 노드에서 사용 가능한 모든 메모리를 사용하여 OOM Killer가 실행될 수 있다. 또한 메모리 부족으로 인한 종료 시 메모리 상한이 없는 컨테이너가 종료될 가능성이 크다.

* 기본 메모리 상한을 갖는 네임스페이스 내에서 실행중인 컨테이너는
자동으로 기본 메모리 상한이 할당된다. 클러스터 관리자들은
[LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core)를
사용해 메모리 상한의 기본 값을 지정 가능하다.

## 메모리 요청량과 상한 동기부여

클러스터에서 실행되는 컨테이너에 메모리 요청량과 상한을 구성하여
클러스터 내 노드들의 메모리 리소스를 효율적으로 사용할 수 있게 할 수 있다.
파드의 메모리 요청량을 적게 유지하여 파드가 높은 확률로 스케줄링 될 수 있도록 한다.
메모리 상한이 메모리 요청량보다 크면 다음 두 가지가 수행된다.

* 가용한 메모리가 있는 경우 파드가 이를 사용할 수 있는 버스트(burst) 활동을 할 수 있다.
* 파드가 버스트 중 사용 가능한 메모리 양이 적절히 제한된다.

## 정리

네임스페이스를 지운다. 이 작업을 통해 네임스페이스 내 생성했던 모든 파드들은 삭제된다.

```shell
kubectl delete namespace mem-example
```



## {{% heading "whatsnext" %}}


### 앱 개발자들을 위한

* [CPU 리소스를 컨테이너와 파드에 할당](/ko/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [파드에 서비스 품질 설정](/ko/docs/tasks/configure-pod-container/quality-service-pod/)

### 클러스터 관리자들을 위한

* [네임스페이스에 기본 메모리 요청량 및 상한을 구성](/ko/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [네임스페이스에 기본 CPU 요청량 및 상한을 구성](/ko/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [네임스페이스에 최소 및 최대 메모리 제약 조건 구성](/ko/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [네임스페이스에 최소 및 최대 CPU 제약 조건 구성](/ko/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [네임스페이스에 메모리 및 CPU 할당량 구성](/ko/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [네임스페이스에 파드 할당량 구성](/ko/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [API 오브젝트에 할당량 구성](/docs/tasks/administer-cluster/quota-api-object/)
