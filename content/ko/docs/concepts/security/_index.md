---
title: "보안"
weight: 85
description: >
  클라우드 네이티브 워크로드를 안전하게 유지하기 위한 개념.
simple_list: true
---

쿠버네티스 문서의 이 섹션은 워크로드를 더 안전하게 실행하는 방법과
쿠버네티스 클러스터의 보안을 유지하는 데 필수적인 사항을
배우는 데 도움을 주는 것을 목표로 한다.

쿠버네티스는 클라우드 네이티브 아키텍처를 기반으로 하며,
클라우드 네이티브 정보 보안 모범 사례에 대한
{{< glossary_tooltip text="CNCF" term_id="cncf" >}}의 조언을 따른다.

[클라우드 네이티브 보안과 쿠버네티스](/docs/concepts/security/cloud-native-security/)를 읽고
클러스터와 그 위에서 실행하는 애플리케이션을 보호하는 방법을
더 넓은 맥락에서 알아본다.

## 쿠버네티스 보안 메커니즘 {#security-mechanisms}

쿠버네티스는 여러 API와 보안 제어 수단을 제공하며, 정보 보안 관리의 일부로
사용할 수 있는 [정책](#policies)을 정의하는 방법도 제공한다.

### 컨트롤 플레인 보호 {#control-plane-protection}

모든 쿠버네티스 클러스터의 핵심 보안 메커니즘은
[쿠버네티스 API에 대한 접근 제어](/docs/concepts/security/controlling-access)이다.

쿠버네티스에서는 컨트롤 플레인 내부 및 컨트롤 플레인과 클라이언트 사이의
[전송 중 데이터 암호화](/docs/tasks/tls/managing-tls-in-a-cluster/)를 위해
TLS를 구성하고 사용해야 한다.
쿠버네티스 컨트롤 플레인에 저장된 데이터의
[저장 데이터 암호화](/docs/tasks/administer-cluster/encrypt-data/)도 활성화할 수 있다. 이는 자체 워크로드의
저장 데이터를 암호화하는 것과 별개이며, 워크로드의 데이터 암호화도 고려할 만하다.

### 시크릿 {#secrets}

[시크릿(Secret)](/docs/concepts/configuration/secret/) API는 기밀성이 필요한
구성 값에 대한 기본적인 보호를 제공한다.

### 워크로드 보호 {#workload-protection}

[파드 시큐리티 표준](/docs/concepts/security/pod-security-standards/)을 적용하여
파드와 컨테이너를 적절하게 격리한다. 필요한 경우
[런타임클래스(RuntimeClass)](/docs/concepts/containers/runtime-class)를 사용하여 사용자 정의 격리를
정의할 수도 있다.

[네트워크 정책](/docs/concepts/services-networking/network-policies/)을 사용하면 파드 간 또는
파드와 클러스터 외부 네트워크 간의 네트워크 트래픽을 제어할 수 있다.

더 넓은 생태계에서 제공하는 보안 제어 수단을 배포하여 파드, 컨테이너 및 그 안에서
실행되는 이미지에 대한 예방 또는 탐지 제어를 구현할 수 있다.

### 어드미션 컨트롤 {#admission-control}

[어드미션 컨트롤러](/docs/reference/access-authn-authz/admission-controllers/)는
쿠버네티스 API 요청을 가로채고, 요청의 특정 필드를 기준으로
요청을 검증하거나 변형할 수 있는 플러그인이다. 이 컨트롤러를 신중하게 설계하면
버전 업데이트에 따라 쿠버네티스 API가 변경될 때 의도하지 않은 중단을
방지하는 데 도움이 된다. 설계 시 고려 사항은
[어드미션 웹훅 모범 사례](/docs/concepts/cluster-administration/admission-webhooks-good-practices/)를 참고한다.

### 감사 {#auditing}

쿠버네티스 [감사 로깅](/docs/tasks/debug/debug-cluster/audit/)은 클러스터에서 수행된
작업의 순서를 문서화하는 보안 관련 기록을 시간순으로 제공한다.
클러스터는 사용자, 쿠버네티스 API를 사용하는 애플리케이션,
컨트롤 플레인 자체에서 발생한 활동을 감사한다.

## 클라우드 제공자 보안 {#cloud-provider-security}

{{% thirdparty-content vendor="true" %}}

자체 하드웨어나 다른 클라우드 제공자에서 쿠버네티스 클러스터를 실행한다면,
해당 문서에서 보안 모범 사례를 확인한다.
다음은 주요 클라우드 제공자의 보안 문서 링크이다.

{{< table caption="클라우드 제공자 보안" >}}

IaaS 제공자        | 링크 |
-------------------- | ------------ |
Alibaba Cloud | https://www.alibabacloud.com/trust-center |
Amazon Web Services | https://aws.amazon.com/security |
Google Cloud Platform | https://cloud.google.com/security |
Huawei Cloud | https://www.huaweicloud.com/intl/en-us/securecenter/overallsafety |
IBM Cloud | https://www.ibm.com/cloud/security |
Microsoft Azure | https://docs.microsoft.com/en-us/azure/security/azure-security |
Oracle Cloud Infrastructure | https://www.oracle.com/security |
Tencent Cloud | https://www.tencentcloud.com/solutions/data-security-and-information-protection |
VMware vSphere | https://www.vmware.com/solutions/security/hardening-guides |

{{< /table >}}

## 정책 {#policies}

[네트워크폴리시(NetworkPolicy)](/docs/concepts/services-networking/network-policies/)
(네트워크 패킷 필터링에 대한 선언적 제어)나
[ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/)
(쿠버네티스 API를 사용하여 수행할 수 있는 변경에 대한 선언적 제한)와 같은
쿠버네티스 기본 메커니즘을 사용하여 보안 정책을 정의할 수 있다.

또한 쿠버네티스를 둘러싼 더 넓은 생태계의
정책 구현을 활용할 수도 있다. 쿠버네티스는 확장 메커니즘을 제공하여
생태계의 프로젝트가 소스 코드 리뷰, 컨테이너 이미지 승인,
API 접근 제어, 네트워킹 등에 대한 자체 정책 제어를
구현할 수 있도록 한다.

정책 메커니즘과 쿠버네티스에 대한 자세한 내용은
[정책](/docs/concepts/policy/)을 읽는다.

## {{% heading "whatsnext" %}}

관련된 쿠버네티스 보안 주제를 알아본다.

* [클러스터 보안 강화](/docs/tasks/administer-cluster/securing-a-cluster/)
* 쿠버네티스의 [알려진 취약점](/docs/reference/issues-security/official-cve-feed/)
  및 추가 정보 링크
* 컨트롤 플레인의 [전송 중 데이터 암호화](/docs/tasks/tls/managing-tls-in-a-cluster/)
* [저장 데이터 암호화](/docs/tasks/administer-cluster/encrypt-data/)
* [쿠버네티스 API에 대한 접근 제어](/docs/concepts/security/controlling-access)
* 파드의 [네트워크 정책](/docs/concepts/services-networking/network-policies/)
* [쿠버네티스의 시크릿](/docs/concepts/configuration/secret/)
* [파드 시큐리티 표준](/docs/concepts/security/pod-security-standards/)
* [런타임클래스](/docs/concepts/containers/runtime-class)

배경을 알아본다.

<!-- if changing this, also edit the front matter of content/en/docs/concepts/security/cloud-native-security.md to match; check the no_list setting -->
* [클라우드 네이티브 보안과 쿠버네티스](/docs/concepts/security/cloud-native-security/)

자격증을 취득한다.

* [공인 쿠버네티스 보안 전문가(Certified Kubernetes Security Specialist)](https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/)
  자격증 및 공식 교육 과정.

이 섹션에서 더 읽어본다.
