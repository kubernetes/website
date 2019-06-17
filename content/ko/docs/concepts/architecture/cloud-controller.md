---
title: 클라우트 컨트롤러 매니저 기반에 관한 개념
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

클라우드 컨트롤러 매니저(CCM) 개념(바이너리와 혼동하지 말 것)은 본래 클라우드 벤더에 특화된 코드와 쿠버네티스 코어가 상호 독립적으로 진화할 수 있도록 해주기 위해 생성되었다. 클라우드 컨트롤러 매니저는 쿠버네티스 컨트롤러 매니저, API 서버, 그리고 스케줄러와 같은 다른 마스터 컴포넌트와 함께 동작된다. 또한 쿠버네티스 위에서 동작하는 경우에는, 쿠버네티스 애드온으로서 구동된다.

클라우드 컨트롤러 매니저의 디자인은 새로운 클라우드 제공사업자가 플러그인을 이용하여 쉽게 쿠버네티스와 함께 통합하도록 허용해 주는 플러그인 메커니즘을 토대로 한다. 쿠버네티스에 새로운 클라우드 제공사업자를 적응시키기 위한 그리고 기존 모델에서 새로운 CCM 모델로 클라우드 제공사업자들이 전환을 이루기 위한 준비된 계획들이 있다.

이 문서는 클라우드 컨트롤러 매니저 이면상의 개념들을 논의하고 그것과 연관된 기능들에 대한 세부적인 사항들을 제시한다.

다음은 클라우드 컨트롤러 매니저가 존재하지 않는 형태의 쿠버네티스 클러스터 아키텍처이다.

![Pre CCM Kube Arch](/images/docs/pre-ccm-arch.png)

{{% /capture %}}


{{% capture body %}}

## 디자인

이전 다이어그램에서, 쿠버네티스와 클라우드 제공사업자는 여러 상이한 컴포넌트들을 통해 통합되었다.

* Kubelet
* 쿠버네티스 컨트롤러 매니저
* 쿠버네티스 API 서버

CCM은 앞의 세 컴포넌트가 가진 클라우드 의존적인 로직을 한 곳에 모아서 클라우드 통합을 위한 단일 포인트를 만들었다. CCM을 활용한 새로운 아키텍처는 다음과 같다.

![CCM Kube Arch](/images/docs/post-ccm-arch.png)

## CCM의 컴포넌트

CCM은 쿠버네티스 컨트롤러 매니저(KCM)의 기능 일부를 독립시키고 분리된 프로세스로서 그것을 작동시킨다. 특히, 클라우드 종속적인 KCM 내 컨트롤러들을 독립시킨다. KCM은 다음과 같은 클라우드 종속적인 컨트롤러 루프를 가진다.

 * 노드 컨트롤러
 * 볼륨 컨트롤러
 * 라우트 컨트롤러
 * 서비스 컨트롤러

버전 1.9 에서, CCM은 이전 리스트로부터 다음의 컨트롤러를 작동시킨다.

* 노드 컨트롤러
* 라우트 컨트롤러
* 서비스 컨트롤러

{{< note >}}
볼륨 컨트롤러는 의도적으로 CCM의 일부가 되지 않도록 선택되었다. 연관된 복잡성 때문에 그리고 벤더 특유의 볼륨 로직 개념을 일반화 하기 위한 기존의 노력때문에, 볼륨 컨트롤러는 CCM으로 이전되지 않도록 결정되었다.
{{< /note >}}

CCM을 이용하는 볼륨을 지원하기 위한 원래 계획은 플러그형 볼륨을 지원하기 위한 Flex 볼륨을 사용하기 위한 것이었다. 그러나, CSI라 알려진 경쟁적인 노력이 Flex를 대체하도록 계획되고 있다.

이러한 역동성을 고려하여, CSI가 준비될 때까지 차이점에 대한 측정은 도중에 중지하기로 결정하였다.

## CCM의 기능

CCM은 클라우드 제공사업자에 종속적인 쿠버네티스 컴포넌트로부터 그 속성을 상속받는다. 이번 섹션은 그러한 컴포넌트를 근거로 구성되었다.

### 1. 쿠버네티스 컨트롤러 매니저

CCM의 주요 기능은 KCM으로부터 파생된다. 이전 섹션에서 언급한 바와 같이, CCM은 다음의 컨트롤러 루프를 작동시킨다.

* 노드 컨트롤러
* 라우트 컨트롤러
* 서비스 컨트롤러

#### 노드 컨트롤러

노드 컨트롤러는 클라우드 제공사업자의 클러스터에서 동작중인 노드에 대한 정보를 얻음으로써 노드를 초기화할 책임을 가진다. 노드 컨트롤러는 다음 기능을 수행한다.

1. 클라우드 특유의 영역/지역 레이블을 이용한 노드를 초기화한다.
2. 클라우드 특유의 인스턴스 세부사항, 예를 들어, 타입 그리고 크기 등을 이용한 노드를 초기화한다.
3. 노드의 네트워크 주소와 호스트네임을 취득한다.
4. 노드가 무응답일 경우, 클라우드로부터 해당 노드가 삭제된 것인지 확인한다. 클라우드로부터 삭제된 것이라면, 쿠버네티스 노드 오브젝트를 삭제한다.

#### 라우트 컨트롤러

