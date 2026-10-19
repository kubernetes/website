---
title: 튜토리얼
main_menu: true
no_list: true
weight: 60
content_type: concept
---

<!-- overview -->

쿠버네티스 문서의 본 섹션은 튜토리얼을 포함하고 있다.
튜토리얼은 개별 [작업](/ko/docs/tasks) 단위보다 더 큰 목표를 달성하기
위한 방법을 보여준다. 일반적으로 튜토리얼은 각각 순차적 단계가 있는 여러
섹션으로 구성된다.
각 튜토리얼을 따라하기 전에, 나중에 참조할 수 있도록
[표준 용어집](/ko/docs/reference/glossary/) 페이지를 북마크하기를 권한다.

<!-- body -->

## 기초

* [쿠버네티스 기초](/ko/docs/tutorials/kubernetes-basics/)는 쿠버네티스 시스템을 이해하는데 도움이 되고 기초적인 쿠버네티스 기능을 일부 사용해 볼 수 있는 심도있는 대화형 튜토리얼이다.
* [Introduction to Kubernetes (edX)](https://www.edx.org/course/introduction-kubernetes-linuxfoundationx-lfs158x#)
* [Hello Minikube](/ko/docs/tutorials/hello-minikube/)

## 구성

* [컨피그 맵을 사용해서 Redis 설정하기](/ko/docs/tutorials/configuration/configure-redis-using-configmap/)

## 파드 생성

* [사이트카 컨테이너 도입](/docs/tutorials/configuration/pod-sidecar-containers/)

## 상태 유지를 하지 않는(stateless) 애플리케이션

* [외부 IP 주소를 노출하여 클러스터의 애플리케이션에 접속하기](/ko/docs/tutorials/stateless-application/expose-external-ip-address/)
* [예시: Redis를 사용한 PHP 방명록 애플리케이션 배포하기](/ko/docs/tutorials/stateless-application/guestbook/)

## 상태 유지가 필요한(stateful) 애플리케이션

* [스테이트풀셋 기본](/ko/docs/tutorials/stateful-application/basic-stateful-set/)
* [예시: WordPress와 MySQL을 퍼시스턴트 볼륨에 배포하기](/ko/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/)
* [예시: 카산드라를 스테이트풀셋으로 배포하기](/ko/docs/tutorials/stateful-application/cassandra/)
* [분산 시스템 코디네이터 ZooKeeper 실행하기](/ko/docs/tutorials/stateful-application/zookeeper/)

## 서비스

* [서비스들로 애플리케이션에 접속하기](/ko/docs/tutorials/services/connect-applications-service/)
* [소스 IP 주소 이용하기](/ko/docs/tutorials/services/source-ip/)

## 보안

* [파드 보안 표준을 클러스터 수준으로 적용하기](/ko/docs/tutorials/security/cluster-level-pss/)
* [파드 보안 표준을 네임스페이스 수준으로 적용하기](/ko/docs/tutorials/security/ns-level-pss/)
* [AppArmor를 사용하여 리소스에 대한 컨테이너의 접근 제한](/ko/docs/tutorials/security/apparmor/)
* [Seccomp](/docs/tutorials/security/seccomp/)

## 클러스터 관리

* [쿠버네티스 노드에 스왑 메모리 설정하기](/docs/tutorials/cluster-management/provision-swap-memory/)
* [단독 모드로 Kubelet 실행하기](/docs/tutorials/cluster-management/kubelet-standalone/)
* [DRA로 드라이버 설치 및 장치 할당하기](/docs/tutorials/cluster-management/install-use-dra/)

## {{% heading "whatsnext" %}}

튜토리얼을 작성하고 싶다면, 튜토리얼 페이지 유형에 대한 정보가 있는
[콘텐츠 페이지 유형](/docs/contribute/style/page-content-types/)
페이지를 참조한다.
