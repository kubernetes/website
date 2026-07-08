---
title: 네임스페이스에 대한 기본 CPU 요청량과 상한 구성
content_type: task
weight: 20
description: >-
  한 네임스페이스에 CPU 리소스 상한의 기본값을 정의하며, 
  이를 통해 미리 설정한 CPU 리소스 상한이 해당 네임스페이스의 새로운 파드에 설정되도록 한다.
---

<!-- overview -->

이 페이지는 {{< glossary_tooltip text="네임스페이스" term_id="namespace" >}}에 대한 
기본 CPU 요청량(request) 및 상한(limit)을 구성하는 방법을 보여준다.

쿠버네티스 클러스터를 여러 네임스페이스로 나눌 수 있다. 
기본 CPU [상한](/ko/docs/concepts/configuration/manage-resources-containers/#요청-및-제한)이 
설정되어 있는 네임스페이스에 파드를 생성했는데, 
해당 파드의 모든 컨테이너에 CPU 상한이 명시되어 있지 않다면, 
{{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}}이 
해당 컨테이너에 기본 CPU 상한을 할당한다.

쿠버네티스는 기본 CPU 
[사용량](/ko/docs/concepts/configuration/manage-resources-containers/#요청-및-제한)을 할당하는데, 
이는 이 페이지의 이후 부분에서 설명될 특정 조건 하에서만 수행된다.

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

클러스터에 네임스페이스를 생성할 수 있는 권한이 있어야 한다.

쿠버네티스에서 “1.0 CPU”가 무엇을 의미하는지 익숙하지 않다면, 
[CPU의 의미](/ko/docs/concepts/configuration/manage-resources-containers/#cpu의-의미)를 참조한다.

<!-- steps -->

## 네임스페이스 생성

이 연습에서 생성한 리소스가 클러스터의 나머지와
격리되도록 네임스페이스를 생성한다.

```shell
kubectl create namespace default-cpu-example
```

## 리밋레인지(LimitRange)와 파드 생성

다음은 예시 {{< glossary_tooltip text="리밋레인지" term_id="limitrange" >}}에 대한 매니페스트이다.
이 매니페스트는 기본 CPU 요청량 및 기본 CPU 상한을 지정한다.

{{< codenew file="admin/resource/cpu-defaults.yaml" >}}

default-cpu-example 네임스페이스에 리밋레인지를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults.yaml --namespace=default-cpu-example
```

이제 파드를 `default-cpu-example` 네임스페이스에 생성하고, 
해당 파드의 어떤 컨테이너도 자체 CPU 요청량(request)과 상한(limit)을 명시하지 않으면, 
컨트롤 플레인이 해당 컨테이너에 CPU 요청량의 기본값(0.5)과 
상한의 기본값(1)을 지정한다.

다음은 컨테이너가 하나인 파드의 매니페스트이다. 
해당 컨테이너는 CPU 요청량과 상한을 지정하지 않는다.

{{< codenew file="admin/resource/cpu-defaults-pod.yaml" >}}

파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod.yaml --namespace=default-cpu-example
```

파드의 사양을 확인한다.

```shell
kubectl get pod default-cpu-demo --output=yaml --namespace=default-cpu-example
```

출력을 보면 파드 내 유일한 컨테이너의 CPU 요청량이 500m `cpu`("500 밀리cpu"로 읽을 수 있음)이고,
CPU 상한이 1 `cpu`임을 알 수 있다.
이것은 리밋레인지에 의해 지정된 기본값이다.

```shell
containers:
- image: nginx
  imagePullPolicy: Always
  name: default-cpu-demo-ctr
  resources:
    limits:
      cpu: "1"
    requests:
      cpu: 500m
```

## 컨테이너 상한은 지정하고, 요청량을 지정하지 않으면 어떻게 되나?

다음은 컨테이너가 하나인 파드의 매니페스트이다. 
해당 컨테이너는 CPU 상한은 지정하지만, 요청량은 지정하지 않는다.

{{< codenew file="admin/resource/cpu-defaults-pod-2.yaml" >}}

파드를 생성한다.


```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod-2.yaml --namespace=default-cpu-example
```

생성한 파드의 
[명세](/ko/docs/concepts/overview/working-with-objects/kubernetes-objects/#오브젝트-명세-spec-와-상태-status)를 확인한다.

```
kubectl get pod default-cpu-demo-2 --output=yaml --namespace=default-cpu-example
```

출력 결과는 컨테이너의 CPU 요청량이 CPU 상한과 일치하도록 설정되었음을 보여준다.
참고로 컨테이너에는 CPU 요청량의 기본값인 0.5 `cpu`가 할당되지 않았다.

```
resources:
  limits:
    cpu: "1"
  requests:
    cpu: "1"
```

## 컨테이너의 요청량은 지정하고, 상한을 지정하지 않으면 어떻게 되나?

다음은 컨테이너가 하나인 파드의 예시 매니페스트이다. 
해당 컨테이너는 CPU 요청량은 지정하지만, 상한은 지정하지 않는다.

{{< codenew file="admin/resource/cpu-defaults-pod-3.yaml" >}}

파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod-3.yaml --namespace=default-cpu-example
```

생성한 파드의 
[명세](/ko/docs/concepts/overview/working-with-objects/kubernetes-objects/#오브젝트-명세-spec-와-상태-status)를 확인한다.

```
kubectl get pod default-cpu-demo-3 --output=yaml --namespace=default-cpu-example
```

출력을 보면 파드 생성 시 명시한 값대로 
컨테이너의 CPU 요청량이 설정된 것을 알 수 있다(다시 말해, 매니페스트와 일치한다).
그러나, 해당 컨테이너의 CPU 상한은 1 `cpu`로 설정되며, 
이는 네임스페이스의 CPU 상한 기본값이다.

```
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 750m
```

## CPU 상한 및 요청량의 기본값에 대한 동기

네임스페이스에 {{< glossary_tooltip text="리소스 쿼터" term_id="resource-quota" >}}가 
설정되어 있는 경우,
CPU 상한에 대해 기본값을 설정하는 것이 좋다.
다음은 CPU 리소스 쿼터가 네임스페이스에 적용하는 두 가지 제한 사항이다.

* 네임스페이스에서 실행되는 모든 파드에 대해, 모든 컨테이너에 CPU 상한이 있어야 한다.
* CPU 상한은 해당 파드가 스케줄링될 노드에 리소스 예약을 적용한다.
  해당 네임스페이스의 모든 파드에 대해 예약된 CPU 총량이 
  지정된 상한을 초과하지 않아야 한다.

리밋레인지를 추가할 때에는 다음을 고려해야 한다.

컨테이너를 갖고 있는 해당 네임스페이스의 파드가 자체 CPU 상한을 지정하지 않았다면, 
컨트롤 플레인이 해당 컨테이너에 CPU 상한 기본값을 적용하며, 
해당 파드는 CPU 리소스쿼터가 적용된 네임스페이스에서 실행되도록 허용될 수 있다.


## 정리

네임스페이스를 삭제한다.

```shell
kubectl delete namespace default-cpu-example
```



## {{% heading "whatsnext" %}}


### 클러스터 관리자를 위한 문서

* [네임스페이스에 대한 기본 메모리 요청량과 상한 구성](/ko/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [네임스페이스에 대한 메모리의 최소 및 최대 제약 조건 구성](/ko/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [네임스페이스에 대한 CPU의 최소 및 최대 제약 조건 구성](/ko/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [네임스페이스에 대한 메모리 및 CPU 쿼터 구성](/ko/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [네임스페이스에 대한 파드 쿼터 구성](/ko/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [API 오브젝트에 대한 쿼터 구성](/docs/tasks/administer-cluster/quota-api-object/)

### 앱 개발자를 위한 문서

* [컨테이너 및 파드 메모리 리소스 할당](/ko/docs/tasks/configure-pod-container/assign-memory-resource/)

* [컨테이너 및 파드 CPU 리소스 할당](/ko/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [파드에 대한 서비스 품질(QoS) 구성](/ko/docs/tasks/configure-pod-container/quality-service-pod/)
