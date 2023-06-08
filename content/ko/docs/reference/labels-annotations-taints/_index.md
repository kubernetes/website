---
title: 잘 알려진 레이블, 어노테이션, 테인트(Taint)
content_type: concept
weight: 40
no_list: true
---

<!-- overview -->

쿠버네티스는 모든 레이블과 어노테이션을 `kubernetes.io`와 `k8s.io` 네임스페이스 아래에 정의해 놓았다.

이 문서는 각 값에 대한 레퍼런스를 제공하며, 값을 할당하기 위한 협력 포인트도 제공한다.

<!-- body -->

## API 오브젝트에서 사용되는 레이블, 어노테이션, 테인트

### app.kubernetes.io/component

예시: `app.kubernetes.io/component: "database"`

적용 대상: 모든 오브젝트 (일반적으로 [워크로드 리소스](/docs/reference/kubernetes-api/workload-resources/)에서 사용됨)

아키텍처 내의 컴포넌트.

[추천하는 레이블](/ko/docs/concepts/overview/working-with-objects/common-labels/#labels)을 확인한다.

### app.kubernetes.io/created-by (사용 중단됨)

예시: `app.kubernetes.io/created-by: "controller-manager"`

적용 대상: 모든 오브젝트 (일반적으로 [워크로드 리소스](/docs/reference/kubernetes-api/workload-resources/)에서 사용됨)

리소스를 생성한 컨트롤러/사용자.

{{< note >}}
v1.9부터 이 레이블은 더 이상 사용되지 않는다.
{{< /note >}}

### app.kubernetes.io/instance

예시: `app.kubernetes.io/instance: "mysql-abcxzy"`

적용 대상: 모든 오브젝트 (일반적으로 [워크로드 리소스](/docs/reference/kubernetes-api/workload-resources/)에서 사용됨)

애플리케이션 인스턴스를 식별하기 위한 고유한 이름. 고유하지 않은 이름을 할당하려면, [app.kubernetes.io/name](#app-kubernetes-io-name)를 사용한다.

[추천하는 레이블](/ko/docs/concepts/overview/working-with-objects/common-labels/#labels)을 확인한다.

### app.kubernetes.io/managed-by

예시: `app.kubernetes.io/managed-by: "helm"`

적용 대상: 모든 오브젝트 (일반적으로 [워크로드 리소스](/docs/reference/kubernetes-api/workload-resources/)에서 사용됨)

애플리케이션의 작업을 관리하기 위해 사용되는 도구.

[추천하는 레이블](/ko/docs/concepts/overview/working-with-objects/common-labels/#labels)을 확인한다.

### app.kubernetes.io/name

예시: `app.kubernetes.io/name: "mysql"`

적용 대상: 모든 오브젝트 (일반적으로 [워크로드 리소스](/docs/reference/kubernetes-api/workload-resources/)에서 사용됨)

애플리케이션의 이름.

[추천하는 레이블](/ko/docs/concepts/overview/working-with-objects/common-labels/#labels)을 확인한다.

### app.kubernetes.io/part-of

예시: `app.kubernetes.io/part-of: "wordpress"`

적용 대상: 모든 오브젝트 (일반적으로 [워크로드 리소스](/docs/reference/kubernetes-api/workload-resources/)에서 사용됨)

해당 애플리케이션이 속한 상위 레벨의 애플리케이션 이름.

[추천하는 레이블](/ko/docs/concepts/overview/working-with-objects/common-labels/#labels)을 확인한다.

### app.kubernetes.io/version

예시: `app.kubernetes.io/version: "5.7.21"`

적용 대상: 모든 오브젝트 (일반적으로 [워크로드 리소스](/docs/reference/kubernetes-api/workload-resources/)에서 사용됨)

애플리케이션의 현재 버전.

일반적으로 다음과 같은 형태의 값들을 포함한다.

- [시맨틱 버전](https://semver.org/spec/v1.0.0.html)
- [리비전 해시](https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection#_single_revisions) 깃 소스 코드

[추천하는 레이블](/ko/docs/concepts/overview/working-with-objects/common-labels/#labels)을 확인한다.

### cluster-autoscaler.kubernetes.io/safe-to-evict

예시: `cluster-autoscaler.kubernetes.io/safe-to-evict: "true"`

적용 대상: 파드

이 어노테이션이 `"true"`로 설정된 경우, 파드 축출을 막는 다른 규칙이 있는 경우에도
클러스터 오토스케일러가 파드를 축출할 수 있다.
클러스터 오토스케일러는 명시적으로 이 어노테이션이 `"false"`로 설정된 파드를 절대 축출하지 않는다.
따라서, 계속해서 실행을 유지하고자 하는 중요한 파드에 설정할 수 있다.
이 어노테이션이 설정되지 않은 경우, 클러스터 오토스케일러는 파드 수준(Pod-level) 동작을 따른다.

## kubernetes.io/arch

예시: `kubernetes.io/arch=amd64`

적용 대상: 노드

Go에 의해 정의된 `runtime.GOARCH` 값을 kubelet이 읽어서 이 레이블의 값으로 채운다. arm 노드와 x86 노드를 혼합하여 사용하는 경우 유용할 수 있다.

## kubernetes.io/os

예시: `kubernetes.io/os=linux`

적용 대상: 노드

Go에 의해 정의된 `runtime.GOOS` 값을 kubelet이 읽어서 이 레이블의 값으로 채운다. 클러스터에서 여러 운영체제를 혼합하여 사용(예: 리눅스 및 윈도우 노드)하는 경우 유용할 수 있다.

## kubernetes.io/metadata.name

예시: `kubernetes.io/metadata.name=mynamespace`

적용 대상: 네임스페이스

({{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}}의 일부인)
쿠버네티스 API 서버가 이 레이블을 모든 네임스페이스에 설정한다.
레이블의 값은 네임스페이스의 이름으로 적용된다. 이 레이블의 값을 변경할 수는 없다.

레이블 {{< glossary_tooltip text="셀렉터" term_id="selector" >}}를 이용하여 특정 네임스페이스를 지정하고 싶다면
이 레이블이 유용할 수 있다.

### kubernetes.io/limit-ranger

예시: `kubernetes.io/limit-ranger: "LimitRanger plugin set: cpu, memory request for container nginx; cpu, memory limit for container nginx"`

적용 대상: 파드

쿠버네티스는 기본적으로 어떠한 리소스 한도도 설정하지 않는다. 명시적으로 한도를 설정하지 않을 경우,
컨테이너는 CPU와 메모리를 무제한으로 사용하게 된다.
네임스페이스에 리밋레인지를 생성함으로써 리소스에 대한 요청이나 한도 기본값을 파드에 설정할 수 있다.
리밋레인지를 정의한 뒤에 배포된 파드들은 이러한 한도가 적용된다.
`kubernetes.io/limit-ranger` 어노테이션은 파드에 대해 리소스 기본값이
성공적으로 적용되었다고 기록한다.
자세한 내용은 [리밋레인지](/ko/docs/concepts/policy/limit-range/)를 확인한다.

## beta.kubernetes.io/arch (사용 중단됨)

이 레이블은 사용 중단되었다. 대신 `kubernetes.io/arch` 을 사용한다.

## beta.kubernetes.io/os (사용 중단됨)

이 레이블은 사용 중단되었다. 대신 `kubernetes.io/os` 을 사용한다.

## kubernetes.io/hostname {#kubernetesiohostname}

예시: `kubernetes.io/hostname=ip-172-20-114-199.ec2.internal`

적용 대상: 노드

kubelet이 호스트네임을 읽어서 이 레이블의 값으로 채운다. `kubelet` 에 `--hostname-override` 플래그를 전달하여 실제 호스트네임과 다른 값으로 설정할 수도 있다.

이 레이블은 토폴로지 계층의 일부로도 사용된다. [`topology.kubernetes.io/zone`](#topologykubernetesiozone)에서 세부 사항을 확인한다.


## kubernetes.io/change-cause {#change-cause}

예시: `kubernetes.io/change-cause=kubectl edit --record deployment foo`

적용 대상: 모든 오브젝트

이 어노테이션은 어떤 오브젝트가 왜 변경되었는지 그 이유를 담는다.

어떤 오브젝트를 변경할 수도 있는 `kubectl` 명령에 `--record` 플래그를 사용하면 이 레이블이 추가된다.

### kubernetes.io/description {#description}

예시: `kubernetes.io/description: "Description of K8s object."`

적용 대상: 모든 오브젝트

이 어노테이션은 주어진 오브젝트의 특정 상태를 표현하는데 사용한다.

### kubernetes.io/enforce-mountable-secrets {#enforce-mountable-secrets}

예시: `kubernetes.io/enforce-mountable-secrets: "true"`

적용 대상: 서비스어카운트(ServiceAccount)

이 어노테이션의 값은 **true**로 설정되어야만 작동한다. 이 어노테이션은, 해당 서비스어카운트로 동작중인 파드가 그 서비스어카운트의 `secrets` 항목에 명시된 Secret API 오브젝트만을 참조한다는 뜻이다.

### node.kubernetes.io/exclude-from-external-load-balancer

예시: `node.kubernetes.io/exclude-from-external-load-balancer`

적용 대상: 노드

쿠버네티스는 클러스터에 `ServiceNodeExclusion` 기능 게이트를 자동으로 활성화한다. 해당 기능 게이트가 클러스터에 활성화되어 있으면,
백엔드 서버들로부터 특정 워커 노드를 제외시키도록 레이블을 추가할 수 있다.
다음 명령어는 백엔드 목록에서 워커 노드를 제외시키는 명령어이다.
`kubectl label nodes <node-name> node.kubernetes.io/exclude-from-external-load-balancers=true`

## controller.kubernetes.io/pod-deletion-cost {#pod-deletion-cost}

예시: `controller.kubernetes.io/pod-deletion-cost=10`

적용 대상: 파드

이 어노테이션은 레플리카셋(ReplicaSet) 다운스케일 순서를 조정할 수 있는 요소인 [파드 삭제 비용](/ko/docs/concepts/workloads/controllers/replicaset/#파드-삭제-비용)을
설정하기 위해 사용한다. 명시된 값은 `int32` 타입으로 파싱된다.

### cluster-autoscaler.kubernetes.io/enable-ds-eviction

예시: `cluster-autoscaler.kubernetes.io/enable-ds-eviction: "true"`

적용 대상: Pod

이 어노테이션은 클러스터 오토스케일러가 데몬셋 파드를 축출할 것인지 여부를 제어한다.
이 어노테이션은 데몬셋 매니페스트 내 데몬셋 파드에 명시되어야 한다.
이 어노테이션이 `"true"`로 설정된 경우, 파드 축출을 막는 다른 규칙이 있는 경우에도
클러스터 오토스케일러가 파드를 축출할 수 있다. 클러스터 오토스케일러가 데몬셋 파드를 축출하는 것을 허용하지 않기 위해서는,
중요한 데몬셋 파드에 이 어노테이션을 `"false"`로 설정한다.
이 어노테이션이 설정되지 않은 경우, 클러스터 오토스케일러는 전체 동작을 따른다. 즉, 해당 구성에 따라서 데몬셋을 축출한다.

{{< note >}}
이 어노테이션은 데몬셋 파드에만 적용된다.
{{< /note >}}

### kubernetes.io/ingress-bandwidth

{{< note >}}
인그레스 트래픽 조절 어노테이션은 실험적인 기능이다.
만약 트래픽 조절 기능을 활성화시키고 싶다면, CNI 설정 파일(기본적으로 `/etc/cni/net.d`)에 `bandwidth` 플러그인을 추가해야 하며,
실행파일이 CNI의 실행파일 경로(기본적으로 `/opt/cni/bin`) 아래에 포함되어있는지도 확인하자.
{{< /note >}}

예시: `kubernetes.io/ingress-bandwidth: 10M`

적용 대상: 파드

파드에 QoS(quality-of-service)를 적용함으로써 가용한 대역폭을 효과적으로 제한할 수 있다.
인그레스 트래픽(파드로 향하는)은 효과적으로 데이터를 처리하기 위해 대기 중인 패킷을 큐로 관리한다.
파드의 대역폭을 제한하기 위해서는, 오브젝트를 정의하는 JSON 파일을 작성하고
`kubernetes.io/ingress-bandwidth` 어노테이션을 통해 데이터 트래픽의 속도를 명시한다. 인그레스 속도를 명시할 때 사용되는 단위는
초당 비트([수량](/docs/reference/kubernetes-api/common-definitions/quantity/))이다.
예를 들어, `10M`은 초당 10 메가비트를 의미한다.

### kubernetes.io/egress-bandwidth

{{< note >}}
이그레스 트래픽 조절 어노테이션은 실험적인 기능이다.
만약 트래픽 조절 기능을 활성화시키고 싶다면, CNI 설정 파일(기본적으로 `/etc/cni/net.d`)에 `bandwidth` 플러그인을 추가해야 하며,
실행파일이 CNI의 실행파일 경로(기본적으로 `/opt/cni/bin`) 아래에 포함되어있는지도 확인하자.
{{< /note >}}

예시: `kubernetes.io/egress-bandwidth: 10M`

적용 대상: 파드

이그레스 트래픽(파드로부터의)은 설정된 속도를 초과하는 패킷을 삭제하는 정책에 의해 처리되며,
파드에 거는 제한은 다른 파드의 대역폭에 영향을 주지 않는다.
파드의 대역폭을 제한하기 위해서는, 오브젝트를 정의하는 JSON 파일을 작성하고
`kubernetes.io/egress-bandwidth` 어노테이션을 통해 데이터 트래픽의 속도를 명시한다. 이그레스 속도를 명시할 때 사용되는 단위는
초당 비트([수량](/docs/reference/kubernetes-api/common-definitions/quantity/))이다.
예를 들어, `10M`은 초당 10 메가비트를 의미한다.

## beta.kubernetes.io/instance-type (사용 중단됨)

{{< note >}} v1.17부터, [`node.kubernetes.io/instance-type`](#nodekubernetesioinstance-type)으로 대체되었다. {{< /note >}}

## node.kubernetes.io/instance-type {#nodekubernetesioinstance-type}

예시: `node.kubernetes.io/instance-type=m3.medium`

적용 대상: 노드

`클라우드 제공자`에 의해 정의된 인스턴스 타입의 값을 kubelet이 읽어서 이 레이블의 값으로 채운다.
`클라우드 제공자`를 사용하는 경우에만 이 레이블이 설정된다.
특정 워크로드를 특정 인스턴스 타입에 할당하고 싶다면 이 레이블이 유용할 수 있다.
하지만 일반적으로는 자원 기반 스케줄링을 수행하는 쿠버네티스 스케줄러를 이용하게 된다. 인스턴스 타입 보다는 특성을 기준으로 스케줄링을 고려해야 한다(예: `g2.2xlarge` 를 요구하기보다는, GPU가 필요하다고 요구한다).

## failure-domain.beta.kubernetes.io/region (사용 중단됨) {#failure-domainbetakubernetesioregion}

[`topology.kubernetes.io/region`](#topologykubernetesioregion)을 확인한다.

{{< note >}} v1.17부터, [`topology.kubernetes.io/region`](#topologykubernetesioregion)으로 대체되었다. {{< /note >}}

## failure-domain.beta.kubernetes.io/zone (사용 중단됨) {#failure-domainbetakubernetesiozone}

[`topology.kubernetes.io/zone`](#topologykubernetesiozone)을 확인한다.

{{< note >}} v1.17부터, [`topology.kubernetes.io/zone`](#topologykubernetesiozone)으로 대체되었다. {{< /note >}}

## statefulset.kubernetes.io/pod-name {#statefulsetkubernetesiopod-name}

예시:

`statefulset.kubernetes.io/pod-name=mystatefulset-7`

스테이트풀셋(StatefulSet) 컨트롤러가 파드를 위한 스테이트풀셋을 생성하면, 컨트롤 플레인이 파드에 이 레이블을 설정한다.
생성되는 파드의 이름을 이 레이블의 값으로 설정한다.

스테이트풀셋 문서의 [파드 이름 레이블](/ko/docs/concepts/workloads/controllers/statefulset/#파드-이름-레이블)에서
상세 사항을 확인한다.

### scheduler.alpha.kubernetes.io/node-selector {#schedulerkubernetesnode-selector}

예시: `scheduler.alpha.kubernetes.io/node-selector: "name-of-node-selector"`

적용 대상: 네임스페이스

[파드-노드 셀렉터(PodNodeSelector)](/docs/reference/access-authn-authz/admission-controllers/#podnodeselector)는 이 어노테이션의 키를 사용하여 네임스페이스의 파드들에 노드 셀렉터를 할당한다.

## topology.kubernetes.io/region {#topologykubernetesioregion}

예시:

`topology.kubernetes.io/region=us-east-1`

[`topology.kubernetes.io/zone`](#topologykubernetesiozone)을 확인한다.

## topology.kubernetes.io/zone {#topologykubernetesiozone}

예시:

`topology.kubernetes.io/zone=us-east-1c`

적용 대상: 노드, 퍼시스턴트볼륨(PersistentVolume)

노드의 경우: `클라우드 제공자`가 제공하는 값을 이용하여 `kubelet` 또는 외부 `cloud-controller-manager`가 이 어노테이션의 값을 설정한다. `클라우드 제공자`를 사용하는 경우에만 이 레이블이 설정된다. 하지만, 토폴로지 내에서 의미가 있는 경우에만 이 레이블을 노드에 설정해야 한다.

퍼시스턴트볼륨의 경우: 토폴로지 어웨어 볼륨 프로비저너가 자동으로 퍼시스턴트볼륨에 노드 어피니티 제약을 설정한다.

영역(zone)은 논리적 고장 도메인을 나타낸다. 가용성 향상을 위해 일반적으로 쿠버네티스 클러스터는 여러 영역에 걸쳐 구성된다. 영역에 대한 정확한 정의는 사업자 별 인프라 구현에 따라 다르지만, 일반적으로 영역은 '영역 내 매우 낮은 네트워크 지연시간, 영역 내 네트워크 트래픽 비용 없음, 다른 영역의 고장에 독립적임' 등의 공통적인 특성을 갖는다. 예를 들어, 같은 영역 내의 노드는 하나의 네트워크 스위치를 공유하여 활용할 수 있으며, 반대로 다른 영역에 있는 노드는 하나의 네트워크 스위치를 공유해서는 안 된다.

지역(region)은 하나 이상의 영역으로 구성된 더 큰 도메인을 나타낸다. 쿠버네티스 클러스터가 여러 지역에 걸쳐 있는 경우는 드물다. 영역이나 지역에 대한 정확한 정의는 사업자 별 인프라 구현에 따라 다르지만, 일반적으로 지역은 '지역 내 네트워크 지연시간보다 지역 간 네트워크 지연시간이 큼, 지역 간 네트워크 트래픽은 비용이 발생함, 다른 영역/지역의 고장에 독립적임' 등의 공통적인 특성을 갖는다. 예를 들어, 같은 지역 내의 노드는 전력 인프라(예: UPS 또는 발전기)를 공유하여 활용할 수 있으며, 반대로 다른 지역에 있는 노드는 일반적으로 전력 인프라를 공유하지 않는다.

쿠버네티스는 영역과 지역의 구조에 대해 다음과 같이 가정한다.
1) 지역과 영역은 계층적이다. 영역은 지역의 엄격한 부분집합(strict subset)이며, 하나의 영역이 두 개의 지역에 속할 수는 없다.
2) 영역 이름은 모든 지역에 걸쳐서 유일하다. 예를 들어, "africa-east-1" 라는 지역은 "africa-east-1a" 와 "africa-east-1b" 라는 영역으로 구성될 수 있다.

토폴로지 레이블이 변경되는 일은 없다고 가정할 수 있다. 일반적으로 레이블의 값은 변경될 수 있지만, 특정 노드가 삭제 후 재생성되지 않고서는 다른 영역으로 이동할 수 없기 때문이다.

쿠버네티스는 이 정보를 다양한 방식으로 활용할 수 있다. 예를 들어, 단일 영역 클러스터에서는 스케줄러가 자동으로 레플리카셋의 파드를 여러 노드에 퍼뜨린다(노드 고장의 영향을 줄이기 위해 - [`kubernetes.io/hostname`](#kubernetesiohostname) 참고). 복수 영역 클러스터에서는, 여러 영역에 퍼뜨린다(영역 고장의 영향을 줄이기 위해). 이는 _SelectorSpreadPriority_ 를 통해 실현된다.

_SelectorSpreadPriority_ 는 최선 노력(best effort) 배치 방법이다. 클러스터가 위치한 영역들의 특성이 서로 다르다면(예: 노드 숫자가 다름, 노드 타입이 다름, 파드 자원 요구사항이 다름), 파드 숫자를 영역별로 다르게 하여 배치할 수 있다. 필요하다면, 영역들의 특성(노드 숫자/타입)을 일치시켜 불균형 배치의 가능성을 줄일 수 있다.

스케줄러도 (_VolumeZonePredicate_ 표시자를 이용하여) '파드가 요청하는 볼륨'이 위치하는 영역과 같은 영역에 파드를 배치한다. 여러 영역에서 볼륨에 접근할 수는 없다.

`PersistentVolumeLabel`이 퍼시스턴트볼륨의 자동 레이블링을 지원하지 않는다면, 레이블을 수동으로 추가하거나 `PersistentVolumeLabel`이 동작하도록 변경할 수 있다.
`PersistentVolumeLabel`이 설정되어 있으면, 스케줄러는 파드가 다른 영역에 있는 볼륨에 마운트하는 것을 막는다. 만약 사용 중인 인프라에 이러한 제약이 없다면, 볼륨에 영역 레이블을 추가할 필요가 전혀 없다.

## volume.beta.kubernetes.io/storage-provisioner (사용 중단됨)

예시: `volume.beta.kubernetes.io/storage-provisioner: k8s.io/minikube-hostpath`

적용 대상: 퍼시스턴트볼륨클레임(PersistentVolumeClaim)

이 어노테이션은 사용 중단되었다.

### volume.beta.kubernetes.io/mount-options (사용 중단) {#mount-options}

예시 : `volume.beta.kubernetes.io/mount-options: "ro,soft"`

적용 대상: 퍼시스턴트볼륨

쿠버네티스 관리자는, 노드에 퍼시스턴트볼륨이 마운트될 경우 추가적인 [마운트 옵션](/ko/docs/concepts/storage/persistent-volumes/#mount-options)을 명세할 수 있다.

이 어노테이션은 사용 중단되었다.

## volume.kubernetes.io/storage-provisioner

적용 대상: 퍼시스턴트볼륨클레임

이 어노테이션은 동적 프로비저닝이 요구되는 PVC에 추가될 예정이다.

## node.kubernetes.io/windows-build {#nodekubernetesiowindows-build}

예시: `node.kubernetes.io/windows-build=10.0.17763`

적용 대상: 노드

kubelet이 Microsoft 윈도우에서 실행되고 있다면, 사용 중인 Windows Server 버전을 기록하기 위해 kubelet이 노드에 이 레이블을 추가한다.

이 레이블의 값은 "MajorVersion.MinorVersion.BuildNumber"의 형태를 갖는다.

## service.kubernetes.io/headless {#servicekubernetesioheadless}

예시: `service.kubernetes.io/headless=""`

적용 대상: 서비스

서비스가 헤드리스(headless)이면, 컨트롤 플레인이 엔드포인트(Endpoints) 오브젝트에 이 레이블을 추가한다.

## kubernetes.io/service-name {#kubernetesioservice-name}

예시: `kubernetes.io/service-name="my-website"`

적용 대상: 엔드포인트슬라이스(EndpointSlices)

쿠버네티스는 이 레이블을 사용하여 [엔드포인트슬라이스](/ko/docs/concepts/services-networking/endpoint-slices/)와
[서비스](/ko/docs/concepts/services-networking/service/)를 결합한다.

이 레이블은 엔드포인트슬라이스가 지원하는 서비스의 {{< glossary_tooltip term_id="name" text="이름">}}을 기록한다.
모든 엔드포인트슬라이스는 이 레이블을
자신과 연결된 서비스의 이름으로 설정해야 한다.

### kubernetes.io/service-account.name

예시: `kubernetes.io/service-account.name: "sa-name"`

적용 대상: 시크릿(Secret)

이 어노테이션에는 토큰(`kubernetes.io/service-account-token` 타입의 시크릿에 저장되는)이 나타내는
서비스어카운트의 {{< glossary_tooltip term_id="name" text="이름">}}을 기록한다.

### kubernetes.io/service-account.uid

예시: `kubernetes.io/service-account.uid: da68f9c6-9d26-11e7-b84e-002dc52800da`

적용 대상: 시크릿

이 어노테이션에는 토큰(`kubernetes.io/service-account-token` 타입의 시크릿에 저장되는)이 나타내는
서비스어카운트의 {{< glossary_tooltip term_id="uid" text="고유 ID">}}를 기록한다.

### kubernetes.io/legacy-token-last-used

예시: `kubernetes.io/legacy-token-last-used: 2022-10-24`

적용 대상: 시크릿

컨트롤 플레인은 `kubernetes.io/service-account-token` 타입을 갖는 시크릿에 대해서만 이 레이블을 추가한다.
이 레이블의 값은, 클라이언트가 서비스어카운트 토큰을 사용하여 인증한 요청을
컨트롤 플레인이 마지막으로 확인한 날짜(ISO 8601 형식, UTC 시간대)를 기록한다.

클러스터가 해당 기능을 얻기 전에 기존의 토큰을 마지막으로 사용한 경우(쿠버네티스 v1.26에 추가됨),
이 레이블은 설정되지 않는다.


## endpointslice.kubernetes.io/managed-by {#endpointslicekubernetesiomanaged-by}

예시: `endpointslice.kubernetes.io/managed-by="controller"`

적용 대상: 엔드포인트슬라이스

이 레이블은 엔드포인트슬라이스(EndpointSlice)를 어떤 컨트롤러나 엔티티가 관리하는지를 나타내기 위해 사용된다. 이 레이블을 사용함으로써 한 클러스터 내에서 여러 엔드포인트슬라이스 오브젝트가 각각 다른 컨트롤러나 엔티티에 의해 관리될 수 있다.

## endpointslice.kubernetes.io/skip-mirror {#endpointslicekubernetesioskip-mirror}

예시: `endpointslice.kubernetes.io/skip-mirror="true"`

적용 대상: 엔드포인트(Endpoints)

특정 자원에 이 레이블을 `"true"` 로 설정하여, EndpointSliceMirroring 컨트롤러가 엔드포인트슬라이스를 이용하여 해당 자원을 미러링하지 않도록 지시할 수 있다.

## service.kubernetes.io/service-proxy-name {#servicekubernetesioservice-proxy-name}

예시: `service.kubernetes.io/service-proxy-name="foo-bar"`

적용 대상: 서비스

kube-proxy 에는 커스텀 프록시를 위한 이와 같은 레이블이 있으며, 이 레이블은 서비스 컨트롤을 커스텀 프록시에 위임한다.

## experimental.windows.kubernetes.io/isolation-type (사용 중단) {#experimental-windows-kubernetes-io-isolation-type}

예시: `experimental.windows.kubernetes.io/isolation-type: "hyperv"`

적용 대상: 파드

Hyper-V 격리(isolation)를 사용하여 윈도우 컨테이너를 실행하려면 이 어노테이션을 사용한다. Hyper-V 격리 기능을 활성화하고 Hyper-V 격리가 적용된 컨테이너를 생성하기 위해, kubelet은 기능 게이트 `HyperVContainer=true` 로 설정하여 실행되어야 하며, 파드에는 `experimental.windows.kubernetes.io/isolation-type=hyperv` 어노테이션이 설정되어 있어야 한다.

{{< note >}}
이 어노테이션은 하나의 컨테이너로 구성된 파드에만 설정할 수 있다.
v1.20부터 이 어노테이션은 더이상 사용되지 않는다. 실험적인 Hyper-V 지원은 1.21버전에서 제거되었다.
{{< /note >}}

## ingressclass.kubernetes.io/is-default-class

예시: `ingressclass.kubernetes.io/is-default-class: "true"`

적용 대상: 인그레스클래스(IngressClass)

하나의 인그레스클래스 리소스에 이 어노테이션이 `"true"`로 설정된 경우, 클래스가 명시되지 않은 새로운 인그레스(Ingress) 리소스는 해당 기본 클래스로 할당될 것이다.

## kubernetes.io/ingress.class (사용 중단됨)

{{< note >}}
v1.18부터, `spec.ingressClassName`으로 대체되었다.
{{< /note >}}

## storageclass.kubernetes.io/is-default-class

예시: `storageclass.kubernetes.io/is-default-class=true`

적용 대상: 스토리지클래스(StorageClass)

하나의 스토리지클래스(StorageClass) 리소스에 이 어노테이션이 `"true"`로 설정된 경우,
클래스가 명시되지 않은 새로운 퍼시스턴트볼륨클레임 리소스는 해당 기본 클래스로 할당될 것이다.

## alpha.kubernetes.io/provided-node-ip

예시: `alpha.kubernetes.io/provided-node-ip: "10.0.0.1"`

적용 대상: 노드

kubelet이 노드에 할당된 IPv4 주소를 명시하기 위해 이 어노테이션을 사용할 수 있다.

kubelet이 `--cloud-provider` 플래그를 사용하여 어떤 값을 갖게 되었다면 (외부 또는 레거시 트리 내(in-tree) 클라우드 공급자 모두 포함), kubelet은 이 어노테이션을 노드에 설정하여 명령줄 플래그(`--node-ip`)를 통해 설정된 IP 주소를 명시한다. cloud-controller-manager는 클라우드 제공자에게 이 IP 주소가 유효한지를 검증한다.

## batch.kubernetes.io/job-completion-index

예시: `batch.kubernetes.io/job-completion-index: "3"`

적용 대상: 파드

kube-controller-manager의 잡(Job) 컨트롤러는
`Indexed` [완료 모드](/ko/docs/concepts/workloads/controllers/job/#완료-모드)로 생성된 파드에 이 어노테이션을 추가한다.

## kubectl.kubernetes.io/default-container

예시: `kubectl.kubernetes.io/default-container: "front-end-app"`

파드의 기본 컨테이너로 사용할 컨테이너 이름을 지정하는 어노테이션이다. 예를 들어, `kubectl logs` 또는 `kubectl exec` 명령을 사용할 때 `-c` 또는 `--container` 플래그를 지정하지 않으면, 이 어노테이션으로 명시된 기본 컨테이너를 대상으로 실행될 것이다.

## endpoints.kubernetes.io/over-capacity

예시: `endpoints.kubernetes.io/over-capacity:truncated`

적용 대상: 엔드포인트(Endpoints)

{{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}}은, 연결된 {{< glossary_tooltip text="서비스" term_id="service" >}}에 1000개 이상의 엔드포인트가 있는 경우, 이 어노테이션을 [엔드포인트](/ko/docs/concepts/services-networking/service/#endpoints) 오브젝트에 추가한다. 이 어노테이션은 엔드포인트의 용량이 초과되었거나 엔드포인트의 수가 1000개로 잘렸음을 나타낸다.

백엔드 엔드포인트의 수가 1000개 미만이면, 컨트롤 플레인은 이 어노테이션을 제거한다.

### batch.kubernetes.io/job-tracking (사용 중단) {#batch-kubernetes-io-job-tracking}

예시: `batch.kubernetes.io/job-tracking: ""`

적용 대상: 잡

잡에 이 어노테이션이 있는 경우, 컨트롤 플레인이
[파이널라이저(finalizer)를 이용하여 잡 상태를 추적](/ko/docs/concepts/workloads/controllers/job/#종료자-finalizers-를-이용한-잡-추적)하고 있음을 나타낸다.
컨트롤 플레인은 이 어노테이션을 사용하여, 아직 기능이 개발 중인 동안
파이널라이저를 사용하여 잡을 추적하도록 안전하게 전환한다.
이 어노테이션을 수동으로 추가하거나 제거해서는 **안 된다**.

{{< note >}}
쿠버네티스 1.26 부터, 이 어노테이션은 사용되지 않는다.
쿠버네티스 1.27 과 그 이상의 버전들은 이 어노테이션을 무시할 것이며,
항상 파이널라이저를 사용하여 잡을 추적할 것이다..
{{< /note >}}

### scheduler.alpha.kubernetes.io/defaultTolerations {#scheduleralphakubernetesio-defaulttolerations}

예시: `scheduler.alpha.kubernetes.io/defaultTolerations: '[{"operator": "Equal", "value": "value1", "effect": "NoSchedule", "key": "dedicated-node"}]'`

적용 대상: 네임스페이스

이 어노테이션은 [PodTolerationRestriction](/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction) 어드미션 컨트롤러가 활성화되어 있어야 한다.  어노테이션의 키는 네임스페이스에 톨러레이션(toleration)을 할당하는 것을 허용하며, 해당 네임스페이스에 생성되는 모든 파드들은 이 톨러레이션이 부여된다.

## scheduler.alpha.kubernetes.io/preferAvoidPods (사용 중단) {#scheduleralphakubernetesio-preferavoidpods}

적용 대상: 노드

이 어노테이션을 사용하려면 [NodePreferAvoidPods 스케줄링 플러그인](/ko/docs/reference/scheduling/config/#scheduling-plugins)이 활성화되어 있어야 한다.
해당 플러그인은 쿠버네티스 1.22에서 사용 중단되었다.
대신 [테인트와 톨러레이션](/ko/docs/concepts/scheduling-eviction/taint-and-toleration/)을 사용한다.

**이 이후로 나오는 테인트는 모두 '적용 대상: 노드' 이다.**

## node.kubernetes.io/not-ready

예시: `node.kubernetes.io/not-ready:NoExecute`

노드 컨트롤러는 노드의 헬스를 모니터링하여 노드가 사용 가능한 상태인지를 감지하고 그에 따라 이 테인트를 추가하거나 제거한다.

## node.kubernetes.io/unreachable

예시: `node.kubernetes.io/unreachable:NoExecute`

노드 컨트롤러는 [노드 컨디션](/ko/docs/concepts/architecture/nodes/#condition)이 `Ready`에서 `Unknown`으로 변경된 노드에 이 테인트를 추가한다.

## node.kubernetes.io/unschedulable

예시: `node.kubernetes.io/unschedulable:NoSchedule`

경쟁 상태(race condition) 발생을 막기 위해, 생성 중인 노드에 이 테인트가 추가된다.

## node.kubernetes.io/memory-pressure

예시: `node.kubernetes.io/memory-pressure:NoSchedule`

kubelet은 노드의 `memory.available`와 `allocatableMemory.available`을 관측하여 메모리 압박을 감지한다. 그 뒤, 관측한 값을 kubelet에 설정된 문턱값(threshold)과 비교하여 노드 컨디션과 테인트의 추가/삭제 여부를 결정한다.

## node.kubernetes.io/disk-pressure

예시: `node.kubernetes.io/disk-pressure:NoSchedule`

kubelet은 노드의 `imagefs.available`, `imagefs.inodesFree`, `nodefs.available`, `nodefs.inodesFree`(리눅스에 대해서만)를 관측하여 디스크 압박을 감지한다. 그 뒤, 관측한 값을 kubelet에 설정된 문턱값(threshold)과 비교하여 노드 컨디션과 테인트의 추가/삭제 여부를 결정한다.

## node.kubernetes.io/network-unavailable

예시: `node.kubernetes.io/network-unavailable:NoSchedule`

사용 중인 클라우드 공급자가 추가 네트워크 환경설정을 필요로 한다고 명시하면, kubelet이 이 테인트를 설정한다. 클라우드 상의 네트워크 경로가 올바르게 구성되어야, 클라우드 공급자가 이 테인트를 제거할 것이다.

## node.kubernetes.io/pid-pressure

예시: `node.kubernetes.io/pid-pressure:NoSchedule`

kubelet은 '`/proc/sys/kernel/pid_max`의 크기의 D-값'과 노드에서 쿠버네티스가 사용 중인 PID를 확인하여, `pid.available` 지표라고 불리는 '사용 가능한 PID 수'를 가져온다. 그 뒤, 관측한 지표를 kubelet에 설정된 문턱값(threshold)과 비교하여 노드 컨디션과 테인트의 추가/삭제 여부를 결정한다.

### node.kubernetes.io/out-of-service

예시: `node.kubernetes.io/out-of-service:NoExecute`

사용자는 노드에 테인트를 수동으로 추가함으로써 서비스 중이 아니라고 표시할 수 있다. 만약 `NodeOutOfServiceVolumeDetach`
[기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)가 `kube-controller-manager`에 활성화되어 있으며
노드가 이 테인트로 인해 서비스 중이 아니라고 표시되어있을 경우, 노드에서 실행되던 매칭되는 톨러레이션이 없는 파드들은 강제로 삭제됨과 동시에 볼륨이 분리된다. 이는 서비스 중이 아닌 노드의 파드들이 다른 노드에서 빠르게 복구될 수 있도록 해준다.

{{< caution >}}
이 테인트를 언제 어떻게 사용할지에 대한 자세한 사항은
[논 그레이스풀 노드 셧다운](/ko/docs/concepts/architecture/nodes/#non-graceful-node-shutdown)
를 참조한다.
{{< /caution >}}


## node.cloudprovider.kubernetes.io/uninitialized

예시: `node.cloudprovider.kubernetes.io/uninitialized:NoSchedule`

kubelet이 "외부" 클라우드 공급자에 의해 실행되었다면 노드가 '사용 불가능'한 상태라고 표시하기 위해 이 테인트가 추가되며, 추후 cloud-controller-manager가 이 노드를 초기화하고 이 테인트를 제거한다.

## node.cloudprovider.kubernetes.io/shutdown

예시: `node.cloudprovider.kubernetes.io/shutdown:NoSchedule`

노드의 상태가 클라우드 공급자가 정의한 'shutdown' 상태이면, 이에 따라 노드에 `node.cloudprovider.kubernetes.io/shutdown` 테인트가 `NoSchedule` 값으로 설정된다.

## pod-security.kubernetes.io/enforce

예시: `pod-security.kubernetes.io/enforce: baseline`

적용 대상: 네임스페이스

값은 **반드시** [파드 보안 표준](/ko/docs/concepts/security/pod-security-standards/) 레벨과 상응하는
`privileged`, `baseline`, 또는 `restricted` 중 하나여야 한다.
특히 `enforce` 레이블은 표시된 수준에 정의된 요구 사항을 충족하지 않는
레이블 네임스페이스에 모든 파드의 생성을 금지한다.

더 많은 정보는 [네임스페이스에서 파드 보안 적용](/ko/docs/concepts/security/pod-security-admission)을
참고한다.

## pod-security.kubernetes.io/enforce-version

예시: `pod-security.kubernetes.io/enforce-version: {{< skew latestVersion >}}`

적용 대상: 네임스페이스

값은 **반드시** `latest`이거나 `v<MAJOR>.<MINOR>` 형식의 유효한 쿠버네티스 버전이어야 한다.
설정된 파드의 유효성을 검사할 때 적용할 [파드 보안 표준](/ko/docs/concepts/security/pod-security-standards/)
정책의 버전이 결정된다.

더 많은 정보는 [네임스페이스에서 파드 보안 적용](/ko/docs/concepts/security/pod-security-admission)을
참고한다.

## pod-security.kubernetes.io/audit

예시: `pod-security.kubernetes.io/audit: baseline`

적용 대상: 네임스페이스

값은 **반드시** [파드 보안 표준](/ko/docs/concepts/security/pod-security-standards/) 레벨과 상응하는
`privileged`, `baseline`, 또는 `restricted` 중 하나여야 한다.
특히 `audit` 레이블은 표시된 수준에 정의된 요구 사항을 충족하지 않는 레이블 네임스페이스에 파드를 생성하는 것을
방지하지 않지만, 해당 파드에 audit 어노테이션을 추가한다.

더 많은 정보는 [네임스페이스에서 파드 보안 적용](/ko/docs/concepts/security/pod-security-admission)을
참고한다.

## pod-security.kubernetes.io/audit-version

예시: `pod-security.kubernetes.io/audit-version: {{< skew latestVersion >}}`

적용 대상: 네임스페이스

값은 **반드시** `latest`이거나 `v<MAJOR>.<MINOR>` 형식의 유효한 쿠버네티스 버전이어야 한다.
설정된 파드의 유효성을 검사할 때 적용할 [파드 보안 표준](/ko/docs/concepts/security/pod-security-standards/)
정책의 버전이 결정된다.

더 많은 정보는 [네임스페이스에서 파드 보안 적용](/ko/docs/concepts/security/pod-security-admission)을
참고한다.

## pod-security.kubernetes.io/warn

예시: `pod-security.kubernetes.io/warn: baseline`

적용 대상: 네임스페이스

값은 **반드시** [파드 보안 표준](/ko/docs/concepts/security/pod-security-standards/) 레벨과 상응하는
`privileged`, `baseline`, 또는 `restricted` 중 하나여야 한다.
특히 `warn` 레이블은 해당 레이블이 달린 네임스페이스에, 표시된 레벨에 명시된 요구 사항을 충족하지 않는 파드를 생성하는 것을
방지하지는 않지만, 그러한 파드가 생성되면 사용자에게 경고를 반환한다.
디플로이먼트, 잡, 스테이트풀셋 등과 같은 파드 템플릿을 포함하는
객체를 만들거나 업데이트할 때에도 경고가 표시된다.

더 많은 정보는 [네임스페이스에서 파드 보안 적용](/ko/docs/concepts/security/pod-security-admission)을
참고한다.

## pod-security.kubernetes.io/warn-version

예시: `pod-security.kubernetes.io/warn-version: {{< skew latestVersion >}}`

적용 대상: 네임스페이스

값은 **반드시** `latest`이거나 `v<MAJOR>.<MINOR>` 형식의 유효한 쿠버네티스 버전이어야 한다.
설정된 파드의 유효성을 검사할 때 적용할 [파드 보안 표준](/ko/docs/concepts/security/pod-security-standards/)
정책의 버전이 결정된다. 디플로이먼트, 잡, 스테이트풀셋 등과 같은 파드 템플릿을 포함하는
객체를 만들거나 업데이트할 때에도 경고가 표시된다.

더 많은 정보는 [네임스페이스에서 파드 보안 적용](/ko/docs/concepts/security/pod-security-admission)을
참고한다.

### kubernetes.io/psp (사용 중단됨) {#kubernetes-io-psp}

예시: `kubernetes.io/psp: restricted`

적용 대상: 파드

이 어노테이션은 파드시큐리티폴리시(PodSecurityPolicy)[PodSecurityPolicies](/ko/docs/concepts/security/pod-security-policy/)를 사용하는 경우에만 관련이 있다.
쿠버네티스 v{{< skew currentVersion >}}은 파드시큐리티폴리시 API를 지원하지 않는다.

파드시큐리티폴리시 어드미션 컨트롤러가 파드를 승인했을 때,
어드미션 컨트롤러는 파드가 이 어노테이션을 갖도록 수정했다.
이 어노테이션 값은 유효성 검사에서 사용된 파드시큐리티폴리시의 이름이었다.

## seccomp.security.alpha.kubernetes.io/pod (사용 중단됨) {#seccomp-security-alpha-kubernetes-io-pod}

이 어노테이션은 쿠버네티스 v1.19부터 사용 중단되었으며 향후 릴리스에서는 작동하지 않을 것이다.
대신 해당 파드 또는 컨테이너의 `securityContext.seccompProfile` 필드를 사용한다.
파드의 보안 설정을 지정하려면, 파드 스펙에 `securityContext` 필드를 추가한다.
파드의 `.spec` 내의 [`securityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context) 필드는 파드 수준 보안 속성을 정의한다.
[파드의 보안 컨텍스트를 설정](/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod)하면,
해당 설정이 파드 내의 모든 컨테이너에 적용된다.

## container.seccomp.security.alpha.kubernetes.io/[이름] {#container-seccomp-security-alpha-kubernetes-io}

이 어노테이션은 쿠버네티스 v1.19부터 사용 중단되었으며 향후 릴리스에서는 작동하지 않을 것이다.
대신 해당 파드 또는 컨테이너의 `securityContext.seccompProfile` 필드를 사용한다.
[seccomp를 이용하여 컨테이너의 syscall 제한하기](/docs/tutorials/security/seccomp/) 튜토리얼에서
seccomp 프로파일을 파드 또는 파드 내 컨테이너에 적용하는 단계를 확인한다.
튜토리얼에서는 쿠버네티스에 seccomp를 설정하기 위해 사용할 수 있는 방법을 소개하며,
이는 파드의 `.spec` 내에 `securityContext` 를 설정함으로써 가능하다.

### snapshot.storage.kubernetes.io/allowVolumeModeChange

예시: `snapshot.storage.kubernetes.io/allowVolumeModeChange: "true"`

적용 대상: VolumeSnapshotContent

값은 `true` 혹은 `false`만을 받는다.
{{< glossary_tooltip text="퍼시스턴트볼륨클레임" term_id="persistent-volume-claim" >}}이
볼륨스냅샷(VolumeSnapshot)으로부터 생성될 경우,
사용자가 소스 볼륨의 모드를 수정할 수 있는지 여부를 결정한다.

자세한 사항은 [스냅샷의 볼륨 모드 변환하기](/ko/docs/concepts/storage/volume-snapshots/#convert-volume-mode)와
[쿠버네티스 CSI 개발자용 문서](https://kubernetes-csi.github.io/docs/)를 참조한다.

## Audit을 위한 어노테이션들

<!-- sorted by annotation -->
- [`authorization.k8s.io/decision`](/docs/reference/labels-annotations-taints/audit-annotations/#authorization-k8s-io-decision)
- [`authorization.k8s.io/reason`](/docs/reference/labels-annotations-taints/audit-annotations/#authorization-k8s-io-reason)
- [`insecure-sha1.invalid-cert.kubernetes.io/$hostname`](/docs/reference/labels-annotations-taints/audit-annotations/#insecure-sha1-invalid-cert-kubernetes-io-hostname)
- [`missing-san.invalid-cert.kubernetes.io/$hostname`](/docs/reference/labels-annotations-taints/audit-annotations/#missing-san-invalid-cert-kubernetes-io-hostname)
- [`pod-security.kubernetes.io/audit-violations`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-audit-violations)
- [`pod-security.kubernetes.io/enforce-policy`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-enforce-policy)
- [`pod-security.kubernetes.io/exempt`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-exempt)

자세한 사항은 [Audit 어노테이션](/docs/reference/labels-annotations-taints/audit-annotations/) 페이지를 참고한다.

## kubeadm

### kubeadm.alpha.kubernetes.io/cri-socket

예시: `kubeadm.alpha.kubernetes.io/cri-socket: unix:///run/containerd/container.sock`

적용 대상: 노드

kubeadm `init`/`join`시 주어지는 CRI 소켓 정보를 유지하기 위해 사용하는 어노테이션.
kubeadm은 노드 오브젝트를 이 정보를 주석 처리한다. 이상적으로는 KubeletConfiguration의 항목이어야 하기 때문에,
어노테이션은 "alpha" 상태로 남아있다.

### kubeadm.kubernetes.io/etcd.advertise-client-urls

예시: `kubeadm.kubernetes.io/etcd.advertise-client-urls: https://172.17.0.18:2379`

적용 대상: 파드

etcd 클라이언트들이 접근할 수 있는 URL 목록을 추적하기 위해, 로컬에서 관리되는 etcd 파드에 배치되는 어노테이션.
주로 etcd 클러스터의 헬스 체크에 사용한다.

### kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint

예시: `kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint: https://172.17.0.18:6443`

적용 대상: 파드

외부로 노출시킬 API 서버의 엔드포인트를 추적하기 위해,
로컬에서 관리되는 kube-apiserver 파드에 배치되는 어노테이션.

### kubeadm.kubernetes.io/component-config.hash

예시: `kubeadm.kubernetes.io/component-config.hash: 2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae`

적용 대상: 컨피그맵(ConfigMap)

컴포넌트 설정을 관리하는 컨피그맵에 배치되는 어노테이션.
사용자가 특정 컴포넌트에 대해서 kubeadm 기본값과 다른 설정값을 적용했는지 판단하기 위한 해시(SHA-256)를 가지고 있다.

### node-role.kubernetes.io/control-plane

적용 대상: 노드

kubeadm이 관리하는 컨트롤 플레인 노드에 적용되는 레이블.

### node-role.kubernetes.io/control-plane {#node-role-kubernetes-io-control-plane-taint}

예시: `node-role.kubernetes.io/control-plane:NoSchedule`

적용 대상: 노드

중요한 워크로드만 스케줄링할 수 있도록 컨트롤 플레인 노드에 적용시키는 테인트.

### node-role.kubernetes.io/master (사용 중단) {#node-role-kubernetes-io-master-taint}

적용 대상: Node

예시: `node-role.kubernetes.io/master:NoSchedule`

이전 버전에서 kubeadm이 컨트롤 플레인에 중요한 워크로드만 스케줄링하기 위해 적용했던 테인트.
[`node-role.kubernetes.io/control-plane`](#node-role-kubernetes-io-control-plane-taint)로 대체되었다.
kubeadm은 더 이상 해당 테인트를 설정하거나 사용하지 않는다.
