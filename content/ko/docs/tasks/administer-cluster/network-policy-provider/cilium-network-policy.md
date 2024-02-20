---
# reviewers:
# - danwent
# - aanm
title: 네트워크 폴리시로 실리움(Cilium) 사용하기
content_type: task
weight: 20
---

<!-- overview -->
이 페이지는 어떻게 네트워크 폴리시(NetworkPolicy)로 실리움(Cilium)를 사용하는지 살펴본다.

실리움의 배경에 대해서는 [실리움 소개](https://docs.cilium.io/en/stable/overview/intro)를 읽어보자.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->
## 기본 시험을 위해 실리움을 Minikube에 배포하기

실리움에 쉽게 친숙해지기 위해
Minikube에 실리움을 기본적인 데몬셋으로 설치를 수행하는
[실리움 쿠버네티스 시작하기 안내](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/)를 따라 해볼 수 있다.

Minikube를 시작하려면 최소 버전으로 >= v1.5.2 이 필요하고,
다음의 실행 파라미터로 실행한다.

```shell
minikube version
```
```
minikube version: v1.5.2
```

```shell
minikube start --network-plugin=cni
```

minikube의 경우 CLI 도구를 사용하여 실리움을 설치할 수 있다. 그러기 위해서, 
먼저 다음과 같은 명령을 사용하여 최신 버전의 CLI를 다운로드 한다.

```shell
curl -LO https://github.com/cilium/cilium-cli/releases/latest/download/cilium-linux-amd64.tar.gz
```

이후 다음과 같은 명령을 사용하여 다운받은 파일을 `/usr/local/bin` 디렉토리에 압축을 푼다.

```shell
sudo tar xzvfC cilium-linux-amd64.tar.gz /usr/local/bin
rm cilium-linux-amd64.tar.gz
```

위의 명령을 실행한 후, 이제 다음 명령으로 실리움(Cilium)을 설치할 수 있다.

```shell
cilium install
```

그런 다음 실리움은 자동으로 클러스터를 구성을 감지하고
성공적인 설치를 위해 적절한 구성요소를 만들고 설치한다.
구성요소는 다음과 같다.

- 시크릿 `cilium-ca`의 인증 기관(CA) 및 Hubble (실리움의 관측 가능성 계층)에 대한 인증서.
- 서비스 어카운트.
- 클러스터 롤.
- 컨피그맵.
- 에이전트 데몬셋 및 오퍼레이터 디플로이먼트.

설치 후, `cilium status` 명령으로 실리움 디플로이먼트의 전체 상태를 볼 수 있다.
`status` 명령으로 예상 출력을 참조한다.
[여기](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/#validate-the-installation).

시작하기 안내서의 나머지 부분은 예제 애플리케이션을 이용하여
L3/L4(예, IP 주소 + 포트) 모두의 보안 정책뿐만 아니라 L7(예, HTTP)의 보안 정책을
적용하는 방법을 설명한다.

## 실리움을 실 서비스 용도로 배포하기

실리움을 실 서비스 용도의 배포에 관련한 자세한 방법은
[실리움 쿠버네티스 설치 안내](https://docs.cilium.io/en/stable/concepts/kubernetes/intro/)를 살펴본다.
이 문서는 자세한 요구사항, 방법과
실제 데몬셋 예시를 포함한다.



<!-- discussion -->
## 실리움 구성요소 이해하기

실리움으로 클러스터를 배포하면 파드가 `kube-system` 네임스페이스에 추가된다.
파드의 목록을 보려면 다음을 실행한다.

```shell
kubectl get pods --namespace=kube-system -l k8s-app=cilium
```

다음과 유사한 파드의 목록을 볼 것이다.

```console
NAME           READY   STATUS    RESTARTS   AGE
cilium-kkdhz   1/1     Running   0          3m23s
...
```

`cilium` 파드는 클러스터 각 노드에서 실행되며, 리눅스 BPF를 사용해서
해당 노드의 파드에 대한 트래픽 네트워크 폴리시를 적용한다.



## {{% heading "whatsnext" %}}

클러스터가 동작하면,
실리움으로 쿠버네티스 네트워크 폴리시를 시도하기 위해
[네트워크 폴리시 선언하기](/ko/docs/tasks/administer-cluster/declare-network-policy/)를 따라 할 수 있다.
재미있게 즐기고, 질문이 있다면
[실리움 슬랙 채널](https://cilium.herokuapp.com/)을 이용하여 연락한다.
