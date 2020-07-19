---
no_issue: true
title: 시작하기
main_menu: true
weight: 20
content_type: concept
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#학습-환경"
    title: 학습 환경
  - anchor: "#운영-환경"
    title: 운영 환경
---

<!-- overview -->

본 섹션에서는 쿠버네티스를 구축하고 실행하는 여러가지 옵션을 다룬다.

각각의 쿠버네티스 솔루션은 유지보수의 용이성, 보안, 제어, 가용 자원, 클러스터를 운영하고 관리하기 위해 필요한 전문성과 같은 제각각의 요구사항을 충족한다.

쿠버네티스 클러스터를 로컬 머신에, 클라우드에, 온-프레미스 데이터센터에 배포할 수 있고, 아니면 매니지드 쿠버네티스 클러스터를 선택할 수도 있다. 넓은 범위의 클라우드 프로바이더에 걸치거나 베어 메탈 환경을 사용하는 커스텀 솔루션을 만들 수도 있다.

더 간단하게 정리하면, 쿠버네티스 클러스터를 학습 환경과 운영 환경에 만들 수 있다.



<!-- body -->

## 학습 환경

쿠버네티스를 배우고 있다면, 쿠버네티스 커뮤니티에서 지원하는 도구나, 로컬 머신에서 쿠버네티스를 설치하기 위한 생태계 내의 도구와 같은 도커 기반의 솔루션을 사용하자.

{{< table caption="쿠버네티스를 배포하기 위해 커뮤니티와 생태계에서 지원하는 도구를 나열한 로컬 머신 솔루션 표." >}}

|커뮤니티              |생태계     |
| ------------       | --------     |
| [Minikube](/ko/docs/setup/learning-environment/minikube/) | [Docker Desktop](https://www.docker.com/products/docker-desktop)|
| [kind (Kubernetes IN Docker)](/docs/setup/learning-environment/kind/) | [Minishift](https://docs.okd.io/latest/minishift/)|
|                     | [MicroK8s](https://microk8s.io/)|


## 운영 환경

운영 환경을 위한 솔루션을 평가할 때에는, 쿠버네티스 클러스터 운영에 대한 어떤 측면(또는 _추상적인 개념_)을 스스로 관리하기를 원하는지, 제공자에게 넘기기를 원하는지 고려하자.

[쿠버네티스 파트너](https://kubernetes.io/partners/#conformance)에는 [공인 쿠버네티스](https://github.com/cncf/k8s-conformance/#certified-kubernetes) 공급자 목록이 포함되어 있다.
