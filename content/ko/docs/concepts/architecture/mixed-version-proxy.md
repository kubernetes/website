---
title: 혼합 버전 프록시 (Mixed Version Proxy)
content_type: concept
weight: 220
---

<!-- overview -->

{{< feature-state feature_gate_name="UnknownVersionInteroperabilityProxy" >}}

쿠버네티스 {{< skew currentVersion >}}에는 {{< glossary_tooltip text="API 서버" term_id="kube-apiserver" >}}가 
다른 _peer_ API 서버로 리소스 요청을 프록시할 수 있는 알파 기능이 포함되어 있다. 이는 한 클러스터 내에서 다른 버전의 Kubernetes를 실행하는 
여러 API 서버가 있을 때 유용하다 (예를 들어, Kubernetes의 새로운 릴리스로의 장기적인 롤아웃 중일때).


이를 통해 클러스터 관리자는 (업그레이드 중에 생성된) 리소스 요청을 올바른 kube-apiserver로 다이렉트 함으로써 
더 안전하게 업그레이드할 수 있는 고가용성 클러스터를 구성할 수 있다. 
이러한 프록싱은 업그레이드 과정에서 발생하는 예기치 않은 404 Not Found 오류와 맞닥뜨리는 것을 방지한다.

이러한 메커니즘을 _혼합 버전 프록시 (Mixed Version Proxy)_ 라고 부른다.

## 혼합 버전 프록시 (Mixed Version Proxy) 활성화

{{< glossary_tooltip text="API 서버" term_id="kube-apiserver" >}} 를 시작할 때 `UnknownVersionInteroperabilityProxy` 
[기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/)가 활성화되어 있는지 확인해야 한다.

```shell
kube-apiserver \
--feature-gates=UnknownVersionInteroperabilityProxy=true \
# 이 기능에 요구되는 명령줄 인수
--peer-ca-file=<kube-apiserver CA 인증서 경로>
--proxy-client-cert-file=<aggregator 프록시 인증서 경로>,
--proxy-client-key-file=<aggregator 프록시 키 경로>,
--requestheader-client-ca-file=<aggregator CA 인증서 경로>,
# requestheader-allowed-names는 어떤 이름(Common Name)이든 허용하도록 공백으로 설정할 수 있다.
--requestheader-allowed-names=<프록시 클라이언트 인증서를 검증하기 위한 유효한 이름(Common Names)>,

# 이 기능의 선택적 플래그
--peer-advertise-ip=`peer들이 요청을 프록시하기 위해 사용해야 하는 이 kube-apiserver의 IP`
--peer-advertise-port=`peer들이 요청을 프록시하기 위해 사용해야 하는 이 kube-apiserver의 포트`

# …그 외의 플래그들
```

### API 서버 간 프록시 전송 및 인증 {#transport-and-authn}

* 소스 kube-apiserver는 [기존 API 서버 클라이언트 인증 플래그](/docs/tasks/extend-kubernetes/configure-aggregation-layer/#kubernetes-apiserver-client-authentication)인
  `--proxy-client-cert-file`과 `--proxy-client-key-file`을 재사용하여 자신의 신원을 제시하며, 이는 peer (목적지 kube-apiserver)에 의해 검증된다.
  목적지 API 서버는 `--requestheader-client-ca-file` 명령줄 인수를 사용하여 지정한 구성에 따라 그 peer 연결을 검증한다.

* 목적지 서버의 서비스 인증서를 인증하기 위해, **소스** API 서버에 `--peer-ca-file` 명령줄 인수를 지정하여 인증 기관 번들을 구성해야 한다.

### Peer API 서버 연결을 위한 구성

Peer들이 요청을 프록시하기 위해 사용할 kube-apiserver의 네트워크 위치를 설정하려면, kube-apiserver에 
`--peer-advertise-ip`와 `--peer-advertise-port` 명령줄 인수를 사용하거나 이러한 필드를 API 서버 구성 파일에 지정해야 한다.
이 플래그들이 지정되지 않은 경우, peer들은 kube-apiserver에 대한 `--advertise-address` 또는 `--bind-address` 명령줄 인수의 값을 사용한다. 
이것들도 설정되지 않은 경우, 호스트의 기본 인터페이스가 사용된다.

## 혼합 버전 프록싱 (Mixed version proxying)

혼합 버전 프록싱을 활성화하면, [애그리게이션 레이어](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)가 다음을 수행하는 특별한 필터를 로드한다:

* API 요청이 해당 API를 제공할 수 없는 API 서버에 도달했을 때(해당 API의 도입 이전 버전에서 운영 중이거나 API 서버에서 해당 API가 비활성화된 경우)
  해당 API 서버는 요청받은 API를 제공할 수 있는 peer API 서버로 요청을 전송하려고 시도한다. 이는 로컬 서버가 인식하지 못하는 API 그룹 / 버전 / 리소스를 식별하고,
  해당 요청을 처리할 수 있는 peer API 서버로 프록시하려고 시도함으로써 수행한다. 
* Peer API 서버가 응답하지 못할 경우, _소스_ API 서버는 503("Service Unavailable") 오류로 응답한다.

### 내부 작동 원리

API 서버가 리소스 요청을 받으면, 먼저 어떤 API 서버들이 요청받은 리소스를 제공할 수 있는지 확인한다. 
이 확인은 내부 [`StorageVersion` API](/docs/reference/generated/kubernetes-api/v{{< skew currentVersion >}}/#storageversioncondition-v1alpha1-internal-apiserver-k8s-io)를 
사용하여 이루어진다.

* 요청을 받은 API 서버가 리소스를 알고 있는 경우(예를 들어, GET /api/v1/pods/some-pod), 요청은 로컬에서 처리된다.


* 요청받은 리소스에 대한 내부 `StorageVersion` 객체를 찾을 수 없고(예를 들어, `GET /my-api/v1/my-resource`),
  설정된 APIService가 확장 API 서버로의 프록싱을 지정하는 경우, 그 프록싱은 확장 API에 대한 일반적인
  [흐름](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)을 따른다.

* 요청받은 리소스에 대한 유효한 내부 `StorageVersion` 객체가 발견되고(예를 들어, `GET /batch/v1/jobs`), 요청을 처리하려는 API 서버(_핸들링 API 서버_)가 `batch` API를 비활성화한 경우,
  _핸들링 API 서버_는 관련 API 그룹 / 버전 / 리소스(이 경우 `api/v1/batch`)를 제공하는 peer API 서버들을 가져온 `StorageVersion` 객체의 정보를 사용하여 조회한다.
  그 다음 _핸들링 API 서버_는 요청받은 리소스를 인지하는 일치하는 peer kube-apiservers 중 하나로 요청을 프록시한다.

  * 해당 API 그룹 / 버전 / 리소스에 대해 알려진 peer가 없는 경우, 핸들링 API 서버는 요청을 자체 핸들러 체인으로 전달하며, 이는 결국 404("Not Found") 응답을 반환하게 된다.

  * 핸들링 API 서버가 peer API 서버를 식별하고 선택했지만, 해당 peer가 응답하지 못하는 경우
  (네트워크 연결 문제나 요청이 수신되고 컨트롤러가 peer의 정보를 컨트롤 플레인에 등록하는 사이의 데이터 경쟁과 같은 이유로),
  핸들링 API 서버는 503("Service Unavailable") 오류로 응답한다.
