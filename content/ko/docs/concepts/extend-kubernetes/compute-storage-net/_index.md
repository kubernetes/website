---
title: 컴퓨트, 스토리지 및 네트워킹 익스텐션
weight: 30
no_list: true
---

해당 섹션은 쿠버네티스 자체에 포함되어있지 않지만 클러스터에 설정할 수 있는 익스텐션들에 대해 다룬다.
이러한 익스텐션을 활용하여 클러스터의 노드를 향상시키거나,
파드들을 연결시키는 네트워크 장치를 제공할 수 있다.

* [CSI](/ko/docs/concepts/storage/volumes/#csi) 와 [FlexVolume](/ko/docs/concepts/storage/volumes/#flexvolume) 스토리지 플러그인

  {{< glossary_tooltip text="컨테이너 스토리지 인터페이스" term_id="csi" >}} (CSI) 플러그인은
  새로운 종류의 볼륨을 지원하도록 쿠버네티스를 확장할 수 있게 해준다.
  볼륨은 내구성 높은 외부 스토리지에 연결되거나, 일시적인 스토리지를 제공하거나,
  파일시스템 패러다임을 토대로 정보에 대한 읽기 전용 인터페이스를 제공할 수도 있다.

  또한 쿠버네티스는 (CSI를 권장하며) v1.23부터 사용 중단된 
  [FlexVolume](/ko/docs/concepts/storage/volumes/#flexvolume-deprecated) 플러그인에 대한 지원도 포함한다.

  FlexVolume 플러그인은 쿠버네티스에서 네이티브하게
  지원하지 않는 볼륨 종류도 마운트할 수 있도록 해준다.
  FlexVolume 스토리지에 의존하는 파드를 실행하는 경우 kubelet은 바이너리 플러그인을 호출하여 볼륨을 마운트한다.
  아카이브된 [FlexVolume](https://git.k8s.io/design-proposals-archive/storage/flexvolume-deployment.md)
  디자인 제안은 이러한 접근방법에 대한 자세한 설명을 포함하고 있다.

  스토리지 플러그인에 대한 전반적인 정보는 [스토리지 업체를 위한 쿠버네티스 볼륨 플러그인 FAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors)에서
  찾을 수 있다.

* [장치 플러그인](/ko/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)

  장치 플러그인은 노드에서 (`cpu`와 `memory`와 같은 내장 노드 리소스에서 추가로) 
  새로운 노드 장치(Node facility)를 발견할 수 있게 해주며,
  이러한 커스텀 노드 장치를 요청하는 파드들에게 이를 제공한다.

* [네트워크 플러그인](/ko/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)

  네트워크 플러그인을 통해 쿠버네티스는 다양한 네트워크 토폴로지 및 기술을 활용할 수 있게 된다.
  제대로 동작하는 파드 네트워크을 구성하고 쿠버네티스 네트워크 모델의 다양한 측면을 지원하기 위해
  쿠버네티스 클러스터는 *네트워크 플러그인*을 필요로 한다.

  쿠버네티스 {{< skew currentVersion >}}은 {{< glossary_tooltip text="CNI" term_id="cni" >}}
  네트워크 플러그인들에 호환된다.
