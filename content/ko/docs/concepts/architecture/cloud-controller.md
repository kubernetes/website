---
title: 클라우드 컨트롤러 매니저
content_type: concept
weight: 40
---

<!-- overview -->

{{< feature-state state="beta" for_k8s_version="v1.11" >}}

클라우드 인프라스트럭처 기술을 통해 퍼블릭, 프라이빗 및 하이브리드 클라우드에서 쿠버네티스를 실행할 수 있다.
쿠버네티스는 컴포넌트 간의 긴밀한 결합 없이 자동화된 API 기반 인프라스트럭처를
지향한다.

{{< glossary_definition term_id="cloud-controller-manager" length="all" prepend="클라우드 컨트롤러 매니저는">}}

클라우드 컨트롤러 매니저는 다양한 클라우드 공급자가 자신의
플랫폼에 쿠버네티스를 통합할 수 있도록 하는 플러그인 메커니즘으로 구성된다.

<!-- body -->

## 디자인

![쿠버네티스 컴포넌트](/images/docs/components-of-kubernetes.svg)

클라우드 컨트롤러 매니저는 컨트롤 플레인에서 복제된 여러 프로세스로 구성되어 실행되며, 
일반적으로 각 프로세스는 파드 내 컨테이너로 실행된다. 각 클라우드 컨트롤러 매니저는 단일
프로세스에 여러 {{< glossary_tooltip text="컨트롤러" term_id="controller" >}}를
구현한다.


{{< note >}}
또한 사용자는 클라우드 컨트롤러 매니저를 컨트롤 플레인의 일부가 아닌 쿠버네티스
{{< glossary_tooltip text="애드온" term_id="addons" >}}으로
실행할 수도 있다.
{{< /note >}}

## 클라우드 컨트롤러 매니저의 기능 {#functions-of-the-ccm}

클라우드 컨트롤러 매니저의 내부 컨트롤러에는 다음 컨트롤러들이 포함된다.

### 노드 컨트롤러

노드 컨트롤러는 클라우드 인프라스트럭처에 새 서버가 생성될 때 {{< glossary_tooltip text="노드" term_id="node" >}}
오브젝트를 업데이트하는 역할을 한다. 노드 컨트롤러는 클라우드 공급자의 사용자
테넌시 내에서 실행되는 호스트에 대한 정보를 가져온다. 노드 컨트롤러는 다음 기능들을 수행한다.

1. 클라우드 공급자 API를 통해 획득한 해당 서버의 고유 ID를 노드 오브젝트에 업데이트한다.
1. 클라우드 관련 정보(예를 들어, 노드가 배포되는 지역과 사용 가능한 리소스(CPU, 메모리 등))를
   사용해서 노드 오브젝트에 어노테이션을 추가하고 레이블을 설정한다.
1. 노드의 호스트 이름과 네트워크 주소를 가져온다.
1. 노드의 상태를 확인한다. 노드가 응답하지 않는 경우, 이 컨트롤러는 
   클라우드 공급자의 API를 통해 서버가 비활성화되었는지, 삭제되었는지, 종료되었는지 확인한다.
   노드가 클라우드에서 삭제된 경우, 컨트롤러는 쿠버네티스 클러스터에서 노드
   오브젝트를 삭제한다.

일부 클라우드 공급자의 구현에서는 이를 노드 컨트롤러와 별도의 노드
라이프사이클 컨트롤러로 분리한다.

### 라우트 컨트롤러

라우트 컨트롤러는 쿠버네티스 클러스터의 다른 노드에
있는 각각의 컨테이너가 서로 통신할 수 있도록 클라우드에서
라우트를 적절히 구성한다.

클라우드 공급자에 따라 라우트 컨트롤러는 파드 네트워크
IP 주소 블록을 할당할 수도 있다.

### 서비스 컨트롤러

{{< glossary_tooltip text="서비스" term_id="service" >}} 는 관리형 로드밸런서,
IP 주소, 네트워크 패킷 필터링 그리고 대상 상태 확인과 같은
클라우드 인프라스트럭처 컴포넌트와 통합된다. 서비스 컨트롤러는 클라우드
공급자 API와 상호 작용해서 필요한 서비스 리소스를 선언할 때
로드밸런서와 기타 인프라스트럭처 컴포넌트를 설정한다.

## 인가

