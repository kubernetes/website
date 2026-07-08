---
# reviewers:
# - jsafrane
# - saad-ali
# - msau42
# - xing-yang
# - pohly
title: 임시 볼륨
content_type: concept
weight: 30
---

<!-- overview -->

이 문서는 쿠버네티스의 _임시(ephemeral) 볼륨_ 에 대해 설명한다. 
쿠버네티스 [볼륨](/ko/docs/concepts/storage/volumes/), 
특히 퍼시스턴트볼륨클레임(PersistentVolumeClaim) 및 퍼시스턴트볼륨(PersistentVolume)에 대해 잘 알고 있는 것이 좋다.

<!-- body -->

일부 애플리케이션은 추가적인 저장소를 필요로 하면서도 
재시작 시 데이터의 영구적 보존 여부는 신경쓰지 않을 수도 있다. 
예를 들어, 캐싱 서비스는 종종 메모리 사이즈에 제약을 받으며 
이에 따라 전반적인 성능에 적은 영향을 미치면서도 
사용 데이터를 메모리보다는 느린 저장소에 간헐적으로 옮길 수도 있다.

또 다른 애플리케이션은 읽기 전용 입력 데이터를 파일에서 읽도록 되어 있으며, 
이러한 데이터의 예시로는 구성 데이터 또는 비밀 키 등이 있다.

_임시 볼륨_ 은 이러한 사용 사례를 위해 설계되었다. 
임시 볼륨은 파드의 수명을 따르며 파드와 함께 생성 및 삭제되기 때문에, 
일부 퍼시스턴트 볼륨이 어디에서 사용 가능한지에 제약되는 일 없이 
파드가 중지 및 재시작될 수 있다.

임시 볼륨은 파드 명세에 _인라인_ 으로 명시되며, 
이로 인해 애플리케이션 배포 및 관리가 간편해진다.

### 임시 볼륨의 종류

