---
# reviewers:
# - saad-ali
# - thockin
# - msau42
# - jingxu97
# - xing-yang
# - yuxiangqian
title: 볼륨 스냅샷
content_type: concept
weight: 60
---

<!-- overview -->

쿠버네티스에서 _VolumeSnapshot_ 은 스토리지 시스템 볼륨 스냅샷을
나타낸다. 이 문서는 이미 쿠버네티스
[퍼시스턴트 볼륨](/ko/docs/concepts/storage/persistent-volumes/)에 대해 잘 알고 있다고 가정한다.

<!-- body -->

## 소개

API 리소스 `PersistentVolume` 및 `PersistentVolumeClaim` 가
사용자와 관리자를 위해 볼륨을 프로비전할 때 사용되는 것과 유사하게, `VolumeSnapshotContent`
및 `VolumeSnapshot` API 리소스는 사용자와 관리자를 위한 볼륨 스냅샷을 생성하기 위해
제공된다.

`VolumeSnapshotContent` 는 관리자가
프로비져닝한 클러스터 내 볼륨의 스냅샷이다. 퍼시스턴트볼륨이
클러스터 리소스인 것처럼 이것 또한 클러스터 리소스이다.

`VolumeSnapshot` 은 사용자가 볼륨의 스냅샷을 요청할 수 있는 방법이다. 이는
퍼시스턴트볼륨클레임과 유사하다.

`VolumeSnapshotClass` 을 사용하면
`VolumeSnapshot` 에 속한 다른 속성을 지정할 수 있다. 이러한 속성은 스토리지 시스템에의 동일한
볼륨에서 가져온 스냅샷마다 다를 수 있으므로
`PersistentVolumeClaim` 의 동일한 `StorageClass` 를 사용하여 표현할 수는 없다.

볼륨 스냅샷은 쿠버네티스 사용자에게 완전히 새로운 볼륨을 생성하지 않고도 특정 시점에 볼륨의 콘텐츠를 복사하는
표준화된 방법을 제공한다.
예를 들어, 데이터베이스 관리자는 이 기능을 사용하여
수정 사항을 편집 또는 삭제하기 전에 데이터베이스를 백업할 수 있다.

사용자는 이 기능을 사용할 때 다음 사항을 알고 있어야 한다.

