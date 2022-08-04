---
reviewers:
- jingxu97
- mauriciopoppe
- jayunit100
- jsturtevant
- marosset
- aravindhp
title: 윈도우 스토리지
content_type: concept
---

<!-- overview -->

이 페이지에서는 윈도우 운영 체제와 관련된 스토리지 개요를 제공한다.

<!-- body -->

## 퍼시스턴트 스토리지 {#storage}

윈도우에는 컨테이너 레이어를 마운트하고 NTFS를 기반으로 복사본 파일 시스템을 생성하는 
계층화된 파일 시스템 드라이버가 있다. 컨테이너의 모든 파일 경로는 해당 컨테이너의 
컨텍스트 내에서만 확인된다.

* 도커를 사용하는 경우 볼륨 마운트는 개별 파일이 아닌 컨테이너의 디렉토리만을 
  대상으로 할 수 있다. 이 제한은 containerd에 적용되지 않는다.
* 볼륨 마운트는 파일이나 디렉토리를 호스트 파일 시스템에 다시 반영할 수 없다.
* 윈도우 레지스트리 및 SAM 데이터베이스에 대한 쓰기 권한이 항상 요구되므로 
  읽기 전용 파일 시스템은 지원되지 않는다. 그러나 읽기 전용 볼륨은 지원된다.
* 볼륨 사용자 마스크 및 권한은 사용할 수 없다. SAM은 호스트와 컨테이너 사이에 
  공유되지 않기 때문에 둘 사이에 매핑이 없다. 모든 권한은 컨테이너 컨텍스트 
  내에서 확인된다.

결과적으로 다음 스토리지 기능은 윈도우 노드에서 지원되지 않는다.

* 볼륨 하위 경로 마운트: 볼륨 전체로만 윈도우 컨테이너에 마운트할 수 있다.
* 시크릿에 대한 하위 경로 볼륨 마운팅
* 호스트 마운트 프로젝션
* 읽기 전용 루트 파일 시스템(매핑된 볼륨은 여전히 ​​`readOnly`를 지원함)
* 블록 장치 매핑
* 저장 매체로서의 메모리(예: `emptyDir.medium`이 `Memory`로 설정됨)
* uid/gid와 같은 파일 시스템 기능: 사용자별 Linux 파일 시스템 권한
* [DefaultMode를 사용한 시크릿 파일 퍼미션](/ko/docs/concepts/configuration/secret/#시크릿-파일-퍼미션) 설정 (UID/GID 종속성으로 인한)
* NFS 기반 스토리지/볼륨 지원
* 마운트된 볼륨 확장(resizefs)

쿠버네티스 {{< glossary_tooltip text="볼륨" term_id="volume" >}} 은 데이터 
지속성 및 파드 볼륨 공유 요구 사항이 있는 복잡한 애플리케이션을 쿠버네티스에 배포할 
수 있게 한다. 특정 스토리지 백엔드 또는 프로토콜과 관련된 영구 볼륨 관리에는 
볼륨 프로비저닝/디프로비저닝/크기 조정, 쿠버네티스 노드에/에서 볼륨을 연결/분리, 
영구적으로 데이터를 유지해야 하는 파드의 개별 컨테이너에/에서 볼륨을 마운트/마운트 
해제하는 것과 같은 작업이 포함된다. 


볼륨 관리 구성 요소는 쿠버네티스 볼륨 
[플러그인](/ko/docs/concepts/storage/volumes/#volume-types)으로 제공된다.
다음과 같은 광범위한 쿠버네티스 볼륨 플러그인 클래스들이 윈도우에서 지원된다.

* [`FlexVolume 플러그인`](/ko/docs/concepts/storage/volumes/#flexvolume)
  * FlexVolumes는 1.23 버전부터 더 이상 지원되지 않는다.
* [`CSI 플러그인`](/ko/docs/concepts/storage/volumes/#csi)

##### 트리 내 볼륨 플러그인

다음 트리 내 플러그인은 윈도우 노드에서 영구 저장소를 지원한다.

* [`awsElasticBlockStore`](/ko/docs/concepts/storage/volumes/#awselasticblockstore)
* [`azureDisk`](/ko/docs/concepts/storage/volumes/#azuredisk)
* [`azureFile`](/ko/docs/concepts/storage/volumes/#azurefile)
* [`gcePersistentDisk`](/ko/docs/concepts/storage/volumes/#gcepersistentdisk)
* [`vsphereVolume`](/ko/docs/concepts/storage/volumes/#vspherevolume)

