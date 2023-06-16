---
title: 컨테이너에 확장 리소스 지정
content_type: task
weight: 40
---

<!-- overview -->

{{< feature-state state="stable" >}}

이 페이지는 컨테이너에 확장 리소스를 지정하는 방법을 보여준다.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

이 태스크를 수행하기 전에
[노드에 대한 확장 리소스 알리기](/ko/docs/tasks/administer-cluster/extended-resource-node/)에서 연습한다.
그러면 노드 중 하나가 동글(dongle) 리소스를 알리도록 구성될 것이다.




<!-- steps -->

## 파드에 확장 리소스 지정

확장 리소스를 요청하려면 컨테이너 매니페스트에 `resources:requests` 필드를 포함한다.
확장 리소스는 `*.kubernetes.io/` 외부의 모든 도메인으로 정규화된다.
유효한 확장 리소스 이름은 `example.com/foo` 형식을 갖는다.
여기서 `example.com`은 조직의 도메인으로 대체하고,
`foo`는 리소스를 설명할 수 있는 이름으로 짓는다.

다음은 컨테이너가 하나 있는 파드의 구성 파일이다.

{{< codenew file="pods/resource/extended-resource-pod.yaml" >}}

구성 파일에서 컨테이너가 3개의 동글을 요청하는 것을 알 수 있다.

파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/extended-resource-pod.yaml
```

파드가 실행 중인지 확인한다.

```shell
kubectl get pod extended-resource-demo
```

파드의 상세 정보를 확인한다.

```shell
kubectl describe pod extended-resource-demo
```

출력은 동글 요청을 보여준다.

```yaml
Limits:
  example.com/dongle: 3
Requests:
  example.com/dongle: 3
```

## 두 번째 파드 생성 시도

다음은 컨테이너가 하나 있는 파드의 구성 파일이다.
컨테이너는 두 개의 동글을 요청한다.

{{< codenew file="pods/resource/extended-resource-pod-2.yaml" >}}

첫 번째 파드가 사용 가능한 4개의 동글 중 3개를 사용했기 때문에
쿠버네티스는 두 개의 동글에 대한 요청을 충족시킬 수 없을 것이다.

파드 생성을 시도한다.

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/extended-resource-pod-2.yaml
```

파드 상세 정보를 확인한다.

```shell
kubectl describe pod extended-resource-demo-2
```

출력은 두 개의 동글을 가용할 수 있는 노드가 없기 때문에
파드를 스케줄할 수 없음을 보여준다.


```
Conditions:
  Type    Status
  PodScheduled  False
...
Events:
  ...
  ... Warning   FailedScheduling  pod (extended-resource-demo-2) failed to fit in any node
fit failure summary on nodes : Insufficient example.com/dongle (1)
```

파드 상태를 확인한다.

```shell
kubectl get pod extended-resource-demo-2
```

출력은 파드가 생성됐지만 노드에서 실행되도록 스케줄되지 않았음을 보여준다.
파드는 Pending 상태이다.

```yaml
NAME                       READY     STATUS    RESTARTS   AGE
extended-resource-demo-2   0/1       Pending   0          6m
```

## 정리

연습을 위해 생성한 파드를 삭제한다.

```shell
kubectl delete pod extended-resource-demo
kubectl delete pod extended-resource-demo-2
```



## {{% heading "whatsnext" %}}


### 애플리케션 개발자들을 위한 문서

* [컨테이너 및 파드 메모리 리소스 할당](/ko/docs/tasks/configure-pod-container/assign-memory-resource/)
* [컨테이너 및 파드 CPU 리소스 할당](/ko/docs/tasks/configure-pod-container/assign-cpu-resource/)

### 클러스터 관리자들을 위한 문서

* [노드에 확장된 리소스 알리기](/ko/docs/tasks/administer-cluster/extended-resource-node/)


