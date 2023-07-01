---
# reviewers:
# - nelvadas
title: 리밋 레인지(Limit Range)
content_type: concept
weight: 10
---

<!-- overview -->

기본적으로 컨테이너는 쿠버네티스 클러스터에서 무제한 [컴퓨팅 리소스](/ko/docs/concepts/configuration/manage-resources-containers/)로 실행된다.
쿠버네티스의 [리소스 쿼터](/ko/docs/concepts/policy/resource-quotas/)를 사용하면
클러스터 관리자(또는 _클러스터 오퍼레이터_ 라고 함)는
{{< glossary_tooltip text="네임스페이스" term_id="namespace" >}}별로 
리소스(CPU 시간, 메모리 및 퍼시스턴트 스토리지) 사용과 생성을 제한할 수 있다.
네임스페이스 내에서 {{< glossary_tooltip text="파드" term_id="Pod" >}}는 네임스페이스의 리소스 쿼터에 정의된 만큼의 CPU와 메모리를 사용할 수 있다. 클러스터 운영자 또는 네임스페이스 수준 관리자는 단일 오브젝트가 네임스페이스 내에서 사용 가능한 모든 리소스를 독점하지 못하도록 하는 것에 대해 우려할 수도 있다.

리밋레인지는 네임스페이스의 각 적용 가능한 오브젝트 종류(예: 파드 또는 {{< glossary_tooltip text="퍼시스턴트볼륨클레임" term_id="persistent-volume-claim" >}})에 대해 지정할 수 있는 리소스 할당(제한 및 요청)을 제한하는 정책이다.

<!-- body -->

_리밋레인지_ 는 다음과 같은 제약 조건을 제공한다.

- 네임스페이스에서 파드 또는 컨테이너별 최소 및 최대 컴퓨팅 리소스 사용량을 지정한다.
- 네임스페이스에서 {{< glossary_tooltip text="퍼시스턴트볼륨클레임" term_id="persistent-volume-claim" >}}별 최소 및 최대 스토리지 요청을 지정한다.
- 네임스페이스에서 리소스에 대한 요청과 제한 사이의 비율을 지정한다.
- 네임스페이스에서 컴퓨팅 리소스에 대한 기본 요청/제한을 설정하고 런타임에 있는 컨테이너에 자동으로 설정한다.


해당 네임스페이스에 리밋레인지 오브젝트가 있는 경우
특정 네임스페이스에 리밋레인지가 지정된다.

