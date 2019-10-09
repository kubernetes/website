---
title: 클러스터 관리 개요
content_template: templates/concept
weight: 10
---

{{% capture overview %}}
클러스터 관리 개요는 쿠버네티스 클러스터를 만들거나 관리하는 모든 사람들을 위한 것이다.
여기서는 쿠버네티스의 핵심 [개념](/ko/docs/concepts/)에 대해 잘 알고 있다고 가정한다.
{{% /capture %}}

{{% capture body %}}
## 클러스터 계획

[올바른 솔루션 고르기](/ko/docs/setup/pick-right-solution/)에서 쿠버네티스 클러스터를 어떻게 계획하고, 셋업하고, 구성하는 지에 대한 예시를 참조하자. 이 글에 쓰여진 솔루션들은 *배포판* 이라고 부른다.

가이드를 고르기 전에, 몇 가지 고려사항이 있다.

 - 단지 자신의 컴퓨터에 쿠버네티스를 테스트를 하는지, 또는 고가용성의 멀티 노드 클러스터를 만들려고 하는지에 따라 니즈에 가장 적절한 배포판을 고르자.
 - **만약 고가용성을 만들려고 한다면**, [여러 영역에서의 클러스터](/ko/docs/concepts/cluster-administration/federation/) 설정에 대해 배우자.
 - [구글 쿠버네티스 엔진](https://cloud.google.com/kubernetes-engine/)과 같은 **호스팅된 쿠버네티스 클러스터** 를 사용할 것인지, **자신의 클러스터에 호스팅할 것인지**?
 - 클러스터가 **온프레미스** 인지, 또는 **클라우드(IaaS)** 인지? 쿠버네티스는 하이브리드 클러스터를 직접적으로 지원하지는 않는다. 대신에, 사용자는 여러 클러스터를 구성할 수 있다.
 - **만약 온프레미스에서 쿠버네티스를 구성한다면**, 어떤 [네트워킹 모델](/docs/concepts/cluster-administration/networking/)이 가장 적합한지 고려한다.
 - 쿠버네티스 실행을 **"베어메탈" 하드웨어** 또는, **가상 머신 (VMs)** 중 어디에서 할 것 인지?
 - **단지 클러스터 동작** 만 할 것인지, 아니면 **쿠버네티스 프로젝트 코드의 적극적인 개발** 을 원하는지? 만약 후자의 경우라면,
   적극적으로 개발된 배포판을 선택한다. 몇몇 배포판은 바이너리 릴리스 밖에 없지만,
   매우 다양한 선택권을 제공한다.
 - 스스로 클러스터 구동에 필요한 [구성요소](/docs/admin/cluster-components/)에 익숙해지자.

참고: 모든 배포판이 적극적으로 유지되는 것은 아니다. 최근 버전의 쿠버네티스로 테스트 된 배포판을 선택하자.

## 클러스터 관리

* [클러스터 관리](/docs/tasks/administer-cluster/cluster-management/)는 클러스터의 라이프사이클과 관련된 몇 가지 주제를 설명한다. 이는 새 클러스터 생성, 마스터와 워커노드 업그레이드, 노드 유지보수 실행 (예: 커널 업그레이드), 그리고 동작 중인 클러스터의 쿠버네티스 API 버전 업그레이드 등을 포함한다.

* 어떻게 [노드 관리](/ko/docs/concepts/architecture/nodes/)를 하는지 배워보자.

* 공유된 클러스터의 [자원 할당량](/docs/concepts/policy/resource-quotas/)을 어떻게 셋업하고 관리할 것인지 배워보자.

## 클러스터 보안

* [인증서](/docs/concepts/cluster-administration/certificates/)는 다른 툴 체인을 이용하여 인증서를 생성하는 방법을 설명한다.

* [쿠버네티스 컨테이너 환경](/docs/concepts/containers/container-environment-variables/)은 쿠버네티스 노드에서 Kubelet에 의해 관리되는 컨테이너 환경에 대해 설명한다.

* [쿠버네티스 API에 대한 접근 제어](/docs/reference/access-authn-authz/controlling-access/)는 사용자와 서비스 계정에 어떻게 권한 설정을 하는지 설명한다.

* [인증](/docs/reference/access-authn-authz/authentication/)은 다양한 인증 옵션을 포함한 쿠버네티스에서의 인증을 설명한다.

* [인가](/docs/reference/access-authn-authz/authorization/)은 인증과 다르며, HTTP 호출이 처리되는 방법을 제어한다.

* [어드미션 컨트롤러 사용](/docs/reference/access-authn-authz/admission-controllers/)은 쿠버네티스 API 서버에서 인증과 인가 후 요청을 가로채는 플러그인을 설명한다.

* [쿠버네티스 클러스터에서 Sysctls 사용](/docs/concepts/cluster-administration/sysctl-cluster/)는 관리자가 `sysctl` 커맨드라인 툴을 사용하여 커널 파라미터를 설정하는 방법을 설명한다.

* [감시](/docs/tasks/debug-application-cluster/audit/)는 쿠버네티스 감시 로그가 상호작용 하는 방법을 설명한다.

### kubelet 보안
  * [마스터노드 커뮤니케이션](/ko/docs/concepts/architecture/master-node-communication/)
  * [TLS 부트스트래핑](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/)
  * [Kubelet 인증/인가](/docs/admin/kubelet-authentication-authorization/)

## 선택적 클러스터 서비스

* [DNS 통합](/docs/concepts/services-networking/dns-pod-service/)은 DNS 이름이 쿠버네티스 서비스에 바로 연결되도록 변환하는 방법을 설명한다.

* [클러스터 활동 로깅과 모니터링](/docs/concepts/cluster-administration/logging/)은 쿠버네티스 로깅이 로깅의 작동 방법과 로깅을 어떻게 구현하는지 설명한다.

{{% /capture %}}