쿠버네티스는 각 목적에 맞는 
몇 가지의 임시 볼륨을 지원한다.
- [emptyDir](/ko/docs/concepts/storage/volumes/#emptydir): 
  파드가 시작될 때 빈 상태로 시작되며, 
  저장소는 로컬의 kubelet 베이스 디렉터리(보통 루트 디스크) 또는 램에서 제공된다
- [configMap](/ko/docs/concepts/storage/volumes/#configmap),
  [downwardAPI](/ko/docs/concepts/storage/volumes/#downwardapi),
  [secret](/ko/docs/concepts/storage/volumes/#secret): 
  각 종류의 쿠버네티스 데이터를 파드에 주입한다
- [CSI 임시 볼륨](#csi-ephemeral-volumes): 
  앞의 볼륨 종류와 비슷하지만, 
  특히 [이 기능을 지원](https://kubernetes-csi.github.io/docs/drivers.html)하는 특수한 
  [CSI 드라이버](https://github.com/container-storage-interface/spec/blob/master/spec.md)에 의해 제공된다
- [일반(generic) 임시 볼륨](#generic-ephemeral-volumes): 
  퍼시스턴트 볼륨도 지원하는 모든 스토리지 드라이버에 의해 제공될 수 있다

`emptyDir`, `configMap`, `downwardAPI`, `secret`은 
[로컬 임시 스토리지](/ko/docs/concepts/configuration/manage-resources-containers/#로컬-임시-ephemeral-스토리지)로서 
제공된다. 
이들은 각 노드의 kubelet에 의해 관리된다.

CSI 임시 볼륨은 
써드파티 CSI 스토리지 드라이버에 의해 제공 *되어야 한다*.

일반 임시 볼륨은 써드파티 CSI 스토리지 드라이버에 의해 제공 *될 수 있지만*, 
동적 프로비저닝을 지원하는 다른 스토리지 드라이버에 의해서도 제공될 수 있다. 
일부 CSI 드라이버는 특히 CSI 임시 볼륨을 위해 만들어져서 
동적 프로비저닝을 지원하지 않는데, 
이러한 경우에는 일반 임시 볼륨 용으로는 사용할 수 없다.

써드파티 드라이버 사용의 장점은 
쿠버네티스 자체적으로는 지원하지 않는 기능(예: 
kubelet에서 관리하는 디스크와 성능 특성이 다른 스토리지, 또는 다른 데이터 주입)을 
제공할 수 있다는 것이다.

### CSI 임시 볼륨 {#csi-ephemeral-volumes}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

{{< note >}}
CSI 드라이버 중 일부만 CSI 임시 볼륨을 지원한다.
쿠버네티스 CSI [드라이버 목록](https://kubernetes-csi.github.io/docs/drivers.html)에서 
어떤 드라이버가 임시 볼륨을 지원하는지 보여 준다.
{{< /note >}}

개념적으로, CSI 임시 볼륨은 `configMap`, `downwardAPI`, `secret` 볼륨 유형과 비슷하다. 
즉, 스토리지는 각 노드에서 로컬하게 관리되며, 
파드가 노드에 스케줄링된 이후에 다른 로컬 리소스와 함께 생성된다. 
쿠버네티스에는 지금 단계에서는 파드를 재스케줄링하는 개념이 없다. 
볼륨 생성은 실패하는 일이 거의 없어야 하며, 
만약 실패할 경우 파드 시작 과정이 중단될 것이다. 
특히, [스토리지 용량 인지 파드 스케줄링](/ko/docs/concepts/storage/storage-capacity/)은 
이러한 볼륨에 대해서는 지원되지 *않는다*. 
또한 이러한 볼륨은 파드의 스토리지 자원 사용 상한에 제한받지 않는데, 
이는 kubelet 자신이 관리하는 스토리지에만 강제할 수 있는 것이기 때문이다.


다음은 CSI 임시 스토리지를 사용하는 파드에 대한 예시 매니페스트이다.

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: my-csi-app
spec:
  containers:
    - name: my-frontend
      image: busybox:1.28
      volumeMounts:
      - mountPath: "/data"
        name: my-csi-inline-vol
      command: [ "sleep", "1000000" ]
  volumes:
    - name: my-csi-inline-vol
      csi:
        driver: inline.storage.kubernetes.io
        volumeAttributes:
          foo: bar
```

`volumeAttributes`은 드라이버에 의해 어떤 볼륨이 준비되는지를 결정한다. 
이러한 속성은 각 드라이버별로 다르며 표준화되지 않았다. 
더 자세한 사항은 각 CSI 드라이버 문서를 
참고한다.

### CSI 드라이버 제한 사항

CSI 임시 볼륨은 사용자로 하여금 `volumeAttributes`를 
파드 스펙의 일부로서 CSI 드라이버에 직접 제공할 수 있도록 한다. 
보통은 관리자만 사용할 수 있는 `volumeAttributes`를 허용하는 CSI 드라이버는 
내장(inline) 임시 볼륨 내에서 사용하는 것이 적합하지 않다. 
예를 들어, 일반적으로 스토리지클래스 내에 정의되어 있는 파라미터들은 
내장 임시 볼륨 사용을 통해 사용자에게 노출되어서는 안 된다.

클러스터 관리자가 이처럼 파드 스펙 내장 임시 볼륨 사용이 가능한 CSI 드라이버를 제한하려면 
다음을 수행할 수 있다.

- CSIDriver 스펙의 `volumeLifecycleModes`에서 `Ephemeral`을 제거하여, 
  해당 드라이버가 내장 임시 볼륨으로 사용되는 것을 막는다.
- [어드미션 웹훅](/docs/reference/access-authn-authz/extensible-admission-controllers/)을 사용하여 
  드라이버를 활용하는 방법을 제한한다.

### 일반 임시 볼륨 {#generic-ephemeral-volumes}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

일반 임시 볼륨은 
프로비저닝 후 일반적으로 비어 있는 스크래치 데이터에 대해 파드 별 디렉터리를 제공한다는 점에서 
`emptyDir` 볼륨과 유사하다. 
하지만 다음과 같은 추가 기능도 제공한다.

- 스토리지는 로컬이거나 네트워크 연결형(network-attached)일 수 있다.
- 볼륨의 크기를 고정할 수 있으며 파드는 이 크기를 초과할 수 없다.
- 드라이버와 파라미터에 따라 
  볼륨이 초기 데이터를 가질 수도 있다.
- 볼륨에 대한 일반적인 작업은 드라이버가 지원하는 범위 내에서 지원된다. 
  이와 같은 작업은 다음을 포함한다.
  [스냅샷](/ko/docs/concepts/storage/volume-snapshots/),
  [복제](/ko/docs/concepts/storage/volume-pvc-datasource/),
  [크기 조정](/ko/docs/concepts/storage/persistent-volumes/#퍼시스턴트-볼륨-클레임-확장),
  및 [스토리지 용량 추적](/ko/docs/concepts/storage/storage-capacity/).

다음은 예시이다.

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: my-app
spec:
  containers:
    - name: my-frontend
      image: busybox:1.28
      volumeMounts:
      - mountPath: "/scratch"
        name: scratch-volume
      command: [ "sleep", "1000000" ]
  volumes:
    - name: scratch-volume
      ephemeral:
        volumeClaimTemplate:
          metadata:
            labels:
              type: my-frontend-volume
          spec:
            accessModes: [ "ReadWriteOnce" ]
            storageClassName: "scratch-storage-class"
            resources:
              requests:
                storage: 1Gi
```

### 라이프사이클 및 퍼시스턴트볼륨클레임

핵심 설계 아이디어는 
[볼륨 클레임을 위한 파라미터](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ephemeralvolumesource-v1alpha1-core)는 
파드의 볼륨 소스 내부에서 허용된다는 점이다. 
레이블, 어노테이션 및 퍼시스턴트볼륨클레임을 위한 모든 필드가 지원된다. 
이러한 파드가 생성되면, 임시 볼륨 컨트롤러는 파드가 속한 동일한 네임스페이스에 
퍼시스턴트볼륨클레임 오브젝트를 생성하고 
파드가 삭제될 때에는 퍼시스턴트볼륨클레임도 삭제되도록 만든다.

이는 볼륨 바인딩 및/또는 프로비저닝을 유발하는데, 
{{< glossary_tooltip text="스토리지클래스" term_id="storage-class" >}}가 
즉각적인(immediate) 볼륨 바인딩을 사용하는 경우에는 즉시, 
또는 파드가 노드에 잠정적으로 스케줄링되었을 때 발생한다(`WaitForFirstConsumer` 볼륨 바인딩 모드). 
일반 임시 볼륨에는 후자가 추천되는데, 이 경우 스케줄러가 파드를 할당하기에 적합한 노드를 선택하기가 쉬워지기 때문이다. 
즉각적인 바인딩을 사용하는 경우, 
스케줄러는 볼륨이 사용 가능해지는 즉시 해당 볼륨에 접근 가능한 노드를 선택하도록 강요받는다.

[리소스 소유권](/ko/docs/concepts/architecture/garbage-collection/#owners-dependents) 관점에서, 
일반 임시 스토리지를 갖는 파드는 
해당 임시 스토리지를 제공하는 퍼시스턴트볼륨클레임의 소유자이다. 
파드가 삭제되면, 쿠버네티스 가비지 콜렉터는 해당 PVC를 삭제하는데, 
스토리지 클래스의 기본 회수 정책이 볼륨을 삭제하는 것이기 때문에 PVC의 삭제는 보통 볼륨의 삭제를 유발한다. 
회수 정책을 `retain`으로 설정한 스토리지클래스를 사용하여 준 임시(quasi-ephemeral) 로컬 스토리지를 생성할 수도 있는데, 
이렇게 하면 스토리지의 수명이 파드의 수명보다 길어지며, 
이러한 경우 볼륨 정리를 별도로 수행해야 함을 명심해야 한다.

이러한 PVC가 존재하는 동안은, 다른 PVC와 동일하게 사용될 수 있다. 
특히, 볼륨 복제 또는 스냅샷 시에 데이터 소스로 참조될 수 있다. 
또한 해당 PVC 오브젝트는 해당 볼륨의 현재 상태도 
가지고 있다.

### 퍼시스턴트볼륨클레임 이름 정하기

자동으로 생성된 PVC의 이름은 규칙에 따라 정해진다. 
PVC의 이름은 파드 이름과 볼륨 이름의 사이를 하이픈(`-`)으로 결합한 형태이다. 
위의 예시에서, PVC 이름은 `my-app-scratch-volume`가 된다. 
이렇게 규칙에 의해 정해진 이름은 PVC와의 상호작용을 더 쉽게 만드는데, 
이는 파드 이름과 볼륨 이름을 알면 
PVC 이름을 별도로 검색할 필요가 없기 때문이다.

PVC 이름 규칙에 따라 서로 다른 파드 간 이름 충돌이 발생할 수 
있으며("pod-a" 파드 + "scratch" 볼륨 vs. "pod" 파드 + "a-scratch" 볼륨 - 
두 경우 모두 PVC 이름은 "pod-a-scratch") 
또한 파드와 수동으로 생성한 PVC 간에도 이름 충돌이 발생할 수 있다.

이러한 충돌은 감지될 수 있는데, 이는 PVC가 파드를 위해 생성된 경우에만 임시 볼륨으로 사용되기 때문이다. 
이러한 체크는 소유권 관계를 기반으로 한다. 
기존에 존재하던 PVC는 덮어써지거나 수정되지 않는다. 
대신에 충돌을 해결해주지는 않는데, 
이는 적합한 PVC가 없이는 파드가 시작될 수 없기 때문이다.

{{< caution >}}
이러한 충돌이 발생하지 않도록 
동일한 네임스페이스 내에서는 파드와 볼륨의 이름을 정할 때 주의해야 한다.
{{< /caution >}}

### 보안

GenericEphemeralVolume 기능을 활성화하면 
사용자가 파드를 생성할 수 있는 경우 PVC를 간접적으로 생성할 수 있도록 허용하며, 
심지어 사용자가 PVC를 직접적으로 만들 수 있는 권한이 없는 경우에도 이를 허용한다. 
클러스터 관리자는 이를 명심해야 한다. 이것이 보안 모델에 부합하지 않는다면,
[어드미션 웹훅](/docs/reference/access-authn-authz/extensible-admission-controllers/)을 사용하여 
일반 임시 볼륨을 갖는 파드와 같은 오브젝트를 거부해야 한다.

일반적인 [PVC의 네임스페이스 쿼터](/ko/docs/concepts/policy/resource-quotas/#스토리지-리소스-쿼터)는 여전히 적용되므로, 
사용자가 이 새로운 메카니즘을 사용할 수 있도록 허용되었어도, 
다른 정책을 우회하는 데에는 사용할 수 없다.

## {{% heading "whatsnext" %}}

### kubelet이 관리하는 임시 볼륨

[로컬 임시 스토리지](/ko/docs/concepts/configuration/manage-resources-containers/#로컬-임시-ephemeral-스토리지)를 참고한다.

### CSI 임시 볼륨

- 설계에 대한 더 자세한 정보는 
  [임시 인라인 CSI 볼륨 KEP](https://github.com/kubernetes/enhancements/blob/ad6021b3d61a49040a3f835e12c8bb5424db2bbb/keps/sig-storage/20190122-csi-inline-volumes.md)를 참고한다.
- 이 기능의 추가 개발에 대한 자세한 정보는 [enhancement 저장소의 이슈 #596](https://github.com/kubernetes/enhancements/issues/596)을 참고한다.

### 일반 임시 볼륨

- 설계에 대한 더 자세한 정보는 
  [일반 임시 인라인 볼륨 KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/1698-generic-ephemeral-volumes/README.md)를 참고한다.
