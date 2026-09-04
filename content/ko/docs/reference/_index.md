---
title: 레퍼런스
# approvers:
# - chenopis
linkTitle: "레퍼런스"
main_menu: true
weight: 70
content_type: concept
no_list: true
---

<!-- overview -->

쿠버네티스 문서의 본 섹션에서는 레퍼런스를 다룬다.

<!-- body -->

## API 레퍼런스

* [표준 용어집](/docs/reference/glossary/) -  포괄적이고, 표준화된 쿠버네티스 용어 목록

* [쿠버네티스 API 레퍼런스](/docs/reference/kubernetes-api/)
* [쿠버네티스 {{< param "version" >}}용 원페이지(One-page) API 레퍼런스](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
* [쿠버네티스 API 사용](/docs/reference/using-api/) - 쿠버네티스 API에 대한 개요
* [API 접근 제어](/docs/reference/access-authn-authz/) - 쿠버네티스가 API 접근을 제어하는 방법에 대한 세부사항
* [잘 알려진 레이블, 어노테이션과 테인트](/docs/reference/labels-annotations-taints/)

## 공식적으로 지원되는 클라이언트 라이브러리

프로그래밍 언어에서 쿠버네티스 API를 호출하기 위해서,
[클라이언트 라이브러리](/docs/reference/using-api/client-libraries/)를 사용할 수 있다.
공식적으로 지원되는 클라이언트 라이브러리는 다음과 같다.

- [쿠버네티스 Go 클라이언트 라이브러리](https://github.com/kubernetes/client-go/)
- [쿠버네티스 Python 클라이언트 라이브러리](https://github.com/kubernetes-client/python)
- [쿠버네티스 Java 클라이언트 라이브러리](https://github.com/kubernetes-client/java)
- [쿠버네티스 JavaScript 클라이언트 라이브러리](https://github.com/kubernetes-client/javascript)
- [쿠버네티스 C# 클라이언트 라이브러리](https://github.com/kubernetes-client/csharp)
- [쿠버네티스 Haskell 클라이언트 라이브러리](https://github.com/kubernetes-client/haskell)

## CLI

* [kubectl](/docs/reference/kubectl/) - 명령어를 실행하거나 쿠버네티스 클러스터를 관리하기 위해 사용하는 주된 CLI 도구.
    * [JSONPath](/docs/reference/kubectl/jsonpath/) - kubectl에서 [JSONPath 표현](https://goessner.net/articles/JsonPath/)을 사용하기 위한 문법 가이드.
* [kubeadm](/docs/reference/setup-tools/kubeadm/) - 안정적인 쿠버네티스 클러스터를 쉽게 프로비전하기 위한 CLI 도구.

## 컴포넌트

* [kubelet](/docs/reference/command-line-tools-reference/kubelet/) - 각
노드에서 구동되는 주요한 에이전트. kubelet은 PodSpecs 집합을 가지며
기술된 컨테이너가 구동되고 있는지, 정상 작동하는지를 보장한다.
* [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/) -
파드, 서비스, 레플리케이션 컨트롤러와 같은 API 오브젝트에 대한 검증과 구성을
수행하는 REST API.
* [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/) - 
쿠버네티스에 탑재된 핵심 제어 루프를 포함하는 데몬.
* [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) - 간단한
TCP/UDP 스트림 포워딩이나 백-엔드 집합에 걸쳐서 라운드-로빈 TCP/UDP 포워딩을
할 수 있다.
* [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/) - 
가용성, 성능 및 용량을 관리하는 스케줄러.

  * [kube-scheduler 정책](/docs/reference/scheduling/policies)
  * [kube-scheduler 프로파일](/docs/reference/scheduling/config#프로파일)

* 컨트롤 플레인과 워커 노드에서 꼭 열어야 하는
  [포트와 프로토콜](/docs/reference/networking/ports-and-protocols/) 리스트

## API 설정

이 섹션은 쿠버네티스 구성요소 또는 도구를 환경설정하는 데에 사용되는
"미발표된" API를 다룬다. 이 API들은 사용자나 관리자가 클러스터를
사용/관리하는 데에 중요하지만, 이들 API의 대부분은 아직 API 서버가
제공하지 않는다.


* [kubeconfig (v1)](/docs/reference/config-api/kubeconfig.v1/)
* [kuberc (v1alpha1)](/docs/reference/config-api/kuberc.v1alpha1/) 및
  [kuberc (v1beta1)](/docs/reference/config-api/kuberc.v1beta1/)
* [kube-apiserver 어드미션 (v1)](/docs/reference/config-api/apiserver-admission.v1/)
* [kube-apiserver 환경설정 (v1alpha1)](/docs/reference/config-api/apiserver-config.v1alpha1/) 및
  [kube-apiserver 환경설정 (v1beta1)](/docs/reference/config-api/apiserver-config.v1beta1/) 및
  [kube-apiserver 환경설정 (v1)](/docs/reference/config-api/apiserver-config.v1/)
* [kube-apiserver 요청 제한 (v1alpha1)](/docs/reference/config-api/apiserver-eventratelimit.v1alpha1/)
* [kubelet 환경설정 (v1alpha1)](/docs/reference/config-api/kubelet-config.v1alpha1/) 및
  [kubelet 환경설정 (v1beta1)](/docs/reference/config-api/kubelet-config.v1beta1/) 및
  [kubelet 환경설정 (v1)](/docs/reference/config-api/kubelet-config.v1/)
* [kubelet 자격증명 제공자 (v1)](/docs/reference/config-api/kubelet-credentialprovider.v1/)
* [kube-scheduler 환경설정 (v1)](/docs/reference/config-api/kube-scheduler-config.v1/)
* [kube-controller-manager 환경설정 (v1alpha1)](/docs/reference/config-api/kube-controller-manager-config.v1alpha1/)
* [kube-proxy 환경설정 (v1alpha1)](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
* [`audit.k8s.io/v1` API](/docs/reference/config-api/apiserver-audit.v1/)
* [클라이언트 인증 API (v1beta1)](/docs/reference/config-api/client-authentication.v1beta1/) 및
  [클라이언트 인증 API (v1)](/docs/reference/config-api/client-authentication.v1/)
* [WebhookAdmission 환경설정 (v1)](/docs/reference/config-api/apiserver-webhookadmission.v1/)
* [이미지 정책 API (v1alpha1)](/docs/reference/config-api/imagepolicy.v1alpha1/)

## kubeadm을 위한 API 설정

* [v1beta3](/docs/reference/config-api/kubeadm-config.v1beta3/)
* [v1beta4](/docs/reference/config-api/kubeadm-config.v1beta4/)

## 외부 API

쿠버네티스 프로젝트에서 정의하지만, 핵심 프로젝트에서는 
구현되어 있지 않은 API다.

* [메트릭 API (v1beta1)](/docs/reference/external-api/metrics.v1beta1/)
* [사용자 정의 메트릭 API (v1beta2)](/docs/reference/external-api/custom-metrics.v1beta2)
* [외부 메트릭 API (v1beta1)](/docs/reference/external-api/external-metrics.v1beta1)

## 설계 문서

쿠버네티스 기능에 대한 설계 문서의 아카이브.
[쿠버네티스 아키텍처](https://git.k8s.io/design-proposals-archive/architecture/architecture.md)와
[쿠버네티스 디자인 개요](https://git.k8s.io/design-proposals-archive)부터 읽어보는 것이 좋다.

## 인코딩

{{< glossary_tooltip text="kubectl" term_id="kubectl" >}}과 같은 도구는
다양한 형식/인코딩을 다룰 수 있다. 여기에는 다음이 포함된다.

* [CBOR](https://cbor.io/) - 네트워크에서 사용되지만 kubectl 출력 형식으로는 **제공되지 않는다**
  * [CBOR 리소스 인코딩](/docs/reference/using-api/api-concepts/#cbor-encoding) 참고
* [JSON](https://www.json.org/) - `kubectl` 출력 형식으로 제공되며 HTTP 계층에서도 사용된다
* [KYAML](/docs/reference/encodings/kyaml) - 쿠버네티스의 YAML 방언
  * KYAML은 본질적으로 _출력 형식_이다. 쿠버네티스에 KYAML을 제공할 수 있는 곳이라면 어디든 다른 유효한 YAML 입력도 제공할 수 있다
* [YAML](https://yaml.org/) - `kubectl` 출력 형식으로 제공되며 HTTP 계층에서도 사용된다

쿠버네티스는 HTTP 메시지 내에서만 사용되는 사용자 정의 [protobuf 인코딩](/docs/reference/using-api/api-concepts/#protobuf-encoding)도 갖고 있다.

`kubectl` 도구는 _사용자 정의 열(custom columns)_과 같은 몇 가지 다른 출력 형식도 지원한다. kubectl 
레퍼런스의 [출력 형식](/docs/reference/kubectl/#output-options)을 참고한다.
