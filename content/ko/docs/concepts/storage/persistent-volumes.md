---
reviewers:
* jsafrane
* saad-ali
* thockin
* msau42
title: Persistent Volumes
feature:
title: Storage orchestration
description: >
  Automatically mount the storage system of your choice, whether from local storage, a public cloud provider such as GCP or AWS, or a network storage system such as NFS, iSCSI, Gluster, Ceph, Cinder, or Flocker.

content_template: templates/concept
weight: 20
- - - -

{{% capture overview %}}

이 문서는 쿠버네티스의 `PersistentVolumes`의 현재 상태를 중심으로 설명한다.  [volumes](/docs/concepts/storage/volumes/)에 대해 먼저 이해하고 본 문서를 읽는 것을 권장한다.

{{% /capture %}}

{{% capture body %}}

## 개요
스토리지를 관리하는 것은 컴퓨팅 자원을 관리하는 것과는 별개의 문제다. `PersistentVolume`  서브시스템은 스토리지가 제공되는 방식과 사용되는 구체적인 방법을 추상화하고, 이 API를 사용자와 관리자에게 제공한다. `PersistentVolume` , `PersistentVolumeClaim` 이렇게 두 가지 API를 소개한다.  

`PersistentVolume` (PV)는 관리자가 프로비저닝한 스토리지 클러스터 내의 한 부분이다. 클러스터 내의 노드와 같이 자원의 한 종류이다. PV는 볼륨과 같은 플러그인이지만, PV를 사용하는 파드와는 독립적인 라이프사이클을 갖는다. 이 API 객체는 NFS, iSCSI, 클라우드 프로바이더가 제공하는 스토리지 시스템 등에 대한 스토리지 구현체의 세부내용을 담고 있다. 


`PersistentVolumeClaim`  (PVC)는 사용자가 스토리지에 보내는 요청이다. Pod와 비슷하다. Pod는 노드 자원을 사용하고 PVC는 PV 자원을 사용한다. Pod는 특정한 수준의 자원 (CPU, 메모리)을 요청한다. 클레임은 구체적인 용량과 액세스 모드 (한번만 마운트해서 리드, 라이트, 혹은 여러번 읽기만)를 요청할 수 있다.


`PersistentVolumeClaim`이 사용자가 추상화된 스토리지 자원을 사용하게 해주기는 하지만, 사용자는 성능이나 기타 다른 문제에 의해 다른 종류의 `PersistentVolume`  을 필요로 할 수 있다. 그렇기 때문에 클러스터 관리자는 사용자가 볼륨의 동작 과정에 대해 알 필요 없이, 다양한 사이즈와 액세스 모드 등을 갖는  `PersistentVolume` 을 제공할 수 있어야 한다. 이를 위해 `StorageClass`라는 자원이 있다. 

[실제 동작 예시와 함께 세부사항 살펴보기](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/)를 참고한다.

## 볼륨과 클레임의 라이프사이클
PV는 클러스터 내의 자원이다. PVC는 이 자원에 대한 요청이자 번호표 기능을 한다. PV와 PVC의 상호작용은 다음과 같은 라이프사이클에 따른다.

### 프로비저닝
PV는 정적, 혹은 동적으로 프로비저닝 된다.

#### 정적
클러스터 관리자가 많은 PV를 생성한다. 여기에는 클러스터 사용자가 사용할 실제 스토리지 자원의 상세내역이 담겨있다. 쿠버네티스 API 안에 존재하기 때문에 쉽게 호출할 수 있다.

#### 동적
클러스터 관리자가 생성한 정적 PV 가 사용자의 `PersistentVolumeClaim` 과 일치하지 않을 때 클러스터는 PVC의 요청에 맞는 볼륨을 동적으로 생성 시도한다.  이 프로비저닝은  `StorageClasses`을 통해야 하기 때문에, PVC는 [storage class](/docs/concepts/storage/storage-classes/)에 요청을 해야 한다. 관리자는 사전에 정적 프로비저닝에 대비해 이 클래스를 생성하고 적절히 설정해두어야 한다. `”"`에 요청하는 클레임은 동적 프로비저닝을 동작하지 않도록 한다.

