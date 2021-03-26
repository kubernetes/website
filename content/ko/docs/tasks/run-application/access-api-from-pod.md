---
title: 파드 내에서 쿠버네티스 API에 접근
content_type: task
weight: 120
---

<!-- overview -->

이 페이지는 파드 내에서 쿠버네티스 API에 접근하는 방법을 보여준다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## 파드 내에서 API에 접근 {#accessing-the-api-from-within-a-pod}

파드 내에서 API에 접근할 때, API 서버를 찾아 인증하는 것은
위에서 설명한 외부 클라이언트 사례와 약간 다르다.

파드에서 쿠버네티스 API를 사용하는 가장 쉬운 방법은
공식 [클라이언트 라이브러리](/ko/docs/reference/using-api/client-libraries/) 중 하나를 사용하는 것이다. 이러한
라이브러리는 API 서버를 자동으로 감지하고 인증할 수 있다.

### 공식 클라이언트 라이브러리 사용

파드 내에서, 쿠버네티스 API에 연결하는 권장 방법은 다음과 같다.

  - Go 클라이언트의 경우, 공식 [Go 클라이언트 라이브러리](https://github.com/kubernetes/client-go/)를 사용한다.
    `rest.InClusterConfig()` 기능은 API 호스트 검색과 인증을 자동으로 처리한다.
    [여기 예제](https://git.k8s.io/client-go/examples/in-cluster-client-configuration/main.go)를 참고한다.

  - Python 클라이언트의 경우, 공식 [Python 클라이언트 라이브러리](https://github.com/kubernetes-client/python/)를 사용한다.
    `config.load_incluster_config()` 기능은 API 호스트 검색과 인증을 자동으로 처리한다.
    [여기 예제](https://github.com/kubernetes-client/python/blob/master/examples/in_cluster_config.py)를 참고한다.

  - 사용할 수 있는 다른 라이브러리가 많이 있다. [클라이언트 라이브러리](/ko/docs/reference/using-api/client-libraries/) 페이지를 참고한다.

각각의 경우, 파드의 서비스 어카운트 자격 증명은 API 서버와
안전하게 통신하는 데 사용된다.

### REST API에 직접 접근

파드에서 실행되는 동안, 쿠버네티스 apiserver는 `default` 네임스페이스에서 `kubernetes`라는
서비스를 통해 접근할 수 있다. 따라서, 파드는 `kubernetes.default.svc`
호스트 이름을 사용하여 API 서버를 쿼리할 수 있다. 공식 클라이언트 라이브러리는
이를 자동으로 수행한다.

API 서버를 인증하는 권장 방법은 [서비스 어카운트](/docs/tasks/configure-pod-container/configure-service-account/)
자격 증명을 사용하는 것이다. 기본적으로, 파드는
서비스 어카운트와 연결되어 있으며, 해당 서비스 어카운트에 대한 자격 증명(토큰)은
해당 파드에 있는 각 컨테이너의 파일시스템 트리의
`/var/run/secrets/kubernetes.io/serviceaccount/token` 에 있다.

사용 가능한 경우, 인증서 번들은 각 컨테이너의
파일시스템 트리의 `/var/run/secrets/kubernetes.io/serviceaccount/ca.crt` 에 배치되며,
API 서버의 제공 인증서를 확인하는 데 사용해야 한다.

마지막으로, 네임스페이스가 지정된 API 작업에 사용되는 기본 네임스페이스는 각 컨테이너의
`/var/run/secrets/kubernetes.io/serviceaccount/namespace` 에 있는 파일에 배치된다.

### kubectl 프록시 사용

공식 클라이언트 라이브러리 없이 API를 쿼리하려면, 파드에서
새 사이드카 컨테이너의 [명령](/ko/docs/tasks/inject-data-application/define-command-argument-container/)으로
`kubectl proxy` 를 실행할 수 있다. 이런 식으로, `kubectl proxy` 는
API를 인증하고 이를 파드의 `localhost` 인터페이스에 노출시켜서, 파드의
다른 컨테이너가 직접 사용할 수 있도록 한다.

### 프록시를 사용하지 않고 접근

인증 토큰을 API 서버에 직접 전달하여 kubectl 프록시 사용을
피할 수 있다. 내부 인증서는 연결을 보호한다.

```shell
# 내부 API 서버 호스트 이름을 가리킨다
APISERVER=https://kubernetes.default.svc

# 서비스어카운트(ServiceAccount) 토큰 경로
SERVICEACCOUNT=/var/run/secrets/kubernetes.io/serviceaccount

# 이 파드의 네임스페이스를 읽는다
NAMESPACE=$(cat ${SERVICEACCOUNT}/namespace)

# 서비스어카운트 베어러 토큰을 읽는다
TOKEN=$(cat ${SERVICEACCOUNT}/token)

# 내부 인증 기관(CA)을 참조한다
CACERT=${SERVICEACCOUNT}/ca.crt

# TOKEN으로 API를 탐색한다
curl --cacert ${CACERT} --header "Authorization: Bearer ${TOKEN}" -X GET ${APISERVER}/api
```

출력은 다음과 비슷하다.

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
