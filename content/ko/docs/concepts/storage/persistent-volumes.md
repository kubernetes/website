---






title: 퍼시스턴트 볼륨
feature:
  title: 스토리지 오케스트레이션
  description: >
    로컬 스토리지, <a href="https://cloud.google.com/storage/">GCP</a>나 <a href="https://aws.amazon.com/products/storage/">AWS</a>와 같은 퍼블릭 클라우드 공급자 또는 NFS, iSCSI, Gluster, Ceph, Cinder나 Flocker와 같은 네트워크 스토리지 시스템에서 원하는 스토리지 시스템을 자동으로 마운트한다.

content_type: concept
weight: 20
---

<!-- overview -->

이 페이지는 쿠버네티스의 _퍼시스턴트 볼륨_ 의 현재 상태를 설명한다. [볼륨](/ko/docs/concepts/storage/volumes/)에 대해 익숙해지는 것을 추천한다.

<!-- body -->

## 소개

스토리지 관리는 컴퓨트 인스턴스 관리와는 별개의 문제다. 퍼시스턴트볼륨 서브시스템은 사용자 및 관리자에게 스토리지 사용 방법에서부터 스토리지가 제공되는 방법에 대한 세부 사항을 추상화하는 API를 제공한다. 이를 위해 퍼시스턴트볼륨 및 퍼시스턴트볼륨클레임이라는 두 가지 새로운 API 리소스를 소개한다.

_퍼시스턴트볼륨_ (PV)은 관리자가 프로비저닝하거나 [스토리지 클래스](/ko/docs/concepts/storage/storage-classes/)를 사용하여 동적으로 프로비저닝한 클러스터의 스토리지이다. 노드가 클러스터 리소스인 것처럼 PV는 클러스터 리소스이다. PV는 Volumes와 같은 볼륨 플러그인이지만, PV를 사용하는 개별 파드와는 별개의 라이프사이클을 가진다. 이 API 오브젝트는 NFS, iSCSI 또는 클라우드 공급자별 스토리지 시스템 등 스토리지 구현에 대한 세부 정보를 담아낸다.

