---
title: 네임스페이스에 대한 기본 메모리 요청량과 상한 구성
content_type: task
weight: 10
description: >-
  한 네임스페이스에 메모리 리소스 상한의 기본값을 정의하며, 
  이를 통해 미리 설정한 메모리 리소스 상한이 해당 네임스페이스의 새로운 파드에 설정되도록 한다.
---

<!-- overview -->

이 페이지는 {{< glossary_tooltip text="네임스페이스" term_id="namespace" >}}에 대한 
기본 메모리 요청량(request) 및 상한(limit)을 구성하는 방법을 보여준다.

쿠버네티스 클러스터를 여러 네임스페이스로 나눌 수 있다. 
기본 메모리 [상한](/ko/docs/concepts/configuration/manage-resources-containers/#요청-및-제한)이 
설정되어 있는 네임스페이스에 파드를 생성했는데, 
해당 파드의 모든 컨테이너에 메모리 상한이 명시되어 있지 않다면, 
{{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}}이 
해당 컨테이너에 
기본 메모리 상한을 할당한다.

쿠버네티스는 이 문서의 뒷부분에서 설명하는 특정 조건에서 기본 메모리 요청량을 할당한다.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

클러스터에 네임스페이스를 생성할 수 있는 권한이 있어야 한다.

클러스터의 각 노드에는 최소 2GiB의 메모리가 있어야 한다.



<!-- steps -->

## 네임스페이스 생성

이 연습에서 생성한 리소스가 클러스터의 다른 리소스와
격리되도록 네임스페이스를 생성한다.

```shell
kubectl create namespace default-mem-example
```

## 리밋레인지(LimitRange)와 파드 생성

다음은 예시 {{< glossary_tooltip text="리밋레인지" term_id="limitrange" >}}에 대한 매니페스트이다.
이 매니페스트는 기본 메모리 요청량 및 
기본 메모리 상한을 지정한다.

{{< codenew file="admin/resource/memory-defaults.yaml" >}}

default-mem-example 네임스페이스에 리밋레인지를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults.yaml --namespace=default-mem-example
```

이제 파드를 `default-mem-example` 네임스페이스에 생성하고, 
해당 파드의 어떤 컨테이너도 자체 메모리 요청량(request)과 상한(limit)을 명시하지 않으면, 
컨트롤 플레인이 해당 컨테이너에 메모리 요청량의 기본값(256 MiB)과 
상한의 기본값(512 MiB)을 지정한다.


다음은 컨테이너가 하나인 파드의 매니페스트이다. 
해당 컨테이너는 메모리 요청량과 상한을 지정하지 않는다.

{{< codenew file="admin/resource/memory-defaults-pod.yaml" >}}

파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod.yaml --namespace=default-mem-example
```

파드에 대한 자세한 정보를 본다.

```shell
kubectl get pod default-mem-demo --output=yaml --namespace=default-mem-example
```

출력 결과는 파드의 컨테이너에 256MiB의 메모리 요청량과
512MiB의 메모리 상한이 있음을 나타낸다. 이것은 리밋레인지에 의해 지정된 기본값이다.

```shell
containers:
- image: nginx
  imagePullPolicy: Always
  name: default-mem-demo-ctr
  resources:
    limits:
      memory: 512Mi
    requests:
      memory: 256Mi
```

파드를 삭제한다.

```shell
kubectl delete pod default-mem-demo --namespace=default-mem-example
```

## 컨테이너 상한은 지정하고, 요청량을 지정하지 않으면 어떻게 되나?

다음은 컨테이너가 하나인 파드의 매니페스트이다. 
해당 컨테이너는 메모리 상한은 지정하지만, 요청량은 지정하지 않는다.

{{< codenew file="admin/resource/memory-defaults-pod-2.yaml" >}}

파드를 생성한다.


```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-2.yaml --namespace=default-mem-example
```

파드에 대한 자세한 정보를 본다.

```shell
kubectl get pod default-mem-demo-2 --output=yaml --namespace=default-mem-example
```

출력 결과는 컨테이너의 메모리 요청량이 메모리 상한과 일치하도록 설정되었음을 보여준다.
참고로 컨테이너에는 기본 메모리 요청량의 값인 256Mi가 할당되지 않았다.

```
resources:
  limits:
    memory: 1Gi
  requests:
    memory: 1Gi
```

## 컨테이너의 요청량은 지정하고, 상한을 지정하지 않으면 어떻게 되나?

다음은 컨테이너가 하나인 파드의 예시 매니페스트이다. 
해당 컨테이너는 메모리 요청량은 지정하지만, 상한은 지정하지 않는다.

{{< codenew file="admin/resource/memory-defaults-pod-3.yaml" >}}

파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-3.yaml --namespace=default-mem-example
```

파드 사양을 확인한다.

```shell
kubectl get pod default-mem-demo-3 --output=yaml --namespace=default-mem-example
```

출력을 보면 컨테이너의 매니페스트에 명시한 값대로 컨테이너의 메모리 요청량이 설정된 것을 알 수 있다.
해당 컨테이너의 메모리 상한은 512 MiB로 설정되며, 
이는 네임스페이스의 메모리 상한 기본값과 일치한다.

```
resources:
  limits:
    memory: 512Mi
  requests:
    memory: 128Mi
```

{{< note >}}

`리밋레인지`는 적용되는 기본 값의 일관성을 검사하지 않는다. 이는 `리밋레인지`에 의해 설정된 _상한_의 기본값이 클라이언트가 API 서버에 제출하는 사양의 컨테이너에 대해 지정된 _요청량_ 값보다 작을 수 있음을 의미한다. 이 경우, 최종 파드는 스케줄링할 수 없다.
자세한 내용은 [리밋 레인지 개요](/ko/docs/concepts/policy/limit-range/#constraints-on-resource-limits-and-requests)를 참조한다.

{{< /note >}}


## 기본 메모리 상한 및 요청량에 대한 동기

네임스페이스에 {{< glossary_tooltip text="리소스 쿼터" term_id="resource-quota" >}}가 
설정되어 있는 경우,
메모리 상한에 기본값을 설정하는 것이 좋다.
다음은 리소스 쿼터가 네임스페이스에 적용하는 세 가지 제한 사항이다.

* 네임스페이스에서 실행되는 모든 파드에 대해, 모든 컨테이너에 메모리 상한이 있어야 한다.
  (파드의 모든 컨테이너에 대해 메모리 상한을 지정하면, 
  쿠버네티스가 파드 내의 컨테이너의 상한을 합산하여 파드-수준 메모리 상한을 추론할 수 있다.)
* 메모리 상한은 해당 파드가 스케줄링될 노드에 리소스 예약을 적용한다.
  해당 네임스페이스의 모든 파드에 대해 예약된 메모리 총량이 지정된 상한을 초과하지 않아야 한다.
* 해당 네임스페이스의 모든 파드가 실제로 사용하고 있는 메모리의 총량 또한 지정된 상한을 초과하지 않아야 한다.

리밋레인지를 추가할 때에는 다음을 고려해야 한다.

컨테이너를 갖고 있는 해당 네임스페이스의 파드가 자체 메모리 상한을 지정하지 않았다면, 
컨트롤 플레인이 해당 컨테이너에 메모리 상한 기본값을 적용하며, 
해당 파드는 메모리 리소스쿼터가 적용된 네임스페이스에서 실행되도록 허용될 수 있다.

## 정리

네임스페이스를 삭제한다.

```shell
kubectl delete namespace default-mem-example
```



## {{% heading "whatsnext" %}}


### 클러스터 관리자를 위한 문서

* [네임스페이스에 대한 기본 CPU 요청량과 상한 구성](/ko/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [네임스페이스에 대한 메모리의 최소 및 최대 제약 조건 구성](/ko/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [네임스페이스에 대한 CPU의 최소 및 최대 제약 조건 구성](/ko/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [네임스페이스에 대한 메모리 및 CPU 쿼터 구성](/ko/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [네임스페이스에 대한 파드 쿼터 구성](/ko/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [API 오브젝트에 대한 쿼터 구성](/docs/tasks/administer-cluster/quota-api-object/)

### 앱 개발자를 위한 문서

* [컨테이너 및 파드 메모리 리소스 할당](/ko/docs/tasks/configure-pod-container/assign-memory-resource/)

* [컨테이너 및 파드 CPU 리소스 할당](/ko/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [파드에 대한 서비스 품질(QoS) 구성](/ko/docs/tasks/configure-pod-container/quality-service-pod/)
