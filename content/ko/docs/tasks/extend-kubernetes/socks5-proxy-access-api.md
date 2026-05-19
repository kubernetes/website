---
title: SOCKS5 프록시를 사용하여 쿠버네티스 API에 접근
content_type: task
weight: 42
min-kubernetes-server-version: v1.24
---
<!-- overview -->

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

이 문서는 SOCKS5 프록시를 사용하여 원격 쿠버네티스 클러스터의 API에 접근하는 방법을 설명한다.
이 기능은 접근하려는 클러스터의 API를 공용 인터넷에 직접 노출하지 않으려고 할 때 유용하다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

SSH 클라이언트 소프트웨어(`ssh` 도구)와 원격 서버에서 실행되는 SSH 서비스가 필요하다.
원격 서버의 SSH 서비스에 로그인할 수 있어야 한다.

<!-- steps -->

## 작업 내용

{{< note >}}
아래 예시는 SSH 클라이언트 및 서버가 SOCKS 프록시 역할을 하는 SSH를 사용하여 트래픽을 터널링(tunnel)한다.
다른 종류의 [SOCKS5](https://en.wikipedia.org/wiki/SOCKS#SOCKS5) 프록시를 대신 사용할 수 있다.
{{</ note >}}

그림 1은 이 작업에서 달성하고자 하는 목표를 나타낸다.

* 우선 쿠버네티스 API와 통신을 시작하는 로컬 클라이언트 컴퓨터가 있다.
* 쿠버네티스 서버/API는 원격 서버에서 호스팅된다.
* SSH 클라이언트와 서버 소프트웨어를 사용하여 로컬 서버와 원격 서버 간에 보안 SOCKS5 터널을 생성한다.
  클라이언트와 쿠버네티스 API 간의 HTTPS 트래픽은 SOCKS5 터널을 통해 전송되며,
  터널은 SSH를 통해 터널링된다.

{{< mermaid >}}
graph LR;

  subgraph local[로컬 클라이언트 머신]
  client([클라이언트])-- 로컬 <br> 트래픽 .->  local_ssh[로컬 SSH <br> SOCKS5 프록시];
  end
  local_ssh[SSH <br>SOCKS5 <br> 프록시]-- SSH 터널 -->sshd
  
  subgraph remote[원격 서버]
  sshd[SSH <br> 서버]-- 로컬 트래픽 -->service1;
  end
  client([클라이언트])-. 프록시된 HTTPs 트래픽 <br> 프록시를 통과 .->service1[쿠버네티스 API];

  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
  class ingress,service1,service2,pod1,pod2,pod3,pod4 k8s;
  class client plain;
  class cluster cluster;
{{</ mermaid >}}
그림 1. SOCKS5 튜토리얼 구성 요소

## ssh를 사용하여 SOCKS5 프록시 생성하기

아래 커맨드(command)는 클라이언트 컴퓨터와 원격 서버 간에 SOCKS5 프록시를 시작한다.
SOCKS5 프록시를 사용하여 클러스터의 API 서버에 연결할 수 있다.

```shell
# 아래 커맨드를 실행한 후 SSH 터널은 포그라운드(foreground)에서 실행된다.
ssh -D 1080 -q -N username@kubernetes-remote-server.example
```

* `-D 1080`: SOCKS 프록시를 로컬 포트 1080으로 연다.
* `-q`: quiet 모드. 경고 및 진단 메시지 대부분을 표시하지 않는다.
* `-N`: 원격 커맨드를 실행하지 않는다. 포트 포워딩에 유용.
* `username@kubernetes-remote-server.example`: 쿠버네티스 클러스터가 실행 중인 원격 SSH 서버.

## 클라이언트 환경 설정

쿠버네티스 API를 사용하려면
먼저, 클라이언트에게 앞에서 만든 SOCKS5 프록시를 통해 쿼리를 전송하도록 지시해야 한다.

`https_proxy` 환경 변수를 설정하고 실행하는 커맨드를 커맨드라인 툴에 전달한다.

```shell
export https_proxy=socks5h://localhost:1080
```

`https_proxy` 변수를 설정하면 `curl`과 같은 툴은 구성한 프록시를 통해 HTTPS 트래픽을 라우팅한다.
툴이 SOCKS5 프록시를 지원해야 이 기능이 동작한다.

{{< note >}}
URL https://localhost:6443/api에서 `localhost`는 로컬 클라이언트 컴퓨터를 참조하지 않는다.
대신 `localhost`라고 알려진 원격 서버의 엔드포인트(endpoint)를 가리킨다.
`curl` 툴은 호스트 이름을 HTTPS URL에서 SOCKS를 통해 전송하고,
원격 서버는 이것을 로컬(루프백 인터페이스에 속하는 주소)로 처리한다.
{{</ note >}}

```shell
curl -k -v https://localhost:6443/api
```

프록시와 함께 공식 쿠버네티스 클라이언트 `kubectl`을 사용하려면, `~/.kube/config` 파일에서 관련 `cluster` 항목에 대한 `proxy-url` 요소를 설정한다.
예시:

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LRMEMMW2 # 가독성을 위해서 축약함
    server: https://<API_SERVER_IP_ADRESS>:6443  # "쿠버네티스 API" 서버, 쿠버네티스-원격-서버의 IP 주소
    proxy-url: socks5://localhost:1080   # 위 다이어그램의 "SSH SOCKS5 프록시" (SOCKS를 통한 DNS 확인 기능 빌트-인)
  name: default
contexts:
- context:
    cluster: default
    user: default
  name: default
current-context: default
kind: Config
preferences: {}
users:
- name: default
  user:
    client-certificate-data: LS0tLS1CR== # 가독성을 위해서 축약함
    client-key-data: LS0tLS1CRUdJT=      # 가독성을 위해서 축약함
```

터널이 동작 중이고 이 클러스터를 사용하는 컨텍스트에서 `kubectl`을 사용하는 경우 프록시를 통해 클러스터와 상호 작용할 수 있다. 예시:

```shell
kubectl get pods
```

```console
NAMESPACE     NAME                                     READY   STATUS      RESTARTS   AGE
kube-system   coredns-85cb69466-klwq8                  1/1     Running     0          5m46s
```

## 정리하기

SSH 포트 포워딩 프로세스가 실행 중인 터미널에서 `CTRL+C`를 눌러 프로세스를 중지한다.

터미널에 `unset https_proxy`를 입력하여 프록시를 통한 http 트래픽 전송을 중지한다.

## 더 읽어보기

* [OpenSSH 원격 로그인 클라이언트](https://man.openbsd.org/ssh)
