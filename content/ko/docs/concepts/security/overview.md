---
title: 클라우드 네이티브 보안 개요
content_template: templates/concept
weight: 1
---

{{< toc >}}

{{% capture overview %}}
쿠버네티스 보안(일반적인 보안)은 관련된 많은 부분이 상호작용하는 
방대한 주제다. 오늘날에는 웹 애플리케이션의 실행을 돕는 
수많은 시스템에 오픈소스 소프트웨어가 통합되어 있으며, 
전체적인 보안에 대하여 생각할 수 있는 방법에 대한 통찰력을 도울 수 있는 
몇 가지 중요한 개념이 있다. 이 가이드는 클라우드 네이티브 보안과 관련된 
몇 가지 일반적인 개념에 대한 멘탈 모델(mental model)을 정의한다. 멘탈 모델은 완전히 임의적이며 
소프트웨어 스택을 보호할 위치를 생각하는데 도움이되는 경우에만 사용해야 
한다.
{{% /capture %}}

{{% capture body %}}

## 클라우드 네이티브 보안의 4C
계층적인 보안에 대해서 어떻게 생각할 수 있는지 이해하는 데 도움이 될 수 있는 다이어그램부터 살펴보자.
{{< note >}}
이 계층화된 접근 방식은 보안에 대한 [심층 방어](https://en.wikipedia.org/wiki/Defense_in_depth_(computing)) 
접근 방식을 강화하며, 소프트웨어 시스템의 보안을 위한 모범 사례로 
널리 알려져 있다. 4C는 클라우드(Cloud), 클러스터(Clusters), 컨테이너(Containers) 및 코드(Code)이다.
{{< /note >}}

{{< figure src="/images/docs/4c.png" title="클라우드 네이티브 보안의 4C" >}}


위 그림에서 볼 수 있듯이,
4C는 각각의 사각형의 보안에 따라 다르다. 코드 
수준의 보안만 처리하여 클라우드, 컨테이너 및 코드의 열악한 보안 표준으로부터 
보호하는 것은 거의 불가능하다. 그러나 이런 영역들의 보안이 적절하게 
처리되고, 코드에 보안을 추가한다면 이미 강력한 기반이 더욱 
강화될 것이다. 이러한 관심 분야는 아래에서 더 자세히 설명한다.

## 클라우드

여러 면에서 클라우드(또는 공동 위치 서버, 또는 기업의 데이터 센터)는 쿠버네티스 클러스터 구성을 위한
[신뢰 컴퓨팅 기반(trusted computing base)](https://en.wikipedia.org/wiki/Trusted_computing_base)
이다. 이러한 구성 요소 자체가 취약하거나(또는 취약한 방법으로 구성된) 
경우 이 기반 위에서 구축된 모든 구성 요소의 보안을 
실제로 보장할 방법이 없다. 각 클라우드 공급자는 그들의 환경에서 워크로드를 
안전하게 실행하는 방법에 대해 고객에게 광범위한 보안 권장 사항을 
제공한다. 모든 클라우드 공급자와 워크로드는 다르기 때문에 
클라우드 보안에 대한 권장 사항을 제공하는 것은 이 가이드의 범위를 벗어난다. 다음은 
알려진 클라우드 공급자의 보안 문서의 일부와 
쿠버네티스 클러스터를 구성하기 위한 인프라
보안에 대한 일반적인 지침을 제공한다.

### 클라우드 공급자 보안 표



IaaS 공급자        | 링크 |
-------------------- | ------------ |
Alibaba Cloud | https://www.alibabacloud.com/trust-center |
Amazon Web Services | https://aws.amazon.com/security/ |
Google Cloud Platform | https://cloud.google.com/security/ |
IBM Cloud | https://www.ibm.com/cloud/security |
Microsoft Azure | https://docs.microsoft.com/en-us/azure/security/azure-security |
VMWare VSphere | https://www.vmware.com/security/hardening-guides.html |


자체 하드웨어나 다른 클라우드 공급자를 사용하는 경우 보안에 대한 
모범 사례는 해당 문서를 참조한다.

### 일반적인 인프라 지침 표

쿠버네티스 인프라에서 고려할 영역 | 추천 |
--------------------------------------------- | ------------ |
API 서버에 대한 네트워크 접근(마스터) | 이상적으로는 인터넷에서 쿠버네티스 마스터에 대한 모든 접근을 공개적으로 허용하지 않으며 클러스터를 관리하는데 필요한 IP 주소 집합으로 제한된 네트워크 접근 제어 목록(ACL)에 의해 제어되어야 한다. |
노드에 대한 네트워크 접근(워커 서버) | 노드는 마스터의 지정된 포트 연결_만_ 허용하고(네트워크 접근 제어 목록의 사용), NodePort와 LoadBalancer 유형의 쿠버네티스 서비스에 대한 연결을 허용하도록 구성해야 한다. 가능한 노드가 공용 인터넷에 완전히 노출되어서는 안된다. 
클라우드 공급자 API에 대한 쿠버네티스 접근 | 각 클라우드 공급자는 쿠버네티스 마스터 및 노드에 서로 다른 권한을 부여해야 함으로써, 이런 권장 사항이 더 일반적이다. 관리해야 하는 리소스에 대한 [최소 권한의 원칙](https://en.wikipedia.org/wiki/Principle_of_least_privilege)을 따르는 클라우드 공급자의 접근 권한을 클러스터에 구성하는 것이 가장 좋다. AWS의 Kops에 대한 예제: https://github.com/kubernetes/kops/blob/master/docs/iam_roles.md#iam-roles
etcd에 대한 접근 | etcd (쿠버네티스의 데이터저장소)에 대한 접근은 마스터로만 제한되어야 한다. 구성에 따라 TLS를 통해 etcd를 사용해야 한다. 자세한 정보: https://github.com/etcd-io/etcd/tree/master/Documentation#security
etcd 암호화 | 가능한 모든 드라이브를 유휴 상태에서 암호화 하는 것이 좋은 방법이지만, etcd는 전체 클러스터(시크릿 포함)의 상태를 유지하고 있기에 디스크의 암호화는 유휴 상태에서 암호화 되어야 한다.

## 클러스터

이 섹션에서는 쿠버네티스의 워크로드 
보안을 위한 링크를 제공한다. 쿠버네티스
보안에 영향을 미치는 다음 두 가지 영역이 있다.

* 클러스터를 구성하는 설정 가능한 컴포넌트의 보안
* 클러스터에서 실행되는 컴포넌트의 보안

### 클러스터_의_ 컴포넌트

우발적이거나 악의적인 접근으로부터 클러스터를 보호하고, 
모범 사례에 대한 정보를 채택하기 위해서는 
[클러스터 보안](/docs/tasks/administer-cluster/securing-a-cluster/)에 대한 조언을 읽고 따른다.

### 클러스터 _내_ 컴포넌트(애플리케이션)
애플리케이션의 공격 영역에 따라, 보안의 특정 측면에 
중점을 둘 수 있다. 예를 들어, 다른 리소스 체인에 중요한 서비스(서비스 A)와 
리소스 소진 공격에 취약한 별도의 작업 부하(서비스 B)를 실행하는 경우, 
리소스 제한을 설정하지 않은 서비스 B에 의해 
서비스 A 또한 손상시킬 위험이 있다. 다음은 쿠버네티스에서 
실행 중인 워크로드를 보호할 때 고려해야 할 사항에 대한 링크 표이다.

워크로드 보안에서 고려할 영역 | 추천 |
------------------------------ | ------------ |
RBAC 인증(쿠버네티스 API에 대한 접근) | https://kubernetes.io/docs/reference/access-authn-authz/rbac/
인증 | https://kubernetes.io/docs/reference/access-authn-authz/controlling-access/
애플리케이션 시크릿 관리(및 유휴 상태에서의 etcd 암호화 등) | https://kubernetes.io/docs/concepts/configuration/secret/ <br> https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/
파드 보안 정책 | https://kubernetes.io/docs/concepts/policy/pod-security-policy/
서비스 품질(및 클러스터 리소스 관리) | https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod/
네트워크 정책 | https://kubernetes.io/ko/docs/concepts/services-networking/network-policies/
쿠버네티스 인그레스를 위한 TLS | https://kubernetes.io/ko/docs/concepts/services-networking/ingress/#tls



## 컨테이너

쿠버네티스에서 소프트웨어를 실행하려면, 소프트웨어는 컨테이너에 있어야 한다. 이로 인해, 
쿠버네티스의 원시적인 워크로드 보안으로부터 이점을 얻기 위해서 
반드시 고려해야 할 보안 사항이 있다. 컨테이너 보안 
또한 이 가이드의 범위를 벗어나지만, 해당 주제에 대한 추가적인 설명을 위하여
일반 권장사항 및 링크 표를 아래에 제공한다.

컨테이너에서 고려할 영역 | 추천 |
------------------------------ | ------------ |
컨테이너 취약점 스캔 및 OS에 종속적인 보안 | 이미지 빌드 단계의 일부 또는 정기적으로 [CoreOS의 Clair](https://github.com/coreos/clair/)와 같은 도구를 사용해서 컨테이너에 알려진 취약점이 있는지 검사한다.
이미지 서명 및 시행 | 두 개의 다른 CNCF 프로젝트(TUF 와 Notary)는 컨테이너 이미지에 서명하고 컨테이너 내용에 대한 신뢰 시스템을 유지하는데 유용한 도구이다. 도커를 사용하는 경우 도커 엔진에 [도커 컨텐츠 신뢰](https://docs.docker.com/engine/security/trust/content_trust/)가 내장되어 있다. 시행 부분에서의 [IBM의 Portieris](https://github.com/IBM/portieris) 프로젝트는 쿠버네티스 다이나믹 어드미션 컨트롤러로 실행되는 도구로, 클러스터에서 허가하기 전에 Notary를 통해 이미지가 적절하게 서명되었는지 확인한다.
권한있는 사용자의 비허용 | 컨테이너를 구성할 때 컨테이너의 목적을 수행하는데 필요한 최소 권한을 가진 사용자를 컨테이너 내에 만드는 방법에 대해서는 설명서를 참조한다.

## 코드

마지막으로 애플리케이션의 코드 수준으로 내려가면, 가장 많은 제어를 할 수 있는 
주요 공격 영역 중 하나이다. 이런 코드 수준은 쿠버네티스의 범위 
밖이지만 몇가지 권장사항이 있다.

### 일반적인 코드 보안 지침표

코드에서 고려할 영역 | 추천 |
--------------------------------------------- | ------------ |
TLS를 통한 접근 | 코드가 TCP를 통해 통신해야 한다면, 클라이언트와 먼저 TLS 핸드 셰이크를 수행하는 것이 이상적이다. 몇 가지 경우를 제외하고, 기본 동작은 전송 중인 모든 것을 암호화하는 것이다. 한걸음 더 나아가, VPC의 "방화벽 뒤"에서도 서비스 간 네트워크 트래픽을 암호화하는 것이 좋다. 이것은 인증서를 가지고 있는 두 서비스의 양방향 검증을 [mTLS](https://en.wikipedia.org/wiki/Mutual_authentication)를 통해 수행할 수 있다. 이것을 수행하기 위해 쿠버네티스에는 [Linkerd](https://linkerd.io/) 및 [Istio](https://istio.io/)와 같은 수많은 도구가 있다. |
통신 포트 범위 제한 | 이 권장사항은 당연할 수도 있지만, 가능하면 통신이나 메트릭 수집에 꼭 필요한 서비스의 포트만 노출시켜야 한다. |
타사 종속성 보안 | 애플리케이션은 자체 코드베이스의 외부에 종속적인 경향이 있기 때문에, 코드의 종속성을 정기적으로 스캔하여 현재 알려진 취약점이 없는지 확인하는 것이 좋다. 각 언어에는 이런 검사를 자동으로 수행하는 도구를 가지고 있다. |
정적 코드 분석 | 대부분 언어에는 잠재적으로 안전하지 않은 코딩 방법에 대해 코드 스니펫을 분석할 수 있는 방법을 제공한다. 가능한 언제든지 일반적인 보안 오류에 대해 코드베이스를 스캔할 수 있는 자동화된 도구를 사용하여 검사를 한다. 도구는 다음에서 찾을 수 있다: https://www.owasp.org/index.php/Source_Code_Analysis_Tools |
동적 탐지 공격 | 일반적으로 서비스에서 발생할 수 있는 잘 알려진 공격 중 일부를 서비스에 테스트할 수 있는 자동화된 몇 가지 도구가 있다. 이런 잘 알려진 공격에는 SQL 인젝션, CSRF 및 XSS가 포함된다. 가장 널리 사용되는 동적 분석 도구는 OWASP Zed Attack 프록시다. https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project |


## 강력한(robust) 자동화

위에서 언급한 대부분의 제안사항은 실제로 일련의 보안 검사의 일부로 코드를 
전달하는 파이프라인에 의해 자동화 될 수 있다. 소프트웨어 전달을 위한 
"지속적인 해킹(Continuous Hacking)"에 대한 접근 방식에 대해 알아 보려면, 자세한 설명을 제공하는 [이 기사](https://thenewstack.io/beyond-ci-cd-how-continuous-hacking-of-docker-containers-and-pipeline-driven-security-keeps-ygrene-secure/)를 참고한다.

{{% /capture %}}
{{% capture whatsnext %}}
* [파드에 대한 네트워크 정책](/ko/docs/concepts/services-networking/network-policies/) 알아보기
* [클러스터 보안](/docs/tasks/administer-cluster/securing-a-cluster/)에 대해 알아보기
* [API 접근 통제](/docs/reference/access-authn-authz/controlling-access/)에 대해 알아보기
* 컨트롤 플레인에 대한 [전송 데이터 암호화](/docs/tasks/tls/managing-tls-in-a-cluster/) 알아보기
* [Rest에서 데이터 암호화](/docs/tasks/administer-cluster/encrypt-data/) 알아보기
* [쿠버네티스 시크릿](/docs/concepts/configuration/secret/)에 대해 알아보기
{{% /capture %}}
