---
title: CSI 볼륨 복제하기
content_type: concept
weight: 30
---

<!-- overview -->

이 문서에서는 쿠버네티스의 기존 CSI 볼륨 복제의 개념을 설명한다. [볼륨](/ko/docs/concepts/storage/volumes)을 숙지하는 것을 추천한다.




<!-- body -->

## 소개

{{< glossary_tooltip text="CSI" term_id="csi" >}} 볼륨 복제 기능은 `dataSource` 필드에 기존 {{< glossary_tooltip text="PVC" term_id="persistent-volume-claim" >}}를 지정하는 지원을 추가해서 사용자가 {{< glossary_tooltip term_id="volume" >}}을 복제하려는 것을 나타낸다.

복제는 표준 볼륨처럼 소비할 수 있는 쿠버네티스 볼륨의 복제본으로 정의된다.  유일한 차이점은 프로비저닝할 때 "새" 빈 볼륨을 생성하는 대신에 백엔드 장치가 지정된 볼륨의 정확한 복제본을 생성한다는 것이다.

쿠버네티스 API의 관점에서 복제를 구현하면 새로운 PVC 생성 중에 기존 PVC를 데이터 소스로 지정할 수 있는 기능이 추가된다. 소스 PVC는 바인딩되어 있고, 사용 가능해야 한다(사용 중이 아니어야 함).

사용자는 이 기능을 사용할 때 다음 사항을 알고 있어야 한다.

* 복제 지원(`VolumePVCDataSource`)은 CSI 드라이버에서만 사용할 수 있다.
* 복제 지원은 동적 프로비저너만 사용할 수 있다.
* CSI 드라이버는 볼륨 복제 기능을 구현했거나 구현하지 않았을 수 있다.
* PVC는 대상 PVC와 동일한 네임스페이스에 있는 경우에만 복제할 수 있다(소스와 대상은 동일한 네임스페이스에 있어야 함).
* 복제는 동일한 스토리지 클래스 내에서만 지원된다.
    - 대상 볼륨은 소스와 동일한 스토리지 클래스여야 한다.
    - 기본 스토리지 클래스를 사용할 수 있으며, 사양에 storageClassName을 생략할 수 있다.
* 동일한 VolumeMode 설정을 사용하는 두 볼륨에만 복제를 수행할 수 있다(블록 모드 볼륨을 요청하는 경우에는 반드시 소스도 블록 모드여야 한다).


## 프로비저닝

동일한 네임스페이스에서 기존 PVC를 참조하는 dataSource를 추가하는 것을 제외하고는 다른 PVC와 마찬가지로 복제가 프로비전된다.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
    name: clone-of-pvc-1
    namespace: myns
spec:
  accessModes:
  - ReadWriteOnce
  storageClassName: cloning
  resources:
    requests:
      storage: 5Gi
  dataSource:
    kind: PersistentVolumeClaim
    name: pvc-1
```

{{< note >}}
`spec.resources.requests.storage` 에 용량 값을 지정해야 하며, 지정한 값은 소스 볼륨의 용량과 같거나 또는 더 커야 한다.
{{< /note >}}

그 결과로 지정된 소스 `pvc-1` 과 동일한 내용을 가진 `clone-of-pvc-1` 이라는 이름을 가지는 새로운 PVC가 생겨난다.

## 사용

새 PVC를 사용할 수 있게 되면, 복제된 PVC는 다른 PVC와 동일하게 소비된다.  또한, 이 시점에서 새롭게 생성된 PVC는 독립된 오브젝트이다.  원본 dataSource PVC와는 무관하게 독립적으로 소비하고, 복제하고, 스냅샷의 생성 또는 삭제를 할 수 있다.  이는 소스가 새롭게 생성된 복제본에 어떤 방식으로든 연결되어 있지 않으며, 새롭게 생성된 복제본에 영향 없이 수정하거나, 삭제할 수도 있는 것을 의미한다.