이 섹션에서는 클라우드 컨트롤러 매니저가 작업을 수행하기 위해
다양한 API 오브젝트에 필요한 접근 권한을 세분화한다.

### 노드 컨트롤러 {#authorization-node-controller}

노드 컨트롤러는 노드 오브젝트에서만 작동한다. 노드 오브젝트를 읽고
수정하기 위해 전체 접근 권한이 필요하다.

`v1/Node`:

- get
- list
- create
- update
- patch
- watch
- delete

### 라우트 컨트롤러 {#authorization-route-controller}

라우트 컨트롤러가 노드 오브젝트의 생성을 수신하고 적절하게
라우트를 구성한다. 노드 오브젝트에 대한 접근 권한이 필요하다.

`v1/Node`:

- Get

### 서비스 컨트롤러 {#authorization-service-controller}

서비스 컨트롤러는 서비스 오브젝트 **생성**과 **업데이트**, **삭제** 이벤트를 수신한 후,
해당 서비스에 대한 로드밸런서를 적절하게 구성한다.

서비스에 접근하려면, **목록**과 **감시** 접근 권한이 필요하다. 서비스를 업데이트하려면, 
`status` 서브리소스에 접근하기 위해서는 **패치**와 **업데이트** 접근 권한이 필요하다.


`v1/Service`:

- List
- Get
- Watch
- Patch
- Update

### 기타 {#authorization-miscellaneous}

클라우드 컨트롤러 매니저의 핵심 구현을 위해 이벤트 오브젝트를 생성하고, 안전한 작동을 보장하기 위해 서비스어카운트를 생성해야 한다.

`v1/Event`:

- Create
- Patch
- Update

`v1/ServiceAccount`:

- Create

클라우드 컨트롤러 매니저의 {{< glossary_tooltip term_id="rbac" text="RBAC" >}}
클러스터롤(ClusterRole)은 다음과 같다.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cloud-controller-manager
rules:
- apiGroups:
  - ""
  resources:
  - events
  verbs:
  - create
  - patch
  - update
- apiGroups:
  - ""
  resources:
  - nodes
  verbs:
  - '*'
- apiGroups:
  - ""
  resources:
  - nodes/status
  verbs:
  - patch
- apiGroups:
  - ""
  resources:
  - services
  verbs:
  - list
  - watch
- apiGroups:
  - ""
  resources:
  - services/status
  verbs:
  - patch
  - update
- apiGroups:
  - ""
  resources:
  - serviceaccounts
  verbs:
  - create
- apiGroups:
  - ""
  resources:
  - persistentvolumes
  verbs:
  - get
  - list
  - update
  - watch
```


## {{% heading "whatsnext" %}}

* [클라우드 컨트롤러 매니저 관리](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager)에는
  클라우드 컨트롤러 매니저의 실행과 관리에 대한 지침을 제공한다.

* 클라우드 컨트롤러 매니저를 사용하기 위해 HA 컨트롤 플레인을 업그레이드하려면, 
  [클라우드 컨트롤러 매니저를 사용하기 위해 복제된 컨트롤 플레인 마이그레이션하기](/docs/tasks/administer-cluster/controller-manager-leader-migration/)를 참고한다.

* 자체 클라우드 컨트롤러 매니저를 구현하거나 기존 프로젝트를 확장하는 방법을 알고 싶은가?

  - 클라우드 컨트롤러 매니저는 Go 인터페이스를 사용함으로써, 어떠한 클라우드에 대한 구현체라도 플러그인될 수 있도록 한다. 구체적으로는, 
    [kubernetes/cloud-provider](https://github.com/kubernetes/cloud-provider)의 
    [`cloud.go`](https://github.com/kubernetes/cloud-provider/blob/release-1.21/cloud.go#L42-L69)에 
    정의된 `CloudProvider` 인터페이스를 사용한다.
  - 이 문서에서 강조된 공유 컨트롤러(노드와 라우트, 서비스)의 구현과 
    공유 cloudprovider 인터페이스를 포함한 일부 스캐폴딩은 쿠버네티스 코어에 포함된다. 클라우드 공급자별 구현은 쿠버네티스 코어 외부에 있으며 `CloudProvider` 인터페이스를 구현한다.
  - 플러그인 개발에 대한 자세한 내용은 
    [클라우드 컨트롤러 매니저 개발하기](/docs/tasks/administer-cluster/developing-cloud-controller-manager/)를 참조한다.
