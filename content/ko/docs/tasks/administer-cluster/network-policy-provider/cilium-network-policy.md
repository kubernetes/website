---
reviewers:
title: 네트워크 폴리시로 실리움(Cilium) 사용하기
content_template: templates/task
weight: 20
---

{{% capture overview %}}
이 페이지는 어떻게 네트워크 폴리시(NetworkPolicy)로 실리움(Cilium)를 사용하는지 살펴본다.

실리움의 배경에 대해서는 [실리움 소개](https://cilium.readthedocs.io/en/stable/intro)를 읽어보자.
{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}
## 기본 시험을 위해 실리움을 Minikube에 배포하기

실리움에 쉽게 친숙해지기 위해
Minikube에 실리움을 기본적인 데몬셋으로 설치를 수행하는
[실리움 쿠버네티스 시작하기 안내](https://cilium.readthedocs.io/en/stable/gettingstarted/minikube/)를 따라 해볼 수 있다.

Minikube를 시작하려면 최소 버전으로 >= v0.33.1 이 필요하고,
다음의 실행 파라미터로 실행한다.

```shell
minikube version
```
```
minikube version: v0.33.1
```

```shell
minikube start --network-plugin=cni --memory=4096
```

Minikube에서 실리움의 데몬셋 구성과 Minikube에 배포된 etcd 인스턴스로 접속하는데 필요한 구성 뿐만 아니라
RBAC 설정을 포함하는 필요한 구성을
이 간단한 ``올인원`` YAML 파일로 배포할 수 있다.

```shell
kubectl create -f  https://raw.githubusercontent.com/cilium/cilium/v1.5/examples/kubernetes/1.14/cilium-minikube.yaml
```
```
configmap/cilium-config created
daemonset.apps/cilium created
clusterrolebinding.rbac.authorization.k8s.io/cilium created
clusterrole.rbac.authorization.k8s.io/cilium created
serviceaccount/cilium created
```

시작하기 안내서의 나머지 부분은 예제 애플리케이션을 이용하여
L3/L4(예, IP 주소 + 포트) 모두의 보안 정책 뿐만 아니라 L7(예, HTTP)의 보안 정책을
적용하는 방법을 설명한다.

## 실리움을 실 서비스 용도로 배포하기

실리움을 실 서비스 용도의 배포에 관련한 자세한 방법은
[실리움 쿠버네티스 설치 안내](https://cilium.readthedocs.io/en/stable/kubernetes/intro/)를 살펴본다.
이 문서는 자세한 요구사항, 방법과
실제 데몬셋 예시를 포함한다.

{{% /capture %}}

{{% capture discussion %}}
## 실리움 구성요소 이해하기

실리움으로 클러스터를 배포하면 파드가 `kube-system` 네임스페이스에 추가된다.
파드의 목록을 보려면 다음을 실행한다.

```shell
kubectl get pods --namespace=kube-system
```

다음과 유사한 파드의 목록을 볼 것이다.

```console
NAME            READY   STATUS    RESTARTS   AGE
cilium-6rxbd    1/1     Running   0          1m
...
```

알고 있어야 할 두 가지 주요 구성요소는 다음과 같다.

- 먼저는 `cilium` 파드가 클러스터의 각 노드에서 운영되고,
노드의 파드로 보내고/받는 트래픽을 리눅스 BPF를 이용하여 네트워크 폴리시를 적용한다.
- 실 서비스에 배포하는 경우 실리움은 키-값 저장소(예, etcd)를 활용해야 한다.
[실리움 쿠버네티스 설치 안내](https://cilium.readthedocs.io/en/stable/kubernetes/intro/)에서
키-값 저장소를 설치하는 방법과 실리움에서 이를 구성하는 필수 단계를
제공할 것이다.

{{% /capture %}}

{{% capture whatsnext %}}
클러스터가 동작하면,
실리움으로 쿠버네티스 네트워크 폴리시를 시도하기 위해
[네트워크 폴리시 선언하기](/docs/tasks/administer-cluster/declare-network-policy/)를 따라 할 수 있다.
재미있게 즐기고, 질문이 있다면
[실리움 슬랙 채널](https://cilium.herokuapp.com/)을 이용하여 연락한다.
{{% /capture %}}


