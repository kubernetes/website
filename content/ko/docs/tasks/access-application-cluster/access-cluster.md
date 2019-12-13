---
title: 클러스터 액세스
weight: 20
content_template: templates/concept
---

{{% capture overview %}}

여기에서는 클러스터와 통신을 하는 다양한 방식에 대해서 다룰 것이다.

{{% /capture %}}


{{% capture body %}}

## 처음이라면 kubectl을 사용하여 액세스

최초로 쿠버네티스 API에 액세스할 때 우리는 
쿠버네티스 CLI인 `kubectl`을 사용하는 것을 추천한다.

클러스터에 액세스하려면 클러스터의 위치정보를 알아야 하고 클러스터에 접속하기 위한 
인증정보를 가져야 한다. 일반적으로 이는 당신이 
[Getting started guide](/docs/setup/)를 다 진행했을 때 자동으로 구성되거나, 
다른 사람이 클러스터를 구성하고 당신에게 인증정보와 위치정보를 제공할 수도 있다.

kubectl이 인지하는 위치정보와 인증정보는 다음 커맨드로 확인한다.

```shell
kubectl config view
```

많은 [예제들](/docs/user-guide/kubectl-cheatsheet)에서 kubectl을 사용하는 것을 소개하고 있으며 
완전한 문서는 [kubectl manual](/docs/user-guide/kubectl-overview)에서 찾아볼 수 있다.

## REST API에 직접 액세스

kubectl은 apiserver의 위치 파악과 인증을 처리한다. 
만약 당신이 curl, wget 또는 웹브라우저와 같은 http 클라이언트로 
REST API에 직접 액세스하려고 한다면 위치 파악과 인증을 하는 몇 가지 방법이 존재한다.

  - kubectl을 proxy 모드로 실행.
    - 권장하는 접근 방식.
    - 저장된 apiserver 위치를 사용.
    - self-signed 인증서를 사용하여 apiserver의 identity를 검증. MITM은 불가능.
    - apiserver 인증.
    - 앞으로는 클라이언트 측의 지능형 load balancing과 failover가 될 것이다.
  - 직접적으로 http 클라이언트에 위치정보와 인증정보를 제공.
    - 대안적인 접근 방식.
    - proxy 사용과 혼동되는 몇 가지 타입의 클라이언트 code들과 같이 동작한다.
    - MITM로부터 보호를 위해 root 인증서를 당신의 브라우저로 import해야 한다.

### kubectl proxy 사용

다음 커맨드는 kubectl을 reverse proxy처럼 동작하는 모드를 실행한다. 이는 
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
  "versions": [
    "v1"
  ]
}
```


### kubectl proxy를 사용하지 않음

기본 서비스 어카운트의 토큰을 얻어내려면 `kubectl describe secret...`을 grep/cut과 함께 사용한다.

```shell
APISERVER=$(kubectl config view --minify | grep server | cut -f 2- -d ":" | tr -d " ")
SECRET_NAME=$(kubectl get secrets | grep ^default | cut -f1 -d ' ')
TOKEN=$(kubectl describe secret $SECRET_NAME | grep -E '^token' | cut -f2 -d':' | tr -d " ")

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
SECRET_NAME=$(kubectl get serviceaccount default -o jsonpath='{.secrets[0].name}')
TOKEN=$(kubectl get secret $SECRET_NAME -o jsonpath='{.data.token}' | base64 --decode)

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
(이들은 `~/.kube` 디렉토리에 설치된다.) 
일반적으로 self-signed 인증서가 클러스터 인증서로 사용되므로 당신의 http 클라이언트가 
root 인증서를 사용하려면 특수한 설정을 필요로 할 것이다.

localhost에서 제공되거나 방화벽으로 보호되는 몇몇 클러스터들에서는 apiserver가 인증을 
요구하지 않지만 이는 표준이 아니다. 
[Configuring Access to the API](/docs/reference/access-authn-authz/controlling-access/)
는 클러스터 관리자가 이를 어떻게 구성할 수 있는지를 설명한다. 
이 방식들은 미래의 고가용성 지원과 충돌될 수 있다.

## API에 프로그래밍 방식으로 액세스

