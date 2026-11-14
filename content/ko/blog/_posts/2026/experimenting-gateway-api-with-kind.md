---
layout: blog
title: "kind로 게이트웨이 API 실험하기"
date: 2026-01-28
slug: experimenting-gateway-api-with-kind
evergreen: true
author: >
  [Ricardo Katz](https://github.com/rikatz) (Red Hat)
translator: >
  [Suhyen Im](https://github.com/suhyenim)
---

이 문서는 [kind](https://kind.sigs.k8s.io/) 위에 [게이트웨이 API(Gateway API)](https://gateway-api.sigs.k8s.io/)로 로컬 실험 환경을 구축하는 과정을 안내합니다. 이 환경은 학습과 테스트를 목적으로 합니다. 프로덕션의 복잡함 없이 게이트웨이 API 개념을 이해하는 데 도움이 됩니다.

{{< caution >}}
이것은 실험과 학습을 위한 환경이며, 프로덕션에 사용해서는 안 됩니다. 이 문서에서 사용하는 컴포넌트는 프로덕션 용도에 적합하지 않습니다.
프로덕션 환경에 게이트웨이 API를 배포할 준비가 되었다면,
필요에 맞는 [구현체](https://gateway-api.sigs.k8s.io/implementations/)를 선택합니다.
{{< /caution >}}

## 개요

이 가이드에서는 다음을 진행합니다.
- kind(Kubernetes in Docker)로 로컬 쿠버네티스 클러스터 구축
- LoadBalancer 서비스와 게이트웨이 API 컨트롤러를 모두 제공하는 [cloud-provider-kind](https://github.com/kubernetes-sigs/cloud-provider-kind) 배포
- 데모 애플리케이션으로 트래픽을 라우팅하기 위해 게이트웨이(Gateway)와 HTTP라우트(HTTPRoute) 생성
- 로컬에서 게이트웨이 API 구성 테스트

이 환경은 게이트웨이 API 개념을 다루는 학습, 개발, 실험에 가장 적합합니다.

## 전제 조건

시작하기 전에 로컬 머신에 다음이 설치되어 있는지 확인합니다.

- **[도커](https://docs.docker.com/get-docker/)** - kind와 cloud-provider-kind를 실행하는 데 필요합니다.
- **[kubectl](https://kubernetes.io/docs/tasks/tools/)** - 쿠버네티스 커맨드라인 툴
- **[kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)** - Kubernetes in Docker
- **[curl](https://curl.se/)** - 라우트를 테스트하는 데 필요합니다.

### kind 클러스터 생성

다음을 실행하여 새 kind 클러스터를 생성합니다.

```shell
kind create cluster
```

이 명령은 도커 컨테이너에서 실행되는 단일 노드 쿠버네티스 클러스터를 생성합니다.

### cloud-provider-kind 설치

다음으로, [cloud-provider-kind](https://github.com/kubernetes-sigs/cloud-provider-kind/)가 필요하며, 이 환경의 아래 두 가지 핵심 컴포넌트를 제공합니다.
- LoadBalancer 타입 서비스에 주소를 할당하는 LoadBalancer 컨트롤러
- 게이트웨이 API 명세를 구현하는 게이트웨이 API 컨트롤러

cloud-provider-kind는 또한 클러스터에 게이트웨이 API 커스텀리소스데피니션(CustomResourceDefinition)을 자동으로 설치합니다.

kind 클러스터를 생성한 것과 같은 호스트에서 cloud-provider-kind를 도커 컨테이너로 실행합니다.

```shell
VERSION="$(basename $(curl -s -L -o /dev/null -w '%{url_effective}' https://github.com/kubernetes-sigs/cloud-provider-kind/releases/latest))"
docker run -d --name cloud-provider-kind --rm --network host -v /var/run/docker.sock:/var/run/docker.sock registry.k8s.io/cloud-provider-kind/cloud-controller-manager:${VERSION}
```

**참고:** 일부 시스템에서는 도커 소켓에 접근하기 위해 상위 권한이 필요할 수 있습니다.

cloud-provider-kind가 실행 중인지 확인합니다.

```shell
docker ps --filter name=cloud-provider-kind
```

컨테이너가 목록에 나타나고 실행 중 상태여야 합니다. 로그도 확인할 수 있습니다.

```shell
docker logs cloud-provider-kind
```

## 게이트웨이 API 실험하기

이제 클러스터를 구축했으니 게이트웨이 API 리소스로 실험을 시작할 수 있습니다.

cloud-provider-kind는 `cloud-provider-kind`라는 게이트웨이클래스(GatewayClass)를 자동으로 프로비저닝합니다. 이 클래스를 사용해 게이트웨이를 생성합니다.

kind는 클라우드 제공자가 아니지만, 이 프로젝트가 클라우드가 활성화된 환경을 시뮬레이션하는 기능을 제공하기 때문에 이름이 `cloud-provider-kind`인 점은 눈여겨볼 만합니다.

### 게이트웨이 배포

아래 매니페스트는 다음과 같은 일을 합니다.
- `gateway-infra`라는 새 네임스페이스 생성
- 포트 80에서 수신하는 게이트웨이 배포
- 호스트네임이 `*.exampledomain.example` 패턴과 매칭되는 HTTP라우트 수락
- 모든 네임스페이스의 라우트가 게이트웨이에 연결되도록 허용.
  **참고**: 실제 클러스터에서는 연결을 제한하기 위해 [`allowedRoutes` 네임스페이스 셀렉터](https://gateway-api.sigs.k8s.io/reference/spec/#fromnamespaces) 필드에 Same 또는 Selector 값을 사용하는 편이 좋습니다.

아래 매니페스트를 적용합니다.

```yaml
---
apiVersion: v1
kind: Namespace
metadata:
  name: gateway-infra
---
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: gateway
  namespace: gateway-infra
spec:
  gatewayClassName: cloud-provider-kind
  listeners:
  - name: default
    hostname: "*.exampledomain.example"
    port: 80
    protocol: HTTP
    allowedRoutes:
      namespaces:
        from: All
```

그런 다음 게이트웨이가 정상적으로 프로그래밍(programmed)되었고 주소가 할당되었는지 확인합니다.

```shell
kubectl get gateway -n gateway-infra gateway
```

예상 출력은 다음과 같습니다.
```
NAME      CLASS                 ADDRESS      PROGRAMMED   AGE
gateway   cloud-provider-kind   172.18.0.3   True         5m6s
```

PROGRAMMED 열에는 True가 표시되어야 하고, ADDRESS 필드에는 IP 주소가 들어 있어야 합니다.

### 데모 애플리케이션 배포

다음으로, 게이트웨이 구성을 테스트하는 데 도움이 되는 간단한 에코(echo) 애플리케이션을 배포합니다. 이 애플리케이션은 다음과 같이 동작합니다.
- 포트 3000에서 수신
- 경로, 헤더, 환경 변수를 포함한 요청 세부 정보를 그대로 반환
- `demo`라는 네임스페이스에서 실행

아래 매니페스트를 적용합니다.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: demo
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: echo
  name: echo
  namespace: demo
spec:
  ports:
  - name: http
    port: 3000
    protocol: TCP
    targetPort: 3000
  selector:
    app.kubernetes.io/name: echo
  type: ClusterIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: echo
  name: echo
  namespace: demo
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: echo
  template:
    metadata:
      labels:
        app.kubernetes.io/name: echo
    spec:
      containers:
      - env:
        - name: POD_NAME
          valueFrom:
            fieldRef:
              apiVersion: v1
              fieldPath: metadata.name
        - name: NAMESPACE
          valueFrom:
            fieldRef:
              apiVersion: v1
              fieldPath: metadata.namespace
        image: registry.k8s.io/gateway-api/echo-basic:v20251204-v1.4.1
        name: echo-basic
```

### HTTP라우트 생성

이제 게이트웨이에서 에코 애플리케이션으로 트래픽을 라우팅하기 위해 HTTP라우트를 생성합니다.
이 HTTP라우트는 다음과 같은 일을 합니다.
- 호스트네임 `some.exampledomain.example`에 대한 요청에 응답
- 에코 애플리케이션으로 트래픽 라우팅
- `gateway-infra` 네임스페이스의 게이트웨이에 연결

아래 매니페스트를 적용합니다.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: echo
  namespace: demo
spec:
  parentRefs:
  - name: gateway
    namespace: gateway-infra
  hostnames: ["some.exampledomain.example"]
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /
    backendRefs:
    - name: echo
      port: 3000
```

### 라우트 테스트

마지막 단계는 curl로 라우트를 테스트하는 것입니다. 호스트네임 `some.exampledomain.example`로 게이트웨이의 IP 주소에 요청을 보냅니다. 아래 명령은 POSIX 셸 전용이며, 환경에 맞게 조정해야 할 수 있습니다.

```shell
GW_ADDR=$(kubectl get gateway -n gateway-infra gateway -o jsonpath='{.status.addresses[0].value}')
curl --resolve some.exampledomain.example:80:${GW_ADDR} http://some.exampledomain.example
```

다음과 유사한 JSON 응답을 받게 됩니다.

```json
{
 "path": "/",
 "host": "some.exampledomain.example",
 "method": "GET",
 "proto": "HTTP/1.1",
 "headers": {
  "Accept": [
   "*/*"
  ],
  "User-Agent": [
   "curl/8.15.0"
  ]
 },
 "namespace": "demo",
 "ingress": "",
 "service": "",
 "pod": "echo-dc48d7cf8-vs2df"
}
```

이 응답이 보인다면 축하합니다! 게이트웨이 API 환경이 정상적으로 동작하는 것입니다.

## 문제 해결

무언가 예상대로 동작하지 않으면 리소스 상태를 확인해 문제를 해결할 수 있습니다.

### 게이트웨이 상태 확인

먼저, 게이트웨이 리소스를 살펴봅니다.

```shell
kubectl get gateway -n gateway-infra gateway -o yaml
```

`status` 섹션에서 컨디션을 살펴봅니다. 게이트웨이에는 다음이 있어야 합니다.
- `Accepted: True` - 컨트롤러가 게이트웨이를 수락했습니다.
- `Programmed: True` - 게이트웨이가 정상적으로 구성되었습니다.
- IP 주소가 채워진 `.status.addresses`

### HTTP라우트 상태 확인

다음으로, HTTP라우트를 살펴봅니다.

```shell
kubectl get httproute -n demo echo -o yaml
```

`status.parents` 섹션에서 컨디션을 확인합니다. 흔한 문제로는 다음이 있습니다.

- ResolvedRefs가 `BackendNotFound`라는 이유와 함께 False로 설정됨. 백엔드 서비스가 존재하지 않거나 이름이 잘못되었다는 뜻입니다.
- Accepted가 False로 설정됨. 라우트가 게이트웨이에 연결되지 못했다는 뜻입니다(네임스페이스 권한이나 호스트네임 매칭을 확인합니다).

백엔드를 찾지 못했을 때의 오류 예시는 다음과 같습니다.
```yaml
status:
  parents:
  - conditions:
    - lastTransitionTime: "2026-01-19T17:13:35Z"
      message: backend not found
      observedGeneration: 2
      reason: BackendNotFound
      status: "False"
      type: ResolvedRefs
    controllerName: kind.sigs.k8s.io/gateway-controller
```

### 컨트롤러 로그 확인

리소스 상태로 문제가 드러나지 않으면 cloud-provider-kind 로그를 확인합니다.

```shell
docker logs -f cloud-provider-kind
```

이 명령은 LoadBalancer 컨트롤러와 게이트웨이 API 컨트롤러의 상세 로그를 모두 보여줍니다.

## 정리하기

실험을 마쳤으면 다음과 같이 리소스를 정리할 수 있습니다.

### 쿠버네티스 리소스 제거

네임스페이스를 삭제합니다(이렇게 하면 그 안의 모든 리소스가 제거됩니다).

```shell
kubectl delete namespace gateway-infra
kubectl delete namespace demo
```

### cloud-provider-kind 중지

cloud-provider-kind 컨테이너를 중지하고 제거합니다.

```shell
docker stop cloud-provider-kind
```

컨테이너를 `--rm` 플래그로 시작했기 때문에 중지하면 자동으로 제거됩니다.

### kind 클러스터 삭제

마지막으로, kind 클러스터를 삭제합니다.

```shell
kind delete cluster
```

## 다음 단계

로컬에서 게이트웨이 API를 실험해 봤으니 이제 프로덕션 준비가 된 구현체를 다음과 같이 살펴볼 준비가 되었습니다.

- **프로덕션 배포**: [게이트웨이 API 구현체](https://gateway-api.sigs.k8s.io/implementations/)를 검토해 프로덕션 요구 사항에 맞는 컨트롤러를 찾아보세요.
- **더 알아보기**: [게이트웨이 API 문서](https://gateway-api.sigs.k8s.io/)를 살펴보며 TLS, 트래픽 분할, 헤더 조작 같은 고급 기능을 알아보세요.
- **고급 라우팅**: [게이트웨이 API 사용자 가이드](https://gateway-api.sigs.k8s.io/guides/getting-started/)를 따라 경로 기반 라우팅, 헤더 매칭, 요청 미러링과 그 외 기능을 실험해 보세요.

### 마지막 주의 사항
이 _kind_ 환경은 개발과 학습 전용입니다.
실제 워크로드에는 항상 프로덕션 수준의 게이트웨이 API 구현체를 사용하세요.
