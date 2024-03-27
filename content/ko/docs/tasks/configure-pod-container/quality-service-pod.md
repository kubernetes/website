---
title: 파드에 대한 서비스 품질(QoS) 구성
content_type: task
weight: 60
---


<!-- overview -->

이 페이지는 특정 {{< glossary_tooltip text="서비스 품질(QoS) 클래스" term_id="qos-class" >}}를
할당하기 위해 어떻게 파드를 구성해야 하는지 보여준다. 
쿠버네티스는 QoS 클래스를 사용하여 노드 리소스가 초과될 때 파드 축출을 결정한다.


쿠버네티스가 파드를 생성할 때, 파드에 다음의 QoS 클래스 중 하나를 할당한다.

* [Guaranteed](/docs/concepts/workloads/pods/pod-qos/#guaranteed)
* [Burstable](/docs/concepts/workloads/pods/pod-qos/#burstable)
* [BestEffort](/docs/concepts/workloads/pods/pod-qos/#besteffort)


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

또한 네임스페이스를 만들고 삭제할 수 있어야 한다.



<!-- steps -->


## 네임스페이스 생성

이 연습에서 생성한 리소스가 클러스터의 나머지와
격리되도록 네임스페이스를 생성한다.

```shell
kubectl create namespace qos-example
```

## Guaranteed QoS 클래스가 할당되는 파드 생성

파드에 `Guaranteed` QoS 클래스 할당을 위한 전제 조건은 다음과 같다.

* 파드 내 모든 컨테이너는 메모리 상한과 메모리 요청량을 가지고 있어야 한다.
* 파드 내 모든 컨테이너의 메모리 상한이 메모리 요청량과 일치해야 한다.
* 파드 내 모든 컨테이너는 CPU 상한과 CPU 요청량을 가지고 있어야 한다.
* 파드 내 모든 컨테이너의 CPU 상한이 CPU 요청량과 일치해야 한다.

이러한 제약은 초기화 컨테이너와 앱 컨테이너 모두에 동일하게 적용된다.
[임시(Ephemeral) 컨테이너](/ko/docs/concepts/workloads/pods/ephemeral-containers/)는
리소스를 정의할 수 없으므로 이러한 제약을 따르지 않는다.

다음은 하나의 컨테이너를 갖는 파드의 매니페스트이다. 해당 컨테이너는 메모리 상한과
메모리 요청량을 갖고 있고, 200MiB로 동일하다. 해당 컨테이너는 CPU 상한과 CPU 요청량을 가지며, 700 milliCPU로 동일하다.

{{% codenew file="pods/qos/qos-pod.yaml" %}}

파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod.yaml --namespace=qos-example
```

파드의 상세 정보를 본다.

```shell
kubectl get pod qos-demo --namespace=qos-example --output=yaml
```

출력 결과는 쿠버네티스가 파드에 `Guaranteed` QoS 클래스를 부여했음을 보여준다. 또한
파드의 컨테이너가 메모리 요청량과 일치하는 메모리 상한을 가지며,
CPU 요청량과 일치하는 CPU 상한을 갖고 있음을 확인할 수 있다.

```yaml
spec:
  containers:
    ...
    resources:
      limits:
        cpu: 700m
        memory: 200Mi
      requests:
        cpu: 700m
        memory: 200Mi
    ...
status:
  qosClass: Guaranteed
```

{{< note >}}
컨테이너가 자신의 메모리 상한을 지정하지만, 메모리 요청량을 지정하지 않는 경우,
쿠버네티스는 상한과 일치하는 메모리 요청량을 자동으로 할당한다. 이와 유사하게, 만약 컨테이너가 자신의
CPU 상한을 지정하지만, CPU 요청량을 지정하지 않은 경우, 쿠버네티스는 상한과 일치하는 CPU 요청량을 자동으로
할당한다.
{{< /note >}}

<!-- 내비게이션에 표시하지 않기 위한 4단계 헤딩 -->
#### 정리 {#clean-up-guaranteed}

파드를 삭제한다.

```shell
kubectl delete pod qos-demo --namespace=qos-example
```

## Burstable QoS 클래스가 할당되는 파드 생성

다음의 경우 파드에 `Burstable` QoS 클래스가 부여된다.

* 파드가 `Guaranteed` QoS 클래스 기준을 만족하지 않는다.
* 파드 내에서 최소한 하나의 컨테이너가 메모리 또는 CPU 요청량/상한을 가진다.

컨테이너가 하나인 파드의 매니페스트는 다음과 같다. 컨테이너는
200MiB의 메모리 상한과 100MiB의 메모리 요청량을 가진다.

{{% codenew file="pods/qos/qos-pod-2.yaml" %}}

파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod-2.yaml --namespace=qos-example
```

파드의 상세 정보를 본다.

```shell
kubectl get pod qos-demo-2 --namespace=qos-example --output=yaml
```

출력 결과는 쿠버네티스가 파드에 `Burstable` QoS 클래스를 부여했음을 보여준다.

```yaml
spec:
  containers:
  - image: nginx
    imagePullPolicy: Always
    name: qos-demo-2-ctr
    resources:
      limits:
        memory: 200Mi
      requests:
        memory: 100Mi
  ...
status:
  qosClass: Burstable
```

<!-- 내비게이션에 표시하지 않기 위한 4단계 헤딩 -->
#### 정리 {#clean-up-burstable}

파드를 삭제한다.

```shell
kubectl delete pod qos-demo-2 --namespace=qos-example
```

## BestEffort QoS 클래스가 할당되는 파드 생성

파드에 QoS 클래스 `BestEffort`를 제공하려면, 파드의 컨테이너에
메모리 또는 CPU의 상한이나 요청량이 없어야 한다.

컨테이너가 하나인 파드의 매니페스트이다. 해당 컨테이너는 메모리 또는 CPU의
상한이나 요청량을 갖지 않는다.

{{% codenew file="pods/qos/qos-pod-3.yaml" %}}

파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod-3.yaml --namespace=qos-example
```

파드의 상세 정보를 본다.

```shell
kubectl get pod qos-demo-3 --namespace=qos-example --output=yaml
```

출력 결과는 쿠버네티스가 파드에 `BestEffort` QoS 클래스를 부여했음을 보여준다.

```yaml
spec:
  containers:
    ...
    resources: {}
  ...
status:
  qosClass: BestEffort
```

<!-- 내비게이션에 표시하지 않기 위한 4단계 헤딩 -->
#### 정리 {#clean-up-besteffort}

파드를 삭제한다.

```shell
kubectl delete pod qos-demo-3 --namespace=qos-example
```

## 컨테이너가 두 개인 파드 생성

컨테이너가 두 개인 파드의 매니페스트이다. 한 컨테이너는 200MiB의 메모리
요청량을 지정한다. 다른 컨테이너는 어떤 요청량이나 상한을 지정하지 않는다.

{{% codenew file="pods/qos/qos-pod-4.yaml" %}}

참고로 이 파드는 `Burstable` QoS 클래스의 기준을 충족한다. 즉, `Guaranteed` QoS 클래스에 대한
기준을 충족하지 않으며, 해당 컨테이너 중 하나가 메모리 요청량을 갖는다.

파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod-4.yaml --namespace=qos-example
```

파드의 상세 정보를 본다.

```shell
kubectl get pod qos-demo-4 --namespace=qos-example --output=yaml
```

출력 결과는 쿠버네티스가 파드에 `Burstable` QoS 클래스를 부여했음을 보여준다.

```yaml
spec:
  containers:
    ...
    name: qos-demo-4-ctr-1
    resources:
      requests:
        memory: 200Mi
    ...
    name: qos-demo-4-ctr-2
    resources: {}
    ...
status:
  qosClass: Burstable
```

## 파드의 QoS 클래스 검색

모든 필드를 보는 대신, 필요한 필드만 볼 수 있다.

```bash
kubectl --namespace=qos-example get pod qos-demo-4 -o jsonpath='{ .status.qosClass}{"\n"}'
```

```none
Burstable
```


## 정리

네임스페이스를 삭제한다.

```shell
kubectl delete namespace qos-example
```



## {{% heading "whatsnext" %}}



### 앱 개발자를 위한 문서

* [컨테이너 및 파드 메모리 리소스 할당](/ko/docs/tasks/configure-pod-container/assign-memory-resource/)

* [컨테이너 및 파드 CPU 리소스 할당](/ko/docs/tasks/configure-pod-container/assign-cpu-resource/)

### 클러스터 관리자를 위한 문서

* [네임스페이스에 대한 기본 메모리 요청과 상한 구성](/ko/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [네임스페이스에 대한 기본 CPU 요청과 상한 구성](/ko/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [네임스페이스에 대한 메모리의 최소 및 최대 메모리 제약 조건 구성](/ko/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [네임스페이스에 대한 CPU의 최소 및 최대 제약 조건 구성](/ko/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [네임스페이스에 대한 메모리 및 CPU 쿼터 구성](/ko/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [네임스페이스에 대한 파드 쿼터 구성](/ko/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [API 오브젝트 할당량 구성](/docs/tasks/administer-cluster/quota-api-object/)

* [노드의 토폴로지 관리 정책 제어](/docs/tasks/administer-cluster/topology-manager/)