- API 오브젝트인 `VolumeSnapshot`, `VolumeSnapshotContent`, `VolumeSnapshotClass`
  는 핵심 API가 아닌, {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRDs" >}}
  이다.
- `VolumeSnapshot` 은 CSI 드라이버에서만 사용할 수 있다.
- 쿠버네티스 팀은 `VolumeSnapshot` 의 배포 프로세스 일부로써,
  컨트롤 플레인에 배포할 스냅샷 컨트롤러와 CSI 드라이버와 함께 배포할
  csi-snapshotter라는 사이드카 헬퍼(helper) 컨테이너를 제공한다.
  스냅샷 컨트롤러는 `VolumeSnapshot` 및 `VolumeSnapshotContent` 오브젝트를 관찰하고
  `VolumeSnapshotContent` 오브젝트의 생성 및 삭제에 대한 책임을 진다.
  사이드카 csi-snapshotter는 `VolumeSnapshotContent` 오브젝트를 관찰하고
  CSI 엔드포인트에 대해 `CreateSnapshot` 및 `DeleteSnapshot` 을 트리거(trigger)한다.
- 스냅샷 오브젝트에 대한 강화된 검증을 제공하는 검증 웹훅
  서버도 있다. 이는
  CSI 드라이버가 아닌 스냅샷 컨트롤러 및 CRD와 함께 쿠버네티스 배포판에 의해 설치되어야 한다. 스냅샷 기능이
  활성화된 모든 쿠버네티스 클러스터에 설치해야 한다.
- CSI 드라이버에서의 볼륨 스냅샷 기능 유무는 확실하지 않다.
  볼륨 스냅샷 서포트를 제공하는 CSI 드라이버는
  csi-snapshotter를 사용할 가능성이 높다. 자세한 사항은 [CSI 드라이버 문서](https://kubernetes-csi.github.io/docs/)를 확인하면 된다.
- CRDs 및 스냅샷 컨트롤러는 쿠버네티스 배포 시 설치된다.

## 볼륨 스냅샷 및 볼륨 스냅샷 컨텐츠의 라이프사이클

`VolumeSnapshotContents` 은 클러스터 리소스이다. `VolumeSnapshots` 은
이러한 리소스의 요청이다. `VolumeSnapshotContents` 과 `VolumeSnapshots`의 상호 작용은
다음과 같은 라이프사이클을 따른다.

### 프로비저닝 볼륨 스냅샷

스냅샷을 프로비저닝할 수 있는 방법에는 사전 프로비저닝 혹은 동적 프로비저닝의 두 가지가 있다: .

#### 사전 프로비전 {#static}

클러스터 관리자는 많은 `VolumeSnapshotContents` 을 생성한다. 그들은
클러스터 사용자들이 사용 가능한 스토리지 시스템의 실제 볼륨 스냅샷 세부 정보를 제공한다.
이것은 쿠버네티스 API에 있고 사용 가능하다.

#### 동적

사전 프로비저닝을 사용하는 대신 퍼시스턴트볼륨클레임에서 스냅샷을 동적으로
가져오도록 요청할 수 있다. [볼륨스냅샷클래스](/ko/docs/concepts/storage/volume-snapshot-classes/)는
스냅샷 실행 시 스토리지 제공자의 특정 파라미터를 명세한다.

### 바인딩

스냅샷 컨트롤러는 사전 프로비저닝과 동적 프로비저닝된 시나리오에서 `VolumeSnapshot` 오브젝트와 적절한
`VolumeSnapshotContent` 오브젝트와의 바인딩을 처리한다.
바인딩은 1:1 매핑이다.

사전 프로비저닝된 경우, 볼륨스냅샷은 요청된 볼륨스냅샷컨텐츠 오브젝트가 생성될 때까지
바인드되지 않은 상태로 유지된다.

### 스냅샷 소스 보호로서의 퍼시스턴트 볼륨 클레임

이 보호의 목적은 스냅샷이 생성되는 동안 사용 중인
{{< glossary_tooltip text="퍼시스턴트볼륨클레임" term_id="persistent-volume-claim" >}}
API 오브젝트가 시스템에서 지워지지 않게 하는 것이다
(데이터 손실이 발생할 수 있기 때문에).

퍼시스턴트볼륨클레임이 스냅샷을 생성할 동안에는 해당 퍼시스턴트볼륨클레임은
사용 중인 상태이다. 스냅샷 소스로 사용 중인 퍼시스턴트볼륨클레임 API 오브젝트를
삭제한다면, 퍼시스턴트볼륨클레임 오브젝트는 즉시 삭제되지 않는다. 대신,
퍼시스턴트볼륨클레임 오브젝트 삭제는 스냅샷이 준비(readyToUse) 혹은 중단(aborted) 상태가 될 때까지 연기된다.

### 삭제

`VolumeSnapshot` 를 삭제하면 삭제 과정이 트리거되고, `DeletionPolicy` 가
이어서 실행된다. `DeletionPolicy` 가 `Delete` 라면, 기본 스토리지 스냅샷이
`VolumeSnapshotContent` 오브젝트와 함께 삭제될 것이다. `DeletionPolicy` 가
`Retain` 이라면, 기본 스트리지 스냅샷과 `VolumeSnapshotContent` 둘 다 유지된다.

## 볼륨 스냅샷

각각의 볼륨 스냅샷은 스펙과 상태를 포함한다.

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: new-snapshot-test
spec:
  volumeSnapshotClassName: csi-hostpath-snapclass
  source:
    persistentVolumeClaimName: pvc-test
```

`persistentVolumeClaimName` 은 스냅샷을 위한 퍼시스턴트볼륨클레임 데이터 소스의
이름이다. 이 필드는 동적 프로비저닝 스냅샷이 필요하다.

볼륨 스냅샷은 `volumeSnapshotClassName` 속성을 사용하여
[볼륨스냅샷클래스](/ko/docs/concepts/storage/volume-snapshot-classes/)의 이름을 지정하여
특정 클래스를 요청할 수 있다. 아무것도 설정하지 않으면, 사용 가능한 경우
기본 클래스가 사용될 것이다.

사전 프로비저닝된 스냅샷의 경우, 다음 예와 같이 `volumeSnapshotContentName`을
스냅샷 소스로 지정해야 한다. 사전 프로비저닝된 스냅샷에는
`volumeSnapshotContentName` 소스 필드가 필요하다.

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: test-snapshot
spec:
  source:
    volumeSnapshotContentName: test-content
```

## 볼륨 스냅샷 컨텐츠

각각의 볼륨스냅샷컨텐츠는 스펙과 상태를 포함한다. 동적 프로비저닝에서는,
스냅샷 공통 컨트롤러는 `VolumeSnapshotContent` 오브젝트를 생성한다. 예시는 다음과 같다.

```yaml
apiVersion: snapshot.storage.k8s.io/v1beta1
kind: VolumeSnapshotContent
metadata:
  name: snapcontent-72d9a349-aacd-42d2-a240-d775650d2455
spec:
  deletionPolicy: Delete
  driver: hostpath.csi.k8s.io
  source:
    volumeHandle: ee0cfb94-f8d4-11e9-b2d8-0242ac110002
  sourceVolumeMode: Filesystem
  volumeSnapshotClassName: csi-hostpath-snapclass
  volumeSnapshotRef:
    name: new-snapshot-test
    namespace: default
    uid: 72d9a349-aacd-42d2-a240-d775650d2455
```

`volumeHandle` 은 스토리지 백엔드에서 생성되고
볼륨 생성 중에 CSI 드라이버가 반환하는 볼륨의 고유 식별자이다. 이 필드는
스냅샷을 동적 프로비저닝하는 데 필요하다.
이것은 스냅샷의 볼륨 소스를 지정한다.

사전 프로비저닝된 스냅샷의 경우, (클러스터 관리자로서) 다음과 같이
`VolumeSnapshotContent` 오브젝트를 생성해야 한다.

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotContent
metadata:
  name: new-snapshot-content-test
spec:
  deletionPolicy: Delete
  driver: hostpath.csi.k8s.io
  source:
    snapshotHandle: 7bdd0de3-aaeb-11e8-9aae-0242ac110002
  sourceVolumeMode: Filesystem
  volumeSnapshotRef:
    name: new-snapshot-test
    namespace: default
```

`snapshotHandle` 은 스토리지 백엔드에서 생성된 볼륨 스냅샷의
고유 식별자이다. 이 필드는 사전 프로비저닝된 스냅샷에 필요하다.
`VolumeSnapshotContent` 가 나타내는 스토리지 시스템의 CSI 스냅샷 id를
지정한다.

`sourceVolumeMode` 은 스냅샷이 생성된 볼륨의 모드를 나타낸다.
`sourceVolumeMode` 필드의 값은 `Filesystem` 또는 `Block` 일 수 있다.
소스 볼륨 모드가 명시되어 있지 않으면,
쿠버네티스는 해당 스냅샷의 소스 볼륨 모드를 알려지지 않은 상태(unknown)로 간주하여 스냅샷을 처리한다.

`volumeSnapshotRef`은 상응하는 `VolumeSnapshot`의 참조이다.
`VolumeSnapshotContent`이 이전에 프로비전된 스냅샷으로 생성된 경우,
`volumeSnapshotRef`에서 참조하는 `VolumeSnapshot`은 아직 존재하지 않을 수도 있음에 주의한다.

## 스냅샷의 볼륨 모드 변환하기 {#convert-volume-mode}

클러스터에 설치된 `VolumeSnapshots` API가 `sourceVolumeMode` 필드를 지원한다면,
인증되지 않은 사용자가 볼륨의 모드를 변경하는 것을 금지하는 기능이
API에 있는 것이다.

클러스터가 이 기능을 지원하는지 확인하려면, 다음 명령어를 실행한다.

```yaml
$ kubectl get crd volumesnapshotcontent -o yaml
```

사용자가 기존 `VolumeSnapshot`으로부터 `PersistentVolumeClaim`을 생성할 때
기존 소스와 다른 볼륨 모드를 지정할 수 있도록 하려면,
`VolumeSnapshot`와 연관된 `VolumeSnapshotContent`에
`snapshot.storage.kubernetes.io/allowVolumeModeChange: "true"` 어노테이션을 추가해야 한다.

이전에 프로비전된 스냅샷의 경우에는, 클러스터 관리자가 `spec.sourceVolumeMode`를
추가해야 한다.

이 기능이 활성화된 예시 `VolumeSnapshotContent` 리소스는 다음과 같을 것이다.

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotContent
metadata:
  name: new-snapshot-content-test
  annotations:
    - snapshot.storage.kubernetes.io/allowVolumeModeChange: "true"
spec:
  deletionPolicy: Delete
  driver: hostpath.csi.k8s.io
  source:
    snapshotHandle: 7bdd0de3-aaeb-11e8-9aae-0242ac110002
  sourceVolumeMode: Filesystem
  volumeSnapshotRef:
    name: new-snapshot-test
    namespace: default
```

## 스냅샷을 위한 프로비저닝 볼륨

`PersistentVolumeClaim` 오브젝트의 _dataSource_ 필드를 사용하여
스냅샷 데이터로 미리 채워진 새 볼륨을 프로비저닝할 수 있다.

보다 자세한 사항은
[볼륨 스냅샷 및 스냅샷에서 볼륨 복원](/ko/docs/concepts/storage/persistent-volumes/#볼륨-스냅샷-및-스냅샷-지원에서-볼륨-복원)에서 확인할 수 있다.
