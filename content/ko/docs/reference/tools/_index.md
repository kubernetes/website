---
title: 도구
# reviewers:
# - janetkuo
content_type: concept
weight: 150
no_list: true
---

<!-- overview -->
쿠버네티스는 쿠버네티스 시스템으로 작업하는 데 도움이 되는 몇 가지 도구를 포함한다.

<!-- body -->

## crictl

[`crictl`](https://github.com/kubernetes-sigs/cri-tools)은 
{{<glossary_tooltip term_id="cri" text="CRI">}}-호환 컨테이너 런타임의 조사 및 디버깅을 위한 
명령줄 인터페이스이다.

## 대시보드

[`대시보드`](/ko/docs/tasks/access-application-cluster/web-ui-dashboard/)는 
쿠버네티스의 웹기반 유저 인터페이스이며 
컨테이너화된 애플리케이션을 쿠버네티스 클러스터로 배포하고 클러스터 및 클러스터 자원의 문제를 해결하며 관리할 수 있게 해 준다.

## Helm
{{% thirdparty-content single="true" %}}

[Helm](https://helm.sh/)은 사전 구성된 쿠버네티스 리소스 패키지를 관리하기 위한 도구이다.
이 패키지는 _Helm charts_ 라고 알려져 있다.

Helm의 용도

* 쿠버네티스 차트로 배포된 인기있는 소프트웨어를 검색하고 사용
* 쿠버네티스 차트로 나의 애플리케이션을 공유
* 쿠버네티스 애플리케이션의 반복가능한 빌드 및 생성
* 매니페스트 파일의 지능화된 관리
* Helm 패키지의 릴리스 관리

## Kompose

[`Kompose`](https://github.com/kubernetes/kompose)는 도커 컴포즈(Compose) 유저들이 쿠버네티스로 이동하는데 도움이 되는 도구이다.

Kompose의 용도

* 도커 컴포즈 파일을 쿠버네티스 오브젝트로 변환
* 로컬 도커 개발 환경에서 나의 애플리케이션을 쿠버네티스를 통해 관리하도록 이전
* V1 또는 V2 도커 컴포즈 `yaml` 파일 또는 [분산 애플리케이션 번들](https://docs.docker.com/compose/bundles/)을 변환

## Kui

[`Kui`](https://github.com/kubernetes-sigs/kui)는 입력으로 일반적인 `kubectl` 커맨드 라인 요청을 받고
출력으로 그래픽적인 응답을 제공하는 GUI 도구이다.

Kui는 입력으로 일반적인 `kubectl` 커맨드 라인 요청을 받고 출력으로 그래픽적인 응답을 제공한다.
Kui는 ASCII 표 대신 정렬 가능한 표를 GUI로 제공한다.

Kui를 사용하면 다음의 작업이 가능하다.

* 자동으로 생성되어 길이가 긴 리소스 이름을 클릭하여 복사할 수 있다.
* `kubectl` 명령을 입력하면 실행되는 모습을 볼 수 있으며, `kubectl` 보다 더 빠른 경우도 있다.
* {{< glossary_tooltip text="잡" term_id="job">}}을 조회하여
  실행 형상을 워터폴 그림으로 확인한다.
* 탭이 있는 UI를 이용하여 클러스터의 자원을 클릭 동작으로 확인할 수 있다.

## Minikube

[`minikube`](https://minikube.sigs.k8s.io/docs/)는 개발과 테스팅 목적으로
단일 노드 쿠버네티스 클러스터를 로컬 워크스테이션에서
실행하는 도구이다.
