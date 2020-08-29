---
title: 네임스페이스에 대한 메모리 및 CPU 쿼터 구성
content_type: task
weight: 50
---


<!-- overview -->

이 페이지는 네임스페이스에서 실행 중인 모든 컨테이너가 사용할 수 있는
총 메모리 및 CPU 양에 대한 쿼터를 설정하는 방법을 보여준다.
[리소스쿼터(ResourceQuota)](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcequota-v1-core)
오브젝트에 쿼터를 지정한다.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

클러스터의 각 노드에는 최소 1GiB의 메모리가 있어야 한다.




<!-- steps -->

## 네임스페이스 생성

이 연습에서 생성한 리소스가 클러스터의 나머지와
격리되도록 네임스페이스를 생성한다.

```shell
kubectl create namespace quota-mem-cpu-example
```

## 리소스쿼터 생성

다음은 리소스쿼터 오브젝트의 구성 파일이다.

{{< codenew file="admin/resource/quota-mem-cpu.yaml" >}}

리소스쿼터를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-mem-cpu.yaml --namespace=quota-mem-cpu-example
```

리소스쿼터에 대한 자세한 정보를 본다.

```shell
kubectl get resourcequota mem-cpu-demo --namespace=quota-mem-cpu-example --output=yaml
```

리소스쿼터는 이러한 요구 사항을 quota-mem-cpu-example 네임스페이스에 배치한다.

* 모든 컨테이너에는 메모리 요청량(request), 메모리 상한(limit), CPU 요청량 및 CPU 상한이 있어야 한다.
* 모든 컨테이너에 대한 총 메모리 요청량은 1GiB를 초과하지 않아야 한다.
* 모든 컨테이너에 대한 총 메모리 상한은 2GiB를 초과하지 않아야 한다.
* 모든 컨테이너에 대한 총 CPU 요청량은 1 cpu를 초과해서는 안된다.
* 모든 컨테이너에 대한 총 CPU 상한은 2 cpu를 초과해서는 안된다.

## 파드 생성

파드의 구성 파일은 다음과 같다.

{{< codenew file="admin/resource/quota-mem-cpu-pod.yaml" >}}


파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-mem-cpu-pod.yaml --namespace=quota-mem-cpu-example
```

파드의 컨테이너가 실행 중인지 확인한다.

```
kubectl get pod quota-mem-cpu-demo --namespace=quota-mem-cpu-example
```

다시 한 번, 리소스쿼터에 대한 자세한 정보를 본다.

```
kubectl get resourcequota mem-cpu-demo --namespace=quota-mem-cpu-example --output=yaml
```

출력 결과는 쿼터와 사용된 쿼터를 함께 보여준다.
파드의 메모리와 CPU 요청량 및 상한이 쿼터를 초과하지 않은 것을
볼 수 있다.

```
status:
  hard:
    limits.cpu: "2"
    limits.memory: 2Gi
    requests.cpu: "1"
    requests.memory: 1Gi
  used:
    limits.cpu: 800m
    limits.memory: 800Mi
    requests.cpu: 400m
    requests.memory: 600Mi
```

## 두 번째 파드 생성 시도

다음은 두 번째 파드의 구성 파일이다.

{{< codenew file="admin/resource/quota-mem-cpu-pod-2.yaml" >}}

구성 파일에서, 파드의 메모리 요청량이 700MiB임을 알 수 있다.
사용된 메모리 요청량과 이 새 메모리 요청량의 합계가
메모리 요청량 쿼터를 초과한다. 600MiB + 700MiB > 1GiB

파드 생성을 시도한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-mem-cpu-pod-2.yaml --namespace=quota-mem-cpu-example
```

두 번째 파드는 생성되지 않는다. 출력 결과는 두 번째 파드를 생성하면
메모리 요청량의 총 합계가 메모리 요청량 쿼터를 초과함을 보여준다.

```
Error from server (Forbidden): error when creating "examples/admin/resource/quota-mem-cpu-pod-2.yaml":
pods "quota-mem-cpu-demo-2" is forbidden: exceeded quota: mem-cpu-demo,
requested: requests.memory=700Mi,used: requests.memory=600Mi, limited: requests.memory=1Gi
```

## 토론

이 연습에서 보았듯이, 리소스쿼터를 사용하여
네임스페이스에서 실행 중인 모든 컨테이너에 대한 메모리 요청량의 총 합계를 제한할 수 있다.
메모리 상한, CPU 요청량 및 CPU 상한의 총 합계를 제한할 수도 있다.

모든 컨테이너에 대한 합계 대신 개별 컨테이너를 제한하려면,
[리밋레인지(LimitRange)](/ko/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)를 사용한다.

## 정리

네임스페이스를 삭제한다.

```shell
kubectl delete namespace quota-mem-cpu-example
```



## {{% heading "whatsnext" %}}


### 클러스터 관리자를 위한 문서

* [네임스페이스에 대한 기본 메모리 요청량과 상한 구성](/ko/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [네임스페이스에 대한 기본 CPU 요청량과 상한 구성](/ko/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [네임스페이스에 대한 메모리의 최소 및 최대 제약 조건 구성](/ko/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [네임스페이스에 대한 CPU의 최소 및 최대 제약 조건 구성](/ko/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [네임스페이스에 대한 파드 쿼터 구성](/ko/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [API 오브젝트에 대한 쿼터 구성](/docs/tasks/administer-cluster/quota-api-object/)

### 앱 개발자를 위한 문서

* [컨테이너 및 파드 메모리 리소스 할당](/ko/docs/tasks/configure-pod-container/assign-memory-resource/)

* [컨테이너 및 파드 CPU 리소스 할당](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [파드에 대한 서비스 품질(QoS) 구성](/ko/docs/tasks/configure-pod-container/quality-service-pod/)
