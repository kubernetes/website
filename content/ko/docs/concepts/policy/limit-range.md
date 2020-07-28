---
title: 리밋 레인지(Limit Range)
content_type: concept
weight: 10
---

<!-- overview -->

기본적으로 컨테이너는 쿠버네티스 클러스터에서 무제한 [컴퓨팅 리소스](/docs/user-guide/compute-resources)로 실행된다.
리소스 쿼터을 사용하면 클러스터 관리자는 {{< glossary_tooltip text="네임스페이스" term_id="namespace" >}}별로 리소스 사용과 생성을 제한할 수 있다.
네임스페이스 내에서 파드나 컨테이너는 네임스페이스의 리소스 쿼터에 정의된 만큼의 CPU와 메모리를 사용할 수 있다. 하나의 파드 또는 컨테이너가 사용 가능한 모든 리소스를 독점할 수 있다는 우려가 있다. 리밋레인지는 네임스페이스에서 리소스 할당(파드 또는 컨테이너)을 제한하는 정책이다.




<!-- body -->

_리밋레인지_ 는 다음과 같은 제약 조건을 제공한다.

- 네임스페이스에서 파드 또는 컨테이너별 최소 및 최대 컴퓨팅 리소스 사용량을 지정한다.
- 네임스페이스에서 스토리지클래스별 최소 및 최대 스토리지 요청을 지정한다.
- 네임스페이스에서 리소스에 대한 요청과 제한 사이의 비율을 지정한다.
- 네임스페이스에서 컴퓨팅 리소스에 대한 기본 요청/제한을 설정하고 런타임에 있는 컨테이너에 자동으로 설정한다.

## 리밋레인지 활성화

쿠버네티스 1.10 버전부터 리밋레인지 지원이 기본적으로 활성화되었다.

해당 네임스페이스에 리밋레인지 오브젝트가 있는 경우
특정 네임스페이스에 리밋레인지가 지정된다.

리밋레인지 오브젝트의 이름은 유효한
[DNS 서브도메인 이름](/ko/docs/concepts/overview/working-with-objects/names/#dns-서브도메인-이름)이어야 한다.

### 리밋 레인지 개요

- 관리자는 하나의 네임스페이스에 하나의 리밋레인지를 만든다.
- 사용자는 네임스페이스에서 파드, 컨테이너 및 퍼시스턴트볼륨클레임과 같은 리소스를 생성한다.
- `LimitRanger` 어드미션 컨트롤러는 컴퓨팅 리소스 요청 사항을 설정하지 않은 모든 파드와 컨테이너에 대한 기본값과 제한을 지정하고 네임스페이스의 리밋레인지에 정의된 리소스의 최소, 최대 및 비율을 초과하지 않도록 사용량을 추적한다.
- 리밋레인지 제약 조건을 위반하는 리소스(파드, 컨테이너, 퍼시스턴트볼륨클레임)를 생성하거나 업데이트하는 경우 HTTP 상태 코드 `403 FORBIDDEN` 및 위반된 제약 조건을 설명하는 메시지와 함께 API 서버에 대한 요청이 실패한다.
- `cpu`, `memory`와 같은 컴퓨팅 리소스의 네임스페이스에서 리밋레인지가 활성화된 경우 사용자는 해당 값에
  대한 요청 또는 제한을 지정해야 한다. 그렇지 않으면 시스템에서 파드 생성이 거부될 수 있다.
- 리밋레인지 유효성 검사는 파드 실행 단계가 아닌 파드 어드미션 단계에서만 발생한다.

리밋 레인지를 사용하여 생성할 수 있는 정책의 예는 다음과 같다.

- 용량이 8GiB RAM과 16 코어인 2 노드 클러스터에서 네임스페이스의 파드를 제한하여 CPU의 최대 제한이 500m인 CPU 100m를 요청하고 메모리의 최대 제한이 600M인 메모리 200Mi를 요청하라.
- 스펙에 CPU 및 메모리 요청없이 시작된 컨테이너에 대해 기본 CPU 제한 및 요청을 150m로, 메모리 기본 요청을 300Mi로 정의하라.

네임스페이스의 총 제한이 파드/컨테이너의 제한 합보다 작은 경우 리소스에 대한 경합이 있을 수 있다.
이 경우 컨테이너 또는 파드가 생성되지 않는다.

경합이나 리밋레인지 변경은 이미 생성된 리소스에 영향을 미치지 않는다.



## {{% heading "whatsnext" %}}


자세한 내용은 [LimitRanger 디자인 문서](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_limit_range.md)를 참조한다.

제한의 사용에 대한 예시는 다음을 참조한다.

- [네임스페이스당 최소 및 최대 CPU 제약 조건을 설정하는 방법](/ko/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/).
- [네임스페이스당 최소 및 최대 메모리 제약 조건을 설정하는 방법](/ko/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/).
- [네임스페이스당 기본 CPU 요청과 제한을 설정하는 방법](/ko/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/).
- [네임스페이스당 기본 메모리 요청과 제한을 설정하는 방법](/ko/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/).
- [네임스페이스당 최소 및 최대 스토리지 사용량을 설정하는 방법](/docs/tasks/administer-cluster/limit-storage-consumption/#limitrange-to-limit-requests-for-storage).
- [네임스페이스당 할당량을 설정하는 자세한 예시](/ko/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/).


