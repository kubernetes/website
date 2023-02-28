---
# reviewers:
# - bprashanth
# - enisoc
# - erictune
# - foxish
# - janetkuo
# - kow3ns
# - smarterclayton
title: 스테이트풀셋(StatefulSet) 확장하기
content_type: task
weight: 50
---

<!-- overview -->
이 작업은 스테이트풀셋을 확장하는 방법을 보여준다. 스테이트풀셋 확장은 레플리카 수를 늘리거나 줄이는 것을 의미한다.


## {{% heading "prerequisites" %}}


* 스테이트풀셋은 쿠버네티스 버전 1.5 이상에서만 사용할 수 있다.
   쿠버네티스 버전을 확인하려면 `kubectl version`을 실행한다.

* 모든 스테이트풀 애플리케이션이 제대로 확장되는 것은 아니다. 스테이트풀셋을 확장할지 여부가 확실하지 않은 경우에 자세한 내용은 [스테이트풀셋](/ko/docs/concepts/workloads/controllers/statefulset/) 또는 [스테이트풀셋 튜토리얼](/ko/docs/tutorials/stateful-application/basic-stateful-set/)을 참조한다.

* 스테이트풀 애플리케이션 클러스터가 완전히 정상이라고 확신할 때만 
  확장을 수행해야 한다.



<!-- steps -->

## 스테이트풀셋 확장하기

### kubectl을 사용하여 스테이트풀셋 확장

먼저 확장하려는 스테이트풀셋을 찾는다.

```shell
kubectl get statefulsets <stateful-set-name>
```

스테이트풀셋의 레플리카 수를 변경한다.

```shell
kubectl scale statefulsets <stateful-set-name> --replicas=<new-replicas>
```

### 스테이트풀셋 인플레이스(in-place) 업데이트

대안으로 스테이트풀셋에 [인플레이스 업데이트](/ko/docs/concepts/cluster-administration/manage-deployment/#in-place-updates-of-resources)를 수행할 수 있다.

스테이트풀셋이 처음에 `kubectl apply`로 생성된 경우,
스테이트풀셋 매니페스트의 `.spec.replicas`를 업데이트한 다음 `kubectl apply`를 수행한다.

```shell
kubectl apply -f <stateful-set-file-updated>
```

그렇지 않으면 `kubectl edit`로 해당 필드를 편집한다.

```shell
kubectl edit statefulsets <stateful-set-name>
```

또는 `kubectl patch`를 사용한다.

```shell
kubectl patch statefulsets <stateful-set-name> -p '{"spec":{"replicas":<new-replicas>}}'
```

## 트러블슈팅

### 축소가 제대로 작동하지 않음

스테이트풀셋에서 관리하는 스테이트풀 파드가 비정상인 경우에는 스테이트풀셋을 축소할 수 없다. 축소는 
스테이트풀 파드가 실행되고 준비된 후에만 발생한다.

spec.replicas > 1인 경우 쿠버네티스는 비정상 파드의 원인을 결정할 수 없다. 영구적인 오류 또는 일시적인 오류의 결과일 수 있다. 일시적인 오류는 업그레이드 또는 유지 관리에 필요한 재시작으로 인해 발생할 수 있다.

영구적인 오류로 인해 파드가 비정상인 경우 
오류를 수정하지 않고 확장하면 스테이트풀셋 멤버십이 올바르게 작동하는 데 필요한 
특정 최소 레플리카 수 아래로 떨어지는 상태로 이어질 수 있다. 
이로 인해 스테이트풀셋을 사용할 수 없게 될 수 있다.

일시적인 오류로 인해 파드가 비정상 상태이고 파드를 다시 사용할 수 있게 되면 
일시적인 오류가 확장 또는 축소 작업을 방해할 수 있다. 일부 분산 
데이터베이스에는 노드가 동시에 가입 및 탈퇴할 때 문제가 있다. 이러한 경우 
애플리케이션 수준에서 확장 작업에 대해 추론하고 스테이트풀 애플리케이션 클러스터가 
완전히 정상이라고 확신할 때만 확장을 수행하는 것이 좋다.



## {{% heading "whatsnext" %}}


* [스테이트풀셋 삭제하기](/ko/docs/tasks/run-application/delete-stateful-set/)에 대해 더 배워보기


