---
# reviewers:
# - jsafrane
# - saad-ali
# - thockin
# - msau42
title: 스토리지클래스
api_metadata:
- apiVersion: "storage.k8s.io/v1"
  kind: "StorageClass"
content_type: concept
weight: 40
---

<!-- overview -->

이 문서는 쿠버네티스의 스토리지클래스(StorageClass) 개념을 설명한다. 이 문서를 읽기 전에
[볼륨](/docs/concepts/storage/volumes/)과
[퍼시스턴트 볼륨](/docs/concepts/storage/persistent-volumes)을 알아두는 것이 좋다.

스토리지클래스는 관리자가 제공하는 스토리지의 _클래스_를 설명하기 위한
방법이다. 각 클래스는 서비스 품질 수준이나
백업 정책 또는 클러스터 관리자가 정한 임의의 정책에
매핑될 수 있다. 쿠버네티스 자체는 클래스가 무엇을 나타내야 하는지
규정하지 않는다.

쿠버네티스의 스토리지 클래스 개념은 다른 일부 스토리지 시스템 설계의
“프로파일(profile)”과 유사하다.

<!-- body -->

## 스토리지클래스 오브젝트

각 스토리지클래스에는 `provisioner`, `parameters`, `reclaimPolicy` 필드가
있다. 이 필드는 퍼시스턴트볼륨클레임(PersistentVolumeClaim, PVC)을 충족하기 위해
해당 클래스에 속하는 퍼시스턴트볼륨(PersistentVolume)을 동적으로 프로비저닝할 때 사용된다.

스토리지클래스 오브젝트의 이름은 중요하며, 사용자는 이 이름으로 특정
클래스를 요청할 수 있다. 관리자는 스토리지클래스 오브젝트를 처음 생성할 때
클래스의 이름과 다른 파라미터를 설정한다.

