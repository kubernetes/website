---
# reviewers:
# - caesarxuchao
# - dchen1107
title: 노드
api_metadata:
- apiVersion: "v1"
  kind: "Node"
content_type: concept
weight: 10
---

<!-- overview -->

쿠버네티스는 컨테이너를 파드내에 배치하고 _노드_ 에서 실행함으로 {{< glossary_tooltip text="워크로드" term_id="workload" >}}를 구동한다.
노드는 클러스터에 따라 가상 또는 물리적 머신일 수 있다. 각 노드는
{{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}}에 
의해 관리되며
{{< glossary_tooltip text="파드" term_id="pod" >}}를
실행하는 데 필요한 서비스를 포함한다.

일반적으로 클러스터에는 여러 개의 노드가 있으며, 학습 또는 리소스가 제한되는
환경에서는 하나만 있을 수도 있다.

노드의 [컴포넌트](/ko/docs/concepts/overview/components/#노드-컴포넌트)에는
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}},
{{< glossary_tooltip text="컨테이너 런타임" term_id="container-runtime" >}}
그리고 {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}가 포함된다.

<!-- body -->

## 관리

{{< glossary_tooltip text="API 서버" term_id="kube-apiserver" >}}에 노드를 추가하는 두가지 주요 방법이 있다.

1. 노드의 kubelet으로 컨트롤 플레인에 자체 등록
2. 사용자(또는 다른 사용자)가 노드 오브젝트를 수동으로 추가

노드 {{< glossary_tooltip text="오브젝트" term_id="object" >}} 또는 노드의 kubelet으로 자체 등록한 후
컨트롤 플레인은 새 노드 오브젝트가 유효한지 확인한다.
예를 들어 다음 JSON 매니페스트에서 노드를 만들려는 경우이다.

```json
{
  "kind": "Node",
  "apiVersion": "v1",
  "metadata": {
    "name": "10.240.79.157",
    "labels": {
      "name": "my-first-k8s-node"
    }
  }
}
```

쿠버네티스는 내부적으로 노드 오브젝트를 생성한다(표시한다). 쿠버네티스는
kubelet이 노드의 `metadata.name` 필드와 일치하는 API 서버에 등록이 되어 있는지 확인한다.
노드가 정상이면(예를 들어 필요한 모든 서비스가 실행중인 경우) 파드를 실행할 수 있게 된다.
그렇지 않으면, 해당 노드는 정상이 될 때까지 모든 클러스터 활동에
대해 무시된다.

{{< note >}}
쿠버네티스는 유효하지 않은 노드 오브젝트를 유지하고, 노드가
정상적인지 확인한다.

상태 확인을 중지하려면 사용자 또는 {{< glossary_tooltip term_id="controller" text="컨트롤러">}}에서
노드 오브젝트를 명시적으로 삭제해야 한다.
{{< /note >}}