라우트 컨트롤러는 클라우드에서 적합하게 경로를 구성하는 책임을 가지며 쿠버네티스 클러스터 내 상이한 노드 상의 컨테이너들이 상호 소통할 수 있도록 해준다. 라우트 컨트롤러는 오직 Google Compute Engine 클러스터에서만 적용가능 하다.

#### 서비스 컨트롤러

서비스 컨트롤러는 서비스 생성, 업데이트, 그리고 이벤트 삭제에 대한 책임을 가진다. 쿠버네티스 내 서비스의 현재 상태를 근거로, 쿠버네티스 내 서비스의 상태를 나타내기 위해 클라우드 로드 밸런서(ELB, Google LB, Oracle Cloud Infrastrucutre LB와 같은)를 구성해준다. 추가적으로, 클라우드 로드 밸런서를 위한 서비스 백엔드가 최신화 되도록 보장해 준다.

### 2. Kubelet

노드 컨트롤러는 kubelet의 클라우드 종속적인 기능을 포함한다. CCM이 도입되기 이전에는, kubelet 이 IP 주소, 지역/영역 레이블 그리고 인스턴스 타입 정보와 같은 클라우드 특유의 세부사항으로 노드를 초기화하는 책임을 가졌다. CCM의 도입으로 kubelet에서 CCM으로 이 초기화 작업이 이전되었다.

이 새로운 모델에서, kubelet은 클라우드 특유의 정보 없이 노드를 초기화 해준다. 그러나, kubelet은 새로 생성된 노드에 taint를 추가해서 CCM이 클라우드에 대한 정보를 가지고 노드를 초기화하기 전까지는 스케줄되지 않도록 한다. 그러고 나서 이 taint를 제거한다.  

## 플러그인 메커니즘

클라우드 컨트롤러 매니저는 어떠한 클라우드에서든지 플러그 인 되어 구현될 수 있도록 Go 인터페이스를 이용한다. 구체적으로, [여기](https://github.com/kubernetes/cloud-provider/blob/9b77dc1c384685cb732b3025ed5689dd597a5971/cloud.go#L42-L62)에 정의된 CloudProvider 인터페이스를 이용한다.

위에서 강조되었던 4개의 공유 컨트롤러의 구현, 그리고 공유 cloudprovider 인터페이스와 더불어 일부 골격은 쿠버네티스 코어 내에 유지될 것이다. 클라우드 제공사업자 특유의 구현은 코어의 외부에 탑재되어 코어 내에 정의된 인터페이스를 구현할 것이다.

개발 중인 플러그인에 대한 보다 자세한 정보는, [클라우드 컨트롤러 매니저 개발하기](/docs/tasks/administer-cluster/developing-cloud-controller-manager/)를 참고한다.

## 인가

이 섹션은 CCM에 의해 작업을 수행하기 위해 다양한 API 오브젝트에서 요구되는 접근에 대해 구분해 본다.

### 노드 컨트롤러

노드 컨트롤러는 오직 노드 오브젝트와 동작한다. 노드 오브젝트를 get, list, create, update, patch, watch, 그리고 delete 하기 위한 모든 접근을 요한다.

v1/Node:

- Get
- List
- Create
- Update
- Patch
- Watch
- Delete

### 라우트 컨트롤러

라우트 컨트롤러는 노드 오브젝트 생성에 대해 귀기울이고 적절하게 라우트를 구성한다. 노드 오브젝트에 대한 get 접근을 요한다.

v1/Node:

- Get

### 서비스 컨트롤러

서비스 컨트롤러는 서비스 오브젝트 create, update 그리고 delete에 대해 귀기울이고, 서비스를 위해 적절하게 엔드포인트를 구성한다.

서비스에 접근하기 위해, list, 그리고 watch 접근을 요한다. 서비스 update를 위해 patch와 update 접근을 요한다.

서비스에 대한 엔드포인트 설정을 위해, create, list, get, watch, 그리고 update를 하기위한 접근을 요한다.

v1/Service:

- List
- Get
- Watch
- Patch
- Update

### 그 외의 것들

CCM의 코어에 대한 구현은 이벤트를 create 하고, 보안 작업을 보장하기 위한 접근을 요하며, ServiceAccount를 create 하기 위한 접근을 요한다.

v1/Event:

- Create
- Patch
- Update

v1/ServiceAccount:

- Create

CCM에 대한 RBAC ClusterRole은 다음과 같다.

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
  - patch
  - update
  - watch
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
- apiGroups:
  - ""
  resources:
  - endpoints
  verbs:
  - create
  - get
  - list
  - watch
  - update
```

## 벤더 구현사항

다음은 클라우드 제공사업자들이 구현한 CCM들이다.

* [Digital Ocean](https://github.com/digitalocean/digitalocean-cloud-controller-manager)
* [Oracle](https://github.com/oracle/oci-cloud-controller-manager)
* [Azure](https://github.com/kubernetes/cloud-provider-azure)
* [GCP](https://github.com/kubernetes/cloud-provider-gcp)
* [AWS](https://github.com/kubernetes/cloud-provider-aws)
* [BaiduCloud](https://github.com/baidu/cloud-provider-baiducloud)
* [Linode](https://github.com/linode/linode-cloud-controller-manager)

## 클러스터 관리

CCM을 구성하고 작동하기 위한 전체 안내는 [여기](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager)에서 제공된다.

{{% /capture %}}