리밋레인지 오브젝트의 이름은 유효한
[DNS 서브도메인 이름](/ko/docs/concepts/overview/working-with-objects/names/#dns-서브도메인-이름)이어야 한다.

### 리소스 제한 및 요청에 대한 제약

- 관리자는 네임스페이스에 리밋레인지를 생성한다.
- 사용자는 해당 네임스페이스에서 파드 또는 퍼시스턴트볼륨클레임과 같은 오브젝트를 생성하거나 생성하려고 시도한다.
- 첫째, `LimitRange` 어드미션 컨트롤러는 컴퓨팅 리소스 요구사항을 설정하지 않은 모든 파드(및 해당 컨테이너)에 대해 기본 요청 및 제한 값을 적용한다.
- 둘째, `LimitRange`는 사용량을 추적하여 네임스페이스에 존재하는 `LimitRange`에 정의된 리소스 최소, 최대 및 비율을 초과하지 않는지 확인한다.
- 리밋레인지 제약 조건을 위반하는 리소스(파드, 컨테이너, 퍼시스턴트볼륨클레임)를 생성하거나 업데이트하려고 하는 경우 HTTP 상태 코드 `403 FORBIDDEN` 및 위반된 제약 조건을 설명하는 메시지와 함께 API 서버에 대한 요청이 실패한다.
- `cpu`, `memory`와 같은 컴퓨팅 리소스의 네임스페이스에서
  리밋레인지를 추가한 경우 사용자는 해당 값에
  대한 요청 또는 제한을 지정해야 한다. 그렇지 않으면 시스템에서 파드 생성이 거부될 수 있다.
- `LimitRange` 유효성 검사는 실행 중인 파드가 아닌 파드 어드미션 단계에서만 수행된다.
  리밋레인지가 추가되거나 수정되면, 해당 
  네임스페이스에 이미 존재하는 파드는 변경되지 않고 계속 유지된다.
- 네임스페이스에 두 개 이상의 `LimitRange` 오브젝트가 존재하는 경우, 어떤 기본값이 적용될지는 결정적이지 않다.

## 파드에 대한 리밋레인지 및 어드미션 확인

`LimitRange`는 적용하는 기본값의 일관성을 확인하지 **않는다**. 즉, `LimitRange`에 의해 설정된 _limit_ 의 기본값이 클라이언트가 API 서버에 제출하는 스펙에서 컨테이너에 지정된 _request_ 값보다 작을 수 있다. 이 경우, 최종 파드는 스케줄링할 수 없다.

예를 들어, 이 매니페스트에 `LimitRange`를 정의한다.

{{< codenew file="concepts/policy/limit-range/problematic-limit-range.yaml" >}}


이 때 CPU 리소스 요청을 `700m`로 선언하지만 제한은 선언하지 않는 파드를 포함한다.

{{< codenew file="concepts/policy/limit-range/example-conflict-with-limitrange-cpu.yaml" >}}


그러면 해당 파드는 스케줄링되지 않고 다음과 유사한 오류와 함께 실패한다.
```
Pod "example-conflict-with-limitrange-cpu" is invalid: spec.containers[0].resources.requests: Invalid value: "700m": must be less than or equal to cpu limit
```

`request`와 `limit`를 모두 설정하면, 동일한 `LimitRange`가 적용되어 있어도 새 파드는 성공적으로 스케줄링된다.

{{< codenew file="concepts/policy/limit-range/example-no-conflict-with-limitrange-cpu.yaml" >}}

## 리소스 제약 예시

`LimitRange`를 사용하여 생성할 수 있는 정책의 예는 다음과 같다.

- 용량이 8GiB RAM과 16 코어인 2 노드 클러스터에서 네임스페이스의 파드를 제한하여 CPU의 최대 제한이 500m인 CPU 100m를 요청하고 메모리의 최대 제한이 600M인 메모리 200Mi를 요청하라.
- 스펙에 CPU 및 메모리 요청없이 시작된 컨테이너에 대해 기본 CPU 제한 및 요청을 150m로, 메모리 기본 요청을 300Mi로 정의하라.

네임스페이스의 총 제한이 파드/컨테이너의 제한 합보다 작은 경우 리소스에 대한 경합이 있을 수 있다.
이 경우 컨테이너 또는 파드가 생성되지 않는다.

경합이나 리밋레인지 변경은 이미 생성된 리소스에 영향을 미치지 않는다.

## {{% heading "whatsnext" %}}

제한의 사용에 대한 예시는 다음을 참조한다.

- [네임스페이스당 최소 및 최대 CPU 제약 조건을 설정하는 방법](/ko/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/).
- [네임스페이스당 최소 및 최대 메모리 제약 조건을 설정하는 방법](/ko/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/).
- [네임스페이스당 기본 CPU 요청과 제한을 설정하는 방법](/ko/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/).
- [네임스페이스당 기본 메모리 요청과 제한을 설정하는 방법](/ko/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/).
- [네임스페이스당 최소 및 최대 스토리지 사용량을 설정하는 방법](/ko/docs/tasks/administer-cluster/limit-storage-consumption/#스토리지-요청을-제한하기-위한-리밋레인지-limitrange).
- [네임스페이스당 할당량을 설정하는 자세한 예시](/ko/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/).

컨텍스트 및 기록 정보는 [LimitRanger 디자인 문서](https://git.k8s.io/design-proposals-archive/resource-management/admission_control_limit_range.md)를 참조한다.

