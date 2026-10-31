---
title: 학습 환경
content_type: concept
weight: 20
---

<!-- overview -->

쿠버네티스를 배우고 있다면, 실습 환경이 필요할 것이다. 이 페이지에서는 실험하고 배울 수 있는 쿠버네티스 환경을 구성하는 방법에 대한 선택지를 설명한다.

<!-- body -->

## kubectl 설치하기

클러스터 구성 전에, `kubectl` 커맨드라인 도구가 필요하다. 이 도구를 사용하면 쿠버네티스 클러스터와 통신하고 클러스터에 대해 명령을 실행할 수 있다.

설치 방법은 [kubectl 설치 및 설정](/docs/tasks/tools/#kubectl)을 참고한다.

## 로컬 쿠버네티스 환경 구성하기

쿠버네티스를 로컬에서 실행하면 안전하게 배우고 실험할 수 있는 환경이 마련된다. 비용이나 운영 중인 시스템에 미치는 영향을 걱정하지 않고 클러스터를 구성하고 제거할 수 있다.

### kind

[kind](https://kind.sigs.k8s.io/) (Kubernetes IN Docker의 약자)는 도커 컨테이너를 노드로 사용하여 쿠버네티스 클러스터를 실행한다. 가볍고 쿠버네티스 자체를 테스트하기 위해 특별히 설계되었지만, 학습용으로도 훌륭하게 동작한다.

kind를 시작하려면 [kind 빠른 시작](https://kind.sigs.k8s.io/docs/user/quick-start/)을 참고한다.

### minikube

[minikube](https://minikube.sigs.k8s.io/)는 로컬 머신에서 단일 노드 쿠버네티스 클러스터를 실행한다. 여러 컨테이너 런타임을 지원하며 리눅스, 맥OS, 윈도우에서 동작한다.

minikube를 시작하려면 [minikube 시작하기](https://minikube.sigs.k8s.io/docs/start/) 가이드를 참고한다.

### 기타 로컬 옵션

{{% thirdparty-content single="true" %}}

로컬에서 쿠버네티스를 실행할 수 있는 여러 서드파티 도구도 있다. 쿠버네티스에서 이러한 도구를 직접 지원하지는 않지만, 학습 목적에는 잘 맞을 수 있다.

- [도커 데스크톱](https://docs.docker.com/desktop/kubernetes/)은 로컬 쿠버네티스 클러스터를 실행할 수 있다.
- [Podman 데스크톱](https://podman-desktop.io/docs/kubernetes)은 로컬 쿠버네티스 클러스터를 실행할 수 있다.
- [Rancher 데스크톱](https://docs.rancherdesktop.io/)은 데스크톱에서 쿠버네티스를 제공한다.
- [MicroK8s](https://canonical.com/microk8s)는 가벼운 쿠버네티스 클러스터를 실행한다.
- [Red Hat CodeReady Containers(CRC)](https://developers.redhat.com/products/openshift-local)는 로컬에서 최소한의 오픈시프트 클러스터를 실행한다.(오픈시프트는 쿠버네티스 준수(conformant) 제품이다)

설정 방법과 지원에 대해서는 각 도구의 문서를 참고한다.

## 온라인 플레이그라운드 사용하기

{{% thirdparty-content single="true" %}}

온라인 쿠버네티스 플레이그라운드를 사용하면 컴퓨터에 아무것도 설치하지 않고 쿠버네티스를 사용해 볼 수 있다. 이러한 환경은 웹 브라우저에서 실행된다.

- **[Killercoda](https://killercoda.com/kubernetes)** 는 대화형 쿠버네티스 시나리오와 플레이그라운드 환경을 제공한다

이러한 플랫폼은 로컬 설정 없이 빠르게 실험하거나 튜토리얼을 따라 하는 데 유용하다.

## 프로덕션과 유사한 클러스터로 연습하기

프로덕션에 더 가까운 클러스터 구성을 연습하고 싶다면, **kubeadm** 을 사용할 수 있다. kubeadm으로 클러스터를 구성하는 것은 여러 대의 머신(물리 또는 가상)과 세심한 구성이 필요한 고급 작업이다.

프로덕션 환경에 대해 배우려면 [프로덕션 환경](/docs/setup/production-environment/)을 참고한다.

{{< note >}}
프로덕션과 유사한 클러스터를 구성하는 것은 위에서 설명한 학습 환경보다 훨씬 복잡하다. 먼저 kind, minikube 또는 온라인 플레이그라운드로 시작한다.
{{< /note >}}

## {{% heading "whatsnext" %}}

- 첫 애플리케이션을 배포하려면 [Hello Minikube](/docs/tutorials/hello-minikube/) 튜토리얼을 따라 해본다.
- [쿠버네티스 컴포넌트](/docs/concepts/overview/components/)에 대해 배운다.
- [kubectl 명령](/docs/reference/kubectl/)을 살펴본다.
