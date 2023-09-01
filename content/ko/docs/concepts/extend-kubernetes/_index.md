---
title: 쿠버네티스 확장
weight: 110
description: 쿠버네티스 클러스터의 동작을 변경하는 다양한 방법
# reviewers:
# - erictune
# - lavalamp
# - cheftako
# - chenopis
feature:
  title: 확장성을 고려하여 설계됨
  description: >
    쿠버네티스 업스트림 소스 코드 수정 없이 쿠버네티스 클러스터에 기능을 추가할 수 있다.
content_type: concept
no_list: true
---

<!-- overview -->

쿠버네티스는 매우 유연하게 구성할 수 있고 확장 가능하다. 결과적으로 쿠버네티스 프로젝트를 
포크하거나 코드에 패치를 제출할 필요가 거의 없다.

이 가이드는 쿠버네티스 클러스터를 사용자 정의하기 위한 옵션을 설명한다.
쿠버네티스 클러스터를 업무 환경의 요구에 맞게
조정하는 방법을 이해하려는 {{< glossary_tooltip text="클러스터 운영자" term_id="cluster-operator" >}}를 대상으로 한다.
잠재적인 {{< glossary_tooltip text="플랫폼 개발자" term_id="platform-developer" >}} 또는 
쿠버네티스 프로젝트 {{< glossary_tooltip text="컨트리뷰터" term_id="contributor" >}}인 개발자에게도
어떤 익스텐션(extension) 포인트와 패턴이 있는지,
그리고 그것의 트레이드오프와 제약을 이해하는 데 도움이 될 것이다.

