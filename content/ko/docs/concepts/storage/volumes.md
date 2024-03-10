---
# reviewers:
# - jsafrane
# - saad-ali
# - thockin
# - msau42
title: 볼륨
content_type: concept
weight: 10
---

<!-- overview -->

컨테이너 내의 디스크에 있는 파일은 임시적이며, 컨테이너에서 실행될 때
애플리케이션에 적지 않은 몇 가지 문제가 발생한다. 한 가지 문제는
컨테이너가 크래시될 때 파일이 손실된다는 것이다. kubelet은 컨테이너를 다시 시작하지만
초기화된 상태이다. 두 번째 문제는 `Pod`에서 같이 실행되는 컨테이너간에
파일을 공유할 때 발생한다.
쿠버네티스 {{< glossary_tooltip text="볼륨" term_id="volume" >}} 추상화는
이러한 문제를 모두 해결한다.
[파드](/ko/docs/concepts/workloads/pods/)에 대해 익숙해지는 것을 추천한다.

<!-- body -->

## 배경

도커는 다소 느슨하고, 덜 관리되지만
[볼륨](https://docs.docker.com/storage/)이라는
개념을 가지고 있다. 도커 볼륨은 디스크에 있는 디렉터리이거나
다른 컨테이너에 있다. 도커는 볼륨
드라이버를 제공하지만, 기능이 다소 제한된다.

쿠버네티스는 다양한 유형의 볼륨을 지원한다. {{< glossary_tooltip term_id="pod" text="파드" >}}는
여러 볼륨 유형을 동시에 사용할 수 있다.
임시 볼륨 유형은 파드의 수명을 갖지만, 퍼시스턴트 볼륨은
파드의 수명을 넘어 존재한다. 파드가 더 이상 존재하지 않으면, 쿠버네티스는 임시(ephemeral) 볼륨을 삭제하지만,
퍼시스턴트(persistent) 볼륨은 삭제하지 않는다.
볼륨의 종류와 상관없이, 파드 내의 컨테이너가 재시작되어도 데이터는 보존된다.

기본적으로 볼륨은 디렉터리이며, 일부 데이터가 있을 수 있으며, 파드
내 컨테이너에서 접근할 수 있다. 디렉터리의 생성 방식, 이를 지원하는
매체와 내용은 사용된 특정 볼륨의 유형에 따라
결정된다.

볼륨을 사용하려면, `.spec.volumes` 에서 파드에 제공할 볼륨을 지정하고
`.spec.containers[*].volumeMounts` 의 컨테이너에 해당 볼륨을 마운트할 위치를 선언한다.
컨테이너의 프로세스는 
{{< glossary_tooltip text="컨테이너 이미지" term_id="image" >}}의 최초 내용물과 
컨테이너 안에 마운트된 볼륨(정의된 경우에 한함)으로 구성된 파일시스템을 보게 된다.
프로세스는 컨테이너 이미지의 최초 내용물에 해당되는 루트 파일시스템을 
보게 된다.
쓰기가 허용된 경우, 해당 파일시스템에 쓰기 작업을 하면 
추후 파일시스템에 접근할 때 변경된 내용을 보게 될 것이다.
볼륨은 이미지의 [특정 경로](#using-subpath)에 
마운트된다.
파드에 정의된 각 컨테이너에 대해, 
컨테이너가 사용할 각 볼륨을 어디에 마운트할지 명시해야 한다.

볼륨은 다른 볼륨 안에 마운트될 수 없다 
(하지만, [서브패스 사용](#using-subpath)에서 관련 메커니즘을 확인한다). 
또한, 볼륨은 다른 볼륨에 있는 내용물을 가리키는 하드 링크를 포함할 수 없다.

## 볼륨 유형들 {#volume-types}

쿠버네티스는 여러 유형의 볼륨을 지원한다.

### awsElasticBlockStore (사용 중단됨) {#awselasticblockstore}

{{< feature-state for_k8s_version="v1.17" state="deprecated" >}}

`awsElasticBlockStore` 볼륨은 아마존 웹 서비스 (AWS)
[EBS 볼륨](https://aws.amazon.com/ebs/)을 파드에 마운트 한다. 파드를
제거할 때 지워지는 `emptyDir` 와는 다르게 EBS 볼륨의
내용은 유지되고, 볼륨은 마운트 해제만 된다. 이 의미는 EBS 볼륨에
데이터를 미리 채울 수 있으며, 파드 간에 데이터를 "전달(handed off)"할 수 있다.

{{< note >}}
이를 사용하려면 먼저 `aws ec2 create-volume` 또는 AWS API를 사용해서 EBS 볼륨을 생성해야 한다.
{{< /note >}}

`awsElasticBlockStore` 볼륨을 사용할 때 몇 가지 제한이 있다.

* 파드가 실행 중인 노드는 AWS EC2 인스턴스여야 함
* 이러한 인스턴스는 EBS 볼륨과 동일한 지역과 가용성 영역에 있어야 함
* EBS는 볼륨을 마운트하는 단일 EC2 인스턴스만 지원함

#### AWS EBS 볼륨 생성하기

파드와 함께 EBS 볼륨을 사용하려면, 먼저 EBS 볼륨을 생성해야 한다.

```shell
aws ec2 create-volume --availability-zone=eu-west-1a --size=10 --volume-type=gp2
```

클러스터를 띄운 영역과 생성하는 영역이 일치하는지 확인한다. 크기와 EBS 볼륨 유형이
사용에 적합한지 확인한다.

#### AWS EBS 구성 예시

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-ebs
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-ebs
      name: test-volume
  volumes:
  - name: test-volume
    # 이 AWS EBS 볼륨은 이미 존재해야 한다.
    awsElasticBlockStore:
      volumeID: "<volume-id>"
      fsType: ext4
```

EBS 볼륨이 파티션된 경우, 선택적 필드인 `partition: "<partition number>"` 를 제공하여 마운트할 파티션을 지정할 수 있다.

#### AWS EBS CSI 마이그레이션

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

`awsElasticBlockStore` 의 `CSIMigration` 기능이 활성화된 경우, 기존 인-트리 플러그인의
모든 플러그인 작업을 `ebs.csi.aws.com` 컨테이너 스토리지 인터페이스(CSI)
드라이버로 리디렉션한다. 이 기능을 사용하려면, 클러스터에 [AWS EBS CSI
드라이버](https://github.com/kubernetes-sigs/aws-ebs-csi-driver)를
설치해야 한다.

#### AWS EBS CSI 마이그레이션 완료

{{< feature-state for_k8s_version="v1.17" state="alpha" >}}

컨트롤러 관리자와 kubelet에 의해 로드되지 않도록 `awsElasticBlockStore` 스토리지
플러그인을 끄려면, `InTreePluginAWSUnregister` 플래그를 `true` 로 설정한다.

### azureDisk (사용 중단됨) {#azuredisk}

{{< feature-state for_k8s_version="v1.19" state="deprecated" >}}

`azureDisk` 볼륨 유형은 Microsoft Azure [데이터 디스크](https://docs.microsoft.com/en-us/azure/aks/csi-storage-drivers)를 파드에 마운트한다.

더 자세한 내용은 [`azureDisk` 볼륨 플러그인](https://github.com/kubernetes/examples/tree/master/staging/volumes/azure_disk/README.md)을 참고한다.

#### azureDisk CSI 마이그레이션

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

`azureDisk` 의 `CSIMigration` 기능이 활성화된 경우, 
기존 인-트리 플러그인의 모든 플러그인 작업을 
`disk.csi.azure.com` 컨테이너 스토리지 인터페이스(CSI) 드라이버로 리다이렉트한다. 
이 기능을 사용하려면, 클러스터에 [Azure 디스크 CSI 드라이버](https://github.com/kubernetes-sigs/azuredisk-csi-driver) 를
설치해야 한다.

#### azureDisk CSI 마이그레이션 완료

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

컨트롤러 매니저 및 kubelet이 `azureDisk` 스토리지 플러그인을 로드하지 않도록 하려면, 
`InTreePluginAzureDiskUnregister` 플래그를 `true`로 설정한다.

### azureFile (사용 중단됨) {#azurefile}

{{< feature-state for_k8s_version="v1.21" state="deprecated" >}}

`azureFile` 볼륨 유형은 Microsoft Azure 파일 볼륨(SMB 2.1과 3.0)을 파드에
마운트한다.

더 자세한 내용은 [`azureFile` 볼륨 플러그인](https://github.com/kubernetes/examples/tree/master/staging/volumes/azure_file/README.md)을 참고한다.

#### azureFile CSI 마이그레이션

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

`azureFile` 의 `CSIMigration` 기능이 활성화된 경우, 기존 트리 내 플러그인에서
`file.csi.azure.com` 컨테이너 스토리지 인터페이스(CSI)
드라이버로 모든 플러그인 작업을 수행한다. 이 기능을 사용하려면, 클러스터에 [Azure 파일 CSI
드라이버](https://github.com/kubernetes-sigs/azurefile-csi-driver)
를 설치하고 `CSIMigrationAzureFile`
[기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)를 활성화해야 한다.

Azure File CSI 드라이버는 동일한 볼륨을 다른 fsgroup에서 사용하는 것을 지원하지 않는다. 
Azurefile CSI 마이그레이션이 활성화된 경우, 다른 fsgroup에서 동일한 볼륨을 사용하는 것은 전혀 지원되지 않는다.

#### azureFile CSI 마이그레이션 완료

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

컨트롤러 매니저 및 kubelet이 `azureFile` 스토리지 플러그인을 로드하지 않도록 하려면, 
`InTreePluginAzureFileUnregister` 플래그를 `true`로 설정한다.

### cephfs

`cephfs` 볼륨은 기존 CephFS 볼륨을
파드에 마운트 할 수 있다. 파드를 제거할 때 지워지는 `emptyDir`
와는 다르게 cephfs 볼륨의 내용은 유지되고, 볼륨은 그저 마운트
해제만 된다. 이 의미는 `cephfs` 볼륨에 데이터를 미리 채울 수 있으며,
해당 데이터는 파드 간에 공유될 수 있다. `cephfs` 볼륨은 여러 작성자가
동시에 마운트할 수 있다.

{{< note >}}
CephFS를 사용하기 위해선 먼저 Ceph 서버를 실행하고 공유를 내보내야 한다.
{{< /note >}}

더 자세한 내용은 [CephFS 예시](https://github.com/kubernetes/examples/tree/master/volumes/cephfs/)를 참조한다.

### cinder (사용 중단됨)

{{< feature-state for_k8s_version="v1.18" state="deprecated" >}}

{{< note >}}
쿠버네티스는 오픈스택 클라우드 공급자로 구성되어야 한다.
{{< /note >}}

`cinder` 볼륨 유형은 오픈스택 Cinder 볼륨을 파드에 마운트하는데 사용된다.

#### Cinder 볼륨 구성 예시

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-cinder
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-cinder-container
    volumeMounts:
    - mountPath: /test-cinder
      name: test-volume
  volumes:
  - name: test-volume
    # 이 오픈스택 볼륨은 이미 존재해야 한다.
    cinder:
      volumeID: "<volume id>"
      fsType: ext4
```

#### 오픈스택 CSI 마이그레이션

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Cinder의`CSIMigration` 기능은 Kubernetes 1.21부터 기본적으로 활성화되어 있다.
기존 트리 내 플러그인에서 `cinder.csi.openstack.org` 컨테이너 스토리지 인터페이스(CSI)
드라이버로 모든 플러그인 작업을 수행한다.
[오픈스택 Cinder CSI 드라이버](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/cinder-csi-plugin/using-cinder-csi-plugin.md)가
클러스터에 설치되어 있어야 한다.

컨트롤러 매니저 및 kubelet이 인-트리 Cinder 플러그인을 로드하지 않도록 하려면, 
`InTreePluginOpenStackUnregister` 
[기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)를 활성화한다.

### 컨피그맵(configMap) {#configmap}

[컨피그맵](/docs/tasks/configure-pod-container/configure-pod-configmap/)은
구성 데이터를 파드에 주입하는 방법을 제공한다.
컨피그맵에 저장된 데이터는 `configMap` 유형의 볼륨에서 참조되고
그런 다음에 파드에서 실행되는 컨테이너화된 애플리케이션이 소비한다.

컨피그맵을 참조할 때, 볼륨에 컨피그맵의 이름을
제공한다. 컨피그맵의 특정 항목에 사용할 경로를
사용자 정의할 수 있다. 다음 구성은 `log-config` 컨피그맵을
`configmap-pod` 라 부르는 파드에 마운트하는 방법을 보여준다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-pod
spec:
  containers:
    - name: test
      image: busybox:1.28
      volumeMounts:
        - name: config-vol
          mountPath: /etc/config
  volumes:
    - name: config-vol
      configMap:
        name: log-config
        items:
          - key: log_level
            path: log_level
```

`log-config` 컨피그맵은 볼륨으로 마운트되며, `log_level` 항목에
저장된 모든 컨텐츠는 파드의 `/etc/config/log_level` 경로에 마운트된다.
이 경로는 볼륨의 `mountPath` 와 `log_level` 로 키가 지정된
`path` 에서 파생된다.

{{< note >}}
* [컨피그맵](/docs/tasks/configure-pod-container/configure-pod-configmap/)을 사용하기 위해서는
  먼저 컨피그맵을 생성해야 한다.

* 컨피그맵을 [`subPath`](#using-subpath) 볼륨 마운트로 사용하는 컨테이너는 컨피그맵
업데이트를 수신하지 않는다.

* 텍스트 데이터는 UTF-8 문자 인코딩을 사용하는 파일로 노출된다. 다른 문자 인코딩의 경우, `binaryData` 를 사용한다.
{{< /note >}}

### downwardAPI {#downwardapi}

`downwardAPI` 볼륨은 애플리케이션에서 {{< glossary_tooltip term_id="downward-api" text="다운워드(downward) API" >}}
데이터를 사용할 수 있도록 한다. 볼륨 내에서 노출된 데이터를
일반 텍스트 형식의 읽기 전용 파일로 찾을 수 있다.

{{< note >}}
다운워드 API를 [`subPath`](#using-subpath) 볼륨 마운트로 사용하는 컨테이너는 다운워드 API
업데이트를 수신하지 않는다.
{{< /note >}}

더 자세한 내용은 [다운워드 API 예시](/ko/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)
를 참고한다.

### emptyDir {#emptydir}

`emptyDir` 볼륨은 파드가 노드에 할당될 때 처음 생성되며,
해당 노드에서 파드가 실행되는 동안에만 존재한다. 이름에서 알 수 있듯이
`emptyDir` 볼륨은 처음에는 비어있다. 파드 내 모든 컨테이너는 `emptyDir` 볼륨에서 동일한
파일을 읽고 쓸 수 있지만, 해당 볼륨은 각각의 컨테이너에서 동일하거나
다른 경로에 마운트될 수 있다. 어떤 이유로든 노드에서 파드가 제거되면
`emptyDir` 의 데이터가 영구적으로 삭제된다.

{{< note >}}
컨테이너가 크래시되는 것은 노드에서 파드를 제거하지 *않는다*. `emptyDir` 볼륨의 데이터는
컨테이너 크래시로부터 안전하다.
{{< /note >}}

`emptyDir` 의 일부 용도는 다음과 같다.

* 디스크 기반의 병합 종류와 같은 스크레치 공간
* 충돌로부터 복구하기위해 긴 계산을 검사점으로 지정
* 웹 서버 컨테이너가 데이터를 처리하는 동안 컨텐츠 매니저
  컨테이너가 가져오는 파일을 보관

`emptyDir.medium` 필드는 `emptyDir` 볼륨이 저장되는 곳을 제어한다.
기본 `emptyDir` 볼륨은 환경에 따라
디스크, SSD 또는 네트워크 스토리지와 같이 노드를 지원하는 모든 매체에 저장된다.
`emptyDir.medium` 필드를 `"Memory"`로 설정하면, 쿠버네티스는 tmpfs(RAM 기반 파일시스템)를 대신
마운트한다. tmpfs는 매우 빠르지만, 디스크와 다르게
노드 재부팅시 tmpfs는 마운트 해제되고, 작성하는 모든 파일이
컨테이너 메모리 제한에 포함된다.


`emptyDir` 볼륨의 용량을 제한하는 기본 medium을 위해,
크기 제한을 명시할 수 있다. 스토리지는 [노드 임시
스토리지](/ko/docs/concepts/configuration/manage-resources-containers/#로컬-임시-스토리지에-대한-요청-및-제한-설정)로부터 할당된다.
만약 해당 공간이 다른 소스(예를 들어, 로그 파일이나 이미지 오버레이)에 의해
채워져있다면, `emptyDir`는 지정된 제한 이전에 용량을 다 쓰게 될 수 있다.

{{< note >}}
`SizeMemoryBackedVolumes` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)가 활성화된 경우,
메모리 기반 볼륨의 크기를 지정할 수 있다. 크기를 지정하지 않으면, 메모리
기반 볼륨의 크기는 리눅스 호스트 메모리의 50%로 조정된다.
{{< /note >}}

#### emptyDir 구성 예시

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
  - name: cache-volume
    emptyDir:
      sizeLimit: 500Mi
```

### fc (파이버 채널) {#fc}

`fc` 볼륨 유형은 기존 파이버 채널 블록 스토리지 볼륨을
파드에 마운트할 수 있게 한다. 볼륨 구성에서 `targetWWNs` 파라미터를 사용하여
단일 또는 다중 대상 월드 와이드 이름(WWN)을 지정할 수 있다. 만약 여러 WWN이 지정된 경우,
targetWWN은 해당 WWN이 다중 경로 연결에서 온 것으로 예상한다.

{{< note >}}
이러한 LUN (볼륨)을 할당하고 대상 WWN에 마스킹하도록 FC SAN Zoning을 구성해야만
쿠버네티스 호스트가 해당 LUN에 접근할 수 있다.
{{< /note >}}

더 자세한 내용은 [파이버 채널 예시](https://github.com/kubernetes/examples/tree/master/staging/volumes/fibre_channel)를 참고한다.

### gcePersistentDisk (사용 중단됨) {#gcepersistentdisk}

{{< feature-state for_k8s_version="v1.17" state="deprecated" >}}

`gcePersistentDisk` 볼륨은 구글 컴퓨트 엔진(GCE)
[영구 디스크](https://cloud.google.com/compute/docs/disks)(PD)를 파드에 마운트한다.
파드를 제거할 때 지워지는 `emptyDir` 와는 다르게, PD의 내용은 유지되고,
볼륨은 마운트 해제만 된다. 이는 PD에 데이터를
미리 채울 수 있으며, 파드 간에 데이터를 공유할 수 있다는 것을 의미한다.

{{< note >}}
`gcePersistentDisk` 를 사용하려면 먼저 PD를 `gcloud`, GCE API 또는 UI를 사용해서 생성해야 한다.
{{< /note >}}

`gcePersistentDisk` 를 사용할 때 몇 가지 제한이 있다.

* 파드가 실행 중인 노드는 GCE VM이어야 함
* 이러한 VM은 영구 디스크와 동일한 GCE 프로젝트와 영역에 있어야 함

GCE 영구 디스크의 한 가지 기능은 영구 디스크에 대한 동시 읽기 전용 접근이다.
`gcePersistentDisk` 볼륨을 사용하면 여러 사용자가 영구 디스크를 읽기 전용으로
동시에 마운트할 수 있다. 즉, PD를 데이터 세트로 미리 채운 다음
필요한 만큼 많은 파드에서 병렬로 제공할 수 있다. 불행히도,
PD는 읽기-쓰기 모드에서 단일 사용자만 마운트할 수 있다. 동시
쓰기는 허용되지 않는다.

PD가 읽기 전용이거나 레플리카의 수가 0 또는 1이 아니라면 레플리카셋(ReplicaSet)으로 제어되는
파드가 있는 GCE 영구 디스크를 사용할 수 없다.

#### GCE 영구 디스크 생성하기 {#gce-create-persistent-disk}

GCE 영구 디스크를 파드와 함께 사용하려면, 디스크를 먼저 생성해야 한다.

```shell
gcloud compute disks create --size=500GB --zone=us-central1-a my-data-disk
```

#### GCE 영구 디스크 구성 예시

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-pd
      name: test-volume
  volumes:
  - name: test-volume
    # 이 GCE PD는 이미 존재해야 한다.
    gcePersistentDisk:
      pdName: my-data-disk
      fsType: ext4
```

#### 리전 영구 디스크

[리전 영구 디스크](https://cloud.google.com/compute/docs/disks/#repds)
기능을 사용하면 동일한 영역 내의 두 영역에서 사용할 수 있는 영구 디스크를
생성할 수 있다. 이 기능을 사용하려면 볼륨을 퍼시스턴트볼륨(PersistentVolume)으로
프로비저닝해야 한다. 파드에서 직접 볼륨을 참조하는 것은 지원되지 않는다.

#### 리전 PD 퍼시스턴트볼륨을 수동으로 프로비저닝하기

[GCE PD용 스토리지클래스](/ko/docs/concepts/storage/storage-classes/#gce-pd)를
사용해서 동적 프로비저닝이 가능하다.
퍼시스턴트볼륨을 생성하기 전에 영구 디스크를 생성해야만 한다.

```shell
gcloud compute disks create --size=500GB my-data-disk
  --region us-central1
  --replica-zones us-central1-a,us-central1-b
```

#### 리전 영구 디스크 구성 예시

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: test-volume
spec:
  capacity:
    storage: 400Gi
  accessModes:
  - ReadWriteOnce
  gcePersistentDisk:
    pdName: my-data-disk
    fsType: ext4
      nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        # 1.21 이전 버전에서는 failure-domain.beta.kubernetes.io/zone 키를 사용해야 한다.
        - key: topology.kubernetes.io/zone
          operator: In
          values:
          - us-central1-a
          - us-central1-b
```

#### GCE CSI 마이그레이션

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

GCE PD의 `CSIMigration` 기능이 활성화된 경우 기존 인-트리 플러그인에서
`pd.csi.storage.gke.io` 컨테이너 스토리지 인터페이스(CSI)
드라이버로 모든 플러그인 작업을 리디렉션한다. 이 기능을 사용하려면, 클러스터에 [GCE PD CSI
드라이버](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver)
를 설치해야 한다.

#### GCE CSI 마이그레이션 완료

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

컨트롤러 매니저와 kubelet이 `gcePersistentDisk` 스토리지 플러그인을 로드하는 것을 방지하려면, 
`InTreePluginGCEUnregister` 플래그를 `true`로 설정한다.

### gitRepo (사용 중단됨) {#gitrepo}

{{< warning >}}
`gitRepo` 볼륨 유형은 사용 중단되었다. git repo가 있는 컨테이너를 프로비전 하려면 초기화 컨테이너(InitContainer)에 [EmptyDir](#emptydir)을 마운트하고, 여기에 git을 사용해서 repo를 복제하고, [EmptyDir](#emptydir)을 파드 컨테이너에 마운트 한다.
{{< /warning >}}

`gitRepo` 볼륨은 볼륨 플러그인의 예시이다. 이 플러그인은
빈 디렉터리를 마운트하고 파드가 사용할 수 있도록 이 디렉터리에 git 리포지터리를
복제한다.

여기 `gitRepo` 볼륨의 예시가 있다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: server
spec:
  containers:
  - image: nginx
    name: nginx
    volumeMounts:
    - mountPath: /mypath
      name: git-volume
  volumes:
  - name: git-volume
    gitRepo:
      repository: "git@somewhere:me/my-git-repository.git"
      revision: "22f1d8406d464b0c0874075539c1f2e96c253775"
```
### glusterfs (제거됨) {#glusterfs}

<!-- maintenance note: OK to remove all mention of glusterfs once the v1.25 release of
Kubernetes has gone out of support -->
-
쿠버네티스 {{< skew currentVersion >}} 는 `glusterfs` 볼륨 타입을 포함하지 않는다.

GlusterFS 인-트리 스토리지 드라이버는 쿠버네티스 1.25에서 사용 중단되었고
v1.26 릴리즈에서 완전히 제거되었다.

### hostPath {#hostpath}

{{< warning >}}
HostPath 볼륨에는 많은 보안 위험이 있으며, 가능하면 HostPath를 사용하지 않는 
것이 좋다. HostPath 볼륨을 사용해야 하는 경우, 필요한 파일 또는 디렉터리로만 
범위를 지정하고 ReadOnly로 마운트해야 한다.

AdmissionPolicy를 사용하여 특정 디렉터리로의 HostPath 액세스를 제한하는 경우,
`readOnly` 마운트를 사용하는 정책이 유효하려면 `volumeMounts` 가 반드시 지정되어야 한다.
{{< /warning >}}

`hostPath` 볼륨은 호스트 노드의 파일시스템에 있는 파일이나 디렉터리를
파드에 마운트 한다. 이것은 대부분의 파드들이 필요한 것은 아니지만, 일부
애플리케이션에 강력한 탈출구를 제공한다.

예를 들어, `hostPath` 의 일부 용도는 다음과 같다.

* 도커 내부에 접근할 필요가 있는 실행중인 컨테이너. `/var/lib/docker` 를
  `hostPath` 로 이용함
* 컨테이너에서 cAdvisor의 실행. `/sys` 를 `hostPath` 로 이용함
* 파드는 주어진 `hostPath` 를 파드가 실행되기 이전에 있어야 하거나,
  생성해야 하는지 그리고 존재해야 하는 대상을 지정할 수 있도록 허용함

필요한 `path` 속성 외에도, `hostPath` 볼륨에 대한 `type` 을 마음대로 지정할 수 있다.

필드가 `type` 에 지원되는 값은 다음과 같다.

| 값 | 행동 |
|:------|:---------|
| | 빈 문자열 (기본값)은 이전 버전과의 호환성을 위한 것으로, hostPath 볼륨은 마운트 하기 전에 아무런 검사도 수행되지 않는다. |
| `DirectoryOrCreate` | 만약 주어진 경로에 아무것도 없다면, 필요에 따라 Kubelet이 가지고 있는 동일한 그룹과 소유권, 권한을 0755로 설정한 빈 디렉터리를 생성한다. |
| `Directory` | 주어진 경로에 디렉터리가 있어야 함 |
| `FileOrCreate` | 만약 주어진 경로에 아무것도 없다면, 필요에 따라 Kubelet이 가지고 있는 동일한 그룹과 소유권, 권한을 0644로 설정한 빈 파일을 생성한다. |
| `File` | 주어진 경로에 파일이 있어야 함 |
| `Socket` | 주어진 경로에 UNIX 소캣이 있어야 함 |
| `CharDevice` | 주어진 경로에 문자 디바이스가 있어야 함 |
| `BlockDevice` | 주어진 경로에 블록 디바이스가 있어야 함 |

다음과 같은 이유로 이 유형의 볼륨 사용시 주의해야 한다.

* HostPath는 권한있는 시스템 자격 증명 (예 : Kubelet 용) 또는 권한있는 API 
  (예 : 컨테이너 런타임 소켓)를 노출 할 수 있으며, 이는 컨테이너 이스케이프 또는 
  클러스터의 다른 부분을 공격하는 데 사용될 수 있다.
* 동일한 구성(파드템플릿으로 생성한 것과 같은)을
  가진 파드는 노드에 있는 파일이 다르기 때문에 노드마다 다르게 동작할 수 있다.
* 기본 호스트에 생성된 파일 또는 디렉터리는 root만 쓸 수 있다.
  프로세스를 [특권을 가진(privileged) 컨테이너](/docs/tasks/configure-pod-container/security-context/)에서
  루트로 실행하거나
  `hostPath` 볼륨에 쓸 수 있도록 호스트의 파일 권한을 수정해야 한다.

#### hostPath 구성 예시

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-pd
      name: test-volume
  volumes:
  - name: test-volume
    hostPath:
      # 호스트의 디렉터리 위치
      path: /data
      # 이 필드는 선택 사항이다
      type: Directory
```

{{< caution >}}
`FileOrCreate` 모드는 파일의 상위 디렉터리를 생성하지 않는다. 마운트된 파일의 상위 디렉터리가
없으면 파드가 시작되지 않는다. 이 모드가 작동하는지 확인하려면,
[`FileOrCreate` 구성](#hostpath-fileorcreate-example)에 표시된대로
디렉터리와 파일을 별도로 마운트할 수 있다.
{{< /caution >}}

#### hostPath FileOrCreate 구성 예시 {#hostpath-fileorcreate-example}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-webserver
spec:
  containers:
  - name: test-webserver
    image: registry.k8s.io/test-webserver:latest
    volumeMounts:
    - mountPath: /var/local/aaa
      name: mydir
    - mountPath: /var/local/aaa/1.txt
      name: myfile
  volumes:
  - name: mydir
    hostPath:
      # 파일 디렉터리가 생성되었는지 확인한다.
      path: /var/local/aaa
      type: DirectoryOrCreate
  - name: myfile
    hostPath:
      path: /var/local/aaa/1.txt
      type: FileOrCreate
```

### iscsi

`iscsi` 볼륨을 사용하면 기존 iSCSI (SCSI over IP) 볼륨을 파드에 마운트
할수 있다. 파드를 제거할 때 지워지는 `emptyDir` 와는
다르게 `iscsi` 볼륨의 내용은 유지되고, 볼륨은 그저 마운트
해제만 된다. 이 의미는 iscsi 볼륨에 데이터를 미리 채울 수 있으며,
파드간에 데이터를 공유할 수 있다는 것이다.

{{< note >}}
사용하려면 먼저 iSCSI 서버를 실행하고 볼륨을 생성해야 한다.
{{< /note >}}

iSCSI 특징은 여러 고객이 읽기 전용으로 마운트할 수
있다는 것이다. 즉, 데이터셋으로 사전에 볼륨을 채운다음,
필요한 만큼 많은 파드에서 병렬로 제공할 수 있다. 불행하게도,
iSCSI 볼륨은 읽기-쓰기 모드에서는 단일 고객만 마운트할 수 있다.
동시 쓰기는 허용되지 않는다.

더 자세한 내용은 [iSCSI 예시](https://github.com/kubernetes/examples/tree/master/volumes/iscsi)를 본다.

### local

`local` 볼륨은 디스크, 파티션 또는 디렉터리 같은 마운트된 로컬 스토리지
장치를 나타낸다.

로컬 볼륨은 정적으로 생성된 퍼시스턴트볼륨으로만 사용할 수 있다. 동적으로
프로비저닝된 것은 지원되지 않는다.

`hostPath` 볼륨에 비해 `local` 볼륨은 수동으로 파드를 노드에 예약하지 않고도
내구성과 휴대성을 갖춘 방식으로 사용된다. 시스템은
퍼시스턴트볼륨의 노드 어피니티를 확인하여 볼륨의 노드 제약 조건을 인식한다.

그러나 `local` 볼륨은 여전히 기본 노드의 가용성을 따르며
모든 애플리케이션에 적합하지는 않는다. 만약 노드가 비정상 상태가
되면 `local` 볼륨도 접근할 수 없게 되고, 파드를 실행할 수
없게 된다. `local` 볼륨을 사용하는 애플리케이션은 기본 디스크의
내구 특성에 따라 이러한 감소되는 가용성과 데이터
손실 가능성도 허용할 수 있어야 한다.

다음의 예시는 `local` 볼륨과 `nodeAffinity` 를 사용하는 퍼시스턴트볼륨을
보여준다.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: example-pv
spec:
  capacity:
    storage: 100Gi
  volumeMode: Filesystem
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Delete
  storageClassName: local-storage
  local:
    path: /mnt/disks/ssd1
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - example-node
```

`local` 볼륨을 사용하는 경우 퍼시스턴트볼륨 `nodeAffinity` 를 설정해야 합니다.
쿠버네티스 스케줄러는 퍼시스턴트볼륨 `nodeAffinity` 를 사용하여
파드를 올바른 노드로 스케줄한다.

퍼시스턴트볼륨의 `volumeMode` 을 "Block" (기본값인 "Filesystem"을
대신해서)으로 설정하면 로컬 볼륨을 원시 블록 장치로 노출할 수 있다.

로컬 볼륨을 사용할 때는 `volumeBindingMode` 가 `WaitForFirstConsumer` 로 설정된
스토리지클래스(StorageClass)를 생성하는 것을 권장한다. 자세한 내용은
local [스토리지클래스(StorageClas)](/ko/docs/concepts/storage/storage-classes/#local) 예제를 참고한다.
볼륨 바인딩을 지연시키는 것은 퍼시스턴트볼륨클래임 바인딩 결정도
노드 리소스 요구사항, 노드 셀렉터, 파드 어피니티 그리고 파드 안티 어피니티와
같이 파드가 가질 수 있는 다른 노드 제약 조건으로 평가되도록 만든다.

로컬 볼륨 라이프사이클의 향상된 관리를 위해 외부 정적
프로비저너를 별도로 실행할 수 있다. 이 프로비저너는 아직 동적
프로비저닝을 지원하지 않는 것을 참고한다. 외부 로컬 프로비저너를 실행하는 방법에 대한
예시는 [로컬 볼륨 프로비저너 사용자
가이드](https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner)를 본다.

{{< note >}}
로컬 정적 프로비저너를 사용해서 볼륨 라이프사이클을 관리하지 않는
경우 로컬 퍼시스턴트볼륨을 수동으로 정리하고 삭제하는 것이
필요하다.
{{< /note >}}

### nfs

`nfs` 볼륨을 사용하면 기존 NFS (네트워크 파일 시스템) 볼륨을 파드에 마운트
할수 있다. 파드를 제거할 때 지워지는 `emptyDir` 와는
다르게 `nfs` 볼륨의 내용은 유지되고, 볼륨은 그저 마운트
해제만 된다. 이 의미는 NFS 볼륨에 데이터를 미리 채울 수 있으며,
파드 간에 데이터를 공유할 수 있다는 뜻이다. NFS는 여러 작성자가
동시에 마운트할 수 있다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /my-nfs-data
      name: test-volume
  volumes:
  - name: test-volume
    nfs:
      server: my-nfs-server.example.com
      path: /my-nfs-volume
      readOnly: true
```

{{< note >}}
사용하려면 먼저 NFS 서버를 실행하고 공유를 내보내야 한다.

또한 파드 스펙에 NFS 마운트 옵션을 명시할 수 없음을 기억하라. 마운트 옵션을 서버에서 설정하거나, [/etc/nfsmount.conf](https://man7.org/linux/man-pages/man5/nfsmount.conf.5.html)를 사용해야 한다. 마운트 옵션을 설정할 수 있게 허용하는 퍼시스턴트볼륨을 통해 NFS 볼륨을 마운트할 수도 있다.
{{< /note >}}

퍼시스턴트볼륨을 사용하여 NFS 볼륨을 마운트하는 예제는 [NFS 예시](https://github.com/kubernetes/examples/tree/master/staging/volumes/nfs)를 본다.

### persistentVolumeClaim {#persistentvolumeclaim}

`persistentVolumeClaim` 볼륨은
[퍼시스턴트볼륨](/ko/docs/concepts/storage/persistent-volumes)을 파드에 마운트하는데 사용한다. 퍼시스턴트볼륨클레임은
사용자가 특정 클라우드 환경의 세부 내용을 몰라도 내구성이있는 스토리지 (GCE 퍼시스턴트디스크 또는
iSCSI 볼륨와 같은)를 "클레임" 할 수 있는 방법이다.

더 자세한 내용은 [퍼시스턴트볼륨 예시](/ko/docs/concepts/storage/persistent-volumes)를
본다.

### portworxVolume (사용 중단됨) {#portworxvolume}

{{< feature-state for_k8s_version="v1.25" state="deprecated" >}}

`portworxVolume` 은 쿠버네티스와 하이퍼컨버지드(hyperconverged)를 실행하는 탄력적인 블록 스토리지
계층이다. [Portworx](https://portworx.com/use-case/kubernetes-storage/)는 서버의
스토리지를 핑거프린팅하고(fingerprints), 기능에 기반하여 계층화하고, 그리고 여러 서버에 걸쳐 용량을 집계한다.
Portworx는 가상 머신 내 게스트 또는 베어 메탈 리눅스 노드 위에서 실행된다.

`portworxVolume` 은 쿠버네티스를 통해 동적으로 생성되거나
사전에 프로비전할 수 있으며 쿠버네티스 파드 내에서 참조할 수 있다.
다음은 사전에 프로비저닝된 Portworx 볼륨을 참조하는 파드의 예시이다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-portworx-volume-pod
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /mnt
      name: pxvol
  volumes:
  - name: pxvol
    # 이 Portworx 볼륨은 이미 존재해야 한다.
    portworxVolume:
      volumeID: "pxvol"
      fsType: "<fs-type>"
```

{{< note >}}
파드에서 사용하기 이전에 먼저 이름이 `pxvol` 인 PortworxVolume이
있는지 확인한다.
{{< /note >}}

자세한 내용은 [Portworx 볼륨](https://github.com/kubernetes/examples/tree/master/staging/volumes/portworx/README.md) 예제를 참고한다.

#### Portworx CSI 마이그레이션
{{< feature-state for_k8s_version="v1.25" state="beta" >}}

Portworx를 위한 `CSIMigration` 기능이 쿠버네티스 1.23에 추가되었지만 알파 상태이기 때문에 기본적으로는 비활성화되어 있었다.
v1.25 이후 이 기능은 베타 상태가 되었지만 여전히 기본적으로는 비활성화되어 있다.
이 기능은 사용 중인 트리 내(in-tree) 플러그인의 모든 동작을
`pxd.portworx.com` CSI 드라이버로 리다이렉트한다.
이 기능을 사용하려면, 클러스터에 [Portworx CSI 드라이버](https://docs.portworx.com/portworx-install-with-kubernetes/storage-operations/csi/)가
설치되어 있어야 한다.
이 기능을 활성화시키기 위해서는 kube-controller-manager와 kubelet에 `CSIMigrationPortworx=true`를 설정해야 한다.

### projected

`Projected` 볼륨은 여러 기존 볼륨 소스를 동일한 디렉터리에 매핑한다.
더 자세한 사항은 [projected volumes](/ko/docs/concepts/storage/projected-volumes/)를 참고한다.

### rbd

`rbd` 볼륨을 사용하면
[Rados Block Device](https://docs.ceph.com/en/latest/rbd/)(RBD) 볼륨을 파드에 마운트할 수
있다. 파드를 제거할 때 지워지는 `emptyDir` 와는 다르게 `rbd` 볼륨의
내용은 유지되고, 볼륨은 마운트 해제만 된다. 이
의미는 RBD 볼륨에 데이터를 미리 채울 수 있으며, 데이터를
공유할 수 있다는 것이다.

{{< note >}}
RBD를 사용하기 위해선 먼저 Ceph를 설치하고 실행해야 한다.
{{< /note >}}

RBD의 특징은 여러 고객이 동시에 읽기 전용으로 마운트할 수
있다는 것이다. 즉, 데이터셋으로 볼륨을 미리 채운 다음, 필요한
만큼 많은 파드에서 병렬로 제공할수 있다. 불행하게도,
RBD는 읽기-쓰기 모드에서 단일 고객만 마운트할 수 있다.
동시 쓰기는 허용되지 않는다.

더 자세한 내용은 [RBD 예시](https://github.com/kubernetes/examples/tree/master/volumes/rbd)를
참고한다.

#### RBD CSI 마이그레이션 {#rbd-csi-migration}

{{< feature-state for_k8s_version="v1.23" state="alpha" >}}

`RBD`를 위한 `CSIMigration` 기능이 활성화되어 있으면, 
사용 중이 트리 내(in-tree) 플러그인의 모든 플러그인 동작을 
`rbd.csi.ceph.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} 
드라이버로 리다이렉트한다. 
이 기능을 사용하려면, 클러스터에 
[Ceph CSI 드라이버](https://github.com/ceph/ceph-csi)가 설치되어 있고 
`csiMigrationRBD` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)가
활성화되어 있어야 한다. (v1.24 릴리즈에서 `csiMigrationRBD` 플래그는 삭제되었으며
`CSIMigrationRBD`로 대체되었음에 주의한다.)

{{< note >}}

스토리지를 관리하는 쿠버네티스 클러스터 관리자는, 
RBD CSI 드라이버로의 마이그레이션을 시도하기 전에 
다음의 선행 사항을 완료해야 한다.

* 쿠버네티스 클러스터에 Ceph CSI 드라이버 (`rbd.csi.ceph.com`) v3.5.0 
  이상을 설치해야 한다.
* CSI 드라이버가 동작하기 위해 `clusterID` 필드가 필수이지만 
  트리 내(in-tree) 스토리지클래스는 `monitors` 필드가 필수임을 감안하여, 
  쿠버네티스 저장소 관리자는 monitors 값의 
  해시(예: `#echo -n '<monitors_string>' | md5sum`) 
  기반으로 clusterID를 CSI 컨피그맵 내에 만들고 
  이 clusterID 환경 설정 아래에 monitors 필드를 유지해야 한다.
* 또한, 트리 내(in-tree) 스토리지클래스의 
  `adminId` 값이 `admin`이 아니면, 트리 내(in-tree) 스토리지클래스의 
  `adminSecretName` 값이 `adminId` 파라미터 값의 
  base64 값으로 패치되어야 하며, 아니면 이 단계를 건너뛸 수 있다. {{< /note >}}

### secret

`secret` 볼륨은 암호와 같은 민감한 정보를 파드에 전달하는데
사용된다. 쿠버네티스 API에 시크릿을 저장하고 쿠버네티스에 직접적으로 연결하지 않고도
파드에서 사용할 수 있도록 파일로 마운트 할 수 있다. `secret` 볼륨은
tmpfs(RAM 기반 파일시스템)로 지원되기 때문에 비 휘발성 스토리지에 절대
기록되지 않는다.

{{< note >}}
사용하기 위해선 먼저 쿠버네티스 API에서 시크릿을 생성해야 한다.
{{< /note >}}

{{< note >}}
시크릿을 [`subPath`](#using-subpath) 볼륨 마운트로 사용하는 컨테이너는 시크릿
업데이트를 수신하지 못한다.
{{< /note >}}

더 자세한 내용은 [시크릿 구성하기](/ko/docs/concepts/configuration/secret/)를 참고한다.

### vsphereVolume (사용 중단됨) {#vspherevolume}

{{< note >}}
이 드라이버 대신 외부(out-of-tree) vSphere CSI 드라이버를 사용하는 것을 권장한다.
{{< /note >}}

`vsphereVolume` 은 vSphere VMDK 볼륨을 파드에 마운트하는데 사용된다.  볼륨을
마운트 해제해도 볼륨의 내용이 유지된다. VMFS와 VSAM 데이터스토어를 모두 지원한다.

더 자세한 내용은 [vSphere 볼륨](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere) 예제를 참고한다.

#### vSphere CSI 마이그레이션 {#vsphere-csi-migration}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

쿠버네티스 {{< skew currentVersion >}}에서, 인-트리 `vsphereVolume` 타입을 위한 모든 작업은
`csi.vsphere.vmware.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} 드라이버로 리다이렉트된다.

[vSphere CSI 드라이버](https://github.com/kubernetes-sigs/vsphere-csi-driver)가
클러스터에 설치되어 있어야 한다. 인-트리 `vsphereVolume` 마이그레이션에 대한 추가 조언은 VMware의 문서 페이지
[인-트리 vSphere 볼륨을 vSphere 컨테이너 스토리지 플러그인으로 마이그레이션하기](https://docs.vmware.com/en/VMware-vSphere-Container-Storage-Plug-in/2.0/vmware-vsphere-csp-getting-started/GUID-968D421F-D464-4E22-8127-6CB9FF54423F.html)를 참고한다.
vSphere CSI 드라이버가 설치되어있지 않다면 볼륨 작업은 인-트리 `vsphereVolume` 타입으로 생성된 PV에서 수행될 수 없다.

vSphere CSI 드라이버로 마이그레이션하기 위해서는 vSphere 7.0u2 이상을 사용해야 한다.

v{{< skew currentVersion >}} 외의 쿠버네티스 버전을 사용 중인 경우, 
해당 쿠버네티스 버전의 문서를 참고한다. 


{{< note >}}
빌트인 `vsphereVolume` 플러그인의 다음 스토리지클래스 파라미터는 vSphere CSI 드라이버에서 지원되지 않는다.

* `diskformat`
* `hostfailurestotolerate`
* `forceprovisioning`
* `cachereservation`
* `diskstripes`
* `objectspacereservation`
* `iopslimit`

이러한 파라미터를 사용하여 생성된 기존 볼륨은 vSphere CSI 드라이버로 마이그레이션되지만,
vSphere CSI 드라이버에서 생성된 새 볼륨은 이러한 파라미터를 따르지 않는다.
{{< /note >}}

#### vSphere CSI 마이그레이션 완료 {#vsphere-csi-migration-complete}

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

`vsphereVolume` 플러그인이 컨트롤러 관리자와 kubelet에 의해 로드되지 않도록 기능을 비활성화하려면, `InTreePluginvSphereUnregister` 기능 플래그를 `true` 로 설정해야 한다. 이를 위해서는 모든 워커 노드에 `csi.vsphere.vmware.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} 드라이버를 설치해야 한다.

## subPath 사용하기 {#using-subpath}

때로는 단일 파드에서 여러 용도의 한 볼륨을 공유하는 것이 유용하다.
`volumeMounts[*].subPath` 속성을 사용해서 root 대신 참조하는 볼륨 내의 하위 경로를
지정할 수 있다.

다음의 예시는 단일 공유 볼륨을 사용하여 LAMP 스택(리눅스 Apache MySQL PHP)이
있는 파드를 구성하는 방법을 보여준다. 이 샘플 `subPath` 구성은 프로덕션 용도로
권장되지 않는다.

PHP 애플리케이션의 코드와 자산은 볼륨의 `html` 폴더에 매핑되고
MySQL 데이터베이스는 볼륨의 `mysql` 폴더에 저장된다. 예를 들면 다음과 같다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-lamp-site
spec:
    containers:
    - name: mysql
      image: mysql
      env:
      - name: MYSQL_ROOT_PASSWORD
        value: "rootpasswd"
      volumeMounts:
      - mountPath: /var/lib/mysql
        name: site-data
        subPath: mysql
    - name: php
      image: php:7.0-apache
      volumeMounts:
      - mountPath: /var/www/html
        name: site-data
        subPath: html
    volumes:
    - name: site-data
      persistentVolumeClaim:
        claimName: my-lamp-site-data
```

### subPath를 확장된 환경 변수와 함께 사용하기 {#using-subpath-expanded-environment}

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

`subPathExpr` 필드를 사용해서 다운워드 API 환경 변수로부터
`subPath` 디렉터리 이름을 구성한다.
`subPath` 와 `subPathExpr` 속성은 상호 배타적이다.

이 예제는 `Pod` 가 `subPathExpr` 을 사용해서 `hostPath` 볼륨
`/var/log/pods` 내에 `pod1` 디렉터리를 만든다.
`hostPath` 볼륨은 `downwardAPI` 에서 `Pod` 이름을 사용한다.
호스트 디렉토리 `/var/log/pods/pod1` 은 컨테이너의 `/logs` 에 마운트된다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod1
spec:
  containers:
  - name: container1
    env:
    - name: POD_NAME
      valueFrom:
        fieldRef:
          apiVersion: v1
          fieldPath: metadata.name
    image: busybox:1.28
    command: [ "sh", "-c", "while [ true ]; do echo 'Hello'; sleep 10; done | tee -a /logs/hello.txt" ]
    volumeMounts:
    - name: workdir1
      mountPath: /logs
      # 변수 확장에는 괄호를 사용한다(중괄호 아님).
      subPathExpr: $(POD_NAME)
  restartPolicy: Never
  volumes:
  - name: workdir1
    hostPath:
      path: /var/log/pods
```

## 리소스

`emptyDir` 볼륨의 스토리지 매체(디스크나 SSD와 같은)는 kubelet root
디렉터리(보통 `/var/lib/kubelet`)를 보유한 파일시스템의
매체에 의해 결정 된다. `emptyDir` 또는 `hostPath` 볼륨이
사용할 수 있는 공간의 크기는 제한이 없으며, 컨테이너 간 또는 파드 간 격리는
없다.

리소스 사양을 사용한 공간 요청에 대한 자세한 내용은
[리소스 관리 방법](/ko/docs/concepts/configuration/manage-resources-containers/)을 참고한다.

## 아웃-오브-트리(out-of-tree) 볼륨 플러그인

아웃-오브-트리 볼륨 플러그인에는
{{< glossary_tooltip text="컨테이너 스토리지 인터페이스" term_id="csi" >}}(CSI) 그리고 FlexVolume(사용 중단됨)이 포함된다. 이러한 플러그인을 사용하면 스토리지 벤더들은 플러그인 소스 코드를 쿠버네티스 리포지터리에
추가하지 않고도 사용자 정의 스토리지 플러그인을 만들 수 있다.

이전에는 모든 볼륨 플러그인이 "인-트리(in-tree)"에 있었다. "인-트리" 플러그인은 쿠버네티스 핵심 바이너리와
함께 빌드, 링크, 컴파일 및 배포되었다. 즉, 쿠버네티스(볼륨 플러그인)에
새로운 스토리지 시스템을 추가하려면 쿠버네티스 핵심 코드 리포지터리의 코드 확인이 필요했음을 의미한다.

CSI와 FlexVolume을 통해 쿠버네티스 코드 베이스와는
독립적으로 볼륨 플러그인을 개발하고, 쿠버네티스 클러스터의 확장으로 배포(설치)
할 수 있다.

아웃 오브 트리(out-of-tree) 볼륨 플러그인을 생성하려는 스토리지 벤더는
[볼륨 플러그인 FAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md)를 참조한다.

### csi

[컨테이너 스토리지 인터페이스](https://github.com/container-storage-interface/spec/blob/master/spec.md)(CSI)는
컨테이너 오케스트레이션 시스템(쿠버네티스와 같은)을 위한 표준 인터페이스를
정의하여 임의의 스토리지 시스템을 컨테이너 워크로드에 노출시킨다.

더 자세한 정보는 [CSI 디자인 제안](https://git.k8s.io/design-proposals-archive/storage/container-storage-interface.md)을 읽어본다.

{{< note >}}
CSI 규격 버전 0.2와 0.3에 대한 지원은 쿠버네티스 v1.13에서 사용중단(deprecated)
되었고, 향후 릴리스에서 제거될 예정이다.
{{< /note >}}

{{< note >}}
CSI 드라이버는 일부 쿠버네티스 릴리스에서 호환되지 않을 수 있다.
각각의 쿠버네티스 릴리스와 호환성 매트릭스에 대해 지원되는
배포 단계는 특정 CSI 드라이버 문서를 참조한다.
{{< /note >}}

CSI 호환 볼륨 드라이버가 쿠버네티스 클러스터에 배포되면
사용자는 `csi` 볼륨 유형을 사용해서 CSI 드라이버에 의해 노출된 볼륨에 연결하거나
마운트할 수 있다.

`csi` 볼륨은 세 가지 방법으로 파드에서 사용할 수 있다.

* [퍼시스턴트볼륨클레임](#persistentvolumeclaim)에 대한 참조를 통해서
* [일반 임시 볼륨](/ko/docs/concepts/storage/ephemeral-volumes/#generic-ephemeral-volumes)과 함께
* 드라이버가 지원하는 경우 [CSI 임시 볼륨](/ko/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes)과 함께

스토리지 관리자가 다음 필드를 사용해서 CSI 퍼시스턴트 볼륨을
구성할 수 있다.

* `driver`: 사용할 볼륨 드라이버의 이름을 지정하는 문자열 값.
  이 값은 [CSI 사양](https://github.com/container-storage-interface/spec/blob/master/spec.md#getplugininfo)에
  정의된 CSI 드라이버가 `GetPluginInfoResponse` 에 반환하는 값과 일치해야 한다.
  쿠버네티스에서 호출할 CSI 드라이버를 식별하고, CSI 드라이버 컴포넌트에서
  CSI 드라이버에 속하는 PV 오브젝트를 식별하는데 사용한다.
* `volumeHandle`: 볼륨을 식별하게 하는 고유한 문자열 값.
  이 값은 [CSI 사양](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume)에
  정의된 CSI 드라이버가 `CreateVolumeResponse` 의 `volume.id` 필드에 반환하는 값과 일치해야 한다.
  이 값은 볼륨을 참조할 때 CSI 볼륨 드라이버에 대한 모든 호출에
  `volume_id` 값을 전달한다.
* `readOnly`: 볼륨을 읽기 전용으로 "ControllerPublished" (연결)할지
  여부를 나타내는 선택적인 불리언(boolean) 값. 기본적으로 false 이다. 이 값은
  `ControllerPublishVolumeRequest` 의 `readonly` 필드를
  통해 CSI 드라이버로 전달된다.
* `fsType`: 만약 PV의 `VolumeMode` 가 `Filesystem` 인 경우에 이 필드는
  볼륨을 마운트하는 데 사용해야 하는 파일시스템을 지정하는 데 사용될 수 있다. 만약
  볼륨이 포맷되지 않았고 포맷이 지원되는 경우, 이 값은
  볼륨을 포맷하는데 사용된다.
  이 값은 `ControllerPublishVolumeRequest`, `NodeStageVolumeRequest`
  그리고 `NodePublishVolumeRequest` 의 `VolumeCapability`
  필드를 통해 CSI 드라이버로 전달된다.
* `volumeAttributes`: 볼륨의 정적 속성을 지정하는 문자열과 문자열을
  매핑한다. 이 매핑은 [CSI 사양](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume)에
  정의된 대로 CSI 드라이버의 `CreateVolumeResponse` 와 `volume.attributes`
  필드에서 반환되는 매핑과 일치해야 한다.
  이 매핑은 `ControllerPublishVolumeRequest`, `NodeStageVolumeRequest`,
  그리고 `NodePublishVolumeRequest` 의 `volume_context` 필드를
  통해 CSI 드라이버로 전달된다.
* `controllerPublishSecretRef`: CSI의 `ControllerPublishVolume`
  그리고 `ControllerUnpublishVolume` 호출을 완료하기 위해 CSI 드라이버에 전달하려는
  민감한 정보가 포함된 시크릿 오브젝트에 대한 참조이다. 이 필드는
  선택 사항이며, 시크릿이 필요하지 않은 경우 비어있을 수 있다. 만약 시크릿에
  둘 이상의 시크릿이 포함된 경우에도 모든 시크릿이 전달된다.
`nodeExpandSecretRef`: CSI `NodeExpandVolume` 호출을 완료하기 위해
  CSI 드라이버에 전달하려는 민감한 정보를 포함하고 있는 시크릿에 대한
  참조이다. 이 필드는 선택 사항이며, 시크릿이 필요하지 않은 경우
  비어있을 수 있다. 오브젝트에 둘 이상의 시크릿이 포함된 경우에도, 모든
  시크릿이 전달된다. 노드에 의해 시작된 볼륨 확장을 위한
  시크릿 정보를 설정하면, kubelet은 `NodeExpandVolume()` 호출을 통해 CSI 드라이버에
  해당 데이터를 전달한다. `nodeExpandSecretRef` 필드를 사용하기 위해,
  클러스터는 쿠버네티스 버전 1.25 이상을 실행 중이어야 하며
  모든 노드의 모든 kube-apiserver와 kubelet을 대상으로 `CSINodeExpandSecret`
  [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)를
  활성화해야 한다. 또한 노드에 의해 시작된 스토리지 크기 조정 작업 시 시크릿 정보를 지원하거나 필요로 하는
  CSI 드라이버를 사용해야 한다.
* `nodePublishSecretRef`: CSI의 `NodePublishVolume` 호출을 완료하기 위해
  CSI 드라이버에 전달하려는 민감한 정보가 포함 된 시크릿
  오브젝트에 대한 참조이다. 이 필드는 선택 사항이며, 시크릿이 필요하지 않은
  경우 비어있을 수 있다. 만약 시크릿 오브젝트에 둘 이상의 시크릿이 포함된 경우에도
  모든 시크릿이 전달된다.
* `nodeStageSecretRef`: CSI의 `NodeStageVolume` 호출을 완료하기위해
  CSI 드라이버에 전달하려는 민감한 정보가 포함 된 시크릿
  오브젝트에 대한 참조이다. 이 필드는 선택 사항이며, 시크릿이 필요하지 않은
  경우 비어있을 수 있다. 만약 시크릿에 둘 이상의 시크릿이 포함된 경우에도
  모든 시크릿이 전달된다.

#### CSI 원시(raw) 블록 볼륨 지원

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

외부 CSI 드라이버가 있는 벤더들은 쿠버네티스 워크로드에서 원시(raw) 블록 볼륨
지원을 구현할 수 있다.

CSI 설정 변경 없이 평소와 같이
[원시 블록 볼륨 지원으로 퍼시스턴트볼륨/퍼시스턴트볼륨클레임](/ko/docs/concepts/storage/persistent-volumes/#원시-블록-볼륨-지원) 설정을 할 수 있다.

#### CSI 임시(ephemeral) 볼륨

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

파드 명세 내에서 CSI 볼륨을 직접 구성할 수 있다. 
이 방식으로 지정된 볼륨은 임시 볼륨이며 
파드가 다시 시작할 때 지속되지 않는다. 
자세한 내용은 
[임시 볼륨](/ko/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes)을 참고한다.

CSI 드라이버의 개발 방법에 대한 더 자세한 정보는
[쿠버네티스-csi 문서](https://kubernetes-csi.github.io/docs/)를 참조한다.

#### 윈도우 CSI 프록시

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

CSI 노드 플러그인은 디스크 장치 검색 및 파일 시스템 마운트 같은
다양한 권한이 부여된 작업을 수행해야 한다. 이러한 작업은
호스트 운영 체제마다 다르다. 리눅스 워커 노드의 경우, 일반적으로 컨테이너형
CSI 노드 플러그인은 권한 있는 컨테이너로 배포된다. 윈도우 워커 노드의 경우,
각 윈도우 노드에 미리 설치해야 하는 커뮤니티판 스탠드얼론(stand-alone) 바이너리인
[csi-proxy](https://github.com/kubernetes-csi/csi-proxy)를 이용하여
컨테이너형 CSI 노드 플러그인에 대한 권한 있는 작업을 지원한다.

자세한 내용은 배포할 CSI 플러그인의 배포 가이드를 참고한다.

#### 인-트리 플러그인으로부터 CSI 드라이버로 마이그레이션하기

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

`CSIMigration` 기능은 기존의 인-트리 플러그인에
대한 작업을 해당 CSI 플러그인(설치와 구성이 될 것으로 예상한)으로 유도한다.
결과적으로, 운영자는 인-트리 플러그인을 대체하는
CSI 드라이버로 전환할 때 기존 스토리지 클래스, 퍼시스턴트볼륨 또는 퍼시스턴트볼륨클레임(인-트리 플러그인 참조)에
대한 구성 변경을 수행할 필요가 없다.

지원되는 작업 및 기능은 프로비저닝/삭제,
연결/분리, 마운트/마운트 해제 그리고 볼륨 크기 재조정이 포함된다.

`CSIMigration` 을 지원하고 해당 CSI 드라이버가 구현된 인-트리 플러그인은
[볼륨 유형들](#volume-types)에 나열되어 있다.

다음 인-트리 플러그인은 윈도우 노드에서 퍼시스턴트볼륨을 지원한다.

* [`awsElasticBlockStore`](#awselasticblockstore)
* [`azureDisk`](#azuredisk)
* [`azureFile`](#azurefile)
* [`gcePersistentDisk`](#gcepersistentdisk)
* [`vsphereVolume`](#vspherevolume)

### flexVolume (사용 중단됨)   {#flexvolume}

{{< feature-state for_k8s_version="v1.23" state="deprecated" >}}

FlexVolume은 스토리지 드라이버와 인터페이싱하기 위해 exec 기반 모델을 사용하는 아웃-오브-트리 플러그인 인터페이스이다. 
FlexVolume 드라이버 바이너리 파일은 각 노드의 미리 정의된 볼륨 플러그인 경로에 설치되어야 하며, 
일부 경우에는 컨트롤 플레인 노드에도 설치되어야 한다.

파드는 `flexvolume` 인-트리 볼륨 플러그인을 통해 FlexVolume 드라이버와 상호 작용한다.
더 자세한 내용은 FlexVolume [README](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md#readme) 문서를 참고한다.

호스트에 PowerShell 스크립트로 배포된 다음과 같은
FlexVolume [플러그인](https://github.com/Microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows)은 윈도우 노드를 지원한다.

* [SMB](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~smb.cmd)
* [iSCSI](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~iscsi.cmd)

{{< note >}}
FlexVolume은 사용 중단되었다. 쿠버네티스에 외부 스토리지를 연결하려면 아웃-오브-트리 CSI 드라이버를 사용하는 것을 권장한다.

FlexVolume 드라이버 메인테이너는 CSI 드라이버를 구현하고 사용자들이 FlexVolume 드라이버에서 CSI로 마이그레이트할 수 있도록 지원해야 한다.
FlexVolume 사용자는 워크로드가 동등한 CSI 드라이버를 사용하도록 이전해야 한다.
{{< /note >}}

## 마운트 전파(propagation)

마운트 전파를 통해 컨테이너가 마운트한 볼륨을 동일한 파드의
다른 컨테이너 또는 동일한 노드의 다른 파드로 공유할 수 있다.

볼륨 마운트 전파는 `containers[*].volumeMounts` 의 `mountPropagation` 필드에
의해 제어된다. 그 값은 다음과 같다.

* `None` - 이 볼륨 마운트는 호스트의 볼륨 또는 해당 서브디렉터리에
  마운트된 것을 마운트 이후에 수신하지 않는다.
  비슷한 방식으로, 컨테이너가 생성한 마운트는 호스트에서 볼 수 없다.
  이것이 기본 모드이다.

  이 모드는 [리눅스 커널 문서](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)에
  설명된 `rshared` 마운트 전파와 같다.

* `HostToContainer` - 이 볼륨 마운트는 볼륨 또는 해당
  서브디렉터리를 마운트한 정보를 수신한다.

  다시 말하면, 만약 호스트가 볼륨 마운트 내부에 다른 것을 마운트
  하더라도 컨테이너가 마운트된 것을 볼 수 있다.

  마찬가지로 `Bidirectional` 마운트 전파가 있는 파드가 동일한 마운트가 된 경우에
  파드에 `HostToContainer` 마운트 전파가 있는
  컨테이너가 이를 볼 수 있다.

  이 모드는 [리눅스 커널 문서](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)에
  설명된 `rshared` 마운트 전파와 같다.

* `Bidirectional` - 이 볼륨 마운트는 `HostToContainer` 마운트와 동일하게 작동한다.
  추가로 컨테이너에서 생성된 모든 볼륨 마운트는 동일한 볼륨을
  사용하는 모든 파드의 모든 컨테이너와 호스트로 다시 전파된다.

  이 모드의 일반적인 유스 케이스로는 FlexVolume 또는 CSI 드라이버를 사용하는 파드 또는
  `hostPath` 볼륨을 사용하는 호스트에 무언가를 마운트해야 하는 파드이다.

  이 모드는 [리눅스 커널 문서](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)에
  설명된 `rshared` 마운트 전파와 같다.

{{< warning >}}
`Bidirectional` 마운트 전파는 위험할 수 있다. 이것은
호스트 운영체제를 손상시킬 수 있기에 권한이 있는 컨테이너에서만
허용된다. 리눅스 커널 동작을 숙지하는 것을 권장한다.
또한 파드 내 컨테이너에 의해 생성된 볼륨 마운트는 종료 시
컨테이너에 의해 파괴(마운트 해제)되어야 한다.
{{< /warning >}}

### 구성

일부 배포판(CoreOS, RedHat/Centos, Ubuntu)에서 마운트 전파가
제대로 작동하려면 아래와 같이 도커에서의 마운트 공유를
올바르게 구성해야 한다.

도커의 `systemd` 서비스 파일을 편집한다. `MountFlags` 를 다음과 같이 설정한다.

```shell
MountFlags=shared
```

또는 `MountFlags=slave` 가 있으면 제거한다.  이후 도커 데몬을 재시작 한다.

```shell
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## {{% heading "whatsnext" %}}

[퍼시스턴트 볼륨과 함께 워드프레스와 MySQL 배포하기](/ko/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/)의 예시를 따른다.
