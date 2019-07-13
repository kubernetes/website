---
reviewers:
- janetkuo
title: 도구들
content_template: templates/concept
---

{{% capture overview %}}
쿠버네티스는 쿠버네티스 시스템과 연동하기 위해 여러개의 기본제공 도구를 포함한다.
{{% /capture %}}

{{% capture body %}}
## Kubectl

[`kubectl`](/docs/tasks/tools/install-kubectl/)은 쿠버네티스를 관리하기 위한 커맨드라인 도구이며 쿠버네티스 클러스터 매니저을 제어한다.

## Kubeadm

[`kubeadm`](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)은 쿠버네티스를 관리하기 위한 커맨드라인 도구이며 쉽게 물리적인/클라우드 서버/가상머신 상에서 안전한 쿠버네티스를 프로비저닝한다.          

## Kubefed

[`kubefed`](/docs/tasks/federation/set-up-cluster-federation-kubefed/)는 페더레이션 클러스터들을 관리하는데 도움이 되는 커맨드 라인 도구이다.


## Minikube

[`minikube`](/docs/tasks/tools/install-minikube/)는 단일 노드 쿠버네티스 클러스터를 워크스테이션(개발과 테스팅 목적)에서 구동하는 도구이다.



## Dashboard

[`Dashboard`](/docs/tasks/access-application-cluster/web-ui-dashboard/), 는 쿠버네티스의 웹기반 유저 인터페이스이며 컨테이너 애플리케이션을 쿠버네티스 클러스터로 배포하고 
클러스터 및 클러스터 자원의 문제를 해결하며 관리할 수 있게 해준다.

## Helm

[`Kubernetes Helm`](https://github.com/kubernetes/helm) 사전 구성된 쿠버네티스 리소스들을 관리하기위한 도구이며 
또한 Helm의 쿠버네티스 차트라고도합니다.

Helm 의 사용

* 쿠버네티스 차트로 배포된 인기있는 소프트웨어를 검색하고 사용
* 쿠버네티스 차트로 나의 애플리케이션을 공유
* 쿠버네티스 애플리케이션의 반복가능한 빌드 및 생성
* 매니페스트 파일들의 지능화된 관리
* Helm 패키지들의 릴리즈 관리

## Kompose

[`Kompose`](https://github.com/kubernetes-incubator/kompose) 도커 컴포즈(Docker Compose) 유저들을 쿠버네티스로 마이그레이션하는데 도움이 되는 도구이다.

Kompose 의 사용

* 도커 컴포즈 파일을 쿠버네티스 오브젝트로 변환
* 애플리케이션 개발을 로컬 도커 환경에서 쿠버네티스로 전환
* V1 또는 V2 도커 컴포즈(Docker Compose) `yaml` 파일들 또는 배포가능한 애플리케니션 번들 [분산 애플리케이션 번들](https://docs.docker.com/compose/bundles/) 을 변환
{{% /capture %}}
