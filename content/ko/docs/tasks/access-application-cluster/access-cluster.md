---
title: 클러스터 접근
weight: 20
content_type: concept
---

<!-- overview -->

여기에서는 클러스터와 통신을 하는 다양한 방식에 대해서 다룰 것이다.

<!-- body -->

## 처음이라면 kubectl을 사용하여 접근

최초로 쿠버네티스 API에 접근할 때 우리는
쿠버네티스 CLI인 `kubectl`을 사용하는 것을 추천한다.

클러스터에 접근하려면 클러스터의 위치정보를 알아야 하고 클러스터에 접속하기 위한
인증정보를 가져야 한다. 일반적으로 이는 당신이
[Getting started guide](/ko/docs/setup/)를 다 진행했을 때 자동으로 구성되거나,
다른 사람이 클러스터를 구성하고 당신에게 인증정보와 위치정보를 제공할 수도 있다.

kubectl이 인지하는 위치정보와 인증정보는 다음 커맨드로 확인한다.

```shell
kubectl config view
```

[여기](/ko/docs/reference/kubectl/cheatsheet/)에서 
`kubectl` 사용 예시를 볼 수 있으며, 완전한 문서는
[kubectl 레퍼런스](/ko/docs/reference/kubectl/)에서 확인할 수 있다.

## REST API에 직접 접근

kubectl은 apiserver의 위치 파악과 인증을 처리한다.
만약 당신이 curl, wget 또는 웹브라우저와 같은 http 클라이언트로
REST API에 직접 접근하려고 한다면 위치 파악과 인증을 하는 몇 가지 방법이 존재한다.

  - kubectl을 proxy 모드로 실행.
    - 권장하는 접근 방식.
    - 저장된 apiserver 위치를 사용.
    - self-signed 인증서를 사용하여 apiserver의 identity를 검증. MITM은 불가능.
    - apiserver 인증.
    - 앞으로는 클라이언트 측의 지능형 load balancing과 failover가 될 것이다.
  - 직접적으로 http 클라이언트에 위치정보와 인증정보를 제공.
    - 대안적인 접근 방식.
    - proxy 사용과 혼동되는 몇 가지 타입의 클라이언트 코드와 같이 동작한다.
    - MITM로부터 보호를 위해 root 인증서를 당신의 브라우저로 임포트해야 한다.

### kubectl proxy 사용

다음 커맨드는 kubectl을 리버스 프록시(reverse proxy)처럼 동작하는 모드를 실행한다. 이는
apiserver의 위치지정과 인증을 처리한다.
다음과 같이 실행한다.

```shell
kubectl proxy --port=8080
```

