---
title: 컨테이너 스토리지 인터페이스(CSI)
id: csi
date: 2018-06-25
full_link: /ko/docs/concepts/storage/volumes/#csi
short_description: >
    컨테이너 스토리지 인터페이스(CSI)는 컨테이너에 스토리지 시스템을 노출하는 표준 인터페이스를 정의한다.


aka: 
tags:
- storage 
---
 컨테이너 스토리지 인터페이스(CSI)는 컨테이너에 스토리지 시스템을 노출하는 표준 인터페이스를 정의한다.


<!--more--> 
CSI를 통해 공급업체는 쿠버네티스 저장소(트리 외 플러그인)를 추가하지 않고도 쿠버네티스용 사용자 스토리지 플러그인을 생성할 수 있다. 스토리지 제공자가 CSI 드라이버를 사용하려면, 먼저 [클러스터에 배포](https://kubernetes-csi.github.io/docs/deploying.html)해야 한다. 그런 다음 해당 CSI 드라이버를 사용하는 {{< glossary_tooltip text="스토리지클래스(StorageClass)" term_id="storage-class" >}}를 생성할 수 있다.

* [쿠버네티스 문서에서 CSI](/ko/docs/concepts/storage/volumes/#csi)
* [사용 가능한 CSI 드라이버 목록](https://kubernetes-csi.github.io/docs/drivers.html)
