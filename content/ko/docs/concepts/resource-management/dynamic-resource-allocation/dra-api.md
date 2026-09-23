---
# reviewers:
# - klueska
# - pohly
title: DRA API 오브젝트
content_type: concept
weight: 10
api_metadata:
- apiVersion: "resource.k8s.io/v1"
  kind: "ResourceClaim"
- apiVersion: "resource.k8s.io/v1"
  kind: "ResourceClaimTemplate"
- apiVersion: "resource.k8s.io/v1"
  kind: "DeviceClass"
- apiVersion: "resource.k8s.io/v1"
  kind: "ResourceSlice"
---

<!-- overview -->

이 페이지에서는 동적 리소스 할당(DRA)이 디바이스를 분류하고 요청하며 할당할 때
사용하는 쿠버네티스 API 종류를 설명한다.

<!-- body -->

## DRA 용어 {#terminology}

DRA는 핵심 할당 기능을 제공하기 위해 다음 쿠버네티스 API 종류를 사용한다.
이러한 API 종류는 모두 `resource.k8s.io/v1`
{{< glossary_tooltip text="API 그룹" term_id="api-group" >}}에 포함된다.

디바이스클래스(DeviceClass)
: 클레임할 수 있는 디바이스의 범주와 클레임에서 특정 디바이스 속성을 선택하는 방법을
  정의한다. 디바이스클래스 파라미터는 리소스슬라이스에서 0개 이상의 디바이스와
  일치할 수 있다. 디바이스클래스에서 디바이스를 클레임하려면
  리소스클레임에서 특정 디바이스 속성을 선택한다.

리소스클레임(ResourceClaim)
: 클러스터에서 디바이스와 같이 연결된 리소스에 접근하기 위한 요청을
  설명한다. 리소스클레임은 파드가 특정 리소스에 접근할 수 있도록 한다.
  리소스클레임은 워크로드 운영자가 생성하거나 리소스클레임템플릿을
  기반으로 쿠버네티스가 생성할 수 있다.

리소스클레임템플릿(ResourceClaimTemplate)
: 쿠버네티스가 워크로드의 파드별 리소스클레임을 생성하는 데
  사용하는 템플릿을 정의한다. 리소스클레임템플릿을 사용하면
  파드가 서로 분리된 유사한 리소스에 접근할 수 있다.
  쿠버네티스가 템플릿에서 생성하는 각 리소스클레임은 특정 파드에 바인딩된다.
  파드가 종료되면 쿠버네티스가 해당 리소스클레임을 삭제한다.

리소스슬라이스(ResourceSlice)
: 디바이스와 같이 노드에 연결된 하나 이상의 리소스를 나타낸다.
  드라이버가 클러스터에서 리소스슬라이스를 생성하고 관리한다. 리소스클레임이
  생성되어 파드에서 사용되면, 쿠버네티스는 리소스슬라이스를 사용하여
  클레임된 리소스에 접근할 수 있는 노드를 찾는다. 쿠버네티스는 리소스를
  리소스클레임에 할당하고, 리소스에 접근할 수 있는 노드에 파드를
  스케줄링한다.

### 디바이스클래스 {#deviceclass}