스토리지 클래스를 이용한 동적 스토리지 프로비저닝을 사용하기 위해서는, 클러스터 관리자가 API 서버에 `DefaultStorageClass`를 활성화해야 한다. API 서버 컴포넌트의 `—enable-admission-plugins` 에 쉼표로 구분된 순서 리스트가 있는데, 이 값에 `DefaultStorageClass`값이 있으면 된다. API 서버 커맨드 플래그에 대해서는 [kube-apiserver](/docs/admin/kube-apiserver/) 문서를 참고한다.

### 바인딩
동적 프로비저닝의 경우, 사용자가 특정 용량과 액세스 모드로  `PersistentVolumeClaim`을 생성한다. 마스터의 컨트롤 루프는 새로운 PVC를 지켜보고 있다가 매칭되는 PV가 있는지 찾아 PVC와 바인드 해준다. 새로운 PVC에 대해 동적으로 PV가 할당되었다면, 컨트롤 루프가 역시 이 둘을 바인딩해준다. 그렇지 않으면 실제 볼륨은 요청보다 초과되는 용량으로 생성되는 반면, 사용자는 요청 내용의 최소한의 것만 받게 된다. 바운딩이 완료되면 `PersistentVolumeClaim` 바운드된 방식에 관계 없이, 다른 PV와 바인딩될 수 없는 배타적인 상태가 된다. PVC-PV 매핑은 일대일 매핑이기 때문이다. 

매칭되는 볼륨이 없는 경우 클레임은 계속 언바운드 상태로 유지된다. 클레임은 자신의 요청과 매칭되는 볼륨이 가용해질 때에만 바인딩된다. 예를 들어 클러스터에 여러 50GB짜리 PV가 있으면 100GB를 요청한 PVC에는 매칭되는 볼륨이 없게 되므로 100GB짜리 PV가 클러스터에 추가될 때에야 바인딩 처리된다.


### 사용
파드는 클레임을 볼륨처럼 사용한다. 클러스터는 클레임을 확인하여 바인딩될 볼륨을 찾고 파드에 그 볼륨을 마운트해준다. 멀티 액세스 모드를 지원하는 볼륨을 요청하는 경우, 사용자는 파드의 볼륨으로써 어떤 코드를 사용할 것인지 지정하여 요청해야 한다.