노드 오브젝트의 이름은 유효한
[DNS 서브도메인 이름](/ko/docs/concepts/overview/working-with-objects/names/#dns-서브도메인-이름)이어야 한다.

### 노드 이름 고유성

[이름](/ko/docs/concepts/overview/working-with-objects/names#names)은 노드를 식별한다. 두 노드는
동시에 같은 이름을 가질 수 없다. 쿠버네티스는 또한 같은 이름의 리소스가
동일한 객체라고 가정한다. 노드의 경우, 동일한 이름을 사용하는 인스턴스가 동일한
상태(예: 네트워크 설정, 루트 디스크 내용)와 노드 레이블과 같은 동일한 속성(attribute)을
갖는다고 암시적으로 가정한다. 인스턴스가
이름을 변경하지 않고 수정된 경우 이로 인해 불일치가 발생할 수 있다. 노드를 대폭 교체하거나
업데이트해야 하는 경우, 기존 노드 오브젝트를 먼저 API 서버에서 제거하고
업데이트 후 다시 추가해야 한다.

### 노드에 대한 자체-등록(self-registration)

kubelet 플래그 `--register-node`가 참(기본값)일 경우, kubelet은 API 서버에
스스로 등록을 시도할 것이다. 이는 선호되는 패턴이며, 대부분의 배포판에서 사용된다.

자체-등록에 대해, kubelet은 다음 옵션과 함께 시작된다.

  - `--kubeconfig` - apiserver에 스스로 인증하기 위한 자격증명에 대한 경로.
  - `--cloud-provider` - 자신에 대한 메터데이터를 읽기 위해 어떻게 
    {{< glossary_tooltip text="클라우드 제공자" term_id="cloud-provider" >}}와 소통할지에 대한 방법.
  - `--register-node` - 자동으로 API 서버에 등록.
  - `--register-with-taints` - 주어진 {{< glossary_tooltip text="테인트(taint)" term_id="taint" >}} 
    리스트(콤마로 분리된 `<key>=<value>:<effect>`)를 가진 노드 등록.

    `register-node`가 거짓이면 동작 안 함.
  - `--node-ip` - 선택적인, 쉼표로 구분된 노드의 IP 주소의 리스트. 
    각 주소 체계마다 하나의 주소만 지정 가능.
    예를 들어, 단일 스택 IPv4 클러스터에서는 kubelet이 노드의 주소로 쓸 수 있게 IPv4 주소로 설정함.
    
    이중 스택 클러스터 실행에 관한 상세 정보는 [IPv4/IPv6 이중 스택 구성](/ko/docs/concepts/services-networking/dual-stack/#ipv4%2Fipv6-이중-스택-구성)을 참고.

    이 인자를 사용하지 않으면 kubelet은 노드의 기본 IPv4 주소를 사용함.
    만약 노드가 IPv4 주소가 없으면 kubelet은 노드의 기본 IPv6 주소를 사용함.
  - `--node-labels` - 클러스터에 노드를 등록할 때 추가 할 
    {{< glossary_tooltip text="레이블" term_id="label" >}}
    ([NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)에 의해 적용되는 레이블 제한 사항 참고).
  - `--node-status-update-frequency` - 얼마나 자주 kubelet이 API 서버에 해당 노드 상태를 게시할 지 정의.

[Node authorization mode](/docs/reference/access-authn-authz/node/)와
[NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)이 활성화 되면,
각 kubelet은 자신이 속한 노드의 리소스에 대해서만 생성/수정할 권한을 가진다.

{{< note >}}
[노드 이름 고유성](#노드-이름-고유성) 섹션에서 언급했듯이,
노드 구성을 업데이트해야 하는 경우 API 서버에 노드를
다시 등록하는 것이 좋다. 예를 들어 kubelet이 `--node-labels`의 새로운 구성으로
다시 시작되더라도, 동일한 노드 이름이 사용된 경우
레이블이 해당 노드의 등록에 설정되기 때문에 변경 사항이 적용되지 않는다.

노드에 이미 스케줄된 파드는 해당 노드 구성이 kubelet 재시작에 의해 변경된 경우
오작동하거나 문제를 일으킬 수 있다. 예를 들어 이미 실행 중인 파드가 노드에
할당된 새 레이블에 대해 테인트(taint)될 수 있는 반면 해당 파드와 호환되지 않는 다른 파드는
새 레이블을 기반으로 스케줄링된다. 노드 재등록(re-registration)은 모든 파드를
비우고(drain) 다시 적절하게 스케줄링되도록
한다.
{{< /note >}}

#### 수동 노드 관리

{{< glossary_tooltip text="kubectl" term_id="kubectl" >}}을
사용해서 노드 오브젝트를 생성하고 수정할 수 있다.

노드 오브젝트를 수동으로 생성하려면 kubelet 플래그를 `--register-node=false` 로 설정한다.

`--register-node` 설정과 관계 없이 노드 오브젝트를 수정할 수 있다.
예를 들어 기존 노드에 레이블을 설정하거나, 스케줄 불가로 표시할 수 있다.

파드의 노드 셀렉터와 함께 노드의 레이블을 사용해서 스케줄링을 제어할 수 있다.
예를 들어, 사용 가능한 노드의 하위 집합에서만 실행되도록
파드를 제한할 수 있다.

노드를 스케줄 불가로 표시하면 스케줄러가 해당 노드에 새 파드를 배치할 수 없지만,
노드에 있는 기존 파드에는 영향을 미치지 않는다.
이는 노드 재부팅 또는 기타 유지보수 준비 단계에서 유용하다.

노드를 스케줄 불가로 표시하려면 다음을 실행한다.

```shell
kubectl cordon $NODENAME
```

보다 자세한 내용은 [안전하게 노드를 드레인(drain)하기](/docs/tasks/administer-cluster/safely-drain-node/)
를 참고한다.

{{< note >}}
{{< glossary_tooltip term_id="daemonset" >}}에 포함되는 일부 파드는
스케줄 불가 노드에서 실행될 수 있다. 일반적으로 데몬셋은 워크로드 애플리케이션을
비우는 경우에도 노드에서 실행되어야 하는 노드 로컬 서비스를 제공한다.
{{< /note >}}

## 노드 상태

노드의 상태는 다음의 정보를 포함한다.

* [주소](/ko/docs/reference/node/node-status/#addresses)
* [컨디션](/ko/docs/reference/node/node-status/#condition)
* [용량과 할당가능](/ko/docs/reference/node/node-status/#capacity)
* [정보](/ko/docs/reference/node/node-status/#info)

`kubectl` 을 사용해서 노드 상태와 기타 세부 정보를 볼수 있다.

```shell
kubectl describe node <insert-node-name-here>
```

자세한 정보는 [노드 상태](/ko/docs/reference/node/node-status/)를 참고.

## 노드 하트비트

쿠버네티스 노드가 보내는 하트비트는 클러스터가 개별 노드가 가용한지를
판단할 수 있도록 도움을 주고, 장애가 발견된 경우 조치를 할 수 있게한다.

노드에는 두 가지 형태의 하트비트가 있다.

* 노드의 `.status`에 대한 업데이트
* `kube-node-lease`
  {{< glossary_tooltip term_id="namespace" text="네임스페이스">}}
  내의 [리스(Lease)](/docs/reference/kubernetes-api/cluster-resources/lease-v1/)
  오브젝트. 각 노드는 연관된 리스 오브젝트를 갖는다.

## 노드 컨트롤러

노드 {{< glossary_tooltip text="컨트롤러" term_id="controller" >}}는
노드의 다양한 측면을 관리하는 쿠버네티스 컨트롤 플레인 컴포넌트이다.

노드 컨트롤러는 노드가 생성되어 유지되는 동안 다양한 역할을 한다. 첫째는 등록 시점에
(CIDR 할당이 사용토록 설정된 경우) 노드에 CIDR 블럭을 할당하는 것이다.

두 번째는 노드 컨트롤러의 내부 노드 리스트를 클라우드 제공사업자의
사용 가능한 머신 리스트 정보를 근거로 최신상태로 유지하는 것이다. 클라우드 환경에서
동작 중일 경우, 노드상태가 불량할 때마다, 노드 컨트롤러는
해당 노드용 VM이 여전히 사용 가능한지에 대해 클라우드 제공사업자에게 묻는다. 사용 가능하지 않을 경우,
노드 컨트롤러는 노드 리스트로부터 그 노드를 삭제한다.

세 번째는 노드의 동작 상태를 모니터링하는 것이다. 노드 컨트롤러는
다음을 담당한다.

- 노드가 접근 불가능(unreachable) 상태가 되는 경우, 
  노드의 `.status` 필드의 `Ready` 컨디션을 업데이트한다. 
  이 경우에는 노드 컨트롤러가 `Ready` 컨디션을 `Unknown`으로 설정한다.
- 노드가 계속 접근 불가능 상태로 남아있는 경우, 해당 노드의 모든 파드에 대해서
  [API를 이용한 축출](/ko/docs/concepts/scheduling-eviction/api-eviction/)을
  트리거한다. 기본적으로, 노드 컨트롤러는 노드를
  `Unknown`으로 마킹한 뒤 5분을 기다렸다가
  최초의 축출 요청을 시작한다. 

기본적으로, 노드 컨트롤러는 5 초마다 각 노드의 상태를 체크한다.
체크 주기는 `kube-controller-manager` 구성 요소의 
`--node-monitor-period` 플래그를 이용하여 설정할 수 있다.

### 축출 빈도 제한

 대부분의 경우, 노드 컨트롤러는 초당 `--node-eviction-rate`(기본값 0.1)로
축출 속도를 제한한다. 이 말은 10초당 1개의 노드를 초과하여
파드 축출을 하지 않는다는 의미가 된다.

노드 축출 행위는 주어진 가용성 영역 내 하나의 노드가 상태가 불량할
경우 변화한다. 노드 컨트롤러는 영역 내 동시에 상태가 불량한 노드의 퍼센티지가 얼마나 되는지
체크한다(`Ready` 컨디션은 `Unknown` 또는
`False` 값을 가진다).

- 상태가 불량한 노드의 비율이 최소 `--unhealthy-zone-threshold`
  (기본값 0.55)가 되면 축출 속도가 감소한다.
- 클러스터가 작으면 (즉 `--large-cluster-size-threshold`
  노드 이하면 - 기본값 50) 축출이 중지된다.
- 이외의 경우, 축출 속도는 초당
  `--secondary-node-eviction-rate`(기본값 0.01)로 감소된다.

이 정책들이 가용성 영역 단위로 실행되어지는 이유는 나머지가 연결되어 있는 동안
하나의 가용성 영역이 컨트롤 플레인으로부터 분할되어 질 수도 있기 때문이다.
만약 클러스터가 여러 클라우드 제공사업자의 가용성 영역에 걸쳐 있지 않는 이상,
축출 매커니즘은 영역 별 가용성을 고려하지 않는다.

노드가 가용성 영역들에 걸쳐 퍼져 있는 주된 이유는 하나의 전체 영역이
장애가 발생할 경우 워크로드가 상태 양호한 영역으로 이전되어질 수 있도록 하기 위해서이다.
그러므로, 하나의 영역 내 모든 노드들이 상태가 불량하면 노드 컨트롤러는
`--node-eviction-rate` 의 정상 속도로 축출한다. 코너 케이스란 모든 영역이
완전히 상태불량(클러스터 내 양호한 노드가 없는 경우)한 경우이다.
이러한 경우, 노드 컨트롤러는 컨트롤 플레인과 노드 간 연결에 문제가
있는 것으로 간주하고 축출을 실행하지 않는다. (중단 이후 일부 노드가
다시 보이는 경우 노드 컨트롤러는 상태가 양호하지 않거나 접근이 불가능한
나머지 노드에서 파드를 축출한다.)

또한, 노드 컨트롤러는 파드가 테인트를 허용하지 않을 때 `NoExecute` 테인트 상태의
노드에서 동작하는 파드에 대한 축출 책임을 가지고 있다.
추가로, 노드 컨틀로러는 연결할 수 없거나, 준비되지 않은 노드와 같은 노드 문제에 상응하는
{{< glossary_tooltip text="테인트" term_id="taint" >}}를 추가한다.
이는 스케줄러가 비정상적인 노드에 파드를 배치하지 않게 된다.

## 리소스 용량 추적 {#node-capacity}

노드 오브젝트는 노드 리소스 용량에 대한 정보: 예를 들어, 사용 가능한 메모리의
양과 CPU의 수를 추적한다.
노드의 [자체 등록](#노드에-대한-자체-등록)은 등록하는 중에 용량을 보고한다.
[수동](#수동-노드-관리)으로 노드를 추가하는 경우 추가할 때
노드의 용량 정보를 설정해야 한다.

쿠버네티스 {{< glossary_tooltip text="스케줄러" term_id="kube-scheduler" >}}는
노드 상에 모든 노드에 대해 충분한 리소스가 존재하도록 보장한다. 스케줄러는 노드 상에
컨테이너에 대한 요청의 합이 노드 용량보다 더 크지 않도록 체크한다.
요청의 합은 kubelet에서 관리하는 모든 컨테이너를 포함하지만, 컨테이너 런타임에
의해 직접적으로 시작된 컨 테이너는 제외되고 kubelet의 컨트롤 범위
밖에서 실행되는 모든 프로세스도 제외된다.

{{< note >}}
파드 형태가 아닌 프로세스에 대해 명시적으로 리소스를 확보하려면,
[시스템 데몬에 사용할 리소스 예약하기](/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved)을 본다.
{{< /note >}}

## 노드 토폴로지

{{< feature-state feature_gate_name="TopologyManager" >}}

`TopologyManager`
[기능 게이트(feature gate)](/ko/docs/reference/command-line-tools-reference/feature-gates/)를
활성화 시켜두면, kubelet이 리소스 할당 결정을 할 때 토폴로지 힌트를 사용할 수 있다.
자세한 내용은
[노드의 컨트롤 토폴로지 관리 정책](/docs/tasks/administer-cluster/topology-manager/)을 본다.

## {{% heading "whatsnext" %}}

* 노드를 구성하는 [컴포넌트](/ko/docs/concepts/overview/components/#노드-컴포넌트)에 대해 알아본다.
* [노드에 대한 API 정의](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core)를 읽어본다.
* 아키텍처 디자인 문서의 [노드](https://git.k8s.io/design-proposals-archive/architecture/architecture.md#the-kubernetes-node)
  섹션을 읽어본다.
* [그레이스풀(Graceful)/논 그레이스풀 노드 셧다운](/ko/docs/concepts/cluster-administration/node-shutdown/)을 읽어본다.
* 클러스터에서 노드의 수와 크기를 조절하기 위해 [노드 오토스케일링](/docs/concepts/cluster-administration/node-autoscaling/)을 읽어본다.
* [테인트와 톨러레이션](/ko/docs/concepts/scheduling-eviction/taint-and-toleration/)을 읽어본다.
* [노드 리소스 매니저](/docs/concepts/policy/node-resource-managers/)를 읽어본다.
* [윈도우 노드를 위한 리소스 관리](/docs/concepts/configuration/windows-resource-management/)를 읽어본다.
