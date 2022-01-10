---
title: 동적 볼륨 프로비저닝
content_type: concept
weight: 40
---

<!-- overview -->

동적 볼륨 프로비저닝을 통해 온-디맨드 방식으로 스토리지 볼륨을 생성할 수 있다.
동적 프로비저닝이 없으면 클러스터 관리자는 클라우드 또는 스토리지
공급자에게 수동으로 요청해서 새 스토리지 볼륨을 생성한 다음, 쿠버네티스에
표시하기 위해 [`PersistentVolume` 오브젝트](/ko/docs/concepts/storage/persistent-volumes/)를
생성해야 한다. 동적 프로비저닝 기능을 사용하면 클러스터 관리자가
스토리지를 사전 프로비저닝 할 필요가 없다. 대신 사용자가
스토리지를 요청하면 자동으로 프로비저닝 한다.




<!-- body -->

## 배경

동적 볼륨 프로비저닝의 구현은 `storage.k8s.io` API 그룹의 `StorageClass`
API 오브젝트를 기반으로 한다. 클러스터 관리자는 볼륨을 프로비전하는
*볼륨 플러그인* (프로비저너라고도 알려짐)과 프로비저닝시에 프로비저너에게
전달할 파라미터 집합을 지정하는 `StorageClass`
오브젝트를 필요한 만큼 정의할 수 있다.
클러스터 관리자는 클러스터 내에서 사용자 정의 파라미터 집합을
사용해서 여러 가지 유형의 스토리지 (같거나 다른 스토리지 시스템들)를
정의하고 노출시킬 수 있다. 또한 이 디자인을 통해 최종 사용자는
스토리지 프로비전 방식의 복잡성과 뉘앙스에 대해 걱정할 필요가 없다. 하지만,
여전히 여러 스토리지 옵션들을 선택할 수 있다.

스토리지 클래스에 대한 자세한 정보는
[여기](/ko/docs/concepts/storage/storage-classes/)에서 찾을 수 있다.

## 동적 프로비저닝 활성화하기

동적 프로비저닝을 활성화하려면 클러스터 관리자가 사용자를 위해 하나 이상의 스토리지클래스(StorageClass)
오브젝트를 사전 생성해야 한다.
스토리지클래스 오브젝트는 동적 프로비저닝이 호출될 때 사용할 프로비저너와
해당 프로비저너에게 전달할 파라미터를 정의한다.
스토리지클래스 오브젝트의 이름은 유효한
[DNS 서브도메인 이름](/ko/docs/concepts/overview/working-with-objects/names/#dns-서브도메인-이름)이어야 한다.

다음 매니페스트는 표준 디스크와 같은 퍼시스턴트 디스크를 프로비전하는
스토리지 클래스 "slow"를 만든다.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
```

다음 매니페스트는 SSD와 같은 퍼시스턴트 디스크를 프로비전하는
스토리지 클래스 "fast"를 만든다.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-ssd
```

## 동적 프로비저닝 사용하기

사용자는 `PersistentVolumeClaim` 에 스토리지 클래스를 포함시켜 동적으로 프로비전된
스토리지를 요청한다. 쿠버네티스 v1.6 이전에는 `volume.beta.kubernetes.io/storage-class`
어노테이션을 통해 수행되었다. 그러나 이 어노테이션은
v1.9부터는 더 이상 사용하지 않는다. 사용자는 이제 `PersistentVolumeClaim` 오브젝트의
`storageClassName` 필드를 사용해야 한다. 이 필드의 값은
관리자가 구성한 `StorageClass` 의 이름과
일치해야 한다. ([아래](#동적-프로비저닝-활성화하기)를 참고)

예를 들어 "fast" 스토리지 클래스를 선택하려면 다음과
같은 `PersistentVolumeClaim` 을 생성한다.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: claim1
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: fast
  resources:
    requests:
      storage: 30Gi
```

이 클레임의 결과로 SSD와 같은 퍼시스턴트 디스크가 자동으로
프로비전 된다. 클레임이 삭제되면 볼륨이 삭제된다.

## 기본 동작

스토리지 클래스가 지정되지 않은 경우 모든 클레임이 동적으로
프로비전이 되도록 클러스터에서 동적 프로비저닝을 활성화 할 수 있다. 클러스터 관리자는
이 방법으로 활성화 할 수 있다.

- 하나의 `StorageClass` 오브젝트를 *default* 로 표시한다.
- API 서버에서 [`DefaultStorageClass` 어드미션 컨트롤러](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)를
  사용하도록 설정한다.

관리자는 `storageclass.kubernetes.io/is-default-class` 어노테이션을
추가해서 특정 `StorageClass` 를 기본으로 표시할 수 있다.
기본 `StorageClass` 가 클러스터에 존재하고 사용자가
`storageClassName` 를 지정하지 않은 `PersistentVolumeClaim` 을
작성하면, `DefaultStorageClass` 어드미션 컨트롤러가 디폴트
스토리지 클래스를 가리키는 `storageClassName` 필드를 자동으로 추가한다.

클러스터에는 최대 하나의 *default* 스토리지 클래스가 있을 수 있다. 그렇지 않은 경우
`storageClassName` 을 명시적으로 지정하지 않은 `PersistentVolumeClaim` 을
생성할 수 없다.

## 토폴로지 인식

[다중 영역](/ko/docs/setup/best-practices/multiple-zones/) 클러스터에서 파드는 한 지역 내
여러 영역에 걸쳐 분산될 수 있다. 파드가 예약된 영역에서 단일 영역 스토리지 백엔드를
프로비전해야 한다. [볼륨 바인딩 모드](/ko/docs/concepts/storage/storage-classes/#볼륨-바인딩-모드)를
설정해서 수행할 수 있다.