관리자는 특정 클래스를 요청하지 않는 모든 PVC에 적용되는 기본 스토리지클래스를
지정할 수 있다. 자세한 내용은
[퍼시스턴트볼륨클레임](/docs/concepts/storage/persistent-volumes/#퍼시스턴트볼륨클레임)을 참고한다.

다음은 스토리지클래스의 예시이다.

{{% code_sample file="storage/storageclass-low-latency.yaml" %}}

## 기본 스토리지클래스

스토리지클래스를 클러스터의 기본값으로 표시할 수 있다.
기본 스토리지클래스 설정 방법은
[기본 스토리지클래스(StorageClass) 변경하기](/docs/tasks/administer-cluster/change-default-storage-class/)를 참고한다.

PVC에 `storageClassName`이 지정되지 않은 경우 기본 스토리지클래스가
사용된다.

클러스터에서 하나 이상의 스토리지클래스에
[`storageclass.kubernetes.io/is-default-class`](/docs/reference/labels-annotations-taints/#storageclass-kubernetes-io-is-default-class)
어노테이션을 true로 설정한 다음 `storageClassName`이 설정되지 않은
퍼시스턴트볼륨클레임을 생성하면, 쿠버네티스는 가장 최근에 생성된 기본
스토리지클래스를 사용한다.

{{< note >}}
클러스터에서는 하나의 스토리지클래스만 기본값으로 표시하는 것이
좋다. 쿠버네티스가 여러 기본 스토리지클래스를 허용하는 이유는 원활한
마이그레이션을 지원하기 위해서이다.
{{< /note >}}

새 PVC에 `storageClassName`을 지정하지 않고 퍼시스턴트볼륨클레임을
생성할 수 있으며, 클러스터에 기본 스토리지클래스가 없는 경우에도 가능하다.
이 경우 새 PVC는 정의한 대로 생성되며, 기본값을 사용할 수 있게 될 때까지
해당 PVC의 `storageClassName`은 설정되지 않은 상태로 남는다.

기본 스토리지클래스가 없는 클러스터를 구성할 수 있다. 어떤 스토리지클래스도
기본값으로 표시하지 않았고(예를 들어 클라우드 공급자가 기본값을 대신 설정하지도 않았다면),
쿠버네티스는 기본값이 필요한 퍼시스턴트볼륨클레임에 기본값을 적용할 수
없다.

기본 스토리지클래스를 사용할 수 있게 되면, 컨트롤 플레인은 `storageClassName`이
없는 기존 PVC를 식별한다. 그런 다음 `storageClassName` 값이 비어 있거나
이 키가 없는 PVC를 업데이트하여, `storageClassName`을 새 기본 스토리지클래스와
일치하도록 설정한다.
`storageClassName`이 `""`인 기존 PVC가 있는 상태에서
기본 스토리지클래스를 구성하면 해당 PVC는 업데이트되지 않는다.

`storageClassName`이 `""`인 PV에 계속 바인딩하려면,
(기본 스토리지클래스가 있는 상태에서도), 연결된 PVC의 `storageClassName`을
`""`로 설정해야 한다.

## 프로비저너

각 스토리지클래스에는 PV 프로비저닝에 사용되는 볼륨 플러그인을 결정하는
프로비저너가 있다. 이 필드는 반드시 지정해야 한다.

| 볼륨 플러그인        | 내부 프로비저너       |             구성 예시              |
| :------------------- | :------------------: | :--------------------------------: |
| AzureFile            |       &#x2713;       |       [Azure 파일](#azure-file)       |
| CephFS               |          -           |                  -                 |
| FC                   |          -           |                  -                 |
| FlexVolume           |          -           |                  -                 |
| iSCSI                |          -           |                  -                 |
| Local                |          -           |          [로컬](#로컬)             |
| NFS                  |          -           |              [NFS](#nfs)           |
| PortworxVolume       |       &#x2713;       | [Portworx 볼륨](#portworx-volume) |
| RBD                  |          -           |     [Ceph RBD](#ceph-rbd)          |
| VsphereVolume        |       &#x2713;       |        [vSphere](#vsphere)         |

여기에 나열된 “내부” 프로비저너(이름에 “kubernetes.io” 접두사가 붙고
쿠버네티스와 함께 제공됨)만 지정해야 하는 것은 아니다. 쿠버네티스가 정의한
[명세](https://git.k8s.io/design-proposals-archive/storage/volume-provisioning.md)를
따르는 독립적인 프로그램인 외부 프로비저너를 실행하고 지정할 수도 있다.
외부 프로비저너 작성자는 코드를 어디에 둘지,
프로비저너를 어떻게 배포하고 실행할지,
어떤 볼륨 플러그인을 사용할지(Flex 포함) 등을 자유롭게 결정할 수 있다.
[kubernetes-sigs/sig-storage-lib-external-provisioner](https://github.com/kubernetes-sigs/sig-storage-lib-external-provisioner)
리포지터리에는 명세 대부분을 구현한 외부 프로비저너 작성용 라이브러리가
있다. 일부 외부 프로비저너는
[kubernetes-sigs/sig-storage-lib-external-provisioner](https://github.com/kubernetes-sigs/sig-storage-lib-external-provisioner) 리포지터리에 나열되어 있다.

예를 들어, NFS는 내부 프로비저너를 제공하지 않지만, 외부
프로비저너를 사용할 수 있다. 타사 스토리지 업체가 자체 외부
프로비저너를 제공하는 경우도 있다.

## 반환 정책

스토리지클래스에 의해 동적으로 생성된 퍼시스턴트볼륨은 클래스의
`reclaimPolicy` 필드에 지정된
[반환 정책](/docs/concepts/storage/persistent-volumes/#반환-reclaiming)을 가지는데,
`Delete` 또는 `Retain`이 적용된다. 스토리지클래스 오브젝트가 생성될 때,
`reclaimPolicy`를 지정하지 않으면 기본값은 `Delete`이다.

수동으로 생성되고 스토리지클래스를 통해 관리되는 퍼시스턴트볼륨에는
생성 시 할당된 반환 정책이 있다.

## 볼륨 확장 {#allow-volume-expansion}

퍼시스턴트볼륨은 확장이 가능하도록 구성할 수 있다. 대응되는 PVC 오브젝트를
편집하여 더 큰 용량의 스토리지를 새로 요청하는 방식으로 볼륨 크기를
조정할 수 있다.

기반 스토리지클래스의 `allowVolumeExpansion` 필드가 true로 설정된 경우
다음 볼륨 유형이 볼륨 확장을 지원한다.

{{< table caption = "볼륨 유형과 볼륨 확장에 필요한 쿠버네티스 버전"  >}}

| 볼륨 유형            | 볼륨 확장에 필요한 쿠버네티스 버전 |
| :------------------- | :--------------------------------- |
| Azure File           | 1.11                               |
| CSI                  | 1.24                               |
| FlexVolume           | 1.13                               |
| Portworx             | 1.11                               |
| rbd                  | 1.11                               |

{{< /table >}}

{{< note >}}
볼륨 확장 기능은 볼륨을 확장하는 데만 사용할 수 있으며 축소할 수는 없다.
{{< /note >}}

## 마운트 옵션

스토리지클래스에 의해 동적으로 생성된 퍼시스턴트볼륨은
클래스의 `mountOptions` 필드에 지정된 마운트 옵션을 가진다.

볼륨 플러그인이 마운트 옵션을 지원하지 않는데 마운트 옵션을
지정하면 프로비저닝이 실패한다. 마운트 옵션은 클래스와 PV 어디에서도
검증되지 **않는다**. 마운트 옵션이 유효하지 않으면 PV 마운트에 실패한다.

## 볼륨 바인딩 모드

`volumeBindingMode` 필드는
[볼륨 바인딩과 동적 프로비저닝](/docs/concepts/storage/persistent-volumes/#프로비저닝)의
실행 시점을 제어한다. 설정하지 않으면 기본적으로 `Immediate` 모드가 사용된다.

`Immediate` 모드는 퍼시스턴트볼륨클레임이 생성되면 볼륨
바인딩과 동적 프로비저닝이 즉시 발생하는 것을 나타낸다. 토폴로지 제약이
있고 클러스터의 모든 노드에서 전역적으로 접근할 수 없는 스토리지
백엔드의 경우, 파드의 스케줄링 요구 사항을
고려하지 않고 퍼시스턴트볼륨을 바인딩하거나 프로비저닝한다. 이로 인해 스케줄링할 수 없는 파드가 발생할 수 있다.

클러스터 관리자는 `WaitForFirstConsumer` 모드를 지정하여 이 문제를 해결할 수 있는데
이 모드는 퍼시스턴트볼륨클레임을 사용하는 파드가 생성될 때까지 퍼시스턴트볼륨의 바인딩과 프로비저닝을 지연시킨다.
퍼시스턴트볼륨은 파드의 스케줄링 제약 조건이 지정한 토폴로지에 맞춰
선택되거나 프로비저닝된다. 이러한 제약 조건에는 [리소스
요구 사항](/docs/concepts/configuration/manage-resources-containers/),
[노드 셀렉터](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector),
[파드 어피니티와
안티-어피니티](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity),
[테인트와 톨러레이션](/docs/concepts/scheduling-eviction/taint-and-toleration) 등이 있다.

다음 플러그인은 동적 프로비저닝에서 `WaitForFirstConsumer`를 지원한다.

- 특정 CSI 드라이버가 지원하는 경우의 CSI 볼륨

다음 플러그인은 미리 생성된 퍼시스턴트볼륨 바인딩에서 `WaitForFirstConsumer`를 지원한다.

- 특정 CSI 드라이버가 지원하는 경우의 CSI 볼륨
- [`local`](#로컬)

{{< note >}}
`WaitForFirstConsumer`를 사용한다면, 노드 어피니티를 지정하기 위해
파드 명세에 `nodeName`을 사용해서는 안 된다.
이 경우 `nodeName`을 사용하면 스케줄러는 우회되고 PVC는 `pending` 상태로 남는다.

대신 `kubernetes.io/hostname`에 노드 셀렉터를 사용할 수 있다.
{{< /note >}}

{{% code_sample language="yaml" file="storage/storageclass/pod-volume-binding.yaml" %}}

## 허용된 토폴로지

클러스터 운영자가 `WaitForFirstConsumer` 볼륨 바인딩 모드를 지정하면, 대부분의 상황에서
더 이상 특정 토폴로지로 프로비저닝을 제한할 필요가 없다. 그러나
여전히 필요한 경우에는 `allowedTopologies`를 지정할 수 있다.

다음 예시는 프로비저닝된 볼륨의 토폴로지를 특정 영역으로 제한하는 방법을
보여 주며 지원되는 플러그인의 `zone`과 `zones` 파라미터를 대체하여
사용해야 한다.

{{% code_sample language="yaml" file="storage/storageclass/storageclass-topology.yaml" %}}

## 파라미터

스토리지클래스에는 해당 스토리지클래스에 속한 볼륨을 설명하는 파라미터가
있다. `provisioner`에 따라 허용되는 파라미터가 다를 수 있다.
파라미터를 생략하면 일부 기본값이 사용된다.

스토리지클래스에 최대 512개의 파라미터를 정의할 수 있다.
키와 값을 포함한 파라미터 오브젝트의 총길이는
256 KiB를 초과할 수 없다.

### AWS EBS

<!-- maintenance note: OK to remove all mention of awsElasticBlockStore once the v1.27 release of
Kubernetes has gone out of support -->

쿠버네티스 {{< skew currentVersion >}}에는 `awsElasticBlockStore` 볼륨 유형이 포함되지 않는다.

트리 내(in-tree) AWSElasticBlockStore 스토리지 드라이버는 쿠버네티스 v1.19 릴리스에서
사용 중단(deprecated)되었고 v1.27 릴리스에서 완전히 제거되었다.

쿠버네티스 프로젝트는 트리 외(out-of-tree) [AWS EBS](https://github.com/kubernetes-sigs/aws-ebs-csi-driver)
스토리지 드라이버를 대신 사용할 것을 권장한다.

다음은 AWS EBS CSI 드라이버를 위한 스토리지클래스의 예시이다.

{{% code_sample language="yaml" file="storage/storageclass/storageclass-aws-ebs.yaml" %}}

`tagSpecification`: 이 접두사가 붙은 태그가 동적으로 프로비저닝된 EBS 볼륨에 적용된다.

### AWS EFS

AWS EFS 스토리지를 구성하려면 트리 외 [AWS_EFS_CSI_DRIVER](https://github.com/kubernetes-sigs/aws-efs-csi-driver)를 사용할 수 있다.

{{% code_sample language="yaml" file="storage/storageclass/storageclass-aws-efs.yaml" %}}

- `provisioningMode`: Amazon EFS가 프로비저닝할 볼륨 유형. 현재 액세스 포인트 기반 프로비저닝(`efs-ap`)만 지원된다.
- `fileSystemId`: 액세스 포인트가 생성되는 파일 시스템.
- `directoryPerms`: 액세스 포인트가 생성한 루트 디렉터리의 디렉터리 권한.

자세한 내용은 [AWS_EFS_CSI_Driver 동적 프로비저닝](https://github.com/kubernetes-sigs/aws-efs-csi-driver/blob/master/examples/kubernetes/dynamic_provisioning/README.md) 문서를 참고한다.


### NFS

NFS 스토리지를 구성하려면 트리 내 드라이버 또는
[쿠버네티스용 NFS CSI 드라이버](https://github.com/kubernetes-csi/csi-driver-nfs#readme)를
사용할 수 있다(권장).

{{% code_sample language="yaml" file="storage/storageclass/storageclass-nfs.yaml" %}}

- `server`: NFS 서버의 호스트네임 또는 IP 주소.
- `path`: NFS 서버가 익스포트(export)한 경로.
- `readOnly`: 스토리지를 읽기 전용으로 마운트할지 나타내는 플래그(기본값 false).

쿠버네티스에는 내부 NFS 프로비저너가 포함되어 있지 않다.
NFS용 스토리지클래스를 생성하려면 외부 프로비저너를 사용해야 한다.
예시는 다음과 같다.

- [NFS Ganesha 서버와 외부 프로비저너](https://github.com/kubernetes-sigs/nfs-ganesha-server-and-external-provisioner)
- [NFS 하위 디렉터리 외부 프로비저너](https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner)

### vSphere

vSphere 스토리지 클래스에는 두 가지 유형의 프로비저너가 있다.

- [CSI 프로비저너](#vsphere-provisioner-csi): `csi.vsphere.vmware.com`
- [vCP 프로비저너](#vcp-프로비저너): `kubernetes.io/vsphere-volume`

트리 내 프로비저너는 [사용 중단되었다](/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/#why-are-we-migrating-in-tree-plugins-to-csi).
CSI 프로비저너에 대한 자세한 내용은
[쿠버네티스 vSphere CSI 드라이버](https://vsphere-csi-driver.sigs.k8s.io/)와
[vSphere CSI 마이그레이션](/docs/concepts/storage/volumes/#vsphere-csi-migration)을 참고한다.

#### CSI 프로비저너 {#vsphere-provisioner-csi}

vSphere CSI 스토리지클래스 프로비저너는 Tanzu 쿠버네티스 클러스터에서 작동한다.
예시는 [vSphere CSI 리포지터리](https://github.com/kubernetes-sigs/vsphere-csi-driver/blob/master/example/vanilla-k8s-RWM-filesystem-volumes/example-sc.yaml)를 참고한다.

#### vCP 프로비저너

다음 예시에서는 VMware 클라우드 공급자(vCP) 스토리지클래스 프로비저너를 사용한다.

1. 사용자 지정 디스크 형식으로 스토리지클래스를 생성한다.

   ```yaml
   apiVersion: storage.k8s.io/v1
   kind: StorageClass
   metadata:
     name: fast
   provisioner: kubernetes.io/vsphere-volume
   parameters:
     diskformat: zeroedthick
   ```

   `diskformat`: `thin`, `zeroedthick`, `eagerzeroedthick`. 기본값: `"thin"`.

2. 사용자 지정 데이터스토어에 디스크 형식을 갖는 스토리지클래스를 생성한다.

   ```yaml
   apiVersion: storage.k8s.io/v1
   kind: StorageClass
   metadata:
     name: fast
   provisioner: kubernetes.io/vsphere-volume
   parameters:
     diskformat: zeroedthick
     datastore: VSANDatastore
   ```

   `datastore`: 사용자는 스토리지클래스에 데이터스토어를 지정할 수도 있다.
   볼륨은 스토리지클래스에 지정된 데이터스토어에 생성되며,
   이 예시에서는 `VSANDatastore`이다. 이 필드는 선택 사항이다.
   데이터스토어를 지정하지 않으면 vSphere 클라우드
   공급자를 초기화하는 데 사용되는 vSphere 구성 파일에 지정된 데이터스토어에
   볼륨이 생성된다.

3. 쿠버네티스 내부의 스토리지 정책 관리

   - 기존 vCenter SPBM 정책 사용

     스토리지 관리에서 vSphere의 가장 중요한 기능 중 하나는
     정책 기반 관리이다. 스토리지 정책 기반 관리(SPBM)는
     광범위한 데이터 서비스와 스토리지 솔루션을 아우르는
     통합 컨트롤 플레인을 제공하는 스토리지 정책 프레임워크이다. SPBM을 사용하면
     vSphere 관리자는 스토리지 프로비저닝의 초기 문제를 해결할 수 있으며,
     여기에는 용량 계획, 서비스 수준 차등화, 여유 용량
     관리 등이 포함된다.

     스토리지클래스에서 `storagePolicyName` 파라미터를 사용하여
     SPBM 정책을 지정할 수 있다.

   - 쿠버네티스 내부의 가상 SAN 정책 지원

     vSphere 인프라스트럭처(VI) 관리자는 동적 볼륨 프로비저닝 중에 사용자 정의
     가상 SAN 스토리지 기능을 지정할 수 있다.
     동적 볼륨 프로비저닝 중에
     성능과 가용성 같은 스토리지 요구 사항을 스토리지 기능의 형태로
     정의할 수 있다. 스토리지 기능 요구 사항은 가상 SAN
     정책으로 변환되며, 퍼시스턴트볼륨(가상 디스크)이 생성될 때 이 정책은
     가상 SAN 계층으로 전달된다. 가상 디스크는
     요구 사항을 충족하도록 가상 SAN 데이터스토어에 분산된다.

     퍼시스턴트볼륨 관리에 스토리지 정책을 사용하는 방법에 대한 자세한 내용은
     [볼륨의 동적 프로비저닝을 위한 스토리지 정책 기반 관리](https://github.com/vmware-archive/vsphere-storage-for-kubernetes/blob/fa4c8b8ad46a85b6555d715dd9d27ff69839df53/documentation/policy-based-mgmt.md)를
     참고한다.

### Ceph RBD (사용 중단) {#ceph-rbd}

{{< note >}}
{{< feature-state state="deprecated" for_k8s_version="v1.28" >}}
이 Ceph RBD 내부 프로비저너는 사용 중단되었다.
[CephFS RBD CSI 드라이버](https://github.com/ceph/ceph-csi)를 사용한다.
{{< /note >}}

{{% code_sample language="yaml" file="storage/storageclass/storageclass-ceph-rbd.yaml" %}}

- `monitors`: 쉼표로 구분된 Ceph 모니터. 이 파라미터는 필수이다.
- `adminId`: 풀에 이미지를 생성할 수 있는 Ceph 클라이언트 ID.
  기본값은 "admin"이다.
- `adminSecretName`: `adminId`의 시크릿(Secret) 이름. 이 파라미터는 필수이다.
  제공된 시크릿은 "kubernetes.io/rbd" 유형이어야 한다.
- `adminSecretNamespace`: `adminSecretName`의 네임스페이스(Namespace). 기본값은 "default"이다.
- `pool`: Ceph RBD 풀. 기본값은 "rbd"이다.
- `userId`: RBD 이미지를 매핑하는 데 사용하는 Ceph 클라이언트 ID. 기본값은
  `adminId`와 같다.
- `userSecretName`: `userId`가 RBD 이미지를 매핑하는 데 사용하는 Ceph 시크릿의 이름. 이 시크릿은
  PVC와 같은 네임스페이스에 있어야 한다. 이 파라미터는 필수이다.
  제공된 시크릿의 유형은 "kubernetes.io/rbd"여야 하며, 예를 들어 다음과 같이
  생성한다.

  ```shell
  kubectl create secret generic ceph-secret --type="kubernetes.io/rbd" \
    --from-literal=key='QVFEQ1pMdFhPUnQrSmhBQUFYaERWNHJsZ3BsMmNjcDR6RFZST0E9PQ==' \
    --namespace=kube-system
  ```

- `userSecretNamespace`: `userSecretName`의 네임스페이스.
- `fsType`: 쿠버네티스가 지원하는 fsType. 기본값: `"ext4"`.
- `imageFormat`: Ceph RBD 이미지 형식, "1" 또는 "2". 기본값은 "2"이다.
- `imageFeatures`: 이 파라미터는 선택 사항이며 `imageFormat`을
  "2"로 설정한 경우에만 사용해야 한다. 현재 지원되는 기능은 `layering`뿐이다.
  기본값은 ""이며 어떤 기능도 활성화되지 않는다.

### Azure 디스크

<!-- maintenance note: OK to remove all mention of azureDisk once the v1.27 release of
Kubernetes has gone out of support -->

쿠버네티스 {{< skew currentVersion >}}에는 `azureDisk` 볼륨 유형이 포함되지 않는다.

트리 내 `azureDisk` 스토리지 드라이버는 쿠버네티스 v1.19 릴리스에서
사용 중단되었고 v1.27 릴리스에서 완전히 제거되었다.

쿠버네티스 프로젝트는 타사 [Azure 디스크](https://github.com/kubernetes-sigs/azuredisk-csi-driver)
스토리지 드라이버를 대신 사용할 것을 권장한다.

### Azure 파일 (사용 중단) {#azure-file}

{{% code_sample language="yaml" file="storage/storageclass/storageclass-azure-file.yaml" %}}

- `skuName`: Azure 스토리지 계정 SKU 계층. 기본값은 비어 있다.
- `location`: Azure 스토리지 계정 위치. 기본값은 비어 있다.
- `storageAccount`: Azure 스토리지 계정 이름. 기본값은 비어 있다. 스토리지
  계정이 제공되지 않으면 리소스 그룹과 연결된 모든 스토리지 계정을
  검색하여 `skuName`과 `location`이 일치하는 계정을 찾는다. 스토리지
  계정이 제공되면 클러스터와 동일한 리소스 그룹에 있어야 하며
  `skuName`과 `location`은 무시된다.
- `secretNamespace`: Azure 스토리지 계정 이름과 키를 포함한 시크릿의
  네임스페이스. 기본값은 파드와 동일하다.
- `secretName`: Azure 스토리지 계정 이름과 키를 포함한 시크릿의 이름.
  기본값은 `azure-storage-account-<accountName>-secret`이다.
- `readOnly`: 스토리지를 읽기 전용으로 마운트할지 나타내는 플래그.
  기본값은 false이며 읽기/쓰기 마운트를 의미한다. 이 설정은
  볼륨마운트(VolumeMounts)의 `ReadOnly` 설정에도 영향을 준다.

스토리지 프로비저닝 중에 `secretName`으로 이름을 지정한 시크릿이
마운트 자격증명용으로 생성된다. 클러스터에서
[RBAC](/docs/reference/access-authn-authz/rbac/)와
[컨트롤러 롤](/docs/reference/access-authn-authz/rbac/#controller-roles)을 모두 활성화했다면,
클러스터롤(ClusterRole) `system:controller:persistent-volume-binder`에 `secret`
리소스의 `create` 권한을 추가해야 한다.

멀티 테넌시 환경에서는 `secretNamespace` 값을 명시적으로 설정할 것을
강력히 권장하며, 그렇지 않으면 다른 사용자가 스토리지 계정 자격증명을
읽을 수 있기 때문이다.

### Portworx 볼륨 (사용 중단) {#portworx-volume}

{{% code_sample language="yaml" file="storage/storageclass/storageclass-portworx-volume.yaml" %}}

- `fs`: 배치할 파일 시스템: `none/xfs/ext4`(기본값: `ext4`).
- `block_size`: Kbytes 단위의 블록 크기(기본값: `32`).
- `repl`: 레플리케이션 팩터 `1..3`의 형태로 제공될 동기식 레플리카의 수
  (기본값: `1`). 여기에는 `1`이 아닌
  `"1"`과 같은 문자열이 필요하다.
- `priority_io`: 볼륨을 고성능 스토리지에서 생성할지 또는 우선순위가 낮은
  스토리지에서 생성할지 결정한다. 값은 `high/medium/low`이다(기본값: `low`).
- `snap_interval`: 스냅샷을 트리거하는 시각/시간 간격(분).
  스냅샷은 이전 스냅샷과의 차이를 기준으로 증분되며, 0은 스냅샷을
  비활성화한다(기본값: `0`). 여기에는 `70`이 아닌
  `"70"`과 같은 문자열이 필요하다.
- `aggregation_level`: 볼륨이 분산될 청크의 수를 지정하며,
  0은 집계되지 않은 볼륨을 나타낸다(기본값: `0`). 여기에는
  `0`이 아닌 `"0"`과 같은 문자열이 필요하다.
- `ephemeral`: 마운트 해제 후 볼륨을 정리할지 아니면 영구적으로 유지할지
  지정한다. `emptyDir` 유스케이스에서는 이 값을 true로 설정할 수 있고,
  Cassandra 같은 데이터베이스를 위한 `persistent volumes` 유스케이스에서는
  false로 설정해야 한다. `true/false`(기본값 `false`). 여기에는
  `true`가 아닌 `"true"`와 같은 문자열이 필요하다.

### 로컬

{{% code_sample language="yaml" file="storage/storageclass/storageclass-local.yaml" %}}

로컬 볼륨은 쿠버네티스 {{< skew currentVersion >}}에서 동적 프로비저닝을 지원하지 않는다.
하지만 파드가 적절한 노드에 실제로 스케줄링될 때까지 볼륨 바인딩을 지연하려면
스토리지클래스를 생성해야 한다. `WaitForFirstConsumer` 볼륨
바인딩 모드로 이를 지정한다.

볼륨 바인딩을 지연하면 스케줄러가 퍼시스턴트볼륨클레임에 적합한
퍼시스턴트볼륨을 선택할 때 파드의 모든 스케줄링 제약 조건을
고려할 수 있다.