사용자 정의 방식은 크게 플래그, 로컬 구성 파일 또는 API 리소스 변경만 
포함하는 [구성](#구성)과 추가적인 프로그램, 추가적인 네트워크 서비스,
또는 둘 다의 실행을 요구하는 [익스텐션](#익스텐션)으로 나눌 수 있다.
이 문서는 주로 _익스텐션_ 에 관한 것이다.

<!-- body -->

## 구성

*구성 파일* 및 *명령행 인자* 는 온라인 문서의 [레퍼런스](/ko/docs/reference/) 섹션에 
각 바이너리 별로 문서화되어 있다.

* [`kube-apiserver`](/docs/reference/command-line-tools-reference/kube-apiserver/)
* [`kube-controller-manager`](/docs/reference/command-line-tools-reference/kube-controller-manager/)
* [`kube-scheduler`](/docs/reference/command-line-tools-reference/kube-scheduler/).
* [`kubelet`](/docs/reference/command-line-tools-reference/kubelet/)
* [`kube-proxy`](/docs/reference/command-line-tools-reference/kube-proxy/)

호스팅된 쿠버네티스 서비스 또는 매니지드 설치 환경의 배포판에서
명령행 인자 및 구성 파일을 항상 변경할 수 있는 것은 아니다. 변경
가능하더라도 일반적으로 클러스터 오퍼레이터를 통해서만 변경될 수 있다. 또한 향후
쿠버네티스 버전에서 변경될 수 있으며, 이를 설정하려면 프로세스를 다시
시작해야 할 수도 있다. 이러한 이유로 다른 옵션이 없는 경우에만 사용해야 한다.

[리소스쿼터](/ko/docs/concepts/policy/resource-quotas/),
[네트워크폴리시](/ko/docs/concepts/services-networking/network-policies/) 및
역할 기반 접근 제어([RBAC](/docs/reference/access-authn-authz/rbac/))와 같은 빌트인 *정책 API(Policy API)* 는 선언적으로 구성된 정책 설정을 제공하는 내장 쿠버네티스 API이다. API는
일반적으로 호스팅된 쿠버네티스 서비스 및 매니지드 쿠버네티스 설치 환경과 함께 사용할 수도 있다.
빌트인 정책 API는 파드와 같은 다른 쿠버네티스 리소스와 동일한 규칙을 따른다.
[안정적인](/ko/docs/reference/using-api/#api-versioning) 정책 API를 사용하는 경우
다른 쿠버네티스 API와 같이 [정의된 지원 정책](/docs/reference/using-api/deprecation-policy/)의 혜택을 볼 수 있다.
이러한 이유로 인해 적절한 상황에서는 정책 API는 *구성 파일* 과 *명령행 인자* 보다 권장된다.

## 익스텐션

익스텐션은 쿠버네티스를 확장하고 쿠버네티스와 긴밀하게 통합되는 소프트웨어 컴포넌트이다.
이들 컴포넌트는 쿠버네티스가 새로운 유형과 새로운 종류의 하드웨어를 지원할 수 있게 해준다.

많은 클러스터 관리자가 호스팅 또는 배포판 쿠버네티스 인스턴스를 사용한다.
이러한 클러스터들은 미리 설치된 익스텐션을 포함한다. 결과적으로 대부분의
쿠버네티스 사용자는 익스텐션을 설치할 필요가 없고, 새로운 익스텐션을 만들 필요가 있는 사용자는 더 적다.

### 익스텐션 패턴

쿠버네티스는 클라이언트 프로그램을 작성하여 자동화 되도록 설계되었다.
쿠버네티스 API를 읽고 쓰는 프로그램은 유용한 자동화를 제공할 수 있다.
*자동화* 는 클러스터 상에서 또는 클러스터 밖에서 실행할 수 있다. 이 문서의 지침에 따라
고가용성과 강력한 자동화를 작성할 수 있다.
자동화는 일반적으로 호스트 클러스터 및 매니지드 설치 환경을 포함한 모든
쿠버네티스 클러스터에서 작동한다.

쿠버네티스와 잘 작동하는 클라이언트 프로그램을 작성하기 위한 특정 패턴은
{{< glossary_tooltip term_id="controller" text="컨트롤러" >}} 패턴이라고 한다.
컨트롤러는 일반적으로 오브젝트의 `.spec`을 읽고, 가능한 경우 수행한 다음
오브젝트의 `.status`를 업데이트 한다.

컨트롤러는 쿠버네티스 API의 클라이언트이다. 쿠버네티스가 클라이언트이고 원격 서비스를 호출할 때,
쿠버네티스는 이를 *웹훅(Webhook)* 이라고 한다. 원격 서비스는 *웹훅 백엔드* 라고 한다.
커스텀 컨트롤러와 마찬가지로 웹훅은 새로운 장애 지점이 된다.

{{< note >}}
쿠버네티스와 별개로 "웹훅"이라는 용어는 일반적으로 비동기 알림 메커니즘을 의미한다.
이때 웹훅 호출은 다른 시스템 혹은 컴포넌트로 보내지는 단방향적인 알림의 역할을 수행한다.
쿠버네티스 생태계에서는 동기적인 HTTP 호출도
"웹훅"이라고 불린다.
{{< /note >}}

웹훅 모델에서 쿠버네티스는 원격 서비스에 네트워크 요청을 한다.
그 대안인 *바이너리 플러그인* 모델에서는 쿠버네티스에서 바이너리(프로그램)를 실행한다.
바이너리 플러그인은 kubelet(예: [CSI 스토리지 플러그인](https://kubernetes-csi.github.io/docs/)과
[CNI 네트워크 플러그인](/ko/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)) 및
kubectl에서 사용된다. ([플러그인으로 kubectl 확장](/ko/docs/tasks/extend-kubectl/kubectl-plugins/)을 참고하자.)

## 익스텐션 포인트

이 다이어그램은 쿠버네티스 클러스터의 익스텐션 포인트와 
그에 접근하는 클라이언트를 보여준다.

<!-- image source: https://docs.google.com/drawings/d/1k2YdJgNTtNfW7_A8moIIkij-DmVgEhNrn3y2OODwqQQ/view -->

{{< figure src="/docs/concepts/extend-kubernetes/extension-points.png"
    alt="쿠버네티스의 익스텐션 포인트를 7개의 숫자 심볼로 표시"
    class="diagram-large" caption="쿠버네티스 익스텐션 포인트" >}}

#### 그림의 핵심

1. 사용자는 종종 `kubectl`을 사용하여 쿠버네티스 API와 상호 작용한다. [플러그인](#client-extensions)을 통해
   클라이언트의 행동을 커스터마이징할 수 있다. 다양한 클라이언트들에 적용될 수 있는 일반적인 익스텐션도 있으며,
   `kubectl`을 확장하기 위한 구체적인 방법도 존재한다.

1. apiserver는 모든 요청을 처리한다. apiserver의 여러 유형의 익스텐션 포인트는 요청을 인증하거나,
   콘텐츠를 기반으로 요청을 차단하거나, 콘텐츠를 편집하고, 삭제 처리를 허용한다. 이 내용은
   [API 접근 익스텐션](#api-접근-익스텐션) 섹션에 설명되어 있다.

1. apiserver는 다양한 종류의 *리소스* 를 제공한다. `pod`와 같은 *빌트인 리소스 종류* 는
   쿠버네티스 프로젝트에 의해 정의되며 변경할 수 없다.
   쿠버네티스 API를 확장하는 것에 대한 내용은 [API 익스텐션](#api-익스텐션)에 설명되어 있다.

1. 쿠버네티스 스케줄러는 파드를 어느 노드에 배치할지 
   [결정](/ko/docs/concepts/scheduling-eviction/assign-pod-node/)한다. 스케줄링을 확장하는 몇 가지
   방법이 있으며, 이는 [스케줄링 익스텐션](#스케줄링-익스텐션) 섹션에 설명되어 있다.

1. 쿠버네티스의 많은 동작은 API-Server의 클라이언트인
   {{< glossary_tooltip term_id="controller" text="컨트롤러" >}}라는
   프로그램으로 구현된다. 컨트롤러는 종종 커스텀 리소스와 함께 사용된다.
   [새로운 API와 자동화의 결합](#combining-new-apis-with-automation)과
   [빌트인 리소스 변경](#빌트인-리소스-변경)에 설명되어 있다.

1. kubelet은 서버(노드)에서 실행되며 파드가 클러스터 네트워크에서 자체 IP를 가진 가상 서버처럼
   보이도록 한다. [네트워크 플러그인](#네트워크-플러그인)을 사용하면 다양한
   파드 네트워킹 구현이 가능하다.

1. [장치 플러그인](#device-plugins)을 사용하여 커스텀 하드웨어나 노드에 설치된 특수한 장치와 통합하고,
   클러스터에서 실행 중인 파드에서 사용 가능하도록 할 수 있다.
   kubelet을 통해 장치 플러그인를 조작할 수 있다.

   kubelet은 컨테이너의 {{< glossary_tooltip text="볼륨" term_id="volume" >}}을
   마운트 및 마운트 해제한다.
   [스토리지 플러그인](#storage-plugins)을 사용하여 새로운 종류의 스토리지와
   다른 볼륨 타입에 대한 지원을 추가할 수 있다.


#### 익스텐션 포인트 선택 순서도 {#extension-flowchart}

어디서부터 시작해야 할지 모르겠다면, 이 순서도가 도움이 될 수 있다. 일부 솔루션에는 
여러 유형의 익스텐션이 포함될 수 있다.

<!-- image source for flowchart: https://docs.google.com/drawings/d/1sdviU6lDz4BpnzJNHfNpQrqI9F19QZ07KnhnxVrp2yg/edit -->

{{< figure src="/docs/concepts/extend-kubernetes/flowchart.png"
    alt="유스케이스에 따른 질문과 가이드를 포함하는 순서도. 초록색 원은 예를 뜻하고, 빨간색 원은 아니오를 뜻함"
    class="diagram-large" caption="익스텐션 방법 선택을 가이드하기 위한 순서도" >}}

---

## 클라이언트 익스텐션 {#client-extensions}

kubectl을 위한 플러그인은 별도의 바이너리로 특정한 하위 명령어를 추가하거나 변경해준다.
또한 `kubectl` 은 [자격증명 플러그인](/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins)과 통합될 수도 있다.
이러한 익스텐션은 개별 사용자의 로컬 환경에만 영향을 주기 때문에 거시적인 정책을 강제할 수 없다.

`kubectl` 자체를 확장하는 방법은 [플러그인으로 kubectl 확장](/ko/docs/tasks/extend-kubectl/kubectl-plugins/)에 설명되어 있다.

## API 익스텐션

### 커스텀 리소스 데피니션

새 컨트롤러, 애플리케이션 구성 오브젝트 또는 기타 선언적 API를 정의하고 
`kubectl` 과 같은 쿠버네티스 도구를 사용하여 관리하려면 
쿠버네티스에 _커스텀 리소스_ 를 추가하자.
커스텀 리소스에 대한 자세한 내용은 
[커스텀 리소스](/ko/docs/concepts/extend-kubernetes/api-extension/custom-resources/) 개념 가이드를 참고하길 바란다.

### API 애그리게이션 레이어

쿠버네티스의 [API 애그리게이션 레이어](/ko/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)를 사용하면
[메트릭](/ko/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/) 등을 목적으로
쿠버네티스 API를 추가적인 서비스와 통합할 수 있다.

### 새로운 API와 자동화의 결합 {#combining-new-apis-with-automation}

사용자 정의 리소스 API와 컨트롤 루프의 조합을
{{< glossary_tooltip term_id="controller" text="컨트롤러" >}} 패턴이라고 한다.
만약 컨트롤러가 의도한 상태에 따라 인프라스트럭쳐를 배포하는 인간 오퍼레이터의 역할을 대신하고 있다면,
컨트롤러는 {{< glossary_tooltip text="오퍼레이터 패턴" term_id="operator-pattern" >}}을 따르고 있을지도 모른다.
오퍼레이터 패턴은 특정 애플리케이션을 관리하는 데 사용된다.
주로 이러한 애플리케이션들은 상태를 지니며 상태를 어떻게 관리해야 하는지에 관한 주의를 요한다.

또한 스토리지와 같은 다른 리소스를 관리하거나 접근 제어 제한 등의 정책을 정의하기 위해
커스텀 API와 제어 루프를 만드는 것도 가능하다.

### 빌트인 리소스 변경

사용자 정의 리소스를 추가하여 쿠버네티스 API를 확장하면 추가된 리소스는 항상
새로운 API 그룹에 속한다. 기존 API 그룹을 바꾸거나 변경할 수 없다.

API를 추가해도 기존 API(예: 파드)의 동작에 직접 영향을 미치지는 않지만 
_API 접근 익스텐션_ 은 영향을 준다.

## API 접근 익스텐션

요청이 쿠버네티스 API 서버에 도달하면 먼저 _인증_ 이 되고, 그런 다음 _인가_ 된 후 
다양한 유형의 _어드미션 컨트롤_ 을 거치게 된다. (사실, 일부 요청은 인증되지 않고 특별한 과정을 거친다.) 
이 흐름에 대한 자세한 내용은 [쿠버네티스 API에 대한 접근 제어](/ko/docs/concepts/security/controlling-access/)를 
참고하길 바란다.

쿠버네티스의 인증/인가 흐름의 각 단계는 익스텐션 포인트를 제공한다.

### 인증

[인증](/docs/reference/access-authn-authz/authentication/)은 모든 요청의 헤더 또는 인증서를
요청하는 클라이언트의 사용자 이름에 매핑한다.

쿠버네티스는 몇 가지 빌트인 인증 방법을 지원한다.
이러한 방법이 사용자 요구 사항을 충족시키지 못한다면
인증 프록시 뒤에 위치하면서 `Authorization:` 헤더로 받은 토큰을 원격 서비스로 보내 검증받는 
방법([인증 웹훅](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication))도 존재하므로, 참고하길 바란다.

### 인가

[인가](/ko/docs/reference/access-authn-authz/authorization/)는 특정 
사용자가 API 리소스에서 읽고, 쓰고, 다른 작업을 수행할 수 있는지를 결정한다. 전체 리소스 레벨에서 
작동하며 임의의 오브젝트 필드를 기준으로 구별하지 않는다. 

빌트인 인증 옵션이 사용자의 요구를 충족시키지 못하면
[인가 웹훅](/docs/reference/access-authn-authz/webhook/)을 
통해 사용자가 제공한 코드를 호출하여 인증 결정을 내릴 수 있다.

### 동적 어드미션 컨트롤

요청이 승인된 후, 쓰기 작업인 경우 
[어드미션 컨트롤](/docs/reference/access-authn-authz/admission-controllers/) 단계도 수행된다. 
빌트인 단계 외에도 몇 가지 익스텐션이 있다.

* [이미지 정책 웹훅](/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)은 
  컨테이너에서 실행할 수 있는 이미지를 제한한다.
* 임의의 어드미션 컨트롤 결정을 내리기 위해 일반적인 
  [어드미션 웹훅](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)을 
  사용할 수 있다. 어드미션 웹훅은 생성 또는 업데이트를 거부할 수 있다.
  어떤 어드미션 웹훅은 쿠버네티스에 의해 처리되기 전에 들어오는 요청의 데이터에 변경을 가할 수도 있다.

## 인프라스트럭처 익스텐션

### 장치 플러그인 {#device-plugins}

_장치 플러그인_ 은 노드가 [장치 플러그인](/ko/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)을
통해 (CPU 및 메모리와 같은 빌트인 자원 외에 추가적으로) 새로운 노드 리소스를
발견할 수 있게 해준다.

### 스토리지 플러그인 {#storage-plugins}

{{< glossary_tooltip text="컨테이너 스토리지 인터페이스" term_id="csi" >}} (CSI) 플러그인은
새로운 종류의 볼륨을 지원하도록 쿠버네티스를 확장할 수 있게 해준다.
볼륨은 내구성 높은 외부 스토리지에 연결되거나, 일시적인 스토리지를 제공하거나,
파일시스템 패러다임을 토대로 정보에 대한 읽기 전용 인터페이스를 제공할 수도 있다.

또한 쿠버네티스는 (CSI를 권장하며) v1.23부터 사용 중단된 
[FlexVolume](/ko/docs/concepts/storage/volumes/#flexvolume-deprecated) 플러그인에 대한 지원도 포함한다.

FlexVolume 플러그인은 쿠버네티스에서 네이티브하게 지원하지 않는 볼륨 종류도 마운트할 수 있도록 해준다.
FlexVolume 스토리지에 의존하는 파드를 실행하는 경우 kubelet은 바이너리 플러그인을 호출하여 볼륨을 마운트한다.
아카이브된 [FlexVolume](https://git.k8s.io/design-proposals-archive/storage/flexvolume-deployment.md) 디자인 제안은 이러한 접근방법에 대한 자세한 설명을 포함하고 있다.

스토리지 플러그인에 대한 전반적인 정보는 
[스토리지 업체를 위한 쿠버네티스 볼륨 플러그인 FAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors)에서 
찾을 수 있다.

### 네트워크 플러그인

제대로 동작하는 파드 네트워크와 쿠버네티스 네트워크 모델의 다양한 측면을 지원하기 위해
쿠버네티스 클러스터는 _네트워크 플러그인_ 을 필요로 한다.

[네트워크 플러그인](/ko/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)을 통해
쿠버네티스는 다양한 네트워크 토폴로지 및 기술을 활용할 수 있게 된다.

### 스케줄링 익스텐션

스케줄러는 파드를 감시하고 파드를 노드에 할당하는 특수한 유형의
컨트롤러이다. 다른 쿠버네티스 컴포넌트를 계속 사용하면서
기본 스케줄러를 완전히 교체하거나,
[여러 스케줄러](/ko/docs/tasks/extend-kubernetes/configure-multiple-schedulers/)를
동시에 실행할 수 있다.

이것은 중요한 부분이며, 거의 모든 쿠버네티스 사용자는 스케줄러를 수정할
필요가 없다는 것을 알게 된다.

어떤 [스케줄링 플러그인](/ko/docs/reference/scheduling/config/#scheduling-plugins)을 활성화시킬지 제어하거나,
플러그인들을 다른 이름의 [스케줄러 프로파일](/ko/docs/reference/scheduling/config/#여러-프로파일)과 연결지을 수도 있다.
kube-scheduler의 [익스텐션 포인트](/docs/concepts/scheduling-eviction/scheduling-framework/#extension-points) 중 
하나 이상과 통합되는 플러그인을 직접 작성할 수도 있다.

마지막으로 빌트인 `kube-scheduler` 컴포넌트는 원격 HTTP 백엔드 (스케줄러 익스텐션)에서 
kube-scheduler가 파드를 위해 선택한 노드를
필터링하고 우선하도록 지정할 수 있도록 하는
[웹훅](https://git.k8s.io/design-proposals-archive/scheduling/scheduler_extender.md)을 지원한다.

{{< note >}}
노드 필터링과 노트 우선순위에 영향을 미치는 것은
스케줄러 인스텐션 웹훅을 통해서만 가능하다.
다른 익스텐션 포인트는 웹훅 통합으로 제공되지 않는다.
{{< /note >}}

## {{% heading "whatsnext" %}}

* 인프라스트럭처 익스텐션에 대해 더 알아보기
  * [장치 플러그인](/ko/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  * [네트워크 플러그인](/ko/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
  * CSI [스토리지 플러그인](https://kubernetes-csi.github.io/docs/)
* [kubectl 플러그인](/ko/docs/tasks/extend-kubectl/kubectl-plugins/)에 대해 알아보기
* [커스텀 리소스](/ko/docs/concepts/extend-kubernetes/api-extension/custom-resources/)에 대해 더 알아보기
* [익스텐션 API 서버](/ko/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)에 대해 알아보기
* [동적 어드미션 컨트롤](/docs/reference/access-authn-authz/extensible-admission-controllers/)에 대해 알아보기
* [오퍼레이터 패턴](/ko/docs/concepts/extend-kubernetes/operator/)에 대해 알아보기