_퍼시스턴트볼륨클레임_ (PVC)은 사용자의 스토리지에 대한 요청이다. 파드와 비슷하다. 파드는 노드 리소스를 사용하고 PVC는 PV 리소스를 사용한다. 파드는 특정 수준의 리소스(CPU 및 메모리)를 요청할 수 있다. 클레임은 특정 크기 및 접근 모드를 요청할 수 있다(예: ReadWriteOnce, ReadOnlyMany 또는 ReadWriteMany로 마운트 할 수 있음. [AccessModes](#접근-모드) 참고).

퍼시스턴트볼륨클레임을 사용하면 사용자가 추상화된 스토리지 리소스를 사용할 수 있지만, 다른 문제들 때문에 성능과 같은 다양한 속성을 가진 퍼시스턴트볼륨이 필요한 경우가 일반적이다. 클러스터 관리자는 사용자에게 해당 볼륨의 구현 방법에 대한 세부 정보를 제공하지 않고 단순히 크기와 접근 모드와는 다른 방식으로 다양한 퍼시스턴트볼륨을 제공할 수 있어야 한다. 이러한 요구에는 _스토리지클래스_ 리소스가 있다.

[실습 예제와 함께 상세한 내용](/ko/docs/tasks/configure-pod-container/configure-persistent-volume-storage/)을 참고하길 바란다.

## 볼륨과 클레임 라이프사이클

PV는 클러스터 리소스이다. PVC는 해당 리소스에 대한 요청이며 리소스에 대한 클레임 검사 역할을 한다. PV와 PVC 간의 상호 작용은 다음 라이프사이클을 따른다.

### 프로비저닝

PV를 프로비저닝 할 수 있는 두 가지 방법이 있다: 정적(static) 프로비저닝과 동적(dynamic) 프로비저닝

#### 정적 프로비저닝

클러스터 관리자는 여러 PV를 만든다. 클러스터 사용자가 사용할 수 있는 실제 스토리지의 세부 사항을 제공한다. 이 PV들은 쿠버네티스 API에 존재하며 사용할 수 있다.

#### 동적 프로비저닝

관리자가 생성한 정적 PV가 사용자의 퍼시스턴트볼륨클레임과 일치하지 않으면
클러스터는 PVC를 위해 특별히 볼륨을 동적으로 프로비저닝 하려고 시도할 수 있다.
이 프로비저닝은 스토리지클래스를 기반으로 한다. PVC는
[스토리지 클래스](/ko/docs/concepts/storage/storage-classes/)를
요청해야 하며 관리자는 동적 프로비저닝이 발생하도록 해당 클래스를 생성하고 구성해야 한다.
`""` 클래스를 요청하는 클레임은 동적 프로비저닝을 효과적으로
비활성화한다.

스토리지 클래스를 기반으로 동적 스토리지 프로비저닝을 사용하려면 클러스터 관리자가 API 서버에서
`DefaultStorageClass` [어드미션 컨트롤러](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)를 사용하도록 설정해야 한다.
예를 들어 API 서버 컴포넌트의 `--enable-admission-plugins` 플래그에 대한 쉼표로 구분되어
정렬된 값들의 목록 중에 `DefaultStorageClass`가 포함되어 있는지 확인하여 설정할 수 있다.
API 서버 커맨드라인 플래그에 대한 자세한 정보는
[kube-apiserver](/docs/admin/kube-apiserver/) 문서를 확인하면 된다.

### 바인딩

사용자는 원하는 특정 용량의 스토리지와 특정 접근 모드로 퍼시스턴트볼륨클레임을 생성하거나 동적 프로비저닝의 경우 이미 생성한 상태다. 마스터의 컨트롤 루프는 새로운 PVC를 감시하고 일치하는 PV(가능한 경우)를 찾아 서로 바인딩한다. PV가 새 PVC에 대해 동적으로 프로비저닝된 경우 루프는 항상 해당 PV를 PVC에 바인딩한다. 그렇지 않으면 사용자는 항상 최소한 그들이 요청한 것을 얻지만 볼륨은 요청된 것을 초과할 수 있다. 일단 바인딩되면 퍼시스턴트볼륨클레임은 어떻게 바인딩되었는지 상관없이 배타적으로 바인딩된다. PVC 대 PV 바인딩은 일대일 매핑으로, 퍼시스턴트볼륨과 퍼시스턴트볼륨클레임 사이의 양방향 바인딩인 ClaimRef를 사용한다.

일치하는 볼륨이 없는 경우 클레임은 무한정 바인딩되지 않은 상태로 남아 있다. 일치하는 볼륨이 제공되면 클레임이 바인딩된다. 예를 들어 많은 수의 50Gi PV로 프로비저닝된 클러스터는 100Gi를 요청하는 PVC와 일치하지 않는다. 100Gi PV가 클러스터에 추가되면 PVC를 바인딩할 수 있다.

### 사용 중

파드는 클레임을 볼륨으로 사용한다. 클러스터는 클레임을 검사하여 바인딩된 볼륨을 찾고 해당 볼륨을 파드에 마운트한다. 여러 접근 모드를 지원하는 볼륨의 경우 사용자는 자신의 클레임을 파드에서 볼륨으로 사용할 때 원하는 접근 모드를 지정한다.

일단 사용자에게 클레임이 있고 그 클레임이 바인딩되면, 바인딩된 PV는 사용자가 필요로 하는 한 사용자에게 속한다. 사용자는 파드의 `volumes` 블록에 `persistentVolumeClaim`을 포함하여 파드를 스케줄링하고 클레임한 PV에 접근한다. 이에 대한 자세한 내용은 [볼륨으로 클레임하기](#볼륨으로-클레임하기)를 참고하길 바란다.

### 사용 중인 스토리지 오브젝트 ​​보호
사용 중인 스토리지 오브젝트 ​​보호 기능의 목적은 PVC에 바인딩된 파드와 퍼시스턴트볼륨(PV)이 사용 중인 퍼시스턴트볼륨클레임(PVC)을 시스템에서 삭제되지 않도록 하는 것이다. 삭제되면 이로 인해 데이터의 손실이 발생할 수 있기 때문이다.

{{< note >}}
PVC를 사용하는 파드 오브젝트가 존재하면 파드가 PVC를 사용하고 있는 상태이다.
{{< /note >}}

사용자가 파드에서 활발하게 사용 중인 PVC를 삭제하면 PVC는 즉시 삭제되지 않는다. PVC가 더 이상 파드에서 적극적으로 사용되지 않을 때까지 PVC 삭제가 연기된다. 또한 관리자가 PVC에 바인딩된 PV를 삭제하면 PV는 즉시 삭제되지 않는다. PV가 더 이상 PVC에 바인딩되지 않을 때까지 PV 삭제가 연기된다.

PVC의 상태가 `Terminating`이고 `Finalizers` 목록에 `kubernetes.io/pvc-protection`이 포함되어 있으면 PVC가 보호된 것으로 볼 수 있다.

```shell
kubectl describe pvc hostpath
Name:          hostpath
Namespace:     default
StorageClass:  example-hostpath
Status:        Terminating
Volume:
Labels:        <none>
Annotations:   volume.beta.kubernetes.io/storage-class=example-hostpath
               volume.beta.kubernetes.io/storage-provisioner=example.com/hostpath
Finalizers:    [kubernetes.io/pvc-protection]
...
```

마찬가지로 PV 상태가 `Terminating`이고 `Finalizers` 목록에 `kubernetes.io/pv-protection`이 포함되어 있으면 PV가 보호된 것으로 볼 수 있다.

```shell
kubectl describe pv task-pv-volume
Name:            task-pv-volume
Labels:          type=local
Annotations:     <none>
Finalizers:      [kubernetes.io/pv-protection]
StorageClass:    standard
Status:          Terminating
Claim:
Reclaim Policy:  Delete
Access Modes:    RWO
Capacity:        1Gi
Message:
Source:
    Type:          HostPath (bare host directory volume)
    Path:          /tmp/data
    HostPathType:
Events:            <none>
```

### 반환(Reclaiming)

사용자가 볼륨을 다 사용하고나면 리소스를 반환할 수 있는 API를 사용하여 PVC 오브젝트를 삭제할 수 있다. 퍼시스턴트볼륨의 반환 정책은 볼륨에서 클레임을 해제한 후 볼륨에 수행할 작업을 클러스터에 알려준다. 현재 볼륨에 대한 반환 정책은 Retain, Recycle, 그리고 Delete가 있다.

#### Retain(보존)

`Retain` 반환 정책은 리소스를 수동으로 반환할 수 있게 한다. 퍼시스턴트볼륨클레임이 삭제되면 퍼시스턴트볼륨은 여전히 존재하며 볼륨은 "릴리스 된" 것으로 간주된다. 그러나 이전 요청자의 데이터가 여전히 볼륨에 남아 있기 때문에 다른 요청에 대해서는 아직 사용할 수 없다. 관리자는 다음 단계에 따라 볼륨을 수동으로 반환할 수 있다.

1. 퍼시스턴트볼륨을 삭제한다. PV가 삭제된 후에도 외부 인프라(예: AWS EBS, GCE PD, Azure Disk 또는 Cinder 볼륨)의 관련 스토리지 자산이 존재한다.
1. 관련 스토리지 자산의 데이터를 수동으로 삭제한다.
1. 연결된 스토리지 자산을 수동으로 삭제하거나 동일한 스토리지 자산을 재사용하려는 경우 스토리지 자산 정의로 새 퍼시스턴트볼륨을 생성한다.

#### Delete(삭제)

`Delete` 반환 정책을 지원하는 볼륨 플러그인의 경우, 삭제는 쿠버네티스에서 퍼시스턴트볼륨 오브젝트와 외부 인프라(예: AWS EBS, GCE PD, Azure Disk 또는 Cinder 볼륨)의 관련 스토리지 자산을 모두 삭제한다. 동적으로 프로비저닝된 볼륨은 [스토리지클래스의 반환 정책](#반환-정책)을 상속하며 기본값은 `Delete`이다. 관리자는 사용자의 기대에 따라 스토리지클래스를 구성해야 한다. 그렇지 않으면 PV를 생성한 후 PV를 수정하거나 패치해야 한다. [퍼시스턴트볼륨의 반환 정책 변경](/ko/docs/tasks/administer-cluster/change-pv-reclaim-policy/)을 참고하길 바란다.

#### Recycle(재활용)

{{< warning >}}
`Recycle` 반환 정책은 더 이상 사용하지 않는다. 대신 권장되는 방식은 동적 프로비저닝을 사용하는 것이다.
{{< /warning >}}

기본 볼륨 플러그인에서 지원하는 경우 `Recycle` 반환 정책은 볼륨에서 기본 스크럽(`rm -rf /thevolume/*`)을 수행하고 새 클레임에 다시 사용할 수 있도록 한다.

그러나 관리자는 [레퍼런스](/docs/reference/command-line-tools-reference/kube-controller-manager/)에
설명된 대로 쿠버네티스 컨트롤러 관리자 커맨드라인 인자(command line arguments)를
사용하여 사용자 정의 재활용 파드 템플릿을 구성할 수 있다.
사용자 정의 재활용 파드 템플릿에는 아래 예와 같이 `volumes` 명세가
포함되어야 한다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pv-recycler
  namespace: default
spec:
  restartPolicy: Never
  volumes:
  - name: vol
    hostPath:
      path: /any/path/it/will/be/replaced
  containers:
  - name: pv-recycler
    image: "k8s.gcr.io/busybox"
    command: ["/bin/sh", "-c", "test -e /scrub && rm -rf /scrub/..?* /scrub/.[!.]* /scrub/*  && test -z \"$(ls -A /scrub)\" || exit 1"]
    volumeMounts:
    - name: vol
      mountPath: /scrub
```

그러나 `volumes` 부분의 사용자 정의 재활용 파드 템플릿에 지정된 특정 경로는 재활용되는 볼륨의 특정 경로로 바뀐다.

### 퍼시스턴트볼륨 예약

컨트롤 플레인은 클러스터에서 [퍼시스턴트볼륨클레임을 일치하는 퍼시스턴트볼륨에 바인딩](#바인딩)할
수 있다. 그러나, PVC를 특정 PV에 바인딩하려면, 미리 바인딩해야 한다.

퍼시스턴트볼륨클레임에서 퍼시스턴트볼륨을 지정하여, 특정 PV와 PVC 간의 바인딩을 선언한다.
퍼시스턴트볼륨이 존재하고 `claimRef` 필드를 통해 퍼시스턴트볼륨클레임을 예약하지 않은 경우, 퍼시스턴트볼륨 및 퍼시스턴트볼륨클레임이 바인딩된다.

바인딩은 노드 선호도(affinity)를 포함하여 일부 볼륨 일치(matching) 기준과 관계없이 발생한다.
컨트롤 플레인은 여전히 [스토리지 클래스](/ko/docs/concepts/storage/storage-classes/), 접근 모드 및 요청된 스토리지 크기가 유효한지 확인한다.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: foo-pvc
  namespace: foo
spec:
  storageClassName: "" # 빈 문자열은 명시적으로 설정해야 하며 그렇지 않으면 기본 스토리지클래스가 설정됨
  volumeName: foo-pv
  ...
```

이 메서드는 퍼시스턴트볼륨에 대한 바인딩 권한을 보장하지 않는다. 다른 퍼시스턴트볼륨클레임에서 지정한 PV를 사용할 수 있는 경우, 먼저 해당 스토리지 볼륨을 예약해야 한다. PV의 `claimRef` 필드에 관련 퍼시스턴트볼륨클레임을 지정하여 다른 PVC가 바인딩할 수 없도록 한다.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: foo-pv
spec:
  storageClassName: ""
  claimRef:
    name: foo-pvc
    namespace: foo
  ...
```

이는 기존 PV를 재사용하는 경우를 포함하여 `claimPolicy` 가
`Retain` 으로 설정된 퍼시스턴트볼륨을 사용하려는 경우에 유용하다.

### 퍼시스턴트 볼륨 클레임 확장

{{< feature-state for_k8s_version="v1.11" state="beta" >}}

이제 퍼시스턴트볼륨클레임(PVC) 확장 지원이 기본적으로 활성화되어 있다. 다음 유형의
볼륨을 확장할 수 있다.

* gcePersistentDisk
* awsElasticBlockStore
* Cinder
* glusterfs
* rbd
* Azure File
* Azure Disk
* Portworx
* FlexVolumes
* {{< glossary_tooltip text="CSI" term_id="csi" >}}

스토리지 클래스의 `allowVolumeExpansion` 필드가 true로 설정된 경우에만 PVC를 확장할 수 있다.

``` yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gluster-vol-default
provisioner: kubernetes.io/glusterfs
parameters:
  resturl: "http://192.168.10.100:8080"
  restuser: ""
  secretNamespace: ""
  secretName: ""
allowVolumeExpansion: true
```

PVC에 대해 더 큰 볼륨을 요청하려면 PVC 오브젝트를 수정하여 더 큰 용량을
지정한다. 이는 기본 퍼시스턴트볼륨을 지원하는 볼륨의 확장을 트리거한다. 클레임을 만족시키기 위해
새로운 퍼시스턴트볼륨이 생성되지 않고 기존 볼륨의 크기가 조정된다.

#### CSI 볼륨 확장

{{< feature-state for_k8s_version="v1.16" state="beta" >}}

CSI 볼륨 확장 지원은 기본적으로 활성화되어 있지만 볼륨 확장을 지원하려면 특정 CSI 드라이버도 필요하다. 자세한 내용은 특정 CSI 드라이버 문서를 참고한다.


#### 파일시스템을 포함하는 볼륨 크기 조정

파일시스템이 XFS, Ext3 또는 Ext4 인 경우에만 파일시스템을 포함하는 볼륨의 크기를 조정할 수 있다.

볼륨에 파일시스템이 포함된 경우 새 파드가 `ReadWrite` 모드에서 퍼시스턴트볼륨클레임을 사용하는
경우에만 파일시스템의 크기가 조정된다. 파일시스템 확장은 파드가 시작되거나
파드가 실행 중이고 기본 파일시스템이 온라인 확장을 지원할 때 수행된다.

FlexVolumes는 `RequiresFSResize` 기능으로 드라이버가 `true`로 설정된 경우 크기 조정을 허용한다.
FlexVolume은 파드 재시작 시 크기를 조정할 수 있다.

#### 사용 중인 퍼시스턴트볼륨클레임 크기 조정

{{< feature-state for_k8s_version="v1.15" state="beta" >}}

{{< note >}}
사용 중인 PVC 확장은 쿠버네티스 1.15 이후 버전에서는 베타로, 1.11 이후 버전에서는 알파로 제공된다. `ExpandInUsePersistentVolumes` 기능을 사용하도록 설정해야 한다. 베타 기능의 경우 여러 클러스터에서 자동으로 적용된다. 자세한 내용은 [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/) 문서를 참고한다.
{{< /note >}}

이 경우 기존 PVC를 사용하는 파드 또는 디플로이먼트를 삭제하고 다시 만들 필요가 없다.
파일시스템이 확장되자마자 사용 중인 PVC가 파드에서 자동으로 사용 가능하다.
이 기능은 파드나 디플로이먼트에서 사용하지 않는 PVC에는 영향을 미치지 않는다. 확장을 완료하기 전에
PVC를 사용하는 파드를 만들어야 한다.


다른 볼륨 유형과 비슷하게 FlexVolume 볼륨도 파드에서 사용 중인 경우 확장할 수 있다.

{{< note >}}
FlexVolume의 크기 조정은 기본 드라이버가 크기 조정을 지원하는 경우에만 가능하다.
{{< /note >}}

{{< note >}}
EBS 볼륨 확장은 시간이 많이 걸리는 작업이다. 또한 6시간마다 한 번의 수정을 할 수 있는 볼륨별 쿼터가 있다.
{{< /note >}}

#### 볼륨 확장 시 오류 복구

기본 스토리지 확장에 실패하면, 클러스터 관리자가 수동으로 퍼시스턴트 볼륨 클레임(PVC) 상태를 복구하고 크기 조정 요청을 취소할 수 있다. 그렇지 않으면, 컨트롤러가 관리자 개입 없이 크기 조정 요청을 계속해서 재시도한다.

1. 퍼시스턴트볼륨클레임(PVC)에 바인딩된 퍼시스턴트볼륨(PV)을 `Retain` 반환 정책으로 표시한다.
2. PVC를 삭제한다. PV에는 `Retain` 반환 정책이 있으므로 PVC를 재생성할 때 데이터가 손실되지 않는다.
3. 새 PVC를 바인딩할 수 있도록 PV 명세에서 `claimRef` 항목을 삭제한다. 그러면 PV가 `Available` 상태가 된다.
4. PV 보다 작은 크기로 PVC를 다시 만들고 PVC의 `volumeName` 필드를 PV 이름으로 설정한다. 이것은 새 PVC를 기존 PV에 바인딩해야 한다.
5. PV의 반환 정책을 복원하는 것을 잊지 않는다.


## 퍼시스턴트 볼륨의 유형

퍼시스턴트볼륨 유형은 플러그인으로 구현된다. 쿠버네티스는 현재 다음의 플러그인을 지원한다.

* [`awsElasticBlockStore`](/ko/docs/concepts/storage/volumes/#awselasticblockstore) - AWS Elastic Block Store (EBS)
* [`azureDisk`](/ko/docs/concepts/storage/volumes/#azuredisk) - Azure Disk
* [`azureFile`](/ko/docs/concepts/storage/volumes/#azurefile) - Azure File
* [`cephfs`](/ko/docs/concepts/storage/volumes/#cephfs) - CephFS 볼륨
* [`cinder`](/ko/docs/concepts/storage/volumes/#cinder) - Cinder (오픈스택 블록 스토리지)
  (**사용 중단**)
* [`csi`](/ko/docs/concepts/storage/volumes/#csi) - 컨테이너 스토리지 인터페이스 (CSI)
* [`fc`](/ko/docs/concepts/storage/volumes/#fc) - Fibre Channel (FC) 스토리지
* [`flexVolume`](/ko/docs/concepts/storage/volumes/#flexVolume) - FlexVolume
* [`flocker`](/ko/docs/concepts/storage/volumes/#flocker) - Flocker 스토리지
* [`gcePersistentDisk`](/ko/docs/concepts/storage/volumes/#gcepersistentdisk) - GCE Persistent Disk
* [`glusterfs`](/ko/docs/concepts/storage/volumes/#glusterfs) - Glusterfs 볼륨
* [`hostPath`](/ko/docs/concepts/storage/volumes/#hostpath) - HostPath 볼륨
  (단일 노드 테스트 전용. 다중-노드 클러스터에서 작동하지 않음.
  대신 `로컬` 볼륨 사용 고려)
* [`iscsi`](/ko/docs/concepts/storage/volumes/#iscsi) - iSCSI (SCSI over IP) 스토리지
* [`local`](/ko/docs/concepts/storage/volumes/#local) - 노드에 마운트된
  로컬 스토리지 디바이스
* [`nfs`](/ko/docs/concepts/storage/volumes/#nfs) - 네트워크 파일 시스템 (NFS) 스토리지
* `photonPersistentDisk` - Photon 컨트롤러 퍼시스턴트 디스크.
  (이 볼륨 유형은 해당 클라우드 공급자가 없어진 이후 더 이상
  작동하지 않는다.)
* [`portworxVolume`](/ko/docs/concepts/storage/volumes/#portworxvolume) - Portworx 볼륨
* [`quobyte`](/ko/docs/concepts/storage/volumes/#quobyte) - Quobyte 볼륨
* [`rbd`](/ko/docs/concepts/storage/volumes/#rbd) - Rados Block Device (RBD) 볼륨
* [`scaleIO`](/ko/docs/concepts/storage/volumes/#scaleio) - ScaleIO 볼륨
  (**사용 중단**)
* [`storageos`](/ko/docs/concepts/storage/volumes/#storageos) - StorageOS 볼륨
* [`vsphereVolume`](/ko/docs/concepts/storage/volumes/#vspherevolume) - vSphere VMDK 볼륨

## 퍼시스턴트 볼륨

각 PV에는 스펙과 상태(볼륨의 명세와 상태)가 포함된다.
퍼시스턴트볼륨 오브젝트의 이름은 유효한
[DNS 서브도메인 이름](/ko/docs/concepts/overview/working-with-objects/names/#dns-서브도메인-이름)이어야 한다.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0003
spec:
  capacity:
    storage: 5Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Recycle
  storageClassName: slow
  mountOptions:
    - hard
    - nfsvers=4.1
  nfs:
    path: /tmp
    server: 172.17.0.2
```

{{< note >}}
클러스터 내에서 퍼시스턴트볼륨을 사용하려면 볼륨 유형과 관련된 헬퍼(Helper) 프로그램이 필요할 수 있다. 이 예에서 퍼시스턴트볼륨은 NFS 유형이며 NFS 파일시스템 마운트를 지원하려면 헬퍼 프로그램인 /sbin/mount.nfs가 필요하다.
{{< /note >}}

### 용량

일반적으로 PV는 특정 저장 용량을 가진다. 이것은 PV의 `capacity` 속성을 사용하여 설정된다. `capacity`가 사용하는 단위를 이해하려면 쿠버네티스 [리소스 모델](https://git.k8s.io/community/contributors/design-proposals/scheduling/resources.md)을 참고한다.

현재 스토리지 용량 크기는 설정하거나 요청할 수 있는 유일한 리소스이다. 향후 속성에 IOPS, 처리량 등이 포함될 수 있다.

### 볼륨 모드

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

쿠버네티스는 퍼시스턴트볼륨의 두 가지 `volumeModes`인 `Filesystem`과 `Block`을 지원한다.

`volumeMode`는 선택적 API 파라미터이다.
`Filesystem`은 `volumeMode` 파라미터가 생략될 때 사용되는 기본 모드이다.

`volumeMode: Filesystem`이 있는 볼륨은 파드의 디렉터리에 *마운트* 된다. 볼륨이 장치에
의해 지원되고 그 장치가 비어 있으면 쿠버네티스는 장치를
처음 마운트하기 전에 장치에 파일시스템을 만든다.

볼륨을 원시 블록 장치로 사용하려면 `volumeMode`의 값을 `Block`으로 설정할 수 있다.
이러한 볼륨은 파일시스템이 없는 블록 장치로 파드에 제공된다.
이 모드는 파드와 볼륨 사이에 파일시스템 계층 없이도 볼륨에 액세스하는
가장 빠른 방법을 파드에 제공하는 데 유용하다. 반면에 파드에서 실행되는 애플리케이션은
원시 블록 장치를 처리하는 방법을 알아야 한다.
파드에서 `volumeMode: Block`으로 볼륨을 사용하는 방법에 대한 예는
[원시 블록 볼륨 지원](#원시-블록-볼륨-지원)를 참조하십시오.

### 접근 모드

리소스 제공자가 지원하는 방식으로 호스트에 퍼시스턴트볼륨을 마운트할 수 있다. 아래 표에서 볼 수 있듯이 제공자들은 서로 다른 기능을 가지며 각 PV의 접근 모드는 해당 볼륨에서 지원하는 특정 모드로 설정된다. 예를 들어 NFS는 다중 읽기/쓰기 클라이언트를 지원할 수 있지만 특정 NFS PV는 서버에서 읽기 전용으로 export할 수 있다. 각 PV는 특정 PV의 기능을 설명하는 자체 접근 모드 셋을 갖는다.

접근 모드는 다음과 같다.

* ReadWriteOnce -- 하나의 노드에서 볼륨을 읽기-쓰기로 마운트할 수 있다
* ReadOnlyMany -- 여러 노드에서 볼륨을 읽기 전용으로 마운트할 수 있다
* ReadWriteMany -- 여러 노드에서 볼륨을 읽기-쓰기로 마운트할 수 있다

CLI에서 접근 모드는 다음과 같이 약어로 표시된다.

* RWO - ReadWriteOnce
* ROX - ReadOnlyMany
* RWX - ReadWriteMany

> __중요!__ 볼륨이 여러 접근 모드를 지원하더라도 한 번에 하나의 접근 모드를 사용하여 마운트할 수 있다. 예를 들어 GCEPersistentDisk는 하나의 노드가 ReadWriteOnce로 마운트하거나 여러 노드가 ReadOnlyMany로 마운트할 수 있지만 동시에는 불가능하다.


| Volume Plugin        | ReadWriteOnce          | ReadOnlyMany          | ReadWriteMany|
| :---                 | :---:                  | :---:                 | :---:        |
| AWSElasticBlockStore | &#x2713;               | -                     | -            |
| AzureFile            | &#x2713;               | &#x2713;              | &#x2713;     |
| AzureDisk            | &#x2713;               | -                     | -            |
| CephFS               | &#x2713;               | &#x2713;              | &#x2713;     |
| Cinder               | &#x2713;               | -                     | -            |
| CSI                  | 드라이버에 따라 다름    | 드라이버에 따라 다름    | 드라이버에 따라 다름 |
| FC                   | &#x2713;               | &#x2713;              | -            |
| FlexVolume           | &#x2713;               | &#x2713;              | 드라이버에 따라 다름 |
| Flocker              | &#x2713;               | -                     | -            |
| GCEPersistentDisk    | &#x2713;               | &#x2713;              | -            |
| Glusterfs            | &#x2713;               | &#x2713;              | &#x2713;     |
| HostPath             | &#x2713;               | -                     | -            |
| iSCSI                | &#x2713;               | &#x2713;              | -            |
| Quobyte              | &#x2713;               | &#x2713;              | &#x2713;     |
| NFS                  | &#x2713;               | &#x2713;              | &#x2713;     |
| RBD                  | &#x2713;               | &#x2713;              | -            |
| VsphereVolume        | &#x2713;               | -                     | - (파드가 병치될(collocated) 때 작동)  |
| PortworxVolume       | &#x2713;               | -                     | &#x2713;     |
| ScaleIO              | &#x2713;               | &#x2713;              | -            |
| StorageOS            | &#x2713;               | -                     | -            |

### 클래스

PV는 `storageClassName` 속성을
[스토리지클래스](/ko/docs/concepts/storage/storage-classes/)의
이름으로 설정하여 지정하는 클래스를 가질 수 있다.
특정 클래스의 PV는 해당 클래스를 요청하는 PVC에만 바인딩될 수 있다.
`storageClassName`이 없는 PV에는 클래스가 없으며 특정 클래스를 요청하지 않는 PVC에만
바인딩할 수 있다.

이전에는 `volume.beta.kubernetes.io/storage-class` 어노테이션이
`storageClassName` 속성 대신 사용되었다. 이 어노테이션은 아직까지는 사용할 수 있지만,
향후 쿠버네티스 릴리스에서 완전히 사용 중단(deprecated)이 될 예정이다.

### 반환 정책

현재 반환 정책은 다음과 같다.

* Retain(보존) -- 수동 반환
* Recycle(재활용) -- 기본 스크럽 (`rm -rf /thevolume/*`)
* Delete(삭제) -- AWS EBS, GCE PD, Azure Disk 또는 OpenStack Cinder 볼륨과 같은 관련 스토리지 자산이 삭제됨

현재 NFS 및 HostPath만 재활용을 지원한다. AWS EBS, GCE PD, Azure Disk 및 Cinder 볼륨은 삭제를 지원한다.

### 마운트 옵션

쿠버네티스 관리자는 퍼시스턴트 볼륨이 노드에 마운트될 때 추가 마운트 옵션을 지정할 수 있다.

{{< note >}}
모든 퍼시스턴트 볼륨 유형이 마운트 옵션을 지원하는 것은 아니다.
{{< /note >}}

다음 볼륨 유형은 마운트 옵션을 지원한다.

* AWSElasticBlockStore
* AzureDisk
* AzureFile
* CephFS
* Cinder (OpenStack 블록 스토리지)
* GCEPersistentDisk
* Glusterfs
* NFS
* Quobyte Volumes
* RBD (Ceph Block Device)
* StorageOS
* VsphereVolume
* iSCSI

마운트 옵션의 유효성이 검사되지 않는다. 마운트 옵션이 유효하지 않으면, 마운트가 실패한다.

이전에는 `mountOptions` 속성 대신 `volume.beta.kubernetes.io/mount-options` 어노테이션이
사용되었다. 이 어노테이션은 아직까지는 사용할 수 있지만,
향후 쿠버네티스 릴리스에서 완전히 사용 중단(deprecated)이 될 예정이다.

### 노드 어피니티(affinity)

{{< note >}}
대부분의 볼륨 유형의 경우 이 필드를 설정할 필요가 없다. [AWS EBS](/ko/docs/concepts/storage/volumes/#awselasticblockstore), [GCE PD](/ko/docs/concepts/storage/volumes/#gcepersistentdisk) 및 [Azure Disk](/ko/docs/concepts/storage/volumes/#azuredisk) 볼륨 블록 유형에 자동으로 채워진다. [로컬](/ko/docs/concepts/storage/volumes/#local) 볼륨에 대해서는 이를 명시적으로 설정해야 한다.
{{< /note >}}

PV는 [노드 어피니티](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volumenodeaffinity-v1-core)를 지정하여 이 볼륨에 접근할 수 있는 노드를 제한하는 제약 조건을 정의할 수 있다. PV를 사용하는 파드는 노드 어피니티에 의해 선택된 노드로만 스케줄링된다.

### 단계(Phase)

볼륨은 다음 단계 중 하나이다.

* Available(사용 가능) -– 아직 클레임에 바인딩되지 않은 사용할 수 있는 리소스
* Bound(바인딩) –- 볼륨이 클레임에 바인딩됨
* Released(릴리스) –- 클레임이 삭제되었지만 클러스터에서 아직 리소스를 반환하지 않음
* Failed(실패) –- 볼륨이 자동 반환에 실패함

CLI는 PV에 바인딩된 PVC의 이름을 표시한다.

## 퍼시스턴트볼륨클레임

각 PVC에는 스펙과 상태(클레임의 명세와 상태)가 포함된다.
퍼시스턴트볼륨클레임 오브젝트의 이름은 유효한
[DNS 서브도메인 이름](/ko/docs/concepts/overview/working-with-objects/names/#dns-서브도메인-이름)이어야 한다.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: myclaim
spec:
  accessModes:
    - ReadWriteOnce
  volumeMode: Filesystem
  resources:
    requests:
      storage: 8Gi
  storageClassName: slow
  selector:
    matchLabels:
      release: "stable"
    matchExpressions:
      - {key: environment, operator: In, values: [dev]}
```

### 접근 모드

클레임은 특정 접근 모드로 저장소를 요청할 때 볼륨과 동일한 규칙을 사용한다.

### 볼륨 모드

클레임은 볼륨과 동일한 규칙을 사용하여 파일시스템 또는 블록 장치로 볼륨을 사용함을 나타낸다.

### 리소스

파드처럼 클레임은 특정 수량의 리소스를 요청할 수 있다. 이 경우는 스토리지에 대한 요청이다. 동일한 [리소스 모델](https://git.k8s.io/community/contributors/design-proposals/scheduling/resources.md)이 볼륨과 클레임 모두에 적용된다.

### 셀렉터

클레임은 볼륨 셋을 추가로 필터링하기 위해 [레이블 셀렉터](/ko/docs/concepts/overview/working-with-objects/labels/#레이블-셀렉터)를 지정할 수 있다. 레이블이 셀렉터와 일치하는 볼륨만 클레임에 바인딩할 수 있다. 셀렉터는 두 개의 필드로 구성될 수 있다.

* `matchLabels` - 볼륨에 이 값의 레이블이 있어야함
* `matchExpressions` - 키, 값의 목록, 그리고 키와 값에 관련된 연산자를 지정하여 만든 요구 사항 목록. 유효한 연산자에는 In, NotIn, Exists 및 DoesNotExist가 있다.

`matchLabels` 및 `matchExpressions`의 모든 요구 사항이 AND 조건이다. 일치하려면 모두 충족해야 한다.

### 클래스

클레임은 `storageClassName` 속성을 사용하여
[스토리지클래스](/ko/docs/concepts/storage/storage-classes/)의 이름을 지정하여
특정 클래스를 요청할 수 있다.
요청된 클래스의 PV(PVC와 동일한 `storageClassName`을 갖는 PV)만 PVC에
바인딩될 수 있다.

PVC는 반드시 클래스를 요청할 필요는 없다. `storageClassName`이 `""`로 설정된
PVC는 항상 클래스가 없는 PV를 요청하는 것으로 해석되므로
클래스가 없는 PV(어노테이션이 없거나 `""`와 같은 하나의 셋)에만 바인딩될 수
있다. `storageClassName`이 없는 PVC는
[`DefaultStorageClass` 어드미션 플러그인](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)이
켜져 있는지 여부에 따라 동일하지 않으며
클러스터에 따라 다르게 처리된다.

* 어드미션 플러그인이 켜져 있으면 관리자가 기본 스토리지클래스를 지정할 수 있다.
  `storageClassName`이 없는 모든 PVC는 해당 기본값의 PV에만 바인딩할 수 있다. 기본
  스토리지클래스 지정은 스토리지클래스 오브젝트에서 어노테이션
  `storageclass.kubernetes.io/is-default-class`를 `true`로
  설정하여 수행된다. 관리자가 기본값을 지정하지 않으면 어드미션 플러그인이 꺼져 있는 것처럼
  클러스터가 PVC 생성에 응답한다. 둘 이상의 기본값이 지정된 경우 어드미션
  플러그인은 모든 PVC 생성을
  금지한다.
* 어드미션 플러그인이 꺼져 있으면 기본 스토리지클래스에 대한 기본값 자체가 없다.
  `storageClassName`이 없는 모든 PVC는 클래스가 없는 PV에만 바인딩할 수 있다. 이 경우
  `storageClassName`이 없는 PVC는 `storageClassName`이 `""`로 설정된 PVC와
  같은 방식으로 처리된다.

설치 방법에 따라 설치 중에 애드온 관리자가 기본 스토리지클래스를 쿠버네티스 클러스터에
배포할 수 있다.

PVC가 스토리지클래스를 요청하는 것 외에도 `selector`를 지정하면 요구 사항들이
AND 조건으로 동작한다. 요청된 클래스와 요청된 레이블이 있는 PV만 PVC에
바인딩될 수 있다.

{{< note >}}
현재 비어 있지 않은 `selector`가 있는 PVC에는 PV를 동적으로 프로비저닝할 수 없다.
{{< /note >}}

이전에는 `volume.beta.kubernetes.io/storage-class` 어노테이션이 `storageClassName`
속성 대신 사용되었다. 이 어노테이션은 아직까지는 사용할 수 있지만,
향후 쿠버네티스 릴리스에서는 지원되지 않는다.

## 볼륨으로 클레임하기

클레임을 볼륨으로 사용해서 파드가 스토리지에 접근한다. 클레임은 클레임을 사용하는 파드와 동일한 네임스페이스에 있어야 한다. 클러스터는 파드의 네임스페이스에서 클레임을 찾고 이를 사용하여 클레임과 관련된 퍼시스턴트볼륨을 얻는다. 그런 다음 볼륨이 호스트와 파드에 마운트된다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
    - name: myfrontend
      image: nginx
      volumeMounts:
      - mountPath: "/var/www/html"
        name: mypd
  volumes:
    - name: mypd
      persistentVolumeClaim:
        claimName: myclaim
```

### 네임스페이스에 대한 참고 사항

퍼시스턴트볼륨 바인딩은 배타적이며, 퍼시스턴트볼륨클레임은 네임스페이스 오브젝트이므로 "다중" 모드(`ROX`, `RWX`)를 사용한 클레임은 하나의 네임스페이스 내에서만 가능하다.

### `hostPath` 유형의 퍼시스턴트볼륨

`hostPath` 퍼시스턴트볼륨은 노드의 파일이나 디렉터리를 사용하여 네트워크 연결 스토리지를 에뮬레이션한다.
[`hostPath` 유형 볼륨의 예](/ko/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#퍼시스턴트볼륨-생성하기)를 참고한다.

## 원시 블록 볼륨 지원

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

다음 볼륨 플러그인에 해당되는 경우 동적 프로비저닝을 포함하여 원시 블록 볼륨을
지원한다.

* AWSElasticBlockStore
* AzureDisk
* CSI
* FC (파이버 채널)
* GCEPersistentDisk
* iSCSI
* Local volume
* OpenStack Cinder
* RBD (Ceph Block Device)
* VsphereVolume

### 원시 블록 볼륨을 사용하는 퍼시스턴트볼륨 {#persistent-volume-using-a-raw-block-volume}

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: block-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  volumeMode: Block
  persistentVolumeReclaimPolicy: Retain
  fc:
    targetWWNs: ["50060e801049cfd1"]
    lun: 0
    readOnly: false
```
### 원시 블록 볼륨을 요청하는 퍼시스턴트볼륨클레임 {#persistent-volume-claim-requesting-a-raw-block-volume}

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: block-pvc
spec:
  accessModes:
    - ReadWriteOnce
  volumeMode: Block
  resources:
    requests:
      storage: 10Gi
```

### 컨테이너에 원시 블록 장치 경로를 추가하는 파드 명세

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-block-volume
spec:
  containers:
    - name: fc-container
      image: fedora:26
      command: ["/bin/sh", "-c"]
      args: [ "tail -f /dev/null" ]
      volumeDevices:
        - name: data
          devicePath: /dev/xvda
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName: block-pvc
```

{{< note >}}
파드에 대한 원시 블록 장치를 추가할 때 마운트 경로 대신 컨테이너에 장치 경로를 지정한다.
{{< /note >}}

### 블록 볼륨 바인딩

사용자가 퍼시스턴트볼륨클레임 스펙에서 `volumeMode` 필드를 사용하여 이를 나타내는 원시 블록 볼륨을 요청하는 경우 바인딩 규칙은 스펙의 일부분으로 이 모드를 고려하지 않은 이전 릴리스에 비해 약간 다르다.
사용자와 관리자가 원시 블록 장치를 요청하기 위해 지정할 수 있는 가능한 조합의 표가 아래 나열되어 있다. 이 테이블은 볼륨이 바인딩되는지 여부를 나타낸다.
정적 프로비저닝된 볼륨에 대한 볼륨 바인딩 매트릭스이다.

| PV volumeMode | PVC volumeMode  | Result           |
| --------------|:---------------:| ----------------:|
|   지정되지 않음 | 지정되지 않음     | BIND             |
|   지정되지 않음 | Block           | NO BIND          |
|   지정되지 않음 | Filesystem      | BIND             |
|   Block       | 지정되지 않음     | NO BIND          |
|   Block       | Block           | BIND             |
|   Block       | Filesystem      | NO BIND          |
|   Filesystem  | Filesystem      | BIND             |
|   Filesystem  | Block           | NO BIND          |
|   Filesystem  | 지정되지 않음     | BIND             |

{{< note >}}
알파 릴리스에서는 정적으로 프로비저닝된 볼륨만 지원된다. 관리자는 원시 블록 장치로 작업할 때 이러한 값을 고려해야 한다.
{{< /note >}}

## 볼륨 스냅샷 및 스냅샷 지원에서 볼륨 복원

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

볼륨 스냅 샷은 아웃-오브-트리 CSI 볼륨 플러그인만 지원한다. 자세한 내용은 [볼륨 스냅샷](/ko/docs/concepts/storage/volume-snapshots/)을 참조한다.
인-트리 볼륨 플러그인은 사용 중단 되었다. [볼륨 플러그인 FAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md)에서 사용 중단된 볼륨 플러그인에 대해 확인할 수 있다.

### 볼륨 스냅샷에서 퍼시스턴트볼륨클레임 생성 {#create-persistent-volume-claim-from-volume-snapshot}

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: restore-pvc
spec:
  storageClassName: csi-hostpath-sc
  dataSource:
    name: new-snapshot-test
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

## 볼륨 복제

[볼륨 복제](/ko/docs/concepts/storage/volume-pvc-datasource/)는 CSI 볼륨 플러그인만 사용할 수 있다.

### 기존 pvc에서 퍼시스턴트볼륨클레임 생성 {#create-persistent-volume-claim-from-an-existing-pvc}

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: cloned-pvc
spec:
  storageClassName: my-csi-plugin
  dataSource:
    name: existing-src-pvc-name
    kind: PersistentVolumeClaim
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

## 포터블 구성 작성

광범위한 클러스터에서 실행되고 퍼시스턴트 스토리지가 필요한
구성 템플릿 또는 예제를 작성하는 경우 다음 패턴을 사용하는 것이 좋다.

- 구성 번들(디플로이먼트, 컨피그맵 등)에 퍼시스턴트볼륨클레임
  오브젝트를 포함시킨다.
- 구성을 인스턴스화 하는 사용자에게 퍼시스턴트볼륨을 생성할 권한이 없을 수 있으므로
  퍼시스턴트볼륨 오브젝트를 구성에 포함하지 않는다.
- 템플릿을 인스턴스화 할 때 스토리지 클래스 이름을 제공하는 옵션을
  사용자에게 제공한다.
	- 사용자가 스토리지 클래스 이름을 제공하는 경우 해당 값을
  	`permanentVolumeClaim.storageClassName` 필드에 입력한다.
    클러스터에서 관리자가 스토리지클래스를 활성화한 경우
    PVC가 올바른 스토리지 클래스와 일치하게 된다.
	- 사용자가 스토리지 클래스 이름을 제공하지 않으면
  	`permanentVolumeClaim.storageClassName` 필드를 nil로 남겨둔다.
    그러면 클러스터에 기본 스토리지클래스가 있는 사용자에 대해 PV가 자동으로 프로비저닝된다.
    많은 클러스터 환경에 기본 스토리지클래스가 설치되어 있거나 관리자가
    고유한 기본 스토리지클래스를 생성할 수 있다.
- 도구(tooling)에서 일정 시간이 지나도 바인딩되지 않는 PVC를 관찰하여 사용자에게
  노출시킨다. 이는 클러스터가 동적 스토리지를 지원하지
  않거나(이 경우 사용자가 일치하는 PV를 생성해야 함),
  클러스터에 스토리지 시스템이 없음을 나타낸다(이 경우
  사용자는 PVC가 필요한 구성을 배포할 수 없음).

  ## {{% heading "whatsnext" %}}


* [퍼시스턴트볼륨 생성](/ko/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#퍼시스턴트볼륨-생성하기)에 대해 자세히 알아보기
* [퍼시스턴트볼륨클레임 생성](/ko/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#퍼시스턴트볼륨클레임-생성하기)에 대해 자세히 알아보기
* [퍼시스턴트 스토리지 설계 문서](https://git.k8s.io/community/contributors/design-proposals/storage/persistent-storage.md) 읽어보기

### 참고

* [퍼시스턴트볼륨](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolume-v1-core)
* [PersistentVolumeSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumespec-v1-core)
* [퍼시스턴트볼륨클레임](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaim-v1-core)
* [PersistentVolumeClaimSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaimspec-v1-core)
