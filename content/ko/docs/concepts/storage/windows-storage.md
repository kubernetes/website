---
# reviewers:
# - jingxu97
# - mauriciopoppe
# - jayunit100
# - jsturtevant
# - marosset
# - aravindhp
title: 윈도우 스토리지
content_type: concept
weight: 110
---

<!-- overview -->

이 페이지는 윈도우 운영 체제에서의 스토리지 개요를 제공한다.

<!-- body -->

## 퍼시스턴트 스토리지 {#storage}

윈도우는 계층 구조의 파일시스템 드라이버를 사용하여 
컨테이너 레이어를 마운트하고 NTFS 기반 파일시스템의 복제본을 생성한다. 
컨테이너 내의 모든 파일 경로는 해당 컨테이너 컨텍스트 내에서만 인식 가능하다.

* 도커를 사용할 때, 볼륨 마운트는 컨테이너 내의 디렉토리로만 지정할 수 있으며, 개별 파일로는 지정할 수 없다. 
  이 제약 사항은 containerd에는 적용되지 않는다.
* 볼륨 마운트는 파일 또는 디렉토리를 호스트 파일시스템으로 투영(project)할 수 없다.
* 윈도우 레지스트리와 SAM 데이터케이스에 쓰기 권한이 항상 필요하기 때문에, 
  읽기 전용 파일시스템은 지원되지 않는다. 다만, 읽기 전용 볼륨은 지원된다.
* 볼륨 사용자-마스크 및 퍼미션은 사용할 수 있다. 
  호스트와 컨테이너 간에 SAM이 공유되지 않기 때문에, 둘 간의 매핑이 존재하지 않는다. 
  모든 퍼미션은 해당 컨테이너 컨텍스트 내에서만 처리된다.

결과적으로, 윈도우 노드에서는 다음 스토리지 기능이 지원되지 않는다.

* 볼륨 서브패스(subpath) 마운트: 윈도우 컨테이너에는 전체 볼륨만 마운트할 수 있다.
* 시크릿을 위한 서브패스 볼륨 마운팅
* 호스트 마운트 투영(projection)
* 읽기 전용 루트 파일시스템 (매핑된 볼륨은 여전히 `readOnly`를 지원한다)
* 블록 디바이스 매핑
* 메모리를 스토리지 미디어로 사용하기 (예를 들어, `emptyDir.medium`를 `Memory`로 설정하는 경우)
* uid/gid, 사용자 별 리눅스 파일시스템 권한과 같은 파일시스템 기능
* [DefaultMode을 이용하여 시크릿 퍼미션](/ko/docs/concepts/configuration/secret/#시크릿-파일-퍼미션) 설정하기 (UID/GID 의존성 때문에)
* NFS 기반 스토리지/볼륨 지원
* 마운트된 볼륨 확장하기 (resizefs)

쿠버네티스 {{< glossary_tooltip text="볼륨" term_id="volume" >}}을 사용하여 
데이터 지속성(persistence) 및 파드 볼륨 공유 요구 사항이 있는 
복잡한 애플리케이션을 쿠버네티스에 배포할 수 있다. 
특정 스토리지 백엔드 또는 프로토콜과 연관된 퍼시스턴트 볼륨의 관리는 
볼륨 프로비저닝/디프로비저닝/리사이징, 
쿠버네티스 노드로의 볼륨 연결(attaching) 및 해제(detaching), 
데이터를 보존해야 하는 파드 내 개별 컨테이너로의 볼륨 마운트 및 해제 같은 동작을 포함한다.

볼륨 관리 구성 요소는 쿠버네티스 볼륨 
[플러그인](/ko/docs/concepts/storage/volumes/#volume-types) 형태로 제공된다. 
윈도우는 다음의 광역 쿠버네티스 볼륨 플러그인 클래스를 지원한다.

* [`FlexVolume` 플러그인](/ko/docs/concepts/storage/volumes/#flexvolume)
  * FlexVolume은 1.23부터 사용 중단되었음에 유의한다.
* [`CSI` 플러그인](/ko/docs/concepts/storage/volumes/#csi)

##### 인-트리(In-tree) 볼륨 플러그인

다음의 인-트리 플러그인은 윈도우 노드에서의 퍼시스턴트 스토리지를 지원한다.

* [`awsElasticBlockStore`](/ko/docs/concepts/storage/volumes/#awselasticblockstore)
* [`azureDisk`](/ko/docs/concepts/storage/volumes/#azuredisk)
* [`azureFile`](/ko/docs/concepts/storage/volumes/#azurefile)
* [`gcePersistentDisk`](/ko/docs/concepts/storage/volumes/#gcepersistentdisk)
* [`vsphereVolume`](/ko/docs/concepts/storage/volumes/#vspherevolume)