디바이스클래스는 클러스터 관리자나 디바이스 드라이버가 클러스터 내 디바이스 범주를
정의할 수 있도록 한다. 디바이스클래스는 운영자에게 요청할 수 있는 디바이스와 해당 디바이스를
요청하는 방법을 알려준다.
[공통 표현식 언어(Common Expression Language, CEL)](https://cel.dev)를 사용하여
특정 속성을 기준으로 디바이스를 선택할 수 있다. 디바이스클래스를 참조하는
리소스클레임은 디바이스클래스에서 특정 구성들을 요청할 수 있다.

디바이스클래스를 생성하려면
[클러스터에서 DRA 설정하기](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster)를 참고한다.

### 리소스클레임 및 리소스클레임템플릿 {#resourceclaims-templates}

리소스클레임은 워크로드에 필요한 리소스를 정의한다. 모든 리소스클레임에는
디바이스클래스를 참조하고 해당 디바이스클래스에서 디바이스를 선택하는 _requests_ 가
있다. 리소스클레임은 특정 요구 사항을 충족하는 디바이스를 필터링하기 위해 _selectors_ 를
사용하고, 요청을 충족할 수 있는 디바이스를 제한하기 위해 _constraints_ 를 사용할 수도 있다.
리소스클레임은 워크로드 운영자가 생성하거나
리소스클레임템플릿을 기반으로 쿠버네티스가 생성할 수 있다. 리소스클레임템플릿은
쿠버네티스가 파드에 대한 리소스클레임을 자동 생성하는 데 사용할 수 있는
템플릿을 정의한다.

#### 리소스클레임 및 리소스클레임템플릿의 사용 사례 {#when-to-use-rc-rct}

사용할 방법은 다음과 같이 요구 사항에 따라 달라진다.

* **리소스클레임**: 여러 파드가 특정 디바이스에 대한 접근을 공유하도록 하려는
  경우. 생성하는 리소스클레임의 라이프사이클을 수동으로 관리한다.
* **리소스클레임템플릿**: 파드가 서로 분리되고 유사하게 구성된 디바이스에
  독립적으로 접근하도록 하려는 경우. 쿠버네티스는 리소스클레임템플릿의
  명세에서 리소스클레임을 생성한다. 생성되는 각 리소스클레임의 수명은 해당
  파드의 수명에 종속된다.
* [**파드그룹(PodGroup) 리소스클레임템플릿**](#workload-resource-claims):
  {{< glossary_tooltip text="파드그룹" term_id="podgroup" >}} 내 파드들이 유사하게 구성된
  디바이스를 서로 공유하고, 다른 파드그룹과는 분리된
  디바이스에 접근하도록 하려는 경우. 쿠버네티스는 리소스클레임템플릿의
  명세에서 파드그룹에 대한 리소스클레임 하나를 생성한다.
  생성되는 각 리소스클레임의 수명은 해당 파드그룹의 수명에
  종속된다. 이 기능을 사용하려면
  [`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)
  기능을 활성화해야 한다.

워크로드를 정의할 때는
{{< glossary_tooltip term_id="cel" text="공통 표현식 언어" >}}
를 사용하여 특정 디바이스 속성이나 용량을 필터링할 수 있다. 필터링에 사용할 수 있는
파라미터는 디바이스와 드라이버에 따라 다르다.

파드에서 특정 리소스클레임을 직접 참조하는 경우 해당 리소스클레임이 파드와
동일한 네임스페이스에 이미 존재해야 한다. 리소스클레임이 네임스페이스에
존재하지 않으면 파드를 스케줄링할 수 없다. 이는 파드가 참조하는
퍼시스턴트볼륨클레임(PersistentVolumeClaim)이 파드와 동일한 네임스페이스에
존재해야 하는 방식과 유사하다.

파드에서 자동 생성된 리소스클레임을 참조할 수 있지만, 자동 생성된
리소스클레임은 생성을 트리거한 파드 또는 파드그룹의 수명에 종속되므로
권장하지 않는다.

이러한 방법 중 하나로 리소스를 클레임하려면
[DRA를 사용하여 워크로드에 디바이스 할당하기](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/)를 참고한다.

#### 우선순위 목록 {#prioritized-list}

{{< feature-state feature_gate_name="DRAPrioritizedList" >}}

리소스클레임 또는 리소스클레임템플릿의 요청에 대해 우선순위가 지정된 하위
요청 목록을 제공할 수 있다. 그러면 스케줄러가 할당할 수 있는 첫 번째 하위 요청을
선택한다. 이를 통해 기본 선택 항목을 사용할 수 없는 경우 워크로드에서 사용할
수 있는 대체 디바이스를 지정할 수 있다.

다음 예시에서 리소스클레임템플릿은 검은색이고 크기가 큰 디바이스를 요청한다.
이러한 속성을 가진 디바이스를 사용할 수 없으면 파드를 스케줄링할 수 없다. 우선순위
목록 기능을 사용하면 두 번째 대안을 지정할 수 있다. 이 대안은 흰색이고 크기가
작은 디바이스 2개를 요청한다. 큰 검은색 디바이스를 사용할 수 있으면 해당 디바이스를
할당한다. 큰 검은색 디바이스를 사용할 수 없지만 작은 흰색 디바이스 2개를 사용할 수
있으면 파드를 계속 실행할 수 있다.

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaimTemplate
metadata:
  name: prioritized-list-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        firstAvailable:
        - name: large-black
          deviceClassName: resource.example.com
          selectors:
          - cel:
              expression: |-
                device.attributes["resource-driver.example.com"].color == "black" &&
                device.attributes["resource-driver.example.com"].size == "large"
        - name: small-white
          deviceClassName: resource.example.com
          selectors:
          - cel:
              expression: |-
                device.attributes["resource-driver.example.com"].color == "white" &&
                device.attributes["resource-driver.example.com"].size == "small"
          count: 2
```

파드를 배치할 수 있는 노드가 여러 개라면, 스케줄러는 각 우선순위 목록에서
선택된 하위 요청이 몇 번째 항목인지도 노드 점수에 반영한다.
따라서 목록 앞쪽의 하위 요청이 지정한 디바이스를 할당할 수 있는 노드가
목록 뒤쪽 하위 요청의 디바이스만 할당할 수 있는 노드보다
선택될 가능성이 높다.

결정은 파드별로 이루어지므로, 파드가 레플리카셋(ReplicaSet) 또는 이와 유사한
그룹의 구성원인 경우 그룹의 모든 구성원에 동일한 하위 요청이 선택된다고
확신할 수 없다. 워크로드는 이러한 상황을 수용할 수 있어야 한다.

#### 워크로드 리소스클레임 {#workload-resource-claims}

{{< feature-state feature_gate_name="DRAWorkloadResourceClaims" >}}

[워크로드 API](/docs/concepts/workloads/workload-api/)를 사용하여 파드를
구성하면, 개별 파드 대신 전체
{{< glossary_tooltip text="파드그룹" term_id="podgroup" >}}에 대해
리소스클레임을 예약하고 단일 파드 대신
파드그룹에 대한 리소스클레임템플릿을 생성할 수 있다.
이렇게 하면 파드그룹 내 파드가 생성된 리소스클레임에 할당된
디바이스에 대한 접근을 공유할 수 있다.

이 기능이 해결하려는 문제는 두 가지다:

- 리소스클레임 API의 `status.reservedFor` 목록에는 최대 256개의 항목만
  포함할 수 있다. kube-scheduler는 이 목록에 개별 파드만 기록하므로, 최대 256개의
  파드만 리소스클레임을 공유할 수 있다. `status.reservedFor`에 파드그룹을
  기록할 수 있도록 하면 256개를 훨씬 넘는 파드가 리소스클레임을 공유할 수 있다.
- 파드는 정확한 이름을 알고 있을 때만 리소스클레임을 공유할 수 있다. 파드
  _그룹_ 을 복제하는 복잡한 워크로드의 경우, 각 그룹의 파드가 공유하는
  리소스클레임은 그룹 집합이 확장되고 축소될 때 명시적으로 생성하고 삭제해야
  한다. 각 파드그룹에 대한 리소스클레임을 생성하면 하나의
  리소스클레임템플릿을 기반으로 리소스클레임을 자동으로 복제하면서도
  파드그룹 내 파드 간에 공유할 수 있다.

파드그룹 API는 파드 API의 `spec.resourceClaims` 필드와 동일한 구조와
유사한 의미를 갖는 `spec.resourceClaims` 필드를 정의한다:

```yaml
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  name: training-group
  namespace: some-ns
spec:
  ...
  resourceClaims:
  - name: pg-claim
    resourceClaimName: my-pg-claim
  - name: pg-claim-template
    resourceClaimTemplateName: my-pg-template
```

파드의 클레임 항목과 마찬가지로, `resourceClaimName`을 지정한 파드그룹의
클레임 항목은 이름으로 리소스클레임을 참조한다. `resourceClaimTemplateName`을
지정한 항목은 리소스클레임템플릿을 참조한다. 이 템플릿을 바탕으로 파드그룹
전체에서 파드들이 공유할 리소스클레임 하나가 생성된다.

파드가 `name`, `resourceClaimName`,
`resourceClaimTemplateName`이 모두 해당 파드그룹의 `spec.resourceClaims` 중
하나와 일치하는 클레임을 정의하면, kube-scheduler는 파드 대신 파드그룹에
대해 리소스클레임을 예약한다. 파드의 클레임 항목이 파드그룹의 클레임 항목과
일치하지 않으면 kube-scheduler는 파드에 대해 리소스클레임을 예약한다.
두 경우 모두 예약은 리소스클레임의 `status.reservedFor`에 기록된다.
파드그룹 예약과 해당 리소스 할당은 그룹에
더 이상 파드가 없더라도 파드그룹이 삭제될 때까지
리소스클레임에 유지된다.

파드그룹의 클레임 항목과 일치하는 파드의 클레임 항목에
`resourceClaimTemplateName`이 지정되어 있으면 파드그룹에
리소스클레임 하나가 생성된다. 그룹 내 다른 파드가 같은 클레임 항목을
정의하면 파드마다 새 리소스클레임을 생성하는 대신 이를 공유한다.
`resourceClaimTemplateName`이 지정된 클레임 항목이 파드그룹의 항목과
일치하는지 여부와 관계없이 생성된 리소스클레임의 이름은 파드의
`status.resourceClaimStatuses`에 기록된다.

파드그룹의 클레임 항목 중 해당 리소스클레임템플릿을 참조하는 항목이 있고,
[`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)
기능 게이트가 활성화된 경우에만 리소스클레임이 생성된다.
기능이 비활성화된 경우 파드별 리소스클레임을 생성하는 대신
리소스클레임을 생성하지 않는다. 이렇게 하면 클러스터 업그레이드나
`kube-apiserver`와 `kube-controller-manager` 간 기능 롤아웃/롤백 중에
불필요한 파드별 리소스클레임이 생성되는 것을 방지할 수 있다.

파드그룹에 대해 리소스클레임템플릿에서 생성된 리소스클레임은
파드그룹의 라이프사이클을 따른다. 파드그룹과 해당
리소스클레임템플릿이 모두 존재할 때 리소스클레임이 처음 생성된다.
파드그룹이 삭제되고 리소스클레임이
더 이상 예약되지 않으면 리소스클레임이 삭제된다.

다음 예시를 살펴본다:

```yaml
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  name: training-group
  namespace: some-ns
spec:
  ...
  resourceClaims:
  - name: pg-claim
    resourceClaimName: my-pg-claim
  - name: pg-claim-template
    resourceClaimTemplateName: my-pg-template
---
apiVersion: v1
kind: Pod
metadata:
  name: training-group-pod-1
  namespace: some-ns
spec:
  ...
  schedulingGroup:
    podGroupName: training-group
  resourceClaims:
  - name: pod-claim
    resourceClaimName: my-pod-claim
  - name: pod-claim-template
    resourceClaimTemplateName: my-pod-template
  - name: pg-claim
    resourceClaimName: my-pg-claim
  - name: pg-claim-template
    resourceClaimTemplateName: my-pg-template
```

이 예시에서 `training-group` 파드그룹에는 `training-group-pod-1`이라는 파드가
하나 있다. 파드의 `pod-claim` 및 `pod-claim-template` 클레임 항목은
파드그룹의 클레임 항목과 일치하지 않으므로 파드그룹의 영향을
받지 않는다. 리소스클레임 `my-pod-claim`은 파드에 예약되고,
리소스클레임템플릿 `my-pod-template`에서 리소스클레임이 생성되어 파드에
예약된다. `pg-claim` 및 `pg-claim-template` 클레임 항목은 파드그룹의
클레임 항목과 일치한다. 리소스클레임 `my-pg-claim`은
파드그룹에 예약되고, 리소스클레임템플릿 `my-pg-template`에서 리소스클레임이 생성되어
파드그룹에 예약된다.

워크로드 API 리소스와 리소스클레임의 연결은
`kube-apiserver`, `kube-controller-manager`, `kube-scheduler`, `kubelet`에 있는
[`DRAWorkloadResourceClaims` 기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)가 제어한다.

### 리소스슬라이스 {#resourceslice}

각 리소스슬라이스는 풀에 있는 하나 이상의
{{< glossary_tooltip term_id="device" text="디바이스" >}}를 나타낸다. 풀은
리소스슬라이스를 생성하고 관리하는 디바이스 드라이버가 관리한다. 풀의 리소스는
하나의 리소스슬라이스로 나타내거나 여러 리소스슬라이스에 걸쳐 나타낼 수
있다.

리소스슬라이스는 디바이스 사용자와 스케줄러에 유용한 정보를 제공하며,
동적 리소스 할당에 필수적이다. 모든 리소스슬라이스에는 다음 정보가 포함되어야
한다:

* **리소스 풀**: 드라이버가 관리하는 하나 이상의 리소스 그룹이다.
  풀은 둘 이상의 리소스슬라이스에 걸쳐 있을 수 있다. 풀의 리소스 변경 사항은
  해당 풀의 모든 리소스슬라이스에 전파되어야 한다.
  풀을 관리하는 디바이스 드라이버는 이러한 전파가
  이루어지도록 할 책임이 있다.
* **디바이스**: 관리되는 풀의 디바이스이다. 리소스슬라이스에는 풀의 모든 디바이스 또는
  풀에 있는 디바이스의 일부를 나열할 수 있다. 리소스슬라이스는 속성, 버전,
  용량과 같은 디바이스 정보를 정의한다.
  디바이스 사용자는 리소스클레임 또는 디바이스클래스에서 디바이스 정보를 필터링하여
  할당할 디바이스를 선택할 수 있다.
* **노드**: 리소스에 접근할 수 있는 노드이다. 드라이버는 클러스터의 모든 노드,
  이름이 지정된 단일 노드, 특정 노드 레이블이 있는 노드 등 어떤 노드가
  리소스에 접근할 수 있는지 선택할 수 있다.

드라이버는 {{< glossary_tooltip text="컨트롤러" term_id="controller" >}}를 사용하여
드라이버가 게시할 정보와 클러스터의 리소스슬라이스를 조정한다. 이 컨트롤러는
클러스터 사용자가 리소스슬라이스를 생성하거나 수정하는 것과 같은 수동 변경을
덮어쓴다.

다음은 리소스슬라이스의 예시다:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: cat-slice
spec:
  driver: "resource-driver.example.com"
  pool:
    generation: 1
    name: "black-cat-pool"
    resourceSliceCount: 1
  # allNodes 필드는 클러스터의 모든 노드가 디바이스에 접근할 수 있는지 정의한다.
  allNodes: true
  devices:
  - name: "large-black-cat"
    attributes:
      color:
        string: "black"
      size:
        string: "large"
      cat:
        bool: true
```
이 리소스슬라이스는 `black-cat-pool` 풀에서
`resource-driver.example.com` 드라이버가 관리한다. `allNodes: true` 필드는 클러스터의
모든 노드가 디바이스에 접근할 수 있음을 나타낸다. 리소스슬라이스에는
`large-black-cat`이라는 디바이스 하나가 있으며, 다음 속성을 가진다:

* `color`: `black`
* `size`: `large`
* `cat`: `true`

디바이스클래스는 이러한 속성을 사용하여 이 리소스슬라이스를 선택할 수 있고,
리소스클레임은 해당 디바이스클래스에서 특정 디바이스를 필터링할 수 있다.

#### 이름 지정 및 우선순위 {#resourceslice-naming-and-prioritization}

쿠버네티스 스케줄러가 할당을 위해 디바이스를 평가하는 순서는 리소스슬라이스와
리소스 풀 이름을 사전식으로 정렬하여 결정한다. 스케줄러는 최초 적합 전략을
사용한다. 즉, 클레임의 요구 사항을 충족하는 사용 가능한 첫 번째 디바이스를
선택한다.

이를 통해 풀과 리소스슬라이스에 할당된 이름으로
리소스 할당의 우선순위에 영향을 줄 수 있다. 단,
[바인딩 조건](/docs/concepts/resource-management/dynamic-resource-allocation/how-dra-works/#device-binding-conditions)이 없는 풀은
이름과 관계없이 항상 바인딩 조건이 있는 풀보다
먼저 평가된다.

`k8s.io/dynamic-resources/kubeletplugin` Go 패키지 또는 해당 모듈의
리소스슬라이스 컨트롤러를 사용하여 빌드한 드라이버의 경우, 이들 컴포넌트는
드라이버가 지정한 순서로 평가되도록 리소스슬라이스 이름을 자동으로 처리한다.

## 관리자 접근 {#admin-access}

{{< feature-state feature_gate_name="DRAAdminAccess" >}}

유지 관리 및 문제 해결 작업에 필요한 특권 기능을 사용할 수 있도록 리소스클레임 또는
리소스클레임템플릿의 요청을 표시할 수 있다.
관리자 접근 권한이 있는 요청은 사용 중인 디바이스에 접근할 수 있게 하며 컨테이너에서
디바이스를 사용할 수 있게 할 때 추가 권한을 활성화할 수도 있다:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaimTemplate
metadata:
  name: large-black-cat-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        exactly:
          deviceClassName: resource.example.com
          allocationMode: All
          adminAccess: true
```

관리자 접근은 특권 모드이므로 멀티테넌트 클러스터의 일반 사용자에게
부여해서는 안 된다.
`resource.kubernetes.io/admin-access: "true"` 레이블(대소문자 구분)이 지정된
네임스페이스에서 리소스클레임 또는 리소스클레임템플릿 오브젝트를 생성하도록
권한을 부여받은 사용자만 `adminAccess` 필드를 사용할 수 있다. 이를 통해 일반
사용자가 이 기능을 오용할 수 없도록 한다.

관리자 접근은
[`DRAAdminAccess` 기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/#DRAAdminAccess)에 의해
`kube-apiserver`, `kube-scheduler`, `kubelet`에서 제어된다.


## 목록 유형 속성 {#list-type-attributes}

{{< feature-state feature_gate_name="DRAListTypeAttributes" >}}

이 기능은 리소스슬라이스 API를 개선하여 DRA 드라이버가 디바이스 속성에 스칼라 값만 지정하는 대신 목록 값을 지정할 수 있도록 한다.
이는 CPU가 여러 PCIe 루트에 인접하는 경우처럼 더 복잡한 내부 노드 토폴로지를 모델링하는 데 유용하다.

리소스클레임 작성자(최종 사용자)에게 이는 이러한 경우 `matchAttribute` 및 `distinctAttribute`가 더 잘 작동한다는 의미다.

- `matchAttribute` — 두 속성은 동일해야 하는 것이 아니라 *비어 있지 않은 목록의 교집합*을 가져야 한다(스칼라 값은 단일 항목 목록으로 처리된다).
  즉 한 드라이버가 PCIe 루트에 단일 값을 게시하고 다른 드라이버가 목록을 게시하는 경우,
  단일 값이 목록의 어딘가에 포함되어 있으면 제약 조건이 충족된다.
- `distinctAttribute` — 속성 값은 *쌍별로 서로 겹치지 않아야 한다*(두 디바이스 간에 공유되는 값이 없어야 한다).

리소스클레임 작성자가 목록일 수 있는 속성을 CEL 표현식에서 사용할 수 있도록, 이 기능은 `includes()` CEL 함수도 도입한다.

```
# 스칼라 속성(하위 호환)
# 가정: device.attributes["dra.example.com"].model = "model-a"
device.attributes["dra.example.com"].model.includes("model-a")  # true
device.attributes["dra.example.com"].model.includes("model-b")  # false

# 목록 유형 속성(DRAListTypeAttributes 필요)
# 가정: device.attributes["dra.example.com"].supported-models= ["model-a", "model-b"]
device.attributes["dra.example.com"].supported-models.includes("model-a")  # true
device.attributes["dra.example.com"].supported-models.includes("model-c")  # false
```

### DRA 드라이버 작성자 세부 정보

기본적으로 각 `DeviceAttribute`는 부울, 정수, 문자열 또는 시맨틱 버전 문자열 중
하나의 스칼라 값만 보유한다. `DRAListTypeAttributes` 기능 게이트는
`DeviceAttribute`에 네 가지 목록 유형 필드를 추가하여, 디바이스가 하나의 속성에 대해
여러 값을 알릴 수 있도록 한다:

- **`bools`** — 부울 값 목록
- **`ints`** — 64비트 정수 값 목록
- **`strings`** — 문자열 목록(각 문자열은 최대 64자)
- **`versions`** — semver.org 사양 2.0.0에 따른 시맨틱 버전 문자열 목록
  (각 문자열은 최대 64자)

디바이스당 개별 속성 값의 총 개수(스칼라 필드와 모든 목록
요소의 합계)는 **48**개로 제한된다. 리소스슬라이스의 디바이스가 이 기능 또는 테인트(taint)와
같은 다른 고급 기능을 사용하는 경우, 해당 리소스슬라이스에는 최대 **64**개의
디바이스만 포함할 수 있다. 목록 유형 속성 또는 테인트와 같은 다른 고급 기능을 사용한다.

다음은 목록 유형 문자열 속성을 사용하여 여러 지원 모델을 알리는 디바이스의
예시다:

```yaml
kind: ResourceSlice
apiVersion: resource.k8s.io/v1
metadata:
  name: example-resourceslice
spec:
  nodeName: worker-1
  pool:
    name: pool
    generation: 1
    resourceSliceCount: 1
  driver: dra.example.com
  devices:
  - name: gpu-0
    attributes:
      dra.example.com/supported-models:
        strings:
        - model-a
        - model-b
```

목록 유형 속성은
[`DRAListTypeAttributes` 기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/#DRAListTypeAttributes)에 의해
`kube-apiserver`와 `kube-scheduler`에서 제어된다.

## 파생 속성 {#derived-attributes}

{{< feature-state feature_gate_name="DRADerivedAttributes" >}}

`matchAttribute` 및 `distinctAttribute` 제약 조건은 일반적으로
디바이스가 정확히 동일한 이름의 속성을 게시해야 한다. GPU 드라이버가
`pcie_locality`를 게시하고 NIC 드라이버가 `pcie_root`를 게시하는 경우(또는
`numa0-pcie1`과 같은 문자열에 동일한 정보를 담는 경우), 스케줄러는
이것이 같은 의미라는 것을 인식할 방법이 없으므로, 두 드라이버의 디바이스는
공유 속성 이름에 먼저 합의하지 않으면
같은 노드에 배치할 수 없다.

`derivedAttributes`를 사용하면 드라이버가 공유 속성 이름을 표준화할 때까지
기다리지 않고 이 차이를 인라인으로 연결할 수 있다.
요청의
`.spec.devices.requests[].exactly` 또는 `.spec.devices.requests[].firstAvailable[]` 아래에
하나 이상의 `derivedAttributes` 항목을 추가한다. 각 항목은
스케줄러가 해당 요청의 모든 후보 디바이스에 대해 평가하는 CEL 표현식을 정의한다.
그 결과는
`matchAttribute` 또는 `distinctAttribute` 제약 조건에서 드라이버가 제공한 디바이스 속성과
동일한 방식으로 참조할 수 있는 가상 속성이 된다.

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaim
metadata:
  name: gpu-nic-numa-alignment
spec:
  devices:
    requests:
    - name: gpu
      exactly:
        deviceClassName: gpu.example.com
        count: 1
        derivedAttributes:
        - name: derived/numa
          expression: device.attributes["gpu.example.com"].numa
    - name: nic
      exactly:
        deviceClassName: nic.example.com
        count: 1
        derivedAttributes:
        - name: derived/numa
          expression: device.attributes["nic.example.com"].numaNode
    constraints:
    - requests: ["gpu", "nic"]
      matchAttribute: derived/numa
```

이 예시에서 `gpu`와 `nic` 드라이버는 토폴로지 정보를
서로 다른 속성 이름(`numa`와 `numaNode`)으로 게시한다.
각 요청은 자체 디바이스의 속성에서 공통 `derived/numa` 값을
계산하고, 실제 드라이버들이 공통 속성 이름을 사용하기로
합의한 적이 없더라도 `matchAttribute` 제약 조건은
이 가상 속성을 기준으로 두 요청을 맞춘다.

`derivedAttributes`에 대해 알아둘 몇 가지 사항은 다음과 같다:

- **이름 지정**: `name`은 DNS 서브도메인 뒤에 `/`와 C
  식별자가 오는 형식이어야 하며, 드라이버가 제공하는 속성 이름에 사용하는 형식과
  같다(예: `example.com/numaNode` 또는 `derived/numaNode`). 이름이
  드라이버가 이미 게시한 속성의 이름과 일치하면,
  제약 조건을 일치시킬 때 파생 속성의 값이 드라이버 제공 속성의 값을 덮어쓴다.
  의도하지 않은 덮어쓰기를 방지하려면 어떤 드라이버도 사용하지 않을 도메인 접두사
  (예: `derived/`)를 사용한다.
  요청당 최대 32개의 파생 속성을 정의할 수 있다.
- **제약 조건에서 사용해야 함**: 모든 파생 속성은
  해당 속성을 정의하는 요청(또는 하위 요청)에 적용되는 하나 이상의
  `matchAttribute` 또는 `distinctAttribute` 제약 조건에서 참조되어야 한다.
  그렇지 않으면 리소스클레임의 유효성 검사에 실패한다.
- **평가 범위 및 순서**: `expression`은
  요청 자체의 CEL 셀렉터(`.selectors[].cel`)가 해당 디바이스를
  이미 필터링한 후, 각 후보 디바이스에 대해 한 번 평가된다. 따라서
  파생 속성은 셀렉터 표현식에서 참조할 수 없으며,
  CEL 환경에서 `device.attributes`를 통해 노출되지 않는다.
- **반환 유형**: `expression`은 스칼라(`string`, `int`, `bool` 또는
  시맨틱 버전)로 평가되어야 한다. 다만 `DRAListTypeAttributes` 기능 게이트도
  활성화된 경우에는 이러한 스칼라 유형 중 하나의 목록으로 평가될 수도 있다.
- **비용 제한**: 각 표현식에는 최대 길이와 CEL 평가 예상 비용 제한이
  있다. 또한 단일 스케줄링 시도에 추가되는 총 오버헤드를 제한하기 위해
  리소스클레임의 모든 `derivedAttributes` 표현식에 대한 예상 비용 합계에도
  제한이 적용된다. 이러한 제한 중 하나라도 초과하면
  리소스클레임이 거부된다.
- **런타임 오류로 스케줄링 중단**: 디바이스에 없는 속성을 참조하는 등의 이유로
  후보 디바이스에 대한 표현식 평가가 실패하면, 스케줄러는 해당 디바이스를
  조용히 건너뛰지 않고 할당을 중단한다. 파드는
  스케줄링되지 않는다. 표현식은 방어적으로 작성해야 한다.
  예를 들어 속성을 읽기 전에
  해당 속성이 존재하는지 확인한다.

파생 속성은
[`DRADerivedAttributes` 기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/#DRADerivedAttributes)에 의해
`kube-apiserver`와 `kube-scheduler`에서 제어된다.

DRA 드라이버가 게시할 수 있는 표준 디바이스 속성 목록은
[표준 디바이스 속성](/docs/reference/node/dra-standard-device-attributes/)
문서에서 확인할 수 있다.

## DRA를 통한 확장 리소스 할당 {#extended-resource}

{{< feature-state feature_gate_name="DRAExtendedResource" >}}

디바이스클래스에 확장 리소스 이름을 제공할 수 있다. 그러면 스케줄러가
확장 리소스 요청에 대해 해당 클래스와 일치하는 디바이스를 선택한다.
이를 통해 사용자는 파드의 확장 리소스 요청을 계속 사용하여 장치 플러그인이 제공하는
확장 리소스 또는 DRA 디바이스를 요청할 수 있다. 동일한 확장 리소스는 하나의 클러스터 노드에서
장치 플러그인 또는 DRA 중 하나가 제공할 수 있다.
동일한 클러스터의 일부 노드에서는 장치 플러그인이, 다른 노드에서는 DRA가 동일한 확장 리소스를 제공할 수도 있다.

다음 예시에서 디바이스클래스에는 `example.com/gpu`라는 extendedResourceName이
지정되어 있다. 파드가 확장 리소스 `example.com/gpu: 2`를 요청하면, 디바이스클래스와
일치하는 디바이스가 2개 이상 있는 노드에 배치될 수 있다.

```yaml
apiVersion: resource.k8s.io/v1
kind: DeviceClass
metadata:
  name: gpu.example.com
spec:
  selectors:
  - cel:
      expression: device.driver == 'gpu.example.com' && device.attributes['gpu.example.com'].type
        == 'gpu'
  extendedResourceName: example.com/gpu
```

또한 사용자는 리소스클레임을 명시적으로 생성하지 않고도 디바이스를 할당하기 위해
특수한 확장 리소스를 사용할 수 있다. 확장 리소스 이름 접두사
`deviceclass.resource.kubernetes.io/`와 디바이스클래스 이름을 사용한다.
이 방법은 확장 리소스 이름을 지정하지 않은 디바이스클래스를 포함하여 모든
디바이스클래스에서 사용할 수 있다. 결과 리소스클레임에는 지정된 수의 해당
디바이스클래스 디바이스에 대한 `ExactCount` 요청이 포함된다.

DRA를 통한 확장 리소스 할당은
[`DRAExtendedResource` 기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/#DRAExtendedResource)에 의해
`kube-apiserver`, `kube-scheduler`, `kube-controller-manager`, `kubelet`에서 제어된다.

확장 리소스를 요청하는 실습은
[컨테이너에 확장 리소스 할당하기](/docs/tasks/configure-pod-container/extended-resource/)를 참고한다.