사용자가 클레임을 요청하고 이 클레임이 바인딩되면, 바인딩된 PV는 사용자가 필요로 할 때까지 그들의 소유가 된다. 사용자는 `persistentVolumeClaim` 를 파드의 볼륨 블럭에 기입하여, 파드를 조정하고 요청한 PV에 접근할 수 있다. [작성 방법은 여기를 참고한다](#claims-as-volumes).

### 스토리지 객체 (Storage Object) 사용 중 보호 기능
스토리지 객체 (Storage Object) 사용 중 보호 기능의 목적은, 파드가 사용하고 PV와 바인딩된 PVC가 시스템에서 삭제되어 데이터가 유실되는 것을 방지하기 위함이다.

{{< note >}}
파드 상태가 `Pending`인 파드가 사용하거나, 파드가 노드에 할당되어 `Running` 상태일 때 PVC는 사용 중인 상태이다.
{{< /note >}}

 [스토리지 객체 (Storage Object) 사용 중 보호 기능](/docs/tasks/administer-cluster/storage-object-in-use-protection/)이 활성화되면, 사용자가 파드가 사용하고 있는 PVC를 삭제할 때 바로 삭제되지 않고 PVC를 사용하는 파드가 없어져 비활성화 상태가 될 때까지 대기한 뒤 삭제한다. PVC와 연결된 PV를 관리자가 삭제하는 경우 마찬가지로 바로 삭제되지 않고, PV를 사용하는 PVC가 없어질 때까지 대기한다.

PVC가 보호되고 있다는 것을 확인하는 것에는 두 가지 방법이 있는데, PVC 삭제 요청 뒤 상태값이 `Terminating`이거나 `kubectl describe pvc ..`에서 `Finalizer` 값에 `kubernetes.io/pvc-protection`가 포함되면 보호 상태이임을 알 수 있다.

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

`kubectl describe pv ..`에서 확인되는 `Finalizers` 값이 `kubernetes.io/pv-protection`인 경우에도 보호 모드가 작동 중인 것이다.

```shell
kubectl describe pv task-pv-volume
Name:            task-pv-volume
Labels:          type=local
Annotations:     <none>
Finalizers:      [kubernetes.io/pv-protection]
StorageClass:    standard
Status:          Available
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

### 리클레이밍
사용자가 볼륨 사용을 완료하여 더 이상 사용하지 않아도 되는 경우, 자원의 리클레이밍을 허용하는 API에서 해당 PVC를 삭제한다. `PersistentVolume`에 대한 리클레이밍 정책은, 클레임에서 어떤 볼륨이 해제되었을 때 클러스터에게 어떻게 처리해야 할지 결정해준다. 현재까지는 리클레이밍 정책에서 볼륨이 유지, 재사용, 삭제될 수 있도록만 할 수 있다.

#### 유지 (Retain)
리클레이밍 정책에서 유지하겠다고 하는 경우에는 해당 자원에 대해 수동으로 리클레이밍 처리할 수 있다. PV는 아직 존재하지만 PVC가 삭제되는 경우 해당 볼륨은 해제 상태(released)로 간주되지만, 다른 클레임에 사용될 수는 없다. 이전 사용자의 데이터가 볼륨에 남아있기 때문이다. 관리자는 이 볼륨에 대해 다음과 같은 순서로 리클레임 처리를 한다.

1.  `PersistentVolume`을 삭제한다. 연결된 외부 스토리지 자산(AWS EBS, GCE PD, Azure Disk, Cinder volume) 은 PV가 삭제되어도 그대로 유지된다.  
2. 스토리지 자산에 남아 있는 데이터를 수동으로 삭제한다.
3. 수동으로 해당 스토리지를 삭제하거나, 스토리지 자원을 재사용하고자 하는 경우 이 스토리지에 대해 새로운 `PersistentVolume`을 생성한다.

#### 삭제
삭제 정책을 지원하는 볼륨 플러그인의 경우, 쿠버네티스의 `PersistentVolume`도 삭제하고 외부 스토리지 자체도 삭제한다. 동적으로 프로비저닝된 볼륨의 경우 [`StorageClass`의 리클레이밍 정책](#reclaim-policy)을 상속 받는다. 관리자는 사용자의 요청에 따라 `StorageClass`를 설정하거나 PV를 수정하거나 생성된 뒤에 패치해야 한다. [PersistentVolume의 리클레이밍 정책 변경](/docs/tasks/administer-cluster/change-pv-reclaim-policy/) 문서를 참고한다 

#### 재사용
{{< warning >}}
재사용 리클레이밍 정책은 더이상 사용하지 않는다. 대신 동적 프로비저닝을 이용할 것을 권고한다.
{{< /warning >}}

PV 와 연결된 볼륨 플러그인이 지원하는 경우, 재사용 정책을 사용하면 기본적으로 `rm -rf /thevolume/*`으로 한 번 와이핑을 진행하고 새로운 클래임에 사용할 수 있는 준비를 한다.

[여기](/docs/admin/kube-controller-manager/)처럼 쿠버네티스 controller-manager 명령어로 재사용 파드 템플릿을 설정할 수 있다. 여기에는 다음 예시처럼 `volumes` 설정이 필수로 들어가 있어야 한다.

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

재사용 파드 템플릿의 `volumes` 부분에 기재된 패스는 재사용되는 볼륨의 부분 패스로 변경되어야 한다 

### Persistent Volumes Claims 확장
{{< feature-state for_k8s_version="v1.8" state="alpha" >}}
{{< feature-state for_k8s_version="v1.11" state="beta" >}}
PVC의 확장 지원은 기본적으로 활성화되어 있다. 다음과 같은 볼륨 유형은 볼륨 확장이 가능하다.

* gcePersistentDisk
* awsElasticBlockStore
* Cinder
* glusterfs
* rbd
* Azure File
* Azure Disk
* Portworx
* FlexVolumes

스토리지 클래스의  `allowVolumeExpansion` 값이 true로 설정되어 있으면 PVC를 확장할 수 있다.

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
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

PVC에 더 큰 볼륨을 요청하기 위해서는 PVC 객체를 수정해서 더 큰 사이즈를 설정해주어야 한다. 설정이 수정되면 매핑되어 있는 `PersistentVolume` 아래 볼륨이 확장된다. 새로운 `PersistentVolume`이 생성되지는 않는다. 원래 있는 볼륨의 크기가 재조정된다.

#### 파일시스템을 갖고 있는 볼륨의 리사이징
파일시스템이 있는 볼륨을 리사이징하고자 하는 경우, 그 파일시스템이 반드시 XFS, EXT3, EXT4 중 하나여야 한다.

볼륨 안에 파일시스템이 있을 때, 새로운 파드가 `PersistentVolume`을 읽기-쓰기 모드로 새로이 사용할 때에만 라시이징 된다. 즉, 파드나 디플로이먼트가 사용하고 있는 볼륨을 확장하고 싶다면, 컨트롤러 관리에서 클라우드 프로바이더를 조작하여 볼륨을 확장한 뒤 파드를 삭제하거나 재생성해야 한다. 리사이징 과정의 상황을 확인하고 싶다면 `kubectl describe pvc` 명령어를 수행한다.

```
kubectl describe pvc <pvc_name>
```

`PersistentVolumeClaim`이 `FileSystemResizePending` 상태에 있는 경우, PersistentVolumeClaim을 사용해 파드를 재생성해도 된다.

드라이버의 `RequiresFSResize` 값이 true로 설정되어 있는 경우, FlexVolumes도 라시아징을 할 수 있다. 이는 파드 재시작 시에 반영된다.
{{< feature-state for_k8s_version="v1.11" state="alpha" >}}

#### 사용중인 PersistentVolumeClaim 리사이징
사용중인  PVC를 확장하는 것은 안정화된 기능이다. 이렇게 하기 위해서는 `ExpandInUsePersistentVolumes`를 활성화해주어야 한다. 이 경우 해당 PVC를 사용하는 파드나 디플로이먼드를 삭제하거나 재시작할 필요가 없다. 파일 시스템이 확장되면 바로 해당 PVC가 파드에서 사용할 수 있는 상태로 바뀐다. 파드나 디플로이먼트에서 사용하지 않는 PVC에는 영향이 없는 기능이다. 확장이 완료되기 전에 해당 PVC를 사용하는 파드를 생성해야 한다.

FlexVolumes의 사용 중인 PVC를 확장하는 기능은 1.13 릴리스에서 추가되었다. 이 기능을 활성화하기 위해서는 `ExpandInUsePersistentVolumes`와 `ExpandPersistentVolumes` 기능을 활성화해야 한다. `ExpandPersistentVolumes`는 기본으로 활성화되어 있다. `ExpandInUsePersistentVolumes`이 활성화 설정되면, FlexVolume은 파드 재시작 없이 온라인으로 리사이징된다.

{{< note >}}
**비고:** FlexVolume 리사이징은 하위 드라이버가 리사이징을 지원하는 경우에만 가능하다.
{{< /note >}}

{{< note >}}
EBS 볼륨을 확장하는 것은 시간이 많이 소요되고, 각 볼륨마다 6시간에 한 번씩만 수정이 가능하다.
{{< /note >}}

## Persistent Volumes의 종류
`PersistentVolume` 종류는 플러그인으로 구현되어 있다. 쿠버네티스는 다음과 같은 플러그인들을 지원하고 있다:

* GCEPersistentDisk
* AWSElasticBlockStore
* AzureFile
* AzureDisk
* FC (Fibre Channel)
* Flexvolume
* Flocker
* NFS
* iSCSI
* RBD (Ceph Block Device)
* CephFS
* Cinder (OpenStack block storage)
* Glusterfs
* VsphereVolume
* Quobyte Volumes
* HostPath (싱글 노드 테스트만 지원. 로컬 스토리지는 지원되지 않고 멀티노드 클러스터에서는 아예 작동하지 않을 것임.)
* Portworx Volumes
* ScaleIO Volumes
* StorageOS

## Persistent Volumes
각각의 PV는 볼륨에 대한 스펙과 상태값을 갖는다.

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

### 용량
일반적으로 PV는 한정된 스토리지 용량을 갖는다. 이는 PV의 `capacity` 속성을 통해 설정된다. 쿠버네티스 [자원 모델](https://git.k8s.io/community/contributors/design-proposals/scheduling/resources.md) 문서에서 `capacity`로 표현되는 유닛 개념을 확인할 수 있다.

현재 버전까지, 스토리지 사이즈가 유일하게 설정/요청되는 자원이다. 향후에는 IOPS, 쓰루풋 등이 포함될 예정이다.

### 볼륨 모드
{{< feature-state for_k8s_version="v1.9" state="alpha" >}}

이 기능을 활성화하기 위해서는 `BlockVolume` 기능을 apiserver, controller-manager, kubelet 에 활성화해야 한다.

쿠버네티스 1.9 버전 이전에는 모든 볼륨 플러그인이 PV에 파일시스템을 생성했다. 지금은 `volumeMode`를 `raw`로 설정하여 로우 블럭 디바이스를 사용하거나 `filesystem` 값을 주어 파일시스템으로 사용할 수 있다. 필수로 설정하지 않아도 되는 값이며, 값이 설정되지 않으면 `filesystem`이 기본값이다.

### 액세스 모드
`PersistentVolume`은 자원 프로바이더가 지원하는 방식에 따라 호스트에 마운트될 수 있다. 아래 테이블 내용처럼, 프로바이더들은 각기 다른 기능과 PV 액세스 모드를 제공한다. 예를 들어 NFS는 다중 읽기/쓰기 클라이언트를 지원하지만 몇몇 NFS PV는 서버에 읽기 전용으로만 사용할 수 있다. 각각의 PV는 PV 기능에 따라 각자의 액세스 모드를 갖는다.

액세스 모드에는 다음과 같은 종류가 있다:
* ReadWriteOnce -- 볼륨이 마운트되면 하나의 노드만 읽고 쓸 수 있다.
* ReadOnlyMany -- 여러 노드가 읽기 전용으로 접근할 수 있다.
* ReadWriteMany -- 여러 노드가 읽기, 쓰기 권한을 다 갖도록 마운트될 수 있다.

명령줄에서 액세스 모드는 다음과 같은 줄임말로 사용된다:
* RWO - ReadWriteOnce
* ROX - ReadOnlyMany
* RWX - ReadWriteMany


> **중요!** 볼륨은 한번에 하나의 액세스 모드로만 마운트될 수 있다. 예를 들어  GCEPersistentDisk는 한 노드에 ReadWriteOnce로 마운트되거나 여러 노드에 ReadOnlyMany로 마운트 될 수 있지만, 동시에 두 값을 갖도록 마운트될 수는 없다.   
| Volume Plugin        | ReadWriteOnce| ReadOnlyMany| ReadWriteMany|
| :---                 |     :---:    |    :---:    |    :---:     |
| AWSElasticBlockStore | ✓     | -           | -            |
| AzureFile            | ✓     | ✓    | ✓     |
| AzureDisk            | ✓     | -           | -            |
| CephFS               | ✓     | ✓    | ✓     |
| Cinder               | ✓     | -           | -            |
| FC                   | ✓     | ✓    | -            |
| Flexvolume           | ✓     | ✓    | 드라이버에 따라 다름 |
| Flocker              | ✓     | -           | -            |
| GCEPersistentDisk    | ✓     | ✓    | -            |
| Glusterfs            | ✓     | ✓    | ✓     |
| HostPath             | ✓     | -           | -            |
| iSCSI                | ✓     | ✓    | -            |
| Quobyte              | ✓     | ✓    | ✓     |
| NFS                  | ✓     | ✓    | ✓     |
| RBD                  | ✓     | ✓    | -            |
| VsphereVolume        | ✓     | -           | - (파드가 한 노드에 모여 있을 때에만 가능)  |
| PortworxVolume       | ✓     | -           | ✓     |
| ScaleIO              | ✓     | ✓    | -            |
| StorageOS            | ✓     | -           | -            |

### 클래스
[StorageClass](/docs/concepts/storage/storage-classes/) 의 이름 부분에  `storageClassName` 속성값을 지정하여 PV가 이 값을 클래스로 갖게 할 수 있다. 특정 클래스의 PV는, PVC가 그 클래스에 요청을 하는 경우에만 바인드될 수 있다. `storageClassName`을 갖고 있지 않은 경우, 클래스를 지정하지 않은 PVC에 대해서만 할당될 수 있다.

과거에는 `storageClassName` 대신 `volume.beta.kubernetes.io/storage-class`가 사용됐다. 아직 사용할 수는 있지만 향후 출시되는 쿠버네티스 릴리즈에서는 완전히 사용하지 못하도록 될 것이다.

### 리클레임(Reclaim) 정책
현재 리클레임 정책에는 다음과 같은 종류가 있다:

* 유지(Retain) -- 수동 리클레임
* 재사용 -- `rm -rf /thevolume/*`로 기본적인 와이핑
* 삭제 -- AWS EBS, GCE PD, Azure Disk, OpenStack Cinder 볼륨과 같은 외부 스토리지 자원을 PV와 함께 삭제

현재는 NFS와 HostPath만 재사용 정책을 지원한다.  AWS EBS, GCE PD, Azure Disk, Cinder volumes은 삭제 정책을 지원한다.

### 마운트 옵션
노드에 한 PV가 마운트될 때 쿠버네티스 관리자는 추가적인 마운트 옵션을 알고 있어야 한다.

{{< note >}}
모든 PV 종류가 마운트 옵션을 지원하지는 않는다.
{{< /note >}}

아래 볼륨 종류는 마운트 옵션을 지원한다.

* AWSElasticBlockStore
* AzureDisk
* AzureFile
* CephFS
* Cinder (OpenStack block storage)
* GCEPersistentDisk
* Glusterfs
* NFS
* Quobyte Volumes
* RBD (Ceph Block Device)
* StorageOS
* VsphereVolume
* iSCSI

마운트 옵션을 제대로 검증하지 않는 경우, 그 중 하나만 잘못 들어갔어도 마운트 전체가 실패하게 된다.
과거에는 `mountOptions` 대신 `volume.beta.kubernetes.io/mount-options` 를 사용했다. 아직 사용할 수는 있지만 향후 출시되는 쿠버네티스 릴리즈에서는 완전히 사용하지 못하도록 될 것이다.

### Node Affinity
{{< note >}}
대부분의 볼륨 종류에는 이 설정을 할 필요 없다.  [AWS EBS](/docs/concepts/storage/volumes/#awselasticblockstore), [GCE PD](/docs/concepts/storage/volumes/#gcepersistentdisk), [Azure Disk](/docs/concepts/storage/volumes/#azuredisk)에는 자동으로 설정되어 있다. [로컬](/docs/concepts/storage/volumes/#local) 볼륨에는 별도로 설정해주어야 한다.
{{< /note >}}

PV는 [node affinity](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volumenodeaffinity-v1-core)를 설정하여 어떤 노드가 이 볼륨에 접근할 수 있는지 제한할 수 있다. 한 PV를 사용하는 파드는 node affinity로 설정된 노드에만 접근할 수 있다.

### 상태값 (Phase)
볼륨은 다음과 같은 상태값(Phase)를 갖는다:

* Available -- 아직 클레임에 바인드되지 않은 자원
* Bound -- 클레임에 바인드된 볼륨
* Released -- 클레임은 삭제되었지만 클러스터에서 아직 리클레임 처리되지 않은 자원
* Failed --  자동 리클레임에 실패한 상태의 볼륨

명령줄로 PV에 바인딩된 PVC의 이름을 출력할 수 있다.

## PersistentVolumeClaims
각각의 PVC는 클레임의 스펙과 상태 값을 갖는다.

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
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

### 액세스 모드
클레임이 특정 액세스 모드를 가진 스토리지를 요청할 때 볼륨과 같은 방식으로 커뮤니케이션 한다.

### 볼륨 모드
클레임은 볼륨과 동일한 방식으로 파일시스템이나 블록 디바이스를 사용하겠다고 커뮤니케이션 한다 

### 자원
클레임은 파드와 같이 한 자원의 특정량을 요청한다. 클레임의 경우 스토리지에 대한 요청이다. 볼륨과 클레임에 같은 [자원 모델](https://git.k8s.io/community/contributors/design-proposals/scheduling/resources.md)이 적용된다.

### 셀렉터
클레임은 [라벨 셀렉터](/docs/concepts/overview/working-with-objects/labels/#label-selectors)를 지정하여 볼륨 세트를 필터해서 사용할 수 있도록 한다. 이 경우 셀렉터와 동일한 라벨을 갖는 볼륨만 해당 클레임에 바인딩될 수 있다. 셀렉터는 다음과 같은 두 가지 필드로 구성된다:

* `matchLabels` - 바인딩될 볼륨은 이 값과 일치하는 라벨을 갖고 있어야 한다.
* `matchExpressions` - 키, 값 리스트, 키-밸류 매핑 오퍼레이터로 구성된 요구사항 리스트. 유효한 오퍼레이터에는 In, NotIn, Exists, and DoesNotExist가 있다.

 `matchLabels` 와  `matchExpressions`의 모든 요구사항은 모두 AND 조건으로, 셀렉터 매칭을 위해서는 명시된 모든 조건이 만족되어야 한다.

### 클래스
`storageClassName` 속성값을 이용해 [StorageClass](/docs/concepts/storage/storage-classes/)의 이름을 정하면, 클레임은 특정 클래스를 이용해 요청을 보낼 수 있다. PVC의 `storageClassName`와 동일한 값을 갖는 요청된 클래스의 PV들만 해당 PVC와 바인딩 될 수 있다.

PVC가 꼭 클래스를 요청해야 하는 것은 아니다. `storageClassName`이 `””`로 되어 있거나 어노테이션 자체가 없는 경우에는 항상 PVC가 클래스가 없는 PV로 요청을 보내는 것으로 간주하고 바인딩을 한다. [`DefaultStorageClass` 관리 플러그인](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass) 설정에 따라 `storageClassName`이 없는 PVC에 대한 처리를 다르게 할 수도 있다.

* 관리 플러그인이 활성화되어 있으면, 관리자가 기본 `StorageClass`를 지정할 수 있다. `storageClassName` 값이 없는 모든 PVC는 이 기본 클래스로 바인딩 된다.  `StorageClass` 객체의 `storageclass.kubernetes.io/is-default-class` 값을 “true”로 설정하면 기본  `StorageClass`를 지정할 수 있다. 관리자가 기본값을 설정하지 않는 경우 클러스터는, 관리 플러그인이 비활성화되어 있는 것처럼 PVC 생성 요청을 처리한다. 하나 이상의 기본값이 설정된 경우 관리 플러그인은 모든 PVC의 생성을 중단한다.
* 관리 플러그인이 비활성화되어 있으면, 기본 `StorageClass`의 개념이 아예 존재하지 않는다. `storageClassName`이 없는 모든 PVC는 클래스가 없는 PV에만 바인딩 된다. 이 경우 `storageClassName`이 없는 PVC는 `storageClassName`가 `""`로 설정되어 있는 것과 같이 처리된다.

설치 방법에 따라 기본 StorageClass가 애드온 관리자에 의해 쿠버네티스 클러스터에 도입될 수 있다.

PVC에 `selector`와 `StorageClass`가 같이 설정되면 이 둘이 AND 조건으로 인식된다. 즉, 해당 클래스와 라벨을 동시에 만족하는 PV 만 이 PVC에 할당된다.

{{< note >}}
현재는 `selector` 값을 갖고 있는 PVC의 경우 동적 프로비저닝으로 PV를 할당 받을 수 없다.
{{< /note >}}

과거에는 `storageClassName` 대신  `volume.beta.kubernetes.io/storage-class` 어노테이션이 사용되었고 아직 사용할 수 있다. 그러나 향후 발행될 쿠버네티스 릴리스에서는 지원되지 않는다.

## 볼륨으로서의 클레임
파드는 클레임을 볼륨으로 이용해 스토리지에 접근한다. 클레임은 그 파드와 같은 네임스페이스 아래 있어야 한다. 클러스터는 파드의 네임스페이스 안에서 클레임을 찾고 이의  `PersistentVolume`를 찾는다. 이 작업이 완료되면 호스트와 파드에 볼륨이 마운트된다.

```yaml
kind: Pod
apiVersion: v1
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

### 네임스페이스 참고사항
`PersistentVolumes` 바인드는 일대일 매핑이고 `PersistentVolumeClaims` 이 네임스페이스의 객체이기 때문에, 한 네임스페이스 아래에서만 “Many”모드(`ROX`, `RWX`)로 클레임을 마운트할 수 있다.

## 로우 블럭 볼륨 지원
{{< feature-state for_k8s_version="v1.9" state="alpha" >}}

로우 블럭 볼륨 지원을 활성화하기 위해서는 apiserver, controller-manager, kubelet의 `BlockVolume` 기능을 활성화해야 한다.

아래 볼륨 플러그인은 로우 블럭 볼륨을 지원하고 필요한 경우 동적 프로비저닝까지 지원한다.
* AWSElasticBlockStore
* AzureDisk
* FC (Fibre Channel)
* GCEPersistentDisk
* iSCSI
* Local volume
* RBD (Ceph Block Device)
* VsphereVolume (alpha)

{{< note >}}
쿠버네티스 1.9 버전에서는 FC와 iSCSI 볼륨만 로우 블럭 볼륨을 지원했다. 이 외의 플러그인들은 1.10 버전에서 추가 지원을 시작했다.
{{< /note >}}

### 로우 블럭 볼륨을 이용한 Persistent Volumes
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

### 로우 블럭 볼륨을 요청하는 Persistent Volume Claim
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

### 컨테이너에 로우 블럭 디바이스 패스를 추가하는 파드 설정
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
로우 블럭 디바이스를 파드에 추가할 때, 컨테이너 내의 마운트 패스 대신 디바이스 패스를 적어야 한다.
{{< /note >}}

### 블럭 볼륨 바인딩 
한 사용자가 `PersistentVolumeClaim`의 `volumeMode` 필드를 이용해 로우 블럭 볼륨을 요청하는 경우, 이전 릴리스와는 조금 다른 바인딩 룰이 적용된다. 아래 표는 사용자와 관리자가 로우 블럭 디바이스를 요청할 때 사용할 수 있는 조합을 나타낸다. 설정 값에 따라 볼륨 바인딩이 될 지 알 될 지 나타내는 것이다. 아래 테이블은 정적 프로비저닝을 전제로 한다.

| PV volumeMode | PVC volumeMode  | Result           |
| --------------|:---------------:| ----------------:|
|   unspecified | unspecified     | BIND             |
|   unspecified | Block           | NO BIND          |
|   unspecified | Filesystem      | BIND             |
|   Block       | unspecified     | NO BIND          |
|   Block       | Block           | BIND             |
|   Block       | Filesystem      | NO BIND          |
|   Filesystem  | Filesystem      | BIND             |
|   Filesystem  | Block           | NO BIND          |
|   Filesystem  | unspecified     | BIND             |

{{< note >}}
안정된 릴리스에서는 정적으로 프로비저닝된 볼륨들만 지원한다. 관리자는 로우 블럭 디바이스를 다룰 때  이 점에 주의해야 한다.
{{< /note >}}

## 볼륨 스냅샷과 복원
{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

볼륨 스냅샷 기능은 CSI Volume Plugins을 지원하기 위해 추가됐다. 자세한 내용은 [볼륨 스냅샷](/docs/concepts/storage/volume-snapshots/) 문서를 확인한다.

볼륩 스냅샷 데이터 소스를 이용해 볼륨을 복원하기 위해서는 apiserver와 controller-manager에 `VolumeSnapshotDataSource` 기능을 활성화해야 한다.

### 볼륨 스냅샷에서 Persistent Volume Claim 생성
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

## 재사용 가능한 (Portable) 설정 작성
persistent storage를 클러스터의 넓은 범위에서 사용하는 설정 템플릿이나 예시를 작성할 때 다음과 같은 패턴을 따르기를 권장한다.

* PersistentVolumeClaim 객체를 설정 번들에 포함 (Deployments, ConfigMaps 등과 함께)한다.
* 설정을 실행하는 사용자가 PersistentVolume 을 생성할 권한을 갖고 있지 않을 수 있으니, 설정에 PersistentVolume 객체는 포함하지 않는다.
* 템플릿을 적용할 때 사용할 수 있는 스토리지 클래스 이름의 선택지를 사용자에게 제공한다.
	* 사용자가 스토리지 클래스 이름을 제공해야 하는 경우 `persistentVolumeClaim.storageClassName`에 값을 입력하도록 한다. 관리자가 클러스터에 StorageClass를 활성화해두었다면, 이를 통해 PVC가 맞는 스토리지 클래스를 찾아갈 수 있다.
	* 사용자가 스토리지 클래스 이름을 제공하지 않는 경우 `persistentVolumeClaim.storageClassName` 필드를 nil 상태로 둔다.
	* 이 경우 클러스터의 기본 StorageClass를 사용해 자동으로 PV가 프로비저닝 된다. 많은 클러스터 환경이 기본적으로 StorageClass를 설치하며, 그렇지 않은 경우 관리자가 스스로 기본값을 생성할 수 있다.
* 특정 시간 이후까지 바인딩 되지 않는 PVC를 모니터링하여 사용자가 볼 수 있도록 모니터링 설정을 한다. 이 경우 클러스터에서 스토리지의 정적 프로비저닝이 지원되지 않아서 사용자가 매칭되는 PV를 생성해야 하거나, 클러스터에 스토리지 시스템이 없어서 PVC를 필요로 하는 설정을 적용할 수 없는 상태이다.


{{% /capture %}}
