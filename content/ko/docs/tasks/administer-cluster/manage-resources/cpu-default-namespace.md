---
title: 네임스페이스에 대한 기본 CPU 요청량과 상한 구성
content_type: task
weight: 20
---

<!-- overview -->

이 페이지는 네임스페이스에 대한 기본 CPU 요청량(request) 및 상한(limit)을 구성하는 방법을 보여준다.
쿠버네티스 클러스터는 네임스페이스로 나눌 수 있다. 기본 CPU 상한이 있는 네임스페이스에서
컨테이너가 생성되고, 컨테이너가 자체 CPU 상한을 지정하지 않으면,
컨테이너에 기본 CPU 상한이 할당된다. 쿠버네티스는 이 문서의 뒷부분에서
설명하는 특정 조건에서 기본 CPU 요청량을 할당한다.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->

## 네임스페이스 생성

이 연습에서 생성한 리소스가 클러스터의 나머지와
격리되도록 네임스페이스를 생성한다.

```shell
kubectl create namespace default-cpu-example
```

## 리밋레인지(LimitRange)와 파드 생성

다음은 리밋레인지 오브젝트의 구성 파일이다. 구성은
기본 CPU 요청량 및 기본 CPU 상한을 지정한다.

{{< codenew file="admin/resource/cpu-defaults.yaml" >}}

default-cpu-example 네임스페이스에 리밋레인지를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults.yaml --namespace=default-cpu-example
```

이제 컨테이너가 default-cpu-example 네임스페이스에 생성되고,
컨테이너가 CPU 요청량 및 CPU 상한에 대해 고유한 값을 지정하지 않으면,
컨테이너에 CPU 요청량의 기본값 0.5와 CPU 상한
기본값 1이 부여된다.

컨테이너가 하나인 파드의 구성 파일은 다음과 같다. 컨테이너는
CPU 요청량과 상한을 지정하지 않는다.

{{< codenew file="admin/resource/cpu-defaults-pod.yaml" >}}

파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod.yaml --namespace=default-cpu-example
```

파드의 사양을 확인한다.

```shell
kubectl get pod default-cpu-demo --output=yaml --namespace=default-cpu-example
```

출력 결과는 파드의 컨테이너에 500 milicpu의 CPU 요청량과
1 cpu의 CPU 상한이 있음을 나타낸다. 이것은 리밋레인지에 의해 지정된 기본값이다.

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

컨테이너가 하나인 파드의 구성 파일은 다음과 같다. 컨테이너는
CPU 상한을 지정하지만, 요청량은 지정하지 않는다.

{{< codenew file="admin/resource/cpu-defaults-pod-2.yaml" >}}

파드를 생성한다.


```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod-2.yaml --namespace=default-cpu-example
```

파드 사양을 확인한다.

```
kubectl get pod default-cpu-demo-2 --output=yaml --namespace=default-cpu-example
```

출력 결과는 컨테이너의 CPU 요청량이 CPU 상한과 일치하도록 설정되었음을 보여준다.
참고로 컨테이너에는 CPU 요청량의 기본값인 0.5 cpu가 할당되지 않았다.

```
resources:
  limits:
    cpu: "1"
  requests:
    cpu: "1"
```

## 컨테이너의 요청량은 지정하고, 상한을 지정하지 않으면 어떻게 되나?

컨테이너가 하나인 파드의 구성 파일은 다음과 같다. 컨테이너는
CPU 요청량을 지정하지만, 상한은 지정하지 않았다.

{{< codenew file="admin/resource/cpu-defaults-pod-3.yaml" >}}

파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod-3.yaml --namespace=default-cpu-example
```

파드 사양을 확인한다.

```
kubectl get pod default-cpu-demo-3 --output=yaml --namespace=default-cpu-example
```

출력 결과는 컨테이너의 CPU 요청량이 컨테이너의 구성 파일에 지정된 값으로
설정되었음을 보여준다. 컨테이너의 CPU 상한은 1 cpu로 설정되며, 이는
네임스페이스의 CPU 상한 기본값이다.

```
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 750m
```

## CPU 상한 및 요청량의 기본값에 대한 동기

네임스페이스에 [리소스 쿼터](/ko/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)가 있는 경우,
CPU 상한에 대해 기본값을 설정하는 것이 좋다.
다음은 리소스 쿼터가 네임스페이스에 적용하는 두 가지 제한 사항이다.

* 네임스페이스에서 실행되는 모든 컨테이너에는 자체 CPU 상한이 있어야 한다.
* 네임스페이스의 모든 컨테이너가 사용하는 총 CPU 양은 지정된 상한을 초과하지 않아야 한다.

컨테이너가 자체 CPU 상한을 지정하지 않으면, 상한 기본값이 부여되고, 쿼터에
의해 제한되는 네임스페이스에서 실행될 수 있다.

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

* [컨테이너 및 파드 CPU 리소스 할당](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [파드에 대한 서비스 품질(QoS) 구성](/ko/docs/tasks/configure-pod-container/quality-service-pod/)
