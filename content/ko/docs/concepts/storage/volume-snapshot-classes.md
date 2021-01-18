---







title: 볼륨 스냅샷 클래스
content_type: concept
weight: 30
---

<!-- overview -->

이 문서는 쿠버네티스의 볼륨스냅샷클래스(VolumeSnapshotClass) 개요를 설명한다.
[볼륨 스냅샷](/ko/docs/concepts/storage/volume-snapshots/)과
[스토리지 클래스](/ko/docs/concepts/storage/storage-classes)의 숙지를 추천한다.




<!-- body -->

## 소개

스토리지클래스(StorageClass)는 관리자가 볼륨을 프로비저닝할 때 제공하는 스토리지의 "클래스"를
설명하는 방법을 제공하는 것처럼, 볼륨스냅샷클래스는 볼륨 스냅샷을
프로비저닝할 때 스토리지의 "클래스"를 설명하는 방법을 제공한다.

## VolumeSnapshotClass 리소스

각 볼륨스냅샷클래스에는 클래스에 속하는 볼륨스냅샷을
동적으로 프로비전 할 때 사용되는 `driver`, `deletionPolicy` 그리고 `parameters`
필드를 포함한다.

볼륨스냅샷클래스 오브젝트의 이름은 중요하며, 사용자가 특정
클래스를 요청할 수 있는 방법이다. 관리자는 볼륨스냅샷클래스 오브젝트를
처음 생성할 때 클래스의 이름과 기타 파라미터를 설정하고, 오브젝트가
생성된 이후에는 업데이트할 수 없다.

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotClass
metadata:
  name: csi-hostpath-snapclass
driver: hostpath.csi.k8s.io
deletionPolicy: Delete
parameters:
```

관리자는`snapshot.storage.kubernetes.io/is-default-class: "true"` 어노테이션을 추가하여
바인딩할 특정 클래스를 요청하지 않는 볼륨스냅샷에 대한
기본 볼륨스냅샷클래스를 지정할 수 있다.

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotClass
metadata:
  name: csi-hostpath-snapclass
  annotations:
    snapshot.storage.kubernetes.io/is-default-class: "true"
driver: hostpath.csi.k8s.io
deletionPolicy: Delete
parameters:
```

### 드라이버

볼륨 스냅샷 클래스에는 볼륨스냅샷의 프로비저닝에 사용되는 CSI 볼륨 플러그인을
결정하는 드라이버를 가지고 있다. 이 필드는 반드시 지정해야한다.

### 삭제정책(DeletionPolicy)

볼륨 스냅샷 클래스는 삭제정책을 가지고 있다. 바인딩된 볼륨스냅샷 오브젝트를 삭제할 때 VolumeSnapshotContent의 상황을 구성할 수 있다. 볼륨 스냅샷 클래스의 삭제정책은 `Retain` 또는 `Delete` 일 수 있다. 이 필드는 반드시 지정해야 한다.

삭제정책이 `Delete` 인 경우 기본 스토리지 스냅샷이 VolumeSnapshotContent 오브젝트와 함께 삭제된다. 삭제정책이 `Retain` 인 경우 기본 스냅샷과 VolumeSnapshotContent 모두 유지된다.

## 파라미터

볼륨 스냅샷 클래스에는 볼륨 스냅샷 클래스에 속하는 볼륨 스냅샷을
설명하는 파라미터를 가지고 있다. `driver` 에 따라 다른 파라미터를 사용할
수 있다.
