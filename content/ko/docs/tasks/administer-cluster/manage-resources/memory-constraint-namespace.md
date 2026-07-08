---
title: 네임스페이스에 대한 메모리의 최소 및 최대 제약 조건 구성
content_type: task
weight: 30
description: >-
  한 네임스페이스 내에서 메모리 리소스 제한의 유효한 범위를 정의하며, 
  이를 통해 해당 네임스페이스의 새로운 파드가 미리 설정한 범위 안에 들어오도록 한다.
---


<!-- overview -->

이 페이지는 {{< glossary_tooltip text="네임스페이스" term_id="namespace" >}}에서 
실행되는 컨테이너가 사용하는 메모리의 최솟값과 최댓값을 설정하는 방법을 보여준다.
[리밋레인지(LimitRange)](/docs/reference/kubernetes-api/policy-resources/limit-range-v1/)
오브젝트에 최소 및 최대 메모리 값을
지정한다. 파드가 리밋레인지에 의해 부과된 제약 조건을 충족하지 않으면,
네임스페이스에서 생성될 수 없다.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

클러스터에 네임스페이스를 생성할 수 있는 권한이 있어야 한다.

클러스터의 각 노드에는 파드가 사용할 수 있는 메모리가 최소 1GiB 이상 있어야 한다.

<!-- steps -->

## 네임스페이스 생성

이 연습에서 생성한 리소스가 클러스터의 나머지와
격리되도록 네임스페이스를 생성한다.

```shell
kubectl create namespace constraints-mem-example
```

## 리밋레인지와 파드 생성

다음은 리밋레인지의 예시 매니페스트이다.

{{< codenew file="admin/resource/memory-constraints.yaml" >}}

리밋레인지를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints.yaml --namespace=constraints-mem-example
```

리밋레인지에 대한 자세한 정보를 본다.

```shell
kubectl get limitrange mem-min-max-demo-lr --namespace=constraints-mem-example --output=yaml
```

출력 결과는 예상대로 메모리의 최소 및 최대 제약 조건을 보여준다. 그러나
참고로 리밋레인지의 구성 파일에 기본값(default)을
지정하지 않아도 자동으로 생성된다.

```
  limits:
  - default:
      memory: 1Gi
    defaultRequest:
      memory: 1Gi
    max:
      memory: 1Gi
    min:
      memory: 500Mi
    type: Container
```

이제 `constraints-mem-example` 네임스페이스에 파드를 생성할 때마다,
쿠버네티스는 다음 단계를 수행한다.

* 해당 파드의 어떤 컨테이너도 자체 메모리 요청량(request)과 상한(limit)을 명시하지 않으면, 
컨트롤 플레인이 해당 컨테이너에 메모리 요청량과 상한의 기본값(default)을 지정한다.

* 해당 파드의 모든 컨테이너의 메모리 요청량이 최소 500 MiB 이상인지 확인한다.

* 해당 파드의 모든 컨테이너의 메모리 요청량이 1024 MiB(1 GiB)를 넘지 않는지 
  확인한다.

다음은 컨테이너가 하나인 파드의 매니페스트이다. 
파드 명세 내에, 파드의 유일한 컨테이너는 600 MiB의 메모리 요청량 및 800 MiB의 메모리 상한을 지정하고 있다. 
이는 리밋레인지에 의해 부과된 최소 및 최대 메모리 제약 조건을 충족시킨다.

{{< codenew file="admin/resource/memory-constraints-pod.yaml" >}}

파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod.yaml --namespace=constraints-mem-example
```

파드가 실행 중이고 컨테이너의 상태가 정상인지 확인한다.

```shell
kubectl get pod constraints-mem-demo --namespace=constraints-mem-example
```

파드에 대한 자세한 정보를 본다.

```shell
kubectl get pod constraints-mem-demo --output=yaml --namespace=constraints-mem-example
```

출력을 보면 파드의 컨테이너의 메모리 요청량이 600 MiB이고 메모리 상한이 800 MiB임을 알 수 있다.
이는 리밋레인지에 의해 해당 네임스페이스에 부과된 제약 조건을 
만족시킨다.

```yaml
resources:
  limits:
     memory: 800Mi
  requests:
    memory: 600Mi
```

파드를 삭제한다.

```shell
kubectl delete pod constraints-mem-demo --namespace=constraints-mem-example
```

## 최대 메모리 제약 조건을 초과하는 파드 생성 시도

다음은 컨테이너가 하나인 파드의 매니페스트이다. 
컨테이너는 800MiB의 메모리 요청량과 1.5GiB의 메모리 상한을 지정하고 있다.

{{< codenew file="admin/resource/memory-constraints-pod-2.yaml" >}}

파드 생성을 시도한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-2.yaml --namespace=constraints-mem-example
```

결과를 보면 파드가 생성되지 않은 것을 확인할 수 있으며, 
이는 해당 파드가 정의하고 있는 컨테이너가 허용된 것보다 더 많은 메모리를 요청하고 있기 때문이다.

```
Error from server (Forbidden): error when creating "examples/admin/resource/memory-constraints-pod-2.yaml":
pods "constraints-mem-demo-2" is forbidden: maximum memory usage per Container is 1Gi, but limit is 1536Mi.
```

## 최소 메모리 요청량을 충족하지 않는 파드 생성 시도

다음은 컨테이너가 하나인 파드의 매니페스트이다.
컨테이너는 100MiB의 메모리 요청량과 800MiB의 메모리 상한을 지정하고 있다.

{{< codenew file="admin/resource/memory-constraints-pod-3.yaml" >}}

파드 생성을 시도한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-3.yaml --namespace=constraints-mem-example
```

