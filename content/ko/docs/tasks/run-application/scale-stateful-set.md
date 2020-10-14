---
title: 스테이트풀셋(StatefulSet) 스케일
content_type: task
weight: 50
---

<!-- overview -->
이 작업는 어떻게 {{< glossary_tooltip term_id="StatefulSet"text="스테이트풀셋">}}을 스케일링 하는지 보여준다.
{{< glossary_tooltip term_id="StatefulSet"text="스테이트풀셋">}}을 스케일링하는 것은 레플리카 개수를 늘리거나 줄이는 것을 의미한다.



## {{% heading "prerequisites" %}}


* 스테이트풀셋은 쿠버네티스 버전 1.5 이상에서만 사용할 수 있다.
  쿠버네티스 버전확인을 위해 다음의 커맨드를 실행 `kubectl version`.

* 모든 스테이트풀 어플리케이션이 원활하게 확장되지 않는다. 만약 스테이트풀셋의 확장에 대해 잘 모르는 경우, 상세한 내용은 [스테이트풀셋 개념](/docs/concepts/workloads/controllers/statefulset/) 또는 [스테이트풀셋 튜토리얼](/docs/tutorials/stateful-application/basic-stateful-set/) 을 참조한다.

* 스테이트풀 애플리케이션 클러스터가 완전히 정상인 경우에만 스케일링을 수행해야 한다.



<!-- steps -->

## 스테이트풀셋 스케일링

### kubectl을 사용하여 스테이트풀셋 스케일링 하기

먼저 스케일링할 스테이트풀셋을 찾는다.

```shell
kubectl get statefulsets <stateful-set-name>
```

스테이트풀셋의 레플리카 수를 변경한다.

```shell
kubectl scale statefulsets <stateful-set-name> --replicas=<new-replicas>
```

### StatefulSet에서 인플레이스(in-place) 업데이트 하기

그렇지 않으면, 스테이트풀셋에서 [인플레이스(in-place) 업데이트(/docs/concepts/cluster-administration/manage-deployment/#in-place-updates-of-resources) 를 할 수 있다.

처음에 스테이트풀셋이 `kubectl apply`,로 작성된 경우 스테이트풀셋 매니페스트의 `.spec.replicas` 를 업데이트 한 다음 `kubectl apply` 한다.


```shell
kubectl apply -f <stateful-set-file-updated>
```

그렇지 않으면 `kubectl edit`을 사용하여 필드를 편집한다.


```shell
kubectl edit statefulsets <stateful-set-name>
```

또는 `kubectl patch` 를 사용한다.

```shell
kubectl patch statefulsets <stateful-set-name> -p '{"spec":{"replicas":<new-replicas>}}'
```

## 문제해결

### 스케일 다운이 정상적으로 작동하지 않음

스테이트풀셋은 관리하는 상태저장 pod들 중 어떤것이라도 정상이 아니라면 스케일 다운 할수 없다. 
스케일다운은 오직 상태저장 pod들이 가동 되고 준비된 후에 이루어진다.


만약 spec.replicas > 1 이면, 쿠버네티스는 정상적이지 않은 pod를 판단할 수 없다. 그것은 영구적인 결함이거나 일시적인 결함 때문일 수 있다. 일시적 결함은 업그레이드 또는 유지보수에 필요한 재시작으로 인해 발생할 수 있다.

영구적인 결함으로 인해 Pod가 정상적이지 않은 경우, 결함을 제거하지 않고 스케일링 하면 스테이트풀셋 멤버십이 올바르게 작동하는데 필요한 최소 레플리카 수 아래로 떨어질수도 있다. 이로 인해 스테이트풀셋을 사용할 수 없게 될 수 있다.

만약 일시적인 결함으로 인해 Pod가 정상적이지 않고 Pod를 다시 사용할 수 있게 되는 경우, 일시적인 오류는 스케일업 또는 스케일 다운 동작을 방해할 수 있다.
일부 분산 데이터베이스는 node가 동시에 join 또는 leave 할 때 문제가 발생한다.
이러한 경우 애플리케이션 수준에서 운영을 확장하는 방법을 고려하고, 상태 저장 애플리케이션 클러스터가 완전히 정상일 때만 스케일링을 수행하는 것이 좋다.



## {{% heading "whatsnext" %}}

[스테이트풀셋 삭제하기](/docs/tasks/run-application/delete-stateful-set)에 대해 더 알아보기.