쿠버네티스는 공식적으로 [Go](#go-클라이언트)와 [Python](#python-클라이언트) 
클라이언트 라이브러리를 지원한다.

### Go 클라이언트

* 라이브러리를 취득하려면 `go get k8s.io/client-go@kubernetes-<kubernetes-version-number>` 커맨드를 실행한다. [INSTALL.md](https://github.com/kubernetes/client-go/blob/master/INSTALL.md#for-the-casual-user)에서 상세한 설치 방법을 알 수 있다. [https://github.com/kubernetes/client-go](https://github.com/kubernetes/client-go#compatibility-matrix)에서 어떤 버젼이 지원되는지 확인할 수 있다.
* client-go 클라이언트 위에 애플리케이션을 작성하자. client-go는 자체적으로 API 오브젝트를 정의하므로 필요하다면 main 레포지터리보다는 client-go에서 API 정의들을 import하기를 바란다. 정확하게 `import "k8s.io/client-go/kubernetes"`로 import하는 것을 예로 들 수 있다.

Go 클라이언트는 apiserver의 위치지정과 인증에 kubectl CLI와 동일하게 [kubeconfig file](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/)을 사용할 수 있다. 
[예제](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go)를 참고한다.

만약 애플리케이션이 클러스터 내에 파드로 배포되었다면 [다음 장](#파드에서-api-액세스)을 참조하기를 바란다.

### Python 클라이언트

Python 클라이언트를 사용하려면 `pip install kubernetes` 커맨드를 실행한다. 설치 옵션에 대한 상세 사항은 [Python Client Library page](https://github.com/kubernetes-client/python)를 참조한다.

Python 클라이언트는 apiserver의 위치지정과 인증에 kubectl CLI와 동일하게 [kubeconfig file](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/)을 사용할 수 있다. 
[예제](https://github.com/kubernetes-client/python/tree/master/examples)를 참조한다.

### 다른 언어

다른 언어에서 API를 접속하기 위한 [클라이언트 라이브러리들](/docs/reference/using-api/client-libraries/)도 존재한다.
이들이 어떻게 인증하는지는 다른 라이브러리들의 문서를 참조한다.

## 파드에서 API 액세스

파드에서 API를 접속한다면 apiserver의 
위치지정과 인증은 다소 다르다.

파드 내에서 apiserver의 위치를 지정하는데 추천하는 방식은 
`kubernetes.default.svc` DNS 네임을 사용하는 것이다. 
이 DNS 네임은 apiserver로 라우팅되는 서비스 IP로 resolve된다.

apiserver 인증에 추천되는 방식은 
[서비스 어카운트](/docs/tasks/configure-pod-container/configure-service-account/) 
인증정보를 사용하는 것이다. kube-system에 의해 파드는 서비스 어카운트와 연계되며 
해당 서비스 어카운트의 인증정보(토큰)은 파드 내 각 컨테이너의 파일시스템 트리의 
`/var/run/secrets/kubernetes.io/serviceaccount/token`에 위치한다.

사용 가능한 경우, 인증서 번들은 각 컨테이너 내 파일시스템 트리의 
`/var/run/secrets/kubernetes.io/serviceaccount/ca.crt`에 위치하며 
apiserver의 인증서 제공을 검증하는데 사용되어야 한다.

마지막으로 네임스페이스 한정의 API 조작에 사용되는 기본 네임스페이스는 각 컨테이터 내의 
`/var/run/secrets/kubernetes.io/serviceaccount/namespace` 파일로 존재한다.

파드 내에서 API에 접근하는데 권장되는 방식은 다음과 같다.

  - 파드의 sidecar 컨테이너 내에서 `kubectl proxy`를 실행하거나, 
    컨테이너 내부에서 백그라운드 프로세스로 실행한다. 
    이는 쿠버네티스 API를 파드의 localhost 인터페이스로 proxy하여 
    해당 파드의 컨테이너 내에 다른 프로세스가 API에 접속할 수 있게 해준다.
  - Go 클라이언트 라이브러리를 이용하여 `rest.InClusterConfig()`와 `kubernetes.NewForConfig()` 함수들을 사용하도록 클라이언트를 만든다. 
    이는 apiserver의 위치지정과 인증을 처리한다. [예제](https://git.k8s.io/client-go/examples/in-cluster-client-configuration/main.go)

각각의 사례에서 apiserver와의 보안 통신에 파드의 인증정보가 사용된다.

## 클러스터에서 실행되는 서비스로 액세스

이전 장은 쿠버네티스 API server 접속에 대한 내용을 다루었다. 이번 장은 
쿠버네티스 클러스터 상에서 실행되는 다른 서비스로의 연결을 다룰 것이다. 쿠버네티스에서 
[노드들](/docs/admin/node), [파드들](/docs/user-guide/pods), [서비스들](/docs/user-guide/services)은 
모두 자신의 IP들을 가진다. 당신의 데스크탑 PC와 같은 클러스터 외부 장비에서는 
클러스터 상의 노드 IP들, 파드 IP들, 서비스 IP들로 라우팅되지 않아서 접근을 
할 수 없을 것이다.

### 통신을 위한 방식들

클러스터 외부에서 노드들, 파드들, 서비스들에 접속하는 데는 몇 가지 선택지들이 있다.

  - 공인 IP를 통해 서비스에 액세스.
    - 클러스터 외부에서 접근할 수 있도록 `NodePort` 또는 `LoadBalancer` 타입의 
      서비스를 사용한다. [서비스](/docs/user-guide/services)와 
      [kubectl expose](/docs/reference/generated/kubectl/kubectl-commands/#expose) 문서를 참조한다.
    - 당신의 클러스터 환경에 따라 회사 네트워크에만 서비스를 노출하거나 
      인터넷으로 노출할 수 있다. 이 경우 노출되는 서비스의 보안 여부를 고려해야 한다. 
      해당 서비스는 자체적으로 인증을 수행하는가?
    - 파드들은 서비스 뒤에 위치시킨다. 레플리카들의 집합에서 특정 파드 하나에 debugging 같은 목적으로 접근하려면 
      해당 파드에 고유의 레이블을 붙이고 셀렉터에 해당 레이블을 선택한 신규 서비스를 생성한다.
    - 대부분의 경우에는 애플리케이션 개발자가 노드 IP를 통해 직접 노드에 
      액세스할 필요는 없다.
  - Proxy Verb를 사용하여 서비스, 노드, 파드에 액세스.
    - 원격 서비스에 액세스하기에 앞서 apiserver의 인증과 인가를 받아야 한다. 
      서비스가 인터넷에 노출하기에 보안이 충분하지 않거나 노드 IP 상의 port에 
      액세스를 취득하려고 하거나 debugging을 하려면 이를 사용한다.
    - 어떤 web 애플리케이션에서는 proxy가 문제를 일으킬 수 있다.
    - HTTP/HTTPS에서만 동작한다.
    - [여기](#수작업으로-apiserver-proxy-url들을-구축)에서 설명하고 있다.
  - 클러스터 내 노드 또는 파드에서 액세스.
    - 파드를 Running시킨 다음 [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec)를 사용하여 해당 파드의 셸로 접속한다. 
      해당 셸에서 다른 노드들, 파드들, 서비스들에 연결한다.
    - 어떤 클러스터는 클러스터 내의 노드에 ssh 접속을 허용하기도 한다. 이런 클러스터에서는 
      클러스터 서비스에 액세스도 가능하다. 이는 비표준 방식으로 특정 클러스터에서는 동작하지만 
      다른 클러스터에서는 동작하지 않을 수 있다. 브라우저와 다른 도구들이 설치되지 않았거나 설치되었을 수 있다. 클러스터 DNS가 동작하지 않을 수도 있다.

### 빌트인 서비스들의 발견

일반적으로 kube-system에 의해 클러스터 상에서 start되는 몇 가지 서비스들이 존재한다. 
`kubectl cluster-info` 커맨드로 이 서비스들의 리스트를 볼 수 있다.

```shell
kubectl cluster-info
```

결괏값은 다음과 같을 것이다.

```
Kubernetes master is running at https://104.197.5.247
elasticsearch-logging is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy
kibana-logging is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/kibana-logging/proxy
kube-dns is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/kube-dns/proxy
grafana is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
heapster is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/monitoring-heapster/proxy
```

이는 각 서비스에 액세스하기 위한 proxy-verb URL을 보여준다. 
예를 들어 위 클러스터는 클러스터 수준의 logging(Elasticsearch 사용)이 활성화되었으므로 적절한 인증을 통과하여 
`https://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/`로 액세스할 수 있다. 예를 들어 kubectl proxy로 
`http://localhost:8080/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/`를 통해 logging에 액세스할 수도 있다.
(인증을 통과하는 방법이나 kubectl proxy를 사용하는 것은 [위 내용](#rest-api에-직접-액세스)을 참조한다.)

#### 수작업으로 apiserver proxy URL을 구축

위에서 언급한 것처럼 서비스의 proxy URL을 검색하는데 `kubectl cluster-info` 커맨드를 사용할 수 있다. 서비스 endpoint, 접미사, 매개변수를 포함하는 proxy URL을 생성하려면 단순하게 해당 서비스에 
`http://`*`kubernetes_master_address`*`/api/v1/namespaces/`*`namespace_name`*`/services/`*`service_name[:port_name]`*`/proxy` 형식의 proxy URL을 덧붙인다.

당신이 port에 이름을 지정하지 않았다면 URL에 *port_name* 을 지정할 필요는 없다.

기본적으로 API server는 http를 사용하여 서비스를 proxy한다. https를 사용하려면 다음과 같이 서비스 네임의 접두사에 `https:`를 붙인다.
`http://`*`kubernetes_master_address`*`/api/v1/namespaces/`*`namespace_name`*`/services/`*`https:service_name:[port_name]`*`/proxy`

URL의 네임 부분에 지원되는 양식은 다음과 같다.

* `<service_name>` - http를 사용하여 기본값 또는 이름이 없는 port로 proxy한다
* `<service_name>:<port_name>` - http를 사용하여 지정된 port로 proxy한다
* `https:<service_name>:` - https를 사용하여 기본값 또는 이름이 없는 port로 proxy한다(마지막 콜론:에 주의)
* `https:<service_name>:<port_name>` - https를 사용하여 지정된 port로 proxy한다

##### 예제들

 * Elasticsearch 서비스 endpoint `_search?q=user:kimchy`에 액세스하려면 `http://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_search?q=user:kimchy`를 사용할 수 있다.
 * Elasticsearch 클러스터 상태 정보 `_cluster/health?pretty=true`에 액세스하려면 `https://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_cluster/health?pretty=true`를 사용할 수 있다.
 
```json
{
  "cluster_name" : "kubernetes_logging",
  "status" : "yellow",
  "timed_out" : false,
  "number_of_nodes" : 1,
  "number_of_data_nodes" : 1,
  "active_primary_shards" : 5,
  "active_shards" : 5,
  "relocating_shards" : 0,
  "initializing_shards" : 0,
  "unassigned_shards" : 5
}
```

### 클러스터 상에서 실행되는 서비스에 웹브라우저를 사용하여 액세스

브라우저의 주소창에 apiserver proxy url을 넣을 수도 있다. 하지만

  - 웹브라우저는 일반적으로 토큰을 전달할 수 없으므로 basic (password) auth를 사용해야 할 것이다. basic auth를 수용할 수 있도록 apiserver를 구성할 수 있지만, 
    당신의 클러스터가 basic auth를 수용할 수 있도록 구성되어 있지 않을 수도 있다.
  - 몇몇 web app은 동작하지 않을 수도 있다. 특히 proxy path prefix를 인식하지 않는 방식으로 url을 
    구성하는 client side javascript를 가진 web app은 동작하지 않을 수 있다.

## 요청 redirect

redirect 기능은 deprecated되고 제거 되었다. 대신 (아래의) proxy를 사용하기를 바란다.

## 다양한 Proxy들

쿠버네티스를 사용하면서 당신이 접할 수 있는 몇 가지 다른 proxy들이 존재한다.

1.  [kubectl proxy](#rest-api에-직접-액세스):

    - 사용자의 데스크탑이나 파드 내에서 실행한다
    - localhost 주소에서 쿠버네티스 apiserver로 proxy한다
    - proxy하는 클라이언트는 HTTP를 사용한다
    - apiserver의 proxy는 HTTPS를 사용한다
    - apiserver를 위치지정한다
    - 인증 header들을 추가한다

1.  [apiserver proxy](#빌트인-서비스들의-발견):

    - apiserver 내의 빌트인 bastion이다
    - 다른 방식으로는 연결할 수 없는 클러스터 외부의 사용자를 클러스터 IP들로 연결한다
    - apiserver process들 내에서 실행된다
    - proxy하는 클라이언트는 HTTPS를 사용한다(또는 apiserver가 http로 구성되었다면 http)
    - 타겟으로의 proxy는 가용정보를 사용하는 proxy에 의해서 HTTP 또는 HTTPS를 사용할 수도 있다
    - 노드, 파드, 서비스에 접근하는 데 사용될 수 있다
    - 서비스에 접근하는 데 사용되면 load balacing한다

1.  [kube proxy](/docs/concepts/services-networking/service/#ips-and-vips):

    - 각 노드 상에서 실행된다
    - UDP와 TCP를 proxy한다
    - HTTP를 인지하지 않는다
    - load balancing을 제공한다
    - 서비스에 접근하는 데만 사용된다

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

{{% /capture %}}