결과를 보면 파드가 생성되지 않은 것을 확인할 수 있으며, 
이는 해당 파드가 정의하고 있는 컨테이너가 지정된 최저 메모리 요청량보다도 낮은 메모리 요청량을 지정하고 있기 때문이다.

```
Error from server (Forbidden): error when creating "examples/admin/resource/memory-constraints-pod-3.yaml":
pods "constraints-mem-demo-3" is forbidden: minimum memory usage per Container is 500Mi, but request is 100Mi.
```

## 메모리 요청량 또는 상한을 지정하지 않은 파드 생성

다음은 컨테이너가 하나인 파드의 매니페스트이다. 
해당 컨테이너는 메모리 요청량과 상한을 지정하지 않는다.

{{< codenew file="admin/resource/memory-constraints-pod-4.yaml" >}}

파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-4.yaml --namespace=constraints-mem-example
```

파드에 대한 자세한 정보를 본다.

```shell
kubectl get pod constraints-mem-demo-4 --namespace=constraints-mem-example --output=yaml
```

출력을 보면 파드의 유일한 컨테이너에 대한 메모리 요청량이 1 GiB이고 메모리 상한도 1 GiB이다.
이 컨테이너는 어떻게 이런 값을 얻었을까?

```
resources:
  limits:
    memory: 1Gi
  requests:
    memory: 1Gi
```

파드가 해당 컨테이너에 대해 메모리 요청량과 상한을 지정하지 않았으므로, 
클러스터가 리밋레인지로부터 
[메모리의 요청량과 상한 기본값](/ko/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)을 
적용하였다.

이는 곧 파드 정의에서 이 값들을 볼 수 있음을 의미한다. 
`kubectl describe` 명령을 사용하여 확인할 수 있다.

```shell
# 출력에서 "Requests:" 섹션을 확인한다
kubectl describe pod constraints-mem-demo-4 --namespace=constraints-mem-example
```

이 시점에서, 파드는 실행 중일 수도 있고 아닐 수도 있다. 이 태스크의 전제 조건은
노드에 최소 1GiB의 메모리가 있어야 한다는 것이다. 각 노드에
1GiB의 메모리만 있는 경우, 노드에 할당할 수 있는 메모리가 1GiB의 메모리 요청량을 수용하기에 충분하지
않을 수 있다. 메모리가 2GiB인 노드를 사용하는 경우에는, 메모리가
1GiB 요청량을 수용하기에 충분할 것이다.

파드를 삭제한다.

```shell
kubectl delete pod constraints-mem-demo-4 --namespace=constraints-mem-example
```

## 메모리의 최소 및 최대 제약 조건 적용

리밋레인지에 의해 네임스페이스에 부과된 메모리의 최대 및 최소 제약 조건은
파드를 생성하거나 업데이트할 때만 적용된다. 리밋레인지를 변경해도, 이전에 생성된
파드에는 영향을 미치지 않는다.

## 메모리의 최소 및 최대 제약 조건에 대한 동기

클러스터 관리자는 파드가 사용할 수 있는 메모리 양에 제한을 둘 수 있다.
예를 들면 다음과 같다.

* 클러스터의 각 노드에는 2GiB의 메모리가 있다. 클러스터의 어떤 노드도 2GiB 이상의 요청량을
지원할 수 없으므로, 2GiB 이상의 메모리를 요청하는 파드를 수락하지 않으려고 한다.

* 클러스터는 운영 부서와 개발 부서에서 공유한다.
프로덕션 워크로드가 최대 8GiB의 메모리를 소비하도록 하려면,
개발 워크로드를 512MiB로 제한해야 한다. 프로덕션 및 개발을 위해
별도의 네임스페이스를 만들고, 각 네임스페이스에 메모리 제약 조건을 적용한다.

## 정리

네임스페이스를 삭제한다.

```shell
kubectl delete namespace constraints-mem-example
```



## {{% heading "whatsnext" %}}


### 클러스터 관리자를 위한 문서

* [네임스페이스에 대한 기본 메모리 요청량과 상한 구성](/ko/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [네임스페이스에 대한 기본 CPU 요청량과 상한 구성](/ko/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [네임스페이스에 대한 CPU의 최소 및 최대 제약 조건 구성](/ko/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [네임스페이스에 대한 메모리 및 CPU 쿼터 구성](/ko/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [네임스페이스에 대한 파드 쿼터 구성](/ko/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [API 오브젝트에 대한 쿼터 구성](/docs/tasks/administer-cluster/quota-api-object/)

### 앱 개발자를 위한 문서

* [컨테이너 및 파드 메모리 리소스 할당](/ko/docs/tasks/configure-pod-container/assign-memory-resource/)

* [컨테이너 및 파드 CPU 리소스 할당](/ko/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [파드에 대한 서비스 품질(QoS) 구성](/ko/docs/tasks/configure-pod-container/quality-service-pod/)
