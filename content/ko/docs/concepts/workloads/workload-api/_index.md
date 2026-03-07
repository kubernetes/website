---
title: "워크로드 API"
weight: 20
simple_list: true
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

워크로드 API 리소스로 멀티-파드 애플리케이션의 스케줄링 요구 사항과 구조를 기술할 수 있다.
워크로드 컨트롤러가 워크로드에 대한 런타임 동작을 제공하는 반면,
워크로드 API는 잡(Job) 등과 같은 "실제" 워크로드에 대한 스케줄링 제약 조건을 제공하기 위한 것이다.

<!-- body -->

## 워크로드란?

워크로드 API 리소스는 `scheduling.k8s.io/v1alpha1`
{{< glossary_tooltip text="API 그룹" term_id="api-group" >}}에 속하며
(이 API를 사용하려면 클러스터에서 해당 API 그룹과 `GenericWorkload`
[기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/)가
활성화되어 있어야 한다).
이 리소스는 멀티 파드 애플리케이션의 스케줄링 요구 사항을
구조화하고 기계가 읽을 수 있는 형태로 정의한다. [잡](/docs/concepts/workloads/controllers/job/)과
같은 사용자 대상 워크로드가 무엇을 실행할지 정의하는 반면, 워크로드 리소스는
파드 그룹이 어떻게 스케줄링되어야 하는지와 라이프사이클 전반에 걸쳐
배치가 어떻게 관리되어야 하는지를 결정한다.

## API 구조

워크로드를 사용하면 파드 그룹을 정의하고 스케줄링 정책을 적용할 수 있다.
파드 그룹 목록과 컨트롤러에 대한 참조, 두 부분으로 구성된다.

### 파드 그룹

`podGroups` 목록은 워크로드의 개별 구성 요소를 정의한다.
예를 들어, 머신 러닝 잡에는 `driver` 그룹과 `worker` 그룹이 있을 수 있다.

`podGroups`의 각 항목에는 다음이 필요하다.
1. 파드의 [워크로드 참조](/docs/concepts/workloads/pods/workload-reference/)에서 사용할 수 있는 고유한 `name`.
2. [스케줄링 정책](/docs/concepts/workloads/workload-api/policies/) (`basic` 또는 `gang`).

```yaml
apiVersion: scheduling.k8s.io/v1alpha1
kind: Workload
metadata:
  name: training-job-workload
  namespace: some-ns
spec:
  controllerRef:
    apiGroup: batch
    kind: Job
    name: training-job
  podGroups:
  - name: workers
    policy:
      gang:
        # 4개의 파드가 동시에 실행될 수 있는 경우에만 gang을 스케줄링할 수 있다
        minCount: 4
```

### 워크로드 제어 오브젝트 참조

`controllerRef` 필드는 [잡](/docs/concepts/workloads/controllers/job/)이나 사용자 정의 CRD와 같이 애플리케이션을 정의하는 특정 상위 오브젝트에 워크로드를 연결한다. 이 필드는 가시성(observability)과 도구 연동에 유용하다.
이 데이터는 워크로드를 스케줄링하거나 관리하는 데 사용되지 않는다.

## {{% heading "whatsnext" %}}

* 파드에서 [워크로드 참조](/docs/concepts/workloads/pods/workload-reference/)하는 방법을 확인한다.
* [파드 그룹 정책](/docs/concepts/workloads/workload-api/policies/)에 대해 알아본다.
* [갱 스케줄링(gang scheduling)](/docs/concepts/scheduling-eviction/gang-scheduling/) 알고리즘에 대해 읽어본다.
