---
# reviewers:
# - klueska
# - pohly
title: 동적 리소스 할당
content_type: concept
weight: 20
no_list: true
aliases:
- /ko/docs/concepts/scheduling-eviction/dynamic-resource-allocation/
---

<!-- overview -->

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

이 섹션에서는 쿠버네티스의 _동적 리소스 할당(DRA)_ 을 소개한다.

{{< glossary_definition prepend="DRA는" term_id="dra" length="all" >}}

DRA를 사용한 리소스 할당은
[동적 볼륨 프로비저닝](/docs/concepts/storage/dynamic-provisioning/)과 유사한 방식으로 동작한다.
동적 볼륨 프로비저닝에서는 퍼시스턴트볼륨클레임(PersistentVolumeClaim)을 사용하여
스토리지 클래스에서 스토리지 용량을 _클레임_ 하고, 클레임한 용량을 파드에서 사용할 수 있도록 요청한다.

<!-- body -->

### DRA의 이점 {#dra-benefits}

DRA는 클러스터의 디바이스를 분류하고 요청하며 사용할 수 있는 유연한 방법을 제공한다.
DRA를 사용하면 다음과 같은 이점이 있다.

* **유연한 디바이스 필터링**: 공통 표현식 언어(Common Expression Language, CEL)를 사용하여
  특정 디바이스 속성을 기준으로 세밀하게 필터링한다.
* **디바이스 공유**: 리소스클레임(ResourceClaim)을 참조하여 여러 컨테이너나 파드에서
  동일한 리소스를 공유한다.
* **디바이스 구성**: 리소스클레임에 벤더별 디바이스 구성을 추가하여,
  현재처럼 노드별로 디바이스를 구성하는 대신 워크로드별로 디바이스를 구성할 수 있다.
* **중앙 집중식 디바이스 분류**: 디바이스 드라이버와 클러스터 관리자는
  디바이스클래스(DeviceClass)를 사용하여 애플리케이션 운영자에게 다양한 사용 사례에
  최적화된 하드웨어 분류를 제공할 수 있다. 예를 들어, 범용 워크로드에는
  비용에 최적화된 디바이스클래스를, 중요한 잡에는 고성능 디바이스클래스를 생성할 수 있다.
* **간소화된 파드 요청**: DRA를 사용하면 애플리케이션 운영자는 파드의 리소스 요청에
  디바이스 수량을 지정할 필요가 없다. 대신 파드가 리소스클레임을
  참조하면 해당 클레임의 디바이스 구성이 파드에 적용된다.

이러한 이점 덕분에 DRA는
컨테이너별 디바이스 요청이 필요하고,
디바이스 공유와 표현식 기반 디바이스 필터링을 지원하지 않는
[디바이스 플러그인](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)보다
디바이스 할당 작업 흐름을 크게 개선한다.

### DRA 사용자 유형 {#dra-user-types}

DRA를 사용하여 디바이스를 할당하는 작업 흐름에는 다음 유형의 사용자가 참여한다.

* **디바이스 소유자**: 디바이스를 책임진다. 디바이스 소유자는 상용
  벤더, 클러스터 운영자 또는 다른 주체일 수 있다. DRA를 사용하려면 디바이스에
  다음 작업을 수행하는 DRA 호환 드라이버가 있어야 한다.

  * 리소스슬라이스(ResourceSlice)를 생성하여 쿠버네티스에
    노드와 리소스 정보를 제공한다.
  * 클러스터의 리소스 용량이 변경되면 리소스슬라이스를 갱신한다.
  * 클레임에 따라 디바이스를 구성하고, 컨테이너 디바이스 인터페이스(Container Device Interface, CDI)를 통해 컨테이너에 연결한다.
  * 선택적으로, 워크로드 운영자가 디바이스를 클레임하는 데 사용할 수 있는
    디바이스클래스를 생성한다.

* **클러스터 관리자**: 클러스터와 노드 구성,
  디바이스 연결, 드라이버 설치 등의 작업을 책임진다. DRA를 사용하려면
  클러스터 관리자는 다음 작업을 수행한다.

  * 노드에 디바이스를 연결한다.
  * DRA를 지원하는 디바이스 드라이버를 설치한다.
  * 선택적으로, 워크로드 운영자가 디바이스를 클레임하는 데 사용할 수 있는 디바이스클래스를 생성한다.

* **워크로드 운영자**: 클러스터에서 워크로드를 배포하고 관리하는 일을 책임진다.
  DRA를 사용하여 파드에 디바이스를 할당하려면 워크로드 운영자는 다음 작업을 수행한다.

  * 디바이스클래스 내에서 특정 구성을 요청하는
    리소스클레임 또는 리소스클레임템플릿(ResourceClaimTemplate)을 생성한다.
  * 특정 리소스클레임 또는 리소스클레임템플릿을 사용하는 워크로드를 배포한다.

## 제한 사항

* 쿠버네티스 스케줄러는 DRA 리소스에 대한
  [선점](/docs/concepts/scheduling-eviction/pod-priority-preemption/)을
  지원하지 않는다. 따라서 노드에서 실행 중이며 DRA 리소스를 사용하는
  기존 파드는 해당 리소스가 필요한 더 높은 우선순위의 파드에 의해
  선점될 수 없다. 우선순위가 높은 파드는 해당 디바이스를 사용 중인 기존 파드가
  종료되거나 수동으로 삭제되어 디바이스를 사용할 수 있게 될 때까지
  `Pending` 상태로 유지된다.

## {{% heading "whatsnext" %}}

- [클러스터에서 DRA 설정하기](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/)
- [DRA를 사용하여 워크로드에 디바이스 할당하기](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/)
- [DRA 디바이스 메타데이터에 접근하기](/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/)
- 설계에 대한 자세한 내용은
  [구조화된 파라미터를 사용하는 동적 리소스 할당](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters)
  KEP를 참고한다.
