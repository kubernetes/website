---
title: 스케줄링 그룹
content_type: concept
weight: 90
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

`파드`를 [파드그룹](/docs/concepts/workloads/podgroup-api/)에 연결하여
`파드`가 함께 스케줄링되는 여러 `파드`로 이루어진 그룹에 속한다는 것을 나타낼 수 있다. 이를 통해 스케줄러는
각 `파드`를 독립적으로 처리하는 대신 갱(gang) 스케줄링과 같은 그룹 수준 정책을 적용할 수 있다.

<!-- body -->

## 스케줄링 그룹 지정

[`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
기능 게이트가 활성화되어 있으면,
`파드` 매니페스트에서 `spec.schedulingGroup` 필드를 설정할 수 있다. 이 필드는 이름을 통해 같은 네임스페이스에 있는 특정 `파드그룹` 오브젝트와의 연결을 설정한다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: worker-0
  namespace: some-ns
spec:
  schedulingGroup:
    podGroupName: training-worker-0
  containers:
  - name: ml-worker
    image: training:v1
```

`schedulingGroup` 필드는 불변(immutable)이다. 한 번 설정되면 `파드`를
다른 `파드그룹`으로 옮길 수 없다.

## 동작 방식

`spec.schedulingGroup`을 설정하면, 스케줄러는 참조된
[파드그룹](/docs/concepts/workloads/podgroup-api/)을 조회하고 해당 파드그룹에 정의된
[스케줄링 정책](/docs/concepts/workloads/workload-api/policies/)을 적용한다.

* `파드그룹`이 `basic` 정책을 사용하는 경우, 각 `파드`는 표준 쿠버네티스 동작 방식에 따라
  독립적으로 스케줄링된다. 이때 그룹 지정은 그룹 수준 레이블로 사용된다.
* `파드그룹`이 `gang` 정책을 사용하는 경우, `파드`는 "전부 아니면 전무(all-or-nothing)" 스케줄링
  라이프사이클에 진입한다. 스케줄러는 그룹 내 최소한 `minCount`개의 `파드`를
  동시에 배치하려고 시도하며, 최소 개수가 충족되지 않으면 어느 파드도 노드에 바인딩되지 않는다.

{{< feature-state feature_gate_name="CompositePodGroup" >}}

[`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
기능 게이트가 활성화되면, `파드그룹`은 부모 `컴포지트파드그룹(CompositePodGroup)`을 지정할 수도 있다. 
계층적 워크로드에서는, 전체 그룹 트리에 걸쳐 정의된 정책(예: 다단계 갱 스케줄링 또는
토폴로지 제약 조건 등)에 따라 스케줄링이 결정된다.

## 존재하지 않는 파드그룹 참조

`파드`가 아직 존재하지 않는 `파드그룹`을 참조하는 경우, 해당 `파드`는 보류(pending) 상태로 유지된다.
마찬가지로, 참조된 `파드그룹`이 (`spec.parentCompositePodGroupName`을 통해)
아직 생성되지 않은 부모 `컴포지트파드그룹`을 지정하는 경우, 스케줄링이 시작되지 않으며
전체 그룹 계층이 클러스터에 존재할 때까지 `파드`는 보류 상태로 유지된다.

이는 최종 정책이 `basic`이든 `gang`이든 관계없이 적용되는데,
스케줄러가 정책을 결정하기 위해서는 `파드그룹`이 필요하기 때문이다.

## {{% heading "whatsnext" %}}

* [파드그룹 API](/docs/concepts/workloads/podgroup-api/)와 그 라이프사이클에 대해 알아본다.
* [컴포지트파드그룹 API](/docs/concepts/workloads/compositepodgroup-api/)에 대해 읽어본다.
* [파드그룹 스케줄링 정책](/docs/concepts/workloads/workload-api/policies/)에 대해 읽어본다.
* [갱 스케줄링](/docs/concepts/scheduling-eviction/gang-scheduling/) 알고리즘을 이해한다.