상세 내용은 [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands/#proxy)를 참조한다

이후에 당신은 curl, wget, 웹브라우저로 다음과 같이 API를 탐색할 수 있다. localhost는
IPv6 주소 [::1]로도 대체할 수 있다.

```shell
curl http://localhost:8080/api/
```

결괏값은 다음과 같을 것이다.

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```


### kubectl proxy를 사용하지 않음

`kubectl apply` 및 `kubectl describe secret...` 명령과 grep/cut을 활용하여 기본 서비스 어카운트의 토큰을 생성한다.

먼저, 기본 서비스어카운트를 위한 토큰을 요청하는 시크릿을 생성한다.

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: default-token
  annotations:
    kubernetes.io/service-account.name: default
type: kubernetes.io/service-account-token
EOF
```

다음으로, 토큰 컨트롤러가 해당 시크릿에 토큰을 채우기를 기다린다.

```shell
while ! kubectl describe secret default-token | grep -E '^token' >/dev/null; do
  echo "waiting for token..." >&2
  sleep 1
done
```

결과를 캡처하여 생성된 토큰을 사용한다.

```shell
APISERVER=$(kubectl config view --minify | grep server | cut -f 2- -d ":" | tr -d " ")
TOKEN=$(kubectl describe secret default-token | grep -E '^token' | cut -f2 -d':' | tr -d " ")

curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

결과값은 다음과 같을 것이다.

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```

`jsonpath`를 사용한다면 다음과 같다.

```shell
APISERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')
TOKEN=$(kubectl get secret default-token -o jsonpath='{.data.token}' | base64 --decode)

curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

결과값은 다음과 같을 것이다.

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```

위 예제에서는 `--insecure` flag를 사용했다. 이는 MITM 공격을 받을 수 있는 상태로
두는 것이다. kubectl로 클러스터에 접속할 때 저장된 root 인증서와 클라이언트 인증서들을
서버 접속에 사용한다.
(이들은 `~/.kube` 디렉터리에 설치된다.)
일반적으로 self-signed 인증서가 클러스터 인증서로 사용되므로 당신의 http 클라이언트가
root 인증서를 사용하려면 특수한 설정을 필요로 할 것이다.

localhost에서 제공되거나 방화벽으로 보호되는 몇몇 클러스터들에서는 apiserver가 인증을
요구하지 않지만 이는 표준이 아니다.
[API에 대한 접근 제어](/ko/docs/concepts/security/controlling-access)은
클러스터 관리자가 이를 어떻게 구성할 수 있는지를 설명한다.

## API에 프로그래밍 방식으로 접근

쿠버네티스는 공식적으로 [Go](#go-클라이언트)와 [Python](#python-클라이언트)
클라이언트 라이브러리를 지원한다.

### Go 클라이언트

* 라이브러리를 취득하려면 `go get k8s.io/client-go@kubernetes-<kubernetes-version-number>` 커맨드를 실행한다. [INSTALL.md](https://github.com/kubernetes/client-go/blob/master/INSTALL.md#for-the-casual-user)에서 상세한 설치 방법을 알 수 있다. [https://github.com/kubernetes/client-go](https://github.com/kubernetes/client-go#compatibility-matrix)에서 어떤 버젼이 지원되는지 확인할 수 있다.
* client-go 클라이언트 위에 애플리케이션을 작성하자. client-go는 자체적으로 API 오브젝트를 정의하므로 필요하다면 main 레포지터리보다는 client-go에서 API 정의들을 import하기를 바란다. 정확하게 `import "k8s.io/client-go/kubernetes"`로 import하는 것을 예로 들 수 있다.

Go 클라이언트는 apiserver의 위치지정과 인증에 kubectl CLI와 동일하게 [kubeconfig file](/ko/docs/concepts/configuration/organize-cluster-access-kubeconfig/)을 사용할 수 있다.
[예제](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go)를 참고한다.

만약 애플리케이션이 클러스터 내에 파드로 배포되었다면 [다음 장](#파드에서-api-접근)을 참조하기를 바란다.

### Python 클라이언트

Python 클라이언트를 사용하려면 `pip install kubernetes` 커맨드를 실행한다. 설치 옵션에 대한 상세 사항은 [Python Client Library page](https://github.com/kubernetes-client/python)를 참조한다.

Python 클라이언트는 apiserver의 위치지정과 인증에 kubectl CLI와 동일하게 [kubeconfig file](/ko/docs/concepts/configuration/organize-cluster-access-kubeconfig/)을 사용할 수 있다.
[예제](https://github.com/kubernetes-client/python/tree/master/examples)를 참조한다.

### 다른 언어

다른 언어에서 API를 접속하기 위한 [클라이언트 라이브러리들](/ko/docs/reference/using-api/client-libraries/)도 존재한다.
이들이 어떻게 인증하는지는 다른 라이브러리들의 문서를 참조한다.

## 파드에서 API 접근

파드에서 API에 접근하는 경우, 
API 서버를 찾고 인증하는 방식이 약간 다를 수 있다.

더 자세한 내용은 
[파드 내에서 쿠버네티스 API에 접근](/ko/docs/tasks/run-application/access-api-from-pod/)을 참조한다.

## 클러스터에서 실행되는 서비스로 접근

이전 섹션에서는 쿠버네티스 API 서버에 연결하는 방법을 소개하였다. 
쿠버네티스 클러스터에서 실행되는 다른 서비스에 연결하는 방법은 
[클러스터 서비스에 접근](/ko/docs/tasks/access-application-cluster/access-cluster-services/) 페이지를 참조한다.

## redirect 요청하기

redirect 기능은 deprecated되고 제거 되었다. 대신 (아래의) 프록시를 사용하기를 바란다.

## 다양한 프록시들

쿠버네티스를 사용하면서 당신이 접할 수 있는 몇 가지 다른 프록시들이 존재한다.

1.  [kubectl proxy](#rest-api에-직접-접근):

    - 사용자의 데스크탑이나 파드 내에서 실행한다
    - localhost 주소에서 쿠버네티스 apiserver로 프록시한다
    - 프록시하는 클라이언트는 HTTP를 사용한다
    - apiserver의 프록시는 HTTPS를 사용한다
    - apiserver를 위치지정한다
    - 인증 header들을 추가한다

1.  [apiserver proxy](/ko/docs/tasks/access-application-cluster/access-cluster-services/#빌트인-서비스-검색):

    - apiserver 내의 빌트인 bastion이다
    - 다른 방식으로는 연결할 수 없는 클러스터 외부의 사용자를 클러스터 IP로 연결한다
    - apiserver process들 내에서 실행된다
    - 프록시하는 클라이언트는 HTTPS를 사용한다(또는 apiserver가 http로 구성되었다면 http)
    - 타겟으로의 프록시는 가용정보를 사용하는 프록시에 의해서 HTTP 또는 HTTPS를 사용할 수도 있다
    - 노드, 파드, 서비스에 접근하는 데 사용될 수 있다
    - 서비스에 접근하는 데 사용되면 load balacing한다

1.  [kube proxy](/ko/docs/concepts/services-networking/service/#ips-and-vips):

    - 각 노드 상에서 실행된다
    - UDP와 TCP를 프록시한다
    - HTTP를 인지하지 않는다
    - load balancing을 제공한다
    - 서비스에 접근하는 데에만 사용된다

1.  apiserver(s) 전면의 Proxy/Load-balancer:

    - 존재내용과 구현사항은 클러스터 별로 다양하다(예. nginx)
    - 모든 클라이언트와 하나 이상의 apiserver들의 사이에 위치한다
    - apiserver가 여러 대 존재한다면 load balancer로 동작한다

1.  외부 서비스의 Cloud Load Balancer들:

    - Cloud provider들에 의해서 제공된다(예. AWS ELB, Google Cloud Load Balancer)
    - 쿠버네티스 서비스의 타입이 `LoadBalancer`라면 자동으로 생성된다
    - UDP/TCP 만 사용한다
    - cloud provider마다 구현된 내용이 상이하다

일반적으로 쿠버네티스 사용자들은 처음 두 타입이 아닌 다른 방식은 고려할 필요가 없지만 클러스터 관리자는
나머지 타입을 적절하게 구성해줘야 한다.
