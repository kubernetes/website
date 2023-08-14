---
# reviewers:
# - jsafrane
# - saad-ali
# - msau42
# - xing-yang
# - pohly
title: 스토리지 용량
content_type: concept
weight: 80
---

<!-- overview -->

스토리지 용량은 제한이 있으며, 파드가 실행되는 노드의 상황에 따라 달라질 수 있다.
예를 들어, 일부 노드에서 NAS(Network Attached Storage)에 접근할 수 없는 경우가 있을 수 있으며,
또는 각 노드에 종속적인 로컬 스토리지를 사용하는 경우일 수도 있다.

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

이 페이지에서는 쿠버네티스가 어떻게 스토리지 용량을 추적하고
스케줄러가 남아 있는 볼륨을 제공하기 위해 스토리지 용량이 충분한 노드에
[파드를 스케줄링](/ko/docs/concepts/scheduling-eviction/)하기 위해 이 정보를 어떻게 사용하는지 설명한다.
스토리지 용량을 추적하지 않으면, 스케줄러는
볼륨을 제공할 충분한 용량이 없는 노드를 선정할 수 있으며,
스케줄링을 여러 번 다시 시도해야 한다.

## {{% heading "prerequisites" %}}

쿠버네티스 v{{< skew currentVersion >}} 버전은 스토리지 용량 추적을 위한 클러스터-수준 API를 지원한다. 
이를 사용하려면, 스토리지 용량 추적을 지원하는 CSI 드라이버를 사용하고 있어야 한다. 
사용 중인 CSI 드라이버가 이를 지원하는지, 지원한다면 어떻게 사용하는지를 알아보려면 
해당 CSI 드라이버의 문서를 참고한다. 
쿠버네티스 v{{< skew currentVersion >}} 버전을 사용하고 있지 않다면, 
해당 버전 쿠버네티스 문서를 참고한다.

<!-- body -->

## API

 이 기능에는 다음 두 가지 API 확장이 있다.
- [CSIStorageCapacity](/docs/reference/kubernetes-api/config-and-storage-resources/csi-storage-capacity-v1/) 오브젝트:
  CSI 드라이버가 설치된 네임스페이스에
  CSI 드라이버가 이 오브젝트를 생성한다. 각 오브젝트는
  하나의 스토리지 클래스에 대한 용량 정보를 담고 있으며,
  어떤 노드가 해당 스토리지에 접근할 수 있는지를 정의한다.
- [`CSIDriverSpec.StorageCapacity` 필드](/docs/reference/kubernetes-api/config-and-storage-resources/csi-driver-v1/#CSIDriverSpec):
  `true`로 설정하면, 쿠버네티스 스케줄러가
  CSI 드라이버를 사용하는 볼륨의 스토리지 용량을 고려하게 된다.

## 스케줄링

다음과 같은 경우 쿠버네티스 스케줄러에서 스토리지 용량 정보를 사용한다.
- 파드가 아직 생성되지 않은 볼륨을 사용하고,
- 해당 볼륨은 CSI 드라이버를 참조하고
  `WaitForFirstConsumer`
  [볼륨 바인딩 모드](/ko/docs/concepts/storage/storage-classes/#볼륨-바인딩-모드)를 사용하는
  {{< glossary_tooltip text="스토리지클래스(StorageClass)" term_id="storage-class" >}}를 사용하고,
- 드라이버의 `CSIDriver` 오브젝트에 `StorageCapacity` 속성이
  true로 설정되어 있다.

이 경우 스케줄러는 파드에 제공할
충분한 스토리지가 있는 노드만 고려한다.
이 검사는 아주 간단한데,
볼륨의 크기를 노드를 포함하는 토폴로지를 가진 `CSIStorageCapacity` 오브젝트에
나열된 용량과 비교한다.

볼륨 바인딩 모드가 `Immediate` 인 볼륨의 경우에는 스토리지 드라이버는
볼륨을 사용하는 파드와 관계없이 볼륨을 생성할 위치를 정한다.
볼륨을 생성한 후에, 스케줄러는
볼륨을 사용할 수 있는 노드에 파드를 스케줄링한다.

[CSI 임시 볼륨](/ko/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes)의 경우에는
볼륨 유형이 로컬 볼륨이고
큰 자원이 필요하지 않은 특정 CSI 드라이버에서만 사용된다는 가정하에,
항상 스토리지 용량을 고려하지 않고
스케줄링한다.

## 리스케줄링

`WaitForFirstConsumer` 볼륨을 가진 파드에 대해
노드가 선정되었더라도 아직은 잠정적인 결정이다. 다음 단계에서
선정한 노드에서 볼륨을 사용할 수 있어야 한다는 힌트를 주고
CSI 스토리지 드라이버에 볼륨 생성을 요청한다

쿠버네티스는 시간이 지난 스토리지 용량 정보를 기반으로
노드를 선정할 수도 있으므로, 볼륨을 실제로 생성하지 않을 수도 있다.
그런 다음 노드 선정이 재설정되고 쿠버네티스 스케줄러가
파드를 위한 노드를 찾는 것을 재시도한다.

## 제한사항

스토리지 용량 추적은 첫 시도에 스케줄링이 성공할 가능성을 높이지만,
스케줄러가 시간이 지난 정보를 기반으로
결정해야 할 수도 있기 때문에 이를 보장하지는 않는다.
일반적으로 스토리지 용량 정보가 없는 스케줄링과
동일한 재시도 메커니즘으로 스케줄링 실패를 처리한다.

스케줄링이 영구적으로 실패할 수 있는 한 가지 상황은
파드가 여러 볼륨을 사용하는 경우이다.
토폴로지 세그먼트에 하나의 볼륨이 이미 생성되어
다른 볼륨에 충분한 용량이 남아 있지 않을 수 있다.
이러한 상황을 복구하려면
용량을 늘리거나 이미 생성된 볼륨을 삭제하는 등의 수작업이 필요하다.

## {{% heading "whatsnext" %}}

- 설계에 대한 자세한 내용은
 [파드 스케줄링 스토리지 용량 제약 조건](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/1472-storage-capacity-tracking/README.md)을 참조한다.
